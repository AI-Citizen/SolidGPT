const yargs = require('yargs');

const defaultConfig = {
  gitUsername: 'GH Pages Bot',
  gitEmail: 'hello@ghbot.com',
  commitMessage: 'Deploy Storybook to GitHub Pages'
};

const { argv } = yargs
  .wrap(yargs.terminalWidth())
  .option('help', {
    alias: 'h',
    desc: 'Show help.',
    type: 'boolean'
  })
  .option('existing-output-dir', {
    alias: 'e',
    desc:
      'If you have previously built your storybook output (through a different CI step, etc) and just need to publish it',
    type: 'string'
  })
  .option('out', {
    alias: 'o',
    desc: 'Configure the output directory',
    type: 'string'
  })
  .option('packages', {
    alias: 'p',
    desc: 'Directory for package.jsons (monorepo support)',
    type: 'string'
  })
  .option('monorepo-index-generator', {
    alias: 'm',
    desc:
      'Path to file to customize the monorepo index.html. This function should return the html for the page.',
    type: 'string'
  })
  .option('script', {
    alias: 's',
    desc: 'Specify the build script in your package.json',
    type: 'string',
    defaultValue: 'build-storybook'
  })
  .option('ci', {
    desc: 'Deploy the storybook in CI mode (github only)',
    type: 'boolean'
  })
  .option('dry-run', {
    desc: 'Run build but hold off on publishing',
    type: 'boolean'
  })
  // Github Variables
  .option('remote', {
    desc: 'Git remote to push to',
    type: 'string',
    default: 'origin'
  })
  .option('branch', {
    desc: 'Git branch to push to',
    type: 'string',
    default: 'gh-pages'
  })
  .option('source-branch', {
    desc: 'Source branch to push from',
    type: 'string',
    default: 'master'
  })
  .option('host-token-env-variable', {
    alias: 't',
    desc: 'Github token for CI publish',
    type: 'string',
    default: 'GH_TOKEN'
  })
  // AWS Variables
  .option('aws-profile', {
    desc:
      'AWS profile to use for publishing. Use NONE to exclude the --profile flag.',
    type: 'string',
    default: 'default'
  })
  .option('bucket-path', {
    desc: 'AWS bucket path to use for publishing',
    type: 'string'
  })
  .option('s3-sync-options', {
    desc: 'Additional options to pass to AWSCLI s3 sync',
    type: 'string'
  });

module.exports = packageJson => {
  const HOST_TOKEN_ENV_VARIABLE = argv['host-token-env-variable'] || 'GH_TOKEN';

  return {
    config: Object.assign(
      {},
      defaultConfig,
      packageJson['storybook-deployer'] || defaultConfig
    ),
    SKIP_BUILD: Boolean(argv['existing-output-dir']),
    OUTPUT_DIR:
      argv.out ||
      argv['existing-output-dir'] ||
      'out' + Math.ceil(Math.random() * 9999),
    PACKAGES_DIRECTORY: argv.packages,
    MONOREPO_INDEX_GENERATOR: argv['monorepo-index-generator'],
    NPM_SCRIPT: argv.script || 'build-storybook',
    CI_DEPLOY: Boolean(argv.ci) || Boolean(process.env.CI),
    DRY_RUN: Boolean(argv.dryRun),
    // Git Variables
    GIT_REMOTE: argv.remote || 'origin',
    TARGET_BRANCH: argv.branch || 'gh-pages',
    SOURCE_BRANCH: argv['source-branch'] || 'master',
    HOST_TOKEN: process.env[HOST_TOKEN_ENV_VARIABLE],
    // AWS Variables
    AWS_PROFILE: argv['aws-profile'] || 'default',
    BUCKET_PATH: argv['bucket-path'],
    S3_PATH: 's3://' + argv['bucket-path'],
    S3_SYNC_OPTIONS: argv['s3-sync-options']
  };
};
