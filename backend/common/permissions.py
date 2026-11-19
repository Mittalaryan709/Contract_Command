"""
common/permissions.py
Project-wide custom permission classes used across all modules.
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdministrator(BasePermission):
    """Allow access only to users in the 'Administrator' group."""
    message = 'Access restricted to Administrators.'

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name='Administrator').exists()
        )


class IsContractsManager(BasePermission):
    """Allow access only to users in the 'Contracts Manager' group."""
    message = 'Access restricted to Contracts Managers.'

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name='Contracts Manager').exists()
        )


class IsSafetyOfficer(BasePermission):
    """Allow access only to users in the 'Safety Officer' group."""
    message = 'Access restricted to Safety Officers.'

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name='Safety Officer').exists()
        )


class IsAdminOrContractsManager(BasePermission):
    """Allow Administrators or Contracts Managers."""
    message = 'Access restricted to Administrators or Contracts Managers.'

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        groups = request.user.groups.values_list('name', flat=True)
        return 'Administrator' in groups or 'Contracts Manager' in groups


class IsAdminOrReadOnly(BasePermission):
    """
    Safe (GET/HEAD/OPTIONS) methods allowed for any authenticated user.
    Write methods restricted to Administrators only.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.groups.filter(name='Administrator').exists()
