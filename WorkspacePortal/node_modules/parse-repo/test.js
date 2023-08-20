var tape = require('tape'),
    parseRepo = require('./index.js');

tape('github remotes', function(t) {
    // http protocol ending in .git
    t.deepEqual(parseRepo('https://github.com/npm/docs.git'), {
        remote: 'https://github.com/npm/docs.git',
        protocol: 'https',
        host: 'github.com',
        repository: 'npm/docs',
        owner: 'npm',
        project: 'docs'
    });

    // http protocol without .git
    t.deepEqual(parseRepo('https://github.com/npm/docs'), {
        remote: 'https://github.com/npm/docs',
        protocol: 'https',
        host: 'github.com',
        repository: 'npm/docs',
        owner: 'npm',
        project: 'docs'
    });

    // short notation of ssh protocol
    t.deepEqual(parseRepo('git@github.com:npm/docs.git'), {
        remote: 'git@github.com:npm/docs.git',
        protocol: 'ssh',
        host: 'github.com',
        repository: 'npm/docs',
        owner: 'npm',
        project: 'docs'
    });

    // alternative short notation of ssh
    t.deepEqual(parseRepo('git://github.com/npm/docs.git'), {
        remote: 'git://github.com/npm/docs.git',
        protocol: 'git',
        host: 'github.com',
        repository: 'npm/docs',
        owner: 'npm',
        project: 'docs'
    });

    // ssh protocol long notation
    t.deepEqual(parseRepo('ssh://git@github.com:npm/docs.git'), {
        remote: 'ssh://git@github.com:npm/docs.git',
        protocol: 'ssh',
        host: 'github.com',
        repository: 'npm/docs',
        owner: 'npm',
        project: 'docs'
    });

    // repo with periods in name (tests issue #2)
    t.deepEqual(parseRepo('git@github.com:simshanith/pi.simloovoo.com.git'), {
        remote: 'git@github.com:simshanith/pi.simloovoo.com.git',
        protocol: 'ssh',
        host: 'github.com',
        repository: 'simshanith/pi.simloovoo.com',
        owner: 'simshanith',
        project: 'pi.simloovoo.com'
    });

    // repo with periods in name (tests issue #2)
    t.deepEqual(parseRepo('https://github.com/simshanith/pi.simloovoo.com'), {
        remote: 'https://github.com/simshanith/pi.simloovoo.com',
        protocol: 'https',
        host: 'github.com',
        repository: 'simshanith/pi.simloovoo.com',
        owner: 'simshanith',
        project: 'pi.simloovoo.com'
    });

    // repo with complex protocol
    t.deepEqual(parseRepo('git+ssh://git@github.com:npm/docs.git'), {
        remote: 'git+ssh://git@github.com:npm/docs.git',
        protocol: 'git+ssh',
        host: 'github.com',
        repository: 'npm/docs',
        owner: 'npm',
        project: 'docs'
    });

    // repo with complex protocol over https
    t.deepEqual(parseRepo('git+https://isaacs@github.com/npm/docs.git'), {
        remote: 'git+https://isaacs@github.com/npm/docs.git',
        protocol: 'git+https',
        host: 'github.com',
        repository: 'npm/docs',
        owner: 'npm',
        project: 'docs'
    });

    // ignore trailing modifiers with '#', such as the supported on npm
    t.deepEqual(parseRepo('git+ssh://git@github.com:npm/npm.git#v1.0.27'), {
        remote: 'git+ssh://git@github.com:npm/npm.git#v1.0.27',
        protocol: 'git+ssh',
        host: 'github.com',
        repository: 'npm/npm',
        owner: 'npm',
        project: 'npm'
    });

    t.end();
});

tape('bitbucket remotes', function(t) {
    // http protocol ending in .git
    t.deepEqual(parseRepo('https://user@bitbucket.org/owner/org.git'), {
        remote: 'https://user@bitbucket.org/owner/org.git',
        protocol: 'https',
        host: 'bitbucket.org',
        repository: 'owner/org',
        owner: 'owner',
        project: 'org'
    });

    // http protocol without .git
    t.deepEqual(parseRepo('https://user@bitbucket.org/owner/org'), {
        remote: 'https://user@bitbucket.org/owner/org',
        protocol: 'https',
        host: 'bitbucket.org',
        repository: 'owner/org',
        owner: 'owner',
        project: 'org'
    });

    // ssh protocol
    t.deepEqual(parseRepo('git@bitbucket.org:owner/org.git'), {
        remote: 'git@bitbucket.org:owner/org.git',
        protocol: 'ssh',
        host: 'bitbucket.org',
        repository: 'owner/org',
        owner: 'owner',
        project: 'org'
    });

    t.end();
});

tape('gitlab remotes', function(t) {
    // http protocol ending in .git
    t.deepEqual(parseRepo('https://gitlab.com/gitlab-org/gitlab-ce.git'), {
        remote: 'https://gitlab.com/gitlab-org/gitlab-ce.git',
        protocol: 'https',
        host: 'gitlab.com',
        repository: 'gitlab-org/gitlab-ce',
        owner: 'gitlab-org',
        project: 'gitlab-ce'
    });

    // ssh protocol
    t.deepEqual(parseRepo('git@gitlab.com:gitlab-org/gitlab-ce.git'), {
        remote: 'git@gitlab.com:gitlab-org/gitlab-ce.git',
        protocol: 'ssh',
        host: 'gitlab.com',
        repository: 'gitlab-org/gitlab-ce',
        owner: 'gitlab-org',
        project: 'gitlab-ce'
    });

    t.end();
});

tape('ssh and local remotes', function(t) {
    // local path ending in .git
    t.deepEqual(parseRepo('/full/path/to/repo.git'), {
        remote: '/full/path/to/repo.git',
        protocol: 'file',
        host: 'localhost',
        repository: 'repo',
        owner: null,
        project: 'repo'
    });

    // local path without .git
    t.deepEqual(parseRepo('/full/path/to/repo'), {
        remote: '/full/path/to/repo',
        protocol: 'file',
        host: 'localhost',
        repository: 'repo',
        owner: null,
        project: 'repo'
    });

    // repos/R repository in the user's home directory of another host
    t.deepEqual(parseRepo('ssh://user@other.host.com/~/repos/R.git'), {
        remote: 'ssh://user@other.host.com/~/repos/R.git',
        protocol: 'ssh',
        host: 'other.host.com',
        repository: 'R',
        owner: null,
        project: 'R'
    });

    t.end();
});
