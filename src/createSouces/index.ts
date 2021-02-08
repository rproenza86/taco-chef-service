// externals
import axios from 'axios';
import multipart from 'aws-lambda-multipart-parser';

// utils
import { buildResponse } from 'utils';

const FormData = require('form-data');

export const handler = async (
    event: AWSLambda.APIGatewayEvent
): Promise<any> => {
    try {
        const payload = multipart(event, true);

        const form = new FormData();
        form.append('title', payload.title);
        form.append('image', payload.image);
        form.append('author', payload.author);
        form.append('ingredients', payload.ingredients);

        const sauceRecipePath = '/recipes/visualizeRecipe';
        const endpoint = `https://api.spoonacular.com${sauceRecipePath}?apiKey=3c96dbdcf8a645fd830ad715ffc77da2`;
        const options = { body: event.body };

        const sauces = await axios.post(endpoint, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return buildResponse(sauces.status, sauces.data);
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
