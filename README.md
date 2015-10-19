mocha-sonar-reporter
====================

[![Build Status](https://travis-ci.org/pghalliday/mocha-sonar-reporter.png)](https://travis-ci.org/pghalliday/mocha-sonar-reporter)
[![Coverage Status](https://coveralls.io/repos/pghalliday/mocha-sonar-reporter/badge.png)](https://coveralls.io/r/pghalliday/mocha-sonar-reporter)
[![Dependency Status](https://david-dm.org/pghalliday/mocha-sonar-reporter.png?theme=shields.io)](https://david-dm.org/pghalliday/mocha-sonar-reporter)
[![devDependency Status](https://david-dm.org/pghalliday/mocha-sonar-reporter/dev-status.png?theme=shields.io)](https://david-dm.org/pghalliday/mocha-sonar-reporter#info=devDependencies)

`Sonar` friendly xunit reporter.

This is a modification of the existing `xunit` reporter that ships with `Mocha`. There are 2 problems that become apparent when standard `xunit` reports are submitted to `Sonar` using the `sonar javascript` plugin.

- Sonar will reject reports that have a `classname` that mirrors a source file, eg. if you have a source file called `MyClass.js` then you cannot have a test with a `classname` of `MyClass`
- Sonar interprets the `classname` field as a filename resulting in hard to read test reports in the Sonar UI (this is probably also the cause of the first issue)

This reporter will generate `xunit` output that uses the concatenation of the suite and test titles as the test `name` and set the `classname` to:

- if `testdir` is defined in config, the test file relative path
- else a configurable constant so that name collisions can be avoided. If no `classname` is configured it will default to `Test`.

Usage
-----

Install and save to your `devDependencies`

```
npm install --save-dev mocha-sonar-reporter
```

Configure the `classname` in `package.json` (optional)

```
  ...
  "config": {
    "mocha-sonar-reporter": {
      "classname": "Test"
    }
  },
  ...
```

Configure the `testdir` in `package.json` (optional)

```
  ...
  "config": {
    "mocha-sonar-reporter": {
      "testdir": "tests",
      // Optionally configure a suffix for the extracted class names.
      // It has been reported that some versions of the sonar javascript
      // plugin require class names to have a `.js` suffix
      "classnameSuffix": ".js"
    }
  },
  ...
```

Configure the `outputfile` in `package.json`, to generate data in file instead of stdout (optional)

```
  ...
  "config": {
    "mocha-sonar-reporter": {
      "outputfile": "test/TEST-all.xml"
    }
  },
  ...
```

Add the following to your `/sonar-project.properties` file

```
sonar.javascript.jstestdriver.reportsPath=reports
```

Specify the `mocha-sonar-reporter` when running mocha

```
mocha -r mocha-sonar-reporter
```

NB. feel free to change paths and file names above ;)

NNB. Although not documented here, you may also like to use `Grunt` and the `grunt-mocha-test` plugin to do this and get coverage data, etc

Contributing
------------

Add tests for changes and run

```
npm test
```

LICENSE
-------

Copyright &copy; 2015 Peter Halliday  
Licensed under the MIT license.

[![Donate Bitcoins](http://i.imgur.com/b5BZsFH.png)](bitcoin:17LtnRG4WxRLYBWzrBoEKP3F7fZx8vcAsK?amount=0.01&label=grunt-mocha-test)

[17LtnRG4WxRLYBWzrBoEKP3F7fZx8vcAsK](bitcoin:17LtnRG4WxRLYBWzrBoEKP3F7fZx8vcAsK?amount=0.01&label=grunt-mocha-test)
