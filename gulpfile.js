var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'); // Подключаем Browser Sync
    var jhaml = require('gulp-jhaml');

gulp.task('sass', function(){ // Создаем таск "sass"
    return gulp.src('app/sass/style.scss') // Берем источник
        .pipe(sass()) // Преобразуем sass в CSS посредством gulp-sass
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('haml', function(){
    return gulp.src(['app/pages/*.haml'])
        .pipe(jhaml(({
            compiler: 'creationix'
        })))
        .pipe(gulp.dest('app')) // Выгружаем результата в папку app/css
});


var through = require('through2');
var process = require('child_process')

gulp.task('foobar', function (){
    gulp.src('app/pages/*.haml')
        .pipe(through.obj(function (chunk, enc, cb) {

            var filename = chunk.path.replace(/^.*[\\\/]/, ''),
                name = filename.substr(0, filename.lastIndexOf('.'));

            process.exec('haml '+ chunk.path +' app/'+ name +'.html', function (error, stdout, stderr) {
                if (error) console.log(error.message)
            })

            console.log('chunk', chunk.path) // this should log now
            console.log(name);

            cb(null, chunk)
    }))
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch('app/**/*.scss', ['sass']); // Наблюдение за sass файлами
    gulp.watch('app/**/*.haml', ['foobar']); // Наблюдение за haml файлами
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
});
