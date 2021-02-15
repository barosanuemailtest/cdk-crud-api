import {
    APIGatewayProxyEventV2,
    Context,
    APIGatewayProxyResultV2
} from 'aws-lambda';

import { v4 as uuid } from 'uuid';

export async function handler(event: APIGatewayProxyEventV2, context: Context):Promise<APIGatewayProxyResultV2> {
    console.log('Event:');
    console.log(event);
    console.log('Context:');
    console.log(context);
    return {
        statusCode: 200,
        body: 'Hello from lambda, it is live! ' + uuid()        
    }
}