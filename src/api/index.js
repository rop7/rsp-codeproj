import fs from 'fs';
import path from 'path';
import shelljs from 'shelljs';
import { v4 as uuidv4 } from 'uuid';
import RSp from '@rop7/rsp-libcore.js';

const exec = shelljs.exec;
const logger = new RSp.Logger();

class Commands {

    constructor(option = {}, params = {}) {
        this.option = option
        this.params = params
        this.exec = shelljs.exec
    }

    up() {
        this.version()
        this.stage()
        this.commit()
        this.compress()
        this.push()
        this.publish()
    }

    init() {
        this.exec(`git init`)
    }

    stage() {
        this.exec(`git stage .`)
    }

    push() {
        this.exec(`git push origin dev`)
    }

    publish() {
        this.exec("npm publish");
    }

    commit() {

        const remoteCheck = this.exec(`git remote get-url origin`, { silent: true });

        if (remoteCheck.code !== 0) {
            logger.error('Remote origin not set. Please add a remote origin first.', { breakup: true });
            return;
        }
        
        logger.subhead(`Committing changes:`);

        let result = this.exec(`git commit -m ${uuidv4()}`, { silent: true });
            result = result.stderr || result.stdout;

        if (result.includes('nothing to commit')) {
            logger.info('No changes to commit');
        } else if (result.includes('branch is ahead')) {
            logger.info('Your branch is ahead of the remote branch.');
        } else if (result.includes('not staged')) {
            logger.info('You have unstaged changes. Please stage them before committing.');
        } else if (result.includes('Unmerged')) {
            logger.info('You have unmerged paths. Please resolve conflicts before committing.');
        } else if (result.includes('error')) {
            logger.error(result.trim() || 'Failed to commit changes');
            logger.info('Please check your changes and try again.', { breakup: false });
            logger.info('You can stage changes by running: `rsp-codeproj stage`', { breakup: false });
        } else {
            logger.success(result.trim() || 'Changes committed successfully.');
        }
    }

    compress() {
        this.exec(`git gc --aggressive; git repack -a -d --depth=250 --window=250;`)
    }

    version() {
        this.exec("npm version minor --no-git-tag-version");
    }

    update() {
        this.exec(`git stage .`)
        this.exec(`git commit -m ${uuidv4()}`)
    }

    remote (option) {

        if (option === 'remove') {
            
            logger.subhead(`Removing remote origin:`);
            
            let resultRemove = this.exec(`git remote remove origin`, { silent: true });
            
            if (resultRemove.code !== 0) {
                logger.error(resultRemove.stderr.trim() || 'Failed to remove remote origin');
                return;
            }

            logger.success('Remote origin removed successfully.');
            
            return;
        }

        if (option === 'check') {
            
            const remoteUrl = this.exec(`git remote get-url origin`, { silent: true }).stdout.trim();
            
            if (remoteUrl) {
                logger.subhead(`Remote origin URL:`);
                logger.success(remoteUrl);
            } else {
                logger.error('No remote origin set.', { breakup: true });
                logger.info('Add remote origin by: `rsp-codeproj remote add`');
            }
        }

        if (option === 'add') {

            const gitUserName = this.exec(`git config --global user.name`, { silent: true }).stdout.trim();
            
            if (!gitUserName) {
                logger.error('Git user name is not set. Please configure it using `git config --global user.name "Your Name"`');
                return;
            }

            const rootDirName = path.parse(process.cwd()).name;
            const remoteOriginUrl = `git@github.com:${gitUserName}/${rootDirName}.git`;

            let addRemoteResult = this.exec(`git remote add origin ${remoteOriginUrl}`, { silent: true });

            if (addRemoteResult.code !== 0) {
                logger.error(addRemoteResult.stderr.trim() || 'Failed to add remote origin', { breakup: true });
            } else {
                logger.subhead(`Adding remote origin:`);
                logger.success(remoteOriginUrl);
            }
        }
    }

    checkSubdirectoriesStatus() {

        const dirs = fs.readdirSync(process.cwd(), { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        dirs.forEach(dir => {
            const gitDir = path.join(dir, '.git');
            if (fs.existsSync(gitDir)) {
                logger.info(`\n📁 ${dir}`);
                const result = shelljs.exec(`cd ${dir} && git status --short`, { silent: true });
                logger.info(result.stdout || '(clean)');
            }
        });
    }
}

const instance = new Commands()

export default instance;

