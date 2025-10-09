/**
 * Unit tests for payloadBuilder module.
 * @module quoterush/payloadBuilder.test
 */

const { buildPayload, validateInput } = require("./payloadBuilder");
const { validate } = require("uuid");

jest.mock("uuid", () => ({
  validate: jest.fn(),
}));

describe("payloadBuilder", () => {
  describe("validateInput", () => {
    it("should throw if quoteId is invalid", () => {
      validate.mockReturnValue(false);
      expect(() => validateInput("invalid-uuid", "Home", {})).toThrow(
        "Invalid quoteId: Must be a valid UUID"
      );
    });

    it("should throw if quoteType is invalid", () => {
      validate.mockReturnValue(true);
      expect(() =>
        validateInput("123e4567-e89b-12d3-a456-426614174000", "Invalid", {})
      ).toThrow("Invalid quoteType: Must be Home, Auto, or Flood");
    });

    it("should throw if quoteData is invalid", () => {
      validate.mockReturnValue(true);
      expect(() =>
        validateInput("123e4567-e89b-12d3-a456-426614174000", "Home", null)
      ).toThrow("Invalid quoteData: Must be a non-empty object");
    });

    it("should not throw for valid input", () => {
      validate.mockReturnValue(true);
      expect(() =>
        validateInput("123e4567-e89b-12d3-a456-426614174000", "Home", {
          persons: [],
        })
      ).not.toThrow();
    });
  });

  describe("buildPayload", () => {
    it("should build Home payload correctly", () => {
      const quoteData = {
        address: "1051 Laguna Springs Dr",
        closingDate: "",
        createdAt: "2025-01-23T06:55:28+05:00",
        currentInsurance: "",
        expiryDate: "",
        ishomebuild: "yes",
        mailing: false,
        mailingAddress: "1051 Laguna Springs Dr",
        newPurchase: "no",
        policyType: "Home",
        inuser: {
          dob: "",
          email: "oliverhidarida@gmail.com",
          name: "Oliver Arida",
          phoneNumber: "2126559795",
          zipCode: "33326",
        },
        persons: [
          {
            dob: "",
            email: "oliverhidarida@gmail.com",
            name: "Oliver Arida",
            phoneNumber: "2126559795",
            zipCode: "33326",

            status: "completed",
            status_step: "1",
            updatedAt: "2025-01-23T06:55:28+05:00",
          },
        ],
        user: {
          email: "brad@flinsideoutinspections.com",
          id: "9cWIN7ma4jRM0y0vordurmWMshP2",
          mailingAddress: "PO Box 667032",
          name: "Brad Fifer",
          occupation: "Inspector",
          phoneNumber: "9545431785",
          signupType: "Referral",
        },
      };
      const payload = buildPayload("Home", quoteData);
      console.log("Home Payload:", payload);

      expect(payload.Client).toMatchObject({
        NameFirst: "Oliver Arida",
        DateOfBirth: "",
        EmailAddress: "oliverhidarida@gmail.com",
        PhoneNumber: "2126559795",
        PhoneCell: "2126559795",
        Address: "1051 Laguna Springs Dr",
        Zip: "33326",
        Lob_Home: true,
        Lob_Auto: false,
        Lob_Flood: false,
      });
      expect(payload.HO).toMatchObject({
        Address: "1051 Laguna Springs Dr",
        NewPurchase: "no",
        PurchaseDate: "",
        UsageType: "Primary",
        YearBuilt: "yes",
        CurrentlyInsured: "No",
        PropertyCurrentPolicyExpDate: "",
      });
      expect(payload.Flood).toEqual({});
      expect(payload.AutoPolicy).toEqual({});
      expect(payload.Drivers).toEqual([]);
      expect(payload.Autos).toEqual([]);
    });

    it("should build Auto payload correctly", () => {
      const quoteData = {
        UM: "100/300",
        bodily_injury_limit: "250/500",
        collision_deductible: "1000",
        comprehensive_deductible: "1000",
        createdAt: "2025-04-22T19:20:59+05:00",
        garaging_address: "10795 Passage Way Parkland FL 33076",
        policyType: "Auto",
        mailing: false,
        mailingAddress: "1 Hagerman Rd, Brampton, ON L6P4C1",
        occupancy: "Primary",
        property_damage: "100",
        status: "completed",
        status_step: "1",
        updatedAt: "2025-04-22T19:20:59+05:00",
        inuser: {
          LN: "D31607898770320",
          dob: "1977-03-20",
          email: "jag@roadlinkxpress.com",
          name: "Yadwinder Singh Dhaliwal",
          phoneNumber: "4168737373",
          zipCode: "",
        },
        drivers: [
          {
            LN: "D31607898770320",
            dob: "1977-03-20",
            email: "jag@roadlinkxpress.com",
            name: "Yadwinder Singh Dhaliwal",
            phoneNumber: "4168737373",
            zipCode: "",
          },
          {
            LN: "D31607265806211",
            dob: "1980-12-11",
            email: "",
            name: "Sukhpreet Kaur Dhaliwal",
            phoneNumber: "",
            zipCode: "",
          },
        ],
        vehicles: [
          {
            current_insurance: "yes",
            expiration_date: "2025-05-09",
            v_garaging_address: "yes",
            v_garaging_address_input: "",
            v_make: "",
            v_model: "",
            v_year: "",
            vin: "yes",
            vin_number: "SALGS2RK7MA426463",
          },
          {
            current_insurance: "yes",
            expiration_date: "2025-05-09",
            v_garaging_address: "yes",
            v_garaging_address_input: "",
            v_make: "",
            v_model: "",
            v_year: "",
            vin: "yes",
            vin_number: "1G1YB3D46P5111458",
          },
        ],
        user: {
          email: "jag@roadlinkxpress.com",
          id: "O7auo074QiX7oUtvMemQw79SJo03",
          mailingAddress: "1 Hagerman Rd, Brampton, ON L6P4C1",
          name: "Yadwinder Singh Dhaliwal",
          phoneNumber: "4168737373",
          signupType: "Client",
        },
      };
      const payload = buildPayload("Auto", quoteData);
      console.log("Auto Payload:", payload);
      expect(payload.Client).toMatchObject({
        NameFirst: "Yadwinder Singh Dhaliwal",
        DateOfBirth: "1977-03-20",
        EmailAddress: "jag@roadlinkxpress.com",
        PhoneNumber: "4168737373",
        PhoneCell: "4168737373",
        Address: "1 Hagerman Rd, Brampton, ON L6P4C1", // Updated to match mailingAddress
        Zip: "",
        Lob_Home: false,
        Lob_Auto: true,
        Lob_Flood: false,
      });
      expect(payload.HO).toEqual({});
      expect(payload.Flood).toEqual({});
      expect(payload.AutoPolicy).toMatchObject({
        BodilyInjury: "250/500",
        PropertyDamage: "100",
        UninsuredMotorist: "100/300",
        CurrentCarrier: "yes",
        CurrentExpirationDate: "2025-05-09",
        CurrentlyInsured: "Continuous Insurance - 6+ months",
      });
      expect(payload.Drivers).toHaveLength(2);
      expect(payload.Drivers[0]).toMatchObject({
        NameFirst: "Yadwinder Singh Dhaliwal",
        DateOfBirth: "1977-03-20",
        LicenseNumber: "D31607898770320",
      });
      expect(payload.Drivers[1]).toMatchObject({
        NameFirst: "Sukhpreet Kaur Dhaliwal",
        DateOfBirth: "1980-12-11",
        LicenseNumber: "D31607265806211",
      });
      expect(payload.Autos).toHaveLength(2);
      expect(payload.Autos[0]).toMatchObject({
        VIN: "SALGS2RK7MA426463",
        Comprehensive: "1000",
        Collision: "1000",
        GarageLocation: "10795 Passage Way Parkland FL 33076",
      });
      expect(payload.Autos[1]).toMatchObject({
        VIN: "1G1YB3D46P5111458",
        Comprehensive: "1000",
        Collision: "1000",
        GarageLocation: "10795 Passage Way Parkland FL 33076",
      });
    });

    it("should build Flood payload correctly", () => {
      const quoteData = {
        ReferralId: "Ake9L8yD6YQHhafgE6Uk11OK6HL2",
        address: "test",
        byReferral: true,
        cert_elevation: "no",
        closingDate: "2025-10-19",
        createdAt: "2025-10-09T17:08:40+05:00",
        expiryDate: "",
        haveCurrentPolicy: "",
        mailing: false,
        mailingAddress: "asdsadas",
        newPurchase: "yes",
        occupancy: "Primary",
        policyType: "Flood",
        status: "completed",
        status_step: "1",
        updatedAt: "2025-10-09T17:08:40+05:00",
        inuser: {
          dob: "2024-04-10",
          email: "client@client.com",
          name: "client",
          phoneNumber: "324324321",
          zipCode: "21312",
        },
        persons: [
          {
            dob: "2024-04-10",
            email: "client@client.com",
            name: "client",
            phoneNumber: "324324321",
            zipCode: "21312",
          },
        ],
        user: {
          dateOfBirth: "2024-04-10",
          email: "client@client.com",
          hasReferral: true,
          id: "Mhx1B7G6MihFZSPepwJkvsRe0M32",
          mailingAddress: "asdsadas",
          name: "client",
          nameInLower: "client",
          phoneNumber: "324324321",
        },
        referralData: {
          email: "zebitiger456@gmail.com",
          name: "habib",
          referralId: "Ake9L8yD6YQHhafgE6Uk11OK6HL2",
          signupType: "Client",
          updatedAt: "2025-10-07T16:39:19+05:00",
          zipCode: "21312",
        },
      };
      const payload = buildPayload("Flood", quoteData);
      console.log("Flood Payload:", payload);

      expect(payload.Client).toMatchObject({
        NameFirst: "client",
        DateOfBirth: "2024-04-10",
        EmailAddress: "client@client.com",
        PhoneNumber: "324324321",
        PhoneCell: "324324321",
        Address: "test",
        Zip: "21312",
        Lob_Home: false,
        Lob_Auto: false,
        Lob_Flood: true,
      });
      expect(payload.HO).toEqual({});
      expect(payload.Flood).toMatchObject({
        FloodZone: "",
        HaveFloodElevationCert: false,
        ElevationDifference: "",
        FloodExpirationDate: "",
      });
      expect(payload.AutoPolicy).toEqual({});
      expect(payload.Drivers).toEqual([]);
      expect(payload.Autos).toEqual([]);
    });

    it("should handle missing persons array in Home quote", () => {
      validate.mockReturnValue(true);
      const quoteData = {
        policyType: "Home",
        address: "123 Main St",
        user: { id: "user123" },
      };
      const payload = buildPayload("Home", quoteData);

      expect(payload.Client).toMatchObject({
        NameFirst: "",
        Lob_Home: true,
      });
      expect(payload.HO).toMatchObject({
        Address: "123 Main St",
      });
      expect(payload.Flood).toEqual({});
      expect(payload.AutoPolicy).toEqual({});
      expect(payload.Drivers).toEqual([]);
      expect(payload.Autos).toEqual([]);
    });

    it("should handle missing drivers and vehicles in Auto quote", () => {
      validate.mockReturnValue(true);
      const quoteData = {
        policyType: "Auto",
        user: { id: "user123" },
      };
      const payload = buildPayload("Auto", quoteData);

      expect(payload.Client).toMatchObject({
        NameFirst: "",
        Lob_Auto: true,
      });
      expect(payload.HO).toEqual({});
      expect(payload.Flood).toEqual({});
      expect(payload.AutoPolicy).toBeDefined();
      expect(payload.Drivers).toEqual([]);
      expect(payload.Autos).toEqual([]);
    });
  });
});
