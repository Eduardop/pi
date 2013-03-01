// pi.js
/*
Copyright 2013, Eduardo Poyart.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function Pi() {
	var type = 5;
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
	else if (type == 5) {
		this.algo = new Ramanujan2();
	}
	var _this = this;
	setTimeout(function(){_this.iterate();}, 1);
}

Pi.prototype.iterate = function() {
	this.algo.iterate();
	document.getElementById("pi").innerHTML = this.algo.pi.toString();
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
	this.fact4k = this.fact4k.times(4 * k).times(4 * k - 1).times(4 * k - 2).times(4 * k - 3);
	this.factk = this.factk.times(k);
	var num = this.fact4k.times(this.a.times(k).plus(1103));
	var den = this.factk.times(this.factk).times(this.factk).times(this.factk).
		times(this.b.pow(4 * k));
	this.sum = this.sum.plus(num.div(den));
	this.pi = this.one.div(this.c.times(this.sum));	
};

// ------------------------------------

function Ramanujan2() {
	this.i = 0;
	BigNumber.config(100, 4);
	this.one = BigNumber(1);
	this.fact4k = BigNumber(1);
	this.factk = BigNumber(1);
	this.a = BigNumber(26390);
	this.b = BigNumber(396);
	this.nums = [BigNumber(1103)];
	this.dens = [BigNumber(1)];
};

Ramanujan2.prototype.iterate = function() {
	this.i += 1;
	var k = this.i;
	if (k % 10 == 1)
		BigNumber.config(k * 10 + 20, 4);
	this.fact4k = this.fact4k.times(4 * k).times(4 * k - 1).times(4 * k - 2).times(4 * k - 3);
	this.factk = this.factk.times(k);
	this.nums.push(this.fact4k.times(this.a.times(k).plus(1103)));
	this.dens.push(this.factk.times(this.factk).times(this.factk).times(this.factk).
		times(this.b.pow(4 * k)));
	if (k % 10 == 1) {
		this.sum = BigNumber(0);
		for (var i = 0; i < this.nums.length; i++)
			this.sum = this.sum.plus(this.nums[i].div(this.dens[i]));
		this.c = BigNumber(2).times(BigNumber(2).sqrt()).div(9801);
	} else {
		this.sum = this.sum.plus(this.nums[k].div(this.dens[k]));
	}
	this.pi = this.one.div(this.c.times(this.sum));
};

