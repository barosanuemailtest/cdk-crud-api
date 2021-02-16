import { APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

async function handler(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
    try {
        let result: DynamoDB.GetItemOutput;
        if (event.queryStringParameters && event.queryStringParameters?.[PRIMARY_KEY]) {
            const requestedItemId = event.queryStringParameters?.[PRIMARY_KEY]
            const queryParams = {
                TableName: TABLE_NAME,
                Key: {
                    [PRIMARY_KEY]: requestedItemId
                }
            };
            result = await db.get(queryParams).promise();
        } else {
            const scanParams: DynamoDB.ScanInput = {
                TableName: TABLE_NAME
            }
            result = await db.scan(scanParams).promise();
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 200,
            body: error
        }
    }


}



export { handler }