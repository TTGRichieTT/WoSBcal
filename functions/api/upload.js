export async function onRequestPost(context) {
  const form = await context.request.formData();
  const file = form.get("file");
  if (!file) {
    return Response.json({ ok: false, error: "no file" }, { status: 400 });
  }

  const buf = new Uint8Array(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
  const key = `uploads/${Date.now()}-${safe}`;

  await context.env.WOSB_BUCKET.put(key, buf, {
    httpMetadata: { contentType: file.type }
  });

  const url = `${context.env.R2_ENDPOINT}/${context.env.R2_BUCKET}/${key}`;
  return Response.json({ ok: true, url });
}