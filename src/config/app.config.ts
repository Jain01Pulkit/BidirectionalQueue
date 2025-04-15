import { registerAs } from '@nestjs/config';

export default registerAs<any>('app', () => {
    return {
        projectName: process.env.PROJECT_NAME,
        logLevel: process.env.LOG_LEVEL,
        // allowedOrigin: process.env.ALLOWED_ORIGIN,
        port: Number(process.env.PORT),
        // appUrl: process.env.APP_URL,
        // thirdPartyApiTesting: process.env.THIRD_PARTY_API_TESTING === 'true',
        // jwtSecret: process.env.JWT_SECRET,
        // sessionExpiry: process.env.SESSION_EXPIRY,
        // sessionCount: Number(process.env.SESSION_COUNT)
    }
})