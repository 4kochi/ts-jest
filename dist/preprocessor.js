"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var tsc = require("typescript");
var utils_1 = require("./utils");
var glob = require('glob-all');
var nodepath = require('path');
function process(src, path, config) {
    var root = require('jest-util').getPackageRoot();
    var compilerOptions = utils_1.getTSConfig(config.globals, config.collectCoverage);
    var isTsFile = path.endsWith('.ts') || path.endsWith('.tsx');
    var isJsFile = path.endsWith('.js') || path.endsWith('.jsx');
    var isHtmlFile = path.endsWith('.html');
    if (isHtmlFile && config.globals.__TRANSFORM_HTML__) {
        src = 'module.exports=`' + src + '`;';
    }
    var processFile = compilerOptions.allowJs === true
        ? isTsFile || isJsFile
        : isTsFile;
    if (processFile) {
        var transpiled = tsc.transpileModule(src, {
            compilerOptions: compilerOptions,
            fileName: path
        });
        path = path.replace(root, '');
        if (!config.testRegex || !path.match(config.testRegex)) {
            fs.outputFileSync(nodepath.join(config.cacheDirectory, '/ts-jest/', new Buffer(path).toString('base64')), transpiled.outputText);
        }
        var start = transpiled.outputText.length > 12 ? transpiled.outputText.substr(1, 10) : '';
        var modified = start === 'use strict'
            ? "'use strict';require('ts-jest').install();" + transpiled.outputText
            : "require('ts-jest').install();" + transpiled.outputText;
        return modified;
    }
    return src;
}
exports.process = process;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUErQjtBQUMvQixnQ0FBa0M7QUFDbEMsaUNBQW9DO0FBRXBDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFakMsaUJBQXdCLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTTtJQUNyQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkQsSUFBTSxlQUFlLEdBQUcsbUJBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUU1RSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0QsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9ELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFMUMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQ3BELEdBQUcsR0FBRyxrQkFBa0IsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxJQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsT0FBTyxLQUFLLElBQUk7VUFDOUMsUUFBUSxJQUFJLFFBQVE7VUFDcEIsUUFBUSxDQUFDO0lBRWYsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQ2xDLEdBQUcsRUFDSDtZQUNJLGVBQWUsRUFBRSxlQUFlO1lBQ2hDLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUdQLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUc5QixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsRUFBRSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNySSxDQUFDO1FBRUQsSUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFM0YsSUFBTSxRQUFRLEdBQUcsS0FBSyxLQUFLLFlBQVk7Y0FDakMsK0NBQTZDLFVBQVUsQ0FBQyxVQUFZO2NBQ3BFLGtDQUFnQyxVQUFVLENBQUMsVUFBWSxDQUFDO1FBRTlELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDZixDQUFDO0FBMUNELDBCQTBDQyJ9