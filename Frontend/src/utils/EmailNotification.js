import emailjs from "@emailjs/browser";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../db";
import { formatEmailBody } from "./formatEmailBody";
import { getDisplayName } from "./namesUtil";

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
      getDisplayName(newPrepQuote?.user) || ""
    );

    // 2. If referral exists, include referral info in the same email
    if (newPrepQuote?.byReferral) {
      const referral = {
        id: newPrepQuote?.ReferralId,
        name: newPrepQuote?.Referral?.name,
        email: newPrepQuote?.Referral?.email,
        firstName: newPrepQuote?.Referral?.firstName,
        lastName: newPrepQuote?.Referral?.lastName,
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
        getDisplayName(referral) || ""
      );
      referralBody = referralBody.replace(
        /{client_name}/g,
        getDisplayName(newPrepQuote?.user) || ""
      );
      referralBody = formatEmailBody(
        referralBody,
        logoUrl,
        template?.logoPosition
      );

      // Append referral section to the main email
      finalBody += referralBody;
    }

    // 3. Send a single email with the merged content
    const clientParams = {
      from_name: "FL Insurance Hub",
      name: "FL Insurance Hub",
      to_email: renewalQuote?.[0]?.email,
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
  console.log("sendPreRenewalQuoteNotifications called with:", formData);
  try {
    const { user, Referral, ReferralId } = formData;

    // 1. Get referral quote email template
    const tplRef = doc(db, "emailTemplates", "renewalQuote");
    const tplSnap = await getDoc(tplRef);
    if (!tplSnap.exists())
      throw new Error("Referral quote email template not found");

    const { subject, body: referralBody } = tplSnap.data();
    let finalBody = referralBody.replace(
      /{client_name}/g,
      getDisplayName(user) || ""
    );

    // 2. If referral exists, include referral info in the same email
    if (user?.byReferral) {
      const referral = {
        id: ReferralId,
        name: Referral?.name,
        email: Referral?.email,
        firstName: Referral?.firstName,
        lastName: Referral?.lastName,
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
        getDisplayName(referral) || ""
      );
      referralSection = referralSection.replace(
        /{client_name}/g,
        getDisplayName(user) || ""
      );
      referralSection = formatEmailBody(
        referralSection,
        logoUrl,
        template?.logoPosition
      );

      // Append referral section to the main email
      finalBody += referralSection;
    }

    // 3. Send a single email with the merged content
    const clientParams = {
      from_name: "FL Insurance Hub",
      name: "FL Insurance Hub",
      to_email: user?.email,
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
