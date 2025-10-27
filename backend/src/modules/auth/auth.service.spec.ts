import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { TestDataFactory } from '../../../test/utils/test-data.factory';
import { UserRole } from '@prisma/client';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;
  let tokenBlacklistService: TokenBlacklistService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockTokenBlacklistService = {
    addToBlacklist: jest.fn(),
    isBlacklisted: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: TokenBlacklistService,
          useValue: mockTokenBlacklistService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    tokenBlacklistService = module.get<TokenBlacklistService>(TokenBlacklistService);

    // Setup default config mock returns
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        'jwt.refreshSecret': 'refresh-secret',
        'jwt.expiresIn': '1h',
        'jwt.refreshExpiresIn': '7d',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = {
        id: 'user-1',
        email,
        password: 'hashedPassword',
        name: 'Test User',
        role: UserRole.DOCTOR,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(result.password).toBeUndefined();
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: UserRole.DOCTOR,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user and tokens when credentials are valid', async () => {
      const loginDto = TestDataFactory.createLoginDto();
      const mockUser = {
        id: 'user-1',
        email: loginDto.email,
        name: 'Test User',
        role: UserRole.DOCTOR,
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: mockUser,
        token: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: '1h',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto = TestDataFactory.createLoginDto();

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const registerDto = TestDataFactory.createRegisterDto();
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: 'user-1',
        ...registerDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(result.password).toBeUndefined();
      expect(result.id).toBe('user-1');
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = {
        email: 'test@example.com',
        sub: 'user-1',
        role: UserRole.DOCTOR,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'refresh-secret',
      });
      expect(result).toEqual({
        token: 'new-access-token',
        expiresIn: '1h',
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      const userId = 'user-1';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: UserRole.DOCTOR,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith(userId);
      expect(result.password).toBeUndefined();
      expect(result.id).toBe(userId);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const userId = 'non-existent-user';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(userId)).rejects.toThrow(UnauthorizedException);
      await expect(service.getProfile(userId)).rejects.toThrow('User not found');
    });
  });

  describe('logout', () => {
    it('should add token to blacklist on logout', async () => {
      const token = 'valid-token';
      const decoded = {
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      };

      mockJwtService.decode.mockReturnValue(decoded);

      const result = await service.logout(token);

      expect(jwtService.decode).toHaveBeenCalledWith(token);
      expect(tokenBlacklistService.addToBlacklist).toHaveBeenCalledWith(
        token,
        decoded.exp * 1000,
      );
      expect(result).toEqual({ message: 'Logout successful' });
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const token = 'invalid-token';

      mockJwtService.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.logout(token)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('isTokenBlacklisted', () => {
    it('should return true if token is blacklisted', async () => {
      const token = 'blacklisted-token';
      mockTokenBlacklistService.isBlacklisted.mockResolvedValue(true);

      const result = await service.isTokenBlacklisted(token);

      expect(result).toBe(true);
      expect(tokenBlacklistService.isBlacklisted).toHaveBeenCalledWith(token);
    });

    it('should return false if token is not blacklisted', async () => {
      const token = 'valid-token';
      mockTokenBlacklistService.isBlacklisted.mockResolvedValue(false);

      const result = await service.isTokenBlacklisted(token);

      expect(result).toBe(false);
    });
  });
});
