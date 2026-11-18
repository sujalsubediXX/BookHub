# BookHub: online book rental

A library storefront where readers browse books online, request them for a number of days, pay with eSewa, Khalti or cash, and track due dates. The library admin runs everything from an admin panel.

React (Vite) + Node/Express + MongoDB (Mongoose). 25 switchable themes.

## Run it

Needs Node 18+ and MongoDB (local or Atlas).

```bash
# API
cd server
npm install
cp .env.example .env     # set MONGO_URI and a long JWT_SECRET
npm run seed             # demo accounts, 12 books, 5 months of rental history
npm run dev              # http://localhost:5000

# Shop + admin panel (new terminal)
cd client
npm install
npm run dev              # http://localhost:5173
```

| Role   | Email                | Password     | Can do |
|--------|----------------------|--------------|--------|
| Admin  | admin@library.com    | Admin@123    | everything, incl. staff accounts |
| Staff  | staff@library.com    | Staff@123    | books, rentals, customers (no reports) |
| Reader | reader@library.com   | Reader@123   | rent, pay, review, wishlist |

## The website

- **Home:** hero with search and fanned covers of the newest books, live numbers, a "Browse the collection" section with genre tabs, highest-rated books, how renting works, fees, and a sign-up band
- **Catalog (Browse):** the whole collection, live search, genre, sort, and a "More filters" panel (language, rating, price, available now)
- **Book page:** cover, genres, published date, ISBN, rent form (days, pickup or delivery, price summary), reviews
- **My rentals, Wishlist, Account, Admin panel** as described below

The default look is the "Reading Room" theme (paper, forest green, copper), matching the catalog you sent. The other 25 themes are in the theme button.

## Book data model

Books follow your schema: `title, author, description, image, isbn, publishedDate, genre[] (refs to Genre), availableCopies, totalCopies`, plus rental fields (`pricePerDay`, `lowStockThreshold`, `shelf`, `language`, `publisher`, ratings). Genres are their own collection, managed in Admin > Genres.

If you ran the earlier version, the book schema changed. Reset the database once: `npm run seed -- --reset`.

## How a rental works

1. Reader picks a book, chooses days and pickup or delivery, and sends a request (price is calculated on the server).
2. Staff approve or reject. Approving holds one copy for that reader.
3. Reader pays within 48 hours: eSewa, Khalti, or cash at the counter. Unpaid approvals expire automatically and the copy goes back on the shelf.
4. Staff hand the book over (or mark it delivered). The due date starts then.
5. Staff mark it returned. Late fees are calculated per day; staff collect them at the counter.

Cancelling after payment flags the rental "refund due" for staff to refund manually.

## Admin panel

- Dashboard: live counts, revenue and rentals per month, revenue by payment method, most rented books, categories, pending requests with approve/reject, low-stock alerts (revenue and charts need the `reports` permission)
- Rentals: every stage from new request to returned, late fees, refunds
- Books: add/edit/delete with cover image upload (JPG/PNG/WebP, max 3 MB), price per day, copies, shelf
- Inventory: stock per title, one-click +/- adjustments, per-title low-stock alert level
- Customers: search, suspend/restore, per-customer rentals
- Staff & access (admin only): create staff and tick exactly what each can do: `books`, `rentals`, `members`, `reports`

## Payments

Gateway results are never trusted from the browser redirect. After the redirect the server asks eSewa's status API or Khalti's lookup API and compares the amount with the rental total before marking anything paid.

- eSewa: sandbox values are in `.env.example`. Confirm the current test credentials in the eSewa developer docs. For live, switch `ESEWA_FORM_URL`, `ESEWA_STATUS_URL`, `ESEWA_PRODUCT_CODE`, `ESEWA_SECRET`.
- Khalti: create a sandbox merchant at test-admin.khalti.com and set `KHALTI_SECRET`. Minimum payment is Rs 10. For live, use the live key and `KHALTI_BASE_URL`.
- `API_URL` must be an address the reader's browser can reach, because the gateways send the reader back to `API_URL/api/payments/...`.

## Rules (server/.env)

`MAX_RENTAL_DAYS=30`, `MAX_OPEN_RENTALS=5`, `LATE_FEE_PER_DAY=10`, `DELIVERY_FEE=100`, `PAY_WINDOW_HOURS=48`.

## Before going live

- Uploaded covers are stored in `server/uploads`. On hosting with a temporary disk, move them to S3 or Cloudinary.
- Serve the client and API from one domain (or set `VITE_API_URL` and `VITE_FILE_URL`) and set `CLIENT_URL` and `API_URL` accordingly.
- Not included: cart for several books at once, email/SMS reminders, automatic gateway refunds.

## Adding a theme

One line in `client/src/themes.js`.
