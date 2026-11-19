"""
procurement/models.py
ProcurementPlan, Requisition, RequisitionItem models.
"""
from django.db import models
from django.contrib.auth.models import User


class ProcurementPlan(models.Model):
    STATUS_CHOICES = [
        ('Draft',    'Draft'),
        ('Approved', 'Approved'),
        ('Active',   'Active'),
        ('Closed',   'Closed'),
    ]

    plan_number  = models.CharField(max_length=30, unique=True)
    title        = models.CharField(max_length=255)
    description  = models.TextField(blank=True)
    fiscal_year  = models.CharField(max_length=9, help_text='e.g. 2024-2025')
    total_budget = models.DecimalField(max_digits=15, decimal_places=2)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_by   = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='procurement_plans_created'
    )
    start_date   = models.DateField()
    end_date     = models.DateField()
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'procurement_plan'
        ordering = ['-created_at']
        indexes  = [models.Index(fields=['status', 'fiscal_year'])]

    def __str__(self):
        return f"{self.plan_number} – {self.title}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValidationError({'end_date': 'End date must be after start date.'})
        if self.total_budget is not None and self.total_budget <= 0:
            raise ValidationError({'total_budget': 'Budget must be greater than zero.'})


class Requisition(models.Model):
    STATUS_CHOICES = [
        ('Pending',   'Pending'),
        ('Approved',  'Approved'),
        ('Rejected',  'Rejected'),
        ('Fulfilled', 'Fulfilled'),
        ('Cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('Low',    'Low'),
        ('Medium', 'Medium'),
        ('High',   'High'),
        ('Urgent', 'Urgent'),
    ]

    requisition_number = models.CharField(max_length=30, unique=True)
    plan               = models.ForeignKey(
        ProcurementPlan, on_delete=models.PROTECT, related_name='requisitions'
    )
    title              = models.CharField(max_length=255)
    description        = models.TextField(blank=True)
    priority           = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')
    status             = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    required_by_date   = models.DateField()
    requested_by       = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='requisitions_requested'
    )
    approved_by        = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='requisitions_approved'
    )
    approved_at        = models.DateTimeField(null=True, blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'procurement_requisition'
        ordering = ['-created_at']
        indexes  = [
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
        ]

    def __str__(self):
        return f"{self.requisition_number} – {self.title}"

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())


class RequisitionItem(models.Model):
    UNIT_CHOICES = [
        ('Unit',    'Unit'),
        ('Kg',      'Kg'),
        ('Litre',   'Litre'),
        ('Metre',   'Metre'),
        ('Set',     'Set'),
        ('Box',     'Box'),
        ('Piece',   'Piece'),
        ('Hour',    'Hour'),
    ]

    requisition  = models.ForeignKey(Requisition, on_delete=models.CASCADE, related_name='items')
    item_name    = models.CharField(max_length=255)
    description  = models.TextField(blank=True)
    quantity     = models.DecimalField(max_digits=10, decimal_places=2)
    unit         = models.CharField(max_length=20, choices=UNIT_CHOICES, default='Unit')
    unit_price   = models.DecimalField(max_digits=12, decimal_places=2)
    total_price  = models.DecimalField(max_digits=15, decimal_places=2, editable=False)

    class Meta:
        db_table = 'procurement_requisition_item'

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.quantity is not None and self.quantity <= 0:
            raise ValidationError({'quantity': 'Quantity must be greater than zero.'})
        if self.unit_price is not None and self.unit_price <= 0:
            raise ValidationError({'unit_price': 'Unit price must be greater than zero.'})

    def __str__(self):
        return f"{self.requisition.requisition_number} – {self.item_name}"
