// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Fs = require("fs");
var Curry = require("bs-platform/lib/js/curry.js");

function $less$$great(f, m) {
  return m.then((function (x) {
                return Promise.resolve(Curry._1(f, x));
              }));
}

var Functor = {
  $less$$great: $less$$great
};

function pure(prim) {
  return Promise.resolve(prim);
}

function $great$great$eq(mx, f) {
  return mx.then(Curry.__1(f));
}

function $eq$less$less(f, mx) {
  return mx.then(Curry.__1(f));
}

var Monad = {
  pure: pure,
  $great$great$eq: $great$great$eq,
  $eq$less$less: $eq$less$less
};

function readFile(path) {
  return Fs.promises.readFile(path, "utf-8");
}

function writeFile(path, data) {
  return Fs.promises.writeFile(path, data, "utf-8");
}

function deleteFile(path) {
  return Fs.promises.unlink(path);
}

function existsFile(path) {
  return Fs.promises.access(path).then((function (param) {
                  return Promise.resolve(true);
                })).catch((function (param) {
                return Promise.resolve(false);
              }));
}

function copyFile(origin, dest) {
  return Fs.promises.copyFile(origin, dest);
}

exports.Functor = Functor;
exports.Monad = Monad;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.deleteFile = deleteFile;
exports.existsFile = existsFile;
exports.copyFile = copyFile;
/* fs Not a pure module */