import { Code, Function as LambdaFunction, Runtime} from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';



export function getHelloLambda(scope: Construct):LambdaFunction{
return new LambdaFunction(scope, 'HelloHandler', {
    functionName: 'HelloHandler',
    code: Code.fromInline(`console.log('Hello from lambda!')`),
    handler: 'zzz',
    runtime: Runtime.NODEJS_12_X
})

}