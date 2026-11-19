"""
procurement/urls.py
Routing for Procurement Plans, Requisitions, and Items.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProcurementPlanViewSet, RequisitionViewSet, RequisitionItemViewSet

router = DefaultRouter()
router.register(r'plans', ProcurementPlanViewSet, basename='procurement-plan')
router.register(r'requisitions/items', RequisitionItemViewSet, basename='requisition-item')
router.register(r'requisitions', RequisitionViewSet, basename='requisition')

urlpatterns = [
    path('', include(router.urls)),
]
