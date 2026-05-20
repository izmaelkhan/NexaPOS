# ⚡ POS System Performance Rules

This document defines strict performance requirements for the NexaPOS backend system.

---

## 🚀 1. Billing Response Time

### Rule
- All billing-related API responses must complete in **< 200ms**

### Scope
- /sales/create
- /inventory/move (SALE type)
- stock validation during checkout

### Enforcement
- No heavy joins during billing
- No nested Prisma relations in sale flow
- Use pre-fetched or cached data only

---

## ⚡ 2. Product Lookup Performance

### Rule
- Product lookup must be **instant (< 50ms target)**

### Endpoints
- /products/search
- /products/barcode/:code

### Strategy
- Indexed DB fields only:
  - sku (unique index)
  - barcode (unique index)
  - name (indexed for fallback search)

### Optimization Rules
- Always check in this order:
  1. barcode (exact match)
  2. sku (exact match)
  3. name (indexed search)

- Limit results:
  - search → max 10–20 results

---

## 🚫 3. UI Layer Restrictions

### Rule
> UI layer must NEVER call the database directly

### Allowed Flow

UI → API → Service → Repository → Database

### Forbidden
- Prisma calls in controllers (except temporary prototypes)
- Direct DB access in routes
- Business logic inside UI/frontend

---

## 🧠 4. Caching Strategy

### Optional but recommended
- Product cache (in-memory or Redis)
- Branch stock cache for billing screen

### Goal
- Reduce repeated DB hits for same SKU/barcode
- Improve scan-to-cart speed

---

## 🏗 5. Inventory Performance Rules

- Stock is NEVER calculated on the fly during checkout
- Stock must be:
  - pre-aggregated OR
  - cached OR
  - movement-based optimized

---

## 🔒 6. Query Safety Rules

- No unindexed LIKE queries in hot paths
- Avoid full table scans in:
  - billing
  - barcode scan
  - stock validation

---

## 📊 7. Target Benchmarks

| Operation | Target |
|----------|--------|
| Product scan | < 50ms |
| Billing request | < 200ms |
| Stock check | < 100ms |
| Login | < 300ms |

---

## 🧭 8. Architecture Enforcement

Strict layering:

UI → Routes → Application Service → Domain → Infrastructure (DB)

No shortcuts allowed.

---

## ✅ Summary

This system is optimized for:

- POS speed
- high-frequency scanning
- low-latency billing
- scalable inventory operations