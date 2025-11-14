import nodemailer from "nodemailer";

const senderName = "Asset Management System";
const senderEmail = process.env.EMAIL_USER; // your Gmail address

// Configure Nodemailer Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // Gmail
    pass: process.env.EMAIL_PASS,       // Gmail App Password
  },
});

// Verify connection on startup
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("Email service configured with Gmail");
    return true;
  } catch (error) {
    console.error("Error configuring email service:", error.message);
    return false;
  }
}

verifyEmailConnection();

// Send registration approval email with temporary password
export async function sendRegistrationApproval(email, firstName, temporaryPassword) {
  try {
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: email,
      subject: "Registration Approved - Asset Management System",
      html: `
        <h2>Registration Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Your registration for the Asset Management System has been approved.</p>
        <p><strong>Your temporary password is: ${temporaryPassword}</strong></p>
        <p>Please log in to the system using your email and this temporary password.</p>
        <p><strong>For security reasons, we recommend that you change your password after your first login.</strong></p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`, info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending approval email:", error.message);
    throw error;
  }
}

// Send registration rejection email
export async function sendRegistrationRejection(email, firstName) {
  try {
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: email,
      subject: "Registration Not Approved - Asset Management System",
      html: `
        <h2>Registration Not Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for your interest in the Asset Management System.</p>
        <p>After review, we are unable to approve your registration request at this time.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email}`, info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending rejection email:", error.message);
    throw error;
  }
}

// Send new registration notification to admin
export async function sendNewRegistrationNotification(email, fullName, role) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error("ADMIN_EMAIL environment variable is not set");

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
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

    const info = await transporter.sendMail(mailOptions);
    console.log(`New registration notification sent to admin: ${adminEmail}`, info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending registration notification:", error.message);
    throw error;
  }
}