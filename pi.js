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
    this.algorithms = [
        "Gregory-Leibnitz",
        "Nilakantha",
        "Gauss-Legendre",
        "Ramanujan",
        //"Progr. Ramanujan",
        //"BPP"
        ];
    this.maxs =[
        2000,
        2000,
        500,
        1000,
        //1000,
        //1000
        ];
    this.algorithm = this.algorithms[1];
    this.prevPi = "";
    this.setDigits(1000);
    this.initDat(this.maxs[1]);
	var _this = this;
	setTimeout(function(){_this.iterate();}, 1);
}

Pi.prototype.iterate = function() {
	this.algo.iterate();
    var digitsFound = this.computeDigitsFound();
	document.getElementById("pi").innerHTML = this.algo.pi.toString();
	document.getElementById("iteration").innerHTML = this.algo.i.toString();
    document.getElementById("digits").innerHTML = digitsFound;
    this.prevPi = this.algo.pi.toString();
	var _this = this;
	setTimeout(function(){_this.iterate();}, 1);
};

Pi.prototype.findString = function(arr, str) {
    var i = 0;
    for (val in arr) {
        if (arr[val] == str)
            return i;
        i++;
    }
    return -1;
}

Pi.prototype.initDat = function(max) {
    var _this = this;
    this.max = max;
    this.gui = new dat.GUI();
    this.addDigitsController(max);
    this.gui.add(this, "algorithm", this.algorithms)
    .onChange(function(value) {
              _this.setAlgo();
              });
};

Pi.prototype.addDigitsController = function(max) {
    var _this = this;
    this.digitsController = this.gui.add(this, "digits", 200, max)
        .onChange(function(value) {
                  if (value > max)
                      value = max;
                  _this.setDigits(value);
                  });
}

Pi.prototype.setAlgo = function() {
    var type = this.findString(this.algorithms, this.algorithm);
    this.setMax(this.maxs[type]);
	if (type == 0) {
		this.algo = new GregoryLeibnitz();
	}
	else if (type == 1) {
		this.algo = new Nilakantha();
	}
	else if (type == 2) {
		this.algo = new GaussLegendre();
	}
	else if (type == 3) {
		this.algo = new Ramanujan();
	}
	else if (type == 4) {
		this.algo = new Ramanujan2();
	}
	else if (type == 5) {
		this.algo = new BBP();
	}
}

Pi.prototype.setDigits = function(digits) {
    this.digits = Math.floor(digits);
    BigNumber.config(this.digits, 4);
    this.setAlgo();
}

Pi.prototype.setMax = function(max) {
    if (this.digits > max)
    {
        this.setDigits(max);
        this.digitsController.updateDisplay();
    }
    this.max = max;
}

Pi.prototype.clampZero = function(a) {
    return a > 0 ? a : 0;
}

Pi.prototype.computeDigitsFound = function() {
    var p = this.algo.pi.toString();
    var pp = this.prevPi;
    var len = p.length < pp.length ? p.length : pp.length;
    for (var i = 0; i < len; i++) {
        if (p.charAt(i) != pp.charAt(i))
            return this.clampZero(i - 1);
    }
    return this.clampZero(len - 1);
}



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

// Not used

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
	this.MODE_COMPUTING = 0;
	this.MODE_EXPANDING = 1;
	this.mode = this.MODE_COMPUTING;
	this.pi = BigNumber(0);
};

Ramanujan2.prototype.iterate = function() {
	if (this.mode == this.MODE_COMPUTING) {
		this.i += 1;
		var k = this.i;
		this.fact4k = this.fact4k.times(4 * k).times(4 * k - 1).times(4 * k - 2).times(4 * k - 3);
		this.factk = this.factk.times(k);
		this.nums.push(this.fact4k.times(this.a.times(k).plus(1103)));
		this.dens.push(this.factk.times(this.factk).times(this.factk).times(this.factk).
			times(this.b.pow(4 * k)));
		if (k % 50 == 1 && k * 9 + 500 < 1200) {
			BigNumber.config(k * 9 + 500, 4);
			this.sum = BigNumber(0);
			this.c = BigNumber(2).times(BigNumber(2).sqrt()).div(9801);
			this.mode = this.MODE_EXPANDING;
			this.loop_i = 0;
		} else {
			this.sum = this.sum.plus(this.nums[k].div(this.dens[k]));
			this.pi = this.one.div(this.c.times(this.sum));
		}
	} else {
		var i = this.loop_i;
		if (i < this.nums.length) {
			this.sum = this.sum.plus(this.nums[i].div(this.dens[i]));
			this.pi = this.pi.plus(BigNumber(i).div(BigNumber(10).pow((this.i - 50) * 9 + 500)));
			this.loop_i++;
		} else {
			this.mode = this.MODE_COMPUTING;
		}
	}
};

// ------------------------------------

// http://en.wikipedia.org/wiki/Bailey-Borwein-Plouffe_formula

// Not used

function BBP() {
	this.i = 0;
	this.piA = [];
	this.sixteen = BigNumber(16);
	this.pi = BigNumber(3);
};

BBP.prototype.powmod = function(b, e, m) {
	var c = 1;
	for (var i = 0; i < e; i++)
	{
		c = (c * b) % m;
	}
	return c;
};

BBP.prototype.sum = function(j) {
	var n = this.i;
	var s1 = 0;
	for (var k = 0; k <= n; k++)
	{
		var de = 8 * k + j;
		var nu = this.powmod(16, n - k, de);
		s1 += nu / de;
	}
	for (var k = n + 1; k <= n + 5; k++)
	{
		var nu = Math.pow(16, n - k);
		var de = 8 * k + j;
		s1 += nu / de;
	}
	return s1;
};

BBP.prototype.toDecimal = function() {
	BigNumber.config(this.i + 5, 4);
	var pi = BigNumber(3);
	for (var i = 0; i <= this.i; i++) {
		pi = pi.plus(BigNumber(this.piA[i]).times(this.sixteen.pow(-i - 1)));
	}
	return pi;
};

// Can't do incremental hex-to-dec ?
/*
BBP.prototype.toDecimal = function() {
	BigNumber.config(4 * this.i + 20, 4);
	var i = this.i;
	this.pi = this.pi.plus(BigNumber(this.piA[i]).times(this.sixteen.pow(-i - 1)));
	return this.pi;
};
*/

BBP.prototype.iterate = function() {
	var s = 4 * this.sum(1) - 2 * this.sum(4) - this.sum(5) - this.sum(6);
	var frac = s - Math.floor(s);
	var val = Math.floor(frac * 16);
	this.piA.push(val);
	this.pi = this.toDecimal();
    if (this.i < 1200)
        this.i += 1;
};
