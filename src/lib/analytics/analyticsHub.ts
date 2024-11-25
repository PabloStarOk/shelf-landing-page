export enum AnalyticNames {
    FormSubmissions = "FormSubmissions",
    UserInteractions = "UserInteractions",
    PageVisits = "PageVisits",
}

export type Cookie = {
    name: string,
    value: string
}

function getCookie(name: string) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop()?.split(";").shift();
}

function setCookie(cookie: Cookie, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookie.name + "=" + cookie.value + ";" + expires + ";path=/";
}

// Returns true if the value was updated, false otherwise.
export async function updateAnalytic(name: AnalyticNames, quantity: number, cookie?: Cookie): Promise<boolean> {
    const dataToUpdate = JSON.stringify({
        name: AnalyticNames[name],
        quantity
    });

    const actionCookie = getCookie(cookie?.name ?? ""); // Check if it's a new user doing the action

    if (!actionCookie) {
        await fetch("/api/analytics", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataToUpdate
        }).then((response) => {
            if (cookie)
                setCookie(cookie);
            return response.ok; // TODO: Update automatically UserInteractions metric card.
        }).catch(() => { return false; })
        return true;
    }

    return false;
}
