// external dependencies
import { DynamoDB } from 'aws-sdk';
import * as uuiApp from 'uid';

// types
import { IRecipe } from '../types';

export const handler = async (
    event: AWSLambda.APIGatewayEvent,
): Promise<any> => {
    let recipe: IRecipe;

    try {
        recipe = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                headers: {
                    'Content-Type': 'application/json',
                },
                message: 'Recipe not created. Bad Request.',
                rawError: error,
            }),
        };
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
        console.log('Taco recipe created successfully.', { dbSavingResult, recipe });

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Taco Recipe created.' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Recipe not created. Error performing DB ops.',
                rawError: error,
            }),
        };
    }
};
