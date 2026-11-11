import { expect, test, vi } from "vitest";
import { runCommand } from "@sharadox/turborepo-configuration-web-library/command";

test("writes turbo.json for the kind", () => {
  const writeFile = vi.fn();
  const print = vi.fn();
  expect(runCommand(["library"], { writeFile, print })).toBe(0);
  const [path, contents] = writeFile.mock.calls[0]!;
  expect(path).toBe("turbo.json");
  expect(JSON.parse(contents).tasks.build.outputs).toEqual(["distribution/**"]);
  expect(contents.endsWith("}\n")).toBe(true);
  expect(print).toHaveBeenCalledWith("turbo.json written for a library");
});

test.each([[[]], [["website"]]])("explains the usage for %j", (argumentsGiven) => {
  const print = vi.fn();
  expect(runCommand(argumentsGiven, { writeFile: vi.fn(), print })).toBe(1);
  expect(print).toHaveBeenCalledWith("usage: turborepo-configuration <library|next-js-application|node>");
});
