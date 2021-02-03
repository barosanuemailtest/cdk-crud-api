import { CfnAuthorizer, RestApi } from "@aws-cdk/aws-apigateway";
import { OAuthScope, UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { Construct } from "@aws-cdk/core";
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

}