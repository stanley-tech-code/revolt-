import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('Using USER:', process.env.SMTP_USER);
console.log('Using PASS:', process.env.SMTP_PASS ? '***' : 'MISSING');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // send to self to test
      subject: 'Test Email from Revolt',
      html: '<h1>It works!</h1><p>Your SMTP configuration is perfectly set up.</p>'
    });
    console.log('Email sent successfully!', info.messageId);
  } catch (err) {
    console.error('Failed to send test email:', err);
  }
}

run();
