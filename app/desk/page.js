"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Desk() {
  const [user, setUser] = useState(null);
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [mine, setMine] = useState([]);
  const [err, setErr] = useState("");

  async function load(uid) {
    const { data } = await supabase.from("hearth_notes").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    setMine(data || []);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      load(data.user.id);
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.from("hearth_notes").insert({ user_id: user.id, body: body.trim(), is_public: isPublic });
    if (error) return setErr(error.message);
    setBody("");
    load(user.id);
  }

  async function toggle(note) {
    await supabase.from("hearth_notes").update({ is_public: !note.is_public }).eq("id", note.id);
    load(user.id);
  }

  async function remove(id) {
    await supabase.from("hearth_notes").delete().eq("id", id);
    load(user.id);
  }

  async function leave() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!user) return <p style={{ color: "var(--mute)", paddingTop: 40 }}>Checking the latch...</p>;

  return (
    <main>
      <section className="hero">
        <h1>Your desk.</h1>
        <p>Write a slip. Keep it in the drawer, or set it on the field for anyone to read.</p>
      </section>
      <form className="form" onSubmit={save}>
        <textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Something you noticed." required maxLength={2000} />
        <label className="check">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Mark public — it will appear on the field
        </label>
        <button type="submit">Keep this slip</button>
        {err && <div className="err">{err}</div>}
      </form>
      <section className="hours">
        <h2>Drawer</h2>
        {mine.map((n) => (
          <div className="hour" key={n.id}>
            <time>{new Date(n.created_at).toLocaleString()} · {n.is_public ? "on the field" : "private"}</time>
            <p>{n.body}</p>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button type="button" className="ghost" onClick={() => toggle(n)}>{n.is_public ? "Make private" : "Make public"}</button>
              <button type="button" className="ghost" onClick={() => remove(n.id)}>Throw away</button>
            </div>
          </div>
        ))}
        {!mine.length && <p style={{ color: "var(--mute)" }}>Nothing in the drawer yet.</p>}
      </section>
      <p style={{ marginTop: 28 }}><button className="ghost" onClick={leave}>Leave</button></p>
    </main>
  );
}
