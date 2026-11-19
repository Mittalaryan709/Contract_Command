"""
procurement/serializers.py
Serializers for ProcurementPlan, Requisition, and RequisitionItem.
"""
from rest_framework import serializers
from .models import ProcurementPlan, Requisition, RequisitionItem


class RequisitionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequisitionItem
        fields = ['id', 'requisition', 'item_name', 'description', 'quantity', 'unit', 'unit_price', 'total_price']
        read_only_fields = ['id', 'total_price']


class RequisitionSerializer(serializers.ModelSerializer):
    items = RequisitionItemSerializer(many=True, read_only=True)
    plan_title = serializers.CharField(source='plan.title', read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    total_amount = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)

    class Meta:
        model = Requisition
        fields = [
            'id', 'requisition_number', 'plan', 'plan_title', 'title', 'description',
            'priority', 'status', 'required_by_date', 'requested_by', 'requested_by_name',
            'approved_by', 'approved_by_name', 'approved_at', 'total_amount', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'requested_by', 'approved_by', 'approved_at', 'created_at', 'updated_at']


class ProcurementPlanSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    requisitions_count = serializers.IntegerField(source='requisitions.count', read_only=True)

    class Meta:
        model = ProcurementPlan
        fields = [
            'id', 'plan_number', 'title', 'description', 'fiscal_year', 'total_budget',
            'status', 'created_by', 'created_by_name', 'start_date', 'end_date',
            'requisitions_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def validate(self, data):
        start_date = data.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = data.get('end_date', getattr(self.instance, 'end_date', None))
        total_budget = data.get('total_budget', getattr(self.instance, 'total_budget', None))

        if start_date and end_date and end_date <= start_date:
            raise serializers.ValidationError({'end_date': 'End date must be after start date.'})
        if total_budget is not None and total_budget <= 0:
            raise serializers.ValidationError({'total_budget': 'Budget must be greater than zero.'})
        return data
