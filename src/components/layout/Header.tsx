import SaveStatus from '../shared/SaveStatus'

function Badge({ label, value, variant = 'default' }) {
  const variants = {
    default: 'bg-stone-700 text-stone-400',
    warning: 'bg-amber-500/10 text-amber-400',
    info: 'bg-rose-600/10 text-rose-400',
    success: 'bg-emerald-500/10 text-emerald-400',
    danger: 'bg-rose-600/10 text-rose-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-xs font-medium ${variants[variant]}`}>
      {label && <span className="text-stone-500">{label}</span>}
      {value}
    </span>
  )
}

export default function Header({ property, saveStatus }) {
  const { meta, mortgage, tax } = property
  const ltv = ((mortgage.balance / meta.currentEstimatedValue) * 100).toFixed(1)
  const ltvVariant = ltv <= 60 ? 'success' : ltv <= 75 ? 'warning' : 'danger'

  return (
    <header className="min-h-[3.5rem] bg-stone-800 border-b border-stone-700 flex items-center justify-between px-4 sm:px-6 py-2 shrink-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pl-10 lg:pl-0">
        <h2 className="text-sm sm:text-base font-medium text-stone-100 truncate">{meta.name}</h2>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Badge label="LTV" value={`${ltv}%`} variant={ltvVariant} />
          <Badge label={mortgage.type === 'interest-only' ? 'I/O' : 'Repayment'} value={`${mortgage.currentRate}%`} variant="info" />
          {!tax.nrlsRegistered && (
            <Badge label="" value="NRLS" variant="danger" />
          )}
        </div>
      </div>
      <SaveStatus status={saveStatus} />
    </header>
  )
}
