//#endregion
//#region src/js/easing.js
function e(e) {
	return e *= 2, e <= 1 ? e * e * e / 2 : (e = 2 - e, 1 - e * e * e / 2);
}
//#endregion
//#region src/js/consts.js
var t = {
	EMPTY: 0,
	STATIC: 1,
	SPINNER: 2
}, n = "http://www.w3.org/2000/svg";
function r(e, t = {}) {
	let r = document.createElementNS(n, e);
	return Object.keys(t).forEach((e) => {
		r.setAttribute(e, t[e]);
	}), r;
}
function i(e, t = {}) {
	let n = document.createElement(e);
	return Object.keys(t).forEach((e) => {
		n.setAttribute(e, t[e]);
	}), n;
}
function a(e, t = !1) {
	let n = i("span", { class: `nc__glyph${t ? " nc__glyph--static" : ""}` });
	return n.innerText = e, n;
}
function o(e) {
	let t = i("span", { class: "nc__spinner" }), n = e.length;
	for (let r = 0; r < n; r++) {
		let n = a(e[r]);
		t.appendChild(n);
	}
	let r = a(e[0]);
	return t.appendChild(r), t;
}
//#endregion
//#region src/js/helpers.js
function s(e, t, n) {
	return e + (t - e) * n;
}
//#endregion
//#region src/js/spinner.js
function c(e) {
	return e.getBoundingClientRect().width;
}
function l(e, n) {
	let r = !0, { type: l, key: u } = e, d = l === t.SPINNER, f = i("span", { class: "nc__box" }), p = n.length, m = a(e.char, !0);
	f.appendChild(m);
	let h = o(d ? n : [e.char]), g = e.char, _ = e.index, v = !1, y = 0, b = 0, x = 0, S = 0;
	function C(e) {
		return (e % p + p) % p;
	}
	function w(e, t) {
		if (v) return;
		let n = e.char;
		if (!d && n === g) return;
		let [r, i] = t === -1 ? [1, 0] : [0, 1];
		y = c(m), b = d ? _ : r, d || (h.children[r].innerText = g, h.children[i].innerText = n, h.style.transform = `translate3d(0, ${r * -100}%, 0)`), f.style.width = `${y}px`, f.appendChild(h), m.style.visibility = "hidden", m.innerText = n, S = d ? e.index + e.spinnerIndex * p * t : i, x = c(m), g = n, _ = C(S), v = !0;
	}
	function T(e) {
		if (!v) return;
		let t = s(b, S, e), n = s(y, x, e);
		h.style.transform = `translate3d(0, ${C(t) * -100}%, 0)`, f.style.width = `${n}px`;
	}
	function E() {
		v &&= (f.style.width = "", m.style.visibility = "", h.parentElement === f && f.removeChild(h), h.style.transform = "", !1);
	}
	w(e, 1), T(1), E();
	function D() {
		return f;
	}
	function O() {
		return u;
	}
	function k() {
		r = !1;
	}
	function A() {
		return r;
	}
	return {
		getEl: D,
		getKey: O,
		startTween: w,
		updateTween: T,
		endTween: E,
		destroy: k,
		isAlive: A
	};
}
//#endregion
//#region src/js/effect.js
function u() {
	let e = r("svg", {
		width: 0,
		height: 0,
		viewBox: "0 0 0 0",
		class: "nc__effect"
	}), t = r("filter", { id: "nc-effect" }), n = r("feGaussianBlur", { stdDeviation: "0 0" });
	t.appendChild(n), e.appendChild(t);
	function i(e) {
		n.setAttribute("stdDeviation", `0 ${e}`);
	}
	function a() {
		return e;
	}
	function o() {}
	return {
		getEl: a,
		setValue: i,
		destroy: o
	};
}
//#endregion
//#region src/js/counter.js
var d = "0123456789".split(""), f = 1e3;
function p(e, n, r) {
	let i = e.split(""), a = i.length, o = [];
	for (let e = 0; e < a; e++) {
		let a = i[e], s = n.indexOf(a), c = s !== -1;
		o[e] = {
			type: c ? t.SPINNER : t.STATIC,
			char: c && r ? n[0] : a,
			index: c && !r ? s : 0
		};
	}
	let s = 0, c = 0;
	for (let e = a - 1; e >= 0; e--) o[e].type === t.SPINNER ? o[e].key = `sp${s++}` : o[e].type === t.STATIC && (o[e].key = `st${c++}`);
	return o;
}
function m(e, n) {
	let r = [], i = n.length, a = e.length, o = 1, s = !1, c = [];
	for (let t = i - 1; t >= 0; t--) {
		let i = { ...n[t] };
		s = !1;
		for (let t = a - 1; t >= 0; t--) {
			let n = { ...e[t] };
			if (n.type === i.type && n.key === i.key) {
				r.unshift(...c), c.splice(0, c.length), a = t, s = !0, i.index > n.index ? o = 1 : i.index < n.index && (o = -1);
				break;
			}
			n.leave = !0, c.unshift(n);
		}
		s === !1 && (i.enter = !0), r.unshift(i);
	}
	c.length > 0 && (r.unshift(...c), o = -1);
	let l = 0, u = r.length;
	for (let e = 0; e < u; e++) r[e].spinnerIndex = l, r[e].type === t.SPINNER && l++;
	return [r, o];
}
function h(t = "", n = "", r = {}) {
	let a = p(n, d), o = p(n, d, !0), s = p(t, d), c = [], h = r.duration ?? f, g = e, _ = i("span", { class: "nc" }), v = document.createDocumentFragment();
	{
		let e = s.length;
		for (let t = 0; t < e; t++) {
			let e = l(s[t], d);
			c.push(e), v.appendChild(e.getEl());
		}
	}
	_.appendChild(v);
	let y = u();
	_.appendChild(y.getEl());
	function b(e) {
		let t = c.length;
		for (let n = 0; n < t; n++) e(c[n], n);
	}
	function x(e, t) {
		b((n, r) => {
			n.startTween(e[r], t);
		});
	}
	function S(e) {
		b((t) => {
			t.updateTween(e);
		});
		let t = 10 * Math.sin(e * Math.PI);
		y.setValue(t);
	}
	function C() {
		b((e) => {
			e.endTween();
		}), c = c.filter((e) => !e.isDestroyed);
	}
	let w = null, T = 0, E = 0;
	function D(e) {
		if (e >= E) {
			S(1), C();
			return;
		}
		S(g((e - T) / h)), w = requestAnimationFrame(D);
	}
	function O(e) {
		T = e, E = T + h, D(e);
	}
	function k() {
		w = requestAnimationFrame(O);
	}
	function A() {
		cancelAnimationFrame(w);
	}
	function j(e) {
		let t;
		t = e === null ? a : e === "" ? o : p(e, d);
		let [n, r] = m(s, t);
		x(n, r), k(), s = t;
	}
	function M(e) {
		h = parseInt(e === "" ? 0 : e ?? f, 10);
	}
	function N() {
		return _;
	}
	function P() {
		A(), b((e) => {
			e.destroy();
		});
	}
	return {
		getRootEl: N,
		setValue: j,
		setDuration: M,
		destroy: P
	};
}
//#endregion
//#region src/js/main.js
var g = class extends HTMLElement {
	static observedAttributes = ["value", "duration"];
	connectedCallback() {
		let e = this.attachShadow({ mode: "closed" }), t = new CSSStyleSheet();
		t.replaceSync(".nc{--nc-align-offset:0em;--nc-inline-padding:.3em;margin-inline:calc(-1 * var(--nc-inline-padding));padding-inline:var(--nc-inline-padding);transform:translateY(calc(-1 * var(--nc-align-offset)));line-height:1;display:inline-flex;position:relative;overflow:hidden}.nc__box{transform:translateY(var(--nc-align-offset));flex-shrink:0;justify-content:center;display:inline-flex;position:relative}.nc__spinner{filter:url(#nc-effect);flex-direction:column;width:100%;height:100%;display:flex;position:absolute;top:0;left:0}.nc__glyph{text-align:center;white-space:pre;flex-shrink:0;display:block}.nc__glyph:not(.nc__glyph--static){-webkit-user-select:none;user-select:none}.nc__effect{z-index:-1;visibility:hidden;display:block;position:absolute;top:0;left:0}"), e.adoptedStyleSheets.push(t);
		let n = this.textContent.trim(), r = h(this.pattern ?? n, this.value ?? n, n, { duration: this.duration });
		e.appendChild(r.getRootEl()), this._web_component = r;
	}
	disconnectedCallback() {
		this._web_component.destroy();
	}
	attributeChangedCallback(e, t, n) {
		if (this._web_component !== void 0 && t !== n) switch (e) {
			case "value":
				this._web_component.setValue(n);
				break;
			case "duration": this._web_component.setDuration(n);
		}
	}
	get value() {
		return this.getAttribute("value");
	}
	set value(e = null) {
		e === null ? this.removeAttribute("value") : this.setAttribute("value", e);
	}
	get duration() {
		return this.getAttribute("duration");
	}
	set duration(e = null) {
		e === null ? this.removeAttribute("duration") : this.setAttribute("duration", e);
	}
};
window.customElements.define("nice-counter", g);
//#endregion
export { g as default };
