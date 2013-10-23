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

	grunt.registerMultiTask('generateTests', 'Generates test html for specified view html, inject specified test libs and test sources, replaces all paths in test view relative to tests folder', function() {
		options = this.options();
		destDir = path.dirname(options.dest);
		var viewFile = grunt.file.read(options.view),
			viewDir = path.dirname(options.view),
			allTestsNodes = [];

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			var cwd = f.cwd || '',
				nodes = '';
			f.src.forEach(function(filePath) {
				if (!grunt.file.exists(cwd+filePath)) {
					// Warn on and remove invalid source files (if nonull was set).
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

	/**
	 * Inserts sources to html in places according to specified patterns
	 * @param {string} htmlString
	 * @param {Array} sourcesArray
	 * @returns {string}
	 */
	function insertSources(htmlString, sourcesArray) {
		htmlString = htmlString.replace(options.insertLibsPattern, sourcesArray[0]);
		htmlString = htmlString.replace(options.insertTestsPattern, sourcesArray[1]);
		return htmlString;
	}

	/**
	 * Search for src/href attributes and replace its values according to the new directory
	 * @param {string} htmlString
	 * @param {string} fileDir
	 * @returns {string}
	 */
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

	/**
	 * Create string representation of HTML node (<style> or <script>, depending on filePath)
	 * @param {string} filePath
	 * @returns {string}
	 */
	function createNode(filePath) {
		if (/\.css$/.test(filePath)) {
			return createStyleNode(filePath);
		} else if (/\.js$/.test(filePath)) {
			return createScriptNode(filePath);
		}  else {
			return '';
		}
	}

	/**
	 * Create string representation of the <style> node
	 * @param filePath
	 * @returns {string}
	 */
	function createStyleNode(filePath) {
		return '<link rel="stylesheet" type="text/css" href="'+filePath+'">';
	}

	/**
	 * Create string representation of the <script> node
	 * @param filePath
	 * @returns {string}
	 */
	function createScriptNode(filePath) {
		return '<script type="text/javascript" src="'+filePath+'"></script>';
	}

	/**
	 * Get path relative to destDir
	 * @param filePath
	 * @returns {string}
	 */
	function getRelativeDestPath(filePath) {
		return unixifyPath(path.relative(destDir, filePath));
	}

	/**
	 * Replace backslashes if needed
	 * @param filePath
	 * @returns {string}
	 */
	function unixifyPath(filePath) {
		if (process.platform === 'win32') {
			return filePath.replace(/\\/g, '/');
		} else {
			return filePath;
		}
	}

};
