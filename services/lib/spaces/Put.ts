import { APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

async function handler(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {

    const response: APIGatewayProxyResultV2 = {};
    response.headers = {
        "Access-Control-Allow-Origin" : "*"
    }
    try {
        const queryParams = event.queryStringParameters;
        const requestBody = event.body
        if (queryParams && requestBody) {
            const spaceId = queryParams.spaceId
            const requestBodyKeys = Object.keys(requestBody);
            const requestBodyValues = Object.values(requestBody);
            if (spaceId && requestBodyKeys.length > 0) {
                const params = {
                    TableName: TABLE_NAME,
                    Key: {
                        [PRIMARY_KEY]: spaceId
                    },
                    UpdateExpression: `set #zcxNewValue = :new`,
                    ExpressionAttributeValues: {
                        ':new': `${requestBodyValues[0]}`
                    },
                    ExpressionAttributeNames: {
                        '#zcxNewValue': `${requestBodyKeys[0]}`
                    }
                }
                const updateResult = await db.update(params).promise();
                response.statusCode = 202;
                response.body = JSON.stringify(updateResult)
            }
        } else {
            response.statusCode = 403;
            response.body = 'Required params and request body'
        }

    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify(error)
    }

    return response;

}

export { handler }