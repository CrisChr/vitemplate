
const packageManagerOptions = [
  { label: "pnpm", picked: false },
  { label: "yarn", picked: false },
  { label: "npm", picked: false },
];

const useTsOptions = [
  { label: "Yes", picked: false },
  { label: "No", picked: false },
];

const CSR = [
  {
    label: "React",
    picked: false,
    alwaysShow: true,
  },
  {
    label: "Vue",
    picked: false,
  },
  {
    label: "Svelte",
    picked: false,
  },
  {
    label: "Solid",
    picked: false,
  },
  {
    label: "Vanilla",
    picked: false
  },
  {
    label: "Preact",
    picked: false
  },
  {
    label: "Lit",
    picked: false
  },
  {
    label: "Qwik",
    picked: false
  }
];

const SSR = [
  {
    label: "Next",
    picked: false,
  },
  // {
  //   label: "Nuxt",
  //   picked: false,
  // },
];

module.exports = {CSR, SSR, packageManagerOptions, useTsOptions};
