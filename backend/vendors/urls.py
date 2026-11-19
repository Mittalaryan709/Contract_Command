"""
vendors/urls.py
Routing for Vendor and Evaluation endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, VendorEvaluationViewSet

router = DefaultRouter()
router.register(r'evaluations', VendorEvaluationViewSet, basename='vendor-evaluation')
router.register(r'', VendorViewSet, basename='vendor')

urlpatterns = [
    path('', include(router.urls)),
]
