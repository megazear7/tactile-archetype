var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var addSrc = require('gulp-add-src');
var merge = require('merge-stream');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var minify = require('gulp-minify');

var polymerHtmlFiles = [
  './elements/**/*.html'];

var sassFiles = [
  './tactile/client/*.scss',
  './global/*.scss',
  './components/**/*.scss',
  './pages/**/*.scss'];

var cssFiles = [
  './tactile/client/*.css',
  './global/*.css',
  './components/**/*.css',
  './pages/**/*.css'];

var clientJsEntryPoints = [
  'tactile/client/*.js',
  './components/reactInit.js',
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

var clientJsWatchPoints = [
  './components/reactInit.js']
  .concat(clientJsEntryPoints)
  .concat(polymerHtmlFiles);

gulp.task('sass', function () {
  var sassStream = gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError));

  var cssStream = gulp.src(cssFiles)
    .pipe(filter("*.css"));

  return merge(sassStream, cssStream)
    .pipe(concat('build.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
  gulp.watch(sassFiles, ['sass']);
});

gulp.task('js', function () {
  return gulp.src(clientJsEntryPoints)
    .pipe(gulpWebpack(require('./webpack.devconfig.js'), webpack))
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js:prod', function () {
  return gulp.src(clientJsEntryPoints)
    .pipe(gulpWebpack(require('./webpack.prodconfig.js'), webpack))
    .pipe(minify())
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js:watch', function () {
  gulp.watch(clientJsWatchPoints, ['js']);
});

gulp.task('default', ['sass', 'sass:watch', 'js', 'js:watch']);

gulp.task('deploypack', ['sass', 'js:prod']);
