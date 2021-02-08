// external dependencies
import { DynamoDB } from 'aws-sdk';

// utils
import { buildResponse } from 'utils';

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event: AWSLambda.APIGatewayEvent) => {
    let updates;
    const recipeId: string = event.pathParameters.recipeId;

    if (!recipeId) {
        return buildResponse(400, {
            message: 'Bad Request.Missed recipeId.'
        });
    }

    try {
        updates = JSON.parse(event.body);
    } catch (error) {
        console.log('Error details: ', error);

        return buildResponse(400, {
            message: 'Recipe not updated. Bad Request.'
        });
    }

    try {
        const tableName = process.env.TABLE_NAME;
        const recipeUpdate = {
            ...updates,
            id: recipeId
        };

        const params = {
            TableName: tableName,
            Item: recipeUpdate
        };

        const dbSavingResult = await dynamodb.put(params).promise();
        console.log('Taco recipe updated successfully.', {
            dbSavingResult,
            updates
        });

        return buildResponse(201, { message: 'Taco Recipe updated.' });
    } catch (error) {
        console.log('Error details: ', error);

        return buildResponse(500, {
            message: 'Recipe not updated. Error performing update.'
        });
    }
};
