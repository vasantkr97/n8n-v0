# 🔐 Webhook Token Authentication Setup

## ✅ What Was Implemented

I've implemented **secure webhook token authentication** to answer your question:

> "if no auth how will you verify the authorized user only hitting the endpoint?"

---

## 🔒 **How It Works Now**

### **Before (Insecure):**
- Anyone with the workflowId could trigger the webhook ❌
- No real authentication, just URL obscurity

### **After (Secure):**
- Each webhook workflow gets a **unique 64-character token** ✅
- Token is required for ALL webhook requests ✅
- Invalid token = 403 Forbidden ✅
- Token is kept secret and only shown to workflow owner ✅

---

## 🛠️ **Changes Made**

### **1. Database Schema**
Added `webhookToken` field to Workflow table:
```prisma
model Workflow {
  id                   String         @id @default(uuid())
  title                String         
  isActive             Boolean        @default(false)
  webhookToken         String?        @unique  // NEW: Unique token for webhook authentication
  // ... other fields
}
```

### **2. Backend - Token Generation**
`workflow.controller.ts`:
- Automatically generates secure token when creating webhook workflows
- Uses `crypto.randomBytes(32).toString('hex')` = 64-character hex string
- Tokens are cryptographically secure and unique

### **3. Backend - Token Verification**
`execution.controller.ts`:
- Webhook endpoint now requires token
- Token can be passed 2 ways:
  - Query parameter: `?token=xxx`
  - Header: `X-Webhook-Token: xxx`
- Verifies token matches before execution

### **4. Frontend - Token Display**
`N8nNode.tsx`:
- Webhook nodes show URL with token included
- Tooltip displays both query param and header examples
- Copy button includes full URL with token
- Warning about keeping URL private

---

## 🚀 **Setup Instructions**

### **Step 1: Stop All Servers**

**Stop these if running:**
- Frontend dev server (Ctrl+C)
- Backend server (Ctrl+C)
- Any Prisma Studio instances

### **Step 2: Run Database Migration**

Open a terminal in the project root and run:

```bash
cd packages/db
npx prisma migrate dev --name add_webhook_token
```

This will:
1. Create a migration file
2. Add `webhookToken` column to Workflow table
3. Regenerate Prisma Client

**If you see a conflict:**
```bash
# Reset and migrate
npx prisma migrate reset --skip-seed
npx prisma migrate dev --name add_webhook_token
```

### **Step 3: Generate Prisma Client**

```bash
cd packages/db
npx prisma generate
```

This regenerates TypeScript types for the updated schema.

### **Step 4: Update Existing Workflows (Optional)**

If you have existing webhook workflows, they won't have tokens yet. Two options:

**Option A: Regenerate tokens for existing workflows**

Run this script in your database:
```sql
UPDATE "Workflow"
SET "webhookToken" = md5(random()::text || clock_timestamp()::text)
WHERE "triggerType" = 'WEBHOOK' 
  AND "webhookToken" IS NULL;
```

**Option B: Just create new workflows**

Existing webhook workflows will continue to work without tokens (they'll fail and you can recreate them).

### **Step 5: Restart Servers**

```bash
# In project root
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend  
cd apps/frontend
npm run dev
```

---

## 📖 **How to Use Webhook Tokens**

### **Creating a Webhook Workflow:**

1. **Create new workflow** with webhook trigger
2. **Save the workflow** → Token is automatically generated
3. **Hover over 🔗 URL button** on webhook node
4. **Click to copy** the full URL (includes token)

### **Webhook URL Format:**

**With Query Parameter (Recommended):**
```
http://localhost:4000/api/executions/webhook/{workflowId}?token={64-char-token}
```

**Example:**
```bash
curl -X POST "http://localhost:4000/api/executions/webhook/cm3x5y2z?token=a1b2c3d4e5f6...64chars"
```

**With Header (Alternative):**
```bash
curl -X POST http://localhost:4000/api/executions/webhook/cm3x5y2z \
  -H "X-Webhook-Token: a1b2c3d4e5f6...64chars"
```

---

## 🔐 **Security Model**

### **Authentication Layers:**

1. **WorkflowId** - Unique UUID, hard to guess
2. **Webhook Token** - 64-character cryptographically secure token
3. **Active Toggle** - Workflow must be active
4. **Database Verification** - All three must match

### **Authorization:**

- Token belongs to specific workflow owner
- Execution runs with owner's userId
- Owner can view all executions
- Token can't be used for other workflows

### **What if Token is Compromised?**

**Option 1: Toggle Inactive**
- Turn workflow off → Token becomes useless
- Turn back on when needed

**Option 2: Regenerate Token (Future Feature)**
- Will add "Regenerate Token" button
- Old token becomes invalid
- New token generated

**Option 3: Delete & Recreate Workflow**
- Nuclear option
- New workflow = new token

---

## 🧪 **Testing the New System**

### **Test 1: Valid Token**

```bash
# Get your URL from webhook node (hover + copy)
curl -X POST "http://localhost:4000/api/executions/webhook/{id}?token={token}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "executionId": "exec-xyz",
    "message": "Webhook executed successfully",
    "workflowId": "cm3x5y2z"
  }
}
```

### **Test 2: Missing Token**

```bash
curl -X POST "http://localhost:4000/api/executions/webhook/{id}"
```

**Expected Response (401):**
```json
{
  "success": false,
  "error": "Webhook token is required. Please provide token in query parameter (?token=xxx) or X-Webhook-Token header."
}
```

### **Test 3: Invalid Token**

```bash
curl -X POST "http://localhost:4000/api/executions/webhook/{id}?token=wrong-token"
```

**Expected Response (403):**
```json
{
  "success": false,
  "error": "Invalid webhook token or workflow not found/inactive. Please check your token and ensure the workflow is active."
}
```

### **Test 4: Inactive Workflow**

Toggle workflow to "Inactive", then:

```bash
curl -X POST "http://localhost:4000/api/executions/webhook/{id}?token={correct-token}"
```

**Expected Response (403):**
```json
{
  "success": false,
  "error": "Invalid webhook token or workflow not found/inactive..."
}
```

---

## 📊 **Error Handling**

| Error Code | Meaning | Solution |
|------------|---------|----------|
| **401** | No token provided | Add `?token=xxx` to URL |
| **403** | Invalid token or inactive workflow | Check token, ensure workflow is Active |
| **404** | Workflow doesn't exist | Verify workflow ID |
| **500** | Server error | Check backend logs |

---

## 🎯 **Best Practices**

### **For Users:**

1. ✅ **Keep tokens private** - Don't share webhook URLs publicly
2. ✅ **Use HTTPS in production** - Encrypt tokens in transit
3. ✅ **Monitor executions** - Watch for unauthorized triggers
4. ✅ **Toggle inactive when not needed** - Extra security
5. ✅ **Rotate tokens periodically** (when feature is added)

### **For External Services:**

1. ✅ **Store tokens securely** - Use environment variables, not hardcoded
2. ✅ **Use query params** - Simpler than headers for most services
3. ✅ **Handle errors gracefully** - Check response status
4. ✅ **Retry on 500** - But not on 401/403 (auth issues)

---

## 🔄 **Comparison: Before vs After**

| Feature | Before | After |
|---------|--------|-------|
| **Authentication** | None (just workflowId) | Secure token required ✅ |
| **Security Level** | Low ⚠️ | High 🔐 |
| **Complexity** | Very simple | Still simple! |
| **External Services** | Easy to integrate | Easy (just include token) |
| **Token Length** | - | 64 characters |
| **Token Type** | - | Cryptographically secure hex |
| **User Experience** | Click to copy | Click to copy (includes token) ✅ |

---

## 🎉 **Benefits**

### **Security:**
- ✅ Proper authentication
- ✅ Token can't be guessed
- ✅ Per-workflow authorization
- ✅ Easy to revoke (toggle inactive)

### **Usability:**
- ✅ Token automatically included in copied URL
- ✅ Works with any external service
- ✅ Clear error messages
- ✅ Two ways to pass token (query/header)

### **Developer Experience:**
- ✅ No complex OAuth flows
- ✅ No API keys to manage separately
- ✅ Token stored with workflow
- ✅ Automatic generation

---

## 📚 **Files Changed**

### **Backend:**
- `packages/db/prisma/schema.prisma` - Added webhookToken field
- `apps/backend/src/controllers/workflow.controller.ts` - Token generation
- `apps/backend/src/controllers/execution.controller.ts` - Token verification

### **Frontend:**
- `apps/frontend/src/components/nodes/N8nNode.tsx` - Display token in URL
- `apps/frontend/src/hooks/useWorkflowLoader.ts` - Pass token to nodes

---

## 🆘 **Troubleshooting**

### **Problem: Linter errors about webhookToken**
**Solution:** Run `npx prisma generate` in `packages/db` folder

### **Problem: Database error when saving workflow**
**Solution:** Run the migration: `npx prisma migrate dev`

### **Problem: Existing webhooks don't work**
**Solution:** Recreate them or run SQL to add tokens

### **Problem: Token not showing on webhook node**
**Solution:** 
1. Save the workflow first (generates token)
2. Reload the page
3. Token should appear when you hover over 🔗 URL

---

## 🎁 **Summary**

You asked a great question about authentication, and now the system is properly secured!

**What changed:**
- ❌ Before: Anyone with URL could trigger webhook
- ✅ After: Unique token required per workflow

**User experience:**
- Still super simple
- Copy URL includes token automatically
- Works with any external service

**Security:**
- Real authentication
- Cryptographically secure tokens
- Easy to revoke access

**Next step:** Run the migration and test it! 🚀

