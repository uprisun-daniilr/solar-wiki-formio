if (window.isControllerLoaded) return;
window.isControllerLoaded = true;

const API_URL = "https://stage-api.solify.dev/api";

self.options.noAlerts = true;
self.redraw();

const getMonthlyBill = () =>
  data?.application?.data?.utility?.data?.monthlyElectricBill || 0;

const getAddress = () => data?.application?.data?.address?.data?.address || "";
const getUtilityProvider = () =>
  data?.application?.data?.utility?.data?.utilityProvider || "";

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
const $savingsCostIncrease = self.getComponent("savingsCostIncrease");
const $costIncreaseConst = self.getComponent("constantCostIncrease");
const $totalProducedEnergy = self.getComponent("totalProducedEnergy");
const $co2EmissionFactor = self.getComponent("co2EmissionFactor");
const $costWithoutSolar = self.getComponent("costWithoutSolar");
const $incentiveAmount = self.getComponent("incentiveAmount");
const $incentivesList = self.getComponent("incentivesList");
const $pricePerWattBeforeIncentives = self.getComponent(
  "pricePerWattBeforeIncentives"
);
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
  }).then((response) => {
    return response.json();
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
  const address = getAddress();
  const utilityProvider = getUtilityProvider();
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

  if (!query.systemSize) return;
  if (!query.installationCostUSD) return;

  fetchIncentives(query)
    .then(({ incentives }) => {
      const prevInc = $incentivesList.getValue();

      const newInc = [
        ...prevInc.filter(
          (inc) =>
            !inc?.incentives?.data?.isDefault &&
            inc?.incentives?.data?.incentive &&
            inc?.incentives?.data?.incentiveAmount
        ),
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

      calculateTotalCostAfterIncentives();
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}

function createHandler(fields, callback) {
  return (options, ...rest) => {
    if (!options || !options.changed || !options.changed.component) return;

    if (!fields.includes(options.changed.component.key)) return;

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

    if (Array.isArray(callback)) {
      callback.map((cb) => cb(options, ...rest));
      return;
    }

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
  const monthlyElectricBill = getMonthlyBill();
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

function calculateLoanYears({
  monthlyPayment = 0,
  termYears = 0,
  downPayment = 0,
}) {
  if (!termYears) return [];
  let savingsPeriod = $savingsPeriod.getValue();
  const monthlyElectricBill = getMonthlyBill();
  const electricityBillWithSolar = $electricityBillWithSolar.getValue() || 0;
  const costIncreaseConst = $costIncreaseConst.getValue();

  if (!savingsPeriod) return;

  savingsPeriod = parseInt(savingsPeriod);

  const years = [];

  let previousYearPrice = 0;
  for (let i = 1; i <= savingsPeriod; i++) {
    let cumulativeSavings = 0;

    if (i === 1) {
      cumulativeSavings =
        (monthlyElectricBill - electricityBillWithSolar) * 12 -
        monthlyPayment * 12 -
        downPayment;
    }

    if (i > 1) {
      if (i <= termYears) {
        cumulativeSavings =
          previousYearPrice +
          (monthlyElectricBill - electricityBillWithSolar) *
            12 *
            Math.pow(1 + costIncreaseConst, i - 1) -
          monthlyPayment * 12;
      } else {
        cumulativeSavings =
          previousYearPrice +
          (monthlyElectricBill - electricityBillWithSolar) *
            12 *
            Math.pow(1 + costIncreaseConst, i - 1);
      }
    }

    previousYearPrice = cumulativeSavings;
    years.push({ year: `year${i}`, cumulativeSavings });
  }

  return years;
}

function calculateFinancingOptions() {
  const $financingOptions = self.getComponent("financingOptions");
  const monthlyElectricBill = getMonthlyBill();

  $financingOptions.components.forEach(($financingOption) => {
    if (!$financingOption.getComponent("type")) return;

    const type = $financingOption.getComponent("type").getValue();
    const downPayment = $financingOption.getComponent("downPayment").getValue();
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

    const costWithoutSolar = calculateCostWithoutSolar();

    $costWithoutSolar.setValue(costWithoutSolar);

    $utilityBillWithSolar.setValue(calculateUtilityBillWithSolar());
    const utilityBillWithSolar = $utilityBillWithSolar.getValue();

    let yearlySavingsBreakdown;
    if (type === "cash") {
      yearlySavingsBreakdown = calculateCashYears();
      const $cashCostWithSolar = $financingOption.getComponent("costWithSolar");

      const cashCostWitSolar = totalCostAfterIncentives + utilityBillWithSolar;

      $cashCostWithSolar.setValue(cashCostWitSolar);

      const $paybackPeriodYears =
        $financingOption.getComponent("paybackPeriodYears");

      const paybackPeriodYears = Math.round(
        totalCostAfterIncentives /
          ((monthlyElectricBill - electricityBillWithSolar) * 12)
      );

      const savings = costWithoutSolar - cashCostWitSolar;

      const $costOfSolar = $financingOption.getComponent("costOfSolar");

      $costOfSolar.setValue(totalCostAfterIncentives);

      $financingOption.getComponent("savings").setValue(savings);

      $paybackPeriodYears.setValue(paybackPeriodYears);
    } else if (type === "loan") {
      yearlySavingsBreakdown = calculateLoanYears({
        monthlyPayment: monthlyPayment,
        termYears: termYears,
        downPayment,
      });
    }

    $yearlySavingsBreakdown.setValue(yearlySavingsBreakdown);
  });
}

function calculateTotalLoanPayments() {
  self
    .getComponent("financingOptions")
    .components.forEach(($financingOption) => {
      if (!$financingOption.getComponent("type")) return;

      const type = $financingOption.getComponent("type").getValue();
      if (type !== "loan") {
        return;
      }

      const downPayment = $financingOption
        .getComponent("downPayment")
        .getValue();
      const monthlyPayment = $financingOption
        .getComponent("monthlyPayment")
        .getValue();
      const termYears = $financingOption.getComponent("termYears").getValue();

      const totalLoanPayments = monthlyPayment * 12 * termYears + downPayment;

      $financingOption
        .getComponent("totalLoanPayments")
        .setValue(totalLoanPayments);
    });
}

function calculateCostWithoutSolar() {
  let savingsPeriod = $savingsPeriod.getValue();

  if (!savingsPeriod) return;

  const monthlyElectricBill = getMonthlyBill();
  const savingsCostIncrease = $savingsCostIncrease.getValue();

  savingsPeriod = parseInt(savingsPeriod);

  return calculateTotalCost(
    monthlyElectricBill,
    savingsCostIncrease,
    savingsPeriod
  );
}

function calculatePricePerWattBeforeIncentives() {
  const totalCostBeforeIncentives = $totalCostBeforeIncentives.getValue() || 0;
  const systemSize = $systemSize.getValue() || 0;

  const pricePerWattBeforeIncentives =
    totalCostBeforeIncentives / (systemSize * 1000);

  $pricePerWattBeforeIncentives.setValue(pricePerWattBeforeIncentives);
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

function calculateLoanSavingsBreakdown({ changed }) {
  const $financingOption = changed.instance.localRoot;

  if (!$financingOption.getComponent("type")) return;

  const type = $financingOption.getComponent("type").getValue();

  const downPayment = $financingOption.getComponent("downPayment").getValue();

  if (!type) return;

  const termYears = $financingOption.getComponent("termYears").getValue();

  const monthlyPayment = $financingOption
    .getComponent("monthlyPayment")
    .getValue();

  const $yearlySavingsBreakdown = $financingOption.getComponent(
    "yearlySavingsBreakdown"
  );

  let yearlySavingsBreakdown;

  if (type === "loan") {
    yearlySavingsBreakdown = calculateLoanYears({
      monthlyPayment: monthlyPayment,
      termYears: termYears,
      downPayment,
    });

    $yearlySavingsBreakdown.setValue(yearlySavingsBreakdown);
  }
}

// Calculate field [Total cost after incentives]
instance.on(
  "change",
  createHandler(["incentiveAmount"], () => {
    calculateTotalCostAfterIncentives();
    calculatePricePerWattBeforeIncentives();
  })
);

instance.on(
  "change",
  createHandler(
    ["totalCostBeforeIncentives"],
    [
      calculateTotalCostAfterIncentives,
      calculateIncentives,
      () => {
        $oneTimePayment.setValue($totalCostBeforeIncentives.getValue());
      },
      () => {
        const oneTimePayment = $oneTimePayment.getValue();

        if (!oneTimePayment && oneTimePayment !== 0) {
          $oneTimePayment.setValue($totalCostBeforeIncentives.getValue());
        }
      },
    ]
  )
);

instance.on(
  "change",
  createHandler(
    ["savingsPeriod"],
    [calculateEnvironmentalImpact, calculateFinancingOptions]
  )
);

instance.on(
  "change",
  createHandler(
    ["annualEnergyProductionEstimated"],
    calculateEnvironmentalImpact
  )
);

instance.on("change", createHandler(["type"], [calculateFinancingOptions]));

instance.on(
  "change",
  createHandler(["estimatedSavingsGraph"], [calculateFinancingOptions])
);

instance.on(
  "change",
  createHandler(["financingOptions"], [calculateFinancingOptions])
);

instance.on(
  "change",
  createHandler(
    ["systemSize"],
    [
      calculateIncentives,
      calculatePricePerWattBeforeIncentives,
      calculatePricePerWatt,
    ]
  )
);

self.on(
  "change",
  createHandler(["utilityBillWithSolar"], ({ changed }) => {
    const $root = changed.instance.localRoot;
    const $rootParent = $root.parent.parent;

    const type = $rootParent.getComponent("type").getValue();

    console.log({ type });

    if (!type) return;

    const utilityBillWithSolar = changed.value;
    if (type === "loan") {
      const $loanCostWithSolar = $root.getComponent("costWithSolar");

      const $totalLoanPayments = $rootParent.getComponent("totalLoanPayments");

      const totalLoanPayments = $totalLoanPayments.getValue() || 0;

      $loanCostWithSolar.setValue(totalLoanPayments + utilityBillWithSolar);
    }
  })
);

instance.on(
  "change",
  createHandler(["costWithSolar"], ({ changed }) => {
    const $root = changed.instance.localRoot;

    const $costWithoutSolar = $root.getComponent("costWithoutSolar");

    const costWithoutSolar = $costWithoutSolar.getValue() || 0;

    const costWithSolar = changed.value || 0;

    const savings = costWithoutSolar - costWithSolar;

    console.log({ costWithoutSolar, costWithSolar });

    $root.getComponent("savings").setValue(savings);
  })
);

instance.on(
  "change",
  createHandler(["costWithoutSolar"], ({ changed }) => {
    const $root = changed.instance.localRoot;

    const $costWithSolar = $root.getComponent("costWithSolar");

    const costWithoutSolar = changed.value || 0;
    const costWithSolar = $costWithSolar.getValue() || 0;

    const savings = costWithoutSolar - costWithSolar;

    console.log({ costWithoutSolar, costWithSolar });

    $root.getComponent("savings").setValue(savings);
  })
);

instance.on(
  "change",
  createHandler(
    ["downPayment"],
    [calculateLoanSavingsBreakdown, calculateTotalLoanPayments]
  )
);

instance.on(
  "change",
  createHandler(
    ["termYears"],
    [
      calculateLoanSavingsBreakdown,
      calculateTotalLoanPayments,
      calculateFinancingOptions,
    ]
  )
);

instance.on(
  "change",
  createHandler(
    ["monthlyPayment"],
    [
      calculateLoanSavingsBreakdown,
      calculateTotalLoanPayments,
      ({ changed }) => {
        const root = changed.instance.localRoot;

        const $yearlySavingsBreakdown = root.getComponent(
          "yearlySavingsBreakdown"
        );
        const $termYears = root.getComponent("termYears");

        const years = calculateLoanYears({
          monthlyPayment: changed.instance.getValue(),
          termYears: $termYears.getValue(),
        });

        $yearlySavingsBreakdown.setValue(years);
      },
      ({ changed }) => {
        const root = changed.instance.localRoot;

        const $yearlySavingsBreakdown = root.getComponent(
          "yearlySavingsBreakdown"
        );
        const $termYears = root.getComponent("termYears");

        const years = calculateLoanYears({
          monthlyPayment: changed.instance.getValue(),
          termYears: $termYears.getValue(),
        });

        $yearlySavingsBreakdown.setValue(years);
      },
    ]
  )
);

instance.on(
  "change",
  createHandler(
    ["totalLoanPayments"],
    [
      ({ changed }) => {
        const $financingOption = changed.instance.localRoot;

        if (!$financingOption.getComponent("type")) return;

        const type = $financingOption.getComponent("type").getValue();

        if (type === "loan") {
          const $costOfSolar = $financingOption.getComponent("costOfSolar");
          if (!$costOfSolar) return;

          $costOfSolar.setValue(changed.value);
        }
      },

      ({ changed }) => {
        const $root = changed.instance.localRoot;

        const type = $root.getComponent("type").getValue();

        if (!type) return;

        const $utilityBillWithSolar = $root.getComponent(
          "utilityBillWithSolar"
        );

        const utilityBillWithSolar = $utilityBillWithSolar.getValue();
        if (type === "loan") {
          const $loanCostWithSolar = $root.getComponent("costWithSolar");

          const totalLoanPayments = changed.value || 0;

          $loanCostWithSolar.setValue(totalLoanPayments + utilityBillWithSolar);
        }
      },
    ]
  )
);

instance.on(
  "change",
  createHandler(
    ["totalCostAfterIncentives"],
    [
      calculatePricePerWatt,
      ({ changed }) => {
        const $financingOptions = self.getComponent("financingOptions");

        $financingOptions.components.forEach(($financingOption) => {
          const type = $financingOption.getComponent("type").getValue();
          if (!type) return;

          if (type === "cash") {
            const $costOfSolar = $financingOption.getComponent("costOfSolar");
            if (!$costOfSolar) return;

            $costOfSolar.setValue(changed.value);
          }
        });
      },
    ]
  )
);
