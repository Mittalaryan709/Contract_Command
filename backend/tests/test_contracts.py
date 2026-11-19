"""
backend/tests/test_contracts.py
Unit and API integration tests for Module 1: Contract Management.
"""
import pytest
from datetime import date
from decimal import Decimal
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from contracts.models import Contract, ContractDocument
from vendors.models import Vendor


@pytest.fixture
def test_setup(db):
    admin_grp, _ = Group.objects.get_or_create(name='Administrator')
    cm_grp, _ = Group.objects.get_or_create(name='Contracts Manager')
    so_grp, _ = Group.objects.get_or_create(name='Safety Officer')

    admin = User.objects.create_user(username='admin', password='pass', is_superuser=True)
    admin.groups.add(admin_grp)

    cm = User.objects.create_user(username='cm_user', password='pass')
    cm.groups.add(cm_grp)

    so = User.objects.create_user(username='so_user', password='pass')
    so.groups.add(so_grp)

    vendor = Vendor.objects.create(
        vendor_code='VND-TEST-01',
        company_name='Test Aerospace Labs',
        category='Electronics',
        contact_person='A. Kumar',
        email='test.aero@example.in',
        phone='9876543210',
        address='Test Industrial Park',
        city='Bengaluru',
        state='Karnataka',
        pincode='560001',
        status='Active'
    )

    contract = Contract.objects.create(
        contract_number='CC-2024-9001',
        title='Avionics Display Testing System',
        contract_type='Supply',
        vendor=vendor,
        value=Decimal('5000000.00'),
        start_date=date(2024, 1, 1),
        end_date=date(2024, 12, 31),
        status='Active',
        created_by=cm
    )

    return {'admin': admin, 'cm': cm, 'so': so, 'vendor': vendor, 'contract': contract}


@pytest.mark.django_db
def test_contract_list_authenticated(test_setup):
    """Authenticated users can list contracts."""
    client = APIClient()
    client.force_authenticate(user=test_setup['so'])
    resp = client.get('/api/contracts/')
    assert resp.status_code == status.HTTP_200_OK
    assert resp.data['success']
    assert len(resp.data['data']['results']) >= 1


@pytest.mark.django_db
def test_contract_create_by_contracts_manager(test_setup):
    """Contracts Manager can create a new contract."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'contract_number': 'CC-2024-9002',
        'title': 'Tactical Radio Hardware Supply',
        'contract_type': 'Supply',
        'vendor': test_setup['vendor'].id,
        'value': '12000000.00',
        'start_date': '2024-02-01',
        'end_date': '2024-11-30',
        'status': 'Draft'
    }
    resp = client.post('/api/contracts/', payload)
    assert resp.status_code == status.HTTP_201_CREATED
    assert Contract.objects.filter(contract_number='CC-2024-9002').exists()


@pytest.mark.django_db
def test_contract_create_forbidden_for_safety_officer(test_setup):
    """Safety Officer cannot create a contract (Permission Denied)."""
    client = APIClient()
    client.force_authenticate(user=test_setup['so'])

    payload = {
        'contract_number': 'CC-2024-9003',
        'title': 'Unauthorized Creation Attempt',
        'contract_type': 'Supply',
        'vendor': test_setup['vendor'].id,
        'value': '1000000.00',
        'start_date': '2024-01-01',
        'end_date': '2024-06-30',
    }
    resp = client.post('/api/contracts/', payload)
    assert resp.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_contract_date_validation(test_setup):
    """End date must be after start date."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'contract_number': 'CC-2024-9004',
        'title': 'Invalid Date Contract',
        'contract_type': 'Supply',
        'vendor': test_setup['vendor'].id,
        'value': '500000.00',
        'start_date': '2024-12-01',
        'end_date': '2024-01-01',  # Earlier than start date!
    }
    resp = client.post('/api/contracts/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_contract_duplicate_number_rejected(test_setup):
    """Duplicate contract number must be rejected."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'contract_number': 'CC-2024-9001',  # already exists!
        'title': 'Duplicate Attempt',
        'contract_type': 'Supply',
        'vendor': test_setup['vendor'].id,
        'value': '2000000.00',
        'start_date': '2024-01-01',
        'end_date': '2024-12-31',
    }
    resp = client.post('/api/contracts/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_contract_search_and_filter(test_setup):
    """Test searching by contract_number and filtering by status."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    # Search by contract number
    resp = client.get('/api/contracts/?search=CC-2024-9001')
    assert resp.status_code == status.HTTP_200_OK
    assert len(resp.data['data']['results']) == 1

    # Filter by status
    resp_active = client.get('/api/contracts/?status=Active')
    assert resp_active.status_code == status.HTTP_200_OK
    assert len(resp_active.data['data']['results']) >= 1


@pytest.mark.django_db
def test_contract_document_management(test_setup):
    """Test uploading and listing documents for a contract."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'contract': test_setup['contract'].id,
        'title': 'Quality Test Report Document',
        'file_name': 'quality_test_report.pdf',
        'file_path': '/media/contracts/CC-2024-9001/quality.pdf'
    }
    resp = client.post('/api/contracts/documents/', payload)
    assert resp.status_code == status.HTTP_201_CREATED
    assert ContractDocument.objects.filter(contract=test_setup['contract']).exists()
