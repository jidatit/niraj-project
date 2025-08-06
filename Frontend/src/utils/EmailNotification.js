import emailjs from "@emailjs/browser";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../db";
import { formatEmailBody } from "./formatEmailBody";

export async function sendRenewalQuoteNotifications(
  newPrepQuote,
  renewalQuote
) {
  try {
    // 1. Get renewalQuote email template
    const tplRef = doc(db, "emailTemplates", "renewalQuote");
    const tplSnap = await getDoc(tplRef);
    if (!tplSnap.exists())
      throw new Error("Renewal‐quote email template not found");

    const { subject, body: renewalBody } = tplSnap.data();

    let finalBody = renewalBody;

    // 2. If referral exists, include referral info in the same email
    if (newPrepQuote.byReferral) {
      const referral = {
        id: newPrepQuote.ReferralId,
        name: newPrepQuote.Referral?.name,
        email: newPrepQuote.Referral?.email,
      };

      const templateRef = doc(db, "emailTemplates", "standard");
      const templateSnap = await getDoc(templateRef);
      if (!templateSnap.exists())
        throw new Error("Standard email template not found");

      const template = templateSnap.data();

      const logoRef = doc(db, "referralLogos", referral?.id);
      const logoSnap = await getDoc(logoRef);
      const logoUrl = logoSnap.exists() ? logoSnap.data()?.logoUrl : null;

      let referralBody = template?.body?.replace(
        /{referralName}/g,
        referral?.name || ""
      );
      referralBody = formatEmailBody(
        referralBody,
        logoUrl,
        template?.logoPosition
      );

      // Append referral section to the main email
      finalBody += `<hr><br/><strong>Referral Partner Info:</strong><br/>${referralBody}`;
    }

    // 3. Send a single email with the merged content
    const clientParams = {
      from_name: "FL Insurance Hub",
      name: "FL Insurance Hub",
      to_email: renewalQuote?.[0]?.email,
      //for testing purposes
      // to_email: "zubair-zahid@jidatit.uk",
      subject,
      body: finalBody,
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      clientParams,
      import.meta.env.VITE_EMAILJS_KEY
    );

    console.log(
      `✅ Combined renewal email sent to: ${renewalQuote?.[0]?.email}`
    );
  } catch (error) {
    console.error(
      "❌ Error sending combined renewal quote notification:",
      error
    );
  }
}
