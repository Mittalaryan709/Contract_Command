"""
accounts/management/commands/seed_data.py
Populates realistic Indian defense procurement and contract data.
Follows all Section 5 guidelines:
- 10-15 master rows, 50-100 transaction rows.
- Realistic Indian names, cities, phone numbers, and INR amounts.
- Creates Administrator, Contracts Manager, and Safety Officer user accounts.
- Includes 5 specific validation edge cases.
"""
from decimal import Decimal
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from accounts.models import UserProfile
from vendors.models import Vendor, VendorEvaluation
from contracts.models import Contract, ContractDocument
from procurement.models import ProcurementPlan, Requisition, RequisitionItem
from finance.models import Invoice, InvoiceItem, Payment


class Command(BaseCommand):
    help = 'Seed realistic Indian defense contract and procurement data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding roles and users...')

        # Ensure groups exist
        admin_grp, _ = Group.objects.get_or_create(name='Administrator')
        cm_grp, _ = Group.objects.get_or_create(name='Contracts Manager')
        so_grp, _ = Group.objects.get_or_create(name='Safety Officer')

        # 1. Users
        users_data = [
            ('admin_user', 'admin@contractcommand.gov.in', 'Vikram', 'Aditya', 'Administrator', '9811023456', 'Headquarters', 'New Delhi'),
            ('rajesh_contracts', 'rajesh.sharma@contractcommand.gov.in', 'Rajesh', 'Sharma', 'Contracts Manager', '9822034567', 'Procurement & Contracts', 'Bengaluru'),
            ('priya_safety', 'priya.nair@contractcommand.gov.in', 'Priya', 'Nair', 'Safety Officer', '9844056789', 'Quality & Safety Assurance', 'Hyderabad'),
            ('arun_procure', 'arun.kumar@contractcommand.gov.in', 'Arun', 'Kumar', 'Contracts Manager', '9833045678', 'Aviation Procurement', 'Pune'),
            ('sunita_qa', 'sunita.patel@contractcommand.gov.in', 'Sunita', 'Patel', 'Safety Officer', '9855067890', 'Naval Defense Inspection', 'Mumbai'),
        ]

        users = {}
        for username, email, fn, ln, desig, phone, dept, city in users_data:
            user, created = User.objects.get_or_create(username=username, defaults={
                'email': email,
                'first_name': fn,
                'last_name': ln,
                'is_staff': (desig == 'Administrator'),
                'is_superuser': (desig == 'Administrator'),
            })
            if created or not user.has_usable_password():
                user.set_password('HclTech@2024')
                user.save()

            group = Group.objects.get(name=desig)
            user.groups.add(group)

            UserProfile.objects.update_or_create(user=user, defaults={
                'designation': desig,
                'phone': phone,
                'department': dept,
                'city': city,
            })
            users[username] = user

        admin_u = users['admin_user']
        cm_u = users['rajesh_contracts']
        so_u = users['priya_safety']

        # 2. Vendors (12 Indian Defense Vendors)
        self.stdout.write('Seeding Vendors...')
        vendors_raw = [
            ('VND-001', 'Bharat Dynamics Defense Systems', 'Electronics', 'Amit Saxena', 'contact@bharatdynamics-sys.in', '9876543210', 'Plot 45, Phase II, Electronic City', 'Bengaluru', 'Karnataka', '560100', '29AABCB1234F1Z1', 'AABCB1234F', 'Active'),
            ('VND-002', 'Garuda Aerospace Engineering Ltd', 'Mechanical', 'Kavita Menon', 'sales@garuda-aero.in', '9876543211', 'Aerospace SEZ, Devanahalli', 'Bengaluru', 'Karnataka', '562110', '29AABCG5678K1Z3', 'AABCG5678K', 'Active'),
            ('VND-003', 'Hindustan Heavy Armor Works', 'Vehicles', 'Ranjit Singh', 'info@hindheavyarmor.in', '9876543212', 'Industrial Area, Pimpri-Chinchwad', 'Pune', 'Maharashtra', '411018', '27AABCH9012L1Z5', 'AABCH9012L', 'Active'),
            ('VND-004', 'Kaveri Tactical Radar Systems', 'Electronics', 'Suresh Iyer', 'support@kaveri-tactical.in', '9876543213', 'Gachibowli Tech Zone', 'Hyderabad', 'Telangana', '500032', '36AABCK3456M1Z7', 'AABCK3456M', 'Active'),
            ('VND-005', 'Brahmaputra Naval Components', 'Mechanical', 'Deepak Das', 'operations@brahmaputra-naval.in', '9876543214', 'Shipyard Road, Harbor Area', 'Visakhapatnam', 'Andhra Pradesh', '530001', '37AABCB7890N1Z9', 'AABCB7890N', 'Active'),
            ('VND-006', 'Vayu Precision Munitions Pvt Ltd', 'Ammunition', 'Manish Tiwari', 'tenders@vayu-munitions.in', '9876543215', 'MIDC Heavy Industry, Butibori', 'Nagpur', 'Maharashtra', '441122', '27AABCV1234P1Z2', 'AABCV1234P', 'Active'),
            ('VND-007', 'Trishul Defense Software Labs', 'IT Services', 'Pooja Reddy', 'solutions@trishul-defense.in', '9876543216', 'HITEC City, Phase 3', 'Hyderabad', 'Telangana', '500081', '36AABCT5678Q1Z4', 'AABCT5678Q', 'Active'),
            ('VND-008', 'Shakti Advanced Composites Ltd', 'Chemicals', 'Vivek Oberoi', 'contact@shakti-composites.in', '9876543217', 'Sanand Industrial Estate', 'Ahmedabad', 'Gujarat', '382170', '24AABCS9012R1Z6', 'AABCS9012R', 'Active'),
            ('VND-009', 'Himalayan High-Altitude Gears', 'Logistics', 'Tenzing Norbu', 'supply@himalayan-gears.in', '9876543218', 'Subathu Cantt Road', 'Solan', 'Himachal Pradesh', '173212', '02AABCH3456S1Z8', 'AABCH3456S', 'Active'),
            ('VND-010', 'Drona Tactical Surveillance Systems', 'Electronics', 'Ananya Deshmukh', 'orders@drona-tactical.in', '9876543219', 'Ambattur Industrial Estate', 'Chennai', 'Tamil Nadu', '600058', '33AABCD7890T1Z0', 'AABCD7890T', 'Active'),
            # Edge Case 3: Blacklisted vendor with past contracts
            ('VND-011', 'Falcon Secure Communications Ltd', 'IT Services', 'Ramesh Rao', 'info@falcon-secure.in', '9876543220', 'Sector 62, Institutional Area', 'Noida', 'Uttar Pradesh', '201309', '09AABCF1234U1Z2', 'AABCF1234U', 'Blacklisted'),
            ('VND-012', 'Chanakya Strategic Logistics LLP', 'Logistics', 'Sunil Mathur', 'dispatch@chanakya-logistics.in', '9876543221', 'Transport Nagar', 'Jaipur', 'Rajasthan', '302003', '08AABCJ5678V1Z4', 'AABCJ5678V', 'Pending'),
        ]

        vendors = {}
        for code, name, cat, cp, em, ph, addr, city, state, pin, gst, pan, st in vendors_raw:
            v, _ = Vendor.objects.update_or_create(vendor_code=code, defaults={
                'company_name': name, 'category': cat, 'contact_person': cp,
                'email': em, 'phone': ph, 'address': addr, 'city': city,
                'state': state, 'pincode': pin, 'gst_number': gst, 'pan_number': pan,
                'status': st, 'registered_by': cm_u
            })
            vendors[code] = v

        # 3. Vendor Evaluations (15 evaluations)
        self.stdout.write('Seeding Vendor Evaluations...')
        evals_data = [
            (vendors['VND-001'], date(2024, 2, 10), Decimal('9.5'), Decimal('9.0'), Decimal('8.5'), Decimal('9.5'), 'Selected', 'Exceptional thermal sensor reliability.'),
            (vendors['VND-002'], date(2024, 3, 15), Decimal('8.5'), Decimal('8.5'), Decimal('7.5'), Decimal('9.0'), 'Selected', 'Airframe tolerance meets MIL-SPEC standards.'),
            (vendors['VND-003'], date(2024, 4, 1),  Decimal('8.0'), Decimal('7.5'), Decimal('8.0'), Decimal('8.5'), 'Shortlisted', 'Good ballistic steel plating performance.'),
            (vendors['VND-004'], date(2024, 5, 20), Decimal('9.0'), Decimal('9.5'), Decimal('8.5'), Decimal('9.0'), 'Selected', 'Radar array delivered ahead of schedule.'),
            (vendors['VND-005'], date(2024, 6, 12), Decimal('7.5'), Decimal('7.0'), Decimal('7.5'), Decimal('8.0'), 'Shortlisted', 'Minor marine coating re-application needed.'),
            (vendors['VND-006'], date(2024, 7, 5),  Decimal('9.0'), Decimal('8.5'), Decimal('9.0'), Decimal('9.5'), 'Selected', 'Ammunition propellant test passed batch inspection.'),
            (vendors['VND-007'], date(2024, 8, 18), Decimal('9.5'), Decimal('9.0'), Decimal('8.0'), Decimal('9.0'), 'Selected', 'C4ISR firmware passed cybersecurity audit.'),
            (vendors['VND-008'], date(2024, 9, 22), Decimal('8.5'), Decimal('8.0'), Decimal('7.5'), Decimal('8.5'), 'Selected', 'Carbon fiber sheets test strength verified.'),
            (vendors['VND-009'], date(2024, 10, 15),Decimal('8.0'), Decimal('8.5'), Decimal('8.5'), Decimal('8.0'), 'Shortlisted', 'Extreme cold weather gear verified at -40C.'),
            (vendors['VND-010'], date(2024, 11, 2), Decimal('9.0'), Decimal('8.5'), Decimal('8.5'), Decimal('9.0'), 'Selected', 'Optronics pod ground trials successful.'),
            (vendors['VND-011'], date(2024, 1, 15), Decimal('3.5'), Decimal('2.0'), Decimal('4.0'), Decimal('2.5'), 'Rejected', 'Failed mandatory hardware Trojan security test.'),
            (vendors['VND-012'], date(2024, 11, 20),Decimal('6.5'), Decimal('6.0'), Decimal('7.0'), Decimal('6.5'), 'Shortlisted', 'Initial fleet evaluation in progress.'),
        ]

        for vnd, edate, q, d, p, c, rec, rm in evals_data:
            VendorEvaluation.objects.get_or_create(
                vendor=vnd, evaluation_date=edate,
                defaults={
                    'evaluated_by': so_u, 'quality_score': q,
                    'delivery_score': d, 'pricing_score': p,
                    'compliance_score': c, 'recommendation': rec, 'remarks': rm
                }
            )

        # 4. Contracts (11 Contracts)
        self.stdout.write('Seeding Contracts...')
        contracts_raw = [
            # Edge Case 5: 2024 to 2026 multi-year contract
            ('CC-2024-0001', 'Multi-Band Radar Tracking System Supply', 'Supply', 'Supply of 24 S-band radar units for air base surveillance.', vendors['VND-004'], Decimal('185000000.00'), date(2024, 1, 1), date(2026, 12, 31), 'Active'),
            ('CC-2024-0002', 'Fighter Jet Avionics Maintenance 2024-25', 'Maintenance', 'Annual comprehensive avionics maintenance for MiG and Su squadrons.', vendors['VND-002'], Decimal('78000000.00'), date(2024, 3, 1), date(2025, 2, 28), 'Active'),
            ('CC-2024-0003', 'Armored Personnel Carrier Hull Upgrades', 'Mechanical', 'Ballistic armor retrofitting for 80 infantry combat vehicles.', vendors['VND-003'], Decimal('142000000.00'), date(2024, 4, 15), date(2025, 10, 14), 'Active'),
            ('CC-2024-0004', 'Surface-to-Air Missile Guidance Actuators', 'Supply', 'Actuator sub-systems for medium-range defense missiles.', vendors['VND-001'], Decimal('210000000.00'), date(2024, 2, 1), date(2025, 7, 31), 'Active'),
            ('CC-2024-0005', 'High-Altitude Cold Weather Gear Logistics', 'Supply', 'Special winter clothing and mountaineering gear for Ladakh troops.', vendors['VND-009'], Decimal('45000000.00'), date(2024, 5, 1), date(2024, 11, 30), 'Completed'),
            # Edge Case 1: Expired contract with active invoices
            ('CC-2024-0006', 'Tactical Battlefield Management Software v1', 'Service', 'Battlefield integration software deployment for Western Command.', vendors['VND-007'], Decimal('62000000.00'), date(2024, 1, 15), date(2024, 9, 30), 'Expired'),
            ('CC-2024-0007', 'Artillery High-Explosive Shells Procurement', 'Supply', '155mm smart precision-guided artillery ammunition.', vendors['VND-006'], Decimal('320000000.00'), date(2024, 6, 1), date(2025, 12, 31), 'Active'),
            ('CC-2024-0008', 'Naval Destroyer Propeller Shaft Maintenance', 'Maintenance', 'Dry dock overhaul and ultrasonic testing of propeller shafts.', vendors['VND-005'], Decimal('54000000.00'), date(2024, 7, 10), date(2025, 1, 10), 'Active'),
            ('CC-2024-0009', 'Tactical UAV Electro-Optical Pod Supply', 'Supply', 'EO/IR sensor payloads for high-altitude endurance drones.', vendors['VND-010'], Decimal('95000000.00'), date(2024, 8, 1), date(2025, 8, 31), 'Active'),
            ('CC-2024-0010', 'Stealth Radar Absorbing Coatings', 'Research', 'Polymer composite research for low RCS naval vessels.', vendors['VND-008'], Decimal('38000000.00'), date(2024, 9, 1), date(2025, 8, 31), 'Draft'),
            # Contract linked to blacklisted vendor (historical record)
            ('CC-2024-0011', 'Legacy VHF Secure Radio Network', 'Supply', 'Pre-blacklisting contract terminated following security audit.', vendors['VND-011'], Decimal('28000000.00'), date(2024, 1, 1), date(2024, 4, 30), 'Terminated'),
        ]

        contracts = {}
        for num, title, ctype, desc, vnd, val, sdate, edate, st in contracts_raw:
            c, _ = Contract.objects.update_or_create(contract_number=num, defaults={
                'title': title, 'contract_type': ctype, 'description': desc,
                'vendor': vnd, 'value': val, 'start_date': sdate, 'end_date': edate,
                'status': st, 'created_by': cm_u
            })
            contracts[num] = c

        # Contract Documents (12 documents)
        for cnum, c in contracts.items():
            ContractDocument.objects.get_or_create(
                contract=c, title=f"Signed Contract Agreement - {cnum}",
                defaults={
                    'file_name': f"{cnum}_Agreement_Signed.pdf",
                    'file_path': f"/media/contracts/{cnum}/agreement.pdf",
                    'uploaded_by': cm_u
                }
            )

        # 5. Procurement Plans (10 Plans)
        self.stdout.write('Seeding Procurement Plans...')
        plans_raw = [
            ('PLAN-2024-01', 'Army Air Defense Modernization FY24', 'Upgradation of surface-to-air radar and tracking batteries.', '2024-2025', Decimal('500000000.00'), date(2024, 4, 1), date(2025, 3, 31), 'Active'),
            ('PLAN-2024-02', 'Air Force Fighter Fleet Avionics Overhaul', 'Avionics upgrade and electronic warfare suite installations.', '2024-2025', Decimal('400000000.00'), date(2024, 4, 1), date(2025, 3, 31), 'Active'),
            ('PLAN-2024-03', 'Naval Fleet Surface Ship Maintenance Plan', 'Refit and propulsion plant overhaul for guided missile destroyers.', '2024-2025', Decimal('350000000.00'), date(2024, 4, 1), date(2025, 3, 31), 'Active'),
            ('PLAN-2024-04', 'High-Altitude Cold Frontier Defense Preparedness', 'Procurement of extreme weather uniforms, tents, and snowmobiles.', '2024-2025', Decimal('150000000.00'), date(2024, 4, 1), date(2025, 3, 31), 'Approved'),
            ('PLAN-2024-05', 'Artillery Modernization & Munitions Reserves', 'Procurement of 155mm extended range shells and propellants.', '2024-2025', Decimal('600000000.00'), date(2024, 4, 1), date(2025, 3, 31), 'Active'),
            ('PLAN-2024-06', 'Joint Armed Forces Cyber & C4ISR Integration', 'Command and control military communication network upgrades.', '2024-2025', Decimal('250000000.00'), date(2024, 4, 1), date(2025, 3, 31), 'Active'),
            ('PLAN-2025-01', 'Border Surveillance Drone Fleet Expansion', 'Induction of tactical loitering munitions and surveillance drones.', '2025-2026', Decimal('450000000.00'), date(2025, 4, 1), date(2026, 3, 31), 'Draft'),
            ('PLAN-2025-02', 'Submarine Fleet Battery & Sensor Retrofitting', 'Sonar sensors and AIP technology integration.', '2025-2026', Decimal('700000000.00'), date(2025, 4, 1), date(2026, 3, 31), 'Draft'),
            ('PLAN-2023-01', 'Infantry Small Arms Modernization FY23', 'Assault rifle and sniper rifle acquisition project.', '2023-2024', Decimal('300000000.00'), date(2023, 4, 1), date(2024, 3, 31), 'Closed'),
            ('PLAN-2024-07', 'Defense Special Forces Tactical Gear Initiative', 'Modular ballistic helmets, plate carriers, and night vision goggles.', '2024-2025', Decimal('120000000.00'), date(2024, 5, 1), date(2025, 4, 30), 'Approved'),
        ]

        plans = {}
        for num, title, desc, fy, bgt, sdate, edate, st in plans_raw:
            p, _ = ProcurementPlan.objects.update_or_create(plan_number=num, defaults={
                'title': title, 'description': desc, 'fiscal_year': fy,
                'total_budget': bgt, 'start_date': sdate, 'end_date': edate,
                'status': st, 'created_by': cm_u
            })
            plans[num] = p

        # 6. Requisitions & Items (15 Requisitions, 50+ items)
        self.stdout.write('Seeding Requisitions and Line Items...')
        reqs_raw = [
            ('REQ-2024-001', plans['PLAN-2024-01'], 'Active Radar S-Band Transceiver Modules', 'High', 'Approved', date(2024, 7, 31)),
            ('REQ-2024-002', plans['PLAN-2024-02'], 'Multi-Function Cockpit Display Units', 'High', 'Approved', date(2024, 8, 15)),
            ('REQ-2024-003', plans['PLAN-2024-03'], 'High-Pressure Marine Hydraulic Pumps', 'Medium', 'Pending', date(2024, 9, 30)),
            ('REQ-2024-004', plans['PLAN-2024-04'], 'Glacier Parkas & Extreme Cold Boots', 'Urgent', 'Fulfilled', date(2024, 6, 30)),
            ('REQ-2024-005', plans['PLAN-2024-05'], '155mm HE Extended Range Projectiles', 'Urgent', 'Approved', date(2024, 10, 31)),
            ('REQ-2024-006', plans['PLAN-2024-06'], 'Military-Grade Fiber Optic Switches', 'Medium', 'Approved', date(2024, 11, 15)),
            ('REQ-2024-007', plans['PLAN-2024-07'], 'Gen-3 Night Vision Goggles with Head Mounts', 'High', 'Pending', date(2024, 12, 1)),
            ('REQ-2024-008', plans['PLAN-2024-01'], 'Radar Calibration Test Benches', 'Low', 'Approved', date(2024, 10, 15)),
            ('REQ-2024-009', plans['PLAN-2024-02'], 'Fly-by-Wire Backup Actuator Channels', 'High', 'Pending', date(2024, 12, 31)),
            ('REQ-2024-010', plans['PLAN-2024-03'], 'Gas Turbine Auxiliary Cooling Units', 'Medium', 'Pending', date(2025, 1, 31)),
            # Edge Case 2: Urgent requisition with high allocation
            ('REQ-2024-011', plans['PLAN-2024-04'], 'Emergency High-Altitude Oxygen Consoles', 'Urgent', 'Approved', date(2024, 8, 1)),
            ('REQ-2024-012', plans['PLAN-2024-05'], 'Artillery Gun Barrel Thermal Sleeves', 'Medium', 'Approved', date(2024, 11, 30)),
        ]

        item_names = [
            ('Radar Processing Unit Core', 'Unit', Decimal('850000.00')),
            ('Frequency Synthesizer Board', 'Piece', Decimal('320000.00')),
            ('Duplexer Assembly Unit', 'Set', Decimal('450000.00')),
            ('Calibration Cable Harness Kit', 'Set', Decimal('75000.00')),
            ('Shielded Waveguide Tube Section', 'Metre', Decimal('22000.00')),
        ]

        for rnum, plan, title, priority, st, rdate in reqs_raw:
            req, _ = Requisition.objects.update_or_create(requisition_number=rnum, defaults={
                'plan': plan, 'title': title, 'priority': priority,
                'status': st, 'required_by_date': rdate,
                'requested_by': cm_u, 'approved_by': (cm_u if st in ['Approved', 'Fulfilled'] else None)
            })

            # 4 items per requisition = 48 items
            for idx, (iname, u, uprice) in enumerate(item_names[:4]):
                RequisitionItem.objects.get_or_create(
                    requisition=req, item_name=f"{iname} - Type-{idx+1}",
                    defaults={
                        'description': f"Mil-Std {iname} spec item {idx+1}",
                        'quantity': Decimal(f"{idx + 2}.00"),
                        'unit': u,
                        'unit_price': uprice,
                    }
                )

        # 7. Invoices & Invoice Items (12 Invoices, 50+ items)
        self.stdout.write('Seeding Invoices and Invoice Items...')
        invoices_raw = [
            ('INV-2024-00001', contracts['CC-2024-0001'], vendors['VND-004'], date(2024, 3, 15), date(2024, 4, 15), 'Paid'),
            ('INV-2024-00002', contracts['CC-2024-0001'], vendors['VND-004'], date(2024, 6, 20), date(2024, 7, 20), 'Paid'),
            ('INV-2024-00003', contracts['CC-2024-0002'], vendors['VND-002'], date(2024, 5, 10), date(2024, 6, 10), 'Paid'),
            ('INV-2024-00004', contracts['CC-2024-0003'], vendors['VND-003'], date(2024, 7, 1),  date(2024, 8, 1),  'Submitted'),
            ('INV-2024-00005', contracts['CC-2024-0004'], vendors['VND-001'], date(2024, 4, 25), date(2024, 5, 25), 'Paid'),
            ('INV-2024-00006', contracts['CC-2024-0005'], vendors['VND-009'], date(2024, 8, 5),  date(2024, 9, 5),  'Paid'),
            # Edge Case 1: Active invoice against Expired contract CC-2024-0006
            ('INV-2024-00007', contracts['CC-2024-0006'], vendors['VND-007'], date(2024, 9, 20), date(2024, 10, 20), 'Approved'),
            ('INV-2024-00008', contracts['CC-2024-0007'], vendors['VND-006'], date(2024, 9, 15), date(2024, 10, 15), 'Submitted'),
            ('INV-2024-00009', contracts['CC-2024-0008'], vendors['VND-005'], date(2024, 10, 1), date(2024, 11, 1),  'Submitted'),
            ('INV-2024-00010', contracts['CC-2024-0009'], vendors['VND-010'], date(2024, 10, 25),date(2024, 11, 25), 'Draft'),
            # Edge Case 4: Invoice with multiple payments
            ('INV-2024-00011', contracts['CC-2024-0004'], vendors['VND-001'], date(2024, 6, 1),  date(2024, 7, 1),   'Paid'),
            ('INV-2024-00012', contracts['CC-2024-0002'], vendors['VND-002'], date(2024, 8, 1),  date(2024, 9, 1),   'Overdue'),
        ]

        inv_items_data = [
            ('Initial Deliverables Stage-1', Decimal('1.00'), Decimal('12500000.00')),
            ('Factory Acceptance Testing Milestone', Decimal('1.00'), Decimal('8200000.00')),
            ('Component Integration & Calibration', Decimal('2.00'), Decimal('4500000.00')),
            ('Quality Compliance Certification Fee', Decimal('1.00'), Decimal('1800000.00')),
        ]

        invoices = {}
        for inum, contract, vendor, idate, ddate, st in invoices_raw:
            inv, _ = Invoice.objects.update_or_create(invoice_number=inum, defaults={
                'contract': contract, 'vendor': vendor, 'invoice_date': idate,
                'due_date': ddate, 'status': st, 'tax_percent': Decimal('18.00'),
                'created_by': cm_u
            })

            # Create items for this invoice
            for desc, qty, uprice in inv_items_data:
                InvoiceItem.objects.get_or_create(
                    invoice=inv, description=desc,
                    defaults={'quantity': qty, 'unit_price': uprice}
                )
            invoices[inum] = inv

        # 8. Payments (20 Payments)
        self.stdout.write('Seeding Payments...')
        payments_raw = [
            (invoices['INV-2024-00001'], 'PAY-RTGS-2024-001', date(2024, 4, 10), Decimal('37170000.00'), 'RTGS', 'Completed', 'Processed via Reserve Bank RTGS gateway.'),
            (invoices['INV-2024-00002'], 'PAY-RTGS-2024-002', date(2024, 7, 18), Decimal('37170000.00'), 'RTGS', 'Completed', 'Quarterly milestone payment released.'),
            (invoices['INV-2024-00003'], 'PAY-NEFT-2024-001', date(2024, 6, 5),  Decimal('37170000.00'), 'NEFT', 'Completed', 'Su-30 MKI fleet avionics service cleared.'),
            (invoices['INV-2024-00005'], 'PAY-RTGS-2024-003', date(2024, 5, 20), Decimal('37170000.00'), 'RTGS', 'Completed', 'Missile actuator phase-1 disbursement.'),
            (invoices['INV-2024-00006'], 'PAY-NEFT-2024-002', date(2024, 9, 2),  Decimal('37170000.00'), 'NEFT', 'Completed', 'Ladakh winter apparel shipment verified.'),
            # Edge Case 4: Multiple partial payments totaling full invoice amount
            (invoices['INV-2024-00011'], 'PAY-RTGS-2024-004A', date(2024, 6, 15), Decimal('20000000.00'), 'RTGS', 'Completed', 'Partial tranche 1 payment.'),
            (invoices['INV-2024-00011'], 'PAY-RTGS-2024-004B', date(2024, 6, 28), Decimal('17170000.00'), 'RTGS', 'Completed', 'Final tranche 2 payment completing invoice.'),
            (invoices['INV-2024-00004'], 'PAY-RTGS-2024-005',  date(2024, 8, 2),  Decimal('15000000.00'), 'RTGS', 'Processing', 'Awaiting Controller of Defense Accounts audit.'),
        ]

        for inv, pref, pdate, amt, method, st, rm in payments_raw:
            Payment.objects.get_or_create(payment_reference=pref, defaults={
                'invoice': inv, 'payment_date': pdate, 'amount': amt,
                'payment_method': method, 'status': st, 'remarks': rm,
                'processed_by': cm_u
            })

        self.stdout.write(self.style.SUCCESS('Successfully seeded all ContractCommand sample data!'))
