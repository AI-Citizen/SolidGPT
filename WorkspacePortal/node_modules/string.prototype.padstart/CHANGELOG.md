# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v3.1.4](https://github.com/es-shims/String.prototype.padStart/compare/v3.1.3...v3.1.4) - 2022-11-07

### Commits

- [actions] reuse common workflows [`dab6400`](https://github.com/es-shims/String.prototype.padStart/commit/dab6400b2f377c461a211170b8a8283a189d5688)
- [meta] use `npmignore` to autogenerate an npmignore file [`986e57a`](https://github.com/es-shims/String.prototype.padStart/commit/986e57a03638fc945d1555cd3be2a40e8530a82c)
- [meta] add `auto-changelog` [`2ee6cfc`](https://github.com/es-shims/String.prototype.padStart/commit/2ee6cfc98604b85d4b76d660e898a531499b12bb)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `@es-shims/api`, `safe-publish-latest`, `tape` [`b1e92b1`](https://github.com/es-shims/String.prototype.padStart/commit/b1e92b11fc20d13164ae892a356a3af817ffd9dc)
- [Deps] update `define-properties`, `es-abstract` [`92e11e2`](https://github.com/es-shims/String.prototype.padStart/commit/92e11e2ea6db9c4f895b0d1eab499ac0dedc5c5c)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `functions-have-names`, `tape` [`509d44d`](https://github.com/es-shims/String.prototype.padStart/commit/509d44d79e889838fce63b745c4a06ccae52450c)
- [actions] update rebase action to use reusable workflow [`7769cb6`](https://github.com/es-shims/String.prototype.padStart/commit/7769cb66172b33a04490a240915584d0d4c71c8f)
- [actions] update codecov uploader [`52a16c8`](https://github.com/es-shims/String.prototype.padStart/commit/52a16c80f424067f0b5e430dd24f4a26ea154f4c)

<!-- auto-changelog-above -->

3.1.3 / 2021-10-04
=================
  * [Robustness] avoid a runtime call to `.push`
  * [Deps] update `es-abstract`
  * [readme] add github actions/codecov badges
  * [meta] use `prepublishOnly` script for npm 7+
  * [actions] update workflows
  * [actions] use `node/install` instead of `node/run`; use `codecov` action
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `@es-shims/api`, `aud`, `tape`

3.1.2 / 2021-02-20
=================
  * [meta] do not publish github action workflow files
  * [Deps] update `call-bind`, `es-abstract`
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `functions-have-names`, `has-strict-mode`, `tape`
  * [actions] update workflows
  * [Tests] increase coverage

3.1.1 / 2020-11-21
=================
  * [Deps] update `es-abstract`; use `call-bind` where applicable
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `functions-have-names`, `tape`; add `aud`
  * [actions] add "Allow Edits" workflow
  * [actions] switch Automatic Rebase workflow to `pull_request_target` event
  * [meta] gitignore nyc output
  * [meta] add `safe-publish-latest`
  * [Tests] migrate tests to Github Actions
  * [Tests] run `nyc` on all tests
  * [Tests] add `implementation` test; run `es-shim-api` in postlint; use `tape` runner
  * [Tests] update `function-bind`

3.1.0 / 2019-12-14
=================
  * [New] add `auto` entry point
  * [Refactor] use split-up `es-abstract` (77% bundle size decrease)
  * [readme] remove testling
  * [readme] Fixed syntax error in README (#12)
  * [readme] Stage 4
  * [Deps] update `define-properties`, `es-abstract`, `function-bind`
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `functions-have-names`, `covert`, `tape`, `@es-shims/api`
  * [meta] add `funding` field
  * [meta] Only apps should have lockfiles.
  * [Tests] use pretest/posttest for linting/security
  * [Tests] use `functions-have-names`
  * [Tests] use `npx aud` instead of `nsp` or `npm audit` with hoops
  * [Tests] remove `jscs`
  * [Tests] use shared travis-ci configs
  * [actions] add automatic rebasing / merge commit blocking

3.0.0 / 2015-11-17
=================
  * Renamed to `padStart`/`padEnd` per November 2015 TC39 meeting.

2.0.0 / 2015-09-25
=================
  * [Breaking] Take the *first* part of the `fillStr` when truncating (#1)
  * Implement the [es-shim API](es-shims/api)
  * [Tests] up to `io.js` `v3.3`, `node` `v4.1`
  * [Deps] update `es-abstract`
  * [Dev Deps] Update `tape`, `jscs`, `eslint`, `@ljharb/eslint-config`, `nsp`
  * [Refactor] Remove redundant `max` operation, per https://github.com/ljharb/proposal-string-pad-left-right/pull/2

1.0.0 / 2015-07-30
=================
  * v1.0.0
