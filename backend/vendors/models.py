"""
vendors/models.py
Vendor and VendorEvaluation models.
"""
from django.db import models
from django.contrib.auth.models import User
from common.validators import validate_indian_phone


class Vendor(models.Model):
    STATUS_CHOICES = [
        ('Active',      'Active'),
        ('Inactive',    'Inactive'),
        ('Blacklisted', 'Blacklisted'),
        ('Pending',     'Pending'),
    ]

    CATEGORY_CHOICES = [
        ('Electronics',   'Electronics'),
        ('Mechanical',    'Mechanical'),
        ('IT Services',   'IT Services'),
        ('Logistics',     'Logistics'),
        ('Chemicals',     'Chemicals'),
        ('Construction',  'Construction'),
        ('Consulting',    'Consulting'),
        ('Ammunition',    'Ammunition'),
        ('Vehicles',      'Vehicles'),
        ('Other',         'Other'),
    ]

    vendor_code    = models.CharField(max_length=20, unique=True)
    company_name   = models.CharField(max_length=255)
    category       = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    contact_person = models.CharField(max_length=100)
    email          = models.EmailField(unique=True)
    phone          = models.CharField(max_length=15, validators=[validate_indian_phone])
    address        = models.TextField()
    city           = models.CharField(max_length=100)
    state          = models.CharField(max_length=100)
    pincode        = models.CharField(max_length=6)
    gst_number     = models.CharField(max_length=20, blank=True)
    pan_number     = models.CharField(max_length=10, blank=True)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    registered_by  = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='vendors_registered'
    )
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table   = 'vendors_vendor'
        ordering   = ['company_name']
        indexes    = [
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['vendor_code']),
        ]

    def __str__(self):
        return f"{self.vendor_code} – {self.company_name}"


class VendorEvaluation(models.Model):
    """Scoring record for a vendor at a point in time."""

    RECOMMENDATION_CHOICES = [
        ('Selected',    'Selected'),
        ('Shortlisted', 'Shortlisted'),
        ('Rejected',    'Rejected'),
    ]

    vendor             = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='evaluations')
    evaluated_by       = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='evaluations_done'
    )
    evaluation_date    = models.DateField()
    quality_score      = models.DecimalField(max_digits=4, decimal_places=1,
                                             help_text='Score 0–10')
    delivery_score     = models.DecimalField(max_digits=4, decimal_places=1,
                                             help_text='Score 0–10')
    pricing_score      = models.DecimalField(max_digits=4, decimal_places=1,
                                             help_text='Score 0–10')
    compliance_score   = models.DecimalField(max_digits=4, decimal_places=1,
                                             help_text='Score 0–10')
    overall_score      = models.DecimalField(max_digits=4, decimal_places=1,
                                             editable=False)
    recommendation     = models.CharField(max_length=20, choices=RECOMMENDATION_CHOICES)
    remarks            = models.TextField(blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vendors_evaluation'
        ordering = ['-evaluation_date']

    def save(self, *args, **kwargs):
        self.overall_score = round(
            (self.quality_score + self.delivery_score +
             self.pricing_score + self.compliance_score) / 4, 1
        )
        super().save(*args, **kwargs)

    def clean(self):
        from django.core.exceptions import ValidationError
        for field in ['quality_score', 'delivery_score', 'pricing_score', 'compliance_score']:
            value = getattr(self, field)
            if value is not None and not (0 <= value <= 10):
                raise ValidationError({field: f'{field} must be between 0 and 10.'})

    def __str__(self):
        return f"{self.vendor.company_name} – {self.evaluation_date} ({self.overall_score})"
