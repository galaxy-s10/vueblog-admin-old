var gulp = require("gulp");
var ts = require("gulp-typescript");
var clean = require("gulp-clean");
var babel = require("gulp-babel");
var less = require("gulp-less");
var rename = require("gulp-rename");
const through2 = require("through2");
var postcss = require("gulp-postcss");

var path = require("path");
var merge2 = require("merge2");
var tsProject = require("../tsconfig.json");
const tsDefaultReporter = ts.reporter.defaultReporter();

console.log(process.cwd(), 88888);

gulp.task("clean-dist", function() {
  // console.log("start clean-dist task");
  return gulp.src("../dist", { allowEmpty: true }).pipe(clean({ force: true }));
});

gulp.task("less", function() {
  return (
    gulp
      .src("../src/**/*.less")
      .pipe(
        less({
          paths: [path.join(__dirname, "less", "includes")],
        })
      )
      // .pipe(gulp.dest('style'))
      // .pipe(
      //   rename(function(file) {
      //     console.log(file);
      //     console.log(file.dirname);
      //     file.name = "dist" + file.dirname;
      //   })
      // )
      .pipe(postcss())
      // .pipe(function(v){
      //   console.log(v);
      // })
      .pipe(gulp.dest("../dist"))
  );
});

const tsFiles = [
  "../src/**/*.js",
  "../src/**/*.jsx",
  "../src/**/*.ts",
  "../src/**/*.tsx",
];
gulp.task("compile", function() {
  // console.log("start compile task");
  // console.log(tsProject.compilerOptions);
  // return
  let error;
  const tsResult = gulp.src(tsFiles).pipe(
    ts(tsProject.compilerOptions, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    })
  );
  function check() {
    if (error && !argv["ignore-error"]) {
      process.exit(1);
    }
  }
  tsResult.on("finish", check);
  tsResult.on("end", check);

  let tsFilesStream = tsResult.js
    .pipe(
      babel({
        presets: ["@babel/env"],
        plugins: ["transform-vue-jsx"],
        // plugins: [[require.resolve("@vue/babel-plugin-transform-vue-jsx")]],
      })
    )
    .pipe(
      through2.obj(function(file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/\/style\/index\.(js|ts)$/)) {
          //匹配所有组件下的style目录下面的文件。
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(
            content
              // .replace(/\/style\/?'/g, "/style/css'")
              // .replace(/\/style\/?"/g, '/style/css"')
              .replace(/\.less/g, ".css")
          );
          file.path = file.path.replace(/index\.(js|ts)$/, "css.js");
          this.push(file);
        }
        next();
      })
    );
  tsResult.dts.pipe(gulp.dest("../dist"));
  return tsFilesStream.pipe(gulp.dest("../dist"));
});

gulp.task(
  "default",
  gulp.series("clean-dist", "less", "compile", (done) => {
    console.log("ok");
    done();
  })
);
