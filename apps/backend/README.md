# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


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
        "id": "cmg68gjne0001upqour5aju4p"
      }
    },
    {
      "parameters": {
        "prompt": "Generate a few lines about virat greatness",
        "model": "gemini-1.5-flash",
        "temperature": 0.7
      },
      "type": "gemini",
      "position": [192, 32],
      "name": "Generate AI content",
      "credentials": {
        "id": "cmg68gout0003upqoyjajdmfb"
      }
    },
    {
      "parameters": {
        "from": "onboarding@resend.dev",
        "to": "vasantkr97@gmail.com",
        "subject": "workflow executions complete",
        "text": "Workflow Results\n\nYour workflow has completed successfully!\n\nAI Generated Content about Virat:\n{{$node[\"Generate AI content\"].data.text}}\n\nTelegram notification was sent to chat ID: 1349567450\n\nBest regards,\nYour Workflow System",
        "html": "<h2>Workflow Results</h2><p>Your workflow has completed successfully!</p><p><strong>AI Generated Content about Virat:</strong></p><div style='background:#f5f5f5;padding:15px;border-radius:5px;margin:10px 0;'>{{$node[\"Generate AI content\"].data.text}}</div><p>Telegram notification was sent to chat ID: 1349567450</p><p>Best regards,<br>Your Workflow System</p>"
      },
      "type": "email",
      "position": [400, 32],
      "name": "Send email notification",
      "credentials": {
        "id": "cmg68hs950007upqotvssa7xc"
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
}
