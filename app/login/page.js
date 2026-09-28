"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function ensureProfile(user) {
    const handle = (user.email || "user").split("@")[0].slice(0, 18);
    await supabase.from("hearth_profiles").upsert({
      id: user.id,
      handle: handle + user.id.slice(0, 3),
      display_name: handle,
    });
  }

  async function signUp(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setErr(error.message);
    if (data.user) await ensureProfile(data.user);
    setMsg("Account ready. If email confirm is on, check your inbox, then come back and enter.");
  }

  async function signIn(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErr(error.message);
    if (data.user) await ensureProfile(data.user);
    window.location.href = "/desk";
  }

  return (
    <main>
      <section className="hero">
        <h1>Come in.</h1>
        <p>Email and a password. That is the whole gate.</p>
      </section>
      <form className="form" onSubmit={signIn}>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <button type="submit">Enter</button>
        <button type="button" className="ghost" onClick={signUp}>Make a desk</button>
        {err && <div className="err">{err}</div>}
        {msg && <div className="ok">{msg}</div>}
      </form>
    </main>
  );
}
