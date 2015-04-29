# Angular Material Starter

This is a boiler plate starter project for the new material design framework found at material.angularjs.org

### What is used

* Bower for managing all component dependencies
** Angular
** Angular ui-router
** Angular material
*** animate, aria
** Added in moment and lodash because I always use those libraries
* npm manages build dependencies
* gulp for build process (see below)

### How to get started

* clone the repo
* npm install
* bower install (npm does a bower update after each npm update/install)
* gulp build
** navigate to localhost:8015

### How the gulpfile works

* Commands
** gulp
*** concats and minifies vendor js into build/vendor.min.js and injects path into app/index.html
*** concats all src js files into build/app.js and injects path into app/index.html
*** generates a templates.js file from all templates and injects path into app/index.html
*** concats and minifies vendor css into build/vendor-styles.min.css and injects  path into app/index.html
*** runs sass and generates src css and injects build/styles.css path into app/index.html
*** spins up a node server on port 8015 and watches all js/css/templates and reruns the build process on change

** gulp dist
*** bumps version in package.json and bower.json
*** creates a new folder in the dist folder by version number
*** concats and minifies vendor js into dist/(version)/vendor.min.js and injects path into app/index.html
*** concats all src js files into dist/(version)/app.js and injects path into app/index.html
*** concats and minifies vendor css into dist/(version)/vendor-styles.min.css and injects  path into app/index.html
*** runs sass and generates src css and injects dist/(version)/styles.css path into app/index.html