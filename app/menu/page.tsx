"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Menu() {
  const formatCurrency = (amount: number) => {
    if (amount === 0) return "Included";
    return `₦${amount.toLocaleString()}`;
  };

  const MenuItem = ({
    name,
    price,
    description,
  }: {
    name: string;
    price: number;
    description: string;
  }) => (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-light text-gray-900 text-lg">{name}</h4>
        <span className="text-blue-900 font-semibold ml-4 whitespace-nowrap">
          {formatCurrency(price)}
        </span>
      </div>
      <p className="text-sm text-gray-600 font-light">{description}</p>
    </div>
  );

  const MenuSection = ({
    title,
    timing,
    note,
    children,
  }: {
    title: string;
    timing: string;
    note?: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-16">
      <div>
        <h2
          className="text-4xl font-light text-blue-900 mb-2"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {title}
        </h2>
        <p className="text-gray-600 font-light text-sm">{timing}</p>
        {note && (
          <p className="text-amber-700 bg-amber-50 px-4 py-3 rounded-lg mt-3 font-light text-sm border border-amber-200">
            {note}
          </p>
        )}
      </div>

      <div className="bg-linear-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 mt-6">
        {children}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* HERO SECTION */}
        <section
          className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/Ziba-hero.jpg')",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/50"></div>

          {/* Content */}
          <div className="relative max-w-5xl mx-auto text-center px-4 z-10">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Our Culinary Menu
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 font-light">
              Experience exquisite dining with our carefully crafted menus
            </p>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-white text-center">
              <p className="text-sm font-light mb-2">Explore More</p>
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* MENU CONTENT */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <MenuSection
              title="Breakfast"
              timing="7:00 AM – 10:00 AM DAILY"
              note="THIS À LA CARTE MENU IS AVAILABLE ON DAYS, BUFFET IS NOT OFFERED."
            >
              <MenuItem
                name="Toast Bread"
                price={9000}
                description="Toast bread and omelette served with choice of Tea/Coffee/Hot chocolate"
              />
              <MenuItem
                name="Full English Breakfast"
                price={10500}
                description="Bread Basket, Baked beans, Steamed carrots, potatoes, Grilled sausage, Eggs your way, choice of Oatmeal | Cornflakes | Custard and choice of Tea | Coffee | Hot Chocolate"
              />
              <MenuItem
                name="American Breakfast"
                price={10500}
                description="Pancakes, Potatoes served with Bacon or sausage, Eggs your way and choice of Tea | Coffee | Hot Chocolate"
              />
              <MenuItem
                name="Tubers 'N' Sauces"
                price={8300}
                description="Boiled or fried Yam served with your choice of Egg Sauce/Fish Sauce/Vegetable Sauce"
              />
              <MenuItem
                name="Plantain n Vegetable Sauce"
                price={8300}
                description="Plantain how you like it [Boiled, fried or grilled] with Ziba vegetable sauce"
              />
              <MenuItem
                name="Naija Breakfast"
                price={8500}
                description="Akara & Pap"
              />
              <MenuItem
                name="Oat Bowl"
                price={10000}
                description="Served with boiled Eggs, Nuts, Coconut flakes, Honey and dates"
              />
              <MenuItem
                name="Yoghurt Bowl"
                price={10000}
                description="Greek Yoghurt served with granola, chia seeds, coconut flakes and fruit of choice"
              />
              <MenuItem
                name="French Toast"
                price={9000}
                description="Served with Egg, cinnamon powder, sausage and baked beans"
              />
              <MenuItem
                name="Yamarita Special"
                price={9000}
                description="Served with Vegetable or Fish sauce"
              />
              <MenuItem
                name="Potato Fiesta"
                price={9300}
                description="Grilled or Fried sweet Potato served with Egg or Fish sauce"
              />
              <MenuItem
                name="Plain Homemade Pancake"
                price={7750}
                description="Served with syrup, scrambled eggs and sausage"
              />
              <MenuItem
                name="Club Sandwich & Fries"
                price={10000}
                description="Eggs, Cheese, Tomato, Lettuce, Cucumber, Shredded Chicken, Bread served with fries"
              />
              <MenuItem
                name="Stir fry Noodles"
                price={8500}
                description="Served with veggies and choice of eggs"
              />
            </MenuSection>

            <MenuSection
              title="Lunch & Dinner"
              timing="LUNCH: 12:00 NOON - 6:00 PM DAILY | DINNER: 7:00 PM - 10:00 PM DAILY"
              note="Lunch is served À La Carte. Dinner is either a buffet or à la carte when the buffet isn't available. Our team will let you know the dining option for your stay at check-in"
            >
              <h3 className="text-2xl font-light text-blue-900 mb-8 mt-6">
                Traditional Nigerian
              </h3>
              <MenuItem
                name="Abula"
                price={11000}
                description="Gbegiri, Ewedu and Buka Stew served with Amala and a choice of Ogufe | Assorted meat | beef | Dry fish"
              />
              <MenuItem
                name="Egusi Soup"
                price={11500}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken"
              />
              <MenuItem
                name="Ogbono Soup"
                price={11500}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken"
              />
              <MenuItem
                name="Efo-riro Soup"
                price={11500}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken"
              />
              <MenuItem
                name="Edikang Ikong"
                price={11500}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken"
              />
              <MenuItem
                name="Afang Soup"
                price={12500}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken"
              />
              <MenuItem
                name="Oha Soup"
                price={12500}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken"
              />
              <MenuItem
                name="Bitterleaf Soup"
                price={12500}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein Dry fish | Assorted Meat | Goatmeat | Cowleg | Beef | Chicken"
              />
              <MenuItem
                name="Premium Soups (with Turkey or Snail)"
                price={15000}
                description="Egusi, Afang, Ogbono, Oha, Bitterleaf, Edikang Ikong or Eforiro soup served with Eba, Semovita, Poundo Yam, or Wheat and turkey"
              />
              <MenuItem
                name="Seafood Okro"
                price={20000}
                description="Served with Eba, Semovita, Poundo Yam or Wheat"
              />
              <MenuItem
                name="Spicy Beans"
                price={10500}
                description="Served with Fried Plantain and Chicken/Beef/Fish"
              />
              <MenuItem
                name="Obe Ata Din Din (Pepper Stew)"
                price={11500}
                description="Served with White rice, choice of chicken, beef or fish and plantain/Coleslaw"
              />
              <MenuItem
                name="Ofada Rice"
                price={11500}
                description="Served with assorted meat and boiled eggs"
              />
              <MenuItem
                name="Ziba Jollof Rice"
                price={11500}
                description="Served with Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw"
              />
              <MenuItem
                name="Coconut Rice"
                price={11500}
                description="Served with Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw"
              />
              <MenuItem
                name="White Rice"
                price={11500}
                description="Served with stew and Peppered Grilled Chicken/Beef/Fish/Goat meat and Plantain/Coleslaw"
              />
              <MenuItem
                name="Gizdodo"
                price={11500}
                description="Served with rice of choice"
              />
              <MenuItem
                name="Seafood Native Rice"
                price={14500}
                description="Smoky, flavourful native rice with prawns, calamari, and smoked fish"
              />
              <MenuItem
                name="Premium Rice (with Turkey)"
                price={15000}
                description="White, Jollof or Coconut Rice served with Turkey"
              />
              <MenuItem
                name="Asun Wrap"
                price={10500}
                description="Spicy and delicious Asun encased in flatbread and served with fries"
              />
              <MenuItem
                name="Isi-Ewu"
                price={15000}
                description="Spicy, saucy goat head tossed in rich palm oil and native spices, topped with onions and Utazi leaves"
              />
              <h3 className="text-2xl font-light text-blue-900 mb-8 mt-12">
                Seafood & Grilled
              </h3>
              <MenuItem
                name="Whole Fish"
                price={15000}
                description="Whole grilled fish served with Rice/Fries/Potato Wedges/Bole and Green Salad"
              />
              <MenuItem
                name="Fish & Chips"
                price={12000}
                description="Fish fillet in batter served with tartar sauce and fries"
              />
              <MenuItem
                name="Fish Curry"
                price={12700}
                description="Served with White rice and dried fruits/nuts"
              />
              <MenuItem
                name="Grilled Jumbo Prawns"
                price={25000}
                description="Served with a side of mashed potatoes/Fries/Rice and steamed veggies"
              />
              <h3 className="text-2xl font-light text-blue-900 mb-8 mt-12">
                International & Fusion
              </h3>
              <MenuItem
                name="Chicken Cordon Bleu"
                price={13000}
                description="Chicken cutlets, Swiss Cheese, Steamed veggies, Potatoes your way & Cordon Bleu sauce"
              />
              <MenuItem
                name="Singapore Noodles"
                price={11000}
                description="Served with veggies and Chicken fillet"
              />
              <MenuItem
                name="Bolognese Pasta"
                price={12000}
                description="Mixed meat, Onions, Garlic, Tomatoes Sauce, Cheese"
              />
              <MenuItem
                name="Chicken and Chips"
                price={11500}
                description="Served with steamed veggies and chilli sauce"
              />
              <MenuItem
                name="Stir fry Spaghetti"
                price={12000}
                description="Served with choice of protein"
              />
              <MenuItem
                name="Jollof Pasta"
                price={12000}
                description="Spaghetti cooked in rich, spicy jollof sauce and herbs served with Chicken/Beef/Assorted meat/Fish"
              />
              <MenuItem
                name="Seafood Pasta"
                price={15000}
                description="Spaghetti in Fish, Calamari, Shrimps, Onion Garlic, Ginger, Cheese, Tomatoes/Creamy Sauce"
              />
              <h3 className="text-2xl font-light text-blue-900 mb-8 mt-12">
                Premium Grilled & Braised
              </h3>
              <MenuItem
                name="Braised Chicken"
                price={13500}
                description="Served with Rice, Buttery garlic green beans, lemon glazed carrots"
              />
              <MenuItem
                name="Beef Carbonate"
                price={12700}
                description="Served with Rice, Choice of potatoes and veggies flavored with Beer"
              />
              <MenuItem
                name="Grilled Lamb Chops"
                price={25000}
                description="Served with a side of mashed potatoes/Fries/Rice and steamed veggies"
              />
              <MenuItem
                name="T-bone Steak"
                price={25000}
                description="Served with a side of mashed potatoes/Fries/Rice and steamed veggies"
              />
              <h3 className="text-2xl font-light text-blue-900 mb-8 mt-12">
                Appetizers & Lighter Fare
              </h3>
              <MenuItem
                name="Wings"
                price={9750}
                description="Grilled Barbecue/Chili/Honey Mustard Wings served with French Fries/Sweet Potato Wedges"
              />
              <MenuItem
                name="Chicken Tacos"
                price={12500}
                description="Pulled chicken tortilla, bell pepper, avocado mousse, tomato, cheese, onion, sour cream served with fries"
              />
              <MenuItem
                name="Beef Tacos"
                price={14000}
                description="Beef tortilla, bell pepper, avocado mousse, tomato, cheese, onion, sour cream served with fries"
              />
              <MenuItem
                name="Pizza"
                price={10000}
                description="Your Choice of Margarita, Seafood, Barbecue Chicken or Goat Suya served with Sauté Mixed Vegetables"
              />
              <h3 className="text-2xl font-light text-blue-900 mb-8 mt-12">
                Soups & Light Meals
              </h3>
              <MenuItem
                name="Chinese Corn Soup"
                price={9000}
                description="Chicken fillet, Sweetcorn, Egg, Cornflour served with Breadroll"
              />
              <MenuItem
                name="French Onion Soup"
                price={8500}
                description="Served with garlic Bread"
              />
              <MenuItem
                name="Cream of Tomato Soup"
                price={8500}
                description="Garnished with crouton. Served with breadroll"
              />
              <MenuItem
                name="Pepper Soup Bowl"
                price={10000}
                description="Assorted/Goat Meat/Cow leg/Chicken Pepper Soup Served with Boiled Yam Cubes"
              />
              <h3 className="text-2xl font-light text-blue-900 mb-8 mt-12">
                Salads
              </h3>
              <MenuItem
                name="Ziba Salad"
                price={10000}
                description="Lettuce, fresh tomatoes, carrots, eggs, cheddar, swiss cheese, honey, dijon mustard, salt and pepper, olive oil"
              />
              <MenuItem
                name="Caesar Salad"
                price={9000}
                description="Lettuce, tomatoes, cucumber, parmesan cheese, crisp croutons"
              />
              <MenuItem
                name="Beach side Salad"
                price={9000}
                description="Cucumbers, Tomatoes, Bell Pepper, Onions, Olives, Feta Cheese, Olive oil"
              />
              <MenuItem
                name="Fruit Salad"
                price={10000}
                description="Apples, mango (seasonal), grapes, oranges, pineapples, watermelon, lemon, honey"
              />
              <MenuItem
                name="Summer side Salad"
                price={10000}
                description="Mixed Fruits, Ice cream, Cookies"
              />
            </MenuSection>

            <MenuSection
              title="Kids Menu"
              timing="10:00 AM – 6:00 PM DAILY"
              note="Kids meals are typically half the portion of our regular meal size"
            >
              <MenuItem
                name="Chicken Lolipop"
                price={7200}
                description="Chicken wings in Lolipop shape, Egg, Flour, Crumbs, served with fries and ketchup"
              />
              <MenuItem
                name="Chicken Nugget"
                price={8000}
                description="Chicken fillet, Crumbs, Flour, Egg served with fries and ketchup"
              />
              <MenuItem
                name="Hotdog"
                price={7000}
                description="Served with fries and Ketchup"
              />
              <MenuItem
                name="Mini Burger"
                price={8500}
                description="Beef/Chicken patee, Cocktail sauce, Veggies, Cheese served with fries and ketchup"
              />
              <MenuItem
                name="Singapore Noodles"
                price={7000}
                description="Veggies, Chicken fillet, Garlic and Ginger, Tumeric, Oyster"
              />
              <MenuItem
                name="Stir-fry Noodles"
                price={4000}
                description="Served with veggies and choice of eggs"
              />
              <MenuItem
                name="Coconut Rice"
                price={7000}
                description="Served with fish strips"
              />
            </MenuSection>

            <MenuSection
              title="Vegetarian Menu"
              timing="10:00 AM – 6:00 PM DAILY"
            >
              <MenuItem
                name="Vegetable Curry with Steamed Basmati Rice"
                price={12500}
                description="Mixed vegetables simmered in rich curry sauce, served with fluffy basmati rice"
              />
              <MenuItem
                name="Spaghetti with Vegetable Bolognese"
                price={9000}
                description="Spaghetti served with a hearty vegetable-packed Bolognese sauce"
              />
              <MenuItem
                name="Tomato and Zucchini Pasta"
                price={8000}
                description="Pasta tossed in fresh tomato sauce with zucchini, garlic, and herbs"
              />
              <MenuItem
                name="Vegetarian Okro"
                price={12500}
                description="Okro, bell peppers, and mushroom with Poundo"
              />
              <MenuItem
                name="Vegetarian Rice Plate"
                price={7300}
                description="Eggs Your Way (Boiled/Sunny Side Up/Plain Omelet) served with your choice of Jollof Rice or Coconut Rice and Plantain/Green Salad/BBQ Beans"
              />
              <MenuItem
                name="Margarita Pizza"
                price={10000}
                description="Classic vegetarian pizza"
              />
              <MenuItem
                name="Mushroom and Scallion"
                price={6500}
                description="Sautéed mushrooms and scallions"
              />
              <MenuItem
                name="Chilli Garlic Mushroom Sliders with Fries"
                price={7800}
                description="Crispy mushroom sliders with chilli garlic sauce and fries"
              />
              <MenuItem
                name="Stir-fried Noodles with Mixed Veggies"
                price={7300}
                description="Noodles tossed with assorted fresh vegetables"
              />
            </MenuSection>

            <MenuSection
              title="Jolly Menu"
              timing="OPEN DAILY"
              note="This jolly menu is paid for and not covered in any room booking"
            >
              <MenuItem
                name="Quick Bites"
                price={18000}
                description="Pepper Gizzard or Snail served with potato or Yam wedges and chili pepper sauce"
              />
              <MenuItem
                name="Beef Fiesta"
                price={20000}
                description="Tender, juicy beef chunks stir-fried in sauce, wrapped in soft flatbread and served with fries"
              />
              <MenuItem
                name="Grilled Jumbo Prawns"
                price={25000}
                description="Served with a side of mashed potatoes/Fries/Rice and steamed veggies"
              />
              <MenuItem
                name="Grilled Lamb Chops"
                price={25000}
                description="Served with a side of mashed potatoes/Fries/Rice and steamed veggies"
              />
              <MenuItem
                name="T-bone Steak"
                price={25000}
                description="Served with a side of mashed potatoes/Fries/Rice and steamed veggies"
              />
              <MenuItem
                name="Assorted Box (Serves 3)"
                price={50000}
                description="Beef suya, Chicken in batter, Chicken Lolipop, Pepper Gizzard, Puff-Puff, Samosa, Spring rolls, Yam Chips served with green vegetable salad"
              />
              <MenuItem
                name="Seafood Box (Serves 3)"
                price={60000}
                description="Prawns, Calamari, Fish, Snail, and Crab served with Chili and Tartar sauce with Lemon wedges, Green salad and creamy sauce"
              />
            </MenuSection>

            <MenuSection
              title="Day Pass Ticket Plus Menu"
              timing="10:00 AM – 6:00 PM DAILY"
            >
              <p className="text-gray-600 font-light mb-8 text-center italic">
                Select one complimentary meal from the menu below with your
                Ticket Plus+ purchase
              </p>
              <MenuItem
                name="Coconut Rice"
                price={0}
                description="Served with Peppered Grilled Chicken or Beef or Fish and Plantain/Green Salad"
              />
              <MenuItem
                name="Ziba Jollof Rice"
                price={0}
                description="Served with Chicken, Grilled Fish or Beef and Plantain/Coleslaw"
              />
              <MenuItem
                name="Obe Ata Din Din (Pepper Stew)"
                price={0}
                description="Served with White rice, protein of choice and plantain"
              />
              <MenuItem
                name="Chicken Sharwama"
                price={0}
                description="Served with French Fries/Yam Fries/Sweet Potato Fries"
              />
              <MenuItem
                name="Egusi, Ogbono or Efo-riro"
                price={0}
                description="Served with Eba, Semovita, Poundo Yam, or Wheat and a choice of protein"
              />
              <MenuItem
                name="Abula"
                price={0}
                description="Gbegiri, Ewedu and Buka Stew served with Amala and a choice of Ogufe, Assorted meat, beef or Dry fish"
              />
              <MenuItem
                name="Bolognese Pasta"
                price={0}
                description="Mixed meat, Onions, Garlic, Tomatoes Sauce, Cheese"
              />
              <MenuItem
                name="Noodles"
                price={0}
                description="Served with veggies and choice of eggs"
              />
              <MenuItem
                name="Fish & Chips"
                price={0}
                description="Fish fillet in batter served with tartar sauce and fries"
              />
              <MenuItem
                name="Wings"
                price={0}
                description="Grilled Barbecue/Chili/Honey Mustard Wings served with French Fries/Sweet Potato Wedges"
              />
            </MenuSection>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready to Dine?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 font-light mb-10">
              Reserve your table or book your stay at Ziba Beach Resort
            </p>
            <button className="bg-gradient-to-br from-white to-blue-50 text-blue-900 px-10 py-4 rounded-lg font-light hover:shadow-lg transition-all duration-300 hover:from-blue-50 hover:to-white text-lg">
              Make a Reservation
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
