"""
backend/tests/test_procurement.py
Unit and API integration tests for Module 2: Procurement Management.
"""
import pytest
from datetime import date
from decimal import Decimal
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from procurement.models import ProcurementPlan, Requisition, RequisitionItem


@pytest.fixture
def test_setup(db):
    admin_grp, _ = Group.objects.get_or_create(name='Administrator')
    cm_grp, _ = Group.objects.get_or_create(name='Contracts Manager')

    cm = User.objects.create_user(username='cm_procure', password='pass')
    cm.groups.add(cm_grp)

    plan = ProcurementPlan.objects.create(
        plan_number='PLAN-TEST-01',
        title='Air Defense Upgrade FY24',
        fiscal_year='2024-2025',
        total_budget=Decimal('100000000.00'),
        start_date=date(2024, 4, 1),
        end_date=date(2025, 3, 31),
        status='Active',
        created_by=cm
    )

    req = Requisition.objects.create(
        requisition_number='REQ-TEST-001',
        plan=plan,
        title='High Frequency Antennas',
        priority='High',
        status='Pending',
        required_by_date=date(2024, 8, 31),
        requested_by=cm
    )

    item = RequisitionItem.objects.create(
        requisition=req,
        item_name='Antenna Mast 15m',
        quantity=Decimal('4.00'),
        unit='Unit',
        unit_price=Decimal('250000.00')
    )

    return {'cm': cm, 'plan': plan, 'req': req, 'item': item}


@pytest.mark.django_db
def test_procurement_plan_creation(test_setup):
    """Contracts Manager can create a procurement plan."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'plan_number': 'PLAN-TEST-02',
        'title': 'Tactical Vehicle Modernization',
        'description': 'Procurement of light strike vehicle parts.',
        'fiscal_year': '2024-2025',
        'total_budget': '50000000.00',
        'start_date': '2024-05-01',
        'end_date': '2025-04-30',
        'status': 'Draft'
    }
    resp = client.post('/api/procurement/plans/', payload)
    assert resp.status_code == status.HTTP_201_CREATED
    assert ProcurementPlan.objects.filter(plan_number='PLAN-TEST-02').exists()


@pytest.mark.django_db
def test_requisition_item_auto_total_calculation(test_setup):
    """Requisition item total price is automatically calculated (quantity * unit_price)."""
    item = test_setup['item']
    assert item.total_price == Decimal('1000000.00')
    assert test_setup['req'].total_amount == Decimal('1000000.00')


@pytest.mark.django_db
def test_requisition_approve_action(test_setup):
    """Contracts Manager can approve a pending requisition."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    req = test_setup['req']
    assert req.status == 'Pending'

    resp = client.post(f'/api/procurement/requisitions/{req.id}/approve/')
    assert resp.status_code == status.HTTP_200_OK
    assert resp.data['data']['status'] == 'Approved'

    req.refresh_from_db()
    assert req.status == 'Approved'
    assert req.approved_by == test_setup['cm']
    assert req.approved_at is not None


@pytest.mark.django_db
def test_requisition_reject_action(test_setup):
    """Contracts Manager can reject a pending requisition."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    req = test_setup['req']
    resp = client.post(f'/api/procurement/requisitions/{req.id}/reject/')
    assert resp.status_code == status.HTTP_200_OK
    assert resp.data['data']['status'] == 'Rejected'

    req.refresh_from_db()
    assert req.status == 'Rejected'


@pytest.mark.django_db
def test_procurement_plan_invalid_dates(test_setup):
    """End date before start date must be rejected."""
    client = APIClient()
    client.force_authenticate(user=test_setup['cm'])

    payload = {
        'plan_number': 'PLAN-TEST-INVALID',
        'title': 'Invalid Dates Plan',
        'fiscal_year': '2024-2025',
        'total_budget': '10000000.00',
        'start_date': '2025-05-01',
        'end_date': '2024-05-01',  # Earlier!
        'status': 'Draft'
    }
    resp = client.post('/api/procurement/plans/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
