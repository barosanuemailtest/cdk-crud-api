#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';

import { CrudStack } from './stacks/CrudStack';

const app = new App();
new CrudStack(app, 'CrudStack', {
    stackName: 'CrudStack'
})

