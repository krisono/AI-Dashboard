// Mock AI functions for MammoAssist - Simulated for demonstration only

import { Finding, ChatMessage, VoiceCommand } from './types';
import { mockFindings, getCaseById } from './mockData';

// Get AI-generated findings for a case
export async function getCaseFindings(caseId: string): Promise<Finding[]> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const findings = mockFindings.filter(f => f.caseId === caseId);
  return findings;
}

// Generate rationale summary for a case
export async function summarizeRationale(caseId: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const caseData = getCaseById(caseId);
  if (!caseData) return 'Case not found';
  
  const { riskScore, confidence, uncertaintyFlag } = caseData;
  
  if (confidence < 0.55) {
    return '⚠️ AI unsure; recommend second review. The algorithm has low confidence in this assessment due to image quality or atypical patterns. A human radiologist should perform independent evaluation.';
  }
  
  if (riskScore > 85) {
    return `High risk assessment (${riskScore}/100) with ${Math.round(confidence * 100)}% confidence. Multiple suspicious features detected including irregular margins and architectural distortion. Recommend immediate biopsy and specialist consultation.`;
  }
  
  if (riskScore > 70) {
    return `Elevated risk (${riskScore}/100) detected with ${Math.round(confidence * 100)}% confidence. Some concerning features present. Recommend additional imaging and possible biopsy pending radiologist review.`;
  }
  
  if (riskScore > 50) {
    return `Moderate findings (${riskScore}/100) with ${Math.round(confidence * 100)}% confidence. Asymmetry or subtle density changes noted. Short-term follow-up recommended.`;
  }
  
  return `Low risk assessment (${riskScore}/100) with ${Math.round(confidence * 100)}% confidence. No significant abnormalities detected. Routine screening interval appropriate.`;
}

// Chat assistant reply
export async function chatReply(
  message: string,
  context: { caseId?: string; conversationHistory?: ChatMessage[] }
): Promise<ChatMessage> {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const lowerMessage = message.toLowerCase();
  const caseData = context.caseId ? getCaseById(context.caseId) : null;
  
  // Low confidence responses
  if (caseData && caseData.confidence < 0.55) {
    if (lowerMessage.includes('risk') || lowerMessage.includes('assessment')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ I have low confidence in this case assessment. The image quality or pattern is atypical. I strongly recommend an independent human review rather than relying on my analysis.',
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { label: 'Request Second Review', type: 'next-case' },
          { label: 'View Manual Review Mode', type: 'toggle-heatmap' },
        ],
      };
    }
  }
  
  // Heatmap questions
  if (lowerMessage.includes('heatmap') || lowerMessage.includes('overlay')) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'The heatmap overlay highlights regions where the AI detected suspicious features. Brighter/warmer colors indicate higher confidence in abnormality. You can toggle it on/off in the case viewer.',
      timestamp: new Date().toISOString(),
      suggestedActions: [
        { label: 'Toggle Heatmap', type: 'toggle-heatmap' },
      ],
    };
  }
  
  // Risk explanation
  if (lowerMessage.includes('why') || lowerMessage.includes('explain') || lowerMessage.includes('reason')) {
    if (caseData) {
      const reasons = [];
      if (caseData.riskScore > 75) reasons.push('irregular margins', 'architectural distortion', 'increased density');
      else if (caseData.riskScore > 50) reasons.push('asymmetry', 'subtle density changes');
      else reasons.push('normal parenchymal pattern', 'no suspicious features');
      
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Risk score of ${caseData.riskScore} is based on: ${reasons.join(', ')}. Confidence: ${Math.round(caseData.confidence * 100)}%.`,
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { label: 'View Findings', type: 'summarize' },
        ],
      };
    }
  }
  
  // Next case
  if (lowerMessage.includes('next') || lowerMessage.includes('continue')) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Ready to move to the next case in your queue. Would you like to proceed?',
      timestamp: new Date().toISOString(),
      suggestedActions: [
        { label: 'Go to Next Case', type: 'next-case' },
        { label: 'Return to Queue', type: 'next-case' },
      ],
    };
  }
  
  // Bias questions
  if (lowerMessage.includes('bias') || lowerMessage.includes('fairness')) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Bias monitoring tracks performance across patient subgroups (age, device type, density). Check the Bias & Monitoring page for detailed metrics and disparity analysis.',
      timestamp: new Date().toISOString(),
      suggestedActions: [
        { label: 'View Bias Dashboard', type: 'next-case' },
      ],
    };
  }
  
  // Default response
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: 'I can help you understand findings, explain risk scores, navigate cases, or discuss bias monitoring. What would you like to know?',
    timestamp: new Date().toISOString(),
    suggestedActions: [
      { label: 'Explain This Case', type: 'summarize' },
      { label: 'Next Case', type: 'next-case' },
      { label: 'View Queue', type: 'next-case' },
    ],
  };
}

// Process voice command
export async function processVoiceCommand(transcript: string): Promise<VoiceCommand> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const lowerTranscript = transcript.toLowerCase();
  
  // Navigation commands
  if (lowerTranscript.includes('next case')) {
    return {
      transcript,
      action: 'next-case',
      confidence: 0.92,
      requiresConfirmation: false,
    };
  }
  
  if (lowerTranscript.includes('previous case') || lowerTranscript.includes('go back')) {
    return {
      transcript,
      action: 'previous-case',
      confidence: 0.89,
      requiresConfirmation: false,
    };
  }
  
  if (lowerTranscript.includes('return to queue') || lowerTranscript.includes('show queue')) {
    return {
      transcript,
      action: 'goto-queue',
      confidence: 0.94,
      requiresConfirmation: false,
    };
  }
  
  // Heatmap toggle
  if (lowerTranscript.includes('toggle heatmap') || lowerTranscript.includes('show heatmap') || lowerTranscript.includes('hide heatmap')) {
    return {
      transcript,
      action: 'toggle-heatmap',
      confidence: 0.87,
      requiresConfirmation: false,
    };
  }
  
  // Decision commands (require confirmation)
  if (lowerTranscript.includes('confirm finding') || lowerTranscript.includes('approve')) {
    return {
      transcript,
      action: 'confirm-finding',
      confidence: 0.78,
      requiresConfirmation: true,
      payload: { action: 'confirm' },
    };
  }
  
  if (lowerTranscript.includes('reject') || lowerTranscript.includes('disagree')) {
    return {
      transcript,
      action: 'reject-finding',
      confidence: 0.81,
      requiresConfirmation: true,
      payload: { action: 'reject' },
    };
  }
  
  // Unknown command
  return {
    transcript,
    action: 'unknown',
    confidence: 0.35,
    requiresConfirmation: false,
  };
}
