// ---------- Ma'lumotlar (index.html va car.html uchun umumiy) ----------
// file: images/ papkasiga qo'yiladigan haqiqiy rasm nomi. Rasm bo'lmasa, chizilgan mashina ko'rsatiladi.
const products = [
  { id: 1, name: "BMW 330i", cat: "Sedan", shape: "sedan", file: "bmw-330i.jpg", q: "BMW 330i G20", specs: "2.0 L · 258 {hp}", price: 48000, sold: 280, color: "#1c69d4", year: 2026, engine: "2.0 L", hp: 258, nm: 400, acc: 5.8, top: 250, cons: 6.8, fuel: "petrol", drive: "RWD", seats: 5 },
  { id: 2, name: "BMW M340i", cat: "Sedan", shape: "sedan", file: "bmw-m340i.jpg", q: "BMW M340i G20", specs: "3.0 L · 374 {hp}", price: 62000, sold: 170, color: "#c9ced6", year: 2026, engine: "3.0 L", hp: 374, nm: 500, acc: 4.4, top: 250, cons: 8.4, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 3, name: "BMW 540i", cat: "Sedan", shape: "sedan", file: "bmw-540i.jpg", q: "BMW 540i", specs: "3.0 L · 380 {hp}", price: 72000, sold: 210, color: "#2b2f36", year: 2026, engine: "3.0 L", hp: 380, nm: 540, acc: 4.7, top: 250, cons: 8.7, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 4, name: "BMW 750Li", cat: "Sedan", shape: "sedan", file: "bmw-750li.jpg", q: "BMW 750Li", specs: "4.4 L · 530 {hp} · {lux}", price: 135000, sold: 70, color: "#3b2a5a", year: 2026, engine: "4.4 L", hp: 530, nm: 750, acc: 4.2, top: 250, cons: 11.2, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 5, name: "BMW X4 M40i", cat: "SUV", shape: "suv", file: "bmw-x4-m40i.jpg", q: "BMW X4 M40i", specs: "3.0 L · 382 {hp}", price: 70000, sold: 190, color: "#e8a317", year: 2026, engine: "3.0 L", hp: 382, nm: 500, acc: 4.7, top: 250, cons: 9.4, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 6, name: "BMW X3 M40i", cat: "SUV", shape: "suv", file: "bmw-x3-m40i.jpg", q: "BMW X3 M40i", specs: "3.0 L · 382 {hp}", price: 68000, sold: 300, color: "#8d96a3", year: 2026, engine: "3.0 L", hp: 382, nm: 500, acc: 4.6, top: 250, cons: 9.2, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 7, name: "BMW X5 M60i", cat: "SUV", shape: "suv", file: "bmw-x5-m60i.jpg", q: "BMW X5 M60i", specs: "4.4 L · 523 {hp}", price: 108000, sold: 220, color: "#0f3d2e", year: 2026, engine: "4.4 L", hp: 523, nm: 750, acc: 4.3, top: 250, cons: 11.2, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 8, name: "BMW X7 M60i", cat: "SUV", shape: "suv", file: "bmw-x7-m60i.jpg", q: "BMW X7 M60i", specs: "4.4 L · 523 {hp} · {seats7}", price: 142000, sold: 75, color: "#1b1f27", year: 2026, engine: "4.4 L", hp: 523, nm: 750, acc: 4.5, top: 250, cons: 12.0, fuel: "petrol", drive: "AWD", seats: 7 },
  { id: 9, name: "BMW M3 Competition", cat: "Sport", shape: "sport", file: "bmw-m3-competition.jpg", q: "BMW M3 Competition", specs: "3.0 L · 510 {hp}", price: 102000, sold: 150, color: "#1f8a5b", year: 2026, engine: "3.0 L", hp: 510, nm: 650, acc: 3.5, top: 250, cons: 10.2, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 10, name: "BMW M4 Competition", cat: "Sport", shape: "sport", file: "bmw-m4-competition.jpg", q: "BMW M4 Competition", specs: "3.0 L · 510 {hp}", price: 110000, sold: 175, color: "#e0332b", year: 2026, engine: "3.0 L", hp: 510, nm: 650, acc: 3.5, top: 250, cons: 10.2, fuel: "petrol", drive: "AWD", seats: 4 },
  { id: 11, name: "BMW i4 M50", cat: "Elektr", shape: "sedan", file: "bmw-i4-m50.jpg", q: "BMW i4 M50", specs: "510 {km} {range}", price: 77000, sold: 200, color: "#6fa8f0", year: 2026, engine: "EL", hp: 544, nm: 795, acc: 3.9, top: 225, cons: 20, fuel: "electric", drive: "AWD", seats: 5 },
  { id: 12, name: "BMW iX M60", cat: "Elektr", shape: "suv", file: "bmw-ix-m60.jpg", q: "BMW iX M60", specs: "561 {km} {range}", price: 135000, sold: 110, color: "#5b6b7c", year: 2026, engine: "EL", hp: 619, nm: 1100, acc: 3.8, top: 250, cons: 23, fuel: "electric", drive: "AWD", seats: 5 },
  { id: 13, name: "BMW M5 Competition", cat: "Sport", shape: "sedan", file: "bmw-m5.jpg", q: "BMW M5 Competition", specs: "4.4 L · 625 {hp}", price: 125000, sold: 70, color: "#3b4a6b", year: 2026, engine: "4.4 L", hp: 625, nm: 750, acc: 3.3, top: 250, cons: 11.0, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 14, name: "BMW i8", cat: "Sport", shape: "sport", file: "bmw-i8.jpg", q: "BMW i8", specs: "1.5 L · {hybrid} · 374 {hp}", price: 148000, sold: 45, color: "#4a6fa5", year: 2020, engine: "1.5 L", hp: 374, nm: 570, acc: 4.4, top: 250, cons: 2.1, fuel: "hybrid", drive: "AWD", seats: 4 },
  { id: 15, name: "BMW X6 M60i", cat: "SUV", shape: "suv", file: "bmw-x6-m60i.jpg", q: "BMW X6 M60i", specs: "4.4 L · 523 {hp}", price: 112000, sold: 95, color: "#7a1f2b", year: 2026, engine: "4.4 L", hp: 523, nm: 750, acc: 4.3, top: 250, cons: 11.4, fuel: "petrol", drive: "AWD", seats: 5 },
  { id: 16, name: "BMW Z4 M40i", cat: "Sport", shape: "sport", file: "bmw-z4-m40i.jpg", q: "BMW Z4 M40i", specs: "3.0 L · 382 {hp} · Roadster", price: 68000, sold: 120, color: "#c9a227", year: 2026, engine: "3.0 L", hp: 382, nm: 500, acc: 4.5, top: 250, cons: 8.1, fuel: "petrol", drive: "RWD", seats: 2 },
  { id: 17, name: "BMW 840i Gran Coupe", cat: "Sedan", shape: "sedan", file: "bmw-840i.jpg", q: "BMW 840i Gran Coupe", specs: "3.0 L · 340 {hp} · {lux}", price: 98000, sold: 60, color: "#27496d", year: 2026, engine: "3.0 L", hp: 340, nm: 500, acc: 4.9, top: 250, cons: 8.7, fuel: "petrol", drive: "AWD", seats: 4 },
  { id: 18, name: "BMW i5 M60", cat: "Elektr", shape: "sedan", file: "bmw-i5-m60.jpg", q: "BMW i5 M60", specs: "455 {km} {range}", price: 98000, sold: 85, color: "#b0b7c3", year: 2026, engine: "EL", hp: 601, nm: 795, acc: 3.8, top: 230, cons: 19.0, fuel: "electric", drive: "AWD", seats: 5 },
  { id: 19, name: "BMW i7 xDrive60", cat: "Elektr", shape: "sedan", file: "bmw-i7.jpg", q: "BMW i7 xDrive60", specs: "625 {km} {range} · {lux}", price: 142000, sold: 40, color: "#1d2430", year: 2026, engine: "EL", hp: 544, nm: 745, acc: 4.7, top: 240, cons: 19.6, fuel: "electric", drive: "AWD", seats: 5 },
  { id: 20, name: "BMW iX1 xDrive30", cat: "Elektr", shape: "suv", file: "bmw-ix1.jpg", q: "BMW iX1", specs: "438 {km} {range}", price: 58000, sold: 130, color: "#3aa6a0", year: 2026, engine: "EL", hp: 313, nm: 494, acc: 5.6, top: 180, cons: 16.5, fuel: "electric", drive: "AWD", seats: 5 }
];
const cityNames = {
  uz: ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan", "Farg'ona", "Qarshi", "Nukus"],
  ru: ["Ташкент", "Самарканд", "Бухара", "Андижан", "Наманган", "Фергана", "Карши", "Нукус"],
  en: ["Tashkent", "Samarkand", "Bukhara", "Andijan", "Namangan", "Fergana", "Qarshi", "Nukus"]
};
const branches = [
  { c: 0, street: "Amir Temur", no: 100, tel: "+998 71 200 10 01" },
  { c: 1, street: "Registon",   no: 25,  tel: "+998 66 233 20 02" },
  { c: 2, street: "Naqshbandi", no: 12,  tel: "+998 65 221 30 03" },
  { c: 3, street: "Bobur",      no: 45,  tel: "+998 74 223 40 04" },
  { c: 4, street: "Uychi",      no: 8,   tel: "+998 69 227 50 05" },
  { c: 5, street: "Mustaqillik", no: 33, tel: "+998 73 244 60 06" },
  { c: 6, street: "Nasaf",      no: 17,  tel: "+998 75 225 70 07" },
  { c: 7, street: "Berdaq",     no: 5,   tel: "+998 61 222 80 08" }
];
const recentSales = [
  { id: 7,  c: 0, date: "07.11.2026" }, { id: 10, c: 1, date: "06.11.2026" },
  { id: 1,  c: 3, date: "06.11.2026" }, { id: 11, c: 2, date: "05.11.2026" },
  { id: 6,  c: 4, date: "04.11.2026" }, { id: 3,  c: 5, date: "03.11.2026" },
  { id: 8,  c: 0, date: "02.11.2026" }
];
const featuredIds = [10, 7, 11, 3, 6];
const TOTAL_SOLD = products.reduce((s, p) => s + p.sold, 0) + 690;

// Reklama videosi (YouTube ID). Boshqa video qo'ymoqchi bo'lsangiz, shu yerda ID ni almashtiring.
// Hozirgi video: BMW iX3 "The first of a new era" rasmiy brend filmi (BMW press-relizida ko'rsatilgan havola).
const PROMO_VIDEO_ID = "qxPFC4OkeHw";
