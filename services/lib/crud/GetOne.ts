import {
    APIGatewayProxyEvent,
    Context,
    APIGatewayProxyResult
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    console.log(JSON.stringify(event));
    if (event.queryStringParameters && event.queryStringParameters.id) {
        const requestedItemId = event.queryStringParameters.id;
        const queryParams = {
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]: requestedItemId
            }
        };

        try {
            const response = await db.get(queryParams).promise();
            return { statusCode: 200, body: JSON.stringify(response.Item) };
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify(error) };
        }
    } else {
        return { statusCode: 400, body: `Error: You are missing the path parameter id` };
    }

}

export { handler }