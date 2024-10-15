import emailjs from '@emailjs/browser';
//done
export function ClientQuoteReqMail(user_name, user_email, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type,
        email: user_email
    };

    emailjs
        .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_QR_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
            console.log('FAILED...', err);
        });
}
//done
export function ClientQuotePolicyCancelMail(user_name, user_email, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type,
        email: user_email
    };
    emailjs
        .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_CLIENTCANCELPOLICY_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
            console.log('FAILED...', err);
        });
}
//done
export function ClientQuotePolicyChangeMail(user_name, user_email, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type,
        email: user_email
    };
    emailjs
        .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_CLIENTCHANGECOVERAGE_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
            console.log('FAILED...', err);
        });
}
//done
export function ClientQuoteBindMail(user_name, user_email, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type,
        email: user_email
    };
    emailjs
        .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_CLIENTBINDREQ_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
            console.log('FAILED...', err);
        });
}
//done
export function AdminPrepareQuoteMail(user_name, user_email, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type,
        email: user_email
    };
    emailjs
        .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_ADMINQUOTEPREP_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
            console.log('FAILED...', err);
        });
}
//done
export function AdminBindConfirmQuoteMail(user_name, user_email, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type,
        email: user_email
    };
    emailjs
        .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_ADMINBINDCONFIRM_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
            console.log('FAILED...', err);
        });
}
//done
export function AdminSendReminder(user_name, user_email, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        email: user_email,
        message: `Your quote for type ${policy_type} has been submitted, but it won't get started until you have uploaded the required inspections. Please make sure to complete this step as soon as possible.`,
        current_date: new Date().toISOString()
    };
    emailjs
        .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_ADMINSENDREMINDER_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
            console.log('FAILED...', err);
        });
}