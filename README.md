
Public / storefront (read-only)

GET /products — public listing (filters, facets)

GET /products/:slug — product page (should include variants when hasVariants=true)

GET /products/:productId/variants — variants for storefront (or include in product response






## API endpoint list

# Auth
- POST /auth/login -> request a new otp for login
- POST /auth/verify-otp -> verify a otp
- POST /auth/logout -> revoke session & clear cookie


# Admin
- POST /admin/products -> to create a new product
- GET /admin/products -> to fetch products
- GET /admin/products/[productId] -> to fetch variants of a product
- PATCH /admin/products/[productId] -> to update a product
- DELETE /admin/products/[productId] -> to delete a product
- PATCH /admin/products/[productId]/[variantId] -> to update a variant
- DELETE /admin/products/[productId]/[variantId] -> to delete a variant
- POST /admin/products/[productId]/variant -> to add single variant of product
- POST /admin/products/[productId]/variant/bulk -> to add variants of the product in bulk

# Public Routes

- GET /products -> to fetch products with searching, sorting etc.
- GET /products/[slug] -> to fetch product details 

## Cart 

- POST /cart/add -> to add items in cart
- PATCH /cart/update -> to update cart usually quantity
- DELETE /cart/delete -> to remove item from cart
- POST /cart/merge -> to merge offline cart to Database

## Orders

- GET /orders?status=shipped -> fetch user orders
- POST /orders -> to create order
- GET /orders/[orderId] -> to fetch order details
- POST /orders/[orderId]/cancel -> to cancel an order

app/
 └─ admin/
    ├─ layout.jsx
    ├─ page.jsx               // dashboard home
    ├─ products/
    │   ├─ page.jsx           // list products
    │   ├─ new/
    │   │   └─ page.jsx       // create product
    │   └─ [productId]/
    │       ├─ page.jsx       // edit product
    │       └─ variants/
    │           └─ page.jsx   // manage variants


Admin clicks Create Shipment
        ↓
createShipmentService(order)
        ↓
Shiprocket /orders/create
        ↓
Get shipment_id + awb
        ↓
Save in DB


✅ Validate pincode (6 digits)

✅ Validate phone

✅ Ensure weight > 0

✅ Lock order (prevent double shipment)

We’ll do this step-by-step.

🔙 BACKEND – WHEN YOU RESUME (IN THIS ORDER)
1️⃣ Create Shipment (core)

 POST /admin/orders/create-shipment

 Input: { orderId }

 Fetch order from DB

 Call Shiprocket create

 Save shipment snapshot

 Update order status → SHIPPED

2️⃣ Cancel Shipment (important)

 POST /admin/orders/cancel-shipment

 Check order.shipment exists

 Call Shiprocket cancel API

 Update shipment.status → CANCELLED

 Update order.status → CANCELLED

3️⃣ Tracking Sync (later, chill)

 GET tracking by AWB

 Map Shiprocket status → order status

 Optional cron / webhook

👤 USER SIDE (AFTER ADMIN UI)

 Order history page

 Show shipment status

 Show delivery estimate

 Show AWB + tracking link

🧠 IMPORTANT RULES (stick on wall)

❌ No dummy order IDs

❌ No manual testing via Postman after UI ready

✅ Real browser flow only

✅ Order = source of truth

✅ Shipment = snapshot

🔁 HOW WE WILL RESUME (exact point)

When you come back, just say:

“Nova → resume from Create Shipment (DB-driven)”

I’ll pick up exactly from there, no repetition.