export async function onRequest(context) {
  const raw = await context.env.WOSB_SETTINGS.get("data");
  const data = raw
    ? JSON.parse(raw)
    : {
        banner: "⚓ Welcome back, Captain. Winds are favourable today.",
        title: "World of Sea Battle",
        header: "Shipwright's Dock"
      };
  return Response.json(data);
}