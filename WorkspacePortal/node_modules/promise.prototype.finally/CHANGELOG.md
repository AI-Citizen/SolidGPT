# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v3.1.4](https://github.com/es-shims/Promise.prototype.finally/compare/v3.1.3...v3.1.4) - 2022-11-07

### Commits

- [actions] reuse common workflows [`1f2f581`](https://github.com/es-shims/Promise.prototype.finally/commit/1f2f581ffc86fcc76c91ad9b4e36466c23e370a0)
- [meta] add `auto-changelog` [`382073c`](https://github.com/es-shims/Promise.prototype.finally/commit/382073ccb71bc7f41977c112d316da1a33e1148d)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest`, `tape` [`82cee30`](https://github.com/es-shims/Promise.prototype.finally/commit/82cee3007dc2641d22542e3d105e5fb95caee61b)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `@es-shims/api`, `aud`, `tape` [`7a16cda`](https://github.com/es-shims/Promise.prototype.finally/commit/7a16cdadad7fc32548b9cd3aff3ba160968d85ed)
- [actions] update rebase action to use reusable workflow [`a3cefcf`](https://github.com/es-shims/Promise.prototype.finally/commit/a3cefcf3d2774834477f4263eedcd5abb089b651)
- [actions] update codecov uploader [`63f0668`](https://github.com/es-shims/Promise.prototype.finally/commit/63f06684ac969bc4a78afa8a96a61d1034055885)
- [Deps] update `define-properties`, `es-abstract` [`efeba8d`](https://github.com/es-shims/Promise.prototype.finally/commit/efeba8d7ce3ec0a522b639c492d2c27e0f2991e0)

<!-- auto-changelog-above -->

3.1.3 / 2021-10-04
=================
  * [Refactor] update `es-abstract`; use `call-bind` instead of `function-bind`
  * [Deps] update `es-abstract`
  * [readme] add github actions/codecov badges
  * [meta] remove unneeded token; update checkout action
  * [actions] use `node/install` instead of `node/run`; use `codecov` action
  * [actions] add Require Allow Edits workflow
  * [actions] switch Automatic Rebase workflow to `pull_request_target` event
  * [Tests] increase coverage
  * [Tests] migrate tests to Github Actions (#29)
  * [Tests] run `nyc` on all tests; use `tape` runner; add implementation tests; mark failing impl tests as TODO
  * [Tests] skip "observable calls" tests in node 6-9
  * [Tests] add passing tests from https://github.com/tc39/test262/pull/2752
  * [Tests] refactor Subclass tests to capture receiver
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `@es-shims/api`, `aud`, `es6-shim`, `tape`

3.1.2 / 2019-12-11
=================
  * [Refactor] use split-up `es-abstract`
  * [Deps] update `es-abstract`
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest`
  * [Tests] up to `node` `v12.12`
  * [Tests] use shared travis-ci configs
  * [meta] add `funding` field
  * [actions] add automatic rebasing / merge commit blocking

3.1.1 / 2019-08-25
=================
  * [Fix] `finally` receiver must only be an Object, not a Promise
  * [Deps] update `define-properties`, `es-abstract`
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `@es-shims/api`, `covert`, `es6-shim`, `safe-publish-latest`, `tape`
  * [Tests] up to `node` `v12.9`, `v11.15`, `v10.16`, `v9.11`, `v8.16`, `v6.17`, `v4.9`
  * [Tests] add test for non-Promise receiver
  * [Tests] use `npx aud` instead of `nsp` or `npm audit` with hoops

3.1.0 / 2017-10-26
=================
  * [New] Add auto shim file, allowing clean 'import' (#12)
  * [Refactor] only call `Promise#then` for a brand check once, instead of twice.
  * [Deps] update `es-abstract`
  * [Dev Deps] update `eslint`, `nsp`

3.0.1 / 2017-09-09
=================
  * [Fix] ensure that the “then” brand check doesn’t cause an unhandled rejection warning (#10)
  * [Deps] update `es-abstract`, `function-bind`
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `nsp`, `tape`, `@es-shims/api`
  * [Tests] up to `node` `v8.4`; use `nvm install-latest-npm` so new `npm` doesn’t break old `node`; add 0.8
  * [Tests] restore ES5 tests
  * [Tests] refactor to allow for unshimmed tests

3.0.0 / 2017-07-25
=================
  * [Breaking] update implementation to follow the new spec (#9)
  * [Deps] update `es-abstract`
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `es6-shim`, `nsp`, `safe-publish-latest`, `tape`
  * [Tests] up to `node` `v8.1`, `v7.10`, `v6.11`, `v4.8`; improve matrix
  * [Tests] fix 0.10; remove 0.8

2.0.1 / 2016-09-27
=================
  * [Fix] functions in IE 9-11 don’t have a `name` property (#3)

2.0.0 / 2016-08-21
=================
  * Re-release.

[1.0.1](https://github.com/matthew-andrews/Promise.prototype.finally/releases/tag/v1.0.1) / 2015-02-09
=================
  * Always replace function for predictability (https://github.com/matthew-andrews/Promise.prototype.finally/issues/3)
  * Wrap polyfill so that if it's used direct it doesn't leak

[1.0.0](https://github.com/matthew-andrews/Promise.prototype.finally/releases/tag/v1.0.0) / 2014-10-11
=================
  * Initial release.
