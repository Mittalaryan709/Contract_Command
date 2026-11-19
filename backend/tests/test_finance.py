"""
backend/tests/test_finance.py
Unit and API integration tests for Module 4: Invoice and Payment Management.
"""
import pytest
from datetime import date
from decimal import Decimal
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from contracts.models import Contract
from vendors.models import Vendor
from finance.models import Invoice, InvoiceItem, Payment


@pytest.fixture
def test_setup(db):
    cm_grp, _ = Group.objects.get_or_create(name='Contracts Manager')

    cm = User.objects.create_user(username='cm_finance', password='pass')
    cm.groups.add(cm_grp)

    vendor = Vendor.objects.create(
        vendor_code='VND-FIN-01',
        company_name='Premier Defense Optronics',
        category='Electronics',
        contact_person='P. Sharma',
        email='finance@premier-optronics.in',
        phone='9811223344',
        address='SEZ Phase 1',
        city='Chennai',
        state='Tamil Nadu',
        pincode='600001',
        status='Active'
    )

    contract = Contract.objects.create(
        contract_number='CC-2024-8001',
        title='Thermal Imaging Sight Units',
        contract_type='Supply',
        vendor=vendor,
        value=Decimal('20000000.00'),
        start_date=date(2024, 1, 1),
        end_date=date(2024, 12, 31),
        status='Active',
        created_by=cm
    )

    invoice = Invoice.objects.create(
        invoice_number='INV-2024-80001',
        contract=contract,
        vendor=vendor,
        invoice_date=date(2024, 5, 1),
        due_date=date(2024, 6, 1),
        status='Submitted',
        tax_percent=Decimal('18.00'),
        created_by=cm
    )

    item = InvoiceItem.objects.create(
        invoice=invoice,
        description='Mil-Spec Thermal Imaging Sensor',
        quantity=Decimal('2.00'),
        unit_price=Decimal('1000000.00')
    )

    return {'cm': cm, 'vendor': vendor, 'contract': contract, 'invoice': invoice, 'item': item}


@pytest.mark.django_db
def test_invoice_total_recalculation(test_setup):
    """Invoice subtotal, 18% tax, and total amount recalculate automatically upon adding item."""
    invoice = test_setup['invoice']
    invoice.refresh_from_db()

    # Subtotal = 2 * 1,000,000 = 2,000,000.00
    assert invoice.subtotal == Decimal('2000000.00')
    # Tax = 18% of 2,000,000 = 360,000.00
    assert invoice.tax_amount == Decimal('360000.00')
    # Total = 2,000,000 + 360,000 = 2,360,000.00
    assert invoice.total_amount == Decimal('2360000.00')


@pytest.mark.django_db
def test_payment_creation_and_balance(test_setup):
    """Test recording a payment against an invoice and calculating remaining balance."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    invoice = test_setup['invoice']
    invoice.refresh_from_db()

    # Make partial payment
    payload = {
        'invoice': invoice.id,
        'payment_reference': 'PAY-RTGS-TEST-001',
        'payment_date': '2024-05-15',
        'amount': '1360000.00',
        'payment_method': 'RTGS',
        'status': 'Completed',
        'remarks': 'First milestone payment'
    }
    resp = client.post('/api/finance/payments/', payload)
    assert resp.status_code == status.HTTP_201_CREATED

    # Verify invoice detail returns paid_amount and balance_amount
    inv_resp = client.get(f'/api/finance/invoices/{invoice.id}/')
    assert inv_resp.status_code == status.HTTP_200_OK
    data = inv_resp.data['data']
    assert Decimal(str(data['paid_amount'])) == Decimal('1360000.00')
    assert Decimal(str(data['balance_amount'])) == Decimal('1000000.00')


@pytest.mark.django_db
def test_negative_payment_amount_rejected(test_setup):
    """Negative or zero payment amount must be rejected."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'invoice': test_setup['invoice'].id,
        'payment_reference': 'PAY-INVALID-001',
        'payment_date': '2024-05-15',
        'amount': '-50000.00',  # Negative!
        'payment_method': 'RTGS',
        'status': 'Initiated'
    }
    resp = client.post('/api/finance/payments/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_invoice_invalid_due_date(test_setup):
    """Due date before invoice date must be rejected."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'invoice_number': 'INV-2024-80002',
        'contract': test_setup['contract'].id,
        'vendor': test_setup['vendor'].id,
        'invoice_date': '2024-06-01',
        'due_date': '2024-05-01',  # Earlier!
        'status': 'Draft'
    }
    resp = client.post('/api/finance/invoices/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
