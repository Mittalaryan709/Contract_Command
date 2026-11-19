import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../pages/public/LandingPage.jsx'
import AboutPage from '../pages/public/AboutPage.jsx'
import ModulesPage from '../pages/public/ModulesPage.jsx'
import AnnouncementsPage from '../pages/public/AnnouncementsPage.jsx'
import ContactPage from '../pages/public/ContactPage.jsx'

describe('Phase 2 — Public Website and Branding Tests', () => {

  describe('Landing Page', () => {
    it('renders the primary defence hero heading', () => {
      render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      )
      expect(
        screen.getByRole('heading', { name: /Strengthening Defence Contract and Procurement Management/i })
      ).toBeInTheDocument()
    })

    it('renders the required navigation buttons: Access Portal and Explore Modules', () => {
      render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      )
      const accessPortalBtn = screen.getByRole('link', { name: /Access Portal/i })
      const exploreModulesBtn = screen.getByRole('link', { name: /Explore Modules/i })

      expect(accessPortalBtn).toBeInTheDocument()
      expect(accessPortalBtn).toHaveAttribute('href', '/login')
      expect(exploreModulesBtn).toBeInTheDocument()
      expect(exploreModulesBtn).toHaveAttribute('href', '/modules')
    })

    it('renders all four platform module cards', () => {
      render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      )
      expect(screen.getByText('Contract Repository')).toBeInTheDocument()
      expect(screen.getByText('Procurement Planning')).toBeInTheDocument()
      expect(screen.getByText('Vendor Management')).toBeInTheDocument()
      expect(screen.getByText('Finance & Payments')).toBeInTheDocument()
    })

    it('renders Indian defence indigenisation & innovation sections', () => {
      render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      )
      expect(screen.getByText(/Supporting Atmanirbhar Bharat in Defence/i)).toBeInTheDocument()
      expect(screen.getAllByText(/DAP 2020 Aligned/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/Make in India/i)).toBeInTheDocument()
      expect(screen.getByText(/iDEX & Startups/i)).toBeInTheDocument()
    })

    it('renders defence operational gallery images with descriptive alt text', () => {
      render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      )
      expect(screen.getByAltText(/Land Defence Systems and Tactical Mobility/i)).toBeInTheDocument()
      expect(screen.getByAltText(/Maritime Systems and Surface Combatants/i)).toBeInTheDocument()
      expect(screen.getByAltText(/Aerospace and Combat Aviation Systems/i)).toBeInTheDocument()
    })
  })

  describe('About Page', () => {
    it('renders project overview, objectives and academic details', () => {
      render(
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      )
      expect(screen.getByRole('heading', { name: /About ContractCommand/i })).toBeInTheDocument()
      expect(screen.getByText(/The Problem Statement/i)).toBeInTheDocument()
      expect(screen.getByText(/Project Objectives/i)).toBeInTheDocument()
      expect(screen.getByText(/ABES Engineering College/i)).toBeInTheDocument()
      expect(screen.getByText(/HCLTech Career Shaper Companion Project/i)).toBeInTheDocument()
    })
  })

  describe('Modules Page', () => {
    it('renders dedicated deep-dive sections for all four modules', () => {
      render(
        <MemoryRouter>
          <ModulesPage />
        </MemoryRouter>
      )
      expect(screen.getByRole('heading', { name: /Platform Modules/i })).toBeInTheDocument()
      expect(screen.getByText(/Contract Repository & Lifecycle/i)).toBeInTheDocument()
      expect(screen.getByText(/Procurement Planning & Requisitions/i)).toBeInTheDocument()
      expect(screen.getByText(/Vendor Evaluation & Selection/i)).toBeInTheDocument()
      expect(screen.getByText(/Invoice & Payment Processing/i)).toBeInTheDocument()
    })
  })

  describe('Announcements Page', () => {
    it('renders operational bulletins with dates and categories', () => {
      render(
        <MemoryRouter>
          <AnnouncementsPage />
        </MemoryRouter>
      )
      expect(screen.getByRole('heading', { name: /Announcements & Updates/i })).toBeInTheDocument()
      expect(screen.getByText(/ContractCommand Platform Foundation & Phase 1 Release/i)).toBeInTheDocument()
      expect(screen.getByText(/19-11-2026/i)).toBeInTheDocument()
      expect(screen.getByText(/System Release/i)).toBeInTheDocument()
    })
  })

  describe('Contact Page Form Validation', () => {
    it('displays validation errors when submitting an empty form', () => {
      render(
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      )
      const submitBtn = screen.getByRole('button', { name: /Validate & Send Query/i })
      fireEvent.click(submitBtn)

      expect(screen.getByText('Full name is required.')).toBeInTheDocument()
      expect(screen.getByText('Email address is required.')).toBeInTheDocument()
      expect(screen.getByText('Subject is required.')).toBeInTheDocument()
      expect(screen.getByText('Message content is required.')).toBeInTheDocument()
    })

    it('validates email format and minimum message length', () => {
      render(
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      )
      const nameInput = screen.getByPlaceholderText(/Officer Vikram Singh/i)
      const emailInput = screen.getByPlaceholderText(/v.singh@example.ac.in/i)
      const subjectInput = screen.getByPlaceholderText(/Technical Query regarding Contract Lifecycle/i)
      const messageInput = screen.getByPlaceholderText(/Please describe your query/i)
      const submitBtn = screen.getByRole('button', { name: /Validate & Send Query/i })

      fireEvent.change(nameInput, { target: { value: 'Officer Vikram Singh' } })
      fireEvent.change(emailInput, { target: { value: 'invalid-email-format' } })
      fireEvent.change(subjectInput, { target: { value: 'Contract Inquiry' } })
      fireEvent.change(messageInput, { target: { value: 'short' } })
      fireEvent.click(submitBtn)

      expect(screen.getByText('Please provide a valid email format.')).toBeInTheDocument()
      expect(screen.getByText('Message must be at least 10 characters long.')).toBeInTheDocument()
    })

    it('submits successfully in demonstration mode when all inputs are valid', () => {
      render(
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      )
      const nameInput = screen.getByPlaceholderText(/Officer Vikram Singh/i)
      const emailInput = screen.getByPlaceholderText(/v.singh@example.ac.in/i)
      const subjectInput = screen.getByPlaceholderText(/Technical Query regarding Contract Lifecycle/i)
      const messageInput = screen.getByPlaceholderText(/Please describe your query/i)
      const submitBtn = screen.getByRole('button', { name: /Validate & Send Query/i })

      fireEvent.change(nameInput, { target: { value: 'Major R. Sharma' } })
      fireEvent.change(emailInput, { target: { value: 'r.sharma@defence.ac.in' } })
      fireEvent.change(subjectInput, { target: { value: 'Contract Lifecycle Assessment' } })
      fireEvent.change(messageInput, { target: { value: 'Inquiring regarding the DAP 2020 compliance evaluation flow.' } })
      fireEvent.click(submitBtn)

      expect(screen.getByText(/Demonstration Mode: Your query was successfully validated/i)).toBeInTheDocument()
    })
  })
})
