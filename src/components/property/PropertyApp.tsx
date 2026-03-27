import { useState } from 'react'
import { usePropertyStore } from '../../store/usePropertyStore.ts'
import Sidebar from '../layout/Sidebar.tsx'
import Header from '../layout/Header.tsx'
import PropertyOverview from './PropertyOverview.tsx'
import PropertyConfig from './PropertyConfig.tsx'
import CostBreakdown from './CostBreakdown.tsx'
import MortgageModel from './MortgageModel.tsx'
import RateSensitivity from './RateSensitivity.tsx'
import ProjectionModel from './ProjectionModel.tsx'
import SellVsHold from './SellVsHold.tsx'

export default function PropertyApp() {
  const [activeSection, setActiveSection] = useState('overview')
  const store = usePropertyStore()
  const { activeProperty, updateField, resetSection, loading, saveStatus } = store

  if (loading) {
    return (
      <div className="h-full bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-400 text-sm">Loading property data...</p>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <PropertyOverview property={activeProperty} onNavigate={setActiveSection} />
      case 'config':
        return <PropertyConfig property={activeProperty} updateField={updateField} resetSection={resetSection} />
      case 'costs':
        return <CostBreakdown property={activeProperty} />
      case 'mortgage':
        return <MortgageModel property={activeProperty} />
      case 'rates':
        return <RateSensitivity property={activeProperty} />
      case 'projections':
        return <ProjectionModel property={activeProperty} />
      case 'sellvshold':
        return <SellVsHold property={activeProperty} />
      default:
        return <PropertyOverview property={activeProperty} onNavigate={setActiveSection} />
    }
  }

  return (
    <div className="h-full flex">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        propertyName={activeProperty.meta.name}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header property={activeProperty} saveStatus={saveStatus} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
