export const env = {
  facebookApi: {
    clientId: String(process.env.FB_CLIENT_ID),
    clientSecret: String(process.env.FB_CLIENT_SECRET),
    tokenIntegration: String(process.env.FB_TOKEN_INTEGRATION),
  },
  jwtSecret: String(process.env.JWT_SECRET),
  port: process.env.PORT ?? 3000,
};
