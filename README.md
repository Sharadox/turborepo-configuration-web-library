# @sharadox/turborepo-configuration-web-library

The shared [Turborepo](https://turborepo.com) configuration of every Sharadox project. Turborepo can't extend a `turbo.json` from a package in a single-package repository, so this library ships a small command that **writes** `turbo.json` for your kind of project. The repository keeps `turbo.json` out of git, and it is rewritten on every install.

## Install

```sh
pnpm add -D turbo @sharadox/turborepo-configuration-web-library
```

```jsonc
// package.json
{
  "scripts": { "prepare": "turborepo-configuration library && husky" },
}
```

```gitignore
# .gitignore
turbo.json
```

## Kinds

| Kind                  | Code      | Tasks                                                                                                                                                                                  |
| --------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `library`             | `source/` | `format:check`, `lint`, `type-check`, `test:unit` (caches `coverage/`), `test:benchmark` (never cached), `documentation`, `build` (`distribution/`, test files left out of its inputs) |
| `next-js-application` | `src/`    | the same checks, `build` (`.next/`, `NEXT_PUBLIC_*` in the cache key), `test:end-to-end` (after `build`), `development` and `start` (persistent, never cached)                         |
| `node`                | `source/` | the checks, without a build                                                                                                                                                            |

Every kind turns on signed remote caching (`remoteCache.signature`). Set `TURBO_TOKEN`, `TURBO_TEAM` and `TURBO_REMOTE_CACHE_SIGNATURE_KEY` to use it.

## API

| Import                      | Export                                        | Description                                  |
| --------------------------- | --------------------------------------------- | -------------------------------------------- |
| `…/turborepo-configuration` | `turborepoConfiguration(kind)`                | The `turbo.json` object for a kind           |
| `…/turborepo-configuration` | `PROJECT_KINDS`                               | `["library", "next-js-application", "node"]` |
| `…/command`                 | `runCommand(arguments, { writeFile, print })` | The command's logic (returns the exit code)  |
| bin                         | `turborepo-configuration <kind>`              | Writes `./turbo.json`                        |

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage and the build. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## Licence

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
