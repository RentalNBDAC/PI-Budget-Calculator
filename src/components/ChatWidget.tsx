import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Brain, Send, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! Ask me to analyze price data, like: **Which item is most expensive overall?**"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('pi-chat', {
        body: { prompt: userMessage }
      });

      if (error) throw error;

      if (data?.response) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.response 
        }]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message?.includes('429')) {
        errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (error.message?.includes('402')) {
        errorMessage = "AI credits depleted. Please add funds to your workspace.";
      }
      
      toast.error(errorMessage);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl gradient-secondary hover:shadow-2xl transition-smooth z-50"
        size="icon"
      >
        <Brain className="h-7 w-7" />
      </Button>

      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-28 right-6 w-96 h-[500px] shadow-2xl flex flex-col z-50 border-2">
          {/* Header */}
          <div className="gradient-secondary p-4 flex justify-between items-center text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <h3 className="font-bold text-lg">PI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl shadow-md transition-smooth ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card text-card-foreground border-2 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{ 
                       __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                     }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border-2 p-3 rounded-xl rounded-tl-none shadow-md">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about prices..."
                disabled={isLoading}
                className="flex-grow"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="gradient-primary"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
