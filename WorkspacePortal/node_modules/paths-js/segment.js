"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Segment(pl, pr, ps, pe) {
  this.pl = pl; //left symmetry point
  this.pr = pr; //right symmetry point
  this.ps = ps; //start point
  this.pe = pe; //end point
  this.m = this.pl[1] === this.pr[1] ? Infinity : -(this.pl[0] - this.pr[0]) / (this.pl[1] - this.pr[1]); //m
  this.hp = this.pl[0] < this.pr[0] || this.pl[0] === this.pr[0] && this.pl[1] > this.pr[1] ? 1 : -1; //halfplane
  this.vec = this.hp * this.m > 0 || this.m === 0 && this.hp > 0 ? [1, this.m] : [-1, -this.m]; //direction
}

exports["default"] = Segment;
module.exports = exports["default"];