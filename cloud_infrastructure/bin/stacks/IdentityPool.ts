import { CfnIdentityPool, CfnIdentityPoolRoleAttachment } from "@aws-cdk/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";

export class IdentityPoolWrapper {

    private clientId: string;
    private providerName: string;
    private scope: Construct;

    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;

    constructor(scope: Construct, clientId: string, providerName: string) {
        this.scope = scope;
        this.clientId = clientId,
        this.providerName = providerName;
        this.initialize();
    }

    private initialize(){
        this.createIdentityPool();
        this.createAuthenticatedRole();
        this.createUnAuthenticatedRole();
        this.attachRoles();
    }

    private createIdentityPool() {
        this.identityPool = new CfnIdentityPool(this.scope, 'MyUserPoolClient', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: this.clientId,
                providerName: this.providerName
            }]
        });
    }
    private createAuthenticatedRole(){
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

    private createUnAuthenticatedRole(){
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

    private attachRoles(){
        new CfnIdentityPoolRoleAttachment(this.scope, 'DefaultValid', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'unauthenticated': this.unAuthenticatedRole.roleArn,
                'authenticated': this.authenticatedRole.roleArn
            }
        });
    }

}