import emailjs from '@emailjs/browser';

export function ClientQuoteReqMail(user_name, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type
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

export function ClientQuotePolicyCancelMail(user_name, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type
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

export function ClientQuotePolicyChangeMail(user_name, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type
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

export function ClientQuoteBindMail(user_name, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type
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

export function AdminPrepareQuoteMail(user_name, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type
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

export function AdminBindConfirmQuoteMail(user_name, policy_type) {
    const templateParams = {
        from_name: "FL Insurance Hub",
        name: user_name,
        type: policy_type
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