# ContractCommand (P07) – Defence Contract and Procurement Management Platform

**Project Code:** P07 – ContractCommand  
**Academic Context:** MCA 2nd Year — HCLTech Career Shaper Capstone  
**Institution:** ABES Engineering College  
**Domain:** Aerospace and Defence Procurement  
**Architecture:** Decoupled Full-Stack Platform (React 18 SPA Frontend + Django 4.2 REST Framework Backend)  

---

## 1. Project Overview & Problem Statement

**ContractCommand** is an enterprise-grade, defence-sector contract repository, procurement planning, contractor governance, and financial disbursement platform. Built to adhere strictly to the **Defence Procurement Procedure (DPP)** and **Defence Financial Regulations (DFR 2024)**, it centralizes military acquisitions, automates indent approvals, audits defence suppliers via 4-pillar benchmarks, and validates statutory 18% GST disbursements with full treasury traceability.

### Core Modules

1. **Module 1: Defence Contracts Repository & Lifecycle**
   - Central indent repository with strict `CC-YYYY-NNNN` contract identification.
   - Five-stage lifecycle state engine (`Draft` &rarr; `Active` &rarr; `Expired` / `Terminated` / `Completed`).
   - Attached audit files (security clearances, quality acceptance certificates, technical specifications).

2. **Module 2: Procurement Planning & Field Requisitions**
   - Annual Master Procurement Plans (`PLAN-YYYY-NN`) tracking fiscal expenditure ceilings.
   - Field formation requisitions with dynamic line-item estimation and urgency prioritization (`Urgent`, `High`, `Medium`, `Low`).
   - Two-stage committee approval/rejection workflows with mandatory audit remarks.

3. **Module 3: Vendor Empanelment & 4-Pillar Evaluation**
   - Supplier directory covering defence PSUs (HAL, BEL, BDL) and private aerospace manufacturers.
   - Statutory Indian tax verification (15-character GSTIN, 10-character PAN).
   - Multi-pillar vendor evaluation on a 0–10 scale:
     - **Pillar 1:** Quality & Technical Reliability
     - **Pillar 2:** Delivery & Schedule Adherence
     - **Pillar 3:** Commercial & Pricing Competitiveness
     - **Pillar 4:** Statutory & Security Compliance
   - Side-by-side 3-way vendor comparison matrix benchmarking composite scores.

4. **Module 4: Finance, Invoicing & Banking Disbursements**
   - Contractor milestone claims with automated `INV-YYYY-NNNNN` numbering.
   - Itemized milestone deliverables with real-time **18% Statutory GST** computation.
   - Official treasury disbursement processing supporting RTGS (High Value), NEFT, IMPS, Cheques, and Demand Drafts.
   - Real-time settlement progress tracking disbursed amounts against outstanding milestone liabilities.

5. **Module 5: Strategic Command Dashboard & Analytics**
   - Executive situational awareness banner with RESTRICTED security classification.
   - Eight real-time KPI metric cards tracking contracts, pipeline, suppliers, and disbursements.
   - Interactive Chart.js visual analytics:
     - Contract Lifecycle Status Distribution (Doughnut Chart)
     - Treasury Banking Modes Breakdown (Bar Chart)
     - Requisition Urgency Index (Bar Chart)
   - Live operational streams of recent contracts, pending indents, and cleared disbursements.

6. **Public Website & Defence Identity**
   - Professional Indian defence-themed portal inspired by DCMA and the Ministry of Defence.
   - Public Landing Page, About, Modules Showcase, Defence Announcements, and Contact Directory.

---

## 2. Technology Stack

### Frontend Application
- **Core Framework:** React 18.3.1 (Single Page Application)
- **Build System:** Vite 6.0+ (ESBuild / Rollup)
- **Routing:** React Router DOM v6.28.0 with `ProtectedRoute` & `RoleGuard`
- **HTTP Client:** Axios v1.7.9 (Centralized instance with JWT refresh token interceptor)
- **UI Framework:** Bootstrap 5.3.3 & Bootstrap Icons 1.11.3
- **Visual Analytics:** Chart.js 4.4.7 & React-Chartjs-2
- **Testing Harness:** Vitest 5.1.1, React Testing Library, JSDOM (77 Tests Passing across 9 Suites)
- **Static Code Analysis:** Oxlint 0.15.0 (0 Errors)

### Backend Service
- **Framework:** Python 3.11+ / Django 4.2 LTS & Django REST Framework (DRF 3.14)
- **Database:** MySQL 8.0 / SQLite (InnoDB, utf8mb4, 3NF Normalized)
- **Authentication:** `djangorestframework-simplejwt` (JWT Access & Refresh Tokens)
- **API Documentation:** `drf-spectacular` (OpenAPI 3.0 / Swagger UI / ReDoc)
- **Testing:** `pytest` & `pytest-django` (28 Automated Tests Passing)

---

## 3. Directory Structure

```text
ContractCommand/
│
├── backend/                  # Existing Django REST Framework backend
│   ├── config/              # Django settings, root URLs, WSGI/ASGI
│   ├── accounts/            # User profile, JWT auth, groups & roles
│   ├── contracts/           # Contracts, documents, lifecycle tracking
│   ├── procurement/         # Procurement plans, requisitions, items
│   ├── vendors/             # Vendor directory, evaluations & scoring
│   ├── finance/             # Invoices, invoice items, payment records
│   ├── common/              # Custom permissions, pagination, validators
│   ├── tests/               # Pytest test suite (28 test cases)
│   ├── requirements.txt     # Python dependencies
│   └── manage.py            # Django CLI utility
│
├── frontend/                 # React 18 + Vite 6 Single Page Application
│   ├── public/              # Static assets, favicon, SVGs
│   ├── src/
│   │   ├── api/             # Axios API services (contracts, finance, vendors, etc.)
│   │   ├── assets/          # Defence branding logos & imagery
│   │   ├── components/      # Common UI components (Navbar, Topbar, Sidebar, Badges)
│   │   ├── context/         # AuthContext (JWT tokens, role helpers)
│   │   ├── hooks/           # useAuth, useDebounce, useFetch
│   │   ├── layouts/         # PublicLayout, AppLayout
│   │   ├── pages/           # Public, Auth, Dashboard, Contracts, Procurement, Vendors, Finance
│   │   ├── routes/          # AppRoutes, ProtectedRoute, RoleGuard
│   │   ├── test/            # Vitest unit & integration test suites (77 tests)
│   │   └── utils/           # Formatters (INR ₹, Indian dates) & role helpers
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── database/                 # MySQL 8.0 schema DDL & realistic seed dataset
│   ├── schema.sql
│   ├── seed_data.sql
│   ├── ER_Diagram.png
│   └── ER_Diagram.svg
│
├── docs/                     # Comprehensive System Documentation
│   ├── frontend-setup-guide.md       # Step-by-step setup and local execution guide
│   ├── frontend-user-guide.md        # Complete operational manual for officers
│   ├── frontend-architecture.md      # Architecture, security guards, and design system
│   ├── frontend-testing-report.md    # Phase 9 test execution logs and verification results
│   ├── frontend-api-integration.md   # Complete REST API contracts and endpoints
│   ├── frontend-development-plan.md  # 10-phase development roadmap and tracking
│   ├── requirements/                 # MCA project specifications
│   ├── api/                          # Postman collection
│   └── test-report/                  # Backend pytest execution log
│
├── README.md                 # Master project documentation
└── .gitignore
```

---

## 4. Quick Start & Execution Guide

### Prerequisites
- Node.js v18+ or v20+ & npm v9+
- Python 3.10+ & MySQL Server 8.0 (or SQLite)
- Git

---

### Step 1: Start the Backend Service
In a dedicated PowerShell terminal:
```powershell
cd E:\Contract_Command\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py setup_roles
python manage.py seed_data
python manage.py runserver 127.0.0.1:8000
```
*Backend API will be running at `http://127.0.0.1:8000/`.*

---

### Step 2: Start the Frontend Application
In a separate PowerShell terminal:
```powershell
cd E:\Contract_Command\frontend
npm install
npm run dev
```
*Frontend application will be accessible at `http://localhost:5173/`.*

---

## 5. Testing & Quality Assurance

### Run Frontend Vitest Test Suite (78 Tests):
```powershell
cd E:\Contract_Command\frontend
npm run test
```
**Results:** `9 passed (9 test files) | 78 passed (78 tests) — 100% Pass Rate`

### Run Frontend Static Code Analysis:
```powershell
cd E:\Contract_Command\frontend
npm run lint
```
**Results:** `0 Errors`

### Run Frontend Production Build:
```powershell
cd E:\Contract_Command\frontend
npm run build
```
**Results:** `✓ built in ~2.5s (Assets emitted to dist/)`

### Run Backend Pytest Suite (28 Tests):
```powershell
cd E:\Contract_Command\backend
pytest -v
```
**Results:** `28 passed in 29.10s — 100% Pass Rate`

---

## 6. Default User Accounts (For Testing & Review)

| Role | Username | Password | Access Level & Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin_user` | `HclTech@2024` | Unrestricted CRUD, delete authorization, master plans, requisition approval. |
| **Contracts Manager** | `rajesh_contracts` | `HclTech@2024` | Contract drafting, requisition approval, invoice creation, vendor evaluation. |
| **Safety Officer** | `priya_safety` | `HclTech@2024` | Read-only inspection of contract dossiers, vendor scores, and compliance vouchers. |

---

## 7. Interactive API Documentation

With the backend running, explore the interactive documentation:
- **Swagger UI:** `http://127.0.0.1:8000/api/docs/swagger/`
- **ReDoc:** `http://127.0.0.1:8000/api/docs/redoc/`
- **OpenAPI Schema (JSON):** `http://127.0.0.1:8000/api/schema/`
- **Postman Collection:** `docs/api/postman_collection.json`

---

## 8. Project Documentation Directory

Detailed technical and operational manuals are available under `docs/`:
- [Frontend Setup Guide](docs/frontend-setup-guide.md): Environment variables, dependencies, and deployment.
- [Frontend User Guide](docs/frontend-user-guide.md): Operational instructions for all 4 modules.
- [Frontend Architecture](docs/frontend-architecture.md): Component hierarchy, JWT interceptor, RBAC design.
- [Frontend Testing Report](docs/frontend-testing-report.md): Vitest logs, coverage, and verification.
- [Frontend API Integration](docs/frontend-api-integration.md): REST endpoint contracts and payloads.
- [Frontend Development Plan](docs/frontend-development-plan.md): 10-phase milestone execution log.
