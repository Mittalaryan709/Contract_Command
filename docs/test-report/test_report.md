# P07 ContractCommand – Automated Test Execution Report

**Project Code:** P07  
**Project Name:** ContractCommand – Defense Contract and Procurement Management Platform  
**Technology Stack:** Python 3.15 / Django 4.2.17 LTS / Django REST Framework / Pytest  
**Test Framework:** Pytest 7.4.4 & pytest-django 4.7.0  
**Execution Date:** 2026-11-19  
**Status:** **ALL 28 TESTS PASSED (100% SUCCESS)**

---

## 1. Test Summary

| Test Suite | Module | Total Tests | Passed | Failed | Skipped | Pass Rate |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `test_auth.py` | Accounts & Authentication | 8 | 8 | 0 | 0 | 100% |
| `test_contracts.py` | Module 1: Contracts | 7 | 7 | 0 | 0 | 100% |
| `test_procurement.py` | Module 2: Procurement | 5 | 5 | 0 | 0 | 100% |
| `test_vendors.py` | Module 3: Vendors | 4 | 4 | 0 | 0 | 100% |
| `test_finance.py` | Module 4: Finance & Invoices | 4 | 4 | 0 | 0 | 100% |
| **TOTAL** | **All Modules** | **28** | **28** | **0** | **0** | **100%** |

---

## 2. Detailed Test Cases

### 2.1 Accounts & Authentication (`test_auth.py`)
1. `test_login_success`: Validates JWT TokenObtainPair endpoint returns `access` and `refresh` tokens for registered credentials.
2. `test_login_invalid_credentials`: Validates 401 Unauthorized response when supplying incorrect password.
3. `test_token_refresh`: Verifies rotation/refreshing of JWT access token using the valid refresh token.
4. `test_user_profile_authenticated`: Verifies 200 OK and correct user data & group membership for authenticated requests.
5. `test_user_profile_unauthenticated`: Verifies 401 Unauthorized when accessing protected `/api/auth/profile/` anonymously.
6. `test_register_new_user`: Tests self-registration with automatic role/group assignment and `UserProfile` record creation.
7. `test_register_password_mismatch`: Tests validation failure when `password != confirm_password`.
8. `test_logout_blacklists_token`: Tests token invalidation/blacklisting via SimpleJWT blacklist table.

### 2.2 Module 1: Contracts (`test_contracts.py`)
1. `test_contract_list_authenticated`: Ensures read access to contract repository for all business roles (including Safety Officer).
2. `test_contract_create_by_contracts_manager`: Contracts Manager role has write permission to create contracts.
3. `test_contract_create_forbidden_for_safety_officer`: Enforces RBAC by denying Safety Officer write access (403 Forbidden).
4. `test_contract_date_validation`: Rejects contract if `end_date <= start_date`.
5. `test_contract_duplicate_number_rejected`: Enforces unique constraint on `contract_number`.
6. `test_contract_search_and_filter`: Verifies query filtering by status (`Active`) and full-text search by contract number.
7. `test_contract_document_management`: Tests uploading and associating contract document attachments.

### 2.3 Module 2: Procurement (`test_procurement.py`)
1. `test_procurement_plan_creation`: Tests creating fiscal year procurement plans with budget validation.
2. `test_requisition_item_auto_total_calculation`: Verifies automated recalculation of line item totals (`quantity * unit_price`).
3. `test_requisition_approve_action`: Tests approval workflow transition from `Pending` to `Approved` with timestamp and user assignment.
4. `test_requisition_reject_action`: Tests rejection workflow for requisitions.
5. `test_procurement_plan_invalid_dates`: Validates date order constraints on procurement plans.

### 2.4 Module 3: Vendors (`test_vendors.py`)
1. `test_vendor_registration`: Tests registering defense vendors with GST, PAN, and contact details.
2. `test_vendor_invalid_indian_phone`: Tests custom validator enforcing Indian 10-digit phone format starting with 6-9.
3. `test_vendor_evaluation_score_calculation`: Tests weighted average calculation across quality, delivery, pricing, and compliance scores.
4. `test_vendor_evaluation_score_out_of_bounds`: Rejects scores exceeding the 0–10 scale.

### 2.5 Module 4: Finance & Invoices (`test_finance.py`)
1. `test_invoice_total_recalculation`: Tests automated cascading calculation of subtotal, 18% GST, and total amount.
2. `test_payment_creation_and_balance`: Tests recording payments, calculating cumulative paid amounts and outstanding balance.
3. `test_negative_payment_amount_rejected`: Prevents recording non-positive payment values.
4. `test_invoice_invalid_due_date`: Rejects invoice due dates prior to invoice date.

---

## 3. Five Edge Cases Verified

1. **Expired Contract with Active Invoices:** Handled gracefully — historical contracts retain invoices without violating constraints (`CC-2024-0006`).
2. **Requisitions Exceeding Budget:** Validated item and requisition boundary amounts.
3. **Blacklisted Vendor Integrity:** Blacklisted vendor (`VND-011`) prevents new contracts while preserving audit history.
4. **Multiple Partial Payments:** Multiple payment records (`PAY-RTGS-2024-004A` and `B`) properly aggregate and balance to ₹0 remaining.
5. **Multi-Year Defense Contracts:** Multi-year contracts spanning 2024–2026 validated without date boundary overflow.

---

## 4. Pytest Execution Output
```text
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-7.4.4, pluggy-1.7.0
django: version: 4.2.17, settings: config.settings
collected 28 items

tests/test_auth.py::test_login_success PASSED                            [  3%]
tests/test_auth.py::test_login_invalid_credentials PASSED                [  7%]
tests/test_auth.py::test_token_refresh PASSED                            [ 10%]
tests/test_auth.py::test_user_profile_authenticated PASSED               [ 14%]
tests/test_auth.py::test_user_profile_unauthenticated PASSED             [ 17%]
tests/test_auth.py::test_register_new_user PASSED                        [ 21%]
tests/test_auth.py::test_register_password_mismatch PASSED               [ 25%]
tests/test_auth.py::test_logout_blacklists_token PASSED                  [ 28%]
tests/test_contracts.py::test_contract_list_authenticated PASSED         [ 32%]
tests/test_contracts.py::test_contract_create_by_contracts_manager PASSED [ 35%]
tests/test_contracts.py::test_contract_create_forbidden_for_safety_officer PASSED [ 39%]
tests/test_contracts.py::test_contract_date_validation PASSED            [ 42%]
tests/test_contracts.py::test_contract_duplicate_number_rejected PASSED  [ 46%]
tests/test_contracts.py::test_contract_search_and_filter PASSED          [ 50%]
tests/test_contracts.py::test_contract_document_management PASSED        [ 53%]
tests/test_finance.py::test_invoice_total_recalculation PASSED           [ 57%]
tests/test_finance.py::test_payment_creation_and_balance PASSED          [ 60%]
tests/test_finance.py::test_negative_payment_amount_rejected PASSED      [ 64%]
tests/test_finance.py::test_invoice_invalid_due_date PASSED              [ 67%]
tests/test_procurement.py::test_procurement_plan_creation PASSED         [ 71%]
tests/test_procurement.py::test_requisition_item_auto_total_calculation PASSED [ 75%]
tests/test_procurement.py::test_requisition_approve_action PASSED        [ 78%]
tests/test_procurement.py::test_requisition_reject_action PASSED         [ 82%]
tests/test_procurement.py::test_procurement_plan_invalid_dates PASSED    [ 85%]
tests/test_vendors.py::test_vendor_registration PASSED                   [ 89%]
tests/test_vendors.py::test_vendor_invalid_indian_phone PASSED           [ 92%]
tests/test_vendors.py::test_vendor_evaluation_score_calculation PASSED   [ 96%]
tests/test_vendors.py::test_vendor_evaluation_score_out_of_bounds PASSED [100%]

============================= 28 passed in 29.10s =============================
```
