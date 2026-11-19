"""
common/pagination.py
Standard pagination used across all API endpoints.
"""
from rest_framework.pagination import PageNumberPagination


class StandardResultsPagination(PageNumberPagination):
    """Return 20 items per page; allow client to request up to 100."""
    page_size            = 20
    page_size_query_param = 'page_size'
    max_page_size        = 100
