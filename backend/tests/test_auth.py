"""
backend/tests/test_auth.py
Unit and integration tests for Authentication, Role-Based Access, and User Profiles.
"""
import pytest
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import UserProfile


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def setup_roles_and_users(db):
    admin_grp, _ = Group.objects.get_or_create(name='Administrator')
    cm_grp, _ = Group.objects.get_or_create(name='Contracts Manager')
    so_grp, _ = Group.objects.get_or_create(name='Safety Officer')

    # Admin User
    admin = User.objects.create_user(
        username='admin_test', email='admin@test.gov.in', password='TestPassword@123',
        first_name='Admin', last_name='User', is_staff=True, is_superuser=True
    )
    admin.groups.add(admin_grp)
    UserProfile.objects.create(user=admin, designation='Administrator', department='HQ', phone='9811000001')

    # Contracts Manager User
    cm = User.objects.create_user(
        username='cm_test', email='cm@test.gov.in', password='TestPassword@123',
        first_name='Contracts', last_name='Manager'
    )
    cm.groups.add(cm_grp)
    UserProfile.objects.create(user=cm, designation='Contracts Manager', department='Contracts', phone='9811000002')

    # Safety Officer User
    so = User.objects.create_user(
        username='so_test', email='so@test.gov.in', password='TestPassword@123',
        first_name='Safety', last_name='Officer'
    )
    so.groups.add(so_grp)
    UserProfile.objects.create(user=so, designation='Safety Officer', department='Safety', phone='9811000003')

    return {'admin': admin, 'cm': cm, 'so': so}


@pytest.mark.django_db
def test_login_success(api_client, setup_roles_and_users):
    """Test login endpoint returns JWT access and refresh tokens."""
    resp = api_client.post('/api/auth/login/', {
        'username': 'admin_test',
        'password': 'TestPassword@123'
    })
    assert resp.status_code == status.HTTP_200_OK
    assert 'access' in resp.data
    assert 'refresh' in resp.data


@pytest.mark.django_db
def test_login_invalid_credentials(api_client, setup_roles_and_users):
    """Test login with wrong password returns 401."""
    resp = api_client.post('/api/auth/login/', {
        'username': 'admin_test',
        'password': 'WrongPassword@999'
    })
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_token_refresh(api_client, setup_roles_and_users):
    """Test refreshing an access token using a refresh token."""
    login_resp = api_client.post('/api/auth/login/', {
        'username': 'cm_test',
        'password': 'TestPassword@123'
    })
    refresh_token = login_resp.data['refresh']

    refresh_resp = api_client.post('/api/auth/token/refresh/', {
        'refresh': refresh_token
    })
    assert refresh_resp.status_code == status.HTTP_200_OK
    assert 'access' in refresh_resp.data


@pytest.mark.django_db
def test_user_profile_authenticated(api_client, setup_roles_and_users):
    """Test retrieving authenticated user profile."""
    cm = setup_roles_and_users['cm']
    api_client.force_authenticate(user=cm)

    resp = api_client.get('/api/auth/profile/')
    assert resp.status_code == status.HTTP_200_OK
    assert resp.data['data']['username'] == 'cm_test'
    assert 'Contracts Manager' in resp.data['data']['groups']


@pytest.mark.django_db
def test_user_profile_unauthenticated(api_client):
    """Test profile endpoint without authentication returns 401."""
    resp = api_client.get('/api/auth/profile/')
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_register_new_user(api_client):
    """Test user registration endpoint creates user, group, and profile."""
    payload = {
        'username': 'new_officer',
        'email': 'new.officer@test.gov.in',
        'first_name': 'New',
        'last_name': 'Officer',
        'password': 'StrongPassword@2024',
        'confirm_password': 'StrongPassword@2024',
        'designation': 'Safety Officer',
        'phone': '9899001122',
        'department': 'Air Safety Inspection',
        'city': 'Bengaluru'
    }
    resp = api_client.post('/api/auth/register/', payload)
    assert resp.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(username='new_officer').exists()
    user = User.objects.get(username='new_officer')
    assert user.groups.filter(name='Safety Officer').exists()
    assert user.profile.designation == 'Safety Officer'


@pytest.mark.django_db
def test_register_password_mismatch(api_client):
    """Test registration fails if passwords do not match."""
    payload = {
        'username': 'bad_pass_user',
        'email': 'badpass@test.gov.in',
        'first_name': 'Bad',
        'last_name': 'Pass',
        'password': 'StrongPassword@2024',
        'confirm_password': 'DifferentPassword@2024',
        'designation': 'Safety Officer',
    }
    resp = api_client.post('/api/auth/register/', payload)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert not resp.data['success']


@pytest.mark.django_db
def test_logout_blacklists_token(api_client, setup_roles_and_users):
    """Test logout blacklists the provided refresh token."""
    login_resp = api_client.post('/api/auth/login/', {
        'username': 'admin_test',
        'password': 'TestPassword@123'
    })
    refresh_token = login_resp.data['refresh']
    access_token = login_resp.data['access']

    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    logout_resp = api_client.post('/api/auth/logout/', {'refresh': refresh_token})
    assert logout_resp.status_code == status.HTTP_200_OK
    assert logout_resp.data['success']
