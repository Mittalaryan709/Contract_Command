import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import ErrorAlert from '../components/common/ErrorAlert.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import { formatINR, formatDate, formatNumber, getStatusVariant } from '../utils/formatters.js'
import { hasRole, canCreate, canDelete, canApprove } from '../utils/roleHelpers.js'
import { storageService } from '../services/storageService.js'

describe('Phase 1 — Frontend Foundation Tests', () => {

  describe('Formatter Utilities', () => {
    it('formats INR currency properly', () => {
      const formatted = formatINR(500000)
      expect(formatted).toContain('5,00,000')
    })

    it('formats date from YYYY-MM-DD to DD-MM-YYYY', () => {
      expect(formatDate('2026-11-19')).toBe('19-11-2026')
      expect(formatDate(null)).toBe('—')
    })

    it('formats numbers with Indian grouping', () => {
      expect(formatNumber(100000)).toBe('1,00,000')
    })

    it('maps status values to appropriate Bootstrap color variants', () => {
      expect(getStatusVariant('Active')).toBe('success')
      expect(getStatusVariant('Draft')).toBe('secondary')
      expect(getStatusVariant('Terminated')).toBe('warning')
      expect(getStatusVariant('Expired')).toBe('danger')
    })
  })

  describe('Role-Based Access Helper Utilities', () => {
    const adminUser = { username: 'admin', groups: ['Administrator'] }
    const cmUser = { username: 'cm_user', groups: ['Contracts Manager'] }
    const soUser = { username: 'so_user', groups: ['Safety Officer'] }

    it('correctly identifies user roles', () => {
      expect(hasRole(adminUser, 'Administrator')).toBe(true)
      expect(hasRole(cmUser, 'Contracts Manager')).toBe(true)
      expect(hasRole(soUser, 'Safety Officer')).toBe(true)
      expect(hasRole(soUser, 'Administrator')).toBe(false)
    })

    it('evaluates write/create permissions properly', () => {
      expect(canCreate(adminUser)).toBe(true)
      expect(canCreate(cmUser)).toBe(true)
      expect(canCreate(soUser)).toBe(false)
    })

    it('evaluates delete permissions strictly for Administrator', () => {
      expect(canDelete(adminUser)).toBe(true)
      expect(canDelete(cmUser)).toBe(false)
      expect(canDelete(soUser)).toBe(false)
    })

    it('evaluates approve permissions for Administrator and Contracts Manager', () => {
      expect(canApprove(adminUser)).toBe(true)
      expect(canApprove(cmUser)).toBe(true)
      expect(canApprove(soUser)).toBe(false)
    })
  })

  describe('Storage Service', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('stores and retrieves access and refresh tokens', () => {
      storageService.setAccessToken('test_access_token')
      storageService.setRefreshToken('test_refresh_token')
      expect(storageService.getAccessToken()).toBe('test_access_token')
      expect(storageService.getRefreshToken()).toBe('test_refresh_token')

      storageService.clearAll()
      expect(storageService.getAccessToken()).toBeNull()
      expect(storageService.getRefreshToken()).toBeNull()
    })
  })

  describe('Reusable Common Components', () => {
    it('renders LoadingSpinner with custom message', () => {
      render(<LoadingSpinner message="Checking defence database..." />)
      expect(screen.getByText('Checking defence database...')).toBeInTheDocument()
    })

    it('renders ErrorAlert with error message', () => {
      render(<ErrorAlert message="Access restricted to authorized personnel." />)
      expect(screen.getByText('Access restricted to authorized personnel.')).toBeInTheDocument()
    })

    it('renders EmptyState component with title and subtitle', () => {
      render(<EmptyState title="No contracts found" subtitle="Try adjusting your filter settings" />)
      expect(screen.getByText('No contracts found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your filter settings')).toBeInTheDocument()
    })

    it('renders StatusBadge with correct text content', () => {
      render(<StatusBadge status="Active" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })
  })
})
