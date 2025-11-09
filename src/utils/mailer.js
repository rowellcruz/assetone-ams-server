import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify Resend connection
export async function verifyEmailConnection() {
  try {
    // Resend doesn't have a direct verify method, but we can test with a simple API call
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: 'test@example.com',
      subject: 'Connection Test',
      html: '<p>Testing email connection</p>',
    });

    if (error) {
      console.log('Error configuring email service:', error);
      return false;
    } else {
      console.log('Email service is ready to send messages');
      return true;
    }
  } catch (error) {
    console.log('Error configuring email service:', error);
    return false;
  }
}

// Call verification on startup
verifyEmailConnection();

export async function sendRegistrationApproval(email, firstName) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Asset Management <noreply@yourdomain.com>',
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
    });
    
    if (error) throw error;
    
    console.log(`Approval email sent to ${email}`, data?.id);
    return data;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
}

export async function sendRegistrationRejection(email, firstName) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Asset Management <noreply@yourdomain.com>',
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
    });
    
    if (error) throw error;
    
    console.log(`Rejection email sent to ${email}`, data?.id);
    return data;
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

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Asset Management <noreply@yourdomain.com>',
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
    });
    
    if (error) throw error;
    
    console.log(`New registration notification sent to admin: ${adminEmail}`, data?.id);
    return data;
  } catch (error) {
    console.error('Error sending registration notification:', error);
    throw error;
  }
}

// Batch email sending helper
export async function sendBatchEmails(emails, subject, htmlContent) {
  try {
    const { data, error } = await resend.batch.send(
      emails.map(email => ({
        from: process.env.EMAIL_FROM || 'Asset Management <noreply@yourdomain.com>',
        to: email,
        subject: subject,
        html: htmlContent
      }))
    );
    
    if (error) throw error;
    
    console.log(`Batch email sent to ${emails.length} recipients`);
    return data;
  } catch (error) {
    console.error('Error sending batch emails:', error);
    throw error;
  }
}