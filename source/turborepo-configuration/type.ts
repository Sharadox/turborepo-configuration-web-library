/** The kinds of project that share a Turborepo configuration. */
export type ProjectKind = "library" | "next-js-application" | "node";

/** One Turborepo task. */
export interface TurborepoTask {
  dependsOn?: string[];
  inputs?: string[];
  outputs?: string[];
  env?: string[];
  cache?: boolean;
  persistent?: boolean;
}

/** The contents of turbo.json. */
export interface TurborepoConfiguration {
  $schema: string;
  remoteCache: { signature: boolean };
  globalEnv?: string[];
  tasks: Record<string, TurborepoTask>;
}
