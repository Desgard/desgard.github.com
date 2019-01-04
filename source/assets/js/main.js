!function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = "length"in e && e.length
          , n = Z.type(e);
        return "function" === n || Z.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }
    function i(e, t, n) {
        if (Z.isFunction(t))
            return Z.grep(e, function(e, i) {
                return !!t.call(e, i, e) !== n
            });
        if (t.nodeType)
            return Z.grep(e, function(e) {
                return e === t !== n
            });
        if ("string" == typeof t) {
            if (ae.test(t))
                return Z.filter(t, e, n);
            t = Z.filter(t, e)
        }
        return Z.grep(e, function(e) {
            return V.call(t, e) >= 0 !== n
        })
    }
    function r(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    function o(e) {
        var t = he[e] = {};
        return Z.each(e.match(fe) || [], function(e, n) {
            t[n] = !0
        }),
        t
    }
    function s() {
        Q.removeEventListener("DOMContentLoaded", s, !1),
        e.removeEventListener("load", s, !1),
        Z.ready()
    }
    function a() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {}
            }
        }),
        this.expando = Z.expando + a.uid++
    }
    function u(e, t, n) {
        var i;
        if (void 0 === n && 1 === e.nodeType)
            if (i = "data-" + t.replace(xe, "-$1").toLowerCase(),
            n = e.getAttribute(i),
            "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : be.test(n) ? Z.parseJSON(n) : n
                } catch (r) {}
                ye.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    function l() {
        return !0
    }
    function c() {
        return !1
    }
    function d() {
        try {
            return Q.activeElement
        } catch (e) {}
    }
    function p(e, t) {
        return Z.nodeName(e, "table") && Z.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }
    function f(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function h(e) {
        var t = Pe.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"),
        e
    }
    function g(e, t) {
        for (var n = 0, i = e.length; i > n; n++)
            ve.set(e[n], "globalEval", !t || ve.get(t[n], "globalEval"))
    }
    function m(e, t) {
        var n, i, r, o, s, a, u, l;
        if (1 === t.nodeType) {
            if (ve.hasData(e) && (o = ve.access(e),
            s = ve.set(t, o),
            l = o.events)) {
                delete s.handle,
                s.events = {};
                for (r in l)
                    for (n = 0,
                    i = l[r].length; i > n; n++)
                        Z.event.add(t, r, l[r][n])
            }
            ye.hasData(e) && (a = ye.access(e),
            u = Z.extend({}, a),
            ye.set(t, u))
        }
    }
    function v(e, t) {
        var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return void 0 === t || t && Z.nodeName(e, t) ? Z.merge([e], n) : n
    }
    function y(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && Se.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
    }
    function b(t, n) {
        var i, r = Z(n.createElement(t)).appendTo(n.body), o = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(r[0])) ? i.display : Z.css(r[0], "display");
        return r.detach(),
        o
    }
    function x(e) {
        var t = Q
          , n = Ie[e];
        return n || (n = b(e, t),
        "none" !== n && n || (Be = (Be || Z("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),
        t = Be[0].contentDocument,
        t.write(),
        t.close(),
        n = b(e, t),
        Be.detach()),
        Ie[e] = n),
        n
    }
    function w(e, t, n) {
        var i, r, o, s, a = e.style;
        return n = n || $e(e),
        n && (s = n.getPropertyValue(t) || n[t]),
        n && ("" !== s || Z.contains(e.ownerDocument, e) || (s = Z.style(e, t)),
        ze.test(s) && We.test(t) && (i = a.width,
        r = a.minWidth,
        o = a.maxWidth,
        a.minWidth = a.maxWidth = a.width = s,
        s = n.width,
        a.width = i,
        a.minWidth = r,
        a.maxWidth = o)),
        void 0 !== s ? s + "" : s
    }
    function T(e, t) {
        return {
            get: function() {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }
    function C(e, t) {
        if (t in e)
            return t;
        for (var n = t[0].toUpperCase() + t.slice(1), i = t, r = Ye.length; r--; )
            if (t = Ye[r] + n,
            t in e)
                return t;
        return i
    }
    function S(e, t, n) {
        var i = Xe.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }
    function k(e, t, n, i, r) {
        for (var o = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; 4 > o; o += 2)
            "margin" === n && (s += Z.css(e, n + Te[o], !0, r)),
            i ? ("content" === n && (s -= Z.css(e, "padding" + Te[o], !0, r)),
            "margin" !== n && (s -= Z.css(e, "border" + Te[o] + "Width", !0, r))) : (s += Z.css(e, "padding" + Te[o], !0, r),
            "padding" !== n && (s += Z.css(e, "border" + Te[o] + "Width", !0, r)));
        return s
    }
    function E(e, t, n) {
        var i = !0
          , r = "width" === t ? e.offsetWidth : e.offsetHeight
          , o = $e(e)
          , s = "border-box" === Z.css(e, "boxSizing", !1, o);
        if (0 >= r || null == r) {
            if (r = w(e, t, o),
            (0 > r || null == r) && (r = e.style[t]),
            ze.test(r))
                return r;
            i = s && (G.boxSizingReliable() || r === e.style[t]),
            r = parseFloat(r) || 0
        }
        return r + k(e, t, n || (s ? "border" : "content"), i, o) + "px"
    }
    function N(e, t) {
        for (var n, i, r, o = [], s = 0, a = e.length; a > s; s++)
            i = e[s],
            i.style && (o[s] = ve.get(i, "olddisplay"),
            n = i.style.display,
            t ? (o[s] || "none" !== n || (i.style.display = ""),
            "" === i.style.display && Ce(i) && (o[s] = ve.access(i, "olddisplay", x(i.nodeName)))) : (r = Ce(i),
            "none" === n && r || ve.set(i, "olddisplay", r ? n : Z.css(i, "display"))));
        for (s = 0; a > s; s++)
            i = e[s],
            i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? o[s] || "" : "none"));
        return e
    }
    function j(e, t, n, i, r) {
        return new j.prototype.init(e,t,n,i,r)
    }
    function D() {
        return setTimeout(function() {
            Ge = void 0
        }),
        Ge = Z.now()
    }
    function A(e, t) {
        var n, i = 0, r = {
            height: e
        };
        for (t = t ? 1 : 0; 4 > i; i += 2 - t)
            n = Te[i],
            r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e),
        r
    }
    function L(e, t, n) {
        for (var i, r = (nt[t] || []).concat(nt["*"]), o = 0, s = r.length; s > o; o++)
            if (i = r[o].call(n, t, e))
                return i
    }
    function O(e, t, n) {
        var i, r, o, s, a, u, l, c, d = this, p = {}, f = e.style, h = e.nodeType && Ce(e), g = ve.get(e, "fxshow");
        n.queue || (a = Z._queueHooks(e, "fx"),
        null == a.unqueued && (a.unqueued = 0,
        u = a.empty.fire,
        a.empty.fire = function() {
            a.unqueued || u()
        }
        ),
        a.unqueued++,
        d.always(function() {
            d.always(function() {
                a.unqueued--,
                Z.queue(e, "fx").length || a.empty.fire()
            })
        })),
        1 === e.nodeType && ("height"in t || "width"in t) && (n.overflow = [f.overflow, f.overflowX, f.overflowY],
        l = Z.css(e, "display"),
        c = "none" === l ? ve.get(e, "olddisplay") || x(e.nodeName) : l,
        "inline" === c && "none" === Z.css(e, "float") && (f.display = "inline-block")),
        n.overflow && (f.overflow = "hidden",
        d.always(function() {
            f.overflow = n.overflow[0],
            f.overflowX = n.overflow[1],
            f.overflowY = n.overflow[2]
        }));
        for (i in t)
            if (r = t[i],
            Ke.exec(r)) {
                if (delete t[i],
                o = o || "toggle" === r,
                r === (h ? "hide" : "show")) {
                    if ("show" !== r || !g || void 0 === g[i])
                        continue;
                    h = !0
                }
                p[i] = g && g[i] || Z.style(e, i)
            } else
                l = void 0;
        if (Z.isEmptyObject(p))
            "inline" === ("none" === l ? x(e.nodeName) : l) && (f.display = l);
        else {
            g ? "hidden"in g && (h = g.hidden) : g = ve.access(e, "fxshow", {}),
            o && (g.hidden = !h),
            h ? Z(e).show() : d.done(function() {
                Z(e).hide()
            }),
            d.done(function() {
                var t;
                ve.remove(e, "fxshow");
                for (t in p)
                    Z.style(e, t, p[t])
            });
            for (i in p)
                s = L(h ? g[i] : 0, i, d),
                i in g || (g[i] = s.start,
                h && (s.end = s.start,
                s.start = "width" === i || "height" === i ? 1 : 0))
        }
    }
    function q(e, t) {
        var n, i, r, o, s;
        for (n in e)
            if (i = Z.camelCase(n),
            r = t[i],
            o = e[n],
            Z.isArray(o) && (r = o[1],
            o = e[n] = o[0]),
            n !== i && (e[i] = o,
            delete e[n]),
            s = Z.cssHooks[i],
            s && "expand"in s) {
                o = s.expand(o),
                delete e[i];
                for (n in o)
                    n in e || (e[n] = o[n],
                    t[n] = r)
            } else
                t[i] = r
    }
    function M(e, t, n) {
        var i, r, o = 0, s = tt.length, a = Z.Deferred().always(function() {
            delete u.elem
        }), u = function() {
            if (r)
                return !1;
            for (var t = Ge || D(), n = Math.max(0, l.startTime + l.duration - t), i = n / l.duration || 0, o = 1 - i, s = 0, u = l.tweens.length; u > s; s++)
                l.tweens[s].run(o);
            return a.notifyWith(e, [l, o, n]),
            1 > o && u ? n : (a.resolveWith(e, [l]),
            !1)
        }, l = a.promise({
            elem: e,
            props: Z.extend({}, t),
            opts: Z.extend(!0, {
                specialEasing: {}
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: Ge || D(),
            duration: n.duration,
            tweens: [],
            createTween: function(t, n) {
                var i = Z.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                return l.tweens.push(i),
                i
            },
            stop: function(t) {
                var n = 0
                  , i = t ? l.tweens.length : 0;
                if (r)
                    return this;
                for (r = !0; i > n; n++)
                    l.tweens[n].run(1);
                return t ? a.resolveWith(e, [l, t]) : a.rejectWith(e, [l, t]),
                this
            }
        }), c = l.props;
        for (q(c, l.opts.specialEasing); s > o; o++)
            if (i = tt[o].call(l, e, c, l.opts))
                return i;
        return Z.map(c, L, l),
        Z.isFunction(l.opts.start) && l.opts.start.call(e, l),
        Z.fx.timer(Z.extend(u, {
            elem: e,
            anim: l,
            queue: l.opts.queue
        })),
        l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
    }
    function H(e) {
        return function(t, n) {
            "string" != typeof t && (n = t,
            t = "*");
            var i, r = 0, o = t.toLowerCase().match(fe) || [];
            if (Z.isFunction(n))
                for (; i = o[r++]; )
                    "+" === i[0] ? (i = i.slice(1) || "*",
                    (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }
    function P(e, t, n, i) {
        function r(a) {
            var u;
            return o[a] = !0,
            Z.each(e[a] || [], function(e, a) {
                var l = a(t, n, i);
                return "string" != typeof l || s || o[l] ? s ? !(u = l) : void 0 : (t.dataTypes.unshift(l),
                r(l),
                !1)
            }),
            u
        }
        var o = {}
          , s = e === bt;
        return r(t.dataTypes[0]) || !o["*"] && r("*")
    }
    function F(e, t) {
        var n, i, r = Z.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((r[n] ? e : i || (i = {}))[n] = t[n]);
        return i && Z.extend(!0, e, i),
        e
    }
    function R(e, t, n) {
        for (var i, r, o, s, a = e.contents, u = e.dataTypes; "*" === u[0]; )
            u.shift(),
            void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i)
            for (r in a)
                if (a[r] && a[r].test(i)) {
                    u.unshift(r);
                    break
                }
        if (u[0]in n)
            o = u[0];
        else {
            for (r in n) {
                if (!u[0] || e.converters[r + " " + u[0]]) {
                    o = r;
                    break
                }
                s || (s = r)
            }
            o = o || s
        }
        return o ? (o !== u[0] && u.unshift(o),
        n[o]) : void 0
    }
    function B(e, t, n, i) {
        var r, o, s, a, u, l = {}, c = e.dataTypes.slice();
        if (c[1])
            for (s in e.converters)
                l[s.toLowerCase()] = e.converters[s];
        for (o = c.shift(); o; )
            if (e.responseFields[o] && (n[e.responseFields[o]] = t),
            !u && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
            u = o,
            o = c.shift())
                if ("*" === o)
                    o = u;
                else if ("*" !== u && u !== o) {
                    if (s = l[u + " " + o] || l["* " + o],
                    !s)
                        for (r in l)
                            if (a = r.split(" "),
                            a[1] === o && (s = l[u + " " + a[0]] || l["* " + a[0]])) {
                                s === !0 ? s = l[r] : l[r] !== !0 && (o = a[0],
                                c.unshift(a[1]));
                                break
                            }
                    if (s !== !0)
                        if (s && e["throws"])
                            t = s(t);
                        else
                            try {
                                t = s(t)
                            } catch (d) {
                                return {
                                    state: "parsererror",
                                    error: s ? d : "No conversion from " + u + " to " + o
                                }
                            }
                }
        return {
            state: "success",
            data: t
        }
    }
    function I(e, t, n, i) {
        var r;
        if (Z.isArray(t))
            Z.each(t, function(t, r) {
                n || St.test(e) ? i(e, r) : I(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, i)
            });
        else if (n || "object" !== Z.type(t))
            i(e, t);
        else
            for (r in t)
                I(e + "[" + r + "]", t[r], n, i)
    }
    function W(e) {
        return Z.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
    }
    var z = []
      , $ = z.slice
      , _ = z.concat
      , X = z.push
      , V = z.indexOf
      , U = {}
      , J = U.toString
      , Y = U.hasOwnProperty
      , G = {}
      , Q = e.document
      , K = "2.1.4"
      , Z = function(e, t) {
        return new Z.fn.init(e,t)
    }
      , ee = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , te = /^-ms-/
      , ne = /-([\da-z])/gi
      , ie = function(e, t) {
        return t.toUpperCase()
    };
    Z.fn = Z.prototype = {
        jquery: K,
        constructor: Z,
        selector: "",
        length: 0,
        toArray: function() {
            return $.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : $.call(this)
        },
        pushStack: function(e) {
            var t = Z.merge(this.constructor(), e);
            return t.prevObject = this,
            t.context = this.context,
            t
        },
        each: function(e, t) {
            return Z.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(Z.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack($.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: X,
        sort: z.sort,
        splice: z.splice
    },
    Z.extend = Z.fn.extend = function() {
        var e, t, n, i, r, o, s = arguments[0] || {}, a = 1, u = arguments.length, l = !1;
        for ("boolean" == typeof s && (l = s,
        s = arguments[a] || {},
        a++),
        "object" == typeof s || Z.isFunction(s) || (s = {}),
        a === u && (s = this,
        a--); u > a; a++)
            if (null != (e = arguments[a]))
                for (t in e)
                    n = s[t],
                    i = e[t],
                    s !== i && (l && i && (Z.isPlainObject(i) || (r = Z.isArray(i))) ? (r ? (r = !1,
                    o = n && Z.isArray(n) ? n : []) : o = n && Z.isPlainObject(n) ? n : {},
                    s[t] = Z.extend(l, o, i)) : void 0 !== i && (s[t] = i));
        return s
    }
    ,
    Z.extend({
        expando: "jQuery" + (K + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === Z.type(e)
        },
        isArray: Array.isArray,
        isWindow: function(e) {
            return null != e && e === e.window
        },
        isNumeric: function(e) {
            return !Z.isArray(e) && e - parseFloat(e) + 1 >= 0
        },
        isPlainObject: function(e) {
            return "object" !== Z.type(e) || e.nodeType || Z.isWindow(e) ? !1 : e.constructor && !Y.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? U[J.call(e)] || "object" : typeof e
        },
        globalEval: function(e) {
            var t, n = eval;
            e = Z.trim(e),
            e && (1 === e.indexOf("use strict") ? (t = Q.createElement("script"),
            t.text = e,
            Q.head.appendChild(t).parentNode.removeChild(t)) : n(e))
        },
        camelCase: function(e) {
            return e.replace(te, "ms-").replace(ne, ie)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, i) {
            var r, o = 0, s = e.length, a = n(e);
            if (i) {
                if (a)
                    for (; s > o && (r = t.apply(e[o], i),
                    r !== !1); o++)
                        ;
                else
                    for (o in e)
                        if (r = t.apply(e[o], i),
                        r === !1)
                            break
            } else if (a)
                for (; s > o && (r = t.call(e[o], o, e[o]),
                r !== !1); o++)
                    ;
            else
                for (o in e)
                    if (r = t.call(e[o], o, e[o]),
                    r === !1)
                        break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(ee, "")
        },
        makeArray: function(e, t) {
            var i = t || [];
            return null != e && (n(Object(e)) ? Z.merge(i, "string" == typeof e ? [e] : e) : X.call(i, e)),
            i
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : V.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, i = 0, r = e.length; n > i; i++)
                e[r++] = t[i];
            return e.length = r,
            e
        },
        grep: function(e, t, n) {
            for (var i, r = [], o = 0, s = e.length, a = !n; s > o; o++)
                i = !t(e[o], o),
                i !== a && r.push(e[o]);
            return r
        },
        map: function(e, t, i) {
            var r, o = 0, s = e.length, a = n(e), u = [];
            if (a)
                for (; s > o; o++)
                    r = t(e[o], o, i),
                    null != r && u.push(r);
            else
                for (o in e)
                    r = t(e[o], o, i),
                    null != r && u.push(r);
            return _.apply([], u)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, i, r;
            return "string" == typeof t && (n = e[t],
            t = e,
            e = n),
            Z.isFunction(e) ? (i = $.call(arguments, 2),
            r = function() {
                return e.apply(t || this, i.concat($.call(arguments)))
            }
            ,
            r.guid = e.guid = e.guid || Z.guid++,
            r) : void 0
        },
        now: Date.now,
        support: G
    }),
    Z.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        U["[object " + t + "]"] = t.toLowerCase()
    });
    var re = function(e) {
        function t(e, t, n, i) {
            var r, o, s, a, u, l, d, f, h, g;
            if ((t ? t.ownerDocument || t : I) !== O && L(t),
            t = t || O,
            n = n || [],
            a = t.nodeType,
            "string" != typeof e || !e || 1 !== a && 9 !== a && 11 !== a)
                return n;
            if (!i && M) {
                if (11 !== a && (r = ye.exec(e)))
                    if (s = r[1]) {
                        if (9 === a) {
                            if (o = t.getElementById(s),
                            !o || !o.parentNode)
                                return n;
                            if (o.id === s)
                                return n.push(o),
                                n
                        } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(s)) && R(t, o) && o.id === s)
                            return n.push(o),
                            n
                    } else {
                        if (r[2])
                            return K.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((s = r[3]) && w.getElementsByClassName)
                            return K.apply(n, t.getElementsByClassName(s)),
                            n
                    }
                if (w.qsa && (!H || !H.test(e))) {
                    if (f = d = B,
                    h = t,
                    g = 1 !== a && e,
                    1 === a && "object" !== t.nodeName.toLowerCase()) {
                        for (l = k(e),
                        (d = t.getAttribute("id")) ? f = d.replace(xe, "\\$&") : t.setAttribute("id", f),
                        f = "[id='" + f + "'] ",
                        u = l.length; u--; )
                            l[u] = f + p(l[u]);
                        h = be.test(e) && c(t.parentNode) || t,
                        g = l.join(",")
                    }
                    if (g)
                        try {
                            return K.apply(n, h.querySelectorAll(g)),
                            n
                        } catch (m) {} finally {
                            d || t.removeAttribute("id")
                        }
                }
            }
            return N(e.replace(ue, "$1"), t, n, i)
        }
        function n() {
            function e(n, i) {
                return t.push(n + " ") > T.cacheLength && delete e[t.shift()],
                e[n + " "] = i
            }
            var t = [];
            return e
        }
        function i(e) {
            return e[B] = !0,
            e
        }
        function r(e) {
            var t = O.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function o(e, t) {
            for (var n = e.split("|"), i = e.length; i--; )
                T.attrHandle[n[i]] = t
        }
        function s(e, t) {
            var n = t && e
              , i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || U) - (~e.sourceIndex || U);
            if (i)
                return i;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function a(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }
        function u(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }
        function l(e) {
            return i(function(t) {
                return t = +t,
                i(function(n, i) {
                    for (var r, o = e([], n.length, t), s = o.length; s--; )
                        n[r = o[s]] && (n[r] = !(i[r] = n[r]))
                })
            })
        }
        function c(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        function d() {}
        function p(e) {
            for (var t = 0, n = e.length, i = ""; n > t; t++)
                i += e[t].value;
            return i
        }
        function f(e, t, n) {
            var i = t.dir
              , r = n && "parentNode" === i
              , o = z++;
            return t.first ? function(t, n, o) {
                for (; t = t[i]; )
                    if (1 === t.nodeType || r)
                        return e(t, n, o)
            }
            : function(t, n, s) {
                var a, u, l = [W, o];
                if (s) {
                    for (; t = t[i]; )
                        if ((1 === t.nodeType || r) && e(t, n, s))
                            return !0
                } else
                    for (; t = t[i]; )
                        if (1 === t.nodeType || r) {
                            if (u = t[B] || (t[B] = {}),
                            (a = u[i]) && a[0] === W && a[1] === o)
                                return l[2] = a[2];
                            if (u[i] = l,
                            l[2] = e(t, n, s))
                                return !0
                        }
            }
        }
        function h(e) {
            return e.length > 1 ? function(t, n, i) {
                for (var r = e.length; r--; )
                    if (!e[r](t, n, i))
                        return !1;
                return !0
            }
            : e[0]
        }
        function g(e, n, i) {
            for (var r = 0, o = n.length; o > r; r++)
                t(e, n[r], i);
            return i
        }
        function m(e, t, n, i, r) {
            for (var o, s = [], a = 0, u = e.length, l = null != t; u > a; a++)
                (o = e[a]) && (!n || n(o, i, r)) && (s.push(o),
                l && t.push(a));
            return s
        }
        function v(e, t, n, r, o, s) {
            return r && !r[B] && (r = v(r)),
            o && !o[B] && (o = v(o, s)),
            i(function(i, s, a, u) {
                var l, c, d, p = [], f = [], h = s.length, v = i || g(t || "*", a.nodeType ? [a] : a, []), y = !e || !i && t ? v : m(v, p, e, a, u), b = n ? o || (i ? e : h || r) ? [] : s : y;
                if (n && n(y, b, a, u),
                r)
                    for (l = m(b, f),
                    r(l, [], a, u),
                    c = l.length; c--; )
                        (d = l[c]) && (b[f[c]] = !(y[f[c]] = d));
                if (i) {
                    if (o || e) {
                        if (o) {
                            for (l = [],
                            c = b.length; c--; )
                                (d = b[c]) && l.push(y[c] = d);
                            o(null, b = [], l, u)
                        }
                        for (c = b.length; c--; )
                            (d = b[c]) && (l = o ? ee(i, d) : p[c]) > -1 && (i[l] = !(s[l] = d))
                    }
                } else
                    b = m(b === s ? b.splice(h, b.length) : b),
                    o ? o(null, s, b, u) : K.apply(s, b)
            })
        }
        function y(e) {
            for (var t, n, i, r = e.length, o = T.relative[e[0].type], s = o || T.relative[" "], a = o ? 1 : 0, u = f(function(e) {
                return e === t
            }, s, !0), l = f(function(e) {
                return ee(t, e) > -1
            }, s, !0), c = [function(e, n, i) {
                var r = !o && (i || n !== j) || ((t = n).nodeType ? u(e, n, i) : l(e, n, i));
                return t = null,
                r
            }
            ]; r > a; a++)
                if (n = T.relative[e[a].type])
                    c = [f(h(c), n)];
                else {
                    if (n = T.filter[e[a].type].apply(null, e[a].matches),
                    n[B]) {
                        for (i = ++a; r > i && !T.relative[e[i].type]; i++)
                            ;
                        return v(a > 1 && h(c), a > 1 && p(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(ue, "$1"), n, i > a && y(e.slice(a, i)), r > i && y(e = e.slice(i)), r > i && p(e))
                    }
                    c.push(n)
                }
            return h(c)
        }
        function b(e, n) {
            var r = n.length > 0
              , o = e.length > 0
              , s = function(i, s, a, u, l) {
                var c, d, p, f = 0, h = "0", g = i && [], v = [], y = j, b = i || o && T.find.TAG("*", l), x = W += null == y ? 1 : Math.random() || .1, w = b.length;
                for (l && (j = s !== O && s); h !== w && null != (c = b[h]); h++) {
                    if (o && c) {
                        for (d = 0; p = e[d++]; )
                            if (p(c, s, a)) {
                                u.push(c);
                                break
                            }
                        l && (W = x)
                    }
                    r && ((c = !p && c) && f--,
                    i && g.push(c))
                }
                if (f += h,
                r && h !== f) {
                    for (d = 0; p = n[d++]; )
                        p(g, v, s, a);
                    if (i) {
                        if (f > 0)
                            for (; h--; )
                                g[h] || v[h] || (v[h] = G.call(u));
                        v = m(v)
                    }
                    K.apply(u, v),
                    l && !i && v.length > 0 && f + n.length > 1 && t.uniqueSort(u)
                }
                return l && (W = x,
                j = y),
                g
            };
            return r ? i(s) : s
        }
        var x, w, T, C, S, k, E, N, j, D, A, L, O, q, M, H, P, F, R, B = "sizzle" + 1 * new Date, I = e.document, W = 0, z = 0, $ = n(), _ = n(), X = n(), V = function(e, t) {
            return e === t && (A = !0),
            0
        }, U = 1 << 31, J = {}.hasOwnProperty, Y = [], G = Y.pop, Q = Y.push, K = Y.push, Z = Y.slice, ee = function(e, t) {
            for (var n = 0, i = e.length; i > n; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ne = "[\\x20\\t\\r\\n\\f]", ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", re = ie.replace("w", "w#"), oe = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + re + "))|)" + ne + "*\\]", se = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)", ae = new RegExp(ne + "+","g"), ue = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$","g"), le = new RegExp("^" + ne + "*," + ne + "*"), ce = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"), de = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]","g"), pe = new RegExp(se), fe = new RegExp("^" + re + "$"), he = {
            ID: new RegExp("^#(" + ie + ")"),
            CLASS: new RegExp("^\\.(" + ie + ")"),
            TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + oe),
            PSEUDO: new RegExp("^" + se),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)","i"),
            bool: new RegExp("^(?:" + te + ")$","i"),
            needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)","i")
        }, ge = /^(?:input|select|textarea|button)$/i, me = /^h\d$/i, ve = /^[^{]+\{\s*\[native \w/, ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, be = /[+~]/, xe = /'|\\/g, we = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)","ig"), Te = function(e, t, n) {
            var i = "0x" + t - 65536;
            return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
        }, Ce = function() {
            L()
        };
        try {
            K.apply(Y = Z.call(I.childNodes), I.childNodes),
            Y[I.childNodes.length].nodeType
        } catch (Se) {
            K = {
                apply: Y.length ? function(e, t) {
                    Q.apply(e, Z.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        w = t.support = {},
        S = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }
        ,
        L = t.setDocument = function(e) {
            var t, n, i = e ? e.ownerDocument || e : I;
            return i !== O && 9 === i.nodeType && i.documentElement ? (O = i,
            q = i.documentElement,
            n = i.defaultView,
            n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", Ce, !1) : n.attachEvent && n.attachEvent("onunload", Ce)),
            M = !S(i),
            w.attributes = r(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            w.getElementsByTagName = r(function(e) {
                return e.appendChild(i.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            w.getElementsByClassName = ve.test(i.getElementsByClassName),
            w.getById = r(function(e) {
                return q.appendChild(e).id = B,
                !i.getElementsByName || !i.getElementsByName(B).length
            }),
            w.getById ? (T.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && M) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }
            ,
            T.filter.ID = function(e) {
                var t = e.replace(we, Te);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ) : (delete T.find.ID,
            T.filter.ID = function(e) {
                var t = e.replace(we, Te);
                return function(e) {
                    var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }
            ),
            T.find.TAG = w.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, i = [], r = 0, o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[r++]; )
                        1 === n.nodeType && i.push(n);
                    return i
                }
                return o
            }
            ,
            T.find.CLASS = w.getElementsByClassName && function(e, t) {
                return M ? t.getElementsByClassName(e) : void 0
            }
            ,
            P = [],
            H = [],
            (w.qsa = ve.test(i.querySelectorAll)) && (r(function(e) {
                q.appendChild(e).innerHTML = "<a id='" + B + "'></a><select id='" + B + "-\f]' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && H.push("[*^$]=" + ne + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || H.push("\\[" + ne + "*(?:value|" + te + ")"),
                e.querySelectorAll("[id~=" + B + "-]").length || H.push("~="),
                e.querySelectorAll(":checked").length || H.push(":checked"),
                e.querySelectorAll("a#" + B + "+*").length || H.push(".#.+[+~]")
            }),
            r(function(e) {
                var t = i.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && H.push("name" + ne + "*[*^$|!~]?="),
                e.querySelectorAll(":enabled").length || H.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                H.push(",.*:")
            })),
            (w.matchesSelector = ve.test(F = q.matches || q.webkitMatchesSelector || q.mozMatchesSelector || q.oMatchesSelector || q.msMatchesSelector)) && r(function(e) {
                w.disconnectedMatch = F.call(e, "div"),
                F.call(e, "[s!='']:x"),
                P.push("!=", se)
            }),
            H = H.length && new RegExp(H.join("|")),
            P = P.length && new RegExp(P.join("|")),
            t = ve.test(q.compareDocumentPosition),
            R = t || ve.test(q.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , i = t && t.parentNode;
                return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            V = t ? function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1,
                1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === i || e.ownerDocument === I && R(I, e) ? -1 : t === i || t.ownerDocument === I && R(I, t) ? 1 : D ? ee(D, e) - ee(D, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n, r = 0, o = e.parentNode, a = t.parentNode, u = [e], l = [t];
                if (!o || !a)
                    return e === i ? -1 : t === i ? 1 : o ? -1 : a ? 1 : D ? ee(D, e) - ee(D, t) : 0;
                if (o === a)
                    return s(e, t);
                for (n = e; n = n.parentNode; )
                    u.unshift(n);
                for (n = t; n = n.parentNode; )
                    l.unshift(n);
                for (; u[r] === l[r]; )
                    r++;
                return r ? s(u[r], l[r]) : u[r] === I ? -1 : l[r] === I ? 1 : 0
            }
            ,
            i) : O
        }
        ,
        t.matches = function(e, n) {
            return t(e, null, null, n)
        }
        ,
        t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== O && L(e),
            n = n.replace(de, "='$1']"),
            !(!w.matchesSelector || !M || P && P.test(n) || H && H.test(n)))
                try {
                    var i = F.call(e, n);
                    if (i || w.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return i
                } catch (r) {}
            return t(n, O, null, [e]).length > 0
        }
        ,
        t.contains = function(e, t) {
            return (e.ownerDocument || e) !== O && L(e),
            R(e, t)
        }
        ,
        t.attr = function(e, t) {
            (e.ownerDocument || e) !== O && L(e);
            var n = T.attrHandle[t.toLowerCase()]
              , i = n && J.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !M) : void 0;
            return void 0 !== i ? i : w.attributes || !M ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }
        ,
        t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        t.uniqueSort = function(e) {
            var t, n = [], i = 0, r = 0;
            if (A = !w.detectDuplicates,
            D = !w.sortStable && e.slice(0),
            e.sort(V),
            A) {
                for (; t = e[r++]; )
                    t === e[r] && (i = n.push(r));
                for (; i--; )
                    e.splice(n[i], 1)
            }
            return D = null,
            e
        }
        ,
        C = t.getText = function(e) {
            var t, n = "", i = 0, r = e.nodeType;
            if (r) {
                if (1 === r || 9 === r || 11 === r) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += C(e)
                } else if (3 === r || 4 === r)
                    return e.nodeValue
            } else
                for (; t = e[i++]; )
                    n += C(t);
            return n
        }
        ,
        T = t.selectors = {
            cacheLength: 50,
            createPseudo: i,
            match: he,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(we, Te),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(we, Te),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pe.test(n) && (t = k(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(we, Te).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = $[e + " "];
                    return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && $(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, i) {
                    return function(r) {
                        var o = t.attr(r, e);
                        return null == o ? "!=" === n : n ? (o += "",
                        "=" === n ? o === i : "!=" === n ? o !== i : "^=" === n ? i && 0 === o.indexOf(i) : "*=" === n ? i && o.indexOf(i) > -1 : "$=" === n ? i && o.slice(-i.length) === i : "~=" === n ? (" " + o.replace(ae, " ") + " ").indexOf(i) > -1 : "|=" === n ? o === i || o.slice(0, i.length + 1) === i + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, i, r) {
                    var o = "nth" !== e.slice(0, 3)
                      , s = "last" !== e.slice(-4)
                      , a = "of-type" === t;
                    return 1 === i && 0 === r ? function(e) {
                        return !!e.parentNode
                    }
                    : function(t, n, u) {
                        var l, c, d, p, f, h, g = o !== s ? "nextSibling" : "previousSibling", m = t.parentNode, v = a && t.nodeName.toLowerCase(), y = !u && !a;
                        if (m) {
                            if (o) {
                                for (; g; ) {
                                    for (d = t; d = d[g]; )
                                        if (a ? d.nodeName.toLowerCase() === v : 1 === d.nodeType)
                                            return !1;
                                    h = g = "only" === e && !h && "nextSibling"
                                }
                                return !0
                            }
                            if (h = [s ? m.firstChild : m.lastChild],
                            s && y) {
                                for (c = m[B] || (m[B] = {}),
                                l = c[e] || [],
                                f = l[0] === W && l[1],
                                p = l[0] === W && l[2],
                                d = f && m.childNodes[f]; d = ++f && d && d[g] || (p = f = 0) || h.pop(); )
                                    if (1 === d.nodeType && ++p && d === t) {
                                        c[e] = [W, f, p];
                                        break
                                    }
                            } else if (y && (l = (t[B] || (t[B] = {}))[e]) && l[0] === W)
                                p = l[1];
                            else
                                for (; (d = ++f && d && d[g] || (p = f = 0) || h.pop()) && ((a ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++p || (y && ((d[B] || (d[B] = {}))[e] = [W, p]),
                                d !== t)); )
                                    ;
                            return p -= r,
                            p === i || p % i === 0 && p / i >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var r, o = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[B] ? o(n) : o.length > 1 ? (r = [e, e, "", n],
                    T.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function(e, t) {
                        for (var i, r = o(e, n), s = r.length; s--; )
                            i = ee(e, r[s]),
                            e[i] = !(t[i] = r[s])
                    }) : function(e) {
                        return o(e, 0, r)
                    }
                    ) : o
                }
            },
            pseudos: {
                not: i(function(e) {
                    var t = []
                      , n = []
                      , r = E(e.replace(ue, "$1"));
                    return r[B] ? i(function(e, t, n, i) {
                        for (var o, s = r(e, null, i, []), a = e.length; a--; )
                            (o = s[a]) && (e[a] = !(t[a] = o))
                    }) : function(e, i, o) {
                        return t[0] = e,
                        r(t, null, o, n),
                        t[0] = null,
                        !n.pop()
                    }
                }),
                has: i(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: i(function(e) {
                    return e = e.replace(we, Te),
                    function(t) {
                        return (t.textContent || t.innerText || C(t)).indexOf(e) > -1
                    }
                }),
                lang: i(function(e) {
                    return fe.test(e || "") || t.error("unsupported lang: " + e),
                    e = e.replace(we, Te).toLowerCase(),
                    function(t) {
                        var n;
                        do
                            if (n = M ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                return n = n.toLowerCase(),
                                n === e || 0 === n.indexOf(e + "-");
                        while ((t = t.parentNode) && 1 === t.nodeType);return !1
                    }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === q
                },
                focus: function(e) {
                    return e === O.activeElement && (!O.hasFocus || O.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !T.pseudos.empty(e)
                },
                header: function(e) {
                    return me.test(e.nodeName)
                },
                input: function(e) {
                    return ge.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: l(function() {
                    return [0]
                }),
                last: l(function(e, t) {
                    return [t - 1]
                }),
                eq: l(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: l(function(e, t) {
                    for (var n = 0; t > n; n += 2)
                        e.push(n);
                    return e
                }),
                odd: l(function(e, t) {
                    for (var n = 1; t > n; n += 2)
                        e.push(n);
                    return e
                }),
                lt: l(function(e, t, n) {
                    for (var i = 0 > n ? n + t : n; --i >= 0; )
                        e.push(i);
                    return e
                }),
                gt: l(function(e, t, n) {
                    for (var i = 0 > n ? n + t : n; ++i < t; )
                        e.push(i);
                    return e
                })
            }
        },
        T.pseudos.nth = T.pseudos.eq;
        for (x in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            T.pseudos[x] = a(x);
        for (x in {
            submit: !0,
            reset: !0
        })
            T.pseudos[x] = u(x);
        return d.prototype = T.filters = T.pseudos,
        T.setFilters = new d,
        k = t.tokenize = function(e, n) {
            var i, r, o, s, a, u, l, c = _[e + " "];
            if (c)
                return n ? 0 : c.slice(0);
            for (a = e,
            u = [],
            l = T.preFilter; a; ) {
                (!i || (r = le.exec(a))) && (r && (a = a.slice(r[0].length) || a),
                u.push(o = [])),
                i = !1,
                (r = ce.exec(a)) && (i = r.shift(),
                o.push({
                    value: i,
                    type: r[0].replace(ue, " ")
                }),
                a = a.slice(i.length));
                for (s in T.filter)
                    !(r = he[s].exec(a)) || l[s] && !(r = l[s](r)) || (i = r.shift(),
                    o.push({
                        value: i,
                        type: s,
                        matches: r
                    }),
                    a = a.slice(i.length));
                if (!i)
                    break
            }
            return n ? a.length : a ? t.error(e) : _(e, u).slice(0)
        }
        ,
        E = t.compile = function(e, t) {
            var n, i = [], r = [], o = X[e + " "];
            if (!o) {
                for (t || (t = k(e)),
                n = t.length; n--; )
                    o = y(t[n]),
                    o[B] ? i.push(o) : r.push(o);
                o = X(e, b(r, i)),
                o.selector = e
            }
            return o
        }
        ,
        N = t.select = function(e, t, n, i) {
            var r, o, s, a, u, l = "function" == typeof e && e, d = !i && k(e = l.selector || e);
            if (n = n || [],
            1 === d.length) {
                if (o = d[0] = d[0].slice(0),
                o.length > 2 && "ID" === (s = o[0]).type && w.getById && 9 === t.nodeType && M && T.relative[o[1].type]) {
                    if (t = (T.find.ID(s.matches[0].replace(we, Te), t) || [])[0],
                    !t)
                        return n;
                    l && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                for (r = he.needsContext.test(e) ? 0 : o.length; r-- && (s = o[r],
                !T.relative[a = s.type]); )
                    if ((u = T.find[a]) && (i = u(s.matches[0].replace(we, Te), be.test(o[0].type) && c(t.parentNode) || t))) {
                        if (o.splice(r, 1),
                        e = i.length && p(o),
                        !e)
                            return K.apply(n, i),
                            n;
                        break
                    }
            }
            return (l || E(e, d))(i, t, !M, n, be.test(e) && c(t.parentNode) || t),
            n
        }
        ,
        w.sortStable = B.split("").sort(V).join("") === B,
        w.detectDuplicates = !!A,
        L(),
        w.sortDetached = r(function(e) {
            return 1 & e.compareDocumentPosition(O.createElement("div"))
        }),
        r(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        w.attributes && r(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }),
        r(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(te, function(e, t, n) {
            var i;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }),
        t
    }(e);
    Z.find = re,
    Z.expr = re.selectors,
    Z.expr[":"] = Z.expr.pseudos,
    Z.unique = re.uniqueSort,
    Z.text = re.getText,
    Z.isXMLDoc = re.isXML,
    Z.contains = re.contains;
    var oe = Z.expr.match.needsContext
      , se = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
      , ae = /^.[^:#\[\.,]*$/;
    Z.filter = function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === i.nodeType ? Z.find.matchesSelector(i, e) ? [i] : [] : Z.find.matches(e, Z.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    Z.fn.extend({
        find: function(e) {
            var t, n = this.length, i = [], r = this;
            if ("string" != typeof e)
                return this.pushStack(Z(e).filter(function() {
                    for (t = 0; n > t; t++)
                        if (Z.contains(r[t], this))
                            return !0
                }));
            for (t = 0; n > t; t++)
                Z.find(e, r[t], i);
            return i = this.pushStack(n > 1 ? Z.unique(i) : i),
            i.selector = this.selector ? this.selector + " " + e : e,
            i
        },
        filter: function(e) {
            return this.pushStack(i(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(i(this, e || [], !0))
        },
        is: function(e) {
            return !!i(this, "string" == typeof e && oe.test(e) ? Z(e) : e || [], !1).length
        }
    });
    var ue, le = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, ce = Z.fn.init = function(e, t) {
        var n, i;
        if (!e)
            return this;
        if ("string" == typeof e) {
            if (n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : le.exec(e),
            !n || !n[1] && t)
                return !t || t.jquery ? (t || ue).find(e) : this.constructor(t).find(e);
            if (n[1]) {
                if (t = t instanceof Z ? t[0] : t,
                Z.merge(this, Z.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : Q, !0)),
                se.test(n[1]) && Z.isPlainObject(t))
                    for (n in t)
                        Z.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                return this
            }
            return i = Q.getElementById(n[2]),
            i && i.parentNode && (this.length = 1,
            this[0] = i),
            this.context = Q,
            this.selector = e,
            this
        }
        return e.nodeType ? (this.context = this[0] = e,
        this.length = 1,
        this) : Z.isFunction(e) ? "undefined" != typeof ue.ready ? ue.ready(e) : e(Z) : (void 0 !== e.selector && (this.selector = e.selector,
        this.context = e.context),
        Z.makeArray(e, this))
    }
    ;
    ce.prototype = Z.fn,
    ue = Z(Q);
    var de = /^(?:parents|prev(?:Until|All))/
      , pe = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    Z.extend({
        dir: function(e, t, n) {
            for (var i = [], r = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
                if (1 === e.nodeType) {
                    if (r && Z(e).is(n))
                        break;
                    i.push(e)
                }
            return i
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling)
                1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }),
    Z.fn.extend({
        has: function(e) {
            var t = Z(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; n > e; e++)
                    if (Z.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            for (var n, i = 0, r = this.length, o = [], s = oe.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0; r > i; i++)
                for (n = this[i]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && Z.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? Z.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? V.call(Z(e), this[0]) : V.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(Z.unique(Z.merge(this.get(), Z(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    Z.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return Z.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return Z.dir(e, "parentNode", n)
        },
        next: function(e) {
            return r(e, "nextSibling")
        },
        prev: function(e) {
            return r(e, "previousSibling")
        },
        nextAll: function(e) {
            return Z.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return Z.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return Z.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return Z.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return Z.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return Z.sibling(e.firstChild)
        },
        contents: function(e) {
            return e.contentDocument || Z.merge([], e.childNodes)
        }
    }, function(e, t) {
        Z.fn[e] = function(n, i) {
            var r = Z.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n),
            i && "string" == typeof i && (r = Z.filter(i, r)),
            this.length > 1 && (pe[e] || Z.unique(r),
            de.test(e) && r.reverse()),
            this.pushStack(r)
        }
    });
    var fe = /\S+/g
      , he = {};
    Z.Callbacks = function(e) {
        e = "string" == typeof e ? he[e] || o(e) : Z.extend({}, e);
        var t, n, i, r, s, a, u = [], l = !e.once && [], c = function(o) {
            for (t = e.memory && o,
            n = !0,
            a = r || 0,
            r = 0,
            s = u.length,
            i = !0; u && s > a; a++)
                if (u[a].apply(o[0], o[1]) === !1 && e.stopOnFalse) {
                    t = !1;
                    break
                }
            i = !1,
            u && (l ? l.length && c(l.shift()) : t ? u = [] : d.disable())
        }, d = {
            add: function() {
                if (u) {
                    var n = u.length;
                    !function o(t) {
                        Z.each(t, function(t, n) {
                            var i = Z.type(n);
                            "function" === i ? e.unique && d.has(n) || u.push(n) : n && n.length && "string" !== i && o(n)
                        })
                    }(arguments),
                    i ? s = u.length : t && (r = n,
                    c(t))
                }
                return this
            },
            remove: function() {
                return u && Z.each(arguments, function(e, t) {
                    for (var n; (n = Z.inArray(t, u, n)) > -1; )
                        u.splice(n, 1),
                        i && (s >= n && s--,
                        a >= n && a--)
                }),
                this
            },
            has: function(e) {
                return e ? Z.inArray(e, u) > -1 : !(!u || !u.length)
            },
            empty: function() {
                return u = [],
                s = 0,
                this
            },
            disable: function() {
                return u = l = t = void 0,
                this
            },
            disabled: function() {
                return !u
            },
            lock: function() {
                return l = void 0,
                t || d.disable(),
                this
            },
            locked: function() {
                return !l
            },
            fireWith: function(e, t) {
                return !u || n && !l || (t = t || [],
                t = [e, t.slice ? t.slice() : t],
                i ? l.push(t) : c(t)),
                this
            },
            fire: function() {
                return d.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!n
            }
        };
        return d
    }
    ,
    Z.extend({
        Deferred: function(e) {
            var t = [["resolve", "done", Z.Callbacks("once memory"), "resolved"], ["reject", "fail", Z.Callbacks("once memory"), "rejected"], ["notify", "progress", Z.Callbacks("memory")]]
              , n = "pending"
              , i = {
                state: function() {
                    return n
                },
                always: function() {
                    return r.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var e = arguments;
                    return Z.Deferred(function(n) {
                        Z.each(t, function(t, o) {
                            var s = Z.isFunction(e[t]) && e[t];
                            r[o[1]](function() {
                                var e = s && s.apply(this, arguments);
                                e && Z.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === i ? n.promise() : this, s ? [e] : arguments)
                            })
                        }),
                        e = null
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? Z.extend(e, i) : i
                }
            }
              , r = {};
            return i.pipe = i.then,
            Z.each(t, function(e, o) {
                var s = o[2]
                  , a = o[3];
                i[o[1]] = s.add,
                a && s.add(function() {
                    n = a
                }, t[1 ^ e][2].disable, t[2][2].lock),
                r[o[0]] = function() {
                    return r[o[0] + "With"](this === r ? i : this, arguments),
                    this
                }
                ,
                r[o[0] + "With"] = s.fireWith
            }),
            i.promise(r),
            e && e.call(r, r),
            r
        },
        when: function(e) {
            var t, n, i, r = 0, o = $.call(arguments), s = o.length, a = 1 !== s || e && Z.isFunction(e.promise) ? s : 0, u = 1 === a ? e : Z.Deferred(), l = function(e, n, i) {
                return function(r) {
                    n[e] = this,
                    i[e] = arguments.length > 1 ? $.call(arguments) : r,
                    i === t ? u.notifyWith(n, i) : --a || u.resolveWith(n, i)
                }
            };
            if (s > 1)
                for (t = new Array(s),
                n = new Array(s),
                i = new Array(s); s > r; r++)
                    o[r] && Z.isFunction(o[r].promise) ? o[r].promise().done(l(r, i, o)).fail(u.reject).progress(l(r, n, t)) : --a;
            return a || u.resolveWith(i, o),
            u.promise()
        }
    });
    var ge;
    Z.fn.ready = function(e) {
        return Z.ready.promise().done(e),
        this
    }
    ,
    Z.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? Z.readyWait++ : Z.ready(!0)
        },
        ready: function(e) {
            (e === !0 ? --Z.readyWait : Z.isReady) || (Z.isReady = !0,
            e !== !0 && --Z.readyWait > 0 || (ge.resolveWith(Q, [Z]),
            Z.fn.triggerHandler && (Z(Q).triggerHandler("ready"),
            Z(Q).off("ready"))))
        }
    }),
    Z.ready.promise = function(t) {
        return ge || (ge = Z.Deferred(),
        "complete" === Q.readyState ? setTimeout(Z.ready) : (Q.addEventListener("DOMContentLoaded", s, !1),
        e.addEventListener("load", s, !1))),
        ge.promise(t)
    }
    ,
    Z.ready.promise();
    var me = Z.access = function(e, t, n, i, r, o, s) {
        var a = 0
          , u = e.length
          , l = null == n;
        if ("object" === Z.type(n)) {
            r = !0;
            for (a in n)
                Z.access(e, t, a, n[a], !0, o, s)
        } else if (void 0 !== i && (r = !0,
        Z.isFunction(i) || (s = !0),
        l && (s ? (t.call(e, i),
        t = null) : (l = t,
        t = function(e, t, n) {
            return l.call(Z(e), n)
        }
        )),
        t))
            for (; u > a; a++)
                t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
        return r ? e : l ? t.call(e) : u ? t(e[0], n) : o
    }
    ;
    Z.acceptData = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    }
    ,
    a.uid = 1,
    a.accepts = Z.acceptData,
    a.prototype = {
        key: function(e) {
            if (!a.accepts(e))
                return 0;
            var t = {}
              , n = e[this.expando];
            if (!n) {
                n = a.uid++;
                try {
                    t[this.expando] = {
                        value: n
                    },
                    Object.defineProperties(e, t)
                } catch (i) {
                    t[this.expando] = n,
                    Z.extend(e, t)
                }
            }
            return this.cache[n] || (this.cache[n] = {}),
            n
        },
        set: function(e, t, n) {
            var i, r = this.key(e), o = this.cache[r];
            if ("string" == typeof t)
                o[t] = n;
            else if (Z.isEmptyObject(o))
                Z.extend(this.cache[r], t);
            else
                for (i in t)
                    o[i] = t[i];
            return o
        },
        get: function(e, t) {
            var n = this.cache[this.key(e)];
            return void 0 === t ? n : n[t]
        },
        access: function(e, t, n) {
            var i;
            return void 0 === t || t && "string" == typeof t && void 0 === n ? (i = this.get(e, t),
            void 0 !== i ? i : this.get(e, Z.camelCase(t))) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, i, r, o = this.key(e), s = this.cache[o];
            if (void 0 === t)
                this.cache[o] = {};
            else {
                Z.isArray(t) ? i = t.concat(t.map(Z.camelCase)) : (r = Z.camelCase(t),
                t in s ? i = [t, r] : (i = r,
                i = i in s ? [i] : i.match(fe) || [])),
                n = i.length;
                for (; n--; )
                    delete s[i[n]]
            }
        },
        hasData: function(e) {
            return !Z.isEmptyObject(this.cache[e[this.expando]] || {})
        },
        discard: function(e) {
            e[this.expando] && delete this.cache[e[this.expando]]
        }
    };
    var ve = new a
      , ye = new a
      , be = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , xe = /([A-Z])/g;
    Z.extend({
        hasData: function(e) {
            return ye.hasData(e) || ve.hasData(e)
        },
        data: function(e, t, n) {
            return ye.access(e, t, n)
        },
        removeData: function(e, t) {
            ye.remove(e, t)
        },
        _data: function(e, t, n) {
            return ve.access(e, t, n)
        },
        _removeData: function(e, t) {
            ve.remove(e, t)
        }
    }),
    Z.fn.extend({
        data: function(e, t) {
            var n, i, r, o = this[0], s = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (r = ye.get(o),
                1 === o.nodeType && !ve.get(o, "hasDataAttrs"))) {
                    for (n = s.length; n--; )
                        s[n] && (i = s[n].name,
                        0 === i.indexOf("data-") && (i = Z.camelCase(i.slice(5)),
                        u(o, i, r[i])));
                    ve.set(o, "hasDataAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function() {
                ye.set(this, e)
            }) : me(this, function(t) {
                var n, i = Z.camelCase(e);
                if (o && void 0 === t) {
                    if (n = ye.get(o, e),
                    void 0 !== n)
                        return n;
                    if (n = ye.get(o, i),
                    void 0 !== n)
                        return n;
                    if (n = u(o, i, void 0),
                    void 0 !== n)
                        return n
                } else
                    this.each(function() {
                        var n = ye.get(this, i);
                        ye.set(this, i, t),
                        -1 !== e.indexOf("-") && void 0 !== n && ye.set(this, e, t)
                    })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                ye.remove(this, e)
            })
        }
    }),
    Z.extend({
        queue: function(e, t, n) {
            var i;
            return e ? (t = (t || "fx") + "queue",
            i = ve.get(e, t),
            n && (!i || Z.isArray(n) ? i = ve.access(e, t, Z.makeArray(n)) : i.push(n)),
            i || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = Z.queue(e, t)
              , i = n.length
              , r = n.shift()
              , o = Z._queueHooks(e, t)
              , s = function() {
                Z.dequeue(e, t)
            };
            "inprogress" === r && (r = n.shift(),
            i--),
            r && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            r.call(e, s, o)),
            !i && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return ve.get(e, n) || ve.access(e, n, {
                empty: Z.Callbacks("once memory").add(function() {
                    ve.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    Z.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e,
            e = "fx",
            n--),
            arguments.length < n ? Z.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = Z.queue(this, e, t);
                Z._queueHooks(this, e),
                "fx" === e && "inprogress" !== n[0] && Z.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                Z.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, i = 1, r = Z.Deferred(), o = this, s = this.length, a = function() {
                --i || r.resolveWith(o, [o])
            };
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; s--; )
                n = ve.get(o[s], e + "queueHooks"),
                n && n.empty && (i++,
                n.empty.add(a));
            return a(),
            r.promise(t)
        }
    });
    var we = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , Te = ["Top", "Right", "Bottom", "Left"]
      , Ce = function(e, t) {
        return e = t || e,
        "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e)
    }
      , Se = /^(?:checkbox|radio)$/i;
    !function() {
        var e = Q.createDocumentFragment()
          , t = e.appendChild(Q.createElement("div"))
          , n = Q.createElement("input");
        n.setAttribute("type", "radio"),
        n.setAttribute("checked", "checked"),
        n.setAttribute("name", "t"),
        t.appendChild(n),
        G.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked,
        t.innerHTML = "<textarea>x</textarea>",
        G.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
    }();
    var ke = "undefined";
    G.focusinBubbles = "onfocusin"in e;
    var Ee = /^key/
      , Ne = /^(?:mouse|pointer|contextmenu)|click/
      , je = /^(?:focusinfocus|focusoutblur)$/
      , De = /^([^.]*)(?:\.(.+)|)$/;
    Z.event = {
        global: {},
        add: function(e, t, n, i, r) {
            var o, s, a, u, l, c, d, p, f, h, g, m = ve.get(e);
            if (m)
                for (n.handler && (o = n,
                n = o.handler,
                r = o.selector),
                n.guid || (n.guid = Z.guid++),
                (u = m.events) || (u = m.events = {}),
                (s = m.handle) || (s = m.handle = function(t) {
                    return typeof Z !== ke && Z.event.triggered !== t.type ? Z.event.dispatch.apply(e, arguments) : void 0
                }
                ),
                t = (t || "").match(fe) || [""],
                l = t.length; l--; )
                    a = De.exec(t[l]) || [],
                    f = g = a[1],
                    h = (a[2] || "").split(".").sort(),
                    f && (d = Z.event.special[f] || {},
                    f = (r ? d.delegateType : d.bindType) || f,
                    d = Z.event.special[f] || {},
                    c = Z.extend({
                        type: f,
                        origType: g,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: r,
                        needsContext: r && Z.expr.match.needsContext.test(r),
                        namespace: h.join(".")
                    }, o),
                    (p = u[f]) || (p = u[f] = [],
                    p.delegateCount = 0,
                    d.setup && d.setup.call(e, i, h, s) !== !1 || e.addEventListener && e.addEventListener(f, s, !1)),
                    d.add && (d.add.call(e, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                    r ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                    Z.event.global[f] = !0)
        },
        remove: function(e, t, n, i, r) {
            var o, s, a, u, l, c, d, p, f, h, g, m = ve.hasData(e) && ve.get(e);
            if (m && (u = m.events)) {
                for (t = (t || "").match(fe) || [""],
                l = t.length; l--; )
                    if (a = De.exec(t[l]) || [],
                    f = g = a[1],
                    h = (a[2] || "").split(".").sort(),
                    f) {
                        for (d = Z.event.special[f] || {},
                        f = (i ? d.delegateType : d.bindType) || f,
                        p = u[f] || [],
                        a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        s = o = p.length; o--; )
                            c = p[o],
                            !r && g !== c.origType || n && n.guid !== c.guid || a && !a.test(c.namespace) || i && i !== c.selector && ("**" !== i || !c.selector) || (p.splice(o, 1),
                            c.selector && p.delegateCount--,
                            d.remove && d.remove.call(e, c));
                        s && !p.length && (d.teardown && d.teardown.call(e, h, m.handle) !== !1 || Z.removeEvent(e, f, m.handle),
                        delete u[f])
                    } else
                        for (f in u)
                            Z.event.remove(e, f + t[l], n, i, !0);
                Z.isEmptyObject(u) && (delete m.handle,
                ve.remove(e, "events"))
            }
        },
        trigger: function(t, n, i, r) {
            var o, s, a, u, l, c, d, p = [i || Q], f = Y.call(t, "type") ? t.type : t, h = Y.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = a = i = i || Q,
            3 !== i.nodeType && 8 !== i.nodeType && !je.test(f + Z.event.triggered) && (f.indexOf(".") >= 0 && (h = f.split("."),
            f = h.shift(),
            h.sort()),
            l = f.indexOf(":") < 0 && "on" + f,
            t = t[Z.expando] ? t : new Z.Event(f,"object" == typeof t && t),
            t.isTrigger = r ? 2 : 3,
            t.namespace = h.join("."),
            t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            t.result = void 0,
            t.target || (t.target = i),
            n = null == n ? [t] : Z.makeArray(n, [t]),
            d = Z.event.special[f] || {},
            r || !d.trigger || d.trigger.apply(i, n) !== !1)) {
                if (!r && !d.noBubble && !Z.isWindow(i)) {
                    for (u = d.delegateType || f,
                    je.test(u + f) || (s = s.parentNode); s; s = s.parentNode)
                        p.push(s),
                        a = s;
                    a === (i.ownerDocument || Q) && p.push(a.defaultView || a.parentWindow || e)
                }
                for (o = 0; (s = p[o++]) && !t.isPropagationStopped(); )
                    t.type = o > 1 ? u : d.bindType || f,
                    c = (ve.get(s, "events") || {})[t.type] && ve.get(s, "handle"),
                    c && c.apply(s, n),
                    c = l && s[l],
                    c && c.apply && Z.acceptData(s) && (t.result = c.apply(s, n),
                    t.result === !1 && t.preventDefault());
                return t.type = f,
                r || t.isDefaultPrevented() || d._default && d._default.apply(p.pop(), n) !== !1 || !Z.acceptData(i) || l && Z.isFunction(i[f]) && !Z.isWindow(i) && (a = i[l],
                a && (i[l] = null),
                Z.event.triggered = f,
                i[f](),
                Z.event.triggered = void 0,
                a && (i[l] = a)),
                t.result
            }
        },
        dispatch: function(e) {
            e = Z.event.fix(e);
            var t, n, i, r, o, s = [], a = $.call(arguments), u = (ve.get(this, "events") || {})[e.type] || [], l = Z.event.special[e.type] || {};
            if (a[0] = e,
            e.delegateTarget = this,
            !l.preDispatch || l.preDispatch.call(this, e) !== !1) {
                for (s = Z.event.handlers.call(this, e, u),
                t = 0; (r = s[t++]) && !e.isPropagationStopped(); )
                    for (e.currentTarget = r.elem,
                    n = 0; (o = r.handlers[n++]) && !e.isImmediatePropagationStopped(); )
                        (!e.namespace_re || e.namespace_re.test(o.namespace)) && (e.handleObj = o,
                        e.data = o.data,
                        i = ((Z.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, a),
                        void 0 !== i && (e.result = i) === !1 && (e.preventDefault(),
                        e.stopPropagation()));
                return l.postDispatch && l.postDispatch.call(this, e),
                e.result
            }
        },
        handlers: function(e, t) {
            var n, i, r, o, s = [], a = t.delegateCount, u = e.target;
            if (a && u.nodeType && (!e.button || "click" !== e.type))
                for (; u !== this; u = u.parentNode || this)
                    if (u.disabled !== !0 || "click" !== e.type) {
                        for (i = [],
                        n = 0; a > n; n++)
                            o = t[n],
                            r = o.selector + " ",
                            void 0 === i[r] && (i[r] = o.needsContext ? Z(r, this).index(u) >= 0 : Z.find(r, this, null, [u]).length),
                            i[r] && i.push(o);
                        i.length && s.push({
                            elem: u,
                            handlers: i
                        })
                    }
            return a < t.length && s.push({
                elem: this,
                handlers: t.slice(a)
            }),
            s
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, i, r, o = t.button;
                return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || Q,
                i = n.documentElement,
                r = n.body,
                e.pageX = t.clientX + (i && i.scrollLeft || r && r.scrollLeft || 0) - (i && i.clientLeft || r && r.clientLeft || 0),
                e.pageY = t.clientY + (i && i.scrollTop || r && r.scrollTop || 0) - (i && i.clientTop || r && r.clientTop || 0)),
                e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                e
            }
        },
        fix: function(e) {
            if (e[Z.expando])
                return e;
            var t, n, i, r = e.type, o = e, s = this.fixHooks[r];
            for (s || (this.fixHooks[r] = s = Ne.test(r) ? this.mouseHooks : Ee.test(r) ? this.keyHooks : {}),
            i = s.props ? this.props.concat(s.props) : this.props,
            e = new Z.Event(o),
            t = i.length; t--; )
                n = i[t],
                e[n] = o[n];
            return e.target || (e.target = Q),
            3 === e.target.nodeType && (e.target = e.target.parentNode),
            s.filter ? s.filter(e, o) : e
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    return this !== d() && this.focus ? (this.focus(),
                    !1) : void 0
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === d() && this.blur ? (this.blur(),
                    !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return "checkbox" === this.type && this.click && Z.nodeName(this, "input") ? (this.click(),
                    !1) : void 0
                },
                _default: function(e) {
                    return Z.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, i) {
            var r = Z.extend(new Z.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? Z.event.trigger(r, null, t) : Z.event.dispatch.call(t, r),
            r.isDefaultPrevented() && n.preventDefault()
        }
    },
    Z.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    }
    ,
    Z.Event = function(e, t) {
        return this instanceof Z.Event ? (e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? l : c) : this.type = e,
        t && Z.extend(this, t),
        this.timeStamp = e && e.timeStamp || Z.now(),
        void (this[Z.expando] = !0)) : new Z.Event(e,t)
    }
    ,
    Z.Event.prototype = {
        isDefaultPrevented: c,
        isPropagationStopped: c,
        isImmediatePropagationStopped: c,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = l,
            e && e.preventDefault && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = l,
            e && e.stopPropagation && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = l,
            e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    Z.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        Z.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, i = this, r = e.relatedTarget, o = e.handleObj;
                return (!r || r !== i && !Z.contains(i, r)) && (e.type = o.origType,
                n = o.handler.apply(this, arguments),
                e.type = t),
                n
            }
        }
    }),
    G.focusinBubbles || Z.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            Z.event.simulate(t, e.target, Z.event.fix(e), !0)
        };
        Z.event.special[t] = {
            setup: function() {
                var i = this.ownerDocument || this
                  , r = ve.access(i, t);
                r || i.addEventListener(e, n, !0),
                ve.access(i, t, (r || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this
                  , r = ve.access(i, t) - 1;
                r ? ve.access(i, t, r) : (i.removeEventListener(e, n, !0),
                ve.remove(i, t))
            }
        }
    }),
    Z.fn.extend({
        on: function(e, t, n, i, r) {
            var o, s;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t,
                t = void 0);
                for (s in e)
                    this.on(s, t, n, e[s], r);
                return this
            }
            if (null == n && null == i ? (i = t,
            n = t = void 0) : null == i && ("string" == typeof t ? (i = n,
            n = void 0) : (i = n,
            n = t,
            t = void 0)),
            i === !1)
                i = c;
            else if (!i)
                return this;
            return 1 === r && (o = i,
            i = function(e) {
                return Z().off(e),
                o.apply(this, arguments)
            }
            ,
            i.guid = o.guid || (o.guid = Z.guid++)),
            this.each(function() {
                Z.event.add(this, e, i, n, t)
            })
        },
        one: function(e, t, n, i) {
            return this.on(e, t, n, i, 1)
        },
        off: function(e, t, n) {
            var i, r;
            if (e && e.preventDefault && e.handleObj)
                return i = e.handleObj,
                Z(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler),
                this;
            if ("object" == typeof e) {
                for (r in e)
                    this.off(r, t, e[r]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t,
            t = void 0),
            n === !1 && (n = c),
            this.each(function() {
                Z.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                Z.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? Z.event.trigger(e, t, n, !0) : void 0
        }
    });
    var Ae = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
      , Le = /<([\w:]+)/
      , Oe = /<|&#?\w+;/
      , qe = /<(?:script|style|link)/i
      , Me = /checked\s*(?:[^=]|=\s*.checked.)/i
      , He = /^$|\/(?:java|ecma)script/i
      , Pe = /^true\/(.*)/
      , Fe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
      , Re = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    Re.optgroup = Re.option,
    Re.tbody = Re.tfoot = Re.colgroup = Re.caption = Re.thead,
    Re.th = Re.td,
    Z.extend({
        clone: function(e, t, n) {
            var i, r, o, s, a = e.cloneNode(!0), u = Z.contains(e.ownerDocument, e);
            if (!(G.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Z.isXMLDoc(e)))
                for (s = v(a),
                o = v(e),
                i = 0,
                r = o.length; r > i; i++)
                    y(o[i], s[i]);
            if (t)
                if (n)
                    for (o = o || v(e),
                    s = s || v(a),
                    i = 0,
                    r = o.length; r > i; i++)
                        m(o[i], s[i]);
                else
                    m(e, a);
            return s = v(a, "script"),
            s.length > 0 && g(s, !u && v(e, "script")),
            a
        },
        buildFragment: function(e, t, n, i) {
            for (var r, o, s, a, u, l, c = t.createDocumentFragment(), d = [], p = 0, f = e.length; f > p; p++)
                if (r = e[p],
                r || 0 === r)
                    if ("object" === Z.type(r))
                        Z.merge(d, r.nodeType ? [r] : r);
                    else if (Oe.test(r)) {
                        for (o = o || c.appendChild(t.createElement("div")),
                        s = (Le.exec(r) || ["", ""])[1].toLowerCase(),
                        a = Re[s] || Re._default,
                        o.innerHTML = a[1] + r.replace(Ae, "<$1></$2>") + a[2],
                        l = a[0]; l--; )
                            o = o.lastChild;
                        Z.merge(d, o.childNodes),
                        o = c.firstChild,
                        o.textContent = ""
                    } else
                        d.push(t.createTextNode(r));
            for (c.textContent = "",
            p = 0; r = d[p++]; )
                if ((!i || -1 === Z.inArray(r, i)) && (u = Z.contains(r.ownerDocument, r),
                o = v(c.appendChild(r), "script"),
                u && g(o),
                n))
                    for (l = 0; r = o[l++]; )
                        He.test(r.type || "") && n.push(r);
            return c
        },
        cleanData: function(e) {
            for (var t, n, i, r, o = Z.event.special, s = 0; void 0 !== (n = e[s]); s++) {
                if (Z.acceptData(n) && (r = n[ve.expando],
                r && (t = ve.cache[r]))) {
                    if (t.events)
                        for (i in t.events)
                            o[i] ? Z.event.remove(n, i) : Z.removeEvent(n, i, t.handle);
                    ve.cache[r] && delete ve.cache[r]
                }
                delete ye.cache[n[ye.expando]]
            }
        }
    }),
    Z.fn.extend({
        text: function(e) {
            return me(this, function(e) {
                return void 0 === e ? Z.text(this) : this.empty().each(function() {
                    (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = p(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = p(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, i = e ? Z.filter(e, this) : this, r = 0; null != (n = i[r]); r++)
                t || 1 !== n.nodeType || Z.cleanData(v(n)),
                n.parentNode && (t && Z.contains(n.ownerDocument, n) && g(v(n, "script")),
                n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (Z.cleanData(v(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null == e ? !1 : e,
            t = null == t ? e : t,
            this.map(function() {
                return Z.clone(this, e, t)
            })
        },
        html: function(e) {
            return me(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , i = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !qe.test(e) && !Re[(Le.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(Ae, "<$1></$2>");
                    try {
                        for (; i > n; n++)
                            t = this[n] || {},
                            1 === t.nodeType && (Z.cleanData(v(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (r) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode,
                Z.cleanData(v(this)),
                e && e.replaceChild(t, this)
            }),
            e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, t) {
            e = _.apply([], e);
            var n, i, r, o, s, a, u = 0, l = this.length, c = this, d = l - 1, p = e[0], g = Z.isFunction(p);
            if (g || l > 1 && "string" == typeof p && !G.checkClone && Me.test(p))
                return this.each(function(n) {
                    var i = c.eq(n);
                    g && (e[0] = p.call(this, n, i.html())),
                    i.domManip(e, t)
                });
            if (l && (n = Z.buildFragment(e, this[0].ownerDocument, !1, this),
            i = n.firstChild,
            1 === n.childNodes.length && (n = i),
            i)) {
                for (r = Z.map(v(n, "script"), f),
                o = r.length; l > u; u++)
                    s = n,
                    u !== d && (s = Z.clone(s, !0, !0),
                    o && Z.merge(r, v(s, "script"))),
                    t.call(this[u], s, u);
                if (o)
                    for (a = r[r.length - 1].ownerDocument,
                    Z.map(r, h),
                    u = 0; o > u; u++)
                        s = r[u],
                        He.test(s.type || "") && !ve.access(s, "globalEval") && Z.contains(a, s) && (s.src ? Z._evalUrl && Z._evalUrl(s.src) : Z.globalEval(s.textContent.replace(Fe, "")))
            }
            return this
        }
    }),
    Z.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        Z.fn[e] = function(e) {
            for (var n, i = [], r = Z(e), o = r.length - 1, s = 0; o >= s; s++)
                n = s === o ? this : this.clone(!0),
                Z(r[s])[t](n),
                X.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var Be, Ie = {}, We = /^margin/, ze = new RegExp("^(" + we + ")(?!px)[a-z%]+$","i"), $e = function(t) {
        return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null)
    };
    !function() {
        function t() {
            s.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
            s.innerHTML = "",
            r.appendChild(o);
            var t = e.getComputedStyle(s, null);
            n = "1%" !== t.top,
            i = "4px" === t.width,
            r.removeChild(o)
        }
        var n, i, r = Q.documentElement, o = Q.createElement("div"), s = Q.createElement("div");
        s.style && (s.style.backgroundClip = "content-box",
        s.cloneNode(!0).style.backgroundClip = "",
        G.clearCloneStyle = "content-box" === s.style.backgroundClip,
        o.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",
        o.appendChild(s),
        e.getComputedStyle && Z.extend(G, {
            pixelPosition: function() {
                return t(),
                n
            },
            boxSizingReliable: function() {
                return null == i && t(),
                i
            },
            reliableMarginRight: function() {
                var t, n = s.appendChild(Q.createElement("div"));
                return n.style.cssText = s.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                n.style.marginRight = n.style.width = "0",
                s.style.width = "1px",
                r.appendChild(o),
                t = !parseFloat(e.getComputedStyle(n, null).marginRight),
                r.removeChild(o),
                s.removeChild(n),
                t
            }
        }))
    }(),
    Z.swap = function(e, t, n, i) {
        var r, o, s = {};
        for (o in t)
            s[o] = e.style[o],
            e.style[o] = t[o];
        r = n.apply(e, i || []);
        for (o in t)
            e.style[o] = s[o];
        return r
    }
    ;
    var _e = /^(none|table(?!-c[ea]).+)/
      , Xe = new RegExp("^(" + we + ")(.*)$","i")
      , Ve = new RegExp("^([+-])=(" + we + ")","i")
      , Ue = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , Je = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , Ye = ["Webkit", "O", "Moz", "ms"];
    Z.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = w(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, s, a = Z.camelCase(t), u = e.style;
                return t = Z.cssProps[a] || (Z.cssProps[a] = C(u, a)),
                s = Z.cssHooks[t] || Z.cssHooks[a],
                void 0 === n ? s && "get"in s && void 0 !== (r = s.get(e, !1, i)) ? r : u[t] : (o = typeof n,
                "string" === o && (r = Ve.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(Z.css(e, t)),
                o = "number"),
                void (null != n && n === n && ("number" !== o || Z.cssNumber[a] || (n += "px"),
                G.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"),
                s && "set"in s && void 0 === (n = s.set(e, n, i)) || (u[t] = n))))
            }
        },
        css: function(e, t, n, i) {
            var r, o, s, a = Z.camelCase(t);
            return t = Z.cssProps[a] || (Z.cssProps[a] = C(e.style, a)),
            s = Z.cssHooks[t] || Z.cssHooks[a],
            s && "get"in s && (r = s.get(e, !0, n)),
            void 0 === r && (r = w(e, t, i)),
            "normal" === r && t in Je && (r = Je[t]),
            "" === n || n ? (o = parseFloat(r),
            n === !0 || Z.isNumeric(o) ? o || 0 : r) : r
        }
    }),
    Z.each(["height", "width"], function(e, t) {
        Z.cssHooks[t] = {
            get: function(e, n, i) {
                return n ? _e.test(Z.css(e, "display")) && 0 === e.offsetWidth ? Z.swap(e, Ue, function() {
                    return E(e, t, i)
                }) : E(e, t, i) : void 0
            },
            set: function(e, n, i) {
                var r = i && $e(e);
                return S(e, n, i ? k(e, t, i, "border-box" === Z.css(e, "boxSizing", !1, r), r) : 0)
            }
        }
    }),
    Z.cssHooks.marginRight = T(G.reliableMarginRight, function(e, t) {
        return t ? Z.swap(e, {
            display: "inline-block"
        }, w, [e, "marginRight"]) : void 0
    }),
    Z.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        Z.cssHooks[e + t] = {
            expand: function(n) {
                for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++)
                    r[e + Te[i] + t] = o[i] || o[i - 2] || o[0];
                return r
            }
        },
        We.test(e) || (Z.cssHooks[e + t].set = S)
    }),
    Z.fn.extend({
        css: function(e, t) {
            return me(this, function(e, t, n) {
                var i, r, o = {}, s = 0;
                if (Z.isArray(t)) {
                    for (i = $e(e),
                    r = t.length; r > s; s++)
                        o[t[s]] = Z.css(e, t[s], !1, i);
                    return o
                }
                return void 0 !== n ? Z.style(e, t, n) : Z.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return N(this, !0)
        },
        hide: function() {
            return N(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Ce(this) ? Z(this).show() : Z(this).hide()
            })
        }
    }),
    Z.Tween = j,
    j.prototype = {
        constructor: j,
        init: function(e, t, n, i, r, o) {
            this.elem = e,
            this.prop = n,
            this.easing = r || "swing",
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = i,
            this.unit = o || (Z.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = j.propHooks[this.prop];
            return e && e.get ? e.get(this) : j.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = j.propHooks[this.prop];
            return this.options.duration ? this.pos = t = Z.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : j.propHooks._default.set(this),
            this
        }
    },
    j.prototype.init.prototype = j.prototype,
    j.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Z.css(e.elem, e.prop, ""),
                t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                Z.fx.step[e.prop] ? Z.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Z.cssProps[e.prop]] || Z.cssHooks[e.prop]) ? Z.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    },
    j.propHooks.scrollTop = j.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    Z.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    },
    Z.fx = j.prototype.init,
    Z.fx.step = {};
    var Ge, Qe, Ke = /^(?:toggle|show|hide)$/, Ze = new RegExp("^(?:([+-])=|)(" + we + ")([a-z%]*)$","i"), et = /queueHooks$/, tt = [O], nt = {
        "*": [function(e, t) {
            var n = this.createTween(e, t)
              , i = n.cur()
              , r = Ze.exec(t)
              , o = r && r[3] || (Z.cssNumber[e] ? "" : "px")
              , s = (Z.cssNumber[e] || "px" !== o && +i) && Ze.exec(Z.css(n.elem, e))
              , a = 1
              , u = 20;
            if (s && s[3] !== o) {
                o = o || s[3],
                r = r || [],
                s = +i || 1;
                do
                    a = a || ".5",
                    s /= a,
                    Z.style(n.elem, e, s + o);
                while (a !== (a = n.cur() / i) && 1 !== a && --u)
            }
            return r && (s = n.start = +s || +i || 0,
            n.unit = o,
            n.end = r[1] ? s + (r[1] + 1) * r[2] : +r[2]),
            n
        }
        ]
    };
    Z.Animation = Z.extend(M, {
        tweener: function(e, t) {
            Z.isFunction(e) ? (t = e,
            e = ["*"]) : e = e.split(" ");
            for (var n, i = 0, r = e.length; r > i; i++)
                n = e[i],
                nt[n] = nt[n] || [],
                nt[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? tt.unshift(e) : tt.push(e)
        }
    }),
    Z.speed = function(e, t, n) {
        var i = e && "object" == typeof e ? Z.extend({}, e) : {
            complete: n || !n && t || Z.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !Z.isFunction(t) && t
        };
        return i.duration = Z.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in Z.fx.speeds ? Z.fx.speeds[i.duration] : Z.fx.speeds._default,
        (null == i.queue || i.queue === !0) && (i.queue = "fx"),
        i.old = i.complete,
        i.complete = function() {
            Z.isFunction(i.old) && i.old.call(this),
            i.queue && Z.dequeue(this, i.queue)
        }
        ,
        i
    }
    ,
    Z.fn.extend({
        fadeTo: function(e, t, n, i) {
            return this.filter(Ce).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i)
        },
        animate: function(e, t, n, i) {
            var r = Z.isEmptyObject(e)
              , o = Z.speed(t, n, i)
              , s = function() {
                var t = M(this, Z.extend({}, e), o);
                (r || ve.get(this, "finish")) && t.stop(!0)
            };
            return s.finish = s,
            r || o.queue === !1 ? this.each(s) : this.queue(o.queue, s)
        },
        stop: function(e, t, n) {
            var i = function(e) {
                var t = e.stop;
                delete e.stop,
                t(n)
            };
            return "string" != typeof e && (n = t,
            t = e,
            e = void 0),
            t && e !== !1 && this.queue(e || "fx", []),
            this.each(function() {
                var t = !0
                  , r = null != e && e + "queueHooks"
                  , o = Z.timers
                  , s = ve.get(this);
                if (r)
                    s[r] && s[r].stop && i(s[r]);
                else
                    for (r in s)
                        s[r] && s[r].stop && et.test(r) && i(s[r]);
                for (r = o.length; r--; )
                    o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n),
                    t = !1,
                    o.splice(r, 1));
                (t || !n) && Z.dequeue(this, e)
            })
        },
        finish: function(e) {
            return e !== !1 && (e = e || "fx"),
            this.each(function() {
                var t, n = ve.get(this), i = n[e + "queue"], r = n[e + "queueHooks"], o = Z.timers, s = i ? i.length : 0;
                for (n.finish = !0,
                Z.queue(this, e, []),
                r && r.stop && r.stop.call(this, !0),
                t = o.length; t--; )
                    o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0),
                    o.splice(t, 1));
                for (t = 0; s > t; t++)
                    i[t] && i[t].finish && i[t].finish.call(this);
                delete n.finish
            })
        }
    }),
    Z.each(["toggle", "show", "hide"], function(e, t) {
        var n = Z.fn[t];
        Z.fn[t] = function(e, i, r) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(A(t, !0), e, i, r)
        }
    }),
    Z.each({
        slideDown: A("show"),
        slideUp: A("hide"),
        slideToggle: A("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        Z.fn[e] = function(e, n, i) {
            return this.animate(t, e, n, i)
        }
    }),
    Z.timers = [],
    Z.fx.tick = function() {
        var e, t = 0, n = Z.timers;
        for (Ge = Z.now(); t < n.length; t++)
            e = n[t],
            e() || n[t] !== e || n.splice(t--, 1);
        n.length || Z.fx.stop(),
        Ge = void 0
    }
    ,
    Z.fx.timer = function(e) {
        Z.timers.push(e),
        e() ? Z.fx.start() : Z.timers.pop()
    }
    ,
    Z.fx.interval = 13,
    Z.fx.start = function() {
        Qe || (Qe = setInterval(Z.fx.tick, Z.fx.interval))
    }
    ,
    Z.fx.stop = function() {
        clearInterval(Qe),
        Qe = null
    }
    ,
    Z.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    Z.fn.delay = function(e, t) {
        return e = Z.fx ? Z.fx.speeds[e] || e : e,
        t = t || "fx",
        this.queue(t, function(t, n) {
            var i = setTimeout(t, e);
            n.stop = function() {
                clearTimeout(i)
            }
        })
    }
    ,
    function() {
        var e = Q.createElement("input")
          , t = Q.createElement("select")
          , n = t.appendChild(Q.createElement("option"));
        e.type = "checkbox",
        G.checkOn = "" !== e.value,
        G.optSelected = n.selected,
        t.disabled = !0,
        G.optDisabled = !n.disabled,
        e = Q.createElement("input"),
        e.value = "t",
        e.type = "radio",
        G.radioValue = "t" === e.value
    }();
    var it, rt, ot = Z.expr.attrHandle;
    Z.fn.extend({
        attr: function(e, t) {
            return me(this, Z.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                Z.removeAttr(this, e)
            })
        }
    }),
    Z.extend({
        attr: function(e, t, n) {
            var i, r, o = e.nodeType;
            return e && 3 !== o && 8 !== o && 2 !== o ? typeof e.getAttribute === ke ? Z.prop(e, t, n) : (1 === o && Z.isXMLDoc(e) || (t = t.toLowerCase(),
            i = Z.attrHooks[t] || (Z.expr.match.bool.test(t) ? rt : it)),
            void 0 === n ? i && "get"in i && null !== (r = i.get(e, t)) ? r : (r = Z.find.attr(e, t),
            null == r ? void 0 : r) : null !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
            n) : void Z.removeAttr(e, t)) : void 0
        },
        removeAttr: function(e, t) {
            var n, i, r = 0, o = t && t.match(fe);
            if (o && 1 === e.nodeType)
                for (; n = o[r++]; )
                    i = Z.propFix[n] || n,
                    Z.expr.match.bool.test(n) && (e[i] = !1),
                    e.removeAttribute(n)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!G.radioValue && "radio" === t && Z.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        }
    }),
    rt = {
        set: function(e, t, n) {
            return t === !1 ? Z.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    Z.each(Z.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = ot[t] || Z.find.attr;
        ot[t] = function(e, t, i) {
            var r, o;
            return i || (o = ot[t],
            ot[t] = r,
            r = null != n(e, t, i) ? t.toLowerCase() : null,
            ot[t] = o),
            r
        }
    });
    var st = /^(?:input|select|textarea|button)$/i;
    Z.fn.extend({
        prop: function(e, t) {
            return me(this, Z.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[Z.propFix[e] || e]
            })
        }
    }),
    Z.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var i, r, o, s = e.nodeType;
            return e && 3 !== s && 8 !== s && 2 !== s ? (o = 1 !== s || !Z.isXMLDoc(e),
            o && (t = Z.propFix[t] || t,
            r = Z.propHooks[t]),
            void 0 !== n ? r && "set"in r && void 0 !== (i = r.set(e, n, t)) ? i : e[t] = n : r && "get"in r && null !== (i = r.get(e, t)) ? i : e[t]) : void 0
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    return e.hasAttribute("tabindex") || st.test(e.nodeName) || e.href ? e.tabIndex : -1
                }
            }
        }
    }),
    G.optSelected || (Z.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        }
    }),
    Z.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        Z.propFix[this.toLowerCase()] = this
    });
    var at = /[\t\r\n\f]/g;
    Z.fn.extend({
        addClass: function(e) {
            var t, n, i, r, o, s, a = "string" == typeof e && e, u = 0, l = this.length;
            if (Z.isFunction(e))
                return this.each(function(t) {
                    Z(this).addClass(e.call(this, t, this.className))
                });
            if (a)
                for (t = (e || "").match(fe) || []; l > u; u++)
                    if (n = this[u],
                    i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(at, " ") : " ")) {
                        for (o = 0; r = t[o++]; )
                            i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                        s = Z.trim(i),
                        n.className !== s && (n.className = s)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, i, r, o, s, a = 0 === arguments.length || "string" == typeof e && e, u = 0, l = this.length;
            if (Z.isFunction(e))
                return this.each(function(t) {
                    Z(this).removeClass(e.call(this, t, this.className))
                });
            if (a)
                for (t = (e || "").match(fe) || []; l > u; u++)
                    if (n = this[u],
                    i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(at, " ") : "")) {
                        for (o = 0; r = t[o++]; )
                            for (; i.indexOf(" " + r + " ") >= 0; )
                                i = i.replace(" " + r + " ", " ");
                        s = e ? Z.trim(i) : "",
                        n.className !== s && (n.className = s)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(Z.isFunction(e) ? function(n) {
                Z(this).toggleClass(e.call(this, n, this.className, t), t)
            }
            : function() {
                if ("string" === n)
                    for (var t, i = 0, r = Z(this), o = e.match(fe) || []; t = o[i++]; )
                        r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                else
                    (n === ke || "boolean" === n) && (this.className && ve.set(this, "__className__", this.className),
                    this.className = this.className || e === !1 ? "" : ve.get(this, "__className__") || "")
            }
            )
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(at, " ").indexOf(t) >= 0)
                    return !0;
            return !1
        }
    });
    var ut = /\r/g;
    Z.fn.extend({
        val: function(e) {
            var t, n, i, r = this[0];
            return arguments.length ? (i = Z.isFunction(e),
            this.each(function(n) {
                var r;
                1 === this.nodeType && (r = i ? e.call(this, n, Z(this).val()) : e,
                null == r ? r = "" : "number" == typeof r ? r += "" : Z.isArray(r) && (r = Z.map(r, function(e) {
                    return null == e ? "" : e + ""
                })),
                t = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()],
                t && "set"in t && void 0 !== t.set(this, r, "value") || (this.value = r))
            })) : r ? (t = Z.valHooks[r.type] || Z.valHooks[r.nodeName.toLowerCase()],
            t && "get"in t && void 0 !== (n = t.get(r, "value")) ? n : (n = r.value,
            "string" == typeof n ? n.replace(ut, "") : null == n ? "" : n)) : void 0
        }
    }),
    Z.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = Z.find.attr(e, "value");
                    return null != t ? t : Z.trim(Z.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, i = e.options, r = e.selectedIndex, o = "select-one" === e.type || 0 > r, s = o ? null : [], a = o ? r + 1 : i.length, u = 0 > r ? a : o ? r : 0; a > u; u++)
                        if (n = i[u],
                        !(!n.selected && u !== r || (G.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && Z.nodeName(n.parentNode, "optgroup"))) {
                            if (t = Z(n).val(),
                            o)
                                return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    for (var n, i, r = e.options, o = Z.makeArray(t), s = r.length; s--; )
                        i = r[s],
                        (i.selected = Z.inArray(i.value, o) >= 0) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    Z.each(["radio", "checkbox"], function() {
        Z.valHooks[this] = {
            set: function(e, t) {
                return Z.isArray(t) ? e.checked = Z.inArray(Z(e).val(), t) >= 0 : void 0
            }
        },
        G.checkOn || (Z.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        Z.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }),
    Z.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var lt = Z.now()
      , ct = /\?/;
    Z.parseJSON = function(e) {
        return JSON.parse(e + "")
    }
    ,
    Z.parseXML = function(e) {
        var t, n;
        if (!e || "string" != typeof e)
            return null;
        try {
            n = new DOMParser,
            t = n.parseFromString(e, "text/xml")
        } catch (i) {
            t = void 0
        }
        return (!t || t.getElementsByTagName("parsererror").length) && Z.error("Invalid XML: " + e),
        t
    }
    ;
    var dt = /#.*$/
      , pt = /([?&])_=[^&]*/
      , ft = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , ht = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
      , gt = /^(?:GET|HEAD)$/
      , mt = /^\/\//
      , vt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/
      , yt = {}
      , bt = {}
      , xt = "*/".concat("*")
      , wt = e.location.href
      , Tt = vt.exec(wt.toLowerCase()) || [];
    Z.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: wt,
            type: "GET",
            isLocal: ht.test(Tt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": xt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": Z.parseJSON,
                "text xml": Z.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? F(F(e, Z.ajaxSettings), t) : F(Z.ajaxSettings, e)
        },
        ajaxPrefilter: H(yt),
        ajaxTransport: H(bt),
        ajax: function(e, t) {
            function n(e, t, n, s) {
                var u, c, v, y, x, T = t;
                2 !== b && (b = 2,
                a && clearTimeout(a),
                i = void 0,
                o = s || "",
                w.readyState = e > 0 ? 4 : 0,
                u = e >= 200 && 300 > e || 304 === e,
                n && (y = R(d, w, n)),
                y = B(d, y, w, u),
                u ? (d.ifModified && (x = w.getResponseHeader("Last-Modified"),
                x && (Z.lastModified[r] = x),
                x = w.getResponseHeader("etag"),
                x && (Z.etag[r] = x)),
                204 === e || "HEAD" === d.type ? T = "nocontent" : 304 === e ? T = "notmodified" : (T = y.state,
                c = y.data,
                v = y.error,
                u = !v)) : (v = T,
                (e || !T) && (T = "error",
                0 > e && (e = 0))),
                w.status = e,
                w.statusText = (t || T) + "",
                u ? h.resolveWith(p, [c, T, w]) : h.rejectWith(p, [w, T, v]),
                w.statusCode(m),
                m = void 0,
                l && f.trigger(u ? "ajaxSuccess" : "ajaxError", [w, d, u ? c : v]),
                g.fireWith(p, [w, T]),
                l && (f.trigger("ajaxComplete", [w, d]),
                --Z.active || Z.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e,
            e = void 0),
            t = t || {};
            var i, r, o, s, a, u, l, c, d = Z.ajaxSetup({}, t), p = d.context || d, f = d.context && (p.nodeType || p.jquery) ? Z(p) : Z.event, h = Z.Deferred(), g = Z.Callbacks("once memory"), m = d.statusCode || {}, v = {}, y = {}, b = 0, x = "canceled", w = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (2 === b) {
                        if (!s)
                            for (s = {}; t = ft.exec(o); )
                                s[t[1].toLowerCase()] = t[2];
                        t = s[e.toLowerCase()]
                    }
                    return null == t ? null : t
                },
                getAllResponseHeaders: function() {
                    return 2 === b ? o : null
                },
                setRequestHeader: function(e, t) {
                    var n = e.toLowerCase();
                    return b || (e = y[n] = y[n] || e,
                    v[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return b || (d.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (2 > b)
                            for (t in e)
                                m[t] = [m[t], e[t]];
                        else
                            w.always(e[w.status]);
                    return this
                },
                abort: function(e) {
                    var t = e || x;
                    return i && i.abort(t),
                    n(0, t),
                    this
                }
            };
            if (h.promise(w).complete = g.add,
            w.success = w.done,
            w.error = w.fail,
            d.url = ((e || d.url || wt) + "").replace(dt, "").replace(mt, Tt[1] + "//"),
            d.type = t.method || t.type || d.method || d.type,
            d.dataTypes = Z.trim(d.dataType || "*").toLowerCase().match(fe) || [""],
            null == d.crossDomain && (u = vt.exec(d.url.toLowerCase()),
            d.crossDomain = !(!u || u[1] === Tt[1] && u[2] === Tt[2] && (u[3] || ("http:" === u[1] ? "80" : "443")) === (Tt[3] || ("http:" === Tt[1] ? "80" : "443")))),
            d.data && d.processData && "string" != typeof d.data && (d.data = Z.param(d.data, d.traditional)),
            P(yt, d, t, w),
            2 === b)
                return w;
            l = Z.event && d.global,
            l && 0 === Z.active++ && Z.event.trigger("ajaxStart"),
            d.type = d.type.toUpperCase(),
            d.hasContent = !gt.test(d.type),
            r = d.url,
            d.hasContent || (d.data && (r = d.url += (ct.test(r) ? "&" : "?") + d.data,
            delete d.data),
            d.cache === !1 && (d.url = pt.test(r) ? r.replace(pt, "$1_=" + lt++) : r + (ct.test(r) ? "&" : "?") + "_=" + lt++)),
            d.ifModified && (Z.lastModified[r] && w.setRequestHeader("If-Modified-Since", Z.lastModified[r]),
            Z.etag[r] && w.setRequestHeader("If-None-Match", Z.etag[r])),
            (d.data && d.hasContent && d.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", d.contentType),
            w.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + xt + "; q=0.01" : "") : d.accepts["*"]);
            for (c in d.headers)
                w.setRequestHeader(c, d.headers[c]);
            if (d.beforeSend && (d.beforeSend.call(p, w, d) === !1 || 2 === b))
                return w.abort();
            x = "abort";
            for (c in {
                success: 1,
                error: 1,
                complete: 1
            })
                w[c](d[c]);
            if (i = P(bt, d, t, w)) {
                w.readyState = 1,
                l && f.trigger("ajaxSend", [w, d]),
                d.async && d.timeout > 0 && (a = setTimeout(function() {
                    w.abort("timeout")
                }, d.timeout));
                try {
                    b = 1,
                    i.send(v, n)
                } catch (T) {
                    if (!(2 > b))
                        throw T;
                    n(-1, T)
                }
            } else
                n(-1, "No Transport");
            return w
        },
        getJSON: function(e, t, n) {
            return Z.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return Z.get(e, void 0, t, "script")
        }
    }),
    Z.each(["get", "post"], function(e, t) {
        Z[t] = function(e, n, i, r) {
            return Z.isFunction(n) && (r = r || i,
            i = n,
            n = void 0),
            Z.ajax({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: i
            })
        }
    }),
    Z._evalUrl = function(e) {
        return Z.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }
    ,
    Z.fn.extend({
        wrapAll: function(e) {
            var t;
            return Z.isFunction(e) ? this.each(function(t) {
                Z(this).wrapAll(e.call(this, t))
            }) : (this[0] && (t = Z(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this)
        },
        wrapInner: function(e) {
            return this.each(Z.isFunction(e) ? function(t) {
                Z(this).wrapInner(e.call(this, t))
            }
            : function() {
                var t = Z(this)
                  , n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            }
            )
        },
        wrap: function(e) {
            var t = Z.isFunction(e);
            return this.each(function(n) {
                Z(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                Z.nodeName(this, "body") || Z(this).replaceWith(this.childNodes)
            }).end()
        }
    }),
    Z.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0
    }
    ,
    Z.expr.filters.visible = function(e) {
        return !Z.expr.filters.hidden(e)
    }
    ;
    var Ct = /%20/g
      , St = /\[\]$/
      , kt = /\r?\n/g
      , Et = /^(?:submit|button|image|reset|file)$/i
      , Nt = /^(?:input|select|textarea|keygen)/i;
    Z.param = function(e, t) {
        var n, i = [], r = function(e, t) {
            t = Z.isFunction(t) ? t() : null == t ? "" : t,
            i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        if (void 0 === t && (t = Z.ajaxSettings && Z.ajaxSettings.traditional),
        Z.isArray(e) || e.jquery && !Z.isPlainObject(e))
            Z.each(e, function() {
                r(this.name, this.value)
            });
        else
            for (n in e)
                I(n, e[n], t, r);
        return i.join("&").replace(Ct, "+")
    }
    ,
    Z.fn.extend({
        serialize: function() {
            return Z.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = Z.prop(this, "elements");
                return e ? Z.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !Z(this).is(":disabled") && Nt.test(this.nodeName) && !Et.test(e) && (this.checked || !Se.test(e))
            }).map(function(e, t) {
                var n = Z(this).val();
                return null == n ? null : Z.isArray(n) ? Z.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(kt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(kt, "\r\n")
                }
            }).get()
        }
    }),
    Z.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest
        } catch (e) {}
    }
    ;
    var jt = 0
      , Dt = {}
      , At = {
        0: 200,
        1223: 204
    }
      , Lt = Z.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
        for (var e in Dt)
            Dt[e]()
    }),
    G.cors = !!Lt && "withCredentials"in Lt,
    G.ajax = Lt = !!Lt,
    Z.ajaxTransport(function(e) {
        var t;
        return G.cors || Lt && !e.crossDomain ? {
            send: function(n, i) {
                var r, o = e.xhr(), s = ++jt;
                if (o.open(e.type, e.url, e.async, e.username, e.password),
                e.xhrFields)
                    for (r in e.xhrFields)
                        o[r] = e.xhrFields[r];
                e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType),
                e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                for (r in n)
                    o.setRequestHeader(r, n[r]);
                t = function(e) {
                    return function() {
                        t && (delete Dt[s],
                        t = o.onload = o.onerror = null,
                        "abort" === e ? o.abort() : "error" === e ? i(o.status, o.statusText) : i(At[o.status] || o.status, o.statusText, "string" == typeof o.responseText ? {
                            text: o.responseText
                        } : void 0, o.getAllResponseHeaders()))
                    }
                }
                ,
                o.onload = t(),
                o.onerror = t("error"),
                t = Dt[s] = t("abort");
                try {
                    o.send(e.hasContent && e.data || null)
                } catch (a) {
                    if (t)
                        throw a
                }
            },
            abort: function() {
                t && t()
            }
        } : void 0
    }),
    Z.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return Z.globalEval(e),
                e
            }
        }
    }),
    Z.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    Z.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n;
            return {
                send: function(i, r) {
                    t = Z("<script>").prop({
                        async: !0,
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", n = function(e) {
                        t.remove(),
                        n = null,
                        e && r("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    Q.head.appendChild(t[0])
                },
                abort: function() {
                    n && n()
                }
            }
        }
    });
    var Ot = []
      , qt = /(=)\?(?=&|$)|\?\?/;
    Z.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Ot.pop() || Z.expando + "_" + lt++;
            return this[e] = !0,
            e
        }
    }),
    Z.ajaxPrefilter("json jsonp", function(t, n, i) {
        var r, o, s, a = t.jsonp !== !1 && (qt.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && qt.test(t.data) && "data");
        return a || "jsonp" === t.dataTypes[0] ? (r = t.jsonpCallback = Z.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
        a ? t[a] = t[a].replace(qt, "$1" + r) : t.jsonp !== !1 && (t.url += (ct.test(t.url) ? "&" : "?") + t.jsonp + "=" + r),
        t.converters["script json"] = function() {
            return s || Z.error(r + " was not called"),
            s[0]
        }
        ,
        t.dataTypes[0] = "json",
        o = e[r],
        e[r] = function() {
            s = arguments
        }
        ,
        i.always(function() {
            e[r] = o,
            t[r] && (t.jsonpCallback = n.jsonpCallback,
            Ot.push(r)),
            s && Z.isFunction(o) && o(s[0]),
            s = o = void 0
        }),
        "script") : void 0
    }),
    Z.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e)
            return null;
        "boolean" == typeof t && (n = t,
        t = !1),
        t = t || Q;
        var i = se.exec(e)
          , r = !n && [];
        return i ? [t.createElement(i[1])] : (i = Z.buildFragment([e], t, r),
        r && r.length && Z(r).remove(),
        Z.merge([], i.childNodes))
    }
    ;
    var Mt = Z.fn.load;
    Z.fn.load = function(e, t, n) {
        if ("string" != typeof e && Mt)
            return Mt.apply(this, arguments);
        var i, r, o, s = this, a = e.indexOf(" ");
        return a >= 0 && (i = Z.trim(e.slice(a)),
        e = e.slice(0, a)),
        Z.isFunction(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (r = "POST"),
        s.length > 0 && Z.ajax({
            url: e,
            type: r,
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            s.html(i ? Z("<div>").append(Z.parseHTML(e)).find(i) : e)
        }).complete(n && function(e, t) {
            s.each(n, o || [e.responseText, t, e])
        }
        ),
        this
    }
    ,
    Z.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        Z.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    Z.expr.filters.animated = function(e) {
        return Z.grep(Z.timers, function(t) {
            return e === t.elem
        }).length
    }
    ;
    var Ht = e.document.documentElement;
    Z.offset = {
        setOffset: function(e, t, n) {
            var i, r, o, s, a, u, l, c = Z.css(e, "position"), d = Z(e), p = {};
            "static" === c && (e.style.position = "relative"),
            a = d.offset(),
            o = Z.css(e, "top"),
            u = Z.css(e, "left"),
            l = ("absolute" === c || "fixed" === c) && (o + u).indexOf("auto") > -1,
            l ? (i = d.position(),
            s = i.top,
            r = i.left) : (s = parseFloat(o) || 0,
            r = parseFloat(u) || 0),
            Z.isFunction(t) && (t = t.call(e, n, a)),
            null != t.top && (p.top = t.top - a.top + s),
            null != t.left && (p.left = t.left - a.left + r),
            "using"in t ? t.using.call(e, p) : d.css(p)
        }
    },
    Z.fn.extend({
        offset: function(e) {
            if (arguments.length)
                return void 0 === e ? this : this.each(function(t) {
                    Z.offset.setOffset(this, e, t)
                });
            var t, n, i = this[0], r = {
                top: 0,
                left: 0
            }, o = i && i.ownerDocument;
            return o ? (t = o.documentElement,
            Z.contains(t, i) ? (typeof i.getBoundingClientRect !== ke && (r = i.getBoundingClientRect()),
            n = W(o),
            {
                top: r.top + n.pageYOffset - t.clientTop,
                left: r.left + n.pageXOffset - t.clientLeft
            }) : r) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = this[0], i = {
                    top: 0,
                    left: 0
                };
                return "fixed" === Z.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(),
                t = this.offset(),
                Z.nodeName(e[0], "html") || (i = e.offset()),
                i.top += Z.css(e[0], "borderTopWidth", !0),
                i.left += Z.css(e[0], "borderLeftWidth", !0)),
                {
                    top: t.top - i.top - Z.css(n, "marginTop", !0),
                    left: t.left - i.left - Z.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || Ht; e && !Z.nodeName(e, "html") && "static" === Z.css(e, "position"); )
                    e = e.offsetParent;
                return e || Ht
            })
        }
    }),
    Z.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, n) {
        var i = "pageYOffset" === n;
        Z.fn[t] = function(r) {
            return me(this, function(t, r, o) {
                var s = W(t);
                return void 0 === o ? s ? s[n] : t[r] : void (s ? s.scrollTo(i ? e.pageXOffset : o, i ? o : e.pageYOffset) : t[r] = o)
            }, t, r, arguments.length, null)
        }
    }),
    Z.each(["top", "left"], function(e, t) {
        Z.cssHooks[t] = T(G.pixelPosition, function(e, n) {
            return n ? (n = w(e, t),
            ze.test(n) ? Z(e).position()[t] + "px" : n) : void 0
        })
    }),
    Z.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        Z.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, i) {
            Z.fn[i] = function(i, r) {
                var o = arguments.length && (n || "boolean" != typeof i)
                  , s = n || (i === !0 || r === !0 ? "margin" : "border");
                return me(this, function(t, n, i) {
                    var r;
                    return Z.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement,
                    Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === i ? Z.css(t, n, s) : Z.style(t, n, i, s)
                }, t, o ? i : void 0, o, null)
            }
        })
    }),
    Z.fn.size = function() {
        return this.length
    }
    ,
    Z.fn.andSelf = Z.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return Z
    });
    var Pt = e.jQuery
      , Ft = e.$;
    return Z.noConflict = function(t) {
        return e.$ === Z && (e.$ = Ft),
        t && e.jQuery === Z && (e.jQuery = Pt),
        Z
    }
    ,
    typeof t === ke && (e.jQuery = e.$ = Z),
    Z
}),
function(e) {
    "use strict";
    function t(e) {
        return new RegExp("(^|\\s+)" + e + "(\\s+|$)")
    }
    function n(e, t) {
        var n = i(e, t) ? o : r;
        n(e, t)
    }
    var i, r, o;
    "classList"in document.documentElement ? (i = function(e, t) {
        return e.classList.contains(t)
    }
    ,
    r = function(e, t) {
        e.classList.add(t)
    }
    ,
    o = function(e, t) {
        e.classList.remove(t)
    }
    ) : (i = function(e, n) {
        return t(n).test(e.className)
    }
    ,
    r = function(e, t) {
        i(e, t) || (e.className = e.className + " " + t)
    }
    ,
    o = function(e, n) {
        e.className = e.className.replace(t(n), " ")
    }
    );
    var s = {
        hasClass: i,
        addClass: r,
        removeClass: o,
        toggleClass: n,
        has: i,
        add: r,
        remove: o,
        toggle: n
    };
    "function" == typeof define && define.amd ? define(s) : "object" == typeof exports ? module.exports = s : e.classie = s
}(window),
!function e(t, n, i) {
    function r(s, a) {
        if (!n[s]) {
            if (!t[s]) {
                var u = "function" == typeof require && require;
                if (!a && u)
                    return u(s, !0);
                if (o)
                    return o(s, !0);
                throw new Error("Cannot find module '" + s + "'")
            }
            var l = n[s] = {
                exports: {}
            };
            t[s][0].call(l.exports, function(e) {
                var n = t[s][1][e];
                return r(n ? n : e)
            }, l, l.exports, e, t, n, i)
        }
        return n[s].exports
    }
    for (var o = "function" == typeof require && require, s = 0; s < i.length; s++)
        r(i[s]);
    return r
}({
    1: [function(e, t, n) {
        function i(e, t) {
            var n = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
            n.open("GET", e, !0),
            n.onreadystatechange = function() {
                if (200 == n.status && 4 == n.readyState)
                    try {
                        t(null, JSON.parse(n.responseText))
                    } catch (e) {
                        t(e, null)
                    }
            }
            ,
            n.send()
        }
        t.exports = {
            load: i
        }
    }
    , {}],
    2: [function(e, t, n) {
        function i(e) {
            return s(e) ? u(e) : a(e) ? l(e) : void 0
        }
        function r() {
            return g.length = 0,
            g
        }
        function o() {
            return g
        }
        function s(e) {
            return !!e && "[object Object]" == Object.prototype.toString.call(e)
        }
        function a(e) {
            return !!e && "[object Array]" == Object.prototype.toString.call(e)
        }
        function u(e) {
            return g.push(e),
            g
        }
        function l(e) {
            for (var t = [], n = 0; n < e.length; n++)
                s(e[n]) && t.push(u(e[n]));
            return t
        }
        function c(e) {
            return e ? p(g, e, m.searchStrategy, m) : []
        }
        function d(t) {
            m = t || {},
            m.fuzzy = t.fuzzy || !1,
            m.limit = t.limit || 10,
            m.searchStrategy = e(t.fuzzy ? "./SearchStrategies/FuzzySearchStrategy" : "./SearchStrategies/LiteralSearchStrategy")
        }
        function p(e, t, n, i) {
            for (var r = [], o = 0; o < e.length && r.length < i.limit; o++) {
                var s = f(e[o], t, n, i);
                s && r.push(s)
            }
            return r
        }
        function f(e, t, n, i) {
            for (var r in e)
                if (!h(e[r], i.exclude) && n.matches(e[r], t))
                    return e
        }
        function h(e, t) {
            var n = !1;
            t = t || [];
            for (var i = 0; i < t.length; i++) {
                var r = t[i];
                !n && new RegExp(e).test(r) && (n = !0)
            }
            return n
        }
        t.exports = {
            put: i,
            clear: r,
            get: o,
            search: c,
            setOptions: d
        };
        var g = []
          , m = {};
        m.fuzzy = !1,
        m.limit = 10,
        m.searchStrategy = e(m.fuzzy ? "./SearchStrategies/FuzzySearchStrategy" : "./SearchStrategies/LiteralSearchStrategy")
    }
    , {
        "./SearchStrategies/FuzzySearchStrategy": 3,
        "./SearchStrategies/LiteralSearchStrategy": 4
    }],
    3: [function(e, t, n) {
        function i() {
            function e(e) {
                return new RegExp(e.split("").join(".*?"),"gi")
            }
            this.matches = function(t, n) {
                return "string" != typeof t ? !1 : (t = t.trim(),
                !!e(n).test(t))
            }
        }
        t.exports = new i
    }
    , {}],
    4: [function(e, t, n) {
        function i() {
            this.matches = function(e, t) {
                return "string" != typeof e ? !1 : (e = e.trim(),
                e.toLowerCase().indexOf(t.toLowerCase()) >= 0)
            }
        }
        t.exports = new i
    }
    , {}],
    5: [function(e, t, n) {
        function i(e) {
            o = e || {},
            o.templatePattern = e.templatePattern || /\{(.*?)\}/g
        }
        function r(e, t) {
            return e.replace(o.templatePattern, function(e, n) {
                return t[n] || e
            })
        }
        t.exports = {
            render: r,
            setOptions: i
        };
        var o = {};
        o.templatePattern = /\{(.*?)\}/g
    }
    , {}],
    6: [function(e, t, n) {
        !function(t, n, i) {
            "use strict";
            function r(e) {
                h.put(v.json),
                d()
            }
            function o(e) {
                g.load(e, function(t, n) {
                    t ? s("failed to get JSON (" + e + ")") : (h.put(n),
                    d())
                })
            }
            function s(e) {
                throw new Error("SimpleJekyllSearch --- " + e)
            }
            function a(e) {
                for (var t = 0; t < m.length; t++) {
                    var n = m[t];
                    e[n] || s("You must specify a " + n)
                }
                var i = e;
                for (var r in v)
                    i[r] = e[r] || v[r];
                return i
            }
            function u(e) {
                try {
                    return e instanceof Object && JSON.parse(JSON.stringify(e))
                } catch (t) {
                    return !1
                }
            }
            function l() {
                v.resultsContainer.innerHTML = ""
            }
            function c(e) {
                v.resultsContainer.innerHTML += e
            }
            function d() {
                v.searchInput.addEventListener("keyup", function(e) {
                    return 0 == e.target.value.length ? void l() : void p(h.search(e.target.value))
                })
            }
            function p(e) {
                if (l(),
                0 == e.length)
                    return c(v.noResultsText);
                for (var t = 0; t < e.length; t++)
                    c(f.render(v.searchResultTemplate, e[t]))
            }
            var f = e("./Templater")
              , h = e("./Repository")
              , g = e("./JSONLoader")
              , m = ["searchInput", "resultsContainer", "json"]
              , v = {
                searchInput: null,
                resultsContainer: null,
                json: [],
                searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
                noResultsText: "No results found",
                limit: 10,
                fuzzy: !1,
                exclude: []
            };
            t.SimpleJekyllSearch = function(e) {
                v = a(e),
                h.setOptions(e),
                u(v.json) ? r(v.json) : o(v.json)
            }
            ,
            t.SimpleJekyllSearch.init = t.SimpleJekyllSearch
        }(window, document)
    }
    , {
        "./JSONLoader": 1,
        "./Repository": 2,
        "./Templater": 5
    }]
}, {}, [6]),
!function(e, t, n, i) {
    n.swipebox = function(r, o) {
        var s, a, u = {
            useCSS: !0,
            useSVG: !0,
            initialIndexOnArray: 0,
            removeBarsOnMobile: !0,
            hideCloseButtonOnMobile: !1,
            hideBarsDelay: 3e3,
            videoMaxWidth: 1140,
            vimeoColor: "cccccc",
            beforeOpen: null,
            afterOpen: null,
            afterClose: null,
            nextSlide: null,
            prevSlide: null,
            loopAtEnd: !1,
            autoplayVideos: !1,
            queryStringData: {},
            toggleClassOnLoad: ""
        }, l = this, c = [], d = r.selector, p = n(d), f = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i), h = null !== f || t.createTouch !== i || "ontouchstart"in e || "onmsgesturechange"in e || navigator.msMaxTouchPoints, g = !!t.createElementNS && !!t.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect, m = e.innerWidth ? e.innerWidth : n(e).width(), v = e.innerHeight ? e.innerHeight : n(e).height(), y = 0, b = '<div id="swipebox-overlay">					<div id="swipebox-container">						<div id="swipebox-slider"></div>						<div id="swipebox-top-bar">							<div id="swipebox-title"></div>						</div>						<div id="swipebox-bottom-bar">							<div id="swipebox-arrows">								<a id="swipebox-prev"></a>								<a id="swipebox-next"></a>							</div>						</div>						<a id="swipebox-close"></a>					</div>			</div>';
        l.settings = {},
        n.swipebox.close = function() {
            s.closeSlide()
        }
        ,
        n.swipebox.extend = function() {
            return s
        }
        ,
        l.init = function() {
            l.settings = n.extend({}, u, o),
            n.isArray(r) ? (c = r,
            s.target = n(e),
            s.init(l.settings.initialIndexOnArray)) : n(t).on("click", d, function(e) {
                if ("slide current" === e.target.parentNode.className)
                    return !1;
                n.isArray(r) || (s.destroy(),
                a = n(d),
                s.actions()),
                c = [];
                var t, i, o;
                o || (i = "data-rel",
                o = n(this).attr(i)),
                o || (i = "rel",
                o = n(this).attr(i)),
                a = o && "" !== o && "nofollow" !== o ? p.filter("[" + i + '="' + o + '"]') : n(d),
                a.each(function() {
                    var e = null
                      , t = null;
                    n(this).attr("title") && (e = n(this).attr("title")),
                    n(this).attr("href") && (t = n(this).attr("href")),
                    c.push({
                        href: t,
                        title: e
                    })
                }),
                t = a.index(n(this)),
                e.preventDefault(),
                e.stopPropagation(),
                s.target = n(e.target),
                s.init(t)
            })
        }
        ,
        s = {
            init: function(e) {
                l.settings.beforeOpen && l.settings.beforeOpen(),
                this.target.trigger("swipebox-start"),
                n.swipebox.isOpen = !0,
                this.build(),
                this.openSlide(e),
                this.openMedia(e),
                this.preloadMedia(e + 1),
                this.preloadMedia(e - 1),
                l.settings.afterOpen && l.settings.afterOpen()
            },
            build: function() {
                var e, t = this;
                n("body").append(b),
                g && l.settings.useSVG === !0 && (e = n("#swipebox-close").css("background-image"),
                e = e.replace("png", "svg"),
                n("#swipebox-prev, #swipebox-next, #swipebox-close").css({
                    "background-image": e
                })),
                f && l.settings.removeBarsOnMobile && n("#swipebox-bottom-bar, #swipebox-top-bar").remove(),
                n.each(c, function() {
                    n("#swipebox-slider").append('<div class="slide"></div>')
                }),
                t.setDim(),
                t.actions(),
                h && t.gesture(),
                t.keyboard(),
                t.animBars(),
                t.resize()
            },
            setDim: function() {
                var t, i, r = {};
                "onorientationchange"in e ? e.addEventListener("orientationchange", function() {
                    0 === e.orientation ? (t = m,
                    i = v) : (90 === e.orientation || -90 === e.orientation) && (t = v,
                    i = m)
                }, !1) : (t = e.innerWidth ? e.innerWidth : n(e).width(),
                i = e.innerHeight ? e.innerHeight : n(e).height()),
                r = {
                    width: t,
                    height: i
                },
                n("#swipebox-overlay").css(r)
            },
            resize: function() {
                var t = this;
                n(e).resize(function() {
                    t.setDim()
                }).resize()
            },
            supportTransition: function() {
                var e, n = "transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");
                for (e = 0; e < n.length; e++)
                    if (t.createElement("div").style[n[e]] !== i)
                        return n[e];
                return !1
            },
            doCssTrans: function() {
                return l.settings.useCSS && this.supportTransition() ? !0 : void 0
            },
            gesture: function() {
                var e, t, i, r, o, s, a = this, u = !1, l = !1, d = 10, p = 50, f = {}, h = {}, g = n("#swipebox-top-bar, #swipebox-bottom-bar"), v = n("#swipebox-slider");
                g.addClass("visible-bars"),
                a.setTimeout(),
                n("body").bind("touchstart", function(a) {
                    return n(this).addClass("touching"),
                    e = n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current")),
                    h = a.originalEvent.targetTouches[0],
                    f.pageX = a.originalEvent.targetTouches[0].pageX,
                    f.pageY = a.originalEvent.targetTouches[0].pageY,
                    n("#swipebox-slider").css({
                        "-webkit-transform": "translate3d(" + y + "%, 0, 0)",
                        transform: "translate3d(" + y + "%, 0, 0)"
                    }),
                    n(".touching").bind("touchmove", function(a) {
                        if (a.preventDefault(),
                        a.stopPropagation(),
                        h = a.originalEvent.targetTouches[0],
                        !l && (o = i,
                        i = h.pageY - f.pageY,
                        Math.abs(i) >= p || u)) {
                            var g = .75 - Math.abs(i) / v.height();
                            v.css({
                                top: i + "px"
                            }),
                            v.css({
                                opacity: g
                            }),
                            u = !0
                        }
                        r = t,
                        t = h.pageX - f.pageX,
                        s = 100 * t / m,
                        !l && !u && Math.abs(t) >= d && (n("#swipebox-slider").css({
                            "-webkit-transition": "",
                            transition: ""
                        }),
                        l = !0),
                        l && (t > 0 ? 0 === e ? n("#swipebox-overlay").addClass("leftSpringTouch") : (n("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),
                        n("#swipebox-slider").css({
                            "-webkit-transform": "translate3d(" + (y + s) + "%, 0, 0)",
                            transform: "translate3d(" + (y + s) + "%, 0, 0)"
                        })) : 0 > t && (c.length === e + 1 ? n("#swipebox-overlay").addClass("rightSpringTouch") : (n("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),
                        n("#swipebox-slider").css({
                            "-webkit-transform": "translate3d(" + (y + s) + "%, 0, 0)",
                            transform: "translate3d(" + (y + s) + "%, 0, 0)"
                        }))))
                    }),
                    !1
                }).bind("touchend", function(e) {
                    if (e.preventDefault(),
                    e.stopPropagation(),
                    n("#swipebox-slider").css({
                        "-webkit-transition": "-webkit-transform 0.4s ease",
                        transition: "transform 0.4s ease"
                    }),
                    i = h.pageY - f.pageY,
                    t = h.pageX - f.pageX,
                    s = 100 * t / m,
                    u)
                        if (u = !1,
                        Math.abs(i) >= 2 * p && Math.abs(i) > Math.abs(o)) {
                            var c = i > 0 ? v.height() : -v.height();
                            v.animate({
                                top: c + "px",
                                opacity: 0
                            }, 300, function() {
                                a.closeSlide()
                            })
                        } else
                            v.animate({
                                top: 0,
                                opacity: 1
                            }, 300);
                    else
                        l ? (l = !1,
                        t >= d && t >= r ? a.getPrev() : -d >= t && r >= t && a.getNext()) : g.hasClass("visible-bars") ? (a.clearTimeout(),
                        a.hideBars()) : (a.showBars(),
                        a.setTimeout());
                    n("#swipebox-slider").css({
                        "-webkit-transform": "translate3d(" + y + "%, 0, 0)",
                        transform: "translate3d(" + y + "%, 0, 0)"
                    }),
                    n("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),
                    n(".touching").off("touchmove").removeClass("touching")
                })
            },
            setTimeout: function() {
                if (l.settings.hideBarsDelay > 0) {
                    var t = this;
                    t.clearTimeout(),
                    t.timeout = e.setTimeout(function() {
                        t.hideBars()
                    }, l.settings.hideBarsDelay)
                }
            },
            clearTimeout: function() {
                e.clearTimeout(this.timeout),
                this.timeout = null
            },
            showBars: function() {
                var e = n("#swipebox-top-bar, #swipebox-bottom-bar");
                this.doCssTrans() ? e.addClass("visible-bars") : (n("#swipebox-top-bar").animate({
                    top: 0
                }, 500),
                n("#swipebox-bottom-bar").animate({
                    bottom: 0
                }, 500),
                setTimeout(function() {
                    e.addClass("visible-bars")
                }, 1e3))
            },
            hideBars: function() {
                var e = n("#swipebox-top-bar, #swipebox-bottom-bar");
                this.doCssTrans() ? e.removeClass("visible-bars") : (n("#swipebox-top-bar").animate({
                    top: "-50px"
                }, 500),
                n("#swipebox-bottom-bar").animate({
                    bottom: "-50px"
                }, 500),
                setTimeout(function() {
                    e.removeClass("visible-bars")
                }, 1e3))
            },
            animBars: function() {
                var e = this
                  , t = n("#swipebox-top-bar, #swipebox-bottom-bar");
                t.addClass("visible-bars"),
                e.setTimeout(),
                n("#swipebox-slider").click(function() {
                    t.hasClass("visible-bars") || (e.showBars(),
                    e.setTimeout())
                }),
                n("#swipebox-bottom-bar").hover(function() {
                    e.showBars(),
                    t.addClass("visible-bars"),
                    e.clearTimeout()
                }, function() {
                    l.settings.hideBarsDelay > 0 && (t.removeClass("visible-bars"),
                    e.setTimeout())
                })
            },
            keyboard: function() {
                var t = this;
                n(e).bind("keyup", function(e) {
                    e.preventDefault(),
                    e.stopPropagation(),
                    37 === e.keyCode ? t.getPrev() : 39 === e.keyCode ? t.getNext() : 27 === e.keyCode && t.closeSlide()
                })
            },
            actions: function() {
                var e = this
                  , t = "touchend click";
                c.length < 2 ? (n("#swipebox-bottom-bar").hide(),
                i === c[1] && n("#swipebox-top-bar").hide()) : (n("#swipebox-prev").bind(t, function(t) {
                    t.preventDefault(),
                    t.stopPropagation(),
                    e.getPrev(),
                    e.setTimeout()
                }),
                n("#swipebox-next").bind(t, function(t) {
                    t.preventDefault(),
                    t.stopPropagation(),
                    e.getNext(),
                    e.setTimeout()
                })),
                n("#swipebox-close").bind(t, function() {
                    e.closeSlide()
                })
            },
            setSlide: function(e, t) {
                t = t || !1;
                var i = n("#swipebox-slider");
                y = 100 * -e,
                this.doCssTrans() ? i.css({
                    "-webkit-transform": "translate3d(" + 100 * -e + "%, 0, 0)",
                    transform: "translate3d(" + 100 * -e + "%, 0, 0)"
                }) : i.animate({
                    left: 100 * -e + "%"
                }),
                n("#swipebox-slider .slide").removeClass("current"),
                n("#swipebox-slider .slide").eq(e).addClass("current"),
                this.setTitle(e),
                t && i.fadeIn(),
                n("#swipebox-prev, #swipebox-next").removeClass("disabled"),
                0 === e ? n("#swipebox-prev").addClass("disabled") : e === c.length - 1 && l.settings.loopAtEnd !== !0 && n("#swipebox-next").addClass("disabled")
            },
            openSlide: function(t) {
                n("html").addClass("swipebox-html"),
                h ? (n("html").addClass("swipebox-touch"),
                l.settings.hideCloseButtonOnMobile && n("html").addClass("swipebox-no-close-button")) : n("html").addClass("swipebox-no-touch"),
                n(e).trigger("resize"),
                this.setSlide(t, !0)
            },
            preloadMedia: function(e) {
                var t = this
                  , n = null;
                c[e] !== i && (n = c[e].href),
                t.isVideo(n) ? t.openMedia(e) : setTimeout(function() {
                    t.openMedia(e)
                }, 1e3)
            },
            openMedia: function(e) {
                var t, r, o = this;
                return c[e] !== i && (t = c[e].href),
                0 > e || e >= c.length ? !1 : (r = n("#swipebox-slider .slide").eq(e),
                void (o.isVideo(t) ? r.html(o.getVideo(t)) : (r.addClass("slide-loading"),
                o.loadMedia(t, function() {
                    r.removeClass("slide-loading"),
                    r.html(this)
                }))))
            },
            setTitle: function(e) {
                var t = null;
                n("#swipebox-title").empty(),
                c[e] !== i && (t = c[e].title),
                t ? (n("#swipebox-top-bar").show(),
                n("#swipebox-title").append(t)) : n("#swipebox-top-bar").hide()
            },
            isVideo: function(e) {
                if (e) {
                    if (e.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || e.match(/vimeo\.com\/([0-9]*)/) || e.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/))
                        return !0;
                    if (e.toLowerCase().indexOf("swipeboxvideo=1") >= 0)
                        return !0
                }
            },
            parseUri: function(e, i) {
                var r = t.createElement("a")
                  , o = {};
                return r.href = decodeURIComponent(e),
                r.search && (o = JSON.parse('{"' + r.search.toLowerCase().replace("?", "").replace(/&/g, '","').replace(/=/g, '":"') + '"}')),
                n.isPlainObject(i) && (o = n.extend(o, i, l.settings.queryStringData)),
                n.map(o, function(e, t) {
                    return e && e > "" ? encodeURIComponent(t) + "=" + encodeURIComponent(e) : void 0
                }).join("&")
            },
            getVideo: function(e) {
                var t = ""
                  , n = e.match(/((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/)
                  , i = e.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/)
                  , r = e.match(/(?:www\.)?vimeo\.com\/([0-9]*)/)
                  , o = "";
                return n || i ? (i && (n = i),
                o = s.parseUri(e, {
                    autoplay: l.settings.autoplayVideos ? "1" : "0",
                    v: ""
                }),
                t = '<iframe width="560" height="315" src="//' + n[1] + "/embed/" + n[2] + "?" + o + '" frameborder="0" allowfullscreen></iframe>') : r ? (o = s.parseUri(e, {
                    autoplay: l.settings.autoplayVideos ? "1" : "0",
                    byline: "0",
                    portrait: "0",
                    color: l.settings.vimeoColor
                }),
                t = '<iframe width="560" height="315"  src="//player.vimeo.com/video/' + r[1] + "?" + o + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>') : t = '<iframe width="560" height="315" src="' + e + '" frameborder="0" allowfullscreen></iframe>',
                '<div class="swipebox-video-container" style="max-width:' + l.settings.videoMaxWidth + 'px"><div class="swipebox-video">' + t + "</div></div>"
            },
            loadMedia: function(e, t) {
                if (0 === e.trim().indexOf("#"))
                    t.call(n("<div>", {
                        "class": "swipebox-inline-container"
                    }).append(n(e).clone().toggleClass(l.settings.toggleClassOnLoad)));
                else if (!this.isVideo(e)) {
                    var i = n("<img>").on("load", function() {
                        t.call(i)
                    });
                    i.attr("src", e)
                }
            },
            getNext: function() {
                var e, t = this, i = n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));
                i + 1 < c.length ? (e = n("#swipebox-slider .slide").eq(i).contents().find("iframe").attr("src"),
                n("#swipebox-slider .slide").eq(i).contents().find("iframe").attr("src", e),
                i++,
                t.setSlide(i),
                t.preloadMedia(i + 1),
                l.settings.nextSlide && l.settings.nextSlide()) : l.settings.loopAtEnd === !0 ? (e = n("#swipebox-slider .slide").eq(i).contents().find("iframe").attr("src"),
                n("#swipebox-slider .slide").eq(i).contents().find("iframe").attr("src", e),
                i = 0,
                t.preloadMedia(i),
                t.setSlide(i),
                t.preloadMedia(i + 1),
                l.settings.nextSlide && l.settings.nextSlide()) : (n("#swipebox-overlay").addClass("rightSpring"),
                setTimeout(function() {
                    n("#swipebox-overlay").removeClass("rightSpring")
                }, 500))
            },
            getPrev: function() {
                var e, t = n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));
                t > 0 ? (e = n("#swipebox-slider .slide").eq(t).contents().find("iframe").attr("src"),
                n("#swipebox-slider .slide").eq(t).contents().find("iframe").attr("src", e),
                t--,
                this.setSlide(t),
                this.preloadMedia(t - 1),
                l.settings.prevSlide && l.settings.prevSlide()) : (n("#swipebox-overlay").addClass("leftSpring"),
                setTimeout(function() {
                    n("#swipebox-overlay").removeClass("leftSpring")
                }, 500))
            },
            nextSlide: function() {},
            prevSlide: function() {},
            closeSlide: function() {
                n("html").removeClass("swipebox-html"),
                n("html").removeClass("swipebox-touch"),
                n(e).trigger("resize"),
                this.destroy()
            },
            destroy: function() {
                n(e).unbind("keyup"),
                n("body").unbind("touchstart"),
                n("body").unbind("touchmove"),
                n("body").unbind("touchend"),
                n("#swipebox-slider").unbind(),
                n("#swipebox-overlay").remove(),
                n.isArray(r) || r.removeData("_swipebox"),
                this.target && this.target.trigger("swipebox-destroy"),
                n.swipebox.isOpen = !1,
                l.settings.afterClose && l.settings.afterClose()
            }
        },
        l.init()
    }
    ,
    n.fn.swipebox = function(e) {
        if (!n.data(this, "_swipebox")) {
            var t = new n.swipebox(this,e);
            this.data("_swipebox", t)
        }
        return this.data("_swipebox")
    }
}(window, document, jQuery),
function(e) {
    "use strict";
    function t(e, t) {
        for (var n in t)
            t.hasOwnProperty(n) && (e[n] = t[n]);
        return e
    }
    function n(e, n) {
        this.el = e,
        this.options = t({}, this.options),
        t(this.options, n),
        this.ctrlClose = this.el.querySelector("[data-modal-close]"),
        this.isOpen = !1,
        this._initEvents()
    }
    var i = {
        animations: Modernizr.cssanimations
    }
      , r = {
        WebkitAnimation: "webkitAnimationEnd",
        OAnimation: "oAnimationEnd",
        msAnimation: "MSAnimationEnd",
        animation: "animationend"
    }
      , o = r[Modernizr.prefixed("animation")]
      , s = function(e, t) {
        var n = function(e) {
            if (i.animations) {
                if (e.target != this)
                    return;
                this.removeEventListener(o, n)
            }
            t && "function" == typeof t && t.call()
        };
        i.animations ? e.addEventListener(o, n) : n()
    };
    n.prototype.options = {
        onOpenModal: function() {
            return !1
        },
        onCloseModal: function() {
            return !1
        }
    },
    n.prototype._initEvents = function() {
        var e = this;
        this.ctrlClose.addEventListener("click", this.toggle.bind(this)),
        document.addEventListener("keydown", function(t) {
            var n = t.keyCode || t.which;
            27 === n && e.isOpen && e.toggle()
        }),
        this.el.querySelector(".modal__overlay").addEventListener("click", this.toggle.bind(this))
    }
    ,
    n.prototype.toggle = function() {
        var e = this;
        this.isOpen ? (classie.remove(document.body, "modal--open"),
        classie.remove(this.el, "modal--open"),
        classie.add(e.el, "modal--close"),
        s(this.el.querySelector(".modal__content"), function() {
            classie.remove(e.el, "modal--close")
        }),
        this.options.onCloseModal(this)) : (classie.add(document.body, "modal--open"),
        classie.add(this.el, "modal--open"),
        document.getElementById("search-input").focus(),
        this.options.onOpenModal(this)),
        this.isOpen = !this.isOpen
    }
    ,
    e.ModalFx = n
}(window);
// var ModalFx = ModalFx || [];
// !function() {
//     var e = document.querySelector("[data-modal]")
//       , t = document.getElementById(e.getAttribute("data-modal"))
//       , n = new ModalFx(t);
//     e.addEventListener("click", n.toggle.bind(n))
// }();
var SimpleJekyllSearch = SimpleJekyllSearch || [];
SimpleJekyllSearch({
    searchInput: document.getElementById("search-input"),
    resultsContainer: document.getElementById("results-container"),
    json: "/search.json"
}),
function() {
    var e = document.createElement("script");
    e.async = !0,
    e.type = "text/javascript",
    e.src = "//" + disqus_shortname + ".disqus.com/count.js",
    (document.getElementsByTagName("HEAD")[0] || document.getElementsByTagName("BODY")[0]).appendChild(e)
}(),
function(e, t) {
    var n = e(".main-header")
      , i = e(".scroll-up");
    e(document).ready(function() {
        e(".swipebox").swipebox(),
        i.scrolltoo()
    }),
    e(window).scroll(function() {
        var t = n.height();
        e(this).scrollTop() > t ? i.css({
            bottom: "15px"
        }) : i.css({
            bottom: "-80px"
        })
    }),
    e.fn.scrolltoo = function(t) {
        var n = {
            elem: e(this),
            speed: 800
        }
          , i = e.extend(n, t);
        i.elem.click(function(t) {
            t.preventDefault();
            var n, r = e(this), o = e("html, body"), s = r.attr("data-offset") ? r.attr("data-offset") : !1, a = r.attr("data-position") ? r.attr("data-position") : !1;
            s ? (n = parseInt(s, 10),
            o.stop(!0, !1).animate({
                scrollTop: e(this.hash).offset().top + n
            }, i.speed)) : a ? (n = parseInt(a, 10),
            o.stop(!0, !1).animate({
                scrollTop: n
            }, i.speed)) : o.stop(!0, !1).animate({
                scrollTop: e(this.hash).offset().top
            }, i.speed)
        })
    }
}(jQuery);
