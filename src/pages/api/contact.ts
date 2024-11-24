export const prerender = false;
import { dbInfo, supabase } from "@/lib/database/supabase";
import type { APIRoute } from "astro";

type UserForm = {
    name: string;
    email: string;
    phone_code: number;
    phone_number: number;
    message: string;
}

const createUserForm = (formData: FormData): UserForm => {
    const data: UserForm = {
        name: formData.get("name")?.toString() ?? "",
        email: formData.get("email")?.toString() ?? "",
        phone_code: parseInt(formData.get("phone-code")?.toString() ?? ""),
        phone_number: parseInt(formData.get("phone-number")?.toString() ?? ""),
        message: formData.get("message")?.toString() ?? ""
    }
    return data;
}

const validateForm = (formData: FormData): boolean => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneCodeRegex = /^[0-9]{1,3}$/;
    const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const maxLengthRegex = /^.{0,400}$/;

    const validateField = (
        value: string,
        regex: RegExp | null,
        isOptional: boolean
    ): boolean => {
        if ((!value && !isOptional) || (regex && !regex.test(value))) {
            return false;
        }
        return true; // No errors
    }

    const userForm = createUserForm(formData);

    const validationMap = [
        {
            value: userForm.name,
            regex: null,
            isOptional: false
        },
        {
            value: userForm.email,
            regex: emailRegex,
            isOptional: false
        },
        {
            value: userForm.phone_code.toString(),
            regex: phoneCodeRegex,
            isOptional: false
        },
        {
            value: userForm.phone_number.toString(),
            regex: phoneNumberRegex,
            isOptional: false
        },
        {
            value: userForm.message,
            regex: maxLengthRegex,
            isOptional: true
        }
    ];

    return validationMap.every(({ value, regex, isOptional }) => validateField(value, regex, isOptional));
}

const createResponse = (message: string, statusCode: number): Response => {
    return new Response(JSON.stringify(message), {
        status: statusCode,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const POST: APIRoute = async ({ request }): Promise<Response> => {
    try {
        const formData = await request.formData();

        if (!validateForm(formData))
            return createResponse("Form data is not valid.", 400);

        const userForm: UserForm = createUserForm(formData);

        const { error } = await supabase.schema(dbInfo.schema).from(dbInfo.formsTable).insert(userForm);

        return !error
            ? createResponse("Form data was saved successfully.", 201)
            : createResponse("Failed to save form data. Please try again later.", 500);
    } catch {
        return createResponse("An unexpected error occurred.", 500);
    }
}
