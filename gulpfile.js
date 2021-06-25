var gulp = require("gulp");
var ts = require("gulp-typescript");
var clean = require("gulp-clean");
var babel = require("gulp-babel");
var less = require("gulp-less");
var path = require("path");
var merge2 = require("merge2");
var tsProject = require("./tsconfig.json");
const tsDefaultReporter = ts.reporter.defaultReporter();

gulp.task("clean-dist", function() {
  // console.log("start clean-dist task");
  return gulp.src("./dist/", { allowEmpty: true }).pipe(clean());
});

gulp.task("less", function() {
  return gulp
    .src("./src/style/*.less")
    .pipe(
      less({
        paths: [path.join(__dirname, "less", "includes")],
      })
    )
    .pipe(gulp.dest('dist/style'));
    // .pipe(gulp.dest(function(file){
    //   console.log(file.path);
    //   return path.join(__dirname,`dist/style${file}`)
    // }));
});

const tsFiles = [
  "./src/**/*.js",
  "./src/**/*.jsx",
  "./src/**/*.ts",
  "./src/**/*.tsx",
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

  let stream = tsResult.js.pipe(
    babel({
      presets: ["@babel/env"],
      plugins: ["transform-vue-jsx"],
      // plugins: [[require.resolve("@vue/babel-plugin-transform-vue-jsx")]],
    })
  );
  return stream.pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series("clean-dist", "less", "compile", (done) => {
    console.log("ok");
    done();
  })
);
