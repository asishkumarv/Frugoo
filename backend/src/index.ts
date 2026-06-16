import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    const user = await prisma.user.create({
      data: { name, email, password, phone }
    });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Products Routes
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.update({
      where: { id },
      data: req.body
    });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Coupons Routes
app.get('/api/coupons', async (req, res) => {
  const coupons = await prisma.coupon.findMany();
  res.json(coupons);
});

app.post('/api/coupons', async (req, res) => {
  try {
    const coupon = await prisma.coupon.create({ data: req.body });
    res.json(coupon);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/coupons/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.coupon.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
});

// Hero Videos Routes
app.get('/api/hero-videos', async (req, res) => {
  const videos = await prisma.heroVideo.findMany();
  res.json(videos);
});

app.post('/api/hero-videos', async (req, res) => {
  try {
    const { slideIndex, saved, fileName } = req.body;
    const video = await prisma.heroVideo.upsert({
      where: { slideIndex },
      update: { saved, fileName },
      create: { slideIndex, saved, fileName }
    });
    res.json(video);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/hero-videos/:slideIndex', async (req, res) => {
  try {
    const slideIndex = parseInt(req.params.slideIndex);
    await prisma.heroVideo.delete({ where: { slideIndex } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
