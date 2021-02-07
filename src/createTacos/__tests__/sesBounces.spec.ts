import 'mocha';
import sinon from 'sinon';
import * as chai from 'chai';
import { DynamoDB } from 'aws-sdk';

// code under test
import { handler as createTaco } from '..';

// mocks
import createEvent from '../__mocks__/createEvent.json';

const expect = chai.expect;

const sandbox = sinon.createSandbox();
const returnValueMock = {
    promise() {
        return {};
    },
} as unknown;

describe('CreateTaco lambda', function () {
    let putStub;

    beforeEach(() => {
        putStub = sandbox.stub(DynamoDB.DocumentClient.prototype, 'put');
    });

    afterEach(() => {
        sandbox.restore();
        sinon.restore();
    });

    it('should save recipe and return successful response - return 201', async () => {
        putStub.returns(returnValueMock as any);
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

        const response = await createTaco(createEvent as any);
        const addedItem = putStub.getCall(0).args[0].Item;
        delete addedItem.id; // Avoid dealing with uui generated values

        expect(addedItem).to.eql(expected);
        expect(response.statusCode).to.eql(201);
    });

    it('should gracefully handle payload errors - return 400', async () => {
        const expected =
            '{"headers":{"Content-Type":"application/json"},"message":"Recipe not created. Bad Request.","rawError":{}}';
        const event = { ...createEvent };
        event.body = 'invalid json';

        const response = await createTaco(event as any);

        expect(response.body).to.eql(expected);
        expect(response.statusCode).to.eql(400);
    });

    it('should handle db ops errors gracefully - return 500', async () => {
        putStub.throws();
        const expected =
            '{"message":"Recipe not created. Error performing DB ops.","rawError":{}}';

        const response = await createTaco(createEvent as any);

        expect(response.body).to.eql(expected);
        expect(response.statusCode).to.eql(500);
    });
});
