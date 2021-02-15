import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Context } from "vm";



class Put {

    private dbClient = new DynamoDB.DocumentClient()
    private TABLE_NAME = process.env.TABLE_NAME || '';

    async handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        return {
            statusCode: 200,
            body: 'Hello!'
        }
    }
}

export function handler(event: APIGatewayProxyEvent, context: Context) {
   return new Put().handler(event, context);
}