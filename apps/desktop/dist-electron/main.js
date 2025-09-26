var jn = Object.defineProperty;
var _n = (i, e, t) => e in i ? jn(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var n = (i, e, t) => _n(i, typeof e != "symbol" ? e + "" : e, t);
import we from "node:path";
import { fileURLToPath as Pn } from "node:url";
import { app as Se, BrowserWindow as Qr, ipcMain as Oe } from "electron";
import dt from "node:fs";
import oe from "better-sqlite3";
const f = Symbol.for("drizzle:entityKind");
function d(i, e) {
  if (!i || typeof i != "object")
    return !1;
  if (i instanceof e)
    return !0;
  if (!Object.prototype.hasOwnProperty.call(e, f))
    throw new Error(
      `Class "${e.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  let t = Object.getPrototypeOf(i).constructor;
  if (t)
    for (; t; ) {
      if (f in t && t[f] === e[f])
        return !0;
      t = Object.getPrototypeOf(t);
    }
  return !1;
}
var St;
St = f;
class L {
  constructor(e, t) {
    n(this, "name");
    n(this, "keyAsName");
    n(this, "primary");
    n(this, "notNull");
    n(this, "default");
    n(this, "defaultFn");
    n(this, "onUpdateFn");
    n(this, "hasDefault");
    n(this, "isUnique");
    n(this, "uniqueName");
    n(this, "uniqueType");
    n(this, "dataType");
    n(this, "columnType");
    n(this, "enumValues");
    n(this, "generated");
    n(this, "generatedIdentity");
    n(this, "config");
    this.table = e, this.config = t, this.name = t.name, this.keyAsName = t.keyAsName, this.notNull = t.notNull, this.default = t.default, this.defaultFn = t.defaultFn, this.onUpdateFn = t.onUpdateFn, this.hasDefault = t.hasDefault, this.primary = t.primaryKey, this.isUnique = t.isUnique, this.uniqueName = t.uniqueName, this.uniqueType = t.uniqueType, this.dataType = t.dataType, this.columnType = t.columnType, this.generated = t.generated, this.generatedIdentity = t.generatedIdentity;
  }
  mapFromDriverValue(e) {
    return e;
  }
  mapToDriverValue(e) {
    return e;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
}
n(L, St, "Column");
var Nt;
Nt = f;
class Tr {
  constructor(e, t, s) {
    n(this, "config");
    /**
     * Alias for {@link $defaultFn}.
     */
    n(this, "$default", this.$defaultFn);
    /**
     * Alias for {@link $onUpdateFn}.
     */
    n(this, "$onUpdate", this.$onUpdateFn);
    this.config = {
      name: e,
      keyAsName: e === "",
      notNull: !1,
      default: void 0,
      hasDefault: !1,
      primaryKey: !1,
      isUnique: !1,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType: t,
      columnType: s,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    return this.config.notNull = !0, this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(e) {
    return this.config.default = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(e) {
    return this.config.defaultFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(e) {
    return this.config.onUpdateFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    return this.config.primaryKey = !0, this.config.notNull = !0, this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(e) {
    this.config.name === "" && (this.config.name = e);
  }
}
n(Tr, Nt, "ColumnBuilder");
const Y = Symbol.for("drizzle:Name"), ft = Symbol.for("drizzle:isPgEnum");
function Rn(i) {
  return !!i && typeof i == "function" && ft in i && i[ft] === !0;
}
var $t;
$t = f;
class R {
  constructor(e, t, s, r = !1, o = []) {
    this._ = {
      brand: "Subquery",
      sql: e,
      selectedFields: t,
      alias: s,
      isWith: r,
      usedTables: o
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
}
n(R, $t, "Subquery");
var Qt, Tt;
class rt extends (Tt = R, Qt = f, Tt) {
}
n(rt, Qt, "WithSubquery");
const En = {
  startActiveSpan(i, e) {
    return e();
  }
}, B = Symbol.for("drizzle:ViewBaseConfig"), be = Symbol.for("drizzle:Schema"), Me = Symbol.for("drizzle:Columns"), mt = Symbol.for("drizzle:ExtraConfigColumns"), De = Symbol.for("drizzle:OriginalName"), Fe = Symbol.for("drizzle:BaseName"), Ne = Symbol.for("drizzle:IsAlias"), pt = Symbol.for("drizzle:ExtraConfigBuilder"), Dn = Symbol.for("drizzle:IsDrizzleTable");
var Ct, vt, Lt, xt, Bt, qt, Ot, At, It, jt;
jt = f, It = Y, At = De, Ot = be, qt = Me, Bt = mt, xt = Fe, Lt = Ne, vt = Dn, Ct = pt;
class p {
  constructor(e, t, s) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    n(this, It);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    n(this, At);
    /** @internal */
    n(this, Ot);
    /** @internal */
    n(this, qt);
    /** @internal */
    n(this, Bt);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    n(this, xt);
    /** @internal */
    n(this, Lt, !1);
    /** @internal */
    n(this, vt, !0);
    /** @internal */
    n(this, Ct);
    this[Y] = this[De] = e, this[be] = t, this[Fe] = s;
  }
}
n(p, jt, "Table"), /** @internal */
n(p, "Symbol", {
  Name: Y,
  Schema: be,
  OriginalName: De,
  Columns: Me,
  ExtraConfigColumns: mt,
  BaseName: Fe,
  IsAlias: Ne,
  ExtraConfigBuilder: pt
});
function ne(i) {
  return i[Y];
}
function ue(i) {
  return `${i[be] ?? "public"}.${i[Y]}`;
}
function Cr(i) {
  return i != null && typeof i.getSQL == "function";
}
function Fn(i) {
  var t;
  const e = { sql: "", params: [] };
  for (const s of i)
    e.sql += s.sql, e.params.push(...s.params), (t = s.typings) != null && t.length && (e.typings || (e.typings = []), e.typings.push(...s.typings));
  return e;
}
var _t;
_t = f;
class x {
  constructor(e) {
    n(this, "value");
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new g([this]);
  }
}
n(x, _t, "StringChunk");
var Pt;
Pt = f;
const X = class X {
  constructor(e) {
    /** @internal */
    n(this, "decoder", vr);
    n(this, "shouldInlineParams", !1);
    /** @internal */
    n(this, "usedTables", []);
    this.queryChunks = e;
    for (const t of e)
      if (d(t, p)) {
        const s = t[p.Symbol.Schema];
        this.usedTables.push(
          s === void 0 ? t[p.Symbol.Name] : s + "." + t[p.Symbol.Name]
        );
      }
  }
  append(e) {
    return this.queryChunks.push(...e.queryChunks), this;
  }
  toQuery(e) {
    return En.startActiveSpan("drizzle.buildSQL", (t) => {
      const s = this.buildQueryFromSourceParams(this.queryChunks, e);
      return t == null || t.setAttributes({
        "drizzle.query.text": s.sql,
        "drizzle.query.params": JSON.stringify(s.params)
      }), s;
    });
  }
  buildQueryFromSourceParams(e, t) {
    const s = Object.assign({}, t, {
      inlineParams: t.inlineParams || this.shouldInlineParams,
      paramStartIndex: t.paramStartIndex || { value: 0 }
    }), {
      casing: r,
      escapeName: o,
      escapeParam: l,
      prepareTyping: a,
      inlineParams: c,
      paramStartIndex: m
    } = s;
    return Fn(e.map((h) => {
      var w;
      if (d(h, x))
        return { sql: h.value.join(""), params: [] };
      if (d(h, $e))
        return { sql: o(h.value), params: [] };
      if (h === void 0)
        return { sql: "", params: [] };
      if (Array.isArray(h)) {
        const y = [new x("(")];
        for (const [S, T] of h.entries())
          y.push(T), S < h.length - 1 && y.push(new x(", "));
        return y.push(new x(")")), this.buildQueryFromSourceParams(y, s);
      }
      if (d(h, X))
        return this.buildQueryFromSourceParams(h.queryChunks, {
          ...s,
          inlineParams: c || h.shouldInlineParams
        });
      if (d(h, p)) {
        const y = h[p.Symbol.Schema], S = h[p.Symbol.Name];
        return {
          sql: y === void 0 || h[Ne] ? o(S) : o(y) + "." + o(S),
          params: []
        };
      }
      if (d(h, L)) {
        const y = r.getColumnCasing(h);
        if (t.invokeSource === "indexes")
          return { sql: o(y), params: [] };
        const S = h.table[p.Symbol.Schema];
        return {
          sql: h.table[Ne] || S === void 0 ? o(h.table[p.Symbol.Name]) + "." + o(y) : o(S) + "." + o(h.table[p.Symbol.Name]) + "." + o(y),
          params: []
        };
      }
      if (d(h, se)) {
        const y = h[B].schema, S = h[B].name;
        return {
          sql: y === void 0 || h[B].isAlias ? o(S) : o(y) + "." + o(S),
          params: []
        };
      }
      if (d(h, J)) {
        if (d(h.value, k))
          return { sql: l(m.value++, h), params: [h], typings: ["none"] };
        const y = h.value === null ? null : h.encoder.mapToDriverValue(h.value);
        if (d(y, X))
          return this.buildQueryFromSourceParams([y], s);
        if (c)
          return { sql: this.mapInlineParam(y, s), params: [] };
        let S = ["none"];
        return a && (S = [a(h.encoder)]), { sql: l(m.value++, y), params: [y], typings: S };
      }
      return d(h, k) ? { sql: l(m.value++, h), params: [h], typings: ["none"] } : d(h, X.Aliased) && h.fieldAlias !== void 0 ? { sql: o(h.fieldAlias), params: [] } : d(h, R) ? h._.isWith ? { sql: o(h._.alias), params: [] } : this.buildQueryFromSourceParams([
        new x("("),
        h._.sql,
        new x(") "),
        new $e(h._.alias)
      ], s) : Rn(h) ? h.schema ? { sql: o(h.schema) + "." + o(h.enumName), params: [] } : { sql: o(h.enumName), params: [] } : Cr(h) ? (w = h.shouldOmitSQLParens) != null && w.call(h) ? this.buildQueryFromSourceParams([h.getSQL()], s) : this.buildQueryFromSourceParams([
        new x("("),
        h.getSQL(),
        new x(")")
      ], s) : c ? { sql: this.mapInlineParam(h, s), params: [] } : { sql: l(m.value++, h), params: [h], typings: ["none"] };
    }));
  }
  mapInlineParam(e, { escapeString: t }) {
    if (e === null)
      return "null";
    if (typeof e == "number" || typeof e == "boolean")
      return e.toString();
    if (typeof e == "string")
      return t(e);
    if (typeof e == "object") {
      const s = e.toString();
      return t(s === "[object Object]" ? JSON.stringify(e) : s);
    }
    throw new Error("Unexpected param value: " + e);
  }
  getSQL() {
    return this;
  }
  as(e) {
    return e === void 0 ? this : new X.Aliased(this, e);
  }
  mapWith(e) {
    return this.decoder = typeof e == "function" ? { mapFromDriverValue: e } : e, this;
  }
  inlineParams() {
    return this.shouldInlineParams = !0, this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(e) {
    return e ? this : void 0;
  }
};
n(X, Pt, "SQL");
let g = X;
var Rt;
Rt = f;
class $e {
  constructor(e) {
    n(this, "brand");
    this.value = e;
  }
  getSQL() {
    return new g([this]);
  }
}
n($e, Rt, "Name");
function zn(i) {
  return typeof i == "object" && i !== null && "mapToDriverValue" in i && typeof i.mapToDriverValue == "function";
}
const vr = {
  mapFromDriverValue: (i) => i
}, Lr = {
  mapToDriverValue: (i) => i
};
({
  ...vr,
  ...Lr
});
var Et;
Et = f;
class J {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, t = Lr) {
    n(this, "brand");
    this.value = e, this.encoder = t;
  }
  getSQL() {
    return new g([this]);
  }
}
n(J, Et, "Param");
function u(i, ...e) {
  const t = [];
  (e.length > 0 || i.length > 0 && i[0] !== "") && t.push(new x(i[0]));
  for (const [s, r] of e.entries())
    t.push(r, new x(i[s + 1]));
  return new g(t);
}
((i) => {
  function e() {
    return new g([]);
  }
  i.empty = e;
  function t(c) {
    return new g(c);
  }
  i.fromList = t;
  function s(c) {
    return new g([new x(c)]);
  }
  i.raw = s;
  function r(c, m) {
    const h = [];
    for (const [w, y] of c.entries())
      w > 0 && m !== void 0 && h.push(m), h.push(y);
    return new g(h);
  }
  i.join = r;
  function o(c) {
    return new $e(c);
  }
  i.identifier = o;
  function l(c) {
    return new k(c);
  }
  i.placeholder = l;
  function a(c, m) {
    return new J(c, m);
  }
  i.param = a;
})(u || (u = {}));
((i) => {
  var t;
  t = f;
  const s = class s {
    constructor(o, l) {
      /** @internal */
      n(this, "isSelectionField", !1);
      this.sql = o, this.fieldAlias = l;
    }
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new s(this.sql, this.fieldAlias);
    }
  };
  n(s, t, "SQL.Aliased");
  let e = s;
  i.Aliased = e;
})(g || (g = {}));
var Dt;
Dt = f;
class k {
  constructor(e) {
    this.name = e;
  }
  getSQL() {
    return new g([this]);
  }
}
n(k, Dt, "Placeholder");
function ge(i, e) {
  return i.map((t) => {
    if (d(t, k)) {
      if (!(t.name in e))
        throw new Error(`No value for placeholder "${t.name}" was provided`);
      return e[t.name];
    }
    if (d(t, J) && d(t.value, k)) {
      if (!(t.value.name in e))
        throw new Error(`No value for placeholder "${t.value.name}" was provided`);
      return t.encoder.mapToDriverValue(e[t.value.name]);
    }
    return t;
  });
}
const Mn = Symbol.for("drizzle:IsDrizzleView");
var Ft, zt, Mt;
Mt = f, zt = B, Ft = Mn;
class se {
  constructor({ name: e, schema: t, selectedFields: s, query: r }) {
    /** @internal */
    n(this, zt);
    /** @internal */
    n(this, Ft, !0);
    this[B] = {
      name: e,
      originalName: e,
      schema: t,
      selectedFields: s,
      query: r,
      isExisting: !r,
      isAlias: !1
    };
  }
  getSQL() {
    return new g([this]);
  }
}
n(se, Mt, "View");
L.prototype.getSQL = function() {
  return new g([this]);
};
p.prototype.getSQL = function() {
  return new g([this]);
};
R.prototype.getSQL = function() {
  return new g([this]);
};
var Vt;
Vt = f;
class ce {
  constructor(e) {
    this.table = e;
  }
  get(e, t) {
    return t === "table" ? this.table : e[t];
  }
}
n(ce, Vt, "ColumnAliasProxyHandler");
var Kt;
Kt = f;
class Ae {
  constructor(e, t) {
    this.alias = e, this.replaceOriginalName = t;
  }
  get(e, t) {
    if (t === p.Symbol.IsAlias)
      return !0;
    if (t === p.Symbol.Name)
      return this.alias;
    if (this.replaceOriginalName && t === p.Symbol.OriginalName)
      return this.alias;
    if (t === B)
      return {
        ...e[B],
        name: this.alias,
        isAlias: !0
      };
    if (t === p.Symbol.Columns) {
      const r = e[p.Symbol.Columns];
      if (!r)
        return r;
      const o = {};
      return Object.keys(r).map((l) => {
        o[l] = new Proxy(
          r[l],
          new ce(new Proxy(e, this))
        );
      }), o;
    }
    const s = e[t];
    return d(s, L) ? new Proxy(s, new ce(new Proxy(e, this))) : s;
  }
}
n(Ae, Kt, "TableAliasProxyHandler");
function ze(i, e) {
  return new Proxy(i, new Ae(e, !1));
}
function K(i, e) {
  return new Proxy(
    i,
    new ce(new Proxy(i.table, new Ae(e, !1)))
  );
}
function xr(i, e) {
  return new g.Aliased(Qe(i.sql, e), i.fieldAlias);
}
function Qe(i, e) {
  return u.join(i.queryChunks.map((t) => d(t, L) ? K(t, e) : d(t, g) ? Qe(t, e) : d(t, g.Aliased) ? xr(t, e) : t));
}
var Ut, Jt;
class Ie extends (Jt = Error, Ut = f, Jt) {
  constructor({ message: e, cause: t }) {
    super(e), this.name = "DrizzleError", this.cause = t;
  }
}
n(Ie, Ut, "DrizzleError");
class G extends Error {
  constructor(e, t, s) {
    super(`Failed query: ${e}
params: ${t}`), this.query = e, this.params = t, this.cause = s, Error.captureStackTrace(this, G), s && (this.cause = s);
  }
}
var Wt, Gt;
class Br extends (Gt = Ie, Wt = f, Gt) {
  constructor() {
    super({ message: "Rollback" });
  }
}
n(Br, Wt, "TransactionRollbackError");
var Yt;
Yt = f;
class qr {
  write(e) {
    console.log(e);
  }
}
n(qr, Yt, "ConsoleLogWriter");
var Zt;
Zt = f;
class Or {
  constructor(e) {
    n(this, "writer");
    this.writer = (e == null ? void 0 : e.writer) ?? new qr();
  }
  logQuery(e, t) {
    const s = t.map((o) => {
      try {
        return JSON.stringify(o);
      } catch {
        return String(o);
      }
    }), r = s.length ? ` -- params: [${s.join(", ")}]` : "";
    this.writer.write(`Query: ${e}${r}`);
  }
}
n(Or, Zt, "DefaultLogger");
var Xt;
Xt = f;
class Ar {
  logQuery() {
  }
}
n(Ar, Xt, "NoopLogger");
var Ht, kt;
kt = f, Ht = Symbol.toStringTag;
class Z {
  constructor() {
    n(this, Ht, "QueryPromise");
  }
  catch(e) {
    return this.then(void 0, e);
  }
  finally(e) {
    return this.then(
      (t) => (e == null || e(), t),
      (t) => {
        throw e == null || e(), t;
      }
    );
  }
  then(e, t) {
    return this.execute().then(e, t);
  }
}
n(Z, kt, "QueryPromise");
function gt(i, e, t) {
  const s = {}, r = i.reduce(
    (o, { path: l, field: a }, c) => {
      let m;
      d(a, L) ? m = a : d(a, g) ? m = a.decoder : m = a.sql.decoder;
      let h = o;
      for (const [w, y] of l.entries())
        if (w < l.length - 1)
          y in h || (h[y] = {}), h = h[y];
        else {
          const S = e[c], T = h[y] = S === null ? null : m.mapFromDriverValue(S);
          if (t && d(a, L) && l.length === 2) {
            const N = l[0];
            N in s ? typeof s[N] == "string" && s[N] !== ne(a.table) && (s[N] = !1) : s[N] = T === null ? ne(a.table) : !1;
          }
        }
      return o;
    },
    {}
  );
  if (t && Object.keys(s).length > 0)
    for (const [o, l] of Object.entries(s))
      typeof l == "string" && !t[l] && (r[o] = null);
  return r;
}
function ee(i, e) {
  return Object.entries(i).reduce((t, [s, r]) => {
    if (typeof s != "string")
      return t;
    const o = e ? [...e, s] : [s];
    return d(r, L) || d(r, g) || d(r, g.Aliased) ? t.push({ path: o, field: r }) : d(r, p) ? t.push(...ee(r[p.Symbol.Columns], o)) : t.push(...ee(r, o)), t;
  }, []);
}
function nt(i, e) {
  const t = Object.keys(i), s = Object.keys(e);
  if (t.length !== s.length)
    return !1;
  for (const [r, o] of t.entries())
    if (o !== s[r])
      return !1;
  return !0;
}
function Ir(i, e) {
  const t = Object.entries(e).filter(([, s]) => s !== void 0).map(([s, r]) => d(r, g) || d(r, L) ? [s, r] : [s, new J(r, i[p.Symbol.Columns][s])]);
  if (t.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(t);
}
function Vn(i, e) {
  for (const t of e)
    for (const s of Object.getOwnPropertyNames(t.prototype))
      s !== "constructor" && Object.defineProperty(
        i.prototype,
        s,
        Object.getOwnPropertyDescriptor(t.prototype, s) || /* @__PURE__ */ Object.create(null)
      );
}
function Kn(i) {
  return i[p.Symbol.Columns];
}
function Ve(i) {
  return d(i, R) ? i._.alias : d(i, se) ? i[B].name : d(i, g) ? void 0 : i[p.Symbol.IsAlias] ? i[p.Symbol.Name] : i[p.Symbol.BaseName];
}
function he(i, e) {
  return {
    name: typeof i == "string" && i.length > 0 ? i : "",
    config: typeof i == "object" ? i : e
  };
}
function Un(i) {
  if (typeof i != "object" || i === null || i.constructor.name !== "Object") return !1;
  if ("logger" in i) {
    const e = typeof i.logger;
    return !(e !== "boolean" && (e !== "object" || typeof i.logger.logQuery != "function") && e !== "undefined");
  }
  if ("schema" in i) {
    const e = typeof i.schema;
    return !(e !== "object" && e !== "undefined");
  }
  if ("casing" in i) {
    const e = typeof i.casing;
    return !(e !== "string" && e !== "undefined");
  }
  if ("mode" in i)
    return !(i.mode !== "default" || i.mode !== "planetscale" || i.mode !== void 0);
  if ("connection" in i) {
    const e = typeof i.connection;
    return !(e !== "string" && e !== "object" && e !== "undefined");
  }
  if ("client" in i) {
    const e = typeof i.client;
    return !(e !== "object" && e !== "function" && e !== "undefined");
  }
  return Object.keys(i).length === 0;
}
const jr = typeof TextDecoder > "u" ? null : new TextDecoder(), yt = Symbol.for("drizzle:PgInlineForeignKeys"), bt = Symbol.for("drizzle:EnableRLS");
var es, ts, ss, is, rs, ns;
class Ke extends (ns = p, rs = f, is = yt, ss = bt, ts = p.Symbol.ExtraConfigBuilder, es = p.Symbol.ExtraConfigColumns, ns) {
  constructor() {
    super(...arguments);
    /**@internal */
    n(this, is, []);
    /** @internal */
    n(this, ss, !1);
    /** @internal */
    n(this, ts);
    /** @internal */
    n(this, es, {});
  }
}
n(Ke, rs, "PgTable"), /** @internal */
n(Ke, "Symbol", Object.assign({}, p.Symbol, {
  InlineForeignKeys: yt,
  EnableRLS: bt
}));
var os;
os = f;
class _r {
  constructor(e, t) {
    /** @internal */
    n(this, "columns");
    /** @internal */
    n(this, "name");
    this.columns = e, this.name = t;
  }
  /** @internal */
  build(e) {
    return new Pr(e, this.columns, this.name);
  }
}
n(_r, os, "PgPrimaryKeyBuilder");
var as;
as = f;
class Pr {
  constructor(e, t, s) {
    n(this, "columns");
    n(this, "name");
    this.table = e, this.columns = t, this.name = s;
  }
  getName() {
    return this.name ?? `${this.table[Ke.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
n(Pr, as, "PgPrimaryKey");
function j(i, e) {
  return zn(e) && !Cr(i) && !d(i, J) && !d(i, k) && !d(i, L) && !d(i, p) && !d(i, se) ? new J(i, e) : i;
}
const de = (i, e) => u`${i} = ${j(e, i)}`, Jn = (i, e) => u`${i} <> ${j(e, i)}`;
function Ue(...i) {
  const e = i.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new g(e) : new g([
      new x("("),
      u.join(e, new x(" and ")),
      new x(")")
    ]);
}
function Wn(...i) {
  const e = i.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new g(e) : new g([
      new x("("),
      u.join(e, new x(" or ")),
      new x(")")
    ]);
}
function Gn(i) {
  return u`not ${i}`;
}
const Yn = (i, e) => u`${i} > ${j(e, i)}`, Zn = (i, e) => u`${i} >= ${j(e, i)}`, Xn = (i, e) => u`${i} < ${j(e, i)}`, Hn = (i, e) => u`${i} <= ${j(e, i)}`;
function Rr(i, e) {
  return Array.isArray(e) ? e.length === 0 ? u`false` : u`${i} in ${e.map((t) => j(t, i))}` : u`${i} in ${j(e, i)}`;
}
function kn(i, e) {
  return Array.isArray(e) ? e.length === 0 ? u`true` : u`${i} not in ${e.map((t) => j(t, i))}` : u`${i} not in ${j(e, i)}`;
}
function eo(i) {
  return u`${i} is null`;
}
function to(i) {
  return u`${i} is not null`;
}
function so(i) {
  return u`exists ${i}`;
}
function io(i) {
  return u`not exists ${i}`;
}
function ro(i, e, t) {
  return u`${i} between ${j(e, i)} and ${j(
    t,
    i
  )}`;
}
function no(i, e, t) {
  return u`${i} not between ${j(
    e,
    i
  )} and ${j(t, i)}`;
}
function oo(i, e) {
  return u`${i} like ${e}`;
}
function ao(i, e) {
  return u`${i} not like ${e}`;
}
function lo(i, e) {
  return u`${i} ilike ${e}`;
}
function uo(i, e) {
  return u`${i} not ilike ${e}`;
}
function co(i) {
  return u`${i} asc`;
}
function ho(i) {
  return u`${i} desc`;
}
var ls;
ls = f;
class ot {
  constructor(e, t, s) {
    n(this, "referencedTableName");
    n(this, "fieldName");
    this.sourceTable = e, this.referencedTable = t, this.relationName = s, this.referencedTableName = t[p.Symbol.Name];
  }
}
n(ot, ls, "Relation");
var us;
us = f;
class Er {
  constructor(e, t) {
    this.table = e, this.config = t;
  }
}
n(Er, us, "Relations");
var cs, hs;
const Le = class Le extends (hs = ot, cs = f, hs) {
  constructor(e, t, s, r) {
    super(e, t, s == null ? void 0 : s.relationName), this.config = s, this.isNullable = r;
  }
  withFieldName(e) {
    const t = new Le(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    return t.fieldName = e, t;
  }
};
n(Le, cs, "One");
let te = Le;
var ds, fs;
const xe = class xe extends (fs = ot, ds = f, fs) {
  constructor(e, t, s) {
    super(e, t, s == null ? void 0 : s.relationName), this.config = s;
  }
  withFieldName(e) {
    const t = new xe(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    return t.fieldName = e, t;
  }
};
n(xe, ds, "Many");
let Te = xe;
function fo() {
  return {
    and: Ue,
    between: ro,
    eq: de,
    exists: so,
    gt: Yn,
    gte: Zn,
    ilike: lo,
    inArray: Rr,
    isNull: eo,
    isNotNull: to,
    like: oo,
    lt: Xn,
    lte: Hn,
    ne: Jn,
    not: Gn,
    notBetween: no,
    notExists: io,
    notLike: ao,
    notIlike: uo,
    notInArray: kn,
    or: Wn,
    sql: u
  };
}
function mo() {
  return {
    sql: u,
    asc: co,
    desc: ho
  };
}
function po(i, e) {
  var o;
  Object.keys(i).length === 1 && "default" in i && !d(i.default, p) && (i = i.default);
  const t = {}, s = {}, r = {};
  for (const [l, a] of Object.entries(i))
    if (d(a, p)) {
      const c = ue(a), m = s[c];
      t[c] = l, r[l] = {
        tsName: l,
        dbName: a[p.Symbol.Name],
        schema: a[p.Symbol.Schema],
        columns: a[p.Symbol.Columns],
        relations: (m == null ? void 0 : m.relations) ?? {},
        primaryKey: (m == null ? void 0 : m.primaryKey) ?? []
      };
      for (const w of Object.values(
        a[p.Symbol.Columns]
      ))
        w.primary && r[l].primaryKey.push(w);
      const h = (o = a[p.Symbol.ExtraConfigBuilder]) == null ? void 0 : o.call(a, a[p.Symbol.ExtraConfigColumns]);
      if (h)
        for (const w of Object.values(h))
          d(w, _r) && r[l].primaryKey.push(...w.columns);
    } else if (d(a, Er)) {
      const c = ue(a.table), m = t[c], h = a.config(
        e(a.table)
      );
      let w;
      for (const [y, S] of Object.entries(h))
        if (m) {
          const T = r[m];
          T.relations[y] = S;
        } else
          c in s || (s[c] = {
            relations: {},
            primaryKey: w
          }), s[c].relations[y] = S;
    }
  return { tables: r, tableNamesMap: t };
}
function go(i) {
  return function(t, s) {
    return new te(
      i,
      t,
      s,
      (s == null ? void 0 : s.fields.reduce((r, o) => r && o.notNull, !0)) ?? !1
    );
  };
}
function yo(i) {
  return function(t, s) {
    return new Te(i, t, s);
  };
}
function bo(i, e, t) {
  if (d(t, te) && t.config)
    return {
      fields: t.config.fields,
      references: t.config.references
    };
  const s = e[ue(t.referencedTable)];
  if (!s)
    throw new Error(
      `Table "${t.referencedTable[p.Symbol.Name]}" not found in schema`
    );
  const r = i[s];
  if (!r)
    throw new Error(`Table "${s}" not found in schema`);
  const o = t.sourceTable, l = e[ue(o)];
  if (!l)
    throw new Error(
      `Table "${o[p.Symbol.Name]}" not found in schema`
    );
  const a = [];
  for (const c of Object.values(
    r.relations
  ))
    (t.relationName && t !== c && c.relationName === t.relationName || !t.relationName && c.referencedTable === t.sourceTable) && a.push(c);
  if (a.length > 1)
    throw t.relationName ? new Error(
      `There are multiple relations with name "${t.relationName}" in table "${s}"`
    ) : new Error(
      `There are multiple relations between "${s}" and "${t.sourceTable[p.Symbol.Name]}". Please specify relation name`
    );
  if (a[0] && d(a[0], te) && a[0].config)
    return {
      fields: a[0].config.references,
      references: a[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${l}.${t.fieldName}"`
  );
}
function wo(i) {
  return {
    one: go(i),
    many: yo(i)
  };
}
function Je(i, e, t, s, r = (o) => o) {
  const o = {};
  for (const [
    l,
    a
  ] of s.entries())
    if (a.isJson) {
      const c = e.relations[a.tsKey], m = t[l], h = typeof m == "string" ? JSON.parse(m) : m;
      o[a.tsKey] = d(c, te) ? h && Je(
        i,
        i[a.relationTableTsKey],
        h,
        a.selection,
        r
      ) : h.map(
        (w) => Je(
          i,
          i[a.relationTableTsKey],
          w,
          a.selection,
          r
        )
      );
    } else {
      const c = r(t[l]), m = a.field;
      let h;
      d(m, L) ? h = m : d(m, g) ? h = m.decoder : h = m.sql.decoder, o[a.tsKey] = c === null ? null : h.mapFromDriverValue(c);
    }
  return o;
}
var ms;
ms = f;
const Be = class Be {
  constructor(e) {
    n(this, "config");
    this.config = { ...e };
  }
  get(e, t) {
    if (t === "_")
      return {
        ...e._,
        selectedFields: new Proxy(
          e._.selectedFields,
          this
        )
      };
    if (t === B)
      return {
        ...e[B],
        selectedFields: new Proxy(
          e[B].selectedFields,
          this
        )
      };
    if (typeof t == "symbol")
      return e[t];
    const r = (d(e, R) ? e._.selectedFields : d(e, se) ? e[B].selectedFields : e)[t];
    if (d(r, g.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !r.isSelectionField)
        return r.sql;
      const o = r.clone();
      return o.isSelectionField = !0, o;
    }
    if (d(r, g)) {
      if (this.config.sqlBehavior === "sql")
        return r;
      throw new Error(
        `You tried to reference "${t}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    return d(r, L) ? this.config.alias ? new Proxy(
      r,
      new ce(
        new Proxy(
          r.table,
          new Ae(this.config.alias, this.config.replaceOriginalName ?? !1)
        )
      )
    ) : r : typeof r != "object" || r === null ? r : new Proxy(r, new Be(this.config));
  }
};
n(Be, ms, "SelectionProxyHandler");
let O = Be;
var ps;
ps = f;
class Dr {
  constructor(e, t) {
    /** @internal */
    n(this, "reference");
    /** @internal */
    n(this, "_onUpdate");
    /** @internal */
    n(this, "_onDelete");
    this.reference = () => {
      const { name: s, columns: r, foreignColumns: o } = e();
      return { name: s, columns: r, foreignTable: o[0].table, foreignColumns: o };
    }, t && (this._onUpdate = t.onUpdate, this._onDelete = t.onDelete);
  }
  onUpdate(e) {
    return this._onUpdate = e, this;
  }
  onDelete(e) {
    return this._onDelete = e, this;
  }
  /** @internal */
  build(e) {
    return new Fr(e, this);
  }
}
n(Dr, ps, "SQLiteForeignKeyBuilder");
var gs;
gs = f;
class Fr {
  constructor(e, t) {
    n(this, "reference");
    n(this, "onUpdate");
    n(this, "onDelete");
    this.table = e, this.reference = t.reference, this.onUpdate = t._onUpdate, this.onDelete = t._onDelete;
  }
  getName() {
    const { name: e, columns: t, foreignColumns: s } = this.reference(), r = t.map((a) => a.name), o = s.map((a) => a.name), l = [
      this.table[Y],
      ...r,
      s[0].table[Y],
      ...o
    ];
    return e ?? `${l.join("_")}_fk`;
  }
}
n(Fr, gs, "SQLiteForeignKey");
function So(i, e) {
  return `${i[Y]}_${e.join("_")}_unique`;
}
var ys, bs;
class F extends (bs = Tr, ys = f, bs) {
  constructor() {
    super(...arguments);
    n(this, "foreignKeyConfigs", []);
  }
  references(t, s = {}) {
    return this.foreignKeyConfigs.push({ ref: t, actions: s }), this;
  }
  unique(t) {
    return this.config.isUnique = !0, this.config.uniqueName = t, this;
  }
  generatedAlwaysAs(t, s) {
    return this.config.generated = {
      as: t,
      type: "always",
      mode: (s == null ? void 0 : s.mode) ?? "virtual"
    }, this;
  }
  /** @internal */
  buildForeignKeys(t, s) {
    return this.foreignKeyConfigs.map(({ ref: r, actions: o }) => ((l, a) => {
      const c = new Dr(() => {
        const m = l();
        return { columns: [t], foreignColumns: [m] };
      });
      return a.onUpdate && c.onUpdate(a.onUpdate), a.onDelete && c.onDelete(a.onDelete), c.build(s);
    })(r, o));
  }
}
n(F, ys, "SQLiteColumnBuilder");
var ws, Ss;
class A extends (Ss = L, ws = f, Ss) {
  constructor(e, t) {
    t.uniqueName || (t.uniqueName = So(e, [t.name])), super(e, t), this.table = e;
  }
}
n(A, ws, "SQLiteColumn");
var Ns, $s;
class zr extends ($s = F, Ns = f, $s) {
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new Mr(e, this.config);
  }
}
n(zr, Ns, "SQLiteBigIntBuilder");
var Qs, Ts;
class Mr extends (Ts = A, Qs = f, Ts) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const t = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return BigInt(t.toString("utf8"));
    }
    return BigInt(jr.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(e.toString());
  }
}
n(Mr, Qs, "SQLiteBigInt");
var Cs, vs;
class Vr extends (vs = F, Cs = f, vs) {
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new Kr(
      e,
      this.config
    );
  }
}
n(Vr, Cs, "SQLiteBlobJsonBuilder");
var Ls, xs;
class Kr extends (xs = A, Ls = f, xs) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const t = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return JSON.parse(t.toString("utf8"));
    }
    return JSON.parse(jr.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(JSON.stringify(e));
  }
}
n(Kr, Ls, "SQLiteBlobJson");
var Bs, qs;
class Ur extends (qs = F, Bs = f, qs) {
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new Jr(e, this.config);
  }
}
n(Ur, Bs, "SQLiteBlobBufferBuilder");
var Os, As;
class Jr extends (As = A, Os = f, As) {
  mapFromDriverValue(e) {
    return Buffer.isBuffer(e) ? e : Buffer.from(e);
  }
  getSQLType() {
    return "blob";
  }
}
n(Jr, Os, "SQLiteBlobBuffer");
function No(i, e) {
  const { name: t, config: s } = he(i, e);
  return (s == null ? void 0 : s.mode) === "json" ? new Vr(t) : (s == null ? void 0 : s.mode) === "bigint" ? new zr(t) : new Ur(t);
}
var Is, js;
class Wr extends (js = F, Is = f, js) {
  constructor(e, t, s) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = t, this.config.customTypeParams = s;
  }
  /** @internal */
  build(e) {
    return new Gr(
      e,
      this.config
    );
  }
}
n(Wr, Is, "SQLiteCustomColumnBuilder");
var _s, Ps;
class Gr extends (Ps = A, _s = f, Ps) {
  constructor(t, s) {
    super(t, s);
    n(this, "sqlName");
    n(this, "mapTo");
    n(this, "mapFrom");
    this.sqlName = s.customTypeParams.dataType(s.fieldConfig), this.mapTo = s.customTypeParams.toDriver, this.mapFrom = s.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(t) {
    return typeof this.mapFrom == "function" ? this.mapFrom(t) : t;
  }
  mapToDriverValue(t) {
    return typeof this.mapTo == "function" ? this.mapTo(t) : t;
  }
}
n(Gr, _s, "SQLiteCustomColumn");
function $o(i) {
  return (e, t) => {
    const { name: s, config: r } = he(e, t);
    return new Wr(
      s,
      r,
      i
    );
  };
}
var Rs, Es;
class je extends (Es = F, Rs = f, Es) {
  constructor(e, t, s) {
    super(e, t, s), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e != null && e.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
n(je, Rs, "SQLiteBaseIntegerBuilder");
var Ds, Fs;
class _e extends (Fs = A, Ds = f, Fs) {
  constructor() {
    super(...arguments);
    n(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
n(_e, Ds, "SQLiteBaseInteger");
var zs, Ms;
class Yr extends (Ms = je, zs = f, Ms) {
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new Zr(
      e,
      this.config
    );
  }
}
n(Yr, zs, "SQLiteIntegerBuilder");
var Vs, Ks;
class Zr extends (Ks = _e, Vs = f, Ks) {
}
n(Zr, Vs, "SQLiteInteger");
var Us, Js;
class Xr extends (Js = je, Us = f, Js) {
  constructor(e, t) {
    super(e, "date", "SQLiteTimestamp"), this.config.mode = t;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(u`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(e) {
    return new Hr(
      e,
      this.config
    );
  }
}
n(Xr, Us, "SQLiteTimestampBuilder");
var Ws, Gs;
class Hr extends (Gs = _e, Ws = f, Gs) {
  constructor() {
    super(...arguments);
    n(this, "mode", this.config.mode);
  }
  mapFromDriverValue(t) {
    return this.config.mode === "timestamp" ? new Date(t * 1e3) : new Date(t);
  }
  mapToDriverValue(t) {
    const s = t.getTime();
    return this.config.mode === "timestamp" ? Math.floor(s / 1e3) : s;
  }
}
n(Hr, Ws, "SQLiteTimestamp");
var Ys, Zs;
class kr extends (Zs = je, Ys = f, Zs) {
  constructor(e, t) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = t;
  }
  build(e) {
    return new en(
      e,
      this.config
    );
  }
}
n(kr, Ys, "SQLiteBooleanBuilder");
var Xs, Hs;
class en extends (Hs = _e, Xs = f, Hs) {
  constructor() {
    super(...arguments);
    n(this, "mode", this.config.mode);
  }
  mapFromDriverValue(t) {
    return Number(t) === 1;
  }
  mapToDriverValue(t) {
    return t ? 1 : 0;
  }
}
n(en, Xs, "SQLiteBoolean");
function tn(i, e) {
  const { name: t, config: s } = he(i, e);
  return (s == null ? void 0 : s.mode) === "timestamp" || (s == null ? void 0 : s.mode) === "timestamp_ms" ? new Xr(t, s.mode) : (s == null ? void 0 : s.mode) === "boolean" ? new kr(t, s.mode) : new Yr(t);
}
var ks, ei;
class sn extends (ei = F, ks = f, ei) {
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new rn(
      e,
      this.config
    );
  }
}
n(sn, ks, "SQLiteNumericBuilder");
var ti, si;
class rn extends (si = A, ti = f, si) {
  mapFromDriverValue(e) {
    return typeof e == "string" ? e : String(e);
  }
  getSQLType() {
    return "numeric";
  }
}
n(rn, ti, "SQLiteNumeric");
var ii, ri;
class nn extends (ri = F, ii = f, ri) {
  constructor(e) {
    super(e, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(e) {
    return new on(
      e,
      this.config
    );
  }
}
n(nn, ii, "SQLiteNumericNumberBuilder");
var ni, oi;
class on extends (oi = A, ni = f, oi) {
  constructor() {
    super(...arguments);
    n(this, "mapToDriverValue", String);
  }
  mapFromDriverValue(t) {
    return typeof t == "number" ? t : Number(t);
  }
  getSQLType() {
    return "numeric";
  }
}
n(on, ni, "SQLiteNumericNumber");
var ai, li;
class an extends (li = F, ai = f, li) {
  constructor(e) {
    super(e, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(e) {
    return new ln(
      e,
      this.config
    );
  }
}
n(an, ai, "SQLiteNumericBigIntBuilder");
var ui, ci;
class ln extends (ci = A, ui = f, ci) {
  constructor() {
    super(...arguments);
    n(this, "mapFromDriverValue", BigInt);
    n(this, "mapToDriverValue", String);
  }
  getSQLType() {
    return "numeric";
  }
}
n(ln, ui, "SQLiteNumericBigInt");
function Qo(i, e) {
  const { name: t, config: s } = he(i, e), r = s == null ? void 0 : s.mode;
  return r === "number" ? new nn(t) : r === "bigint" ? new an(t) : new sn(t);
}
var hi, di;
class un extends (di = F, hi = f, di) {
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new cn(e, this.config);
  }
}
n(un, hi, "SQLiteRealBuilder");
var fi, mi;
class cn extends (mi = A, fi = f, mi) {
  getSQLType() {
    return "real";
  }
}
n(cn, fi, "SQLiteReal");
function To(i) {
  return new un(i ?? "");
}
var pi, gi;
class hn extends (gi = F, pi = f, gi) {
  constructor(e, t) {
    super(e, "string", "SQLiteText"), this.config.enumValues = t.enum, this.config.length = t.length;
  }
  /** @internal */
  build(e) {
    return new dn(
      e,
      this.config
    );
  }
}
n(hn, pi, "SQLiteTextBuilder");
var yi, bi;
class dn extends (bi = A, yi = f, bi) {
  constructor(t, s) {
    super(t, s);
    n(this, "enumValues", this.config.enumValues);
    n(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
n(dn, yi, "SQLiteText");
var wi, Si;
class fn extends (Si = F, wi = f, Si) {
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new mn(
      e,
      this.config
    );
  }
}
n(fn, wi, "SQLiteTextJsonBuilder");
var Ni, $i;
class mn extends ($i = A, Ni = f, $i) {
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(e) {
    return JSON.parse(e);
  }
  mapToDriverValue(e) {
    return JSON.stringify(e);
  }
}
n(mn, Ni, "SQLiteTextJson");
function We(i, e = {}) {
  const { name: t, config: s } = he(i, e);
  return s.mode === "json" ? new fn(t) : new hn(t, s);
}
function Co() {
  return {
    blob: No,
    customType: $o,
    integer: tn,
    numeric: Qo,
    real: To,
    text: We
  };
}
const Ge = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var Qi, Ti, Ci, vi, Li;
class P extends (Li = p, vi = f, Ci = p.Symbol.Columns, Ti = Ge, Qi = p.Symbol.ExtraConfigBuilder, Li) {
  constructor() {
    super(...arguments);
    /** @internal */
    n(this, Ci);
    /** @internal */
    n(this, Ti, []);
    /** @internal */
    n(this, Qi);
  }
}
n(P, vi, "SQLiteTable"), /** @internal */
n(P, "Symbol", Object.assign({}, p.Symbol, {
  InlineForeignKeys: Ge
}));
function vo(i, e, t, s, r = i) {
  const o = new P(i, s, r), l = typeof e == "function" ? e(Co()) : e, a = Object.fromEntries(
    Object.entries(l).map(([m, h]) => {
      const w = h;
      w.setName(m);
      const y = w.build(o);
      return o[Ge].push(...w.buildForeignKeys(y, o)), [m, y];
    })
  ), c = Object.assign(o, a);
  return c[p.Symbol.Columns] = a, c[p.Symbol.ExtraConfigColumns] = a, c;
}
const Lo = (i, e, t) => vo(i, e);
function H(i) {
  return d(i, P) ? [`${i[p.Symbol.BaseName]}`] : d(i, R) ? i._.usedTables ?? [] : d(i, g) ? i.usedTables ?? [] : [];
}
var xi, Bi;
class Ye extends (Bi = Z, xi = f, Bi) {
  constructor(t, s, r, o) {
    super();
    /** @internal */
    n(this, "config");
    n(this, "run", (t) => this._prepare().run(t));
    n(this, "all", (t) => this._prepare().all(t));
    n(this, "get", (t) => this._prepare().get(t));
    n(this, "values", (t) => this._prepare().values(t));
    this.table = t, this.session = s, this.dialect = r, this.config = { table: t, withList: o };
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(t) {
    return this.config.where = t, this;
  }
  orderBy(...t) {
    if (typeof t[0] == "function") {
      const s = t[0](
        new Proxy(
          this.config.table[p.Symbol.Columns],
          new O({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), r = Array.isArray(s) ? s : [s];
      this.config.orderBy = r;
    } else {
      const s = t;
      this.config.orderBy = s;
    }
    return this;
  }
  limit(t) {
    return this.config.limit = t, this;
  }
  returning(t = this.table[P.Symbol.Columns]) {
    return this.config.returning = ee(t), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...s } = this.dialect.sqlToQuery(this.getSQL());
    return s;
  }
  /** @internal */
  _prepare(t = !0) {
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "delete",
        tables: H(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute(t) {
    return this._prepare().execute(t);
  }
  $dynamic() {
    return this;
  }
}
n(Ye, xi, "SQLiteDelete");
function xo(i) {
  return (i.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((t) => t.toLowerCase()).join("_");
}
function Bo(i) {
  return (i.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((t, s, r) => {
    const o = r === 0 ? s.toLowerCase() : `${s[0].toUpperCase()}${s.slice(1)}`;
    return t + o;
  }, "");
}
function qo(i) {
  return i;
}
var qi;
qi = f;
class pn {
  constructor(e) {
    /** @internal */
    n(this, "cache", {});
    n(this, "cachedTables", {});
    n(this, "convert");
    this.convert = e === "snake_case" ? xo : e === "camelCase" ? Bo : qo;
  }
  getColumnCasing(e) {
    if (!e.keyAsName) return e.name;
    const t = e.table[p.Symbol.Schema] ?? "public", s = e.table[p.Symbol.OriginalName], r = `${t}.${s}.${e.name}`;
    return this.cache[r] || this.cacheTable(e.table), this.cache[r];
  }
  cacheTable(e) {
    const t = e[p.Symbol.Schema] ?? "public", s = e[p.Symbol.OriginalName], r = `${t}.${s}`;
    if (!this.cachedTables[r]) {
      for (const o of Object.values(e[p.Symbol.Columns])) {
        const l = `${r}.${o.name}`;
        this.cache[l] = this.convert(o.name);
      }
      this.cachedTables[r] = !0;
    }
  }
  clearCache() {
    this.cache = {}, this.cachedTables = {};
  }
}
n(pn, qi, "CasingCache");
var Oi, Ai;
class Pe extends (Ai = se, Oi = f, Ai) {
}
n(Pe, Oi, "SQLiteViewBase");
var Ii;
Ii = f;
class Ce {
  constructor(e) {
    /** @internal */
    n(this, "casing");
    this.casing = new pn(e == null ? void 0 : e.casing);
  }
  escapeName(e) {
    return `"${e}"`;
  }
  escapeParam(e) {
    return "?";
  }
  escapeString(e) {
    return `'${e.replace(/'/g, "''")}'`;
  }
  buildWithCTE(e) {
    if (!(e != null && e.length)) return;
    const t = [u`with `];
    for (const [s, r] of e.entries())
      t.push(u`${u.identifier(r._.alias)} as (${r._.sql})`), s < e.length - 1 && t.push(u`, `);
    return t.push(u` `), u.join(t);
  }
  buildDeleteQuery({ table: e, where: t, returning: s, withList: r, limit: o, orderBy: l }) {
    const a = this.buildWithCTE(r), c = s ? u` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, m = t ? u` where ${t}` : void 0, h = this.buildOrderBy(l), w = this.buildLimit(o);
    return u`${a}delete from ${e}${m}${c}${h}${w}`;
  }
  buildUpdateSet(e, t) {
    const s = e[p.Symbol.Columns], r = Object.keys(s).filter(
      (l) => {
        var a;
        return t[l] !== void 0 || ((a = s[l]) == null ? void 0 : a.onUpdateFn) !== void 0;
      }
    ), o = r.length;
    return u.join(r.flatMap((l, a) => {
      const c = s[l], m = t[l] ?? u.param(c.onUpdateFn(), c), h = u`${u.identifier(this.casing.getColumnCasing(c))} = ${m}`;
      return a < o - 1 ? [h, u.raw(", ")] : [h];
    }));
  }
  buildUpdateQuery({ table: e, set: t, where: s, returning: r, withList: o, joins: l, from: a, limit: c, orderBy: m }) {
    const h = this.buildWithCTE(o), w = this.buildUpdateSet(e, t), y = a && u.join([u.raw(" from "), this.buildFromTable(a)]), S = this.buildJoins(l), T = r ? u` returning ${this.buildSelection(r, { isSingleTable: !0 })}` : void 0, N = s ? u` where ${s}` : void 0, C = this.buildOrderBy(m), v = this.buildLimit(c);
    return u`${h}update ${e} set ${w}${y}${S}${N}${T}${C}${v}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(e, { isSingleTable: t = !1 } = {}) {
    const s = e.length, r = e.flatMap(({ field: o }, l) => {
      const a = [];
      if (d(o, g.Aliased) && o.isSelectionField)
        a.push(u.identifier(o.fieldAlias));
      else if (d(o, g.Aliased) || d(o, g)) {
        const c = d(o, g.Aliased) ? o.sql : o;
        t ? a.push(
          new g(
            c.queryChunks.map((m) => d(m, L) ? u.identifier(this.casing.getColumnCasing(m)) : m)
          )
        ) : a.push(c), d(o, g.Aliased) && a.push(u` as ${u.identifier(o.fieldAlias)}`);
      } else if (d(o, L)) {
        const c = o.table[p.Symbol.Name];
        o.columnType === "SQLiteNumericBigInt" ? t ? a.push(u`cast(${u.identifier(this.casing.getColumnCasing(o))} as text)`) : a.push(
          u`cast(${u.identifier(c)}.${u.identifier(this.casing.getColumnCasing(o))} as text)`
        ) : t ? a.push(u.identifier(this.casing.getColumnCasing(o))) : a.push(u`${u.identifier(c)}.${u.identifier(this.casing.getColumnCasing(o))}`);
      }
      return l < s - 1 && a.push(u`, `), a;
    });
    return u.join(r);
  }
  buildJoins(e) {
    if (!e || e.length === 0)
      return;
    const t = [];
    if (e)
      for (const [s, r] of e.entries()) {
        s === 0 && t.push(u` `);
        const o = r.table, l = r.on ? u` on ${r.on}` : void 0;
        if (d(o, P)) {
          const a = o[P.Symbol.Name], c = o[P.Symbol.Schema], m = o[P.Symbol.OriginalName], h = a === m ? void 0 : r.alias;
          t.push(
            u`${u.raw(r.joinType)} join ${c ? u`${u.identifier(c)}.` : void 0}${u.identifier(m)}${h && u` ${u.identifier(h)}`}${l}`
          );
        } else
          t.push(
            u`${u.raw(r.joinType)} join ${o}${l}`
          );
        s < e.length - 1 && t.push(u` `);
      }
    return u.join(t);
  }
  buildLimit(e) {
    return typeof e == "object" || typeof e == "number" && e >= 0 ? u` limit ${e}` : void 0;
  }
  buildOrderBy(e) {
    const t = [];
    if (e)
      for (const [s, r] of e.entries())
        t.push(r), s < e.length - 1 && t.push(u`, `);
    return t.length > 0 ? u` order by ${u.join(t)}` : void 0;
  }
  buildFromTable(e) {
    return d(e, p) && e[p.Symbol.IsAlias] ? u`${u`${u.identifier(e[p.Symbol.Schema] ?? "")}.`.if(e[p.Symbol.Schema])}${u.identifier(e[p.Symbol.OriginalName])} ${u.identifier(e[p.Symbol.Name])}` : e;
  }
  buildSelectQuery({
    withList: e,
    fields: t,
    fieldsFlat: s,
    where: r,
    having: o,
    table: l,
    joins: a,
    orderBy: c,
    groupBy: m,
    limit: h,
    offset: w,
    distinct: y,
    setOperators: S
  }) {
    const T = s ?? ee(t);
    for (const z of T)
      if (d(z.field, L) && ne(z.field.table) !== (d(l, R) ? l._.alias : d(l, Pe) ? l[B].name : d(l, g) ? void 0 : ne(l)) && !((M) => a == null ? void 0 : a.some(
        ({ alias: pe }) => pe === (M[p.Symbol.IsAlias] ? ne(M) : M[p.Symbol.BaseName])
      ))(z.field.table)) {
        const M = ne(z.field.table);
        throw new Error(
          `Your "${z.path.join("->")}" field references a column "${M}"."${z.field.name}", but the table "${M}" is not part of the query! Did you forget to join it?`
        );
      }
    const N = !a || a.length === 0, C = this.buildWithCTE(e), v = y ? u` distinct` : void 0, _ = this.buildSelection(T, { isSingleTable: N }), q = this.buildFromTable(l), $ = this.buildJoins(a), V = r ? u` where ${r}` : void 0, E = o ? u` having ${o}` : void 0, b = [];
    if (m)
      for (const [z, M] of m.entries())
        b.push(M), z < m.length - 1 && b.push(u`, `);
    const Q = b.length > 0 ? u` group by ${u.join(b)}` : void 0, D = this.buildOrderBy(c), me = this.buildLimit(h), Ee = w ? u` offset ${w}` : void 0, ie = u`${C}select${v} ${_} from ${q}${$}${V}${Q}${E}${D}${me}${Ee}`;
    return S.length > 0 ? this.buildSetOperations(ie, S) : ie;
  }
  buildSetOperations(e, t) {
    const [s, ...r] = t;
    if (!s)
      throw new Error("Cannot pass undefined values to any set operator");
    return r.length === 0 ? this.buildSetOperationQuery({ leftSelect: e, setOperator: s }) : this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect: e, setOperator: s }),
      r
    );
  }
  buildSetOperationQuery({
    leftSelect: e,
    setOperator: { type: t, isAll: s, rightSelect: r, limit: o, orderBy: l, offset: a }
  }) {
    const c = u`${e.getSQL()} `, m = u`${r.getSQL()}`;
    let h;
    if (l && l.length > 0) {
      const T = [];
      for (const N of l)
        if (d(N, A))
          T.push(u.identifier(N.name));
        else if (d(N, g)) {
          for (let C = 0; C < N.queryChunks.length; C++) {
            const v = N.queryChunks[C];
            d(v, A) && (N.queryChunks[C] = u.identifier(this.casing.getColumnCasing(v)));
          }
          T.push(u`${N}`);
        } else
          T.push(u`${N}`);
      h = u` order by ${u.join(T, u`, `)}`;
    }
    const w = typeof o == "object" || typeof o == "number" && o >= 0 ? u` limit ${o}` : void 0, y = u.raw(`${t} ${s ? "all " : ""}`), S = a ? u` offset ${a}` : void 0;
    return u`${c}${y}${m}${h}${w}${S}`;
  }
  buildInsertQuery({ table: e, values: t, onConflict: s, returning: r, withList: o, select: l }) {
    const a = [], c = e[p.Symbol.Columns], m = Object.entries(c).filter(
      ([N, C]) => !C.shouldDisableInsert()
    ), h = m.map(([, N]) => u.identifier(this.casing.getColumnCasing(N)));
    if (l) {
      const N = t;
      d(N, g) ? a.push(N) : a.push(N.getSQL());
    } else {
      const N = t;
      a.push(u.raw("values "));
      for (const [C, v] of N.entries()) {
        const _ = [];
        for (const [q, $] of m) {
          const V = v[q];
          if (V === void 0 || d(V, J) && V.value === void 0) {
            let E;
            if ($.default !== null && $.default !== void 0)
              E = d($.default, g) ? $.default : u.param($.default, $);
            else if ($.defaultFn !== void 0) {
              const b = $.defaultFn();
              E = d(b, g) ? b : u.param(b, $);
            } else if (!$.default && $.onUpdateFn !== void 0) {
              const b = $.onUpdateFn();
              E = d(b, g) ? b : u.param(b, $);
            } else
              E = u`null`;
            _.push(E);
          } else
            _.push(V);
        }
        a.push(_), C < N.length - 1 && a.push(u`, `);
      }
    }
    const w = this.buildWithCTE(o), y = u.join(a), S = r ? u` returning ${this.buildSelection(r, { isSingleTable: !0 })}` : void 0, T = s != null && s.length ? u.join(s) : void 0;
    return u`${w}insert into ${e} ${h} ${y}${T}${S}`;
  }
  sqlToQuery(e, t) {
    return e.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource: t
    });
  }
  buildRelationalQuery({
    fullSchema: e,
    schema: t,
    tableNamesMap: s,
    table: r,
    tableConfig: o,
    queryConfig: l,
    tableAlias: a,
    nestedQueryRelation: c,
    joinOn: m
  }) {
    let h = [], w, y, S = [], T;
    const N = [];
    if (l === !0)
      h = Object.entries(o.columns).map(([_, q]) => ({
        dbKey: q.name,
        tsKey: _,
        field: K(q, a),
        relationTableTsKey: void 0,
        isJson: !1,
        selection: []
      }));
    else {
      const v = Object.fromEntries(
        Object.entries(o.columns).map(([b, Q]) => [b, K(Q, a)])
      );
      if (l.where) {
        const b = typeof l.where == "function" ? l.where(v, fo()) : l.where;
        T = b && Qe(b, a);
      }
      const _ = [];
      let q = [];
      if (l.columns) {
        let b = !1;
        for (const [Q, D] of Object.entries(l.columns))
          D !== void 0 && Q in o.columns && (!b && D === !0 && (b = !0), q.push(Q));
        q.length > 0 && (q = b ? q.filter((Q) => {
          var D;
          return ((D = l.columns) == null ? void 0 : D[Q]) === !0;
        }) : Object.keys(o.columns).filter((Q) => !q.includes(Q)));
      } else
        q = Object.keys(o.columns);
      for (const b of q) {
        const Q = o.columns[b];
        _.push({ tsKey: b, value: Q });
      }
      let $ = [];
      l.with && ($ = Object.entries(l.with).filter((b) => !!b[1]).map(([b, Q]) => ({ tsKey: b, queryConfig: Q, relation: o.relations[b] })));
      let V;
      if (l.extras) {
        V = typeof l.extras == "function" ? l.extras(v, { sql: u }) : l.extras;
        for (const [b, Q] of Object.entries(V))
          _.push({
            tsKey: b,
            value: xr(Q, a)
          });
      }
      for (const { tsKey: b, value: Q } of _)
        h.push({
          dbKey: d(Q, g.Aliased) ? Q.fieldAlias : o.columns[b].name,
          tsKey: b,
          field: d(Q, L) ? K(Q, a) : Q,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let E = typeof l.orderBy == "function" ? l.orderBy(v, mo()) : l.orderBy ?? [];
      Array.isArray(E) || (E = [E]), S = E.map((b) => d(b, L) ? K(b, a) : Qe(b, a)), w = l.limit, y = l.offset;
      for (const {
        tsKey: b,
        queryConfig: Q,
        relation: D
      } of $) {
        const me = bo(t, s, D), Ee = ue(D.referencedTable), ie = s[Ee], z = `${a}_${b}`, M = Ue(
          ...me.fields.map(
            (An, In) => de(
              K(me.references[In], z),
              K(An, a)
            )
          )
        ), pe = this.buildRelationalQuery({
          fullSchema: e,
          schema: t,
          tableNamesMap: s,
          table: e[ie],
          tableConfig: t[ie],
          queryConfig: d(D, te) ? Q === !0 ? { limit: 1 } : { ...Q, limit: 1 } : Q,
          tableAlias: z,
          joinOn: M,
          nestedQueryRelation: D
        }), On = u`(${pe.sql})`.as(b);
        h.push({
          dbKey: b,
          tsKey: b,
          field: On,
          relationTableTsKey: ie,
          isJson: !0,
          selection: pe.selection
        });
      }
    }
    if (h.length === 0)
      throw new Ie({
        message: `No fields selected for table "${o.tsName}" ("${a}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    let C;
    if (T = Ue(m, T), c) {
      let v = u`json_array(${u.join(
        h.map(
          ({ field: $ }) => d($, A) ? u.identifier(this.casing.getColumnCasing($)) : d($, g.Aliased) ? $.sql : $
        ),
        u`, `
      )})`;
      d(c, Te) && (v = u`coalesce(json_group_array(${v}), json_array())`);
      const _ = [{
        dbKey: "data",
        tsKey: "data",
        field: v.as("data"),
        isJson: !0,
        relationTableTsKey: o.tsName,
        selection: h
      }];
      w !== void 0 || y !== void 0 || S.length > 0 ? (C = this.buildSelectQuery({
        table: ze(r, a),
        fields: {},
        fieldsFlat: [
          {
            path: [],
            field: u.raw("*")
          }
        ],
        where: T,
        limit: w,
        offset: y,
        orderBy: S,
        setOperators: []
      }), T = void 0, w = void 0, y = void 0, S = void 0) : C = ze(r, a), C = this.buildSelectQuery({
        table: d(C, P) ? C : new R(C, {}, a),
        fields: {},
        fieldsFlat: _.map(({ field: $ }) => ({
          path: [],
          field: d($, L) ? K($, a) : $
        })),
        joins: N,
        where: T,
        limit: w,
        offset: y,
        orderBy: S,
        setOperators: []
      });
    } else
      C = this.buildSelectQuery({
        table: ze(r, a),
        fields: {},
        fieldsFlat: h.map(({ field: v }) => ({
          path: [],
          field: d(v, L) ? K(v, a) : v
        })),
        joins: N,
        where: T,
        limit: w,
        offset: y,
        orderBy: S,
        setOperators: []
      });
    return {
      tableTsKey: o.tsName,
      sql: C,
      selection: h
    };
  }
}
n(Ce, Ii, "SQLiteDialect");
var ji, _i;
class at extends (_i = Ce, ji = f, _i) {
  migrate(e, t, s) {
    const r = s === void 0 || typeof s == "string" ? "__drizzle_migrations" : s.migrationsTable ?? "__drizzle_migrations", o = u`
			CREATE TABLE IF NOT EXISTS ${u.identifier(r)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    t.run(o);
    const a = t.values(
      u`SELECT id, hash, created_at FROM ${u.identifier(r)} ORDER BY created_at DESC LIMIT 1`
    )[0] ?? void 0;
    t.run(u`BEGIN`);
    try {
      for (const c of e)
        if (!a || Number(a[2]) < c.folderMillis) {
          for (const m of c.sql)
            t.run(u.raw(m));
          t.run(
            u`INSERT INTO ${u.identifier(r)} ("hash", "created_at") VALUES(${c.hash}, ${c.folderMillis})`
          );
        }
      t.run(u`COMMIT`);
    } catch (c) {
      throw t.run(u`ROLLBACK`), c;
    }
  }
}
n(at, ji, "SQLiteSyncDialect");
var Pi;
Pi = f;
class gn {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
n(gn, Pi, "TypedQueryBuilder");
var Ri;
Ri = f;
class U {
  constructor(e) {
    n(this, "fields");
    n(this, "session");
    n(this, "dialect");
    n(this, "withList");
    n(this, "distinct");
    this.fields = e.fields, this.session = e.session, this.dialect = e.dialect, this.withList = e.withList, this.distinct = e.distinct;
  }
  from(e) {
    const t = !!this.fields;
    let s;
    return this.fields ? s = this.fields : d(e, R) ? s = Object.fromEntries(
      Object.keys(e._.selectedFields).map((r) => [r, e[r]])
    ) : d(e, Pe) ? s = e[B].selectedFields : d(e, g) ? s = {} : s = Kn(e), new lt({
      table: e,
      fields: s,
      isPartialSelect: t,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
}
n(U, Ri, "SQLiteSelectBuilder");
var Ei, Di;
class yn extends (Di = gn, Ei = f, Di) {
  constructor({ table: t, fields: s, isPartialSelect: r, session: o, dialect: l, withList: a, distinct: c }) {
    super();
    n(this, "_");
    /** @internal */
    n(this, "config");
    n(this, "joinsNotNullableMap");
    n(this, "tableName");
    n(this, "isPartialSelect");
    n(this, "session");
    n(this, "dialect");
    n(this, "cacheConfig");
    n(this, "usedTables", /* @__PURE__ */ new Set());
    /**
     * Executes a `left join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    n(this, "leftJoin", this.createJoin("left"));
    /**
     * Executes a `right join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    n(this, "rightJoin", this.createJoin("right"));
    /**
     * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
     *
     * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    n(this, "innerJoin", this.createJoin("inner"));
    /**
     * Executes a `full join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    n(this, "fullJoin", this.createJoin("full"));
    /**
     * Executes a `cross join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
     *
     * @param table the table to join.
     *
     * @example
     *
     * ```ts
     * // Select all users, each user with every pet
     * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .crossJoin(pets)
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .crossJoin(pets)
     * ```
     */
    n(this, "crossJoin", this.createJoin("cross"));
    /**
     * Adds `union` set operator to the query.
     *
     * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
     *
     * @example
     *
     * ```ts
     * // Select all unique names from customers and users tables
     * await db.select({ name: users.name })
     *   .from(users)
     *   .union(
     *     db.select({ name: customers.name }).from(customers)
     *   );
     * // or
     * import { union } from 'drizzle-orm/sqlite-core'
     *
     * await union(
     *   db.select({ name: users.name }).from(users),
     *   db.select({ name: customers.name }).from(customers)
     * );
     * ```
     */
    n(this, "union", this.createSetOperator("union", !1));
    /**
     * Adds `union all` set operator to the query.
     *
     * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
     *
     * @example
     *
     * ```ts
     * // Select all transaction ids from both online and in-store sales
     * await db.select({ transaction: onlineSales.transactionId })
     *   .from(onlineSales)
     *   .unionAll(
     *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     *   );
     * // or
     * import { unionAll } from 'drizzle-orm/sqlite-core'
     *
     * await unionAll(
     *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
     *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     * );
     * ```
     */
    n(this, "unionAll", this.createSetOperator("union", !0));
    /**
     * Adds `intersect` set operator to the query.
     *
     * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
     *
     * @example
     *
     * ```ts
     * // Select course names that are offered in both departments A and B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .intersect(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { intersect } from 'drizzle-orm/sqlite-core'
     *
     * await intersect(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    n(this, "intersect", this.createSetOperator("intersect", !1));
    /**
     * Adds `except` set operator to the query.
     *
     * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
     *
     * @example
     *
     * ```ts
     * // Select all courses offered in department A but not in department B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .except(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { except } from 'drizzle-orm/sqlite-core'
     *
     * await except(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    n(this, "except", this.createSetOperator("except", !1));
    this.config = {
      withList: a,
      table: t,
      fields: { ...s },
      distinct: c,
      setOperators: []
    }, this.isPartialSelect = r, this.session = o, this.dialect = l, this._ = {
      selectedFields: s,
      config: this.config
    }, this.tableName = Ve(t), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: !0 } : {};
    for (const m of H(t)) this.usedTables.add(m);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(t) {
    return (s, r) => {
      var a;
      const o = this.tableName, l = Ve(s);
      for (const c of H(s)) this.usedTables.add(c);
      if (typeof l == "string" && ((a = this.config.joins) != null && a.some((c) => c.alias === l)))
        throw new Error(`Alias "${l}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof o == "string" && (this.config.fields = {
        [o]: this.config.fields
      }), typeof l == "string" && !d(s, g))) {
        const c = d(s, R) ? s._.selectedFields : d(s, se) ? s[B].selectedFields : s[p.Symbol.Columns];
        this.config.fields[l] = c;
      }
      if (typeof r == "function" && (r = r(
        new Proxy(
          this.config.fields,
          new O({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      )), this.config.joins || (this.config.joins = []), this.config.joins.push({ on: r, table: s, joinType: t, alias: l }), typeof l == "string")
        switch (t) {
          case "left": {
            this.joinsNotNullableMap[l] = !1;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([c]) => [c, !1])
            ), this.joinsNotNullableMap[l] = !0;
            break;
          }
          case "cross":
          case "inner": {
            this.joinsNotNullableMap[l] = !0;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([c]) => [c, !1])
            ), this.joinsNotNullableMap[l] = !1;
            break;
          }
        }
      return this;
    };
  }
  createSetOperator(t, s) {
    return (r) => {
      const o = typeof r == "function" ? r(Oo()) : r;
      if (!nt(this.getSelectedFields(), o.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      return this.config.setOperators.push({ type: t, isAll: s, rightSelect: o }), this;
    };
  }
  /** @internal */
  addSetOperators(t) {
    return this.config.setOperators.push(...t), this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(t) {
    return typeof t == "function" && (t = t(
      new Proxy(
        this.config.fields,
        new O({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.where = t, this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(t) {
    return typeof t == "function" && (t = t(
      new Proxy(
        this.config.fields,
        new O({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = t, this;
  }
  groupBy(...t) {
    if (typeof t[0] == "function") {
      const s = t[0](
        new Proxy(
          this.config.fields,
          new O({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(s) ? s : [s];
    } else
      this.config.groupBy = t;
    return this;
  }
  orderBy(...t) {
    if (typeof t[0] == "function") {
      const s = t[0](
        new Proxy(
          this.config.fields,
          new O({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), r = Array.isArray(s) ? s : [s];
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = r : this.config.orderBy = r;
    } else {
      const s = t;
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = s : this.config.orderBy = s;
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(t) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).limit = t : this.config.limit = t, this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(t) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).offset = t : this.config.offset = t, this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...s } = this.dialect.sqlToQuery(this.getSQL());
    return s;
  }
  as(t) {
    const s = [];
    if (s.push(...H(this.config.table)), this.config.joins)
      for (const r of this.config.joins) s.push(...H(r.table));
    return new Proxy(
      new R(this.getSQL(), this.config.fields, t, !1, [...new Set(s)]),
      new O({ alias: t, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new O({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
n(yn, Ei, "SQLiteSelectQueryBuilder");
var Fi, zi;
class lt extends (zi = yn, Fi = f, zi) {
  constructor() {
    super(...arguments);
    n(this, "run", (t) => this._prepare().run(t));
    n(this, "all", (t) => this._prepare().all(t));
    n(this, "get", (t) => this._prepare().get(t));
    n(this, "values", (t) => this._prepare().values(t));
  }
  /** @internal */
  _prepare(t = !0) {
    if (!this.session)
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    const s = ee(this.config.fields), r = this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      s,
      "all",
      !0,
      void 0,
      {
        type: "select",
        tables: [...this.usedTables]
      },
      this.cacheConfig
    );
    return r.joinsNotNullableMap = this.joinsNotNullableMap, r;
  }
  $withCache(t) {
    return this.cacheConfig = t === void 0 ? { config: {}, enable: !0, autoInvalidate: !0 } : t === !1 ? { enable: !1 } : { enable: !0, autoInvalidate: !0, ...t }, this;
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.all();
  }
}
n(lt, Fi, "SQLiteSelect");
Vn(lt, [Z]);
function Re(i, e) {
  return (t, s, ...r) => {
    const o = [s, ...r].map((l) => ({
      type: i,
      isAll: e,
      rightSelect: l
    }));
    for (const l of o)
      if (!nt(t.getSelectedFields(), l.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return t.addSetOperators(o);
  };
}
const Oo = () => ({
  union: Ao,
  unionAll: Io,
  intersect: jo,
  except: _o
}), Ao = Re("union", !1), Io = Re("union", !0), jo = Re("intersect", !1), _o = Re("except", !1);
var Mi;
Mi = f;
class ut {
  constructor(e) {
    n(this, "dialect");
    n(this, "dialectConfig");
    n(this, "$with", (e, t) => {
      const s = this;
      return { as: (o) => (typeof o == "function" && (o = o(s)), new Proxy(
        new rt(
          o.getSQL(),
          t ?? ("getSelectedFields" in o ? o.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new O({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      )) };
    });
    this.dialect = d(e, Ce) ? e : void 0, this.dialectConfig = d(e, Ce) ? void 0 : e;
  }
  with(...e) {
    const t = this;
    function s(o) {
      return new U({
        fields: o ?? void 0,
        session: void 0,
        dialect: t.getDialect(),
        withList: e
      });
    }
    function r(o) {
      return new U({
        fields: o ?? void 0,
        session: void 0,
        dialect: t.getDialect(),
        withList: e,
        distinct: !0
      });
    }
    return { select: s, selectDistinct: r };
  }
  select(e) {
    return new U({ fields: e ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(e) {
    return new U({
      fields: e ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: !0
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    return this.dialect || (this.dialect = new at(this.dialectConfig)), this.dialect;
  }
}
n(ut, Mi, "SQLiteQueryBuilder");
var Vi;
Vi = f;
class Ze {
  constructor(e, t, s, r) {
    this.table = e, this.session = t, this.dialect = s, this.withList = r;
  }
  values(e) {
    if (e = Array.isArray(e) ? e : [e], e.length === 0)
      throw new Error("values() must be called with at least one value");
    const t = e.map((s) => {
      const r = {}, o = this.table[p.Symbol.Columns];
      for (const l of Object.keys(s)) {
        const a = s[l];
        r[l] = d(a, g) ? a : new J(a, o[l]);
      }
      return r;
    });
    return new Xe(this.table, t, this.session, this.dialect, this.withList);
  }
  select(e) {
    const t = typeof e == "function" ? e(new ut()) : e;
    if (!d(t, g) && !nt(this.table[Me], t._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new Xe(this.table, t, this.session, this.dialect, this.withList, !0);
  }
}
n(Ze, Vi, "SQLiteInsertBuilder");
var Ki, Ui;
class Xe extends (Ui = Z, Ki = f, Ui) {
  constructor(t, s, r, o, l, a) {
    super();
    /** @internal */
    n(this, "config");
    n(this, "run", (t) => this._prepare().run(t));
    n(this, "all", (t) => this._prepare().all(t));
    n(this, "get", (t) => this._prepare().get(t));
    n(this, "values", (t) => this._prepare().values(t));
    this.session = r, this.dialect = o, this.config = { table: t, values: s, withList: l, select: a };
  }
  returning(t = this.config.table[P.Symbol.Columns]) {
    return this.config.returning = ee(t), this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(t = {}) {
    if (this.config.onConflict || (this.config.onConflict = []), t.target === void 0)
      this.config.onConflict.push(u` on conflict do nothing`);
    else {
      const s = Array.isArray(t.target) ? u`${t.target}` : u`${[t.target]}`, r = t.where ? u` where ${t.where}` : u``;
      this.config.onConflict.push(u` on conflict ${s} do nothing${r}`);
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(t) {
    if (t.where && (t.targetWhere || t.setWhere))
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    this.config.onConflict || (this.config.onConflict = []);
    const s = t.where ? u` where ${t.where}` : void 0, r = t.targetWhere ? u` where ${t.targetWhere}` : void 0, o = t.setWhere ? u` where ${t.setWhere}` : void 0, l = Array.isArray(t.target) ? u`${t.target}` : u`${[t.target]}`, a = this.dialect.buildUpdateSet(this.config.table, Ir(this.config.table, t.set));
    return this.config.onConflict.push(
      u` on conflict ${l}${r} do update set ${a}${s}${o}`
    ), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...s } = this.dialect.sqlToQuery(this.getSQL());
    return s;
  }
  /** @internal */
  _prepare(t = !0) {
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "insert",
        tables: H(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
n(Xe, Ki, "SQLiteInsert");
var Ji;
Ji = f;
class He {
  constructor(e, t, s, r) {
    this.table = e, this.session = t, this.dialect = s, this.withList = r;
  }
  set(e) {
    return new bn(
      this.table,
      Ir(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
n(He, Ji, "SQLiteUpdateBuilder");
var Wi, Gi;
class bn extends (Gi = Z, Wi = f, Gi) {
  constructor(t, s, r, o, l) {
    super();
    /** @internal */
    n(this, "config");
    n(this, "leftJoin", this.createJoin("left"));
    n(this, "rightJoin", this.createJoin("right"));
    n(this, "innerJoin", this.createJoin("inner"));
    n(this, "fullJoin", this.createJoin("full"));
    n(this, "run", (t) => this._prepare().run(t));
    n(this, "all", (t) => this._prepare().all(t));
    n(this, "get", (t) => this._prepare().get(t));
    n(this, "values", (t) => this._prepare().values(t));
    this.session = r, this.dialect = o, this.config = { set: s, table: t, withList: l, joins: [] };
  }
  from(t) {
    return this.config.from = t, this;
  }
  createJoin(t) {
    return (s, r) => {
      const o = Ve(s);
      if (typeof o == "string" && this.config.joins.some((l) => l.alias === o))
        throw new Error(`Alias "${o}" is already used in this query`);
      if (typeof r == "function") {
        const l = this.config.from ? d(s, P) ? s[p.Symbol.Columns] : d(s, R) ? s._.selectedFields : d(s, Pe) ? s[B].selectedFields : void 0 : void 0;
        r = r(
          new Proxy(
            this.config.table[p.Symbol.Columns],
            new O({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          l && new Proxy(
            l,
            new O({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      return this.config.joins.push({ on: r, table: s, joinType: t, alias: o }), this;
    };
  }
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(t) {
    return this.config.where = t, this;
  }
  orderBy(...t) {
    if (typeof t[0] == "function") {
      const s = t[0](
        new Proxy(
          this.config.table[p.Symbol.Columns],
          new O({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), r = Array.isArray(s) ? s : [s];
      this.config.orderBy = r;
    } else {
      const s = t;
      this.config.orderBy = s;
    }
    return this;
  }
  limit(t) {
    return this.config.limit = t, this;
  }
  returning(t = this.config.table[P.Symbol.Columns]) {
    return this.config.returning = ee(t), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...s } = this.dialect.sqlToQuery(this.getSQL());
    return s;
  }
  /** @internal */
  _prepare(t = !0) {
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "insert",
        tables: H(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
n(bn, Wi, "SQLiteUpdate");
var Yi, Zi, Xi;
const le = class le extends (Xi = g, Zi = f, Yi = Symbol.toStringTag, Xi) {
  constructor(t) {
    super(le.buildEmbeddedCount(t.source, t.filters).queryChunks);
    n(this, "sql");
    n(this, Yi, "SQLiteCountBuilderAsync");
    n(this, "session");
    this.params = t, this.session = t.session, this.sql = le.buildCount(
      t.source,
      t.filters
    );
  }
  static buildEmbeddedCount(t, s) {
    return u`(select count(*) from ${t}${u.raw(" where ").if(s)}${s})`;
  }
  static buildCount(t, s) {
    return u`select count(*) from ${t}${u.raw(" where ").if(s)}${s}`;
  }
  then(t, s) {
    return Promise.resolve(this.session.count(this.sql)).then(
      t,
      s
    );
  }
  catch(t) {
    return this.then(void 0, t);
  }
  finally(t) {
    return this.then(
      (s) => (t == null || t(), s),
      (s) => {
        throw t == null || t(), s;
      }
    );
  }
};
n(le, Zi, "SQLiteCountBuilderAsync");
let ke = le;
var Hi;
Hi = f;
class wn {
  constructor(e, t, s, r, o, l, a, c) {
    this.mode = e, this.fullSchema = t, this.schema = s, this.tableNamesMap = r, this.table = o, this.tableConfig = l, this.dialect = a, this.session = c;
  }
  findMany(e) {
    return this.mode === "sync" ? new et(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    ) : new ve(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    );
  }
  findFirst(e) {
    return this.mode === "sync" ? new et(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    ) : new ve(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    );
  }
}
n(wn, Hi, "SQLiteAsyncRelationalQueryBuilder");
var ki, er;
class ve extends (er = Z, ki = f, er) {
  constructor(t, s, r, o, l, a, c, m, h) {
    super();
    /** @internal */
    n(this, "mode");
    this.fullSchema = t, this.schema = s, this.tableNamesMap = r, this.table = o, this.tableConfig = l, this.dialect = a, this.session = c, this.config = m, this.mode = h;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(t = !1) {
    const { query: s, builtQuery: r } = this._toSQL();
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      r,
      void 0,
      this.mode === "first" ? "get" : "all",
      !0,
      (o, l) => {
        const a = o.map(
          (c) => Je(this.schema, this.tableConfig, c, s.selection, l)
        );
        return this.mode === "first" ? a[0] : a;
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  _toSQL() {
    const t = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }), s = this.dialect.sqlToQuery(t.sql);
    return { query: t, builtQuery: s };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    return this.mode === "first" ? this._prepare(!1).get() : this._prepare(!1).all();
  }
  async execute() {
    return this.executeRaw();
  }
}
n(ve, ki, "SQLiteAsyncRelationalQuery");
var tr, sr;
class et extends (sr = ve, tr = f, sr) {
  sync() {
    return this.executeRaw();
  }
}
n(et, tr, "SQLiteSyncRelationalQuery");
var ir, rr;
class ae extends (rr = Z, ir = f, rr) {
  constructor(t, s, r, o, l) {
    super();
    /** @internal */
    n(this, "config");
    this.execute = t, this.getSQL = s, this.dialect = o, this.mapBatchResult = l, this.config = { action: r };
  }
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(t, s) {
    return s ? this.mapBatchResult(t) : t;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return !1;
  }
}
n(ae, ir, "SQLiteRaw");
var nr;
nr = f;
class ct {
  constructor(e, t, s, r) {
    n(this, "query");
    /**
     * Creates a subquery that defines a temporary named result set as a CTE.
     *
     * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
     *
     * @param alias The alias for the subquery.
     *
     * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
     *
     * @example
     *
     * ```ts
     * // Create a subquery with alias 'sq' and use it in the select query
     * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
     *
     * const result = await db.with(sq).select().from(sq);
     * ```
     *
     * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
     *
     * ```ts
     * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
     * const sq = db.$with('sq').as(db.select({
     *   name: sql<string>`upper(${users.name})`.as('name'),
     * })
     * .from(users));
     *
     * const result = await db.with(sq).select({ name: sq.name }).from(sq);
     * ```
     */
    n(this, "$with", (e, t) => {
      const s = this;
      return { as: (o) => (typeof o == "function" && (o = o(new ut(s.dialect))), new Proxy(
        new rt(
          o.getSQL(),
          t ?? ("getSelectedFields" in o ? o.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new O({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      )) };
    });
    n(this, "$cache");
    this.resultKind = e, this.dialect = t, this.session = s, this._ = r ? {
      schema: r.schema,
      fullSchema: r.fullSchema,
      tableNamesMap: r.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    }, this.query = {};
    const o = this.query;
    if (this._.schema)
      for (const [l, a] of Object.entries(this._.schema))
        o[l] = new wn(
          e,
          r.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          r.fullSchema[l],
          a,
          t,
          s
        );
    this.$cache = { invalidate: async (l) => {
    } };
  }
  $count(e, t) {
    return new ke({ source: e, filters: t, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...e) {
    const t = this;
    function s(c) {
      return new U({
        fields: c ?? void 0,
        session: t.session,
        dialect: t.dialect,
        withList: e
      });
    }
    function r(c) {
      return new U({
        fields: c ?? void 0,
        session: t.session,
        dialect: t.dialect,
        withList: e,
        distinct: !0
      });
    }
    function o(c) {
      return new He(c, t.session, t.dialect, e);
    }
    function l(c) {
      return new Ze(c, t.session, t.dialect, e);
    }
    function a(c) {
      return new Ye(c, t.session, t.dialect, e);
    }
    return { select: s, selectDistinct: r, update: o, insert: l, delete: a };
  }
  select(e) {
    return new U({ fields: e ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(e) {
    return new U({
      fields: e ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: !0
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(e) {
    return new He(e, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(e) {
    return new Ze(e, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(e) {
    return new Ye(e, this.session, this.dialect);
  }
  run(e) {
    const t = typeof e == "string" ? u.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new ae(
      async () => this.session.run(t),
      () => t,
      "run",
      this.dialect,
      this.session.extractRawRunValueFromBatchResult.bind(this.session)
    ) : this.session.run(t);
  }
  all(e) {
    const t = typeof e == "string" ? u.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new ae(
      async () => this.session.all(t),
      () => t,
      "all",
      this.dialect,
      this.session.extractRawAllValueFromBatchResult.bind(this.session)
    ) : this.session.all(t);
  }
  get(e) {
    const t = typeof e == "string" ? u.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new ae(
      async () => this.session.get(t),
      () => t,
      "get",
      this.dialect,
      this.session.extractRawGetValueFromBatchResult.bind(this.session)
    ) : this.session.get(t);
  }
  values(e) {
    const t = typeof e == "string" ? u.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new ae(
      async () => this.session.values(t),
      () => t,
      "values",
      this.dialect,
      this.session.extractRawValuesValueFromBatchResult.bind(this.session)
    ) : this.session.values(t);
  }
  transaction(e, t) {
    return this.session.transaction(e, t);
  }
}
n(ct, nr, "BaseSQLiteDatabase");
var or;
or = f;
class Sn {
}
n(Sn, or, "Cache");
var ar, lr;
class ht extends (lr = Sn, ar = f, lr) {
  strategy() {
    return "all";
  }
  async get(e) {
  }
  async put(e, t, s, r) {
  }
  async onMutate(e) {
  }
}
n(ht, ar, "NoopCache");
async function wt(i, e) {
  const t = `${i}-${JSON.stringify(e)}`, r = new TextEncoder().encode(t), o = await crypto.subtle.digest("SHA-256", r);
  return [...new Uint8Array(o)].map((c) => c.toString(16).padStart(2, "0")).join("");
}
var ur, cr;
class Nn extends (cr = Z, ur = f, cr) {
  constructor(e) {
    super(), this.resultCb = e;
  }
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
}
n(Nn, ur, "ExecuteResultSync");
var hr;
hr = f;
class $n {
  constructor(e, t, s, r, o, l) {
    /** @internal */
    n(this, "joinsNotNullableMap");
    var a;
    this.mode = e, this.executeMethod = t, this.query = s, this.cache = r, this.queryMetadata = o, this.cacheConfig = l, r && r.strategy() === "all" && l === void 0 && (this.cacheConfig = { enable: !0, autoInvalidate: !0 }), (a = this.cacheConfig) != null && a.enable || (this.cacheConfig = void 0);
  }
  /** @internal */
  async queryWithCache(e, t, s) {
    if (this.cache === void 0 || d(this.cache, ht) || this.queryMetadata === void 0)
      try {
        return await s();
      } catch (r) {
        throw new G(e, t, r);
      }
    if (this.cacheConfig && !this.cacheConfig.enable)
      try {
        return await s();
      } catch (r) {
        throw new G(e, t, r);
      }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0)
      try {
        const [r] = await Promise.all([
          s(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return r;
      } catch (r) {
        throw new G(e, t, r);
      }
    if (!this.cacheConfig)
      try {
        return await s();
      } catch (r) {
        throw new G(e, t, r);
      }
    if (this.queryMetadata.type === "select") {
      const r = await this.cache.get(
        this.cacheConfig.tag ?? await wt(e, t),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (r === void 0) {
        let o;
        try {
          o = await s();
        } catch (l) {
          throw new G(e, t, l);
        }
        return await this.cache.put(
          this.cacheConfig.tag ?? await wt(e, t),
          o,
          // make sure we send tables that were used in a query only if user wants to invalidate it on each write
          this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
          this.cacheConfig.tag !== void 0,
          this.cacheConfig.config
        ), o;
      }
      return r;
    }
    try {
      return await s();
    } catch (r) {
      throw new G(e, t, r);
    }
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(e, t) {
    return e;
  }
  mapAllResult(e, t) {
    throw new Error("Not implemented");
  }
  mapGetResult(e, t) {
    throw new Error("Not implemented");
  }
  execute(e) {
    return this.mode === "async" ? this[this.executeMethod](e) : new Nn(() => this[this.executeMethod](e));
  }
  mapResult(e, t) {
    switch (this.executeMethod) {
      case "run":
        return this.mapRunResult(e, t);
      case "all":
        return this.mapAllResult(e, t);
      case "get":
        return this.mapGetResult(e, t);
    }
  }
}
n($n, hr, "PreparedQuery");
var dr;
dr = f;
class Qn {
  constructor(e) {
    this.dialect = e;
  }
  prepareOneTimeQuery(e, t, s, r, o, l, a) {
    return this.prepareQuery(
      e,
      t,
      s,
      r,
      o,
      l,
      a
    );
  }
  run(e) {
    const t = this.dialect.sqlToQuery(e);
    try {
      return this.prepareOneTimeQuery(t, void 0, "run", !1).run();
    } catch (s) {
      throw new Ie({ cause: s, message: `Failed to run the query '${t.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(e) {
    return e;
  }
  all(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  get(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  values(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).values();
  }
  async count(e) {
    return (await this.values(e))[0][0];
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
}
n(Qn, dr, "SQLiteSession");
var fr, mr;
class Tn extends (mr = ct, fr = f, mr) {
  constructor(e, t, s, r, o = 0) {
    super(e, t, s, r), this.schema = r, this.nestedIndex = o;
  }
  rollback() {
    throw new Br();
  }
}
n(Tn, fr, "SQLiteTransaction");
var pr, gr;
class Cn extends (gr = Qn, pr = f, gr) {
  constructor(t, s, r, o = {}) {
    super(s);
    n(this, "logger");
    n(this, "cache");
    this.client = t, this.schema = r, this.logger = o.logger ?? new Ar(), this.cache = o.cache ?? new ht();
  }
  prepareQuery(t, s, r, o, l, a, c) {
    const m = this.client.prepare(t.sql);
    return new vn(
      m,
      t,
      this.logger,
      this.cache,
      a,
      c,
      s,
      r,
      o,
      l
    );
  }
  transaction(t, s = {}) {
    const r = new tt("sync", this.dialect, this, this.schema);
    return this.client.transaction(t)[s.behavior ?? "deferred"](r);
  }
}
n(Cn, pr, "BetterSQLiteSession");
var yr, br;
const qe = class qe extends (br = Tn, yr = f, br) {
  transaction(e) {
    const t = `sp${this.nestedIndex}`, s = new qe("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(u.raw(`savepoint ${t}`));
    try {
      const r = e(s);
      return this.session.run(u.raw(`release savepoint ${t}`)), r;
    } catch (r) {
      throw this.session.run(u.raw(`rollback to savepoint ${t}`)), r;
    }
  }
};
n(qe, yr, "BetterSQLiteTransaction");
let tt = qe;
var wr, Sr;
class vn extends (Sr = $n, wr = f, Sr) {
  constructor(e, t, s, r, o, l, a, c, m, h) {
    super("sync", c, t, r, o, l), this.stmt = e, this.logger = s, this.fields = a, this._isResponseInArrayMode = m, this.customResultMapper = h;
  }
  run(e) {
    const t = ge(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, t), this.stmt.run(...t);
  }
  all(e) {
    const { fields: t, joinsNotNullableMap: s, query: r, logger: o, stmt: l, customResultMapper: a } = this;
    if (!t && !a) {
      const m = ge(r.params, e ?? {});
      return o.logQuery(r.sql, m), l.all(...m);
    }
    const c = this.values(e);
    return a ? a(c) : c.map((m) => gt(t, m, s));
  }
  get(e) {
    const t = ge(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, t);
    const { fields: s, stmt: r, joinsNotNullableMap: o, customResultMapper: l } = this;
    if (!s && !l)
      return r.get(...t);
    const a = r.raw().get(...t);
    if (a)
      return l ? l([a]) : gt(s, a, o);
  }
  values(e) {
    const t = ge(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, t), this.stmt.raw().all(...t);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
n(vn, wr, "BetterSQLitePreparedQuery");
var Nr, $r;
class Ln extends ($r = ct, Nr = f, $r) {
}
n(Ln, Nr, "BetterSQLite3Database");
function re(i, e = {}) {
  const t = new at({ casing: e.casing });
  let s;
  e.logger === !0 ? s = new Or() : e.logger !== !1 && (s = e.logger);
  let r;
  if (e.schema) {
    const a = po(
      e.schema,
      wo
    );
    r = {
      fullSchema: e.schema,
      schema: a.tables,
      tableNamesMap: a.tableNamesMap
    };
  }
  const o = new Cn(i, t, r, { logger: s }), l = new Ln("sync", t, o, r);
  return l.$client = i, l;
}
function st(...i) {
  if (i[0] === void 0 || typeof i[0] == "string") {
    const e = i[0] === void 0 ? new oe() : new oe(i[0]);
    return re(e, i[1]);
  }
  if (Un(i[0])) {
    const { connection: e, client: t, ...s } = i[0];
    if (t) return re(t, s);
    if (typeof e == "object") {
      const { source: o, ...l } = e, a = new oe(o, l);
      return re(a, s);
    }
    const r = new oe(e);
    return re(r, s);
  }
  return re(i[0], i[1]);
}
((i) => {
  function e(t) {
    return re({}, t);
  }
  i.mock = e;
})(st || (st = {}));
const I = Lo("plugin_settings", {
  pluginId: We("plugin_id").primaryKey(),
  enabled: tn("enabled").notNull().default(0),
  settings: We("settings")
});
let ye = null;
function Po() {
  const i = process.env.BRAIN4ME_DB_DIR ?? we.resolve(process.cwd(), "data"), e = process.env.BRAIN4ME_DB_FILE ?? "brain4me.sqlite";
  return dt.existsSync(i) || dt.mkdirSync(i, { recursive: !0 }), we.join(i, e);
}
function fe() {
  if (ye) return ye;
  const i = new oe(Po());
  return i.exec(
    "CREATE TABLE IF NOT EXISTS plugin_settings (plugin_id TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1, settings TEXT)"
  ), i.prepare("PRAGMA table_info(plugin_settings)").all().some((t) => t.name === "settings") || i.exec("ALTER TABLE plugin_settings ADD COLUMN settings TEXT"), ye = st(i), ye;
}
const xn = Pn(import.meta.url), Bn = we.dirname(xn);
globalThis.__filename = xn;
globalThis.__dirname = Bn;
let W = null;
const it = [
  { id: "hello", name: "Hello Plugin", description: "Plugin de démonstration" },
  { id: "notes", name: "Notes", description: "Bloc-notes local (exemple)" },
  { id: "calendar", name: "Calendrier", description: "Aperçu calendrier statique" }
];
async function Ro() {
  await fe().insert(I).values(it.map((e) => ({ pluginId: e.id, enabled: 1, settings: "{}" }))).onConflictDoNothing({ target: I.pluginId });
}
async function qn() {
  W = new Qr({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: we.join(Bn, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !0
    },
    show: !1
  });
  const i = process.env.VITE_DEV_SERVER_URL, e = new URL("data:text/html;base64,PCFkb2N0eXBlIGh0bWw+CjxodG1sPgo8aGVhZD4KICAgIDxtZXRhIGNoYXJzZXQ9IlVURi04IiAvPgogICAgPG1ldGEgaHR0cC1lcXVpdj0iQ29udGVudC1TZWN1cml0eS1Qb2xpY3kiCiAgICAgICAgICBjb250ZW50PSJkZWZhdWx0LXNyYyAnc2VsZic7IGltZy1zcmMgJ3NlbGYnIGRhdGE6OyBzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJzsgc2NyaXB0LXNyYyAnc2VsZic7IiAvPgogICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjAiIC8+CiAgICA8dGl0bGU+QnJhaW40TWU8L3RpdGxlPgo8L2hlYWQ+Cjxib2R5Pgo8ZGl2IGlkPSJyb290Ij48L2Rpdj4KPHNjcmlwdCB0eXBlPSJtb2R1bGUiIHNyYz0iL3NyYy9tYWluLnRzeCI+PC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPgo=", import.meta.url).toString(), t = i ?? e, s = () => {
    W && !W.isDestroyed() && !W.isVisible() && W.show();
  };
  W.once("ready-to-show", s), W.webContents.on("did-finish-load", s), await W.loadURL(t);
}
Se.on("window-all-closed", () => {
  process.platform !== "darwin" && Se.quit();
});
Se.on("activate", () => {
  Qr.getAllWindows().length === 0 && qn();
});
Se.whenReady().then(async () => {
  await Ro(), await qn();
}).catch((i) => {
  console.error("[main] failed to create window", i);
});
Oe.handle("plugin:list", async () => {
  const i = fe(), e = it.map((r) => r.id), t = await i.select().from(I).where(Rr(I.pluginId, e)), s = new Map(t.map((r) => [r.pluginId, r.enabled === 1]));
  return it.map((r) => ({ ...r, enabled: s.get(r.id) ?? !0 }));
});
Oe.handle("plugin:setEnabled", async (i, e, t) => {
  const s = fe(), r = t ? 1 : 0, o = await s.select().from(I).where(de(I.pluginId, e)), l = o.length && o[0].settings ? o[0].settings : "{}";
  return await s.insert(I).values({ pluginId: e, enabled: r, settings: l }).onConflictDoUpdate({ target: I.pluginId, set: { enabled: r } }), !0;
});
Oe.handle("settings:get", async (i, e) => {
  const s = await fe().select().from(I).where(de(I.pluginId, e));
  if (!s.length) return { enabled: !0 };
  const r = s[0];
  let o = {};
  if (r.settings)
    try {
      o = JSON.parse(r.settings);
    } catch (l) {
      console.warn("[main] failed to parse settings JSON", l);
    }
  return { ...o, enabled: r.enabled === 1 };
});
Oe.handle("settings:set", async (i, e, t) => {
  const s = fe(), r = await s.select().from(I).where(de(I.pluginId, e)), o = r.length ? r[0] : null, { enabled: l, ...a } = t ?? {}, c = typeof l == "boolean" ? l ? 1 : 0 : (o == null ? void 0 : o.enabled) ?? 1, m = JSON.stringify(a ?? {});
  return await s.insert(I).values({ pluginId: e, enabled: c, settings: m }).onConflictDoUpdate({ target: I.pluginId, set: { enabled: c, settings: m } }), !0;
});
