"""
common/exceptions.py
Custom exception handler – returns consistent JSON error responses.
Never exposes stack traces or database credentials.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Wraps DRF's default handler so every error response has the shape:
    {
        "success": false,
        "message": "...",
        "errors":  { ... }   # optional field-level detail
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            'success': False,
            'message': _get_message(response),
            'errors':  response.data,
        }
        response.data = error_data
    else:
        # Unhandled exception – return 500 without internal details
        response = Response(
            {
                'success': False,
                'message': 'An unexpected error occurred. Please contact support.',
                'errors':  {},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response


def _get_message(response):
    """Extract a human-readable top-level message from the response data."""
    data = response.data

    if isinstance(data, list) and data:
        return str(data[0])

    if isinstance(data, dict):
        # DRF puts 'detail' for auth/permission errors
        if 'detail' in data:
            return str(data['detail'])
        # Return first field's first message
        for key, value in data.items():
            if isinstance(value, list) and value:
                return f"{key}: {value[0]}"
            if isinstance(value, str):
                return f"{key}: {value}"

    return 'Request failed.'
