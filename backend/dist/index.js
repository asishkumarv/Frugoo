"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
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
    }
    catch (err) {
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
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === 'admin@frugoo.com' && password === 'admin123') {
            return res.json({ success: true, user: { name: 'Frugoo Admin', email, role: 'Admin' } });
        }
        return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.get('/api/analytics', async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        // recentRevenue (last 7 days grouped by day name)
        const recentRevenueMap = { "Sun": 0, "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0 };
        const orderCountMap = { "Sun": 0, "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0 };
        orders.forEach(o => {
            const day = new Date(o.date).toLocaleDateString("en-US", { weekday: "short" });
            if (recentRevenueMap[day] !== undefined) {
                recentRevenueMap[day] += o.total;
                orderCountMap[day] += 1;
            }
        });
        const recentRevenue = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
            name: day,
            revenue: recentRevenueMap[day],
            orders: orderCountMap[day]
        }));
        const products = await prisma.product.findMany();
        // Calculate top products and category breakdown from actual orders
        const productSales = {};
        const categoryCount = {};
        orders.forEach(o => {
            let parsedItems = [];
            try {
                parsedItems = o.items || [];
            }
            catch (e) { }
            parsedItems.forEach(itemStr => {
                // e.g. "2x Fresh Orange" -> qty: 2, name: "Fresh Orange"
                const match = itemStr.match(/^(\d+)x\s+(.+)$/);
                if (match) {
                    const qty = parseInt(match[1]);
                    const name = match[2];
                    if (!productSales[name])
                        productSales[name] = { count: 0, revenue: 0 };
                    productSales[name].count += qty;
                    const product = products.find(p => p.name === name);
                    if (product) {
                        productSales[name].revenue += qty * product.price;
                        const cat = product.category || "Others";
                        categoryCount[cat] = (categoryCount[cat] || 0) + qty;
                    }
                }
            });
        });
        const topProducts = Object.entries(productSales)
            .map(([name, data]) => ({ name, sales: data.count, revenue: data.revenue }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 4);
        // Default categories if no sales
        const colors = ["hsl(35, 90%, 55%)", "hsl(0, 72%, 51%)", "hsl(145, 63%, 42%)", "hsl(200, 70%, 50%)", "hsl(280, 60%, 50%)"];
        const categoryData = Object.keys(categoryCount).length > 0
            ? Object.entries(categoryCount).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
            : [
                { name: "Citrus", value: 1, color: "hsl(35, 90%, 55%)" },
                { name: "Apples", value: 1, color: "hsl(0, 72%, 51%)" },
                { name: "Tropical", value: 1, color: "hsl(145, 63%, 42%)" }
            ];
        res.json({ totalOrders, totalRevenue, pendingOrders, recentRevenue, topProducts, categoryData });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, phone: true, createdAt: true }
        });
        const orders = await prisma.order.findMany();
        const usersWithStats = users.map(user => {
            const userOrders = orders.filter(o => o.phone === user.phone);
            const spent = userOrders.reduce((sum, o) => sum + o.total, 0);
            return {
                ...user,
                orders: userOrders.length,
                spent
            };
        });
        res.json(usersWithStats);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
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
    }
    catch (err) {
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.product.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Coupons Routes
app.get('/api/coupons', async (req, res) => {
    const coupons = await prisma.coupon.findMany();
    res.json(coupons);
});
app.get('/api/coupons/validate/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const coupon = await prisma.coupon.findUnique({ where: { code } });
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Invalid coupon code' });
        }
        if (coupon.status !== 'Active') {
            return res.status(400).json({ success: false, error: 'Coupon is not active' });
        }
        if (coupon.used >= coupon.maxUses) {
            return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });
        }
        res.json({ success: true, discount: coupon.discount });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.post('/api/coupons', async (req, res) => {
    try {
        const coupon = await prisma.coupon.create({ data: req.body });
        res.json(coupon);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/api/coupons/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.coupon.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Orders Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/orders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, order });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        // First, verify coupon if provided
        if (orderData.couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: orderData.couponCode } });
            if (coupon) {
                if (coupon.status !== 'Active' || coupon.used >= coupon.maxUses) {
                    return res.status(400).json({ success: false, error: 'Invalid or expired coupon' });
                }
                // Increment coupon usage
                await prisma.coupon.update({
                    where: { code: orderData.couponCode },
                    data: { used: coupon.used + 1 }
                });
            }
        }
        const newOrder = await prisma.order.create({
            data: {
                id: `ORD-${Date.now()}`,
                customer: orderData.customer,
                items: orderData.items,
                total: orderData.total,
                status: "Pending",
                date: new Date().toISOString(),
                address: orderData.address,
                phone: orderData.phone,
                payment: orderData.payment
            }
        });
        res.json({ success: true, order: newOrder });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json({ success: true, order });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// Messages Endpoints
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = await prisma.message.create({
            data: { name, email, message }
        });
        res.json({ success: true, message: newMessage });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.put('/api/messages/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const message = await prisma.message.update({
            where: { id: parseInt(req.params.id) },
            data: { status }
        });
        res.json({ success: true, message });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.delete('/api/messages/:id', async (req, res) => {
    try {
        await prisma.message.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/api/hero-videos/:slideIndex', async (req, res) => {
    try {
        const slideIndex = parseInt(req.params.slideIndex);
        await prisma.heroVideo.delete({ where: { slideIndex } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
