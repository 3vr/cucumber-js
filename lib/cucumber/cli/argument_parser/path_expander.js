var fs     = require('fs');
var _      = require('underscore');
var findit = require('findit');

var PathExpander = {
  expandPathsWithRegexp: function expandPathsWithRegexp(paths, regexp) {
    var expandedPaths = [];
    paths.forEach(function(path) {
      var expandedPath = PathExpander.expandPathWithRegexp(path, regexp);
      expandedPaths    = expandedPaths.concat(expandedPath);
    });
    expandedPaths = _.uniq(expandedPaths);
    return expandedPaths;
  },

  expandPathWithRegexp: function expandPathWithRegexp(path, regexp) {
    var realPath = fs.realpathSync(path);
    var stats    = fs.statSync(realPath);
    if (stats.isDirectory()) {
      var paths = PathExpander.expandDirectoryWithRegexp(realPath, regexp);
      return paths;
    }
    else
      return [realPath];
  },

  expandDirectoryWithRegexp: function expandDirectoryWithRegexp(directory, regexp) {
    var paths = [];
    var scannedPaths = findit.sync(directory);
    scannedPaths.forEach(function(path) {
      console.log("Testing scanned path: " + path)
      if (regexp.test(path)) {
        console.log("Adding (matches " + regexp + ")" + path);
        paths.push(path);
      }
      else {
        console.log(" NOT Adding (matches " + regexp + ")" + path);
      }
    });
    return paths;
  }
};
module.exports = PathExpander;
