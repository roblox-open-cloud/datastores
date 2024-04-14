/**
 * Request fucntion.
 * @param url The URL that you are fetching from.
 * @param parameters The parameters for the request.
 */
export async function request(url: URL, parameters: RequestInit) {
    const response = await fetch(url, parameters);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response;
}