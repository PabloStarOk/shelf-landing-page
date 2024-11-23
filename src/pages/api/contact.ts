export const prerender = false;
import { dbInfo, supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

const validateForm = (formData: FormData): boolean => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneCodeRegex = /^[0-9]{1,3}$/;
    const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const maxLengthRegex = /^.{0,400}$/;

    const validateField = (
        value: string,
        regex: RegExp | null
    ): boolean => {
        if (!value || (regex && !regex.test(value))) return false;
        return true; // No errors
    }

    const validationMap = [
        {
            value: formData.get("name")?.toString() ?? "",
            regex: null,
        },
        {
            value: formData.get("email")?.toString() ?? "",
            regex: emailRegex
        },
        {
            value: formData.get("phone-code")?.toString() ?? "",
            regex: phoneCodeRegex
        },
        {
            value: formData.get("phone-number")?.toString() ?? "",
            regex: phoneNumberRegex
        },
        {
            value: formData.get("message")?.toString() ?? "",
            regex: maxLengthRegex
        }
    ];

    return validationMap.every(({ value, regex }) => validateField(value, regex));
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

        const data = {
            name: formData.get("name")?.toString() ?? "",
            email: formData.get("email")?.toString() ?? "",
            phone_code: formData.get("phone-code") as number | null,
            phone_number: formData.get("phone-number") as number | null,
            message: formData.get("message")?.toString() ?? "" // BUG: When user doesn't provide a message.
        }

        const { error } = await supabase.schema(dbInfo.schema).from(dbInfo.formsTable).insert(data);

        return !error
            ? createResponse("Form data was saved successfully.", 201)
            : createResponse("Failed to save form data. Please try again later.", 500);
    } catch {
        return createResponse("An unexpected error occurred.", 500);
    }
}
