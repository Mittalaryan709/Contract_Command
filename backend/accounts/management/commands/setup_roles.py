"""
accounts/management/commands/setup_roles.py
Sets up the three required system roles:
1. Administrator
2. Safety Officer
3. Contracts Manager
Assigns appropriate model permissions to each group.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

from accounts.models import UserProfile
from contracts.models import Contract, ContractDocument
from procurement.models import ProcurementPlan, Requisition, RequisitionItem
from vendors.models import Vendor, VendorEvaluation
from finance.models import Invoice, InvoiceItem, Payment


class Command(BaseCommand):
    help = 'Create default Groups (Administrator, Safety Officer, Contracts Manager) and assign permissions'

    def handle(self, *args, **options):
        # 1. Administrator - has all permissions
        admin_group, _ = Group.objects.get_or_create(name='Administrator')
        all_permissions = Permission.objects.all()
        admin_group.permissions.set(all_permissions)
        self.stdout.write(self.style.SUCCESS('Configured Administrator group with full permissions.'))

        # 2. Contracts Manager - contracts, vendors, procurement, finance
        cm_group, _ = Group.objects.get_or_create(name='Contracts Manager')
        cm_models = [
            Contract, ContractDocument,
            ProcurementPlan, Requisition, RequisitionItem,
            Vendor, VendorEvaluation,
            Invoice, InvoiceItem, Payment
        ]
        cm_perms = []
        for model in cm_models:
            ct = ContentType.objects.get_for_model(model)
            perms = Permission.objects.filter(content_type=ct)
            cm_perms.extend(perms)
        cm_group.permissions.set(cm_perms)
        self.stdout.write(self.style.SUCCESS('Configured Contracts Manager group permissions.'))

        # 3. Safety Officer - read contracts & procurement, manage vendor evaluations
        so_group, _ = Group.objects.get_or_create(name='Safety Officer')
        so_perms = []
        # View perms for contracts, plans, requisitions, vendors
        view_models = [Contract, ContractDocument, ProcurementPlan, Requisition, Vendor]
        for model in view_models:
            ct = ContentType.objects.get_for_model(model)
            perms = Permission.objects.filter(content_type=ct, codename__startswith='view_')
            so_perms.extend(perms)

        # Full perms on VendorEvaluation (Safety Officer inspects & scores vendors)
        eval_ct = ContentType.objects.get_for_model(VendorEvaluation)
        so_perms.extend(Permission.objects.filter(content_type=eval_ct))

        so_group.permissions.set(so_perms)
        self.stdout.write(self.style.SUCCESS('Configured Safety Officer group permissions.'))
