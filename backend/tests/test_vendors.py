"""
backend/tests/test_vendors.py
Unit and API integration tests for Module 3: Vendor Management & Evaluations.
"""
import pytest
from datetime import date
from decimal import Decimal
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from vendors.models import Vendor, VendorEvaluation


@pytest.fixture
def test_setup(db):
    so_grp, _ = Group.objects.get_or_create(name='Safety Officer')
    cm_grp, _ = Group.objects.get_or_create(name='Contracts Manager')

    so = User.objects.create_user(username='so_vendor', password='pass')
    so.groups.add(so_grp)

    cm = User.objects.create_user(username='cm_vendor', password='pass')
    cm.groups.add(cm_grp)

    vendor = Vendor.objects.create(
        vendor_code='VND-TEST-100',
        company_name='Kalyani Strategic Armor Systems',
        category='Mechanical',
        contact_person='S. Kalyani',
        email='contact@kalyani-armor.in',
        phone='9812345678',
        address='Pune MIDC, Phase 2',
        city='Pune',
        state='Maharashtra',
        pincode='411001',
        status='Active',
        registered_by=cm
    )

    return {'so': so, 'cm': cm, 'vendor': vendor}


@pytest.mark.django_db
def test_vendor_registration(test_setup):
    """Contracts Manager can register a new defense vendor."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'vendor_code': 'VND-TEST-101',
        'company_name': 'Astra Microwave & Optics Ltd',
        'category': 'Electronics',
        'contact_person': 'M. Reddy',
        'email': 'tenders@astra-optics.in',
        'phone': '9845012345',
        'address': 'Plot 12, Defense Electronics Zone',
        'city': 'Hyderabad',
        'state': 'Telangana',
        'pincode': '500001',
        'gst_number': '36AABCA1234F1Z1',
        'pan_number': 'AABCA1234F',
        'status': 'Pending'
    }
    resp = client.post('/api/vendors/', payload)
    assert resp.status_code == status.HTTP_201_CREATED
    assert Vendor.objects.filter(vendor_code='VND-TEST-101').exists()


@pytest.mark.django_db
def test_vendor_invalid_indian_phone(test_setup):
    """Phone number must conform to Indian 10-digit mobile format."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'vendor_code': 'VND-TEST-102',
        'company_name': 'Invalid Phone Vendor',
        'category': 'Logistics',
        'contact_person': 'Test',
        'email': 'testphone@example.in',
        'phone': '12345',  # Invalid! Not 10 digits starting with 6-9
        'address': 'Address',
        'city': 'Delhi',
        'state': 'Delhi',
        'pincode': '110001',
    }
    resp = client.post('/api/vendors/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_vendor_evaluation_score_calculation(test_setup):
    """Vendor overall score is calculated as the average of quality, delivery, pricing, compliance."""
    client = APIClient()
    client.force_authenticate(user=test_setup['so'])

    payload = {
        'vendor': test_setup['vendor'].id,
        'evaluation_date': '2024-06-15',
        'quality_score': '9.0',
        'delivery_score': '8.0',
        'pricing_score': '8.5',
        'compliance_score': '9.5',
        'recommendation': 'Selected',
        'remarks': 'Outstanding manufacturing standards.'
    }
    resp = client.post('/api/vendors/evaluations/', payload)
    assert resp.status_code == status.HTTP_201_CREATED

    evaluation = VendorEvaluation.objects.get(id=resp.data['id'])
    # (9.0 + 8.0 + 8.5 + 9.5) / 4 = 35.0 / 4 = 8.75 -> rounded to 8.8
    assert evaluation.overall_score == Decimal('8.8')


@pytest.mark.django_db
def test_vendor_evaluation_score_out_of_bounds(test_setup):
    """Scores must be between 0 and 10."""
    client = APIClient()
    client.force_authenticate(user=test_setup['so'])

    payload = {
        'vendor': test_setup['vendor'].id,
        'evaluation_date': '2024-06-15',
        'quality_score': '12.5',  # Exceeds max 10!
        'delivery_score': '8.0',
        'pricing_score': '8.0',
        'compliance_score': '8.0',
        'recommendation': 'Selected',
    }
    resp = client.post('/api/vendors/evaluations/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
