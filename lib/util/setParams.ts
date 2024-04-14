export function setParams<ParamTypes extends Object>(url: URL | URLSearchParams, params: ParamTypes) {
    if (url instanceof URL) {
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value.toString());
        }   
    } else {
        for (const [key, value] of Object.entries(params)) {
            url.set(key, value.toString());
        }
    }
}