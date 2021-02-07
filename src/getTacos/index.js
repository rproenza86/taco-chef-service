"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// external dependencies
const aws_sdk_1 = require("aws-sdk");
// utils
const utils_1 = require("utils");
exports.handler = async (event) => {
    try {
        const dynamodb = new aws_sdk_1.DynamoDB.DocumentClient();
        const tableName = process.env.TABLE_NAME;
        const params = {
            TableName: tableName,
            ReturnConsumedCapacity: 'TOTAL',
        };
        const dbSavingResult = await dynamodb.scan(params).promise();
        return utils_1.buildResponse(200, {
            recipes: dbSavingResult.Items,
            count: dbSavingResult.Count,
        });
    }
    catch (error) {
        return utils_1.buildResponse(500, {
            message: 'Recipes not found. Error performing DB ops.',
            rawError: error,
        });
    }
};
