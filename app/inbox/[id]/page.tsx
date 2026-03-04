'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Message = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  receivedAt: string;
  hasRead: boolean;
  attachments: { id: string }[];
};

export default function InboxPage() {
  const params = useParams<{ id: string }>();
export default function InboxPage({ params }: { params: { id: string } }) {
  const address = decodeURIComponent(params.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [unread, setUnread] = useState(false);
  const [withAttachments, setWithAttachments] = useState(false);
  const [sender, setSender] = useState('');

  const query = useMemo(() => {
    const p = new URLSearchParams({ address, search, unread: String(unread), withAttachments: String(withAttachments), sender });
    return p.toString();
  }, [address, search, unread, withAttachments, sender]);

  const load = async () => {
    const data = await fetch(`/api/inbox?${query}`, { cache: 'no-store' }).then((r) => r.json());
    setLoading(true);
    const data = await fetch(`/api/inbox?${query}`).then((r) => r.json());
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [query]);

  useEffect(() => {
    const src = new EventSource(`/api/inbox/stream?address=${encodeURIComponent(address)}`);
    src.onmessage = () => void load();
  useEffect(() => { load(); }, [query]);
  useEffect(() => {
    const src = new EventSource(`/api/inbox/stream?address=${encodeURIComponent(address)}`);
    src.onmessage = () => load();
    return () => src.close();
  }, [address, query]);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <Link href="/" className="text-slate-300">← Back</Link>
        <h1 className="text-3xl font-bold">Inbox: {address}</h1>
        <div className="card grid gap-3 p-4 md:grid-cols-4">
          <input className="rounded bg-slate-900 p-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <input className="rounded bg-slate-900 p-2" placeholder="From sender" value={sender} onChange={(e) => setSender(e.target.value)} />
          <label><input type="checkbox" checked={unread} onChange={(e) => setUnread(e.target.checked)} /> Unread</label>
          <label><input type="checkbox" checked={withAttachments} onChange={(e) => setWithAttachments(e.target.checked)} /> Attachments</label>
        </div>
        <button
          className="rounded bg-cyan-500/30 px-4 py-2"
          onClick={() =>
            fetch('/api/dev/mock-message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address })
            }).then(() => void load())
          }
        >
          Generate mock email
        </button>
        <button className="rounded bg-cyan-500/30 px-4 py-2" onClick={() => fetch('/api/dev/mock-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address }) }).then(load)}>Generate mock email</button>
        {loading ? <div className="card p-6">Loading skeleton...</div> : messages.length === 0 ? <div className="card p-6">No emails yet. Your sky is clear ✨</div> : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="card p-4">
                <Link href={`/message/${m.id}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{m.subject} {!m.hasRead && <span className="rounded bg-pink-500/30 px-2 text-xs">Unread</span>}</p>
                    <p className="text-xs text-slate-400">{new Date(m.receivedAt).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-slate-300">{m.sender}</p>
                  <p className="text-sm text-slate-400">{m.preview}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
