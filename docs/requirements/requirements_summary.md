# P07 ContractCommand – Requirements Specification Summary

**Project Code:** P07  
**Project Name:** ContractCommand – Defense Contract and Procurement Management Platform  
**Target Architecture:** Django REST Framework (Backend) + React SPA (Future Frontend)  
**Database:** MySQL 8.0 (3NF Relational Schema)  

---

## 1. Project Objectives & Scope

ContractCommand provides a unified, secure defense procurement tracking and contract governance system for defense organizations. It enforces role-based access control, transparency, milestone auditing, and strict financial accounting across four core business cycles:

1. **Contracts Repository & Lifecycle:** Multi-year contract management, amendment and document tracking, milestone scheduling.
2. **Procurement Planning & Requisitions:** Strategic annual budget allocations, departmental requisitions, multi-level approvals.
3. **Defense Vendor Governance:** Registration, compliance, categorized performance scoring (quality, delivery, pricing, compliance).
4. **Finance & Payment Processing:** Invoicing with 18% GST calculation, milestone disbursements via RTGS/NEFT, balance reconciliation.

---

## 2. User Roles & Permission Matrix

| Module / Action | Administrator | Contracts Manager | Safety Officer |
| :--- | :---: | :---: | :---: |
| **Authentication & Users** | Full CRUD | Self Profile Only | Self Profile Only |
| **View Contracts** | Full Access | Full Access | Read-Only |
| **Create/Update Contracts** | Yes | Yes | Denied (403) |
| **Delete Contracts** | Yes | Denied (403) | Denied (403) |
| **Procurement Plans** | Full Access | Create/Update/View | Read-Only |
| **Requisitions** | Full Access | Approve/Reject/Create | View/Request |
| **Vendor Registration** | Yes | Yes | Denied (403) |
| **Vendor Evaluations** | Full Access | Evaluate & Score | Evaluate & Score |
| **Invoices & Payments** | Full Access | Create/Update/Process | Read-Only |

---

## 3. Data Integrity & Validation Rules

- **Contract Number:** Must follow the pattern `CC-YYYY-NNNN` and be globally unique.
- **Invoice Number:** Must follow the pattern `INV-YYYY-NNNNN` and be globally unique.
- **Indian Phone Numbers:** Validated via regex pattern enforcing 10-digit formats starting with 6–9 with optional `+91` prefix.
- **Date Constraints:** All end dates and due dates must strictly succeed start dates and invoice dates.
- **Financial Bounds:** All line item quantities, prices, contract values, and payment amounts must be strictly positive (`> 0`).
- **Score Scale:** Vendor evaluation scores are strictly constrained between 0.0 and 10.0.
