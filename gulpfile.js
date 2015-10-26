var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
    return gulp.src('src/styles/*.less')
        .pipe($.less()
            .on('error', $.util.log))
        .pipe($.postcss([
                require('autoprefixer-core')({
                    browsers: ['> 1%', 'last 2 versions']
                })
            ]))
        .pipe(gulp.dest('build/styles'))
});

gulp.task('views', function(){
    return gulp.src(['src/views/*.jade'])
        .pipe($.jade({
            pretty: true
        }))
        .on('error', $.util.log)
        .pipe(gulp.dest('build'))
});

gulp.task('scripts', function() {
    return gulp.src('src/scripts/*.coffee')
        .pipe($.coffee())
        .on('error', $.util.log)
        .pipe(gulp.dest('build/scripts'))
});

gulp.task('lib', function() {
    return gulp.src('src/lib/*')
        .pipe(gulp.dest('build/lib'));
});

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('watch', ['build'], function() {
    gulp.watch('src/styles/*.less', ['styles']);
    gulp.watch('src/views/**/*.jade', ['views']);
    gulp.watch('src/scripts/*.coffee', ['scripts']);
});

gulp.task('build', ['styles', 'views', 'scripts', 'lib']);

gulp.task('default', ['clean'], function() {
    gulp.start('watch');
});
