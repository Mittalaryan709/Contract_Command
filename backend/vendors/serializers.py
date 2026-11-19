"""
vendors/serializers.py
Serializers for Vendor and VendorEvaluation models.
"""
from rest_framework import serializers
from .models import Vendor, VendorEvaluation


class VendorEvaluationSerializer(serializers.ModelSerializer):
    evaluated_by_name = serializers.CharField(source='evaluated_by.get_full_name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)

    class Meta:
        model = VendorEvaluation
        fields = [
            'id', 'vendor', 'vendor_name', 'evaluated_by', 'evaluated_by_name',
            'evaluation_date', 'quality_score', 'delivery_score', 'pricing_score',
            'compliance_score', 'overall_score', 'recommendation', 'remarks', 'created_at'
        ]
        read_only_fields = ['id', 'overall_score', 'evaluated_by', 'created_at']

    def validate(self, data):
        for score_field in ['quality_score', 'delivery_score', 'pricing_score', 'compliance_score']:
            val = data.get(score_field)
            if val is not None and not (0 <= val <= 10):
                raise serializers.ValidationError({score_field: f'{score_field} must be between 0 and 10.'})
        return data


class VendorSerializer(serializers.ModelSerializer):
    registered_by_name = serializers.CharField(source='registered_by.get_full_name', read_only=True)
    evaluations = VendorEvaluationSerializer(many=True, read_only=True)
    contracts_count = serializers.IntegerField(source='contracts.count', read_only=True)
    average_score = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = [
            'id', 'vendor_code', 'company_name', 'category', 'contact_person',
            'email', 'phone', 'address', 'city', 'state', 'pincode',
            'gst_number', 'pan_number', 'status', 'registered_by', 'registered_by_name',
            'contracts_count', 'average_score', 'evaluations', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'registered_by', 'created_at', 'updated_at']

    def get_average_score(self, obj):
        evals = obj.evaluations.all()
        if not evals:
            return None
        return round(sum(e.overall_score for e in evals) / len(evals), 1)
