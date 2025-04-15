const sendEmail = require("./emailjsUtils");
const { getMatchingPersonnels, getEmailTemplate } = require("./firestoreUtils");
const { getPolicies } = require("./getPolicies");

const processPolicies = async () => {
  try {
    console.log("fetcing");
    // Fetch all policies
    const policies = await getPolicies();

    for (const policy of policies) {
      const { roof_age, ac_age, user } = policy;

      // Check AC Age condition
      if (ac_age >= 4) {
        console.log(
          `Policy ${policy.id} has AC Age ${ac_age}. Sending AC Repair personnel details.`
        );
        await sendPersonnelDetails(policy, "AC Repair");
      }

      // Check Roof Age condition
      if (roof_age >= 7) {
        console.log(
          `Policy ${policy.id} has Roof Age ${roof_age}. Sending Roof Repair personnel details.`
        );
        await sendPersonnelDetails(policy, "Roof Repair");
      }
    }
  } catch (error) {
    console.error("Error processing policies:", error);
  }
};

// Helper function to send personnel details
const sendPersonnelDetails = async (policy, type) => {
  try {
    let personnelDetails = "";
    console.log(
      "policy",
      policy?.byReferral,
      policy?.Referral?.occupation,
      type
    );

    // Check if the policy is created through a referral
    if (policy.byReferral && policy.Referral?.occupation === type) {
      // Include the referral's information
      const referral = policy.Referral;
      personnelDetails = formatPersonnelDetails([
        {
          name: referral?.name,
          address: referral?.mailingAddress,
          contactInfo: referral?.phoneNumber,
          type: referral?.occupation,
        },
      ]);
    } else {
      // Fetch matching personnels from the Personnels collection
      const personnels = await getMatchingPersonnels(policy.user.zipCode, type);

      if (personnels.length > 0) {
        // Format personnel details
        personnelDetails = formatPersonnelDetails(personnels);
      } else {
        console.log(`No matching personnels found for policy ${policy.id}`);
        return; // Exit if no matching personnels are found
      }
    }

    // If no personnel details are found, skip sending the email
    if (!personnelDetails) {
      console.log(
        `No personnel details found for policy ${policy.id}. Skipping email.`
      );
      return;
    }

    // Fetch email template
    const template = await getEmailTemplate();

    // Replace placeholders in the template
    const emailBody = template.body.replace(
      /{personnelDetails}/g,
      personnelDetails
    );
    const emailSubject = template.subject;

    // Send email
    await sendEmail(policy.user.email, emailSubject, emailBody);
    console.log(`Email sent to ${policy.user.email}`);
  } catch (error) {
    console.error(
      `Error sending personnel details for policy ${policy.id}:`,
      error
    );
  }
};
// Format personnel details as HTML
const formatPersonnelDetails = (personnels) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background-color: #f9f9f9;">
      <h3 style="color: #333; text-align: center; margin-bottom: 10px;">Personnel Information</h3>
      <div style="background-color: #fff; padding: 10px; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
        ${personnels
          .map(
            (personnel, index) => `
            <div style="border-bottom: 1px solid #eee; padding: 8px 0; font-size: 14px;">
              <strong style="color: #007BFF;">${index + 1}. ${
              personnel.name
            }</strong><br>
              📍 <strong>Address:</strong> ${personnel.address}<br>
              📞 <strong>Contact:</strong> ${personnel.contactInfo}<br>
              🛠️ <strong>Type:</strong> <span style="color: #28a745;">${
                personnel.type
              }</span>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
  `;
};

module.exports = { processPolicies };
