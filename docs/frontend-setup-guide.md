# ContractCommand — Frontend Setup & Deployment Guide

**Project:** P07 – ContractCommand  
**Project Title:** Defence Contract and Procurement Management Platform  
**Academic Context:** MCA 2nd Year — HCLTech Career Shaper  
**Institution:** ABES Engineering College  
**Target Environment:** Node.js v18+ / v20+, Vite 6.0+, React 18  

---

## 1. System Requirements & Prerequisites

Before setting up the frontend, ensure the following software is installed on your workstation:

| Requirement | Minimum Version | Recommended Version |
|-------------|-----------------|---------------------|
| **Node.js** | v18.18.0 | v20.10.0 LTS or higher |
| **npm** | v9.0.0 | v10.0.0 or higher |
| **Git** | v2.30.0 | Latest stable release |
| **Web Browser** | Chrome 90+, Firefox 90+, Edge 90+ | Modern evergreen browser |
| **Django Backend** | Python 3.10+, Django 4.2 LTS | Running at `http://127.0.0.1:8000` |

---

## 2. Directory Structure Overview

The project is strictly separated into independent frontend and backend workspaces:

```text
ContractCommand/
│
├── backend/                  # Existing Django REST Framework backend
│   ├── manage.py
│   ├── config/
│   ├── accounts/
│   ├── contracts/
│   ├── procurement/
│   ├── vendors/
│   └── finance/
│
├── frontend/                 # React 18 + Vite 6 Single Page Application
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── database/                 # SQLite / MySQL dual mode database files
├── docs/                     # Comprehensive architecture and API documentation
└── README.md
```

---

## 3. Frontend Installation Steps

### Step 1: Open Terminal & Navigate to Frontend Directory
In PowerShell or Command Prompt:
```powershell
cd E:\Contract_Command\frontend
```

### Step 2: Install Package Dependencies
Install all required production and development dependencies:
```powershell
npm install
```
*(Dependencies installed: React 18, React Router DOM 6, Axios, Bootstrap 5, Bootstrap Icons, Chart.js, React Chart.js 2, React Hook Form, Yup, Vitest, Testing Library, Oxlint)*

---

## 4. Environment Configuration

The frontend interfaces with the Django backend via environment variables.

### Local Configuration (`frontend/.env` or `frontend/.env.local`):
```env
# URL where Django REST Framework is serving API requests
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Production Configuration (`frontend/.env.production`):
```env
VITE_API_BASE_URL=https://contractcommand-backend.onrender.com
```

> **Note:** If `VITE_API_BASE_URL` is omitted, `axiosInstance.js` automatically defaults to `http://127.0.0.1:8000`.

---

## 5. Running the Application

### A. Development Server (with Hot Module Replacement)
```powershell
npm run dev
```
- Local URL: **`http://localhost:5173`**
- Network URL: Displayed in the terminal if testing on local LAN.

### B. Running Automated Vitest Suite
Execute the comprehensive test suite across all 9 module test files:
```powershell
npm run test
```

### C. Running Static Code Analysis (Linter)
```powershell
npm run lint
```

### D. Compiling for Production
Compile optimized and minified assets into `frontend/dist/`:
```powershell
npm run build
```

### E. Previewing Production Build Locally
```powershell
npm run preview
```

---

## 6. Backend Connection & CORS Configuration

To ensure seamless API integration when running the frontend alongside the backend:

1. **Start the Django Backend:**
   ```powershell
   cd E:\Contract_Command\backend
   python manage.py runserver 127.0.0.1:8000
   ```
2. **Verify Backend Health:**
   Open `http://127.0.0.1:8000/api/contracts/` in your browser.
3. **CORS Configuration in Backend `.env`:**
   Ensure `http://localhost:5173` and `http://127.0.0.1:5173` are present in `CORS_ALLOWED_ORIGINS`:
   ```env
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
   ```

---

## 7. Troubleshooting & Common Issues

| Issue / Error | Cause | Resolution |
|---|---|---|
| **`Network Error` / `ERR_CONNECTION_REFUSED`** | Django backend is not running at `http://127.0.0.1:8000` | Start the backend with `python manage.py runserver 127.0.0.1:8000`. |
| **`CORS Policy: No 'Access-Control-Allow-Origin' header`** | Vite dev port (`5173`) not whitelisted in Django `.env` | Add `http://localhost:5173` to `CORS_ALLOWED_ORIGINS` in root `.env`. |
| **Port `5173` already in use** | Another Vite process is running | Vite will automatically try `5174`. Alternatively, run `npx kill-port 5173`. |
| **401 Unauthorized / Token Expired** | Access token expired after 8 hours | Refresh the page (Axios interceptor will auto-refresh token), or re-login at `/login`. |
| **Chart canvas warning in test** | Headless testing environment without canvas | `src/test/setup.js` provides mock canvas 2D contexts for headless testing. |

---

## 8. Default Credentials for Role-Based Testing

| Role | Username | Password | Permitted Modules |
|---|---|---|---|
| **Administrator** | `admin` | *(Configured during backend setup)* | Full access across all 4 modules, delete operations, approval workflows. |
| **Contracts Manager** | `contracts_mgr` | *(Configured during backend setup)* | Contract drafting, requisition approval, invoice creation, vendor evaluation. |
| **Safety Officer** | `safety_officer` | *(Configured during backend setup)* | Read-only inspection of dossiers, audit compliance logs, evaluation metrics. |
