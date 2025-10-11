# In-Panel Credentials Creation Feature

## Overview

Just like **n8n**, users can now create credentials in **two places**, both saving to the database:

1. **Credentials Page** - Centralized management of all credentials
2. **Node Configuration Panel** - Quick creation while building workflows

All credentials are **saved to the database** and **reusable** across workflows.

---

## 🎯 How It Works

### Method 1: Credentials Page (Traditional)

Navigate to **Credentials** → Click **Add Credential** → Fill form → Save

### Method 2: In-Panel Creation (New!) ⭐

While configuring a node:
1. Click the **➕ button** next to the credentials dropdown
2. Fill in the quick creation form
3. Click **"Save & Select"**
4. Credential is **saved to database** AND **automatically selected** for the node

---

## 📱 Visual Flow

```
┌─────────────────────────────────────────┐
│  Configure Telegram Node                │
├─────────────────────────────────────────┤
│  Credentials *                           │
│  [Select credentials... ▼]  [➕]  ← Click to create
│                                          │
│  ✓ Credential selected                  │
├─────────────────────────────────────────┤
│  When ➕ clicked:                        │
│  ┌─────────────────────────────────┐   │
│  │ Create New Telegram Credential  │   │
│  │                                  │   │
│  │ Name *                           │   │
│  │ [My Telegram Bot]                │   │
│  │                                  │   │
│  │ Bot Token *                      │   │
│  │ [••••••••••••••••]              │   │
│  │ From @BotFather on Telegram     │   │
│  │                                  │   │
│  │ [Cancel] [Save & Select]         │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Chat ID *                               │
│  [123456789]                             │
│                                          │
│  Message *                               │
│  [Your message...]                       │
└─────────────────────────────────────────┘
```

---

## ✨ Features

### 1. **Quick Create Button (➕)**
- Located next to credentials dropdown
- Toggles creation form
- Changes to ✕ when form is open

### 2. **Smart Form**
- Shows fields based on credential type
- Validates required fields
- Helpful hints under each field
- Disabled state during save

### 3. **Auto-Selection**
- After saving, credential is automatically selected
- No need to manually pick from dropdown
- Immediate feedback with green checkmark

### 4. **Database Storage**
- All credentials saved to `credentials` table
- Same as credentials created on Credentials page
- Fully reusable across all workflows

---

## 📋 Credential Types Supported

### Telegram
**Fields:**
- Name * (e.g., "My Telegram Bot")
- Bot Token * (from @BotFather)

**Stored as:**
```json
{
  "title": "My Telegram Bot",
  "platform": "telegram",
  "data": {
    "botToken": "1234567890:ABC..."
  }
}
```

### Gemini AI
**Fields:**
- Name * (e.g., "My Gemini API")
- API Key * (from Google AI Studio)

**Stored as:**
```json
{
  "title": "My Gemini API",
  "platform": "gemini",
  "data": {
    "apiKey": "AIza..."
  }
}
```

### Email (Resend)
**Fields:**
- Name * (e.g., "Company Email")
- Resend API Key *
- From Email *

**Stored as:**
```json
{
  "title": "Company Email",
  "platform": "email",
  "data": {
    "apiKey": "re_...",
    "fromEmail": "noreply@company.com"
  }
}
```

---

## 🔄 User Experience Flow

### Scenario: First Time User

```
User adds Telegram node
    ↓
Sees empty dropdown + ➕ button
    ↓
Clicks ➕ (no need to leave editor!)
    ↓
Fills Name + Bot Token
    ↓
Clicks "Save & Select"
    ↓
✅ Credential saved to database
✅ Automatically selected in dropdown
✅ Green checkmark appears
    ↓
Continues configuring node
    ↓
Saves workflow
    ↓
Executes successfully! 🎉
```

### Scenario: Existing User

```
User has credentials in database
    ↓
Opens dropdown
    ↓
Sees existing credentials + ➕ button
    ↓
Can either:
  - Select existing credential
  - Create new one with ➕
    ↓
Flexible and fast! 💨
```

---

## 💾 Backend Integration

### Database Schema
```typescript
credentials {
  id: string (primary key)
  title: string
  platform: string
  data: JSON
  userId: string (foreign key)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### API Endpoint Used
```
POST /api/credentials/postCredentials
{
  "title": "My Credential",
  "platform": "telegram",
  "data": { "botToken": "..." }
}
```

### Response
```json
{
  "data": {
    "id": "cmg68gjne0001upqour5aju4p",
    "title": "My Credential",
    "platform": "telegram",
    ...
  }
}
```

The new ID is automatically used to select the credential.

---

## 🎨 Frontend Implementation

### CredentialsSelector Component

**State Management:**
```typescript
const [showCreateForm, setShowCreateForm] = useState(false);
const [formData, setFormData] = useState<any>({});
```

**React Query Integration:**
```typescript
const createMutation = useMutation({
  mutationFn: postCredentials,
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['credentials'] });
    setShowCreateForm(false);
    setFormData({});
    // Auto-select newly created credential
    const newId = data?.data?.id || data?.id;
    if (newId) onChange(newId);
  },
});
```

**Conditional Rendering:**
```typescript
{credentialType.toLowerCase() === 'telegram' && (
  <div>
    <label>Bot Token *</label>
    <input
      type="password"
      value={formData.botToken || ''}
      onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
    />
  </div>
)}
```

---

## 🔍 Backend Validation

### Executor Logic (Telegram Example)

```typescript
export async function executeTelegramAction(
    node: WorkflowNode,
    context: ExecutionContext,
    credentialId: any
): Promise<any> {
    if (!credentialId) {
        throw new Error("Telegram credentials not provided. Please select or create credentials.");
    }

    const credentials = await prisma.credentials.findFirst({
        where: { id: credentialId }
    });
    
    if (!credentials) {
        throw new Error("Telegram credentials not found");
    }

    const botToken = credentials.data.botToken;
    // ... use botToken for Telegram API
}
```

**Key Points:**
- ✅ Credentials **must** exist in database
- ✅ No inline/temporary credentials
- ✅ Same logic for all creation methods
- ✅ Consistent error messages

---

## ✅ Benefits

### 1. **Improved User Experience**
- No context switching (stay in workflow editor)
- Faster credential creation
- Immediate selection after creation
- Reduced clicks and navigation

### 2. **Consistency**
- Same database storage as Credentials page
- Same credential format
- Same validation rules
- Unified management

### 3. **Reusability**
- All credentials saved permanently
- Available across all workflows
- Can be edited from Credentials page
- Can be deleted when no longer needed

### 4. **Security**
- Password fields hide sensitive data
- Stored securely in database
- User-specific (userId association)
- Proper access control

---

## 🆚 Comparison: Two Methods

| Feature | Credentials Page | In-Panel Creation |
|---------|-----------------|-------------------|
| **Location** | Dedicated page | Node configuration |
| **Storage** | Database ✅ | Database ✅ |
| **Reusability** | Yes ✅ | Yes ✅ |
| **Context** | Separate navigation | Stay in workflow |
| **Auto-Select** | Manual | Automatic ✅ |
| **Best For** | Bulk management | Quick single create |
| **Speed** | Slower (navigation) | Faster (no nav) |

---

## 📝 Files Modified

### Frontend
- `apps/frontend/src/components/parameters/CredentialsSelector.tsx`
  - Added ➕ button
  - Added create form rendering
  - Added React Query mutation
  - Added auto-selection logic

### Node Parameters (No Changes to Storage Logic)
- `apps/frontend/src/components/parameters/nodeParams/TelegramParams.tsx`
- `apps/frontend/src/components/parameters/nodeParams/GeminiParams.tsx`
- `apps/frontend/src/components/parameters/nodeParams/EmailParams.tsx`

### Backend (No Changes - Already Supports DB Credentials)
- `apps/backend/src/engine/nodeExecutors/telegramExecutor.ts`
- `apps/backend/src/engine/nodeExecutors/geminiExecutor.ts`
- `apps/backend/src/engine/nodeExecutors/emailExecutor.ts`

---

## 🎯 Result

### Just Like n8n! 🎉

Users now have the **same flexibility as n8n**:

✅ Create credentials in dedicated Credentials page
✅ Create credentials directly in node panel
✅ All credentials saved to database
✅ All credentials reusable
✅ Consistent management across both methods
✅ Seamless workflow building experience

**No temporary credentials. No confusion. Just smooth workflow creation!** 🚀

---

## 💡 Future Enhancements (Ideas)

1. **Credential Editing** - Edit button next to dropdown
2. **Credential Preview** - Show masked token in dropdown
3. **Quick Duplicate** - Copy existing credential with new name
4. **Recent Credentials** - Show recently used at top
5. **Credential Tags** - Organize by tags/labels
6. **Credential Testing** - Test button to verify credentials work

---

This implementation provides the best of both worlds - centralized management AND quick inline creation, just like n8n! 🎊

