if (window.isControllerLoaded) return;
window.isControllerLoaded = true;

self.options.noAlerts = true;
self.redraw();

const $pricePerWattAfterIncentives = self.getComponent(
  "pricePerWattAfterIncentives"
);
const $totalCostBeforeIncentives = self.getComponent(
  "totalCostBeforeIncentives"
);
const $totalCostAfterIncentives = self.getComponent("totalCostAfterIncentives");
const $incentiveAmount = self.getComponent("incentiveAmount");
const $incentivesList = self.getComponent("incentivesList");
const $systemSize = self.getComponent("systemSize");
const $oneTimePayment = self.getComponent("oneTimePayment");
const $savingsPeriod = self.getComponent("savingsPeriod");
const $yearlySavingsBreakdown = self.getComponent("yearlySavingsBreakdown");
const $monthlyElectricBill = self.getComponent("monthlyElectricBill");
const $electricityBillWithSolar = self.getComponent("electricityBillWithSolar");
const $costIncreaseConst = self.getComponent("constantCostIncrease");
const $totalProducedEnergy = self.getComponent("totalProducedEnergy");
const $annualDegradationRate = self.getComponent("annualDegradationRate");
const $co2AbsorptionPerTree = self.getComponent("co2AbsorptionPerTree");
const $treesGrown = self.getComponent("treesGrown");
const $co2EmissionFactor = self.getComponent("co2EmissionFactor");
const $energyEquivalentPerGallonOfGas = self.getComponent(
  "energyEquivalentPerGallonOfGas"
);
const $tonsOfCo2Avoided = self.getComponent("tonsOfCo2Avoided");
const $notUsedGasGallons = self.getComponent("notUsedGasGallons");
const $annualEnergyProductionEstimated = self.getComponent(
  "annualEnergyProductionEstimated"
);

function calculatePricePerWattAfterIncentives() {
  const afterIncentives = $totalCostAfterIncentives.getValue();
  const systemSize = $systemSize.getValue();

  if (!afterIncentives || !systemSize) {
    $pricePerWattAfterIncentives.setValue(0);
    return;
  }

  $pricePerWattAfterIncentives.setValue(afterIncentives / (systemSize * 1000));
}

function calculateTotalCostAfterIncentives() {
  let incentiveAmounts = 0;
  const totalCostBeforeIncentives = $totalCostBeforeIncentives.getValue() || 0;
  const incentivesList = $incentivesList.getValue();

  if (incentivesList) {
    incentiveAmounts = incentivesList.reduce(
      (sum, item) =>
        item.incentives.data.incentiveAmount
          ? sum + item.incentives.data.incentiveAmount
          : sum,
      0
    );
  }

  $totalCostAfterIncentives.setValue(
    totalCostBeforeIncentives - incentiveAmounts
  );
}

function createHandler(fields, callback) {
  return (options, ...rest) => {
    if (!options || !options.changed || !options.changed.component) return;
    console.info(
      "Field " +
        "[" +
        options.changed.component.key +
        "]" +
        " was changed. \n" +
        "Fields to listen [" +
        fields.join(", ") +
        "]."
    );
    if (!fields.includes(options.changed.component.key)) return;

    return callback(options, ...rest);
  };
}

function calculateEnvironmentalImpact() {
  let savingsPeriod = $savingsPeriod.getValue();
  const annualEnergyProductionEstimated =
    $annualEnergyProductionEstimated.getValue();
  const annualDegradationRate = $annualDegradationRate.getValue();
  const co2EmissionFactor = $co2EmissionFactor.getValue();
  const co2AbsorptionPerTree = $co2AbsorptionPerTree.getValue();
  const energyEquivalentPerGallonOfGas =
    $energyEquivalentPerGallonOfGas.getValue();

  savingsPeriod = savingsPeriod ? parseInt(savingsPeriod) : 0;

  let totalProducedEnergy = 0;
  for (let i = 1; i <= savingsPeriod; i++) {
    if (i === 1) {
      totalProducedEnergy += annualEnergyProductionEstimated;
      continue;
    }

    totalProducedEnergy +=
      annualEnergyProductionEstimated * (1 - annualDegradationRate);
  }
  const tonsOfCo2Avoided = totalProducedEnergy / (co2EmissionFactor * 1000);

  $tonsOfCo2Avoided.setValue(tonsOfCo2Avoided);

  $treesGrown.setValue(tonsOfCo2Avoided / co2AbsorptionPerTree);

  $notUsedGasGallons.setValue(
    tonsOfCo2Avoided / energyEquivalentPerGallonOfGas
  );
}

function calculateCashYears() {
  let savingsPeriod = $savingsPeriod.getValue();
  const monthlyElectricBill = $monthlyElectricBill.getValue() || 0;
  const electricityBillWithSolar = $electricityBillWithSolar.getValue() || 0;
  const totalCostBeforeIncentives = $totalCostBeforeIncentives.getValue() || 0;
  const costIncreaseConst = $costIncreaseConst.getValue();

  let incentiveAmounts = 0;
  const incentivesList = $incentivesList.getValue();

  if (incentivesList) {
    incentiveAmounts = incentivesList.reduce(
      (sum, item) =>
        item.incentives.data.incentiveAmount
          ? sum + item.incentives.data.incentiveAmount
          : sum,
      0
    );
  }

  if (!savingsPeriod) return;

  savingsPeriod = parseInt(savingsPeriod);

  const years = [];

  let previousYearPrice = 0;
  for (let i = 1; i <= savingsPeriod; i++) {
    let cumulativeSavings = 0;

    if (i === 1) {
      cumulativeSavings =
        (monthlyElectricBill - electricityBillWithSolar) * 12 +
        totalCostBeforeIncentives;
    }

    if (i === 2) {
      cumulativeSavings =
        previousYearPrice +
        (monthlyElectricBill - electricityBillWithSolar) *
          12 *
          (1 + costIncreaseConst) +
        incentiveAmounts;
    }

    if (i > 2) {
      cumulativeSavings =
        previousYearPrice +
        (monthlyElectricBill - electricityBillWithSolar) *
          12 *
          Math.pow(1 + costIncreaseConst, i - 1);
    }

    previousYearPrice = cumulativeSavings;
    years.push({ year: `year${i}`, cumulativeSavings });
  }

  return years;
}

function calculateLoanYears({ monthlyPayment = 0, termYears = 0 }) {
  let savingsPeriod = $savingsPeriod.getValue();
  const monthlyElectricBill = $monthlyElectricBill.getValue() || 0;
  const electricityBillWithSolar = $electricityBillWithSolar.getValue() || 0;
  const costIncreaseConst = $costIncreaseConst.getValue();

  if (!savingsPeriod) return;

  savingsPeriod = parseInt(savingsPeriod);

  const years = [];

  let previousYearPrice = 0;
  for (let i = 1; i <= savingsPeriod; i++) {
    let cumulativeSavings = 0;
    if (i > termYears) continue;

    if (i === 1) {
      cumulativeSavings =
        (monthlyElectricBill - electricityBillWithSolar) * 12 -
        monthlyPayment * 12;
    }

    if (i > 1) {
      cumulativeSavings =
        previousYearPrice +
        (monthlyElectricBill - electricityBillWithSolar) *
          12 *
          (1 + costIncreaseConst) -
        monthlyPayment * 12;
    }

    previousYearPrice = cumulativeSavings;
    years.push({ year: `year${i}`, cumulativeSavings });
  }

  return years;
}

function calculateFinancingOptions() {
  const $financingOptions = self.getComponent("financingOptions");

  $financingOptions.components.forEach(($financingOption) => {
    if (!$financingOption.getComponent("type")) return;

    const type = $financingOption.getComponent("type").getValue();

    if (!type) return;

    const termYears = $financingOption.getComponent("termYears").getValue();
    const monthlyPayment = $financingOption
      .getComponent("monthlyPayment")
      .getValue();
    const $yearlySavingsBreakdown = $financingOption.getComponent(
      "yearlySavingsBreakdown"
    );

    let yearlySavingsBreakdown;

    if (type === "cash") {
      yearlySavingsBreakdown = calculateCashYears();
    } else if (type === "loan") {
      if (!termYears) return;

      yearlySavingsBreakdown = calculateLoanYears({
        monthlyPayment: monthlyPayment,
        termYears: termYears,
      });
    }

    if (yearlySavingsBreakdown) {
      $yearlySavingsBreakdown.setValue(yearlySavingsBreakdown);
    }
  });
}

// Calculate field [Price per Watt(USD) after incentives]

$systemSize.on(
  "change",
  createHandler(
    ["totalCostAfterIncentives", "systemSize"],
    calculatePricePerWattAfterIncentives
  )
);

// Calculate field [Total cost after incentives]
$totalCostBeforeIncentives.on(
  "change",
  createHandler(
    ["totalCostBeforeIncentives", "incentiveAmount"],
    calculateTotalCostAfterIncentives
  )
);

// Calculate field [One-time payment (USD), numeric only]
$totalCostBeforeIncentives.on("change", () => {
  $oneTimePayment.setValue($totalCostBeforeIncentives.getValue());
});

$savingsPeriod.on(
  "change",
  createHandler(["savingsPeriod"], calculateEnvironmentalImpact)
);
$annualEnergyProductionEstimated.on(
  "change",
  createHandler(
    ["annualEnergyProductionEstimated"],
    calculateEnvironmentalImpact
  )
);

$savingsPeriod.on(
  "change",
  createHandler(
    [
      "savingsPeriod",
      "termYears",
      "financingOptions",
      "type",
      "estimatedSavingsGraph",
    ],
    calculateFinancingOptions
  )
);

$oneTimePayment.on(
  "change",
  createHandler(["totalCostBeforeIncentives"], () => {
    const oneTimePayment = $oneTimePayment.getValue();

    if (!oneTimePayment && oneTimePayment !== 0) {
      $oneTimePayment.setValue($totalCostBeforeIncentives.getValue());
    }
  })
);
