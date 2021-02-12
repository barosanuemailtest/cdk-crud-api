import { Bucket, HttpMethods } from '@aws-cdk/aws-s3';
import { Stack, StackProps, Construct, Duration, CfnOutput } from '@aws-cdk/core';
import { LambdaIntegration, AuthorizationType, RestApi } from '@aws-cdk/aws-apigateway';

import { createLambda } from './Lambdas';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Authorizer } from './Authorizer';


export class CrudStack extends Stack {

    private tableName = 'items';
    private tablePrimaryKey = 'itemId';
    private api = new RestApi(this, 'UsersApi');

    private authorizer = new Authorizer(this, this.api);

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.createBucket('profile-pictures-ax9lbm0')
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



        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = this.api.root.addResource('hello');
        new CfnOutput(this, 'HelloInvokeUrl', {
            value: this.api.url + 'hello'
        })


        const items = this.api.root.addResource('items');

        const createOneIntegration = new LambdaIntegration(createOneLambda);
        items.addMethod('POST', createOneIntegration);

        const getOneIntegration = new LambdaIntegration(getOneLambda);
        items.addMethod('GET', getOneIntegration);

        helloLambdaResource.addMethod('GET', helloLambdaIntegration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.getAuthorizer().ref
            }
        });

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
    private createBucket(bucketName: string) {
        const bucket = new Bucket(this, 'someBucketId', {
            lifecycleRules: [{
                expiration: Duration.days(5)
            }],
            bucketName: bucketName,
            cors: [
                {
                    allowedMethods:[
                        HttpMethods.HEAD,
                        HttpMethods.GET,
                        HttpMethods.PUT
                    ],
                    allowedOrigins:[
                        '*'
                    ],
                    allowedHeaders:[
                        '*'
                    ]
                }
            ]
        })
        new CfnOutput(this, 'PROFILE-PICTURES-BUCKET', {
            value: bucket.bucketName
        })
    }
}