import { handler } from '../../lib/spaces/Get';


const event = {
    queryStringParameters: {
        spaceId: 'qkepir'
    }
} as any

const context = {

} as any


describe('Create space test suite', () => {

    test('run request', async () => {
        const result = await handler(event, context);
        console.log(123)
    })
});