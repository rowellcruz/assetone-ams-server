import nodemailer from 'nodemailer';

// Mailtrap SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.MAILTRAP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Optional: Add error handling for transporter
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error configuring email transporter:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

export async function sendRegistrationApproval(email, firstName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: email,
      subject: 'Registration Approved - Asset Management System',
      html: `
        <h2>Registration Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Your registration for the Asset Management System has been approved.</p>
        <p>You can now login to the system using your credentials.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
}

export async function sendRegistrationRejection(email, firstName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: email,
      subject: 'Registration Request - Asset Management System',
      html: `
        <h2>Registration Not Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for your interest in the Asset Management System.</p>
        <p>After review, we are unable to approve your registration request at this time.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email}`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
}

export async function sendNewRegistrationNotification(email, fullName, role) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: adminEmail,
      subject: 'New Registration Request - Asset Management System',
      html: `
        <h2>New Registration Request</h2>
        <p>A new user has requested registration:</p>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Requested Role:</strong> ${role}</li>
        </ul>
        <p>Please review and approve/reject this registration in the admin panel.</p>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`New registration notification sent to admin: ${adminEmail}`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending registration notification:', error);
    throw error;
  }
}