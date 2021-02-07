"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const sinon_1 = require("sinon");
const chai = require("chai");
const aws_sdk_1 = require("aws-sdk");
// code under test
const __1 = require("..");
// mocks
const createEvent_json_1 = require("../__mocks__/createEvent.json");
const expect = chai.expect;
const sandbox = sinon_1.default.createSandbox();
const returnValueMock = {
    promise() {
        return {};
    },
};
describe('CreateTaco lambda', function () {
    let putStub;
    beforeEach(() => {
        putStub = sandbox.stub(aws_sdk_1.DynamoDB.DocumentClient.prototype, 'put');
    });
    afterEach(() => {
        sandbox.restore();
        sinon_1.default.restore();
    });
    it('should save recipe and return successful response - return 201', async () => {
        putStub.returns(returnValueMock);
        const expected = {
            name: 'TacoMax',
            description: 'Best taco recipe',
            instructions: 'slow cook',
            ingredients: {
                shell: 'corn bread',
                proteins: '8g',
                toppings: 'chili',
                sauce: 'tomato',
            },
        };
        const response = await __1.handler(createEvent_json_1.default);
        const addedItem = putStub.getCall(0).args[0].Item;
        delete addedItem.id; // Avoid dealing with uui generated values
        expect(addedItem).to.eql(expected);
        expect(response.statusCode).to.eql(201);
    });
    it('should gracefully handle payload errors - return 400', async () => {
        const expected = '{"headers":{"Content-Type":"application/json"},"message":"Recipe not created. Bad Request.","rawError":{}}';
        const event = Object.assign({}, createEvent_json_1.default);
        event.body = 'invalid json';
        const response = await __1.handler(event);
        expect(response.body).to.eql(expected);
        expect(response.statusCode).to.eql(400);
    });
    it('should handle db ops errors gracefully - return 500', async () => {
        putStub.throws();
        const expected = '{"message":"Recipe not created. Error performing DB ops.","rawError":{}}';
        const response = await __1.handler(createEvent_json_1.default);
        expect(response.body).to.eql(expected);
        expect(response.statusCode).to.eql(500);
    });
});
