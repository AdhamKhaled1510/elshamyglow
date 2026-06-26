import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbAll, dbGet, dbRun } from '../db.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = dbGet('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) return res.status(400).json({ error: 'Email already exists' });

  const hashed = bcrypt.hashSync(password, 10);
  const result = dbRun(
    'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashed, phone || null, address || null]
  );

  const token = jwt.sign({ id: result.lastInsertRowid, email, role: 'customer' }, JWT_SECRET);
  res.json({ token, user: { id: result.lastInsertRowid, name, email, role: 'customer' } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbGet('SELECT id, name, email, phone, address, role FROM users WHERE id = ?', [decoded.id]);
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
