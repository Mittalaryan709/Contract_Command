"""
finance/views.py
ViewSets for Invoices, InvoiceItems, and Payments.
"""
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from common.permissions import IsAdminOrContractsManager, IsAdministrator
from common.responses import success_response, error_response
from .models import Invoice, InvoiceItem, Payment
from .serializers import InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    Invoice Management API.
    - Full CRUD for invoices and items.
    - Contracts Managers and Administrators can create/update.
    """
    queryset = Invoice.objects.select_related('contract', 'vendor', 'created_by').prefetch_related('items', 'payments').all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'contract', 'vendor']
    search_fields = ['invoice_number', 'contract__contract_number', 'vendor__company_name']
    ordering_fields = ['invoice_date', 'due_date', 'total_amount']
    ordering = ['-invoice_date']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(response.data, message='Invoices retrieved successfully.')

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return success_response(response.data, message='Invoice details retrieved.')


class InvoiceItemViewSet(viewsets.ModelViewSet):
    """Line items for invoices."""
    queryset = InvoiceItem.objects.select_related('invoice').all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['invoice']


class PaymentViewSet(viewsets.ModelViewSet):
    """
    Payment processing records API.
    - Records financial disbursement / payment tracking.
    """
    queryset = Payment.objects.select_related('invoice', 'processed_by').all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method', 'invoice']
    search_fields = ['payment_reference', 'invoice__invoice_number', 'remarks']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']

    def perform_create(self, serializer):
        serializer.save(processed_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(response.data, message='Payments retrieved successfully.')
