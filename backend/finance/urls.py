"""
finance/urls.py
Routing for Invoice and Payment endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, InvoiceItemViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'invoices/items', InvoiceItemViewSet, basename='invoice-item')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
]
