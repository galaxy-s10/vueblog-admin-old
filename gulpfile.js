var gulp = require("gulp");
var ts = require("gulp-typescript");
var clean = require("gulp-clean");
const babel = require("gulp-babel");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("clean-dist", function() {
  // console.log("start clean-dist task");
  return gulp.src("./dist/", { allowEmpty: true }).pipe(clean());
});

gulp.task("babel-tsx", function() {
  // console.log("start compile task");
  // console.log(object);
  return tsProject.src().pipe(
    babel({
      presets: ["@babel/preset-env"],
    })
  );
});
gulp.task("compile", function() {
  // console.log("start compile task");
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series("clean-dist", "compile", "babel-tsx", (done) => {
    // console.log("ok");
    done();
  })
);
