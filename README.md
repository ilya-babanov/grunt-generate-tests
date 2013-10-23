# grunt-generate-tests

> Generates test html for specified view html, replaces all paths in view relative to tests folder

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-generate-tests --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-generate-tests');
```

## The "generate_tests" task

### Overview
In your project's Gruntfile, add a section named `generate_tests` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  generate_tests: {
    options: {
        view: '', // path to view html
        dest: '', // destination path for test view html
        insertLibsPattern: '<!-- tests: libs -->', // patterns for test libs into your view html
        insertTestsPattern: '<!-- tests: sources -->' // patterns for test sources into your view html
    },
    files: [
        //libs for tests
        {cwd: '', src: []},
        //test sources
        {cwd:'', src: []}
    ]
  },
})
```
