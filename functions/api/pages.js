export async function onRequest(context) {
  const raw = await context.env.WOSB_PAGES.get("data");
  const data = raw
    ? JSON.parse(raw)
    : [
        {
          slug: "home",
          title: "Harbour",
          description: "Overview of your dockyard."
        },
        {
          slug: "weapons",
          title: "Cannons & Arms",
          description: "Weapon crafting database."
        },
        {
          slug: "upgrades",
          title: "Hull Upgrades",
          description: "Ship defensive upgrades."
        }
      ];
  return Response.json(data);
}