var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    watch  = require('gulp-watch'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug');

var js_path       = 'assets/js/';
var template_path = 'assets/templates/';
var css_path      = 'assets/css/';

gulp.task('js', function () {
    gulp.src([
        js_path + ''
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('questionnaire.package.js'))
        .pipe(gulp.dest( fmce_js_source + 'dist/' ))
        .pipe(rename('questionnaire.package.min.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest( fmce_js_source + 'dist/' ));
});

gulp.task('copy_fm', function() {
    return gulp.src( fm_source + '**/*')
        .pipe(gulp.dest( dev_source + fm_source ))
});

/* ACF json files are saved to the wordpress.local project since they are modified through the WP admin
 * We want to copy them to the tespo.local project so that they are synced into the repo
 */
gulp.task('copy_acf_json', function() {
    return gulp.src( dev_source + acf_wp_source + '**/*')
        .pipe(gulp.dest( acf_wp_source ))
});

gulp.task('watch', ['js', 'copy_acf_json', 'copy_fm'], function () {

    // Watch all ACF json files within the FMCE directory
    gulp.watch( dev_source + acf_wp_source + '**/*.json', ['copy_acf_json']);

    // Watch all files within the FMCE directory, ignore the dist folder so we aren't doing a loop
    gulp.watch( [
        fm_source + '**/*',
        '!' + fm_source + 'fm-core-extended/assets/js/{dist/**}'
    ], ['js','copy_fm']);

});

gulp.task('default', ['watch']);
