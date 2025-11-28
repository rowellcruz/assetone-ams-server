import * as authService from "../services/authService.js";

export async function login(req, res) {
  const { email, password } = req.body;

  const { token, user } = await authService.login(email, password);
  res.json({
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
}

export async function register(req, res) {
  const { first_name, last_name, email, role } = req.body;

  await authService.registerPending({ first_name, last_name, email, role });
  res.status(200).json({
    message:
      "Registration submitted successfully! Please wait for administrator approval.",
  });
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  await authService.handlePasswordResetRequest(email);
  res.status(200).json({
    message:
      "If the email exists, a password reset link has been sent (link expires in 10 minutes).",
  });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  if (!token || !password)
    return res
      .status(400)
      .json({ message: "Token and new password are required." });

  await authService.handlePasswordResetConfirmation(token, password);
  res.status(200).json({ message: "Password has been updated." });
}

export async function changePassword(req, res) {
  const { id } = req.params;
  await authService.changePassword(id, req.body);
  res.status(200).json({ message: "Password has been updated." });
}
