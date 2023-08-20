'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fortune = require('./fortune');

var _fortune2 = _interopRequireDefault(_fortune);

var _geom = require('./geom');

var _geom2 = _interopRequireDefault(_geom);

//Alcune configurazioni di punti standard
var vFourPoints = [[0, -0.3], [0, -0.1], [0, 0.1], [0, 0.3]];
var hFourPoints = [[-0.3, 0], [-0.1, 0], [0.1, 0], [0.3, 0]];
var vTriangle = [[0, -0.5], [0.5, 0.5], [-0.5, 0.5]];
var hTriangle = [[0, 0.5], [0.5, -0.5], [-0.5, -0.5]];
var vRectangle = [[0, -0.5], [-0.5, 0], [0.5, 0], [0, 0.65]];
var hRectangle = [[-0.5, 0], [0, -0.5], [0, 0.5], [0.65, 0]];
var vSquare = [[0, -0.5], [-0.5, 0], [0.5, 0], [0, 0.5]];
var vCSquare = [[0, 0]].concat(vSquare);
var hSquare = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
var hCSquare = [[0, 0], [-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
var vOctagon = [[0, -0.5], [-Math.sqrt(2) / 4, -Math.sqrt(2) / 4], [Math.sqrt(2) / 4, -Math.sqrt(2) / 4], [-0.5, 0], [0.5, 0], [Math.sqrt(2) / 4, Math.sqrt(2) / 4], [-Math.sqrt(2) / 4, Math.sqrt(2) / 4], [0, 0.5]];
var vCOctagon = [[0, 0]].concat(vOctagon);
var x1 = Math.cos(Math.PI / 8) / 2;
var y1 = Math.sin(Math.PI / 8) / 2;
var x2 = Math.cos(3 * Math.PI / 8) / 2;
var y2 = Math.sin(3 * Math.PI / 8) / 2;

var hOctagon = [[x1, y1], [x2, y2], [-x1, y1], [-x2, y2], [-x1, -y1], [-x2, -y2], [x1, -y1], [x2, -y2]];
var hCOctagon = [[0, 0]].concat(hOctagon);
var random = [];
for (var i = 0; i < 1000; i++) {
    random.push([2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)]);
}

//Definizione funzioni per plot
//Purtroppo, se width!=height, è necessario scalare tutti i punti in uscita (non basta scalare quelli in ingresso)
function scale(iIn, iOut) {
    return function (x) {
        return iOut[0] + (iOut[1] - iOut[0]) * (x - iIn[0]) / (iIn[1] - iIn[0]);
    };
}
function plotEdges() {
    var t0 = new Date().getTime();
    v.getPoints().forEach(function (point) {
        ctx.fillRect(xscale(point[0]) - pointSize / 2, yscale(point[1]) - pointSize / 2, pointSize, pointSize);
    });
    v.getEdges().forEach(function (edge) {
        ctx.moveTo(xscale(edge.ps[0]), yscale(edge.ps[1]));
        ctx.lineTo(xscale(edge.pe[0]), yscale(edge.pe[1]));
    });
    ctx.stroke();
    console.log("Total execution time (run Fortune + draw edges)", new Date().getTime() - t0, "ms");
};

function plotPatches() {
    var t0 = new Date().getTime();
    var patches = v.getPatches();
    v.getPoints().forEach(function (point) {
        ctx.fillRect(xscale(point[0]) - pointSize / 2, yscale(point[1]) - pointSize / 2, pointSize, pointSize);
        var vs = patches[point];
        ctx.moveTo(xscale(vs[0][0]), yscale(vs[0][1]));
        for (var i = 1; i < vs.length; i++) {
            ctx.lineTo(xscale(vs[i][0]), yscale(vs[i][1]));
        }
    });
    ctx.stroke();
    console.log("Total execution time (run Fortune + draw patches)", new Date().getTime() - t0, "ms");
}

//Input
var width = 800;
var height = 800;
var xrange = [-1, 1];
var yrange = [-1, 1];
var pointsColor = "#FF0000";
var edgesColor = "#00004c";

var pointSize = pointSize || 4;
var sites = random;

//Inizializzazione variabili intermedie
var xm = (xrange[0] + xrange[1]) / 2;
var ym = (yrange[0] + yrange[1]) / 2;

var diag = _geom2['default'].distPointToPoint([xrange[0], yrange[0]], [xrange[1], yrange[1]]);
var xscale = scale(xrange, [0, width]);
var yscale = scale(yrange, [height, 0]);

var closingPoints = [[xrange[0] - diag, ym], [xrange[1] + diag, ym], [xm, yrange[0] - diag], [xm, yrange[1] + diag]];
var points = [].concat(closingPoints, sites);
var t0 = new Date().getTime();
var v = new _fortune2['default'](points);

//Creazione canvas
var canv = document.createElement('canvas');
canv.width = width || 200;
canv.height = height || 200;
canv.id = 'canvas';
document.body.appendChild(canv);
var ctx = canv.getContext("2d");
ctx.fillStyle = pointsColor;
ctx.strokeStyle = edgesColor;

//Realizzazione grafico
plotEdges();
//plotPatches();