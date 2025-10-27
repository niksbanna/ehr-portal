import { Injectable } from '@nestjs/common';

/**
 * TokenBlacklistService handles revoked/blacklisted tokens
 * In production, this should use Redis or a database for distributed systems
 */
@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();
  private tokenExpiryMap: Map<string, number> = new Map();

  /**
   * Add a token to the blacklist
   * @param token - The token to blacklist
   * @param expiryTime - Unix timestamp when the token expires
   */
  addToBlacklist(token: string, expiryTime: number): void {
    this.blacklistedTokens.add(token);
    this.tokenExpiryMap.set(token, expiryTime);

    // Schedule cleanup after token expires
    const timeUntilExpiry = expiryTime - Date.now();
    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        this.blacklistedTokens.delete(token);
        this.tokenExpiryMap.delete(token);
      }, timeUntilExpiry);
    }
  }

  /**
   * Check if a token is blacklisted
   * @param token - The token to check
   * @returns true if token is blacklisted, false otherwise
   */
  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Clean up expired tokens from the blacklist
   */
  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, expiryTime] of this.tokenExpiryMap.entries()) {
      if (expiryTime < now) {
        this.blacklistedTokens.delete(token);
        this.tokenExpiryMap.delete(token);
      }
    }
  }
}
