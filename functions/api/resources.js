export async function onRequest(context) {
  const raw = await context.env.WOSB_RESOURCES.get("data");
  const data = raw
    ? JSON.parse(raw)
    : [
        {
          id: "wood",
          name: "Timber",
          description: "Sturdy shipbuilding timber.",
          showInCalculator: true,
          usableInRecipes: true
        },
        {
          id: "iron",
          name: "Iron",
          description: "Forged into cannon and plating.",
          showInCalculator: true,
          usableInRecipes: true
        },
        {
          id: "canvas",
          name: "Canvas",
          description: "For sails & coverings.",
          showInCalculator: true,
          usableInRecipes: true
        },
        {
          id: "powder",
          name: "Gunpowder",
          description: "Ammo for cannons.",
          showInCalculator: true,
          usableInRecipes: true
        }
      ];
  return Response.json(data);
}