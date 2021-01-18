import { Stack, StackProps, Construct } from '@aws-cdk/core';
export declare class CrudStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps);
    private createBucket;
}
