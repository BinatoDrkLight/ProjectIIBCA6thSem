import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: 'Email Verification OTP',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
};