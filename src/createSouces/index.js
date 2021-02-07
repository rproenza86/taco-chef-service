"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// external dependencies
const aws_sdk_1 = require("aws-sdk");
exports.handler = async (event) => {
    let recipe;
    try {
        recipe = JSON.parse(event.body);
    }
    catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Recipe not created. Bad Request.',
                rawError: error,
            }),
        };
    }
    try {
        const dynamodb = new aws_sdk_1.DynamoDB.DocumentClient();
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
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Recipe not created. Error performing DB ops.',
                rawError: error,
            }),
        };
    }
};
