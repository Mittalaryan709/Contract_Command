"""
finance/serializers.py
Serializers for Invoices, InvoiceItems, and Payments.
"""
from rest_framework import serializers
from .models import Invoice, InvoiceItem, Payment


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'invoice', 'description', 'quantity', 'unit_price', 'line_total']
        read_only_fields = ['id', 'line_total']


class PaymentSerializer(serializers.ModelSerializer):
    processed_by_name = serializers.CharField(source='processed_by.get_full_name', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'invoice', 'invoice_number', 'payment_reference', 'payment_date',
            'amount', 'payment_method', 'status', 'remarks', 'processed_by',
            'processed_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'processed_by', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Payment amount must be greater than zero.')
        return value


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    contract_number = serializers.CharField(source='contract.contract_number', read_only=True)
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    paid_amount = serializers.SerializerMethodField()
    balance_amount = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'contract', 'contract_number', 'vendor',
            'vendor_name', 'invoice_date', 'due_date', 'status', 'subtotal',
            'tax_percent', 'tax_amount', 'total_amount', 'paid_amount', 'balance_amount',
            'notes', 'created_by', 'created_by_name', 'items', 'payments',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'subtotal', 'tax_amount', 'total_amount',
            'created_by', 'created_at', 'updated_at'
        ]

    def get_paid_amount(self, obj):
        return sum(p.amount for p in obj.payments.filter(status='Completed'))

    def get_balance_amount(self, obj):
        return obj.total_amount - self.get_paid_amount(obj)

    def validate(self, data):
        invoice_date = data.get('invoice_date', getattr(self.instance, 'invoice_date', None))
        due_date = data.get('due_date', getattr(self.instance, 'due_date', None))
        if invoice_date and due_date and due_date < invoice_date:
            raise serializers.ValidationError({'due_date': 'Due date cannot be before invoice date.'})
        return data
