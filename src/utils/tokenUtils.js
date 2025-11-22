import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
      is_password_updated: user.is_password_updated,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}
