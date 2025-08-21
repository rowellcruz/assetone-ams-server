const authService = require("../services/authService");

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { token, user } = await authService.login(email, password);
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).json({ error: err.message });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    await authService.handlePasswordResetRequest(email);
    res.status(200).json({ message: "If the email exists, a password reset link has been sent." });
  } catch (err) {
    console.error("Password reset request error:", err.message);
    res.status(500).json({ message: "If the email exists, a password reset link has been sent." });
  }
}


module.exports = { login, requestPasswordReset };
