import { APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { generateId } from '../shared/Utils';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

async function handler(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
    const response: APIGatewayProxyResultV2 = {};
    response.headers = {
        "Access-Control-Allow-Origin": "*"
    }
    if (!event.body) {
        response.statusCode = 400
        response.body = 'invalid request, you are missing the parameter body'
        return response;
    }
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    if (!item.name) {
        response.statusCode = 400
        response.body = 'invalid request, you are missing the parameter name'
        return response;
    }
    if (!item.location) {
        response.statusCode = 400
        response.body = 'invalid request, you are missing the parameter location'
        return response;
    }
    item[PRIMARY_KEY] = generateId();
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };

    try {
        await db.put(params).promise();
        response.statusCode = 201
        response.body = 'Created'
        return response;
    } catch (dbError) {
        response.statusCode = 500
        response.body = dbError
        return response;
    }

}

export { handler }