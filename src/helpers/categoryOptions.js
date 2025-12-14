// server-side helper
const defaultOptionsByCategory = {
  Bangles: [
    {
      name: "Size",
      values: ["2-0", "2-2", "2-4", "2-6", "2-8", "2-10", "2-12", "2-14"],
    },
    {
      name: "Color",
      values: [
        "Gold",
        "Rose Gold",
        "Silver",
        "Antique Gold",
        "Antique Matte",
        "Copper",
        "Bronze",
        "Black",
        "Red",
        "Maroon",
        "Pink",
        "Blue",
        "Royal Blue",
        "Green",
        "Purple",
        "Multi",
        "Pearl White",
      ],
    },
  ],
  Bracelets: [
    { name: "Size", values: ["S", "M", "L"] },
    { name: "Color", values: ["Gold", "Silver", "Black"] },
    { name: "Material", values: ["Alloy", "Silver", "Gold Plated"] },
  ],
  Necklaces: [
    { name: "Length", values: ["14", "16", "18", "20", "24"] },
    { name: "Metal", values: ["Gold", "Silver", "Plated", "Kundan"] },
    { name: "Chain Type", values: ["Cable", "Rope", "Box", "Figaro"] },
  ],
  Rings: [
    { name: "Size", values: ["6", "7", "8", "9", "10"] },
    { name: "Metal", values: ["Gold", "Silver", "Platinum"] },
    { name: "Finish", values: ["Polished", "Matte"] },
  ],
  Earrings: [
    { name: "Type", values: ["Stud", "Hoop", "Drop"] },
    { name: "Metal", values: ["Gold", "Silver"] },
  ],
  Other: [],
};

export function getDefaultOptionsForCategory(category) {
  return (
    defaultOptionsByCategory[category] || defaultOptionsByCategory["Other"]
  );
}
