/** What the command needs from the outside world, so tests can replace it. */
export interface CommandContext {
  /** Writes a file (UTF-8). */
  writeFile: (path: string, contents: string) => void;
  /** Prints a line. */
  print: (line: string) => void;
}
