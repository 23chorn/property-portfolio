// Monthly interest-only payment
export function calcMonthlyInterestOnly(balance, annualRatePercent) {
  return (balance * (annualRatePercent / 100)) / 12
}

// Monthly repayment payment (annuity formula)
export function calcMonthlyRepayment(balance, annualRatePercent, termYears) {
  const r = annualRatePercent / 100 / 12
  if (r === 0) return balance / (termYears * 12)
  const n = termYears * 12
  return (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// Section 24 tax calculation
export function calcSection24Tax(annualRent, allowableExpenses, mortgageInterest, taxRate, personalAllowance, claimsAllowance) {
  const pa = claimsAllowance ? personalAllowance : 0
  // S24: mortgage interest is NOT deductible from profit, but gets a 20% tax credit
  const taxableProfit = Math.max(0, annualRent - allowableExpenses - pa)
  const grossTax = taxableProfit * (taxRate / 100)
  const taxCredit = mortgageInterest * 0.20
  const netTax = Math.max(0, grossTax - taxCredit)
  return { taxableProfit, grossTax, taxCredit, netTax }
}

// Annual net cashflow (pre-tax)
export function calcAnnualNet(annualRent, annualCosts, monthlyMortgage) {
  return annualRent - annualCosts - (monthlyMortgage * 12)
}

// After-tax monthly cashflow
export function calcAfterTaxMonthly(annualNet, netTax) {
  return (annualNet - netTax) / 12
}

// LTV at a given year
export function calcLTV(balance, currentValue, growthRate, year) {
  const futureValue = calcFutureValue(currentValue, growthRate, year)
  return (balance / futureValue) * 100
}

// Future property value
export function calcFutureValue(currentValue, growthRate, years) {
  return currentValue * Math.pow(1 + growthRate / 100, years)
}

// Net equity after sale
export function calcNetEquity(futureValue, mortgageBalance, purchasePrice, cgtRate, agentFeePercent = 1.5, conveyancingCost = 2000, annualExempt = 3000) {
  const agentFee = futureValue * (agentFeePercent / 100)
  const gain = futureValue - purchasePrice
  const taxableGain = Math.max(0, gain - annualExempt)
  const cgt = taxableGain * (cgtRate / 100)
  return futureValue - mortgageBalance - agentFee - conveyancingCost - cgt
}

// Monthly saving required to accumulate a target amount
export function calcRepaymentVehiclePMT(target, annualReturn, years) {
  const r = annualReturn / 100 / 12
  const n = years * 12
  if (r === 0) return target / n
  return (target * r) / (Math.pow(1 + r, n) - 1)
}

// Calculate all annual costs for a property at a given year
export function calcAnnualCosts(property, year = 0) {
  const { rental, costs, meta } = property
  const annualRent = rental.monthlyRent * (12 - rental.voidMonthsPerYear)
  const managementFee = annualRent * (costs.managementFeePercent / 100)
  const maintenance = meta.currentEstimatedValue * calcFutureValue(1, property.projections.houseGrowthRate, year) * (costs.maintenancePercent / 100) * (meta.currentEstimatedValue > 0 ? 1 / meta.currentEstimatedValue : 0)
  const maintenanceCost = meta.currentEstimatedValue * (costs.maintenancePercent / 100)

  return {
    annualRent,
    managementFee,
    tenantFindFee: costs.tenantFindFeeAnnualised,
    compliance: costs.complianceAnnual,
    insurance: costs.insuranceAnnual,
    maintenance: maintenanceCost,
    totalCosts: managementFee + costs.tenantFindFeeAnnualised + costs.complianceAnnual + costs.insuranceAnnual + maintenanceCost,
  }
}

// Get monthly mortgage payment based on type
export function calcMonthlyMortgage(property) {
  const { mortgage } = property
  if (mortgage.type === 'interest-only') {
    return calcMonthlyInterestOnly(mortgage.balance, mortgage.currentRate)
  }
  return calcMonthlyRepayment(mortgage.balance, mortgage.currentRate, property.projections.mortgageClearYear)
}

// Build a full projection model
export function buildProjection(property) {
  const { mortgage, rental, costs, meta, projections, tax } = property
  const totalYears = projections.mortgageClearYear + projections.phase2Years
  const monthlyMortgage = calcMonthlyMortgage(property)
  const annualMortgage = monthlyMortgage * 12
  const mortgageInterestAnnual = mortgage.type === 'interest-only'
    ? annualMortgage
    : mortgage.balance * (mortgage.currentRate / 100) // approximate first-year interest

  const years = []
  let cumulativeCashflow = 0

  for (let y = 1; y <= totalYears; y++) {
    const isPhase2 = y > projections.mortgageClearYear
    const rentGrowthMultiplier = Math.pow(1 + rental.rentGrowthRate / 100, y)
    const monthlyRentAtYear = rental.monthlyRent * rentGrowthMultiplier
    const annualRent = monthlyRentAtYear * (12 - rental.voidMonthsPerYear)

    const propertyValue = calcFutureValue(meta.currentEstimatedValue, projections.houseGrowthRate, y)
    const maintenanceCost = propertyValue * (costs.maintenancePercent / 100)
    const managementFee = annualRent * (costs.managementFeePercent / 100)

    const totalAnnualCosts = managementFee + costs.tenantFindFeeAnnualised +
      costs.complianceAnnual + costs.insuranceAnnual + maintenanceCost

    // Add EPC upgrade cost if applicable
    let epcCost = 0
    if (costs.epcUpgradeCost > 0 && y === costs.epcUpgradeYear) {
      epcCost = costs.epcUpgradeCost
    }

    const yearlyMortgage = isPhase2 ? 0 : annualMortgage
    const preTaxNet = annualRent - totalAnnualCosts - yearlyMortgage - epcCost

    // Section 24 tax
    const allowableExpenses = totalAnnualCosts + epcCost
    const yearMortgageInterest = isPhase2 ? 0 : mortgageInterestAnnual
    const s24 = calcSection24Tax(
      annualRent,
      allowableExpenses,
      yearMortgageInterest,
      tax.taxRate,
      tax.personalAllowance,
      tax.claimsPersonalAllowance
    )

    const afterTaxNet = preTaxNet - s24.netTax
    cumulativeCashflow += afterTaxNet

    const ltv = isPhase2 ? 0 : calcLTV(mortgage.balance, meta.currentEstimatedValue, projections.houseGrowthRate, y)
    const equity = propertyValue - (isPhase2 ? 0 : mortgage.balance)

    years.push({
      year: y,
      phase: isPhase2 ? 2 : 1,
      monthlyRent: monthlyRentAtYear,
      annualRent,
      totalCosts: totalAnnualCosts,
      epcCost,
      mortgagePayment: yearlyMortgage,
      preTaxNet,
      tax: s24.netTax,
      afterTaxNet,
      cumulativeCashflow,
      propertyValue,
      ltv,
      equity,
      monthlyNet: afterTaxNet / 12,
    })
  }

  return years
}
