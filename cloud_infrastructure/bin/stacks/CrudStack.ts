import { Bucket } from '@aws-cdk/aws-s3';
import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { createLambda } from './Lambdas';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';



export class CrudStack extends Stack {

    private tableName = 'items';
    private tablePrimaryKey = 'itemId';



    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const tableItems = this.createTable();

        const lambdaEnv = {
            TABLE_NAME: this.tableName,
            PRIMARY_KEY: this.tablePrimaryKey
        };

        const helloLambda = createLambda(this, 'HelloLambda');
        const getOneLambda = createLambda(this, 'GetOneLambda', lambdaEnv);
        //    const getAllLambda = createLambda(this, 'GetAllLambda', lambdaEnv);
        const createOneLambda = createLambda(this, 'CreateOneLambda', lambdaEnv);
        //    const deleteOneLambda = createLambda(this, 'DeleteOneLambda', lambdaEnv);

        tableItems.grantReadWriteData(getOneLambda);
        tableItems.grantReadWriteData(createOneLambda);


        
        const api = new RestApi(this, 'UsersApi');
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);
    }

    private createTable() {
        return new Table(this, this.tableName, {
            partitionKey: {
                name: this.tablePrimaryKey,
                type: AttributeType.STRING
            },
            tableName: this.tableName
        })
    }






    private createBucket() {
        new Bucket(this, 'someBucketId', {
            lifecycleRules: [{
                expiration: Duration.days(5)
            }]
        })
    }
}