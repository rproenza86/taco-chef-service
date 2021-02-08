// external dependencies
import { DynamoDB } from 'aws-sdk';

// utils
import { buildResponse } from 'utils';

export const handler = async (
    event: AWSLambda.APIGatewayEvent
): Promise<any> => {
    const recipeId: string = event.pathParameters.recipeId;

    if (!recipeId) {
        return buildResponse(400, {
            message: 'Bad Request.Missed recipeId.'
        });
    }

    try {
        const dynamodb = new DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;

        const params = {
            TableName: tableName,
            Key: {
                id: recipeId
            }
        };

        const deleteResult = await dynamodb.delete(params).promise();
        console.log('Taco recipe deleted successfully.', {
            deleteResult,
            recipeId
        });

        return buildResponse(200, { message: 'Taco Recipe deleted.' });
    } catch (error) {
        console.log('Error details: ', error);

        return buildResponse(500, {
            message: 'Recipe not deleted. Error performing DB ops.'
        });
    }
};
