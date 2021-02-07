// external dependencies
import { DynamoDB } from 'aws-sdk';
import * as uuiApp from 'uid';

// types
import { IRecipe } from '../types';

// utils
import { buildResponse } from 'utils';

export const handler = async (
    event: AWSLambda.APIGatewayEvent,
): Promise<any> => {
    let recipe: IRecipe;

    try {
        recipe = JSON.parse(event.body);
    } catch (error) {
        return buildResponse(400, {
            message: 'Recipe not created. Bad Request.',
            rawError: error,
        });
    }

    try {
        const dynamodb = new DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;

        const newRecipe = {
            id: uuiApp.uid(32),
            ...recipe,
        };

        const params = {
            TableName: tableName,
            Item: newRecipe,
            ConditionExpression: 'attribute_not_exists(id)',
            ReturnConsumedCapacity: 'TOTAL',
        };

        const dbSavingResult = await dynamodb.put(params).promise();
        console.log('Taco recipe created successfully.', {
            dbSavingResult,
            recipe,
        });

        return buildResponse(201, { message: 'Taco Recipe created.' });
    } catch (error) {
        return buildResponse(500, {
            message: 'Recipe not created. Error performing DB ops.',
            rawError: error,
        });
    }
};
