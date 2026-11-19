import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats, getRecentContracts, getRecentRequisitions, getContractStatusDistribution } from '../../api/dashboardApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { formatINR } from '../../utils/formatters.js'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

function StatCard({ icon, title, value, color = '#102A43', link, bgClass = '' }) {
  return (
    <div className={`stat-card ${bgClass}`} style={{ borderLeftColor: color }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div style={{ fontSize: '.8rem', color: '#627D98', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>{title}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#102A43' }}>{value ?? '—'}</div>
        </div>
        <div style={{ width: 48, height: 48, background: color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={`bi ${icon} text-white fs-5`}></i>
        </div>
      </div>
      {link && <Link to={link} style={{ fontSize: '.78rem', color: color, fontWeight: 600, textDecoration: 'none', display: 'block', marginTop: '12px' }}>View all →</Link>}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentContracts, setRecentContracts] = useState([])
  const [recentReqs, setRecentReqs] = useState([])
  const [contractDist, setContractDist] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, rc, rr, cd] = await Promise.all([
          getDashboardStats(),
          getRecentContracts(),
          getRecentRequisitions(),
          getContractStatusDistribution(),
        ])
        setStats(s)
        const extractList = (r) => r.data?.data?.results ?? r.data?.results ?? []
        setRecentContracts(extractList(rc))
        setRecentReqs(extractList(rr))
        setContractDist(cd)
      } catch (e) {
        console.error('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  const doughnutData = {
    labels: Object.keys(contractDist),
    datasets: [{
      data: Object.values(contractDist),
      backgroundColor: ['#627D98','#287A4B','#C0392B','#E58A24','#102A43'],
      borderWidth: 0,
    }]
  }

  return (
    <div>
      {/* Welcome */}
      <div className="mb-4">
        <h4 style={{ color: '#102A43', fontWeight: 800 }}>Welcome back, {user?.first_name || user?.username} 👋</h4>
        <p style={{ color: '#627D98', margin: 0 }}>Here is your ContractCommand overview for today.</p>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-file-earmark-text" title="Total Contracts" value={stats?.totalContracts} link="/app/contracts" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-check-circle-fill" title="Active Contracts" value={stats?.activeContracts} color="#287A4B" link="/app/contracts?status=Active" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-clipboard-check" title="Pending Requisitions" value={stats?.pendingRequisitions} color="#E58A24" link="/app/procurement/requisitions?status=Pending" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-building-check" title="Registered Vendors" value={stats?.totalVendors} color="#334E68" link="/app/vendors" /></div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-clipboard-data" title="Procurement Plans" value={stats?.totalPlans} color="#334E68" link="/app/procurement/plans" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-receipt" title="Pending Invoices" value={stats?.pendingInvoices} color="#C0392B" link="/app/finance/invoices?status=Submitted" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-cash-coin" title="Completed Payments" value={stats?.completedPayments} color="#287A4B" link="/app/finance/payments?status=Completed" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-pencil-square" title="Draft Contracts" value={stats?.draftContracts} color="#627D98" link="/app/contracts?status=Draft" /></div>
      </div>

      {/* Charts + Recent */}
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header" style={{ background: '#F3F6F9', border: 'none', fontWeight: 700, color: '#102A43' }}>Contract Status Distribution</div>
            <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: 220 }}>
              {Object.values(contractDist).some(v => v > 0)
                ? <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }} style={{ maxHeight: 200 }} />
                : <span className="text-muted small">No contract data available</span>}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ background: '#F3F6F9', border: 'none' }}>
              <span className="fw-bold" style={{ color: '#102A43' }}>Recent Contracts</span>
              <Link to="/app/contracts" style={{ fontSize: '.82rem', color: '#E58A24', fontWeight: 600 }}>View All</Link>
            </div>
            <div className="card-body p-0">
              {recentContracts.length === 0 ? (
                <div className="text-center py-4 text-muted small">No contracts found</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={{ fontSize: '.85rem' }}>
                    <thead style={{ background: '#F9FAFB' }}>
                      <tr>
                        <th className="border-0 ps-3" style={{ color: '#627D98', fontWeight: 600 }}>Contract #</th>
                        <th className="border-0" style={{ color: '#627D98', fontWeight: 600 }}>Title</th>
                        <th className="border-0" style={{ color: '#627D98', fontWeight: 600 }}>Value</th>
                        <th className="border-0" style={{ color: '#627D98', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentContracts.map(c => (
                        <tr key={c.id}>
                          <td className="ps-3"><Link to={`/app/contracts/${c.id}`} style={{ color: '#102A43', fontWeight: 600, textDecoration: 'none' }}>{c.contract_number}</Link></td>
                          <td style={{ color: '#334E68' }}>{c.title?.substring(0, 35)}{c.title?.length > 35 ? '…' : ''}</td>
                          <td style={{ color: '#102A43', fontWeight: 600 }}>{formatINR(c.value)}</td>
                          <td><StatusBadge status={c.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ background: '#F3F6F9', border: 'none' }}>
              <span className="fw-bold" style={{ color: '#102A43' }}>Recent Requisitions</span>
              <Link to="/app/procurement/requisitions" style={{ fontSize: '.82rem', color: '#E58A24', fontWeight: 600 }}>View All</Link>
            </div>
            <div className="card-body p-0">
              {recentReqs.length === 0 ? (
                <div className="text-center py-4 text-muted small">No requisitions found</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={{ fontSize: '.85rem' }}>
                    <thead style={{ background: '#F9FAFB' }}>
                      <tr>
                        <th className="border-0 ps-3" style={{ color: '#627D98', fontWeight: 600 }}>Req #</th>
                        <th className="border-0" style={{ color: '#627D98', fontWeight: 600 }}>Title</th>
                        <th className="border-0" style={{ color: '#627D98', fontWeight: 600 }}>Priority</th>
                        <th className="border-0" style={{ color: '#627D98', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReqs.map(r => (
                        <tr key={r.id}>
                          <td className="ps-3"><Link to={`/app/procurement/requisitions/${r.id}`} style={{ color: '#102A43', fontWeight: 600, textDecoration: 'none' }}>{r.requisition_number}</Link></td>
                          <td style={{ color: '#334E68' }}>{r.title?.substring(0, 35)}{r.title?.length > 35 ? '…' : ''}</td>
                          <td><span className={`priority-${r.priority?.toLowerCase()}`}>{r.priority}</span></td>
                          <td><StatusBadge status={r.status} /></td>
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
    </div>
  )
}
