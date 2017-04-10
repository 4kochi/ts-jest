"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var includes = require("lodash.includes");
var partition = require("lodash.partition");
var loadCoverage = require('remap-istanbul/lib/loadCoverage');
var remap = require('remap-istanbul/lib/remap');
var writeReport = require('remap-istanbul/lib/writeReport');
var istanbulInstrument = require('istanbul-lib-instrument');
var pickBy = require("lodash.pickby");
var utils_1 = require("./utils");
var glob = require('glob-all');
function processResult(result) {
    var root = require('jest-util').getPackageRoot();
    var jestConfig = utils_1.getJestConfig(root).config;
    var sourceCache = {};
    var coveredFiles = [];
    var basepath = path.join(jestConfig.cacheDirectory, '/ts-jest/');
    if (!fs.existsSync(basepath)) {
        fs.mkdirSync(basepath);
    }
    var cachedFiles = fs.readdirSync(basepath);
    cachedFiles.map(function (p) {
        var filename = new Buffer(p.replace(basepath, ''), 'base64').toString('utf8');
        filename = root + filename;
        coveredFiles.push(filename);
        sourceCache[filename] = fs.readFileSync(path.join(basepath, p), 'ascii');
    });
    if (!jestConfig.testResultsProcessor)
        return result;
    var coverageConfig = {
        collectCoverage: jestConfig.collectCoverage ? jestConfig.collectCoverage : true,
        coverageDirectory: jestConfig.coverageDirectory ? jestConfig.coverageDirectory : './coverage/',
        coverageReporters: jestConfig.coverageReporters
    };
    var coverageCollectFiles = coverageConfig.collectCoverage &&
        jestConfig.testResultsProcessor &&
        jestConfig.collectCoverageFrom &&
        jestConfig.collectCoverageFrom.length ?
        glob.sync(jestConfig.collectCoverageFrom).map(function (x) { return path.resolve(root, x); }) : [];
    if (!coverageConfig.collectCoverage)
        return result;
    var coverage;
    try {
        coverage = [pickBy(result.coverageMap.data, function (_, fileName) { return includes(coveredFiles, fileName); })];
    }
    catch (e) {
        return result;
    }
    var uncoveredFiles = partition(coverageCollectFiles, function (x) { return includes(coveredFiles, x); })[1];
    var coverageOutputPath = path.join(coverageConfig.coverageDirectory || 'coverage', 'remapped');
    var emptyCoverage = uncoveredFiles.map(function (x) {
        var ret = {};
        if (sourceCache[x]) {
            var instrumenter = istanbulInstrument.createInstrumenter();
            instrumenter.instrumentSync(sourceCache[x], x);
            ret[x] = instrumenter.fileCoverage;
        }
        return ret;
    });
    var mergedCoverage = loadCoverage(coverage.concat(emptyCoverage), { readJSON: function (t) { return t ? t : {}; } });
    var coverageCollector = remap(mergedCoverage, {
        readFile: function (x) {
            var key = path.normalize(x);
            var source = sourceCache[key];
            delete sourceCache[key];
            return source;
        }
    });
    writeReport(coverageCollector, 'html', {}, path.join(coverageOutputPath, 'html'));
    writeReport(coverageCollector, 'lcovonly', {}, path.join(coverageOutputPath, 'lcov.info'));
    writeReport(coverageCollector, 'json', {}, path.join(coverageOutputPath, 'coverage.json'));
    writeReport(coverageCollector, 'text', {}, path.join(coverageOutputPath, 'coverage.txt'));
    return result;
}
module.exports = processResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY292ZXJhZ2Vwcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY292ZXJhZ2Vwcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNkI7QUFDN0IsdUJBQXlCO0FBQ3pCLDBDQUE2QztBQUM3Qyw0Q0FBK0M7QUFDL0MsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDaEUsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDbEQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDOUQsSUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUM5RCxzQ0FBd0M7QUFDeEMsaUNBQXdDO0FBQ3hDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQXNCakMsdUJBQXVCLE1BQWM7SUFDbkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ25ELElBQU0sVUFBVSxHQUFHLHFCQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzlDLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUNyQixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFFdEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN4QixDQUFDO0lBQ0QsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMz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