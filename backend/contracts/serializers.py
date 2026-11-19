"""
contracts/serializers.py
Serializers for Contract and ContractDocument models.
"""
from rest_framework import serializers
from .models import Contract, ContractDocument
from vendors.models import Vendor


class ContractDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)

    class Meta:
        model = ContractDocument
        fields = ['id', 'contract', 'title', 'file_name', 'file_path', 'uploaded_by', 'uploaded_by_name', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']


class ContractSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    documents = ContractDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Contract
        fields = [
            'id', 'contract_number', 'title', 'contract_type', 'description',
            'vendor', 'vendor_name', 'value', 'start_date', 'end_date',
            'status', 'created_by', 'created_by_name', 'documents',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def validate(self, data):
        start_date = data.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = data.get('end_date', getattr(self.instance, 'end_date', None))
        value = data.get('value', getattr(self.instance, 'value', None))

        if start_date and end_date and end_date <= start_date:
            raise serializers.ValidationError({'end_date': 'End date must be after start date.'})
        if value is not None and value <= 0:
            raise serializers.ValidationError({'value': 'Contract value must be greater than zero.'})
        return data
