#!/usr/bin/env -S node --no-warnings

import RSp from '@ropsoft/rsp-libcore.js'
import Api from '../api/index.js'

const logger = new RSp.Logger();

const main = () => {
    
    new RSp.Cli('rsp-codeproj', {

        up: {
            example: 'rsp-codeproj up',
            description: 'Run all steps for a complete "git"',
            execute: () => { Api.up() }
        },

        go: {
            example: 'rsp-codeproj go',
            description: 'Likewise "up" but with tag versioning',
            execute: () => { Api.go() }
        },

        init: {
            example: 'rsp-codeproj init',
            description: 'Initialize git repo',
            execute: () => { Api.init() }
        },

        push: {
            example: 'rsp-codeproj push',
            description: 'Push changes to remote git repository',
            execute: () => { Api.push() }
        },

        check: {
            example: 'rsp-codeproj check',
            description: 'Check if the repository is up to date',
            execute: () => { Api.checkIsUpToDate() }
        },

        stage: {
            example: 'rsp-codeproj stage',
            description: 'Stage npm local project packages',
            execute: () => { Api.stage() }
        },

        commit: {
            example: 'rsp-codeproj commit',
            description: 'Commit npm local project packages',
            execute: () => { Api.commit() }
        },

        compress: {
            example: 'rsp-codeproj compress',
            description: 'Compress npm local project packages',
            execute: () => { Api.compress() }
        },

        update: {
            example: 'rsp-codeproj update',
            description: 'Commit changes & publish packages',
            execute: () => { Api.update() }
        },

        version: {
            example: 'rsp-codeproj version',
            description: '+ minor version of packages',
            execute: () => { Api.version() }
        },

        remote: {
            example: 'rsp-codeproj remote',
            description: 'Add remote origin to git repository',
            options: ['add', 'remove', 'check'],
            execute: (option) => { Api.remote(option) }
        },

        publish: {
            example: 'rsp-codeproj publish',
            description: 'Publish packages (via version)',
            execute: () => { Api.publish() }
        },

        status: {
            example: 'rsp-codeproj status',
            description: 'Check git status for subdirectories',
            execute: () => { Api.checkSubdirectoriesStatus() }
        }
    })
}

main()

export default main;
