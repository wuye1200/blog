

/**
 * 组件安装
 * npm install gulp-util gulp-imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev
 */

// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
	minifyHtml = require("gulp-minify-html"),
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩



    imagemin = require('gulp-imagemin'),       //图片压缩
    pngquant = require('imagemin-pngquant'), //png图片压缩插件


    // sass = require("gulp-sass"),         //sass
    // less = require("gulp-less"),          //less

    rename  = require('gulp-rename'),          //合并文件
    rev = require('gulp-rev'),          //合并文件
    // concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean')             //清空文件夹

    livereload = require('gulp-livereload');   //livereload

var  babel = require('gulp-babel');

var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");

gulp.task('browserify', function(){
  return browserify('src/js/index.js')
         .transform(babelify)
         .bundle()
         .pipe(source('build/index.js'))
         .pipe(gulp.dest('js'));
});




var config = {
    dist:"dist/*",
    htmlsrc:'src/*.html',
    csssrc:'src/css/*.css',
    jssrc:'src/js/*.js',
    imagesrc:"src/images/*"
}


// es6  babel
gulp.task('es6', () =>
    gulp.src('src/es6.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
);

// // HTML处理
// gulp.task('clean', function () {
//     gulp.src(config.dist, {read: false})
//         .pipe(clean());
// });


gulp.task('clean', function() {
    gulp.src(['dist'], {read: false})
        .pipe(clean());
});

gulp.task('minify-html', function () {
    gulp.src(config.htmlsrc) // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('dist/html'));
});


gulp.task('jsLint', function () {
    gulp.src(config.jssrc)
    .pipe(jshint())
    .pipe(jshint.reporter()); // 输出检查结果
});

// js压缩
gulp.task('minify-js', function () {
    gulp.src(config.jssrc) // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(gulp.dest('dist/js')); //压缩后的路径
});


// 样式处理
gulp.task('minify-css', function () {
    gulp.src(config.csssrc) // 要压缩的css文件
    .pipe(minifycss()) //压缩css
    // .pipe(rename(function(path){
    //     path.basename += '.min';
    //     path.extname = ".css"
    // }))
    // .pipe(rev())
    // .pipe(rev.manifest()) //生成json
    .pipe(gulp.dest('dist/css'));
});




// 图片处理
gulp.task('minfy-image', function () {
    return gulp.src(config.imagesrc)
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('dist/images'));
});

// gulp.task('compile-less', function () {
//     gulp.src('less/*.less')
//     .pipe(less())
//     .pipe(gulp.dest('dist/css'));
// });

// gulp.task('compile-less', function () {
//     gulp.src('less/*.less')
//     .pipe(less())
//     .pipe(gulp.dest('dist/css'));
// });


// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('image', function(){
    gulp.start('minfy-image');
});






//文件合并
// gulp.task('concat', function () {
//     gulp.src('js/*.js')  //要合并的文件
//     .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
//     .pipe(gulp.dest('dist/js'));
// });



// 默认任务 清空图片、样式、js并重建 运行语句 gulp
// gulp.task('default',  ['clean'] ,function(){
//     setTimeout(function(){
//         gulp.start('minify-html','minify-css','jsLint','minify-js');
//     },1000)
// });













var livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
    webserver = require('gulp-webserver'); // 本地服务器

// 注册任务
gulp.task('webserver', function() {
    gulp.src( './src' ) // 服务器目录（./代表根目录）
    .pipe(webserver({ // 运行gulp-webserver
        livereload: true, // 启用LiveReload
        open: true // 服务器启动时自动打开网页
    }));
});

// 监听任务
// gulp.task('watch',function(){
//     gulp.watch( '*.html', ['html']) // 监听根目录下所有.html文件
// });

gulp.task('watch',function(){
    gulp.watch( '*.html', ['html']) // 监听根目录下所有.html文件
});



// 默认任务
// gulp.task('watch',['webserver','watch']);




