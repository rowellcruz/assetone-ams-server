import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add these timeout and connection options
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 30000,
  // Try alternative connection options
  requireTLS: true,
  tls: {
    rejectUnauthorized: false
  },
  // For Gmail specifically
  service: process.env.EMAIL_HOST?.includes('gmail') ? 'gmail' : undefined
});

// Enhanced verification with better error handling
transporter.verify(function (error, success) {
  if (error) {
    console.log("Error configuring email transporter:", error);
    console.log("Trying alternative configuration...");
    
    // You might want to try alternative ports here
  } else {
    console.log("Email transporter is ready to send messages");
  }
});

export async function sendRegistrationApproval(email, firstName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
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

    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error;
  }
}

export async function sendRegistrationRejection(email, firstName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
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

    await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email}`);
  } catch (error) {
    console.error("Error sending rejection email:", error);
    throw error;
  }
}

export async function sendNewRegistrationNotification(email, fullName, role) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
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

    await transporter.sendMail(mailOptions);
    console.log(`New registration notification sent to admin: ${adminEmail}`);
  } catch (error) {
    console.error("Error sending registration notification:", error);
    throw error;
  }
}

export { transporter };
