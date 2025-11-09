import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendRegistrationApproval(email, firstName) {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM, // Must be verified in SendGrid
      subject: "Registration Approved - Asset Management System",
      html: `
        <h2>Registration Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Your registration for the Asset Management System has been approved.</p>
        <p>You can now login to the system using your credentials.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    };

    await sgMail.send(msg);
    console.log(`Approval email sent to ${email}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error;
  }
}

// Update other functions similarly...
export async function sendRegistrationRejection(email, firstName) {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Registration Request - Asset Management System",
      html: `
        <h2>Registration Not Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for your interest in the Asset Management System.</p>
        <p>After review, we are unable to approve your registration request at this time.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    };

    await sgMail.send(msg);
    console.log(`Rejection email sent to ${email}`);
  } catch (error) {
    console.error("Error sending rejection email:", error);
    throw error;
  }
}

export async function sendNewRegistrationNotification(email, fullName, role) {
  try {
    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.EMAIL_FROM,
      subject: "New Registration Request - Asset Management System",
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

    await sgMail.send(msg);
    console.log(`New registration notification sent to admin: ${process.env.ADMIN_EMAIL}`);
  } catch (error) {
    console.error("Error sending registration notification:", error);
    throw error;
  }
}