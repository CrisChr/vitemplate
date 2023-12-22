const vscode = require("vscode");

const vsWindow = vscode.window;

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

module.exports = {vscode, CSR, SSR, packageManagerOptions, useTsOptions, vsWindow };
