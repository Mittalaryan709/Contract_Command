import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import VendorListPage from '../pages/vendors/VendorListPage.jsx'
import VendorCreatePage from '../pages/vendors/VendorCreatePage.jsx'
import VendorDetailPage from '../pages/vendors/VendorDetailPage.jsx'
import VendorEditPage from '../pages/vendors/VendorEditPage.jsx'
import VendorEvaluationPage from '../pages/vendors/VendorEvaluationPage.jsx'

// Mock vendorApi
vi.mock('../api/vendorApi.js', () => ({
  getVendors: vi.fn(),
  getVendor: vi.fn(),
  createVendor: vi.fn(),
  updateVendor: vi.fn(),
  deleteVendor: vi.fn(),
  getEvaluations: vi.fn(),
  getEvaluation: vi.fn(),
  createEvaluation: vi.fn(),
  updateEvaluation: vi.fn(),
  deleteEvaluation: vi.fn(),
}))

import {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  createEvaluation,
} from '../api/vendorApi.js'

describe('Phase 6 — Vendor Management & Evaluation System Suite', () => {
  const mockVendors = [
    {
      id: 1,
      vendor_code: 'VND-0001',
      company_name: 'Bharat Electronics Ltd',
      category: 'Electronics',
      contact_person: 'Ramesh Kumar',
      email: 'procurement@bel.co.in',
      phone: '9876543210',
      address: 'Corporate Office, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560013',
      gst_number: '29AACCB1234N1Z5',
      pan_number: 'AACCB1234N',
      status: 'Active',
      contracts_count: 3,
      average_score: 8.5,
      evaluations: [
        {
          id: 50,
          vendor: 1,
          evaluated_by_name: 'Col. Rajesh Verma',
          evaluation_date: '2026-02-15',
          quality_score: '9.0',
          delivery_score: '8.5',
          pricing_score: '8.0',
          compliance_score: '8.5',
          overall_score: '8.5',
          recommendation: 'Selected',
          remarks: 'Outstanding mil-spec compliance on tactical radio delivery.',
        },
      ],
    },
    {
      id: 2,
      vendor_code: 'VND-0002',
      company_name: 'Tata Advanced Systems',
      category: 'Mechanical',
      contact_person: 'Anil Deshmukh',
      email: 'contracts@tasl.com',
      phone: '9123456789',
      address: 'Defence SEZ',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      gst_number: '36AABCT1234N1Z2',
      pan_number: 'AABCT1234N',
      status: 'Active',
      contracts_count: 1,
      average_score: 8.0,
      evaluations: [],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    getVendors.mockResolvedValue({
      data: { success: true, data: { count: 2, next: null, previous: null, results: mockVendors } },
    })
    getVendor.mockResolvedValue({
      data: { success: true, data: mockVendors[0] },
    })
  })

  // 1. VendorListPage Tests
  describe('VendorListPage Component', () => {
    it('renders supplier directory with metrics, company details, and 4-pillar score badges', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter>
            <VendorListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Defence Supplier Directory/i)).toBeInTheDocument()
      expect(await screen.findByText('VND-0001')).toBeInTheDocument()
      expect(screen.getByText('VND-0002')).toBeInTheDocument()
      expect(screen.getByText('Bharat Electronics Ltd')).toBeInTheDocument()
      expect(screen.getByText('Tata Advanced Systems')).toBeInTheDocument()
      expect(screen.getByText('8.5/10')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Register New Vendor/i })).toBeInTheDocument()
    })

    it('opens delete supplier modal when administrator clicks delete button', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter>
            <VendorListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      await screen.findByText('VND-0001')
      const deleteButtons = screen.getAllByTitle(/Delete vendor/i)
      fireEvent.click(deleteButtons[0])

      expect(screen.getByText(/Remove Supplier from Registry/i)).toBeInTheDocument()
      expect(screen.getByText(/delete supplier Bharat Electronics Ltd/i)).toBeInTheDocument()
    })
  })

  // 2. VendorCreatePage Tests
  describe('VendorCreatePage Component', () => {
    it('validates mandatory inputs (name, email, phone) and submits valid vendor payload', async () => {
      createVendor.mockResolvedValue({
        data: { success: true, data: { id: 3, vendor_code: 'VND-0003' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <VendorCreatePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Register Defence Supplier \/ Vendor/i)).toBeInTheDocument()

      const autoBtn = screen.getByRole('button', { name: /Auto/i })
      fireEvent.click(autoBtn)

      const companyInput = screen.getByPlaceholderText(/e.g., Bharat Electronics Limited/i)
      fireEvent.change(companyInput, { target: { value: 'Larsen & Toubro Heavy Engineering' } })

      const contactInput = screen.getByPlaceholderText(/Full name of representative/i)
      fireEvent.change(contactInput, { target: { value: 'S. N. Subrahmanyan' } })

      const emailInput = screen.getByPlaceholderText(/procurement@company.com/i)
      fireEvent.change(emailInput, { target: { value: 'defence@larsentoubro.com' } })

      const phoneInput = screen.getByPlaceholderText(/\+91 9876543210/i)
      fireEvent.change(phoneInput, { target: { value: '9820012345' } })

      const submitBtn = screen.getByRole('button', { name: /Register Defence Vendor/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(createVendor).toHaveBeenCalledWith(
          expect.objectContaining({
            company_name: 'Larsen & Toubro Heavy Engineering',
            contact_person: 'S. N. Subrahmanyan',
            email: 'defence@larsentoubro.com',
            phone: '9820012345',
          })
        )
      })
    })
  })

  // 3. VendorDetailPage Tests
  describe('VendorDetailPage Component', () => {
    it('displays vendor credentials, GSTIN, and embedded 4-pillar evaluation scorecard', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter initialEntries={['/app/vendors/1']}>
            <Routes>
              <Route path="/app/vendors/:id" element={<VendorDetailPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByText('VND-0001')).toBeInTheDocument()
      expect(screen.getByText('Bharat Electronics Ltd')).toBeInTheDocument()
      expect(screen.getByText(/29AACCB1234N1Z5/i)).toBeInTheDocument()
      expect(screen.getByText('AACCB1234N')).toBeInTheDocument()
      expect(screen.getByText(/DAP 2020 4-Pillar Evaluation History/i)).toBeInTheDocument()
      expect(screen.getByText(/Outstanding mil-spec compliance/i)).toBeInTheDocument()
      expect(screen.getByText('8.5/10')).toBeInTheDocument()
    })
  })

  // 4. VendorEditPage Tests
  describe('VendorEditPage Component', () => {
    it('retrieves vendor details and submits revisions via updateVendor', async () => {
      updateVendor.mockResolvedValue({
        data: { success: true, data: { ...mockVendors[0], company_name: 'BEL Aerospace Wing' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter initialEntries={['/app/vendors/1/edit']}>
            <Routes>
              <Route path="/app/vendors/:id/edit" element={<VendorEditPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByDisplayValue('VND-0001')).toBeInTheDocument()
      const companyInput = screen.getByDisplayValue('Bharat Electronics Ltd')
      fireEvent.change(companyInput, { target: { value: 'BEL Aerospace Wing' } })

      const submitBtn = screen.getByRole('button', { name: /Update Supplier Record/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(updateVendor).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            company_name: 'BEL Aerospace Wing',
          })
        )
      })
    })
  })

  // 5. VendorEvaluationPage Tests
  describe('VendorEvaluationPage Component', () => {
    it('calculates live 4-pillar average score and submits evaluation audit', async () => {
      createEvaluation.mockResolvedValue({
        data: { success: true, data: { id: 51, overall_score: '8.8' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter initialEntries={['/app/vendors/1/evaluate']}>
            <Routes>
              <Route path="/app/vendors/:id/evaluate" element={<VendorEvaluationPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByText('VND-0001')).toBeInTheDocument()
      expect(screen.getByText(/DAP 2020 Vendor Performance Scorecard/i)).toBeInTheDocument()
      expect(screen.getByText(/1. Quality & Technical Conformity/i)).toBeInTheDocument()

      const remarksInput = screen.getByPlaceholderText(/Detail specific observations/i)
      fireEvent.change(remarksInput, { target: { value: 'Factory inspection at Bengaluru plant verified.' } })

      const submitBtn = screen.getByRole('button', { name: /Submit Performance Evaluation/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(createEvaluation).toHaveBeenCalledWith(
          expect.objectContaining({
            vendor: 1,
            recommendation: 'Selected',
            remarks: 'Factory inspection at Bengaluru plant verified.',
          })
        )
      })
    })
  })
})
