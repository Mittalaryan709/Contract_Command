# P07 ContractCommand – Frontend Integration Specification & Wireframe Data Contracts

This document specifies the exact JSON REST API data contracts for the upcoming React frontend development phase.

---

## 1. Authentication Flow

- **Login Endpoint:** `POST /api/auth/login/`
  - Request: `{"username": "...", "password": "..."}`
  - Response: `{"access": "<JWT>", "refresh": "<JWT>"}`
- **Header for all Protected Calls:** `Authorization: Bearer <access_token>`
- **Token Refresh:** `POST /api/auth/token/refresh/` with `{"refresh": "..."}`
- **Current User Profile:** `GET /api/auth/profile/`

---

## 2. Standard Response Envelope

Every endpoint adheres to the standard ContractCommand JSON envelope:

### Success Response (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Contracts retrieved successfully.",
  "data": {
    "count": 11,
    "next": null,
    "previous": null,
    "results": [ ... ]
  }
}
```

### Error Response (HTTP 400 / 401 / 403 / 404 / 500)
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "end_date": ["End date must be after start date."]
  }
}
```

---

## 3. UI Screen Data Contracts

### Screen 1: Contracts Dashboard (`/contracts`)
- **API Endpoint:** `GET /api/contracts/?status=Active&search=...&ordering=-created_at`
- **Fields Rendered:** `contract_number`, `title`, `vendor_name`, `value`, `status`, `start_date`, `end_date`.

### Screen 2: Procurement Requisitions Table (`/procurement/requisitions`)
- **API Endpoint:** `GET /api/procurement/requisitions/?status=Pending`
- **Action Buttons:**
  - Approve: `POST /api/procurement/requisitions/{id}/approve/`
  - Reject: `POST /api/procurement/requisitions/{id}/reject/`

### Screen 3: Vendor Directory & Evaluation (`/vendors`)
- **API Endpoint:** `GET /api/vendors/`
- **Scorecard View:** `GET /api/vendors/{id}/` returns embedded `evaluations` array and calculated `average_score`.
- **Add Evaluation Modal:** `POST /api/vendors/evaluations/`

### Screen 4: Invoice & Payment Tracker (`/finance/invoices`)
- **API Endpoint:** `GET /api/finance/invoices/{id}/`
- **Computed Fields:**
  - `subtotal`: Sum of all items.
  - `tax_amount`: 18% GST.
  - `total_amount`: Final payable.
  - `paid_amount`: Sum of completed payments.
  - `balance_amount`: Outstanding amount.
- **Disburse Payment Modal:** `POST /api/finance/payments/`
