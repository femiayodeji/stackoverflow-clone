import nodemailer, { Transporter } from 'nodemailer';

let _transporter: Transporter | null = null;

export const transporter = {
  sendMail: async (options: Parameters<Transporter['sendMail']>[0]) => {
    // Skip in test environment
    if (process.env.NODE_ENV === 'test') {
      return Promise.resolve({ messageId: 'test' });
    }

    if (!_transporter) {
      _transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    return _transporter.sendMail(options);
  },
};