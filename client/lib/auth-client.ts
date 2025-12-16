import { createAuthClient } from 'better-auth/react';
import { deviceAuthorizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' 
        ? undefined  // Let it use relative paths on client
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth`,
    plugins: [
        deviceAuthorizationClient(),
    ],
});