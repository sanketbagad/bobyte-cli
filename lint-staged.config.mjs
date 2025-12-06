export default {
  // Client - Next.js files
  'client/**/*.{js,jsx,ts,tsx}': [
    'npm run lint --workspace=client -- --fix',
  ],
  
  // Server - TypeScript files
  'server/**/*.ts': [
    'npm run lint:fix --workspace=server',
  ],
};
