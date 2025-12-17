
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
- POST /cart/add -> to add items in cart
- PATCH /cart/update -> to update cart usually quantity
- DELETE /cart/delete -> to remove item from cart
- POST /cart/merge -> to merge offline cart to Database



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
