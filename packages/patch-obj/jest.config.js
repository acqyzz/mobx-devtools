/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  rootDir: ".",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/__spec__/**/*.spec.ts"],
  transform: {
    ".(ts|js)$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json",
      },
    ],
  },
};
