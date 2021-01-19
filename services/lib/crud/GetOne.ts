import {
    APIGatewayProxyEventV2,
    Context,
    APIGatewayProxyResultV2
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

async function handler(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {

    if (event.pathParameters && event.pathParameters.id) {
        const requestedItemId = event.pathParameters.id;
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