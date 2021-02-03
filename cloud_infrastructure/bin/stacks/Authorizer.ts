import { CfnAuthorizer, RestApi } from "@aws-cdk/aws-apigateway";
import { CfnUserPoolGroup, OAuthScope, UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { CfnOutput, Construct } from "@aws-cdk/core";
import { IdentityPoolWrapper } from './IdentityPool';

export class Authorizer {

    private scope: Construct;
    private api: RestApi;

    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private authorizer: CfnAuthorizer;
    private identityPoolWrapper: IdentityPoolWrapper;

    constructor(scope: Construct, api: RestApi) {
        this.scope = scope;
        this.api = api;
        this.initialize();
        this.identityPoolWrapper = new IdentityPoolWrapper(
            this.scope,
            this.userPoolClient.userPoolClientId,
            this.userPool.userPoolProviderName
        )
    }

    public getAuthorizer(){
        return this.authorizer;
    }

    private initialize(){
        this.createUserPool();
        this.addUserPoolClient();
        this.addUserPoolDomain();
        this.createAuthorizer();
        this.initializeGroups();
    }

    private createUserPool() {
        this.userPool = new UserPool(this.scope, 'userPool', {
            userPoolName: 'CrudStackUserPool',
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });
        new CfnOutput(this.scope, 'USER_POOL_ID', {
            value: this.userPool.userPoolId
        });
    }
    private addUserPoolClient() {
        this.userPoolClient = this.userPool.addClient('CrudStackUserPool-client', {
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
        new CfnOutput(this.scope, 'APP_CLIENT_ID', {
            value: this.userPoolClient.userPoolClientId
        });
    }

    private addUserPoolDomain(){
        this.userPool.addDomain("CognitoDomain", {
            cognitoDomain: {
                domainPrefix: 'barosanus-domain'
            }
        });
    }

    private createAuthorizer(){
        this.authorizer = new CfnAuthorizer(this.scope, 'cfnAuth', {
            restApiId: this.api.restApiId,
            name: 'HelloWorldAPIAuthorizer',
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            providerArns: [this.userPool.userPoolArn],
        })
    }

    private initializeGroups(){
        new CfnUserPoolGroup(this.scope, 'Barosani', {
            groupName: 'Barosani',
            userPoolId: this.userPool.userPoolId
        });
        new CfnUserPoolGroup(this.scope, 'Sefi', {
            groupName: 'Sefi',
            userPoolId: this.userPool.userPoolId
        });
        new CfnUserPoolGroup(this.scope, 'Sefuti', {
            groupName: 'Sefuti',
            userPoolId: this.userPool.userPoolId
        });
    }

}