'use client';

import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type MessageDetail = {
  id: string;
  sender: string;
  subject: string;
  htmlBody: string | null;
  textBody: string | null;
  attachments: { id: string; fileName: string; url: string; size: number }[];
};

export default function MessagePage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState<MessageDetail | null>(null);

  useEffect(() => {
    fetch(`/api/message/${params.id}`).then((r) => r.json()).then(setMessage);
  }, [params.id]);

  if (!message) return <main className="p-8">Loading...</main>;

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-4 p-8">
      <Link href="/" className="text-slate-300">← Home</Link>
      <section className="card p-6">
        <h1 className="text-2xl font-bold">{message.subject}</h1>
        <p className="text-slate-400">{message.sender}</p>
      </section>
      <section className="card p-6">
        <h2 className="mb-2 text-lg font-semibold">HTML</h2>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.htmlBody ?? '<i>No HTML body</i>') }} />
      </section>
      <section className="card p-6">
        <h2 className="mb-2 text-lg font-semibold">Plain Text</h2>
        <pre className="whitespace-pre-wrap text-sm text-slate-300">{message.textBody ?? 'No plaintext body'}</pre>
      </section>
      <section className="card p-6">
        <h2 className="mb-2 text-lg font-semibold">Attachments</h2>
        <ul>{message.attachments.map((a) => <li key={a.id}><a href={a.url} className="text-cyan-300">{a.fileName}</a> ({Math.round(a.size / 1024)} KB)</li>)}</ul>
      </section>
    </main>
  );
}
