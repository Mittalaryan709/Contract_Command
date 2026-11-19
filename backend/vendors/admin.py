from django.contrib import admin
from .models import Vendor, VendorEvaluation


class VendorEvaluationInline(admin.TabularInline):
    model = VendorEvaluation
    extra = 0
    readonly_fields = ('overall_score',)


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('vendor_code', 'company_name', 'category', 'contact_person', 'email', 'phone', 'city', 'status')
    list_filter = ('status', 'category', 'state')
    search_fields = ('vendor_code', 'company_name', 'contact_person', 'email', 'gst_number')
    inlines = [VendorEvaluationInline]


@admin.register(VendorEvaluation)
class VendorEvaluationAdmin(admin.ModelAdmin):
    list_display = ('vendor', 'evaluation_date', 'overall_score', 'recommendation', 'evaluated_by')
    list_filter = ('recommendation', 'evaluation_date')
    search_fields = ('vendor__company_name', 'remarks')
    readonly_fields = ('overall_score',)
