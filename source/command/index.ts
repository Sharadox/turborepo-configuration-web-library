import {
  PROJECT_KINDS,
  turborepoConfiguration,
} from "@sharadox/turborepo-configuration-web-library/turborepo-configuration";
import type { ProjectKind } from "@sharadox/turborepo-configuration-web-library/turborepo-configuration/type";
import type { CommandContext } from "@sharadox/turborepo-configuration-web-library/command/type";

const isProjectKind = (value: string | undefined): value is ProjectKind =>
  (PROJECT_KINDS as readonly (string | undefined)[]).includes(value);

/**
 * `turborepo-configuration <kind>`: writes turbo.json for the project kind into the current folder. Returns the
 * exit code.
 *
 * @example
 * // package.json
 * { "scripts": { "prepare": "turborepo-configuration library && husky" } }
 */
export function runCommand([kind]: readonly string[], { writeFile, print }: CommandContext): number {
  if (!isProjectKind(kind)) {
    print(`usage: turborepo-configuration <${PROJECT_KINDS.join("|")}>`);
    return 1;
  }
  writeFile("turbo.json", `${JSON.stringify(turborepoConfiguration(kind), null, 2)}\n`);
  print(`turbo.json written for a ${kind}`);
  return 0;
}
