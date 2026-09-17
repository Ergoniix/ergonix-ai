"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, Plus, Send, Sparkles, Trash2, X } from "lucide-react";

type Msg = { role: "user"|"assistant"; content: string };

export default function Home() {
  const [messages,setMessages] = useState<Msg[]>([]);
  const [input,setInput] = useState("");
  const [sidebar,setSidebar] = useState(false);
  const [loaded,setLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    try {
      const saved=localStorage.getItem("ergonix-ai-chat");
      if(saved) setMessages(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  },[]);
  useEffect(()=>{
    if(loaded) localStorage.setItem("ergonix-ai-chat",JSON.stringify(messages));
    endRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages,loaded]);

  function newChat(){ setMessages([]); setSidebar(false); }
async function send() {
  const text = input.trim();
  if (!text) return;

  const userMessage: Msg = {
    role: "user",
    content: text,
  };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setInput("");

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
      throw new Error(data.error || "API request failed");
    }

    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: data.reply,
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: "Sorry, I couldn't connect to Ergonix AI.",
      },
    ]);
  }
}

  return <main className="app">
    <div className="ambient a1"/><div className="ambient a2"/>
    <header className="topbar">
      <button className="mobileMenu" onClick={()=>setSidebar(true)} aria-label="Menu"><Menu size={19}/></button>
      <a className="brand" href="https://ergonix.co.in"><span className="brand-mark"><span>E</span></span><span>ERGONIX <b>AI</b></span></a>
      <a className="mainSite" href="https://ergonix.co.in">ergonix.co.in ↗</a>
    </header>

    <aside className={`sidebar ${sidebar?"open":""}`}>
      <div className="sideHead"><span>Workspace</span><button onClick={()=>setSidebar(false)}><X size={18}/></button></div>
      <button className="newChat" onClick={newChat}><Plus size={17}/> New chat</button>
      <div className="sideLabel">RECENT</div>
      <div className="emptyRecent">Chats are stored on this device.</div>
      <div className="sideBottom">
        <div className="status"><span className="dot"/> Local history enabled</div>
        <button className="clear" onClick={()=>{setMessages([]);localStorage.removeItem("ergonix-ai-chat")}}><Trash2 size={15}/> Clear chat</button>
      </div>
    </aside>
    {sidebar && <div className="scrim" onClick={()=>setSidebar(false)}/>}

    <section className="chat">
      {messages.length===0 ? <div className="welcome">
        <div className="aiMark"><Sparkles size={25}/></div>
        <div className="eyebrow">ERGONIX INTELLIGENCE</div>
        <h1>How can I help you?</h1>
        <p>Ask, build, explore, and create with Ergonix AI.</p>
        <div className="suggestions">
          {["Help me write something","Explain a complex topic","Brainstorm an idea"].map(x=><button key={x} onClick={()=>setInput(x)}>{x}</button>)}
        </div>
      </div> :
      <div className="messages">{messages.map((m,i)=><div key={i} className={`message ${m.role}`}>
        <div className="avatar">{m.role==="assistant"?"E":"YOU"}</div><div className="bubble">{m.content}</div>
      </div>)}<div ref={endRef}/></div>}

      <div className="composerWrap">
        <div className="composer">
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Message Ergonix AI..." rows={1}/>
          <button className="send" onClick={send} aria-label="Send"><Send size={18}/></button>
        </div>
        <div className="fineprint">Ergonix AI can make mistakes. Check important information.</div>
      </div>
    </section>
  </main>
}
