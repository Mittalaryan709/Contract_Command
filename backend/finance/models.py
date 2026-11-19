"""
finance/models.py
Invoice, InvoiceItem, and Payment models.
"""
from django.db import models
from django.contrib.auth.models import User
from common.validators import validate_invoice_number


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Draft',    'Draft'),
        ('Submitted','Submitted'),
        ('Approved', 'Approved'),
        ('Paid',     'Paid'),
        ('Overdue',  'Overdue'),
        ('Cancelled','Cancelled'),
    ]

    invoice_number  = models.CharField(
        max_length=20, unique=True,
        validators=[validate_invoice_number],
        help_text='Format: INV-YYYY-NNNNN'
    )
    contract        = models.ForeignKey(
        'contracts.Contract', on_delete=models.PROTECT, related_name='invoices'
    )
    vendor          = models.ForeignKey(
        'vendors.Vendor', on_delete=models.PROTECT, related_name='invoices'
    )
    invoice_date    = models.DateField()
    due_date        = models.DateField()
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    subtotal        = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_percent     = models.DecimalField(max_digits=5, decimal_places=2, default=18.00,
                                          help_text='GST percentage, e.g. 18.00')
    tax_amount      = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount    = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    notes           = models.TextField(blank=True)
    created_by      = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='invoices_created'
    )
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'finance_invoice'
        ordering = ['-invoice_date']
        indexes  = [
            models.Index(fields=['status']),
            models.Index(fields=['invoice_number']),
            models.Index(fields=['due_date']),
        ]

    def recalculate_totals(self):
        self.subtotal    = sum(item.line_total for item in self.items.all())
        self.tax_amount  = round(self.subtotal * self.tax_percent / 100, 2)
        self.total_amount = self.subtotal + self.tax_amount

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.invoice_date and self.due_date and self.due_date < self.invoice_date:
            raise ValidationError({'due_date': 'Due date cannot be before invoice date.'})

    def __str__(self):
        return f"{self.invoice_number} – ₹{self.total_amount}"


class InvoiceItem(models.Model):
    invoice     = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity    = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price  = models.DecimalField(max_digits=12, decimal_places=2)
    line_total  = models.DecimalField(max_digits=15, decimal_places=2, editable=False)

    class Meta:
        db_table = 'finance_invoice_item'

    def save(self, *args, **kwargs):
        self.line_total = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        # Recalculate invoice totals whenever an item is saved
        self.invoice.recalculate_totals()
        self.invoice.save(update_fields=['subtotal', 'tax_amount', 'total_amount'])

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.quantity is not None and self.quantity <= 0:
            raise ValidationError({'quantity': 'Quantity must be greater than zero.'})
        if self.unit_price is not None and self.unit_price <= 0:
            raise ValidationError({'unit_price': 'Unit price must be greater than zero.'})

    def __str__(self):
        return f"{self.invoice.invoice_number} – {self.description}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('Initiated',  'Initiated'),
        ('Processing', 'Processing'),
        ('Completed',  'Completed'),
        ('Failed',     'Failed'),
        ('Reversed',   'Reversed'),
    ]

    METHOD_CHOICES = [
        ('NEFT',   'NEFT'),
        ('RTGS',   'RTGS'),
        ('IMPS',   'IMPS'),
        ('Cheque', 'Cheque'),
        ('DD',     'Demand Draft'),
    ]

    invoice          = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name='payments')
    payment_reference= models.CharField(max_length=50, unique=True)
    payment_date     = models.DateField()
    amount           = models.DecimalField(max_digits=15, decimal_places=2)
    payment_method   = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Initiated')
    remarks          = models.TextField(blank=True)
    processed_by     = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='payments_processed'
    )
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'finance_payment'
        ordering = ['-payment_date']
        indexes  = [
            models.Index(fields=['status']),
            models.Index(fields=['payment_reference']),
        ]

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.amount is not None and self.amount <= 0:
            raise ValidationError({'amount': 'Payment amount must be greater than zero.'})

    def __str__(self):
        return f"{self.payment_reference} – ₹{self.amount} ({self.status})"
