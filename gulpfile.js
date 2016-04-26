'use strict';

var gulp = require('gulp');
var webpack = require('webpack');

var gutil = require('gulp-util');

var webpackConf = require('./webpack.config');
var webpackDevConf = require('./webpack.config');

var src = process.cwd() + '/src';
var dist = process.cwd() + '/dist';

// js check
gulp.task('hint', function() {
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');

    return gulp.src([
            '!' + src + '/js/lib/**/*.js',
            src + '/js/**/*.js'
        ])
        .pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
        .pipe(jshint.reporter(stylish));
});

// clean dist
gulp.task('clean', ['hint'], function() {
    var clean = require('gulp-clean');

    return gulp.src(dist, {read: true}).pipe(clean());
});

// run webpack pack
gulp.task('pack', ['clean'], function(done) {
    webpack(webpackConf, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
});

// merge static images from src to dist for html <img> tag
gulp.task('mergeimages', ['pack'], function() {
    gulp.src(src + '/img/ZeroClipboard.swf').pipe(gulp.dest(dist + '/js'))
    gulp.src(src + '/img/**').pipe(gulp.dest(dist + '/img'))
})



// html process
gulp.task('default', ['mergeimages'], function() {
    var replace = require('gulp-replace');
    var htmlmin = require('gulp-htmlmin');

    return gulp
        .src(dist + '/*.html')
        .pipe(replace(/<script(.+)?data-debug([^>]+)?><\/script>/g, ''))
        // @see https://github.com/kangax/html-minifier
        .pipe(htmlmin({
            // collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(dist));
});



