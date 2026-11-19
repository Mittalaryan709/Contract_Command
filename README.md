# ContractCommand (P07) – Defense Contract and Procurement Management Platform

**MCA 2nd Year HCLTech Companion Project**  
**Domain:** Aerospace and Defense  
**Project Code:** P07  

---

## 1. Project Overview

**ContractCommand** is an enterprise-grade backend platform engineered to centralize defense contracts, automate procurement workflows, evaluate defense contractors, and manage milestone disbursements with full audit compliance.

### Core Modules
1. **Accounts & RBAC:** Multi-tier authentication using JWT, granular permissions across Administrator, Contracts Manager, and Safety Officer roles.
2. **Contracts Management:** Lifecycle tracking (`Draft`, `Active`, `Expired`, `Terminated`, `Completed`), contract documents, and date constraint validation.
3. **Procurement Planning:** Multi-year fiscal plans (`PLAN-YYYY-NN`), departmental requisitions, and approval workflows.
4. **Vendor Governance:** Comprehensive vendor registration (GST, PAN, contact data) and 4-pillar performance evaluations (Quality, Delivery, Pricing, Compliance on a 0–10 scale).
5. **Finance & Payment Processing:** Milestone invoices with 18% GST calculation, line items, and payment reconciliation (RTGS, NEFT).

---

## 2. Technology Stack

- **Language:** Python 3.11+
- **Framework:** Django 4.2 LTS & Django REST Framework (DRF)
- **Database:** MySQL 8.0 (InnoDB, utf8mb4, 3NF Normalized)
- **Authentication:** `djangorestframework-simplejwt` (JWT Access & Refresh tokens)
- **Testing:** `pytest` and `pytest-django` (28 Automated Unit & API Tests)
- **API Documentation:** `drf-spectacular` (OpenAPI 3.0 / Swagger UI / ReDoc)
- **Cross-Origin Handling:** `django-cors-headers` (Configured for future React frontend)

---

## 3. Directory Structure

```text
ContractCommand/
│
├── backend/
│   ├── config/              # Django settings, root URLs, WSGI/ASGI
│   ├── accounts/            # User profile, JWT auth, groups & roles
│   ├── contracts/           # Contracts, documents, lifecycle tracking
│   ├── procurement/         # Procurement plans, requisitions, items
│   ├── vendors/             # Vendor directory, evaluations & scoring
│   ├── finance/             # Invoices, invoice items, payment records
│   ├── common/              # Custom permissions, pagination, validators
│   ├── tests/               # Pytest test suite (28 test cases)
│   ├── pytest.ini           # Pytest configuration
│   ├── requirements.txt     # Python dependencies
│   └── manage.py            # Django CLI utility
│
├── database/
│   ├── schema.sql           # MySQL 8.0 DDL schema (3NF, Foreign Keys)
│   ├── seed_data.sql        # Realistic Indian defense sample dataset
│   ├── ER_Diagram.png       # Entity Relationship diagram (PNG)
│   └── ER_Diagram.svg       # Entity Relationship diagram (SVG)
│
├── docs/
│   ├── requirements/        # Requirements specification summary
│   ├── wireframes/          # Frontend API integration contract
│   ├── api/                 # Postman Collection JSON
│   └── test-report/         # Pytest execution log & test cases
│
├── frontend/                # (Empty - Reserved for React Frontend Phase)
├── README.md                # Project documentation
├── .env.example             # Template for environment variables
└── .gitignore               # Ignored files and directories
```

---

## 4. Setup and Installation Guide

### Prerequisites
- Python 3.11 or higher
- MySQL Server 8.0
- Git

### Step 1: Clone Repository & Create Virtual Environment
```powershell
cd E:\Contract_Command\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Step 2: Install Python Packages
```powershell
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` in the root folder:
```powershell
Copy-Item ..\.env.example ..\.env
```
Edit `.env` to supply your MySQL database credentials:
```ini
SECRET_KEY=cc-p07-django-secret-key-change-in-production-2024xyz
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=contractcommand_db
DB_USER=contractcommand_user
DB_PASSWORD=SecurePass@2024
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Step 4: Setup Database & Run Migrations
In MySQL:
```sql
CREATE DATABASE contractcommand_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Apply migrations:
```powershell
python manage.py migrate
```

### Step 5: Seed Default Roles & Sample Data
```powershell
# Create default groups (Administrator, Contracts Manager, Safety Officer)
python manage.py setup_roles

# Seed realistic Indian defense dataset (100+ records)
python manage.py seed_data
```

### Step 6: Start Development Server
```powershell
python manage.py runserver
```
Backend API will be accessible at `http://127.0.0.1:8000/`.

---

## 5. Seeded User Credentials (For Testing)

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin_user` | `HclTech@2024` | System administrator with full access |
| **Contracts Manager** | `rajesh_contracts` | `HclTech@2024` | Creates contracts, approves requisitions |
| **Safety Officer** | `priya_safety` | `HclTech@2024` | Inspects vendors & records evaluations |

---

## 6. API Documentation & Interactive Endpoints

With the server running, navigate to:
- **Swagger UI:** `http://127.0.0.1:8000/api/docs/swagger/`
- **ReDoc:** `http://127.0.0.1:8000/api/docs/redoc/`
- **OpenAPI Schema (JSON):** `http://127.0.0.1:8000/api/schema/`
- **Postman Collection:** Located at `docs/api/postman_collection.json`

---

## 7. Running Automated Tests

Run the test suite with verbose output:
```powershell
cd E:\Contract_Command\backend
pytest -v
```

**Result:**
```text
============================= 28 passed in 29.10s =============================
```
Complete test execution details are documented in `docs/test-report/test_report.md`.
