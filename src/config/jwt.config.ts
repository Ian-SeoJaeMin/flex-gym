export const jwtConfig = {
    accessSecret: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_1234',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_1234',
    user: {
        accessTokenExpiresIn: 300, // dev: 5m
        refreshTokenExpireIn: 86400
    },
    admin: {
        accessTokenExpiresIn: 300, // dev: 5m
        refreshTokenExpireIn: 86400
    }
};
