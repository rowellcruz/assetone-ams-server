import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // your Gmail App Password
  },
});

const senderName = "Asset Management System";
const senderEmail = process.env.EMAIL_USER;

// Simple connection test
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("Email service configured with Gmail");
    return true;
  } catch (error) {
    console.log("Error configuring email service:", error);
    return false;
  }
}

// Call verification on startup
verifyEmailConnection();

export async function sendRegistrationApproval(email, firstName) {
  try {
    const mailOptions = {
      from: `${senderName} <${senderEmail}>`,
      to: email,
      subject: "Registration Approved - Asset Management System",
      html: `
        <h2>Registration Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Your registration for the Asset Management System has been approved.</p>
        <p>You can now log in to the system using your credentials.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`, result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error;
  }
}

export async function sendRegistrationRejection(email, firstName) {
  try {
    const mailOptions = {
      from: `${senderName} <${senderEmail}>`,
      to: email,
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

    const result = await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email}`, result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending rejection email:", error);
    throw error;
  }
}

export async function sendNewRegistrationNotification(email, fullName, role) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL environment variable is not set");
    }

    const mailOptions = {
      from: `${senderName} <${senderEmail}>`,
      to: adminEmail,
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

    const result = await transporter.sendMail(mailOptions);
    console.log(
      `New registration notification sent to admin: ${adminEmail}`,
      result.messageId
    );
    return result;
  } catch (error) {
    console.error("Error sending registration notification:", error);
    throw error;
  }
}
