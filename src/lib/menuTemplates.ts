import type { MenuItem, Restaurant } from '@/types';

const IMG = (name: string) => `/images/${name}.jpg`;

// Known chain name fragments → static restaurant id
const KNOWN_CHAINS: Record<string, string> = {
  "mcdonald's": 'mcdonalds-india',
  'mcdonalds': 'mcdonalds-india',
  "domino's": 'dominos-india',
  'dominos': 'dominos-india',
  'domino': 'dominos-india',
  'kfc': 'kfc-india',
  'burger king': 'burgerking-india',
  'behrouz': 'behrouz-biryani',
  'wow! momo': 'wow-momo',
  'wow momo': 'wow-momo',
  "haldiram's": 'haldirams-india',
  'haldirams': 'haldirams-india',
  'saravana bhavan': 'saravana-bhavan',
  'saravanaa bhavan': 'saravana-bhavan',
  'paradise': 'paradise-restaurant',
  'biryani blues': 'biryani-blues',
  // City-iconic chains
  "karim's": 'karims-delhi',
  'karims': 'karims-delhi',
  'peter cat': 'peter-cat',
  'arsalan': 'arsalan-kolkata',
  'mavalli tiffin': 'mtr-bangalore',
  'mtr': 'mtr-bangalore',
  'meghana foods': 'meghana-bangalore',
  'meghana': 'meghana-bangalore',
  'murugan idli': 'murugan-idli-chennai',
  'vaishali': 'vaishali-pune',
  'britannia': 'britannia-mumbai',
  'gordhan thal': 'gordhan-thal-ahmedabad',
};

type TemplateName =
  | 'biryani' | 'pizza' | 'burger' | 'chinese'
  | 'south_indian' | 'north_indian' | 'coffee'
  | 'dessert' | 'seafood' | 'default';

type Template = { categories: string[]; items: MenuItem[] };

export const CUISINE_MENU_TEMPLATES: Record<TemplateName, Template> = {
  biryani: {
    categories: ['Popular', 'Biryani', 'Kebabs', 'Desserts'],
    items: [
      { id: 'T-bry-1', name: 'Chicken Biryani', description: 'Aromatic dum-cooked basmati with tender chicken, whole spices, saffron', price: 26.5, image: IMG('rest-biryani'), category: 'Popular', popular: true, calories: 820 },
      { id: 'T-bry-2', name: 'Mutton Biryani', description: 'Slow-cooked mutton biryani with fragrant basmati and crispy onions', price: 31.9, image: IMG('rest-biryani'), category: 'Biryani', calories: 980 },
      { id: 'T-bry-3', name: 'Veg Dum Biryani', description: 'Seasonal vegetables dum-cooked in basmati with whole spices', price: 16.6, image: IMG('rest-biryani'), category: 'Biryani', calories: 670 },
      { id: 'T-bry-4', name: 'Chicken Seekh Kebab (4 pc)', description: 'Spiced minced chicken on skewers, charcoal grilled', price: 16.6, image: IMG('rest-biryani'), category: 'Kebabs', calories: 340 },
      { id: 'T-bry-5', name: 'Raita', description: 'Chilled yogurt with cucumber, mint and cumin', price: 3.9, image: IMG('rest-healthy'), category: 'Popular', calories: 80 },
      { id: 'T-bry-6', name: 'Gulab Jamun (2 pc)', description: 'Soft milk-solid dumplings soaked in rose sugar syrup', price: 5.3, image: IMG('rest-dessert'), category: 'Desserts', calories: 220 },
    ],
  },
  pizza: {
    categories: ['Popular', 'Veg Pizzas', 'Non-Veg Pizzas', 'Sides'],
    items: [
      { id: 'T-piz-1', name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato sauce, basil on thin crust', price: 13.2, image: IMG('rest-pizza'), category: 'Popular', popular: true, calories: 560 },
      { id: 'T-piz-2', name: 'Veggie Supreme Pizza', description: 'Capsicum, onion, corn, olives, mushrooms, mozzarella', price: 23.2, image: IMG('rest-pizza'), category: 'Veg Pizzas', calories: 710 },
      { id: 'T-piz-3', name: 'Chicken BBQ Pizza', description: 'Grilled chicken, jalapeños, onion, BBQ sauce, mozzarella', price: 29.9, image: IMG('rest-pizza'), category: 'Non-Veg Pizzas', popular: true, calories: 820 },
      { id: 'T-piz-4', name: 'Garlic Bread (6 pc)', description: 'Toasted garlic butter bread with marinara dip', price: 9.9, image: IMG('rest-pizza'), category: 'Sides', calories: 340 },
      { id: 'T-piz-5', name: 'Pasta Arrabiata', description: 'Penne in spicy tomato sauce with herbs', price: 11.2, image: IMG('rest-pizza'), category: 'Sides', calories: 420 },
      { id: 'T-piz-6', name: 'Soft Drink', description: 'Chilled cola or lemonade, 500ml', price: 2.0, image: IMG('rest-fastfood'), category: 'Sides', calories: 140 },
    ],
  },
  burger: {
    categories: ['Popular', 'Burgers', 'Sides', 'Drinks'],
    items: [
      { id: 'T-brg-1', name: 'Crispy Chicken Burger', description: 'Crispy chicken fillet, lettuce, mayo, tomato on sesame bun', price: 11.9, image: IMG('rest-burger'), category: 'Popular', popular: true, calories: 460 },
      { id: 'T-brg-2', name: 'Cheese Burger', description: 'Juicy patty, cheddar cheese, pickles, special sauce', price: 13.2, image: IMG('rest-burger'), category: 'Burgers', popular: true, calories: 530 },
      { id: 'T-brg-3', name: 'Double Patty Burger', description: 'Two patties, double cheese, lettuce, tomato, onion', price: 16.6, image: IMG('rest-burger'), category: 'Burgers', calories: 720 },
      { id: 'T-brg-4', name: 'Crispy Fries', description: 'Golden salted fries with ketchup dip', price: 6.6, image: IMG('rest-fastfood'), category: 'Sides', calories: 300 },
      { id: 'T-brg-5', name: 'Onion Rings', description: 'Beer-battered onion rings with dipping sauce', price: 8.6, image: IMG('rest-fastfood'), category: 'Sides', calories: 380 },
      { id: 'T-brg-6', name: 'Milkshake', description: 'Thick chocolate or vanilla shake', price: 7.3, image: IMG('rest-icecream'), category: 'Drinks', calories: 480 },
    ],
  },
  chinese: {
    categories: ['Popular', 'Momos', 'Noodles', 'Rice'],
    items: [
      { id: 'T-chi-1', name: 'Veg Momos (8 pc)', description: 'Soft steamed dumplings with spiced vegetables and chilli dip', price: 9.9, image: IMG('rest-chinese'), category: 'Popular', popular: true, calories: 260 },
      { id: 'T-chi-2', name: 'Chicken Momos (8 pc)', description: 'Steamed chicken dumplings with ginger, garlic, chilli dip', price: 11.2, image: IMG('rest-chinese'), category: 'Momos', popular: true, calories: 310 },
      { id: 'T-chi-3', name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and soy sauce', price: 11.2, image: IMG('rest-chinese'), category: 'Noodles', calories: 480 },
      { id: 'T-chi-4', name: 'Schezwan Fried Rice', description: 'Spicy wok-tossed rice with vegetables and Schezwan sauce', price: 11.2, image: IMG('rest-chinese'), category: 'Rice', calories: 520 },
      { id: 'T-chi-5', name: 'Veg Manchurian', description: 'Crispy vegetable balls in tangy Manchurian gravy', price: 13.2, image: IMG('rest-chinese'), category: 'Popular', calories: 440 },
      { id: 'T-chi-6', name: 'Hot & Sour Soup', description: 'Classic spicy-tangy Indo-Chinese soup with vegetables', price: 6.6, image: IMG('rest-chinese'), category: 'Noodles', calories: 160 },
    ],
  },
  south_indian: {
    categories: ['Popular', 'Dosas', 'Tiffin', 'Beverages'],
    items: [
      { id: 'T-si-1', name: 'Masala Dosa', description: 'Crispy fermented crepe, spiced potato filling, sambar, chutneys', price: 6.0, image: IMG('rest-southindian'), category: 'Popular', popular: true, calories: 390 },
      { id: 'T-si-2', name: 'Rava Dosa', description: 'Thin crispy semolina dosa with onion and green chilli', price: 7.3, image: IMG('rest-southindian'), category: 'Dosas', calories: 420 },
      { id: 'T-si-3', name: 'Idli (2 pc) with Sambar', description: 'Soft steamed rice cakes, lentil soup, coconut chutney', price: 3.7, image: IMG('rest-southindian'), category: 'Tiffin', calories: 210 },
      { id: 'T-si-4', name: 'Pongal with Vadai', description: 'Rice-lentil porridge, crispy medu vadai, sambar, chutney', price: 6.0, image: IMG('rest-southindian'), category: 'Tiffin', calories: 450 },
      { id: 'T-si-5', name: 'Full Vegetarian Meals', description: 'Rice, 2 curries, sambar, rasam, curd, papad, pickle, payasam', price: 12.6, image: IMG('rest-southindian'), category: 'Popular', popular: true, calories: 720 },
      { id: 'T-si-6', name: 'Filter Coffee', description: 'Traditional decoction coffee with frothy full-cream milk', price: 3.0, image: IMG('rest-coffee'), category: 'Beverages', popular: true, calories: 80 },
    ],
  },
  north_indian: {
    categories: ['Popular', 'Main Course', 'Breads', 'Drinks'],
    items: [
      { id: 'T-ni-1', name: 'Butter Chicken', description: 'Tender chicken in creamy tomato-butter gravy', price: 19.9, image: IMG('rest-biryani'), category: 'Popular', popular: true, calories: 680 },
      { id: 'T-ni-2', name: 'Dal Makhani', description: 'Slow-cooked black lentils, cream, butter', price: 12.0, image: IMG('rest-healthy'), category: 'Main Course', popular: true, calories: 520 },
      { id: 'T-ni-3', name: 'Paneer Butter Masala', description: 'Cottage cheese cubes in rich tomato-cream gravy', price: 14.6, image: IMG('rest-healthy'), category: 'Main Course', calories: 580 },
      { id: 'T-ni-4', name: 'Garlic Naan (2 pc)', description: 'Tandoor-baked bread with garlic butter and coriander', price: 5.3, image: IMG('rest-southindian'), category: 'Breads', calories: 280 },
      { id: 'T-ni-5', name: 'Chole Bhature', description: 'Spiced chickpea curry with fluffy fried bread', price: 7.3, image: IMG('rest-healthy'), category: 'Popular', calories: 620 },
      { id: 'T-ni-6', name: 'Mango Lassi', description: 'Chilled yogurt drink blended with Alphonso mango pulp', price: 6.0, image: IMG('rest-healthy'), category: 'Drinks', calories: 220 },
    ],
  },
  coffee: {
    categories: ['Popular', 'Coffee', 'Snacks', 'Cold Drinks'],
    items: [
      { id: 'T-cof-1', name: 'Cappuccino', description: 'Double espresso with steamed milk and thick foam', price: 4.7, image: IMG('rest-coffee'), category: 'Popular', popular: true, calories: 120 },
      { id: 'T-cof-2', name: 'Cold Coffee', description: 'Chilled coffee blended with milk and ice cream', price: 6.0, image: IMG('rest-coffee'), category: 'Cold Drinks', popular: true, calories: 210 },
      { id: 'T-cof-3', name: 'Veg Club Sandwich', description: 'Multi-layer sandwich with cheese, veggies and mayo', price: 9.9, image: IMG('rest-coffee'), category: 'Snacks', calories: 380 },
      { id: 'T-cof-4', name: 'Chocolate Muffin', description: 'Freshly baked rich chocolate muffin', price: 5.3, image: IMG('rest-dessert'), category: 'Snacks', calories: 310 },
      { id: 'T-cof-5', name: 'Latte', description: 'Espresso with steamed full-cream milk', price: 5.3, image: IMG('rest-coffee'), category: 'Coffee', calories: 150 },
      { id: 'T-cof-6', name: 'Brownie with Ice Cream', description: 'Warm fudge brownie with vanilla ice cream scoop', price: 9.9, image: IMG('rest-dessert'), category: 'Snacks', calories: 520 },
    ],
  },
  dessert: {
    categories: ['Popular', 'Indian Sweets', 'Ice Cream', 'Bakes'],
    items: [
      { id: 'T-des-1', name: 'Gulab Jamun (4 pc)', description: 'Soft fried milk-solid balls in rose sugar syrup', price: 6.6, image: IMG('rest-dessert'), category: 'Popular', popular: true, calories: 380 },
      { id: 'T-des-2', name: 'Kulfi Falooda', description: 'Traditional Indian ice cream with vermicelli and rose syrup', price: 9.9, image: IMG('rest-icecream'), category: 'Ice Cream', popular: true, calories: 420 },
      { id: 'T-des-3', name: 'Double Scoop Ice Cream', description: 'Choose 2 flavours — chocolate, vanilla, mango, strawberry', price: 6.6, image: IMG('rest-icecream'), category: 'Ice Cream', calories: 280 },
      { id: 'T-des-4', name: 'Rasgulla (4 pc)', description: 'Soft chenna dumplings in light sugar syrup', price: 6.6, image: IMG('rest-dessert'), category: 'Indian Sweets', calories: 320 },
      { id: 'T-des-5', name: 'Chocolate Brownie', description: 'Fudgy baked brownie with walnut pieces', price: 9.9, image: IMG('rest-dessert'), category: 'Bakes', calories: 440 },
      { id: 'T-des-6', name: 'Kheer', description: 'Slow-cooked rice pudding with cardamom, saffron, dry fruits', price: 6.0, image: IMG('rest-dessert'), category: 'Indian Sweets', calories: 260 },
    ],
  },
  seafood: {
    categories: ['Popular', 'Fish', 'Prawns', 'Sides'],
    items: [
      { id: 'T-sea-1', name: 'Fish Curry', description: 'Fresh fish in tangy coastal coconut-tomato curry', price: 16.6, image: IMG('rest-sushi'), category: 'Popular', popular: true, calories: 420 },
      { id: 'T-sea-2', name: 'Prawn Masala', description: 'King prawns in spiced onion-tomato masala gravy', price: 19.9, image: IMG('rest-sushi'), category: 'Prawns', popular: true, calories: 390 },
      { id: 'T-sea-3', name: 'Fish Tikka (4 pc)', description: 'Marinated fish fillets grilled in tandoor with mint chutney', price: 16.6, image: IMG('rest-sushi'), category: 'Fish', calories: 320 },
      { id: 'T-sea-4', name: 'Crab Fry', description: 'Masala-coated crab shallow fried in coastal spices', price: 23.2, image: IMG('rest-sushi'), category: 'Popular', calories: 380 },
      { id: 'T-sea-5', name: 'Steamed Rice', description: 'Plain basmati rice, perfect with curries', price: 3.3, image: IMG('rest-healthy'), category: 'Sides', calories: 240 },
      { id: 'T-sea-6', name: 'Appam (4 pc)', description: 'Soft lacy rice hoppers, best with fish curry', price: 4.7, image: IMG('rest-southindian'), category: 'Sides', calories: 280 },
    ],
  },
  default: {
    categories: ['Popular', 'Mains', 'Sides', 'Drinks'],
    items: [
      { id: 'T-def-1', name: 'Special Thali', description: "Chef's daily thali — 2 curries, rice, roti, salad, dessert", price: 13.2, image: IMG('rest-healthy'), category: 'Popular', popular: true, calories: 780 },
      { id: 'T-def-2', name: 'Veg Main Course', description: 'Seasonal vegetable preparation with roti or rice', price: 11.9, image: IMG('rest-healthy'), category: 'Mains', calories: 480 },
      { id: 'T-def-3', name: 'Chicken Main Course', description: 'Tender chicken in house special masala gravy', price: 16.6, image: IMG('rest-biryani'), category: 'Mains', popular: true, calories: 560 },
      { id: 'T-def-4', name: 'Bread Basket', description: 'Assorted fresh breads — roti, naan or paratha', price: 4.0, image: IMG('rest-southindian'), category: 'Sides', calories: 240 },
      { id: 'T-def-5', name: 'Fresh Salad', description: 'Seasonal greens with house dressing', price: 6.0, image: IMG('rest-healthy'), category: 'Sides', calories: 120 },
      { id: 'T-def-6', name: 'Dessert of the Day', description: "Chef's special sweet — ask your server", price: 6.6, image: IMG('rest-dessert'), category: 'Popular', calories: 280 },
    ],
  },
};

const CUISINE_TAG_TO_TEMPLATE: Record<string, TemplateName> = {
  biryani: 'biryani',
  mughlai: 'biryani',
  kebab: 'north_indian',
  indian: 'north_indian',
  'north indian': 'north_indian',
  north_indian: 'north_indian',
  regional: 'south_indian',
  'south indian': 'south_indian',
  south_indian: 'south_indian',
  kerala: 'south_indian',
  pizza: 'pizza',
  italian: 'pizza',
  burger: 'burger',
  'fast food': 'burger',
  fast_food: 'burger',
  american: 'burger',
  chinese: 'chinese',
  asian: 'chinese',
  momos: 'chinese',
  tibetan: 'chinese',
  coffee: 'coffee',
  cafe: 'coffee',
  bakery: 'coffee',
  dessert: 'dessert',
  'ice cream': 'dessert',
  ice_cream: 'dessert',
  sweet: 'dessert',
  seafood: 'seafood',
  fish: 'seafood',
};

function matchTemplate(cuisineTag: string): TemplateName {
  const key = cuisineTag.toLowerCase().split(';')[0].trim();
  return CUISINE_TAG_TO_TEMPLATE[key] ?? 'default';
}

export function getMenuForRestaurant(
  name: string,
  cuisineTag: string,
  allRestaurants: Restaurant[]
): { menuCategories: string[]; menuItems: MenuItem[] } {
  const nameLower = name.toLowerCase();
  for (const [chainKey, chainId] of Object.entries(KNOWN_CHAINS)) {
    if (nameLower.includes(chainKey)) {
      const match = allRestaurants.find((r) => r.id === chainId);
      if (match) return { menuCategories: match.menuCategories, menuItems: match.menuItems };
    }
  }
  const tpl = CUISINE_MENU_TEMPLATES[matchTemplate(cuisineTag)];
  return { menuCategories: tpl.categories, menuItems: tpl.items };
}
