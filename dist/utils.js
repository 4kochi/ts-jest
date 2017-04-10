"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsc = require("typescript");
var path = require("path");
var fs = require("fs");
var tsconfig = require("tsconfig");
var assign = require("lodash.assign");
var normalize = require('jest-config').normalize;
var setFromArgv = require('jest-config/build/setFromArgv');
function parseConfig(argv) {
    if (argv.config && typeof argv.config === 'string') {
        if (argv.config[0] === '{' && argv.config[argv.config.length - 1] === '}') {
            return JSON.parse(argv.config);
        }
    }
    return argv.config;
}
function loadJestConfigFromFile(filePath, argv) {
    var config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    config.rootDir = config.rootDir ?
        path.resolve(path.dirname(filePath), config.rootDir) :
        process.cwd();
    return normalize(config, argv);
}
function loadJestConfigFromPackage(filePath, argv) {
    var R_OK = fs.constants && fs.constants.R_OK || fs['R_OK'];
    try {
        fs.accessSync(filePath, R_OK);
    }
    catch (e) {
        return null;
    }
    var packageData = require(filePath);
    var config = packageData.jest || {};
    var root = path.dirname(filePath);
    config.rootDir = config.rootDir ? path.resolve(root, config.rootDir) : root;
    return normalize(config, argv);
}
function readRawConfig(argv, root) {
    var rawConfig = parseConfig(argv);
    if (typeof rawConfig === 'string') {
        return loadJestConfigFromFile(path.resolve(process.cwd(), rawConfig), argv);
    }
    if (typeof rawConfig === 'object') {
        var config = assign({}, rawConfig);
        config.rootDir = config.rootDir || root;
        return normalize(config, argv);
    }
    var packageConfig = loadJestConfigFromPackage(path.join(root, 'package.json'), argv);
    return packageConfig || normalize({ rootDir: root }, argv);
}
function getJestConfig(root) {
    var yargs = require('yargs');
    var argv = yargs(process.argv.slice(2)).argv;
    var rawConfig = readRawConfig(argv, root);
    return Object.freeze(setFromArgv(rawConfig, argv));
}
exports.getJestConfig = getJestConfig;
function getTSConfig(globals, collectCoverage) {
    if (collectCoverage === void 0) { collectCoverage = false; }
    var config = (globals && globals.__TS_CONFIG__) ? globals.__TS_CONFIG__ : 'tsconfig.json';
    if (typeof config === 'string') {
        var configFileName = config;
        var configPath = path.resolve(configFileName);
        var fileContent = fs.readFileSync(configPath, 'utf8');
        var external_1 = tsconfig.parse(fileContent, configPath);
        config = external_1.compilerOptions || {};
        if (typeof external_1.extends === 'string') {
            var parentConfigPath = path.join(path.dirname(configPath), external_1.extends);
            var includedContent = fs.readFileSync(parentConfigPath, 'utf8');
            config = Object.assign({}, tsconfig.parse(includedContent, parentConfigPath).compilerOptions, config);
        }
        if (configFileName === 'tsconfig.json') {
            config.module = 'commonjs';
        }
    }
    config.module = config.module || 'commonjs';
    if (config.inlineSourceMap !== false) {
        config.inlineSourceMap = true;
    }
    config.jsx = config.jsx || tsc.JsxEmit.React;
    if (collectCoverage) {
        if (config.sourceMap) {
            delete config.sourceMap;
        }
        config.inlineSourceMap = true;
        config.inlineSources = true;
    }
    return tsc.convertCompilerOptionsFromJson(config, undefined).options;
}
exports.getTSConfig = getTSConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBa0M7QUFDbEMsMkJBQTZCO0FBQzdCLHVCQUF5QjtBQUN6QixtQ0FBcUM7QUFFckMsc0NBQXlDO0FBQ3pDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDbkQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFFN0QscUJBQXFCLElBQUk7SUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDckIsQ0FBQztBQUVELGdDQUFnQyxRQUFRLEVBQUUsSUFBSTtJQUM1QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNwRCxP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