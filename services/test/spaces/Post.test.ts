import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { generateId } from '../../lib/shared/Utils';
import { handler } from '../../lib/spaces/Post';


const event = {
    body: {
        name: 'someName',
        location: 'someLocation'
    }
} as any

const context = {

} as any


describe('Create space test suite', () => {

    test('run request',async () => {
        await handler(event, context);
    })
});