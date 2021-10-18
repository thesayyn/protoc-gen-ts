module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "airbnb-typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/return-await": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "default-case": "off",
    "new-cap": "off",
  },
};
