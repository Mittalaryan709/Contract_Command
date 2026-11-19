"""
common/validators.py
Shared field-level validators used in serializers across all modules.
"""
import re
from django.core.exceptions import ValidationError


def validate_indian_phone(value):
    """
    Accepts formats: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
    (10-digit Indian mobile numbers).
    """
    cleaned = re.sub(r'[\s\-\(\)]', '', str(value))
    pattern = r'^(\+91|91|0)?[6-9]\d{9}$'
    if not re.match(pattern, cleaned):
        raise ValidationError(
            f"'{value}' is not a valid Indian phone number. "
            "Use format: +91XXXXXXXXXX or 10-digit number starting with 6–9."
        )


def validate_positive_amount(value):
    """Amount must be greater than zero."""
    if value is not None and value <= 0:
        raise ValidationError("Amount must be greater than zero.")


def validate_non_negative_amount(value):
    """Amount must be zero or positive."""
    if value is not None and value < 0:
        raise ValidationError("Amount cannot be negative.")


def validate_contract_number(value):
    """
    Contract numbers follow pattern: CC-YYYY-NNNN
    Example: CC-2024-0001
    """
    pattern = r'^CC-\d{4}-\d{4}$'
    if not re.match(pattern, str(value)):
        raise ValidationError(
            f"'{value}' is not a valid contract number. "
            "Format required: CC-YYYY-NNNN (e.g. CC-2024-0001)."
        )


def validate_invoice_number(value):
    """
    Invoice numbers follow pattern: INV-YYYY-NNNNN
    Example: INV-2024-00001
    """
    pattern = r'^INV-\d{4}-\d{5}$'
    if not re.match(pattern, str(value)):
        raise ValidationError(
            f"'{value}' is not a valid invoice number. "
            "Format required: INV-YYYY-NNNNN (e.g. INV-2024-00001)."
        )
