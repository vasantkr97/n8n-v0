// Script to add webhook tokens to existing webhook workflows
// Run with: bun scripts/add-webhook-tokens.ts

import { prisma } from '@n8n/db';
import crypto from 'crypto';

function generateWebhookToken(): string {
  return crypto.randomBytes(32).toString('hex'); // 64-character hex string
}

async function addWebhookTokens() {
  try {
    console.log('🔍 Checking for webhook workflows without tokens...\n');

    // Find all webhook workflows without tokens
    const workflowsWithoutTokens = await prisma.workflow.findMany({
      where: {
        triggerType: 'WEBHOOK',
        webhookToken: null,
      },
      select: {
        id: true,
        title: true,
        userId: true,
      },
    });

    if (workflowsWithoutTokens.length === 0) {
      console.log('✅ All webhook workflows already have tokens!');
      return;
    }

    console.log(`📋 Found ${workflowsWithoutTokens.length} webhook workflow(s) without tokens:\n`);
    
    workflowsWithoutTokens.forEach((wf, index) => {
      console.log(`${index + 1}. ${wf.title} (ID: ${wf.id})`);
    });

    console.log('\n🔐 Generating tokens...\n');

    // Update each workflow with a new token
    for (const workflow of workflowsWithoutTokens) {
      const token = generateWebhookToken();
      
      await prisma.workflow.update({
        where: { id: workflow.id },
        data: { webhookToken: token },
      });

      console.log(`✅ Added token to: ${workflow.title}`);
      console.log(`   Token: ${token}\n`);
    }

    console.log(`\n🎉 Successfully added tokens to ${workflowsWithoutTokens.length} workflow(s)!`);
    console.log('\n💡 Next steps:');
    console.log('   1. Reload your workflow in the browser');
    console.log('   2. Hover over the webhook node');
    console.log('   3. Click the 🔗 URL button to copy the webhook URL\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
addWebhookTokens();

