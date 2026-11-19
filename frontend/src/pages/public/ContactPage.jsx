import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [submittedMessage, setSubmittedMessage] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required.'
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please provide a valid email format.'
    }
    if (!form.subject.trim()) newErrors.subject = 'Subject is required.'
    if (!form.message.trim()) {
      newErrors.message = 'Message content is required.'
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.'
    }
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmittedMessage('')
      return
    }

    setErrors({})
    setSubmittedMessage(
      'Demonstration Mode: Your query was successfully validated on the client side. Note that no backend contact submission API is configured for Project P07; academic inquiries should be directed to your project coordinator.'
    )
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div>
      {/* Header Banner */}
      <section className="py-5 text-white" style={{ backgroundColor: '#102A43', borderBottom: '3px solid #E58A24' }}>
        <div className="container py-3">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: 'rgba(229, 138, 36, 0.2)', border: '1px solid #E58A24' }}>
            <span className="small text-warning fw-semibold">Academic Inquiries &amp; Support</span>
          </div>
          <h1 className="display-5 fw-bold text-white mb-2">Contact &amp; Support</h1>
          <p className="lead text-white-50 mb-0 fs-6">
            Get in touch regarding project demonstrations, technical architecture, and academic evaluation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Left Column: Contact Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
              <h4 className="fw-bold mb-2" style={{ color: '#102A43' }}>Submit an Inquiry</h4>
              <p className="text-muted small mb-4">
                Fill out the form below. Client-side form validation is enforced.
              </p>

              {submittedMessage && (
                <div className="alert alert-success d-flex align-items-start gap-2 mb-4 shadow-sm" role="alert">
                  <i className="bi bi-check-circle-fill text-success fs-5 mt-1"></i>
                  <div className="small">{submittedMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Officer Vikram Singh"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email Address */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="e.g. v.singh@example.ac.in"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Subject */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                    Subject <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                    placeholder="e.g. Technical Query regarding Contract Lifecycle"
                    value={form.subject}
                    onChange={handleChange}
                  />
                  {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="form-label fw-semibold small" style={{ color: '#334E68' }}>
                    Message Content <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    placeholder="Please describe your query or feedback in detail (min. 10 characters)..."
                    value={form.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-saffron px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                >
                  <i className="bi bi-send-fill"></i>
                  <span>Validate &amp; Send Query</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Contact Information */}
          <div className="col-lg-5">
            {/* Project Coordination Card */}
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4" style={{ backgroundColor: '#0B1F33', color: '#fff' }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#102A43' }}>
                  <i className="bi bi-mortarboard-fill fs-4 text-warning"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-white">Project Coordination</h5>
                  <small className="text-white-50">Department of Computer Applications</small>
                </div>
              </div>

              <div className="small text-white-50 d-flex flex-column gap-3 border-top border-secondary pt-3">
                <div className="d-flex gap-3">
                  <i className="bi bi-geo-alt-fill text-warning fs-5"></i>
                  <div>
                    <strong className="text-white d-block">Academic Institution</strong>
                    <span>ABES Engineering College, Campus 1, Ghaziabad, Uttar Pradesh &ndash; 201009</span>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <i className="bi bi-briefcase-fill text-info fs-5"></i>
                  <div>
                    <strong className="text-white d-block">Curriculum Program</strong>
                    <span>Master of Computer Applications (MCA) &bull; 2nd Year Capstone</span>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <i className="bi bi-award-fill text-success fs-5"></i>
                  <div>
                    <strong className="text-white d-block">Industry Partnership</strong>
                    <span>HCLTech Career Shaper Innovation Program</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Resources Card */}
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4">
              <h6 className="fw-bold mb-3" style={{ color: '#102A43' }}>Technical Repository &amp; Artifacts</h6>
              <div className="d-flex flex-column gap-2 small">
                <div className="p-3 rounded-2 bg-light d-flex align-items-center gap-3">
                  <i className="bi bi-github fs-4 text-dark"></i>
                  <div>
                    <div className="fw-bold" style={{ color: '#102A43' }}>Source Repository</div>
                    <span className="text-muted">GitHub: Mittalaryan709/Contract_Command</span>
                  </div>
                </div>

                <div className="p-3 rounded-2 bg-light d-flex align-items-center gap-3">
                  <i className="bi bi-file-earmark-code fs-4 text-primary"></i>
                  <div>
                    <div className="fw-bold" style={{ color: '#102A43' }}>Swagger / OpenAPI Spec</div>
                    <span className="text-muted">Endpoint: /api/docs/swagger/</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Notice Box */}
            <div className="p-3 rounded-3" style={{ backgroundColor: '#F3F6F9', border: '1px solid #DEE2E6' }}>
              <div className="small text-muted">
                <i className="bi bi-shield-exclamation me-1 text-warning"></i>
                <strong>Notice:</strong> This form operates in client-side demonstration mode. For official evaluation questions, please present inquiries directly during designated academic viva and review sessions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
