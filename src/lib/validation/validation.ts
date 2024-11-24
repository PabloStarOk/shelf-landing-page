const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneCodeRegex = /^[0-9]{1,3}$/;
const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const maxLengthRegex = /^.{0,400}$/;

const errorMessages = {
    nameEmpty: "El nombre es requerido.",
    emailEmpty: "El email no puede estar vacío.",
    emailInvalid: "El email no es válido.",
    phoneCodeEmpty: "El código de teléfono no puede estar vacío.",
    phoneCodeInvalid: "El código de teléfono es invalido.",
    phoneNumberEmpty: "El teléfono no puede estar vacío.",
    phoneNumberInvalid: "El teléfono no es válido.",
    messageMaxLength: "Longitud máxima de 400 caracteres."
};

const validateField = (
    value: string,
    regex: RegExp | null,
    emptyMessage: string,
    invalidMessage: string
): string => {
    if (value === "") return emptyMessage;
    else if (regex && !regex.test(value)) return invalidMessage;
    return ""; // No errors
}

export const validateForm = (formData: FormData): boolean => {
    // TODO: Should this be a Map and moved outside the event listener, and fill the values inside the listener? (Performance)
    const validationMap = [
        {
            value: formData.get("name")?.toString() ?? "",
            regex: null,
            emptyMessage: errorMessages.nameEmpty,
            invalidMessage: "",
            errorElement: document.querySelector("#name-error") as HTMLParagraphElement,
        },
        {
            value: formData.get("email")?.toString() ?? "", // TODO: Verify if the email was already sent.
            regex: emailRegex,
            emptyMessage: errorMessages.emailEmpty,
            invalidMessage: errorMessages.emailInvalid,
            errorElement: document.querySelector("#email-error") as HTMLParagraphElement,
        },
        {
            value: formData.get("phone-code")?.toString() ?? "",
            regex: phoneCodeRegex,
            emptyMessage: errorMessages.phoneCodeEmpty,
            invalidMessage: errorMessages.phoneCodeInvalid,
            errorElement: document.querySelector("#phone-code-error") as HTMLParagraphElement,
        },
        {
            value: formData.get("phone-number")?.toString() ?? "",
            regex: phoneNumberRegex,
            emptyMessage: errorMessages.phoneNumberEmpty,
            invalidMessage: errorMessages.phoneNumberInvalid,
            errorElement: document.querySelector("#phone-number-error") as HTMLParagraphElement,
        },
        {
            value: formData.get("message")?.toString() ?? "",
            regex: maxLengthRegex,
            emptyMessage: "",
            invalidMessage: errorMessages.messageMaxLength,
            errorElement: document.querySelector("#message-error") as HTMLParagraphElement
        }
    ];

    let isValid: boolean = true;
    validationMap.forEach(({ value, regex, emptyMessage, invalidMessage, errorElement, }) => {
        const errorMessage = validateField(value, regex, emptyMessage, invalidMessage);
        if (errorMessage) isValid = false;

        if (errorElement.id == "phone-number-error") // TODO: Messy conditional, should both errors be displayed?
        {
            errorElement.hidden = errorMessage ? false : true;
            validationMap[2].errorElement.hidden = !errorElement.hidden;
            errorElement.textContent = errorMessage;
            if (!errorElement.hidden)
                errorElement.classList.add("show");
            return;
        }

        if (!errorMessage) {
            errorElement.classList.remove("show");
            return;
        }

        errorElement.classList.add("show");
        errorElement.textContent = errorMessage;
    });

    return isValid;
}
