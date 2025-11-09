import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const senderName = "Asset Management System";
const senderEmail = "AssetONE <noreply@resend.dev>";

// Test connection on startup
export async function verifyEmailConnection() {
  try {
    const test = await resend.emails.send({
      from: senderEmail,
      to: process.env.ADMIN_EMAIL,
      subject: "Email Service Verification - AssetONE",
      html: "<p>Your email service is configured successfully.</p>",
    });
    console.log("Email service configured with Resend:", test.id);
    return true;
  } catch (error) {
    console.log("Error configuring email service:", error.message);
    return false;
  }
}

verifyEmailConnection();

export async function sendRegistrationApproval(email, firstName) {
  try {
    const result = await resend.emails.send({
      from: senderEmail,
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
    });
    console.log(`Approval email sent to ${email}`, result.id);
    return result;
  } catch (error) {
    console.error("Error sending approval email:", error.message);
    throw error;
  }
}

export async function sendRegistrationRejection(email, firstName) {
  try {
    const result = await resend.emails.send({
      from: senderEmail,
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
    });
    console.log(`Rejection email sent to ${email}`, result.id);
    return result;
  } catch (error) {
    console.error("Error sending rejection email:", error.message);
    throw error;
  }
}

export async function sendNewRegistrationNotification(email, fullName, role) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) throw new Error("ADMIN_EMAIL environment variable is not set");

    const result = await resend.emails.send({
      from: senderEmail,
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
    });
    console.log(`New registration notification sent to admin: ${adminEmail}`, result.id);
    return result;
  } catch (error) {
    console.error("Error sending registration notification:", error.message);
    throw error;
  }
}
