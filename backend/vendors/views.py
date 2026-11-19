"""
vendors/views.py
ViewSets for Vendor management and Vendor evaluations.
"""
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from common.permissions import IsAdminOrContractsManager, IsAdministrator
from common.responses import success_response, error_response
from .models import Vendor, VendorEvaluation
from .serializers import VendorSerializer, VendorEvaluationSerializer


class VendorViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Defense Vendors.
    - Safety Officers and staff can view vendor info.
    - Contracts Managers and Administrators can register and update vendors.
    """
    queryset = Vendor.objects.select_related('registered_by').prefetch_related('evaluations', 'contracts').all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'city', 'state']
    search_fields = ['vendor_code', 'company_name', 'contact_person', 'email', 'gst_number']
    ordering_fields = ['company_name', 'created_at']
    ordering = ['company_name']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsAuthenticated(), IsAdminOrContractsManager()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(registered_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(response.data, message='Vendors retrieved successfully.')

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return success_response(response.data, message='Vendor details retrieved.')


class VendorEvaluationViewSet(viewsets.ModelViewSet):
    """
    Vendor Evaluation and Scoring API.
    - Safety Officers and Contracts Managers evaluate vendors based on quality, delivery, compliance, etc.
    """
    queryset = VendorEvaluation.objects.select_related('vendor', 'evaluated_by').all()
    serializer_class = VendorEvaluationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['vendor', 'recommendation']
    search_fields = ['vendor__company_name', 'remarks']
    ordering_fields = ['evaluation_date', 'overall_score']
    ordering = ['-evaluation_date']

    def perform_create(self, serializer):
        serializer.save(evaluated_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(response.data, message='Vendor evaluations retrieved.')
