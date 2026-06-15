export async function sendToLangdock(payload) {
    const WEBHOOK_URL = 'https://dentalab.katharina-zwick.workers.dev/';

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response;
}
