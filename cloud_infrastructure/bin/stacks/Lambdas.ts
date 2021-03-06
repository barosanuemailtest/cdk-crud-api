import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import { join } from 'path';

type lamdaEnv = {
    [key: string]: string
}

export function createLambda(scope: Construct, lambdaId: string, environment?: lamdaEnv): LambdaFunction {
    return new LambdaFunction(scope, lambdaId, {
        functionName: lambdaId,
        code: Code.fromAsset(join(__dirname, '..', '..', '..', 'build', lambdaId)),
        handler: `${lambdaId}.handler`,
        runtime: Runtime.NODEJS_12_X,
        environment: environment
    });

}


