import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import pathData from "./tsconfig.paths.json";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageReporters: ["text-summary"],
  reporters: ["default"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  verbose: true,
  // automock: true,
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  // testMatch: ["<rootDir>/tests/controller/assessment/hackerearth.test.ts"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(pathData.compilerOptions.paths),
};
export default config;
