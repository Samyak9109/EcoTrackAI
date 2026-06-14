import { useState, type FormEvent } from "react";
import { ActionCard } from "../components/ActionCard";
import type { PageId } from "../components/Layout/Layout";
import { ProfileRequiredState } from "../components/ProfileRequiredState";
import { formatEnumLabel } from "../data/domainMetadata";
import type { AssistantReply, CarbonResult, UserProfile } from "../types";
import { generateAssistantReply } from "../utils/assistantEngine";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  reply?: AssistantReply;
};

const PROMPTS = [
  "How can I reduce my footprint?",
  "Give me a 7 day plan",
  "Why is my score low?",
  "What if I use the bus?",
];

export function Assistant({
  profile,
  result,
  onNavigate,
}: {
  profile: UserProfile | null;
  result: CarbonResult | null;
  onNavigate: (page: PageId) => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: profile && result
        ? `I have your profile. Your current biggest category is ${result.highestCategory}. Ask me for advice, a score explanation, or a seven-day plan.`
        : "Create your lifestyle profile first, then I can give advice based on your habits.",
    },
  ]);

  if (!profile || !result) {
    return (
      <ProfileRequiredState
        marker="AI"
        title="Your assistant needs some context"
        description="Create a lifestyle profile so every answer can use your actual habits."
        onNavigate={onNavigate}
      />
    );
  }

  function send(text: string) {
    const clean = text.trim();
    if (!clean || !profile || !result) return;
    const reply = generateAssistantReply(clean, profile, result);
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: clean },
      { id: Date.now() + 1, role: "assistant", text: reply.message, reply },
    ]);
    setInput("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <section className="page-width page-section">
      <div className="page-heading assistant-heading">
        <div><span className="section-kicker">CONTEXT-AWARE GUIDANCE</span><h1>Ask EcoTrack</h1><p>Short, practical answers based on your current profile.</p></div>
        <div className="assistant-status"><span /><strong>Ready</strong><small>Runs locally, no AI API</small></div>
      </div>

      <div className="assistant-layout">
        <aside className="assistant-sidebar">
          <h2>Try asking</h2>
          {PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => send(prompt)} type="button">{prompt}<span aria-hidden="true">→</span></button>
          ))}
          <div className="profile-context">
            <span className="section-kicker">USING YOUR PROFILE</span>
            <p><strong>{profile.commuteKmPerDay} km</strong> daily commute</p>
            <p><strong>{profile.electricityUnitsPerMonth}</strong> electricity units</p>
            <p><strong>{formatEnumLabel(profile.dietType)}</strong> diet</p>
          </div>
        </aside>

        <div className="chat-panel">
          <div className="messages" aria-live="polite" aria-label="Assistant conversation">
            {messages.map((message) => (
              <article
                className={message.role === "user" ? "message message-user" : "message"}
                key={message.id}
              >
                <span className="message-avatar" aria-hidden="true">{message.role === "assistant" ? "E" : "Y"}</span>
                <div>
                  <small>{message.role === "assistant" ? "ECOTRACK ASSISTANT" : "YOU"}</small>
                  <p>{message.text}</p>
                  {message.reply && message.reply.suggestedActions.length > 0 && (
                    <div className="chat-actions">
                      {message.reply.suggestedActions.slice(0, 3).map((action) => (
                        <ActionCard action={action} compact key={action.id} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          <form className="chat-input" onSubmit={submit}>
            <label className="sr-only" htmlFor="assistant-message">Ask EcoTrack a question</label>
            <input
              id="assistant-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about transport, energy, food, your score..."
            />
            <button className="primary-button" type="submit">Send <span aria-hidden="true">→</span></button>
          </form>
        </div>
      </div>
    </section>
  );
}
