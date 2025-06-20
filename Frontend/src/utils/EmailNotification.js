import emailjs from "@emailjs/browser";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../db";
import { formatEmailBody } from "../../../Backend/utils/formateEmail";

// Utility to send renewal quote email and optionally notify referral
export async function sendRenewalQuoteNotifications(
  newPrepQuote,
  renewalQuote
) {
  try {
    // 1. Get renewalQuote email template from Firestore
    const tplRef = doc(db, "emailTemplates", "renewalQuote");
    const tplSnap = await getDoc(tplRef);
    if (!tplSnap.exists())
      throw new Error("Renewal‐quote email template not found");

    const { subject, body } = tplSnap.data();

    // 2. Send email to the client
    const clientParams = {
      from_name: "FL Insurance Hub",
      name: "FL Insurance Hub",
      to_email: renewalQuote?.[0]?.email,
      // to_email: "zubair-zahid@jidatit.uk",
      subject,
      body,
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      clientParams,
      import.meta.env.VITE_EMAILJS_KEY
    );

    console.log(`✅ Renewal email sent to: ${renewalQuote?.[0]?.email}`);

    // 3. Optionally notify referral partner
    if (newPrepQuote.byReferral) {
      const referral = {
        id: newPrepQuote.ReferralId,
        name: newPrepQuote.Referral?.name,
        email: newPrepQuote.Referral?.email,
      };
      await notifyReferralPartner(newPrepQuote, referral);
    }
  } catch (error) {
    console.error("❌ Error sending renewal quote notification:", error);
  }
}
export async function notifyReferralPartner(newPrepQuote, referral) {
  try {
    // 1. Get email template
    const templateRef = doc(db, "emailTemplates", "standard");
    const templateSnap = await getDoc(templateRef);
    if (!templateSnap.exists())
      throw new Error("Standard email template not found");

    const template = templateSnap.data();

    // 2. Get referral logo
    const logoRef = doc(db, "referralLogos", referral?.id);
    const logoSnap = await getDoc(logoRef);
    const logoUrl = logoSnap.exists() ? logoSnap.data()?.logoUrl : null;

    // 3. Format email
    let emailBody = (template?.body || "").replace(
      /{referralName}/g,
      referral?.name
    );
    const emailSubject = template?.subject?.replace(
      /{referralName}/g,
      referral?.name
    );

    emailBody = formatEmailBody(emailBody, logoUrl, template?.logoPosition);

    const referralParams = {
      from_name: "FL Insurance Hub",
      name: "FL Insurance Hub",
      to_email: newPrepQuote?.user?.email,
      // to_email: "zubair-zahid@jidatit.uk",
      subject: emailSubject,
      body: emailBody,
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      referralParams,
      import.meta.env.VITE_EMAILJS_KEY
    );

    console.log(`✅ Referral email sent to: ${newPrepQuote?.user?.email}`);
  } catch (error) {
    console.error("❌ Error sending referral notification:", error);
  }
}
