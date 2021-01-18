import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import { join } from 'path';



export function getHelloLambda(scope: Construct): LambdaFunction {

    const functionCode = Code.fromAsset(join(__dirname, '..', '..', '..','build'));

    const someLambda = new LambdaFunction(scope, 'HelloHandler', {
        functionName: 'HelloHandler',
        code: functionCode,
        handler: 'handler',
        runtime: Runtime.NODEJS_12_X
    });
    return someLambda
}