import React from 'react';
import { PageHeader } from '@components/ui/PageHeader';
import { EmptyState } from '@components/ui/EmptyState';
import { MessageCircle } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const handleOpenCoach = () => {
    alert('AI Study Coach — chatbot interface integration coming in next phase!');
  };

  return (
    <div className="space-y-lg">
      <PageHeader 
        title="AI Study Coach" 
        description="Interact 24/7 with a personal learning tutor designed to simplify concepts."
      />
      <EmptyState 
        title="No active chat sessions" 
        description="Start a chat session to ask questions about your roadmap, get code samples, or start custom skill tests."
        icon={MessageCircle}
        actionText="Start Chatting With AI"
        onAction={handleOpenCoach}
      />
    </div>
  );
};
export default ChatPage;
