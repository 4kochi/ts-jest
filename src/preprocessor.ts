import * as fs from 'fs-extra';
import * as tsc from 'typescript';
import {getTSConfig, getJestConfig, REPLACE_TOKEN} from './utils';
// TODO: rework next to ES6 style imports
const glob = require('glob-all');
const nodepath = require('path');

export function process(src, path, config) {
    const compilerOptions = getTSConfig(config.globals, config.collectCoverage);
    const root = require('jest-util').getPackageRoot();
    const jestConfig = getJestConfig(root).config;

    const isTsFile = path.endsWith('.ts') || path.endsWith('.tsx');
    const isJsFile = path.endsWith('.js') || path.endsWith('.jsx');
    const isHtmlFile = path.endsWith('.html');

    if (isHtmlFile && config.globals.__TRANSFORM_HTML__) {
      src = 'module.exports=`' + src + '`;';
    }

    const processFile = compilerOptions.allowJs === true
        ? isTsFile || isJsFile
        : isTsFile;

    if (processFile) {
        const transpiled = tsc.transpileModule(
            src,
            {
                compilerOptions: compilerOptions,
                fileName: path
            });

        if (jestConfig.globals.__REPLACE_FILE_NAME_PART__){
            path = path.replace(jestConfig.globals.__REPLACE_FILE_NAME_PART__, REPLACE_TOKEN);
        }

        //store transpiled code contains source map into cache, except test cases
        if (!config.testRegex || !path.match(config.testRegex)) {
            fs.outputFileSync(nodepath.join(config.cacheDirectory, '/ts-jest/', new Buffer(path).toString('base64')), transpiled.outputText);
        }

        const start = transpiled.outputText.length > 12 ? transpiled.outputText.substr(1, 10) : '';

        const modified = start === 'use strict'
            ? `'use strict';require('ts-jest').install();${transpiled.outputText}`
            : `require('ts-jest').install();${transpiled.outputText}`;

        return modified;
    }

    return src;
}
