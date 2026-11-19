import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  getDashboardStats,
  getRecentContracts,
  getRecentRequisitions,
  getRecentPayments,
  getContractStatusDistribution,
  getInvoiceStatusDistribution,
  getRequisitionPriorityDistribution,
  getPaymentMethodDistribution,
} from '../../api/dashboardApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { formatINR, formatDate } from '../../utils/formatters.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
)

function StatCard({ icon, title, value, color = '#102A43', link, subtitle, prefix = '' }) {
  return (
    <div
      className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100 position-relative overflow-hidden"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div
            className="text-muted small fw-semibold text-uppercase"
            style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
          >
            {title}
          </div>
          <div className="h3 fw-bold my-1 text-dark" style={{ letterSpacing: '-0.5px' }}>
            {prefix}{value ?? '—'}
          </div>
          {subtitle && (
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              {subtitle}
            </div>
          )}
        </div>
        <div
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 44, height: 44, backgroundColor: `${color}15`, color: color }}
        >
          <i className={`bi ${icon} fs-5`}></i>
        </div>
      </div>
      {link && (
        <div className="mt-2 pt-2 border-top">
          <Link
            to={link}
            className="small fw-semibold text-decoration-none d-flex align-items-center justify-content-between"
            style={{ color: color, fontSize: '0.75rem' }}
          >
            <span>Access Dossier</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user, canWrite } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentContracts, setRecentContracts] = useState([])
  const [recentReqs, setRecentReqs] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [contractDist, setContractDist] = useState({})
  const [invoiceDist, setInvoiceDist] = useState({})
  const [reqPriorityDist, setReqPriorityDist] = useState({})
  const [paymentMethodDist, setPaymentMethodDist] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(() => new Date())

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const [s, rc, rr, rp, cd, id, rpd, pmd] = await Promise.all([
        getDashboardStats(),
        getRecentContracts(),
        getRecentRequisitions(),
        getRecentPayments(),
        getContractStatusDistribution(),
        getInvoiceStatusDistribution(),
        getRequisitionPriorityDistribution(),
        getPaymentMethodDistribution(),
      ])

      setStats(s)
      const extractList = (r) => r.data?.data?.results ?? r.data?.results ?? []
      setRecentContracts(extractList(rc))
      setRecentReqs(extractList(rr))
      setRecentPayments(extractList(rp))
      setContractDist(cd)
      setInvoiceDist(id)
      setReqPriorityDist(rpd)
      setPaymentMethodDist(pmd)
      setLastRefreshed(new Date())
    } catch (e) {
      console.error('Dashboard load error:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Compiling defence intelligence & analytics..." />
      </div>
    )
  }

  // Contract Status Doughnut Chart Data
  const contractStatusLabels = Object.keys(contractDist).length > 0 ? Object.keys(contractDist) : ['Draft', 'Active', 'Completed']
  const contractStatusValues = Object.keys(contractDist).length > 0 ? Object.values(contractDist) : [0, 0, 0]
  const hasContractData = contractStatusValues.some(v => v > 0)

  const contractChartData = {
    labels: contractStatusLabels,
    datasets: [
      {
        data: hasContractData ? contractStatusValues : [1],
        backgroundColor: hasContractData
          ? ['#627D98', '#287A4B', '#C0392B', '#E58A24', '#102A43']
          : ['#E2E8F0'],
        borderWidth: 0,
      },
    ],
  }

  // Payment Method Breakdown Bar Chart Data
  const paymentMethodLabels = Object.keys(paymentMethodDist).length > 0 ? Object.keys(paymentMethodDist) : ['RTGS', 'NEFT', 'IMPS', 'Cheque', 'DD']
  const paymentMethodValues = Object.keys(paymentMethodDist).length > 0 ? Object.values(paymentMethodDist) : [0, 0, 0, 0, 0]
  const hasPaymentData = paymentMethodValues.some(v => v > 0)

  const paymentChartData = {
    labels: paymentMethodLabels,
    datasets: [
      {
        label: 'Disbursement Volume',
        data: paymentMethodValues,
        backgroundColor: '#287A4B',
        borderRadius: 4,
      },
    ],
  }

  // Requisition Priority Chart Data
  const priorityLabels = Object.keys(reqPriorityDist).length > 0 ? Object.keys(reqPriorityDist) : ['Urgent', 'High', 'Medium', 'Low']
  const priorityValues = Object.keys(reqPriorityDist).length > 0 ? Object.values(reqPriorityDist) : [0, 0, 0, 0]
  const hasPriorityData = priorityValues.some(v => v > 0)

  const priorityChartData = {
    labels: priorityLabels,
    datasets: [
      {
        label: 'Requisitions by Priority',
        data: priorityValues,
        backgroundColor: ['#C0392B', '#E58A24', '#334E68', '#627D98'],
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="container-fluid p-0">
      {/* Security Classification Header Banner */}
      <div
        className="alert alert-dark py-1 px-3 mb-3 d-flex align-items-center justify-content-between font-monospace"
        style={{
          fontSize: '0.72rem',
          backgroundColor: '#0B1F33',
          color: '#E58A24',
          border: '1px solid #102A43',
        }}
      >
        <span>
          <i className="bi bi-shield-lock-fill me-2"></i>
          SECURITY CLASSIFICATION: RESTRICTED // DEFENCE PROCUREMENT PLATFORM
        </span>
        <span className="d-none d-md-inline text-muted">
          DPP 2024 &bull; DFR COMPLIANT &bull; ISO 27001 AUDITED
        </span>
      </div>

      {/* Main Command Header */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: '#102A43' }}>
              Strategic Command &amp; Intelligence Overview
            </h4>
            <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>
              MODULE 7
            </span>
          </div>
          <p className="text-muted small mb-0">
            Welcome back, <strong className="text-dark">{user?.first_name || user?.username}</strong> &bull; Role:{' '}
            <span className="badge bg-light text-primary border">{user?.role || 'Authorized Officer'}</span> &bull; Synchronized at {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            title="Refresh analytics data"
          >
            <i className={`bi bi-arrow-clockwise ${refreshing ? 'spin-animation' : ''}`}></i>
            <span>{refreshing ? 'Updating...' : 'Refresh Feed'}</span>
          </button>

          {canWrite() && (
            <div className="btn-group btn-group-sm shadow-sm">
              <Link to="/app/contracts/new" className="btn btn-navy d-flex align-items-center gap-1">
                <i className="bi bi-plus-lg text-warning"></i>
                <span>Register Contract</span>
              </Link>
              <Link to="/app/procurement/requisitions/new" className="btn btn-outline-secondary d-none d-sm-flex align-items-center gap-1">
                <i className="bi bi-cart-plus"></i>
                <span>New Requisition</span>
              </Link>
              <Link to="/app/finance/invoices/new" className="btn btn-outline-secondary d-none d-md-flex align-items-center gap-1">
                <i className="bi bi-receipt"></i>
                <span>Invoice</span>
              </Link>
              <Link to="/app/finance/payments/new" className="btn btn-outline-secondary d-none d-lg-flex align-items-center gap-1">
                <i className="bi bi-cash-stack"></i>
                <span>Disbursement</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Row 1: Primary Defence Mission KPIs */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-file-earmark-check-fill"
            title="Active Contracts"
            value={stats?.activeContracts}
            color="#287A4B"
            link="/app/contracts?status=Active"
            subtitle="Under active execution & tracking"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-clipboard-check-fill"
            title="Pending Requisitions"
            value={stats?.pendingRequisitions}
            color="#E58A24"
            link="/app/procurement/requisitions?status=Pending"
            subtitle="Awaiting committee scrutiny"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-building-check"
            title="Vetted Suppliers"
            value={stats?.totalVendors}
            color="#102A43"
            link="/app/vendors"
            subtitle="Indigenous & empanelled vendors"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-cash-coin"
            title="Settled Disbursements"
            value={stats?.completedPayments}
            color="#0B69A3"
            link="/app/finance/payments?status=Completed"
            subtitle="Cleared treasury payments"
          />
        </div>
      </div>

      {/* Row 2: Secondary Tactical Pipeline Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-folder2-open"
            title="Total Contracts"
            value={stats?.totalContracts}
            color="#334E68"
            link="/app/contracts"
            subtitle="Lifetime contract repository"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-calendar-range"
            title="Master Plans"
            value={stats?.totalPlans}
            color="#486581"
            link="/app/procurement/plans"
            subtitle="Annual procurement strategies"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-receipt-cutoff"
            title="Invoices in Scrutiny"
            value={stats?.pendingInvoices}
            color="#C0392B"
            link="/app/finance/invoices?status=Submitted"
            subtitle="Submitted contractor bills"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon="bi-pencil-square"
            title="Draft Contracts"
            value={stats?.draftContracts}
            color="#627D98"
            link="/app/contracts?status=Draft"
            subtitle="Under drafting & legal review"
          />
        </div>
      </div>

      {/* Visual Analytics Grid: 3 Interactive Charts */}
      <div className="row g-4 mb-4">
        {/* Chart 1: Contract Lifecycle Status Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold small text-uppercase" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
                <i className="bi bi-pie-chart-fill me-2 text-primary"></i>
                Contract Lifecycle Status
              </span>
              <span className="badge bg-light text-muted border">Live Distribution</span>
            </div>
            <div className="card-body d-flex flex-column justify-content-center align-items-center p-3" style={{ minHeight: 240 }}>
              {hasContractData ? (
                <div style={{ position: 'relative', width: '100%', maxHeight: 200 }}>
                  <Doughnut
                    data={contractChartData}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { boxWidth: 12, font: { size: 11 } },
                        },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-muted small py-4">
                  <i className="bi bi-pie-chart display-6 d-block mb-2 text-secondary opacity-50"></i>
                  No contracts currently filed
                </div>
              )}
            </div>
            <div className="card-footer bg-light border-0 py-2 small text-muted text-center" style={{ fontSize: '0.72rem' }}>
              Tracks active, draft, completed, and terminated contracts
            </div>
          </div>
        </div>

        {/* Chart 2: Banking Settlement Methods */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold small text-uppercase" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
                <i className="bi bi-bank me-2 text-success"></i>
                Disbursement Banking Modes
              </span>
              <span className="badge bg-light text-muted border">Treasury Clearances</span>
            </div>
            <div className="card-body p-3 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 240 }}>
              {hasPaymentData ? (
                <div style={{ position: 'relative', width: '100%', maxHeight: 200 }}>
                  <Bar
                    data={paymentChartData}
                    options={{
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { precision: 0, font: { size: 10 } },
                        },
                        x: {
                          ticks: { font: { size: 10 } },
                        },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-muted small py-4">
                  <i className="bi bi-bar-chart display-6 d-block mb-2 text-secondary opacity-50"></i>
                  No disbursements recorded yet
                </div>
              )}
            </div>
            <div className="card-footer bg-light border-0 py-2 small text-muted text-center" style={{ fontSize: '0.72rem' }}>
              RTGS (High Value), NEFT, IMPS, Cheques &amp; Demand Drafts
            </div>
          </div>
        </div>

        {/* Chart 3: Requisition Priority Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold small text-uppercase" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
                <i className="bi bi-speedometer2 me-2 text-danger"></i>
                Requisition Urgency Index
              </span>
              <span className="badge bg-light text-muted border">Procurement Demand</span>
            </div>
            <div className="card-body p-3 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 240 }}>
              {hasPriorityData ? (
                <div style={{ position: 'relative', width: '100%', maxHeight: 200 }}>
                  <Bar
                    data={priorityChartData}
                    options={{
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { precision: 0, font: { size: 10 } },
                        },
                        x: {
                          ticks: { font: { size: 10 } },
                        },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-muted small py-4">
                  <i className="bi bi-lightning-charge display-6 d-block mb-2 text-secondary opacity-50"></i>
                  No active requisitions logged
                </div>
              )}
            </div>
            <div className="card-footer bg-light border-0 py-2 small text-muted text-center" style={{ fontSize: '0.72rem' }}>
              Operational prioritization across command formations
            </div>
          </div>
        </div>
      </div>

      {/* Operational Ledgers: Recent Contracts, Requisitions, & Payments */}
      <div className="row g-4 mb-4">
        {/* Recent Contracts Stream */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 bg-white h-100 overflow-hidden">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold small text-uppercase" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
                <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                Recent Defence Contracts
              </span>
              <Link to="/app/contracts" className="small fw-semibold text-decoration-none" style={{ color: '#E58A24' }}>
                View All Contracts &rarr;
              </Link>
            </div>
            <div className="card-body p-0">
              {recentContracts.length === 0 ? (
                <div className="text-center py-4 text-muted small">No contracts filed</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-3">Contract #</th>
                        <th className="border-0">Title</th>
                        <th className="border-0 text-end">Value</th>
                        <th className="border-0 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentContracts.map(c => (
                        <tr key={c.id}>
                          <td className="ps-3 font-monospace fw-bold">
                            <Link to={`/app/contracts/${c.id}`} className="text-decoration-none text-primary">
                              {c.contract_number}
                            </Link>
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '180px' }} title={c.title}>
                            {c.title}
                          </td>
                          <td className="text-end fw-semibold text-dark">
                            {formatINR(c.value)}
                          </td>
                          <td className="text-center">
                            <StatusBadge status={c.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Requisitions Stream */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 bg-white h-100 overflow-hidden">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold small text-uppercase" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
                <i className="bi bi-cart3 me-2 text-warning"></i>
                Recent Procurement Requisitions
              </span>
              <Link to="/app/procurement/requisitions" className="small fw-semibold text-decoration-none" style={{ color: '#E58A24' }}>
                View All Requisitions &rarr;
              </Link>
            </div>
            <div className="card-body p-0">
              {recentReqs.length === 0 ? (
                <div className="text-center py-4 text-muted small">No requisitions submitted</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-3">Req #</th>
                        <th className="border-0">Title</th>
                        <th className="border-0 text-center">Priority</th>
                        <th className="border-0 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReqs.map(r => (
                        <tr key={r.id}>
                          <td className="ps-3 font-monospace fw-bold">
                            <Link to={`/app/procurement/requisitions/${r.id}`} className="text-decoration-none text-primary">
                              {r.requisition_number}
                            </Link>
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '180px' }} title={r.title}>
                            {r.title}
                          </td>
                          <td className="text-center">
                            <span className={`priority-${r.priority?.toLowerCase()}`}>
                              {r.priority}
                            </span>
                          </td>
                          <td className="text-center">
                            <StatusBadge status={r.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Banking Disbursements Ledger */}
      <div className="card border-0 shadow-sm rounded-3 bg-white mb-4 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <span className="fw-bold small text-uppercase" style={{ color: '#102A43', letterSpacing: '0.5px' }}>
            <i className="bi bi-cash-stack me-2 text-success"></i>
            Recent Treasury Disbursements
          </span>
          <Link to="/app/finance/payments" className="small fw-semibold text-decoration-none" style={{ color: '#E58A24' }}>
            View Full Payment Ledger &rarr;
          </Link>
        </div>
        <div className="card-body p-0">
          {recentPayments.length === 0 ? (
            <div className="text-center py-4 text-muted small">No disbursement records found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                <thead className="table-light">
                  <tr>
                    <th className="border-0 ps-3">Payment Ref #</th>
                    <th className="border-0">Associated Invoice</th>
                    <th className="border-0">Settlement Date</th>
                    <th className="border-0">Transfer Method</th>
                    <th className="border-0 text-end">Amount Disbursed</th>
                    <th className="border-0 text-center">Clearance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map(p => (
                    <tr key={p.id}>
                      <td className="ps-3 font-monospace fw-bold text-primary">
                        {p.payment_reference}
                      </td>
                      <td>
                        <Link to={`/app/finance/invoices/${p.invoice}`} className="text-decoration-none fw-semibold">
                          {p.invoice_number || `Invoice #${p.invoice}`}
                        </Link>
                      </td>
                      <td className="text-muted">{formatDate(p.payment_date)}</td>
                      <td>
                        <span className="badge bg-light text-dark border">{p.payment_method}</span>
                      </td>
                      <td className="text-end fw-bold text-success">
                        {formatINR(p.amount)}
                      </td>
                      <td className="text-center">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Compliance & Indigenous Defence Banner */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-light border-start border-4 border-primary">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-patch-check-fill text-primary fs-3"></i>
            <div>
              <div className="fw-bold text-dark small">
                Make in India &amp; Atmanirbhar Bharat Defence Procurement Compliance
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                All procurement plans, vendor assessments, and financial vouchers adhere strictly to Defence Financial Regulations (DFR 2024) and DPP standards.
              </div>
            </div>
          </div>
          <span className="badge bg-primary text-white font-monospace px-3 py-2 align-self-start align-self-md-center">
            AUDITED &bull; SECURE
          </span>
        </div>
      </div>
    </div>
  )
}
