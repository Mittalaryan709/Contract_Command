"""
procurement/views.py
ViewSets for Procurement Plans, Requisitions, and Items.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from common.permissions import IsAdminOrContractsManager, IsAdministrator
from common.responses import success_response, error_response
from .models import ProcurementPlan, Requisition, RequisitionItem
from .serializers import ProcurementPlanSerializer, RequisitionSerializer, RequisitionItemSerializer


class ProcurementPlanViewSet(viewsets.ModelViewSet):
    """
    Procurement Plan CRUD API.
    - Contracts Managers and Administrators can create/update.
    - Safety Officers and other staff can view plans.
    """
    queryset = ProcurementPlan.objects.select_related('created_by').prefetch_related('requisitions').all()
    serializer_class = ProcurementPlanSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'fiscal_year']
    search_fields = ['plan_number', 'title', 'description']
    ordering_fields = ['created_at', 'total_budget', 'start_date']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrContractsManager()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(response.data, message='Procurement plans retrieved.')


class RequisitionViewSet(viewsets.ModelViewSet):
    """
    Requisition management API.
    - Any authenticated staff can request/create.
    - Approval is restricted to Contracts Manager and Administrators.
    """
    queryset = Requisition.objects.select_related('plan', 'requested_by', 'approved_by').prefetch_related('items').all()
    serializer_class = RequisitionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'plan']
    search_fields = ['requisition_number', 'title', 'description', 'requested_by__username']
    ordering_fields = ['created_at', 'required_by_date', 'priority']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(response.data, message='Requisitions retrieved.')

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrContractsManager])
    def approve(self, request, pk=None):
        """Approve a requisition."""
        requisition = self.get_object()
        if requisition.status != 'Pending':
            return error_response(f'Cannot approve requisition with status {requisition.status}.')
        requisition.status = 'Approved'
        requisition.approved_by = request.user
        requisition.approved_at = timezone.now()
        requisition.save()
        return success_response(RequisitionSerializer(requisition).data, message='Requisition approved.')

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrContractsManager])
    def reject(self, request, pk=None):
        """Reject a requisition."""
        requisition = self.get_object()
        if requisition.status != 'Pending':
            return error_response(f'Cannot reject requisition with status {requisition.status}.')
        requisition.status = 'Rejected'
        requisition.approved_by = request.user
        requisition.approved_at = timezone.now()
        requisition.save()
        return success_response(RequisitionSerializer(requisition).data, message='Requisition rejected.')


class RequisitionItemViewSet(viewsets.ModelViewSet):
    """Line items for requisitions."""
    queryset = RequisitionItem.objects.select_related('requisition').all()
    serializer_class = RequisitionItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['requisition']
