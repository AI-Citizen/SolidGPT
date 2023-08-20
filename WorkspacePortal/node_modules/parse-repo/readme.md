parse-repo
==========

Extract repository information from a git remote URI.

Installation
------------

```
npm install parse-repo
```

Usage
-----

```js
var parseRepo = require('parse-repo');

// parsing a GitHub https remote
parseRepo('https://github.com/npm/docs.git');
/*
{ remote: 'https://github.com/npm/docs.git',
  protocol: 'https',
  host: 'github.com',
  repository: 'npm/docs',
  owner: 'npm',
  project: 'docs' }
*/

// slightly different bitbucket URI
parseRepo('https://user@bitbucket.org/owner/org');
/*
{ remote: 'https://user@bitbucket.org/owner/org',
  protocol: 'https',
  host: 'bitbucket.org',
  repository: 'owner/org',
  owner: 'owner',
  project: 'org' }
*/

// git remotes are also supported
parseRepo('git@gitlab.com:gitlab-org/gitlab-ce.git');
/*
{ remote: 'git@gitlab.com:gitlab-org/gitlab-ce.git',
  protocol: 'git',
  host: 'gitlab.com',
  repository: 'gitlab-org/gitlab-ce',
  owner: 'gitlab-org',
  project: 'gitlab-ce' }
*/

// a local remote, without owner information
parseRepo('/local/path/repo-name');
/*
{ remote: '/local/path/repo-name',
  protocol: 'file',
  host: 'localhost',
  repository: 'repo-name',
  owner: null,
  project: 'repo-name' }
*/
```

License
-------
MIT license - http://www.opensource.org/licenses/mit-license.php
