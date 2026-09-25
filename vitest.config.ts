import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["infra/**/*.test.ts", "services/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["infra/**/*.ts", "services/**/*.ts"],
      exclude: ["**/*.test.ts", "**/dist/**", "**/node_modules/**", "**/cdk.out/**"],
      reporter: ["text", "html", "lcov"],
    },
  },
});
