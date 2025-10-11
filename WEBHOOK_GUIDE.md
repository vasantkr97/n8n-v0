# 🔗 Webhook Execution Guide

## ✅ How to Execute Workflows via Webhook

Your n8n-v0 application now supports **public webhooks** - simple, no authentication required! 🎉

---

## 🎯 **What is a Webhook?**

A **webhook** is a way to trigger your workflow from external services or applications by sending a simple HTTP request to a URL.

**Use Cases:**
- Trigger workflow when someone fills a form
- Execute workflow when you receive an email
- Start automation from another app (Zapier, IFTTT, etc.)
- Create API endpoints for your services
- Integrate with any external service that can send HTTP requests

---

## 📝 **How to Set Up Webhook Execution:**

### **Step 1: Create a Workflow with Webhook Trigger**

1. **Go to Dashboard** (`/dashboard`)
2. **Click "New Workflow"** button
3. **Add a Webhook Node:**
   - Click the blue **"+"** button (or click canvas)
   - Select **"Webhook"** from Triggers category
   - Webhook node appears with **half-round, half-square shape** (n8n style!)

### **Step 2: Get Your Webhook URL** ⭐ **Super Easy!**

The webhook node displays a **🔗 URL** button at the top. 

**To get the webhook URL:**
1. **Hover over the 🔗 URL button** on the webhook node
2. A beautiful tooltip appears showing:
   - ✅ Full webhook URL
   - ✅ Example curl command
   - ✅ Clear instructions
3. **Click the 🔗 URL button** to copy URL to clipboard
4. You'll see a success message with instructions!

**Public Webhook URL Format:**
```
http://localhost:4000/api/executions/webhook/{workflowId}
```

**🔓 No Authentication Required!** Just send a POST request and your workflow executes!

### **Step 3: Add Action Nodes**

After the webhook trigger, add action nodes:
- **Telegram** - Send notification
- **Email** - Send email
- **Gemini AI** - Generate content

Connect them by dragging from one node to another.

### **Step 4: Configure Nodes**

Click each node to configure:
- Set up credentials (API keys)
- Define parameters (messages, prompts, etc.)
- Test configuration

### **Step 5: Save & Activate**

1. **Click "Save"** button in toolbar
2. **Toggle "Active"** to enable the workflow
3. Your webhook is now ready to receive requests!

---

## 🚀 **How to Trigger the Webhook:**

### **Method 1: Using Curl (Command Line)** ⭐ **Simplest Way!**

```bash
curl -X POST http://localhost:4000/api/executions/webhook/{workflowId}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/executions/webhook/cm12abc3de0001
```

**That's it! No headers, no authentication, no complexity!** 🎉

### **Method 2: Using Postman**

1. Open Postman
2. Create new POST request
3. Paste webhook URL
4. Click "Send"
5. Check response for execution ID

### **Method 3: From JavaScript/Frontend**

```javascript
fetch('http://localhost:4000/api/executions/webhook/{workflowId}', {
  method: 'POST',
  // No credentials needed!
  // No headers required!
})
.then(res => res.json())
.then(data => {
  console.log('✅ Workflow triggered!', data);
  console.log('Execution ID:', data.data.executionId);
})
.catch(error => console.error('❌ Error:', error));
```

**Even simpler!** No authentication, no cookies, no complexity!

### **Method 4: From External Services**

**Zapier:**
1. Create a Zap
2. Add "Webhooks by Zapier" action
3. Choose "POST"
4. Paste your webhook URL
5. Test & enable

**IFTTT:**
1. Create an applet
2. Add "Webhooks" service
3. Use "Make a web request" action
4. Set Method: POST
5. Paste your webhook URL

**Make.com / Integromat:**
1. Add HTTP module
2. Choose "Make a request"
3. Method: POST
4. Paste webhook URL
5. Run scenario

---

## 📊 **Webhook Response:**

When you trigger the webhook, you'll receive:

```json
{
  "success": true,
  "data": {
    "executionId": "exec-abc123def456",
    "message": "webhook workflow triggered successfully"
  }
}
```

---

## 🎨 **Visual Differences:**

### **Trigger Nodes (Webhook, Manual):**
- ✅ **Half-round on left, square on right** (n8n style!)
- ✅ No input handle (can't receive connections)
- ✅ Output handle on right (connects to next node)
- ✅ Special styling to indicate it's a trigger

### **Action Nodes (Telegram, Email, Gemini):**
- ✅ **Fully square/rounded** shape
- ✅ Input handle on left
- ✅ Output handle on right
- ✅ Can be chained together

---

## 🔐 **Authentication:**

**Great News:** Public webhooks require **NO AUTHENTICATION!** 🎉

Your webhook URL is secure because:
- ✅ **WorkflowId acts as a secret token** - hard to guess
- ✅ **Workflow must be Active** - you control when it's enabled
- ✅ **Only active workflows execute** - automatic security
- ✅ **No complex authentication** - just works!

**Security Best Practices:**
1. ✅ Keep your workflow ID private (don't share publicly)
2. ✅ Toggle workflow to "Inactive" when not in use
3. ✅ Monitor executions page for unexpected triggers
4. ✅ Use HTTPS in production (not http)

---

## 📍 **Finding Your Webhook URL:**

### **Option 1: From Webhook Node**
- Hover over the **🔗 URL** button on webhook node
- Tooltip shows full URL
- Click button to copy

### **Option 2: Manual Construction**
```
http://localhost:4000/api/executions/webhookExecute/{YOUR_WORKFLOW_ID}
```

Get your workflow ID from:
- URL bar when editing workflow: `/workflow/{id}`
- Projects page: Listed with each workflow
- After saving: Check console logs

---

## 🎯 **Complete Webhook Workflow Example:**

### **1. Create Workflow:**
```
[Webhook] → [Gemini AI] → [Telegram]
   🔗          ✨            💬
```

### **2. Configure Nodes:**

**Webhook:**
- No configuration needed
- Get URL from node

**Gemini AI:**
- Add Gemini credentials
- Set prompt: "Generate a motivational quote"

**Telegram:**
- Add Telegram credentials
- Set chat ID
- Set message: Use Gemini output

### **3. Save & Activate:**
- Click "Save"
- Toggle "Active"

### **4. Get Webhook URL:**
- Hover over the **🔗 URL** button on webhook node
- Beautiful tooltip appears with full URL and example!
- Click **🔗 URL** button
- ✅ URL copied to clipboard!

### **5. Trigger from Anywhere:**
```bash
curl -X POST http://localhost:4000/api/executions/webhook/your-workflow-id
```

**No authentication needed! Just copy and use!** 🚀

### **6. Check Executions:**
- Go to `/executions` page
- See your workflow execution
- Check status: SUCCESS/FAILED
- View execution details

---

## 💡 **Tips & Best Practices:**

### **Testing:**
1. Use Postman for initial testing
2. Check browser console for errors
3. View `/executions` page for results
4. Monitor backend logs

### **Production:**
1. Replace `localhost:4000` with your domain
2. Use HTTPS in production
3. Implement rate limiting
4. Add webhook authentication tokens
5. Log all webhook requests

### **Debugging:**
- Check if workflow is **Active**
- Verify **workflow ID** in URL
- Ensure you're **authenticated**
- Check **backend console** for errors
- View **execution history** for details

---

## 🔄 **Webhook vs Manual Execution:**

| Feature | Webhook | Manual |
|---------|---------|--------|
| **Trigger** | External HTTP request | "Execute" button click |
| **URL Needed** | ✅ Yes | ❌ No |
| **Authentication** | ✅ Required (JWT) | ✅ Required (logged in) |
| **Use Case** | Automation, integrations | Testing, one-time runs |
| **Visibility** | Background | Immediate feedback |

---

## 📦 **Backend Endpoints:**

### **Public Webhook Execution:** ⭐ **Use This!**
```
POST /api/executions/webhook/:workflowId
```

**Headers:**
```
None required! 🎉
```

**Requirements:**
- ✅ Workflow must exist
- ✅ Workflow must be Active

**Response:**
```json
{
  "success": true,
  "data": {
    "executionId": "exec-123",
    "message": "Webhook executed successfully",
    "workflowId": "cm12abc..."
  }
}
```

**Error Response (if workflow inactive):**
```json
{
  "success": false,
  "error": "Workflow not found or inactive. Please ensure the workflow exists and is activated."
}
```

### **Manual Execution (from UI):**
```
POST /api/executions/workflow/:workflowId/execute
```

This requires authentication (used by the Execute button in UI).

---

## 🎉 **You're All Set!**

Now you can:
- ✅ Create workflows with webhook triggers
- ✅ Get webhook URLs from nodes
- ✅ Trigger workflows from external services
- ✅ Monitor execution in real-time
- ✅ Build powerful automations

**Happy automating! 🚀**


