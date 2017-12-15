var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var addSrc = require('gulp-add-src');
var merge = require('merge-stream');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');

var htmlFiles = [
  './elements/**/*.html'];

var sassFiles = [
  './global/*.scss',
  './components/**/*.scss',
  './pages/**/*.scss'];

var cssFiles = [
  './global/*.css',
  './components/**/*.css',
  './pages/**/*.css'];

var jsFiles = [
  './global/client.js',
  './global/client/*.js',
  './global/client.jsx',
  './global/client/*.jsx',
  './pages/**/client.js',
  './pages/**/client/*.js',
  './pages/**/client.jsx',
  './pages/**/client/*.jsx',
  './components/**/client.js',
  './components/**/client/*.js',
  './components/**/client.jsx',
  './components/**/client/*.jsx',
  './elements/**/*.js'];

gulp.task('sass', function () {
  var sassStream = gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError));

  var cssStream = gulp.src(cssFiles)
    .pipe(filter("*.css"));

  return merge(sassStream, cssStream)
    .pipe(concat('build.css'))
    .pipe(gulp.dest('./build'));
});

gulp.task('sass:watch', function () {
  gulp.watch(sassFiles, ['sass']);
});

gulp.task('js', function () {
  return gulp.src(jsFiles)
    .pipe(gulpWebpack(require('./webpack.config.js'), webpack))
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('js:watch', function () {
  gulp.watch(jsFiles, ['js']);
  gulp.watch(htmlFiles, ['js']);
});

gulp.task('default', ['sass', 'sass:watch', 'js', 'js:watch']);
