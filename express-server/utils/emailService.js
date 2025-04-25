import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    return await transporter.sendMail({
      from: `"Company HR" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email sending failed:', err);
    throw err;
  }
};

export const sendVisaReminderEmail = async (recipientEmail, visa) => {
  const name =
    visa.employeeId?.preferredName ||
    `${visa.employeeId?.firstName || ''} ${visa.employeeId?.lastName || ''}`.trim() ||
    'there';

  const subject = `Visa Document Reminder – Next Steps Required`;

  const emailHTML = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 24px;">
      <h2>Hello ${name},</h2>
      <p>
        This is a friendly reminder to continue your visa document process. Please upload your remaining documents through the employee portal.
      </p>
      <p>
        If you've already completed this step, no further action is needed.
      </p>
      <p>Thank you,<br/>HR Team</p>
    </div>
  `;

  return await sendEmail({
    to: recipientEmail,
    subject,
    html: emailHTML,
  });
};
