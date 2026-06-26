import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { dbAll, dbGet, dbRun } from '../db.js';
import { authMiddleware, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

router.post('/', (req, res) => {
  const { items, total, payment_method, shipping_address, phone, notes } = req.body;
  if (!items || !total || !payment_method) {
    return res.status(400).json({ error: 'Items, total, and payment method are required' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  let userId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch {}
  }

  const result = dbRun(
    `INSERT INTO orders (user_id, items, total, payment_method, shipping_address, phone, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, JSON.stringify(items), total, payment_method, shipping_address, phone, notes]
  );

  res.json({ id: result.lastInsertRowid, message: 'Order placed successfully' });
});

router.get('/', authMiddleware, (req, res) => {
  const orders = dbAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

export default router;
