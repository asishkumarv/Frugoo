import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});

  const products = [
    {
      name: "Fresh Oranges",
      price: 399,
      unit: "kg",
      image: "/assets/orangePowder.png",
      description: "Juicy and sweet fresh oranges, handpicked from premium orchards. Rich in Vitamin C and packed with natural goodness. Perfect for fresh juice or as a healthy snack.",
      inStock: true,
      tag: "Popular",
      category: "citrus",
      stock: 120,
      status: "Active"
    },
    {
      name: "Crisp Apples",
      price: 319,
      unit: "kg",
      image: "/assets/guavaPowder.png",
      description: "Crunchy, sweet, and perfectly crisp apples. Freshly harvested and carefully selected for the best quality. Great for eating fresh, baking, or making delicious apple pie.",
      inStock: true,
      tag: "Best Seller",
      category: "apples",
      stock: 85,
      status: "Active"
    },
    {
      name: "Organic Bananas",
      price: 199,
      unit: "dozen",
      image: "/assets/dryDatePowder.png",
      description: "100% organic bananas, naturally ripened to perfection. High in potassium and fiber. Ideal for smoothies, breakfast bowls, or as a quick energy boost.",
      inStock: true,
      category: "tropical",
      stock: 300,
      status: "Active"
    },
    {
      name: "Sweet Strawberries",
      price: 479,
      unit: "box",
      image: "/assets/coconutPowder.png",
      description: "Premium sweet strawberries, freshly picked and bursting with flavor. Perfect for desserts, salads, or enjoying on their own. Rich in antioxidants and vitamin C.",
      inStock: true,
      tag: "New",
      category: "berries",
      stock: 50,
      status: "Active"
    },
    {
      name: "Red Grapes",
      price: 359,
      unit: "kg",
      image: "/assets/jaggeryPowder.png",
      description: "Seedless red grapes that are sweet and juicy. Perfect for snacking, adding to fruit salads, or making fresh grape juice. Loaded with natural antioxidants.",
      inStock: true,
      category: "berries",
      stock: 200,
      status: "Active"
    },
    {
      name: "Fresh Watermelon",
      price: 559,
      unit: "piece",
      image: "/assets/garlicPowder.png",
      description: "Large, refreshing watermelon perfect for hot summer days. Sweet and hydrating with minimal seeds. Great for parties, picnics, or healthy family snacks.",
      inStock: false,
      category: "tropical",
      stock: 0,
      status: "Out of Stock"
    },
    {
      name: "Ripe Mangoes",
      price: 279,
      unit: "piece",
      image: "/assets/orangePowder.png",
      description: "Deliciously sweet and aromatic mangoes, the king of fruits. Perfectly ripened for maximum flavor. Excellent for eating fresh, making smoothies, or adding to desserts.",
      inStock: true,
      category: "tropical",
      stock: 150,
      status: "Active"
    },
    {
      name: "Golden Pineapple",
      price: 399,
      unit: "piece",
      image: "/assets/coconutPowder.png",
      description: "Sweet and tangy golden pineapple with tropical flavor. Rich in vitamins and bromelain. Perfect for grilling, smoothies, or enjoying fresh as a tropical treat.",
      inStock: true,
      tag: "Popular",
      category: "tropical",
      stock: 45,
      status: "Low Stock"
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  const coupons = [
    { code: "MANGO25", discount: 25, type: "percent", minOrder: 500, maxUses: 100, used: 45, status: "Active", expires: "2026-04-30" },
    { code: "FRESH100", discount: 100, type: "flat", minOrder: 800, maxUses: 50, used: 50, status: "Exhausted", expires: "2026-03-31" },
    { code: "NEWUSER", discount: 15, type: "percent", minOrder: 200, maxUses: 500, used: 230, status: "Active", expires: "2026-06-30" },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@frugoo.com",
      password: "demo123",
      phone: "1234567890"
    }
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
