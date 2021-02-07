export const buildResponse = (statusCode: number, body: object) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});
