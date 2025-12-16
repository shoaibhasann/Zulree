todo
Hook these lists into your admin endpoint GET /admin/categories/sub?main= (easy server change).



High-level routes list (recommended)

Products

GET /admin/products — list (with filters/pagination)

GET /admin/products/:id — get single product (includes minimal variant info or flag)

POST /admin/products — create product

PUT /admin/products/:id — update product

DELETE /admin/products/:id — delete product

Variants (manual per-variant create/edit/delete)

GET /admin/products/:productId/variants — list all variants for a product

GET /admin/variants/:variantId — get single variant

POST /admin/products/:productId/variants — create one variant (manual)

PUT /admin/variants/:variantId — update variant (stock, price, images, selectedOptions)

DELETE /admin/variants/:variantId — delete variant

Small helpers

POST /admin/products/:productId/variants/bulk — optional bulk create (if needed later)

POST /admin/products/:productId/toggle-variants — set hasVariants true/false

GET /admin/options?category=...&sub=... — return defaultOptionsByCategory (UI convenience)

POST /admin/products/:productId/recompute-stock — force recomputeProductStock (admin tool)

Public / storefront (read-only)

GET /products — public listing (filters, facets)

GET /products/:slug — product page (should include variants when hasVariants=true)

GET /products/:productId/variants — variants for storefront (or include in product response



// adminProducts.js (express router)
router.post("/admin/products", createProduct);
router.put("/admin/products/:id", updateProduct);
router.get("/admin/products", listProducts);
router.get("/admin/products/:id", getProduct);
router.post("/admin/products/:id/toggle-variants", toggleVariants);
router.post("/admin/products/:id/recompute-stock", recomputeStock);

// adminVariants.js (express router)
router.get("/admin/products/:productId/variants", listVariantsForProduct);
router.post("/admin/products/:productId/variants", createVariant);
router.put("/admin/variants/:variantId", updateVariant);
router.delete("/admin/variants/:variantId", deleteVariant);
router.post("/admin/products/:productId/variants/bulk", createVariantsBulk); // optional


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
