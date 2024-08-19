if (window.isControllerLoaded) return;
window.isControllerLoaded = true;

const API_URL = "https://dev-api.solify.dev/api";

self.options.noAlerts = true;
self.redraw();

const $pricePerWattAfterIncentives = self.getComponent(
  "pricePerWattAfterIncentives"
);
const $totalCostBeforeIncentives = self.getComponent(
  "totalCostBeforeIncentives"
);
const $electricityBillWithSolar = self.getComponent("electricityBillWithSolar");
const $totalCostAfterIncentives = self.getComponent("totalCostAfterIncentives");
const $annualDegradationRate = self.getComponent("annualDegradationRate");
const $co2AbsorptionPerTree = self.getComponent("co2AbsorptionPerTree");
const $monthlyElectricBill = self.getComponent("monthlyElectricBill");
const $savingsCostIncrease = self.getComponent("savingsCostIncrease");
const $costIncreaseConst = self.getComponent("constantCostIncrease");
const $totalProducedEnergy = self.getComponent("totalProducedEnergy");
const $co2EmissionFactor = self.getComponent("co2EmissionFactor");
const $costWithoutSolar = self.getComponent("costWithoutSolar");
const $incentiveAmount = self.getComponent("incentiveAmount");
const $incentivesList = self.getComponent("incentivesList");
const $oneTimePayment = self.getComponent("oneTimePayment");
const $savingsPeriod = self.getComponent("savingsPeriod");
const $systemSize = self.getComponent("systemSize");
const $treesGrown = self.getComponent("treesGrown");
const $energyEquivalentPerGallonOfGas = self.getComponent(
  "energyEquivalentPerGallonOfGas"
);
const $tonsOfCo2Avoided = self.getComponent("tonsOfCo2Avoided");
const $notUsedGasGallons = self.getComponent("notUsedGasGallons");
const $annualEnergyProductionEstimated = self.getComponent(
  "annualEnergyProductionEstimated"
);

function calculatePricePerWatt() {
  const afterIncentives = $totalCostAfterIncentives.getValue();
  const systemSize = $systemSize.getValue();

  if (!afterIncentives || !systemSize) {
    $pricePerWattAfterIncentives.setValue(0);
    return;
  }

  $pricePerWattAfterIncentives.setValue(afterIncentives / (systemSize * 1000));
}

function fetchIncentives(query) {
  return fetch(`${API_URL}/public/solar_incentives_calculator`, {
    method: "POST",
    body: JSON.stringify(query),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
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

function calculateIncentives() {
  const address = self.getComponent("address").getValue();
  const utilityProvider = self.getComponent("utilityProvider").getValue();
  const systemSize = $systemSize.getValue();
  const totalCostBeforeIncentives = $totalCostBeforeIncentives.getValue();

  let zipCode;
  if (address) {
    zipCode = address.address_components.find((el) =>
      el.types.includes("postal_code")
    );
    zipCode = zipCode ? zipCode.short_name : undefined;
  }

  const query = {
    zipCode: Number(zipCode),
    systemSize: Number(systemSize),
  };

  if (totalCostBeforeIncentives) {
    query.installationCostUSD = totalCostBeforeIncentives;
  }

  if (utilityProvider) {
    query.provider = utilityProvider.company_id;
  }

  fetchIncentives(query).then(({ incentives }) => {
    const prevInc = $incentivesList.getValue();

    const newInc = [
      ...prevInc.filter((inc) => !inc?.incentives?.data?.isDefault),
      ...incentives.map(({ incentiveCost, incentiveInfo }) => ({
        incentives: {
          data: {
            calculatedIncentiveAmount: incentiveCost,
            incentive: incentiveInfo.incentiveProgramName,
            incentiveAmount: incentiveCost,
            isDefault: true,
          },
        },
      })),
    ];

    $incentivesList.setValue(newInc);
  });
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
  for (let year = 1; year <= savingsPeriod; year++) {
    if (year === 1) {
      totalProducedEnergy += annualEnergyProductionEstimated;
      continue;
    }

    totalProducedEnergy +=
      annualEnergyProductionEstimated *
      Math.pow(1 - annualDegradationRate, year - 1);
  }

  const tonsOfCo2Avoided = totalProducedEnergy * co2EmissionFactor;

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
        (monthlyElectricBill - electricityBillWithSolar) * 12 -
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
  if (!termYears) return [];
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
  const monthlyElectricBill = $monthlyElectricBill.getValue();

  $financingOptions.components.forEach(($financingOption) => {
    if (!$financingOption.getComponent("type")) return;

    const type = $financingOption.getComponent("type").getValue();
    const totalCostAfterIncentives = $totalCostAfterIncentives.getValue() || 0;
    const electricityBillWithSolar = $electricityBillWithSolar.getValue() || 0;

    if (!type) return;

    const termYears = $financingOption.getComponent("termYears").getValue();
    const monthlyPayment = $financingOption
      .getComponent("monthlyPayment")
      .getValue();
    const $yearlySavingsBreakdown = $financingOption.getComponent(
      "yearlySavingsBreakdown"
    );

    const $costWithoutSolar = $financingOption.getComponent("costWithoutSolar");
    const $utilityBillWithSolar = $financingOption.getComponent(
      "utilityBillWithSolar"
    );

    $costWithoutSolar.setValue(calculateCostWithoutSolar());

    $utilityBillWithSolar.setValue(calculateUtilityBillWithSolar());

    let yearlySavingsBreakdown;
    if (type === "cash") {
      yearlySavingsBreakdown = calculateCashYears();
      const $cashCostWithSolar = $financingOption.getComponent("costWithSolar");
      const utilityBillWithSolar = $utilityBillWithSolar.getValue();

      $cashCostWithSolar.setValue(
        totalCostAfterIncentives + utilityBillWithSolar
      );

      const $paybackPeriodYears =
        $financingOption.getComponent("paybackPeriodYears");

      const paybackPeriodYears = Math.round(
        totalCostAfterIncentives /
          ((monthlyElectricBill - electricityBillWithSolar) * 12)
      );

      $paybackPeriodYears.setValue(paybackPeriodYears);
    } else if (type === "loan") {
      yearlySavingsBreakdown = calculateLoanYears({
        monthlyPayment: monthlyPayment,
        termYears: termYears,
      });

      const $loanCostWithSolar = $financingOption.getComponent("costWithSolar");
      const $totalLoanPayments =
        $financingOption.getComponent("totalLoanPayments");

      const totalLoanPayments = $totalLoanPayments.getValue || 0;

      $loanCostWithSolar.setValue(totalCostAfterIncentives + totalLoanPayments);
    }

    const $savings = $financingOption.getComponent("savings");
    const $costWithSolar = $financingOption.getComponent("costWithSolar");

    const costWithoutSolar = $costWithoutSolar.getValue() || 0;
    const costWithSolar = $costWithSolar.getValue() || 0;

    const savings = costWithoutSolar - costWithSolar;

    $savings.setValue(savings);

    $yearlySavingsBreakdown.setValue(yearlySavingsBreakdown);
  });
}

function calculateCostWithoutSolar() {
  let savingsPeriod = $savingsPeriod.getValue();

  if (!savingsPeriod) return;

  const monthlyElectricBill = $monthlyElectricBill.getValue();
  const savingsCostIncrease = $savingsCostIncrease.getValue();

  savingsPeriod = parseInt(savingsPeriod);

  return calculateTotalCost(
    monthlyElectricBill,
    savingsCostIncrease,
    savingsPeriod
  );
}

function calculateUtilityBillWithSolar() {
  let savingsPeriod = $savingsPeriod.getValue();

  if (!savingsPeriod) return;

  const electricityBillWithSolar = $electricityBillWithSolar.getValue();
  const savingsCostIncrease = $savingsCostIncrease.getValue();

  savingsPeriod = parseInt(savingsPeriod);

  return calculateTotalCost(
    electricityBillWithSolar,
    savingsCostIncrease,
    savingsPeriod
  );
}

function calculateTotalCost(payments, costIncrease, years) {
  let totalCost = 0;

  for (let year = 1; year <= years; year++) {
    totalCost += 12 * payments * Math.pow(1 + costIncrease, year - 1);
  }

  return totalCost;
}

// Calculate field [Price per Watt(USD) after incentives]

$systemSize.on("change", createHandler(["systemSize"], calculatePricePerWatt));

$totalCostAfterIncentives.on(
  "change",
  createHandler(["totalCostAfterIncentives"], calculatePricePerWatt)
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

$totalCostBeforeIncentives.on(
  "change",
  createHandler(["totalCostBeforeIncentives"], calculateIncentives)
);

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

$savingsPeriod.on(
  "change",
  createHandler(["monthlyPayment"], ({ changed }) => {
    const root = changed.instance.localRoot;

    const $yearlySavingsBreakdown = root.getComponent("yearlySavingsBreakdown");
    const $termYears = root.getComponent("termYears");

    const years = calculateLoanYears({
      monthlyPayment: changed.instance.getValue(),
      termYears: $termYears.getValue(),
    });

    $yearlySavingsBreakdown.setValue(years);
  })
);

$systemSize.on(
  "change",
  createHandler(["systemSize"], ({ changed }) => {
    calculateIncentives();
  })
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
