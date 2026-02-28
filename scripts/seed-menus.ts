import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  console.error(
    "   NEXT_PUBLIC_SUPABASE_URL:",
    supabaseUrl ? "✓ set" : "✗ missing",
  );
  console.error(
    "   NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    supabaseKey ? "✓ set" : "✗ missing",
  );
  console.error("\n💡 Make sure .env.local file exists in the project root");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MENU_ITEMS = [
  // BREAKFAST (7:00 AM – 10:00 AM DAILY)
  {
    id: "bf-001",
    categoryId: "breakfast",
    itemId: "bf-001",
    category: "Breakfast",
    name: "Toast Bread",
    description:
      "Toast bread and omelette served with choice of Tea/Coffee/Hot chocolate",
    price: 9000,
    available: true,
  },
  {
    id: "bf-002",
    categoryId: "breakfast",
    itemId: "bf-002",
    category: "Breakfast",
    name: "Full English Breakfast",
    description:
      "Bread Basket, Baked beans, Steamed carrots, potatoes, Grilled sausage, Eggs your way, choice of Oatmeal|Cornflakes|Custard and choice of Tea|Coffee|Hot Chocolate",
    price: 10500,
    available: true,
  },
  {
    id: "bf-003",
    categoryId: "breakfast",
    itemId: "bf-003",
    category: "Breakfast",
    name: "American Breakfast",
    description:
      "Pancakes, Potatoes served with Bacon or sausage, Eggs your way and choice of Tea|Coffee|Hot Chocolate",
    price: 10500,
    available: true,
  },
  {
    id: "bf-004",
    categoryId: "breakfast",
    itemId: "bf-004",
    category: "Breakfast",
    name: "Tubers N Sauces",
    description:
      "Boiled or fried Yam served with your choice of Egg Sauce/Fish Sauce/Vegetable Sauce",
    price: 8300,
    available: true,
  },
  {
    id: "bf-005",
    categoryId: "breakfast",
    itemId: "bf-005",
    category: "Breakfast",
    name: "Plantain n Vegetable Sauce",
    description:
      "Plantain how you like it [Boiled, fried or grilled] with Ziba vegetable sauce",
    price: 8300,
    available: true,
  },
  {
    id: "bf-006",
    categoryId: "breakfast",
    itemId: "bf-006",
    category: "Breakfast",
    name: "Naija Breakfast",
    description: "Akara & Pap",
    price: 8500,
    available: true,
  },
  {
    id: "bf-007",
    categoryId: "breakfast",
    itemId: "bf-007",
    category: "Breakfast",
    name: "Oat Bowl",
    description:
      "Served with boiled Eggs, Nuts, Coconut flakes, Honey and dates",
    price: 10000,
    available: true,
  },
  {
    id: "bf-008",
    categoryId: "breakfast",
    itemId: "bf-008",
    category: "Breakfast",
    name: "Yoghurt Bowl",
    description:
      "Greek Yoghurt served with granola, chia seeds, coconut flakes and fruit of choice",
    price: 10000,
    available: true,
  },
  {
    id: "bf-009",
    categoryId: "breakfast",
    itemId: "bf-009",
    category: "Breakfast",
    name: "French Toast",
    description: "Served with Egg, cinnamon powder, sausage and baked beans",
    price: 9000,
    available: true,
  },
  {
    id: "bf-010",
    categoryId: "breakfast",
    itemId: "bf-010",
    category: "Breakfast",
    name: "Yamarita Special",
    description: "Served with Vegetable or Fish sauce",
    price: 9000,
    available: true,
  },
  {
    id: "bf-011",
    categoryId: "breakfast",
    itemId: "bf-011",
    category: "Breakfast",
    name: "Potato Fiesta",
    description: "Grilled or Fried sweet Potato served with Egg or Fish sauce",
    price: 9300,
    available: true,
  },
  {
    id: "bf-012",
    categoryId: "breakfast",
    itemId: "bf-012",
    category: "Breakfast",
    name: "Plain Homemade Pancake",
    description: "Served with syrup, scrambled eggs and sausage",
    price: 7750,
    available: true,
  },
  {
    id: "bf-013",
    categoryId: "breakfast",
    itemId: "bf-013",
    category: "Breakfast",
    name: "Club Sandwich & Fries",
    description:
      "Eggs, Cheese, Tomato, Lettuce, Cucumber, Shredded Chicken, Bread served with fries",
    price: 10000,
    available: true,
  },
  {
    id: "bf-014",
    categoryId: "breakfast",
    itemId: "bf-014",
    category: "Breakfast",
    name: "Stir fry Noodles",
    description: "Served with veggies and choice of eggs",
    price: 8500,
    available: true,
  },

  // LUNCH/DINNER (LUNCH 12NOON-6PM, DINNER 7PM-10PM) - Abbreviated for space
  {
    id: "ld-001",
    categoryId: "lunch-dinner",
    itemId: "ld-001",
    category: "Lunch/Dinner",
    name: "Abula",
    description:
      "Gbegiri, Ewedu and Buka Stew served with Amala and choice of Ogufe|Assorted meat|beef|Dry fish",
    price: 11000,
    available: true,
  },
  {
    id: "ld-002",
    categoryId: "lunch-dinner",
    itemId: "ld-002",
    category: "Lunch/Dinner",
    name: "Egusi Soup",
    description:
      "Served with Eba, Semovita, Poundo Yam or Wheat and choice of protein",
    price: 11500,
    available: true,
  },
  {
    id: "ld-003",
    categoryId: "lunch-dinner",
    itemId: "ld-003",
    category: "Lunch/Dinner",
    name: "Ogbono Soup",
    description:
      "Served with Eba, Semovita, Poundo Yam or Wheat and choice of protein",
    price: 11500,
    available: true,
  },
  {
    id: "ld-004",
    categoryId: "lunch-dinner",
    itemId: "ld-004",
    category: "Lunch/Dinner",
    name: "Efo-riro Soup",
    description:
      "Served with Eba, Semovita, Poundo Yam or Wheat and choice of protein",
    price: 11500,
    available: true,
  },
  {
    id: "ld-005",
    categoryId: "lunch-dinner",
    itemId: "ld-005",
    category: "Lunch/Dinner",
    name: "Edikang Ikong",
    description:
      "Served with Eba, Semovita, Poundo Yam or Wheat and choice of protein",
    price: 11500,
    available: true,
  },
  {
    id: "ld-006",
    categoryId: "lunch-dinner",
    itemId: "ld-006",
    category: "Lunch/Dinner",
    name: "Afang Soup",
    description:
      "Served with Eba, Semovita, Poundo Yam or Wheat and choice of protein",
    price: 12500,
    available: true,
  },
  {
    id: "ld-007",
    categoryId: "lunch-dinner",
    itemId: "ld-007",
    category: "Lunch/Dinner",
    name: "Oha Soup",
    description:
      "Served with Eba, Semovita, Poundo Yam or Wheat and choice of protein",
    price: 12500,
    available: true,
  },
  {
    id: "ld-008",
    categoryId: "lunch-dinner",
    itemId: "ld-008",
    category: "Lunch/Dinner",
    name: "Bitterleaf Soup",
    description:
      "Served with Eba, Semovita, Poundo Yam or Wheat and choice of protein",
    price: 12500,
    available: true,
  },
  {
    id: "ld-009",
    categoryId: "lunch-dinner",
    itemId: "ld-009",
    category: "Lunch/Dinner",
    name: "Soup with Turkey or Snail",
    description:
      "Egusi/Afang/Ogbono/Oha/Bitterleaf/Edikang Ikong/Eforiro soup served with Eba or Wheat and turkey",
    price: 15000,
    available: true,
  },
  {
    id: "ld-010",
    categoryId: "lunch-dinner",
    itemId: "ld-010",
    category: "Lunch/Dinner",
    name: "Seafood Okro",
    description: "Served with Eba, Semovita, Poundo Yam or Wheat",
    price: 20000,
    available: true,
  },
  {
    id: "ld-011",
    categoryId: "lunch-dinner",
    itemId: "ld-011",
    category: "Lunch/Dinner",
    name: "Whole Fish",
    description:
      "Whole grilled fish served with Rice/Fries/Potato Wedges/Bole and Green Salad",
    price: 15000,
    available: true,
  },
  {
    id: "ld-012",
    categoryId: "lunch-dinner",
    itemId: "ld-012",
    category: "Lunch/Dinner",
    name: "Spicy Beans",
    description: "Served with Fried Plantain and Chicken/Beef/Fish",
    price: 10500,
    available: true,
  },
  {
    id: "ld-013",
    categoryId: "lunch-dinner",
    itemId: "ld-013",
    category: "Lunch/Dinner",
    name: "Chicken Cordon Bleu",
    description:
      "Chicken cutlets, Swiss Cheese, Steamed veggies, Potatoes and Cordon Bleu sauce",
    price: 13000,
    available: true,
  },
  {
    id: "ld-014",
    categoryId: "lunch-dinner",
    itemId: "ld-014",
    category: "Lunch/Dinner",
    name: "Singapore Noodles",
    description: "Served with veggies and Chicken fillet",
    price: 11000,
    available: true,
  },
  {
    id: "ld-015",
    categoryId: "lunch-dinner",
    itemId: "ld-015",
    category: "Lunch/Dinner",
    name: "Bolognese Pasta",
    description: "Mixed meat, Onions, Garlic, Tomatoes Sauce, Cheese",
    price: 12000,
    available: true,
  },
  {
    id: "ld-016",
    categoryId: "lunch-dinner",
    itemId: "ld-016",
    category: "Lunch/Dinner",
    name: "Chicken and Chips",
    description: "Served with steamed veggies and chilli sauce",
    price: 11500,
    available: true,
  },
  {
    id: "ld-017",
    categoryId: "lunch-dinner",
    itemId: "ld-017",
    category: "Lunch/Dinner",
    name: "Fish & Chips",
    description: "Fish fillet in batter served with tartar sauce and fries",
    price: 12000,
    available: true,
  },
  {
    id: "ld-018",
    categoryId: "lunch-dinner",
    itemId: "ld-018",
    category: "Lunch/Dinner",
    name: "Obe Ata Din Din Pepper Stew",
    description:
      "Served with White rice, choice of chicken/beef/fish and plantain/Coleslaw",
    price: 11500,
    available: true,
  },
  {
    id: "ld-019",
    categoryId: "lunch-dinner",
    itemId: "ld-019",
    category: "Lunch/Dinner",
    name: "White Rice",
    description:
      "Served with stew and Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw",
    price: 11500,
    available: true,
  },
  {
    id: "ld-020",
    categoryId: "lunch-dinner",
    itemId: "ld-020",
    category: "Lunch/Dinner",
    name: "Ofada Rice",
    description: "Served with assorted meat and boiled eggs",
    price: 11500,
    available: true,
  },
  {
    id: "ld-021",
    categoryId: "lunch-dinner",
    itemId: "ld-021",
    category: "Lunch/Dinner",
    name: "Ziba Jollof Rice",
    description:
      "Served with Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw",
    price: 11500,
    available: true,
  },
  {
    id: "ld-022",
    categoryId: "lunch-dinner",
    itemId: "ld-022",
    category: "Lunch/Dinner",
    name: "Coconut Rice",
    description:
      "Served with Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw",
    price: 11500,
    available: true,
  },
  {
    id: "ld-023",
    categoryId: "lunch-dinner",
    itemId: "ld-023",
    category: "Lunch/Dinner",
    name: "Gizdodo",
    description: "Served with rice of choice",
    price: 11500,
    available: true,
  },
  {
    id: "ld-024",
    categoryId: "lunch-dinner",
    itemId: "ld-024",
    category: "Lunch/Dinner",
    name: "Seafood Native Rice",
    description:
      "Smoky, flavourful native rice with prawns, calamari and smoked fish",
    price: 14500,
    available: true,
  },
  {
    id: "ld-025",
    categoryId: "lunch-dinner",
    itemId: "ld-025",
    category: "Lunch/Dinner",
    name: "Rice with Turkey",
    description: "White/Jollof/Coconut Rice served with Turkey",
    price: 15000,
    available: true,
  },
  {
    id: "ld-026",
    categoryId: "lunch-dinner",
    itemId: "ld-026",
    category: "Lunch/Dinner",
    name: "Asun Wrap",
    description:
      "Spicy and delicious Asun encased in flatbread and served with fries",
    price: 10500,
    available: true,
  },
  {
    id: "ld-027",
    categoryId: "lunch-dinner",
    itemId: "ld-027",
    category: "Lunch/Dinner",
    name: "Ziba Salad",
    description:
      "Lettuce, fresh tomatoes, carrots, eggs, cheddar, swiss cheese, honey, dijon mustard, olive oil",
    price: 10000,
    available: true,
  },
  {
    id: "ld-028",
    categoryId: "lunch-dinner",
    itemId: "ld-028",
    category: "Lunch/Dinner",
    name: "Pepper Soup Bowl",
    description:
      "Assorted/Goat Meat/Cow leg/Chicken Pepper Soup served with Boiled Yam Cubes",
    price: 10000,
    available: true,
  },
  {
    id: "ld-029",
    categoryId: "lunch-dinner",
    itemId: "ld-029",
    category: "Lunch/Dinner",
    name: "Braised Chicken",
    description:
      "Served with Rice, Buttery garlic green beans, lemon grazed carrots",
    price: 13500,
    available: true,
  },
  {
    id: "ld-030",
    categoryId: "lunch-dinner",
    itemId: "ld-030",
    category: "Lunch/Dinner",
    name: "Fish Curry",
    description: "Served with White rice and dried fruits/nuts",
    price: 12700,
    available: true,
  },
  {
    id: "ld-031",
    categoryId: "lunch-dinner",
    itemId: "ld-031",
    category: "Lunch/Dinner",
    name: "Beef Carbonate",
    description:
      "Served with Rice, choice of potatoes and veggies flavored with Beer",
    price: 12700,
    available: true,
  },
  {
    id: "ld-032",
    categoryId: "lunch-dinner",
    itemId: "ld-032",
    category: "Lunch/Dinner",
    name: "Chinese Corn Soup",
    description:
      "Chicken fillet, Sweetcorn, Egg, Cornflour served with Breadroll",
    price: 9000,
    available: true,
  },
  {
    id: "ld-033",
    categoryId: "lunch-dinner",
    itemId: "ld-033",
    category: "Lunch/Dinner",
    name: "French Onion Soup",
    description: "Served with garlic Bread",
    price: 8500,
    available: true,
  },
  {
    id: "ld-034",
    categoryId: "lunch-dinner",
    itemId: "ld-034",
    category: "Lunch/Dinner",
    name: "Cream of Tomato Soup",
    description: "Garnished with crouton. Served with breadroll",
    price: 8500,
    available: true,
  },
  {
    id: "ld-035",
    categoryId: "lunch-dinner",
    itemId: "ld-035",
    category: "Lunch/Dinner",
    name: "Stir Fry Spaghetti",
    description: "Served with choice of protein",
    price: 12000,
    available: true,
  },
  {
    id: "ld-036",
    categoryId: "lunch-dinner",
    itemId: "ld-036",
    category: "Lunch/Dinner",
    name: "Jollof Pasta",
    description:
      "Spaghetti cooked in rich, spicy jollof sauce with Chicken/Beef/Assorted meat/Fish",
    price: 12000,
    available: true,
  },
  {
    id: "ld-037",
    categoryId: "lunch-dinner",
    itemId: "ld-037",
    category: "Lunch/Dinner",
    name: "Seafood Pasta",
    description:
      "Spaghetti with Fish, Calamari, Shrimps, Onion, Garlic, Ginger, Cheese and Tomato Sauce",
    price: 15000,
    available: true,
  },
  {
    id: "ld-038",
    categoryId: "lunch-dinner",
    itemId: "ld-038",
    category: "Lunch/Dinner",
    name: "Wings",
    description:
      "Grilled Barbecue/Chilli/Honey Mustard Wings served with French Fries/Sweet Potato Wedges",
    price: 9750,
    available: true,
  },
  {
    id: "ld-039",
    categoryId: "lunch-dinner",
    itemId: "ld-039",
    category: "Lunch/Dinner",
    name: "Chicken Tacos",
    description:
      "Pulled chicken tortilla, bell pepper, avocado mousse, tomato, cheese, onion, sour cream with fries",
    price: 12500,
    available: true,
  },
  {
    id: "ld-040",
    categoryId: "lunch-dinner",
    itemId: "ld-040",
    category: "Lunch/Dinner",
    name: "Beef Tacos",
    description:
      "Beef tortilla, bell pepper, avocado mousse, tomato, cheese, onion, sour cream with fries",
    price: 14000,
    available: true,
  },
  {
    id: "ld-041",
    categoryId: "lunch-dinner",
    itemId: "ld-041",
    category: "Lunch/Dinner",
    name: "Caesar Salad",
    description: "Lettuce, tomatoes, cucumber, parmesan cheese, crisp croutons",
    price: 9000,
    available: true,
  },
  {
    id: "ld-042",
    categoryId: "lunch-dinner",
    itemId: "ld-042",
    category: "Lunch/Dinner",
    name: "Beachside Salad",
    description:
      "Cucumbers, Tomatoes, Bell Pepper, Onions, Olives, Feta Cheese, Olive oil",
    price: 9000,
    available: true,
  },
  {
    id: "ld-043",
    categoryId: "lunch-dinner",
    itemId: "ld-043",
    category: "Lunch/Dinner",
    name: "Fruit Salad",
    description:
      "Apples, mango (seasonal), grapes, oranges, pineapples, watermelon, lemon, honey",
    price: 10000,
    available: true,
  },
  {
    id: "ld-044",
    categoryId: "lunch-dinner",
    itemId: "ld-044",
    category: "Lunch/Dinner",
    name: "Summer Side Salad",
    description: "Mixed Fruits, Ice cream, Cookies",
    price: 10000,
    available: true,
  },
  {
    id: "ld-045",
    categoryId: "lunch-dinner",
    itemId: "ld-045",
    category: "Lunch/Dinner",
    name: "Pizza",
    description:
      "Choice of Margarita, Seafood, Barbecue Chicken or Goat Suya with Sauté Mixed Vegetables",
    price: 10000,
    available: true,
  },
  {
    id: "ld-046",
    categoryId: "lunch-dinner",
    itemId: "ld-046",
    category: "Lunch/Dinner",
    name: "Isi-Ewu",
    description:
      "Spicy, saucy goat head tossed in rich palm oil and native spices, topped with onions and Utazi leaves",
    price: 15000,
    available: true,
  },

  // KIDS MENU
  {
    id: "km-001",
    categoryId: "kids-menu",
    itemId: "km-001",
    category: "Kids Menu",
    name: "Chicken Lolipop",
    description:
      "Chicken wings in Lolipop shape, Egg, Flour, Crumbs, served with fries and ketchup",
    price: 7200,
    available: true,
  },
  {
    id: "km-002",
    categoryId: "kids-menu",
    itemId: "km-002",
    category: "Kids Menu",
    name: "Chicken Nugget",
    description:
      "Chicken fillet, Crumbs, Flour, Egg served with fries and ketchup",
    price: 8000,
    available: true,
  },
  {
    id: "km-003",
    categoryId: "kids-menu",
    itemId: "km-003",
    category: "Kids Menu",
    name: "Hotdog",
    description: "Served with fries and Ketchup",
    price: 7000,
    available: true,
  },
  {
    id: "km-004",
    categoryId: "kids-menu",
    itemId: "km-004",
    category: "Kids Menu",
    name: "Mini Burger",
    description:
      "Beef/Chicken patty, Cocktail sauce, Veggies, Cheese served with fries and ketchup",
    price: 8500,
    available: true,
  },
  {
    id: "km-005",
    categoryId: "kids-menu",
    itemId: "km-005",
    category: "Kids Menu",
    name: "Singapore Noodles",
    description: "Veggies, Chicken fillet, Garlic and Ginger, Turmeric, Oyster",
    price: 7000,
    available: true,
  },
  {
    id: "km-006",
    categoryId: "kids-menu",
    itemId: "km-006",
    category: "Kids Menu",
    name: "Stir-fry Noodles",
    description: "Served with veggies and choice of eggs",
    price: 4000,
    available: true,
  },
  {
    id: "km-007",
    categoryId: "kids-menu",
    itemId: "km-007",
    category: "Kids Menu",
    name: "Coconut Rice",
    description: "Served with fish strips",
    price: 7000,
    available: true,
  },

  // VEGETARIAN
  {
    id: "vg-001",
    categoryId: "vegetarian",
    itemId: "vg-001",
    category: "Vegetarian",
    name: "Vegetable Curry with Basmati Rice",
    description:
      "Mixed vegetables simmered in rich curry sauce, served with fluffy basmati rice",
    price: 12500,
    available: true,
  },
  {
    id: "vg-002",
    categoryId: "vegetarian",
    itemId: "vg-002",
    category: "Vegetarian",
    name: "Spaghetti with Vegetable Bolognese",
    description:
      "Spaghetti served with a hearty vegetable-packed Bolognese sauce",
    price: 9000,
    available: true,
  },
  {
    id: "vg-003",
    categoryId: "vegetarian",
    itemId: "vg-003",
    category: "Vegetarian",
    name: "Tomato and Zucchini Pasta",
    description:
      "Pasta tossed in fresh tomato sauce with zucchini, garlic and herbs",
    price: 8000,
    available: true,
  },
  {
    id: "vg-004",
    categoryId: "vegetarian",
    itemId: "vg-004",
    category: "Vegetarian",
    name: "Vegetarian Okro with Poundo",
    description: "Okra, bell peppers and mushroom with pounded yam",
    price: 12500,
    available: true,
  },
  {
    id: "vg-005",
    categoryId: "vegetarian",
    itemId: "vg-005",
    category: "Vegetarian",
    name: "Vegetarian Rice Plate",
    description:
      "Served with choice of Jollof Rice or Coconut Rice and Plantain/Green Salad",
    price: 7300,
    available: true,
  },
  {
    id: "vg-006",
    categoryId: "vegetarian",
    itemId: "vg-006",
    category: "Vegetarian",
    name: "Eggs Your Way",
    description:
      "Boiled/Sunny Side Up/Plain Omelet served with Jollof/Coconut Rice and Plantain/Green Salad",
    price: 9000,
    available: true,
  },
  {
    id: "vg-007",
    categoryId: "vegetarian",
    itemId: "vg-007",
    category: "Vegetarian",
    name: "Margarita Pizza",
    description: "Classic pizza with fresh tomato and herbs",
    price: 10000,
    available: true,
  },
  {
    id: "vg-008",
    categoryId: "vegetarian",
    itemId: "vg-008",
    category: "Vegetarian",
    name: "Mushroom and Scallion",
    description: "Fresh mushroom and scallion with rice or pasta",
    price: 6500,
    available: true,
  },
  {
    id: "vg-009",
    categoryId: "vegetarian",
    itemId: "vg-009",
    category: "Vegetarian",
    name: "Chilli Garlic Mushroom Sliders with Fries",
    description: "Mushroom sliders with chilli garlic sauce",
    price: 7800,
    available: true,
  },
  {
    id: "vg-010",
    categoryId: "vegetarian",
    itemId: "vg-010",
    category: "Vegetarian",
    name: "Stir-fried Noodles with Veggies",
    description: "Mixed vegetables stir-fried with noodles",
    price: 7300,
    available: true,
  },

  // JOLLY MENU
  {
    id: "jm-001",
    categoryId: "jolly-menu",
    itemId: "jm-001",
    category: "Jolly Menu",
    name: "Quick Bites",
    description:
      "Pepper Gizzard or Snail served with potato or Yam wedges and chili pepper sauce",
    price: 18000,
    available: true,
  },
  {
    id: "jm-002",
    categoryId: "jolly-menu",
    itemId: "jm-002",
    category: "Jolly Menu",
    name: "Beef Fiesta",
    description:
      "Tender, juicy beef chunks stir-fried in sauce, wrapped in soft flatbread and served with fries",
    price: 20000,
    available: true,
  },
  {
    id: "jm-003",
    categoryId: "jolly-menu",
    itemId: "jm-003",
    category: "Jolly Menu",
    name: "Grilled Jumbo Prawns",
    description: "Served with mashed potatoes/Fries/Rice and steamed veggies",
    price: 25000,
    available: true,
  },
  {
    id: "jm-004",
    categoryId: "jolly-menu",
    itemId: "jm-004",
    category: "Jolly Menu",
    name: "Grilled Lamb Chops",
    description: "Served with mashed potatoes/Fries/Rice and steamed veggies",
    price: 25000,
    available: true,
  },
  {
    id: "jm-005",
    categoryId: "jolly-menu",
    itemId: "jm-005",
    category: "Jolly Menu",
    name: "T-bone Steak",
    description: "Served with mashed potatoes/Fries/Rice and steamed veggies",
    price: 25000,
    available: true,
  },
  {
    id: "jm-006",
    categoryId: "jolly-menu",
    itemId: "jm-006",
    category: "Jolly Menu",
    name: "Assorted Box (Serves 3)",
    description:
      "Beef suya, Chicken in batter, Chicken Lolipop, Pepper Gizzard, Samosa, Spring rolls, Yam Chips with salad",
    price: 50000,
    available: true,
  },
  {
    id: "jm-007",
    categoryId: "jolly-menu",
    itemId: "jm-007",
    category: "Jolly Menu",
    name: "Seafood Box (Serves 3)",
    description:
      "Prawns, Calamari, Fish, Snail and Crab with Chili, Tartar sauce and Green salad",
    price: 60000,
    available: true,
  },

  // DAYPASS MENU
  {
    id: "dp-001",
    categoryId: "daypass-menu",
    itemId: "dp-001",
    category: "Daypass Menu",
    name: "Coconut Rice",
    description:
      "Served with Peppered Grilled Chicken/Beef/Fish and Plantain/Green Salad",
    price: 0,
    available: true,
  },
  {
    id: "dp-002",
    categoryId: "daypass-menu",
    itemId: "dp-002",
    category: "Daypass Menu",
    name: "Ziba Jollof Rice",
    description: "Served with Chicken/Grilled Fish/Beef and Plantain/Coleslaw",
    price: 0,
    available: true,
  },
  {
    id: "dp-003",
    categoryId: "daypass-menu",
    itemId: "dp-003",
    category: "Daypass Menu",
    name: "Obe Ata Din Din",
    description:
      "Pepper Stew served with White rice, protein of choice and plantain",
    price: 0,
    available: true,
  },
  {
    id: "dp-004",
    categoryId: "daypass-menu",
    itemId: "dp-004",
    category: "Daypass Menu",
    name: "Chicken Sharwama",
    description: "Served with French Fries/Yam Fries/Sweet Potato Fries",
    price: 0,
    available: true,
  },
  {
    id: "dp-005",
    categoryId: "daypass-menu",
    itemId: "dp-005",
    category: "Daypass Menu",
    name: "Soup with Varieties",
    description:
      "Egusi/Ogbono/Efo-riro with Eba, Semovita or Wheat and choice of protein",
    price: 0,
    available: true,
  },
  {
    id: "dp-006",
    categoryId: "daypass-menu",
    itemId: "dp-006",
    category: "Daypass Menu",
    name: "Abula",
    description: "Gbegiri, Ewedu and Buka Stew with Amala and choice of meat",
    price: 0,
    available: true,
  },
  {
    id: "dp-007",
    categoryId: "daypass-menu",
    itemId: "dp-007",
    category: "Daypass Menu",
    name: "Bolognese Pasta",
    description: "Mixed meat, Onions, Garlic, Tomatoes Sauce, Cheese",
    price: 0,
    available: true,
  },
  {
    id: "dp-008",
    categoryId: "daypass-menu",
    itemId: "dp-008",
    category: "Daypass Menu",
    name: "Noodles",
    description: "Served with veggies and choice of eggs",
    price: 0,
    available: true,
  },
  {
    id: "dp-009",
    categoryId: "daypass-menu",
    itemId: "dp-009",
    category: "Daypass Menu",
    name: "Fish & Chips",
    description: "Fish fillet in batter served with tartar sauce and fries",
    price: 0,
    available: true,
  },
  {
    id: "dp-010",
    categoryId: "daypass-menu",
    itemId: "dp-010",
    category: "Daypass Menu",
    name: "Wings",
    description:
      "Grilled Barbecue/Chilli/Honey Mustard Wings with French Fries",
    price: 0,
    available: true,
  },

  // SOFT DRINKS
  {
    id: "dr-001",
    categoryId: "soft-drinks",
    itemId: "dr-001",
    category: "Soft Drinks",
    name: "Coca Cola",
    description: "Cold carbonated soft drink",
    price: 1500,
    available: true,
  },
  {
    id: "dr-002",
    categoryId: "soft-drinks",
    itemId: "dr-002",
    category: "Soft Drinks",
    name: "Tonic Water",
    description: "Refreshing tonic water",
    price: 2000,
    available: true,
  },
  {
    id: "dr-003",
    categoryId: "soft-drinks",
    itemId: "dr-003",
    category: "Soft Drinks",
    name: "Soda Water",
    description: "Plain carbonated water",
    price: 1500,
    available: true,
  },
  {
    id: "dr-004",
    categoryId: "soft-drinks",
    itemId: "dr-004",
    category: "Soft Drinks",
    name: "Malt",
    description: "Non-alcoholic malt beverage",
    price: 2000,
    available: true,
  },
  {
    id: "dr-005",
    categoryId: "soft-drinks",
    itemId: "dr-005",
    category: "Soft Drinks",
    name: "Fayrouz",
    description: "Fruity non-alcoholic lager",
    price: 2000,
    available: true,
  },
  {
    id: "dr-006",
    categoryId: "soft-drinks",
    itemId: "dr-006",
    category: "Soft Drinks",
    name: "Yoghurt",
    description: "Creamy yoghurt drink",
    price: 9000,
    available: true,
  },
  {
    id: "dr-007",
    categoryId: "soft-drinks",
    itemId: "dr-007",
    category: "Soft Drinks",
    name: "Glass of Pack Juice",
    description: "Fresh fruit juice in glass",
    price: 2000,
    available: true,
  },
  {
    id: "dr-008",
    categoryId: "soft-drinks",
    itemId: "dr-008",
    category: "Soft Drinks",
    name: "Pitcher of Pack Juice",
    description: "Fresh fruit juice pitcher",
    price: 6000,
    available: true,
  },
  {
    id: "dr-009",
    categoryId: "soft-drinks",
    itemId: "dr-009",
    category: "Soft Drinks",
    name: "Glass of Cranberry Juice",
    description: "Fresh cranberry juice in glass",
    price: 7000,
    available: true,
  },
  {
    id: "dr-010",
    categoryId: "soft-drinks",
    itemId: "dr-010",
    category: "Soft Drinks",
    name: "Pack of Cranberry Juice",
    description: "Fresh cranberry juice pack",
    price: 15000,
    available: true,
  },
  {
    id: "dr-011",
    categoryId: "soft-drinks",
    itemId: "dr-011",
    category: "Soft Drinks",
    name: "Schweppes Mojito",
    description: "Mojito flavored soft drink",
    price: 2000,
    available: true,
  },

  // FRESH JUICE
  {
    id: "fj-001",
    categoryId: "fresh-juice",
    itemId: "fj-001",
    category: "Fresh Juice",
    name: "Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 6000,
    available: true,
  },
  {
    id: "fj-002",
    categoryId: "fresh-juice",
    itemId: "fj-002",
    category: "Fresh Juice",
    name: "Watermelon Juice",
    description: "Fresh watermelon juice",
    price: 6000,
    available: true,
  },
  {
    id: "fj-003",
    categoryId: "fresh-juice",
    itemId: "fj-003",
    category: "Fresh Juice",
    name: "Pineapple Juice",
    description: "Fresh pineapple juice",
    price: 6000,
    available: true,
  },
  {
    id: "fj-004",
    categoryId: "fresh-juice",
    itemId: "fj-004",
    category: "Fresh Juice",
    name: "Pineapple & Ginger Juice",
    description: "Fresh pineapple juice with ginger",
    price: 6500,
    available: true,
  },

  // HOT BEVERAGE
  {
    id: "hb-001",
    categoryId: "hot-beverage",
    itemId: "hb-001",
    category: "Hot Beverage",
    name: "Black Coffee",
    description: "Rich black coffee",
    price: 2500,
    available: true,
  },
  {
    id: "hb-002",
    categoryId: "hot-beverage",
    itemId: "hb-002",
    category: "Hot Beverage",
    name: "Tea/Hot Chocolate",
    description: "Hot tea or chocolate beverage",
    price: 2500,
    available: true,
  },
  {
    id: "hb-003",
    categoryId: "hot-beverage",
    itemId: "hb-003",
    category: "Hot Beverage",
    name: "Espresso/Latte Coffee",
    description: "Quality espresso or latte",
    price: 3000,
    available: true,
  },
  {
    id: "hb-004",
    categoryId: "hot-beverage",
    itemId: "hb-004",
    category: "Hot Beverage",
    name: "Cappuccino/Americano",
    description: "Italian cappuccino or americano",
    price: 3000,
    available: true,
  },

  // MILKSHAKES
  {
    id: "ms-001",
    categoryId: "milkshakes",
    itemId: "ms-001",
    category: "Milkshakes",
    name: "Vanilla Milkshake",
    description: "Creamy vanilla milkshake",
    price: 10000,
    available: true,
  },
  {
    id: "ms-002",
    categoryId: "milkshakes",
    itemId: "ms-002",
    category: "Milkshakes",
    name: "Strawberry Milkshake",
    description: "Fresh strawberry milkshake",
    price: 10000,
    available: true,
  },
  {
    id: "ms-003",
    categoryId: "milkshakes",
    itemId: "ms-003",
    category: "Milkshakes",
    name: "Chocolate Milkshake",
    description: "Rich chocolate milkshake",
    price: 10000,
    available: true,
  },

  // MOCKTAILS
  {
    id: "mc-001",
    categoryId: "mocktails",
    itemId: "mc-001",
    category: "Mocktails",
    name: "Chapman",
    description: "Traditional mixed fruit mocktail",
    price: 8700,
    available: true,
  },
  {
    id: "mc-002",
    categoryId: "mocktails",
    itemId: "mc-002",
    category: "Mocktails",
    name: "Fruit Punch",
    description: "Tropical fruit punch",
    price: 9000,
    available: true,
  },
  {
    id: "mc-003",
    categoryId: "mocktails",
    itemId: "mc-003",
    category: "Mocktails",
    name: "Virgin Colada",
    description: "Coconut and pineapple mocktail",
    price: 9500,
    available: true,
  },
  {
    id: "mc-004",
    categoryId: "mocktails",
    itemId: "mc-004",
    category: "Mocktails",
    name: "Virgin Sunrise",
    description: "Sunrise inspired non-alcoholic drink",
    price: 9700,
    available: true,
  },
  {
    id: "mc-005",
    categoryId: "mocktails",
    itemId: "mc-005",
    category: "Mocktails",
    name: "Virgin Mojito",
    description: "Refreshing mint mocktail",
    price: 9000,
    available: true,
  },
];

async function seedMenus() {
  console.log("🌱 Starting menu seeding...");

  try {
    // Check if menus already exist
    const { data: existingMenus, error: checkError } = await supabase
      .from("menus")
      .select("id")
      .limit(1);

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error(`Failed to check existing menus: ${checkError.message}`);
    }

    // If menus exist, ask for confirmation (skip in automated environments)
    if (existingMenus && existingMenus.length > 0) {
      console.warn(
        "⚠️  Menu table already contains data. Continuing will insert duplicate items.",
      );
      console.warn(
        "💡 Running with ON CONFLICT (id) DO UPDATE to prevent duplicates.",
      );
    }

    // Split into batches of 50 for better performance
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < MENU_ITEMS.length; i += batchSize) {
      const batch = MENU_ITEMS.slice(i, i + batchSize);

      const { error: insertError, data } = await supabase
        .from("menus")
        .insert(batch)
        .select();

      if (insertError) {
        console.error(
          `❌ Error inserting batch ${i / batchSize + 1}:`,
          insertError,
        );
        throw insertError;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted ${insertedCount}/${MENU_ITEMS.length} items...`);
    }

    console.log(`\n🎉 Successfully seeded ${insertedCount} menu items!`);

    // Verify counts by category
    const { data: categories, error: catError } = await supabase
      .from("menus")
      .select("category")
      .eq("available", true);

    if (!catError && categories) {
      const uniqueCategories = [
        ...new Set(categories.map((m: any) => m.category)),
      ];
      console.log(`\n📊 Menu categories seeded: ${uniqueCategories.length}`);
      uniqueCategories.forEach((cat) => {
        const count = categories.filter((m: any) => m.category === cat).length;
        console.log(`   • ${cat}: ${count} items`);
      });
    }
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

// Run the seeder
seedMenus().then(() => {
  console.log("\n✨ Menu seeding completed!");
  process.exit(0);
});
