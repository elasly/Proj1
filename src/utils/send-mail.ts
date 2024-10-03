// 'use server';
// import nodemailer from 'nodemailer';

import { createTransport } from 'nodemailer';
import keys from '@/utils/strattrader-420308-6d269aa14aff.json'

type EmailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail({ from, to, subject, html }: EmailOptions) {
  const transporter = createTransport({
    host: process.env.SMTP_SERVER_HOST,
    port: parseInt(process.env.SMTP_SERVER_PORT ?? '465'),
    secureConnection: true,
    service: 'gmail',
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_SERVER_USERNAME,
      pass: process.env.SMTP_SERVER_PASSWORD,
      serviceClient: keys.client_id,
      privateKey: keys.private_key,
      accessUrl: keys.token_uri,

    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

