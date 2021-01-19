import { Bucket } from '@aws-cdk/aws-s3';
import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { createLambda, getHelloLambda } from './Lambdas';



export class CrudStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.createBucket();


        const helloLambda = createLambda(this, 'HelloLambda');
        const api = new RestApi(this, 'UsersApi');
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);
    }






    private createBucket(){
        new Bucket(this, 'someBucketId', {
            lifecycleRules: [{
                expiration: Duration.days(5)
            }]
        })
    }
}