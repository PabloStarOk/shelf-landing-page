export const prerender = false;
import { getAnalytic, getAnalytics, updateAnalytic, type AnalyticResponse } from "@/lib/database/analyticsRepository";
import type { APIRoute } from "astro";

function createResponse(body: any, statusCode: number): Response {
    return new Response(JSON.stringify(body), {
        status: statusCode,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const GET: APIRoute = async ({ url }) => {
    try {
        const param = url.searchParams.get("analytic") as string;

        const analyticResponse: AnalyticResponse = param
            ? await getAnalytic(param)
            : await getAnalytics();

        if (analyticResponse.error) {
            return createResponse("An unexpected error occurred.", 500)
        }

        return createResponse(analyticResponse.data, 200);

    } catch {
        return createResponse("An unexpected error occurred.", 500);
    }
}

export const PATCH: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        const error = await updateAnalytic(body.name, body.quantity);

        if (error) {
            return createResponse("Error while updating analytics.", 500);
        }

        return createResponse("Analytic data found.", 200);

    } catch {
        return createResponse("An unexpected error occurred.", 500);
    }
}
