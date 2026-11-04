export const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
export const SMTP_PORT = process.env.SMTP_PORT || 587;

export const SMTP_USERNAME = process.env.SMTP_USERNAME;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

export const SMTP_FROM = process.env.SMTP_FROM || SMTP_USERNAME;

export const SMTP_FROM_NAME =
  process.env.SMTP_FROM_NAME || "Divine Interior";

export const MAIL_TO = process.env.MAIL_TO;