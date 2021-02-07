"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// external dependencies
const aws_sdk_1 = require("aws-sdk");
const uid_1 = require("uid");
exports.handler = async (event) => {
    let recipe;
    try {
        recipe = JSON.parse(event.body);
    }
    catch (error) {
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
        const dynamodb = new aws_sdk_1.DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;
        const newRecipe = Object.assign({ id: uid_1.uid(32) }, recipe);
        const params = {
            TableName: tableName,
            Item: newRecipe,
            ConditionExpression: 'attribute_not_exists(id)',
            ReturnConsumedCapacity: 'TOTAL',
        };
        const dbSavingResult = await dynamodb.put(params).promise();
        console.log('Taco recipe created.', { dbSavingResult, recipe });
        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Taco Recipe created.' }),
        };
    }
    catch (error) {
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
