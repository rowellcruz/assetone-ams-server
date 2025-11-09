import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sender = {
  email: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  name: "Asset Management System",
};

export async function verifyEmailConnection() {
  try {
    console.log('Email service configured with Resend');
    return true;
  } catch (error) {
    console.log('Error configuring email service:', error);
    return false;
  }
}

export async function sendRegistrationApproval(email, firstName) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [email],
      subject: 'Registration Approved - Asset Management System',
      html: `
        <h2>Registration Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Your registration for the Asset Management System has been approved.</p>
        <p>You can now login to the system using your credentials.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    });

    if (error) {
      throw error;
    }

    console.log(`Approval email sent to ${email}`);
    return data;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
}


export async function sendRegistrationRejection(email, firstName) {
  try {
    const mailOptions = {
      from: sender,
      to: email,
      subject: 'Registration Request - Asset Management System',
      html: `
        <h2>Registration Not Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for your interest in the Asset Management System.</p>
        <p>After review, we are unable to approve your registration request at this time.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
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
    
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable is not set');
    }

    const mailOptions = {
      from: sender,
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
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`New registration notification sent to admin: ${adminEmail}`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending registration notification:', error);
    throw error;
  }
}