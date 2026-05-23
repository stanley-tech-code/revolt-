const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'db', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.homepage = {
  hero: {
    title: "The Uniform Collection",
    description: "Discover our latest foundational pieces, engineered for everyday movement and comfort.",
    buttonText: "Shop the Collection",
    videoUrl: "",
    useVideo: false
  },
  sections: [
    { id: 'sec-hero', type: 'hero', active: true },
    { id: 'sec-new-arrivals', type: 'new-arrivals', active: true },
    { id: 'sec-text-block', type: 'text-block', active: true, title: "Our Ethos", text: "We believe in clothing that empowers you to move with confidence. Every seam, every fabric choice, is designed with purpose." },
    { id: 'sec-curation', type: 'curation', active: true },
    { id: 'sec-products', type: 'products', active: true },
    { id: 'sec-editorial', type: 'editorial', active: true, title: "Volume 01", text: "Technical Layers for Maximum Support", image: "/images/editorial-wide.jpg" },
    { id: 'sec-testimonials', type: 'testimonials', active: true, title: "Vogue Magazine", text: "Revolt is redefining the landscape of modern activewear with a touch of refined luxury." },
    { id: 'sec-faq', type: 'faq', active: true, title: "Frequently Asked Questions", text: "Returns are accepted within 30 days of purchase. Items must be unworn and in original condition." },
    { id: 'sec-newsletter', type: 'newsletter', active: true, title: "Join the Club", text: "Sign up for exclusive access to drops, sales, and community events." },
    { id: 'sec-contact', type: 'contact', active: true, title: "Get in Touch", text: "We are here to help." }
  ]
};

db.admin = { currentUser: null, logs: [] };
db.orders = [];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Homepage sections restored successfully!');
