module.exports = {
  content: ["./**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["winter"],
  },
  plugins: [require("daisyui")],
};
