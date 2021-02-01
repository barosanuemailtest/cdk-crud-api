import { Bucket } from '@aws-cdk/aws-s3';
import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core';
import { LambdaRestApi, CfnAuthorizer, LambdaIntegration, AuthorizationType, RestApi } from '@aws-cdk/aws-apigateway';

import { createLambda } from './Lambdas';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';

import { OAuthScope, UserPool, CfnIdentityPool, CfnIdentityPoolRoleAttachment } from '@aws-cdk/aws-cognito'
import { Effect, FederatedPrincipal, PolicyStatement, Role } from '@aws-cdk/aws-iam';


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


        const items = api.root.addResource('items');

        const createOneIntegration = new LambdaIntegration(createOneLambda);
        items.addMethod('POST', createOneIntegration);

        const getOneIntegration = new LambdaIntegration(getOneLambda);
        items.addMethod('GET', getOneIntegration);

        // Cognito User Pool with Email Sign-in Type.
        const userPool = new UserPool(this, 'userPool', {
            userPoolName: 'CrudStackUserPool',
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });
        const userPoolClient = userPool.addClient('CrudStackUserPool-client', {
            userPoolClientName: 'CrudStackUserPool-client',
            oAuth: {
                scopes: [
                    OAuthScope.PROFILE,
                    OAuthScope.EMAIL,
                    OAuthScope.OPENID
                ]
            },
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            }
        });
        userPool.addDomain("CognitoDomain", {
            cognitoDomain: {
                domainPrefix: 'barosanus-domain'
            }
        });
        const identityPool = new CfnIdentityPool(this, 'MyUserPoolClient', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: userPoolClient.userPoolClientId,
                providerName: userPool.userPoolProviderName
            }]
        });
        const unauthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        unauthenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*"
            ],
            resources: ["*"],
        }));
        const authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        authenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*",
                "cognito-identity:*"
            ],
            resources: ["*"],
        }));
        const defaultPolicy = new CfnIdentityPoolRoleAttachment(this, 'DefaultValid', {
            identityPoolId: identityPool.ref,
            roles: {
                'unauthenticated': unauthenticatedRole.roleArn,
                'authenticated': authenticatedRole.roleArn
            }
        });

        // Authorizer for the Hello World API that uses the
        // Cognito User pool to Authorize users.
        const authorizer = new CfnAuthorizer(this, 'cfnAuth', {
            restApiId: api.restApiId,
            name: 'HelloWorldAPIAuthorizer',
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            providerArns: [userPool.userPoolArn],
        })

        helloLambdaResource.addMethod('GET', helloLambdaIntegration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.ref
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






    private createBucket() {
        new Bucket(this, 'someBucketId', {
            lifecycleRules: [{
                expiration: Duration.days(5)
            }]
        })
    }
}