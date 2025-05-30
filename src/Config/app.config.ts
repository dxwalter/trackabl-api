import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export default () => ({
  aws: {
    ses_secret: process.env.AWS_SES_SECRET_KEY,
    ses_access: process.env.AWS_SES_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
    verified_email_sender: process.env.AWS_SES_VERIFIED_SENDER,
  },
  database: {},
  zeptoMail: {
    trackablDomain: process.env.TRACKABL_DOMAIN,
    trackablDevelopmentDomain: process.env.TRACKABL_DEV_DOMAIN,
    token: process.env.ZEPTOMAIL_EMAIL_KEY,
  },
  cloudinary: {
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
  security: {
    jwtConstant: process.env.JWT_CONSTANT,
    passwordSalt: process.env.PASSWORD_SALT,
    saltRounds: 10,
    adminSalRounds: 30,
  },
  environment: {
    env: process.env.NODE_ENV,
  },
  logging: {
    authKey: process.env.MOESIF_LOGGING_KEY,
  },
  ipStack: {
    key: process.env.IPSTACK_KEY,
  },
  paystack: {
    secret: process.env.PAYSTACK_SECRET,
  },
});
