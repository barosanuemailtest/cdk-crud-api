import { CfnIdentityPool, CfnIdentityPoolRoleAttachment } from "@aws-cdk/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { CfnOutput, Construct } from "@aws-cdk/core";

export class IdentityPoolWrapper {

    private clientId: string;
    private providerName: string;
    private scope: Construct;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;

    private identityPool: CfnIdentityPool;

    constructor(scope: Construct, clientId: string, providerName: string) {
        this.scope = scope;
        this.clientId = clientId;
        this.providerName = providerName;
        this.initialize();
    }

    private initialize() {
        this.createIdentityPool();
        this.initializeGenericRoles();
    }

    private createIdentityPool() {
        this.identityPool = new CfnIdentityPool(this.scope, 'MyUserPoolClient', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: this.clientId,
                providerName: this.providerName
            }]
        });
        new CfnOutput(this.scope, 'IDENTITY_POOL_ID',
            { value: this.identityPool.ref })
    }

    private initializeGenericRoles(){
        this.createAuthenticatedRole();
        this.createUnAuthenticatedRole();
        this.attachGenericRoles();
    }

    private createAuthenticatedRole() {
        this.authenticatedRole = new Role(this.scope, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": this.identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        this.authenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*",
                "cognito-identity:*",
                "s3:ListAllMyBuckets"
            ],
            resources: ["*"],
        }));
    }

    private createUnAuthenticatedRole() {
        this.unAuthenticatedRole = new Role(this.scope, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": this.identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        this.authenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*"
            ],
            resources: ["*"],
        }));
    }

    private attachGenericRoles() {
        new CfnIdentityPoolRoleAttachment(this.scope, 'DefaultValid', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'unauthenticated': this.unAuthenticatedRole.roleArn,
                'authenticated': this.authenticatedRole.roleArn
            }
            // ,
            // roleMappings:{
                
            // }
        });
    }

}