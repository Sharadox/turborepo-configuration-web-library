/** The kinds of project that share a Turborepo configuration. */
export type ProjectKind = "library" | "next-js-application" | "node";

/** One Turborepo task. */
export interface TurborepoTask {
  dependsOn?: string[];
  inputs?: string[];
  outputs?: string[];
  env?: string[];
  /** Variables the task can read that don't change its result (runtime secrets), so they never affect the cache. */
  passThroughEnv?: string[];
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
