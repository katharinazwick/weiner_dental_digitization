//https://app.langdock.com/api/hooks/workflows/a9d7a255-87de-4d26-b404-a6f2a1c01c48

// langdockConnection.js
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
