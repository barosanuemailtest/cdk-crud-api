import { Bucket } from '@aws-cdk/aws-s3';
import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core';




export class CrudStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.createBucket();
    }


    private createBucket(){
        new Bucket(this, 'someBucketId', {
            bucketName: 'someBucket',
            lifecycleRules: [{
                expiration: Duration.days(5)
            }]
        })
    }
}