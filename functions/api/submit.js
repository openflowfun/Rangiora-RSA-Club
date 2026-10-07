// Cloudflare Pages Function: POST /api/submit
// Receives the website forms and emails them to the club via Resend.
//
// Environment variables (Cloudflare Pages > Settings > Variables and Secrets):
//   RESEND_API_KEY      (secret)  API key from resend.com
//   MAIL_FROM           e.g. "Rangiora RSA Website <website@rangiorarsa.nz>"  (domain verified in Resend)
//   TURNSTILE_SECRET    (optional secret) enables Cloudflare Turnstile spam check
//
// Where each form goes is set below.
const ROUTES = {
  membership: { to: "rangiorarsa@gmail.com", subject: "Membership application - rangiorarsa.nz" },
  contact:    { to: "rangiorarsa@gmail.com", subject: "Contact form - rangiorarsa.nz" },
  functions:  { to: "rgarsafunctions@gmail.com", subject: "Function enquiry - rangiorarsa.nz" },
  newsletter: { to: "rangiorarsa@gmail.com", subject: "Newsletter signup - rangiorarsa.nz" },
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: "Bad request" }, 400);
  }

  // Honeypot: bots fill this in, people never see it. Pretend success.
  if (data.get("_gotcha")) return json({ ok: true });

  const route = ROUTES[data.get("_form")];
  if (!route) return json({ ok: false, error: "Unknown form" }, 400);

  if (env.TURNSTILE_SECRET) {
    const body = new FormData();
    body.append("secret", env.TURNSTILE_SECRET);
    body.append("response", data.get("cf-turnstile-response") || "");
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const out = await r.json().catch(() => ({}));
    if (!out.success) return json({ ok: false, error: "Spam check failed. Please try again." }, 400);
  }

  // Collect fields (repeated names such as checkboxes are joined with commas).
  const fields = {};
  for (const [k, v] of data.entries()) {
    if (k.startsWith("_") || k === "cf-turnstile-response" || typeof v !== "string") continue;
    const val = v.trim().slice(0, 5000);
    if (!val) continue;
    fields[k] = fields[k] ? fields[k] + ", " + val : val;
  }
  if (!Object.keys(fields).length) return json({ ok: false, error: "Empty form" }, 400);

  const label = (k) => k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">${esc(label(k))}</td><td style="padding:6px 12px;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  const text = Object.entries(fields).map(([k, v]) => `${label(k)}: ${v}`).join("\n");

  const payload = {
    from: env.MAIL_FROM,
    to: [route.to],
    subject: route.subject,
    html: `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>`,
    text,
  };
  if (fields.email) payload.reply_to = fields.email;

  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return json({ ok: false, error: "Email is not configured yet." }, 500);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return json({ ok: false, error: "Could not send. Please call the club instead." }, 502);
  return json({ ok: true });
}
