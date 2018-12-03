var gulp       = require('gulp'),
    fs         = require('fs'),
    concat     = require('gulp-concat'),
    watch      = require('gulp-watch'),
    rename     = require('gulp-rename'),
    jshint     = require('gulp-jshint'),
    replace    = require('gulp-replace'),
    uglify     = require('gulp-uglify'),
    uglifycss  = require('gulp-uglifycss'),
    stripDebug = require('gulp-strip-debug');

var js_path       = './assets/js/';
var template_path = './assets/templates/';
var css_path      = './assets/css/';

gulp.task('js', function () {
    gulp.src([
        js_path + 'module-api.js',
        js_path + 'module-controller.js',
        js_path + 'module-view.js',
        js_path + 'models/**/*.js',
        js_path + 'index.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('scripts.package.js'))
        .pipe(gulp.dest( js_path + 'dist/' ))
        .pipe(rename('scripts.package.min.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest( js_path + 'dist/' ));
});

gulp.task('css', function () {
    gulp.src([ css_path + '/*.css' ])
        .pipe(concat('styles.package.css'))
        .pipe(gulp.dest( css_path + 'dist/' ))
        .pipe(rename('styles.package.min.css'))
        .pipe(uglifycss({
            'maxLineLen': 80,
            'uglyComments': true
        }))
        .pipe(gulp.dest( css_path + 'dist/' ));
});

gulp.task('templates', function () {
    gulp.src([
        template_path + 'template-view-*.html',
        template_path + 'template-partial-*.html',
    ]).pipe(concat('templates.package.html'))
      .pipe(gulp.dest( './' )).on('end', function() {

        gulp.src([ template_path + 'template-index.html' ])
            .pipe(replace( '{{ templates }}', fs.readFileSync( './templates.package.html', 'utf8' ) ))
            .pipe(concat('index.html'))
            .pipe(gulp.dest( './' ));
    })

});

gulp.task('watch', ['js', 'css', 'templates'], function () {
    gulp.watch( [
        js_path + '**/*',
        '!' + js_path + 'dist/',
    ], ['js']);
    gulp.watch( [
        css_path + '**/*',
        '!' + css_path + 'dist/',
    ], ['css']);
    gulp.watch( [
        template_path + '**/*'
    ], ['templates']);
});

gulp.task('default', ['watch']);