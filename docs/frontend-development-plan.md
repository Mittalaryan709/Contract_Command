# ContractCommand – Frontend Development Plan

**Project:** P07 – ContractCommand (Defence Contract & Procurement Management Platform)  
**Academic Context:** ABES Engineering College, MCA 2nd Year, HCLTech Career Shaper  
**Tech Stack:** React 18 + Vite + Bootstrap 5 + Axios + React Router DOM  
**Backend Base URL (local):** `http://127.0.0.1:8000`  

---

## 1. Backend Inspection Summary

### 1.1 Backend Structure (Confirmed)

```
backend/
├── config/          # Django project config (settings, URLs, wsgi)
├── accounts/        # JWT auth, UserProfile, roles
├── contracts/       # Contract + ContractDocument
├── procurement/     # ProcurementPlan, Requisition, RequisitionItem
├── vendors/         # Vendor, VendorEvaluation
├── finance/         # Invoice, InvoiceItem, Payment
└── common/          # Pagination, permissions, validators, responses
```

### 1.2 Authentication Method

- **Type:** JWT Bearer Token (djangorestframework-simplejwt)  
- **Login endpoint:** `POST /api/auth/login/` → returns `{ access, refresh }`  
- **Header:** `Authorization: Bearer <access_token>`  
- **Access lifetime:** 8 hours | **Refresh lifetime:** 7 days  
- **Logout:** `POST /api/auth/logout/` with `{ refresh }` body → blacklists token  

### 1.3 Roles Available (3 Roles)

| Role Name           | Group in Django       | Permissions |
|---------------------|-----------------------|-------------|
| `Administrator`     | `Administrator`       | Full CRUD across all modules |
| `Contracts Manager` | `Contracts Manager`   | Create/Update (no delete) in Contracts, Procurement, Vendors |
| `Safety Officer`    | `Safety Officer`      | Read-only across all modules |

### 1.4 API Response Format

All responses are wrapped in a consistent envelope:
```json
{ "success": true, "message": "...", "data": { ... } }
```
**Exception:** Login response is raw simplejwt format (no envelope).

### 1.5 Pagination

Page size: 20 (default), max 100.  
Response: `{ count, next, previous, results }` inside `data`.

---

## 2. Complete Screen Inventory

### Module 0: Public Pages (Unauthenticated)

| Screen | Route | Description |
|--------|-------|-------------|
| Landing Page | `/` | Hero, features, Indian defence context, CTA |
| About | `/about` | Platform overview, mandate, mission |
| Modules Overview | `/modules` | 4 modules explained with icons |
| Announcements | `/announcements` | Latest updates/notices section |
| Contact & Support | `/contact` | Support info |

### Module 1: Authentication

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/login` | JWT login form |
| Unauthorized | `/unauthorized` | 403 screen |
| Not Found | `*` | 404 screen |

### Module 2: Dashboard (Post-Login)

| Screen | Route | Description |
|--------|-------|-------------|
| Main Dashboard | `/app/dashboard` | Summary cards + charts + recent activity |

### Module 3: Contracts

| Screen | Route | Description |
|--------|-------|-------------|
| Contract List | `/app/contracts` | Paginated, searchable, filterable table |
| Create Contract | `/app/contracts/new` | Form with vendor select, type, dates |
| Contract Details | `/app/contracts/:id` | Full details + embedded documents |
| Edit Contract | `/app/contracts/:id/edit` | Pre-filled form |
| Contract Documents | `/app/contracts/:id/documents` | Document list + add document form |

### Module 4: Procurement

| Screen | Route | Description |
|--------|-------|-------------|
| Procurement Plans List | `/app/procurement/plans` | Plans table with status badges |
| Create Plan | `/app/procurement/plans/new` | Plan creation form |
| Plan Details | `/app/procurement/plans/:id` | Plan info + linked requisitions |
| Edit Plan | `/app/procurement/plans/:id/edit` | Edit plan form |
| Requisitions List | `/app/procurement/requisitions` | All requisitions with priority/status filters |
| Create Requisition | `/app/procurement/requisitions/new` | Requisition form with item lines |
| Requisition Details | `/app/procurement/requisitions/:id` | Full detail + approve/reject actions |
| Edit Requisition | `/app/procurement/requisitions/:id/edit` | Edit form |

### Module 5: Vendors

| Screen | Route | Description |
|--------|-------|-------------|
| Vendor List | `/app/vendors` | Searchable vendor directory |
| Add Vendor | `/app/vendors/new` | Vendor registration form |
| Vendor Details | `/app/vendors/:id` | Full vendor card + evaluations + contracts |
| Edit Vendor | `/app/vendors/:id/edit` | Edit vendor form |
| Vendor Evaluation | `/app/vendors/:id/evaluate` | 4-pillar scoring form |
| Vendor Comparison | `/app/vendors/compare` | Side-by-side score comparison |

### Module 6: Finance

| Screen | Route | Description |
|--------|-------|-------------|
| Invoice List | `/app/finance/invoices` | Invoice table with status filters |
| Create Invoice | `/app/finance/invoices/new` | Invoice form with line items |
| Invoice Details | `/app/finance/invoices/:id` | Invoice with GST breakdown + payments |
| Edit Invoice | `/app/finance/invoices/:id/edit` | Edit form |
| Payment List | `/app/finance/payments` | All payment records |
| Record Payment | `/app/finance/payments/new` | Payment form linked to invoice |
| Payment Details | `/app/finance/payments/:id` | Payment record detail |

---

## 3. Component Architecture Plan

```
frontend/src/
├── api/
│   ├── axiosInstance.js       # Centralized axios + interceptors
│   ├── authApi.js             # Login, logout, profile, register
│   ├── contractApi.js         # Contracts + documents CRUD
│   ├── procurementApi.js      # Plans + requisitions + items
│   ├── vendorApi.js           # Vendors + evaluations
│   ├── financeApi.js          # Invoices + items + payments
│   └── dashboardApi.js        # Derived dashboard metrics
│
├── context/
│   └── AuthContext.jsx        # Auth state, tokens, user/role
│
├── hooks/
│   ├── useAuth.js             # Auth context consumer
│   ├── useFetch.js            # Generic loading/error/data hook
│   └── useDebounce.js         # Debounced search input
│
├── layouts/
│   ├── PublicLayout.jsx       # Public navbar + footer
│   └── AppLayout.jsx          # Sidebar + topbar layout
│
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorAlert.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── PriorityBadge.jsx
│   │   └── Breadcrumb.jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── Footer.jsx
│   ├── tables/
│   │   ├── DataTable.jsx      # Reusable table with sort/search/pagination
│   │   └── Pagination.jsx
│   ├── charts/
│   │   ├── DonutChart.jsx
│   │   ├── BarChart.jsx
│   │   └── LineChart.jsx
│   └── forms/
│       ├── FormField.jsx
│       └── SearchFilter.jsx
│
├── routes/
│   ├── PublicRoutes.jsx       # Landing, about, etc.
│   ├── ProtectedRoute.jsx     # Redirect to /login if not authenticated
│   └── RoleGuard.jsx          # Redirect to /unauthorized if wrong role
│
├── pages/
│   ├── public/
│   │   ├── LandingPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ModulesPage.jsx
│   │   └── ContactPage.jsx
│   ├── auth/
│   │   └── LoginPage.jsx
│   ├── dashboard/
│   │   └── DashboardPage.jsx
│   ├── contracts/
│   │   ├── ContractListPage.jsx
│   │   ├── ContractCreatePage.jsx
│   │   ├── ContractDetailPage.jsx
│   │   └── ContractEditPage.jsx
│   ├── procurement/
│   │   ├── PlanListPage.jsx
│   │   ├── PlanCreatePage.jsx
│   │   ├── PlanDetailPage.jsx
│   │   ├── RequisitionListPage.jsx
│   │   ├── RequisitionCreatePage.jsx
│   │   └── RequisitionDetailPage.jsx
│   ├── vendors/
│   │   ├── VendorListPage.jsx
│   │   ├── VendorCreatePage.jsx
│   │   ├── VendorDetailPage.jsx
│   │   ├── VendorEvaluationPage.jsx
│   │   └── VendorComparePage.jsx
│   ├── finance/
│   │   ├── InvoiceListPage.jsx
│   │   ├── InvoiceCreatePage.jsx
│   │   ├── InvoiceDetailPage.jsx
│   │   ├── PaymentListPage.jsx
│   │   ├── PaymentCreatePage.jsx
│   │   └── PaymentDetailPage.jsx
│   └── errors/
│       ├── NotFoundPage.jsx
│       └── UnauthorizedPage.jsx
│
├── utils/
│   ├── formatters.js          # INR currency, Indian date, number formatting
│   └── roleHelpers.js         # Role check utilities
│
├── assets/
│   ├── logos/
│   └── images/
│
├── App.jsx
└── main.jsx
```

---

## 4. Design System

### Colour Palette
```css
--navy:         #102A43;   /* Primary - Navbar, sidebar */
--deep-navy:    #0B1F33;   /* Deep backgrounds */
--steel-blue:   #334E68;   /* Secondary UI elements */
--white:        #FFFFFF;   /* Content backgrounds */
--light-grey:   #F3F6F9;   /* Page backgrounds */
--saffron:      #E58A24;   /* Accent - CTA buttons, warnings */
--green:        #287A4B;   /* Success states, active badges */
--red:          #C0392B;   /* Danger, errors */
--text-dark:    #1A2B3C;   /* Primary text */
--text-muted:   #627D98;   /* Secondary text */
```

### Typography
- Headings: `Inter` or `Source Serif Pro`
- Body: `Inter`, `system-ui`
- Monospace (IDs, codes): `JetBrains Mono` or `Courier New`

### Layout Measurements
- Sidebar width: 260px (collapsed: 70px)
- Topbar height: 60px
- Card border-radius: 8px
- Table row height: 52px

---

## 5. Indian Context Features

| Feature | Implementation |
|---------|---------------|
| Currency | INR (₹) using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` |
| Dates | DD-MM-YYYY display using custom `formatDate()` util |
| GST Display | Shown in invoice detail: subtotal + 18% GST = total |
| Vendor Fields | GSTIN, PAN (masked), state, city, pincode |
| Vendor Badges | MSME tag, Indigenous tag (informational only) |
| Procurement Labels | DAP 2020 category, Make in India indicator section |
| Landing Page | Tiranga element, Make in India section, iDEX reference |

---

## 6. Known Gaps / Notes

| Gap | Severity | Resolution |
|-----|----------|------------|
| No `/api/dashboard/` endpoint | Medium | Derive from filtered list APIs with `page_size=1` |
| `ContractDocument` stores text paths, not actual files | Low | UI provides title + path/filename text fields |
| CORS origin `localhost:5173` not in backend CORS config | High | Update `.env`: add `http://localhost:5173` to `CORS_ALLOWED_ORIGINS` |
| Login response is NOT wrapped in envelope | Medium | Frontend handles both raw simplejwt and envelope formats |
| No dedicated reporting/analytics endpoint | Low | Charts derived from list data |

---

## 7. Phase 1 Setup Commands (PowerShell)

```powershell
# Navigate to frontend directory
cd E:\Contract_Command\frontend

# Scaffold React + Vite project
npm create vite@latest . -- --template react

# Install all dependencies
npm install react-router-dom axios bootstrap bootstrap-icons
npm install chart.js react-chartjs-2
npm install react-hook-form @hookform/resolvers yup
npm install lucide-react

# Install dev dependencies
npm install -D eslint @eslint/js eslint-plugin-react
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

---

## 8. Environment Variables

```env
# frontend/.env.example
VITE_API_BASE_URL=http://127.0.0.1:8000
```

```env
# frontend/.env.local (not committed to git)
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 9. Git Branch Plan

| Phase | Branch | Commit Convention |
|-------|--------|--------------------|
| Phase 1 | `feature/frontend-setup` | `feat(frontend): initialize React Vite project` |
| Phase 2 | `feature/frontend-public-pages` | `feat(frontend): create public landing page` |
| Phase 3 | `feature/frontend-auth-layout` | `feat(frontend): integrate authentication and dashboard layout` |
| Phase 4 | `feature/frontend-contracts` | `feat(contracts): implement contract module screens` |
| Phase 5 | `feature/frontend-procurement` | `feat(procurement): implement procurement and requisition screens` |
| Phase 6 | `feature/frontend-vendors` | `feat(vendors): implement vendor management screens` |
| Phase 7 | `feature/frontend-finance` | `feat(finance): implement invoice and payment screens` |
| Phase 8 | `feature/frontend-dashboard` | `feat(dashboard): connect analytics and charts` |
| Phase 9 | `feature/frontend-testing` | `test(frontend): add integration tests` |
| Phase 10 | `docs/frontend-documentation` | `docs(frontend): complete documentation and release` |

---

## 10. Acceptance Checklist Tracking

- [ ] Phase 0 — Backend Inspection Complete ← **CURRENT**
- [ ] Phase 1 — Project Setup
- [ ] Phase 2 — Public Landing Pages
- [ ] Phase 3 — Auth + Layout
- [ ] Phase 4 — Contracts Module
- [ ] Phase 5 — Procurement Module
- [ ] Phase 6 — Vendors Module
- [ ] Phase 7 — Finance Module
- [ ] Phase 8 — Dashboard & Analytics
- [ ] Phase 9 — Testing
- [ ] Phase 10 — Documentation & Release
