module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "max-len": ["error", { "code": 360 }],
    "prettier/prettier": [ 
      "error",
      { "endOfLine": "auto" }
    ],
  },
  ignorePattern: ["/src/assets"],
  parserOptions: {
    parser: "babel-eslint"
  }
};
