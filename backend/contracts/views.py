"""
contracts/views.py
ViewSets and API views for Contract Management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from common.permissions import IsAdminOrContractsManager, IsAdministrator
from common.responses import success_response, error_response
from .models import Contract, ContractDocument
from .serializers import ContractSerializer, ContractDocumentSerializer


class ContractViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Defense Contracts.
    - Safety Officers and business users: View/List (read-only)
    - Contracts Managers: Create, View, Update
    - Administrators: Full CRUD (including delete)
    """
    queryset = Contract.objects.select_related('vendor', 'created_by').prefetch_related('documents').all()
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'contract_type', 'vendor']
    search_fields = ['contract_number', 'title', 'description', 'vendor__company_name']
    ordering_fields = ['created_at', 'start_date', 'end_date', 'value']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsAuthenticated(), IsAdminOrContractsManager()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsAdministrator()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(response.data, message='Contracts retrieved successfully.')

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return success_response(response.data, message='Contract details retrieved.')


class ContractDocumentViewSet(viewsets.ModelViewSet):
    """API for managing documents associated with contracts."""
    queryset = ContractDocument.objects.select_related('contract', 'uploaded_by').all()
    serializer_class = ContractDocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['contract']
    search_fields = ['title', 'file_name']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
