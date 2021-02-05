import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { CfnOutput, Construct } from "@aws-cdk/core";

export class IdentityPoolWrapper {

    private userPoolClient: UserPoolClient;
    private userPool: UserPool;
    private scope: Construct;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    private adminRole: Role;

    private identityPool: CfnIdentityPool;

    constructor(scope: Construct, userPoolClient: UserPoolClient, userPool: UserPool) {
        this.scope = scope;
        this.userPoolClient = userPoolClient;
        this.userPool = userPool;
        this.initialize();
    }

    public getAdminRole(){
        return this.adminRole;
    }

    private initialize() {
        this.createIdentityPool();
        this.initializeGenericRoles();
    }

    private createIdentityPool() {
        this.identityPool = new CfnIdentityPool(this.scope, 'MyUserPoolClient', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName,

            }]
        });
        new CfnOutput(this.scope, 'IDENTITY-POOL-ID',
            { value: this.identityPool.ref })
    }

    private initializeGenericRoles() {
        this.createAuthenticatedRole();
        this.createUnAuthenticatedRole();
        this.attachGenericRoles();
        this.createAdminRole()
    }

    private createAdminRole() {
        this.adminRole = new Role(this.scope, 'AdministratorsRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            }, 'sts:AssumeRoleWithWebIdentity')
        });
        this.adminRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions:[
                's3:ListAllMyBuckets'
            ],
            resources: ['*']
        }));
    }

    private createAuthenticatedRole() {
        this.authenticatedRole = new Role(this.scope, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                },
            }, 'sts:AssumeRoleWithWebIdentity'),
        });
        this.authenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*",
                "cognito-identity:*"
            ],
            resources: ["*"],
        }));
        this.authenticatedRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            resources: ["*"],
        }));
    }

    private createUnAuthenticatedRole() {
        this.unAuthenticatedRole = new Role(this.scope, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                },
            }, 'sts:AssumeRoleWithWebIdentity'),
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
            ,
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        });
    }
}