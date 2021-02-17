import { Bucket, HttpMethods } from '@aws-cdk/aws-s3';
import { Stack, StackProps, Construct, Duration, CfnOutput } from '@aws-cdk/core';
import { LambdaIntegration, AuthorizationType, RestApi } from '@aws-cdk/aws-apigateway';

import { createLambda } from './Lambdas';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Authorizer } from './Authorizer';
import { SpacesTable } from './Tables/SpacesTable';

const spacesTableName = 'SpacesTable';
const reservationsTableName = 'ReservationsTable';


export class CrudStack extends Stack {

    private api = new RestApi(this, 'UsersApi',);

    private authorizer = new Authorizer(this, this.api);
    private spacesTable = new SpacesTable(this);

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const profilePicturesBucket = this.createPhotoBucket('profile-pictures-ax9lbm0z')
        new CfnOutput(this, 'PROFILE-PICTURES-BUCKET', {
            value: profilePicturesBucket.bucketName
        })
        const spacesPhotosBucket = this.createPhotoBucket('spaces-photos-ax9lbm0z')
        new CfnOutput(this, 'SPACES-PHOTOS-BUCKET', {
            value: spacesPhotosBucket.bucketName
        })


        // Hello api integration:
        const helloLambda = createLambda(this, 'HelloLambda');
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.getAuthorizer().ref
            }
        });
        //Spaces api integration:
        const spacesResource = this.api.root.addResource('spaces')
        spacesResource.addMethod('GET', this.spacesTable.readItemLambdaIntegration);
        spacesResource.addMethod('POST', this.spacesTable.createItemLambdaIntegration);
        spacesResource.addMethod('PUT', this.spacesTable.updateItemLambdaIntegration);
        spacesResource.addMethod('DELETE', this.spacesTable.deleteItemLambdaIntegration);

    }

    private createPhotoBucket(bucketName: string): Bucket {
        const bucket = new Bucket(this, bucketName, {
            lifecycleRules: [{
                expiration: Duration.days(5)
            }],
            bucketName: bucketName,
            cors: [
                {
                    allowedMethods: [
                        HttpMethods.HEAD,
                        HttpMethods.GET,
                        HttpMethods.PUT
                    ],
                    allowedOrigins: [
                        '*'
                    ],
                    allowedHeaders: [
                        '*'
                    ]
                }
            ]
        })
        return bucket;
    }
}