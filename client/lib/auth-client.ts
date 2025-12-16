import { createAuthClient } from 'better-auth/react';
import { deviceAuthorizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
    baseURL: "/api/auth",
    plugins: [
        deviceAuthorizationClient(),
    ],
});