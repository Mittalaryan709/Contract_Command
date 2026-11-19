from django.contrib import admin
from .models import Contract, ContractDocument


class ContractDocumentInline(admin.TabularInline):
    model = ContractDocument
    extra = 1


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('contract_number', 'title', 'contract_type', 'vendor', 'value', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'contract_type', 'start_date')
    search_fields = ('contract_number', 'title', 'description', 'vendor__company_name')
    inlines = [ContractDocumentInline]


@admin.register(ContractDocument)
class ContractDocumentAdmin(admin.ModelAdmin):
    list_display = ('contract', 'title', 'file_name', 'uploaded_by', 'uploaded_at')
    search_fields = ('title', 'file_name', 'contract__contract_number')
