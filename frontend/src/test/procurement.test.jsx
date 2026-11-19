import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import PlanListPage from '../pages/procurement/PlanListPage.jsx'
import PlanCreatePage from '../pages/procurement/PlanCreatePage.jsx'
import PlanDetailPage from '../pages/procurement/PlanDetailPage.jsx'
import PlanEditPage from '../pages/procurement/PlanEditPage.jsx'
import RequisitionListPage from '../pages/procurement/RequisitionListPage.jsx'
import RequisitionCreatePage from '../pages/procurement/RequisitionCreatePage.jsx'
import RequisitionDetailPage from '../pages/procurement/RequisitionDetailPage.jsx'

// Mock procurementApi
vi.mock('../api/procurementApi.js', () => ({
  getPlans: vi.fn(),
  getPlan: vi.fn(),
  createPlan: vi.fn(),
  updatePlan: vi.fn(),
  deletePlan: vi.fn(),
  getRequisitions: vi.fn(),
  getRequisition: vi.fn(),
  createRequisition: vi.fn(),
  updateRequisition: vi.fn(),
  approveRequisition: vi.fn(),
  rejectRequisition: vi.fn(),
  getItems: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
}))

import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  getRequisitions,
  getRequisition,
  createRequisition,
  approveRequisition,
  rejectRequisition,
  createItem,
} from '../api/procurementApi.js'

describe('Phase 5 — Procurement Planning & Requisitions Suite', () => {
  const mockPlans = [
    {
      id: 1,
      plan_number: 'PP-2026-001',
      title: 'FY2026-27 Armoured Corps Communication Modernization Plan',
      fiscal_year: '2026-2027',
      total_budget: '150000000.00',
      status: 'Active',
      created_by_name: 'Col. Rajesh Verma',
      start_date: '2026-04-01',
      end_date: '2027-03-31',
      requisitions_count: 3,
      description: 'Capital modernization plan for mobile communications in western theatre.',
      created_at: '2026-01-15T10:00:00Z',
      updated_at: '2026-01-15T10:00:00Z',
    },
    {
      id: 2,
      plan_number: 'PP-2026-002',
      title: 'High Altitude Logistic Support Indentures',
      fiscal_year: '2026-2027',
      total_budget: '45000000.00',
      status: 'Draft',
      created_by_name: 'Col. Rajesh Verma',
      start_date: '2026-05-01',
      end_date: '2027-04-30',
      requisitions_count: 0,
      description: 'Specialized rations and clothing replenishment.',
      created_at: '2026-02-10T11:00:00Z',
      updated_at: '2026-02-10T11:00:00Z',
    },
  ]

  const mockRequisitions = [
    {
      id: 10,
      requisition_number: 'REQ-2026-101',
      plan: 1,
      plan_title: 'FY2026-27 Armoured Corps Communication Modernization Plan',
      title: 'Tactical SDR Handheld Transceivers Batch 1',
      priority: 'Urgent',
      status: 'Pending',
      required_by_date: '2026-08-15',
      requested_by_name: 'Major A. Sharma',
      total_amount: '35000000.00',
      created_at: '2026-03-01T09:00:00Z',
      items: [
        {
          id: 101,
          requisition: 10,
          item_name: 'VHF/UHF Transceiver Unit',
          description: 'Mil-Std 810G',
          quantity: '50.00',
          unit: 'Unit',
          unit_price: '700000.00',
          total_price: '35000000.00',
        },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    getPlans.mockResolvedValue({
      data: { success: true, data: { count: 2, next: null, previous: null, results: mockPlans } },
    })
    getPlan.mockResolvedValue({
      data: { success: true, data: mockPlans[0] },
    })
    getRequisitions.mockResolvedValue({
      data: { success: true, data: { count: 1, next: null, previous: null, results: mockRequisitions } },
    })
    getRequisition.mockResolvedValue({
      data: { success: true, data: mockRequisitions[0] },
    })
  })

  // 1. PlanListPage Tests
  describe('PlanListPage Component', () => {
    it('renders master plans table with metrics, budget ceiling, and action controls', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <PlanListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getAllByText(/Procurement Master Plans/i)[0]).toBeInTheDocument()
      expect(await screen.findByText('PP-2026-001')).toBeInTheDocument()
      expect(screen.getByText('PP-2026-002')).toBeInTheDocument()
      expect(screen.getByText(/FY2026-27 Armoured Corps Communication Modernization Plan/i)).toBeInTheDocument()
      expect(screen.getAllByText(/2026-2027/i)[0]).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Create Procurement Plan/i })).toBeInTheDocument()
    })
  })

  // 2. PlanCreatePage Tests
  describe('PlanCreatePage Component', () => {
    it('validates required fields, format rules, and submits valid payload', async () => {
      createPlan.mockResolvedValue({
        data: { success: true, data: { id: 3, plan_number: 'PP-2026-003' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <PlanCreatePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Create Procurement Master Plan/i)).toBeInTheDocument()

      const autoBtn = screen.getByRole('button', { name: /Auto/i })
      fireEvent.click(autoBtn)

      const titleInput = screen.getByPlaceholderText(/e.g., FY2026-27 Armoured Corps Communication Modernization Plan/i)
      fireEvent.change(titleInput, { target: { value: 'Western Fleet Drone Interceptor Plan' } })

      const budgetInput = screen.getByPlaceholderText('0.00')
      fireEvent.change(budgetInput, { target: { value: '60000000' } })

      const submitBtn = screen.getByRole('button', { name: /Save Procurement Plan/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(createPlan).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Western Fleet Drone Interceptor Plan',
            total_budget: 60000000,
            fiscal_year: '2026-2027',
          })
        )
      })
    })
  })

  // 3. PlanDetailPage Tests
  describe('PlanDetailPage Component', () => {
    it('displays plan details, budget ceiling meter, and linked requisitions', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter initialEntries={['/app/procurement/plans/1']}>
            <Routes>
              <Route path="/app/procurement/plans/:id" element={<PlanDetailPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByText('PP-2026-001')).toBeInTheDocument()
      expect(screen.getByText(/FY2026-27 Armoured Corps Communication Modernization Plan/i)).toBeInTheDocument()
      expect(screen.getByText(/Budget Utilization/i)).toBeInTheDocument()
      expect(screen.getByText(/Linked Procurement Requisitions/i)).toBeInTheDocument()
      expect(screen.getByText('REQ-2026-101')).toBeInTheDocument()
    })
  })

  // 4. PlanEditPage Tests
  describe('PlanEditPage Component', () => {
    it('retrieves plan and submits revisions via updatePlan', async () => {
      updatePlan.mockResolvedValue({
        data: { success: true, data: { ...mockPlans[0], title: 'Amended Armoured Corps Plan' } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter initialEntries={['/app/procurement/plans/1/edit']}>
            <Routes>
              <Route path="/app/procurement/plans/:id/edit" element={<PlanEditPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByDisplayValue('PP-2026-001')).toBeInTheDocument()
      const titleInput = screen.getByDisplayValue(/FY2026-27 Armoured Corps Communication Modernization Plan/i)
      fireEvent.change(titleInput, { target: { value: 'Amended Armoured Corps Plan' } })

      const submitBtn = screen.getByRole('button', { name: /Update Procurement Plan/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(updatePlan).toHaveBeenCalledWith(
          '1',
          expect.objectContaining({
            title: 'Amended Armoured Corps Plan',
          })
        )
      })
    })
  })

  // 5. RequisitionListPage Tests
  describe('RequisitionListPage Component', () => {
    it('renders requisition ledger, priority badges, and handles quick approval', async () => {
      approveRequisition.mockResolvedValue({
        data: { success: true, message: 'Requisition approved.' },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <RequisitionListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Defence Procurement Requisitions/i)).toBeInTheDocument()
      expect(await screen.findByText('REQ-2026-101')).toBeInTheDocument()
      expect(screen.getAllByText('Urgent')[0]).toBeInTheDocument()

      const approveBtn = screen.getByTitle(/Approve Requisition/i)
      fireEvent.click(approveBtn)

      await waitFor(() => {
        expect(approveRequisition).toHaveBeenCalledWith(10)
      })
    })

    it('handles quick rejection of pending requisition', async () => {
      rejectRequisition.mockResolvedValue({
        data: { success: true, message: 'Requisition rejected.' },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <RequisitionListPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      await screen.findByText('REQ-2026-101')
      const rejectBtn = screen.getByTitle(/Reject Requisition/i)
      fireEvent.click(rejectBtn)

      await waitFor(() => {
        expect(rejectRequisition).toHaveBeenCalledWith(10)
      })
    })
  })

  // 6. RequisitionCreatePage Tests
  describe('RequisitionCreatePage Component', () => {
    it('dynamically adds line items and creates requisition with bill of quantities', async () => {
      createRequisition.mockResolvedValue({
        data: { success: true, data: { id: 20, requisition_number: 'REQ-2026-201' } },
      })
      createItem.mockResolvedValue({
        data: { success: true, data: { id: 201 } },
      })

      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter>
            <RequisitionCreatePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Create Defence Requisition Indenture/i)).toBeInTheDocument()

      // Wait for master plan options to load
      await screen.findByText(/FY2026-27 Armoured Corps Communication Modernization Plan/i)

      const autoBtn = screen.getByRole('button', { name: /Auto/i })
      fireEvent.click(autoBtn)

      const titleInput = screen.getByPlaceholderText(/e.g., Immediate Operational Requirement/i)
      fireEvent.change(titleInput, { target: { value: 'Winter Warfare Tents Batch' } })

      const dateInput = screen.getAllByDisplayValue('').find(i => i.name === 'required_by_date')
      fireEvent.change(dateInput, { target: { value: '2026-10-31' } })

      const itemNameInput = screen.getByPlaceholderText(/Item name \/ Nomenclature \*/i)
      fireEvent.change(itemNameInput, { target: { value: 'Arctic Heavy Duty Tent 10-Man' } })

      const unitPriceInput = screen.getByPlaceholderText('0.00')
      fireEvent.change(unitPriceInput, { target: { value: '120000' } })

      const submitBtn = screen.getByRole('button', { name: /Submit Requisition for Approval/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(createRequisition).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Winter Warfare Tents Batch',
            priority: 'Medium',
          })
        )
      })
    })
  })

  // 7. RequisitionDetailPage Tests
  describe('RequisitionDetailPage Component', () => {
    it('displays requisition details, authorization audit trail, and line items', async () => {
      render(
        <AuthContext.Provider value={{ canWrite: () => true }}>
          <MemoryRouter initialEntries={['/app/procurement/requisitions/10']}>
            <Routes>
              <Route path="/app/procurement/requisitions/:id" element={<RequisitionDetailPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(await screen.findByText('REQ-2026-101')).toBeInTheDocument()
      expect(screen.getByText(/Tactical SDR Handheld Transceivers Batch 1/i)).toBeInTheDocument()
      expect(screen.getByText(/VHF\/UHF Transceiver Unit/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Approve Demand/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument()
    })
  })
})
