import { APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2, APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { generateId } from '../shared/Utils';
import { ReservationEntry, ReservationState } from '../../../cloud_infrastructure/bin/stacks/DbModels'

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResultV2> {
    const response: APIGatewayProxyResultV2 = {};
    response.headers = {
        "Access-Control-Allow-Origin": "*"
    }
    if (event.body) {
        const parsedBody = JSON.parse(event.body);
        if (parsedBody.spaceId) {
            const reservationId = generateId()
            const item: ReservationEntry = {
                reservationId: reservationId,
                spaceId: parsedBody.spaceId,
                state: 'PENDING',
                user: getUserName(event)
            }

            const params = {
                TableName: TABLE_NAME,
                Item: item
            };

            try {
                await db.put(params).promise();
                response.statusCode = 201
                response.body = 'Created reservation with id: ' + reservationId
                return response;
            } catch (dbError) {
                response.statusCode = 500
                response.body = dbError
                return response;
            }
        } else {
            response.statusCode = 403
            response.body = 'Missing parameter spaceId in request body'
            return response;
        }
    } else {
        response.statusCode = 403
        response.body = 'Missing parameter spaceId in request body'
        return response;
    }

}

function getUserName(event: APIGatewayProxyEvent) {
    return event.requestContext.authorizer?.claims['cognito:username'] as string;
    //  return event.requestContext.authorizer?.jwt.claims['cognito:username'] as string;
}