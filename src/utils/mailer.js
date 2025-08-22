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
