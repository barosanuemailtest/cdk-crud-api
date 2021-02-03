import { CfnIdentityPool, CfnIdentityPoolRoleAttachment } from "@aws-cdk/aws-cognito";
import { Role, FederatedPrincipal, PolicyStatement, Effect } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";



export class Roles {

    private scope: Construct;

    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;

    constructor(scope: Construct, identityPool: CfnIdentityPool) {
        this.scope = scope;
        this.identityPool = identityPool;
    }

    public createGenericRoles(){
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
        });
    }

}