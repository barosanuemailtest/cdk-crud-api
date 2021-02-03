import { CfnIdentityPool, CfnIdentityPoolRoleAttachment } from "@aws-cdk/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "@aws-cdk/aws-iam";
import { CfnOutput, Construct } from "@aws-cdk/core";
import { Roles } from "./Roles";

export class IdentityPoolWrapper {

    private clientId: string;
    private providerName: string;
    private scope: Construct;

    private identityPool: CfnIdentityPool;
    private roles: Roles;

    constructor(scope: Construct, clientId: string, providerName: string) {
        this.scope = scope;
        this.clientId = clientId;
        this.providerName = providerName;
        this.initialize();
    }

    private initialize() {
        this.createIdentityPool();
        this.roles = new Roles(this.scope, this.identityPool);
        this.roles.createGenericRoles();
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

}