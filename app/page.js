"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [hours, setHours] = useState([]);

  useEffect(() => {
    supabase
      .from("hearth_notes")
      .select("id, body, created_at, user_id, hearth_profiles(handle, display_name)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(40)
      .then(({ data }) => setNotes(data || []));

    supabase
      .from("hearth_hours")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setHours(data || []));
  }, []);

  return (
    <main>
      <section className="hero">
        <h1>What people leave<br />on the table.</h1>
        <p>
          Sign in, write a slip, keep it private or set it on the field.
          The house itself writes a new hour, every hour.
        </p>
      </section>

      <div className="grid">
        {notes.map((n, i) => (
          <article className="card" key={n.id} style={{ animationDelay: `${i * 40}ms` }}>
            <div className="meta">
              {(n.hearth_profiles && (n.hearth_profiles.display_name || n.hearth_profiles.handle)) || "someone"}
              {" · "}
              {new Date(n.created_at).toLocaleString()}
            </div>
            <p>{n.body}</p>
          </article>
        ))}
      </div>

      {!notes.length && (
        <p style={{ color: "var(--mute)", marginTop: 12 }}>
          The field is empty. Be the first to leave something public.
        </p>
      )}

      <section className="hours">
        <h2>Hours kept by the house</h2>
        {hours.map((h) => (
          <div className="hour" key={h.id}>
            <time>{new Date(h.created_at).toLocaleString()}</time>
            <strong>{h.title}</strong>
            <p style={{ color: "var(--mute)", marginTop: 6 }}>{h.body}</p>
          </div>
        ))}
        {!hours.length && (
          <p style={{ color: "var(--mute)" }}>The first hour has not yet been written.</p>
        )}
      </section>
    </main>
  );
}
