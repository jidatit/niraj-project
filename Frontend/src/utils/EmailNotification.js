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
      throw new Error("Renewal-quote email template not found");

    const { subject, body: renewalBody } = tplSnap.data();

    let finalBody = renewalBody.replace(
      /{client_name}/g,
      newPrepQuote?.user?.name || ""
    );

    // 2. If referral exists, include referral info in the same email
    if (newPrepQuote?.byReferral) {
      const referral = {
        id: newPrepQuote?.ReferralId,
        name: newPrepQuote?.Referral?.name,
        email: newPrepQuote?.Referral?.email,
      };

      // Try referral-specific template first, fall back to global standard
      let template;
      const referralTemplateRef = doc(db, "emailTemplates", referral?.id);
      const referralTemplateSnap = await getDoc(referralTemplateRef);
      if (referralTemplateSnap.exists()) {
        template = referralTemplateSnap.data();
      } else {
        const globalTemplateRef = doc(db, "emailTemplates", "standard");
        const globalTemplateSnap = await getDoc(globalTemplateRef);
        if (!globalTemplateSnap.exists())
          throw new Error("Standard email template not found");
        template = globalTemplateSnap.data();
      }

      const logoRef = doc(db, "referralLogos", referral?.id);
      const logoSnap = await getDoc(logoRef);
      const logoUrl = logoSnap.exists() ? logoSnap.data()?.logoUrl : null;

      let referralBody = template?.body?.replace(
        /{referralName}/g,
        referral?.name || ""
      );
      referralBody = referralBody.replace(
        /{client_name}/g,
        newPrepQuote?.user?.name || ""
      );
      referralBody = formatEmailBody(
        referralBody,
        logoUrl,
        template?.logoPosition
      );

      // Append referral section seamlessly without heading or separator
      finalBody += referralBody;
    }

    // 3. Send a single email with the merged content
    const clientParams = {
      from_name: "FL Insurance Hub",
      name: "FL Insurance Hub",
      to_email: renewalQuote?.[0]?.email,
      // for testing purposes
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

    console.log(` Combined renewal email sent to: ${renewalQuote?.[0]?.email}`);
  } catch (error) {
    console.error(" Error sending combined renewal quote notification:", error);
  }
}

export async function sendPreRenewalQuoteNotifications(formData) {
  try {
    const { user, Referral, ReferralId } = formData;

    // 1. Get referral quote email template
    const tplRef = doc(db, "emailTemplates", "renewalQuote");
    const tplSnap = await getDoc(tplRef);
    if (!tplSnap.exists())
      throw new Error("Referral quote email template not found");

    const { subject, body: renewalBody } = tplSnap.data();
    let finalBody = renewalBody.replace(/{client_name}/g, user?.name || "");

    // 2. If referral exists, include referral info in the same email
    if (user?.byReferral) {
      const referral = {
        id: ReferralId,
        name: Referral?.name,
        email: Referral?.email,
      };

      // Try referral-specific template first, fall back to global standard
      let template;
      const referralTemplateRef = doc(db, "emailTemplates", referral.id);
      const referralTemplateSnap = await getDoc(referralTemplateRef);
      if (referralTemplateSnap.exists()) {
        template = referralTemplateSnap.data();
      } else {
        const globalTemplateRef = doc(db, "emailTemplates", "standard");
        const globalTemplateSnap = await getDoc(globalTemplateRef);
        if (!globalTemplateSnap.exists())
          throw new Error("Standard email template not found");
        template = globalTemplateSnap.data();
      }

      const logoRef = doc(db, "referralLogos", referral?.id);
      const logoSnap = await getDoc(logoRef);
      const logoUrl = logoSnap.exists() ? logoSnap.data()?.logoUrl : null;

      let referralSection = template?.body?.replace(
        /{referralName}/g,
        referral?.name || ""
      );
      referralSection = referralSection.replace(
        /{client_name}/g,
        user?.name || ""
      );
      referralSection = formatEmailBody(
        referralSection,
        logoUrl,
        template?.logoPosition
      );

      // Append referral section seamlessly without heading or separator
      finalBody += referralSection;
    }

    // 3. Send a single email with the merged content
    const clientParams = {
      from_name: "FL Insurance Hub",
      name: "FL Insurance Hub",
      to_email: user?.email,
      // for testing:
      // to_email: "zubairzahid228@gmail.com",
      subject,
      body: finalBody,
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      clientParams,
      import.meta.env.VITE_EMAILJS_KEY
    );

    console.log(` Referral quote email sent to: ${user?.email}`);
  } catch (error) {
    console.error(" Error sending referral quote notification:", error);
  }
}
