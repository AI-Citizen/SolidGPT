# Storybook Deployer

This is a simple tool allows you to deploy your Storybook into a static hosting service. (Currently, GitHub Pages and AWS S3 beta)

```sh
$ storybook-to-ghpages --help
$ storybook-to-aws-s3 --help

Options:
  --help, -h                      Show help.                                             [boolean]
  --version                       Show version number                                    [boolean]
  --existing-output-dir, -e       If you have previously built your storybook output (through a
                                  different CI step, etc) and just need to publish it     [string]
  --out, -o                       Configure the output directory                          [string]
  --packages, -p                  Directory for package.jsons (monorepo support)          [string]
  --monorepo-index-generator, -m  Path to file to customize the monorepo index.html. This function
                                  should return the html for the page.                    [string]
  --script, -s                    Specify the build script in your package.json           [string]
  --ci                            Deploy the storybook in CI mode (github only)          [boolean]
  --dry-run                       Run build but hold off on publishing                   [boolean]
  --remote                        Git remote to push to               [string] [default: "origin"]
  --branch                        Git branch to push to             [string] [default: "gh-pages"]
  --source-branch                 Source branch to push from          [string] [default: "master"]
  --host-token-env-variable, -t   Github token for CI publish       [string] [default: "GH_TOKEN"]
  --aws-profile                   AWS profile to use for publishing. Use NONE to use no profile
                                  at all instead of "default".       [string] [default: "default"]
  --bucket-path                   AWS bucket path to use for publishing                   [string]
  --s3-sync-options               Additional options to pass to AWSCLI s3 sync            [string]
```

## Getting Started

Install Storybook Deployer with:

```
npm i @storybook/storybook-deployer --save-dev
```

Then add a NPM script like this for github page:

```json
{
  "scripts": {
    "deploy-storybook": "storybook-to-ghpages"
  }
}
```

or like this for AWS S3:

```json
{
  "scripts": {
    "deploy-storybook": "storybook-to-aws-s3"
  }
}
```

Then you can run `npm run deploy-storybook` to deploy the Storybook.

Alternatively, you can execute Storybook Deployer directly using `npx`

```sh
npx -p @storybook/storybook-deployer storybook-to-ghpages
npx -p @storybook/storybook-deployer storybook-to-aws-s3
```

### Custom Build Configuration

If you customize the build configuration with some additional params (like static file directory), then you need to expose another NPM script like this:

```json
{
  "scripts": {
    "build-storybook": "build-storybook -s public"
  }
}
```

### Configure Build Directory

If you need to configure the output directory you can supply the `out` flag.

```sh
npm run deploy-storybook -- --out=.out
```

### Skip Build Step

If you have previously built your storybook output (through a different CI step, etc) and just need to publish it, specify the directory like this:

```sh
npm run deploy-storybook -- --existing-output-dir=.out
```

### Skip Deploy Step

if you want to see how everything build without pushing to a remote, use the `--dry-run` flag.

```sh
npm run deploy-storybook -- --dry-run
```

### Deploy a Monorepo

If you manage a monorepo with multiple storybooks you can pass the `packages` flag to `deploy-storybook` to scan a directory for `package.json`s.

The following command will search the `packages` directory for packages. It will also generate a default `index.html` that links to all of the loaded storybooks.

```sh
npm run deploy-storybook -- --packages packages
```

### Customize Monorepo `index.html`

To customize the monorepo `index.html` you can pass the `monorepo-index-generator` flag to `deploy-storybook`. This file should export a function that receive the following arguments and returns the html for the page.

- an array of all the `package.json` data from the loaded storybooks as the first argument
- the output directory

```sh
npm run deploy-storybook -- --monorepo-index-generator my-custom-generator.js
```

### Deploying Storybook as part of a CI service

To deploy Storybook as part of a CI step, pass the `ci` flag to `npm run deploy-storybook`.

If the `CI` environment variable is set then this mode will be assumed, therefore no need to specify the `ci` flag.

Because pushing to GitHub as part of a CI step requires a [personal access token](https://github.com/blog/1509-personal-api-tokens), Storybook uses the `GH_TOKEN` environment variable, by default, to authenticate GitHub pushes.

This environment variable name can be configured via the `host-token-env-variable` flag.

For example, if your access token is stored in the `GH_TOKEN` environment variable

```sh
npm run deploy-storybook -- --ci
```

Or if your access token is stored in the `GITHUB_TOKEN` environment variable

```sh
npm run deploy-storybook -- --ci --host-token-env-variable=GITHUB_TOKEN
```

### Deploying Storybook to GitHub Pages as part of a GitHub Action

If you are deploying Storybook to GitHub Pages from a repository belonging to an organization account on GitHub, you may need to specify a ```${{ github.actor }}``` in addition to the ```${{ secrets.GITHUB_TOKEN }}``` for your build step to be able to authenticate properly.

For instance:
```
- name: Deploy storybook to GitHub Pages
  run: npm run deploy-storybook -- --ci
  env:
    GH_TOKEN: ${{ github.actor }}:${{ secrets.GITHUB_TOKEN }}
```

### Custom deploy configuration

If you want to customize Git username, email or commit message, add this to `package.json`:

```json
"storybook-deployer": {
  "gitUsername": "Custom Username",
  "gitEmail": "custom@email.com",
  "commitMessage": "Deploy Storybook [skip ci]"
}
```

It will override the default configuration:

```json
"storybook-deployer": {
  "gitUsername": "GH Pages Bot",
  "gitEmail": "hello@ghbot.com",
  "commitMessage": "Deploy Storybook to GitHub Pages"
}
```

To deploy Storybook to a remote other than `origin`, pass a `--remote` flag to `npm run deploy-storybook`.
For example, to deploy to your `upstream` remote:

```sh
npm run deploy-storybook -- --remote=upstream
```

Or, to specify a target branch and serve your storybook with rawgit instead of gh-pages:

```sh
npm run deploy-storybook -- --branch=feature-branch
```

Or, to specify a source branch other than `master`, pass a `--source-branch` flag to `npm run deploy-storybook`:

```sh
npm run deploy-storybook -- --source-branch=release
```

#### Custom deploy configuration for S3

For AWS S3 deployment you must have [awscli](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed.

You must specify a bucket path with `bucket-path` option: `my-bucket-name/path/to/destination-folder-in-bucket` and have the rights to write to this bucket.

You can change the aws profile used to run the command with the `aws-profile` option.

```sh
storybook-to-aws-s3 --bucket-path=my-bucket-name/path/to/destination-folder-in-bucket --aws-profile=myprofile
```

You can exclude the aws profile by setting this flag to "NONE":

```sh
storybook-to-aws-s3 --bucket-path=my-bucket-name/path/to/destination-folder-in-bucket --aws-profile=NONE
```

You can provide arbitrary S3 sync options via the `--s3-sync-options` flag:

```sh
storybook-to-aws-s3 --bucket-path=bucket-name/bucket-path --s3-sync-options=--acl=public-read
storybook-to-aws-s3 --bucket-path=bucket-name/bucket-path --s3-sync-options="--acl=public-read --quiet"
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://hipstersmoothie.com"><img src="https://avatars3.githubusercontent.com/u/1192452?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Lisowski</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=hipstersmoothie" title="Code">💻</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=hipstersmoothie" title="Documentation">📖</a></td>
    <td align="center"><a href="https://arunoda.me"><img src="https://avatars1.githubusercontent.com/u/50838?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arunoda Susiripala</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=arunoda" title="Code">💻</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=arunoda" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/ndelangen"><img src="https://avatars2.githubusercontent.com/u/3070389?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Norbert de Langen</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=ndelangen" title="Code">💻</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=ndelangen" title="Documentation">📖</a></td>
    <td align="center"><a href="https://dandean.com"><img src="https://avatars3.githubusercontent.com/u/18332?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dan Dean</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=dandean" title="Code">💻</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=dandean" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.jsonunger.com"><img src="https://avatars1.githubusercontent.com/u/16748392?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jason Unger</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=jsonunger" title="Code">💻</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=jsonunger" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/nkov"><img src="https://avatars3.githubusercontent.com/u/3165749?v=4?s=100" width="100px;" alt=""/><br /><sub><b>nkov</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=nkov" title="Code">💻</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=nkov" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/tsargent"><img src="https://avatars3.githubusercontent.com/u/173215?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tyler Sargent</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=tsargent" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://patrickmriley.net"><img src="https://avatars2.githubusercontent.com/u/4237045?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Patrick Riley</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=priley86" title="Code">💻</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=priley86" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/jeanlucc"><img src="https://avatars0.githubusercontent.com/u/6769926?v=4?s=100" width="100px;" alt=""/><br /><sub><b>jeanlucc</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=jeanlucc" title="Code">💻</a></td>
    <td align="center"><a href="http://travisbloom.me"><img src="https://avatars1.githubusercontent.com/u/1258114?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Travis Bloom</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=travisbloom" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/stof"><img src="https://avatars0.githubusercontent.com/u/439401?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christophe Coevoet</b></sub></a><br /><a href="#maintenance-stof" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://shilman.net"><img src="https://avatars2.githubusercontent.com/u/488689?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Shilman</b></sub></a><br /><a href="#maintenance-shilman" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/jaebradley"><img src="https://avatars0.githubusercontent.com/u/8136030?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jae Bradley</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=jaebradley" title="Code">💻</a></td>
    <td align="center"><a href="https://bryce.io/"><img src="https://avatars1.githubusercontent.com/u/3171252?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bryce Dorn</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/issues?q=author%3Abrycedorn" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/baopham"><img src="https://avatars3.githubusercontent.com/u/783410?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bao Pham</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=baopham" title="Code">💻</a></td>
    <td align="center"><a href="https://encoredevlabs.com"><img src="https://avatars1.githubusercontent.com/u/498669?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ankur Patel</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=ankurp" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ZitaNemeckova"><img src="https://avatars2.githubusercontent.com/u/9210860?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ZitaNemeckova</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=ZitaNemeckova" title="Code">💻</a></td>
    <td align="center"><a href="http://lucasms.net"><img src="https://avatars3.githubusercontent.com/u/868687?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucas Machado</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=luksm" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sojeri"><img src="https://avatars3.githubusercontent.com/u/10818509?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeri Sommers</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=sojeri" title="Code">💻</a></td>
    <td align="center"><a href="http://jimmyandrade.com/"><img src="https://avatars.githubusercontent.com/u/2307245?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jimmy Andrade</b></sub></a><br /><a href="#infra-jimmyandrade" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=jimmyandrade" title="Documentation">📖</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=jimmyandrade" title="Code">💻</a></td>
    <td align="center"><a href="https://nickthesick.com/"><img src="https://avatars.githubusercontent.com/u/1852538?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nick Perez</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=nperez0111" title="Documentation">📖</a> <a href="https://github.com/storybookjs/storybook-deployer/commits?author=nperez0111" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/mitchiemt11"><img src="https://avatars.githubusercontent.com/u/74592107?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mitchell </b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=mitchiemt11" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/erlendmiljo"><img src="https://avatars.githubusercontent.com/u/102804921?v=4?s=100" width="100px;" alt=""/><br /><sub><b>erlendmiljo</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=erlendmiljo" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/georgewrmarshall"><img src="https://avatars.githubusercontent.com/u/8112138?v=4?s=100" width="100px;" alt=""/><br /><sub><b>George Marshall</b></sub></a><br /><a href="https://github.com/storybookjs/storybook-deployer/commits?author=georgewrmarshall" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
