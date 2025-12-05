export async function onRequestPost(context) {
  const body = await context.request.json();
  await context.env.WOSB_SETTINGS.put("data", JSON.stringify(body));
  return Response.json({ ok: true });
}