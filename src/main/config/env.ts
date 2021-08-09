export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    tokenIntegration: process.env.FB_TOKEN_INTEGRATION,
  },
  port: process.env.PORT ?? 3000,
};
