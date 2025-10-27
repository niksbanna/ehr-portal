import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import * as fs from 'fs';

// SQLite in-memory database URL
const DATABASE_URL = 'file::memory:?cache=shared';

export class TestDatabaseHelper {
  private prisma: PrismaClient;
  private static instance: TestDatabaseHelper;

  private constructor() {
    // Set environment variable for SQLite in-memory database
    process.env.DATABASE_URL = DATABASE_URL;

    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }

  static getInstance(): TestDatabaseHelper {
    if (!TestDatabaseHelper.instance) {
      TestDatabaseHelper.instance = new TestDatabaseHelper();
    }
    return TestDatabaseHelper.instance;
  }

  async setupDatabase(): Promise<void> {
    try {
      // Create a temporary schema file for SQLite
      const schemaPath = join(__dirname, '../../prisma/schema.prisma');
      const tempSchemaPath = join(__dirname, '../../prisma/schema.test.prisma');

      // Read the original schema
      let schema = fs.readFileSync(schemaPath, 'utf-8');

      // Replace PostgreSQL with SQLite
      schema = schema.replace(
        /datasource db \{[^}]*\}/s,
        `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}`,
      );

      // Write temporary schema
      fs.writeFileSync(tempSchemaPath, schema);

      // Push schema to the in-memory database
      execSync(`npx prisma db push --schema=${tempSchemaPath} --skip-generate --accept-data-loss`, {
        cwd: join(__dirname, '../../'),
        env: { ...process.env, DATABASE_URL },
        stdio: 'pipe',
      });

      // Clean up temporary schema
      fs.unlinkSync(tempSchemaPath);
    } catch (error) {
      console.error('Failed to setup test database:', error);
      throw error;
    }
  }

  async cleanDatabase(): Promise<void> {
    // Get all table names
    const tablenames = await this.prisma.$queryRaw<
      Array<{ name: string }>
    >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations'`;

    // Delete all records from each table
    for (const { name } of tablenames) {
      try {
        await this.prisma.$executeRawUnsafe(`DELETE FROM "${name}"`);
      } catch (error) {
        console.error(`Error cleaning table ${name}:`, error);
      }
    }
  }

  async closeDatabase(): Promise<void> {
    await this.prisma.$disconnect();
  }

  getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}

export const getTestDb = () => TestDatabaseHelper.getInstance();
