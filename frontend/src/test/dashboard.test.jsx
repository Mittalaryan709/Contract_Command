import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import DashboardPage from '../pages/dashboard/DashboardPage.jsx'

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Doughnut: (props) => <div data-testid="doughnut-chart">{props.data?.labels?.join(', ')}</div>,
  Bar: (props) => <div data-testid="bar-chart">{props.data?.labels?.join(', ')}</div>,
  Line: (props) => <div data-testid="line-chart">{props.data?.labels?.join(', ')}</div>,
}))

// Mock dashboardApi
vi.mock('../api/dashboardApi.js', () => ({
  getDashboardStats: vi.fn(),
  getRecentContracts: vi.fn(),
  getRecentRequisitions: vi.fn(),
  getRecentPayments: vi.fn(),
  getContractStatusDistribution: vi.fn(),
  getInvoiceStatusDistribution: vi.fn(),
  getRequisitionPriorityDistribution: vi.fn(),
  getPaymentMethodDistribution: vi.fn(),
}))

import {
  getDashboardStats,
  getRecentContracts,
  getRecentRequisitions,
  getRecentPayments,
  getContractStatusDistribution,
  getInvoiceStatusDistribution,
  getRequisitionPriorityDistribution,
  getPaymentMethodDistribution,
} from '../api/dashboardApi.js'

describe('Phase 8 — Dashboard Analytics & Strategic Command Suite', () => {
  const mockStats = {
    totalContracts: 15,
    activeContracts: 8,
    draftContracts: 3,
    totalPlans: 4,
    pendingRequisitions: 5,
    totalVendors: 12,
    pendingInvoices: 2,
    completedPayments: 9,
  }

  const mockRecentContracts = [
    {
      id: 101,
      contract_number: 'CC-2026-0001',
      title: 'Avionics Tactical Radar System',
      value: 15000000,
      status: 'Active',
    },
    {
      id: 102,
      contract_number: 'CC-2026-0002',
      title: 'Tactical Drone Communication Suite',
      value: 8500000,
      status: 'Draft',
    },
  ]

  const mockRecentRequisitions = [
    {
      id: 201,
      requisition_number: 'REQ-2026-00001',
      title: 'Advanced Sonar Transducer Arrays',
      priority: 'Urgent',
      status: 'Pending',
    },
    {
      id: 202,
      requisition_number: 'REQ-2026-00002',
      title: 'Secure Tactical VHF Transceivers',
      priority: 'High',
      status: 'Approved',
    },
  ]

  const mockRecentPayments = [
    {
      id: 501,
      invoice: 1,
      invoice_number: 'INV-2026-00001',
      payment_reference: 'RTGS-2026-992014',
      payment_date: '2026-02-15',
      amount: 1180000,
      payment_method: 'RTGS',
      status: 'Completed',
    },
  ]

  const mockContractDist = {
    Draft: 3,
    Active: 8,
    Expired: 1,
    Terminated: 1,
    Completed: 2,
  }

  const mockInvoiceDist = {
    Draft: 1,
    Submitted: 2,
    Approved: 3,
    Paid: 6,
    Overdue: 0,
  }

  const mockReqPriorityDist = {
    Urgent: 2,
    High: 3,
    Medium: 4,
    Low: 1,
  }

  const mockPaymentMethodDist = {
    RTGS: 6,
    NEFT: 2,
    IMPS: 1,
    Cheque: 0,
    DD: 0,
  }

  const mockAuthContextValue = {
    user: { id: 1, username: 'admin', role: 'Administrator', first_name: 'Vikram', get_full_name: 'Col. Vikram Batra' },
    token: 'fake-jwt-token',
    role: 'Administrator',
    isAuthenticated: true,
    canWrite: () => true,
    canDelete: () => true,
  }

  const renderDashboard = () => {
    return render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      </AuthContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    getDashboardStats.mockResolvedValue(mockStats)
    getRecentContracts.mockResolvedValue({ data: { results: mockRecentContracts } })
    getRecentRequisitions.mockResolvedValue({ data: { results: mockRecentRequisitions } })
    getRecentPayments.mockResolvedValue({ data: { results: mockRecentPayments } })
    getContractStatusDistribution.mockResolvedValue(mockContractDist)
    getInvoiceStatusDistribution.mockResolvedValue(mockInvoiceDist)
    getRequisitionPriorityDistribution.mockResolvedValue(mockReqPriorityDist)
    getPaymentMethodDistribution.mockResolvedValue(mockPaymentMethodDist)
  })

  // Test 1: Header and Security Classification
  it('renders strategic command header, greeting, and security classification banner', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/Strategic Command & Intelligence Overview/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/SECURITY CLASSIFICATION: RESTRICTED/i)).toBeInTheDocument()
    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument()
    expect(screen.getByText('Vikram')).toBeInTheDocument()
    expect(screen.getByText(/Administrator/i)).toBeInTheDocument()
  })

  // Test 2: Executive KPI Cards
  it('renders all 8 tactical and executive KPI metric cards with counts', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/Active Contracts/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Pending Requisitions/i)).toBeInTheDocument()
    expect(screen.getByText(/Vetted Suppliers/i)).toBeInTheDocument()
    expect(screen.getByText(/Settled Disbursements/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Contracts/i)).toBeInTheDocument()
    expect(screen.getByText(/Master Plans/i)).toBeInTheDocument()
    expect(screen.getByText(/Invoices in Scrutiny/i)).toBeInTheDocument()
    expect(screen.getByText(/Draft Contracts/i)).toBeInTheDocument()

    // Values verification
    expect(screen.getByText('8')).toBeInTheDocument() // Active contracts
    expect(screen.getByText('12')).toBeInTheDocument() // Vetted suppliers
    expect(screen.getByText('15')).toBeInTheDocument() // Total contracts
    expect(screen.getByText('4')).toBeInTheDocument() // Master plans
  })

  // Test 3: Visual Analytics Cards
  it('renders 3 visual analytics chart sections for contracts, banking modes, and urgency', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/Contract Lifecycle Status/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Disbursement Banking Modes/i)).toBeInTheDocument()
    expect(screen.getByText(/Requisition Urgency Index/i)).toBeInTheDocument()
  })

  // Test 4: Operational Activity Streams
  it('renders recent contracts, requisitions, and disbursements tables with links', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('CC-2026-0001')).toBeInTheDocument()
    })

    // Recent Contracts verification
    expect(screen.getByText('CC-2026-0002')).toBeInTheDocument()
    expect(screen.getByText('Avionics Tactical Radar System')).toBeInTheDocument()

    // Recent Requisitions verification
    expect(screen.getByText('REQ-2026-00001')).toBeInTheDocument()
    expect(screen.getByText('REQ-2026-00002')).toBeInTheDocument()
    expect(screen.getByText('Advanced Sonar Transducer Arrays')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()

    // Recent Disbursements verification
    expect(screen.getByText('RTGS-2026-992014')).toBeInTheDocument()
    expect(screen.getByText('INV-2026-00001')).toBeInTheDocument()
  })

  // Test 5: Quick Actions and Refresh Feed
  it('renders quick action buttons for authorized officers and allows refreshing analytics', async () => {
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Register Contract')).toBeInTheDocument()
    })

    expect(screen.getByText('New Requisition')).toBeInTheDocument()
    expect(screen.getByText('Invoice')).toBeInTheDocument()
    expect(screen.getByText('Disbursement')).toBeInTheDocument()

    // Test Refresh Button
    const refreshBtn = screen.getByRole('button', { name: /Refresh Feed/i })
    expect(refreshBtn).toBeInTheDocument()

    fireEvent.click(refreshBtn)

    await waitFor(() => {
      // getDashboardStats should be called twice (initial load + refresh)
      expect(getDashboardStats).toHaveBeenCalledTimes(2)
    })
  })
})
