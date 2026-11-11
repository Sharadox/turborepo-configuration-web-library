#!/usr/bin/env node
// The turborepo-configuration command.
import { writeFileSync } from "node:fs";
import { runCommand } from "@sharadox/turborepo-configuration-web-library/command";

process.exitCode = runCommand(process.argv.slice(2), {
  writeFile: (path, contents) => writeFileSync(path, contents),
  print: (line) => console.log(line),
});
