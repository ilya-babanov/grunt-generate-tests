/*
 * grunt-generate-tests
 */

'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks
	var path = require('path'),
		options,
		destDir;

	grunt.registerMultiTask('generate-tests', 'Generates test html for specified view html, replaces all paths in view relative to tests folder', function() {
		options = this.options();
		destDir = path.dirname(options.dest);
		var viewFile = grunt.file.read(options.view),
			viewDir = path.dirname(options.view),
			allTestsNodes = [];

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			var cwd = f.cwd,
				nodes = '';
			f.src.forEach(function(filePath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(cwd+filePath)) {
					grunt.log.warn('Source file "' + filePath + '" not found.');
				} else {
					var relativePath = getRelativeDestPath(cwd+filePath);
					nodes += createNode(relativePath) + '\n';
				}
			});
			allTestsNodes.push(nodes);
		});
		if (allTestsNodes.length !== 2) {
			grunt.log.warn('You should define sources for libs and for tests both (in \'files\' array).');
		} else {
			viewFile = insertSources(replacePaths(viewFile, viewDir), allTestsNodes);
			grunt.file.write(options.dest, viewFile);
			grunt.log.write('Created ' + options.dest);
		}
	});

	function insertSources(htmlString, sourcesArray) {
		htmlString = htmlString.replace(options.insertLibsPattern, sourcesArray[0]);
		htmlString = htmlString.replace(options.insertTestsPattern, sourcesArray[1]);
		return htmlString;
	}

	function replacePaths(htmlString, fileDir) {
		var attrRegExp = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;
		return htmlString.replace(attrRegExp, function (attr, attrName, attrValue) {
			if (attrName === 'src' || attrName === 'href') {
				return attrName + '='
					+ '"'
					+ (getRelativeDestPath(path.resolve(fileDir, attrValue)) || attrValue)
					+ '"';
			} else {
				return attr;
			}
		});
	}

	function createNode(filePath) {
		if (/\.css$/.test(filePath)) {
			return createStyleNode(filePath);
		} else if (/\.js$/.test(filePath)) {
			return createScriptNode(filePath);
		}  else {
			return '';
		}
	}

	function createStyleNode(filePath) {
		return '<link rel="stylesheet" type="text/css" href="'+filePath+'">';
	}
	function createScriptNode(filePath) {
		return '<script type="text/javascript" src="'+filePath+'"></script>';
	}

	function getRelativeDestPath(filePath) {
		return unixifyPath(path.relative(destDir, filePath));
	}

	function unixifyPath(filePath) {
		if (process.platform === 'win32') {
			return filePath.replace(/\\/g, '/');
		} else {
			return filePath;
		}
	}

};
