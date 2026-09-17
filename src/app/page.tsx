"use client";

import { Check, Copy } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
  MessageSquare,
  Check,
  Copy,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Msg[];
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "ergonix-ai-chats";
const ACTIVE_CHAT_KEY = "ergonix-ai-active-chat";

function createChat(): Chat {
  const now = Date.now();

  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${now}-${Math.random()}`,
    title: "New chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

function makeTitle(text: string) {
  const cleaned = text.trim().replace(/\s+/g, " ");

  if (!cleaned) return "New chat";

  return cleaned.length > 34
    ? cleaned.substring(0, 34) + "..."
    : cleaned;
}

function MarkdownMessage({ content }: { content: string }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);

    setCopiedCode(code);

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const code = String(children).replace(/\n$/, "");
          const language =
            className?.replace("language-", "") || "";

          const isBlock =
            Boolean(className) || code.includes("\n");

          if (!isBlock) {
            return (
              <code className="inlineCode" {...props}>
                {children}
              </code>
            );
          }

          return (
            <div className="codeBlock">
              <div className="codeHeader">
                <span>{language || "code"}</span>

                <button
                  onClick={() => copyCode(code)}
                  className="copyCode"
                >
                  {copiedCode === code ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <pre>
                <code>{code}</code>
              </pre>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [input, setInput] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [thinking, setThinking] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || null;

  const messages = activeChat?.messages || [];

  // LOAD CHAT HISTORY
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem(STORAGE_KEY);
      const savedActive = localStorage.getItem(ACTIVE_CHAT_KEY);

      if (savedChats) {
        const parsed: Chat[] = JSON.parse(savedChats);

        if (parsed.length > 0) {
          setChats(parsed);

          if (
            savedActive &&
            parsed.some((chat) => chat.id === savedActive)
          ) {
            setActiveChatId(savedActive);
          } else {
            setActiveChatId(parsed[0].id);
          }

          setLoaded(true);
          return;
        }
      }

      // Try importing your OLD single-chat history
      const oldChat = localStorage.getItem("ergonix-ai-chat");

      if (oldChat) {
        const oldMessages: Msg[] = JSON.parse(oldChat);

        if (oldMessages.length > 0) {
          const imported = createChat();

          imported.messages = oldMessages;

          const firstUserMessage = oldMessages.find(
            (message) => message.role === "user"
          );

          imported.title = firstUserMessage
            ? makeTitle(firstUserMessage.content)
            : "Previous chat";

          setChats([imported]);
          setActiveChatId(imported.id);
          setLoaded(true);

          return;
        }
      }

      const firstChat = createChat();

      setChats([firstChat]);
      setActiveChatId(firstChat.id);
    } catch (error) {
      console.error("Failed to load chats:", error);

      const firstChat = createChat();

      setChats([firstChat]);
      setActiveChatId(firstChat.id);
    }

    setLoaded(true);
  }, []);

  // SAVE CHAT HISTORY
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));

      if (activeChatId) {
        localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId);
      }
    } catch (error) {
      console.error("Failed to save chats:", error);
    }
  }, [chats, activeChatId, loaded]);

  // SCROLL TO LATEST MESSAGE
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, thinking]);

  // NEW CHAT
  function newChat() {
    const existingEmptyChat = chats.find(
      (chat) => chat.messages.length === 0
    );

    if (existingEmptyChat) {
      setActiveChatId(existingEmptyChat.id);
      setInput("");
      setSidebar(false);
      return;
    }

    const chat = createChat();

    setChats((current) => [chat, ...current]);
    setActiveChatId(chat.id);
    setInput("");
    setSidebar(false);
  }

  // OPEN EXISTING CHAT
  function openChat(id: string) {
    setActiveChatId(id);
    setSidebar(false);
    setInput("");
  }

  // DELETE ONE CHAT
  function deleteChat(
    event: React.MouseEvent,
    id: string
  ) {
    event.stopPropagation();

    setChats((currentChats) => {
      const remaining = currentChats.filter(
        (chat) => chat.id !== id
      );

      // If every chat was deleted, create a fresh one
      if (remaining.length === 0) {
        const fresh = createChat();

        setActiveChatId(fresh.id);

        return [fresh];
      }

      // If deleting currently-open chat
      if (id === activeChatId) {
        setActiveChatId(remaining[0].id);
      }

      return remaining;
    });
  }

  // CLEAR ALL HISTORY
  function clearAllChats() {
    const fresh = createChat();

    setChats([fresh]);
    setActiveChatId(fresh.id);
    setInput("");

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_CHAT_KEY);
    localStorage.removeItem("ergonix-ai-chat");
  }

  // SEND MESSAGE
  async function send() {
    const text = input.trim();

    if (!text || thinking || !activeChat) return;

    const currentChatId = activeChat.id;

    const userMessage: Msg = {
      role: "user",
      content: text,
    };

    const updatedMessages = [
      ...activeChat.messages,
      userMessage,
    ];

    const shouldCreateTitle =
      activeChat.messages.length === 0 ||
      activeChat.title === "New chat";

    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              title: shouldCreateTitle
                ? makeTitle(text)
                : chat.title,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : chat
      )
    );

    setInput("");
    setThinking(true);

    try {
      const response = await fetch(
        "https://ergonix-ai-api.honngai-buchem.workers.dev/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            messages: updatedMessages,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "API request failed"
        );
      }

      const assistantMessage: Msg = {
        role: "assistant",
        content: data.reply,
      };

      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  assistantMessage,
                ],
                updatedAt: Date.now(),
              }
            : chat
        )
      );
    } catch (error) {
      console.error(error);

      const errorMessage: Msg = {
        role: "assistant",
        content:
          "Sorry, I couldn't connect to Ergonix AI.",
      };

      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  errorMessage,
                ],
                updatedAt: Date.now(),
              }
            : chat
        )
      );
    } finally {
      setThinking(false);
    }
  }

  // Sort recent chats by last activity
  const sortedChats = [...chats].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  return (
    <main className="app">
      <div className="ambient a1" />
      <div className="ambient a2" />

      <header className="topbar">
        <button
          className="mobileMenu"
          onClick={() => setSidebar(true)}
          aria-label="Menu"
        >
          <Menu size={19} />
        </button>

        <a
          className="brand"
          href="https://ergonix.co.in"
        >
          <span className="brand-mark">
            <span>E</span>
          </span>

          <span>
            ERGONIX <b>AI</b>
          </span>
        </a>

        <a
          className="mainSite"
          href="https://ergonix.co.in"
        >
          ergonix.co.in ↗
        </a>
      </header>

      <aside
        className={`sidebar ${
          sidebar ? "open" : ""
        }`}
      >
        <div className="sideHead">
          <span>Workspace</span>

          <button
            onClick={() => setSidebar(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button
          className="newChat"
          onClick={newChat}
        >
          <Plus size={17} />
          New chat
        </button>

        <div className="sideLabel">
          RECENT
        </div>

        <div className="chatHistory">
          {sortedChats
            .filter(
              (chat) =>
                chat.messages.length > 0
            )
            .map((chat) => (
              <button
                key={chat.id}
                className={`historyItem ${
                  chat.id === activeChatId
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  openChat(chat.id)
                }
              >
                <MessageSquare
                  size={14}
                  className="historyIcon"
                />

                <span className="historyTitle">
                  {chat.title}
                </span>

                <span
                  className="historyDelete"
                  onClick={(event) =>
                    deleteChat(
                      event,
                      chat.id
                    )
                  }
                  title="Delete chat"
                >
                  <Trash2 size={13} />
                </span>
              </button>
            ))}

          {sortedChats.filter(
            (chat) =>
              chat.messages.length > 0
          ).length === 0 && (
            <div className="emptyRecent">
              Your conversations will
              appear here.
            </div>
          )}
        </div>

        <div className="sideBottom">
          <div className="status">
            <span className="dot" />
            Local history enabled
          </div>

          <button
            className="clear"
            onClick={clearAllChats}
          >
            <Trash2 size={15} />
            Clear all chats
          </button>
        </div>
      </aside>

      {sidebar && (
        <div
          className="scrim"
          onClick={() =>
            setSidebar(false)
          }
        />
      )}

      <section className="chat">
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="aiMark">
              <Sparkles size={25} />
            </div>

            <div className="eyebrow">
              ERGONIX INTELLIGENCE
            </div>

            <h1>
              How can I help you?
            </h1>

            <p>
              Ask, build, explore, and
              create with Ergonix AI.
            </p>

            <div className="suggestions">
              {[
                "Help me write something",
                "Explain a complex topic",
                "Brainstorm an idea",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() =>
                    setInput(suggestion)
                  }
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={`message ${message.role}`}
                >
                  <div className="avatar">
                    {message.role ===
                    "assistant"
                      ? "E"
                      : "YOU"}
                  </div>

                 <div className="bubble">
  {message.role === "assistant" ? (
    <MarkdownMessage content={message.content} />
  ) : (
    message.content
  )}
</div>
                </div>
              )
            )}

            {thinking && (
              <div className="message assistant">
                <div className="avatar">
                  E
                </div>

                <div className="bubble">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}

        <div className="composerWrap">
          <div className="composer">
            <textarea
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder="Message Ergonix AI..."
              rows={1}
            />

            <button
              className="send"
              onClick={send}
              disabled={thinking}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>

          <div className="fineprint">
            Ergonix AI can make mistakes.
            Check important information.
          </div>
        </div>
      </section>
    </main>
  );
}
