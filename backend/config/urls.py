"""
ContractCommand – Root URL Configuration
All API routes are grouped under /api/
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Redirect Root / to Swagger UI
    path('', RedirectView.as_view(url='/api/docs/swagger/', permanent=False), name='root-redirect'),

    # Django Admin
    path('admin/', admin.site.urls),

    # API Modules
    path('api/auth/',                 include('accounts.urls')),
    path('api/contracts/',            include('contracts.urls')),
    path('api/procurement/',          include('procurement.urls')),
    path('api/vendors/',              include('vendors.urls')),
    path('api/finance/',              include('finance.urls')),

    # OpenAPI Documentation
    path('api/schema/',               SpectacularAPIView.as_view(),        name='schema'),
    path('api/docs/swagger/',         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/',           SpectacularRedocView.as_view(url_name='schema'),   name='redoc'),
]
