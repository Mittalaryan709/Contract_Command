import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import ProfilePage from '../pages/auth/ProfilePage.jsx'
import ProtectedRoute from '../routes/ProtectedRoute.jsx'
import RoleGuard from '../routes/RoleGuard.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import NotFoundPage from '../pages/errors/NotFoundPage.jsx'
import UnauthorizedPage from '../pages/errors/UnauthorizedPage.jsx'

// Mock api/authApi
vi.mock('../api/authApi.js', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
}))

describe('Phase 3 — Authentication & Application Layout Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // 1. LoginPage
  describe('LoginPage Component', () => {
    it('renders portal sign-in form with all necessary security elements', () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: false, login: vi.fn() }}>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/PORTAL SIGN-IN/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Enter authorized username/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Enter cryptographic password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Authenticate & Enter Portal/i })).toBeInTheDocument()
      expect(screen.getByText(/QUICK TEST ROLES:/i)).toBeInTheDocument()
    })

    it('validates empty inputs on submission and presents error alert', async () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: false, login: vi.fn() }}>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      const submitBtn = screen.getByRole('button', { name: /Authenticate & Enter Portal/i })
      fireEvent.click(submitBtn)

      expect(await screen.findByText(/Please provide both username and password/i)).toBeInTheDocument()
    })

    it('populates fields when a demo role button is clicked', () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: false, login: vi.fn() }}>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      const adminDemoBtn = screen.getByRole('button', { name: 'Administrator' })
      fireEvent.click(adminDemoBtn)

      const usernameInput = screen.getByPlaceholderText(/Enter authorized username/i)
      const passwordInput = screen.getByPlaceholderText(/Enter cryptographic password/i)

      expect(usernameInput.value).toBe('admin')
      expect(passwordInput.value).toBe('admin123')
    })

    it('toggles password visibility when eye button is clicked', () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: false, login: vi.fn() }}>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      const passwordInput = screen.getByPlaceholderText(/Enter cryptographic password/i)
      const toggleBtn = screen.getByLabelText(/Toggle password visibility/i)

      expect(passwordInput.getAttribute('type')).toBe('password')
      fireEvent.click(toggleBtn)
      expect(passwordInput.getAttribute('type')).toBe('text')
      fireEvent.click(toggleBtn)
      expect(passwordInput.getAttribute('type')).toBe('password')
    })

    it('calls login handler with entered credentials', async () => {
      const mockLogin = vi.fn().mockResolvedValue({ id: 1, username: 'admin' })

      render(
        <AuthContext.Provider value={{ isAuthenticated: false, login: mockLogin }}>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      fireEvent.change(screen.getByPlaceholderText(/Enter authorized username/i), { target: { value: 'testuser' } })
      fireEvent.change(screen.getByPlaceholderText(/Enter cryptographic password/i), { target: { value: 'password123' } })
      fireEvent.click(screen.getByRole('button', { name: /Authenticate & Enter Portal/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123')
      })
    })
  })

  // 2. ProtectedRoute
  describe('ProtectedRoute Route Guard', () => {
    it('redirects to /login when user is not authenticated', () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: false, loading: false }}>
          <MemoryRouter initialEntries={['/app/dashboard']}>
            <Routes>
              <Route path="/login" element={<div>Login Screen Test</div>} />
              <Route element={<ProtectedRoute />}>
                <Route path="/app/dashboard" element={<div>Dashboard Secret</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Login Screen Test/i)).toBeInTheDocument()
      expect(screen.queryByText(/Dashboard Secret/i)).not.toBeInTheDocument()
    })

    it('renders protected child component when user is authenticated', () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: true, loading: false }}>
          <MemoryRouter initialEntries={['/app/dashboard']}>
            <Routes>
              <Route path="/login" element={<div>Login Screen Test</div>} />
              <Route element={<ProtectedRoute />}>
                <Route path="/app/dashboard" element={<div>Dashboard Secret</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Dashboard Secret/i)).toBeInTheDocument()
    })
  })

  // 3. RoleGuard
  describe('RoleGuard Authorization', () => {
    it('allows access when user possesses an allowed role', () => {
      const mockUser = { username: 'manager', groups: ['Contracts Manager'] }

      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, isAuthenticated: true }}>
          <MemoryRouter initialEntries={['/app/contracts/new']}>
            <Routes>
              <Route path="/unauthorized" element={<div>Access Blocked</div>} />
              <Route element={<RoleGuard allowedRoles={['Administrator', 'Contracts Manager']} />}>
                <Route path="/app/contracts/new" element={<div>Contract Creator Form</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Contract Creator Form/i)).toBeInTheDocument()
      expect(screen.queryByText(/Access Blocked/i)).not.toBeInTheDocument()
    })

    it('redirects to /unauthorized when user lacks the required role', () => {
      const mockUser = { username: 'safety', groups: ['Safety Officer'] }

      render(
        <AuthContext.Provider value={{ user: mockUser, loading: false, isAuthenticated: true }}>
          <MemoryRouter initialEntries={['/app/contracts/new']}>
            <Routes>
              <Route path="/unauthorized" element={<div>Access Blocked</div>} />
              <Route element={<RoleGuard allowedRoles={['Administrator', 'Contracts Manager']} />}>
                <Route path="/app/contracts/new" element={<div>Contract Creator Form</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Access Blocked/i)).toBeInTheDocument()
      expect(screen.queryByText(/Contract Creator Form/i)).not.toBeInTheDocument()
    })
  })

  // 4. Sidebar & Topbar Layout Components
  describe('Sidebar & Topbar Navigation Elements', () => {
    const mockUser = {
      username: 'admin',
      full_name: 'System Commander',
      groups: ['Administrator'],
    }

    it('renders Sidebar with role badge, navigation links, and branding', () => {
      render(
        <AuthContext.Provider value={{
          user: mockUser,
          isAdmin: () => true,
          isSafetyOfficer: () => false,
          isContractsManager: () => false,
        }}>
          <MemoryRouter>
            <Sidebar isOpen={true} onClose={vi.fn()} />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getAllByText(/Contract/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/Executive Dashboard/i)).toBeInTheDocument()
      expect(screen.getByText(/Contract Repository/i)).toBeInTheDocument()
      expect(screen.getByText(/Procurement Plans/i)).toBeInTheDocument()
      expect(screen.getByText(/GST Invoices/i)).toBeInTheDocument()
      expect(screen.getByText(/Vendor Directory/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Administrator/i).length).toBeGreaterThanOrEqual(1)
    })

    it('renders Topbar with dynamic breadcrumbs and operational alerts button', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser, logout: vi.fn() }}>
          <MemoryRouter initialEntries={['/app/dashboard']}>
            <Topbar onToggleSidebar={vi.fn()} />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Platform/i)).toBeInTheDocument()
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/User Menu/i)).toBeInTheDocument()
    })
  })

  // 5. ProfilePage
  describe('ProfilePage Security & Profile Settings', () => {
    const mockUser = {
      id: 1,
      username: 'col_verma',
      first_name: 'Col. Rajesh',
      last_name: 'Verma',
      full_name: 'Col. Rajesh Verma',
      email: 'rajesh.verma@mod.gov.in',
      date_joined: '2026-01-15T10:00:00Z',
      groups: ['Contracts Manager'],
      profile: {
        designation: 'Director of Procurement',
        phone: '+91 98765 43210',
        department: 'Defence Acquisition Directorate',
        city: 'New Delhi',
      },
    }

    it('displays user demographic details and cryptographic security overview', () => {
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <MemoryRouter>
            <ProfilePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Col. Rajesh Verma/i)).toBeInTheDocument()
      expect(screen.getByText(/rajesh.verma@mod.gov.in/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Defence Acquisition Directorate/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/Change Password/i)).toBeInTheDocument()
    })

    it('validates password mismatch on password change form', async () => {
      render(
        <AuthContext.Provider value={{ user: mockUser }}>
          <MemoryRouter>
            <ProfilePage />
          </MemoryRouter>
        </AuthContext.Provider>
      )

      const oldPw = screen.getByPlaceholderText(/Enter current password/i)
      const newPw = screen.getByPlaceholderText(/Enter new strong password/i)
      const confirmPw = screen.getByPlaceholderText(/Re-type new password/i)

      fireEvent.change(oldPw, { target: { value: 'oldpass123' } })
      fireEvent.change(newPw, { target: { value: 'newsecret123' } })
      fireEvent.change(confirmPw, { target: { value: 'mismatch456' } })

      const updatePwBtn = screen.getByRole('button', { name: /Update Password/i })
      fireEvent.click(updatePwBtn)

      expect(await screen.findByText(/New password and confirmation do not match/i)).toBeInTheDocument()
    })
  })

  // 6. Security Error Pages
  describe('Access Control & Status Pages', () => {
    it('renders UnauthorizedPage with HTTP 403 Defence Security badge', () => {
      render(
        <MemoryRouter>
          <UnauthorizedPage />
        </MemoryRouter>
      )

      expect(screen.getByText(/HTTP 403 • SECURITY ACCESS DENIED/i)).toBeInTheDocument()
      expect(screen.getByText(/Access Restricted/i)).toBeInTheDocument()
      expect(screen.getByText(/Return to Dashboard/i)).toBeInTheDocument()
    })

    it('renders NotFoundPage with HTTP 404 Secure Resource Not Found badge', () => {
      render(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      )

      expect(screen.getByText(/HTTP 404 • SECURE RESOURCE NOT FOUND/i)).toBeInTheDocument()
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
      expect(screen.getByText(/To Dashboard/i)).toBeInTheDocument()
    })
  })
})
