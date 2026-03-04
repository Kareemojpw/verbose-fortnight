'use client';

import { Copy, RefreshCw, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const FAVORITES_KEY = 'aurora-favorite-domains';
const ADDRESS_KEY = 'aurora-address';

export default function HomePage() {
  const [domains, setDomains] = useState<string[]>([]);
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    Promise.all([fetch('/api/domains').then((r) => r.json()), Promise.resolve(localStorage.getItem(FAVORITES_KEY)), Promise.resolve(localStorage.getItem(ADDRESS_KEY))]).then(([domainList, favRaw, savedAddress]) => {
      setDomains(domainList);
      setDomain(domainList[0]);
      if (favRaw) setFavorites(JSON.parse(favRaw));
      if (savedAddress) setAddress(savedAddress);
    });
  }, []);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const generate = async () => {
    const next = await fetch('/api/address', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain }) }).then((r) => r.json());
    setAddress(next.email);
    localStorage.setItem(ADDRESS_KEY, next.email);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    alert('Copied address');
  };

  const toggleFavorite = () => {
    const next = favoriteSet.has(domain) ? favorites.filter((d) => d !== domain) : [...favorites, domain];
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">AuroraMail</h1>
        <p className="text-slate-300">Disposable inboxes with realtime updates.</p>
        <section className="card animate-float space-y-4 p-6">
          <div className="flex items-center gap-3">
            <select value={domain} onChange={(e) => setDomain(e.target.value)} className="rounded-xl bg-slate-900 p-3">
              {domains.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <button className="rounded-xl bg-amber-400/20 p-3" onClick={toggleFavorite}><Star size={18} /></button>
            <button className="rounded-xl bg-blue-500/30 p-3" onClick={generate}><RefreshCw size={18} /></button>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-xl">{address || 'Click regenerate to create an address'}</div>
          <div className="flex gap-3">
            <button onClick={copy} disabled={!address} className="rounded-xl bg-emerald-500/30 px-4 py-2 disabled:opacity-50"><Copy className="inline" size={16} /> Copy</button>
            <button onClick={() => router.push(`/inbox/${encodeURIComponent(address)}`)} disabled={!address} className="rounded-xl bg-violet-500/30 px-4 py-2 disabled:opacity-50">Open Inbox</button>
          </div>
        </section>
      </div>
    </main>
  );
}
