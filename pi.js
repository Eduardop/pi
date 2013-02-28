
function Pi(type) {
	this.digits = 1000;
	BigNumber.config(this.digits, 4);
	if (type == 1) {
		this.algo = new GregoryLeibnitz();
	}
	else if (type == 2) {
		this.algo = new Nilakantha();
	}
	else if (type == 3) {
		this.algo = new GaussLegendre();
	}
	else if (type == 4) {
		this.algo = new Ramanujan();
	}
	var _this = this;
	setTimeout(function(){_this.iterate();}, 1);
}

Pi.prototype.iterate = function() {
	this.algo.iterate();
	document.getElementById("pi").innerHTML = this.algo.pi.toFixed(this.digits);
	document.getElementById("iteration").innerHTML = this.algo.i.toString();
	var _this = this;
	setTimeout(function(){_this.iterate();}, 1);
};

// ------------------------------------

function GregoryLeibnitz() {
	this.i = 0;
	this.pi = BigNumber(0);
	this.four = BigNumber(4);
	this.pi = BigNumber(4);
	this.d = BigNumber(1);
	this.s = 1;	
};

GregoryLeibnitz.prototype.iterate = function() {
	this.i += 1;
	this.s = -this.s;
	this.d = this.d.plus(2);
	this.pi = this.pi.plus(this.four.times(this.s).div(this.d));	
};

// ------------------------------------

function Nilakantha() {
	this.i = 0;
	this.pi = BigNumber(3);
	this.four = BigNumber(4);
	this.n = BigNumber(2);
	this.s = 1;
};

Nilakantha.prototype.iterate = function() {
	this.i += 1;
	var f = this.four.times(this.s).div(
			this.n.times(this.n.plus(1)).times(this.n.plus(2)));
	this.s = -this.s;
	this.n = this.n.plus(2);
	this.pi = this.pi.plus(f);	
};

// ------------------------------------

function GaussLegendre() {
	this.i = 0;
	this.a = BigNumber(1);
	this.b = BigNumber(1).div(BigNumber(2).sqrt());
	this.t = BigNumber(1).div(4);
	this.p = BigNumber(1);
};

GaussLegendre.prototype.iterate = function() {
	this.i += 1;
	var a1 = this.a.plus(this.b).div(2);
	var b1 = this.a.times(this.b).sqrt();
	var aa = this.a.minus(a1);
	var aasq = aa.times(aa);
	this.t = this.t.minus(this.p.times(aasq));
	this.p = this.p.times(2);
	this.a = a1;
	this.b = b1;
	var ab = this.a.plus(this.b);
	this.pi = ab.times(ab).div(this.t.times(4));	
};

// ------------------------------------

function Ramanujan() {
	this.i = 0;
	this.c = BigNumber(2).times(BigNumber(2).sqrt()).div(9801);
	this.one = BigNumber(1);
	this.fact4k = BigNumber(1);
	this.factk = BigNumber(1);
	this.sum = BigNumber(1103);
	this.a = BigNumber(26390);
	this.b = BigNumber(396);
};

Ramanujan.prototype.iterate = function() {
	this.i += 1;
	var k = this.i;
	this.fact4k = this.fact4k.times(4 * k).times(4 * k - 1).times(4 * k - 2);
	this.factk = this.factk.times(k);
	var num = this.fact4k.times(this.a.times(k).plus(1103));
	var den = this.factk.times(this.factk).times(this.factk).times(this.factk).
		times(this.b.pow(4 * k));
	this.sum = this.sum.plus(num.div(den));
	this.pi = this.one.div(this.c.times(this.sum));	
};
