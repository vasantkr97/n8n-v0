# Execution Failing - Debug Guide 🔍

## Current Status
- ✅ Execution API call successful
- ✅ Execution ID created: `cmglxf902000jupa85ct67p4z`
- ❌ Execution status: **FAILED**
- Workflow: "My workfe", Mode: MANUAL, Duration: 0s

## What This Means
The execution is being created but failing immediately during execution. The error details are stored in the database and backend logs.

---

## Step-by-Step Debugging

### 1️⃣ Check Backend Console (MOST IMPORTANT)

In your terminal where backend is running, look for:

```bash
📋 Execution data:
  - Nodes: 2
  - Connections: 1
  - Nodes: [
      {
        "name": "Manual Trigger",
        "type": "manual",
        ...
      },
      {
        "name": "Telegram",
        "type": "telegram",
        ...
      }
    ]
  - Connections: [
      {
        "source": "Manual Trigger",
        "target": "Telegram"
      }
    ]

❌ Execution failed: [THIS IS THE ERROR MESSAGE]
Error stack: [STACK TRACE]
```

**👉 SHARE THIS ERROR MESSAGE!**

---

### 2️⃣ Click "Details" Button in Executions Page

1. Go to Executions page
2. Find the failed execution
3. Click **"Details"** button (purple)
4. Modal opens showing:
   - **Error Message**: The actual error
   - **Stack Trace**: Technical details
   - **Results**: What data was returned

**👉 SHARE THE ERROR MESSAGE FROM THE MODAL!**

---

### 3️⃣ Common Errors & Solutions

#### Error: "No trigger node found"
**Cause**: Workflow doesn't have a trigger node

**Solution**:
1. Add a Manual Trigger or Webhook node
2. Connect it to other nodes
3. Save and execute again

---

#### Error: "Missing credentials" or "Credentials not found"
**Cause**: Action node (Telegram, Email, etc.) needs credentials but they're not configured

**Solution**:
1. Click on the action node (Telegram, Email, etc.)
2. In the parameters panel, find "Credentials" dropdown
3. Select or create credentials
4. Save the workflow
5. Execute again

---

#### Error: "Required parameter not filled"
**Cause**: Node has required fields that are empty

**Solution**:
1. Click on the node
2. Fill in all required fields (marked with *)
3. Save the workflow
4. Execute again

---

#### Error: "Cannot read properties of undefined"
**Cause**: Data format issue, usually with connections or parameters

**Solution**:
1. Check that all nodes are properly connected
2. Verify node names match connection source/target
3. Re-save the workflow

---

#### Error: "Network error" or API errors
**Cause**: External service (Telegram API, Email service, etc.) is unreachable

**Solution**:
1. Check your internet connection
2. Verify API keys are correct
3. Check if the external service is operational

---

### 4️⃣ Test with Minimal Workflow

Create the simplest possible workflow to isolate the issue:

**Test 1: Manual Trigger Only**
1. New Workflow
2. Add Manual Trigger node ONLY
3. Save
4. Execute

**Expected**: Should succeed (trigger nodes always succeed)

**Test 2: Manual Trigger + Simple Action**
1. New Workflow
2. Add Manual Trigger
3. Add Telegram node
4. Connect them
5. **Configure Telegram node**:
   - Add credentials
   - Fill in chatId: `123456789`
   - Fill in message: `Test`
6. Save
7. Execute

**Expected**: Should succeed (or fail with specific Telegram API error)

---

### 5️⃣ Check Database Execution Record

If you have database access, check the execution:

```sql
SELECT * FROM "Execution" 
WHERE id = 'cmglxf902000jupa85ct67p4z';
```

Look at the `results` column - it contains the error details in JSON format.

---

## Most Likely Causes (Ranked)

### 1. **Missing Credentials** (90% likely)
If you added Telegram/Email/Gemini node without credentials:
- Node will fail immediately
- Error: "Missing credentials" or "Credentials not found"

### 2. **Missing Required Parameters** (80% likely)
If required fields are empty:
- Error: "Required parameter X is not set"

### 3. **Node Type Mismatch** (50% likely)
If node type doesn't match executor:
- Error: "Unknown node type" or similar

### 4. **Connection Format Issue** (30% likely)
If connections aren't arrays or have wrong format:
- Error: Related to finding next node

### 5. **Trigger Node Missing** (20% likely)
If no trigger in workflow:
- Error: "No trigger node found"

---

## Quick Fix Checklist

Before executing, verify:

- [ ] Workflow has at least one trigger node (Manual, Webhook, or Schedule)
- [ ] All action nodes are connected to something
- [ ] All action nodes have credentials configured
- [ ] All required parameters are filled
- [ ] Workflow is saved
- [ ] No errors in browser console
- [ ] Backend is running without errors

---

## Information Needed to Help You

Please provide:

1. **Backend Console Output**: 
   - The complete error message
   - The execution data logged before the error

2. **Details Modal Content**:
   - Error message shown in the modal
   - Stack trace if available

3. **Workflow Details**:
   - What nodes did you add?
   - Are they connected?
   - Did you configure credentials?
   - Did you fill in parameters?

4. **Screenshot** (if possible):
   - The workflow in the editor
   - The failed execution in Executions page
   - The Details modal showing the error

With this information, I can pinpoint the exact issue and fix it! 🎯

