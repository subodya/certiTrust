"use client";

import { useEffect, useState } from "react";
import { adminGet, adminSend } from "@/lib/admin-api";

type SettingItem = { key: string; value: unknown };

export default function SettingsPage() {
  const [items, setItems] = useState<SettingItem[]>([]);
  const [keyName, setKeyName] = useState("");
  const [jsonValue, setJsonValue] = useState("{}");

  const load = async () => {
    const resp = await adminGet("/api/admin/settings");
    const data = await resp.json();
    setItems(data.items ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>
      <p className="mb-5 text-sm text-slate-600">Store global links and reusable dashboard defaults.</p>
      <form
        className="mb-5 space-y-3 rounded-2xl border border-[var(--border-soft)] bg-white p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          let parsed: unknown = jsonValue;
          try {
            parsed = JSON.parse(jsonValue);
          } catch {
            parsed = jsonValue;
          }
          await adminSend("/api/admin/settings", "PUT", { key: keyName, value: parsed });
          setKeyName("");
          setJsonValue("{}");
          await load();
        }}
      >
        <input className="h-11 w-full rounded-lg border border-[var(--border-soft)] px-3" placeholder="Setting key (e.g. institution_default_url)" value={keyName} onChange={(e) => setKeyName(e.target.value)} required />
        <textarea className="min-h-28 w-full rounded-lg border border-[var(--border-soft)] p-3 font-mono text-sm" value={jsonValue} onChange={(e) => setJsonValue(e.target.value)} />
        <button className="h-11 rounded-lg bg-[var(--blue-primary)] px-4 text-white" type="submit">Save Setting</button>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key} className="rounded-xl border border-[var(--border-soft)] bg-white p-3 text-sm">
            <div className="font-medium">{item.key}</div>
            <pre className="mt-1 overflow-auto text-xs text-slate-600">{JSON.stringify(item.value, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </main>
  );
}
