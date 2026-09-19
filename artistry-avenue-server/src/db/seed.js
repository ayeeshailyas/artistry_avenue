import { db } from "./index.js";

const categories = [
  { slug: "journals", name: "Diaries & Notebooks", tagline: "Pages for every bright idea", image: "/stationery/diary/blueberry_notebook_flatlay_1.webp" },
  { slug: "writing", name: "Pens & Pencils", tagline: "Make every line feel special", image: "/stationery/pen/natural_flatlay_product_photograph.webp" },
  { slug: "cards", name: "Fun Stationery", tagline: "Little details, big personality", image: "/stationery/stickynotes/pink_sticky_notes_flatlay.webp" },
  { slug: "desk", name: "Desk Accessories", tagline: "Pretty tools for tidy spaces", image: "/stationery/stapler/mini_stapler_flatlay.webp" },
];

const products = [
  { id: "aa-001", name: "Gilded Edge Journal", category: "journals", price: 3200, compareAt: 3800, colors: ["Blueberry", "Ivory", "Charcoal"], description: "A beautiful notebook with plenty of room for plans, sketches and the ideas that arrive between them.", details: ["Smooth lined pages", "Sturdy hardcover", "Ribbon marker", "A5 notebook"], images: ["/stationery/diary/blueberry_notebook_flatlay_1.webp", "/stationery/diary/navy_notebook_flat_lay.webp"], badge: "Bestseller", rating: 4.9, reviews: 128, stock: 40 },
  { id: "aa-002", name: "Sparkle Dot Grid Notebook", category: "journals", price: 1800, colors: ["Blue", "Ivory", "Sage"], description: "A cheerful notebook for lists, doodles and everyday plans, with a cover that adds a little sparkle to your desk.", details: ["Dot-grid pages", "Shimmer-finish cover", "Lay-flat binding", "A5 notebook"], images: ["/stationery/diary/light_blue_spiral_notebook_flatlay.webp"], rating: 4.7, reviews: 64, stock: 60 },
  { id: "aa-003", name: "The Weekly Planner", category: "journals", price: 2600, colors: ["Yellow", "Ivory"], description: "A bright weekly planner for keeping small tasks, big plans and everything in between in one lovely place.", details: ["Weekly planning pages", "Monthly overviews", "Soft-touch cover", "A5 planner"], images: ["/stationery/diary/yellow_notebook_product_photograph.webp"], rating: 4.8, reviews: 91, stock: 55 },
  { id: "aa-004", name: "Marbled Travel Journal", category: "journals", price: 2900, colors: ["Pink", "Ivory"], description: "A compact notebook with a soft, playful cover that is ready for notes on the go.", details: ["Blank pages", "Compact format", "Sturdy cover", "Travel-friendly size"], images: ["/stationery/diary/strawberry_notebook_flatlay.webp"], badge: "New", rating: 4.6, reviews: 37, stock: 22 },
  { id: "aa-005", name: "Artistry Fountain Pen", category: "writing", price: 4200, colors: ["Pink", "Lavender"], description: "A smooth, elegant pen that makes notes, signatures and journal entries feel a little more considered.", details: ["Fine writing tip", "Comfortable grip", "Gift-ready presentation"], images: ["/stationery/pen/natural_flatlay_product_photograph.webp", "/stationery/pen/lavender_pen_flatlay_1.webp"], badge: "Bestseller", rating: 5.0, reviews: 52, stock: 30 },
  { id: "aa-006", name: "Sparkle Gel Pen Set", category: "writing", price: 950, colors: ["Set of 6"], description: "A colourful pen set for planners, study notes and every little list that deserves a happy accent.", details: ["Colourful ink", "Fine writing tip", "Easy to carry"], images: ["/stationery/pen/pink_pen_flatlay.webp"], rating: 4.5, reviews: 210, stock: 90 },
  { id: "aa-007", name: "Star Wand Pencil", category: "writing", price: 3600, colors: ["Purple"], description: "A playful pencil for school notes, journaling and adding a little magic to your pencil case.", details: ["Fun statement design", "Comfortable to hold", "Everyday writing tool"], images: ["/stationery/pencil/purple_star_wand_flatlay.webp"], rating: 4.8, reviews: 44, stock: 25 },
  { id: "aa-008", name: "Pastel Sticky Notes", category: "cards", price: 1400, colors: ["Pink", "Pastel"], description: "Bright little notes for reminders, messages and the ideas you want to keep close.", details: ["Multiple colours", "Easy peel notes", "Desk-friendly size"], images: ["/stationery/stickynotes/pink_sticky_notes_flatlay.webp"], badge: "New", rating: 4.9, reviews: 33, stock: 48 },
  { id: "aa-009", name: "Unicorn Sticky Notes", category: "cards", price: 1600, colors: ["Unicorn"], description: "A sweet stationery pick for colourful reminders, study notes and tiny daily victories.", details: ["Playful shape", "Easy peel notes", "Great for gifts"], images: ["/stationery/stickynotes/unicorn_sticky_note_flat_lay.webp"], rating: 4.7, reviews: 58, stock: 50 },
  { id: "aa-010", name: "Mini Desk Stapler", category: "desk", price: 2400, colors: ["Pink", "White"], description: "A compact desk essential that keeps papers neat without taking over your workspace.", details: ["Compact size", "Easy to store", "Everyday desk essential"], images: ["/stationery/stapler/mini_stapler_flatlay.webp"], badge: "Bestseller", rating: 4.9, reviews: 76, stock: 35 },
  { id: "aa-011", name: "Korean Desk Organiser", category: "desk", price: 3400, colors: ["Pink", "Pastel"], description: "A cheerful organiser for pens, clips and the small tools that make your desk feel like yours.", details: ["Multiple compartments", "Colourful finish", "Easy to clean"], images: ["/stationery/keychains/korean_stationery_flatlay.webp"], rating: 4.6, reviews: 29, stock: 18 },
  { id: "aa-012", name: "Pastel Highlighter", category: "desk", price: 2200, colors: ["Yellow", "Pastel"], description: "A soft-colour highlighter for study pages, planners and notes that deserve a gentle glow.", details: ["Soft pastel ink", "Comfortable grip", "Great for study notes"], images: ["/stationery/highlighter/korean_stationery_flat_lay.webp"], rating: 4.4, reviews: 21, stock: 33 },
];

const insertCategory = db.prepare(`
  INSERT OR REPLACE INTO categories (slug, name, tagline, image) VALUES (@slug, @name, @tagline, @image)
`);

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products
    (id, name, category, price, compare_at, colors, description, details, images, badge, rating, reviews, stock)
  VALUES
    (@id, @name, @category, @price, @compareAt, @colors, @description, @details, @images, @badge, @rating, @reviews, @stock)
`);

const seed = db.transaction(() => {
  for (const c of categories) insertCategory.run(c);
  for (const p of products) {
    insertProduct.run({
      ...p,
      compareAt: p.compareAt ?? null,
      colors: JSON.stringify(p.colors ?? []),
      details: JSON.stringify(p.details ?? []),
      images: JSON.stringify(p.images ?? []),
      badge: p.badge ?? null,
      rating: p.rating ?? 4.5,
      reviews: p.reviews ?? 0,
      stock: p.stock ?? 100,
    });
  }
});

seed();
console.log(`Seeded ${products.length} products and ${categories.length} categories.`);
