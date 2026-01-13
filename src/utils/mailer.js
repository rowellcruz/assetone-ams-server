import Brevo from "@getbrevo/brevo";

const senderName = "AssetONE";
const senderEmail = process.env.BREVO_EMAIL;
const clientUrl = process.env.VITE_URL;

// Initialize Brevo API client
const brevo = new Brevo.TransactionalEmailsApi();
brevo.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Generic send email function
async function sendEmail(to, subject, html) {
  return await brevo.sendTransacEmail({
    sender: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
}

// Send registration approval email with temporary password
export async function sendRegistrationApproval(email, firstName, temporaryPassword, assignedRole) {
  const html = `
    <h2>Registration Approved</h2>
    <p>Dear ${firstName},</p>
    <p>Your registration for <strong>AssetONE: DYCI's Web-app Asset Monitoring and Maintenance Tracker</strong> has been approved.</p>
    <p><strong>Assigned Role: ${assignedRole}</strong></p>
    <p><strong>Your temporary password is: ${temporaryPassword}</strong></p>
    <p>Please log in to the system using your email and this temporary password:</p>
    <p><a href="${clientUrl}" target="_blank">${clientUrl}</a></p>
    <p><strong>For security reasons, change your password after your first login.</strong></p>
    <br>
    <p>Best regards,<br>AssetONE Team</p>
    <p><em>This is an automated message. Please do not reply.</em></p>
  `;
  return sendEmail(email, "Registration Approved - AssetONE", html);
}

export async function sendUnitTransferMessage(email, firstName) {
  const html = `
    <h2>Unit Transferred</h2>
    <p>Dear ${firstName},</p>
    <p>A new asset unit has been issued to your department in <strong>AssetONE: DYCI's Web-app Asset Monitoring and Maintenance Tracker</strong>.</p>
    <p>Check your department assets here:</p>
    <p><a href="${clientUrl}/department-assets" target="_blank">${clientUrl}/department-assets</a></p>
    <br>
    <p>Best regards,<br>AssetONE Team</p>
    <p><em>This is an automated message. Please do not reply.</em></p>
  `;
  return sendEmail(email, "Asset Unit Transferred - AssetONE", html);
}

export async function sendRegistrationRejection(email, firstName) {
  const html = `
    <h2>Registration Not Approved</h2>
    <p>Dear ${firstName},</p>
    <p>Thank you for your interest in <strong>AssetONE: DYCI's Web-app Asset Monitoring and Maintenance Tracker</strong>.</p>
    <p>After review, we are unable to approve your registration request at this time.</p>
    <br>
    <p>Best regards,<br>AssetONE Team</p>
    <p><em>This is an automated message. Please do not reply.</em></p>
  `;
  return sendEmail(email, "Registration Not Approved - AssetONE", html);
}

export async function sendNewRegistrationNotification(email, fullName) {
  const requestLink = `${clientUrl}/account-requests`;
  const html = `
    <h2>New Registration Request</h2>
    <p>A new user has requested registration in <strong>AssetONE: DYCI's Web-app Asset Monitoring and Maintenance Tracker</strong>:</p>
    <ul>
      <li><strong>Name:</strong> ${fullName}</li>
      <li><strong>Email:</strong> ${email}</li>
    </ul>
    <p>Please review and approve/reject this registration in the admin panel:</p>
    <p><a href="${requestLink}" target="_blank">${requestLink}</a></p>
    <p><em>This is an automated message. Please do not reply.</em></p>
  `;
  return sendEmail(process.env.ADMIN_EMAIL, "New Registration Request - AssetONE", html);
}

export async function sendResolveMessage(email, fullName, issueTitle) {
  const html = `
    <h2>Issue Resolved</h2>
    <p>Hi ${fullName},</p>
    <p>The issue you reported regarding <strong>"${issueTitle}"</strong> in <strong>AssetONE: DYCI's Web-app Asset Monitoring and Maintenance Tracker</strong> has been resolved.</p>
    <p>If you have further concerns or the issue persists, please contact the support team via the system.</p>
    <p>Thank you for using AssetONE.</p>
    <br>
    <p><em>This is an automated message. Please do not reply.</em></p>
  `;
  return sendEmail(email, "Issue Resolved - AssetONE", html);
}

export async function sendResetConfirmation(email, rawToken) {
  const resetLink = `${clientUrl}/reset-password?token=${rawToken}`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password for <strong>AssetONE: DYCI's Web-app Asset Monitoring and Maintenance Tracker</strong>.</p>
    <p>Click the link below to reset your password (this link will expire in 10 minutes):</p>
    <p><a href="${resetLink}" target="_blank">Reset Your Password</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <br>
    <p><strong>Note:</strong> For security reasons, this link can only be used once.</p>
    <br>
    <p>Best regards,<br>AssetONE Team</p>
    <p><em>This is an automated message. Please do not reply.</em></p>
  `;
  return sendEmail(email, "Password Reset Request - AssetONE", html);
}

