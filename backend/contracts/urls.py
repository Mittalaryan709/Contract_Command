"""
contracts/urls.py
Routing for Contract and Document endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContractViewSet, ContractDocumentViewSet

router = DefaultRouter()
router.register(r'documents', ContractDocumentViewSet, basename='contract-document')
router.register(r'', ContractViewSet, basename='contract')

urlpatterns = [
    path('', include(router.urls)),
]
