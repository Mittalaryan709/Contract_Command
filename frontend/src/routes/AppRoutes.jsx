import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import RoleGuard from './RoleGuard.jsx'

// Public pages
import LandingPage from '../pages/public/LandingPage.jsx'
import AboutPage from '../pages/public/AboutPage.jsx'
import ModulesPage from '../pages/public/ModulesPage.jsx'
import AnnouncementsPage from '../pages/public/AnnouncementsPage.jsx'
import ContactPage from '../pages/public/ContactPage.jsx'

// Auth
import LoginPage from '../pages/auth/LoginPage.jsx'

// Dashboard
import DashboardPage from '../pages/dashboard/DashboardPage.jsx'

// Contracts
import ContractListPage from '../pages/contracts/ContractListPage.jsx'
import ContractCreatePage from '../pages/contracts/ContractCreatePage.jsx'
import ContractDetailPage from '../pages/contracts/ContractDetailPage.jsx'
import ContractEditPage from '../pages/contracts/ContractEditPage.jsx'

// Procurement
import PlanListPage from '../pages/procurement/PlanListPage.jsx'
import PlanCreatePage from '../pages/procurement/PlanCreatePage.jsx'
import PlanDetailPage from '../pages/procurement/PlanDetailPage.jsx'
import PlanEditPage from '../pages/procurement/PlanEditPage.jsx'
import RequisitionListPage from '../pages/procurement/RequisitionListPage.jsx'
import RequisitionCreatePage from '../pages/procurement/RequisitionCreatePage.jsx'
import RequisitionDetailPage from '../pages/procurement/RequisitionDetailPage.jsx'

// Vendors
import VendorListPage from '../pages/vendors/VendorListPage.jsx'
import VendorCreatePage from '../pages/vendors/VendorCreatePage.jsx'
import VendorDetailPage from '../pages/vendors/VendorDetailPage.jsx'
import VendorEditPage from '../pages/vendors/VendorEditPage.jsx'
import VendorEvaluationPage from '../pages/vendors/VendorEvaluationPage.jsx'

// Finance
import InvoiceListPage from '../pages/finance/InvoiceListPage.jsx'
import InvoiceCreatePage from '../pages/finance/InvoiceCreatePage.jsx'
import InvoiceDetailPage from '../pages/finance/InvoiceDetailPage.jsx'
import PaymentListPage from '../pages/finance/PaymentListPage.jsx'
import PaymentCreatePage from '../pages/finance/PaymentCreatePage.jsx'

// Profile
import ProfilePage from '../pages/auth/ProfilePage.jsx'

// Errors
import NotFoundPage from '../pages/errors/NotFoundPage.jsx'
import UnauthorizedPage from '../pages/errors/UnauthorizedPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected app */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/contracts" element={<ContractListPage />} />
          <Route path="/app/contracts/:id" element={<ContractDetailPage />} />
          <Route path="/app/procurement/plans" element={<PlanListPage />} />
          <Route path="/app/procurement/plans/:id" element={<PlanDetailPage />} />
          <Route path="/app/procurement/requisitions" element={<RequisitionListPage />} />
          <Route path="/app/procurement/requisitions/:id" element={<RequisitionDetailPage />} />
          <Route path="/app/vendors" element={<VendorListPage />} />
          <Route path="/app/vendors/:id" element={<VendorDetailPage />} />
          <Route path="/app/finance/invoices" element={<InvoiceListPage />} />
          <Route path="/app/finance/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/app/finance/payments" element={<PaymentListPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />

          {/* Write / Privileged Management Routes */}
          <Route element={<RoleGuard allowedRoles={['Administrator', 'Contracts Manager']} />}>
            <Route path="/app/contracts/new" element={<ContractCreatePage />} />
            <Route path="/app/contracts/:id/edit" element={<ContractEditPage />} />
            <Route path="/app/procurement/plans/new" element={<PlanCreatePage />} />
            <Route path="/app/procurement/plans/:id/edit" element={<PlanEditPage />} />
            <Route path="/app/procurement/requisitions/new" element={<RequisitionCreatePage />} />
            <Route path="/app/vendors/new" element={<VendorCreatePage />} />
            <Route path="/app/vendors/:id/edit" element={<VendorEditPage />} />
            <Route path="/app/vendors/:id/evaluate" element={<VendorEvaluationPage />} />
            <Route path="/app/finance/invoices/new" element={<InvoiceCreatePage />} />
            <Route path="/app/finance/payments/new" element={<PaymentCreatePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
