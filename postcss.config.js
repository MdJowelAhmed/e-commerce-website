const path = require("path");

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {
      // Absolute path avoids Windows issues with spaces in the project folder name.
      config: path.join(__dirname, "tailwind.config.js"),
    },
    autoprefixer: {},
  },
};
