const gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  del = require('del'),
  bs = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  rollup = require('rollup')

const clean = () => del(['dest'])

const copy = () => gulp
  .src('./src/assets/**/*.*')
  .pipe(gulp.dest('./dest/assets/'))

const reload = done => {
  bs.reload();
  done();
}

const serve = done => {
  bs.init({
    open: false,
    notify: false,
    server: {
      baseDir: 'dest'
    }
  });
  done();
}

const views = () => gulp
  .src('./src/index.html')
  .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
  // .pipe(plumber())
  // .pipe(pug())
  .pipe(gulp.dest('./dest/'));

const styles = () => gulp
  .src('./src/index.css')
  // .pipe(postcss([tailwindcss('tailwind.js'), autoprefixer()]))
  .pipe(gulp.dest('./dest/css'))
  .pipe(bs.reload({stream: true}));

const scripts = () => rollup
  .rollup({input: './src/index.js'})
  .then(bundle => bundle.write({file: './dest/js/index.js', format: 'iife'}))

const watchHTML = () => gulp.watch(['./src/**/*.html'], gulp.series(views, reload));
const watchScripts = () => gulp.watch(['./src/**/*.js'], gulp.series(scripts, reload));
const watchStyles = () => gulp.watch(['./src/**/*.css'], gulp.series(styles));
const watchAssets = () => gulp.watch(['./src/assets/*.*'], gulp.series(copy, reload));

const dev = gulp.series(clean, copy, views, scripts, styles, serve, gulp.parallel(watchHTML, watchScripts, watchStyles, watchAssets));

exports.default = dev;
