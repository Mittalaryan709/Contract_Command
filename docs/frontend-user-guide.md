# ContractCommand — Frontend Operational User Guide

**Project:** P07 – ContractCommand  
**Domain:** Aerospace and Defence Contract Management  
**Academic Context:** MCA 2nd Year — HCLTech Career Shaper  
**Institution:** ABES Engineering College  
**Audience:** Defence Procurement Directorate Officers, Contracts Managers, Quality Auditors  

---

## 1. Introduction

**ContractCommand** is a centralized, defence-grade procurement and contract lifecycle management platform. It streamlines the end-to-end operational pipeline across defence equipment acquisitions:
1. **Defence Contracts:** Formal indents, legal vetting, lifecycle state transitions, and security clearance documents.
2. **Procurement Planning & Requisitions:** Annual master budget ceilings, line-item indents, and operational urgency approval workflows.
3. **Vendor Empanelment & 4-Pillar Evaluation:** Strategic supplier empanelment, statutory tax verification (GSTIN/PAN), and multi-pillar performance scoring.
4. **Finance, Invoicing & Disbursements:** Contractor billing, statutory 18% GST compliance, milestone settlements, and RTGS/NEFT banking audit trails.

---

## 2. Authentication & Navigation

### 2.1 Portal Sign-In
1. Navigate to `http://localhost:5173/login` (or click **Portal Login** on the public landing page).
2. Enter your authorized defence credentials (`Username` and `Password`).
3. Click **Authenticate &amp; Enter Portal**.
4. Upon successful authentication, the system saves your secure JWT session tokens and loads the Strategic Command Dashboard.

### 2.2 Role-Based Workspace Navigation
The top navigation bar and sidebar automatically customize their action menus based on your security clearance:
- **Administrator:** Full administrative, write, approval, and deletion permissions across all modules.
- **Contracts Manager:** Operational authoring of contracts, requisitions, invoices, and supplier evaluations. Approval/rejection rights for requisitions.
- **Safety Officer:** Read-only inspection of repository ledgers, audit files, and evaluation matrices.

### 2.3 Profile & Password Management
- Click your name/avatar in the upper right header and select **Officer Profile**.
- Review your service record, username, email, and designation.
- Update profile details or navigate to the password change section.

---

## 3. Strategic Command Dashboard (Module 7)

Located at `/app/dashboard`, the dashboard provides real-time situational awareness:
- **Security Notice:** Identifies the platform classification (`RESTRICTED // DEFENCE USE ONLY`).
- **Tactical KPI Cards:** Displays active contracts, pending requisitions, vetted suppliers, cleared disbursements, and master plans.
- **Live Visual Analytics:**
  - *Contract Lifecycle Status:* Doughnut breakdown of Draft vs. Active vs. Completed contracts.
  - *Disbursement Banking Modes:* Bar chart showing RTGS, NEFT, IMPS, and Cheque distributions.
  - *Requisition Urgency Index:* Distribution of urgent vs. routine indents.
- **Recent Operational Streams:** Direct links to the latest 5 contracts, requisitions, and banking disbursements.
- **Quick Action Bar:** Quick links to register contracts, raise requisitions, or file milestone vouchers.

---

## 4. Module 1: Defence Contracts Repository

### 4.1 Viewing Contracts
- Access `/app/contracts` from the sidebar.
- Search contracts by number (`CC-YYYY-NNNN`), title, or supplier name.
- Filter by status (`Draft`, `Active`, `Expired`, `Terminated`, `Completed`) or vendor.

### 4.2 Registering a Contract (`/app/contracts/new`)
*(Requires Administrator or Contracts Manager role)*
1. Click **Register New Contract**.
2. **Contract Number:** Use the auto-generator button (`Auto CC-YYYY-NNNN`) or enter an approved indent number.
3. **Associated Supplier:** Select an empanelled defence manufacturer from the dropdown.
4. **Contract Scope:** Enter title, procurement category, execution timeline (`Start Date` and `End Date`), and total value in Indian Rupees (₹).
5. Click **Register Defence Contract**.

### 4.3 Contract Details & Lifecycle Operations (`/app/contracts/:id`)
- Review complete contract metadata, financial liability, and execution dates.
- **Lifecycle Transition:** Use the status dropdown to transition the contract (e.g. from `Draft` &rarr; `Active`).
- **Audit Documents:** Review security clearances, technical specs, and acceptance certificates. Click **Attach Document** to record new compliance files.

---

## 5. Module 2: Procurement Planning & Requisitions

### 5.1 Procurement Master Plans (`/app/procurement/plans`)
- Master plans establish the financial expenditure ceilings for each fiscal year (e.g. `FY 2026-27`).
- View total planned budget vs. allocated expenditure.
- Click **Create Master Plan** to define new annual procurement strategies.

### 5.2 Requisitions Ledger (`/app/procurement/requisitions`)
- Tracks purchase requests across field formations and commands.
- Filter by status (`Pending`, `Approved`, `Rejected`, `Ordered`, `Delivered`) or priority (`Urgent`, `High`, `Medium`, `Low`).

### 5.3 Drafting a Requisition (`/app/procurement/requisitions/new`)
1. Select the governing **Master Procurement Plan**.
2. Set priority urgency (`Urgent`, `High`, `Medium`, `Low`).
3. Add itemized deliverable lines with quantity, unit of measurement, and estimated unit cost.
4. The system calculates the estimated budget commitment in real time.
5. Click **Submit Requisition**.

### 5.4 Requisition Review & Committee Approval (`/app/procurement/requisitions/:id`)
- Contracts Managers and Administrators can review line items and click:
  - **Approve Requisition:** Clears the requisition for vendor bidding/contract allocation.
  - **Reject Requisition:** Declines the indent with mandatory audit remarks.

---

## 6. Module 3: Vendor Empanelment & Evaluation

### 6.1 Vendor Directory (`/app/vendors`)
- Central repository of public sector undertakings (HAL, BEL, BDL) and vetted private aerospace contractors.
- Search by company name, city, state, or empanelment category (`Electronics`, `Mechanical`, `Ammunition`, `IT Services`, etc.).
- Displays the composite **4-Pillar Evaluation Score** for each contractor.

### 6.2 Registering a Vendor (`/app/vendors/new`)
1. Fill in Company Name, Corporate Address, City, State, and Pincode.
2. Enter Contact Person, Email, and 10-digit Indian Mobile Number.
3. Provide statutory tax numbers:
   - **GSTIN:** 15-character statutory GST identification number.
   - **PAN:** 10-character Indian Permanent Account Number.
4. Click **Register Defence Supplier**.

### 6.3 4-Pillar Performance Scoring (`/app/vendors/:id/evaluate`)
Conduct formal vendor appraisals across four statutory defence pillars (scale of 0 to 10):
- **Pillar 1: Technical & Quality Score** (Material compliance, reliability, defect rates).
- **Pillar 2: Delivery & Timeliness Score** (Schedule adherence, milestone delivery).
- **Pillar 3: Commercial & Pricing Score** (Cost competitiveness, warranty commitments).
- **Pillar 4: Statutory & Security Compliance Score** (Security clearances, DFR compliance).
- Select final recommendation (`Selected`, `Shortlisted`, `Rejected`) and submit.

### 6.4 Supplier Comparison Matrix (`/app/vendors/compare`)
- Select up to 3 suppliers to view side-by-side benchmark tables.
- Evaluates scores across all four pillars to identify the optimal contractor for high-value tenders.

---

## 7. Module 4: Finance, Invoicing & Payments

### 7.1 Invoice Ledger (`/app/finance/invoices`)
- Summarizes gross invoiced amounts, cleared disbursements, and outstanding liabilities.
- Search by invoice number (`INV-YYYY-NNNNN`), contract number, or vendor name.

### 7.2 Creating a Defence Invoice (`/app/finance/invoices/new`)
1. Click **Generate Invoice**.
2. Enter or auto-generate invoice number (format `INV-2026-NNNNN`).
3. Select the associated contract (automatically populates the contractor).
4. Specify invoice date and payment due date.
5. **Itemized Deliverables:** Add line items with deliverable descriptions, quantities, and unit prices.
6. The system automatically calculates:
   - **Net Subtotal**
   - **Statutory 18% GST Amount** (`subtotal × 18 / 100`)
   - **Total Liability** (`subtotal + tax_amount`)
7. Click **Generate Defence Invoice**.

### 7.3 Processing Banking Disbursements (`/app/finance/payments/new`)
1. Open the invoice details (`/app/finance/invoices/:id`) and click **Record Payment**.
2. The payment screen pre-populates the invoice reference and remaining balance.
3. Select transfer method (`RTGS` for high value, `NEFT`, `IMPS`, `Cheque`, `DD`).
4. Enter bank reference / UTR number (e.g. `RTGS-2026-XXXXXX` or RBI UTR string).
5. Click **Record Bank Transfer**.
6. The invoice ledger immediately updates the cleared payment progress and remaining dues.

---

## 8. Role-Specific Guidelines

### For Administrators
- Oversee user privileges and audit logs.
- Perform master deletions when required after double-confirming via confirmation dialogs.
- Authorize budget adjustments on Master Procurement Plans.

### For Contracts Managers
- Draft and publish defence contracts and procurement requisitions.
- Approve or reject field indents.
- Conduct quarterly 4-pillar vendor performance audits.
- Issue invoice settlement vouchers.

### For Safety Officers & Quality Auditors
- Inspect contract dossiers and verified QA certifications.
- Review vendor compliance ratings and blacklisting statuses.
- Export or print official disbursement vouchers for audit documentation.
