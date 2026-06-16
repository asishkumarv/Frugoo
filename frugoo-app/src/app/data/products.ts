import { Product } from "../context/CartContext";
import orangePowder from "figma:asset/9c806ce3a3b57df520835811601d6a31a4bf0fc1.png";
import garlicPowder from "figma:asset/4afa16e4eac1f84284325429973e8b431e396983.png";
import dryDatePowder from "figma:asset/dea19219ed3626005d9e9d2bfd5ab8d6592559df.png";
import coconutPowder from "figma:asset/cd0564ef7acc913897875229dc77bcc8d94a112d.png";
import guavaPowder from "figma:asset/6a482ad5cdfadfed148731220924bf464fdbbac7.png";
import jaggeryPowder from "figma:asset/86b9ea5d461fab603c90826600a3b0876f4c3840.png";

export const products: Product[] = [
  {
    id: 1,
    name: "Fresh Oranges",
    price: 399,
    unit: "kg",
    image: orangePowder,
    description: "Juicy and sweet fresh oranges, handpicked from premium orchards. Rich in Vitamin C and packed with natural goodness. Perfect for fresh juice or as a healthy snack.",
    inStock: true,
    tag: "Popular",
    category: "citrus"
  },
  {
    id: 2,
    name: "Crisp Apples",
    price: 319,
    unit: "kg",
    image: guavaPowder,
    description: "Crunchy, sweet, and perfectly crisp apples. Freshly harvested and carefully selected for the best quality. Great for eating fresh, baking, or making delicious apple pie.",
    inStock: true,
    tag: "Best Seller",
    category: "apples"
  },
  {
    id: 3,
    name: "Organic Bananas",
    price: 199,
    unit: "dozen",
    image: dryDatePowder,
    description: "100% organic bananas, naturally ripened to perfection. High in potassium and fiber. Ideal for smoothies, breakfast bowls, or as a quick energy boost.",
    inStock: true,
    category: "tropical"
  },
  {
    id: 4,
    name: "Sweet Strawberries",
    price: 479,
    unit: "box",
    image: coconutPowder,
    description: "Premium sweet strawberries, freshly picked and bursting with flavor. Perfect for desserts, salads, or enjoying on their own. Rich in antioxidants and vitamin C.",
    inStock: true,
    tag: "New",
    category: "berries"
  },
  {
    id: 5,
    name: "Red Grapes",
    price: 359,
    unit: "kg",
    image: jaggeryPowder,
    description: "Seedless red grapes that are sweet and juicy. Perfect for snacking, adding to fruit salads, or making fresh grape juice. Loaded with natural antioxidants.",
    inStock: true,
    category: "berries"
  },
  {
    id: 6,
    name: "Fresh Watermelon",
    price: 559,
    unit: "piece",
    image: garlicPowder,
    description: "Large, refreshing watermelon perfect for hot summer days. Sweet and hydrating with minimal seeds. Great for parties, picnics, or healthy family snacks.",
    inStock: false,
    category: "tropical"
  },
  {
    id: 7,
    name: "Ripe Mangoes",
    price: 279,
    unit: "piece",
    image: orangePowder,
    description: "Deliciously sweet and aromatic mangoes, the king of fruits. Perfectly ripened for maximum flavor. Excellent for eating fresh, making smoothies, or adding to desserts.",
    inStock: true,
    category: "tropical"
  },
  {
    id: 8,
    name: "Golden Pineapple",
    price: 399,
    unit: "piece",
    image: coconutPowder,
    description: "Sweet and tangy golden pineapple with tropical flavor. Rich in vitamins and bromelain. Perfect for grilling, smoothies, or enjoying fresh as a tropical treat.",
    inStock: true,
    tag: "Popular",
    category: "tropical"
  }
];