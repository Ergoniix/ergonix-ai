"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Code2,
  Cpu,
  FileText,
  Headphones,
  Layers3,
  Mail,
  MessageSquare,
  Users,
  X,
} from "lucide-react";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const services = [
  { icon: Code2, title: "Web Experiences", text: "High-performance websites with rich motion, polished interfaces and responsive engineering." },
  { icon: Layers3, title: "Digital Systems", text: "Dashboards, internal tools and connected software designed around real operational workflows." },
  { icon: Cpu, title: "AI & Automation", text: "Practical AI integrations and automation that reduce repetitive work and make products feel smarter." },
];

const contactOptions = [
  {
    icon: Briefcase,
    title: "Project inquiry",
    text: "Discuss a new website, software or idea",
    subject: "Project inquiry — Ergonix",
    body: "Hi Ergonix,\n\nI’d like to discuss a new project.\n\nProject / idea:\nTimeline:\nBudget range:\n\nThanks!",
  },
  {
    icon: Users,
    title: "Partnership",
    text: "Explore collaboration opportunities",
    subject: "Partnership inquiry — Ergonix",
    body: "Hi Ergonix,\n\nI’d like to explore a potential partnership or collaboration.\n\nA few details:\n",
  },
  {
    icon: MessageSquare,
    title: "General inquiry",
    text: "Ask a question or say hello",
    subject: "General inquiry — Ergonix",
    body: "Hi Ergonix,\n\n",
  },
  {
    icon: Headphones,
    title: "Support",
    text: "Get help with an existing project",
    subject: "Project support — Ergonix",
    body: "Hi Ergonix,\n\nI need help with an existing project.\n\nProject:\nIssue / request:\n",
  },
  {
    icon: FileText,
    title: "Careers",
    text: "Join our team",
    subject: "Careers — Ergonix",
    body: "Hi Ergonix,\n\nI’m interested in career opportunities with Ergonix.\n\nRole / area of interest:\nPortfolio / LinkedIn:\n",
  },
];

const CONTACTS = [
  { name: "Honngai Buchem", email: "honngai.buchem@ergonix.co.in" },
  { name: "Chingmei Menhahu", email: "chingmei.menhahu@ergonix.co.in" },
];

const CONTACT_EMAILS = CONTACTS.map((contact) => contact.email).join(",");

function mailto(subject: string, body: string) {
  return `mailto:${CONTACT_EMAILS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!contactOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [contactOpen]);

  return <main className="site-shell">
    <div className="noise" />
    <nav className="navbar">
      <a className="brand" href="#top"><span className="brand-mark"><span>E</span></span> ERGONIX</a>
      <div className="nav-links"><a className="nav-link" href="#services">Services</a><a className="nav-link" href="#approach">Approach</a><a className="nav-link" href="#contact">Contact</a></div>
      <a className="nav-cta" href="#contact">Start a project ↗</a>
    </nav>

    <section className="hero" id="top">
      <div className="hero-glow" style={{left:"-260px", top:"12%"}} />
      <div className="hero-copy animate-slide-up">
        <span className="eyebrow"><span className="eyebrow-dot" /> Digital engineering studio</span>
        <h1>Ideas built into <span className="gradient-text">reality.</span></h1>
        <p>We create modern websites, software systems and intelligent digital experiences that look sharp, run fast and feel deliberately engineered.</p>
        <div className="hero-actions">
          <a className="primary-btn btn-neon" href="#contact">Build with us <ArrowUpRight size={16}/></a>
          <a className="secondary-btn" href="#services">Explore capabilities</a>
        </div>
      </div>
      <div className="hero-visual animate-fade-in">
        <div className="hero-canvas"><Scene3D /></div>
        <div className="hero-card card-3d">
          <div className="hero-card-top"><span>System status</span><span>Live</span></div>
          <div className="metric"><strong>99.9%</strong><span>optimized delivery</span></div>
        </div>
      </div>
      <div className="ticker"><div className="ticker-track"><span>Web engineering</span><span>3D experiences</span><span>AI integration</span><span>software systems</span><span>product design</span><span>Web engineering</span><span>3D experiences</span><span>AI integration</span><span>software systems</span><span>product design</span></div></div>
    </section>

    <section className="section" id="services">
      <div className="section-head">
        <div><div className="section-kicker">Capabilities / 01</div><h2>Built for the modern web.</h2></div>
        <p className="section-note">From the first screen to the backend logic, every layer is designed to work together—not just look good in a mockup.</p>
      </div>
      <div className="services">
        {services.map((item, i) => <article className="service product-card" key={item.title}><item.icon size={22} strokeWidth={1.4}/><div className="service-index">0{i+1}</div><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div>
    </section>

    <section className="section" id="approach">
      <div className="section-head"><div><div className="section-kicker">Approach / 02</div><h2>Less noise. More working product.</h2></div><p className="section-note">Clear structure, responsive behavior, practical technology choices and details that make the final result feel premium.</p></div>
      <div className="cta-panel glow-ring" id="contact">
        <div><div className="section-kicker">Have something in mind?</div><h3>Let’s turn the idea into something people can actually use.</h3></div>
        <button className="primary-btn conversation-btn" type="button" onClick={() => setContactOpen(true)}>Start a conversation <ArrowUpRight size={16}/></button>
      </div>
    </section>

    <footer className="footer"><span>© 2026 ERGONIX</span><span>Designed & engineered for the web.</span></footer>

    {contactOpen && (
      <div className="contact-modal-backdrop" role="presentation" onMouseDown={() => setContactOpen(false)}>
        <section
          className="contact-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button className="contact-modal-close" type="button" onClick={() => setContactOpen(false)} aria-label="Close contact dialog">
            <X size={25} strokeWidth={1.5}/>
          </button>

          <div className="contact-modal-kicker">Start a conversation</div>
          <h2 id="contact-modal-title">How can we <span>help?</span></h2>
          <p className="contact-modal-intro">Choose a topic and we’ll open your email app with the details pre-filled.</p>

          <div className="contact-options">
            {contactOptions.map((option) => (
              <a className="contact-option" href={mailto(option.subject, option.body)} key={option.title}>
                <span className="contact-option-icon"><option.icon size={23} strokeWidth={1.6}/></span>
                <span className="contact-option-copy"><strong>{option.title}</strong><small>{option.text}</small></span>
                <ArrowRight className="contact-option-arrow" size={24} strokeWidth={1.5}/>
              </a>
            ))}
          </div>

          <div className="contact-modal-footer">
            <div className="contact-email-group">
              <span className="contact-email-icon"><Mail size={22} strokeWidth={1.5}/></span>
              <div className="contact-email-list">
                {CONTACTS.map((contact) => (
                  <a className="contact-email" href={`mailto:${contact.email}`} key={contact.email}>
                    <strong>{contact.name}</strong>
                    <small>{contact.email}</small>
                  </a>
                ))}
              </div>
            </div>
            <p>All inquiries go to both of us.<br/>We usually respond within 1–2 business days.</p>
          </div>
        </section>
      </div>
    )}
  </main>;
}
