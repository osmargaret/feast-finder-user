import jollof from "@/assets/meal-jollof.jpg";
import egusi from "@/assets/meal-egusi.jpg";
import meatpie from "@/assets/meal-meatpie.jpg";
import suya from "@/assets/meal-suya.jpg";
import poundedyam from "@/assets/meal-poundedyam.jpg";
import pancakes from "@/assets/meal-pancakes.jpg";
import catfish from "@/assets/meal-catfish.jpg";
import grilledfish from "@/assets/meal-grilledfish.jpg";
import bread from "@/assets/meal-bread.jpg";

import cover1 from "@/assets/kitchen-cover-1.jpg";
import cover2 from "@/assets/kitchen-cover-2.jpg";
import cover3 from "@/assets/kitchen-cover-3.jpg";
import cover4 from "@/assets/kitchen-cover-4.jpg";

import chef1 from "@/assets/avatar-chef-1.jpg";
import chef2 from "@/assets/avatar-chef-2.jpg";
import chef3 from "@/assets/avatar-chef-3.jpg";
import chef4 from "@/assets/avatar-chef-4.jpg";

import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";

export type Meal = {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: string;
  blurb: string;
  vendorId: string;
  category: string;
  subcategory?: string;
  dietary?: string[];
};

/** Common Lagos delivery areas — used by vendor delivery settings */
export const LAGOS_AREAS = [
  "Ikeja", "Ikorodu", "Elepe", "Yaba", "Surulere", "Lekki", "Ajah",
  "Victoria Island", "Ikoyi", "Apapa", "Festac", "Ojo", "Mushin",
  "Maryland", "Magodo", "Gbagada", "Oshodi", "Agege", "Ojota",
];

export type Vendor = {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  followers: string;
  followerCount: number;
  rating: number;
  tagline: string;
  type: string;
  location?: string;
  priceRange?: "$" | "$$" | "$$$";
};

export const vendors: Vendor[] = [
  {
    id: "mama-t",
    name: "Mama T Kitchen",
    avatar: chef1,
    cover: cover1,
    followers: "1.2k",
    followerCount: 1240,
    rating: 4.7,
    tagline: "Swallow & soups",
    type: "Home Kitchen",
    location: "Lagos",
    priceRange: "$$",
  },
  {
    id: "oven-fresh",
    name: "Oven Fresh Bakery",
    avatar: chef2,
    cover: cover2,
    followers: "890",
    followerCount: 890,
    rating: 4.6,
    tagline: "Pastries & bread",
    type: "Bakery",
    location: "Abuja",
    priceRange: "$",
  },
  {
    id: "spice-palace",
    name: "Spice Palace",
    avatar: chef3,
    cover: cover4,
    followers: "2.1k",
    followerCount: 2100,
    rating: 4.8,
    tagline: "Rice & grills",
    type: "Restaurant",
    location: "Lagos",
    priceRange: "$$$",
  },
  {
    id: "suya-republic",
    name: "Suya Republic",
    avatar: chef4,
    cover: cover3,
    followers: "980",
    followerCount: 980,
    rating: 4.5,
    tagline: "Grills & skewers",
    type: "Street Food",
    location: "Port Harcourt",
    priceRange: "$$",
  },
  {
    id: "morning-glory",
    name: "Morning Glory",
    avatar: chef1,
    cover: cover2,
    followers: "640",
    followerCount: 640,
    rating: 4.4,
    tagline: "Breakfast specials",
    type: "Cafe",
    location: "Ibadan",
    priceRange: "$",
  },
  {
    id: "ocean-catch",
    name: "Ocean Catch",
    avatar: chef3,
    cover: cover3,
    followers: "720",
    followerCount: 720,
    rating: 4.6,
    tagline: "Seafood",
    type: "Restaurant",
    location: "Port Harcourt",
    priceRange: "$$$",
  },
  {
    id: "naija-swallow",
    name: "Naija Swallow",
    avatar: chef1,
    cover: cover1,
    followers: "1.5k",
    followerCount: 1500,
    rating: 4.7,
    tagline: "Pounded yam & soups",
    type: "Home Kitchen",
    location: "Lagos",
    priceRange: "$$",
  },
  {
    id: "sweet-tooth",
    name: "Sweet Tooth",
    avatar: chef2,
    cover: cover2,
    followers: "510",
    followerCount: 510,
    rating: 4.5,
    tagline: "Confectioneries",
    type: "Bakery",
    location: "Abuja",
    priceRange: "$$",
  },
  {
    id: "grill-house",
    name: "Grill House",
    avatar: chef4,
    cover: cover3,
    followers: "830",
    followerCount: 830,
    rating: 4.6,
    tagline: "BBQ & grills",
    type: "Restaurant",
    location: "Lagos",
    priceRange: "$$$",
  },
  {
    id: "jollof-junction",
    name: "Jollof Junction",
    avatar: chef3,
    cover: cover4,
    followers: "1.1k",
    followerCount: 1100,
    rating: 4.7,
    tagline: "Party jollof specialists",
    type: "Restaurant",
    location: "Lagos",
    priceRange: "$$",
  },
  {
    id: "bites-and-bakes",
    name: "Bites & Bakes",
    avatar: chef2,
    cover: cover2,
    followers: "420",
    followerCount: 420,
    rating: 4.4,
    tagline: "Snacks & small chops",
    type: "Bakery",
    location: "Abuja",
    priceRange: "$",
  },
  {
    id: "village-pot",
    name: "Village Pot",
    avatar: chef1,
    cover: cover1,
    followers: "760",
    followerCount: 760,
    rating: 4.6,
    tagline: "Home-style soups",
    type: "Home Kitchen",
    location: "Ibadan",
    priceRange: "$$",
  },
];

export const meals: Meal[] = [
  {
    id: "jollof",
    name: "Jollof Rice & Chicken",
    price: 3500,
    image: jollof,
    badge: "🔥 Featured",
    blurb: "Ready in 20–30 mins",
    vendorId: "mama-t",
    category: "Rice",
    dietary: ["Halal"],
  },
  {
    id: "egusi",
    name: "Egusi Soup & Fufu",
    price: 4200,
    image: egusi,
    badge: "⭐ Top rated",
    blurb: "Hot & freshly cooked",
    vendorId: "spice-palace",
    category: "Swallow",
    dietary: ["Halal"],
  },
  {
    id: "meatpie",
    name: "Meat Pie (4pcs)",
    price: 2200,
    image: meatpie,
    badge: "🥟 New",
    blurb: "Perfect for snacks",
    vendorId: "oven-fresh",
    category: "Pastries",
  },
  {
    id: "suya",
    name: "Suya Spicy Kebab",
    price: 3000,
    image: suya,
    badge: "🌶️ Spicy",
    blurb: "Ready now",
    vendorId: "suya-republic",
    category: "Grills",
    dietary: ["Spicy"],
  },
  {
    id: "poundedyam",
    name: "Pounded Yam & Egusi",
    price: 3800,
    image: poundedyam,
    badge: "🍲 Popular",
    blurb: "Chef's special",
    vendorId: "naija-swallow",
    category: "Swallow",
  },
  {
    id: "catfish",
    name: "Grilled Catfish",
    price: 5500,
    image: catfish,
    badge: "🐟 Seafood",
    blurb: "Hot & smoky",
    vendorId: "ocean-catch",
    category: "Seafood",
  },
  {
    id: "pancakes",
    name: "Pancakes & Berries",
    price: 2500,
    image: pancakes,
    badge: "🥞 Breakfast",
    blurb: "Fluffy & sweet",
    vendorId: "morning-glory",
    category: "Breakfast",
    dietary: ["Vegetarian"],
  },
  {
    id: "bread",
    name: "Fresh Bread & Butter",
    price: 1200,
    image: bread,
    badge: "🍞 Baked",
    blurb: "Out of the oven",
    vendorId: "oven-fresh",
    category: "Pastries",
    dietary: ["Vegetarian"],
  },
  {
    id: "grilledfish",
    name: "Whole Grilled Fish",
    price: 4500,
    image: grilledfish,
    badge: "🔥 Hot",
    blurb: "Smoky & herbed",
    vendorId: "ocean-catch",
    category: "Seafood",
  },
  {
    id: "jollof2",
    name: "Party Jollof Special",
    price: 4000,
    image: jollof,
    badge: "🎉 Trending",
    blurb: "Smoky party flavor",
    vendorId: "spice-palace",
    category: "Rice",
  },
  {
    id: "suya2",
    name: "Suya Platter",
    price: 5200,
    image: suya,
    badge: "🌶️ Spicy",
    blurb: "Serves two",
    vendorId: "suya-republic",
    category: "Grills",
    dietary: ["Spicy"],
  },
  {
    id: "egusi2",
    name: "Egusi & Pounded Yam",
    price: 4500,
    image: egusi,
    badge: "🍲 Popular",
    blurb: "Comfort food",
    vendorId: "naija-swallow",
    category: "Swallow",
  },
  { id: "jollof3", name: "Smoky Jollof Combo", price: 4200, image: jollof, badge: "🍚 Popular", blurb: "With plantain & egg", vendorId: "jollof-junction", category: "Rice", dietary: ["Halal"] },
  { id: "jollof4", name: "Coconut Jollof", price: 3800, image: jollof, blurb: "Aromatic & rich", vendorId: "jollof-junction", category: "Rice" },
  { id: "meatpie2", name: "Chicken Pie (4pcs)", price: 2400, image: meatpie, blurb: "Buttery crust", vendorId: "bites-and-bakes", category: "Pastries" },
  { id: "smallchops", name: "Small Chops Box", price: 6500, image: meatpie, badge: "🎉 Party", blurb: "Puff puff, samosa, gizzard", vendorId: "bites-and-bakes", category: "Pastries" },
  { id: "okra", name: "Okra Soup & Eba", price: 3700, image: egusi, blurb: "Hearty Naija classic", vendorId: "village-pot", category: "Swallow" },
  { id: "ofada", name: "Ofada Rice & Ayamase", price: 4800, image: jollof, badge: "🌶️ Spicy", blurb: "Local rice, palm-oil stew", vendorId: "spice-palace", category: "Rice", dietary: ["Spicy"] },
  { id: "cake", name: "Chocolate Cake Slice", price: 1800, image: bread, badge: "🍰 Sweet", blurb: "Moist & fudgy", vendorId: "sweet-tooth", category: "Confectioneries", dietary: ["Vegetarian"] },
  { id: "akara", name: "Akara & Pap", price: 1500, image: pancakes, blurb: "Classic Naija breakfast", vendorId: "morning-glory", category: "Breakfast" },
  { id: "moimoi", name: "Moi Moi Trio", price: 2200, image: pancakes, blurb: "Steamed bean pudding", vendorId: "morning-glory", category: "Breakfast", dietary: ["Vegetarian"] },
  { id: "shrimp", name: "Garlic Butter Shrimp", price: 6200, image: catfish, badge: "🦐 New", blurb: "Buttery & herby", vendorId: "ocean-catch", category: "Seafood" },
  { id: "ribs", name: "Smoky BBQ Ribs", price: 7500, image: suya, badge: "🔥 Hot", blurb: "Slow-cooked tender ribs", vendorId: "grill-house", category: "Grills" },
  { id: "kebabs", name: "Mixed Kebab Skewers", price: 4900, image: suya, blurb: "Beef, chicken, veggie", vendorId: "grill-house", category: "Grills" },
  { id: "puffpuff", name: "Puff Puff (12pcs)", price: 1500, image: bread, blurb: "Fluffy fried dough", vendorId: "oven-fresh", category: "Pastries", dietary: ["Vegetarian"] },
  { id: "fufu", name: "Fufu & Ogbono", price: 3600, image: poundedyam, blurb: "Stretchy & rich", vendorId: "village-pot", category: "Swallow" },
  { id: "amala", name: "Amala & Ewedu", price: 3500, image: poundedyam, blurb: "Yoruba favourite", vendorId: "naija-swallow", category: "Swallow" },
  { id: "donut", name: "Glazed Donuts (4pcs)", price: 2000, image: bread, blurb: "Soft & sweet", vendorId: "sweet-tooth", category: "Confectioneries", dietary: ["Vegetarian"] },
];

export interface SubCategory {
  name: string;
  items: string[]; // meal names or generic item names
}

export interface Category {
  name: string;
  icon: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    name: "Rice",
    icon: "🍚",
    subcategories: [
      {
        name: "Jollof Rice",
        items: ["Jollof Rice & Chicken", "Party Jollof Special", "Fried Rice", "Ofada Rice"],
      },
      { name: "Plain Rice", items: ["White Rice & Stew", "Coconut Rice", "Tomato Rice"] },
    ],
  },
  {
    name: "Soups",
    icon: "🍲",
    subcategories: [
      {
        name: "Egusi",
        items: ["Egusi Soup & Fufu", "Egusi & Pounded Yam", "Egusi with Goat Meat"],
      },
      { name: "Banga", items: ["Banga Soup & Starch", "Banga with Pounded Yam"] },
      { name: "Ofe Nsala", items: ["Ofe Nsala with Yam", "White Soup with Fufu"] },
      { name: "Ogbono", items: ["Ogbono Soup & Fufu", "Ogbono with Assorted"] },
      { name: "Okra", items: ["Okra Soup & Eba", "Okra with Assorted Meat"] },
    ],
  },
  {
    name: "Swallow",
    icon: "🥣",
    subcategories: [
      { name: "Pounded Yam", items: ["Pounded Yam & Egusi", "Pounded Yam & Soup"] },
      { name: "Fufu", items: ["Fufu & Egusi", "Fufu & Soup"] },
      { name: "Eba", items: ["Eba & Egusi", "Eba & Okra"] },
      { name: "Semovita", items: ["Semovita & Soup"] },
    ],
  },
  {
    name: "Pastries",
    icon: "🥐",
    subcategories: [
      { name: "Meat Pies", items: ["Meat Pie (4pcs)", "Chicken Pie", "Fish Pie"] },
      { name: "Snacks", items: ["Puff Puff", "Doughnuts", "Spring Rolls"] },
      { name: "Bread", items: ["Fresh Bread & Butter", "Agege Bread", "Chocolate Bread"] },
    ],
  },
  {
    name: "Grills",
    icon: "🔥",
    subcategories: [
      { name: "Suya", items: ["Suya Spicy Kebab", "Suya Platter", "Chicken Suya"] },
      { name: "BBQ", items: ["Grilled Chicken", "Grilled Fish", "BBQ Ribs"] },
      { name: "Kebabs", items: ["Beef Kebabs", "Vegetable Kebabs"] },
    ],
  },
  {
    name: "Breakfast",
    icon: "🥞",
    subcategories: [
      { name: "Pancakes", items: ["Pancakes & Berries", "Fluffy Pancakes with Syrup"] },
      { name: "Full English", items: ["Bacon & Eggs", "Full Breakfast"] },
      { name: "African Breakfast", items: ["Akara & Pap", "Moi Moi"] },
    ],
  },
  {
    name: "Seafood",
    icon: "🐟",
    subcategories: [
      { name: "Grilled", items: ["Grilled Catfish", "Whole Grilled Fish", "Grilled Lobster"] },
      { name: "Stew", items: ["Fish Stew with Rice", "Bang Bang Soup"] },
      { name: "Fried", items: ["Fried Fish & Chips", "Reekado Fish"] },
    ],
  },
  {
    name: "Confectioneries",
    icon: "🧁",
    subcategories: [
      { name: "Cakes", items: ["Chocolate Cake", "Fruit Cake", "Cheesecake"] },
      { name: "Pastries", items: ["Meat Pie", "Puff Puff"] },
      { name: "Cookies", items: ["Chocolate Chip Cookies", "Biscuits"] },
    ],
  },
];

export const vendorById = (id: string) => vendors.find((v) => v.id === id);

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorAvatar: string;
};

export const posts: BlogPost[] = [
  {
    slug: "vendor-spotlight-mama-t",
    title: "Vendor Spotlight: Mama T's Family Recipes",
    excerpt: "How a small kitchen in Ikeja became one of the city's most loved spots.",
    category: "Vendor Spotlight",
    date: "Apr 12, 2026",
    readTime: "5 min",
    image: blog1,
    author: "Adaeze Okafor",
    authorAvatar: chef1,
  },
  {
    slug: "5-tips-perfect-jollof",
    title: "5 Tips for the Perfect Pot of Jollof Rice",
    excerpt: "Pro tricks straight from kitchens that have served thousands.",
    category: "Tips",
    date: "Apr 8, 2026",
    readTime: "4 min",
    image: blog2,
    author: "Tunde Bello",
    authorAvatar: chef2,
  },
  {
    slug: "menumenu-launches-abuja",
    title: "MenuMenu Launches in Abuja",
    excerpt: "We're live in Abuja — here's what changes for vendors and customers.",
    category: "Announcements",
    date: "Apr 1, 2026",
    readTime: "3 min",
    image: blog1,
    author: "MenuMenu Team",
    authorAvatar: chef3,
  },
  {
    slug: "street-food-culture",
    title: "The Beautiful Chaos of Lagos Street Food",
    excerpt: "From suya joints to amala spots — a love letter to street food.",
    category: "Vendor Spotlight",
    date: "Mar 28, 2026",
    readTime: "6 min",
    image: blog1,
    author: "Chioma N.",
    authorAvatar: chef4,
  },
  {
    slug: "weekend-meal-prep",
    title: "Weekend Meal Prep with Local Vendors",
    excerpt: "Stress-free weekday eating using the kitchens you already love.",
    category: "Tips",
    date: "Mar 22, 2026",
    readTime: "4 min",
    image: blog2,
    author: "Tunde Bello",
    authorAvatar: chef2,
  },
  {
    slug: "sustainable-packaging",
    title: "Our Move to Sustainable Packaging",
    excerpt: "Why we partnered with local vendors on greener packaging.",
    category: "Announcements",
    date: "Mar 15, 2026",
    readTime: "3 min",
    image: blog1,
    author: "MenuMenu Team",
    authorAvatar: chef1,
  },
  {
    slug: "soup-season",
    title: "Soup Season: Egusi, Ogbono & Beyond",
    excerpt: "A guide to Nigerian soups you should be ordering this season.",
    category: "Tips",
    date: "Mar 10, 2026",
    readTime: "5 min",
    image: blog2,
    author: "Adaeze Okafor",
    authorAvatar: chef1,
  },
  {
    slug: "vendor-onboarding",
    title: "How to Become a MenuMenu Vendor",
    excerpt: "Everything you need to start selling on the marketplace today.",
    category: "Announcements",
    date: "Mar 5, 2026",
    readTime: "4 min",
    image: blog1,
    author: "MenuMenu Team",
    authorAvatar: chef3,
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const formatPrice = (n: number) => `₦${n.toLocaleString()}`;
