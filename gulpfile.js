// Stolen from https://github.com/IamManchanda/gulp-webpack/

// Node Packages
const gulp = require('gulp');
const pump = require('pump');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const through2 = require('through2');
const gulpZip = require('gulp-zip');
const gulpUglify = require('gulp-uglify');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpPostcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssUncss = require('postcss-uncss');
const gulpSass = require('gulp-sass');
const gulpBabel = require('gulp-babel');
const gulpImagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const nodemon = require('gulp-nodemon');


const finish = (done) => (error) => {
  if (error) {
    console.error('Error!', error);
    return;
  }
  return done();
};


// Entry point retreive from webpack
const entry = require('./config/entry');

// Transform Entry point into an Array for defining in gulp file
const entryArray = Object.values(entry);

// Supported Browsers
const supportedBrowsers = [ 'last 3 versions', 'ie >= 11' ];

// Config
const autoprefixConfig = { browsers: supportedBrowsers, cascade: false };
const babelConfig = { targets: { browsers: supportedBrowsers } };

// Paths for reuse
const exportPath = './static/**/*';
const srcPath = (file, watch = false) => {
  if (file === 'scss' && watch === false) return './src/assets/scss/style.scss';
  if (file === 'scss' && watch === true) return './src/assets/scss/**/*.scss';
  if (file === 'js' && watch === false) return entryArray;
  if (file === 'js' && watch === true) return './src/assets/js/**/*.js';
  if (file === 'img') return './src/assets/images/**/*.{png,jpeg,jpg,svg,gif}';
  if (file === 'misc') return './src/assets/misc/**/*';
  return './src/assets/misc/**/*';
};
const distPath = (file, all = false) => {
  if (['css', 'js'].includes(file)) return `./dist/static/${file}`;
  if (file === 'img') return './dist/static/images';
  if (file === 'misc') {
    if (all) {
      return [
        './dist/static/**/*',
        '!./dist/static/images', '!./dist/static/images/**.*',
        '!./dist/static/css', '!./dist/static/css/**.*',
        '!./dist/static/js', '!./dist/static/js/**.*'
      ];
    } else {
      return './dist/static';
    }
  }
  return './dist/static/';
};

/**
 * Cleaning Tasks
*/

// Clean Markup Task
const cleanMisc = (mode) => () => {
  return ['development', 'production'].includes(mode) ? del([...distPath('misc', true)]) : undefined;
};

// Clean Images Task
const cleanImages = (mode) => () => {
  return ['development', 'production'].includes(mode) ? del([distPath('img')]) : undefined;
};

// Clean Styles Task
const cleanStyles = (mode) => () => {
  return ['development', 'production'].includes(mode) ? del([distPath('css')]) : undefined;
};

// Clean Scripts Task
const cleanScripts = (mode) => () => {
  return ['development', 'production'].includes(mode) ? del([distPath('js')]) : undefined;
};

// Clean the zip file
const cleanExport = (mode) => () => {
  return ['development', 'production'].includes(mode) ? del(['./website.zip']) : undefined;
};

/**
 * Building Tasks 
*/

// Build Misc Tasks
const buildMisc = (mode) => (done) => {
  ['development', 'production'].includes(mode) ? pump([
    gulp.src(srcPath('misc')),
    gulp.dest(distPath('misc')),
    browserSync.stream()
  ], finish(done)) : undefined;
};

// Build Images Task
const buildImages = (mode) => (done) => {
  ['development', 'production'].includes(mode) ? pump([
    gulp.src(srcPath('img')),
    gulpImagemin([
      gulpImagemin.gifsicle(),
      gulpImagemin.jpegtran(),
      gulpImagemin.optipng(),
      gulpImagemin.svgo(),
      imageminPngquant(),
      imageminJpegRecompress(),
    ]),
    gulp.dest(distPath('img')),
    browserSync.stream(),
  ], finish(done)) : undefined;
};

// Build Styles Task
const buildStyles = (mode) => (done) => {
  let outputStyle;
  if (mode === 'development') outputStyle = 'nested';
  else if (mode === 'production') outputStyle = 'compressed';
  else outputStyle = undefined;

  const postcssPlugins = [
    autoprefixer(autoprefixConfig),
    // postcssUncss({ html: [distPath('html')] }),
  ];
  
  ['development', 'production'].includes(mode) ? pump([
    gulp.src(srcPath('scss')),
    gulpSourcemaps.init({ loadMaps: true }),
    gulpSass({ outputStyle }),
    gulpPostcss(postcssPlugins),
    gulpSourcemaps.write('./'),
    gulp.dest(distPath('css')),
    browserSync.stream(),
  ], finish(done)) : undefined;
};

// Build Scripts Task
const buildScripts = (mode) => (done) => {
  let streamMode;
  if (mode === 'development') streamMode = require('./config/webpack.development.js');
  else if (mode === 'production') streamMode = require('./config/webpack.production.js');
  else streamMode = undefined;

  ['development', 'production'].includes(mode) ? pump([
    gulp.src(srcPath('js')),
    webpackStream(streamMode, webpack),
    gulpSourcemaps.init({ loadMaps: true }),
    through2.obj(function (file, enc, cb) {
      const isSourceMap = /\.map$/.test(file.path);
      if (!isSourceMap) this.push(file);
      cb();
    }),
    gulpBabel({ presets: [['@babel/env', babelConfig]] }),
    ...((mode === 'production') ? [gulpUglify()] : []),
    gulpSourcemaps.write('./'),
    gulp.dest(distPath('js')),
    browserSync.stream(),
  ], finish(done)) : undefined;
};


const serverIgnores = [
  'gulpfile.js',
  '*.json',
  'src/assets/**/*',
  'dist/**/*',
  'node_modules/**/*',
  'config/**/*'
];
const startServer = (mode) => (done) => {
  nodemon({
    script: 'app.js',
    ext: 'js json mst',
    ignore: serverIgnores,
  })
    .on('start', () => {
      console.log('[App] Nodemon started the App.');
    })
    .on('crash', (err) => {
      console.error('[App] App Server error: ', err);
    })
    .on('restart', () => {
      console.log('[App] App restarted.');
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, 2000);
    })
    .on('close', () => {
      console.log('[App] App closed.');
    });
  done();
};

/**
 * Generic Task for all Main Gulp Build/Export Tasks
*/

// Generic Task
const genericTask = (mode, context = 'building') => {
  let port;
  let modeName;

  if (mode === 'development') {
    modeName = 'Development Mode';
  } else if (mode === 'production') {
    modeName = 'Production Mode';
  } else {
    modeName = undefined;
  }

  // Combine all booting tasks into one array!
  const allBootingTasks = [
    Object.assign(cleanMisc(mode), { displayName: `Booting Misc Task: Clean - ${modeName}` }),
    Object.assign(buildMisc(mode), { displayName: `Booting Misc Task: Build - ${modeName}` }),
    Object.assign(cleanImages(mode), { displayName: `Booting Images Task: Clean - ${modeName}` }),
    Object.assign(buildImages(mode), { displayName: `Booting Images Task: Build - ${modeName}` }),
    Object.assign(cleanStyles(mode), { displayName: `Booting Styles Task: Clean - ${modeName}` }),
    Object.assign(buildStyles(mode), { displayName: `Booting Styles Task: Build - ${modeName}` }),
    Object.assign(cleanScripts(mode), { displayName: `Booting Scripts Task: Clean - ${modeName}` }),
    Object.assign(buildScripts(mode), { displayName: `Booting Scripts Task: Build - ${modeName}` }),
  ];

  // Browser Loading & Watching
  const browserLoadingWatching = (done) => {
    browserSync.init({
      port: 8006,
      proxy: 'localhost:8005',
      browser: 'chrome'
    });

    // Watch - Misc
    gulp.watch(srcPath('misc'), true)
      .on('all', gulp.series(
        Object.assign(cleanMisc(mode), { displayName: `Watching Misc Task: Clean - ${modeName}` }),
        Object.assign(buildMisc(mode), { displayName: `Watching Misc Task: Build - ${modeName}` }),
      ), browserSync.reload);

    // Watch - Images
    gulp.watch(srcPath('img', true))
      .on('all', gulp.series(
        Object.assign(cleanImages(mode), { displayName: `Watching Images Task: Clean - ${modeName}` }),
        Object.assign(buildImages(mode), { displayName: `Watching Images Task: Build - ${modeName}` }),
      ), browserSync.reload);

    // Watch - Styles
    gulp.watch(srcPath('scss', true))
      .on('all', gulp.series(
        Object.assign(cleanStyles(mode), { displayName: `Watching Styles Task: Clean - ${modeName}` }),
        Object.assign(buildStyles(mode), { displayName: `Watching Styles Task: Build - ${modeName}` }),
      ), browserSync.reload);

    // Watch - Scripts
    gulp.watch(srcPath('js', true))
      .on('all', gulp.series(
        Object.assign(cleanScripts(mode), { displayName: `Watching Scripts Task: Clean - ${modeName}` }),
        Object.assign(buildScripts(mode), { displayName: `Watching Scripts Task: Build - ${modeName}` }),
      ), browserSync.reload);

    done();
  };
  
  // Exporting Zip
  const exportingZip = (done) => {
    pump([
      gulp.src(exportPath),
      gulpZip('./website.zip'),
      gulp.dest('./'),
    ], finish(done));
  };

  // Returning Tasks based on Building Context
  if (context === 'building') {
    return [
      ...allBootingTasks,
      Object.assign(browserLoadingWatching, { displayName: `Browser Loading & Watching Task - ${modeName}` }),
    ];
  }
  
  // Returning Tasks based on Exporting Context 
  if (context === 'exporting') {
    return [
      cleanExport(mode), 
      ...allBootingTasks,
      Object.assign(exportingZip, { displayName: `Exporting Zip Task - ${modeName}` }),
    ];
  }

  // No Side-Effects Please
  return undefined;
};


/**
 * Main Gulp Build/Export Tasks that are inserted within `package.json`
*/

// Default (`npm start` or `yarn start`) => Production
gulp.task('default', gulp.series(...genericTask('production', 'building')));

// Dev (`npm run dev` or `yarn run dev`) => Development
gulp.task('dev', gulp.parallel(
  startServer('development'),
  gulp.series(...genericTask('development', 'building'))
));

// Export (`npm run export` or `yarn run export`)
gulp.task('export', gulp.series(...genericTask('production', 'exporting')));
