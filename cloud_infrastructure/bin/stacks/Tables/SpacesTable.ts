import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Function as LambdaFunction } from '@aws-cdk/aws-lambda';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Stack } from "@aws-cdk/core";
import { createLambda } from './Utils'



const spacesTableName = 'SpacesTable';
const spacesTablePrimaryKey = 'spaceId';
export class SpacesTable {

    private stack: Stack
    private spacesTable: Table;

    private createItemLambda: LambdaFunction;
    private readItemLambda: LambdaFunction;
    private updateItemLambda: LambdaFunction;
    private deleteItemLambda: LambdaFunction;

    public createItemLambdaIntegration: LambdaIntegration;
    public readItemLambdaIntegration: LambdaIntegration;
    public updateItemLambdaIntegration: LambdaIntegration;
    public deleteItemLambdaIntegration: LambdaIntegration;

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
        this.updateItemLambdaIntegration = new LambdaIntegration(this.updateItemLambda);
        this.deleteItemLambdaIntegration = new LambdaIntegration(this.deleteItemLambda);
    }

    private grantTableRights() {
        this.spacesTable.grantReadData(this.readItemLambda);
        this.spacesTable.grantReadWriteData(this.createItemLambda);
        this.spacesTable.grantReadWriteData(this.updateItemLambda);
        this.spacesTable.grantReadWriteData(this.deleteItemLambda);
    }

    private initializeLambdas() {
        this.createItemLambda = createLambda(
            this.stack,
            'createSpaceItemLambda',
            ['..', '..', '..', '..', 'build'],
            {
                TABLE_NAME: this.spacesTable.tableName
            }
        );
        this.readItemLambda = createLambda(
            this.stack,
            'readSpaceItemLambda',
            ['..', '..', '..', '..', 'build'],
            {
                TABLE_NAME: this.spacesTable.tableName
            }
        );
        this.updateItemLambda = createLambda(
            this.stack,
            'updateSpaceItemLambda',
            ['..', '..', '..', '..', 'build'],
            {
                TABLE_NAME: this.spacesTable.tableName
            }
        );
        this.deleteItemLambda = createLambda(
            this.stack,
            'deleteSpaceItemLambda',
            ['..', '..', '..', '..', 'build'],
            {
                TABLE_NAME: this.spacesTable.tableName
            }
        );

    }

    private initializeSpacesTable() {
        this.spacesTable = new Table(this.stack, spacesTableName, {
            partitionKey: {
                name: spacesTablePrimaryKey,
                type: AttributeType.STRING
            },
            tableName: spacesTableName
        })
    }
}