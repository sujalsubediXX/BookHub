import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Book from './models/Book.js';
import Genre from './models/Genre.js';
import Rental from './models/Rental.js';
import Review from './models/Review.js';

const users = [
  { name: 'Library Admin', email: 'admin@library.com', password: 'Admin@123', role: 'admin' },
  { name: 'Sita Staff', email: 'staff@library.com', password: 'Staff@123', role: 'staff', permissions: ['books', 'rentals', 'members'] },
  { name: 'Ram Reader', email: 'reader@library.com', password: 'Reader@123', role: 'customer', phone: '9800000000', address: 'Baneshwor, Kathmandu' },
  { name: 'Mina Reader', email: 'mina@library.com', password: 'Reader@123', role: 'customer', phone: '9811111111' },
];

const GENRES = ['Programming', 'Computer Science', 'History', 'Nepali Literature', 'Self Help', 'Fiction', 'Science'];

// title, author, isbn, genres, year, copies, pricePerDay, language, description
const books = [
  ['Clean Code', 'Robert C. Martin', '9780132350884', ['Programming'], 2008, 3, 15, 'English', 'A handbook of agile software craftsmanship: how to write code that is easy to read, change and trust.'],
  ['The Pragmatic Programmer', 'Andrew Hunt, David Thomas', '9780135957059', ['Programming'], 2019, 2, 15, 'English', 'Practical advice for working programmers, from tracer bullets to the care of your own craft.'],
  ['Eloquent JavaScript', 'Marijn Haverbeke', '9781593279509', ['Programming'], 2018, 4, 12, 'English', 'A modern introduction to JavaScript, programming and the wonders of the digital.'],
  ['Introduction to Algorithms', 'Thomas H. Cormen', '9780262046305', ['Computer Science'], 2022, 2, 20, 'English', 'The standard university text on algorithms, with rigorous but readable coverage.'],
  ['Designing Data-Intensive Applications', 'Martin Kleppmann', '9781449373320', ['Computer Science', 'Programming'], 2017, 1, 20, 'English', 'The big ideas behind reliable, scalable and maintainable data systems.'],
  ['Sapiens', 'Yuval Noah Harari', '9780062316097', ['History'], 2015, 3, 10, 'English', 'A brief history of humankind, from the first humans to the present.'],
  ['Muna Madan', 'Laxmi Prasad Devkota', '9789937905008', ['Nepali Literature'], 1936, 2, 8, 'Nepali', 'The beloved narrative poem of a young merchant, his journey to Lhasa and the wife he leaves behind.'],
  ['Seto Bagh', 'Diwa Shamsher Rana', '9789937905015', ['Nepali Literature', 'Fiction'], 1991, 1, 8, 'Nepali', 'A classic Nepali novel set in the Rana era.'],
  ['Atomic Habits', 'James Clear', '9780735211292', ['Self Help'], 2018, 5, 10, 'English', 'Small changes, remarkable results: a practical framework for building good habits.'],
  ['The Alchemist', 'Paulo Coelho', '9780062315007', ['Fiction'], 1988, 3, 8, 'English', 'A shepherd boy follows his dream across the desert in search of treasure.'],
  ['1984', 'George Orwell', '9780451524935', ['Fiction'], 1949, 2, 8, 'English', 'A chilling vision of a totalitarian future under constant surveillance.'],
  ['A Brief History of Time', 'Stephen Hawking', '9780553380163', ['Science'], 1988, 2, 10, 'English', 'From the Big Bang to black holes, explained for the curious reader.'],
];

await mongoose.connect(process.env.MONGO_URI);
if (process.argv.includes('--reset')) {
  await mongoose.connection.dropDatabase();
}

for (const u of users) if (!(await User.findOne({ email: u.email }))) await User.create(u);

const genreIds = {};
for (const name of GENRES) genreIds[name] = (await Genre.findOne({ name }) || (await Genre.create({ name })))._id;

for (const [title, author, isbn, gs, year, totalCopies, pricePerDay, language, description] of books) {
  if (await Book.findOne({ isbn })) continue;
  await Book.create({
    title, author, isbn, description, language, pricePerDay, totalCopies, availableCopies: totalCopies,
    genre: gs.map((g) => genreIds[g]), publishedDate: new Date(Date.UTC(year, 0, 1)),
    shelf: `${gs[0][0]}-${(year % 9) + 1}`,
    image: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
  });
}

if ((await Rental.countDocuments()) === 0) {
  const allBooks = await Book.find();
  const reader = await User.findOne({ email: 'reader@library.com' });
  const mina = await User.findOne({ email: 'mina@library.com' });
  const admin = await User.findOne({ email: 'admin@library.com' });
  const day = 86400000;
  const rnd = (n) => Math.floor(Math.random() * n);
  const make = (book, user, o) => {
    const days = o.days || 3 + rnd(10);
    const rentalFee = book.pricePerDay * days;
    const deliveryFee = o.delivery ? 100 : 0;
    return {
      book: book._id, user: user._id, days, pricePerDay: book.pricePerDay, rentalFee, deliveryFee, total: rentalFee + deliveryFee,
      fulfilment: o.delivery ? 'delivery' : 'pickup', deliveryAddress: o.delivery ? 'Baneshwor, Kathmandu' : undefined, phone: user.phone,
      approvedBy: admin._id, ...o.fields,
    };
  };

  // ~5 months of history so the analytics charts have something to show
  const history = [];
  for (let i = 0; i < 34; i++) {
    const book = allBooks[rnd(allBooks.length)];
    const user = i % 2 ? reader : mina;
    const created = new Date(Date.now() - (2 + rnd(150)) * day);
    const r = make(book, user, { delivery: rnd(4) === 0 });
    const due = new Date(created.getTime() + (1 + r.days) * day);
    const late = rnd(6) === 0 ? 1 + rnd(3) : 0;
    const returned = new Date(due.getTime() + (late ? late * day : -rnd(2) * day));
    history.push({
      ...r, createdAt: created, updatedAt: returned, status: 'returned', approvedAt: created,
      payment: { method: ['esewa', 'khalti', 'cash'][rnd(3)], status: 'paid', paidAt: new Date(created.getTime() + 3600000) },
      handedOverAt: new Date(created.getTime() + day), dueDate: due, returnedAt: returned,
      lateFee: late * 10, lateFeePaid: true,
    });
  }
  await Rental.collection.insertMany(history.map((h) => ({ ...h })));

  // live examples for the demo reader
  const [b1, b2, b3, b4] = [allBooks[0], allBooks[8], allBooks[5], allBooks[2]];
  const live = [
    make(b1, reader, { days: 10, fields: { status: 'active', handedOverAt: new Date(Date.now() - 4 * day), dueDate: new Date(Date.now() + 6 * day), payment: { method: 'esewa', status: 'paid', paidAt: new Date(Date.now() - 5 * day) } } }),
    make(b2, reader, { days: 5, fields: { status: 'active', handedOverAt: new Date(Date.now() - 9 * day), dueDate: new Date(Date.now() - 2 * day), payment: { method: 'cash', status: 'paid', paidAt: new Date(Date.now() - 9 * day) } } }),
    make(b3, reader, { days: 7, fields: { status: 'requested' } }),
    make(b4, mina, { days: 6, delivery: true, fields: { status: 'requested' } }),
  ];
  for (const l of live) await Rental.create(l);
  for (const b of [b1, b2]) await Book.findByIdAndUpdate(b._id, { $inc: { availableCopies: -1 } });
  await Book.findByIdAndUpdate(allBooks[4]._id, { availableCopies: 0 }); // shows an "all copies out" book + low-stock alert (demo only)
}

// a few reviews so ratings show up
if ((await Review.countDocuments()) === 0) {
  const users2 = await User.find({ role: 'customer' });
  const picks = await Book.find().limit(8);
  for (const b of picks) {
    for (const u of users2) {
      await Review.create({ book: b._id, user: u._id, rating: 3 + Math.floor(Math.random() * 3), comment: ['Loved it, arrived in great condition.', 'Worth renting for a week.', 'Solid read, would borrow again.'][Math.floor(Math.random() * 3)] });
    }
    const rs = await Review.find({ book: b._id });
    await Book.findByIdAndUpdate(b._id, { avgRating: Math.round((rs.reduce((s, r) => s + r.rating, 0) / rs.length) * 10) / 10, reviewCount: rs.length });
  }
}

await mongoose.disconnect();
