export async function onRequest(context) {
  const raw = await context.env.WOSB_ITEMS.get("data");
  const data = raw
    ? JSON.parse(raw)
    : [
        {
          id: "deck_cannon_mk1",
          name: "Deck Cannon Mk I",
          category: "Cannon",
          description: "Basic deck-mounted cannon.",
          thumbnail: "",
          buildTimeMinutes: 60,
          showInCalculator: true,
          resources: { wood: 800, iron: 120, powder: 30 }
        },
        {
          id: "reinforced_hull",
          name: "Reinforced Hull Plating",
          category: "Hull Upgrade",
          description: "Extra protection for the hull.",
          thumbnail: "",
          buildTimeMinutes: 180,
          showInCalculator: true,
          resources: { wood: 2500, iron: 600, canvas: 40 }
        }
      ];
  return Response.json(data);
}