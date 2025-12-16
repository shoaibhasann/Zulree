// server-side helper (Artificial Jewellery Only)

const defaultOptionsByCategory = {
  Bangles: [
    {
      name: "Size",
      values: ["2-0", "2-2", "2-4", "2-6", "2-8", "2-10", "2-12", "2-14"],
    },
    {
      name: "Color / Finish",
      values: [
        "Gold",
        "Rose Gold",
        "Silver",
        "Antique Gold",
        "Antique Matte",
        "Black",
        "Copper",
        "Bronze",
        "Multi",
      ],
    },
  ],

  Bracelets: [
    { name: "Size", values: ["S", "M", "L"] },
    {
      name: "Finish",
      values: ["Gold", "Silver", "Black", "Rose Gold"],
    },
    {
      name: "Material",
      values: ["Alloy", "Brass", "Metal"],
    },
  ],

  Necklaces: [
    { name: "Length (inches)", values: ["14", "16", "18", "20", "24"] },
    {
      name: "Finish",
      values: ["Gold", "Silver", "Antique", "Oxidized"],
    },
    {
      name: "Style",
      values: ["Kundan", "Pearl", "Stone", "Plain"],
    },
  ],

  Rings: [
    { name: "Size", values: ["6", "7", "8", "9", "10"] },
    {
      name: "Finish",
      values: ["Gold", "Silver", "Black"],
    },
    {
      name: "Adjustable",
      values: ["Yes", "No"],
    },
  ],

  Earrings: [
    {
      name: "Type",
      values: ["Stud", "Hoop", "Drop", "Jhumka", "Chandbali"],
    },
    {
      name: "Finish",
      values: ["Gold", "Silver", "Antique", "Oxidized"],
    },
  ],

  Anklets: [
    { name: "Length (inches)", values: ["8", "9", "10"] },
    {
      name: "Finish",
      values: ["Silver", "Oxidized"],
    },
  ],

  Other: [],
};

export function getDefaultOptionsForCategory(category) {
  return (
    defaultOptionsByCategory[category] || defaultOptionsByCategory["Other"]
  );
}
