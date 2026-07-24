export const MENU_STATUS = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
  INACTIVE: "Inactive",
  OUT_OF_STOCK: "Out of Stock",
};

export const MENU_CATEGORIES = [
  "Gujarati",
  "South Indian",
  "Punjabi",
  "Chinese",
  "North Indian",
  "Continental/Italian",
  "Bar / Beverages",
  "Snacks & Fast Food",
  "Tandoor / Grill",
  "Rice & Biryani",
  "Desserts",
  "Beverages (Non-Bar)",
];
export const SUBCATEGORY_ICONS = {
  "Farsan (Snacks)": "Soup",
  "Gujarati Thali (Full Meal)": "UtensilsCrossed",
  "Gujarati Curries/Shaak": "Soup",
  "Kathiyawadi Specials": "Utensils",
  "Gujarati Kadhi & Dal": "Soup",
  "Rotli/Bhakri/Puri (Breads)": "Circle",
  "Gujarati Sweets": "Gift",
  "Dosa Varieties": "Circle",
  "Idli & Vada": "Circle",
  "Uttapam Varieties": "Circle",
  "Rice Specials": "Coffee",
  "South Indian Curries": "Soup",
  "Chutneys & Podi": "Soup",
  "South Indian Filter Coffee": "Coffee",
  "Punjabi Sabzi/Curries": "Soup",
  "Tandoori Roti/Naan/Kulcha": "Circle",
  "Punjabi Paneer Specials": "Soup",
  Lassi: "Coffee",
};
export const FOOD_TYPE = {
  VEG: "Veg",
  NON_VEG: "Non-Veg",
  EGG: "Egg",
  VEGAN: "Vegan",
  JAIN: "Jain",
  DESSERT: "Dessert",
  BEVERAGE: "Beverage",
};
export const ADDON_GROUPS = [
  {
    id: "AG-01",
    name: "Extra Toppings",
    minSelect: 0,
    maxSelect: 3,
    addons: [
      { id: "AD-01", name: "Extra Cheese", price: 30 },
      { id: "AD-02", name: "Paneer Cubes", price: 40 },
      { id: "AD-03", name: "Mushrooms", price: 35 },
      { id: "AD-04", name: "Olives", price: 25 },
    ],
  },
  {
    id: "AG-02",
    name: "Bread Choice",
    minSelect: 0,
    maxSelect: 1,
    addons: [
      { id: "AD-05", name: "Butter Naan", price: 0 },
      { id: "AD-06", name: "Garlic Naan", price: 20 },
      { id: "AD-07", name: "Tandoori Roti", price: 0 },
      { id: "AD-08", name: "Laccha Paratha", price: 30 },
    ],
  },
  {
    id: "AG-03",
    name: "Spice Level",
    minSelect: 0,
    maxSelect: 1,
    addons: [
      { id: "AD-09", name: "Mild", price: 0 },
      { id: "AD-10", name: "Medium", price: 0 },
      { id: "AD-11", name: "Hot", price: 0 },
      { id: "AD-12", name: "Extra Hot", price: 0 },
    ],
  },
  {
    id: "AG-04",
    name: "Sides",
    minSelect: 0,
    maxSelect: 4,
    addons: [
      { id: "AD-13", name: "Onions", price: 25 },
      { id: "AD-14", name: "Coriander Chutney", price: 25 },
      { id: "AD-15", name: "Curd", price: 25 },
      { id: "AD-16", name: "Pudina Chutney", price: 25 },
    ],
  },
  {
    id: "AG-05",
    name: "Beverage Add-ons",
    minSelect: 0,
    maxSelect: 2,
    addons: [
      { id: "AD-17", name: "Extra Sugar", price: 0 },
      { id: "AD-18", name: "Ice", price: 0 },
      { id: "AD-19", name: "Boba Pearls", price: 30 },
      { id: "AD-20", name: "Cream Topping", price: 20 },
    ],
  },
];

// Helper to build a menu item quickly
const T = {
  category: "GST",
  percentage: 5,
  included: false,
  hsnCode: "996331",
};
const T18 = {
  category: "GST",
  percentage: 18,
  included: false,
  hsnCode: "996331",
};
const T28 = {
  category: "GST",
  percentage: 28,
  included: true,
  hsnCode: "2202",
};
const V = FOOD_TYPE.VEG;
const NV = FOOD_TYPE.NON_VEG;
const EG = FOOD_TYPE.EGG;
const A = MENU_STATUS.ACTIVE;
// Subcategories that naturally support Half / Full portion variants
const HALF_FULL_SUBCATEGORIES = [
  "Gujarati Curries/Shaak",
  "Kathiyawadi Specials",
  "Gujarati Kadhi & Dal",
  "Dosa Varieties",
  "Uttapam Varieties",
  "Rice Specials",
  "South Indian Curries",
  "Punjabi Sabzi/Curries",
  "Punjabi Paneer Specials",
  "Noodles",
  "Fried Rice Varieties",
  "Main Course Gravies",
  "Paneer Specials",
  "Dal Varieties",
  "Vegetable Curries",
  "Non-Veg Curries",
  "Rice & Biryani",
  "Pasta & Pizza",
  "Soups",
  "Lassi & Punjabi Drinks",
];
let _id = 0;
let _vid = 0;
function m(name, category, subCategory, foodType, price, cost, opts = {}) {
  _id++;
  
  if (foodType === FOOD_TYPE.VEG) {
    if (category === "Bar / Beverages" || category === "Beverages (Non-Bar)" || subCategory === "Lassi & Punjabi Drinks" || subCategory === "South Indian Filter Coffee") {
      foodType = FOOD_TYPE.BEVERAGE;
    } else if (category === "Desserts" || subCategory === "Gujarati Sweets") {
      foodType = FOOD_TYPE.DESSERT;
    }
  }
  
  // Auto-add Half / Full variants if the subcategory supports portion sizes
  // and the item doesn't already have explicit variants
  let variants = opts.variants || [];
  if (variants.length === 0 && HALF_FULL_SUBCATEGORIES.includes(subCategory)) {
    _vid++;
    const halfPrice = Math.round(price * 0.6);
    variants = [
      { id: `V-HF-${_vid}a`, name: "Half", price: halfPrice },
      { id: `V-HF-${_vid}b`, name: "Full", price: price },
    ];
  }
  return {
    id: `M-${_id}`,
    name,
    category,
    subCategory,
    foodType,
    status: A,
    pricing: { sellingPrice: price, costPrice: cost },
    tax: opts.tax || T,
    variants,
    addonGroups: opts.addonGroups || [],
    addons: opts.addons || [],
    tags: opts.tags || [],
    description: opts.description || "",
    station: opts.station || "Main Kitchen",
    preparationTime: opts.preparationTime || 10,
  };
}
export const MOCK_MENU_ITEMS = [
  // ═══════════════════════════════════════════════
  // 1. GUJARATI
  // ═══════════════════════════════════════════════

  // ── Farsan (Snacks) ──
  m("Khaman", "Gujarati", "Farsan (Snacks)", V, 80, 25, {
    tags: ["bestseller"],
    station: "Snacks",
  }),
  m("Dhokla", "Gujarati", "Farsan (Snacks)", V, 80, 25, { station: "Snacks" }),
  m("Khandvi", "Gujarati", "Farsan (Snacks)", V, 100, 30, {
    station: "Snacks",
  }),
  m("Fafda", "Gujarati", "Farsan (Snacks)", V, 70, 20, { station: "Snacks" }),
  m("Patra", "Gujarati", "Farsan (Snacks)", V, 90, 28, { station: "Snacks" }),
  m("Handvo", "Gujarati", "Farsan (Snacks)", V, 100, 30, { station: "Snacks" }),
  m("Dhokla Sandwich", "Gujarati", "Farsan (Snacks)", V, 110, 35, {
    station: "Snacks",
  }),
  m("Muthiya", "Gujarati", "Farsan (Snacks)", V, 80, 22, { station: "Snacks" }),
  m("Khaman Chevdo", "Gujarati", "Farsan (Snacks)", V, 90, 25, {
    station: "Snacks",
  }),
  m("Sev Khamani", "Gujarati", "Farsan (Snacks)", V, 90, 25, {
    station: "Snacks",
  }),
  m("Gathiya", "Gujarati", "Farsan (Snacks)", V, 70, 20, { station: "Snacks" }),
  m("Dabeli", "Gujarati", "Farsan (Snacks)", V, 60, 18, { station: "Snacks" }),
  m("Vagharela Muthiya", "Gujarati", "Farsan (Snacks)", V, 90, 25, {
    station: "Snacks",
  }),
  m("Batata Vada", "Gujarati", "Farsan (Snacks)", V, 60, 15, {
    station: "Snacks",
  }),
  m("Samosa", "Gujarati", "Farsan (Snacks)", V, 40, 12, {
    tags: ["bestseller"],
    station: "Snacks",
  }),

  // ── Gujarati Thali (Full Meal) ──
  m("Regular Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 250, 100, {
    tags: ["combo"],
  }),
  m("Special Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 350, 140, {
    tags: ["combo", "bestseller"],
  }),
  m(
    "Kathiyawadi Thali",
    "Gujarati",
    "Gujarati Thali (Full Meal)",
    V,
    300,
    120,
    { tags: ["combo"] },
  ),
  m("Farsan Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 280, 110, {
    tags: ["combo"],
  }),
  m(
    "Sunday Special Thali",
    "Gujarati",
    "Gujarati Thali (Full Meal)",
    V,
    400,
    160,
    { tags: ["combo", "chef-special"] },
  ),
  m("Undhiyu Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 380, 150, {
    tags: ["combo"],
  }),
  m("Deluxe Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 450, 180, {
    tags: ["combo"],
  }),
  m("Mini Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 180, 70, {
    tags: ["combo"],
  }),
  m("Family Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 800, 320, {
    tags: ["combo"],
  }),
  m("Festive Thali", "Gujarati", "Gujarati Thali (Full Meal)", V, 500, 200, {
    tags: ["combo", "new"],
  }),
  // ── Gujarati Curries/Shaak ──
  m("Undhiyu", "Gujarati", "Gujarati Curries/Shaak", V, 220, 80, {
    tags: ["chef-special"],
    addonGroups: ["AG-03"],
  }),
  m("Sev Tameta", "Gujarati", "Gujarati Curries/Shaak", V, 150, 45, {
    addonGroups: ["AG-03"],
  }),
  m("Dudhi Chana", "Gujarati", "Gujarati Curries/Shaak", V, 140, 40, {
    addonGroups: ["AG-03"],
  }),
  m("Bhindi Masala", "Gujarati", "Gujarati Curries/Shaak", V, 160, 50, {
    addonGroups: ["AG-03"],
  }),
  m("Val Papdi Shaak", "Gujarati", "Gujarati Curries/Shaak", V, 150, 45),
  m("Ringan Bataka", "Gujarati", "Gujarati Curries/Shaak", V, 140, 40),
  m("Tindora Shaak", "Gujarati", "Gujarati Curries/Shaak", V, 130, 38),
  m("Guvar Shaak", "Gujarati", "Gujarati Curries/Shaak", V, 130, 38),
  m("Papdi Lilva", "Gujarati", "Gujarati Curries/Shaak", V, 160, 50),
  m("Gujarati Dal", "Gujarati", "Gujarati Curries/Shaak", V, 120, 30),
  m("Kadhi", "Gujarati", "Gujarati Curries/Shaak", V, 110, 28),
  m("Turiya Papdi", "Gujarati", "Gujarati Curries/Shaak", V, 140, 42),
  m("Chana Masala", "Gujarati", "Gujarati Curries/Shaak", V, 150, 45),
  m("Aloo Shaak", "Gujarati", "Gujarati Curries/Shaak", V, 120, 30),
  m("Sev Bhaji", "Gujarati", "Gujarati Curries/Shaak", V, 130, 35),

  // ── Kathiyawadi Specials ──
  m("Lasaniya Bataka", "Gujarati", "Kathiyawadi Specials", V, 160, 50, {
    tags: ["spicy"],
  }),
  m("Kathiyawadi Sev Tameta", "Gujarati", "Kathiyawadi Specials", V, 150, 45, {
    tags: ["spicy"],
  }),
  m("Dungli Bhajiya", "Gujarati", "Kathiyawadi Specials", V, 100, 30),
  m("Khichdi", "Gujarati", "Kathiyawadi Specials", V, 120, 30),
  m("Kadhi Khichdi", "Gujarati", "Kathiyawadi Specials", V, 150, 40),
  m("Dal Dhokli", "Gujarati", "Kathiyawadi Specials", V, 140, 38),
  m("Rotla", "Gujarati", "Kathiyawadi Specials", V, 30, 8),
  m("Chaas", "Gujarati", "Kathiyawadi Specials", V, 40, 10, {
    station: "Beverage",
  }),
  m("Kathiyawadi Thepla", "Gujarati", "Kathiyawadi Specials", V, 80, 20),
  m("Ghee Rotla", "Gujarati", "Kathiyawadi Specials", V, 50, 15),
  m("Bajra Rotla", "Gujarati", "Kathiyawadi Specials", V, 40, 10),
  m("Sukha Bhaji", "Gujarati", "Kathiyawadi Specials", V, 130, 35),

  // ── Gujarati Kadhi & Dal ──
  m("Gujarati Kadhi", "Gujarati", "Gujarati Kadhi & Dal", V, 120, 30),
  m("Toor Dal", "Gujarati", "Gujarati Kadhi & Dal", V, 110, 28),
  m("Panchmel Dal", "Gujarati", "Gujarati Kadhi & Dal", V, 130, 35),
  m("Moong Dal", "Gujarati", "Gujarati Kadhi & Dal", V, 110, 28),
  m("Dal Fry Gujarati Style", "Gujarati", "Gujarati Kadhi & Dal", V, 130, 32),
  m("Khatti Meethi Dal", "Gujarati", "Gujarati Kadhi & Dal", V, 120, 30),
  m("Kadhi Pakoda", "Gujarati", "Gujarati Kadhi & Dal", V, 140, 38),
  m("Sweet Kadhi", "Gujarati", "Gujarati Kadhi & Dal", V, 110, 28),
  m("Boondi Kadhi", "Gujarati", "Gujarati Kadhi & Dal", V, 120, 30),
  m("Masoor Dal", "Gujarati", "Gujarati Kadhi & Dal", V, 110, 28),

  // ── Rotli/Bhakri/Puri (Breads) ──
  m("Rotli", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 20, 5, {
    station: "Tandoor",
  }),
  m("Bhakri", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 25, 7, {
    station: "Tandoor",
  }),
  m("Puri", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 30, 8, {
    station: "Tandoor",
  }),
  m("Methi Puri", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 40, 10, {
    station: "Tandoor",
  }),
  m("Masala Puri", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 40, 10, {
    station: "Tandoor",
  }),
  m("Bajra Bhakri", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 30, 8, {
    station: "Tandoor",
  }),
  m("Jowar Bhakri", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 30, 8, {
    station: "Tandoor",
  }),
  m("Thepla", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 40, 10, {
    station: "Tandoor",
  }),
  m("Missi Rotli", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 35, 10, {
    station: "Tandoor",
  }),
  m("Puran Poli", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 60, 18, {
    station: "Tandoor",
  }),
  m("Ghee Rotli", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 30, 8, {
    station: "Tandoor",
  }),
  m("Ajwain Puri", "Gujarati", "Rotli/Bhakri/Puri (Breads)", V, 35, 10, {
    station: "Tandoor",
  }),

  // ── Gujarati Sweets ──
  m("Mohanthal", "Gujarati", "Gujarati Sweets", V, 80, 30, {
    station: "Desserts",
  }),
  m("Basundi", "Gujarati", "Gujarati Sweets", V, 100, 35, {
    station: "Desserts",
    tags: ["bestseller"],
  }),
  m("Shrikhand", "Gujarati", "Gujarati Sweets", V, 90, 30, {
    station: "Desserts",
  }),
  m("Amrakhand", "Gujarati", "Gujarati Sweets", V, 110, 38, {
    station: "Desserts",
  }),
  m("Gulab Pak", "Gujarati", "Gujarati Sweets", V, 70, 25, {
    station: "Desserts",
  }),
  m("Sukhdi", "Gujarati", "Gujarati Sweets", V, 60, 20, {
    station: "Desserts",
  }),
  m("Doodh Pak", "Gujarati", "Gujarati Sweets", V, 100, 35, {
    station: "Desserts",
  }),
  m("Ghari", "Gujarati", "Gujarati Sweets", V, 80, 30, { station: "Desserts" }),
  m("Ladwa", "Gujarati", "Gujarati Sweets", V, 60, 20, { station: "Desserts" }),
  m("Magaj", "Gujarati", "Gujarati Sweets", V, 70, 25, { station: "Desserts" }),
  m("Suterfeni", "Gujarati", "Gujarati Sweets", V, 90, 30, {
    station: "Desserts",
  }),
  m("Malpua", "Gujarati", "Gujarati Sweets", V, 80, 28, {
    station: "Desserts",
  }),
  m("Rasavala", "Gujarati", "Gujarati Sweets", V, 70, 22, {
    station: "Desserts",
  }),
  m("Kansar", "Gujarati", "Gujarati Sweets", V, 60, 18, {
    station: "Desserts",
  }),

  // ═══════════════════════════════════════════════
  // 2. SOUTH INDIAN
  // ═══════════════════════════════════════════════

  // ── Dosa Varieties ──
  m("Plain Dosa", "South Indian", "Dosa Varieties", V, 100, 25),
  m("Masala Dosa", "South Indian", "Dosa Varieties", V, 130, 35, {
    tags: ["bestseller"],
  }),
  m("Mysore Masala Dosa", "South Indian", "Dosa Varieties", V, 150, 40, {
    tags: ["spicy"],
  }),
  m("Rava Dosa", "South Indian", "Dosa Varieties", V, 130, 35),
  m("Paper Dosa", "South Indian", "Dosa Varieties", V, 120, 30),
  m("Onion Dosa", "South Indian", "Dosa Varieties", V, 120, 32),
  m("Set Dosa", "South Indian", "Dosa Varieties", V, 110, 28),
  m("Ghee Dosa", "South Indian", "Dosa Varieties", V, 130, 35),
  m("Cheese Dosa", "South Indian", "Dosa Varieties", V, 160, 45),
  m("Podi Dosa", "South Indian", "Dosa Varieties", V, 130, 35),
  m("Pesarattu", "South Indian", "Dosa Varieties", V, 120, 30),
  m("Neer Dosa", "South Indian", "Dosa Varieties", V, 110, 28),
  m("Rava Onion Dosa", "South Indian", "Dosa Varieties", V, 140, 38),
  m("Spring Dosa", "South Indian", "Dosa Varieties", V, 150, 42),

  // ── Idli & Vada ──
  m("Idli", "South Indian", "Idli & Vada", V, 80, 18),
  m("Rava Idli", "South Indian", "Idli & Vada", V, 90, 22),
  m("Sambar Vada", "South Indian", "Idli & Vada", V, 100, 25),
  m("Medu Vada", "South Indian", "Idli & Vada", V, 90, 22, {
    tags: ["bestseller"],
  }),
  m("Dahi Vada", "South Indian", "Idli & Vada", V, 100, 25),
  m("Mini Idli", "South Indian", "Idli & Vada", V, 90, 20),
  m("Idli Chilli", "South Indian", "Idli & Vada", V, 110, 28),
  m("Podi Idli", "South Indian", "Idli & Vada", V, 100, 25),
  m("Rasam Vada", "South Indian", "Idli & Vada", V, 100, 25),
  m("Curd Vada", "South Indian", "Idli & Vada", V, 100, 25),
  m("Steamed Idli Plate", "South Indian", "Idli & Vada", V, 80, 18),
  m("Idli Fry", "South Indian", "Idli & Vada", V, 110, 28),

  // ── Uttapam Varieties ──
  m("Plain Uttapam", "South Indian", "Uttapam Varieties", V, 100, 25),
  m("Onion Uttapam", "South Indian", "Uttapam Varieties", V, 120, 30),
  m("Tomato Uttapam", "South Indian", "Uttapam Varieties", V, 120, 30),
  m("Mixed Veg Uttapam", "South Indian", "Uttapam Varieties", V, 140, 38),
  m("Cheese Uttapam", "South Indian", "Uttapam Varieties", V, 160, 45),
  m("Podi Uttapam", "South Indian", "Uttapam Varieties", V, 130, 35),
  m("Masala Uttapam", "South Indian", "Uttapam Varieties", V, 130, 35),
  m("Paneer Uttapam", "South Indian", "Uttapam Varieties", V, 150, 42),
  m("Corn Uttapam", "South Indian", "Uttapam Varieties", V, 140, 38),
  m("Capsicum Uttapam", "South Indian", "Uttapam Varieties", V, 130, 35),

  // ── Rice Specials ──
  m("Curd Rice", "South Indian", "Rice Specials", V, 100, 22),
  m("Lemon Rice", "South Indian", "Rice Specials", V, 110, 25),
  m("Bisi Bele Bath", "South Indian", "Rice Specials", V, 140, 38),
  m("Tamarind Rice", "South Indian", "Rice Specials", V, 110, 25),
  m("Coconut Rice", "South Indian", "Rice Specials", V, 120, 28),
  m("Tomato Rice", "South Indian", "Rice Specials", V, 110, 25),
  m("Pulihora", "South Indian", "Rice Specials", V, 110, 25),
  m("Sambar Rice", "South Indian", "Rice Specials", V, 120, 28),
  m("Rasam Rice", "South Indian", "Rice Specials", V, 110, 25),
  m("Vangi Bath", "South Indian", "Rice Specials", V, 130, 35),
  m("Jeera Rice South Style", "South Indian", "Rice Specials", V, 110, 25),
  m("Ghee Rice", "South Indian", "Rice Specials", V, 130, 30),
  // ── South Indian Curries ──
  m("Sambar", "South Indian", "South Indian Curries", V, 100, 25, {
    tags: ["bestseller"],
  }),
  m("Rasam", "South Indian", "South Indian Curries", V, 80, 18),
  m("Kootu", "South Indian", "South Indian Curries", V, 120, 30),
  m("Avial", "South Indian", "South Indian Curries", V, 140, 38),
  m("Kara Kuzhambu", "South Indian", "South Indian Curries", V, 130, 35, {
    tags: ["spicy"],
  }),
  m("Mysore Rasam", "South Indian", "South Indian Curries", V, 90, 22),
  m("Vegetable Kurma", "South Indian", "South Indian Curries", V, 150, 42),
  m("Poriyal", "South Indian", "South Indian Curries", V, 110, 28),
  m("Tomato Rasam", "South Indian", "South Indian Curries", V, 80, 18),
  m("Pepper Rasam", "South Indian", "South Indian Curries", V, 90, 20),
  m("Chettinad Curry", "South Indian", "South Indian Curries", V, 180, 55, {
    tags: ["spicy"],
  }),
  m(
    "Dal Palak South Style",
    "South Indian",
    "South Indian Curries",
    V,
    130,
    32,
  ),
  // ── Chutneys & Podi ──
  m("Coconut Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Tomato Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Mint Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Peanut Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Garlic Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Idli Podi", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Gunpowder Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Coriander Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Onion Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  m("Ginger Chutney", "South Indian", "Chutneys & Podi", V, 30, 8),
  // ── South Indian Filter Coffee ──
  m("Filter Coffee", "South Indian", "South Indian Filter Coffee", V, 50, 12, {
    station: "Beverage",
  }),
  m("Madras Coffee", "South Indian", "South Indian Filter Coffee", V, 60, 15, {
    station: "Beverage",
  }),
  m("Degree Coffee", "South Indian", "South Indian Filter Coffee", V, 60, 15, {
    station: "Beverage",
  }),
  m(
    "Iced Filter Coffee",
    "South Indian",
    "South Indian Filter Coffee",
    V,
    80,
    20,
    { station: "Beverage" },
  ),
  m(
    "Kumbakonam Coffee",
    "South Indian",
    "South Indian Filter Coffee",
    V,
    70,
    18,
    { station: "Beverage" },
  ),
  m(
    "South Indian Milk Coffee",
    "South Indian",
    "South Indian Filter Coffee",
    V,
    50,
    12,
    { station: "Beverage" },
  ),
  m(
    "Black Coffee South Style",
    "South Indian",
    "South Indian Filter Coffee",
    V,
    40,
    10,
    { station: "Beverage" },
  ),
  // ═══════════════════════════════════════════════
  // 3. PUNJABI
  // ═══════════════════════════════════════════════
  // ── Punjabi Sabzi/Curries ──
  m("Dal Makhani", "Punjabi", "Punjabi Sabzi/Curries", V, 260, 70, {
    tags: ["chef-special"],
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Chole", "Punjabi", "Punjabi Sabzi/Curries", V, 200, 55, {
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Rajma", "Punjabi", "Punjabi Sabzi/Curries", V, 200, 55, {
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Sarson da Saag", "Punjabi", "Punjabi Sabzi/Curries", V, 220, 65, {
    tags: ["chef-special"],
    addonGroups: ["AG-03"],
  }),
  m("Aloo Gobi", "Punjabi", "Punjabi Sabzi/Curries", V, 180, 50, {
    addonGroups: ["AG-03"],
  }),
  m("Kadhi Pakora", "Punjabi", "Punjabi Sabzi/Curries", V, 180, 48, {
    addonGroups: ["AG-03"],
  }),
  m("Baingan Bharta", "Punjabi", "Punjabi Sabzi/Curries", V, 180, 50, {
    addonGroups: ["AG-03"],
  }),
  m("Aloo Paratha Sabzi", "Punjabi", "Punjabi Sabzi/Curries", V, 160, 45),
  m("Punjabi Chole Masala", "Punjabi", "Punjabi Sabzi/Curries", V, 210, 58, {
    tags: ["spicy"],
  }),
  m("Amritsari Dal", "Punjabi", "Punjabi Sabzi/Curries", V, 200, 55),
  m("Makki di Dal", "Punjabi", "Punjabi Sabzi/Curries", V, 180, 48),
  m("Chana Masala Punjabi", "Punjabi", "Punjabi Sabzi/Curries", V, 190, 52),
  m("Kali Dal", "Punjabi", "Punjabi Sabzi/Curries", V, 200, 55),

  // ── Tandoori Roti/Naan/Kulcha ──
  m("Tandoori Roti", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 40, 8, {
    station: "Tandoor",
  }),
  m("Butter Naan", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 60, 15, {
    station: "Tandoor",
  }),
  m("Garlic Naan", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 80, 20, {
    tags: ["bestseller"],
    station: "Tandoor",
  }),
  m("Plain Kulcha", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 60, 15, {
    station: "Tandoor",
  }),
  m("Aloo Kulcha", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 80, 22, {
    station: "Tandoor",
  }),
  m("Paneer Kulcha", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 90, 25, {
    station: "Tandoor",
  }),
  m("Missi Roti", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 50, 12, {
    station: "Tandoor",
  }),
  m("Laccha Paratha", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 70, 18, {
    station: "Tandoor",
  }),
  m("Rumali Roti", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 50, 12, {
    station: "Tandoor",
  }),
  m("Cheese Naan", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 100, 30, {
    station: "Tandoor",
  }),
  m("Onion Kulcha", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 70, 18, {
    station: "Tandoor",
  }),
  m("Stuffed Naan", "Punjabi", "Tandoori Roti/Naan/Kulcha", V, 90, 25, {
    station: "Tandoor",
  }),
  // ── Punjabi Paneer Specials ──
  m("Paneer Butter Masala", "Punjabi", "Punjabi Paneer Specials", V, 300, 100, {
    tags: ["bestseller"],
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Palak Paneer", "Punjabi", "Punjabi Paneer Specials", V, 280, 90, {
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Kadai Paneer", "Punjabi", "Punjabi Paneer Specials", V, 280, 90, {
    addonGroups: ["AG-03"],
  }),
  m("Paneer Tikka Masala", "Punjabi", "Punjabi Paneer Specials", V, 300, 100, {
    addonGroups: ["AG-03"],
  }),
  m("Shahi Paneer", "Punjabi", "Punjabi Paneer Specials", V, 290, 95, {
    addonGroups: ["AG-03"],
  }),
  m("Paneer Bhurji", "Punjabi", "Punjabi Paneer Specials", V, 250, 80, {
    addonGroups: ["AG-03"],
  }),
  m("Matar Paneer", "Punjabi", "Punjabi Paneer Specials", V, 260, 85, {
    addonGroups: ["AG-03"],
  }),
  m("Paneer Lababdar", "Punjabi", "Punjabi Paneer Specials", V, 300, 100),
  m("Paneer Do Pyaza", "Punjabi", "Punjabi Paneer Specials", V, 280, 90),
  m("Paneer Handi", "Punjabi", "Punjabi Paneer Specials", V, 290, 95),
  m("Achari Paneer", "Punjabi", "Punjabi Paneer Specials", V, 280, 90, {
    tags: ["spicy"],
  }),

  // ── Lassi & Punjabi Drinks ──
  m("Sweet Lassi", "Punjabi", "Lassi & Punjabi Drinks", V, 80, 20, {
    station: "Beverage",
  }),
  m("Salted Lassi", "Punjabi", "Lassi & Punjabi Drinks", V, 70, 18, {
    station: "Beverage",
  }),
  m("Mango Lassi", "Punjabi", "Lassi & Punjabi Drinks", V, 120, 30, {
    tags: ["bestseller"],
    station: "Beverage",
  }),
  m("Punjabi Chaas", "Punjabi", "Lassi & Punjabi Drinks", V, 50, 12, {
    station: "Beverage",
  }),
  m("Kesar Lassi", "Punjabi", "Lassi & Punjabi Drinks", V, 100, 28, {
    station: "Beverage",
  }),
  m("Rose Lassi", "Punjabi", "Lassi & Punjabi Drinks", V, 90, 25, {
    station: "Beverage",
  }),
  m("Thandai", "Punjabi", "Lassi & Punjabi Drinks", V, 100, 28, {
    station: "Beverage",
  }),
  m("Namkeen Lassi", "Punjabi", "Lassi & Punjabi Drinks", V, 70, 18, {
    station: "Beverage",
  }),
  m("Banana Lassi", "Punjabi", "Lassi & Punjabi Drinks", V, 90, 25, {
    station: "Beverage",
  }),
  m(
    "Bhang Lassi (Alcohol-Free)",
    "Punjabi",
    "Lassi & Punjabi Drinks",
    V,
    110,
    30,
    { station: "Beverage" },
  ),
  // ── Punjabi Snacks ──
  m("Amritsari Kulcha Chole", "Punjabi", "Punjabi Snacks", V, 180, 55, {
    tags: ["bestseller"],
    station: "Snacks",
  }),
  m("Punjabi Samosa", "Punjabi", "Punjabi Snacks", V, 50, 15, {
    station: "Snacks",
  }),
  m("Aloo Tikki", "Punjabi", "Punjabi Snacks", V, 80, 22, {
    station: "Snacks",
  }),
  m("Pakora Platter", "Punjabi", "Punjabi Snacks", V, 150, 40, {
    station: "Snacks",
  }),
  m("Punjabi Pakoda", "Punjabi", "Punjabi Snacks", V, 100, 28, {
    station: "Snacks",
  }),
  m("Onion Bhaji", "Punjabi", "Punjabi Snacks", V, 90, 25, {
    station: "Snacks",
  }),
  m("Stuffed Paratha", "Punjabi", "Punjabi Snacks", V, 100, 28, {
    station: "Snacks",
  }),
  m("Bharwa Mirch", "Punjabi", "Punjabi Snacks", V, 120, 35, {
    station: "Snacks",
  }),
  m("Punjabi Papad", "Punjabi", "Punjabi Snacks", V, 40, 10, {
    station: "Snacks",
  }),
  m("Dahi Bhalla", "Punjabi", "Punjabi Snacks", V, 100, 28, {
    station: "Snacks",
  }),
  // ── Punjabi Combo Thali ──
  m("Regular Punjabi Thali", "Punjabi", "Punjabi Combo Thali", V, 300, 120, {
    tags: ["combo"],
  }),
  m("Deluxe Thali", "Punjabi", "Punjabi Combo Thali", V, 450, 180, {
    tags: ["combo"],
  }),
  m("Sarson Saag Thali", "Punjabi", "Punjabi Combo Thali", V, 350, 140, {
    tags: ["combo", "chef-special"],
  }),
  m("Chole Kulcha Combo", "Punjabi", "Punjabi Combo Thali", V, 200, 70, {
    tags: ["combo"],
  }),
  m("Rajma Chawal Combo", "Punjabi", "Punjabi Combo Thali", V, 200, 70, {
    tags: ["combo"],
  }),
  m("Dal Makhani Combo", "Punjabi", "Punjabi Combo Thali", V, 250, 90, {
    tags: ["combo"],
  }),
  m("Family Thali", "Punjabi", "Punjabi Combo Thali", V, 900, 350, {
    tags: ["combo"],
  }),
  m("Special Non-Veg Thali", "Punjabi", "Punjabi Combo Thali", NV, 500, 200, {
    tags: ["combo"],
  }),
  // ═══════════════════════════════════════════════
  // 4. CHINESE (Indo-Chinese)
  // ═══════════════════════════════════════════════
  // ── Soups ──
  m("Manchow Soup", "Chinese", "Soups", V, 120, 30, { addonGroups: ["AG-03"] }),
  m("Sweet Corn Soup", "Chinese", "Soups", V, 110, 28),
  m("Hot & Sour Soup", "Chinese", "Soups", V, 120, 30, { tags: ["spicy"] }),
  m("Lung Fung Soup", "Chinese", "Soups", NV, 150, 42),
  m("Tom Yum Soup", "Chinese", "Soups", V, 140, 38),
  m("Clear Soup", "Chinese", "Soups", V, 100, 22),
  m("Chicken Manchow Soup", "Chinese", "Soups", NV, 150, 42),
  m("Wonton Soup", "Chinese", "Soups", NV, 160, 45),
  m("Talumein Soup", "Chinese", "Soups", V, 130, 35),
  m("Burnt Garlic Soup", "Chinese", "Soups", V, 120, 30),
  // ── Starters ──
  m("Veg Manchurian", "Chinese", "Starters", V, 220, 65, {
    addonGroups: ["AG-03"],
    variants: [
      { id: "V-13", name: "Half", price: 160 },
      { id: "V-14", name: "Full", price: 280 },
      { id: "V-CM1", name: "Dry", price: 220 },
      { id: "V-CM2", name: "Gravy", price: 240 },
    ],
  }),
  m(
    "Chilli Paneer",
    "Chinese",
    "Starters",
    V,
    260,
    80,
    {
      tags: ["spicy"],
      addonGroups: ["AG-03"],
      addons: ["Raita", "Salan"],
      tags: [],
      description:
        "Fragrant basmati rice layered with mixed vegetables and spices",
      station: "Main Kitchen",
      preparationTime: 20,
    },
    {
      id: "M-3002",
      name: "Chicken Biryani",
      category: "Biryani & Rice",
      foodType: FOOD_TYPE.NON_VEG,
      status: MENU_STATUS.ACTIVE,
      pricing: { sellingPrice: 350, costPrice: 120 },
      tax: {
        category: "GST",
        percentage: 5,
        included: false,
        hsnCode: "996331",
      },
      variants: [
        { id: "V-15", name: "Half", price: 200 },
        { id: "V-16", name: "Full", price: 350 },
        { id: "V-CP1", name: "Dry", price: 260 },
        { id: "V-CP2", name: "Gravy", price: 280 },
      ],
    },
  ),
  m("Chilli Chicken", "Chinese", "Starters", NV, 280, 90, {
    tags: ["spicy", "bestseller"],
    addonGroups: ["AG-03"],
    addons: ["Raita", "Salan", "Extra Leg Piece"],
  }),
  m("Spring Roll", "Chinese", "Starters", V, 180, 50),
  m("Chicken 65", "Chinese", "Starters", NV, 260, 80, { tags: ["spicy"] }),
  m("Crispy Corn", "Chinese", "Starters", V, 200, 55),
  m("Honey Chilli Potato", "Chinese", "Starters", V, 220, 60),
  m("Paneer 65", "Chinese", "Starters", V, 240, 70),
  m("Golden Fried Prawns", "Chinese", "Starters", NV, 350, 130),
  m("Veg Crispy", "Chinese", "Starters", V, 200, 55),
  m("Dragon Chicken", "Chinese", "Starters", NV, 300, 100, { tags: ["spicy"] }),
  m("Chicken Lollipop", "Chinese", "Starters", NV, 280, 90, {
    tags: ["bestseller"],
  }),
  m("American Chopsuey", "Chinese", "Starters", V, 220, 65),

  // ── Noodles ──
  m("Hakka Noodles", "Chinese", "Noodles", V, 200, 55, {
    addonGroups: ["AG-03"],
  }),
  m("Schezwan Noodles", "Chinese", "Noodles", V, 220, 60, {
    tags: ["spicy"],
    addonGroups: ["AG-03"],
  }),
  m("Singapore Noodles", "Chinese", "Noodles", V, 230, 65),
  m("Chilli Garlic Noodles", "Chinese", "Noodles", V, 220, 60, {
    tags: ["spicy"],
  }),
  m("Triple Schezwan Noodles", "Chinese", "Noodles", V, 260, 75),
  m("Veg Noodles", "Chinese", "Noodles", V, 190, 50),
  m("Chicken Noodles", "Chinese", "Noodles", NV, 250, 75),
  m("Egg Noodles", "Chinese", "Noodles", EG, 220, 60),
  m("Manchurian Noodles", "Chinese", "Noodles", V, 240, 65),
  m("Thai Noodles", "Chinese", "Noodles", V, 230, 65),
  // ── Fried Rice Varieties ──
  m("Veg Fried Rice", "Chinese", "Fried Rice Varieties", V, 200, 50),
  m("Schezwan Fried Rice", "Chinese", "Fried Rice Varieties", V, 220, 55, {
    tags: ["spicy"],
  }),
  m("Egg Fried Rice", "Chinese", "Fried Rice Varieties", EG, 220, 55),
  m("Chicken Fried Rice", "Chinese", "Fried Rice Varieties", NV, 260, 75),
  m("Triple Fried Rice", "Chinese", "Fried Rice Varieties", V, 250, 70),
  m("Mushroom Fried Rice", "Chinese", "Fried Rice Varieties", V, 220, 58),
  m("Burnt Garlic Fried Rice", "Chinese", "Fried Rice Varieties", V, 220, 55),
  m("Singapore Fried Rice", "Chinese", "Fried Rice Varieties", V, 230, 60),
  m("Thai Fried Rice", "Chinese", "Fried Rice Varieties", V, 230, 60),
  m("Paneer Fried Rice", "Chinese", "Fried Rice Varieties", V, 240, 65),
  // ── Main Course Gravies ──
  m("Manchurian Gravy", "Chinese", "Main Course Gravies", V, 240, 70),
  m("Chilli Gravy", "Chinese", "Main Course Gravies", V, 230, 65, {
    tags: ["spicy"],
  }),
  m("Schezwan Gravy", "Chinese", "Main Course Gravies", V, 240, 70, {
    tags: ["spicy"],
  }),
  m("Hot Garlic Gravy", "Chinese", "Main Course Gravies", V, 240, 70),
  m("Sweet & Sour Gravy", "Chinese", "Main Course Gravies", V, 230, 65),
  m("Chilli Chicken Gravy", "Chinese", "Main Course Gravies", NV, 280, 90),
  m("Paneer Manchurian Gravy", "Chinese", "Main Course Gravies", V, 260, 80),
  m("Garlic Chicken Gravy", "Chinese", "Main Course Gravies", NV, 280, 90),
  m("Black Bean Gravy", "Chinese", "Main Course Gravies", V, 250, 72),
  m("Oyster Sauce Gravy", "Chinese", "Main Course Gravies", NV, 280, 85),
  // ── Momos ──
  m("Steamed Veg Momos", "Chinese", "Momos", V, 150, 40),
  m("Fried Veg Momos", "Chinese", "Momos", V, 170, 45),
  m("Chicken Momos", "Chinese", "Momos", NV, 180, 50, { tags: ["bestseller"] }),
  m("Paneer Momos", "Chinese", "Momos", V, 180, 50),
  m("Corn Cheese Momos", "Chinese", "Momos", V, 190, 52),
  m("Tandoori Momos", "Chinese", "Momos", V, 200, 55, { tags: ["new"] }),
  m("Chilli Momos", "Chinese", "Momos", V, 180, 48, { tags: ["spicy"] }),
  m("Schezwan Momos", "Chinese", "Momos", V, 180, 48, { tags: ["spicy"] }),
  m("Kurkure Momos", "Chinese", "Momos", V, 200, 55, { tags: ["new"] }),
  m("Pan Fried Momos", "Chinese", "Momos", V, 180, 48),
  // ═══════════════════════════════════════════════
  // 5. NORTH INDIAN (General)
  // ═══════════════════════════════════════════════
  // ── Paneer Specials ──
  m("Paneer Butter Masala", "North Indian", "Paneer Specials", V, 300, 100, {
    tags: ["bestseller"],
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Palak Paneer", "North Indian", "Paneer Specials", V, 280, 90, {
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Kadai Paneer", "North Indian", "Paneer Specials", V, 280, 90, {
    addonGroups: ["AG-03"],
  }),
  m("Matar Paneer", "North Indian", "Paneer Specials", V, 260, 85, {
    addonGroups: ["AG-03"],
  }),
  m("Paneer Bhurji", "North Indian", "Paneer Specials", V, 250, 80),
  m(
    "Paneer Tikka",
    "North Indian",
    "Paneer Specials",
    V,
    280,
    90,
    {
      station: "Tandoor",
      preparationTime: 5,
    },
    {
      id: "M-4002",
      name: "Garlic Naan",
      category: "Breads",
      foodType: FOOD_TYPE.VEG,
      status: MENU_STATUS.ACTIVE,
      pricing: { sellingPrice: 80, costPrice: 20 },
      tax: {
        category: "GST",
        percentage: 5,
        included: false,
        hsnCode: "996331",
      },
      variants: [],
      addonGroups: [],
      addons: [],
    },
  ),
  m("Shahi Paneer", "North Indian", "Paneer Specials", V, 290, 95),
  m("Paneer Do Pyaza", "North Indian", "Paneer Specials", V, 270, 88),
  m("Methi Paneer", "North Indian", "Paneer Specials", V, 270, 88),
  m("Paneer Korma", "North Indian", "Paneer Specials", V, 280, 90),
  m("Paneer Angara", "North Indian", "Paneer Specials", V, 300, 100, {
    tags: ["spicy"],
  }),
  // ── Dal Varieties ──
  m("Dal Tadka", "North Indian", "Dal Varieties", V, 180, 45, {
    addonGroups: ["AG-02"],
  }),
  m("Dal Fry", "North Indian", "Dal Varieties", V, 170, 42),
  m("Dal Makhani", "North Indian", "Dal Varieties", V, 260, 70, {
    tags: ["bestseller"],
    description: "Naan topped with garlic, coriander and butter",
  }),
  m("Dal Palak", "North Indian", "Dal Varieties", V, 180, 48),
  m("Panchratna Dal", "North Indian", "Dal Varieties", V, 200, 55),
  m("Yellow Dal", "North Indian", "Dal Varieties", V, 150, 35),
  m("Moong Dal", "North Indian", "Dal Varieties", V, 160, 38),
  m("Chana Dal", "North Indian", "Dal Varieties", V, 170, 42),
  m("Langar Wali Dal", "North Indian", "Dal Varieties", V, 180, 45),
  m("Dal Handi", "North Indian", "Dal Varieties", V, 200, 55),
  // ── Vegetable Curries ──
  m("Mix Veg", "North Indian", "Vegetable Curries", V, 200, 55, {
    addonGroups: ["AG-03"],
  }),
  m("Aloo Gobi", "North Indian", "Vegetable Curries", V, 180, 48),
  m("Bhindi Masala", "North Indian", "Vegetable Curries", V, 180, 48),
  m("Baingan Bharta", "North Indian", "Vegetable Curries", V, 190, 52),
  m("Kofta Curry", "North Indian", "Vegetable Curries", V, 250, 80),
  m("Veg Kolhapuri", "North Indian", "Vegetable Curries", V, 220, 65, {
    tags: ["spicy"],
  }),
  m("Jeera Aloo", "North Indian", "Vegetable Curries", V, 160, 40),
  m("Aloo Matar", "North Indian", "Vegetable Curries", V, 170, 42),
  m("Kadhi Pakora", "North Indian", "Vegetable Curries", V, 180, 48),
  m("Veg Handi", "North Indian", "Vegetable Curries", V, 220, 65),
  m("Malai Kofta", "North Indian", "Vegetable Curries", V, 280, 90, {
    tags: ["chef-special"],
  }),
  // ── Non-Veg Curries ──
  m("Butter Chicken", "North Indian", "Non-Veg Curries", NV, 350, 130, {
    tags: ["bestseller"],
    addonGroups: ["AG-02", "AG-03"],
  }),
  m("Chicken Curry", "North Indian", "Non-Veg Curries", NV, 300, 110, {
    addonGroups: ["AG-03"],
  }),
  m("Mutton Curry", "North Indian", "Non-Veg Curries", NV, 400, 170, {
    addonGroups: ["AG-03"],
  }),
  m("Chicken Tikka Masala", "North Indian", "Non-Veg Curries", NV, 340, 125),
  m("Kadai Chicken", "North Indian", "Non-Veg Curries", NV, 320, 120),
  m("Rogan Josh", "North Indian", "Non-Veg Curries", NV, 420, 180, {
    tags: ["spicy"],
  }),
  m("Chicken Korma", "North Indian", "Non-Veg Curries", NV, 320, 115),
  m("Egg Curry", "North Indian", "Non-Veg Curries", EG, 200, 60),
  m("Mutton Rogan Josh", "North Indian", "Non-Veg Curries", NV, 420, 180),
  m("Handi Chicken", "North Indian", "Non-Veg Curries", NV, 340, 125),
  m("Chicken Do Pyaza", "North Indian", "Non-Veg Curries", NV, 320, 115),
  // ── Breads ──
  m("Naan", "North Indian", "Breads", V, 50, 12, { station: "Tandoor" }),
  m("Tandoori Roti", "North Indian", "Breads", V, 40, 8, {
    station: "Tandoor",
  }),
  m("Paratha", "North Indian", "Breads", V, 60, 15, { station: "Tandoor" }),
  m("Butter Roti", "North Indian", "Breads", V, 40, 10, { station: "Tandoor" }),
  m("Garlic Naan", "North Indian", "Breads", V, 80, 20, {
    tags: ["bestseller"],
    station: "Tandoor",
  }),
  m("Missi Roti", "North Indian", "Breads", V, 50, 12, { station: "Tandoor" }),
  m("Lachha Paratha", "North Indian", "Breads", V, 70, 18, {
    station: "Tandoor",
  }),
  m("Kulcha", "North Indian", "Breads", V, 60, 15, { station: "Tandoor" }),
  m("Rumali Roti", "North Indian", "Breads", V, 50, 12, { station: "Tandoor" }),
  m("Aloo Paratha", "North Indian", "Breads", V, 80, 22, {
    station: "Tandoor",
  }),
  // ── Rice & Biryani ──
  m("Jeera Rice", "North Indian", "Rice & Biryani", V, 140, 30),
  m("Veg Pulao", "North Indian", "Rice & Biryani", V, 180, 45),
  m("Kashmiri Pulao", "North Indian", "Rice & Biryani", V, 200, 55),
  m("Chicken Biryani", "North Indian", "Rice & Biryani", NV, 320, 120, {
    tags: ["bestseller"],
  }),
  m("Mutton Biryani", "North Indian", "Rice & Biryani", NV, 400, 170),
  m("Veg Biryani", "North Indian", "Rice & Biryani", V, 250, 80),
  m("Peas Pulao", "North Indian", "Rice & Biryani", V, 170, 40),
  m("Curd Rice", "North Indian", "Rice & Biryani", V, 120, 25),
  m("Steamed Rice", "North Indian", "Rice & Biryani", V, 100, 20),
  m("Fried Rice North Style", "North Indian", "Rice & Biryani", V, 200, 50),
  // ═══════════════════════════════════════════════
  // 6. CONTINENTAL/ITALIAN
  // ═══════════════════════════════════════════════
  // ── Soups ──
  m("Cream of Tomato", "Continental/Italian", "Soups", V, 150, 40, {
    station: "Continental",
  }),
  m("Mushroom Soup", "Continental/Italian", "Soups", V, 160, 42, {
    station: "Continental",
  }),
  m("Minestrone", "Continental/Italian", "Soups", V, 170, 45, {
    station: "Continental",
  }),
  m("Cream of Broccoli", "Continental/Italian", "Soups", V, 170, 45, {
    station: "Continental",
  }),
  m("Chicken Soup", "Continental/Italian", "Soups", NV, 180, 50, {
    station: "Continental",
  }),
  m("French Onion Soup", "Continental/Italian", "Soups", V, 160, 42, {
    station: "Continental",
  }),
  m("Sweet Corn Chicken Soup", "Continental/Italian", "Soups", NV, 170, 48, {
    station: "Continental",
  }),
  m("Pumpkin Soup", "Continental/Italian", "Soups", V, 160, 42, {
    station: "Continental",
  }),
  m("Vegetable Clear Soup", "Continental/Italian", "Soups", V, 140, 35, {
    station: "Continental",
  }),
  m("Garlic Soup", "Continental/Italian", "Soups", V, 150, 40, {
    station: "Continental",
  }),
  // ── Salads ──
  m("Caesar Salad", "Continental/Italian", "Salads", V, 220, 70, {
    station: "Continental",
  }),
  m("Greek Salad", "Continental/Italian", "Salads", V, 200, 65, {
    station: "Continental",
  }),
  m("Garden Salad", "Continental/Italian", "Salads", V, 180, 55, {
    station: "Continental",
  }),
  m("Pasta Salad", "Continental/Italian", "Salads", V, 200, 60, {
    station: "Continental",
  }),
  m("Coleslaw", "Continental/Italian", "Salads", V, 120, 30, {
    station: "Continental",
  }),
  m("Fruit Salad", "Continental/Italian", "Salads", V, 150, 45, {
    station: "Continental",
  }),
  m("Sprout Salad", "Continental/Italian", "Salads", V, 160, 45, {
    station: "Continental",
  }),
  m("Chicken Salad", "Continental/Italian", "Salads", NV, 250, 80, {
    station: "Continental",
  }),
  m("Russian Salad", "Continental/Italian", "Salads", V, 200, 60, {
    station: "Continental",
  }),
  m("Cottage Cheese Salad", "Continental/Italian", "Salads", V, 220, 70, {
    station: "Continental",
  }),
  // ── Pasta & Pizza ──
  m("White Sauce Pasta", "Continental/Italian", "Pasta & Pizza", V, 250, 75, {
    station: "Continental",
  }),
  m("Red Sauce Pasta", "Continental/Italian", "Pasta & Pizza", V, 240, 70, {
    station: "Continental",
  }),
  m("Alfredo Pasta", "Continental/Italian", "Pasta & Pizza", V, 280, 85, {
    station: "Continental",
  }),
  m("Pesto Pasta", "Continental/Italian", "Pasta & Pizza", V, 280, 85, {
    station: "Continental",
  }),
  m("Margherita Pizza", "Continental/Italian", "Pasta & Pizza", V, 299, 100, {
    tags: ["bestseller"],
    addonGroups: ["AG-01"],
    station: "Continental",
  }),
  m("Farmhouse Pizza", "Continental/Italian", "Pasta & Pizza", V, 349, 120, {
    addonGroups: ["AG-01"],
    station: "Continental",
  }),
  m("Pepperoni Pizza", "Continental/Italian", "Pasta & Pizza", NV, 399, 140, {
    addonGroups: ["AG-01"],
    station: "Continental",
  }),
  m("BBQ Chicken Pizza", "Continental/Italian", "Pasta & Pizza", NV, 399, 140, {
    station: "Continental",
  }),
  m(
    "Veggie Supreme Pizza",
    "Continental/Italian",
    "Pasta & Pizza",
    V,
    379,
    130,
    { station: "Continental" },
  ),
  m("Mac & Cheese", "Continental/Italian", "Pasta & Pizza", V, 260, 80, {
    station: "Continental",
  }),
  m("Penne Arrabiata", "Continental/Italian", "Pasta & Pizza", V, 260, 78, {
    tags: ["spicy"],
    station: "Continental",
  }),
  // ── Sandwiches & Burgers ──
  m(
    "Veg Grilled Sandwich",
    "Continental/Italian",
    "Sandwiches & Burgers",
    V,
    150,
    40,
    { station: "Continental" },
  ),
  m(
    "Club Sandwich",
    "Continental/Italian",
    "Sandwiches & Burgers",
    NV,
    220,
    70,
    { station: "Continental" },
  ),
  m(
    "Cheese Sandwich",
    "Continental/Italian",
    "Sandwiches & Burgers",
    V,
    130,
    35,
    { station: "Continental" },
  ),
  m(
    "Chicken Burger",
    "Continental/Italian",
    "Sandwiches & Burgers",
    NV,
    250,
    80,
    { tags: ["bestseller"], station: "Continental" },
  ),
  m("Veg Burger", "Continental/Italian", "Sandwiches & Burgers", V, 180, 55, {
    station: "Continental",
  }),
  m(
    "Paneer Burger",
    "Continental/Italian",
    "Sandwiches & Burgers",
    V,
    200,
    60,
    { station: "Continental" },
  ),
  m(
    "BBQ Chicken Sandwich",
    "Continental/Italian",
    "Sandwiches & Burgers",
    NV,
    230,
    75,
    { station: "Continental" },
  ),
  m(
    "Egg Sandwich",
    "Continental/Italian",
    "Sandwiches & Burgers",
    EG,
    140,
    38,
    { station: "Continental" },
  ),
  m(
    "Bombay Sandwich",
    "Continental/Italian",
    "Sandwiches & Burgers",
    V,
    120,
    30,
    { station: "Continental" },
  ),
  m(
    "Cheese Burst Sandwich",
    "Continental/Italian",
    "Sandwiches & Burgers",
    V,
    180,
    55,
    { station: "Continental" },
  ),
  // ── Grills & Steaks ──
  m("Grilled Chicken", "Continental/Italian", "Grills & Steaks", NV, 350, 130, {
    station: "Continental",
  }),
  m("Chicken Steak", "Continental/Italian", "Grills & Steaks", NV, 400, 150, {
    station: "Continental",
  }),
  m("Fish Steak", "Continental/Italian", "Grills & Steaks", NV, 450, 180, {
    station: "Continental",
  }),
  m("Grilled Fish", "Continental/Italian", "Grills & Steaks", NV, 380, 140, {
    station: "Continental",
  }),
  m(
    "Peri Peri Chicken",
    "Continental/Italian",
    "Grills & Steaks",
    NV,
    350,
    130,
    { tags: ["spicy"], station: "Continental" },
  ),
  m("BBQ Chicken", "Continental/Italian", "Grills & Steaks", NV, 360, 135, {
    station: "Continental",
  }),
  m(
    "Grilled Veg Platter",
    "Continental/Italian",
    "Grills & Steaks",
    V,
    300,
    100,
    { station: "Continental" },
  ),
  m("Mutton Steak", "Continental/Italian", "Grills & Steaks", NV, 500, 200, {
    station: "Continental",
  }),
  m(
    "Cottage Cheese Steak",
    "Continental/Italian",
    "Grills & Steaks",
    V,
    320,
    110,
    { station: "Continental" },
  ),
  m("Grilled Prawns", "Continental/Italian", "Grills & Steaks", NV, 480, 190, {
    station: "Continental",
  }),
  // ── Sizzlers ──
  m("Veg Sizzler", "Continental/Italian", "Sizzlers", V, 350, 120, {
    station: "Continental",
  }),
  m("Chicken Sizzler", "Continental/Italian", "Sizzlers", NV, 450, 170, {
    tags: ["bestseller"],
    station: "Continental",
  }),
  m("Paneer Sizzler", "Continental/Italian", "Sizzlers", V, 380, 130, {
    station: "Continental",
  }),
  m("Fish Sizzler", "Continental/Italian", "Sizzlers", NV, 480, 190, {
    station: "Continental",
  }),
  m("Mexican Sizzler", "Continental/Italian", "Sizzlers", V, 400, 140, {
    tags: ["spicy"],
    station: "Continental",
  }),
  m("Mutton Sizzler", "Continental/Italian", "Sizzlers", NV, 520, 210, {
    station: "Continental",
  }),
  m("Sizzling Brownie", "Continental/Italian", "Sizzlers", V, 250, 80, {
    station: "Desserts",
  }),
  m("Cottage Cheese Sizzler", "Continental/Italian", "Sizzlers", V, 380, 130, {
    station: "Continental",
  }),
  m(
    "Grilled Sizzler Platter",
    "Continental/Italian",
    "Sizzlers",
    NV,
    500,
    200,
    { station: "Continental" },
  ),
  m("Continental Sizzler", "Continental/Italian", "Sizzlers", V, 420, 150, {
    station: "Continental",
  }),
  // ═══════════════════════════════════════════════
  // 7. BAR / BEVERAGES
  // ═══════════════════════════════════════════════
  // ── Beer ──
  m("Bro Code", "Bar / Beverages", "Beer", V, 250, 80, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Kingfisher Strong", "Bar / Beverages", "Beer", V, 200, 65, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Budweiser", "Bar / Beverages", "Beer", V, 280, 100, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Corona", "Bar / Beverages", "Beer", V, 350, 130, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Heineken", "Bar / Beverages", "Beer", V, 300, 110, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Tuborg", "Bar / Beverages", "Beer", V, 200, 65, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Bira 91", "Bar / Beverages", "Beer", V, 220, 75, {
    tax: T18,
    tags: ["new"],
    station: "Bar",
    preparationTime: 2,
  }),
  m("Carlsberg", "Bar / Beverages", "Beer", V, 220, 75, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Foster's", "Bar / Beverages", "Beer", V, 230, 80, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Hoegaarden", "Bar / Beverages", "Beer", V, 350, 130, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  // ── Whisky, Rum, Vodka, Gin ──
  m("Black Label", "Bar / Beverages", "Whisky, Rum, Vodka, Gin", V, 600, 250, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Glenfiddich ", "Bar / Beverages", "Whisky, Rum, Vodka, Gin", V, 180, 60, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Ballantine", "Bar / Beverages", "Whisky, Rum, Vodka, Gin", V, 200, 70, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Indri", "Bar / Beverages", "Whisky, Rum, Vodka, Gin", V, 250, 90, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m(
    "Jack Daniel's",
    "Bar / Beverages",
    "Whisky, Rum, Vodka, Gin",
    V,
    500,
    200,
    { tax: T18, station: "Bar", preparationTime: 2 },
  ),
  m("Old Monk Rum", "Bar / Beverages", "Whisky, Rum, Vodka, Gin", V, 150, 50, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Bacardi", "Bar / Beverages", "Whisky, Rum, Vodka, Gin", V, 200, 70, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m(
    "Smirnoff Vodka",
    "Bar / Beverages",
    "Whisky, Rum, Vodka, Gin",
    V,
    200,
    70,
    { tax: T18, station: "Bar", preparationTime: 2 },
  ),
  m(
    "Absolute Vodka",
    "Bar / Beverages",
    "Whisky, Rum, Vodka, Gin",
    V,
    300,
    110,
    { tax: T18, station: "Bar", preparationTime: 2 },
  ),
  m(
    "Hapusa Himalayan Gin",
    "Bar / Beverages",
    "Whisky, Rum, Vodka, Gin",
    V,
    350,
    130,
    { tax: T18, station: "Bar", preparationTime: 2 },
  ),
  m("Gin Mare", "Bar / Beverages", "Whisky, Rum, Vodka, Gin", V, 400, 160, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  // ── Wine ──
  m("Sula Red", "Bar / Beverages", "Wine", V, 300, 100, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Sula White", "Bar / Beverages", "Wine", V, 300, 100, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Sula Sparkling", "Bar / Beverages", "Wine", V, 400, 150, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Grover Zampa Red", "Bar / Beverages", "Wine", V, 350, 130, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Fratelli White", "Bar / Beverages", "Wine", V, 350, 130, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Jacob's Creek", "Bar / Beverages", "Wine", V, 500, 200, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Chandon Sparkling", "Bar / Beverages", "Wine", V, 600, 250, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("York Rose", "Bar / Beverages", "Wine", V, 350, 130, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Zinfandel", "Bar / Beverages", "Wine", V, 450, 180, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  m("Merlot", "Bar / Beverages", "Wine", V, 500, 200, {
    tax: T18,
    station: "Bar",
    preparationTime: 2,
  }),
  // ── Cocktails & Mocktails ──
  m(
    "Mojito",
    "Bar / Beverages",
    "Cocktails & Mocktails",
    V,
    350,
    100,
    {
      tax: T18,
      station: "Bar",
      preparationTime: 5,
    },
    {
      id: "M-4003",
      name: "Tandoori Roti",
      category: "Breads",
      foodType: FOOD_TYPE.VEG,
      status: MENU_STATUS.ACTIVE,
      pricing: { sellingPrice: 40, costPrice: 8 },
      tax: {
        category: "GST",
        percentage: 5,
        included: false,
        hsnCode: "996331",
      },
      variants: [],
      addonGroups: [],
      addons: [],
      tags: [],
      description: "Whole wheat bread baked in clay tandoor",
    },
  ),
  m("Margarita", "Bar / Beverages", "Cocktails & Mocktails", V, 400, 120, {
    tax: T18,
    station: "Bar",
    preparationTime: 5,
  }),
  m(
    "Long Island Iced Tea",
    "Bar / Beverages",
    "Cocktails & Mocktails",
    V,
    450,
    150,
    { tax: T18, tags: ["bestseller"], station: "Bar", preparationTime: 5 },
  ),
  m("Pina Colada", "Bar / Beverages", "Cocktails & Mocktails", V, 380, 110, {
    tax: T18,
    station: "Bar",
    preparationTime: 5,
  }),
  m("Cosmopolitan", "Bar / Beverages", "Cocktails & Mocktails", V, 400, 120, {
    tax: T18,
    station: "Bar",
    preparationTime: 5,
  }),
  m(
    "Sex on the Beach",
    "Bar / Beverages",
    "Cocktails & Mocktails",
    V,
    400,
    120,
    { tax: T18, station: "Bar", preparationTime: 5 },
  ),
  m("Virgin Mojito", "Bar / Beverages", "Cocktails & Mocktails", V, 180, 40, {
    station: "Bar",
    preparationTime: 5,
  }),
  m(
    "Blue Lagoon Mocktail",
    "Bar / Beverages",
    "Cocktails & Mocktails",
    V,
    180,
    40,
    { station: "Bar", preparationTime: 5 },
  ),
  m(
    "Fruit Punch Mocktail",
    "Bar / Beverages",
    "Cocktails & Mocktails",
    V,
    160,
    35,
    { station: "Bar", preparationTime: 5 },
  ),
  m(
    "Watermelon Cooler",
    "Bar / Beverages",
    "Cocktails & Mocktails",
    V,
    150,
    35,
    { station: "Bar", preparationTime: 5 },
  ),
  m("Whiskey Sour", "Bar / Beverages", "Cocktails & Mocktails", V, 420, 130, {
    tax: T18,
    station: "Bar",
    preparationTime: 5,
  }),
  // ── Shots ──
  m("Tequila Shot", "Bar / Beverages", "Shots", V, 200, 70, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  m("B-52 Shot", "Bar / Beverages", "Shots", V, 250, 90, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Kamikaze Shot", "Bar / Beverages", "Shots", V, 220, 80, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Jager Bomb", "Bar / Beverages", "Shots", V, 350, 130, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Blowjob Shot", "Bar / Beverages", "Shots", V, 250, 90, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Lemon Drop Shot", "Bar / Beverages", "Shots", V, 200, 70, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Vodka Shot", "Bar / Beverages", "Shots", V, 180, 60, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Baby Guinness Shot", "Bar / Beverages", "Shots", V, 250, 90, {
    tax: T18,
    station: "Bar",
    preparationTime: 1,
  }),
  // ── Soft Drinks & Juices ──
  m("Coke", "Bar / Beverages", "Soft Drinks & Juices", V, 60, 25, {
    tax: T28,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Sprite", "Bar / Beverages", "Soft Drinks & Juices", V, 60, 25, {
    tax: T28,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Fresh Lime Soda", "Bar / Beverages", "Soft Drinks & Juices", V, 80, 15, {
    station: "Bar",
    preparationTime: 3,
  }),
  m("Orange Juice", "Bar / Beverages", "Soft Drinks & Juices", V, 120, 30, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Watermelon Juice", "Bar / Beverages", "Soft Drinks & Juices", V, 100, 25, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Mango Juice", "Bar / Beverages", "Soft Drinks & Juices", V, 110, 28, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Soda", "Bar / Beverages", "Soft Drinks & Juices", V, 30, 10, {
    station: "Bar",
    preparationTime: 1,
  }),
  m("Mineral Water", "Bar / Beverages", "Soft Drinks & Juices", V, 40, 15, {
    station: "Bar",
    preparationTime: 1,
  }),
  m("Red Bull", "Bar / Beverages", "Soft Drinks & Juices", V, 200, 100, {
    tax: T28,
    station: "Bar",
    preparationTime: 1,
  }),
  m("Ginger Ale", "Bar / Beverages", "Soft Drinks & Juices", V, 80, 30, {
    station: "Bar",
    preparationTime: 1,
  }),
  // ── Hot Beverages ──
  m("Masala Tea", "Bar / Beverages", "Hot Beverages", V, 50, 10, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Black Tea", "Bar / Beverages", "Hot Beverages", V, 40, 8, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Green Tea", "Bar / Beverages", "Hot Beverages", V, 50, 12, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Filter Coffee", "Bar / Beverages", "Hot Beverages", V, 60, 15, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Cappuccino", "Bar / Beverages", "Hot Beverages", V, 120, 30, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Espresso", "Bar / Beverages", "Hot Beverages", V, 100, 25, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Lemon Tea", "Bar / Beverages", "Hot Beverages", V, 50, 12, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Cold Coffee", "Bar / Beverages", "Hot Beverages", V, 150, 35, {
    station: "Bar",
    preparationTime: 5,
  }),
  m("Irish Coffee", "Bar / Beverages", "Hot Beverages", V, 350, 120, {
    tax: T18,
    station: "Bar",
    preparationTime: 5,
  }),
  m("Hot Chocolate", "Bar / Beverages", "Hot Beverages", V, 150, 40, {
    station: "Bar",
    preparationTime: 5,
  }),
  // ═══════════════════════════════════════════════
  // 8. SNACKS & FAST FOOD
  // ═══════════════════════════════════════════════
  // ── Sandwiches ──
  m("Veg Sandwich", "Snacks & Fast Food", "Sandwiches", V, 100, 28, {
    station: "Snacks",
  }),
  m("Grilled Cheese Sandwich", "Snacks & Fast Food", "Sandwiches", V, 130, 38, {
    station: "Snacks",
  }),
  m("Club Sandwich", "Snacks & Fast Food", "Sandwiches", NV, 200, 65, {
    station: "Snacks",
  }),
  m("Chicken Sandwich", "Snacks & Fast Food", "Sandwiches", NV, 180, 55, {
    station: "Snacks",
  }),
  m("Paneer Sandwich", "Snacks & Fast Food", "Sandwiches", V, 150, 42, {
    station: "Snacks",
  }),
  m("Bombay Masala Sandwich", "Snacks & Fast Food", "Sandwiches", V, 120, 32, {
    tags: ["bestseller"],
    station: "Snacks",
  }),
  m("Egg Sandwich", "Snacks & Fast Food", "Sandwiches", EG, 120, 30, {
    station: "Snacks",
  }),
  m("Corn Cheese Sandwich", "Snacks & Fast Food", "Sandwiches", V, 150, 42, {
    station: "Snacks",
  }),
  m("Cheese Chilli Toast", "Snacks & Fast Food", "Sandwiches", V, 140, 38, {
    station: "Snacks",
  }),
  m("Tandoori Sandwich", "Snacks & Fast Food", "Sandwiches", V, 150, 42, {
    station: "Snacks",
  }),
  // ── Rolls & Wraps ──
  m("Veg Roll", "Snacks & Fast Food", "Rolls & Wraps", V, 100, 28, {
    station: "Snacks",
  }),
  m("Paneer Roll", "Snacks & Fast Food", "Rolls & Wraps", V, 130, 38, {
    station: "Snacks",
  }),
  m("Chicken Roll", "Snacks & Fast Food", "Rolls & Wraps", NV, 150, 45, {
    tags: ["bestseller"],
    station: "Snacks",
  }),
  m("Egg Roll", "Snacks & Fast Food", "Rolls & Wraps", EG, 100, 28, {
    station: "Snacks",
  }),
  m("Kathi Roll", "Snacks & Fast Food", "Rolls & Wraps", V, 120, 32, {
    station: "Snacks",
  }),
  m("Mutton Roll", "Snacks & Fast Food", "Rolls & Wraps", NV, 180, 60, {
    station: "Snacks",
  }),
  m("Schezwan Roll", "Snacks & Fast Food", "Rolls & Wraps", V, 120, 32, {
    tags: ["spicy"],
    station: "Snacks",
  }),
  m("Double Egg Roll", "Snacks & Fast Food", "Rolls & Wraps", EG, 130, 35, {
    station: "Snacks",
  }),
  m(
    "Tandoori Chicken Wrap",
    "Snacks & Fast Food",
    "Rolls & Wraps",
    NV,
    180,
    55,
    { station: "Snacks" },
  ),
  m("Veg Frankie", "Snacks & Fast Food", "Rolls & Wraps", V, 100, 28, {
    station: "Snacks",
  }),
  // ── Pav Bhaji, Vada Pav ──
  m("Pav Bhaji", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 150, 40, {
    tags: ["bestseller"],
    station: "Snacks",
  }),
  m(
    "Cheese Pav Bhaji",
    "Snacks & Fast Food",
    "Pav Bhaji, Vada Pav",
    V,
    180,
    50,
    { station: "Snacks" },
  ),
  m("Vada Pav", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 40, 12, {
    station: "Snacks",
  }),
  m("Dabeli", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 50, 15, {
    station: "Snacks",
  }),
  m("Misal Pav", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 120, 32, {
    tags: ["spicy"],
    station: "Snacks",
  }),
  m("Pani Puri", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 80, 20, {
    tags: ["bestseller"],
    station: "Snacks",
  }),
  m("Bhel Puri", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 80, 20, {
    station: "Snacks",
  }),
  m("Sev Puri", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 80, 20, {
    station: "Snacks",
  }),
  m("Ragda Pattice", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 100, 28, {
    station: "Snacks",
  }),
  m("Masala Pav", "Snacks & Fast Food", "Pav Bhaji, Vada Pav", V, 80, 20, {
    station: "Snacks",
  }),
  // ── Chaat Items ──
  m("Pani Puri", "Snacks & Fast Food", "Chaat Items", V, 80, 20, {
    station: "Snacks",
  }),
  m("Bhel Puri", "Snacks & Fast Food", "Chaat Items", V, 80, 20, {
    station: "Snacks",
  }),
  m("Sev Puri", "Snacks & Fast Food", "Chaat Items", V, 80, 20, {
    station: "Snacks",
  }),
  m("Dahi Puri", "Snacks & Fast Food", "Chaat Items", V, 90, 22, {
    station: "Snacks",
  }),
  m("Aloo Tikki Chaat", "Snacks & Fast Food", "Chaat Items", V, 100, 28, {
    station: "Snacks",
  }),
  m("Papdi Chaat", "Snacks & Fast Food", "Chaat Items", V, 100, 28, {
    station: "Snacks",
  }),
  m("Ragda Chaat", "Snacks & Fast Food", "Chaat Items", V, 100, 28, {
    station: "Snacks",
  }),
  m("Samosa Chaat", "Snacks & Fast Food", "Chaat Items", V, 110, 30, {
    station: "Snacks",
  }),
  m("Corn Chaat", "Snacks & Fast Food", "Chaat Items", V, 90, 22, {
    station: "Snacks",
  }),
  m("Fruit Chaat", "Snacks & Fast Food", "Chaat Items", V, 100, 25, {
    station: "Snacks",
  }),
  m("Dahi Bhalla Chaat", "Snacks & Fast Food", "Chaat Items", V, 110, 30, {
    station: "Snacks",
  }),
  // ── French Fries & Sides ──
  m("Classic Fries", "Snacks & Fast Food", "French Fries & Sides", V, 120, 30, {
    station: "Snacks",
  }),
  m(
    "Peri Peri Fries",
    "Snacks & Fast Food",
    "French Fries & Sides",
    V,
    140,
    35,
    { tags: ["spicy"], station: "Snacks" },
  ),
  m("Cheese Fries", "Snacks & Fast Food", "French Fries & Sides", V, 160, 42, {
    station: "Snacks",
  }),
  m("Masala Fries", "Snacks & Fast Food", "French Fries & Sides", V, 140, 35, {
    station: "Snacks",
  }),
  m("Potato Wedges", "Snacks & Fast Food", "French Fries & Sides", V, 150, 38, {
    station: "Snacks",
  }),
  m("Onion Rings", "Snacks & Fast Food", "French Fries & Sides", V, 130, 32, {
    station: "Snacks",
  }),
  m(
    "Chicken Nuggets",
    "Snacks & Fast Food",
    "French Fries & Sides",
    NV,
    180,
    55,
    { station: "Snacks" },
  ),
  m("Cheese Balls", "Snacks & Fast Food", "French Fries & Sides", V, 160, 42, {
    station: "Snacks",
  }),
  m(
    "Corn Cheese Nuggets",
    "Snacks & Fast Food",
    "French Fries & Sides",
    V,
    160,
    42,
    { station: "Snacks" },
  ),
  m("Garlic Bread", "Snacks & Fast Food", "French Fries & Sides", V, 120, 30, {
    station: "Snacks",
  }),
  // ═══════════════════════════════════════════════
  // 9. TANDOOR / GRILL
  // ═══════════════════════════════════════════════
  // ── Veg Tandoori Starters ──
  m("Paneer Tikka", "Tandoor / Grill", "Veg Tandoori Starters", V, 280, 90, {
    tags: ["bestseller"],
    addonGroups: ["AG-03"],
    station: "Tandoor",
  }),
  m(
    "Tandoori Mushroom",
    "Tandoor / Grill",
    "Veg Tandoori Starters",
    V,
    250,
    75,
    { station: "Tandoor" },
  ),
  m("Veg Seekh Kebab", "Tandoor / Grill", "Veg Tandoori Starters", V, 220, 65, {
    station: "Tandoor",
  }),
  m(
    "Hara Bhara Kebab",
    "Tandoor / Grill",
    "Veg Tandoori Starters",
    V,
    220,
    65,
    { station: "Tandoor" },
  ),
  m(
    "Tandoori Soya Chaap",
    "Tandoor / Grill",
    "Veg Tandoori Starters",
    V,
    240,
    70,
    { station: "Tandoor" },
  ),
  m(
    "Achari Paneer Tikka",
    "Tandoor / Grill",
    "Veg Tandoori Starters",
    V,
    290,
    95,
    { tags: ["spicy"], station: "Tandoor" },
  ),
  m(
    "Malai Paneer Tikka",
    "Tandoor / Grill",
    "Veg Tandoori Starters",
    V,
    290,
    95,
    { station: "Tandoor" },
  ),
  m("Tandoori Aloo", "Tandoor / Grill", "Veg Tandoori Starters", V, 200, 55, {
    station: "Tandoor",
  }),
  m(
    "Paneer Malai Tikka",
    "Tandoor / Grill",
    "Veg Tandoori Starters",
    V,
    290,
    95,
    { station: "Tandoor" },
  ),
  m("Broccoli Tikka", "Tandoor / Grill", "Veg Tandoori Starters", V, 250, 75, {
    tags: ["new"],
    station: "Tandoor",
  }),

  // ── Non-Veg Tandoori Starters ──
  m(
    "Chicken Tikka",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    320,
    120,
    { tags: ["bestseller"], addonGroups: ["AG-03"], station: "Tandoor" },
  ),
  m(
    "Tandoori Chicken",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    380,
    140,
    {
      station: "Tandoor",
      variants: [
        { id: "V-TC1", name: "Half", price: 220 },
        { id: "V-TC2", name: "Full", price: 380 },
      ],
    },
  ),
  m(
    "Malai Chicken Tikka",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    340,
    130,
    { station: "Tandoor" },
  ),
  m(
    "Reshmi Kebab",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    320,
    120,
    { station: "Tandoor" },
  ),
  m(
    "Fish Tikka",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    350,
    140,
    { station: "Tandoor" },
  ),
  m(
    "Tandoori Prawns",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    450,
    180,
    { station: "Tandoor" },
  ),
  m(
    "Mutton Seekh Kebab",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    350,
    140,
    { station: "Tandoor" },
  ),
  m(
    "Chicken Malai Kebab",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    340,
    130,
    { station: "Tandoor" },
  ),
  m(
    "Amritsari Fish",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    380,
    150,
    { tags: ["spicy"], station: "Tandoor" },
  ),
  m(
    "Achari Chicken Tikka",
    "Tandoor / Grill",
    "Non-Veg Tandoori Starters",
    NV,
    320,
    120,
    { tags: ["spicy"], station: "Tandoor" },
  ),
  // ── Kebabs ──
  m("Seekh Kebab", "Tandoor / Grill", "Kebabs", NV, 300, 110, {
    station: "Tandoor",
  }),
  m("Shami Kebab", "Tandoor / Grill", "Kebabs", NV, 280, 100, {
    station: "Tandoor",
  }),
  m("Galouti Kebab", "Tandoor / Grill", "Kebabs", NV, 350, 140, {
    tags: ["chef-special"],
    station: "Tandoor",
  }),
  m("Boti Kebab", "Tandoor / Grill", "Kebabs", NV, 320, 120, {
    station: "Tandoor",
  }),
  m("Chicken Kebab", "Tandoor / Grill", "Kebabs", NV, 280, 100, {
    station: "Tandoor",
  }),
  m("Mutton Kebab", "Tandoor / Grill", "Kebabs", NV, 350, 140, {
    station: "Tandoor",
  }),
  m("Paneer Kebab", "Tandoor / Grill", "Kebabs", V, 260, 80, {
    station: "Tandoor",
  }),
  m("Hariyali Kebab", "Tandoor / Grill", "Kebabs", NV, 300, 110, {
    station: "Tandoor",
  }),
  m("Kalmi Kebab", "Tandoor / Grill", "Kebabs", NV, 300, 110, {
    station: "Tandoor",
  }),
  m("Chapli Kebab", "Tandoor / Grill", "Kebabs", NV, 280, 100, {
    station: "Tandoor",
  }),
  // ── Tandoori Breads ──
  m("Tandoori Roti", "Tandoor / Grill", "Tandoori Breads", V, 40, 8, {
    station: "Tandoor",
  }),
  m("Butter Naan", "Tandoor / Grill", "Tandoori Breads", V, 60, 15, {
    station: "Tandoor",
  }),
  m("Garlic Naan", "Tandoor / Grill", "Tandoori Breads", V, 80, 20, {
    tags: ["bestseller"],
    station: "Tandoor",
  }),
  m("Roomali Roti", "Tandoor / Grill", "Tandoori Breads", V, 50, 12, {
    station: "Tandoor",
  }),
  m("Lachha Paratha", "Tandoor / Grill", "Tandoori Breads", V, 70, 18, {
    station: "Tandoor",
  }),
  m("Missi Roti", "Tandoor / Grill", "Tandoori Breads", V, 50, 12, {
    station: "Tandoor",
  }),
  m("Kulcha", "Tandoor / Grill", "Tandoori Breads", V, 60, 15, {
    station: "Tandoor",
  }),
  m("Cheese Naan", "Tandoor / Grill", "Tandoori Breads", V, 100, 30, {
    station: "Tandoor",
  }),
  m("Onion Kulcha", "Tandoor / Grill", "Tandoori Breads", V, 70, 18, {
    station: "Tandoor",
  }),
  m("Stuffed Kulcha", "Tandoor / Grill", "Tandoori Breads", V, 90, 25, {
    station: "Tandoor",
  }),
  // ═══════════════════════════════════════════════
  // 10. RICE & BIRYANI
  // ═══════════════════════════════════════════════
  // ── Veg Biryani ──
  m(
    "Veg Dum Biryani",
    "Rice & Biryani",
    "Veg Biryani",
    V,
    250,
    80,
    {
      addonGroups: ["AG-03"],
      addons: [],
      tags: [],
      description: "Crispy veggie balls in a tangy Indo-Chinese sauce",
      station: "Main Kitchen",
      preparationTime: 15,
    },
    {
      id: "M-5002",
      name: "Hakka Noodles",
      category: "Chinese",
      foodType: FOOD_TYPE.VEG,
      status: MENU_STATUS.ACTIVE,
      pricing: { sellingPrice: 200, costPrice: 55 },
      tax: {
        category: "GST",
        percentage: 5,
        included: false,
        hsnCode: "996331",
      },
      variants: [
        { id: "V-19", name: "Veg", price: 200 },
        { id: "V-20", name: "Egg", price: 230 },
        { id: "V-21", name: "Chicken", price: 260 },
      ],
    },
  ),
  m("Paneer Biryani", "Rice & Biryani", "Veg Biryani", V, 280, 90),
  m("Mushroom Biryani", "Rice & Biryani", "Veg Biryani", V, 260, 82),
  m("Soya Biryani", "Rice & Biryani", "Veg Biryani", V, 240, 72),
  m("Hyderabadi Veg Biryani", "Rice & Biryani", "Veg Biryani", V, 280, 90, {
    tags: ["bestseller"],
  }),
  m(
    "Vegetable Kolhapuri Biryani",
    "Rice & Biryani",
    "Veg Biryani",
    V,
    260,
    82,
    { tags: ["spicy"] },
  ),
  m("Kashmiri Veg Biryani", "Rice & Biryani", "Veg Biryani", V, 280, 90),
  m("Corn Biryani", "Rice & Biryani", "Veg Biryani", V, 240, 72),
  m("Mix Veg Biryani", "Rice & Biryani", "Veg Biryani", V, 250, 78),
  m("Tawa Veg Biryani", "Rice & Biryani", "Veg Biryani", V, 260, 82),

  // ── Non-Veg Biryani ──
  m("Chicken Dum Biryani", "Rice & Biryani", "Non-Veg Biryani", NV, 320, 120, {
    tags: ["bestseller"],
    addonGroups: ["AG-03"],
    variants: [
      { id: "V-CB1", name: "Half", price: 190 },
      { id: "V-CB2", name: "Full", price: 320 },
    ],
  }),
  m("Mutton Biryani", "Rice & Biryani", "Non-Veg Biryani", NV, 400, 170, {
    addonGroups: ["AG-03"],
  }),
  m(
    "Hyderabadi Chicken Biryani",
    "Rice & Biryani",
    "Non-Veg Biryani",
    NV,
    350,
    140,
  ),
  m("Fish Biryani", "Rice & Biryani", "Non-Veg Biryani", NV, 350, 140),
  m("Egg Biryani", "Rice & Biryani", "Non-Veg Biryani", EG, 220, 65),
  m("Prawns Biryani", "Rice & Biryani", "Non-Veg Biryani", NV, 420, 180),
  m("Lucknowi Biryani", "Rice & Biryani", "Non-Veg Biryani", NV, 380, 150),
  m("Chicken 65 Biryani", "Rice & Biryani", "Non-Veg Biryani", NV, 340, 130, {
    tags: ["spicy"],
  }),
  m("Keema Biryani", "Rice & Biryani", "Non-Veg Biryani", NV, 360, 145),
  m(
    "Kolkata Chicken Biryani",
    "Rice & Biryani",
    "Non-Veg Biryani",
    NV,
    320,
    120,
  ),

  // ── Pulao Varieties ──
  m("Veg Pulao", "Rice & Biryani", "Pulao Varieties", V, 180, 45),
  m("Peas Pulao", "Rice & Biryani", "Pulao Varieties", V, 170, 40),
  m("Kashmiri Pulao", "Rice & Biryani", "Pulao Varieties", V, 200, 55),
  m("Jeera Pulao", "Rice & Biryani", "Pulao Varieties", V, 160, 35),
  m("Paneer Pulao", "Rice & Biryani", "Pulao Varieties", V, 220, 65),
  m("Mushroom Pulao", "Rice & Biryani", "Pulao Varieties", V, 200, 55),
  m("Chicken Pulao", "Rice & Biryani", "Pulao Varieties", NV, 260, 80),
  m("Yakhni Pulao", "Rice & Biryani", "Pulao Varieties", NV, 280, 90),
  m("Corn Pulao", "Rice & Biryani", "Pulao Varieties", V, 180, 45),
  m("Fried Rice Pulao", "Rice & Biryani", "Pulao Varieties", V, 190, 48),
  // ── Plain Rice/Jeera Rice ──
  m("Steamed Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 100, 20),
  m("Jeera Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 140, 30),
  m("Ghee Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 150, 35),
  m("Curd Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 120, 25),
  m("Lemon Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 130, 28),
  m("Coconut Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 140, 30),
  m("Boiled Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 80, 15),
  m("Basmati Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 120, 25),
  m("Saffron Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 160, 40),
  m("Butter Rice", "Rice & Biryani", "Plain Rice/Jeera Rice", V, 140, 30),
  // ═══════════════════════════════════════════════
  // 11. DESSERTS
  // ═══════════════════════════════════════════════
  // ── Indian Sweets ──
  m("Gulab Jamun", "Desserts", "Indian Sweets", V, 100, 25, {
    tags: ["bestseller"],
    station: "Desserts",
    variants: [
      { id: "V-GJ1", name: "2 Pcs", price: 100 },
      { id: "V-GJ2", name: "4 Pcs", price: 180 },
    ],
  }),
  m("Rasgulla", "Desserts", "Indian Sweets", V, 100, 25, {
    station: "Desserts",
  }),
  m("Jalebi", "Desserts", "Indian Sweets", V, 80, 20, { station: "Desserts" }),
  m("Rasmalai", "Desserts", "Indian Sweets", V, 120, 35, {
    tags: ["chef-special"],
    station: "Desserts",
  }),
  m("Kaju Katli", "Desserts", "Indian Sweets", V, 150, 60, {
    station: "Desserts",
  }),
  m("Moong Dal Halwa", "Desserts", "Indian Sweets", V, 120, 38, {
    station: "Desserts",
  }),
  m("Gajar Halwa", "Desserts", "Indian Sweets", V, 110, 32, {
    tags: ["bestseller"],
    station: "Desserts",
  }),
  m("Kheer", "Desserts", "Indian Sweets", V, 100, 28, { station: "Desserts" }),
  m("Malpua", "Desserts", "Indian Sweets", V, 100, 30, { station: "Desserts" }),
  m("Sandesh", "Desserts", "Indian Sweets", V, 90, 28, { station: "Desserts" }),
  m("Peda", "Desserts", "Indian Sweets", V, 80, 25, { station: "Desserts" }),
  m("Barfi", "Desserts", "Indian Sweets", V, 90, 28, { station: "Desserts" }),
  m("Motichoor Ladoo", "Desserts", "Indian Sweets", V, 80, 25, {
    station: "Desserts",
  }),
  m("Halwa", "Desserts", "Indian Sweets", V, 100, 30, { station: "Desserts" }),

  // ── Ice Creams ──
  m("Vanilla", "Desserts", "Ice Creams", V, 80, 25, { station: "Desserts" }),
  m("Chocolate", "Desserts", "Ice Creams", V, 90, 28, { station: "Desserts" }),
  m("Strawberry", "Desserts", "Ice Creams", V, 90, 28, { station: "Desserts" }),
  m("Butterscotch", "Desserts", "Ice Creams", V, 90, 28, {
    station: "Desserts",
  }),
  m("Kesar Pista", "Desserts", "Ice Creams", V, 110, 35, {
    tags: ["bestseller"],
    station: "Desserts",
  }),
  m("Mango Ice Cream", "Desserts", "Ice Creams", V, 100, 30, {
    station: "Desserts",
  }),
  m("Black Currant", "Desserts", "Ice Creams", V, 90, 28, {
    station: "Desserts",
  }),
  m("Cookies & Cream", "Desserts", "Ice Creams", V, 110, 35, {
    station: "Desserts",
  }),
  m("Rajbhog", "Desserts", "Ice Creams", V, 100, 32, { station: "Desserts" }),
  m("Tender Coconut", "Desserts", "Ice Creams", V, 100, 30, {
    station: "Desserts",
  }),
  // ── Cakes/Pastries ──
  m("Chocolate Cake", "Desserts", "Cakes/Pastries", V, 150, 50, {
    tags: ["bestseller"],
    station: "Desserts",
  }),
  m("Red Velvet Cake", "Desserts", "Cakes/Pastries", V, 180, 60, {
    station: "Desserts",
  }),
  m("Black Forest Pastry", "Desserts", "Cakes/Pastries", V, 120, 38, {
    station: "Desserts",
  }),
  m("Pineapple Pastry", "Desserts", "Cakes/Pastries", V, 110, 35, {
    station: "Desserts",
  }),
  m("Cheesecake", "Desserts", "Cakes/Pastries", V, 200, 70, {
    station: "Desserts",
  }),
  m("Truffle Cake", "Desserts", "Cakes/Pastries", V, 180, 60, {
    station: "Desserts",
  }),
  m("Vanilla Pastry", "Desserts", "Cakes/Pastries", V, 100, 32, {
    station: "Desserts",
  }),
  m("Butterscotch Pastry", "Desserts", "Cakes/Pastries", V, 110, 35, {
    station: "Desserts",
  }),
  m("Rasmalai Cake", "Desserts", "Cakes/Pastries", V, 200, 70, {
    tags: ["new"],
    station: "Desserts",
  }),
  m("Fruit Cake", "Desserts", "Cakes/Pastries", V, 130, 42, {
    station: "Desserts",
  }),
  // ── Falooda & Kulfi ──
  m("Royal Falooda", "Desserts", "Falooda & Kulfi", V, 180, 55, {
    tags: ["bestseller"],
    station: "Desserts",
  }),
  m("Rose Falooda", "Desserts", "Falooda & Kulfi", V, 160, 48, {
    station: "Desserts",
  }),
  m("Kesar Kulfi", "Desserts", "Falooda & Kulfi", V, 100, 30, {
    station: "Desserts",
  }),
  m("Malai Kulfi", "Desserts", "Falooda & Kulfi", V, 90, 28, {
    station: "Desserts",
  }),
  m("Pista Kulfi", "Desserts", "Falooda & Kulfi", V, 100, 30, {
    station: "Desserts",
  }),
  m("Kulfi Falooda", "Desserts", "Falooda & Kulfi", V, 150, 45, {
    station: "Desserts",
  }),
  m("Fruit Falooda", "Desserts", "Falooda & Kulfi", V, 170, 52, {
    station: "Desserts",
  }),
  m("Mango Falooda", "Desserts", "Falooda & Kulfi", V, 170, 52, {
    station: "Desserts",
  }),
  m("Dry Fruit Kulfi", "Desserts", "Falooda & Kulfi", V, 120, 38, {
    station: "Desserts",
  }),
  m("Matka Kulfi", "Desserts", "Falooda & Kulfi", V, 90, 28, {
    station: "Desserts",
  }),
  // ═══════════════════════════════════════════════
  // 12. BEVERAGES (Non-Bar)
  // ═══════════════════════════════════════════════
  // ── Fresh Juices ──
  m(
    "Orange Juice",
    "Beverages (Non-Bar)",
    "Fresh Juices",
    V,
    120,
    30,
    {
      station: "Beverage",
      preparationTime: 5,
    },
    {
      id: "M-7002",
      name: "Mango Lassi",
      category: "Beverages",
      subCategory: "Indian",
      foodType: FOOD_TYPE.VEG,
      status: MENU_STATUS.ACTIVE,
      pricing: { sellingPrice: 120, costPrice: 30 },
      tax: {
        category: "GST",
        percentage: 5,
        included: false,
        hsnCode: "996331",
      },
      variants: [],
      addonGroups: ["AG-04"],
      addons: [],
    },
  ),
  m("Watermelon Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 100, 25, {
    station: "Beverage",
  }),
  m("Mango Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 120, 30, {
    station: "Beverage",
  }),
  m("Pineapple Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 120, 30, {
    station: "Beverage",
  }),
  m("Mixed Fruit Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 130, 35, {
    station: "Beverage",
  }),
  m("Pomegranate Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 140, 40, {
    station: "Beverage",
  }),
  m("Sweet Lime Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 100, 22, {
    station: "Beverage",
  }),
  m("Apple Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 130, 35, {
    station: "Beverage",
  }),
  m("Grape Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 120, 30, {
    station: "Beverage",
  }),
  m("Carrot Juice", "Beverages (Non-Bar)", "Fresh Juices", V, 100, 25, {
    station: "Beverage",
  }),
  // ── Milkshakes ──
  m("Chocolate Shake", "Beverages (Non-Bar)", "Milkshakes", V, 150, 40, {
    tags: ["bestseller"],
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Strawberry Shake", "Beverages (Non-Bar)", "Milkshakes", V, 150, 40, {
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Vanilla Shake", "Beverages (Non-Bar)", "Milkshakes", V, 140, 35, {
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Mango Shake", "Beverages (Non-Bar)", "Milkshakes", V, 150, 40, {
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Oreo Shake", "Beverages (Non-Bar)", "Milkshakes", V, 180, 50, {
    tags: ["new"],
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Butterscotch Shake", "Beverages (Non-Bar)", "Milkshakes", V, 150, 40, {
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Banana Shake", "Beverages (Non-Bar)", "Milkshakes", V, 130, 32, {
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("KitKat Shake", "Beverages (Non-Bar)", "Milkshakes", V, 190, 55, {
    tags: ["new"],
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Rose Shake", "Beverages (Non-Bar)", "Milkshakes", V, 140, 35, {
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  m("Dry Fruit Shake", "Beverages (Non-Bar)", "Milkshakes", V, 180, 50, {
    station: "Beverage",
    addonGroups: ["AG-05"],
  }),
  // ── Mocktails ──
  m("Virgin Mojito", "Beverages (Non-Bar)", "Mocktails", V, 180, 40, {
    tags: ["bestseller"],
    station: "Beverage",
  }),
  m("Blue Lagoon", "Beverages (Non-Bar)", "Mocktails", V, 180, 40, {
    station: "Beverage",
  }),
  m("Fruit Punch", "Beverages (Non-Bar)", "Mocktails", V, 160, 35, {
    station: "Beverage",
  }),
  m("Watermelon Cooler", "Beverages (Non-Bar)", "Mocktails", V, 150, 35, {
    station: "Beverage",
  }),
  m("Green Apple Mocktail", "Beverages (Non-Bar)", "Mocktails", V, 180, 42, {
    station: "Beverage",
  }),
  m("Mint Lemonade", "Beverages (Non-Bar)", "Mocktails", V, 120, 25, {
    station: "Beverage",
  }),
  m("Passion Fruit Cooler", "Beverages (Non-Bar)", "Mocktails", V, 180, 42, {
    station: "Beverage",
  }),
  m("Strawberry Mocktail", "Beverages (Non-Bar)", "Mocktails", V, 180, 42, {
    station: "Beverage",
  }),
  m("Peach Iced Tea", "Beverages (Non-Bar)", "Mocktails", V, 140, 30, {
    station: "Beverage",
  }),
  m("Cranberry Mocktail", "Beverages (Non-Bar)", "Mocktails", V, 170, 40, {
    station: "Beverage",
  }),
  // ── Aerated Drinks ──
  m("Coke", "Beverages (Non-Bar)", "Aerated Drinks", V, 60, 25, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Sprite", "Beverages (Non-Bar)", "Aerated Drinks", V, 60, 25, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Fanta", "Beverages (Non-Bar)", "Aerated Drinks", V, 60, 25, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Thums Up", "Beverages (Non-Bar)", "Aerated Drinks", V, 60, 25, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Limca", "Beverages (Non-Bar)", "Aerated Drinks", V, 60, 25, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Soda", "Beverages (Non-Bar)", "Aerated Drinks", V, 30, 10, {
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Ginger Ale", "Beverages (Non-Bar)", "Aerated Drinks", V, 80, 30, {
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Diet Coke", "Beverages (Non-Bar)", "Aerated Drinks", V, 70, 28, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),
  m("7Up", "Beverages (Non-Bar)", "Aerated Drinks", V, 60, 25, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),
  m("Mountain Dew", "Beverages (Non-Bar)", "Aerated Drinks", V, 60, 25, {
    tax: T28,
    station: "Beverage",
    preparationTime: 1,
  }),

  // ── Tea/Coffee ──
  m("Masala Tea", "Beverages (Non-Bar)", "Tea/Coffee", V, 50, 10, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Ginger Tea", "Beverages (Non-Bar)", "Tea/Coffee", V, 50, 10, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Green Tea", "Beverages (Non-Bar)", "Tea/Coffee", V, 60, 15, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Lemon Tea", "Beverages (Non-Bar)", "Tea/Coffee", V, 50, 12, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Cold Coffee", "Beverages (Non-Bar)", "Tea/Coffee", V, 150, 35, {
    tags: ["bestseller"],
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Filter Coffee", "Beverages (Non-Bar)", "Tea/Coffee", V, 60, 15, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Cappuccino", "Beverages (Non-Bar)", "Tea/Coffee", V, 130, 35, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Espresso", "Beverages (Non-Bar)", "Tea/Coffee", V, 110, 28, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Hot Chocolate", "Beverages (Non-Bar)", "Tea/Coffee", V, 150, 40, {
    station: "Beverage",
    preparationTime: 5,
  }),
  m("Irish Coffee", "Beverages (Non-Bar)", "Tea/Coffee", V, 200, 60, {
    station: "Beverage",
    preparationTime: 5,
  }),
];
