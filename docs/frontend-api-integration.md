# ContractCommand – Frontend API Integration Document

**Project:** P07 – ContractCommand (Defence Contract & Procurement Management Platform)
**Backend:** Django 4.2 LTS + Django REST Framework 3.14  
**Authentication:** JWT (djangorestframework-simplejwt)  
**Base URL (local):** `http://127.0.0.1:8000`  
**Base URL (production):** `https://contractcommand-backend.onrender.com`  

---

## 1. Response Envelope

All API responses follow a **consistent success/error envelope**:

```json
// Success
{
  "success": true,
  "message": "...",
  "data": { ... } | [ ... ] | null
}

// Error
{
  "success": false,
  "message": "...",
  "errors": { "field": ["detail"] }
}
```

> **Important:** All frontend axios calls must unwrap `response.data.data` to get the actual payload.

## 2. Pagination

All list endpoints return paginated results:

```json
{
  "success": true,
  "message": "...",
  "data": {
    "count": 42,
    "next": "http://127.0.0.1:8000/api/contracts/?page=2",
    "previous": null,
    "results": [ ... ]
  }
}
```

| Query param       | Description                 | Default | Max |
|-------------------|-----------------------------|---------|-----|
| `page`            | Page number                 | 1       | —   |
| `page_size`       | Items per page              | 20      | 100 |

## 3. Authentication

**Method:** JWT Bearer Token (djangorestframework-simplejwt)  
**Header:** `Authorization: Bearer <access_token>`  
**Access Token Lifetime:** 8 hours  
**Refresh Token Lifetime:** 7 days  
**Token Rotation:** Enabled (new refresh token on each refresh)  
**Token Blacklisting:** Enabled (logout invalidates tokens)

| Endpoint                          | Method | Auth Required | Description                        |
|-----------------------------------|--------|---------------|------------------------------------|
| `POST /api/auth/login/`           | POST   | None          | Login – returns `access` + `refresh` tokens |
| `POST /api/auth/register/`        | POST   | None          | Register new user                   |
| `POST /api/auth/logout/`          | POST   | Bearer Token  | Blacklist refresh token (logout)    |
| `POST /api/auth/token/refresh/`   | POST   | None          | Exchange refresh token for new access token |
| `GET  /api/auth/profile/`         | GET    | Bearer Token  | Get current user profile            |
| `PUT  /api/auth/profile/`         | PUT    | Bearer Token  | Update own profile                  |
| `POST /api/auth/change-password/` | POST   | Bearer Token  | Change own password                 |
| `GET  /api/auth/users/`           | GET    | Bearer (Admin) | List all users (Administrators only) |

### Login Request/Response
```json
// POST /api/auth/login/
// Request:
{ "username": "admin", "password": "secret123" }

// Response (NOTE: NOT wrapped in envelope – raw simplejwt response):
{ "access": "eyJ...", "refresh": "eyJ..." }
```

> **Note:** `LoginView` extends `TokenObtainPairView` directly – no envelope wrapper. Response is the raw simplejwt format.

### Profile Response Shape
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "first_name": "Admin",
  "last_name": "User",
  "full_name": "Admin User",
  "is_active": true,
  "date_joined": "2026-11-19T...",
  "groups": ["Administrator"],
  "profile": {
    "designation": "Administrator",
    "phone": "+919876543210",
    "department": "HQ",
    "city": "New Delhi",
    "is_active": true
  }
}
```

---

## 4. Roles & Permissions Matrix

| Role                 | Group Name          | Contracts  | Procurement | Vendors    | Finance    | Users     |
|----------------------|---------------------|-----------|------------|-----------|-----------|-----------|
| **Administrator**    | `Administrator`     | Full CRUD | Full CRUD  | Full CRUD | Full CRUD | List only |
| **Contracts Manager**| `Contracts Manager` | Create/Read/Update (no delete) | Create/Read/Update | Create/Read/Update (no delete) | Read      | —         |
| **Safety Officer**   | `Safety Officer`    | Read-only | Read-only  | Read-only | Read-only | —         |

**Permission Rules:**
- `GET` (list/retrieve): Any authenticated user
- `POST` (create): Administrator or Contracts Manager
- `PUT/PATCH` (update): Administrator or Contracts Manager
- `DELETE` (destroy): Administrator only
- Requisition `approve`/`reject` actions: Administrator or Contracts Manager

---

## 5. Contracts Module

**Base path:** `/api/contracts/`

| Endpoint                              | Method       | Auth               | Description                        |
|---------------------------------------|--------------|--------------------|------------------------------------|
| `GET /api/contracts/`                 | GET          | Bearer             | List all contracts (paginated, filterable) |
| `POST /api/contracts/`                | POST         | Bearer (Admin/CM)  | Create a new contract               |
| `GET /api/contracts/{id}/`            | GET          | Bearer             | Get single contract details        |
| `PUT /api/contracts/{id}/`            | PUT          | Bearer (Admin/CM)  | Full update of a contract           |
| `PATCH /api/contracts/{id}/`          | PATCH        | Bearer (Admin/CM)  | Partial update                      |
| `DELETE /api/contracts/{id}/`         | DELETE       | Bearer (Admin)     | Delete a contract                   |
| `GET /api/contracts/documents/`       | GET          | Bearer             | List contract documents            |
| `POST /api/contracts/documents/`      | POST         | Bearer             | Add a contract document            |
| `GET /api/contracts/documents/{id}/`  | GET          | Bearer             | Get single document                |
| `DELETE /api/contracts/documents/{id}/` | DELETE     | Bearer             | Remove a document                  |

**Filter params:** `status`, `contract_type`, `vendor`  
**Search fields:** `contract_number`, `title`, `description`, `vendor__company_name`  
**Ordering:** `created_at`, `start_date`, `end_date`, `value`

### Contract Object Shape
```json
{
  "id": 1,
  "contract_number": "CC-2024-0001",
  "title": "Supply of Tactical Communication Equipment",
  "contract_type": "Supply",
  "description": "...",
  "vendor": 1,
  "vendor_name": "Bharat Electronics Ltd",
  "value": "45000000.00",
  "start_date": "2024-01-01",
  "end_date": "2025-12-31",
  "status": "Active",
  "created_by": 1,
  "created_by_name": "Admin User",
  "documents": [],
  "created_at": "2024-01-01T10:00:00+05:30",
  "updated_at": "2024-01-01T10:00:00+05:30"
}
```

**Contract status values:** `Draft`, `Active`, `Expired`, `Terminated`, `Completed`  
**Contract type values:** `Supply`, `Service`, `Maintenance`, `Research`, `Consulting`  
**Contract number format:** `CC-YYYY-NNNN`

---

## 6. Procurement Module

**Base path:** `/api/procurement/`

| Endpoint                                          | Method | Auth              | Description                       |
|---------------------------------------------------|--------|-------------------|-----------------------------------|
| `GET /api/procurement/plans/`                     | GET    | Bearer            | List procurement plans            |
| `POST /api/procurement/plans/`                    | POST   | Bearer (Admin/CM) | Create procurement plan           |
| `GET /api/procurement/plans/{id}/`                | GET    | Bearer            | Plan details                      |
| `PUT /api/procurement/plans/{id}/`                | PUT    | Bearer (Admin/CM) | Update plan                       |
| `DELETE /api/procurement/plans/{id}/`             | DELETE | Bearer (Admin/CM) | Delete plan                       |
| `GET /api/procurement/requisitions/`              | GET    | Bearer            | List requisitions                 |
| `POST /api/procurement/requisitions/`             | POST   | Bearer            | Create requisition (any auth user)|
| `GET /api/procurement/requisitions/{id}/`         | GET    | Bearer            | Requisition details               |
| `PUT /api/procurement/requisitions/{id}/`         | PUT    | Bearer            | Update requisition                |
| `POST /api/procurement/requisitions/{id}/approve/`| POST   | Bearer (Admin/CM) | Approve a pending requisition     |
| `POST /api/procurement/requisitions/{id}/reject/` | POST   | Bearer (Admin/CM) | Reject a pending requisition      |
| `GET /api/procurement/requisitions/items/`        | GET    | Bearer            | List requisition line items       |
| `POST /api/procurement/requisitions/items/`       | POST   | Bearer            | Add requisition item              |
| `PUT /api/procurement/requisitions/items/{id}/`   | PUT    | Bearer            | Update item                       |
| `DELETE /api/procurement/requisitions/items/{id}/`| DELETE | Bearer            | Remove item                       |

**Plan filter params:** `status`, `fiscal_year`  
**Requisition filter params:** `status`, `priority`, `plan`

### Procurement Plan Object Shape
```json
{
  "id": 1,
  "plan_number": "PP-2024-001",
  "title": "FY2024-25 Tactical Equipment Procurement Plan",
  "description": "...",
  "fiscal_year": "2024-2025",
  "total_budget": "150000000.00",
  "status": "Active",
  "created_by": 1,
  "created_by_name": "Admin User",
  "start_date": "2024-04-01",
  "end_date": "2025-03-31",
  "requisitions_count": 5,
  "created_at": "...",
  "updated_at": "..."
}
```

**Plan status values:** `Draft`, `Approved`, `Active`, `Closed`  
**Requisition status values:** `Pending`, `Approved`, `Rejected`, `Fulfilled`, `Cancelled`  
**Requisition priority values:** `Low`, `Medium`, `High`, `Urgent`  
**RequisitionItem unit choices:** `Unit`, `Kg`, `Litre`, `Metre`, `Set`, `Box`, `Piece`, `Hour`

---

## 7. Vendors Module

**Base path:** `/api/vendors/`

| Endpoint                               | Method | Auth              | Description                       |
|----------------------------------------|--------|-------------------|-----------------------------------|
| `GET /api/vendors/`                    | GET    | Bearer            | List all vendors                  |
| `POST /api/vendors/`                   | POST   | Bearer (Admin/CM) | Register new vendor               |
| `GET /api/vendors/{id}/`              | GET    | Bearer            | Vendor details                    |
| `PUT /api/vendors/{id}/`              | PUT    | Bearer (Admin/CM) | Update vendor                     |
| `DELETE /api/vendors/{id}/`           | DELETE | Bearer (Admin)    | Delete vendor                     |
| `GET /api/vendors/evaluations/`        | GET    | Bearer            | List vendor evaluations           |
| `POST /api/vendors/evaluations/`       | POST   | Bearer            | Submit vendor evaluation          |
| `GET /api/vendors/evaluations/{id}/`   | GET    | Bearer            | Evaluation details                |
| `PUT /api/vendors/evaluations/{id}/`   | PUT    | Bearer            | Update evaluation                 |
| `DELETE /api/vendors/evaluations/{id}/`| DELETE | Bearer            | Delete evaluation                 |

**Vendor filter params:** `status`, `category`, `city`, `state`  
**Evaluation filter params:** `vendor`, `recommendation`

### Vendor Object Shape
```json
{
  "id": 1,
  "vendor_code": "VND-0001",
  "company_name": "Bharat Electronics Ltd",
  "category": "Electronics",
  "contact_person": "Ramesh Kumar",
  "email": "procurement@bel.co.in",
  "phone": "+919876543210",
  "address": "Corporate Office, Jalahalli Post",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560013",
  "gst_number": "29AACCB1234N1Z5",
  "pan_number": "AACCB1234N",
  "status": "Active",
  "registered_by": 1,
  "registered_by_name": "Admin User",
  "contracts_count": 3,
  "average_score": 8.5,
  "evaluations": [],
  "created_at": "...",
  "updated_at": "..."
}
```

**Vendor status values:** `Active`, `Inactive`, `Blacklisted`, `Pending`  
**Vendor category values:** `Electronics`, `Mechanical`, `IT Services`, `Logistics`, `Chemicals`, `Construction`, `Consulting`, `Ammunition`, `Vehicles`, `Other`  
**Evaluation recommendation values:** `Selected`, `Shortlisted`, `Rejected`  
**Scores:** 0–10 for `quality_score`, `delivery_score`, `pricing_score`, `compliance_score` (auto-computed `overall_score` = average)

---

## 8. Finance Module

**Base path:** `/api/finance/`

| Endpoint                               | Method | Auth              | Description                       |
|----------------------------------------|--------|-------------------|-----------------------------------|
| `GET /api/finance/invoices/`           | GET    | Bearer            | List all invoices                 |
| `POST /api/finance/invoices/`          | POST   | Bearer            | Create invoice                    |
| `GET /api/finance/invoices/{id}/`      | GET    | Bearer            | Invoice details (with items + payments) |
| `PUT /api/finance/invoices/{id}/`      | PUT    | Bearer            | Update invoice                    |
| `DELETE /api/finance/invoices/{id}/`   | DELETE | Bearer            | Delete invoice                    |
| `GET /api/finance/invoices/items/`     | GET    | Bearer            | List invoice line items           |
| `POST /api/finance/invoices/items/`    | POST   | Bearer            | Add invoice item                  |
| `PUT /api/finance/invoices/items/{id}/`| PUT    | Bearer            | Update item                       |
| `DELETE /api/finance/invoices/items/{id}/`| DELETE | Bearer         | Delete item                       |
| `GET /api/finance/payments/`           | GET    | Bearer            | List all payments                 |
| `POST /api/finance/payments/`          | POST   | Bearer            | Record a payment                  |
| `GET /api/finance/payments/{id}/`      | GET    | Bearer            | Payment details                   |
| `PUT /api/finance/payments/{id}/`      | PUT    | Bearer            | Update payment record             |

**Invoice filter params:** `status`, `contract`, `vendor`  
**Payment filter params:** `status`, `payment_method`, `invoice`

### Invoice Object Shape
```json
{
  "id": 1,
  "invoice_number": "INV-2024-00001",
  "contract": 1,
  "contract_number": "CC-2024-0001",
  "vendor": 1,
  "vendor_name": "Bharat Electronics Ltd",
  "invoice_date": "2024-06-01",
  "due_date": "2024-07-01",
  "status": "Approved",
  "subtotal": "1000000.00",
  "tax_percent": "18.00",
  "tax_amount": "180000.00",
  "total_amount": "1180000.00",
  "paid_amount": "1180000.00",
  "balance_amount": "0.00",
  "notes": "",
  "created_by": 1,
  "created_by_name": "Admin User",
  "items": [],
  "payments": [],
  "created_at": "...",
  "updated_at": "..."
}
```

**Invoice status values:** `Draft`, `Submitted`, `Approved`, `Paid`, `Overdue`, `Cancelled`  
**Payment method values:** `NEFT`, `RTGS`, `IMPS`, `Cheque`, `DD`  
**Payment status values:** `Initiated`, `Processing`, `Completed`, `Failed`, `Reversed`  
**Invoice number format:** `INV-YYYY-NNNNN`  
**GST:** Auto-calculated by backend at 18% default; `tax_amount = subtotal × tax_percent / 100`

---

## 9. API Gaps & Dashboard Strategy

There is **no dedicated `/api/dashboard/` endpoint**. Dashboard metrics must be derived from list APIs.

| Dashboard Metric           | Source API                               | Calculation                            |
|----------------------------|------------------------------------------|----------------------------------------|
| Total Contracts            | `GET /api/contracts/?page_size=1`        | `data.count`                           |
| Active Contracts           | `GET /api/contracts/?status=Active&page_size=1` | `data.count`                    |
| Draft Contracts            | `GET /api/contracts/?status=Draft&page_size=1` | `data.count`                     |
| Procurement Plans          | `GET /api/procurement/plans/?page_size=1`| `data.count`                           |
| Pending Requisitions       | `GET /api/procurement/requisitions/?status=Pending&page_size=1` | `data.count` |
| Total Vendors              | `GET /api/vendors/?page_size=1`          | `data.count`                           |
| Pending Invoices           | `GET /api/finance/invoices/?status=Submitted&page_size=1` | `data.count`         |
| Completed Payments         | `GET /api/finance/payments/?status=Completed&page_size=1` | `data.count`         |

For charts, fetch last 20 items and derive distribution from the results (not from a dedicated stats endpoint).

---

## 10. CORS Configuration

The backend allows these origins (from `.env`):
- `http://localhost:3000`
- `http://127.0.0.1:3000`

For production, add the deployed frontend URL to `CORS_ALLOWED_ORIGINS` in the backend `.env`.

**Vite default dev port is 5173**, not 3000. The backend CORS must be updated to allow `http://localhost:5173`.

> **Action required (Backend .env update):** Add `http://localhost:5173,http://127.0.0.1:5173` to `CORS_ALLOWED_ORIGINS` in `E:\Contract_Command\.env`.

---

## 11. File/Document Handling

`ContractDocument` model stores `file_path` and `file_name` as plain text strings (not Django `FileField`). The backend does **not** handle file uploads via multipart form — only metadata records are stored. Frontend should allow entry of document title and file reference path strings when creating document records.

---

## 12. Summary Status

| Module         | Endpoints | Auth Method | Pagination | Filters | Search | Status  |
|----------------|-----------|-------------|-----------|---------|--------|---------|
| Auth           | 7         | JWT Bearer  | No        | No      | No     | ✅ Ready |
| Contracts      | 10        | JWT Bearer  | Yes       | Yes     | Yes    | ✅ Ready |
| Procurement    | 15        | JWT Bearer  | Yes       | Yes     | Yes    | ✅ Ready |
| Vendors        | 10        | JWT Bearer  | Yes       | Yes     | Yes    | ✅ Ready |
| Finance        | 12        | JWT Bearer  | Yes       | Yes     | Yes    | ✅ Ready |
| Dashboard      | —         | —           | —         | —       | —      | ⚠️ Derived from list APIs |
