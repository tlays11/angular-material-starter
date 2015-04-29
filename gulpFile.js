var gulp            = require('gulp');
var concat          = require('gulp-concat');
var jshint          = require('gulp-jshint');
var ngAnnotate      = require('gulp-ng-annotate');
var uglify          = require('gulp-uglify');
var templateCache   = require("gulp-angular-templatecache");
var minifyCSS       = require("gulp-minify-css");
var sass            = require("gulp-sass");
var del             = require("del");
var bump            = require("gulp-bump");
var inject          = require("gulp-inject");
var connect         = require("gulp-connect");
var appName         = "ttstarter";  // angular module name
var ui              = null;         // instantiating ui variable for pulling version from package.json

module.exports = gulp;

var paths = {

    //Paths to vendor js files to be included
    bowerjs: [
        'bower_components/lodash/lodash.min.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-material/angular-material.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js'
    ],

    //Paths to vendor css files to be included
    bowercss: [
        'bower_components/angular-material/angular-material.min.css'
    ],

    // App scripts
    scripts: [
        'app/src/js/**/*.js'
    ],

    // App templates
    templates: [
        'app/src/view/**/*.html'
    ],

    // App styles
    styles: [
        'app/src/scss/**/*.scss'
    ],
    
    injectFile: 'app/index.html'
};
gulp.task("clean", function(cb) {
    del(
        [
            'app/build'
        ],
        {
            force: true     // force clean outside of working dir
        },
        cb
    );
});

gulp.task("build-vendor", ['clean'], function() {
    return gulp.src(paths.bowerjs)
        .pipe(concat("vendor.min.js"))
        .pipe(gulp.dest('app/build'));
});

gulp.task("dist-vendor", ['build-vendor', 'load-ui'], function() {
    return gulp.src("app/build/vendor.min.js")
        .pipe(gulp.dest('app/dist/' + ui.version));
});

gulp.task('build-templates', ['clean'], function() {
    return gulp.src(paths.templates)
        .pipe(templateCache('templates.js',{module:appName}))
        .pipe(gulp.dest("app/build"));
});

gulp.task('build-app', ['clean', 'build-templates'], function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/build'));
});

gulp.task('dist-app', ['build-app', 'load-ui'], function() {
    return gulp.src(['app/build/app.js', 'app/build/templates.js'])
        .pipe(ngAnnotate())
        .pipe(uglify({mangle:false}))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('app/dist/' + ui.version));
});

gulp.task('build-css', ['clean', 'vendor-css'], function() {
    return gulp.src(paths.styles)
        .pipe(sass({
          sourceComments: 'none',
          sourceMap: 'sass',
          outputStyle: 'compressed'
        }))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('app/build'));
});

gulp.task('vendor-css', ['clean'], function() {
    return gulp.src(paths.bowercss)
        .pipe(minifyCSS({compatibility: 'ie8'}))
        .pipe(concat('vendor-styles.min.css'))
        .pipe(gulp.dest('app/build'));
});

gulp.task("dist-vendor-css", ['vendor-css', 'load-ui'], function() {
    return gulp.src("app/build/vendor-styles.min.css")
        .pipe(gulp.dest('app/dist/' + ui.version));
});

gulp.task('dist-css', ['build-css', 'dist-vendor-css', 'load-ui'], function() {
   return gulp.src('app/build/styles.css')
       .pipe(minifyCSS())
       .pipe(concat("styles.min.css"))
       .pipe(gulp.dest('app/dist/' + ui.version));
});

gulp.task('build-inject', ['build-app', 'build-vendor', 'build-css'], function() {
    return gulp.src("app/index.html")
        .pipe(inject(gulp.src("app/build/vendor.min.js", {read: false}), {starttag: '<!-- inject:vendor:{{ext}} -->', ignorePath: 'app/', addRootSlash: false}))
        .pipe(inject(gulp.src("app/build/vendor-styles.min.css", {read: false}), {starttag: '<!-- inject:vendor:{{ext}} -->', ignorePath: 'app/', addRootSlash: false}))
        .pipe(inject(gulp.src(["app/build/*.js", "!app/build/vendor.min.js", "app/build/*.css", "!app/build/vendor-styles.min.css"], {read: false}), {ignorePath: 'app/', addRootSlash: false}))
        .pipe(inject(gulp.src(paths.injectFile), {
            starttag: '<!-- inject:version -->',
            transform: function (filePath, file) {
                // return file contents as string
                return '<script>var APP_VERSION = ".devBuild";</script>';
            }
        }))
        .pipe(gulp.dest("app"));
});

gulp.task('dist-inject', ['dist-app', 'dist-vendor', 'dist-css'], function() {
    return gulp.src("app/index.html")
        .pipe(inject(gulp.src("app/dist/" + ui.version + "/vendor.min.js", {read: false}), {starttag: '<!-- inject:vendor:{{ext}} -->', ignorePath: 'app/', addRootSlash: false}))
        .pipe(inject(gulp.src("app/dist/" + ui.version + "/vendor-styles.min.css", {read: false}), {starttag: '<!-- inject:vendorcss:{{ext}} -->', ignorePath: 'app/', addRootSlash: false}))
        .pipe(inject(gulp.src(["app/dist/" + ui.version + "/*.js", "!app/dist/" + ui.version + "/vendor.min.js",  "dist/" + ui.version + "/*.css"], {read: false}), {ignorePath: 'app/', addRootSlash: false}))
        .pipe(inject(gulp.src(paths.injectFile), {
            starttag: '<!-- inject:version -->',
            transform: function (filePath, file) {
                // return file contents as string
                return '<script>var APP_VERSION = "' + ui.version + '";</script>';
            }
        }))
        .pipe(gulp.dest("app"));
});

gulp.task('bump-major', function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type:'major'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});

gulp.task('load-ui', ['bump-patch'], function(cb) {
    // load the package.json
    ui = require('./package.json');
    cb();
});


gulp.task('server', ['build-inject'], function() {
    connect.server({
        port: 8015,
        root: 'app',
        fallback: 'app/index.html',
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch([paths.styles, paths.scripts, paths.templates, 'src/index.html'], ['build-vendor', 'build-app', 'build-templates', 'build-css', 'build-inject'])
});

gulp.task('default', ['build-vendor', 'build-app', 'build-templates', 'build-css', 'build-inject', 'server', 'watch']);

gulp.task('dist', ['bump-patch', 'load-ui', 'dist-vendor', 'dist-app', 'dist-css', 'dist-inject']);
