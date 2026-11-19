"""
contracts/models.py
Contract and ContractDocument models.
"""
from django.db import models
from django.contrib.auth.models import User
from common.validators import validate_contract_number


class Contract(models.Model):
    STATUS_CHOICES = [
        ('Draft',      'Draft'),
        ('Active',     'Active'),
        ('Expired',    'Expired'),
        ('Terminated', 'Terminated'),
        ('Completed',  'Completed'),
    ]

    CONTRACT_TYPE_CHOICES = [
        ('Supply',   'Supply'),
        ('Service',  'Service'),
        ('Maintenance', 'Maintenance'),
        ('Research',  'Research'),
        ('Consulting','Consulting'),
    ]

    contract_number = models.CharField(
        max_length=20, unique=True,
        validators=[validate_contract_number],
        help_text='Format: CC-YYYY-NNNN'
    )
    title           = models.CharField(max_length=255)
    contract_type   = models.CharField(max_length=50, choices=CONTRACT_TYPE_CHOICES)
    description     = models.TextField(blank=True)
    vendor          = models.ForeignKey(
        'vendors.Vendor', on_delete=models.PROTECT,
        related_name='contracts', null=True, blank=True
    )
    value           = models.DecimalField(max_digits=15, decimal_places=2)
    start_date      = models.DateField()
    end_date        = models.DateField()
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_by      = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='contracts_created'
    )
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table   = 'contracts_contract'
        ordering   = ['-created_at']
        indexes    = [
            models.Index(fields=['status']),
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['contract_number']),
        ]

    def __str__(self):
        return f"{self.contract_number} – {self.title}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValidationError({'end_date': 'End date must be after start date.'})
        if self.value is not None and self.value <= 0:
            raise ValidationError({'value': 'Contract value must be greater than zero.'})


class ContractDocument(models.Model):
    """Documents attached to a contract (e.g. signed PDF, amendments)."""

    contract    = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='documents')
    title       = models.CharField(max_length=255)
    file_name   = models.CharField(max_length=255)
    file_path   = models.CharField(max_length=500)
    uploaded_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contracts_contractdocument'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.contract.contract_number} – {self.title}"
