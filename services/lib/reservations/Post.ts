import { APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { generateId } from '../shared/Utils';
import { ReservationEntry , ReservationState} from '../../../cloud_infrastructure/bin/stacks/DbModels'

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';

async function handler(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
    const response: APIGatewayProxyResultV2 = {};
    response.headers = {
        "Access-Control-Allow-Origin": "*"
    }
    const item: ReservationEntry = {
        reservationId: generateId(),
        spaceId: '',
        state: 'PENDING',
        user: 'someUser'
    }

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