"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Paperclip, 
  X,
  Search,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const connectWithId = searchParams.get('connectWith');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  
  // Message logs
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return;
    const parsedUser = JSON.parse(stored);
    setCurrentUser(parsedUser);

    const loadContacts = async () => {
      try {
        const res = await fetch('/api/developers');
        if (!res.ok) throw new Error("Failed to load developer list");
        const list = await res.json();
        
        // Contacts are other registered developers
        const otherDevs = list.filter((u: any) => u.id !== parsedUser.id);
        setContacts(otherDevs);

        // Check query parameters to select target contact
        if (connectWithId) {
          const target = otherDevs.find((c: any) => c.id === connectWithId);
          if (target) {
            setSelectedContact(target);
          }
        } else if (otherDevs.length > 0) {
          setSelectedContact(otherDevs[0]);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoadingContacts(false);
      }
    };

    loadContacts();
  }, [connectWithId]);

  // Load message logs on contact select
  useEffect(() => {
    if (!currentUser || !selectedContact) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages?senderId=${currentUser.id}&receiverId=${selectedContact.id}`);
        if (!res.ok) throw new Error("Failed to load conversation logs");
        const data = await res.json();
        setMessages(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [currentUser, selectedContact]);

  // Scroll on message change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedContact || !inputText.trim()) return;

    setSending(true);
    const content = inputText.trim();
    setInputText('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedContact.id,
          content
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      // Append message locally
      setMessages(prev => [...prev, data.message]);
    } catch (err: any) {
      setToast({ show: true, message: err.message || "Failed to deliver message.", type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleInsertEmoji = () => {
    setInputText(prev => prev + " 🚀");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          Messages
        </h1>
        <p className="text-xs text-slate-400">Directly sync with teammate matches, brainstorm project ideas, and organize hackathon work scopes.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-6 h-[550px]">
        
        {/* Contacts list */}
        <div className="md:col-span-4 flex flex-col h-full bg-slate-950/20 border border-slate-900 rounded-2xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-900 bg-slate-950/40">
            <h3 className="text-xs font-bold text-slate-200">Active Collaborators</h3>
          </div>

          {loadingContacts ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto divide-y divide-slate-900">
              {contacts.map((c) => {
                const active = selectedContact?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                      active ? 'bg-slate-900/60' : 'hover:bg-slate-900/20'
                    }`}
                    onClick={() => setSelectedContact(c)}
                  >
                    <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full border border-slate-800 bg-slate-900" />
                    <div className="overflow-hidden grow">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{c.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{c.preferredRole}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat box */}
        <div className="md:col-span-8 flex flex-col h-full bg-slate-950/20 border border-slate-900 rounded-2xl overflow-hidden">
          {selectedContact ? (
            <>
              {/* Header profile info */}
              <div className="p-4 border-b border-slate-900 bg-slate-950/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedContact.avatar} alt={selectedContact.name} className="w-9 h-9 rounded-full border border-slate-800 bg-slate-900" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{selectedContact.name}</h3>
                    <span className="text-[9px] text-indigo-400">{selectedContact.preferredRole}</span>
                  </div>
                </div>
              </div>

              {/* Message scroll container */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                    <MessageSquare className="w-8 h-8 mb-2 text-slate-650" />
                    <span>No messages yet. Say hello to kick off collaboration!</span>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isSelf = m.senderId === currentUser.id;
                    return (
                      <div key={m.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed ${
                            isSelf
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          {m.content}
                          <span className="block text-[8px] text-slate-400 mt-1.5 text-right font-medium">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-900 bg-slate-950/40 flex items-center gap-3">
                
                <button
                  type="button"
                  onClick={handleInsertEmoji}
                  className="p-2 text-slate-550 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="grow bg-slate-900/60 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  disabled={sending}
                />

                <Button type="submit" variant="primary" size="sm" className="py-2.5" disabled={sending || !inputText.trim()}>
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
                </Button>

              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              <MessageSquare className="w-10 h-10 mb-2 text-slate-650" />
              <span>Select a candidate builder on the left to start brainstorming!</span>
            </div>
          )}
        </div>

      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
