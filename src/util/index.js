import fs from 'fs';
import url from 'url';
import path from 'path';
import RSp from '@ropsoft/rsp-libcore.js';

const logger = new RSp.Logger({ debug: true });

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const __basedir = path.resolve(__dirname, '..', '..')
const __package = path.join(__basedir, 'package.json')

const getPackageInfo = () => {
    return JSON.parse(fs.readFileSync(__package, 'utf-8'))
}

export default {
    getPackageInfo
}