# Learn AWS Serverless

A fresh TypeScript workspace for learning AWS Lambda, API Gateway, DynamoDB,
EventBridge, SQS, and AWS CDK. The original application has been removed so you can
implement each service yourself.

## Setup

Use Node.js 24 LTS (`nvm install && nvm use`) and pnpm 11.9.0. The exact pnpm version
is recorded in `package.json`; with Corepack installed, run `corepack enable`.
See the [pnpm installation guide](https://pnpm.io/installation) for other options.

```sh
pnpm install
pnpm check
pnpm build
```

Local checks and synthesis need no AWS credentials or Docker. For reproducible
installs after cloning, use `pnpm install --frozen-lockfile`.

## Workspaces

```text
infra/               @serverless/infra   — CDK application and infrastructure tests
services/catalog/    @serverless/catalog — product catalog (previously product)
services/cart/       @serverless/cart    — shopping cart (previously basket)
services/orders/     @serverless/orders  — order processing (previously ordering)
```

Each workspace owns its `package.json` and TypeScript configuration. Shared
development tools live at the root. Repeated AWS SDK and Lambda type versions are
managed in the `pnpm-workspace.yaml` catalog; SDK dependencies belong to the services
that will use them.

Turborepo runs workspace builds, typechecks, and tests in parallel and caches their
results locally in `.turbo/`. Service build outputs in `dist/` are restored on cache
hits. Changes to the shared TypeScript configuration, Vitest configuration, or Node
version file invalidate workspace caches. CDK synthesis always runs uncached and
receives `AWS_*` and `CDK_*` environment variables. Formatting and linting run once
from the root; watch mode and combined coverage use Vitest directly.

The service `index.ts` files are empty modules, with no Lambda handlers yet.
`infra/app.ts` contains a single empty `ServerlessLearning` stack. Its test checks
that it starts without application resources; replace that assertion with resource
assertions as you build your infrastructure. The CDK CLI adds its standard metadata
resource so the starter template satisfies CloudFormation's non-empty resource requirement.

## Commands

| Command                                               | Purpose                                                |
| ----------------------------------------------------- | ------------------------------------------------------ |
| `pnpm check`                                          | Check formatting, lint, types, and run all tests       |
| `pnpm format`                                         | Format with Oxfmt                                      |
| `pnpm lint:fix`                                       | Apply Oxlint fixes                                     |
| `pnpm typecheck`                                      | Check root tooling and every workspace with TypeScript |
| `pnpm test`                                           | Run workspace Vitest tests through Turborepo           |
| `pnpm test:watch`                                     | Watch tests while learning                             |
| `pnpm test:coverage`                                  | Produce terminal, HTML, and LCOV coverage reports      |
| `pnpm build`                                          | Bundle services and synthesize infrastructure          |
| `pnpm synth`                                          | Synthesize the empty stack into `infra/cdk.out/`       |
| `pnpm cdk list`                                       | List stacks using the workspace's CDK CLI              |
| `pnpm --filter @serverless/catalog test`              | Run only catalog tests                                 |
| `pnpm --filter @serverless/cart build`                | Build only the cart service                            |
| `pnpm exec turbo run build --filter=@serverless/cart` | Build the cart service with caching                    |
| `pnpm exec turbo run test --force`                    | Rerun workspace tests without reading cached results   |

Add tests beside your code as `*.test.ts`, importing `test` and `expect` from
`vitest`. Empty services deliberately allow zero tests; the infrastructure workspace
requires at least one test. Vitest handles TypeScript directly, so Jest, ts-jest,
and separate Jest types are unnecessary. Vite is Vitest's required peer.

## Start learning

1. Implement a typed Lambda handler in `services/catalog/index.ts` and test it.
2. Add its Lambda function and API in `infra/app.ts`, then add CDK assertions.
3. Add DynamoDB persistence using AWS SDK v3's `DynamoDBDocumentClient`.
4. Implement cart and orders, then connect them with EventBridge and SQS.

TypeScript source uses ESM and strict checking. Use explicit `.ts` extensions for
relative imports and `import type` for types. Node.js 24 runs the CDK app directly;
`erasableSyntaxOnly` keeps its syntax compatible with Node's type stripping.
Services additionally enable `exactOptionalPropertyTypes`; CDK's published
declarations currently require standard strict optional-property semantics.
Service builds use esbuild to bundle each entry point and its SDK dependencies into
`dist/index.cjs`, targeting Node.js 24. These empty bundles are not deployable
handlers yet. For a handler export named `handler`, the built Lambda entry point
will be `index.handler`.

When adding Lambda resources, use the supported
[`nodejs24.x` runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).
If you use CDK's `NodejsFunction` to bundle source directly, point it at the root
`pnpm-lock.yaml` and bundle the service's SDK dependencies (`bundling.bundleAwsSDK: true`).
Install runtime packages with `pnpm --filter @serverless/<service> add <package>`.

When you have resources to deploy, configure your AWS profile, bootstrap the target
account and region, inspect `pnpm cdk diff --profile <profile>`, and deploy explicitly.
Bootstrapping and deployment create AWS resources and may incur costs. This reset
does not update or delete previously deployed stacks; the new stack has a different
name. Manage old deployments separately.

## Maintenance

The lockfile records exact installed versions. TypeScript and development tools
are pinned; CDK and SDK libraries accept compatible updates. Review updates with
`pnpm outdated -r`, then rerun checks, coverage, and synthesis before accepting them.
The CDK CLI and library use independent version numbers.

The original repository was authored by Mehmet Ozkaya / awsrun. Its MIT license
and copyright notice are retained in [LICENSE](LICENSE).
