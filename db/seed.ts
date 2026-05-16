import { getDb } from "../api/queries/connection";
import { users, branches, menuItems } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed branches
  const branchData = [
    {
      name: "Red Hall",
      openingHours: "8:00 AM - 4:00 PM",
      workDays: "Sun - Thu",
      icon: "Building2",
      color: "#E86060",
      status: "open" as const,
    },
    {
      name: "Blue Hall",
      openingHours: "8:00 AM - 4:00 PM",
      workDays: "Sun - Thu",
      icon: "School",
      color: "#4DA8DA",
      status: "open" as const,
    },
    {
      name: "Student Affairs",
      openingHours: "8:00 AM - 4:00 PM",
      workDays: "Sun - Thu",
      icon: "Users",
      color: "#4CAF7D",
      status: "open" as const,
    },
    {
      name: "Food Court",
      openingHours: "8:00 AM - 4:00 PM",
      workDays: "Sun - Thu",
      icon: "UtensilsCrossed",
      color: "#F0A030",
      status: "open" as const,
    },
  ];

  for (const branch of branchData) {
    await db.insert(branches).values(branch);
  }
  console.log("Seeded 4 branches");

  // Seed demo student
  const hashedPassword = await bcrypt.hash("password123", 10);
  await db.insert(users).values({
    name: "Demo Student",
    email: "student@unicafe.edu",
    password: hashedPassword,
    role: "student",
  });
  console.log("Seeded demo student");

  // Seed menu items for each branch
  const menuData = [
    // Red Hall
    {
      branchId: 1,
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, and cheese",
      category: "main_course" as const,
      priceEGP: "65.00",
      icon: "Beef",
      available: true,
      popular: true,
    },
    {
      branchId: 1,
      name: "Chicken Sandwich",
      description: "Grilled chicken breast with mayo and fresh veggies",
      category: "sandwiches" as const,
      priceEGP: "45.00",
      icon: "Sandwich",
      available: true,
      popular: true,
    },
    {
      branchId: 1,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing and croutons",
      category: "salads" as const,
      priceEGP: "35.00",
      icon: "Salad",
      available: true,
      popular: false,
    },
    {
      branchId: 1,
      name: "Coca Cola",
      description: "Refreshing cold soft drink",
      category: "drinks" as const,
      priceEGP: "15.00",
      icon: "CupSoda",
      available: true,
      popular: true,
    },
    {
      branchId: 1,
      name: "Chocolate Cake",
      description: "Rich chocolate layered cake with frosting",
      category: "desserts" as const,
      priceEGP: "40.00",
      icon: "Cake",
      available: true,
      popular: false,
    },
    {
      branchId: 1,
      name: "French Fries",
      description: "Crispy golden fries with ketchup",
      category: "snacks" as const,
      priceEGP: "25.00",
      icon: "Fries",
      available: true,
      popular: true,
    },
    {
      branchId: 1,
      name: "Falafel Plate",
      description: "Traditional falafel with tahini sauce and pita",
      category: "main_course" as const,
      priceEGP: "40.00",
      icon: "ChefHat",
      available: true,
      popular: false,
    },
    {
      branchId: 1,
      name: "Orange Juice",
      description: "Freshly squeezed orange juice",
      category: "drinks" as const,
      priceEGP: "20.00",
      icon: "GlassWater",
      available: true,
      popular: false,
    },

    // Blue Hall
    {
      branchId: 2,
      name: "Grilled Chicken",
      description: "Marinated grilled chicken with rice and vegetables",
      category: "main_course" as const,
      priceEGP: "75.00",
      icon: "Drumstick",
      available: true,
      popular: true,
    },
    {
      branchId: 2,
      name: "Tuna Sandwich",
      description: "Tuna salad with lettuce on toasted bread",
      category: "sandwiches" as const,
      priceEGP: "40.00",
      icon: "Fish",
      available: true,
      popular: false,
    },
    {
      branchId: 2,
      name: "Greek Salad",
      description: "Mixed greens with feta cheese and olives",
      category: "salads" as const,
      priceEGP: "38.00",
      icon: "Salad",
      available: true,
      popular: true,
    },
    {
      branchId: 2,
      name: "Latte",
      description: "Creamy espresso with steamed milk",
      category: "coffee" as const,
      priceEGP: "30.00",
      icon: "Coffee",
      available: true,
      popular: true,
    },
    {
      branchId: 2,
      name: "Cheesecake",
      description: "New York style cheesecake with berry sauce",
      category: "desserts" as const,
      priceEGP: "45.00",
      icon: "CakeSlice",
      available: true,
      popular: true,
    },
    {
      branchId: 2,
      name: "Pancakes",
      description: "Fluffy pancakes with maple syrup",
      category: "breakfast" as const,
      priceEGP: "50.00",
      icon: "Cookie",
      available: true,
      popular: false,
    },
    {
      branchId: 2,
      name: "Espresso",
      description: "Strong Italian espresso",
      category: "coffee" as const,
      priceEGP: "20.00",
      icon: "Coffee",
      available: true,
      popular: false,
    },
    {
      branchId: 2,
      name: "Lemonade",
      description: "Fresh lemonade with mint",
      category: "drinks" as const,
      priceEGP: "18.00",
      icon: "GlassWater",
      available: true,
      popular: false,
    },

    // Student Affairs
    {
      branchId: 3,
      name: "Koshari",
      description: "Traditional Egyptian koshari with spicy sauce",
      category: "main_course" as const,
      priceEGP: "35.00",
      icon: "ChefHat",
      available: true,
      popular: true,
    },
    {
      branchId: 3,
      name: "Shawarma Wrap",
      description: "Chicken shawarma with garlic sauce in pita",
      category: "sandwiches" as const,
      priceEGP: "50.00",
      icon: "Sandwich",
      available: true,
      popular: true,
    },
    {
      branchId: 3,
      name: "Mixed Salad",
      description: "Fresh garden salad with seasonal vegetables",
      category: "salads" as const,
      priceEGP: "30.00",
      icon: "Salad",
      available: true,
      popular: false,
    },
    {
      branchId: 3,
      name: "Cappuccino",
      description: "Rich cappuccino with foam art",
      category: "coffee" as const,
      priceEGP: "28.00",
      icon: "Coffee",
      available: true,
      popular: true,
    },
    {
      branchId: 3,
      name: "Ice Cream",
      description: "Vanilla ice cream with chocolate sauce",
      category: "desserts" as const,
      priceEGP: "25.00",
      icon: "IceCreamCone",
      available: true,
      popular: false,
    },
    {
      branchId: 3,
      name: "Omelette",
      description: "Three-egg omelette with cheese and vegetables",
      category: "breakfast" as const,
      priceEGP: "35.00",
      icon: "Egg",
      available: true,
      popular: false,
    },
    {
      branchId: 3,
      name: "Tea",
      description: "Traditional Egyptian tea",
      category: "drinks" as const,
      priceEGP: "10.00",
      icon: "Coffee",
      available: true,
      popular: true,
    },
    {
      branchId: 3,
      name: "Spring Rolls",
      description: "Crispy vegetable spring rolls",
      category: "snacks" as const,
      priceEGP: "30.00",
      icon: "Cookie",
      available: true,
      popular: false,
    },

    // Food Court
    {
      branchId: 4,
      name: "Pizza Slice",
      description: "Cheesy pepperoni pizza slice",
      category: "main_course" as const,
      priceEGP: "40.00",
      icon: "Pizza",
      available: true,
      popular: true,
    },
    {
      branchId: 4,
      name: "Hot Dog",
      description: "Classic hot dog with mustard and ketchup",
      category: "sandwiches" as const,
      priceEGP: "35.00",
      icon: "Beef",
      available: true,
      popular: false,
    },
    {
      branchId: 4,
      name: "Fruit Salad",
      description: "Fresh seasonal fruits",
      category: "salads" as const,
      priceEGP: "30.00",
      icon: "Cherry",
      available: true,
      popular: false,
    },
    {
      branchId: 4,
      name: "Smoothie",
      description: "Mixed berry smoothie",
      category: "drinks" as const,
      priceEGP: "35.00",
      icon: "Milk",
      available: true,
      popular: true,
    },
    {
      branchId: 4,
      name: "Donut",
      description: "Glazed donut with sprinkles",
      category: "desserts" as const,
      priceEGP: "20.00",
      icon: "Donut",
      available: true,
      popular: false,
    },
    {
      branchId: 4,
      name: "Nachos",
      description: "Loaded nachos with cheese sauce",
      category: "snacks" as const,
      priceEGP: "40.00",
      icon: "Cookie",
      available: true,
      popular: true,
    },
    {
      branchId: 4,
      name: "Mocha",
      description: "Chocolate coffee blend",
      category: "coffee" as const,
      priceEGP: "32.00",
      icon: "Coffee",
      available: true,
      popular: false,
    },
    {
      branchId: 4,
      name: "Water Bottle",
      description: "500ml mineral water",
      category: "drinks" as const,
      priceEGP: "8.00",
      icon: "GlassWater",
      available: true,
      popular: true,
    },
  ];

  for (const item of menuData) {
    await db.insert(menuItems).values(item);
  }
  console.log(`Seeded ${menuData.length} menu items`);

  console.log("Seed complete!");
  process.exit(0);
}

seed();
