// Placeholder team roster — swap "Member N" for real names whenever they're ready.
// Each group just needs { name, role } objects; counts come from the array lengths below.

const makeGroup = (count, roleLabel, prefix) =>
  Array.from({ length: count }, (_, i) => ({
    name: `${prefix} ${i + 1}`,
    role: roleLabel,
  }));

export const teamGroups = [
  { key: "osc", label: "OSC", members: makeGroup(3, "OSC", "OSC Member") },
  { key: "core", label: "Core Team", members: makeGroup(15, "Core Team", "Core Member") },
  { key: "mentors", label: "Mentors", members: makeGroup(94, "Mentor", "Mentor") },
];
