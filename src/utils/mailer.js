const nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

// Configure transporter (should be done once and reused)
const createTransporter = () => {
  return nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.MAILTRAP_TOKEN || "<YOUR_API_TOKEN>",
    })
  );
};

const transporter = createTransporter();

// Email templates for better organization
const emailTemplates = {
  approval: (firstName) => `
    <h2>Registration Approved</h2>
    <p>Dear ${firstName},</p>
    <p>Your registration for the Asset Management System has been approved.</p>
    <p>You can now login to the system using your credentials.</p>
    <br>
    <p>Best regards,<br>Asset Management Team</p>
  `,
  
  rejection: (firstName) => `
    <h2>Registration Not Approved</h2>
    <p>Dear ${firstName},</p>
    <p>Thank you for your interest in the Asset Management System.</p>
    <p>After review, we are unable to approve your registration request at this time.</p>
    <br>
    <p>Best regards,<br>Asset Management Team</p>
  `,
  
  newRegistration: (fullName, email, role) => `
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

// Email functions
async function sendRegistrationApproval(email, firstName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "hello@demomailtrap.co",
      to: email,
      subject: 'Registration Approved - Asset Management System',
      html: emailTemplates.approval(firstName),
      category: 'Registration Approval'
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
}

async function sendRegistrationRejection(email, firstName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "hello@demomailtrap.co",
      to: email,
      subject: 'Registration Request - Asset Management System',
      html: emailTemplates.rejection(firstName),
      category: 'Registration Rejection'
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email}`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
}

async function sendNewRegistrationNotification(userEmail, fullName, role) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable is not set');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "hello@demomailtrap.co",
      to: adminEmail,
      subject: 'New Registration Request - Asset Management System',
      html: emailTemplates.newRegistration(fullName, userEmail, role),
      category: 'New Registration Notification'
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`New registration notification sent to admin: ${adminEmail}`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending registration notification:', error);
    throw error;
  }
}

// Test function (your original code)
async function testEmail() {
  const sender = {
    address: process.env.EMAIL_FROM || "hello@demomailtrap.co",
    name: "Mailtrap Test",
  };
  
  const recipients = ["rowellcruz145@gmail.com"];

  try {
    const result = await transporter.sendMail({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      text: "Congrats for sending test email with Mailtrap!",
      category: "Integration Test",
    });
    console.log('Test email sent:', result);
  } catch (error) {
    console.error('Test email failed:', error);
  }
}

// Export all functions
module.exports = {
  sendRegistrationApproval,
  sendRegistrationRejection,
  sendNewRegistrationNotification,
  testEmail
};