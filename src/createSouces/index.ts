// externals
import axios, { AxiosRequestConfig } from 'axios';
import * as multipart from 'parse-multipart-data';

// utils
import { buildResponse } from 'utils';

const FormData = require('form-data');

export const handler = async (event: AWSLambda.APIGatewayEvent) => {
    try {
        const bodyBuffer = Buffer.from(event.body, 'base64');
        const boundary = multipart.getBoundary(
            event.headers['Content-Type'] || event.headers['content-type']
        );

        const parts = multipart.parse(bodyBuffer, boundary);

        const form = new FormData();
        parts.forEach((part) => {
            if (part.name) {
                form.append(part.name, part.data.toString('utf8'));
            }
            if (part?.type?.includes('image')) {
                form.append('image', part.data, { filename: part.filename });
            }
        });

        const sauceRecipePath = '/recipes/visualizeRecipe';
        const endpoint = `https://api.spoonacular.com${sauceRecipePath}?apiKey=3c96dbdcf8a645fd830ad715ffc77da2`;

        const config = {
            method: 'post',
            url: endpoint,
            headers: {
                ...form.getHeaders()
            },
            data: form
        };
        const cardRequestResult = await axios(config as AxiosRequestConfig);
        console.log('Request done', cardRequestResult);

        return buildResponse(cardRequestResult.status, cardRequestResult.data);
    } catch (error) {
        console.log('Error details: ', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Recipe not created. Error performing creation ops.'
            })
        };
    }
};
