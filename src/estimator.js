const compute = (
  periodType, timeToElapse, reportedCases, population, totalHospitalBeds, region
) => {
  let period;
  const impactData = {};
  const severeImpactData = {};
  switch (periodType) {
    case ('days'):
      period = 1;
      break;
    case ('weeks'):
      period = 7;
      break;
    case ('months'):
      period = 30;
      break;
    default: period = 1;
  }
  const {
    avgDailyIncomeInUSD, avgDailyIncomePopulation
  } = region;

  const currentlyInfected = Math.trunc((reportedCases * 10) * period);
  impactData.currentlyInfected = currentlyInfected;

  const severeImpact = Math.trunc((reportedCases * 50) * period); // Severe
  severeImpactData.currentlyInfected = severeImpact;

  const infectionsByRequestedTime = Math.trunc(currentlyInfected * 512); // Both
  const severeInfectionsByRequestedTime = Math.trunc(severeImpact * 512);
  impactData.infectionsByRequestedTime = infectionsByRequestedTime;
  severeImpactData.infectionsByRequestedTime = severeInfectionsByRequestedTime;

  const severeCasesByRequestedTime = Math.trunc((15 / 100)
    * infectionsByRequestedTime * period); // Both
  impactData.severeCasesByRequestedTime = severeCasesByRequestedTime;
  const severeCasesByRequestedTime2 = Math.trunc((15 / 100)
    * severeInfectionsByRequestedTime * period);
  severeImpactData.severeCasesByRequestedTime = severeCasesByRequestedTime2;

  const averageOccupiedBeds = (65 / 100) * totalHospitalBeds; // Mine calc
  const hospitalBedsByRequestedTime = Math.trunc(totalHospitalBeds
      - (severeCasesByRequestedTime + averageOccupiedBeds) * period); // Both
  impactData.hospitalBedsByRequestedTime = hospitalBedsByRequestedTime;
  severeImpactData.hospitalBedsByRequestedTime = hospitalBedsByRequestedTime;

  const casesForICUByRequestedTime = Math.trunc((5 / 100)
    * infectionsByRequestedTime * period); // Both
  impactData.casesForICUByRequestedTime = casesForICUByRequestedTime;
  severeImpactData.casesForICUByRequestedTime = casesForICUByRequestedTime;

  const casesForVentilatorsByRequestedTime = Math.trunc((2 / 100)
    * infectionsByRequestedTime) * period; // Both
  impactData.casesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime;
  severeImpactData.casesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime;

  const dollarsInFlight = Math.trunc(((infectionsByRequestedTime
      * avgDailyIncomePopulation * avgDailyIncomeInUSD) / period) * period); // Both
  impactData.dollarsInFlight = dollarsInFlight;
  severeImpactData.dollarsInFlight = dollarsInFlight;

  const output = [];
  output.push(impactData);
  output.push(severeImpactData);

  return output;
};

const covid19ImpactEstimator = (data) => {
  const {
    periodType, timeToElapse, reportedCases, population, totalHospitalBeds, region
  } = data;

  const input = data; // Input Data
  const processData = compute(
    periodType, timeToElapse, reportedCases, population, totalHospitalBeds, region
  );
  return {
    data: input, // the input data you gotta
    impact: processData[0], // your best case estimation  {}
    severeImpact: processData[1] // your severe case estimation  {}
  };
};

export default covid19ImpactEstimator;
