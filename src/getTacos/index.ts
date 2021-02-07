// external dependencies
import { DynamoDB } from 'aws-sdk';

// types
import { IRecipe } from '../types';

// utils
import { buildResponse } from 'utils';

export const handler = async (event: AWSLambda.APIGatewayEvent) => {
    try {
        const dynamodb = new DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;

        const params = {
            TableName: tableName,
            ReturnConsumedCapacity: 'TOTAL',
        };

        const dbSavingResult = await dynamodb.scan(params).promise();
        return buildResponse(200, {
            recipes: dbSavingResult.Items,
            count: dbSavingResult.Count,
        });
    } catch (error) {
        return buildResponse(500, {
            message: 'Recipes not found. Error performing DB ops.',
            rawError: error,
        });
    }
};
