const db = require('../db/database');

const login = (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Success login
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    }
  );
};

module.exports = { login };