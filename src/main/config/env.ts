export const env = {
  facebookApi: {
    clientId: String(process.env.FB_CLIENT_ID),
    clientSecret: String(process.env.FB_CLIENT_SECRET),
    tokenIntegration: String(process.env.FB_TOKEN_INTEGRATION),
  },
  aws: {
    accessKey: String(process.env.AWS_ACCESS_KEY),
    secret: String(process.env.AWS_SECRET),
    bucket: String(process.env.AWS_BUCKET),
  },
  jwtSecret: String(process.env.JWT_SECRET),
  port: process.env.PORT ?? 3000,
};
