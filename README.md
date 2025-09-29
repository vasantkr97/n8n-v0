# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
{
    "title": "My workflow example",
    "isActive": false,
    "triggerType": "MANUAL",
    "nodes": [
        {
            "parameters": {
                "options": {}
            },
            "type": "Trigger",
            "position": [-224, 32],
            "name": "When user triggers workflow"
        }, 
        {
            "parameters": {
                "chatId": "1349567450",
                "message": "Hello, workflow trigger successfully"
            },
            "type": "telegram",
            "position": [-16, 32],
            "name": "Send a text message",
            "credentials": {
                "id": "cmg4pu9en00093xzfescq5hk3"
            }
        }, 
        {
            "parameters": {
                "prompt": "Generate a few lines about virat greatness",
                "model": "gemini-pro",
                "temperature": 0.7
            },
            "type": "gemini",
            "position": [192, 32],
            "name": "Generate AI content",
            "credentials": {
                "id": "cmg4prbot00073xzf1fgjcenh"
            }
        },
        {
            "parameters": {
                "from": "npreply@yourdomain.com",
                "to": "vasanth24ias@gmail.com",
                "subject": "workflow executions complete",
                "text": "Workflow Results\n\nYour workflow has completed successfully!\n\nAI Generated Content about Virat:\n{{$node[\"Generate AI content\"].data.text}}\n\nTelegram notification was sent to chat ID: 1349567450\n\nBest regards,\nYour Workflow System",
                "html": "<h2>Workflow Results</h2><p>Your workflow has completed successfully!</p><p><strong>AI Generated Content about Virat:</strong></p><div style='background:#f5f5f5;padding:15px;border-radius:5px;margin:10px 0;'>{{$node[\"Generate AI content\"].data.text}}</div><p>Telegram notification was sent to chat ID: 1349567450</p><p>Best regards,<br>Your Workflow System</p>"
            },
            "type": "email",
            "position": [400, 32],
            "name": "Send email notification",
            "credentials": {
                "id": "cmg4pkxmh00033xzfh8n0o55o"
            }
        }
    ],
    "connections": {
        "When user triggers workflow": {
            "main": [
                [
                    {
                        "node": "Send a text message",
                        "type": "main"
                    }
                ]
            ]
        },
        "Send a text message": {
            "main": [
                [
                    {
                        "node": "Generate AI content",
                        "type": "main"
                    }
                ]
            ]
        },
        "Generate AI content": {
            "main": [
                [
                    {
                        "node": "Send email notification",
                        "type": "main"
                    }
                ]
            ]
        }
    }
};


{
    "title": "My Email Credentials",
    "platform": "ResendEmail",
    "data": {
        "apiKey": "re_WTxtVBta_BkJoKzPcqjhZTVmQJ936KKsW"
    }
};



{
    "title": "My Telegram Credentials",
    "platform": "Telegram",
    "data": {
        "botToken": "8078683203:AAEmnooeM88UWQ0lRctiA68Pla53TS878_4"
    }
};

{
    "title": "My Gemini Credentials",
    "platform": "Gemini",
    "data": {
        "apiKey": "AIzaSyDpDGmsFvXz0e44HPUk16PvPnCsZCaq-2s"
    }
};