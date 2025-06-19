import { Component, createSignal, For } from 'solid-js';
import { useMatrix } from '../contexts/MatrixContext';

const ChatPanel: Component = () => {
  const { sendMessage, currentUser } = useMatrix();
  const [message, setMessage] = createSignal('');
  const [messages, setMessages] = createSignal<any[]>([]);

  const handleSendMessage = async (e: Event) => {
    e.preventDefault();
    if (!message().trim()) return;

    try {
      // This would need the current room ID
      // await sendMessage(roomId, message());
      
      // For demo, add to local messages
      setMessages(prev => [...prev, {
        sender: currentUser()?.displayName || 'You',
        content: message(),
        timestamp: Date.now()
      }]);
      
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div class="space-y-4 h-80 flex flex-col">
      <h3 class="text-lg font-semibold text-white">Chat</h3>
      
      {/* Messages */}
      <div class="flex-1 bg-white/5 rounded-lg p-3 overflow-y-auto space-y-2">
        <For each={messages()} fallback={
          <p class="text-gray-400 text-sm text-center">No messages yet</p>
        }>
          {(msg) => (
            <div class="text-sm">
              <span class="text-blue-400 font-medium">{msg.sender}:</span>
              <span class="text-white ml-2">{msg.content}</span>
            </div>
          )}
        </For>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} class="flex space-x-2">
        <input
          type="text"
          value={message()}
          onInput={(e) => setMessage(e.currentTarget.value)}
          placeholder="Type a message..."
          class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          class="bg-monopoly-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
