import { APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { generateId } from '../shared/Utils';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

async function handler(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {

    if (!event.body) {
        return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
    }
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    if(!item.name){
        return { statusCode: 400, body: 'invalid request, you are missing the parameter name' };
    }
    if(!item.location){
        return { statusCode: 400, body: 'invalid request, you are missing the parameter location' };
    }
    item[PRIMARY_KEY] = generateId();
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };

    try {
        await db.put(params).promise();
        return { statusCode: 201, body: 'Created' };
    } catch (dbError) {
        console.log(dbError);
        return { statusCode: 500, body: dbError };
    }

}

export { handler }