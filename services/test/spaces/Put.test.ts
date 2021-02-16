import { handler } from '../../lib/spaces/Put';


const event = {
    body: {
        locationzzz: 'someLocation-CHANGED'
    },
    queryStringParameters: {
        spaceId: 'ra071m'
    }
} as any

const context = {

} as any


describe('Create space test suite', () => {

    test('run request',async () => {
        const result = await handler(event, context);
        console.log(123)
    })
});