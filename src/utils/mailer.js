import SibApiV3Sdk from "sib-api-v3-sdk";

const senderName = "Asset Management System";
const senderEmail = "assetone@brevo.io"; // can be any email you want as sender
console.log("Sendinblue API Key:", process.env.SENDINBLUE_API_KEY);

// Configure the Sendinblue client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Verify service on startup
export async function verifyEmailConnection() {
  try {
    console.log("Email service configured with Sendinblue");
    return true;
  } catch (error) {
    console.log("Error configuring email service:", error.message);
    return false;
  }
}

verifyEmailConnection();

export async function sendRegistrationApproval(email, firstName) {
  try {
    const sendSmtpEmail = {
      to: [{ email }],
      sender: { name: senderName, email: senderEmail },
      subject: "Registration Approved - Asset Management System",
      htmlContent: `
        <h2>Registration Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Your registration for the Asset Management System has been approved.</p>
        <p>You can now log in to the system using your credentials.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Approval email sent to ${email}`, result.messageId || result.id);
    return result;
  } catch (error) {
    console.error("Error sending approval email:", error.response?.body || error.message);
    throw error;
  }
}

export async function sendRegistrationRejection(email, firstName) {
  try {
    const sendSmtpEmail = {
      to: [{ email }],
      sender: { name: senderName, email: senderEmail },
      subject: "Registration Request - Asset Management System",
      htmlContent: `
        <h2>Registration Not Approved</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for your interest in the Asset Management System.</p>
        <p>After review, we are unable to approve your registration request at this time.</p>
        <br>
        <p>Best regards,<br>Asset Management Team</p>
      `,
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Rejection email sent to ${email}`, result.messageId || result.id);
    return result;
  } catch (error) {
    console.error("Error sending rejection email:", error.response?.body || error.message);
    throw error;
  }
}

export async function sendNewRegistrationNotification(email, fullName, role) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error("ADMIN_EMAIL environment variable is not set");

    const sendSmtpEmail = {
      to: [{ email: adminEmail }],
      sender: { name: senderName, email: senderEmail },
      subject: "New Registration Request - Asset Management System",
      htmlContent: `
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

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`New registration notification sent to admin: ${adminEmail}`, result.messageId || result.id);
    return result;
  } catch (error) {
    console.error("Error sending registration notification:", error.response?.body || error.message);
    throw error;
  }
}
