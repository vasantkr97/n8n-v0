# Debugging Guide - Executions & Connections Issues 🔍

## Issues Fixed

### ✅ Issue 1: Delete Execution Not Reflecting in DB
**Fixed**: Updated response format and added logging

### ✅ Issue 2: Connections Not Visible When Viewing Workflow
**Fixed**: Added array validation, comprehensive logging, and better data handling

---

## How to Debug These Issues

### 🔍 Step 1: Check Backend Console

The backend now has detailed logging for all operations. Open your backend terminal/console and watch for these logs:

#### When Saving a Workflow:
```
💾 Saving workflow:
  Frontend nodes: [...]
  Frontend edges: [...]
  Mapping edge: uuid-123 → uuid-456 to Webhook → Telegram
  Backend nodes: [...]
  Backend connections: [...]

📝 Creating workflow "My Workflow"
  - Nodes: 2
  - Connections: 1
  - Connections data: [
      {
        "source": "Webhook",
        "target": "Telegram"
      }
    ]
✅ Workflow created with ID: abc-123
```

#### When Viewing a Workflow:
```
📖 Fetching workflow abc-123 for user xyz-789
✅ Workflow abc-123 found:
  - Title: My Workflow
  - Nodes: 2
  - Connections: 1
  - Connections data: [
      {
        "source": "Webhook",
        "target": "Telegram"
      }
    ]
```

#### When Deleting an Execution:
```
🗑️ Deleting execution exec-123 for user user-456
✅ Execution exec-123 deleted successfully
```

---

## 🧪 Testing Procedure

### Test 1: Verify Connections are Saved Correctly

1. **Create a Simple Workflow**:
   ```
   - Open workflow editor
   - Add "Webhook" trigger node
   - Add "Telegram" action node
   - Connect them (drag from Webhook to Telegram)
   - DO NOT RENAME THE NODES YET
   ```

2. **Save and Check Backend Console**:
   ```
   Should see:
   💾 Saving workflow:
     Frontend nodes: [
       { id: "uuid-1", label: "Webhook" },
       { id: "uuid-2", label: "Telegram" }
     ]
     Frontend edges: [
       { source: "uuid-1", target: "uuid-2" }
     ]
     Mapping edge: uuid-1 → uuid-2 to Webhook → Telegram
     Backend connections: [
       { source: "Webhook", target: "Telegram" }
     ]
   
   📝 Creating workflow "Untitled Workflow"
     - Nodes: 2
     - Connections: 1
   ✅ Workflow created with ID: [workflow-id]
   ```

3. **Verify**: If you see `Connections: 1`, it's saved correctly!

---

### Test 2: Verify Connections Load Correctly

1. **Execute the Workflow**:
   ```
   - Click "Execute" button
   - Wait for execution to complete
   ```

2. **View from Executions**:
   ```
   - Go to Executions page
   - Click "View Workflow" on your execution
   ```

3. **Check Browser Console** (F12):
   ```
   Should see:
   📦 Raw workflow data from backend:
     Nodes: [
       {
         "name": "Webhook",
         "type": "webhook",
         ...
       },
       {
         "name": "Telegram",
         "type": "telegram",
         ...
       }
     ]
     Connections: [
       {
         "source": "Webhook",
         "target": "Telegram"
       }
     ]
   
   🔧 Mapped nodes (with IDs):
     - ID: "Webhook", Label: "Webhook"
     - ID: "Telegram", Label: "Telegram"
   
   🔗 Mapped edges:
     - "Webhook" → "Telegram"
   
   ✅ Setting 2 nodes and 1 edges
   ```

4. **Check Backend Console**:
   ```
   Should see:
   📖 Fetching workflow [id] for user [user-id]
   ✅ Workflow [id] found:
     - Title: Untitled Workflow
     - Nodes: 2
     - Connections: 1
     - Connections data: [
         {
           "source": "Webhook",
           "target": "Telegram"
         }
       ]
   ```

5. **Visual Check**: You should now see the connection line between the nodes!

---

### Test 3: Verify Delete Execution Works

1. **Execute a Workflow**:
   ```
   - Create and execute any workflow
   - Wait for it to finish
   ```

2. **Delete from Executions Page**:
   ```
   - Go to Executions page
   - Click "Delete" on an execution
   - Confirm deletion
   ```

3. **Check Backend Console**:
   ```
   Should see:
   🗑️ Deleting execution [exec-id] for user [user-id]
   ✅ Execution [exec-id] deleted successfully
   ```

4. **Verify**: The execution should disappear from the list immediately

---

## 🐛 Common Issues & Solutions

### Issue: Connections Still Not Showing

#### Possible Cause 1: Old Data in Database
**Symptoms**: Backend shows `Connections: Not an array!` or `Connections: 0` even though you have connections.

**Solution**:
1. Create a **NEW** workflow (don't use old ones)
2. Add 2-3 nodes
3. Connect them
4. Save
5. Execute
6. View from executions

Old workflows might have connections stored as objects `{}` instead of arrays `[]`.

#### Possible Cause 2: Node Names Don't Match
**Symptoms**: Backend shows connections but they don't appear visually.

**Check the logs for mismatch**:
```
Backend connections: [{ source: "Webhook Trigger", target: "Telegram" }]
Mapped nodes: ID: "Webhook", ID: "Telegram"
```

**Issue**: Connection says "Webhook Trigger" but node ID is "Webhook"

**Solution**: The node name was changed after creating connections. Re-save the workflow:
1. Make a small change (move a node)
2. Save again
3. The connections will be updated with correct names

#### Possible Cause 3: Frontend Not Receiving Data
**Check Browser Console**: Do you see the logs starting with 📦, 🔧, 🔗?

If **NO**:
- Check if WorkflowEditor.tsx changes are saved
- Refresh the page hard (Ctrl+Shift+R)
- Check Network tab for API response

If **YES** but connections still missing:
- Look at the `🔗 Mapped edges` output
- Check if source/target match the node IDs from `🔧 Mapped nodes`
- If they don't match, there's a name mismatch

---

### Issue: Delete Execution Not Working

#### Possible Cause 1: API Error
**Check Backend Console**: Do you see `🗑️ Deleting execution...`?

If **NO**:
- Check browser console for API errors
- Check if you're logged in
- Try refreshing the page

If **YES** but shows error:
- Look at the error message
- Might be a permission issue

#### Possible Cause 2: Frontend Not Refreshing
**Check**: Does the backend say deleted but item still shows?

**Solution**:
1. Click the "Refresh" button on Executions page
2. Or wait 5 seconds (auto-refresh)

---

## 📊 What the Logs Mean

### Saving Workflow:
- `Frontend nodes/edges`: What React Flow has
- `Mapping edge`: Converting UUIDs to node names
- `Backend nodes/connections`: What gets saved to database

### Loading Workflow:
- `Raw workflow data`: What came from database
- `Mapped nodes with IDs`: What node IDs we're creating
- `Mapped edges`: What connections we're creating
- `Setting X nodes and Y edges`: Final step before rendering

### Delete Execution:
- `Deleting execution`: Starting delete process
- `Execution deleted successfully`: Completed successfully

---

## 🎯 Quick Checklist

When connections don't show:

- [ ] Check backend console for "Connections: 1" (or more)
- [ ] Check browser console for "Setting X nodes and Y edges" where Y > 0
- [ ] Verify node IDs match connection source/target
- [ ] Try with a NEW workflow (not old ones)
- [ ] Make sure node names haven't changed after creating connections

When delete doesn't work:

- [ ] Check backend console for "Execution deleted successfully"
- [ ] Check browser console for API errors
- [ ] Verify you're logged in
- [ ] Try clicking "Refresh" button

---

## 🚀 Expected Behavior (After Fixes)

### Saving:
1. Create workflow with nodes and connections
2. Click Save
3. Backend logs show connections array
4. Alert shows "Workflow saved successfully"

### Viewing:
1. Go to Executions page
2. Click "View Workflow"
3. Backend logs show fetching workflow with connections
4. Browser logs show mapping nodes and edges
5. **Connections are visible on canvas**

### Deleting:
1. Click "Delete" on execution
2. Confirm
3. Backend logs show deletion success
4. Execution disappears from list
5. **Database is updated** (can verify by refreshing page)

---

## 📝 Report Issues

If you still have issues, share these logs:

1. **Backend Console Output** when:
   - Saving workflow
   - Loading workflow
   - Deleting execution

2. **Browser Console Output** (F12) when:
   - Viewing workflow from executions

3. **Screenshots** of:
   - Workflow editor (showing nodes but no connections)
   - Executions page

With these logs, I can pinpoint the exact issue!

