import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import { join } from 'path';


type lambdaEnv = {
    [key: string]: string
}

export function createLambda(scope: Construct, lambdaId: string, path: string[], environment?: lambdaEnv): LambdaFunction {
    return new LambdaFunction(scope, lambdaId, {
        functionName: lambdaId,
        code: Code.fromAsset(join(__dirname, ...path, lambdaId)),
        handler: `${lambdaId}.handler`,
        runtime: Runtime.NODEJS_12_X,
        environment: environment
    });
}