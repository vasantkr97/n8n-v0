# 🎨 How to Add Nodes to Your Workflow

## ✅ **Node Adding Feature - Now Available!**

I've just implemented a complete node-adding system with a beautiful floating button and node selector!

---

## 🎯 **How to Add Nodes:**

### **Method 1: Floating "+" Button (NEW!)**

1. **Open your workflow** (go to `/dashboard`)
2. Look for the **blue circular "+" button** in the bottom-right corner
3. **Click the "+" button**
4. A **Node Selector** dialog will appear in the center of your screen
5. **Browse or search** for the node you want
6. **Click on a node** to add it to your canvas

---

## 📦 **Available Nodes:**

### **Trigger Nodes** (Start your workflow)

| Node | Icon | Description | Use Case |
|------|------|-------------|----------|
| **Manual Trigger** | ▶️ | Manually start the workflow | Testing, on-demand execution |
| **Webhook** | 🔗 | Trigger on incoming HTTP requests | External integrations, APIs |

### **Action Nodes** (Do things in your workflow)

| Node | Icon | Description | Use Case |
|------|------|-------------|----------|
| **Telegram** | 💬 | Send messages via Telegram bot | Notifications, chat automation |
| **Email** | 📧 | Send email messages | Email notifications, reports |
| **Gemini AI** | ✨ | Use Gemini LLM to generate content | AI responses, content generation |

---

## 🎨 **Node Selector Features:**

### **1. Categories**
- **Triggers** - First node in your workflow (only need one)
- **Actions** - Everything else your workflow does

### **2. Smart Behavior**
- If you **don't have a trigger yet** → Shows Triggers category
- If you **already have a trigger** → Only shows Actions category
- Can't add more than one trigger (enforced!)

### **3. Search**
- Type to search nodes by name or description
- Real-time filtering
- Clear results

### **4. Beautiful UI**
- Clean white dialog
- Color-coded node icons
- Hover effects
- Responsive layout

---

## 🔧 **Node Placement:**

When you add a node:
- It appears in the **center of your viewport**
- You can **drag it** anywhere you want
- **Connect nodes** by dragging from one node's handle to another
- **Click a node** to edit its parameters

---

## 🎬 **Complete Workflow:**

### **Step 1: Create Workflow**
- Click "New Workflow" button
- Workflow is created in backend

### **Step 2: Add Trigger Node**
- Click the **"+" button**
- Select **Manual Trigger** or **Webhook**
- Trigger node appears on canvas

### **Step 3: Add Action Nodes**
- Click the **"+" button** again
- Now you only see **Actions**
- Add **Telegram**, **Email**, or **Gemini**
- Repeat to add more actions

### **Step 4: Connect Nodes**
- **Drag** from one node's right handle
- **Drop** on another node's left handle
- Connection line appears

### **Step 5: Configure Nodes**
- **Click** on any node
- **Parameters panel** opens on the right
- Fill in required fields (API keys, messages, etc.)
- Click **"Save"**

### **Step 6: Save & Execute**
- Click **"Save"** in toolbar → Saves to backend
- Toggle **"Active"** → Enables workflow
- Click **"Execute"** → Runs your workflow!

---

## 💡 **Tips & Tricks:**

### **Node Connection:**
- Nodes execute from **left to right**
- Data flows through connections
- Multiple nodes can be connected in sequence

### **Node Configuration:**
- Each node has its own parameters
- Click node → Parameters panel appears
- Required fields are marked
- Changes saved immediately

### **Workflow Structure:**
```
[Trigger] → [Action 1] → [Action 2] → [Action 3]
```

Example:
```
[Manual Trigger] → [Gemini AI] → [Telegram] → [Email]
```

### **Adding More Nodes:**
- Add as many action nodes as you need
- Build complex workflows
- Chain multiple services

---

## 🎨 **UI Components:**

### **1. Floating "+" Button**
- Location: **Bottom-right corner**
- Color: **Blue (#3b82f6)**
- Size: **56px × 56px**
- Hover: **Scales up**
- Shadow: **2xl**

### **2. Node Selector Dialog**
- Location: **Center of screen**
- Size: **380px × 450px**
- Style: **White modal**
- Features: **Search, categories, icons**

### **3. Node Canvas**
- Background: **Black with dots**
- Controls: **Bottom-left**
- MiniMap: **Bottom-right**
- Zoom: **Mouse wheel**
- Pan: **Click & drag**

---

## 🛠️ **How It Works (Technical):**

### **Behind the Scenes:**

1. **Click "+" Button**
   ```typescript
   handleAddNode() → Opens NodeSelector
   ```

2. **Select Node Type**
   ```typescript
   handleNodeSelect(nodeType) → Creates node with UUID
   ```

3. **Node Created**
   ```typescript
   - Generate unique ID
   - Get node config (icon, color, label)
   - Position in center
   - Add to canvas
   - Track if trigger
   ```

4. **State Management**
   ```typescript
   - nodes: Array of all nodes
   - edges: Array of connections
   - hasTrigger: Boolean flag
   - showNodeSelector: Dialog visibility
   ```

---

## 📝 **Node Types Reference:**

### **Node Structure:**
```typescript
{
  id: 'unique-uuid',
  type: 'telegram',
  position: { x: 100, y: 100 },
  data: {
    label: 'Telegram',
    description: 'Send messages via Telegram bot',
    icon: '💬',
    color: '#0088cc',
    parameters: { ... },
    credentialsId: 'cred-id'
  }
}
```

### **Adding Your Own Nodes:**

To add a new node type, edit `nodeTypes.ts`:

```typescript
export const nodeConfigs = {
  // Add your node here
  myNewNode: {
    icon: '🚀',
    color: '#ff6b6b',
    label: 'My New Node',
    description: 'Does something cool',
    isTrigger: false, // or true
  },
};
```

Then add to `NodeSelector.tsx`:
```typescript
const nodeCategories = {
  'Triggers': ['manual', 'webhook'],
  'Actions': ['telegram', 'email', 'gemini', 'myNewNode'],
};
```

---

## 🎉 **Example Workflows:**

### **Simple Notification:**
```
Manual Trigger → Telegram
```

### **AI-Powered Notification:**
```
Webhook → Gemini AI → Telegram → Email
```

### **Data Processing:**
```
Webhook → Gemini AI → Email
```

### **Multi-Channel Alert:**
```
Manual Trigger → Gemini AI → Telegram
                            → Email
```

---

## 🐛 **Troubleshooting:**

### **"+" Button not visible?**
- Check bottom-right corner
- Make sure you're on `/dashboard` or `/workflow/:id`
- Scroll down if needed

### **Node Selector not opening?**
- Click the "+" button again
- Check browser console for errors

### **Can't add more triggers?**
- **This is intentional!**
- Workflows can only have ONE trigger
- Add action nodes instead

### **Nodes not connecting?**
- Drag from **right handle** → **left handle**
- Make sure both nodes are close enough
- Try zooming in

---

## ✅ **What's New:**

- ✅ Floating "+" button in bottom-right
- ✅ Beautiful Node Selector dialog
- ✅ Smart category filtering (Triggers vs Actions)
- ✅ Search functionality
- ✅ One-trigger enforcement
- ✅ Center viewport positioning
- ✅ Color-coded node types
- ✅ Hover animations

---

## 🚀 **Try It Now!**

1. Go to `http://localhost:5173/dashboard`
2. Look for the blue **"+"** button (bottom-right)
3. Click it!
4. Add your first node
5. Build your workflow!

**Enjoy building workflows! 🎨**

