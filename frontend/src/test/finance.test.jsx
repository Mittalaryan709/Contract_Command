import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import InvoiceListPage from '../pages/finance/InvoiceListPage.jsx'
import InvoiceCreatePage from '../pages/finance/InvoiceCreatePage.jsx'
import InvoiceDetailPage from '../pages/finance/InvoiceDetailPage.jsx'
import PaymentListPage from '../pages/finance/PaymentListPage.jsx'
import PaymentCreatePage from '../pages/finance/PaymentCreatePage.jsx'

// Mock financeApi
vi.mock('../api/financeApi.js', () => ({
  getInvoices: vi.fn(),
  getInvoice: vi.fn(),
  createInvoice: vi.fn(),
  updateInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
  getInvoiceItems: vi.fn(),
  createInvoiceItem: vi.fn(),
  deleteInvoiceItem: vi.fn(),
  getPayments: vi.fn(),
  getPayment: vi.fn(),
  createPayment: vi.fn(),
  updatePayment: vi.fn(),
}))

// Mock contractApi
vi.mock('../api/contractApi.js', () => ({
  getContracts: vi.fn(),
  getContract: vi.fn(),
}))

// Mock vendorApi
vi.mock('../api/vendorApi.js', () => ({
  getVendors: vi.fn(),
}))

import {
  getInvoices,
  getInvoice,
  createInvoice,
  createInvoiceItem,
  getPayments,
  createPayment,
} from '../api/financeApi.js'
import { getContracts } from '../api/contractApi.js'
import { getVendors } from '../api/vendorApi.js'

describe('Phase 7 — Finance, Invoicing & Payment Processing Suite', () => {
  const mockContracts = [
    { id: 101, contract_number: 'CC-2026-0001', title: 'Avionics Upgrade System', vendor: 1 },
    { id: 102, contract_number: 'CC-2026-0002', title: 'Tactical Radio Hardware', vendor: 2 },
  ]

  const mockVendors = [
    { id: 1, company_name: 'Bharat Electronics Ltd', vendor_code: 'VND-0001' },
    { id: 2, company_name: 'Hindustan Aeronautics Ltd', vendor_code: 'VND-0002' },
  ]

  const mockInvoices = [
    {
      id: 1,
      invoice_number: 'INV-2026-00001',
      contract: 101,
      contract_number: 'CC-2026-0001',
      vendor: 1,
      vendor_name: 'Bharat Electronics Ltd',
      invoice_date: '2026-02-01',
      due_date: '2026-03-01',
      status: 'Submitted',
      subtotal: '1000000.00',
      tax_percent: '18.00',
      tax_amount: '180000.00',
      total_amount: '1180000.00',
      paid_amount: 1180000,
      balance_amount: 0,
      notes: 'Initial avionics delivery milestone clearance.',
      created_by_name: 'Col. Rajesh Verma',
      items: [
        {
          id: 10,
          invoice: 1,
          description: 'Radar processing core modules',
          quantity: '2.00',
          unit_price: '500000.00',
          line_total: '1000000.00',
        },
      ],
      payments: [
        {
          id: 501,
          invoice: 1,
          payment_reference: 'RTGS-2026-881923',
          payment_date: '2026-02-10',
          amount: '1180000.00',
          payment_method: 'RTGS',
          status: 'Completed',
          remarks: 'RBI-UTR-908124098124',
        },
      ],
    },
    {
      id: 2,
      invoice_number: 'INV-2026-00002',
      contract: 102,
      contract_number: 'CC-2026-0002',
      vendor: 2,
      vendor_name: 'Hindustan Aeronautics Ltd',
      invoice_date: '2026-02-15',
      due_date: '2026-03-15',
      status: 'Approved',
      subtotal: '500000.00',
      tax_percent: '18.00',
      tax_amount: '90000.00',
      total_amount: '590000.00',
      paid_amount: 0,
      balance_amount: 590000,
      notes: 'Tactical comms prototyping batch.',
      created_by_name: 'Maj. Vikram Batra',
      items: [],
      payments: [],
    },
  ]

  const mockPayments = [
    {
      id: 501,
      invoice: 1,
      invoice_number: 'INV-2026-00001',
      payment_reference: 'RTGS-2026-881923',
      payment_date: '2026-02-10',
      amount: '1180000.00',
      payment_method: 'RTGS',
      status: 'Completed',
      remarks: 'RBI-UTR-908124098124',
      processed_by_name: 'Finance Officer Sharma',
    },
    {
      id: 502,
      invoice: 2,
      invoice_number: 'INV-2026-00002',
      payment_reference: 'NEFT-2026-112344',
      payment_date: '2026-02-18',
      amount: '200000.00',
      payment_method: 'NEFT',
      status: 'Processing',
      remarks: 'Inter-bank verification pending',
      processed_by_name: 'Treasury Officer Rao',
    },
  ]

  const mockAuthContextValue = {
    user: { id: 1, username: 'admin', role: 'Administrator', get_full_name: 'System Admin' },
    token: 'fake-jwt-token',
    role: 'Administrator',
    isAuthenticated: true,
    canWrite: () => true,
    canDelete: () => true,
  }

  const renderWithProviders = (ui, initialEntries = ['/']) => {
    return render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter initialEntries={initialEntries}>
          {ui}
        </MemoryRouter>
      </AuthContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    getVendors.mockResolvedValue({ data: { results: mockVendors, count: 2 } })
    getContracts.mockResolvedValue({ data: { results: mockContracts, count: 2 } })
    getInvoices.mockResolvedValue({ data: { results: mockInvoices, count: 2 } })
    getPayments.mockResolvedValue({ data: { results: mockPayments, count: 2 } })
    getInvoice.mockImplementation((id) => {
      const match = mockInvoices.find(i => String(i.id) === String(id))
      return Promise.resolve({ data: match || mockInvoices[0] })
    })
  })

  // Test 1: Invoice List Page Rendering
  it('renders invoice ledger with metrics banner and invoice rows', async () => {
    renderWithProviders(<InvoiceListPage />)

    expect(screen.getByText(/Defence Invoices & GST Disbursements/i)).toBeInTheDocument()
    expect(screen.getByText(/MODULE 4A/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('INV-2026-00001')).toBeInTheDocument()
      expect(screen.getByText('INV-2026-00002')).toBeInTheDocument()
    })

    // Check vendor and contract link rendering
    expect(screen.getAllByText('Bharat Electronics Ltd')[0]).toBeInTheDocument()
    expect(screen.getByText(/CC-2026-0001/)).toBeInTheDocument()
    expect(screen.getByText(/CC-2026-0002/)).toBeInTheDocument()

    // Metrics verification
    expect(screen.getByText(/Total Invoiced/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Disbursed/i)).toBeInTheDocument()
    expect(screen.getByText(/Outstanding Balance/i)).toBeInTheDocument()
  })

  // Test 2: Invoice Creation & Dynamic GST Calculation
  it('renders invoice creation form with dynamic line item calculations and submits successfully', async () => {
    createInvoice.mockResolvedValue({ data: { id: 3, invoice_number: 'INV-2026-00003' } })
    createInvoiceItem.mockResolvedValue({ data: { id: 21 } })

    renderWithProviders(<InvoiceCreatePage />)

    expect(screen.getByText(/Create Defence Invoice/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByLabelText(/Associated Defence Contract/i)).toBeInTheDocument()
    })

    // Verify default GST percentage is 18
    const gstInput = screen.getByLabelText(/GST Rate/i)
    expect(gstInput.value).toBe('18')

    // Fill invoice fields
    fireEvent.change(screen.getByLabelText(/Associated Defence Contract/i), { target: { value: '101' } })
    fireEvent.change(screen.getByLabelText(/Contractor \/ Defence Supplier/i), { target: { value: '1' } })

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Generate Defence Invoice/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(createInvoice).toHaveBeenCalledTimes(1)
      expect(createInvoiceItem).toHaveBeenCalledTimes(1)
    })
  })

  // Test 3: Invoice Detail Page
  it('renders invoice details, line items breakdown, and payment history', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/app/finance/invoices/:id" element={<InvoiceDetailPage />} />
      </Routes>,
      ['/app/finance/invoices/1']
    )

    await waitFor(() => {
      expect(screen.getByText(/Invoice INV-2026-00001/i)).toBeInTheDocument()
    })

    // Line item details
    expect(screen.getByText('Radar processing core modules')).toBeInTheDocument()
    expect(screen.getAllByText(/Subtotal/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Total Amount Payable:/i)).toBeInTheDocument()

    // Payments ledger table
    expect(screen.getByText('RTGS-2026-881923')).toBeInTheDocument()
    expect(screen.getByText('RBI-UTR-908124098124')).toBeInTheDocument()

    // Fully settled state indicator
    expect(screen.getByText(/Invoice fully settled/i)).toBeInTheDocument()
  })

  // Test 4: Payment Disbursements List
  it('renders payments ledger with statistics, filters, and transaction rows', async () => {
    renderWithProviders(<PaymentListPage />)

    expect(screen.getByText(/Payment Disbursements Ledger/i)).toBeInTheDocument()
    expect(screen.getByText(/MODULE 4B/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('RTGS-2026-881923')).toBeInTheDocument()
      expect(screen.getByText('NEFT-2026-112344')).toBeInTheDocument()
    })

    expect(screen.getByText('INV-2026-00001')).toBeInTheDocument()
    expect(screen.getByText('INV-2026-00002')).toBeInTheDocument()
    expect(screen.getByText('Finance Officer Sharma')).toBeInTheDocument()
  })

  // Test 5: Payment Recording Page
  it('renders payment creation page, pre-populates target invoice, and creates payment disbursement', async () => {
    createPayment.mockResolvedValue({ data: { id: 601, payment_reference: 'RTGS-2026-999000' } })

    renderWithProviders(
      <Routes>
        <Route path="/app/finance/payments/new" element={<PaymentCreatePage />} />
      </Routes>,
      ['/app/finance/payments/new?invoice=2']
    )

    expect(screen.getByText(/Record Payment Disbursement/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByLabelText(/Target Defence Invoice/i)).toBeInTheDocument()
    })

    // Verify invoice balance check card shows up
    expect(screen.getByText(/Invoice Balance Check/i)).toBeInTheDocument()

    // Submit payment
    const submitBtn = screen.getByRole('button', { name: /Record Bank Transfer/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })
  })
})
