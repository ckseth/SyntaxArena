// ── Electronics ──
import keyboard_1 from './Keyboard_1.jpeg'
import keyboard_2 from './KeyBoard_2.jpeg'
import mouse_1 from './Mouse_1.jpeg'
import mouse_2 from './Mouse_2.jpeg'
import electric_6 from './electric_6.png'

// ── Books ──
import textbook_1 from './TextBook_1.jpeg'
import textbook_2 from './TextBook_2.jpeg'
import textbook_3 from './TextBook_3.jpeg'
import textbook_4 from './TextBook_4.jpeg'

// ── Furniture ──
import furniture_1 from './furniture_1.png'
import furniture_2 from './furniture_2.jpg'
import furniture_3 from './furniture_3.png'
import furniture_4 from './furniture_4.png'
import furniture_5 from './furniture_5.png'

// ── Vehicles ──
import vehicle_1 from './vehicle_1.png'
import vehicle_2 from './vehicle_2.png'
import vehicle_3 from './vehicle_3.png'
import vehicle_4 from './vehicle_4.png'

// ── Traditional & Ethnic Wear ──
import traditional_1 from './traditional_1.png'
import traditional_2 from './traditional_2.png'
import traditional_3 from './traditional_3.png'
import traditional_4 from './traditional_4.png'
import ethnic_2 from './ethnic_2.webp'
import ethnic_3 from './ethnic_3.jpg'
import ethnic_4 from './ethnic_4.jpg'
import ethnic_5 from './ethnic_5.jpg'
import ethnic_6 from './ethnic_6.jpg'
import ethnic_7 from './ethnic_7.webp'

// ── Miscellaneous ──
import misc_1 from './miscellinous_1.jpg'
import misc_2 from './miscellinous_2.png'
import misc_3 from './miscellinous_3.jpg'
import misc_4 from './miscellinous_4.jpg'
import misc_5 from './miscellinous_5.jpg'
import misc_6 from './miscellinous_6.jpg'
import misc_7 from './miscellinous_7.jpg'

export const product_list = [
    // ═══════════ Electronics ═══════════
    {
        _id: "1",
        name: "Mechanical Keyboard (Red Switches)",
        image: keyboard_1,
        price: 550,
        description: "Premium mechanical keyboard with red switches, RGB backlighting. Used for 3 months, perfect condition.",
        category: "Electronics",
        availability: "Sell"
    },
    {
        _id: "2",
        name: "Gaming Keyboard (Blue Switches)",
        image: keyboard_2,
        price: 600,
        description: "Compact 65% layout gaming keyboard with clicky blue switches. Includes original box and cable.",
        category: "Electronics",
        availability: "Sell"
    },
    {
        _id: "3",
        name: "Wireless Mouse (Ergonomic)",
        image: mouse_1,
        price: 450,
        description: "Ergonomic wireless mouse with silent clicks and adjustable DPI. 6 months old.",
        category: "Electronics",
        availability: "Sell"
    },
    {
        _id: "4",
        name: "Wired Mouse (Compact)",
        image: mouse_2,
        price: 350,
        description: "Ultra-portable wired mouse, perfect for laptops.",
        category: "Electronics",
        availability: "Sell"
    },
    {
        _id: "5",
        name: "Laptop",
        image: electric_6,
        price: 80,
        description: "A modern laptop device used for coding, learning, and digital collaboration within the SkillSphere platform. It represents users accessing AI-based skill exchange, managing learning plans, and connecting with other learners.",
        category: "Electronics",
        availability: "Rent",
        rentDaily: 80
    },

    // ═══════════ Books ═══════════
    {
        _id: "6",
        name: "C++",
        image: textbook_1,
        price: 250,
        description: "Cormen's CLRS textbook — essential for CS students. Minor highlighting on some pages.",
        category: "Books",
        availability: "Sell"
    },
    {
        _id: "7",
        name: "Web development ",
        image: textbook_2,
        price: 180,
        description: "A dynamic skill focused on designing and developing interactive web experiences, powered by modern technologies and collaborative learning.",
        category: "Books",
        availability: "Sell"
    },
    {
        _id: "8",
        name: "Python Handbook",
        image: textbook_3,
        price: 150,
        description: "A comprehensive guide to Python programming, covering fundamental concepts, syntax, and practical applications for beginners and intermediate learners.",
        category: "Books",
        availability: "Sell"
    },
    {
        _id: "9",
        name: "Data Structure and Algorithm",
        image: textbook_4,
        price: 200,
        description: "A foundational computer science skill that focuses on organizing, managing, and processing data efficiently through various structures and algorithms.",
        category: "Books",
        availability: "Sell"
    },

    // ═══════════ Furniture ═══════════
    {
        _id: "10",
        name: "Ergonomic Study Table",
        image: furniture_1,
        price: 550,
        description: "Adjustable height study table with lumbar support. Barely used, like new condition.",
        category: "Furniture",
        availability: "Sell"
    },
    {
        _id: "11",
        name: "Pen Stand",
        image: furniture_2,
        price: 150,
        description: "A compact and stylish organizer designed to hold pens, pencils, markers, and other small stationery items, keeping your workspace tidy and efficient.",
        category: "Furniture",
        availability: "Sell"
    },
    {
        _id: "12",
        name: "Foldable study table",
        image: furniture_3,
        price: 800,
        description: "A versatile and practical piece of furniture designed to provide a stable surface for studying, working, or placing items, often featuring a lightweight and foldable design for easy storage and portability.",
        category: "Furniture",
        availability: "Sell"
    },
    {
        _id: "13",
        name: "Table organiser",
        image: furniture_4,
        price: 60,
        description: "A compact and stylish organizer designed to hold pens, pencils, markers, and other small stationery items, keeping your workspace tidy and efficient.",
        category: "Furniture",
        availability: "Rent",
        rentDaily: 60
    },
    {
        _id: "14",
        name: "Storage Organizer Box",
        image: furniture_5,
        price: 500,
        description: "Multi-compartment organizer for stationery, gadgets, and essentials.",
        category: "Furniture",
        availability: "Sell"
    },

    // ═══════════ Vehicles ═══════════
    {
        _id: "15",
        name: "Mountain Bicycle",
        image: vehicle_1,
        price: 550,
        description: "21-speed gear cycle with disc brakes. Great for campus commuting. 1 year old.",
        category: "Vehicles",
        availability: "Sell"
    },
    {
        _id: "16",
        name: "Bicycle",
        image: vehicle_2,
        price: 600,
        description: "A two-wheeled vehicle propelled by pedals and steered with handlebars, commonly used for transportation, exercise, and recreation.",
        category: "Vehicles",
        availability: "Sell"
    },
    {
        _id: "17",
        name: "Stylish Scooter",
        image: vehicle_3,
        price: 150,
        description: "A sleek and modern electric scooter designed for urban commuting, offering a fast, eco-friendly, and convenient way to navigate city streets with style and ease.",
        category: "Vehicles",
        availability: "Rent",
        rentDaily: 150
    },
    {
        _id: "18",
        name: "Motor Cycle",
        image: vehicle_4,
        price: 550,
        description: "A powerful two-wheeled vehicle with an engine, designed for fast and efficient transportation over long distances, combining speed, performance, and modern engineering.",
        category: "Vehicles",
        availability: "Sell"
    },

    // ═══════════ Traditional & Ethnic Wear ═══════════
    {
        _id: "19",
        name: "Silk Kurta Set",
        image: traditional_1,
        price: 500,
        description: "Elegant silk kurta with matching pajama. Worn once for college fest. Size L.",
        category: "Traditional & Ethnic Wear",
        availability: "Sell"
    },
    {
        _id: "20",
        name: "Designer Gown",
        image: traditional_2,
        price: 550,
        description: "A stunning and elegant formal dress characterized by its flowing silhouette, intricate detailing, and luxurious fabric, designed to create a sophisticated and glamorous look for special occasions.",
        category: "Traditional & Ethnic Wear",
        availability: "Sell"
    },
    {
        _id: "21",
        name: "Partyawear lehanga",
        image: traditional_3,
        price: 450,
        description: "A vibrant and ornate traditional Indian outfit consisting of a flared skirt (lehenga), a fitted blouse (choli), and a long scarf (dupatta), often embellished with intricate embroidery, sequins, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Sell"
    },
    {
        _id: "22",
        name: "Traditional Lehanga",
        image: traditional_4,
        price: 500,
        description: "A traditional Indian outfit consisting of a long, pleated skirt, a fitted blouse, and a scarf, often adorned with intricate embroidery and embellishments, perfect for festive occasions and cultural celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Rent",
        rentDaily: 500
    },
    {
        _id: "23",
        name: "Crop Top Lehanga",
        image: ethnic_2,
        price: 350,
        description: "A stylish and contemporary variation of the traditional lehenga, featuring a modern, shorter blouse (crop top) paired with a flared skirt, often embellished with intricate embroidery, sequins, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Sell"
    },
    {
        _id: "24",
        name: "Modern OnePiece",
        image: ethnic_3,
        price: 600,
        description: "A stylish and contemporary one-piece dress that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Sell"
    },
    {
        _id: "25",
        name: "One Piece",
        image: ethnic_4,
        price: 800,
        description: "A stylish and contemporary one-piece dress that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Sell"
    },
    {
        _id: "26",
        name: "Blazor",
        image: ethnic_5,
        price: 300,
        description: "A stylish and contemporary one-piece dress that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Rent",
        rentDaily: 300
    },
    {
        _id: "27",
        name: "2 Piece Set",
        image: ethnic_6,
        price: 600,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Sell"
    },
    {
        _id: "28",
        name: "Tradition kurti set",
        image: ethnic_7,
        price: 800,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Traditional & Ethnic Wear",
        availability: "Rent",
        rentDaily: 800
    },

    // ═══════════ Miscellaneous ═══════════
    {
        _id: "29",
        name: "Cleaner Accesories",
        image: misc_1,
        price: 50,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Miscellaneous",
        availability: "Sell"
    },
    {
        _id: "30",
        name: "Two fold umbrella",
        image: misc_2,
        price: 550,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Miscellaneous",
        availability: "Sell"
    },
    {
        _id: "31",
        name: "Water Proof Bag pack",
        image: misc_3,
        price: 700,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Miscellaneous",
        availability: "Sell"
    },
    {
        _id: "32",
        name: "Stylish pen Stand",
        image: misc_4,
        price: 40,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Miscellaneous",
        availability: "Rent",
        rentDaily: 40
    },
    {
        _id: "33",
        name: "Vibrant Desk Organizer",
        image: misc_5,
        price: 200,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Miscellaneous",
        availability: "Rent",
        rentDaily: 200
    },
    {
        _id: "34",
        name: "Three Fold Umbrella",
        image: misc_6,
        price: 600,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Miscellaneous",
        availability: "Sell"
    },
    {
        _id: "35",
        name: "RainCoat Women",
        image: misc_7,
        price: 50,
        description: "A stylish and contemporary two-piece set that combines traditional Indian aesthetics with modern design elements, featuring a flattering silhouette, intricate detailing, and rich fabrics, perfect for festive occasions and celebrations.",
        category: "Miscellaneous",
        availability: "Rent",
        rentDaily: 50
    }
]
