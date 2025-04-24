// notifications.js
const { doc, getDoc } = require("firebase/firestore");
const sendEmail = require("./emailjsUtils");
const { formatEmailBody } = require("./formateEmail");

async function sendRenewalQuoteNotifications(db, newPrepQuote, renewalQuote) {
  // 1. Fetch the “renewalQuote” email template
  const tplRef = doc(db, "emailTemplates", "renewalQuote");
  const tplSnap = await getDoc(tplRef);
  if (!tplSnap.exists()) {
    throw new Error("Renewal‐quote email template not found");
  }
  const { subject, body } = tplSnap.data();

  console.log("notifcation email", subject, body);

  // 2. Send to the client
  // await sendEmail(
  //   //  renewalQuote?.Email,
  //   "zubairzahid228@gmail.com",
  //   subject,
  //   body
  // );

  // 3. If this was generated via a referral, notify the partner
  // if (newPrepQuote.byReferral) {
  // build a minimal referral object from your prep‐quote
  // const referral = {
  //   id: newPrepQuote?.ReferralId,
  //   name: newPrepQuote?.Referral?.name,
  // };
  const referral = {
    id: "5b2paZl57DSDs3MkuzNpw43uN362",
    name: "niraj",
  };

  await notifyReferralPartner(db, referral);
  // }
}

async function notifyReferralPartner(db, referral) {
  // Fetch the standard email template
  const templateRef = doc(db, "emailTemplates", "standard");
  const templateSnap = await getDoc(templateRef);
  if (!templateSnap.exists()) {
    throw new Error("Standard email template not found");
  }
  const template = templateSnap.data();

  // Fetch logo URL for this referral
  const logoRef = doc(db, "referralLogos", referral?.id);
  const logoSnap = await getDoc(logoRef);
  const logoUrl = logoSnap.exists() ? logoSnap.data()?.logoUrl : null;

  // Replace placeholders
  const emailSubject = template?.subject?.replace(
    /{referralName}/g,
    referral?.name
  );
  let emailBody = (template?.body || "").replace(
    /{referralName}/g,
    referral?.name
  );

  // Helper that injects the <img> tag at the right place
  emailBody = formatEmailBody(emailBody, logoUrl, template?.logoPosition);

  console.log("referral email", emailSubject, emailBody);
  // Send to the referral partner’s inbox
  // await sendEmail(
  //   // policy?.user?.email,
  //   "zubairzahid228@gmail.com",
  //   emailSubject,
  //   emailBody
  // );
}

module.exports = {
  sendRenewalQuoteNotifications,
  notifyReferralPartner,
};
