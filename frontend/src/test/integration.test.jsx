import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import RoleGuard from '../routes/RoleGuard.jsx'
import VendorComparePage from '../pages/vendors/VendorComparePage.jsx'
import UnauthorizedPage from '../pages/errors/UnauthorizedPage.jsx'
import NotFoundPage from '../pages/errors/NotFoundPage.jsx'

// Mock vendorApi
vi.mock('../api/vendorApi.js', () => ({
  getVendors: vi.fn(),
}))

import { getVendors } from '../api/vendorApi.js'

describe('Phase 9 — End-to-End System Integration & Role Security Suite', () => {
  const mockVendors = [
    {
      id: 1,
      vendor_code: 'VND-0001',
      company_name: 'Bharat Electronics Ltd',
      category: 'Electronics',
      status: 'Active',
      average_score: 8.8,
      contracts_count: 5,
      city: 'Bengaluru',
      state: 'Karnataka',
      gst_number: '29AACCB1234N1Z5',
      evaluations: [
        {
          quality_score: '9.0',
          delivery_score: '8.5',
          pricing_score: '8.5',
          compliance_score: '9.2',
        },
      ],
    },
    {
      id: 2,
      vendor_code: 'VND-0002',
      company_name: 'Hindustan Aeronautics Ltd',
      category: 'Mechanical',
      status: 'Active',
      average_score: 9.2,
      contracts_count: 8,
      city: 'Bengaluru',
      state: 'Karnataka',
      gst_number: '29HALCB1234N1Z8',
      evaluations: [
        {
          quality_score: '9.5',
          delivery_score: '9.0',
          pricing_score: '9.0',
          compliance_score: '9.3',
        },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    getVendors.mockResolvedValue({ data: { results: mockVendors, count: 2 } })
  })

  // Test 1: RoleGuard allows authorized roles
  it('RoleGuard permits access to allowed roles (Administrator & Contracts Manager)', () => {
    const mockAuthContext = {
      user: { id: 1, username: 'officer', role: 'Contracts Manager', groups: ['Contracts Manager'] },
      isAuthenticated: true,
      loading: false,
    }

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<RoleGuard allowedRoles={['Administrator', 'Contracts Manager']} />}>
              <Route path="/protected" element={<div>Privileged Management Area</div>} />
            </Route>
            <Route path="/unauthorized" element={<div>Access Denied</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByText('Privileged Management Area')).toBeInTheDocument()
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument()
  })

  // Test 2: RoleGuard blocks unauthorized roles (Safety Officer)
  it('RoleGuard redirects Safety Officer from write-protected routes to /unauthorized', () => {
    const mockSafetyAuth = {
      user: { id: 3, username: 'safety_auditor', role: 'Safety Officer', groups: ['Safety Officer'] },
      isAuthenticated: true,
      loading: false,
    }

    render(
      <AuthContext.Provider value={mockSafetyAuth}>
        <MemoryRouter initialEntries={['/privileged']}>
          <Routes>
            <Route element={<RoleGuard allowedRoles={['Administrator', 'Contracts Manager']} />}>
              <Route path="/privileged" element={<div>Restricted Admin Portal</div>} />
            </Route>
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    expect(screen.queryByText('Restricted Admin Portal')).not.toBeInTheDocument()
    expect(screen.getByText(/403/i)).toBeInTheDocument()
    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument()
  })

  // Test 3: Vendor Comparison Page
  it('renders vendor comparison matrix with side-by-side 4-pillar scores', async () => {
    render(
      <MemoryRouter initialEntries={['/app/vendors/compare']}>
        <VendorComparePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Supplier Comparison & 4-Pillar Evaluation Matrix/i)).toBeInTheDocument()
    })

    // Both companies compared
    expect(screen.getByText('Bharat Electronics Ltd')).toBeInTheDocument()
    expect(screen.getByText('Hindustan Aeronautics Ltd')).toBeInTheDocument()

    // 4-Pillar rows
    expect(screen.getByText(/Pillar 1: Quality & Reliability/i)).toBeInTheDocument()
    expect(screen.getByText(/Pillar 2: Delivery & Timeliness/i)).toBeInTheDocument()
    expect(screen.getByText(/Pillar 3: Pricing & Commercial/i)).toBeInTheDocument()
    expect(screen.getByText(/Pillar 4: Statutory & Security Compliance/i)).toBeInTheDocument()
  })

  // Test 4: NotFound Page handles non-existent routes
  it('renders custom 404 page for unmatched routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown/route/path']}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/404/i)).toBeInTheDocument()
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    expect(screen.getByText(/To Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Public Portal/i)).toBeInTheDocument()
  })
})
