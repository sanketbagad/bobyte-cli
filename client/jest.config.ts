import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Test file patterns
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
  
  // Module path aliases (match tsconfig paths)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Coverage configuration - exclude shadcn UI components
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    // Exclude shadcn UI components - they are third-party
    '!components/ui/**',
    // Exclude type definitions
    '!**/*.d.ts',
    // Exclude config files
    '!**/*.config.{ts,tsx,js,mjs}',
  ],
  coverageDirectory: 'coverage',
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  verbose: true,
};

export default createJestConfig(config);
