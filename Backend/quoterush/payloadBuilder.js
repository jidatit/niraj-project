/**
 * Module for building QuoteRush API payloads from frontend form data.
 * @module quoterush/payloadBuilder
 */

// const { validate } = require("uuid");

/**
 * Validates input parameters for payload building.
 * @param {string} quoteId - Unique identifier for the quote
 * @param {string} quoteType - Type of quote (Home, Auto, Flood)
 * @param {Object} quoteData - Form data from frontend
 * @throws {Error} If validation fails
 */
function validateInput(quoteId, quoteType, quoteData) {
  if (!quoteId) {
    throw new Error("Invalid quoteId: Must be a valid Quote Id");
  }
  if (!["Home", "Auto", "Flood"].includes(quoteType)) {
    throw new Error("Invalid quoteType: Must be Home, Auto, or Flood");
  }
  if (!quoteData || typeof quoteData !== "object") {
    throw new Error("Invalid quoteData: Must be a non-empty object");
  }
}

/**
 * Builds the Client section of the QuoteRush payload.
 * @param {Object} quoteData - Frontend form data
 * @returns {Object} Client section
 */
function buildClientSection(quoteData) {
  const person = Array.isArray(quoteData.persons)
    ? quoteData.persons[0]
    : quoteData.drivers?.[0] || {};
  return {
    NameFirst: person.name || "",
    NamePrefix: "",
    NameMiddle: "",
    NameLast: person.name || "",
    NameSuffix: "",
    EntityType: "Individual",
    EntityName: "",
    DateOfBirth: person.dob || "",
    Gender: "",
    MaritalStatus: "",
    EducationLevel: "",
    Industry: "",
    Occupation: "",
    CreditPermission: "",
    AssumedCreditScore: "",
    PhoneNumber: person.phoneNumber || "",
    PhoneNumberAlt: "",
    PhoneCell: person.phoneNumber || "",
    EmailAddress: person.email || "",
    EPolicy: true,
    Address:
      quoteData.address || quoteData.mailingAddress || person.zipCode || "",
    Address2: "",
    City: "",
    State: "",
    Zip: person.zipCode || "",
    County: "",
    Province: "",
    International: false,
    Country: "",
    CoApplicantNamePrefix: "",
    CoApplicantNameFirst: "",
    CoApplicantNameMiddle: "",
    CoApplicantNameLast: "",
    CoApplicantNameSuffix: "",
    CoApplicantDateOfBirth: "",
    CoApplicantGender: "",
    CoApplicantMaritalStatus: "",
    CoApplicantEducation: "",
    CoApplicantIndustry: "",
    CoApplicantOccupation: "",
    CoApplicantRelationship: "",
    CoApplicantEmail: "",
    CoApplicantPhone: "",
    OverviewNotes: "",
    Assigned: "",
    LeadSource: "Import API",
    LeadStatus: "New Lead",
    Lob_Home: quoteData.policyType === "Home",
    Lob_Auto: quoteData.policyType === "Auto",
    Lob_Flood: quoteData.policyType === "Flood",
  };
}

/**
 * Builds the HO section for Home quotes.
 * @param {Object} quoteData - Frontend form data
 * @returns {Object} HO section
 */
function buildHOSection(quoteData) {
  return {
    FormType: "HO-3: Home Owners Policy",
    Address: quoteData.address || "",
    Address2: "",
    City: "",
    State: "",
    Zip: quoteData.persons?.[0]?.zipCode || "",
    County: "",
    WithinCityLimits: false,
    NewPurchase: quoteData.newPurchase || "No",
    PurchaseDate: quoteData.closingDate || "",
    PurchasePrice: "",
    UsageType: quoteData.occupancy || "Primary",
    MonthsOwnerOccupied: "",
    MilesToCoast: "",
    BCEG: "",
    Territory: "",
    ProtectionClass: "",
    FloodZone: "",
    FloodPolicy: false,
    WindOnlyEligible: "No",
    YearBuilt: quoteData.ishomebuild || "",
    // StructureType: quoteData.isCondo ? "Condo" : "Single Family",
    StructureType: "",
    Families: "",
    Stories: "",
    Floor: "",
    SquareFeet: "",
    UnitsInFirewall: "",
    UnitsInBuilding: "",
    ConstructionType: "",
    Construction: "",
    FrameConstruction: "",
    MasonryConstruction: "",
    FoundationType: "",
    BasementPercentFinished: "",
    RoofShape: "",
    RoofPortionFlat: false,
    RoofHipPercent: "",
    RoofMaterial: "",
    Pool: "",
    PoolScreenedEnclosure: false,
    PoolFence: false,
    PoolDivingboardSlide: false,
    ScreenedEnclosureSquareFeet: "",
    ScreenedCoverage: "",
    Jacuzzi: false,
    HotTub: false,
    UnderRenovation: false,
    UnderConstruction: false,
    UpdateRoofYear: "",
    UpdateRoofType: "",
    UpdatePlumbingYear: "",
    PlumbingType: "",
    UpdateElectricalYear: "",
    ElectricalType: "",
    UpdateHeatingYear: "",
    PrimaryHeatSource: "",
    WaterHeaterYear: "",
    CoverageA: "",
    CoverageB: "",
    CoverageBPercent: "",
    CoverageC: "",
    CoverageCPercent: "",
    CoverageD: "",
    CoverageDPercent: "",
    CoverageE: "",
    CoverageF: "",
    AllOtherPerilsDeductible: "",
    HurricaneDeductible: "",
    NamedStormDeductible: "",
    WindHailDeductible: "",
    CurrentlyInsured: quoteData.currentInsurance ? "Yes" : "No",
    AnyLapses: "",
    CurrentCarrier: quoteData.currentInsurance || "",
    CurrentAnnualPremium: "",
    CurrentPolicyNumber: "",
    PolicyEffectiveDate: "",
    PropertyCurrentPolicyExpDate: quoteData.expiryDate || "",
    Mortgage: "",
    BillTo: "",
    Claims: "",
    PriorLiabilityLimits: "",
    LuxuryItems: "",
    HaveWindMitForm: false,
    // ... (other fields with default empty values)
  };
}

/**
 * Builds the Flood section for Flood quotes.
 * @param {Object} quoteData - Frontend form data
 * @returns {Object} Flood section
 */
function buildFloodSection(quoteData) {
  const certElevation = quoteData?.cert_elevation;

  return {
    FloodZone: "",
    CommunityNumber: "",
    CommunityDescription: "",
    MapPanel: "",
    MapPanelSuffix: "",
    FloodDeductible: "",
    PolicyType: "",
    WaitingPeriod: "",
    PriorFloodLoss: "",
    Grandfathering: false,
    HaveFloodElevationCert: certElevation === "yes",
    ElevationCertDate: "",
    PhotographDate: "",
    Diagram: "",
    BuildingCoverage: "",
    ContentsCoverage: "",
    ElevationDifference: "",
    NonParticipatingFloodCommunity: false,
    CBRAZone: false,
    FloodCarrier: "",
    CarrierType: "",
    FloodExpirationDate: quoteData.expiryDate || "",
    FloodPriorPolicyId: "",
  };
}

/**
 * Builds the AutoPolicy section for Auto quotes.
 * @param {Object} quoteData - Frontend form data
 * @returns {Object} AutoPolicy section
 */
function buildAutoPolicySection(quoteData) {
  return {
    BodilyInjury: quoteData.bodily_injury_limit || "",
    CurrentAnnualPremium: "",
    CurrentCarrier: quoteData.vehicles?.[0]?.current_insurance || "",
    CurrentExpirationDate: quoteData.vehicles?.[0]?.expiration_date || "",
    CurrentlyInsured: quoteData.vehicles?.[0]?.current_insurance
      ? "Continuous Insurance - 6+ months"
      : "",
    CurrentPolicyTerm: "",
    EffectiveDate: "",
    ResidenceType: quoteData.occupancy || "Home (owned)",
    PriorLiabilityLimits: "",
    PropertyDamage: quoteData.property_damage || "",
    UninsuredMotorist: quoteData.UM || "",
    UninsuredMotoristsPropertyDamage: "",
    YearsAtCurrentResidence: "",
    YearsContinuouslyInsured: "",
    YearsWithCurrentCarrier: "",
    MedicalPayments: "None",
    PIPDeductible: "",
    PIPCoverge: "",
    WageLoss: "",
    AAAMember: "",
    StackedCoverage: false,
    EFT: false,
    PIPMedicalDeductible: "",
    PIPMedicalCoverage: "",
    CombatTheft: false,
    SpousalLiability: false,
    OBEL: false,
    PIPAddlCoverage: "",
    GarageState: "",
    CurrentPolicyID: "",
  };
}

/**
 * Builds the Drivers section for Auto quotes.
 * @param {Object} quoteData - Frontend form data
 * @returns {Array} Drivers array
 */
function buildDriversSection(quoteData) {
  return (quoteData.drivers || []).map((driver) => ({
    NamePrefix: "",
    NameFirst: driver.name || "",
    NameMiddle: "",
    NameLast: driver.name || "",
    NameSuffix: "",
    Gender: "",
    MaritalStatus: "",
    EducationLevel: "",
    DateOfBirth: driver.dob || "",
    Occupation: "",
    OccupationTitle: "",
    OccupationYears: "",
    Relationship: "",
    RatedDriver: "",
    LicenseStatus: "",
    DateFirstLicensed: "",
    AgeFirstLicensed: "",
    LicenseNumber: driver.LN || "",
    LicenseState: "",
    SuspendRevoked5: "",
    DefensiveDriverCourseDate: "",
    SR22FR44: "",
    Points: "",
    GoodStudent: false,
    Training: false,
    StudentOver100MilesAway: false,
    SSN: "",
    DriverViolationsList: [],
  }));
}

/**
 * Builds the Autos section for Auto quotes.
 * @param {Object} quoteData - Frontend form data
 * @returns {Array} Autos array
 */
function buildAutosSection(quoteData) {
  return (quoteData.vehicles || []).map((vehicle) => ({
    Year: vehicle.v_year || "",
    Make: vehicle.v_make || "",
    Model: vehicle.v_model || "",
    VIN: vehicle.vin_number || "",
    AntiTheft: "",
    PassiveRestraints: "",
    AntiLockBrakes: "",
    OwnershipStatus: "",
    AnnualMileage: "",
    LengthOfOwnership: "",
    PrimaryDriver: quoteData.drivers?.[0]?.name || "",
    UseType: "",
    MilesOneWay: "",
    DaysPerWeek: "",
    WeeksPerMonth: "",
    ExistingDamage: false,
    Comprehensive: quoteData.comprehensive_deductible || "",
    Collision: quoteData.collision_deductible || "",
    UMPDLimit: "",
    UMPDDed: "",
    Towing: "",
    EAP: false,
    Rental: "",
    CostNewValue: "",
    OdometerReading: "",
    BodyStyle: "",
    Drive: "",
    EngineInfo: "",
    Fuel: "",
    ABS: "",
    GarageLocation: quoteData.garaging_address || "",
    RideShare: false,
    Telematics: false,
    Deleted: false,
    OEMPartsEndorsement: false,
    OriginalOwner: false,
  }));
}

/**
 * Builds the QuoteRush API payload based on quote type and data.
 * @param {string} quoteType - Type of quote (Home, Auto, Flood)
 * @param {Object} quoteData - Frontend form data
 * @returns {Object} QuoteRush API payload
 * @throws {Error} If input validation fails
 */
function buildPayload(quoteType, quoteData) {
  validateInput(quoteData.user?.id, quoteType, quoteData);

  const payload = {
    Client: buildClientSection(quoteData),
    PreviousAddress: {
      Address: "",
      Address2: "",
      City: "",
      State: "",
      Zip: "",
      County: "",
      LastMonth: "",
      LastYear: "",
    },
    HO: quoteType === "Home" ? buildHOSection(quoteData) : {},
    Flood: quoteType === "Flood" ? buildFloodSection(quoteData) : {},
    AutoPolicy: quoteType === "Auto" ? buildAutoPolicySection(quoteData) : {},
    Drivers: quoteType === "Auto" ? buildDriversSection(quoteData) : [],
    Autos: quoteType === "Auto" ? buildAutosSection(quoteData) : [],
    Claims: [],
    MobileHome: {},
  };

  return payload;
}

module.exports = { buildPayload, validateInput };
