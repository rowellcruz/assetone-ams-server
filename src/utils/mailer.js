import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "cruzrowellt11@gmail.com",
    pass: "wdljwnrkppyjclqz",
  },
});

export async function sendTempPassword(toEmail, tempPassword) {
  await transporter.sendMail({
    from: '"AssetONE Support" <cruzrowellt11@gmail.com>',
    to: toEmail,
    subject: "Your Temporary Password",
    html: `<p>Your temporary password is: <strong>${tempPassword}</strong></p><p>Please change it after logging in.</p>`,
  });
}

export async function sendPasswordResetEmail(toEmail, link, expireMins) {
  const html = `
    <p>You (or someone who has access to this email) requested a password reset for your AssetONE account.</p>
    <p>Click the link below to confirm and set a new password. This link expires in ${expireMins} minutes.</p>
    <p><a href="${link}">Reset your password</a></p>
    <p>If you didn't request this, ignore this message.</p>
  `;

  await transporter.sendMail({
    from: '"AssetONE Support" <no-reply@yourdomain.com>',
    to: toEmail,
    subject: 'Reset your AssetONE password',
    html
  });
}


export async function sendResetConfirmation(toEmail, resetLink) {
  await transporter.sendMail({
    from: '"AssetONE Support" <no-reply@assetone.app>',
    to: toEmail,
    subject: "Confirm Password Reset Request",
    html: `
      <p>We received a request to reset your password for your AssetONE account.</p>
      <p>If you requested this, click the link below to set a new password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 10 minutes. If you didn’t request this, ignore this email.</p>
    `,
  });
}

