import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import ContractListPage from '../pages/contracts/ContractListPage.jsx'
import ContractCreatePage from '../pages/contracts/ContractCreatePage.jsx'
import ContractDetailPage from '../pages/contracts/ContractDetailPage.jsx'
import ContractEditPage from '../pages/contracts/ContractEditPage.jsx'

// Mock contractApi and vendorApi
vi.mock('../api/contractApi.js', () => ({
  getContracts: vi.fn(),
  getContract: vi.fn(),
  createContract: vi.fn(),
  updateContract: vi.fn(),
  patchContract: vi.fn(),
  deleteContract: vi.fn(),
  getDocuments: vi.fn(),
  createDocument: vi.fn(),
  deleteDocument: vi.fn(),
}))

vi.mock('../api/vendorApi.js', () => ({
  getVendors: vi.fn(),
}))

import {
  getContracts,
  getContract,
  createContract,
  updateContract,
  patchContract,
  createDocument,
} from '../api/contractApi.js'
import { getVendors } from '../api/vendorApi.js'

describe('Phase 4 — Contract Repository and Lifecycle Suite', () => {
  const mockContracts = [
    {
      id: 1,
      contract_number: 'CC-2026-0001',
      title: 'Supply of Tactical Software Defined Radios',
      contract_type: 'Supply',
      description: 'Military SDR transceivers with indigenous frequency hopping.',
      vendor: 101,
      vendor_name: 'Bharat Electronics Ltd',
      value: '45000000.00',
      start_date: '2026-01-01',
      end_date: '2027-12-31',
      status: 'Active',
      created_by: 1,
      created_by_name: 'Col. Rajesh Verma',
      created_at: '2026-01-01T10:00:00Z',
      documents: [
        {
          id: 10,
          contract: 1,
          title: 'Executed Contract Agreement',
          file_name: 'CC-2026-0001-Signed.pdf',
          file_path: '/contracts/2026/CC-2026-0001-Signed.pdf',
          uploaded_by_name: 'Col. Rajesh Verma',
          uploaded_at: '2026-01-02T11:00:00Z',
        },
      ],
    },
    {
      id: 2,
      contract_number: 'CC-2026-0002',
      title: 'Fleet Avionics Maintenance Contract',
      contract_type: 'Maintenance',
      description: 'MRO contract for Su-30MKI mission computers.',
      vendor: 102,
      vendor_name: 'Hindustan Aeronautics Ltd',
      value: '82000000.00',
      start_date: '2026-03-01',
      end_date: '2028-02-28',
      status: 'Draft',
      created_by: 1,
      created_by_name: 'Col. Rajesh Verma',
      created_at: '2026-02-15T09:30:00Z',
      documents: [],
    },
  ]

  const mockVendors = [
    { id: 101, vendor_code: 'VEN-001', company_name: 'Bharat Electronics Ltd', category: 'PSU' },
    { id: 102, vendor_code: 'VEN-002', company_name: 'Hindustan Aeronautics Ltd', category: 'Defence Aerospace' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    getVendors.mockResolvedValue({ data: { success: true, data: { count: 2, results: mockVendors } } })
    getContracts.mockResolvedValue({
      data: {
        success: true,
        data: { count: 2, next: null, previous: null, results: mockContracts },
      },
    })
    getContract.mockResolvedValue({
      data: { success: true, data: mockContracts[0] },
    })
  })

  // 1. ContractListPage Tests
  describe('ContractListPage Component', () => {
    it('renders the contract repository ledger with table rows and metrics', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter>
            <ContractListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Defence Contract Repository/i)).toBeInTheDocument()
      expect(await screen.findByText('CC-2026-0001')).toBeInTheDocument()
      expect(screen.getByText('CC-2026-0002')).toBeInTheDocument()
      expect(screen.getByText(/Supply of Tactical Software Defined Radios/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Bharat Electronics Ltd/i)[0]).toBeInTheDocument()
      expect(screen.getAllByText(/Hindustan Aeronautics Ltd/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/Active Agreements/i)).toBeInTheDocument()
    })

    it('displays "Register New Contract" button only for authorized officers', async () => {
      const { rerender } = render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => false }}>
          <MemoryRouter>
            <ContractListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByRole('link', { name: /Register New Contract/i })).toBeInTheDocument()

      // Read-only user (e.g. Safety Officer)
      rerender(
        <AuthContext.Provider value={{ canWrite: () => false, canDelete: () => false }}>
          <MemoryRouter>
            <ContractListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.queryByRole('link', { name: /Register New Contract/i })).not.toBeInTheDocument()
    })

    it('opens delete confirmation modal when administrator clicks delete', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter>
            <ContractListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      await screen.findByText('CC-2026-0001')
      const deleteButtons = screen.getAllByTitle(/Delete contract/i)
      fireEvent.click(deleteButtons[0])

      expect(screen.getByText(/Authorize Contract Termination \/ Deletion/i)).toBeInTheDocument()
      expect(screen.getByText(/permanently delete contract CC-2026-0001/i)).toBeInTheDocument()
    })
  })

  // 2. ContractCreatePage Tests
  describe('ContractCreatePage Component', () => {
    it('renders all form input fields and auto-generates contract number', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <ContractCreatePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Register Defence Contract/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/CC-YYYY-NNNN/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/e.g., Supply of Tactical Software Defined Radios/i)).toBeInTheDocument()

      const autoBtn = screen.getByRole('button', { name: /Auto/i })
      fireEvent.click(autoBtn)

      const numInput = screen.getByPlaceholderText(/CC-YYYY-NNNN/i)
      expect(numInput.value).toMatch(/^CC-2026-\d{4}$/)
    })

    it('enforces validation rules: format, positive value, and chronological dates', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <ContractCreatePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      const submitBtn = screen.getByRole('button', { name: /Register & Save Contract/i })
      fireEvent.click(submitBtn)

      expect(await screen.findByText(/Contract number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Contract title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Contract value must be greater than zero/i)).toBeInTheDocument()
    })

    it('submits valid contract payload and invokes createContract API', async () => {
      createContract.mockResolvedValue({
        data: { success: true, data: { id: 99, contract_number: 'CC-2026-9999' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <ContractCreatePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      fireEvent.change(screen.getByPlaceholderText(/CC-YYYY-NNNN/i), { target: { value: 'CC-2026-5555' } })
      fireEvent.change(screen.getByPlaceholderText(/e.g., Supply of Tactical Software Defined Radios/i), {
        target: { value: 'Night Vision Goggles Batch 4' },
      })
      fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '15000000' } })

      const dateInputs = screen.getAllByDisplayValue('')
      const startDateInput = dateInputs.find(i => i.name === 'start_date')
      const endDateInput = dateInputs.find(i => i.name === 'end_date')

      fireEvent.change(startDateInput, { target: { value: '2026-04-01' } })
      fireEvent.change(endDateInput, { target: { value: '2027-03-31' } })

      const submitBtn = screen.getByRole('button', { name: /Register & Save Contract/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(createContract).toHaveBeenCalledWith(
          expect.objectContaining({
            contract_number: 'CC-2026-5555',
            title: 'Night Vision Goggles Batch 4',
            value: 15000000,
            start_date: '2026-04-01',
            end_date: '2027-03-31',
          })
        )
      })
    })
  })

  // 3. ContractDetailPage Tests
  describe('ContractDetailPage Component', () => {
    it('retrieves contract dossier, displays attached documents and transition controls', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter initialEntries={['/app/contracts/1']}>
            <Routes>
              <Route path="/app/contracts/:id" element={<ContractDetailPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByText('CC-2026-0001')).toBeInTheDocument()
      expect(screen.getByText(/Supply of Tactical Software Defined Radios/i)).toBeInTheDocument()
      expect(screen.getByText(/Executed Contract Agreement/i)).toBeInTheDocument()
      expect(screen.getAllByText(/CC-2026-0001-Signed\.pdf/i)[0]).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Attach Document/i })).toBeInTheDocument()
    })

    it('allows transitioning active contract status via lifecycle controls', async () => {
      patchContract.mockResolvedValue({
        data: { success: true, data: { ...mockContracts[0], status: 'Completed' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter initialEntries={['/app/contracts/1']}>
            <Routes>
              <Route path="/app/contracts/:id" element={<ContractDetailPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      await screen.findByText('CC-2026-0001')
      const completeBtn = screen.getByRole('button', { name: /Mark Contract Completed/i })
      fireEvent.click(completeBtn)

      await waitFor(() => {
        expect(patchContract).toHaveBeenCalledWith('1', { status: 'Completed' })
      })
    })

    it('opens attach document modal and attaches new audit record', async () => {
      createDocument.mockResolvedValue({
        data: { success: true, data: { id: 11, title: 'Quality Assurance Certificate' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true, canDelete: () => true }}>
          <MemoryRouter initialEntries={['/app/contracts/1']}>
            <Routes>
              <Route path="/app/contracts/:id" element={<ContractDetailPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      await screen.findByText('CC-2026-0001')
      const attachBtn = screen.getByRole('button', { name: /Attach Document/i })
      fireEvent.click(attachBtn)

      expect(screen.getByPlaceholderText(/e.g., Signed Master Supply Agreement/i)).toBeInTheDocument()

      fireEvent.change(screen.getByPlaceholderText(/e.g., Signed Master Supply Agreement/i), {
        target: { value: 'QA Compliance Certificate' },
      })
      fireEvent.change(screen.getByPlaceholderText(/e.g., CC-2026-0001_Signed_Agreement.pdf/i), {
        target: { value: 'QA_Cert_01.pdf' },
      })
      fireEvent.change(screen.getByPlaceholderText(/e.g., \/secure\/contracts\/2026\/CC-2026-0001_Signed.pdf/i), {
        target: { value: '/docs/QA_Cert_01.pdf' },
      })

      const saveDocBtn = screen.getByRole('button', { name: /Save Document Reference/i })
      fireEvent.click(saveDocBtn)

      await waitFor(() => {
        expect(createDocument).toHaveBeenCalledWith({
          contract: 1,
          title: 'QA Compliance Certificate',
          file_name: 'QA_Cert_01.pdf',
          file_path: '/docs/QA_Cert_01.pdf',
        })
      })
    })
  })

  // 4. ContractEditPage Tests
  describe('ContractEditPage Component', () => {
    it('populates existing contract data into revision form and updates terms', async () => {
      updateContract.mockResolvedValue({
        data: { success: true, data: { ...mockContracts[0], title: 'Updated Supply of Tactical SDRs' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter initialEntries={['/app/contracts/1/edit']}>
            <Routes>
              <Route path="/app/contracts/:id/edit" element={<ContractEditPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByDisplayValue('CC-2026-0001')).toBeInTheDocument()
      expect(screen.getByDisplayValue(/Supply of Tactical Software Defined Radios/i)).toBeInTheDocument()

      const titleInput = screen.getByDisplayValue(/Supply of Tactical Software Defined Radios/i)
      fireEvent.change(titleInput, { target: { value: 'Updated Supply of Tactical SDRs' } })

      const updateBtn = screen.getByRole('button', { name: /Update Contract Terms/i })
      fireEvent.click(updateBtn)

      await waitFor(() => {
        expect(updateContract).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            contract_number: 'CC-2026-0001',
            title: 'Updated Supply of Tactical SDRs',
          })
        )
      })
    })
  })
})
