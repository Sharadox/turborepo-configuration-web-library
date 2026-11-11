import { describe, expect, test } from "vitest";
import {
  PROJECT_KINDS,
  turborepoConfiguration,
} from "@sharadox/turborepo-configuration-web-library/turborepo-configuration";

describe("turborepoConfiguration", () => {
  test.each(PROJECT_KINDS)("%s signs its remote cache and has the common tasks", (kind) => {
    const configuration = turborepoConfiguration(kind);
    expect(configuration.remoteCache).toEqual({ signature: true });
    expect(Object.keys(configuration.tasks)).toEqual(
      expect.arrayContaining(["format:check", "lint", "type-check", "test:unit", "test:benchmark", "documentation"]),
    );
    expect(configuration.tasks["test:unit"]!.outputs).toEqual(["coverage/**"]);
  });

  test("a library builds source/ into distribution/, ignoring tests", () => {
    expect(turborepoConfiguration("library").tasks.build).toMatchObject({
      inputs: expect.arrayContaining(["source/**", "!**/*unit-test.*"]),
      outputs: ["distribution/**"],
    });
  });

  test("a Node tool has no build", () => {
    expect(turborepoConfiguration("node").tasks.build).toBeUndefined();
  });

  test("a Next.js application builds .next/, runs end-to-end tests after the build and serves locally", () => {
    const { tasks, globalEnv } = turborepoConfiguration("next-js-application");
    expect(globalEnv).toEqual(["NODE_ENV"]);
    expect(tasks.build).toMatchObject({
      outputs: [".next/**", "!.next/cache/**"],
      env: ["NEXT_PUBLIC_*"],
      passThroughEnv: ["EMAIL_*", "TURBOREPO_*"],
    });
    expect(tasks["test:end-to-end"]!.dependsOn).toEqual(["build"]);
    expect(tasks.development).toEqual({ cache: false, persistent: true });
    expect(tasks.lint!.inputs).toContain("src/**");
  });
});
