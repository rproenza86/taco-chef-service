// externals
import axios from 'axios';

// utils
import { buildResponse } from 'utils';

// constants
import { SPOONCULAR_ENDPOINT, SPOONCULAR_API_KEY } from './constants';

export const handler = async () => {
    try {
        const sauceRecipePath = '/recipes/complexSearch';
        const endpoint = `${SPOONCULAR_ENDPOINT}${sauceRecipePath}?apiKey=${SPOONCULAR_API_KEY}&query=sauces`;
        const sauces = await axios.get(endpoint);

        return buildResponse(200, sauces);
    } catch (error) {
        return buildResponse(500, {
            message: 'Recipes not found. Error fetching sauces recipes.',
            rawError: error,
        });
    }
};
