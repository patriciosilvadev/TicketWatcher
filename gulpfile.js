// gulpと使用するプラグインを読み込む
tar = require("gulp-tar"),
    gzip = require("gulp-gzip"),
    del = require('del');

gulp.task('releaseDocker', function () {
    gulp.src(['bin/www', 'app.js', 'main.js', 'package.json', 'index.html', 'package-lock.json'], { base: './' })
        .pipe(tar('ticketWatcher.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', del.bind(null, ['main.js', './dist/*.tar.gz'], { dot: true }));
