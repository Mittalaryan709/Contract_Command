from django.contrib import admin
from .models import ProcurementPlan, Requisition, RequisitionItem


class RequisitionItemInline(admin.TabularInline):
    model = RequisitionItem
    extra = 1


@admin.register(ProcurementPlan)
class ProcurementPlanAdmin(admin.ModelAdmin):
    list_display = ('plan_number', 'title', 'fiscal_year', 'total_budget', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'fiscal_year')
    search_fields = ('plan_number', 'title', 'description')


@admin.register(Requisition)
class RequisitionAdmin(admin.ModelAdmin):
    list_display = ('requisition_number', 'plan', 'title', 'priority', 'status', 'required_by_date', 'requested_by')
    list_filter = ('status', 'priority', 'plan')
    search_fields = ('requisition_number', 'title', 'description')
    inlines = [RequisitionItemInline]


@admin.register(RequisitionItem)
class RequisitionItemAdmin(admin.ModelAdmin):
    list_display = ('requisition', 'item_name', 'quantity', 'unit', 'unit_price', 'total_price')
    search_fields = ('item_name', 'requisition__requisition_number')
