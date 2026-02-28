import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";

const prisma = new PrismaClient();
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 12);

const menuData = [
  {
    name: "Breakfast",
    timing: "7:00 AM – 10:00 AM DAILY",
    note: "THIS À LA CARTE MENU IS AVAILABLE ON DAYS, BUFFET IS NOT OFFERED.",
    items: [
      {
        name: "Toast Bread",
        price: 9000,
        description:
          "Toast bread and omelette served with choice of Tea/Coffee/Hot chocolate",
      },
      {
        name: "Full English Breakfast",
        price: 10500,
        description:
          "Bread Basket, Baked beans, Steamed carrots, potatoes, Grilled sausage, Eggs your way, choice of Oatmeal | Cornflakes | Custard and choice of Tea | Coffee | Hot Chocolate",
      },
      {
        name: "American Breakfast",
        price: 10500,
        description:
          "Pancakes, Potatoes served with Bacon or sausage, Eggs your way and choice of Tea | Coffee | Hot Chocolate",
      },
      {
        name: "Tubers 'N' Sauces",
        price: 8300,
        description:
          "Boiled or fried Yam served with your choice of Egg Sauce/Fish Sauce/Vegetable Sauce",
      },
      {
        name: "Plantain n Vegetable Sauce",
        price: 8300,
        description:
          "Plantain how you like it [Boiled, fried or grilled] with Ziba vegetable sauce",
      },
      {
        name: "Naija Breakfast",
        price: 8500,
        description: "Akara & Pap",
      },
      {
        name: "Oat Bowl",
        price: 10000,
        description:
          "Served with boiled Eggs, Nuts, Coconut flakes, Honey and dates",
      },
      {
        name: "Yoghurt Bowl",
        price: 10000,
        description:
          "Greek Yoghurt served with granola, chia seeds, coconut flakes and fruit of choice",
      },
      {
        name: "French Toast",
        price: 9000,
        description:
          "Served with Egg, cinnamon powder, sausage and baked beans",
      },
      {
        name: "Yamarita Special",
        price: 9000,
        description: "Served with Vegetable or Fish sauce",
      },
      {
        name: "Potato Fiesta",
        price: 9300,
        description:
          "Grilled or Fried sweet Potato served with Egg or Fish sauce",
      },
      {
        name: "Plain Homemade Pancake",
        price: 7750,
        description: "Served with syrup, scrambled eggs and sausage",
      },
      {
        name: "Club Sandwich & Fries",
        price: 10000,
        description:
          "Eggs, Cheese, Tomato, Lettuce, Cucumber, Shredded Chicken, Bread served with fries",
      },
      {
        name: "Stir fry Noodles",
        price: 8500,
        description: "Served with veggies and choice of eggs",
      },
    ],
  },
  {
    name: "Lunch & Dinner",
    timing:
      "LUNCH: 12:00 NOON - 6:00 PM DAILY | DINNER: 7:00 PM - 10:00 PM DAILY",
    note: "Lunch is served À La Carte. Dinner is either a buffet or à la carte when the buffet isn't available. Our team will let you know the dining option for your stay at check-in",
    items: [
      {
        name: "Abula",
        price: 11000,
        description:
          "Gbegiri, Ewedu and Buka Stew served with Amala and a choice of Ogufe | Assorted meat | beef | Dry fish",
      },
      {
        name: "Egusi Soup",
        price: 11500,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken",
      },
      {
        name: "Ogbono Soup",
        price: 11500,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken",
      },
      {
        name: "Efo-riro Soup",
        price: 11500,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken",
      },
      {
        name: "Edikang Ikong",
        price: 11500,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken",
      },
      {
        name: "Afang Soup",
        price: 12500,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken",
      },
      {
        name: "Oha Soup",
        price: 12500,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken",
      },
      {
        name: "Bitterleaf Soup",
        price: 12500,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken",
      },
      {
        name: "Premium Soups (with Turkey or Snail)",
        price: 15000,
        description:
          "Egusi, Afang, Ogbono, Oha, Bitterleaf, Edikang Ikong or Eforiro soup served with Eba, Semovita, Poundo Yam, or Wheat and turkey",
      },
      {
        name: "Seafood Okro",
        price: 20000,
        description: "Served with Eba, Semovita, Poundo Yam or Wheat",
      },
      {
        name: "Spicy Beans",
        price: 10500,
        description: "Served with Fried Plantain and Chicken/Beef/Fish",
      },
      {
        name: "Obe Ata Din Din (Pepper Stew)",
        price: 11500,
        description:
          "Served with White rice, choice of chicken, beef or fish and plantain/Coleslaw",
      },
      {
        name: "Ofada Rice",
        price: 11500,
        description: "Served with assorted meat and boiled eggs",
      },
      {
        name: "Ziba Jollof Rice",
        price: 11500,
        description:
          "Served with Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw",
      },
      {
        name: "Coconut Rice",
        price: 11500,
        description:
          "Served with Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw",
      },
      {
        name: "White Rice",
        price: 11500,
        description:
          "Served with stew and Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw",
      },
      {
        name: "Gizdodo",
        price: 11500,
        description: "Served with rice of choice",
      },
      {
        name: "Seafood Native Rice",
        price: 14500,
        description:
          "Smoky, flavourful native rice with prawns, calamari, and smoked fish",
      },
      {
        name: "Premium Rice (with Turkey)",
        price: 15000,
        description: "White, Jollof or Coconut Rice served with Turkey",
      },
      {
        name: "Asun Wrap",
        price: 10500,
        description:
          "Spicy and delicious Asun encased in flatbread and served with fries",
      },
      {
        name: "Isi-Ewu",
        price: 15000,
        description:
          "Spicy, saucy goat head tossed in rich palm oil and native spices, topped with onions and Utazi leaves",
      },
      {
        name: "Whole Fish",
        price: 15000,
        description:
          "Whole grilled fish served with Rice/Fries/Potato Wedges/Bole and Green Salad",
      },
      {
        name: "Fish & Chips",
        price: 12000,
        description: "Fish fillet in batter served with tartar sauce and fries",
      },
      {
        name: "Fish Curry",
        price: 12700,
        description: "Served with White rice and dried fruits/nuts",
      },
      {
        name: "Grilled Jumbo Prawns",
        price: 25000,
        description:
          "Served with a side of mashed potatoes/Fries/Rice and steamed veggies",
      },
      {
        name: "Chicken Cordon Bleu",
        price: 13000,
        description:
          "Chicken cutlets, Swiss Cheese, Steamed veggies, Potatoes your way & Cordon Bleu sauce",
      },
      {
        name: "Singapore Noodles",
        price: 11000,
        description: "Served with veggies and Chicken fillet",
      },
      {
        name: "Bolognese Pasta",
        price: 12000,
        description: "Mixed meat, Onions, Garlic, Tomatoes Sauce, Cheese",
      },
      {
        name: "Chicken and Chips",
        price: 11500,
        description: "Served with steamed veggies and chilli sauce",
      },
      {
        name: "Stir fry Spaghetti",
        price: 12000,
        description: "Served with choice of protein",
      },
      {
        name: "Jollof Pasta",
        price: 12000,
        description:
          "Spaghetti cooked in rich, spicy jollof sauce and herbs served with Chicken/Beef/Assorted meat/Fish",
      },
      {
        name: "Seafood Pasta",
        price: 15000,
        description:
          "Spaghetti in Fish, Calamari, Shrimps, Onion Garlic, Ginger, Cheese, Tomatoes/Creamy Sauce",
      },
      {
        name: "Braised Chicken",
        price: 13500,
        description:
          "Served with Rice, Buttery garlic green beans, lemon glazed carrots",
      },
      {
        name: "Beef Carbonate",
        price: 12700,
        description:
          "Served with Rice, Choice of potatoes and veggies flavored with Beer",
      },
      {
        name: "Grilled Lamb Chops",
        price: 25000,
        description:
          "Served with a side of mashed potatoes/Fries/Rice and steamed veggies",
      },
      {
        name: "T-bone Steak",
        price: 25000,
        description:
          "Served with a side of mashed potatoes/Fries/Rice and steamed veggies",
      },
      {
        name: "Wings",
        price: 9750,
        description:
          "Grilled Barbecue/Chili/Honey Mustard Wings served with French Fries/Sweet Potato Wedges",
      },
      {
        name: "Chicken Tacos",
        price: 12500,
        description:
          "Pulled chicken tortilla, bell pepper, avocado mousse, tomato, cheese, onion, sour cream served with fries",
      },
      {
        name: "Beef Tacos",
        price: 14000,
        description:
          "Beef tortilla, bell pepper, avocado mousse, tomato, cheese, onion, sour cream served with fries",
      },
      {
        name: "Pizza",
        price: 10000,
        description:
          "Your Choice of Margarita, Seafood, Barbecue Chicken or Goat Suya served with Sauté Mixed Vegetables",
      },
      {
        name: "Chinese Corn Soup",
        price: 9000,
        description:
          "Chicken fillet, Sweetcorn, Egg, Cornflour served with Breadroll",
      },
      {
        name: "French Onion Soup",
        price: 8500,
        description: "Served with garlic Bread",
      },
      {
        name: "Cream of Tomato Soup",
        price: 8500,
        description: "Garnished with crouton. Served with breadroll",
      },
      {
        name: "Pepper Soup Bowl",
        price: 10000,
        description:
          "Assorted/Goat Meat/Cow leg/Chicken Pepper Soup Served with Boiled Yam Cubes",
      },
      {
        name: "Ziba Salad",
        price: 10000,
        description:
          "Lettuce, fresh tomatoes, carrots, eggs, cheddar, swiss cheese, honey, dijon mustard, salt and pepper, olive oil",
      },
      {
        name: "Caesar Salad",
        price: 9000,
        description:
          "Lettuce, tomatoes, cucumber, parmesan cheese, crisp croutons",
      },
      {
        name: "Beach side Salad",
        price: 9000,
        description:
          "Cucumbers, Tomatoes, Bell Pepper, Onions, Olives, Feta Cheese, Olive oil",
      },
      {
        name: "Fruit Salad",
        price: 10000,
        description:
          "Apples, mango (seasonal), grapes, oranges, pineapples, watermelon, lemon, honey",
      },
      {
        name: "Summer side Salad",
        price: 10000,
        description: "Mixed Fruits, Ice cream, Cookies",
      },
    ],
  },
  {
    name: "Kids Menu",
    timing: "10:00 AM – 6:00 PM DAILY",
    note: "Kids meals are typically half the portion of our regular meal size",
    items: [
      {
        name: "Chicken Lolipop",
        price: 7200,
        description:
          "Chicken wings in Lolipop shape, Egg, Flour, Crumbs, served with fries and ketchup",
      },
      {
        name: "Chicken Nugget",
        price: 8000,
        description:
          "Chicken fillet, Crumbs, Flour, Egg served with fries and ketchup",
      },
      {
        name: "Hotdog",
        price: 7000,
        description: "Served with fries and Ketchup",
      },
      {
        name: "Mini Burger",
        price: 8500,
        description:
          "Beef/Chicken patee, Cocktail sauce, Veggies, Cheese served with fries and ketchup",
      },
      {
        name: "Singapore Noodles",
        price: 7000,
        description:
          "Veggies, Chicken fillet, Garlic and Ginger, Tumeric, Oyster",
      },
      {
        name: "Stir-fry Noodles",
        price: 4000,
        description: "Served with veggies and choice of eggs",
      },
      {
        name: "Coconut Rice",
        price: 7000,
        description: "Served with fish strips",
      },
    ],
  },
  {
    name: "Vegetarian Menu",
    timing: "10:00 AM – 6:00 PM DAILY",
    note: "",
    items: [
      {
        name: "Vegetable Curry with Steamed Basmati Rice",
        price: 12500,
        description:
          "Mixed vegetables simmered in rich curry sauce, served with fluffy basmati rice",
      },
      {
        name: "Spaghetti with Vegetable Bolognese",
        price: 9000,
        description:
          "Spaghetti served with a hearty vegetable-packed Bolognese sauce",
      },
      {
        name: "Tomato and Zucchini Pasta",
        price: 8000,
        description:
          "Pasta tossed in fresh tomato sauce with zucchini, garlic, and herbs",
      },
      {
        name: "Vegetarian Okro",
        price: 12500,
        description: "Okro, bell peppers, and mushroom with Poundo",
      },
      {
        name: "Vegetarian Rice Plate",
        price: 7300,
        description:
          "Eggs Your Way (Boiled/Sunny Side Up/Plain Omelet) served with your choice of Jollof Rice or Coconut Rice and Plantain/Green Salad/BBQ Beans",
      },
      {
        name: "Margarita Pizza",
        price: 10000,
        description: "Classic vegetarian pizza",
      },
      {
        name: "Mushroom and Scallion",
        price: 6500,
        description: "Sautéed mushrooms and scallions",
      },
      {
        name: "Chilli Garlic Mushroom Sliders with Fries",
        price: 7800,
        description:
          "Crispy mushroom sliders with chilli garlic sauce and fries",
      },
      {
        name: "Stir-fried Noodles with Mixed Veggies",
        price: 7300,
        description: "Noodles tossed with assorted fresh vegetables",
      },
    ],
  },
  {
    name: "Jolly Menu",
    timing: "OPEN DAILY",
    note: "This jolly menu is paid for and not covered in any room booking",
    items: [
      {
        name: "Quick Bites",
        price: 18000,
        description:
          "Pepper Gizzard or Snail served with potato or Yam wedges and chili pepper sauce",
      },
      {
        name: "Beef Fiesta",
        price: 20000,
        description:
          "Tender, juicy beef chunks stir-fried in sauce, wrapped in soft flatbread and served with fries",
      },
      {
        name: "Grilled Jumbo Prawns",
        price: 25000,
        description:
          "Served with a side of mashed potatoes/Fries/Rice and steamed veggies",
      },
      {
        name: "Grilled Lamb Chops",
        price: 25000,
        description:
          "Served with a side of mashed potatoes/Fries/Rice and steamed veggies",
      },
      {
        name: "T-bone Steak",
        price: 25000,
        description:
          "Served with a side of mashed potatoes/Fries/Rice and steamed veggies",
      },
      {
        name: "Assorted Box (Serves 3)",
        price: 50000,
        description:
          "Beef suya, Chicken in batter, Chicken Lolipop, Pepper Gizzard, Puff-Puff, Samosa, Spring rolls, Yam Chips served with green vegetable salad",
      },
      {
        name: "Seafood Box (Serves 3)",
        price: 60000,
        description:
          "Prawns, Calamari, Fish, Snail, and Crab served with Chili and Tartar sauce with Lemon wedges, Green salad and creamy sauce",
      },
    ],
  },
  {
    name: "Day Pass Ticket Plus Menu",
    timing: "10:00 AM – 6:00 PM DAILY",
    note: "Select one complimentary meal from the menu below with your Ticket Plus+ purchase",
    items: [
      {
        name: "Coconut Rice",
        price: 0,
        description:
          "Served with Peppered Grilled Chicken or Beef or Fish and Plantain/Green Salad",
      },
      {
        name: "Ziba Jollof Rice",
        price: 0,
        description:
          "Served with Chicken, Grilled Fish or Beef and Plantain/Coleslaw",
      },
      {
        name: "Obe Ata Din Din (Pepper Stew)",
        price: 0,
        description: "Served with White rice, protein of choice and plantain",
      },
      {
        name: "Chicken Sharwama",
        price: 0,
        description: "Served with French Fries/Yam Fries/Sweet Potato Fries",
      },
      {
        name: "Egusi, Ogbono or Efo-riro",
        price: 0,
        description:
          "Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein",
      },
      {
        name: "Abula",
        price: 0,
        description:
          "Gbegiri, Ewedu and Buka Stew served with Amala and a choice of Ogufe, Assorted meat, beef or Dry fish",
      },
      {
        name: "Bolognese Pasta",
        price: 0,
        description: "Mixed meat, Onions, Garlic, Tomatoes Sauce, Cheese",
      },
      {
        name: "Noodles",
        price: 0,
        description: "Served with veggies and choice of eggs",
      },
      {
        name: "Fish & Chips",
        price: 0,
        description: "Fish fillet in batter served with tartar sauce and fries",
      },
      {
        name: "Wings",
        price: 0,
        description:
          "Grilled Barbecue/Chili/Honey Mustard Wings served with French Fries/Sweet Potato Wedges",
      },
    ],
  },
];

async function main() {
  console.log("🍽️  Seeding menu data...");

  for (const category of menuData) {
    console.log(`Creating category: ${category.name}`);

    const createdCategory = await prisma.menuCategory.create({
      data: {
        id: nanoid(),
        name: category.name,
        timing: category.timing,
        note: category.note,
        isActive: true,
      },
    });

    for (const item of category.items) {
      await prisma.menuItem.create({
        data: {
          id: nanoid(),
          categoryId: createdCategory.id,
          name: item.name,
          description: item.description,
          priceNGN: item.price,
          isActive: true,
        },
      });
    }

    console.log(
      `✅ Created ${category.items.length} items for ${category.name}`,
    );
  }

  console.log("✅ Menu seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding menu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
