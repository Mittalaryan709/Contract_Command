from django.contrib import admin
from .models import Invoice, InvoiceItem, Payment


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1
    readonly_fields = ('line_total',)


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'contract', 'vendor', 'invoice_date', 'due_date', 'total_amount', 'status')
    list_filter = ('status', 'invoice_date')
    search_fields = ('invoice_number', 'contract__contract_number', 'vendor__company_name')
    readonly_fields = ('subtotal', 'tax_amount', 'total_amount')
    inlines = [InvoiceItemInline, PaymentInline]


@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'description', 'quantity', 'unit_price', 'line_total')
    search_fields = ('description', 'invoice__invoice_number')
    readonly_fields = ('line_total',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_reference', 'invoice', 'payment_date', 'amount', 'payment_method', 'status', 'processed_by')
    list_filter = ('status', 'payment_method', 'payment_date')
    search_fields = ('payment_reference', 'invoice__invoice_number', 'remarks')
