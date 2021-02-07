// external dependencies
import { DynamoDB } from 'aws-sdk';

// types
import { IRecipe } from '../types';

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<any> => {
    let recipe: IRecipe;

    try {
        recipe = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Recipe not created. Bad Request.',
                rawError: error,
            }),
        };
    }

    try {
        const dynamodb = new DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;

        const params = {
            TableName: tableName,
            Item: recipe,
            ConditionExpression: 'attribute_not_exists(name)',
            ReturnConsumedCapacity: 'TOTAL',
        };

        const dbSavingResult = await dynamodb.put(params).promise();
        console.log('Taco recipe created.', { dbSavingResult, recipe });

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Taco Recipe created.' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Recipe not created. Error performing DB ops.',
                rawError: error,
            }),
        };
    }
};
