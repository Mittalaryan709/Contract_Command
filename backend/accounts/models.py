"""
accounts/models.py
UserProfile extends Django's built-in User with role and contact info.
Roles are managed via Django Groups: Administrator, Contracts Manager, Safety Officer.
"""
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended profile attached 1-to-1 to Django's built-in User model."""

    DESIGNATION_CHOICES = [
        ('Administrator',    'Administrator'),
        ('Contracts Manager','Contracts Manager'),
        ('Safety Officer',   'Safety Officer'),
    ]

    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    designation = models.CharField(max_length=50, choices=DESIGNATION_CHOICES)
    phone       = models.CharField(max_length=15, blank=True)
    department  = models.CharField(max_length=100, blank=True)
    city        = models.CharField(max_length=100, blank=True)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table   = 'accounts_userprofile'
        verbose_name        = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.get_full_name()} – {self.designation}"
