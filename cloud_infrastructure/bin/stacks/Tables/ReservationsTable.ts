import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Function as LambdaFunction } from '@aws-cdk/aws-lambda';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Stack } from "@aws-cdk/core";
import { createLambda } from './Utils'



const reservationsTableName = 'ReservationsTable';
const reservationsTablePrimaryKey = 'reservationId';
export class ReservationsTable {

    private stack: Stack
    private reservationsTable: Table;

    private createItemLambda: LambdaFunction;
    private readItemLambda: LambdaFunction;

    public createItemLambdaIntegration: LambdaIntegration;
    public readItemLambdaIntegration: LambdaIntegration;

    constructor(stack: Stack) {
        this.stack = stack;
        this.initializeSpacesTable();
        this.initializeLambdas();
        this.grantTableRights();
        this.initializeLambdaIntegrations();
    }

    private initializeLambdaIntegrations() {
        this.createItemLambdaIntegration = new LambdaIntegration(this.createItemLambda);
        this.readItemLambdaIntegration = new LambdaIntegration(this.readItemLambda);
    }

    private grantTableRights() {
        this.reservationsTable.grantReadData(this.readItemLambda);
        this.reservationsTable.grantReadWriteData(this.createItemLambda);
    }

    private initializeLambdas() {
        this.createItemLambda = createLambda(
            this.stack,
            'createReservationLambda',
            ['..', '..', '..', '..', 'build'],
            {
                TABLE_NAME: this.reservationsTable.tableName,
                PRIMARY_KEY: reservationsTablePrimaryKey
            }
        );
        this.readItemLambda = createLambda(
            this.stack,
            'readReservationLambda',
            ['..', '..', '..', '..', 'build'],
            {
                TABLE_NAME: this.reservationsTable.tableName,
                PRIMARY_KEY: reservationsTablePrimaryKey
            }
        );
    }

    private initializeSpacesTable() {
        this.reservationsTable = new Table(this.stack, reservationsTableName, {
            partitionKey: {
                name: reservationsTablePrimaryKey,
                type: AttributeType.STRING
            },
            tableName: reservationsTableName
        })
    }
}