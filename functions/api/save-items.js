export async function onRequestPost(context) {
  const body = await context.request.json();
  await context.env.WOSB_ITEMS.put("data", JSON.stringify(body));
  return Response.json({ ok: true });
}