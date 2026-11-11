import type {
  ProjectKind,
  TurborepoConfiguration,
  TurborepoTask,
} from "@sharadox/turborepo-configuration-web-library/turborepo-configuration/type";

/** Every kind of project accepted by `turborepoConfiguration`. */
export const PROJECT_KINDS: readonly ProjectKind[] = ["library", "next-js-application", "node"];

const TESTS = ["!**/*unit-test.*", "!**/*end-to-end-test.*", "!**/*benchmark-test.*", "!**/snapshot/**"];

/** Tasks every project has, given its code folder. */
const commonTasks = (code: string): Record<string, TurborepoTask> => ({
  "format:check": {},
  lint: { inputs: [`${code}/**`, "*.ts", "*.mjs", "eslint.config.mjs", "tsconfig*.json"] },
  "type-check": { inputs: [`${code}/**`, "*.ts", "tsconfig*.json"] },
  "test:unit": { inputs: [`${code}/**`, "vitest.config.ts", "tsconfig*.json"], outputs: ["coverage/**"] },
  "test:benchmark": { inputs: [`${code}/**`, "vitest.config.ts"], cache: false },
  documentation: {
    inputs: [`${code}/**`, "typedoc.json", "tsconfig*.json", "README.md"],
    outputs: ["documentation/**"],
  },
});

/**
 * The Turborepo configuration for a kind of project: signed remote caching, and every Sharadox task with the
 * inputs that change its result and the outputs worth caching.
 *
 * @example
 * turborepoConfiguration("library").tasks.build; // { inputs: ["source/**", …], outputs: ["distribution/**"] }
 */
export function turborepoConfiguration(kind: ProjectKind): TurborepoConfiguration {
  const base = { $schema: "https://turborepo.com/schema.json", remoteCache: { signature: true } };
  if (kind === "next-js-application") {
    return {
      ...base,
      globalEnv: ["NODE_ENV"],
      tasks: {
        ...commonTasks("src"),
        "type-check": { inputs: ["src/**", "*.ts", "tsconfig*.json", "next-env.d.ts"] },
        build: {
          inputs: [
            "src/**",
            "public/**",
            "next.config.ts",
            "tsconfig*.json",
            "package.json",
            "pnpm-lock.yaml",
            ...TESTS,
          ],
          outputs: [".next/**", "!.next/cache/**"],
          env: ["NEXT_PUBLIC_*"],
          // Runtime-only: email-web-library's settings and the cache signature key. Declared so Vercel passes them
          // through (and stops warning) without letting secrets change the build cache.
          passThroughEnv: ["EMAIL_*", "TURBOREPO_*"],
        },
        "test:end-to-end": {
          dependsOn: ["build"],
          inputs: ["src/**", "public/**", "playwright.config.ts"],
          outputs: ["test-results/**", "playwright-report/**"],
        },
        development: { cache: false, persistent: true },
        start: { cache: false, persistent: true },
      },
    };
  }
  const tasks = commonTasks("source");
  if (kind === "library") {
    tasks.build = {
      inputs: ["source/**", "script/**", "tsconfig*.json", "package.json", ...TESTS],
      outputs: ["distribution/**"],
    };
  }
  return { ...base, tasks };
}
