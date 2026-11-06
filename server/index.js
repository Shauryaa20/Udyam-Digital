import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'

const app = express()
app.use(cors())
app.use(express.json())

const bundles = [
  { id: 'dukaan-starter', name: 'Dukaan Starter', tag: 'Best for growing stores', price: 2196, description: 'Everything a modern neighbourhood store needs to sell, connect and grow.', features: ['Fibre 100 Mbps', '2 Postpaid 299', 'Cloud POS'], addOns: [{ id: 'wifi', name: 'Managed Wi-Fi', price: 399 }, { id: 'cctv', name: 'CCTV monitoring', price: 199 }, { id: 'whatsapp', name: 'WhatsApp Business', price: 999 }] },
  { id: 'office-pro', name: 'Office Pro', tag: 'Most popular', price: 4815, description: 'Secure connectivity and productivity tools for professional teams.', features: ['Fibre 300 Mbps', '2 Postpaid 599', 'Email x5', 'Endpoint x5', 'Backup & Failover'], addOns: [{ id: 'sdwan', name: 'SD-WAN', price: 1299 }, { id: 'cctv', name: 'CCTV monitoring', price: 199 }] },
  { id: 'one-bill', name: 'One Bill', tag: 'For multi-site teams', price: 17970, description: 'One reliable connection and one simple bill across every business location.', features: ['5 business sites', 'Fibre 300 Mbps', 'Failover', 'POS', '10 CCTV', 'Postpaid x5'], addOns: [{ id: 'sdwan', name: 'SD-WAN', price: 2499 }] },
  { id: 'plant-connect', name: 'Plant Connect', tag: 'For manufacturing', price: 12739, description: 'Industrial-grade connectivity with security and IoT visibility.', features: ['Leased Line 20 Mbps', 'Firewall', '10 IoT devices', 'Email x10'], addOns: [{ id: 'cctv', name: 'CCTV monitoring', price: 499 }, { id: 'sdwan', name: 'SD-WAN', price: 2499 }] }
]

const registry = { '27AABCU9603R1ZM': { name: 'Udyam Foods & Retail', status: 'Active', state: 'Maharashtra' }, '29AAACR5055K1Z5': { name: 'Riya Clinic', status: 'Active', state: 'Karnataka' } }
const uid = (prefix) => `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.get('/api/bundles', (_req, res) => res.json(bundles))
app.post('/api/advisor/recommend', (req, res) => {
  const { category, locations, employees, broadband, needs = [], budget } = req.body
  let bundle = bundles[0]
  if (category === 'Small Manufacturing') bundle = bundles[3]
  else if (Number(locations) > 1 || needs.includes('CCTV')) bundle = bundles[2]
  else if (category === 'Professional Office' || Number(employees) > 10 || needs.includes('Cloud services')) bundle = bundles[1]
  if (budget && Number(budget) < bundle.price && category !== 'Small Manufacturing') bundle = bundles[0]
  res.json({ bundle, rationale: `Based on your ${category || 'business'} profile, ${bundle.name} balances reliable connectivity, useful business tools and your stated scale.`, conversationId: uid('AD') })
})
app.post('/api/quotes', (req, res) => {
  const { bundleId, addOns = [] } = req.body
  const bundle = bundles.find((item) => item.id === bundleId) || bundles[0]
  const selected = bundle.addOns.filter((item) => addOns.includes(item.id))
  const monthly = bundle.price + selected.reduce((sum, item) => sum + item.price, 0)
  res.json({ id: uid('QT'), bundle, addOns: selected, monthly, setup: 999, tax: Math.round(monthly * 0.18), createdAt: new Date().toISOString() })
})
app.post('/api/kyc/verify', (req, res) => {
  const { gstin, businessName, consent } = req.body
  if (!consent) return res.status(400).json({ message: 'Consent is required before submitting documents.' })
  const record = registry[String(gstin || '').toUpperCase()]
  if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(String(gstin || '').toUpperCase())) return res.json({ status: 'FLAGGED', message: 'GSTIN format is invalid. Please check the 15-character identifier.' })
  if (!record) return res.json({ status: 'MANUAL REVIEW', message: 'This demo GSTIN is not present in the mock registry. A human reviewer must validate it.' })
  if (record.name.toLowerCase() !== String(businessName || '').toLowerCase()) return res.json({ status: 'FLAGGED', message: `Business name does not match the mock registry record (${record.name}).` })
  res.json({ status: 'VERIFIED', message: 'Business identity matched the mock registry. Documents are accepted for this demo.', maskedGstin: `${gstin.slice(0, 2)}******${gstin.slice(-3)}` })
})
app.post('/api/orders', (req, res) => res.json({ orderId: uid('ORD'), expectedDate: new Date(Date.now() + 5 * 86400000).toISOString(), partner: 'Airtel Connect Partner · Mumbai West', statusIndex: 2 }))
app.listen(process.env.PORT || 4000, () => console.log(`Udyam API running on port ${process.env.PORT || 4000}`))
