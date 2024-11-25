import { dbInfo, supabase } from "@/lib/database/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

export type Analytic = {
    name: string,
    count: number,
}

export type AnalyticResponse = {
    data: Analytic | Analytic[],
    error: PostgrestError | null
}

function parseAnalytic(rawData: any): Analytic {
    const data: Analytic = {
        name: rawData.name,
        count: rawData[0].count as number
    }
    return data;
}

function parseAnalytics(rawData: any): Analytic[] {
    const analytics: Analytic[] = [
        {
            name: rawData[0].name,
            count: rawData[0].count
        },
        {
            name: rawData[1].name,
            count: rawData[1].count
        },
        {
            name: rawData[2].name,
            count: rawData[2].count
        },
    ];
    return analytics;
}

export async function getAnalytic(eventName: string): Promise<AnalyticResponse> {
    const { data, error } = await supabase.schema(dbInfo.schema)
        .from(dbInfo.analyticsTable)
        .select("count")
        .eq("name", eventName);

    const analytic = parseAnalytic(data);
    return { data: analytic, error: error };
}

export async function getAnalytics(): Promise<AnalyticResponse> {
    const { data, error } = await supabase.schema(dbInfo.schema)
        .from(dbInfo.analyticsTable)
        .select("*");

    const analytics = parseAnalytics(data);
    return { data: analytics, error: error };
}

export async function updateAnalytic(name: string, quantity?: number): Promise<PostgrestError | null> {
    const response: AnalyticResponse = await getAnalytic(name);

    if (response.error) return response.error;

    const currentValue: Analytic = response.data as Analytic;
    const quantityToAdd: number = quantity ? quantity : 1; // Quantity to add to the analytic.

    const { error } = await supabase.schema(dbInfo.schema)
        .from(dbInfo.analyticsTable)
        .update({ count: currentValue.count + quantityToAdd })
        .eq("name", name);

    return error;
}
