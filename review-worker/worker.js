/**
 * Review comments API for the site's review mode (src/components/review).
 * All comments are kept as one JSON array in Workers KV under the key "comments".
 *
 *   GET    /comments       → the array
 *   POST   /comments       → add one (body: the comment fields), returns it with id/createdAt/status
 *   PATCH  /comments/:id   → { status: "open" | "resolved" }
 *   DELETE /comments/:id
 *
 * Every request needs `Authorization: Bearer <REVIEW_KEY>` (the key in the client's review link).
 */
const KEY = "comments";
const FIELDS = ["author", "text", "locale", "page", "url", "selector", "tag", "snippet", "quote", "src", "viewport"];

export default {
  async fetch(request, env) {
    const cors = {
      "access-control-allow-origin": env.ALLOWED_ORIGIN || "*",
      "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-max-age": "86400",
    };
    const json = (data, status = 200) =>
      new Response(JSON.stringify(data, null, 2), {
        status,
        headers: { ...cors, "content-type": "application/json; charset=utf-8" },
      });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.headers.get("authorization") !== `Bearer ${env.REVIEW_KEY}`) {
      return json({ error: "unauthorized" }, 401);
    }

    const [, resource, id] = new URL(request.url).pathname.split("/");
    if (resource !== "comments") return json({ error: "not found" }, 404);

    const comments = (await env.REVIEW.get(KEY, "json")) ?? [];
    const save = () => env.REVIEW.put(KEY, JSON.stringify(comments));

    if (!id && request.method === "GET") return json(comments);

    if (!id && request.method === "POST") {
      const body = await request.json().catch(() => null);
      if (!body || typeof body.text !== "string" || !body.text.trim()) {
        return json({ error: "text is required" }, 400);
      }
      const comment = { id: crypto.randomUUID().slice(0, 8), createdAt: new Date().toISOString(), status: "open" };
      for (const field of FIELDS) if (body[field] !== undefined) comment[field] = body[field];
      comment.text = comment.text.slice(0, 5000);
      comments.push(comment);
      await save();
      return json(comment, 201);
    }

    const index = comments.findIndex((c) => c.id === id);
    if (index === -1) return json({ error: "not found" }, 404);

    if (request.method === "PATCH") {
      const { status } = await request.json().catch(() => ({}));
      if (status !== "open" && status !== "resolved") return json({ error: "bad status" }, 400);
      comments[index].status = status;
      await save();
      return json(comments[index]);
    }

    if (request.method === "DELETE") {
      comments.splice(index, 1);
      await save();
      return json({ ok: true });
    }

    return json({ error: "method not allowed" }, 405);
  },
};
