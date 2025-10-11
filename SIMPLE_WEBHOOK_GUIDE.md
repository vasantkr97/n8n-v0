# 🚀 Simple Webhook Guide - For End Users

## ⚡ **Quick Start (3 Steps)**

### **1️⃣ Create a Workflow**
1. Go to Dashboard
2. Click "New Workflow"
3. Add a **Webhook** node (from Triggers category)
4. Add action nodes (Telegram, Email, Gemini)
5. Click **Save**
6. Toggle **Active** (very important!)

---

### **2️⃣ Get Your Webhook URL**

Look at your webhook node:
- You'll see a **🔗 URL** button at the top of the node
- **Hover** over it → See full URL
- **Click** it → URL copied! ✅

![Webhook Node](https://i.imgur.com/example.png)

---

### **3️⃣ Trigger Your Workflow**

**That's it!** Now anyone (or any service) can trigger your workflow by sending a POST request:

```bash
curl -X POST http://localhost:4000/api/executions/webhook/YOUR-WORKFLOW-ID
```

**No authentication. No complexity. Just works!** 🎉

---

## 📱 **Real-World Example**

Let's create a workflow that sends you a Telegram notification:

### **Step 1: Build the Workflow**
```
[Webhook] → [Telegram]
   🔗          💬
```

1. Add **Webhook** node
2. Add **Telegram** node
3. Connect them
4. Configure Telegram:
   - Add credentials (bot token)
   - Set chat ID
   - Set message: "Webhook triggered!"
5. **Save** and toggle **Active**

### **Step 2: Get URL**
- Hover over webhook node
- Click **🔗 URL**
- You get: `http://localhost:4000/api/executions/webhook/cm3x5y2z1abc`

### **Step 3: Test It**
```bash
curl -X POST http://localhost:4000/api/executions/webhook/cm3x5y2z1abc
```

**Boom!** 💥 You get a Telegram message!

---

## 🌐 **Use Cases**

### **1. Form Submissions**
When someone submits a form on your website, trigger a workflow:
```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch('http://localhost:4000/api/executions/webhook/YOUR-ID', {
    method: 'POST'
  });
  alert('Thank you! We will contact you soon.');
});
```

### **2. Zapier Integration**
1. Create a Zap
2. Add "Webhooks by Zapier" action
3. Choose "POST"
4. Paste your webhook URL
5. Done!

### **3. IFTTT Applet**
1. Create applet
2. Add "Webhooks" service
3. Paste your URL
4. Trigger on any event (Gmail, Twitter, etc.)

### **4. Scheduled Jobs (from another service)**
```bash
# Run this as a cron job
0 9 * * * curl -X POST http://localhost:4000/api/executions/webhook/YOUR-ID
```

### **5. IoT Devices**
ESP32, Arduino, Raspberry Pi → Send HTTP POST → Trigger workflow!

---

## 🔒 **Security**

**Q: Isn't this insecure without authentication?**

**A:** It's secure because:
1. ✅ Workflow ID is unique and hard to guess (like `cm3x5y2z1abc`)
2. ✅ Workflow must be **Active** - you control when it works
3. ✅ You can toggle it off anytime
4. ✅ Monitor all executions in the Executions page

**Best Practices:**
- Don't share your webhook URL publicly
- Toggle "Active" off when not in use
- Use HTTPS in production (not http)
- Monitor the Executions page for suspicious activity

---

## ❓ **FAQ**

### **Q: What if my workflow is not Active?**
**A:** Webhook returns error:
```json
{
  "success": false,
  "error": "Workflow not found or inactive"
}
```
👉 Solution: Toggle the workflow to **Active** in the toolbar!

### **Q: Can I pass data to the webhook?**
**A:** Currently, webhooks trigger with no input data. The workflow executes with its pre-configured parameters. (Feature coming soon!)

### **Q: How do I know if the webhook executed successfully?**
**A:** The response tells you:
```json
{
  "success": true,
  "data": {
    "executionId": "exec-abc123",
    "message": "Webhook executed successfully"
  }
}
```
Then check the **Executions** page for detailed results!

### **Q: Can I have multiple webhooks in one workflow?**
**A:** Each workflow should have ONE trigger node (webhook or manual). After the trigger, you can have multiple action nodes.

### **Q: What happens if an action fails?**
**A:** The execution status will be "FAILED". Check the Executions page for error details.

---

## 🎯 **Pro Tips**

### **Tip 1: Testing**
Use Postman or curl for quick testing:
```bash
curl -X POST http://localhost:4000/api/executions/webhook/YOUR-ID
```

### **Tip 2: Multiple Environments**
- Development: `http://localhost:4000/api/executions/webhook/...`
- Production: `https://yourdomain.com/api/executions/webhook/...`

### **Tip 3: Error Handling**
Always check the response:
```javascript
const response = await fetch(webhookUrl, { method: 'POST' });
const data = await response.json();

if (data.success) {
  console.log('✅ Success!', data.data.executionId);
} else {
  console.error('❌ Failed:', data.error);
}
```

### **Tip 4: Monitoring**
Check the **Executions** page regularly:
- See all webhook triggers
- View execution status
- Debug failed executions
- Monitor workflow performance

---

## 🎨 **Visual Guide**

### **What the Webhook Node Looks Like:**

```
     🔗 URL  ← Click to copy!
   ┌─────────┐
  (|    🔗   |)  ← Half-round shape (trigger)
   └─────────┘
    Webhook
```

When you hover:
```
┌────────────────────────────────────┐
│ 📡 Public Webhook URL              │
│                                    │
│ http://localhost:4000/api/...     │
│                                    │
│ ✨ Click button to copy            │
│ 🔓 No authentication needed        │
│ 🔒 Workflow must be Active         │
│                                    │
│ Example:                           │
│ curl -X POST http://...            │
└────────────────────────────────────┘
```

---

## 🎉 **That's All!**

You now know everything to use webhooks in your n8n-v0 automation platform!

**Remember:**
1. ✅ Add webhook node
2. ✅ Get URL (hover + click 🔗 URL button)
3. ✅ Make workflow Active
4. ✅ Send POST request
5. ✅ Done!

**Happy automating!** 🚀

---

## 📚 **Next Steps**

- Check out other nodes: Email, Gemini AI, Telegram
- Learn about Manual triggers
- Explore the Executions page
- Build more complex workflows

Need help? Check the main WEBHOOK_GUIDE.md for advanced topics!

