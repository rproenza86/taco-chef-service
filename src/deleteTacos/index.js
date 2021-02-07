"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// external dependencies
const aws_sdk_1 = require("aws-sdk");
// utils
const utils_1 = require("utils");
exports.handler = async (event) => {
    const recipeId = event.pathParameters.recipeId;
    if (!recipeId) {
        return utils_1.buildResponse(400, {
            message: 'Bad Request.Missed recipeId.',
        });
    }
    try {
        const dynamodb = new aws_sdk_1.DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;
        const params = {
            TableName: tableName,
            Key: {
                id: recipeId,
            },
        };
        const deleteResult = await dynamodb.delete(params).promise();
        console.log('Taco recipe deleted successfully.', {
            deleteResult,
            recipeId,
        });
        return utils_1.buildResponse(200, { message: 'Taco Recipe deleted.' });
    }
    catch (error) {
        return utils_1.buildResponse(500, {
            message: 'Recipe not deleted. Error performing DB ops.',
            rawError: error,
        });
    }
};
