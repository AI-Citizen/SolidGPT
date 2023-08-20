'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _beachline = require('./beachline');

var _beachline2 = _interopRequireDefault(_beachline);

var _geom = require('./geom');

var _geom2 = _interopRequireDefault(_geom);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

function Fortune(sites) {
	this.sites = sites;
	this.events = [];
	this.beach = new _beachline2['default']();
	this.edges = [];
	this.patches = Object.create(null);
	this.iterations = 0;
	sites.forEach(function (site) {
		this.patches[site] = [];
		new _event2['default'](site).add(this.events);
	}, this);
}

Fortune.prototype.addCircleEvent = function (arcNode, sweepY, approx) {
	if (arcNode === undefined) arcNode = 1e-10;

	var lNodes = arcNode.getLLeafAndLParent();
	var lArcNode = lNodes[0];
	var lEdgeNode = lNodes[1];
	var rNodes = arcNode.getRLeafAndRParent();
	var rArcNode = rNodes[0];
	var rEdgeNode = rNodes[1];

	if (lArcNode === undefined || rArcNode === undefined || lArcNode.item[0] === rArcNode.item[0] && lArcNode.item[1] === rArcNode.item[1] || !_geom2['default'].doHalflinesCross(lEdgeNode.item, rEdgeNode.item)) {
		return;
	}

	var vertexCoord = _geom2['default'].circumCenter(lArcNode.item, arcNode.item, rArcNode.item);

	if (vertexCoord[1] == Infinity) {
		return;
	}

	var eventCoord = [vertexCoord[0], vertexCoord[1] + _geom2['default'].distPointToPoint(arcNode.item, vertexCoord)];

	if (eventCoord[1] < sweepY - approx) {
		return;
	}

	arcNode.cEvent = new _event2['default']([lArcNode, lEdgeNode, arcNode, rEdgeNode, rArcNode], eventCoord, vertexCoord);
	arcNode.cEvent.add(this.events);
};

Fortune.prototype.rmCircleEvent = function (arcNode) {
	if (arcNode.cEvent !== undefined) {
		arcNode.cEvent.rm(this.events);
		arcNode.cEvent = undefined;
	}
};

Fortune.prototype.manageSiteEvent = function () {
	var event = this.events.splice(0, 1)[0];
	var crossedArcNode = this.beach.getArcNodeOnSite(event.coord);
	var lArcNode = crossedArcNode.getLLeafAndLParent()[0];
	var rArcNode = crossedArcNode.getRLeafAndRParent()[0];

	this.rmCircleEvent(crossedArcNode);
	this.beach.addArc(event.coord, [lArcNode, crossedArcNode, rArcNode]);
	this.addCircleEvent(crossedArcNode.l, event.coord[1]);
	this.addCircleEvent(crossedArcNode.r.r, event.coord[1]);
};

Fortune.prototype.manageCircleEvent = function () {
	var event = this.events.splice(0, 1)[0];
	var deadEdgeA = event.edgesNodes[0].item;
	var deadEdgeB = event.edgesNodes[1].item;

	deadEdgeA.pe = event.vertexCoord;
	deadEdgeB.pe = event.vertexCoord;

	this.edges.push(deadEdgeA);
	this.edges.push(deadEdgeB);
	this.beach.rmArc(event.vertexCoord, event.arcsNodes, event.edgesNodes);
	this.rmCircleEvent(event.arcsNodes[0]);
	this.rmCircleEvent(event.arcsNodes[2]);
	this.addCircleEvent(event.arcsNodes[0], event.coord[1]);
	this.addCircleEvent(event.arcsNodes[2], event.coord[1]);
};

Fortune.prototype.getPoints = function () {
	return this.sites;
};

Fortune.prototype.getEdges = function () {
	this.beach.item = this.events.splice(0, 1)[0].coord;
	this.iterations += 1;

	while (this.events.length > 0) {
		if (this.events[0].arcsNodes) {
			this.manageCircleEvent();
		} else {
			this.manageSiteEvent();
		}
		this.iterations += 1;
	}
	return this.edges;
};

Fortune.prototype.getPatches = function (width, height, pointSize, pointsColor, edgesColor) {
	function isIn(point, array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][0] === point[0] && array[i][1] === point[1]) return true;
		}
		return false;
	}

	function insertByAtan(c, v, vs) {
		for (var i = 0; i < vs.length; i++) {
			if (Math.atan2(v[1] - c[1], v[0] - c[0]) < Math.atan2(vs[i][1] - c[1], vs[i][0] - c[0])) {
				vs.splice(i, 0, v);
				return;
			}
		}
		vs.push(v);
	}

	function assignEdgeBounds(edge) {
		if (!isIn(edge.ps, this.patches[edge.pl])) insertByAtan(edge.pl, edge.ps, this.patches[edge.pl]);
		if (!isIn(edge.ps, this.patches[edge.pr])) insertByAtan(edge.pr, edge.ps, this.patches[edge.pr]);
		if (!isIn(edge.pe, this.patches[edge.pl])) insertByAtan(edge.pl, edge.pe, this.patches[edge.pl]);
		if (!isIn(edge.pe, this.patches[edge.pr])) insertByAtan(edge.pr, edge.pe, this.patches[edge.pr]);
	}

	this.getEdges().forEach(assignEdgeBounds, this);
	return this.patches;
};

exports['default'] = Fortune;
module.exports = exports['default'];