var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@profoundlogic/hogan/lib/compiler.js
var require_compiler = __commonJS({
  "node_modules/@profoundlogic/hogan/lib/compiler.js"(exports) {
    (function(Hogan4) {
      var rIsWhitespace = /\S/, rQuot = /\"/g, rNewline = /\n/g, rCr = /\r/g, rSlash = /\\/g, rLineSep = /\u2028/, rParagraphSep = /\u2029/;
      Hogan4.tags = {
        "#": 1,
        "^": 2,
        "<": 3,
        "$": 4,
        "/": 5,
        "!": 6,
        ">": 7,
        "=": 8,
        "_v": 9,
        "{": 10,
        "&": 11,
        "_t": 12
      };
      Hogan4.scan = function scan(text2, delimiters) {
        var len = text2.length, IN_TEXT = 0, IN_TAG_TYPE = 1, IN_TAG = 2, state2 = IN_TEXT, tagType = null, tag2 = null, buf = "", tokens = [], seenTag = false, i = 0, lineStart = 0, otag = "{{", ctag = "}}";
        function addBuf() {
          if (buf.length > 0) {
            tokens.push({ tag: "_t", text: new String(buf) });
            buf = "";
          }
        }
        function lineIsWhitespace() {
          var isAllWhitespace = true;
          for (var j = lineStart; j < tokens.length; j++) {
            isAllWhitespace = Hogan4.tags[tokens[j].tag] < Hogan4.tags["_v"] || tokens[j].tag == "_t" && tokens[j].text.match(rIsWhitespace) === null;
            if (!isAllWhitespace) {
              return false;
            }
          }
          return isAllWhitespace;
        }
        function filterLine(haveSeenTag, noNewLine) {
          addBuf();
          if (haveSeenTag && lineIsWhitespace()) {
            for (var j = lineStart, next; j < tokens.length; j++) {
              if (tokens[j].text) {
                if ((next = tokens[j + 1]) && next.tag == ">") {
                  next.indent = tokens[j].text.toString();
                }
                tokens.splice(j, 1);
              }
            }
          } else if (!noNewLine) {
            tokens.push({ tag: "\n" });
          }
          seenTag = false;
          lineStart = tokens.length;
        }
        function changeDelimiters(text3, index) {
          var close = "=" + ctag, closeIndex = text3.indexOf(close, index), delimiters2 = trim(
            text3.substring(text3.indexOf("=", index) + 1, closeIndex)
          ).split(" ");
          otag = delimiters2[0];
          ctag = delimiters2[delimiters2.length - 1];
          return closeIndex + close.length - 1;
        }
        if (delimiters) {
          delimiters = delimiters.split(" ");
          otag = delimiters[0];
          ctag = delimiters[1];
        }
        for (i = 0; i < len; i++) {
          if (state2 == IN_TEXT) {
            if (tagChange(otag, text2, i)) {
              --i;
              addBuf();
              state2 = IN_TAG_TYPE;
            } else {
              if (text2.charAt(i) == "\n") {
                filterLine(seenTag);
              } else {
                buf += text2.charAt(i);
              }
            }
          } else if (state2 == IN_TAG_TYPE) {
            i += otag.length - 1;
            tag2 = Hogan4.tags[text2.charAt(i + 1)];
            tagType = tag2 ? text2.charAt(i + 1) : "_v";
            if (tagType == "=") {
              i = changeDelimiters(text2, i);
              state2 = IN_TEXT;
            } else {
              if (tag2) {
                i++;
              }
              state2 = IN_TAG;
            }
            seenTag = i;
          } else {
            if (tagChange(ctag, text2, i)) {
              tokens.push({
                tag: tagType,
                n: trim(buf),
                otag,
                ctag,
                i: tagType == "/" ? seenTag - otag.length : i + ctag.length
              });
              buf = "";
              i += ctag.length - 1;
              state2 = IN_TEXT;
              if (tagType == "{") {
                if (ctag == "}}") {
                  i++;
                } else {
                  cleanTripleStache(tokens[tokens.length - 1]);
                }
              }
            } else {
              buf += text2.charAt(i);
            }
          }
        }
        filterLine(seenTag, true);
        return tokens;
      };
      function cleanTripleStache(token3) {
        if (token3.n.substr(token3.n.length - 1) === "}") {
          token3.n = token3.n.substring(0, token3.n.length - 1);
        }
      }
      function trim(s) {
        if (s.trim) {
          return s.trim();
        }
        return s.replace(/^\s*|\s*$/g, "");
      }
      function tagChange(tag2, text2, index) {
        if (text2.charAt(index) != tag2.charAt(0)) {
          return false;
        }
        for (var i = 1, l = tag2.length; i < l; i++) {
          if (text2.charAt(index + i) != tag2.charAt(i)) {
            return false;
          }
        }
        return true;
      }
      var allowedInSuper = { "_t": true, "\n": true, "$": true, "/": true };
      function buildTree(tokens, kind, stack, customTags) {
        var instructions = [], opener = null, tail = null, token3 = null;
        tail = stack[stack.length - 1];
        while (tokens.length > 0) {
          token3 = tokens.shift();
          if (tail && tail.tag == "<" && !(token3.tag in allowedInSuper)) {
            throw new Error("Illegal content in < super tag.");
          }
          if (Hogan4.tags[token3.tag] <= Hogan4.tags["$"] || isOpener(token3, customTags)) {
            stack.push(token3);
            token3.nodes = buildTree(tokens, token3.tag, stack, customTags);
          } else if (token3.tag == "/") {
            if (stack.length === 0) {
              throw new Error("Closing tag without opener: /" + token3.n);
            }
            opener = stack.pop();
            if (token3.n != opener.n && !isCloser(token3.n, opener.n, customTags)) {
              throw new Error("Nesting error: " + opener.n + " vs. " + token3.n);
            }
            opener.end = token3.i;
            return instructions;
          } else if (token3.tag == "\n") {
            token3.last = tokens.length == 0 || tokens[0].tag == "\n";
          }
          instructions.push(token3);
        }
        if (stack.length > 0) {
          throw new Error("missing closing tag: " + stack.pop().n);
        }
        return instructions;
      }
      function isOpener(token3, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].o == token3.n) {
            token3.tag = "#";
            return true;
          }
        }
      }
      function isCloser(close, open, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].c == close && tags[i].o == open) {
            return true;
          }
        }
      }
      function stringifySubstitutions(obj) {
        var items = [];
        for (var key2 in obj) {
          items.push('"' + esc(key2) + '": function(c,p,t,i) {' + obj[key2] + "}");
        }
        return "{ " + items.join(",") + " }";
      }
      function stringifyPartials(codeObj) {
        var partials = [];
        for (var key2 in codeObj.partials) {
          partials.push('"' + esc(key2) + '":{name:"' + esc(codeObj.partials[key2].name) + '", ' + stringifyPartials(codeObj.partials[key2]) + "}");
        }
        return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
      }
      Hogan4.stringify = function(codeObj, text2, options) {
        return "{code: function (c,p,i) { " + Hogan4.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) + "}";
      };
      var serialNo = 0;
      Hogan4.generate = function(tree, text2, options) {
        serialNo = 0;
        var context = { code: "", subs: {}, partials: {} };
        Hogan4.walk(tree, context);
        if (options.asString) {
          return this.stringify(context, text2, options);
        }
        return this.makeTemplate(context, text2, options);
      };
      Hogan4.wrapMain = function(code3) {
        return 'var t=this;t.b(i=i||"");' + code3 + "return t.fl();";
      };
      Hogan4.template = Hogan4.Template;
      Hogan4.makeTemplate = function(codeObj, text2, options) {
        var template = this.makePartials(codeObj);
        template.code = new Function("c", "p", "i", this.wrapMain(codeObj.code));
        return new this.template(template, text2, this, options);
      };
      Hogan4.makePartials = function(codeObj) {
        var key2, template = { subs: {}, partials: codeObj.partials, name: codeObj.name };
        for (key2 in template.partials) {
          template.partials[key2] = this.makePartials(template.partials[key2]);
        }
        for (key2 in codeObj.subs) {
          template.subs[key2] = new Function("c", "p", "t", "i", codeObj.subs[key2]);
        }
        return template;
      };
      function esc(s) {
        return s.replace(rSlash, "\\\\").replace(rQuot, '\\"').replace(rNewline, "\\n").replace(rCr, "\\r").replace(rLineSep, "\\u2028").replace(rParagraphSep, "\\u2029");
      }
      function chooseMethod(s) {
        return ~s.indexOf(".") ? "d" : "f";
      }
      function createPartial(node, context) {
        var prefix = "<" + (context.prefix || "");
        var sym = prefix + node.n + serialNo++;
        context.partials[sym] = { name: node.n, partials: {} };
        context.code += 't.b(t.rp("' + esc(sym) + '",c,p,"' + (node.indent || "") + '"));';
        return sym;
      }
      Hogan4.codegen = {
        "#": function(node, context) {
          context.code += "if(t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,0,' + node.i + "," + node.end + ',"' + node.otag + " " + node.ctag + '")){t.rs(c,p,function(c,p,t){';
          Hogan4.walk(node.nodes, context);
          context.code += "});c.pop();}";
        },
        "^": function(node, context) {
          context.code += "if(!t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
          Hogan4.walk(node.nodes, context);
          context.code += "};";
        },
        ">": createPartial,
        "<": function(node, context) {
          var ctx = { partials: {}, code: "", subs: {}, inPartial: true };
          Hogan4.walk(node.nodes, ctx);
          var template = context.partials[createPartial(node, context)];
          template.subs = ctx.subs;
          template.partials = ctx.partials;
        },
        "$": function(node, context) {
          var ctx = { subs: {}, code: "", partials: context.partials, prefix: node.n };
          Hogan4.walk(node.nodes, ctx);
          context.subs[node.n] = ctx.code;
          if (!context.inPartial) {
            context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
          }
        },
        "\n": function(node, context) {
          context.code += write('"\\n"' + (node.last ? "" : " + i"));
        },
        "_v": function(node, context) {
          context.code += "t.b(t.v(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
        },
        "_t": function(node, context) {
          context.code += write('"' + esc(node.text) + '"');
        },
        "{": tripleStache,
        "&": tripleStache
      };
      function tripleStache(node, context) {
        context.code += "t.b(t.t(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
      }
      function write(s) {
        return "t.b(" + s + ");";
      }
      Hogan4.walk = function(nodelist, context) {
        var func;
        for (var i = 0, l = nodelist.length; i < l; i++) {
          func = Hogan4.codegen[nodelist[i].tag];
          func && func(nodelist[i], context);
        }
        return context;
      };
      Hogan4.parse = function(tokens, text2, options) {
        options = options || {};
        return buildTree(tokens, "", [], options.sectionTags || []);
      };
      Hogan4.cache = {};
      Hogan4.cacheKey = function(text2, options) {
        return [text2, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join("||");
      };
      Hogan4.compile = function(text2, options) {
        options = options || {};
        var key2 = Hogan4.cacheKey(text2, options);
        var template = this.cache[key2];
        if (template) {
          var partials = template.partials;
          for (var name in partials) {
            delete partials[name].instance;
          }
          return template;
        }
        template = this.generate(this.parse(this.scan(text2, options.delimiters), text2, options), text2, options);
        return this.cache[key2] = template;
      };
    })(typeof exports !== "undefined" ? exports : Hogan);
  }
});

// node_modules/@profoundlogic/hogan/lib/template.js
var require_template = __commonJS({
  "node_modules/@profoundlogic/hogan/lib/template.js"(exports) {
    var Hogan4 = {};
    (function(Hogan5) {
      Hogan5.Template = function(codeObj, text2, compiler, options) {
        codeObj = codeObj || {};
        this.r = codeObj.code || this.r;
        this.c = compiler;
        this.options = options || {};
        this.text = text2 || "";
        this.partials = codeObj.partials || {};
        this.subs = codeObj.subs || {};
        this.buf = "";
      };
      Hogan5.Template.prototype = {
        // render: replaced by generated code.
        r: function(context, partials, indent) {
          return "";
        },
        // variable escaping
        v: hoganEscape,
        // triple stache
        t: coerceToString,
        render: function render2(context, partials, indent) {
          return this.ri([context], partials || {}, indent);
        },
        // render internal -- a hook for overrides that catches partials too
        ri: function(context, partials, indent) {
          return this.r(context, partials, indent);
        },
        // ensurePartial
        ep: function(symbol, partials) {
          var partial = this.partials[symbol];
          var template = partials[partial.name];
          if (partial.instance && partial.base == template) {
            return partial.instance;
          }
          if (typeof template == "string") {
            if (!this.c) {
              throw new Error("No compiler available.");
            }
            template = this.c.compile(template, this.options);
          }
          if (!template) {
            return null;
          }
          this.partials[symbol].base = template;
          if (partial.subs) {
            if (!partials.stackText) partials.stackText = {};
            for (key in partial.subs) {
              if (!partials.stackText[key]) {
                partials.stackText[key] = this.activeSub !== void 0 && partials.stackText[this.activeSub] ? partials.stackText[this.activeSub] : this.text;
              }
            }
            template = createSpecializedPartial(
              template,
              partial.subs,
              partial.partials,
              this.stackSubs,
              this.stackPartials,
              partials.stackText
            );
          }
          this.partials[symbol].instance = template;
          return template;
        },
        // tries to find a partial in the current scope and render it
        rp: function(symbol, context, partials, indent) {
          var partial = this.ep(symbol, partials);
          if (!partial) {
            return "";
          }
          return partial.ri(context, partials, indent);
        },
        // render a section
        rs: function(context, partials, section) {
          var tail = context[context.length - 1];
          if (!isArray(tail)) {
            section(context, partials, this);
            return;
          }
          for (var i = 0; i < tail.length; i++) {
            context.push(tail[i]);
            section(context, partials, this);
            context.pop();
          }
        },
        // maybe start a section
        s: function(val, ctx, partials, inverted, start, end, tags) {
          var pass;
          if (isArray(val) && val.length === 0) {
            return false;
          }
          if (typeof val == "function") {
            val = this.ms(val, ctx, partials, inverted, start, end, tags);
          }
          pass = !!val;
          if (!inverted && pass && ctx) {
            ctx.push(typeof val == "object" ? val : ctx[ctx.length - 1]);
          }
          return pass;
        },
        // find values with dotted names
        d: function(key2, ctx, partials, returnFound) {
          var found2, names = key2.split("."), val = this.f(names[0], ctx, partials, returnFound), doModelGet = this.options.modelGet, cx = null;
          if (key2 === "." && isArray(ctx[ctx.length - 2])) {
            val = ctx[ctx.length - 1];
          } else {
            for (var i = 1; i < names.length; i++) {
              found2 = findInScope(names[i], val, doModelGet);
              if (found2 !== void 0) {
                cx = val;
                val = found2;
              } else {
                val = "";
              }
            }
          }
          if (returnFound && !val) {
            return false;
          }
          if (!returnFound && typeof val == "function") {
            ctx.push(cx);
            val = this.mv(val, ctx, partials);
            ctx.pop();
          }
          return val;
        },
        // find values with normal names
        f: function(key2, ctx, partials, returnFound) {
          var val = false, v = null, found2 = false, doModelGet = this.options.modelGet;
          for (var i = ctx.length - 1; i >= 0; i--) {
            v = ctx[i];
            val = findInScope(key2, v, doModelGet);
            if (val !== void 0) {
              found2 = true;
              break;
            }
          }
          if (!found2) {
            return returnFound ? false : "";
          }
          if (!returnFound && typeof val == "function") {
            val = this.mv(val, ctx, partials);
          }
          return val;
        },
        // higher order templates
        ls: function(func, cx, ctx, partials, text2, tags) {
          var oldTags = this.options.delimiters;
          this.options.delimiters = tags;
          this.b(this.ct(coerceToString(func.call(cx, text2, ctx)), cx, partials));
          this.options.delimiters = oldTags;
          return false;
        },
        // compile text
        ct: function(text2, cx, partials) {
          if (this.options.disableLambda) {
            throw new Error("Lambda features disabled.");
          }
          return this.c.compile(text2, this.options).render(cx, partials);
        },
        // template result buffering
        b: function(s) {
          this.buf += s;
        },
        fl: function() {
          var r = this.buf;
          this.buf = "";
          return r;
        },
        // method replace section
        ms: function(func, ctx, partials, inverted, start, end, tags) {
          var textSource, cx = ctx[ctx.length - 1], result = func.call(cx);
          if (typeof result == "function") {
            if (inverted) {
              return true;
            } else {
              textSource = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text;
              return this.ls(result, cx, ctx, partials, textSource.substring(start, end), tags);
            }
          }
          return result;
        },
        // method replace variable
        mv: function(func, ctx, partials) {
          var cx = ctx[ctx.length - 1];
          var result = func.call(cx);
          if (typeof result == "function") {
            return this.ct(coerceToString(result.call(cx)), cx, partials);
          }
          return result;
        },
        sub: function(name, context, partials, indent) {
          var f = this.subs[name];
          if (f) {
            this.activeSub = name;
            f(context, partials, this, indent);
            this.activeSub = false;
          }
        }
      };
      function findInScope(key2, scope, doModelGet) {
        var val;
        if (scope && typeof scope == "object") {
          if (scope[key2] !== void 0) {
            val = scope[key2];
          } else if (doModelGet && scope.get && typeof scope.get == "function") {
            val = scope.get(key2);
          }
        }
        return val;
      }
      function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
        function PartialTemplate() {
        }
        ;
        PartialTemplate.prototype = instance;
        function Substitutions() {
        }
        ;
        Substitutions.prototype = instance.subs;
        var key2;
        var partial = new PartialTemplate();
        partial.subs = new Substitutions();
        partial.subsText = {};
        partial.buf = "";
        stackSubs = stackSubs || {};
        partial.stackSubs = stackSubs;
        partial.subsText = stackText;
        for (key2 in subs) {
          if (!stackSubs[key2]) stackSubs[key2] = subs[key2];
        }
        for (key2 in stackSubs) {
          partial.subs[key2] = stackSubs[key2];
        }
        stackPartials = stackPartials || {};
        partial.stackPartials = stackPartials;
        for (key2 in partials) {
          if (!stackPartials[key2]) stackPartials[key2] = partials[key2];
        }
        for (key2 in stackPartials) {
          partial.partials[key2] = stackPartials[key2];
        }
        return partial;
      }
      var rAmp = /&/g, rLt = /</g, rGt = />/g, rApos = /\'/g, rQuot = /\"/g, hChars = /[&<>\"\']/;
      function coerceToString(val) {
        return String(val === null || val === void 0 ? "" : val);
      }
      function hoganEscape(str) {
        str = coerceToString(str);
        return hChars.test(str) ? str.replace(rAmp, "&amp;").replace(rLt, "&lt;").replace(rGt, "&gt;").replace(rApos, "&#39;").replace(rQuot, "&quot;") : str;
      }
      var isArray = Array.isArray || function(a) {
        return Object.prototype.toString.call(a) === "[object Array]";
      };
    })(typeof exports !== "undefined" ? exports : Hogan4);
  }
});

// node_modules/@profoundlogic/hogan/lib/hogan.js
var require_hogan = __commonJS({
  "node_modules/@profoundlogic/hogan/lib/hogan.js"(exports, module) {
    var Hogan4 = require_compiler();
    Hogan4.Template = require_template().Template;
    Hogan4.template = Hogan4.Template;
    module.exports = Hogan4;
  }
});

// src/viewer.ts
var DEFAULT_VIEWER = { theme: "system", colourBlind: false };

// src/words.ts
var MAX_TEXT = 4e3;
function tooLong(fields) {
  const long = Object.values(fields).find((value) => typeof value === "string" && value.length > MAX_TEXT);
  return long === void 0 ? null : `That text is ${String(long.length)} characters long; the most it can be is ${String(MAX_TEXT)}.`;
}

// src/page/icons.ts
var round = { fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round" };
var line = (d, width = 1.7) => ["path", { d, ...round, "stroke-width": width }];
var ring = (extra = {}) => ["circle", { cx: 8, cy: 8, r: 6.2, fill: "none", stroke: "currentColor", "stroke-width": 1.6, ...extra }];
var ICONS = {
  /** The brand's walked W: the last stroke, still to go, is lighter. */
  mark: [
    ["path", { d: "M1.6 3.2L4.6 12.8L8 5.6L11.4 12.8", ...round, "stroke-width": 2.3 }],
    ["path", { d: "M11.4 12.8L14.4 3.2", ...round, "stroke-width": 2.3, opacity: 0.4 }]
  ],
  sidebar: [
    ["rect", { x: 1.5, y: 2.5, width: 13, height: 11, rx: 2, fill: "none", stroke: "currentColor", "stroke-width": 1.4 }],
    ["rect", { x: 2.6, y: 3.6, width: 3.4, height: 8.8, rx: 0.8, fill: "currentColor" }]
  ],
  /** The one spinner: the dashed ring with its turning arc, while the AI works. */
  spinner: [
    ring({ "stroke-opacity": 0.45, "stroke-dasharray": "2.4 2.2" }),
    line("M8 1.8a6.2 6.2 0 0 1 6.2 6.2", 1.9)
  ],
  more: [3.5, 8, 12.5].map((cx) => ["circle", { cx, cy: 8, r: 1.4, fill: "currentColor" }]),
  message: [line("M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z", 1.5)],
  own: [
    ["circle", { cx: 8, cy: 5.6, r: 2.6, fill: "none", stroke: "currentColor", "stroke-width": 1.5 }],
    line("M3 13.5c.8-2.4 2.7-3.6 5-3.6s4.2 1.2 5 3.6", 1.5)
  ],
  summary: [line("M3 3.5h10M3 8h10M3 12.5h6", 1.6)],
  /** A file not viewed yet; `met` doubles as a viewed one. */
  ring: [ring()],
  met: [ring(), line("M5 8.2l2 2 4-4.3")],
  "not-met": [ring(), line("M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8")],
  partly: [ring(), line("M5 8h6")],
  unchecked: [ring({ "stroke-dasharray": "2.4 2.2" })],
  /** A checkbox; its menu item's aria-checked fills it. */
  checkbox: [
    ["rect", { x: 2.5, y: 2.5, width: 11, height: 11, rx: 2.5, fill: "none", stroke: "currentColor", "stroke-width": 1.4 }],
    line("M5 8.2l2 2 4-4.3")
  ],
  eye: [
    ["path", { d: "M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z", ...round, "stroke-width": 1.4 }],
    ["circle", { cx: 8, cy: 8, r: 2, fill: "currentColor" }]
  ],
  ask: [
    ring({ "stroke-width": 1.5 }),
    line("M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3", 1.5),
    ["circle", { cx: 8, cy: 11.4, r: 0.9, fill: "currentColor" }]
  ],
  edit: [line("M10.5 2.8l2.7 2.7-7.4 7.4-3.2.5.5-3.2z", 1.4)],
  trash: [line("M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5", 1.4)],
  "chevron-right": [line("M6 4l4 4-4 4")],
  "chevron-down": [line("M4 6l4 4 4-4")],
  branch: [
    ["circle", { cx: 4.5, cy: 3.8, r: 1.7, fill: "none", stroke: "currentColor", "stroke-width": 1.4 }],
    ["circle", { cx: 4.5, cy: 12.2, r: 1.7, fill: "none", stroke: "currentColor", "stroke-width": 1.4 }],
    ["circle", { cx: 11.5, cy: 5.5, r: 1.7, fill: "none", stroke: "currentColor", "stroke-width": 1.4 }],
    line("M4.5 5.5v5M11.5 7.2c0 2.4-2 3.4-5.4 3.8", 1.4)
  ],
  previous: [line("M10 3.5L5.5 8l4.5 4.5")],
  next: [line("M6 3.5L10.5 8 6 12.5")],
  up: [line("M4 10l4-4 4 4")],
  warn: [
    ["path", { d: "M8 2l6.5 11.5h-13z", ...round, "stroke-width": 1.5 }],
    line("M8 6.5v3.2", 1.6),
    ["circle", { cx: 8, cy: 11.6, r: 0.9, fill: "currentColor" }]
  ],
  offline: [line("M2 6a9 9 0 0 1 12 0M4.3 8.5a5.6 5.6 0 0 1 7.4 0M6.6 11a2.2 2.2 0 0 1 2.8 0M2.5 2.5l11 11", 1.5)],
  file: [["path", { d: "M4 1.8h5l3 3v9.4H4z M9 1.8v3h3", ...round, "stroke-width": 1.5 }]],
  info: [ring(), line("M8 7.3v3.9"), ["circle", { cx: 8, cy: 4.9, r: 0.95, fill: "currentColor" }]],
  copy: [
    ["rect", { x: 5.5, y: 5.5, width: 8, height: 8, rx: 1.6, fill: "none", stroke: "currentColor", "stroke-width": 1.5 }],
    line("M10.5 3.5v-.4A1.1 1.1 0 0 0 9.4 2H3.1A1.1 1.1 0 0 0 2 3.1v6.3a1.1 1.1 0 0 0 1.1 1.1h.4", 1.5)
  ],
  external: [line("M9 3h4v4M13 3L7.5 8.5M11.5 9.5v2.4a1.1 1.1 0 0 1-1.1 1.1H4.1A1.1 1.1 0 0 1 3 11.9V5.6a1.1 1.1 0 0 1 1.1-1.1h2.4", 1.5)]
};
var SVG = "http://www.w3.org/2000/svg";
function icon(name, label) {
  const svg = document.createElementNS(SVG, "svg");
  for (const [key2, value] of Object.entries({ viewBox: "0 0 16 16", width: 16, height: 16, focusable: "false" }))
    svg.setAttribute(key2, String(value));
  svg.classList.add("icon", `icon-${name}`);
  if (label) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", label);
  } else svg.setAttribute("aria-hidden", "true");
  for (const [tag2, attributes] of ICONS[name]) {
    const shape = document.createElementNS(SVG, tag2);
    for (const [key2, value] of Object.entries(attributes)) shape.setAttribute(key2, String(value));
    svg.append(shape);
  }
  return svg;
}

// src/page/dom.ts
function el(tag2, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag2), props);
  node.append(...children);
  return node;
}
function region(id) {
  const found2 = document.getElementById(id);
  if (!found2) throw new Error(`the page has no #${id}`);
  return found2;
}
function attrs(node, given) {
  for (const [name, value] of Object.entries(given)) node.setAttribute(name, value);
  return node;
}
function menuKeys(menu2, close) {
  menu2.onkeydown = (event) => {
    const items = [...menu2.querySelectorAll(".menu-item")];
    const at = document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1;
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (step) {
      event.preventDefault();
      items[(at + step + items.length) % items.length]?.focus();
    } else if (event.key === "Escape" || event.key === "Tab") {
      event.preventDefault();
      close();
    }
  };
}
var token = location.pathname.split("/")[2] ?? "";
function showAlert(message) {
  const box2 = region("alert");
  box2.replaceChildren(...message === null ? [] : [icon("warn"), el("span", {}, message)]);
  box2.hidden = message === null;
  document.body.classList.remove("unreachable");
}
function showUnreachable({ name, reopen }) {
  if (document.body.classList.contains("unreachable")) return;
  const box2 = region("alert");
  box2.replaceChildren(
    icon("offline"),
    el("span", { className: "banner-text" }, el("strong", {}, `Could not reach the ${name}.`), ` ${reopen}`)
  );
  box2.hidden = false;
  document.body.classList.add("unreachable");
}
var reads = new AbortController();
var readSignal = reads.signal;
var stopReading = () => {
  reads.abort();
};
var send = (route, body, signal) => fetch(`/${route}?token=${token}`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
  ...signal && { signal }
});
var postQuietly = (route, body, signal) => send(route, body, signal).catch(() => null);
async function post(page, route, body) {
  const problem = tooLong(body);
  if (problem) {
    showAlert(problem);
    return null;
  }
  try {
    const answer = await send(route, body);
    if (answer.ok) {
      showAlert(null);
      return answer;
    }
    const said = await answer.json().catch(() => ({}));
    showAlert(typeof said.error === "string" ? said.error : `The ${page.name} could not do that (${String(answer.status)}).`);
    return null;
  } catch {
    if ("lost" in page) page.lost();
    else showUnreachable(page);
    return null;
  }
}

// src/page/appearance.ts
function showViewer({ theme, colourBlind }) {
  const root2 = document.documentElement;
  root2.dataset["theme"] = theme;
  root2.toggleAttribute("data-colour-blind", colourBlind);
}
async function loadViewer() {
  try {
    const answer = await fetch("data/viewer.json");
    if (answer.ok) {
      const viewer2 = await answer.json();
      showViewer(viewer2);
      return viewer2;
    }
  } catch {
  }
  return { ...DEFAULT_VIEWER };
}
function chooseViewer(viewer2, change) {
  const chosen = { ...viewer2, ...change };
  showViewer(chosen);
  void postQuietly("viewer", change);
  return chosen;
}

// src/page/desk.ts
var SCENE = `<svg class="desk6" viewBox="0 -20 344 192" width="344" height="192" role="img" aria-label="The AI at its desk, reading the change"><defs><clipPath id="scr6"><rect x="32" y="30" width="152" height="92" rx="3"/></clipPath></defs><path class="stand" d="M100 130h16l4 16h-24z"/><line class="dk" x1="84" y1="148" x2="132" y2="148"/><rect class="mon" x="24" y="22" width="168" height="108" rx="9"/><g clip-path="url(#scr6)"><g class="cd"><rect class="bh" x="33" y="133.5" width="150" height="10.5" rx="2"/><rect class="sn" x="36" y="38" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="37.75" width="70" height="3.5" rx="1.75"/><rect class="sn" x="36" y="47" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="46.75" width="92" height="3.5" rx="1.75"/><rect class="sn" x="36" y="56" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="55.75" width="64" height="3.5" rx="1.75"/><rect class="sn" x="36" y="65" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="74" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="73.75" width="84" height="3.5" rx="1.75"/><rect class="sn" x="36" y="83" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="82.75" width="58" height="3.5" rx="1.75"/><rect class="sn" x="36" y="92" width="8" height="3" rx="1.5"/><rect class="sl" x="70" y="91.75" width="76" height="3.5" rx="1.75"/><rect class="sn" x="36" y="101" width="8" height="3" rx="1.5"/><rect class="sl" x="70" y="100.75" width="40" height="3.5" rx="1.75"/><rect class="sn" x="36" y="110" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="109.75" width="22" height="3.5" rx="1.75"/><rect class="sn" x="36" y="119" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="128" width="8" height="3" rx="1.5"/><rect class="sl sd" x="61" y="127.75" width="88" height="3.5" rx="1.75"/><rect class="sn" x="36" y="137" width="8" height="3" rx="1.5"/><rect class="sl sd" x="61" y="136.75" width="96" height="3.5" rx="1.75"/><rect class="sn" x="36" y="146" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="145.75" width="60" height="3.5" rx="1.75"/><rect class="sn" x="36" y="155" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="154.75" width="18" height="3.5" rx="1.75"/><rect class="sn" x="36" y="164" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="173" width="8" height="3" rx="1.5"/><rect class="sl sa" x="52" y="172.75" width="74" height="3.5" rx="1.75"/><rect class="sn" x="36" y="182" width="8" height="3" rx="1.5"/><rect class="sl sa" x="61" y="181.75" width="90" height="3.5" rx="1.75"/><rect class="sn" x="36" y="191" width="8" height="3" rx="1.5"/><rect class="sl sa" x="61" y="190.75" width="66" height="3.5" rx="1.75"/><rect class="sn" x="36" y="200" width="8" height="3" rx="1.5"/><rect class="sl sa" x="61" y="199.75" width="82" height="3.5" rx="1.75"/><rect class="sn" x="36" y="209" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="208.75" width="20" height="3.5" rx="1.75"/><rect class="sn" x="36" y="218" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="227" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="226.75" width="62" height="3.5" rx="1.75"/><rect class="sn" x="36" y="236" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="235.75" width="86" height="3.5" rx="1.75"/><rect class="sn" x="36" y="245" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="244.75" width="54" height="3.5" rx="1.75"/><rect class="sn" x="36" y="254" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="253.75" width="16" height="3.5" rx="1.75"/><rect class="sn" x="36" y="263" width="8" height="3" rx="1.5"/><rect class="sn" x="36" y="272" width="8" height="3" rx="1.5"/><rect class="sl" x="52" y="271.75" width="72" height="3.5" rx="1.75"/><rect class="sn" x="36" y="281" width="8" height="3" rx="1.5"/><rect class="sl" x="61" y="280.75" width="48" height="3.5" rx="1.75"/><g class="cb"><rect class="cbr" x="160" y="132" width="20" height="13" rx="3.5"/><text class="cbt" x="170" y="141.4" text-anchor="middle">AI</text></g><g class="ck"><circle class="ckc" cx="172" cy="184" r="7"/><path class="ckp" d="M168.6 184.2l2.3 2.3 4-4.3"/></g></g></g><rect class="rb" x="214" y="98" width="64" height="70" rx="18"/><g class="rh"><line class="ant" x1="246" y1="40" x2="246" y2="29"/><circle class="ink" cx="246" cy="27" r="3.6"/><rect class="ink" x="210" y="40" width="72" height="60" rx="17"/><g class="re"><rect class="eye" x="220" y="58" width="9" height="13" rx="4.5"/><rect class="eye" x="241" y="58" width="9" height="13" rx="4.5"/></g><g class="rhap"><path class="hap" d="M220 68q4.5-8 9 0"/><path class="hap" d="M241 68q4.5-8 9 0"/></g><ellipse class="rmo" cx="236" cy="86" rx="5" ry="4"/><path class="rsm" d="M229 84q6 6 13 0"/></g><rect class="kb" x="146" y="141" width="62" height="7" rx="2.5"/><line class="dk" x1="8" y1="148" x2="312" y2="148"/><rect class="under" x="0" y="149" width="320" height="23"/><rect class="ink m1" x="158" y="131" width="17" height="13" rx="6.5"/><rect class="ink m2" x="182" y="131" width="17" height="13" rx="6.5"/><g class="bub b1"><path class="bb" d="M258 -18h74a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-66l-7 7v-7h-1a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z"/><text class="bt6" x="295.0" y="-2" text-anchor="middle">Wait, what?!</text></g><g class="bub b2"><path class="bb" d="M258 -18h40a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-32l-7 7v-7h-1a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z"/><text class="bt6" x="278.0" y="-2" text-anchor="middle">Hmm\u2026</text></g><g class="bub b3"><path class="bb" d="M258 -18h36a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-28l-7 7v-7h-1a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z"/><text class="bt6" x="276.0" y="-2" text-anchor="middle">Nice.</text></g></svg>`;
var DESK = `<path class="stand" d="M100 130h16l4 16h-24z"/><line class="dk" x1="84" y1="148" x2="132" y2="148"/><rect class="mon" x="24" y="22" width="168" height="108" rx="9"/><rect class="off" x="32" y="30" width="152" height="92" rx="3"/><rect class="rb" x="214" y="98" width="64" height="70" rx="18"/>`;
var HEAD = `<line class="ant" x1="246" y1="40" x2="246" y2="29"/><circle class="ink" cx="246" cy="27" r="3.6"/><rect class="ink" x="210" y="40" width="72" height="60" rx="17"/>`;
var FRONT = `<rect class="kb" x="146" y="141" width="62" height="7" rx="2.5"/><line class="dk" x1="8" y1="148" x2="312" y2="148"/><rect class="under" x="0" y="149" width="344" height="23"/><rect class="ink" x="170" y="131" width="17" height="13" rx="6.5"/>`;
var FACES = {
  happy: `<path class="hap" d="M220 66q4.5-8 9 0"/><path class="hap" d="M241 66q4.5-8 9 0"/><path class="smile" d="M229 82q6 6 13 0"/>`,
  plain: `<rect class="eye" x="222" y="58" width="9" height="13" rx="4.5"/><rect class="eye" x="243" y="58" width="9" height="13" rx="4.5"/><path class="smile" d="M231 84q5 3.5 10 0"/>`
};
var robot = (inner) => `<svg class="desk6 bye6" viewBox="0 -20 344 192" width="344" height="192" aria-hidden="true">${DESK}${inner}</svg>`;
var waving = (face) => robot(`<g>${HEAD}<g>${FACES[face]}</g></g>${FRONT}<g class="wave"><rect class="ink" x="292" y="56" width="17" height="21" rx="8"/></g>`);
var ASLEEP = robot(
  `<g class="nod">${HEAD}<g><path class="hap" d="M220 66h9"/><path class="hap" d="M241 66h9"/></g><g class="zz"><text class="z1" x="284" y="34">z</text><text class="z2" x="296" y="20">z</text></g></g>${FRONT}<rect class="ink" x="196" y="131" width="17" height="13" rx="6.5"/>`
);
var byeScene = (mood) => scene(mood === "asleep" ? ASLEEP : waving(mood));
var deskScene = () => scene(SCENE);
function scene(markup) {
  const box2 = document.createElement("div");
  box2.className = "desk-scene";
  box2.innerHTML = markup;
  let offscreen = false;
  const pause = () => box2.classList.toggle("rdpause", document.hidden || offscreen);
  const seen = new IntersectionObserver(([entry]) => {
    offscreen = !entry?.isIntersecting;
    pause();
  });
  seen.observe(box2);
  document.addEventListener("visibilitychange", pause);
  pause();
  return {
    box: box2,
    stop: () => {
      seen.disconnect();
      document.removeEventListener("visibilitychange", pause);
      box2.remove();
    }
  };
}

// src/colours.ts
var PLAIN = "plain";
var KINDS = /* @__PURE__ */ new Set(["c", "k", "n", "e", "t", "s", "r", "v", "x"]);
var joinLines = (lines2) => lines2.flatMap((line2, at) => at ? [[1, ""], ...line2] : line2);
function colourHtml(html2, runs) {
  let out = "";
  let at = 0;
  let run = -1;
  let end = 0;
  let open = "";
  const close = () => {
    if (open) out += "</span>";
    open = "";
  };
  for (const part of html2.match(/<[^>]*>|&[^;\s]+;|[\s\S]/g) ?? []) {
    if (part.startsWith("<") && part.length > 1) {
      close();
      out += part;
      continue;
    }
    while (at >= end && run < runs.length) end += runs[++run]?.[0] ?? 0;
    const kind = runs[run]?.[1] ?? "";
    if (kind !== open) {
      close();
      if (KINDS.has(kind)) {
        out += `<span class="sx-${kind}">`;
        open = kind;
      }
    }
    out += part;
    at++;
  }
  close();
  return at === runs.reduce((sum, [length]) => sum + length, 0) ? out : null;
}

// src/page/highlight.ts
function paint(element, runs) {
  if ("coloured" in element.dataset) return;
  const coloured = runs && colourHtml(element.innerHTML, runs);
  if (!runs || !coloured) return;
  element.dataset["coloured"] = "";
  element.innerHTML = coloured;
}
var lines = async (answer) => {
  const response = await answer;
  const body = response?.ok ? await response.json() : PLAIN;
  return body === PLAIN ? null : body;
};
var asked = /* @__PURE__ */ new Map();
var once = (key2, ask) => {
  let found2 = asked.get(key2);
  if (!found2) {
    found2 = ask().catch(() => null);
    asked.set(key2, found2);
  }
  return found2;
};
var code = (body) => once(JSON.stringify(body), () => lines(postQuietly("code", body, readSignal)));
var fileAt = (rev, file) => once(`${rev}:${file}`, () => lines(fetch(`tokens?rev=${encodeURIComponent(rev)}&path=${encodeURIComponent(file)}`, { signal: readSignal }).catch(() => null)));
async function colourDiff(table2, file, revs) {
  const [before, after] = await Promise.all([
    revs.base && !file.isNew ? fileAt(revs.base, file.oldName) : null,
    file.isDeleted ? null : fileAt(revs.head, file.newName)
  ]);
  if (!before && !after) return;
  for (const row of table2.querySelectorAll("tr")) {
    const removed = !!row.querySelector("td.d2h-del");
    const line2 = Number(row.querySelector(removed ? ".line-num1" : ".line-num2")?.textContent.trim());
    const cell = row.querySelector(".d2h-code-line-ctn");
    if (line2 && cell) paint(cell, (removed ? before : after)?.[line2 - 1]);
  }
}
function colourCode(box2) {
  for (const block2 of box2.querySelectorAll('pre > code[class*="language-"]')) {
    const language = /(?:^|\s)language-(\S+)/.exec(block2.className)?.[1];
    if (language)
      void code({ language, code: block2.textContent }).then((tokens) => {
        if (tokens) paint(block2, joinLines(tokens));
      });
  }
}
function colourLines(cells, file, skip = 0) {
  const open = cells.filter((cell) => !("coloured" in cell.dataset));
  if (!open.length) return;
  void code({ file, code: open.map((cell) => cell.textContent.slice(skip)).join("\n") }).then((tokens) => {
    open.forEach((cell, at) => {
      const runs = tokens?.[at];
      paint(cell, runs && [[skip, ""], ...runs]);
    });
  });
}
function colourSuggestions(box2, file, head) {
  for (const table2 of box2.querySelectorAll("table.suggestion-code")) {
    const cells = (kind) => [...table2.querySelectorAll(`tr.suggestion-${kind}`)].flatMap((row) => {
      const cell = row.querySelector("td.suggestion-line");
      return cell && !("coloured" in cell.dataset) ? [{ row, cell }] : [];
    });
    const removed = cells("del");
    if (removed.length)
      void fileAt(head, file).then((tokens) => {
        for (const { row, cell } of removed) {
          const runs = tokens?.[Number(row.querySelector("td.suggestion-number")?.textContent) - 1];
          paint(cell, runs && [[1, ""], ...runs]);
        }
      });
    colourLines(cells("add").map(({ cell }) => cell), file, 1);
  }
}

// node_modules/mdurl/index.mjs
var mdurl_exports = {};
__export(mdurl_exports, {
  decode: () => decode_default,
  encode: () => encode_default,
  format: () => format,
  parse: () => parse_default
});

// node_modules/mdurl/lib/decode.mjs
var decodeCache = {};
function getDecodeCache(exclude) {
  let cache = decodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = decodeCache[exclude] = [];
  for (let i = 0; i < 128; i++) {
    const ch = String.fromCharCode(i);
    cache.push(ch);
  }
  for (let i = 0; i < exclude.length; i++) {
    const ch = exclude.charCodeAt(i);
    cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
  }
  return cache;
}
function decode(string, exclude) {
  if (typeof exclude !== "string") {
    exclude = decode.defaultChars;
  }
  const cache = getDecodeCache(exclude);
  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
    let result = "";
    for (let i = 0, l = seq.length; i < l; i += 3) {
      const b1 = parseInt(seq.slice(i + 1, i + 3), 16);
      if (b1 < 128) {
        result += cache[b1];
        continue;
      }
      if ((b1 & 224) === 192 && i + 3 < l) {
        const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        if ((b2 & 192) === 128) {
          const chr = b1 << 6 & 1984 | b2 & 63;
          if (chr < 128) {
            result += "\uFFFD\uFFFD";
          } else {
            result += String.fromCharCode(chr);
          }
          i += 3;
          continue;
        }
      }
      if ((b1 & 240) === 224 && i + 6 < l) {
        const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
        if ((b2 & 192) === 128 && (b3 & 192) === 128) {
          const chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
          if (chr < 2048 || chr >= 55296 && chr <= 57343) {
            result += "\uFFFD\uFFFD\uFFFD";
          } else {
            result += String.fromCharCode(chr);
          }
          i += 6;
          continue;
        }
      }
      if ((b1 & 248) === 240 && i + 9 < l) {
        const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
        const b4 = parseInt(seq.slice(i + 10, i + 12), 16);
        if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
          let chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
          if (chr < 65536 || chr > 1114111) {
            result += "\uFFFD\uFFFD\uFFFD\uFFFD";
          } else {
            chr -= 65536;
            result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
          }
          i += 9;
          continue;
        }
      }
      result += "\uFFFD";
    }
    return result;
  });
}
decode.defaultChars = ";/?:@&=+$,#";
decode.componentChars = "";
var decode_default = decode;

// node_modules/mdurl/lib/encode.mjs
var encodeCache = {};
function getEncodeCache(exclude) {
  let cache = encodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = encodeCache[exclude] = [];
  for (let i = 0; i < 128; i++) {
    const ch = String.fromCharCode(i);
    if (/^[0-9a-z]$/i.test(ch)) {
      cache.push(ch);
    } else {
      cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
    }
  }
  for (let i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }
  return cache;
}
function encode(string, exclude, keepEscaped) {
  if (typeof exclude !== "string") {
    keepEscaped = exclude;
    exclude = encode.defaultChars;
  }
  if (typeof keepEscaped === "undefined") {
    keepEscaped = true;
  }
  const cache = getEncodeCache(exclude);
  let result = "";
  for (let i = 0, l = string.length; i < l; i++) {
    const code3 = string.charCodeAt(i);
    if (keepEscaped && code3 === 37 && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }
    if (code3 < 128) {
      result += cache[code3];
      continue;
    }
    if (code3 >= 55296 && code3 <= 57343) {
      if (code3 >= 55296 && code3 <= 56319 && i + 1 < l) {
        const nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 56320 && nextCode <= 57343) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += "%EF%BF%BD";
      continue;
    }
    result += encodeURIComponent(string[i]);
  }
  return result;
}
encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
encode.componentChars = "-_.!~*'()";
var encode_default = encode;

// node_modules/mdurl/lib/format.mjs
function format(url) {
  let result = "";
  result += url.protocol || "";
  result += url.slashes ? "//" : "";
  result += url.auth ? url.auth + "@" : "";
  if (url.hostname && url.hostname.indexOf(":") !== -1) {
    result += "[" + url.hostname + "]";
  } else {
    result += url.hostname || "";
  }
  result += url.port ? ":" + url.port : "";
  result += url.pathname || "";
  result += url.search || "";
  result += url.hash || "";
  return result;
}

// node_modules/mdurl/lib/parse.mjs
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.pathname = null;
}
var protocolPattern = /^([a-z0-9.+-]+:)/i;
var portPattern = /:[0-9]*$/;
var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
var autoEscape = ["'"].concat(unwise);
var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
var hostEndingChars = ["/", "?", "#"];
var hostnameMaxLen = 255;
var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
var hostlessProtocol = {
  javascript: true,
  "javascript:": true
};
var slashedProtocol = {
  http: true,
  https: true,
  ftp: true,
  gopher: true,
  file: true,
  "http:": true,
  "https:": true,
  "ftp:": true,
  "gopher:": true,
  "file:": true
};
function urlParse(url, slashesDenoteHost) {
  if (url && url instanceof Url) return url;
  const u = new Url();
  u.parse(url, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function(url, slashesDenoteHost) {
  let lowerProto, hec, slashes;
  let rest = url;
  rest = rest.trim();
  if (!slashesDenoteHost && url.split("#").length === 1) {
    const simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
      }
      return this;
    }
  }
  let proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    lowerProto = proto.toLowerCase();
    this.protocol = proto;
    rest = rest.substr(proto.length);
  }
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    slashes = rest.substr(0, 2) === "//";
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    let hostEnd = -1;
    for (let i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    let auth, atSign;
    if (hostEnd === -1) {
      atSign = rest.lastIndexOf("@");
    } else {
      atSign = rest.lastIndexOf("@", hostEnd);
    }
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = auth;
    }
    hostEnd = -1;
    for (let i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }
    if (rest[hostEnd - 1] === ":") {
      hostEnd--;
    }
    const host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);
    this.parseHost(host);
    this.hostname = this.hostname || "";
    const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!ipv6Hostname) {
      const hostparts = this.hostname.split(/\./);
      for (let i = 0, l = hostparts.length; i < l; i++) {
        const part = hostparts[i];
        if (!part) {
          continue;
        }
        if (!part.match(hostnamePartPattern)) {
          let newpart = "";
          for (let j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              newpart += "x";
            } else {
              newpart += part[j];
            }
          }
          if (!newpart.match(hostnamePartPattern)) {
            const validParts = hostparts.slice(0, i);
            const notHost = hostparts.slice(i + 1);
            const bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = notHost.join(".") + rest;
            }
            this.hostname = validParts.join(".");
            break;
          }
        }
      }
    }
    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = "";
    }
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
    }
  }
  const hash = rest.indexOf("#");
  if (hash !== -1) {
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  const qm = rest.indexOf("?");
  if (qm !== -1) {
    this.search = rest.substr(qm);
    rest = rest.slice(0, qm);
  }
  if (rest) {
    this.pathname = rest;
  }
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = "";
  }
  return this;
};
Url.prototype.parseHost = function(host) {
  let port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ":") {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) {
    this.hostname = host;
  }
};
var parse_default = urlParse;

// node_modules/uc.micro/build/index.mjs
var build_exports = {};
__export(build_exports, {
  Any: () => Any,
  Cc: () => Cc,
  Cf: () => Cf,
  P: () => P,
  S: () => S,
  Z: () => Z
});
var Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var Cc = /[\0-\x1F\x7F-\x9F]/;
var Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
var P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/;
var S = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/;
var Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

// node_modules/entities/dist/decode-codepoint.js
var c1 = [
  8364,
  0,
  8218,
  402,
  8222,
  8230,
  8224,
  8225,
  710,
  8240,
  352,
  8249,
  338,
  0,
  381,
  0,
  0,
  8216,
  8217,
  8220,
  8221,
  8226,
  8211,
  8212,
  732,
  8482,
  353,
  8250,
  339,
  0,
  382,
  376
];
function isInvalidCodePoint(codePoint) {
  return codePoint === 0 || codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111;
}
function replaceCodePoint(codePoint) {
  if (isInvalidCodePoint(codePoint)) {
    return 65533;
  }
  if (codePoint >= 128 && codePoint <= 159) {
    return c1[codePoint - 128] || codePoint;
  }
  return codePoint;
}
function codePointToString(codePoint) {
  return codePoint - 1 >>> 0 < 127 || codePoint - 160 >>> 0 < 55136 ? String.fromCharCode(codePoint) : String.fromCodePoint(replaceCodePoint(codePoint));
}

// node_modules/entities/dist/internal/decode-shared.js
var BASE91_INVERSE = /* @__PURE__ */ (() => {
  const table2 = new Uint8Array(127);
  let code3 = 0;
  for (let char = 33; char <= 126; char++) {
    if (char !== 34 && char !== 36 && char !== 92) {
      table2[char] = code3++;
    }
  }
  return table2;
})();
function decodeTrieDict(input, resultLength, atomCount, dict1AtomCount, ngramCount, dictSize) {
  const base2 = 91;
  const inputLength = input.length;
  const twoCharBias = dictSize * (base2 - 1);
  let pos = 0;
  const readSlotCode = () => {
    const c12 = BASE91_INVERSE[input.charCodeAt(pos++)];
    return c12 < dictSize ? c12 : c12 * base2 - twoCharBias + BASE91_INVERSE[input.charCodeAt(pos++)];
  };
  const dict2AtomCount = atomCount - dict1AtomCount;
  const slotCount = atomCount + ngramCount;
  const single = new Int32Array(slotCount);
  single.fill(-1, dict1AtomCount, dictSize);
  single.fill(-1, dictSize + dict2AtomCount, slotCount);
  const start = new Int32Array(slotCount);
  const length = new Int32Array(slotCount);
  function decodeDelta(count, off) {
    let previous = 0;
    let slot = off;
    const end = off + count;
    while (slot < end) {
      const code3 = BASE91_INVERSE[input.charCodeAt(pos++)];
      if (code3 < 89) {
        previous += code3;
        single[slot++] = previous;
      } else if (code3 === 89) {
        let runLength = BASE91_INVERSE[input.charCodeAt(pos++)] + 2;
        while (runLength--)
          single[slot++] = ++previous;
      } else {
        const next = BASE91_INVERSE[input.charCodeAt(pos++)];
        previous += 89 + // eslint-disable-next-line unicorn/prefer-minimal-ternary -- branches read a different number of side-effecting input bytes
        (next < 90 ? next * base2 + BASE91_INVERSE[input.charCodeAt(pos++)] : BASE91_INVERSE[input.charCodeAt(pos++)] * 8281 + BASE91_INVERSE[input.charCodeAt(pos++)] * base2 + BASE91_INVERSE[input.charCodeAt(pos++)]);
        single[slot++] = previous;
      }
    }
  }
  decodeDelta(dict1AtomCount, 0);
  decodeDelta(dict2AtomCount, dictSize);
  const references = new Int32Array(ngramCount * 2);
  let poolSize = 0;
  let ngramIndex = 0;
  function readNgramReferences(count, startSlot) {
    for (let index = 0; index < count; index++) {
      const slot = startSlot + index;
      const a = readSlotCode();
      const b = readSlotCode();
      references[ngramIndex * 2] = a;
      references[ngramIndex * 2 + 1] = b;
      ngramIndex += 1;
      start[slot] = poolSize;
      const entryLength = (single[a] < 0 ? length[a] : 1) + (single[b] < 0 ? length[b] : 1);
      length[slot] = entryLength;
      poolSize += entryLength;
    }
  }
  readNgramReferences(ngramCount - dictSize + dict1AtomCount, dictSize + dict2AtomCount);
  readNgramReferences(dictSize - dict1AtomCount, dict1AtomCount);
  const pool = new Uint16Array(poolSize);
  let write = 0;
  for (let index = 0; index < ngramIndex; index++) {
    for (let half = 0; half < 2; half++) {
      const source = references[index * 2 + half];
      const value = single[source];
      if (value < 0) {
        let read = start[source];
        const readEnd = read + length[source];
        while (read < readEnd)
          pool[write++] = pool[read++];
      } else {
        pool[write++] = value;
      }
    }
  }
  const out = new Uint16Array(resultLength);
  let outIndex = 0;
  while (pos < inputLength) {
    let slot = BASE91_INVERSE[input.charCodeAt(pos++)];
    if (slot >= dictSize) {
      slot = slot * base2 - twoCharBias + BASE91_INVERSE[input.charCodeAt(pos++)];
    }
    const value = single[slot];
    if (value < 0) {
      let read = start[slot];
      const readEnd = read + length[slot];
      while (read < readEnd)
        out[outIndex++] = pool[read++];
    } else {
      out[outIndex++] = value;
    }
  }
  return out;
}

// node_modules/entities/dist/generated/decode-data-html.js
var htmlDecodeTree = /* @__PURE__ */ decodeTrieDict("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61);

// node_modules/entities/dist/internal/bin-trie-flags.js
var BinTrieFlags;
(function(BinTrieFlags2) {
  BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags2[BinTrieFlags2["FLAG13"] = 8192] = "FLAG13";
  BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
  BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
  BinTrieFlags2[BinTrieFlags2["VALUE_MASK"] = 8191] = "VALUE_MASK";
})(BinTrieFlags || (BinTrieFlags = {}));

// node_modules/entities/dist/decode.js
var CharCodes;
(function(CharCodes2) {
  CharCodes2[CharCodes2["AMP"] = 38] = "AMP";
  CharCodes2[CharCodes2["NUM"] = 35] = "NUM";
  CharCodes2[CharCodes2["SEMI"] = 59] = "SEMI";
  CharCodes2[CharCodes2["EQUALS"] = 61] = "EQUALS";
  CharCodes2[CharCodes2["ZERO"] = 48] = "ZERO";
  CharCodes2[CharCodes2["NINE"] = 57] = "NINE";
  CharCodes2[CharCodes2["LOWER_A"] = 97] = "LOWER_A";
  CharCodes2[CharCodes2["LOWER_X"] = 120] = "LOWER_X";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
var CONSUMED_SHIFT = 21;
var CODE_POINT_MASK = 2097151;
var CONSUMED_OVERFLOW = 2047;
var longNumericConsumed = 0;
function unpackConsumed(packed) {
  const consumed = packed >>> CONSUMED_SHIFT;
  return consumed === CONSUMED_OVERFLOW ? longNumericConsumed : consumed;
}
function isNumber(code3) {
  return code3 - CharCodes.ZERO >>> 0 <= 9;
}
function isHexadecimalCharacter(code3) {
  return (code3 | TO_LOWER_BIT) - CharCodes.LOWER_A >>> 0 <= 5;
}
function isAlpha(code3) {
  return (code3 | TO_LOWER_BIT) - CharCodes.LOWER_A >>> 0 <= 25;
}
function isEntityInAttributeInvalidEnd(code3) {
  return code3 === CharCodes.EQUALS || isAlpha(code3) || isNumber(code3);
}
var EntityDecoderState;
(function(EntityDecoderState2) {
  EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode2) {
  DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
  DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
function determineBranch(decodeTree, current2, nodeIndex, char) {
  const branchCount = (current2 & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current2 & BinTrieFlags.JUMP_TABLE;
  if (jumpOffset) {
    if (branchCount === 0) {
      return char === jumpOffset ? nodeIndex : -1;
    }
    const slot = char - jumpOffset;
    if (slot >>> 0 >= branchCount)
      return -1;
    const stored = decodeTree[nodeIndex + slot];
    return stored === 0 ? -1 : nodeIndex + branchCount + stored - 1 & 65535;
  }
  if (branchCount === 0)
    return -1;
  const packedKeySlots = branchCount + 1 >> 1;
  const branchEnd = nodeIndex + packedKeySlots + branchCount;
  for (let index = 0; index < branchCount; index++) {
    const packed = decodeTree[nodeIndex + (index >> 1)];
    const key2 = packed >> ((index & 1) << 3) & 255;
    if (key2 === char) {
      const pointerIndex = nodeIndex + packedKeySlots + index;
      return branchEnd + decodeTree[pointerIndex] & 65535;
    }
    if (key2 > char)
      return -1;
  }
  return -1;
}
function readTrieValue(decodeTree, nodeIndex, valueLength) {
  if (valueLength === 1) {
    return String.fromCharCode(decodeTree[nodeIndex] & BinTrieFlags.VALUE_MASK);
  }
  if (valueLength === 2) {
    return String.fromCharCode(decodeTree[nodeIndex + 1]);
  }
  return String.fromCharCode(decodeTree[nodeIndex + 1], decodeTree[nodeIndex + 2]);
}
function parseNumericEntity(input, numberStart, inputLength) {
  let offset = numberStart + 1;
  let cp = 0;
  let digitStart = offset;
  if (offset < inputLength && (input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
    offset += 1;
    digitStart = offset;
    while (offset < inputLength) {
      const char = input.charCodeAt(offset);
      if (isNumber(char)) {
        cp = cp * 16 + (char - CharCodes.ZERO);
      } else if (isHexadecimalCharacter(char)) {
        cp = cp * 16 + ((char | TO_LOWER_BIT) - CharCodes.LOWER_A + 10);
      } else {
        break;
      }
      offset += 1;
    }
  } else {
    while (offset < inputLength) {
      const digit = input.charCodeAt(offset) - CharCodes.ZERO;
      if (digit >>> 0 > 9)
        break;
      cp = cp * 10 + digit;
      offset += 1;
    }
  }
  if (offset === digitStart)
    return 0;
  if (offset < inputLength && input.charCodeAt(offset) === CharCodes.SEMI) {
    offset += 1;
  }
  if (cp > 1114111)
    cp = 1114112;
  let consumed = offset - numberStart;
  if (consumed >= CONSUMED_OVERFLOW) {
    longNumericConsumed = consumed;
    consumed = CONSUMED_OVERFLOW;
  }
  return consumed << CONSUMED_SHIFT | cp;
}
function decodeWithTrie(input, isStrict, isAttribute) {
  const decodeTree = htmlDecodeTree;
  let offset = input.indexOf("&");
  if (offset < 0)
    return input;
  const inputLength = input.length;
  let chunkStart = 0;
  let result = "";
  const root2 = decodeTree[0];
  const rootJumpOffset = root2 & BinTrieFlags.JUMP_TABLE;
  const rootBranchCount = (root2 & BinTrieFlags.BRANCH_LENGTH) >> 7;
  do {
    const entityStart = offset + 1;
    const firstChar = input.charCodeAt(entityStart);
    let consumed;
    let value;
    if (firstChar === CharCodes.NUM) {
      const packed = parseNumericEntity(input, entityStart, inputLength);
      consumed = unpackConsumed(packed);
      if (isStrict && consumed > 0 && input.charCodeAt(entityStart + consumed - 1) !== CharCodes.SEMI) {
        consumed = 0;
      }
      value = consumed === 0 ? "" : codePointToString(packed & CODE_POINT_MASK);
    } else if (isAlpha(firstChar)) {
      consumed = 0;
      value = "";
      const rootSlotIndex = firstChar - rootJumpOffset;
      let nodeIndex;
      if (rootSlotIndex >>> 0 < rootBranchCount) {
        const stored = decodeTree[1 + rootSlotIndex];
        nodeIndex = stored === 0 ? -1 : rootBranchCount + stored & 65535;
      } else {
        nodeIndex = -1;
      }
      let bestNodeIndex = 0;
      let bestValueLength = 0;
      let current2 = nodeIndex < 0 ? 0 : decodeTree[nodeIndex];
      let index = entityStart + 1;
      trie: while (index < inputLength) {
        while (
          // Value-less, non-run node with a nonzero jump offset.
          (current2 & (BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13)) === 0 && (current2 & BinTrieFlags.JUMP_TABLE) !== 0
        ) {
          const jumpOffset = current2 & BinTrieFlags.JUMP_TABLE;
          const branchCount = (current2 & BinTrieFlags.BRANCH_LENGTH) >> 7;
          if (branchCount === 0) {
            if (input.charCodeAt(index) !== jumpOffset)
              break trie;
            nodeIndex += 1;
          } else {
            const slot = input.charCodeAt(index) - jumpOffset;
            if (slot >>> 0 >= branchCount)
              break trie;
            const stored = decodeTree[nodeIndex + 1 + slot];
            if (stored === 0)
              break trie;
            nodeIndex = nodeIndex + branchCount + stored & 65535;
          }
          current2 = decodeTree[nodeIndex];
          index += 1;
          if (index >= inputLength)
            break trie;
        }
        if ((current2 & (BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13)) === BinTrieFlags.FLAG13) {
          const runLength = (current2 & BinTrieFlags.BRANCH_LENGTH) >> 7;
          if (input.charCodeAt(index) !== (current2 & BinTrieFlags.JUMP_TABLE)) {
            break;
          }
          index += 1;
          const remaining = runLength - 1;
          let wordIndex = nodeIndex + 1;
          let charIndexInPacked = 0;
          for (; charIndexInPacked + 1 < remaining; charIndexInPacked += 2) {
            const packed = decodeTree[wordIndex];
            if (input.charCodeAt(index) !== (packed & 255))
              break trie;
            index += 1;
            if (input.charCodeAt(index) !== (packed >> 8 & 255))
              break trie;
            index += 1;
            wordIndex += 1;
          }
          if (charIndexInPacked < remaining) {
            if (input.charCodeAt(index) !== (decodeTree[wordIndex] & 255))
              break;
            index += 1;
          }
          nodeIndex += 1 + (runLength >> 1);
          current2 = decodeTree[nodeIndex];
          continue;
        }
        const valueLength = current2 >>> 14;
        const char = input.charCodeAt(index);
        if (valueLength !== 0) {
          if (char === CharCodes.SEMI) {
            consumed = index - entityStart + 1;
            value = valueLength === 1 ? String.fromCharCode(current2 & BinTrieFlags.VALUE_MASK) : readTrieValue(decodeTree, nodeIndex, valueLength);
            break;
          }
          if (!isStrict && (current2 & BinTrieFlags.FLAG13) === 0) {
            consumed = index - entityStart;
            bestNodeIndex = nodeIndex;
            bestValueLength = valueLength;
          }
          if (valueLength === 1)
            break;
        }
        const next = determineBranch(decodeTree, current2, nodeIndex + (valueLength || 1), char);
        if (next < 0)
          break;
        nodeIndex = next;
        current2 = decodeTree[nodeIndex];
        index += 1;
      }
      if (value === "") {
        const finalVL = current2 >>> 14;
        if (finalVL !== 0 && !isStrict && (current2 & BinTrieFlags.FLAG13) === 0) {
          consumed = index - entityStart;
          bestNodeIndex = nodeIndex;
          bestValueLength = finalVL;
        }
        if (consumed > 0) {
          value = readTrieValue(decodeTree, bestNodeIndex, bestValueLength);
        }
      }
    } else {
      consumed = 0;
      value = "";
    }
    if (consumed === 0 || isAttribute && firstChar !== CharCodes.NUM && input.charCodeAt(entityStart + consumed - 1) !== CharCodes.SEMI && entityStart + consumed < inputLength && isEntityInAttributeInvalidEnd(input.charCodeAt(entityStart + consumed))) {
      offset = entityStart;
    } else {
      if (chunkStart < offset) {
        result += input.slice(chunkStart, offset);
      }
      result += value;
      offset = chunkStart = entityStart + consumed;
    }
    if (input.charCodeAt(offset) !== CharCodes.AMP) {
      offset = input.indexOf("&", offset);
    }
  } while (offset >= 0);
  return result + input.slice(chunkStart);
}
function decodeHTMLStrict(htmlString) {
  return decodeWithTrie(htmlString, true, false);
}

// node_modules/entities/dist/index.js
var EntityLevel;
(function(EntityLevel2) {
  EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
  EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode2) {
  EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
  EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
  EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
  EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
  EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));

// node_modules/linkify-it/build/index.mjs
var REBuilder = class {
  src_Any = Any.source;
  src_Cc = Cc.source;
  src_Z = Z.source;
  src_P = P.source;
  src_ZPCc = [
    this.src_Z,
    this.src_P,
    this.src_Cc
  ].join("|");
  src_ZCc = [this.src_Z, this.src_Cc].join("|");
  cache = {};
  opts = {
    maxLength: 1e4,
    urlAuth: false,
    schema_names: []
  };
  constructor(opts = {}) {
    this.opts = {
      ...this.opts,
      ...opts
    };
  }
  set(opts = {}) {
    this.opts = {
      ...this.opts,
      ...opts
    };
    this.cache = {};
    return this;
  }
  escapeRE(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  }
  nestedPairRE(open, close, depth = 4) {
    const openRE = this.escapeRE(open);
    const closeRE = this.escapeRE(close);
    const atom = `(?:(?!${this.src_ZCc}|${openRE}|${closeRE}).)`;
    let pair = `${openRE}${atom}{0,1000}${closeRE}`;
    for (let level = 2; level <= depth; level++) pair = `${openRE}(?:${atom}|${pair}){0,1000}${closeRE}`;
    return pair;
  }
  get_text_separators() {
    return this.cache.text_separators ??= /[><\uff5c]/;
  }
  get_pseudo_letter() {
    return this.cache.src_pseudo_letter ??= new RegExp(`(?:(?!${this.get_text_separators().source}|${this.src_ZPCc})${this.src_Any})`);
  }
  get_ipv4_addr() {
    return this.cache.src_ip4 ??= /* @__PURE__ */ new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])[.]){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])");
  }
  get_ipv6_addr() {
    const h16 = "[0-9A-Fa-f]{1,4}";
    const ls32 = `(?:(?:${h16}:${h16})|${this.get_ipv4_addr().source})`;
    return this.cache.src_ip6_addr ??= new RegExp(`(?:(?:${h16}:){6}${ls32}|::(?:${h16}:){5}${ls32}|(?:${h16})?::(?:${h16}:){4}${ls32}|(?:(?:${h16}:){0,1}${h16})?::(?:${h16}:){3}${ls32}|(?:(?:${h16}:){0,2}${h16})?::(?:${h16}:){2}${ls32}|(?:(?:${h16}:){0,3}${h16})?::${h16}:${ls32}|(?:(?:${h16}:){0,4}${h16})?::${ls32}|(?:(?:${h16}:){0,5}${h16})?::${h16}|(?:(?:${h16}:){0,6}${h16})?::)`);
  }
  get_ipv6_url_host() {
    return this.cache.src_ip6_host ??= new RegExp(`\\[${this.get_ipv6_addr().source}\\]`);
  }
  get_ipv6_mail_host() {
    return this.cache.src_ipv6_mail_host ??= new RegExp(`\\[IPv6:${this.get_ipv6_addr().source}\\]`);
  }
  get_auth() {
    return this.cache.src_auth ??= new RegExp(`(?:(?:(?!${this.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`);
  }
  get_port() {
    return this.cache.src_port ??= /* @__PURE__ */ new RegExp("(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?");
  }
  get_host_terminator() {
    return this.cache.src_host_terminator ??= new RegExp(`(?=$|${this.get_text_separators().source}|${this.src_ZPCc})(?!${this.opts["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${this.src_ZPCc}))`);
  }
  get_path_terminator() {
    return this.cache.src_path_terminator ??= new RegExp(`${this.src_ZPCc}|${this.get_text_separators().source}`);
  }
  get_path() {
    return this.cache.src_path ??= new RegExp(`(?:[/?#](?:${this.nestedPairRE("[", "]")}|${this.nestedPairRE("(", ")")}|${this.nestedPairRE("{", "}")}|\\"(?:(?!${this.src_ZCc}|["]).){1,100}\\"|\\'(?:(?!${this.src_ZCc}|[']).){1,100}\\'|\\'(?=${this.get_pseudo_letter().source}|[-])|\\.{2,20}[:]?[a-zA-Z0-9%/&]|\\.(?!${this.src_ZCc}|[.]|$)|` + (this.opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-{0,19})|" : "\\-{1,20}|") + `,(?!${this.src_ZCc}|$)|;(?!${this.src_ZCc}|$)|\\!{1,20}(?!${this.src_ZCc}|[!]|$)|\\?(?!${this.src_ZCc}|[?]|$)|` + this.get_path_extra().source + `[\\\\/:%@#&=_~*]|(?!${this.get_path_terminator().source}).){1,${this.opts.maxLength}}|\\/)?`);
  }
  get_mail_name() {
    return this.cache.src_mail_name ??= /* @__PURE__ */ new RegExp("[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9](?:[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9]|[.](?=[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9])){0,63}");
  }
  get_xn() {
    return this.cache.src_xn ??= /* @__PURE__ */ new RegExp("xn--[a-z0-9\\-]{1,59}");
  }
  get_tld() {
    if (this.cache.tld) return this.cache.tld;
    const tlds_src = [...new Set(this.opts.tlds || [])].sort().reverse().join("|");
    this.cache.tld = new RegExp(`${tlds_src || "$#none#$"}|${this.get_xn().source}`);
    return this.cache.tld;
  }
  get_domain_root() {
    return this.cache.src_domain_root ??= new RegExp("(?:" + this.get_xn().source + `|${this.get_pseudo_letter().source}{1,63})`);
  }
  get_domain() {
    return this.cache.src_domain ??= new RegExp("(?:" + this.get_xn().source + `|(?:${this.get_pseudo_letter().source})|(?:${this.get_pseudo_letter().source}(?:-|${this.get_pseudo_letter().source}){0,61}${this.get_pseudo_letter().source}))`);
  }
  get_url_host_port() {
    return this.cache.url_host_port ??= new RegExp("(?:" + this.get_ipv6_url_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,10}${this.get_domain().source}))` + this.get_port().source + this.get_host_terminator().source);
  }
  get_fuzzy_url_host_port() {
    return this.cache.fuzzy_url_host_port ??= new RegExp("(?:" + (this.opts.fuzzyIP ? this.get_ipv4_addr().source + "|" : "") + `(?:(?:(?:${this.get_domain().source})\\.){1,10}(?:${this.get_tld().source})))` + this.get_host_terminator().source);
  }
  get_mail_host() {
    return this.cache.src_mail_host ??= new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,4}${this.get_domain().source}))` + this.get_host_terminator().source);
  }
  get_fuzzy_mail_host() {
    return this.cache.src_fuzzy_mail_host ??= new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})[.]){1,4}${this.get_domain_root().source}))` + this.get_host_terminator().source);
  }
  get_path_extra() {
    return this.cache.src_path_extra ??= /* @__PURE__ */ new RegExp("");
  }
  get_fuzzy_mail_host_search() {
    return this.cache.mail_fuzzy_host_search ??= new RegExp(`@${this.get_fuzzy_mail_host().source}`, "ig");
  }
  get_fuzzy_link_search() {
    return this.cache.link_fuzzy_search ??= new RegExp(`(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uFF5C]|${this.src_ZPCc}))(?:(?![$+<=>^\`|\uFF5C])${this.get_fuzzy_url_host_port().source}${this.get_path().source})`, "ig");
  }
  get_http_validator() {
    return this.cache.http_validator ??= new RegExp("\\/\\/" + (this.opts.urlAuth ? this.get_auth().source : "") + this.get_url_host_port().source + this.get_path().source, "iy");
  }
  get_relative_proto_validator() {
    return this.cache.relative_proto_validator ??= new RegExp((this.opts.urlAuth ? this.get_auth().source : "") + `(?:localhost|${this.get_ipv6_url_host().source}|(?:(?:${this.get_domain().source})[.]){1,10}${this.get_domain_root().source})` + this.get_port().source + this.get_host_terminator().source + this.get_path().source, "iy");
  }
  get_mail_name_validator() {
    return this.cache.mail_name_validator ??= new RegExp(`(?:^|${this.get_text_separators().source}|"|\\(|${this.src_ZCc})(${this.get_mail_name().source})$`);
  }
  get_mailto_validator() {
    return this.cache.mailto_validator ??= new RegExp(`${this.get_mail_name().source}@${this.get_mail_host().source}`, "iy");
  }
  get_schema_names() {
    return this.cache.schema_names ??= new RegExp((this.opts.schema_names || []).map((name) => this.escapeRE(name)).join("|"));
  }
  get_schema_search() {
    return this.cache.schema_search ??= new RegExp(`(^|(?!_)(?:[><\uFF5C]|${this.src_ZPCc}))(${this.get_schema_names().source})`, "ig");
  }
  get_schema_at_start() {
    return this.cache.schema_at_start ??= new RegExp(`^${this.get_schema_search().source}`, "i");
  }
};
var web_schema = {
  validate: (text2, pos, self) => {
    const re = self.re.get_http_validator();
    re.lastIndex = pos;
    const m = re.exec(text2);
    return m ? m[0].length : 0;
  },
  normalize: (match, self) => self.normalize(match)
};
var defaultSchemas = {
  "http:": web_schema,
  "https:": web_schema,
  "ftp:": web_schema,
  "//": {
    validate: function(text2, pos, self) {
      const re = self.re.get_relative_proto_validator();
      re.lastIndex = pos;
      const m = re.exec(text2);
      if (m) {
        if (pos >= 3 && text2[pos - 3] === ":") return 0;
        if (pos >= 3 && text2[pos - 3] === "/") return 0;
        return m[0].length;
      }
      return 0;
    },
    normalize: (match, self) => self.normalize(match)
  },
  "mailto:": {
    validate: function(text2, pos, self) {
      const re = self.re.get_mailto_validator();
      re.lastIndex = pos;
      const m = re.exec(text2);
      return m ? m[0].length : 0;
    },
    normalize: (match, self) => self.normalize(match)
  }
};
var tlds_2ch = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw";
var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|\u0440\u0444";
function unpackTlds() {
  const result = tlds_default.split("|");
  tlds_2ch.split("|").forEach((item) => {
    const sep = item.indexOf(":");
    const prefix = item.slice(0, sep);
    for (const suffix of item.slice(sep + 1)) result.push(prefix + suffix);
  });
  return result;
}
var defaultOptions = {
  fuzzyLink: false,
  fuzzyEmail: true,
  fuzzyIP: false,
  "---": false,
  tlds: unpackTlds(),
  urlAuth: false,
  maxLength: 1e4
};
var Match = class {
  /** Prefix (protocol) for matched string. Empty for fuzzy links. */
  schema;
  /** First position of matched string. */
  index;
  /** Next position after matched string. */
  lastIndex;
  /** Matched string. */
  raw;
  /** Normalized text of matched string. */
  text;
  /** Normalized URL of matched string. */
  url;
  constructor(text2, schema, index, lastIndex) {
    const raw = text2.slice(index, lastIndex);
    this.schema = schema.toLowerCase();
    this.index = index;
    this.lastIndex = lastIndex;
    this.raw = raw;
    this.text = raw;
    this.url = raw;
  }
};
var LinkifyIt = class {
  __opts__;
  __schemas__;
  re;
  /**
  * Creates new linkifier instance.
  *
  * By default understands:
  *
  * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
  * - "fuzzy" emails (foo@bar.com).
  *
  * See {@link LinkifyConstructorOptions} for available options.
  *
  * @param options Recognition options.
  *
  * @example
  * ```javascript
  * import { LinkifyIt } from 'linkify-it'
  *
  * const linkify = new LinkifyIt({ fuzzyLink: true })
  *
  * linkify
  *   .tlds(require('tlds'))       // Reload with full TLD list
  *   .tlds('onion', true)         // Add unofficial `.onion` domain
  *   .add('ftp:', null)           // Disable `ftp:` protocol
  *   .set({ fuzzyIP: true })      // Enable IPs in fuzzy links
  *
  * console.log(linkify.test('Site github.com!')) // true
  * console.log(linkify.match('Site github.com!'))
  * ```
  */
  constructor(options = {}) {
    const { rebuilder, ...linkifyOptions } = options;
    this.__opts__ = {
      ...defaultOptions,
      ...linkifyOptions
    };
    this.__schemas__ = { ...defaultSchemas };
    this.re = rebuilder || new REBuilder();
    this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    });
  }
  /**
  * Add new rule definition.
  *
  * `schema` is a link prefix (usually, protocol name with `:` at the end,
  * `skype:` for example). `linkify-it` makes sure that prefix is not
  * preceded with alphanumeric char and symbols. Only whitespaces and
  * punctuation allowed.
  *
  * `definition` is a rule to check tail after link prefix. To disable an
  * existing rule, pass `null`.
  *
  * @param schema Rule name (fixed pattern prefix).
  * @param definition Schema definition, or `null` to disable the rule.
  *
  * See [twitter mentions example](https://github.com/markdown-it/linkify-it/blob/master/examples/twitter.mjs).
  */
  add(schema, definition = null) {
    if (!definition) delete this.__schemas__[schema];
    else {
      const def = {
        normalize: (match, self) => self.normalize(match),
        ...definition
      };
      this.__schemas__[schema] = def;
    }
    this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    });
    return this;
  }
  /**
  * Set recognition options for links without schema.
  *
  * @param options Recognition options.
  */
  set(options = {}) {
    this.__opts__ = {
      ...this.__opts__,
      ...options
    };
    this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    });
    return this;
  }
  /**
  * Searches linkifiable pattern and returns `true` on success or `false` on fail.
  *
  * @param text Text to scan.
  */
  test(text2) {
    if (!text2.length) return false;
    let m, re;
    re = this.re.get_schema_search();
    re.lastIndex = 0;
    while ((m = re.exec(text2)) !== null) if (this.testSchemaAt(text2, m[2], re.lastIndex)) return true;
    if (this.__opts__.fuzzyLink && this.__schemas__["http:"]) {
      re = this.re.get_fuzzy_link_search();
      re.lastIndex = 0;
      if (re.exec(text2) !== null) return true;
    }
    if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"]) {
      if (text2.indexOf("@") >= 0) {
        const mailHostRe = this.re.get_fuzzy_mail_host_search();
        const mailNameRe = this.re.get_mail_name_validator();
        mailHostRe.lastIndex = 0;
        while ((m = mailHostRe.exec(text2)) !== null) {
          const name = text2.slice(Math.max(0, m.index - 65), m.index);
          if (mailNameRe.test(name)) return true;
        }
      }
    }
    return false;
  }
  /**
  * Similar to {@link LinkifyIt.test} but checks only specific protocol tail exactly
  * at given position. Returns length of found pattern (0 on fail).
  *
  * @param text Text to scan.
  * @param schema Rule (schema) name.
  * @param pos Text offset to check from.
  */
  testSchemaAt(text2, schema, pos) {
    if (!this.__schemas__[schema.toLowerCase()]) return 0;
    return this.__schemas__[schema.toLowerCase()].validate(text2.slice(0, pos + this.__opts__.maxLength), pos, this);
  }
  /**
  * Returns array of found link descriptions or `null` on fail. We strongly
  * recommend to use {@link LinkifyIt.test} first, for best speed.
  *
  * @param text Text to scan.
  */
  match(text2) {
    const result = [];
    const schemaRe = this.re.get_schema_search();
    let fuzzyLinkRe;
    let mailHostRe;
    let mailNameRe;
    let fuzzyLinkCandidate;
    let fuzzyEmailCandidate;
    let schemaPrefix;
    let schemaDone = false;
    let fuzzyLinkDone = false;
    let fuzzyEmailDone = false;
    let pos = 0;
    if (!text2.length) return null;
    schemaRe.lastIndex = 0;
    if (this.__opts__.fuzzyLink && this.__schemas__["http:"]) {
      fuzzyLinkRe = this.re.get_fuzzy_link_search();
      fuzzyLinkRe.lastIndex = 0;
    }
    if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"]) {
      mailHostRe = this.re.get_fuzzy_mail_host_search();
      mailHostRe.lastIndex = 0;
      mailNameRe = this.re.get_mail_name_validator();
    }
    for (; ; ) {
      const scanFrom = Math.max(pos - 1, 0);
      if (mailHostRe && mailNameRe && !fuzzyEmailDone && (!fuzzyEmailCandidate || fuzzyEmailCandidate.index < pos)) {
        if (mailHostRe.lastIndex < scanFrom) mailHostRe.lastIndex = scanFrom;
        for (; ; ) {
          const m = mailHostRe.exec(text2);
          if (!m) {
            fuzzyEmailDone = true;
            fuzzyEmailCandidate = void 0;
            break;
          }
          const name = mailNameRe.exec(text2.slice(Math.max(0, m.index - 65), m.index));
          if (!name) continue;
          fuzzyEmailCandidate = {
            schema: "mailto:",
            index: m.index - name[1].length,
            lastIndex: m.index + m[0].length
          };
          if (fuzzyEmailCandidate.index >= pos) break;
          if (mailHostRe.lastIndex < scanFrom) mailHostRe.lastIndex = scanFrom;
        }
      }
      if (fuzzyLinkRe && !fuzzyLinkDone && (!fuzzyLinkCandidate || fuzzyLinkCandidate.index < pos)) {
        if (fuzzyLinkRe.lastIndex < scanFrom) fuzzyLinkRe.lastIndex = scanFrom;
        for (; ; ) {
          const m = fuzzyLinkRe.exec(text2);
          if (!m) {
            fuzzyLinkDone = true;
            fuzzyLinkCandidate = void 0;
            break;
          }
          fuzzyLinkCandidate = {
            schema: "",
            index: m.index + m[1].length,
            lastIndex: m.index + m[0].length
          };
          if (fuzzyLinkCandidate.index >= pos) break;
          if (fuzzyLinkRe.lastIndex < scanFrom) fuzzyLinkRe.lastIndex = scanFrom;
        }
      }
      let fuzzyCandidate = fuzzyEmailCandidate;
      if (!fuzzyCandidate || fuzzyLinkCandidate && (fuzzyLinkCandidate.index < fuzzyCandidate.index || fuzzyLinkCandidate.index === fuzzyCandidate.index && fuzzyLinkCandidate.lastIndex > fuzzyCandidate.lastIndex)) fuzzyCandidate = fuzzyLinkCandidate;
      let schemaCandidate;
      if (!schemaDone) for (; ; ) {
        if (!schemaPrefix) {
          if (schemaRe.lastIndex < scanFrom) schemaRe.lastIndex = scanFrom;
          const m = schemaRe.exec(text2);
          if (!m) {
            schemaDone = true;
            break;
          }
          schemaPrefix = {
            schema: m[2],
            index: m.index + m[1].length,
            lastIndex: m.index + m[0].length
          };
        }
        if (schemaPrefix.index < pos) {
          schemaPrefix = void 0;
          continue;
        }
        if (fuzzyCandidate && schemaPrefix.index > fuzzyCandidate.index) break;
        const prefix = schemaPrefix;
        schemaPrefix = void 0;
        const len = this.testSchemaAt(text2, prefix.schema, prefix.lastIndex);
        if (len) {
          schemaCandidate = {
            schema: prefix.schema,
            index: prefix.index,
            lastIndex: prefix.lastIndex + len
          };
          break;
        }
      }
      let candidate = schemaCandidate;
      if (!candidate || fuzzyEmailCandidate && (fuzzyEmailCandidate.index < candidate.index || fuzzyEmailCandidate.index === candidate.index && fuzzyEmailCandidate.lastIndex > candidate.lastIndex)) candidate = fuzzyEmailCandidate;
      if (!candidate || fuzzyLinkCandidate && (fuzzyLinkCandidate.index < candidate.index || fuzzyLinkCandidate.index === candidate.index && fuzzyLinkCandidate.lastIndex > candidate.lastIndex)) candidate = fuzzyLinkCandidate;
      if (!candidate) break;
      if (candidate === fuzzyEmailCandidate) fuzzyEmailCandidate = void 0;
      else if (candidate === fuzzyLinkCandidate) fuzzyLinkCandidate = void 0;
      const match = new Match(text2, candidate.schema, candidate.index, candidate.lastIndex);
      if (match.schema) this.__schemas__[match.schema].normalize(match, this);
      else this.normalize(match);
      result.push(match);
      pos = candidate.lastIndex;
    }
    if (result.length) return result;
    return null;
  }
  /**
  * Returns fully-formed (not fuzzy) link if it starts at the beginning
  * of the string, and null otherwise.
  *
  * @param text Text to scan.
  */
  matchAtStart(text2) {
    if (!text2.length) return null;
    const m = this.re.get_schema_at_start().exec(text2);
    if (!m) return null;
    const len = this.testSchemaAt(text2, m[2], m[0].length);
    if (!len) return null;
    const match = new Match(text2, m[2], m.index + m[1].length, m.index + m[0].length + len);
    this.__schemas__[match.schema].normalize(match, this);
    return match;
  }
  /**
  * Load (or merge) new TLDs list. Those are used for fuzzy links (without
  * prefix) to avoid false positives. By default this algorithm is used:
  *
  * - hostname with any 2-letter root zones are ok.
  * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
  *   are ok.
  * - encoded (`xn--...`) root zones are ok.
  *
  * If list is replaced, then exact match for 2-chars root zones will be checked.
  *
  * @param list List of TLDs.
  * @param keepOld Merge with current list if `true` (`false` by default).
  */
  tlds(list2, keepOld = false) {
    list2 = Array.isArray(list2) ? list2 : [list2];
    if (!keepOld) this.__opts__.tlds = list2;
    else this.__opts__.tlds = this.__opts__.tlds.concat(list2);
    this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    });
    return this;
  }
  /**
  * Default normalizer (if schema does not define its own).
  *
  * @param match Match to normalize.
  */
  normalize(match) {
    if (!match.schema) match.url = `http://${match.url}`;
    if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) match.url = `mailto:${match.url}`;
  }
};

// node_modules/punycode.js/punycode.es6.js
var maxInt = 2147483647;
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128;
var delimiter = "-";
var regexPunycode = /^xn--/;
var regexNonASCII = /[^\0-\x7F]/;
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
var errors = {
  "overflow": "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
};
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;
function error(type) {
  throw new RangeError(errors[type]);
}
function map(array, callback) {
  const result = [];
  let length = array.length;
  while (length--) {
    result[length] = callback(array[length]);
  }
  return result;
}
function mapDomain(domain, callback) {
  const parts = domain.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    domain = parts[1];
  }
  domain = domain.replace(regexSeparators, ".");
  const labels = domain.split(".");
  const encoded = map(labels, callback).join(".");
  return result + encoded;
}
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      const extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
var ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
var basicToDigit = function(codePoint) {
  if (codePoint >= 48 && codePoint < 58) {
    return 26 + (codePoint - 48);
  }
  if (codePoint >= 65 && codePoint < 91) {
    return codePoint - 65;
  }
  if (codePoint >= 97 && codePoint < 123) {
    return codePoint - 97;
  }
  return base;
};
var digitToBasic = function(digit, flag) {
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
var adapt = function(delta, numPoints, firstTime) {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
var decode2 = function(input) {
  const output = [];
  const inputLength = input.length;
  let i = 0;
  let n = initialN;
  let bias = initialBias;
  let basic = input.lastIndexOf(delimiter);
  if (basic < 0) {
    basic = 0;
  }
  for (let j = 0; j < basic; ++j) {
    if (input.charCodeAt(j) >= 128) {
      error("not-basic");
    }
    output.push(input.charCodeAt(j));
  }
  for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
    const oldi = i;
    for (let w = 1, k = base; ; k += base) {
      if (index >= inputLength) {
        error("invalid-input");
      }
      const digit = basicToDigit(input.charCodeAt(index++));
      if (digit >= base) {
        error("invalid-input");
      }
      if (digit > floor((maxInt - i) / w)) {
        error("overflow");
      }
      i += digit * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (digit < t) {
        break;
      }
      const baseMinusT = base - t;
      if (w > floor(maxInt / baseMinusT)) {
        error("overflow");
      }
      w *= baseMinusT;
    }
    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi == 0);
    if (floor(i / out) > maxInt - n) {
      error("overflow");
    }
    n += floor(i / out);
    i %= out;
    output.splice(i++, 0, n);
  }
  return String.fromCodePoint(...output);
};
var encode2 = function(input) {
  const output = [];
  input = ucs2decode(input);
  const inputLength = input.length;
  let n = initialN;
  let delta = 0;
  let bias = initialBias;
  for (const currentValue of input) {
    if (currentValue < 128) {
      output.push(stringFromCharCode(currentValue));
    }
  }
  const basicLength = output.length;
  let handledCPCount = basicLength;
  if (basicLength) {
    output.push(delimiter);
  }
  while (handledCPCount < inputLength) {
    let m = maxInt;
    for (const currentValue of input) {
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error("overflow");
    }
    delta += (m - n) * handledCPCountPlusOne;
    n = m;
    for (const currentValue of input) {
      if (currentValue < n && ++delta > maxInt) {
        error("overflow");
      }
      if (currentValue === n) {
        let q = delta;
        for (let k = base; ; k += base) {
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) {
            break;
          }
          const qMinusT = q - t;
          const baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }
        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }
    ++delta;
    ++n;
  }
  return output.join("");
};
var toUnicode = function(input) {
  return mapDomain(input, function(string) {
    return regexPunycode.test(string) ? decode2(string.slice(4).toLowerCase()) : string;
  });
};
var toASCII = function(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ? "xn--" + encode2(string) : string;
  });
};
var punycode = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  "version": "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  "ucs2": {
    "decode": ucs2decode,
    "encode": ucs2encode
  },
  "decode": decode2,
  "encode": encode2,
  "toASCII": toASCII,
  "toUnicode": toUnicode
};
var punycode_es6_default = punycode;

// node_modules/markdown-it/dist/markdown-it.mjs
var __defProp2 = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all) __defProp2(target, name, {
    get: all[name],
    enumerable: true
  });
  if (!no_symbols) __defProp2(target, Symbol.toStringTag, { value: "Module" });
  return target;
};
var utils_exports = /* @__PURE__ */ __exportAll({
  arrayReplaceAt: () => arrayReplaceAt,
  asciiTrim: () => asciiTrim,
  callable: () => callable,
  escapeHtml: () => escapeHtml,
  escapeRE: () => escapeRE,
  fromCodePoint: () => fromCodePoint,
  isMdAsciiPunct: () => isMdAsciiPunct,
  isPunctChar: () => isPunctChar,
  isPunctCharCode: () => isPunctCharCode,
  isSpace: () => isSpace,
  isValidEntityCode: () => isValidEntityCode,
  isWhiteSpace: () => isWhiteSpace,
  lib: () => lib,
  normalizeReference: () => normalizeReference,
  unescapeAll: () => unescapeAll,
  unescapeMd: () => unescapeMd
});
function callable(cls) {
  const wrapper = function(...args) {
    return Reflect.construct(cls, args, new.target && new.target !== wrapper ? new.target : cls);
  };
  Object.defineProperty(wrapper, "name", { value: cls.name });
  Object.setPrototypeOf(wrapper, cls);
  wrapper.prototype = cls.prototype;
  return wrapper;
}
function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}
function isValidEntityCode(c) {
  if (c >= 55296 && c <= 57343) return false;
  if (c >= 64976 && c <= 65007) return false;
  if ((c & 65535) === 65535 || (c & 65535) === 65534) return false;
  if (c >= 0 && c <= 8) return false;
  if (c === 11) return false;
  if (c >= 14 && c <= 31) return false;
  if (c >= 127 && c <= 159) return false;
  if (c > 1114111) return false;
  return true;
}
function fromCodePoint(c) {
  if (c > 65535) {
    c -= 65536;
    const surrogate1 = 55296 + (c >> 10);
    const surrogate2 = 56320 + (c & 1023);
    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c);
}
var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
var UNESCAPE_ALL_RE = new RegExp(`${UNESCAPE_MD_RE.source}|${/&([a-z#][a-z0-9]{1,31});/gi.source}`, "gi");
var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function replaceEntityPattern(match, name) {
  if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
    const code3 = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    if (isValidEntityCode(code3)) return fromCodePoint(code3);
    return match;
  }
  const decoded = decodeHTMLStrict(match);
  if (decoded !== match) return decoded;
  return match;
}
function unescapeMd(str) {
  if (str.indexOf("\\") < 0) return str;
  return str.replace(UNESCAPE_MD_RE, "$1");
}
function unescapeAll(str) {
  if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) return str;
  return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity2) {
    if (escaped) return escaped;
    return replaceEntityPattern(match, entity2);
  });
}
var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}
function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  return str;
}
var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
function escapeRE(str) {
  return str.replace(REGEXP_ESCAPE_RE, "\\$&");
}
function isSpace(code3) {
  switch (code3) {
    case 9:
    case 32:
      return true;
  }
  return false;
}
function isWhiteSpace(code3) {
  if (code3 >= 8192 && code3 <= 8202) return true;
  switch (code3) {
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return true;
  }
  return false;
}
function isPunctChar(ch) {
  return P.test(ch) || S.test(ch);
}
function isPunctCharCode(code3) {
  return isPunctChar(fromCodePoint(code3));
}
function isMdAsciiPunct(ch) {
  switch (ch) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function normalizeReference(str) {
  str = str.trim().replace(/\s+/g, " ");
  return str.toLowerCase().toUpperCase();
}
function isAsciiTrimmable(c) {
  return c === 32 || c === 9 || c === 10 || c === 13;
}
function asciiTrim(str) {
  let start = 0;
  for (; start < str.length; start++) if (!isAsciiTrimmable(str.charCodeAt(start))) break;
  let end = str.length - 1;
  for (; end >= start; end--) if (!isAsciiTrimmable(str.charCodeAt(end))) break;
  return str.slice(start, end + 1);
}
var lib = {
  mdurl: mdurl_exports,
  ucmicro: build_exports
};
function parseLinkLabel(state2, start, disableNested) {
  let level, found2, marker, prevPos;
  const max2 = state2.posMax;
  const oldPos = state2.pos;
  state2.pos = start + 1;
  level = 1;
  while (state2.pos < max2) {
    marker = state2.src.charCodeAt(state2.pos);
    if (marker === 93) {
      level--;
      if (level === 0) {
        found2 = true;
        break;
      }
    }
    prevPos = state2.pos;
    state2.md.inline.skipToken(state2);
    if (marker === 91) {
      if (prevPos === state2.pos - 1) level++;
      else if (disableNested) {
        state2.pos = oldPos;
        return -1;
      }
    }
  }
  let labelEnd = -1;
  if (found2) labelEnd = state2.pos;
  state2.pos = oldPos;
  return labelEnd;
}
function parseLinkDestination(str, start, max2) {
  let code3;
  let pos = start;
  const result = {
    ok: false,
    pos: 0,
    str: ""
  };
  if (str.charCodeAt(pos) === 60) {
    pos++;
    while (pos < max2) {
      code3 = str.charCodeAt(pos);
      if (code3 === 10) return result;
      if (code3 === 60) return result;
      if (code3 === 62) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code3 === 92 && pos + 1 < max2) {
        pos += 2;
        continue;
      }
      pos++;
    }
    return result;
  }
  let level = 0;
  while (pos < max2) {
    code3 = str.charCodeAt(pos);
    if (code3 === 32) break;
    if (code3 < 32 || code3 === 127) break;
    if (code3 === 92 && pos + 1 < max2) {
      if (str.charCodeAt(pos + 1) === 32) {
        pos++;
        continue;
      }
      pos += 2;
      continue;
    }
    if (code3 === 40) {
      level++;
      if (level > 32) return result;
    }
    if (code3 === 41) {
      if (level === 0) break;
      level--;
    }
    pos++;
  }
  if (start === pos) return result;
  if (level !== 0) return result;
  result.str = unescapeAll(str.slice(start, pos));
  result.pos = pos;
  result.ok = true;
  return result;
}
function parseLinkTitle(str, start, max2, prev_state) {
  let code3;
  let pos = start;
  const state2 = {
    ok: false,
    can_continue: false,
    pos: 0,
    str: "",
    marker: 0
  };
  if (prev_state) {
    state2.str = prev_state.str;
    state2.marker = prev_state.marker;
  } else {
    if (pos >= max2) return state2;
    let marker = str.charCodeAt(pos);
    if (marker !== 34 && marker !== 39 && marker !== 40) return state2;
    start++;
    pos++;
    if (marker === 40) marker = 41;
    state2.marker = marker;
  }
  while (pos < max2) {
    code3 = str.charCodeAt(pos);
    if (code3 === state2.marker) {
      state2.pos = pos + 1;
      state2.str += unescapeAll(str.slice(start, pos));
      state2.ok = true;
      return state2;
    } else if (code3 === 40 && state2.marker === 41) return state2;
    else if (code3 === 92 && pos + 1 < max2) pos++;
    pos++;
  }
  state2.can_continue = true;
  state2.str += unescapeAll(str.slice(start, pos));
  return state2;
}
var helpers_exports = /* @__PURE__ */ __exportAll({
  parseLinkDestination: () => parseLinkDestination,
  parseLinkLabel: () => parseLinkLabel,
  parseLinkTitle: () => parseLinkTitle
});
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
var Token = class {
  constructor(type, tag2, nesting) {
    _defineProperty(
      this,
      /**
      * Source map info. Format: `[ line_begin, line_end ]`
      */
      "map",
      null
    );
    _defineProperty(
      this,
      /**
      * nesting level, the same as `state.level`
      */
      "level",
      0
    );
    _defineProperty(
      this,
      /**
      * An array of child nodes (inline and img tokens)
      */
      "children",
      null
    );
    _defineProperty(
      this,
      /**
      * In a case of self-closing tag (code, html, fence, etc.),
      * it has contents of this tag.
      */
      "content",
      ""
    );
    _defineProperty(
      this,
      /**
      * '*' or '_' for emphasis, fence string for fence, etc.
      */
      "markup",
      ""
    );
    _defineProperty(
      this,
      /**
      * Additional information:
      *
      * - Info string for "fence" tokens
      * - The value "auto" for autolink "link_open" and "link_close" tokens
      * - The string value of the item marker for ordered-list "list_item_open" tokens
      */
      "info",
      ""
    );
    _defineProperty(
      this,
      /**
      * True for block-level tokens, false for inline tokens.
      * Used in renderer to calculate line breaks
      */
      "block",
      false
    );
    _defineProperty(
      this,
      /**
      * If it's true, ignore this element when rendering. Used for tight lists
      * to hide paragraphs.
      */
      "hidden",
      false
    );
    this.type = type;
    this.tag = tag2;
    this.attrs = null;
    this.nesting = nesting;
    this.meta = null;
  }
  /**
  * Search attribute index by name.
  */
  attrIndex(name) {
    if (!this.attrs) return -1;
    const attrs2 = this.attrs;
    for (let i = 0, len = attrs2.length; i < len; i++) if (attrs2[i][0] === name) return i;
    return -1;
  }
  /**
  * Add `[ name, value ]` attribute to list. Init attrs if necessary
  */
  attrPush(attrData) {
    if (this.attrs) this.attrs.push(attrData);
    else this.attrs = [attrData];
  }
  /**
  * Set `name` attribute to `value`. Override old value if exists.
  */
  attrSet(name, value) {
    const idx = this.attrIndex(name);
    const attrData = [name, value];
    if (idx < 0) this.attrPush(attrData);
    else this.attrs[idx] = attrData;
  }
  /**
  * Get the value of attribute `name`, or null if it does not exist.
  */
  attrGet(name) {
    const idx = this.attrIndex(name);
    let value = null;
    if (idx >= 0) value = this.attrs[idx][1];
    return value;
  }
  /**
  * Join value to existing attribute via space. Or create new attribute if not
  * exists. Useful to operate with token classes.
  */
  attrJoin(name, value) {
    const idx = this.attrIndex(name);
    if (idx < 0) this.attrPush([name, value]);
    else this.attrs[idx][1] = `${this.attrs[idx][1]} ${value}`;
  }
};
var Ruler = class {
  constructor() {
    _defineProperty(
      this,
      /** @internal */
      "__rules__",
      []
    );
    _defineProperty(
      this,
      /** @internal */
      "__cache__",
      null
    );
  }
  /** @internal */
  __find__(name) {
    for (let i = 0; i < this.__rules__.length; i++) if (this.__rules__[i].name === name) return i;
    return -1;
  }
  /** @internal */
  __compile__() {
    const chains = /* @__PURE__ */ new Set();
    this.__rules__.forEach((rule) => {
      if (!rule.enabled) return;
      rule.alt.forEach((altName) => {
        if (altName) chains.add(altName);
      });
    });
    this.__cache__ = /* @__PURE__ */ Object.create(null);
    this.__cache__[""] = [];
    this.__rules__.forEach((rule) => {
      if (rule.enabled) this.__cache__[""].push(rule.fn);
    });
    chains.forEach((chain) => {
      this.__cache__[chain] = [];
      this.__rules__.forEach((rule) => {
        if (rule.enabled && rule.alt.indexOf(chain) >= 0) this.__cache__[chain].push(rule.fn);
      });
    });
  }
  /**
  * Replace rule by name with new function & options. Throws error if name not
  * found.
  *
  * @example Replace existing typographer replacement rule with new one
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.core.ruler.at('replacements', function replace(state) {
  *   //...
  * });
  * ```
  */
  at(name, fn, options = {}) {
    const index = this.__find__(name);
    if (index === -1) throw new Error(`Parser rule not found: ${name}`);
    this.__rules__[index].fn = fn;
    this.__rules__[index].alt = options.alt || [];
    this.__cache__ = null;
  }
  /**
  * Add new rule to chain before one with given name. See also
  * {@link Ruler.after}, {@link Ruler.push}.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
  *   //...
  * });
  * ```
  */
  before(beforeName, ruleName, fn, options = {}) {
    const index = this.__find__(beforeName);
    if (index === -1) throw new Error(`Parser rule not found: ${beforeName}`);
    this.__rules__.splice(index, 0, {
      name: ruleName,
      enabled: true,
      fn,
      alt: options.alt || []
    });
    this.__cache__ = null;
  }
  /**
  * Add new rule to chain after one with given name. See also
  * {@link Ruler.before}, {@link Ruler.push}.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.inline.ruler.after('text', 'my_rule', function replace(state) {
  *   //...
  * });
  * ```
  */
  after(afterName, ruleName, fn, options = {}) {
    const index = this.__find__(afterName);
    if (index === -1) throw new Error(`Parser rule not found: ${afterName}`);
    this.__rules__.splice(index + 1, 0, {
      name: ruleName,
      enabled: true,
      fn,
      alt: options.alt || []
    });
    this.__cache__ = null;
  }
  /**
  * Push new rule to the end of chain. See also
  * {@link Ruler.before}, {@link Ruler.after}.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.core.ruler.push('my_rule', function replace(state) {
  *   //...
  * });
  * ```
  */
  push(ruleName, fn, options = {}) {
    this.__rules__.push({
      name: ruleName,
      enabled: true,
      fn,
      alt: options.alt || []
    });
    this.__cache__ = null;
  }
  /**
  * Enable rules with given names. If any rule name not found - throw Error.
  * Errors can be disabled by second param.
  *
  * See also {@link Ruler.disable}, {@link Ruler.enableOnly}.
  *
  * Returns list of found rule names (if no exception happened).
  */
  enable(list2, ignoreInvalid = false) {
    if (!Array.isArray(list2)) list2 = [list2];
    const result = [];
    list2.forEach((name) => {
      const idx = this.__find__(name);
      if (idx < 0) {
        if (ignoreInvalid) return;
        throw new Error(`Rules manager: invalid rule name ${name}`);
      }
      this.__rules__[idx].enabled = true;
      result.push(name);
    });
    this.__cache__ = null;
    return result;
  }
  /**
  * Enable rules with given names, and disable everything else. If any rule name
  * not found - throw Error. Errors can be disabled by second param.
  *
  * See also {@link Ruler.disable}, {@link Ruler.enable}.
  */
  enableOnly(list2, ignoreInvalid = false) {
    if (!Array.isArray(list2)) list2 = [list2];
    this.__rules__.forEach((rule) => {
      rule.enabled = false;
    });
    this.enable(list2, ignoreInvalid);
  }
  /**
  * Disable rules with given names. If any rule name not found - throw Error.
  * Errors can be disabled by second param.
  *
  * See also {@link Ruler.enable}, {@link Ruler.enableOnly}.
  *
  * Returns list of found rule names (if no exception happened).
  */
  disable(list2, ignoreInvalid = false) {
    if (!Array.isArray(list2)) list2 = [list2];
    const result = [];
    list2.forEach((name) => {
      const idx = this.__find__(name);
      if (idx < 0) {
        if (ignoreInvalid) return;
        throw new Error(`Rules manager: invalid rule name ${name}`);
      }
      this.__rules__[idx].enabled = false;
      result.push(name);
    });
    this.__cache__ = null;
    return result;
  }
  /**
  * Return array of active functions (rules) for given chain name. It analyzes
  * rules configuration, compiles caches if not exists and returns result.
  *
  * Default chain name is `''` (empty string). It can't be skipped. That's
  * done intentionally, to keep signature monomorphic for high speed.
  */
  getRules(chainName) {
    if (!this.__cache__) this.__compile__();
    return this.__cache__[chainName] || [];
  }
};
var default_rules = {};
default_rules.code_inline = function(tokens, idx, options, env, slf) {
  const token3 = tokens[idx];
  return `<code${slf.renderAttrs(token3)}>${escapeHtml(token3.content)}</code>`;
};
default_rules.code_block = function(tokens, idx, options, env, slf) {
  const token3 = tokens[idx];
  return `<pre${slf.renderAttrs(token3)}><code>${escapeHtml(tokens[idx].content)}</code></pre>
`;
};
default_rules.fence = function(tokens, idx, options, env, slf) {
  const token3 = tokens[idx];
  const info = token3.info ? unescapeAll(token3.info).trim() : "";
  let langName = "";
  let langAttrs = "";
  if (info) {
    const arr = info.split(/(\s+)/g);
    langName = arr[0];
    langAttrs = arr.slice(2).join("");
  }
  let highlighted;
  if (options.highlight) highlighted = options.highlight(token3.content, langName, langAttrs) || escapeHtml(token3.content);
  else highlighted = escapeHtml(token3.content);
  if (highlighted.indexOf("<pre") === 0) return highlighted + "\n";
  if (info) {
    const i = token3.attrIndex("class");
    const tmpAttrs = token3.attrs ? token3.attrs.slice() : [];
    if (i < 0) tmpAttrs.push(["class", `${options.langPrefix}${langName}`]);
    else {
      tmpAttrs[i] = [tmpAttrs[i][0], tmpAttrs[i][1]];
      tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`;
    }
    const tmpToken = { attrs: tmpAttrs };
    return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>
`;
  }
  return `<pre><code${slf.renderAttrs(token3)}>${highlighted}</code></pre>
`;
};
default_rules.image = function(tokens, idx, options, env, slf) {
  const token3 = tokens[idx];
  token3.attrs[token3.attrIndex("alt")][1] = slf.renderInlineAsText(token3.children, options, env);
  return slf.renderToken(tokens, idx, options);
};
default_rules.hardbreak = function(tokens, idx, options) {
  return options.xhtmlOut ? "<br />\n" : "<br>\n";
};
default_rules.softbreak = function(tokens, idx, options) {
  return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
};
default_rules.text = function(tokens, idx) {
  return escapeHtml(tokens[idx].content);
};
default_rules.html_block = function(tokens, idx) {
  return tokens[idx].content;
};
default_rules.html_inline = function(tokens, idx) {
  return tokens[idx].content;
};
var Renderer = class {
  constructor() {
    _defineProperty(
      this,
      /**
      * Contains render rules for tokens. Can be updated and extended.
      *
      * See [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts)
      * for more details and examples.
      *
      * @example Custom render rules
      * ```javascript
      * import MarkdownIt from 'markdown-it'
      * const md = new MarkdownIt()
      *
      * md.renderer.rules.strong_open  = function () { return '<b>'; };
      * md.renderer.rules.strong_close = function () { return '</b>'; };
      *
      * const result = md.renderInline(...);
      * ```
      *
      * @example Each rule is called as independent static function with fixed signature
      * ```javascript
      * function my_token_render(tokens, idx, options, env, renderer) {
      *   // ...
      *   return renderedHTML;
      * }
      * ```
      */
      "rules",
      Object.assign({}, default_rules)
    );
  }
  /**
  * Render token attributes to string.
  */
  renderAttrs(token3) {
    let i, l, result;
    if (!token3.attrs) return "";
    result = "";
    for (i = 0, l = token3.attrs.length; i < l; i++) result += ` ${escapeHtml(token3.attrs[i][0])}="${escapeHtml(String(token3.attrs[i][1]))}"`;
    return result;
  }
  /**
  * Default token renderer. Can be overriden by custom function
  * in {@link Renderer.rules}.
  */
  renderToken(tokens, idx, options) {
    const token3 = tokens[idx];
    let result = "";
    if (token3.hidden) return "";
    let prev = idx - 1;
    while (prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === 0) prev--;
    if (token3.block && token3.nesting !== -1 && prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === -1) result += "\n";
    result += (token3.nesting === -1 ? "</" : "<") + token3.tag;
    result += this.renderAttrs(token3);
    if (token3.nesting === 0 && options.xhtmlOut) result += " /";
    let needLf = false;
    if (token3.block) {
      needLf = true;
      if (token3.nesting === 1) {
        let next = idx + 1;
        while (next < tokens.length && tokens[next].hidden && tokens[next].nesting === 0) next++;
        if (next < tokens.length) {
          const nextToken = tokens[next];
          if (nextToken.type === "inline" || nextToken.hidden) needLf = false;
          else if (nextToken.nesting === -1 && nextToken.tag === token3.tag) needLf = false;
        }
      }
    }
    result += needLf ? ">\n" : ">";
    return result;
  }
  /**
  * The same as {@link Renderer.render}, but for single token of `inline` type.
  */
  renderInline(tokens, options, env) {
    let result = "";
    const rules = this.rules;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const type = tokens[i].type;
      if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
      else result += this.renderToken(tokens, i, options);
    }
    return result;
  }
  /**
  * Special kludge for image `alt` attributes to conform CommonMark spec.
  * Don't try to use it! Spec requires to show `alt` content with stripped markup,
  * instead of simple escaping.
  */
  renderInlineAsText(tokens, options, env) {
    let result = "";
    for (let i = 0, len = tokens.length; i < len; i++) switch (tokens[i].type) {
      case "text":
      case "code_inline":
        result += tokens[i].content;
        break;
      case "image":
        result += this.renderInlineAsText(tokens[i].children, options, env);
        break;
      case "html_inline":
      case "html_block":
        result += tokens[i].content;
        break;
      case "softbreak":
      case "hardbreak":
        result += "\n";
    }
    return result;
  }
  /**
  * Takes token stream and generates HTML. Probably, you will never need to call
  * this method directly.
  */
  render(tokens, options, env) {
    let result = "";
    const rules = this.rules;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const type = tokens[i].type;
      if (type === "inline") result += this.renderInline(tokens[i].children, options, env);
      else if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
      else result += this.renderToken(tokens, i, options);
    }
    return result;
  }
};
var StateCore = class {
  constructor(src, md, env) {
    _defineProperty(this, "tokens", []);
    _defineProperty(this, "inlineMode", false);
    _defineProperty(this, "Token", Token);
    this.src = src;
    this.env = env;
    this.md = md;
  }
};
var UNNORMALIZED_NEWLINE_RE = /\r\n?/g;
var NULL_RE = /\0/g;
function normalize(state2) {
  let str;
  str = state2.src.replace(UNNORMALIZED_NEWLINE_RE, "\n");
  str = str.replace(NULL_RE, "\uFFFD");
  state2.src = str;
}
function block(state2) {
  let token3;
  if (state2.inlineMode) {
    token3 = new state2.Token("inline", "", 0);
    token3.content = state2.src;
    token3.map = [0, 1];
    token3.children = [];
    state2.tokens.push(token3);
  } else state2.md.block.parse(state2.src, state2.md, state2.env, state2.tokens);
}
function strip_references(state2) {
  const tokens = state2.tokens;
  let last = 0;
  for (let curr = 0; curr < tokens.length; curr++) {
    if (tokens[curr].type === "reference_definition") continue;
    if (curr !== last) tokens[last] = tokens[curr];
    last++;
  }
  if (tokens.length !== last) tokens.length = last;
}
function inline(state2) {
  const tokens = state2.tokens;
  for (let i = 0, l = tokens.length; i < l; i++) {
    const tok = tokens[i];
    if (tok.type === "inline") state2.md.inline.parse(tok.content, state2.md, state2.env, tok.children);
  }
}
function isLinkOpen$1(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose$1(str) {
  return /^<\/a\s*>/i.test(str);
}
function linkify$1(state2) {
  const blockTokens = state2.tokens;
  if (!state2.md.options.linkify) return;
  for (let j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== "inline" || !state2.md.linkify.test(blockTokens[j].content)) continue;
    const tokens = blockTokens[j].children;
    const replacements = [];
    let htmlLinkLevel = 0;
    for (let i = tokens.length - 1; i >= 0; i--) {
      const currentToken = tokens[i];
      if (currentToken.type === "link_close") {
        i--;
        while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") i--;
        continue;
      }
      if (currentToken.type === "html_inline") {
        if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) htmlLinkLevel--;
        if (isLinkClose$1(currentToken.content)) htmlLinkLevel++;
      }
      if (htmlLinkLevel > 0) continue;
      if (currentToken.type === "text" && state2.md.linkify.test(currentToken.content)) {
        const text2 = currentToken.content;
        let links = state2.md.linkify.match(text2);
        const nodes = [];
        let level = currentToken.level;
        let lastPos = 0;
        if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") links = links.slice(1);
        for (let ln = 0; ln < links.length; ln++) {
          const url = links[ln].url;
          const fullUrl = state2.md.normalizeLink(url);
          if (!state2.md.validateLink(fullUrl)) continue;
          let urlText = links[ln].text;
          if (!links[ln].schema) urlText = state2.md.normalizeLinkText(`http://${urlText}`).replace(/^http:\/\//, "");
          else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state2.md.normalizeLinkText(`mailto:${urlText}`).replace(/^mailto:/, "");
          else urlText = state2.md.normalizeLinkText(urlText);
          const pos = links[ln].index;
          if (pos > lastPos) {
            const token3 = new state2.Token("text", "", 0);
            token3.content = text2.slice(lastPos, pos);
            token3.level = level;
            nodes.push(token3);
          }
          const token_o = new state2.Token("link_open", "a", 1);
          token_o.attrs = [["href", fullUrl]];
          token_o.level = level++;
          token_o.markup = "linkify";
          token_o.info = "auto";
          nodes.push(token_o);
          const token_t = new state2.Token("text", "", 0);
          token_t.content = urlText;
          token_t.level = level;
          nodes.push(token_t);
          const token_c = new state2.Token("link_close", "a", -1);
          token_c.level = --level;
          token_c.markup = "linkify";
          token_c.info = "auto";
          nodes.push(token_c);
          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text2.length) {
          const token3 = new state2.Token("text", "", 0);
          token3.content = text2.slice(lastPos);
          token3.level = level;
          nodes.push(token3);
        }
        replacements.push({
          index: i,
          nodes
        });
      }
    }
    if (replacements.length > 0) {
      let newTokensLength = tokens.length;
      for (const replacement of replacements) newTokensLength += replacement.nodes.length - 1;
      const newTokens = new Array(newTokensLength);
      let replacementIndex = 0;
      let newTokenIndex = 0;
      replacements.reverse();
      for (let i = 0; i < tokens.length; i++) {
        const replacement = replacements[replacementIndex];
        if ((replacement === null || replacement === void 0 ? void 0 : replacement.index) === i) {
          for (const node of replacement.nodes) newTokens[newTokenIndex++] = node;
          replacementIndex++;
        } else newTokens[newTokenIndex++] = tokens[i];
      }
      blockTokens[j].children = newTokens;
    }
  }
}
var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
var SCOPED_ABBR_RE = /\((c|tm|r)\)/gi;
var SCOPED_ABBR = {
  c: "\xA9",
  r: "\xAE",
  tm: "\u2122"
};
function replaceFn(match, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}
function replace_scoped(inlineTokens) {
  let inside_autolink = 0;
  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token3 = inlineTokens[i];
    if (token3.type === "text" && !inside_autolink) token3.content = token3.content.replace(SCOPED_ABBR_RE, replaceFn);
    if (token3.type === "link_open" && token3.info === "auto") inside_autolink--;
    if (token3.type === "link_close" && token3.info === "auto") inside_autolink++;
  }
}
function replace_rare(inlineTokens) {
  let inside_autolink = 0;
  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token3 = inlineTokens[i];
    if (token3.type === "text" && !inside_autolink) {
      if (RARE_RE.test(token3.content)) token3.content = token3.content.replace(/\+-/g, "\xB1").replace(/\.{2,}/g, "\u2026").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1\u2014").replace(/(^|\s)--(?=\s|$)/gm, "$1\u2013").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1\u2013");
    }
    if (token3.type === "link_open" && token3.info === "auto") inside_autolink--;
    if (token3.type === "link_close" && token3.info === "auto") inside_autolink++;
  }
}
function replace(state2) {
  let blkIdx;
  if (!state2.md.options.typographer) return;
  for (blkIdx = state2.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state2.tokens[blkIdx].type !== "inline") continue;
    if (SCOPED_ABBR_TEST_RE.test(state2.tokens[blkIdx].content)) replace_scoped(state2.tokens[blkIdx].children);
    if (RARE_RE.test(state2.tokens[blkIdx].content)) replace_rare(state2.tokens[blkIdx].children);
  }
}
var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var APOSTROPHE = "\u2019";
var MAX_OPENERS = 1e3;
function truncateStack(stack, heads, length) {
  while (stack.length > length) {
    const item = stack.pop();
    if (item.isSingleQuote) heads.single = item.prevSameQuoteIdx;
    else heads.double = item.prevSameQuoteIdx;
  }
}
function addReplacement(replacements, tokenIdx, pos, ch) {
  if (!replacements[tokenIdx]) replacements[tokenIdx] = [];
  replacements[tokenIdx].push({
    pos,
    ch
  });
}
function applyReplacements(str, replacements) {
  let result = "";
  let lastPos = 0;
  replacements.sort((a, b) => a.pos - b.pos);
  for (let i = 0; i < replacements.length; i++) {
    const replacement = replacements[i];
    result += str.slice(lastPos, replacement.pos) + replacement.ch;
    lastPos = replacement.pos + 1;
  }
  return result + str.slice(lastPos);
}
function process_inlines(tokens, state2) {
  let j;
  const stack = [];
  const heads = {
    single: -1,
    double: -1
  };
  const replacements = {};
  for (let i = 0; i < tokens.length; i++) {
    const token3 = tokens[i];
    const thisLevel = tokens[i].level;
    for (j = stack.length - 1; j >= 0; j--) if (stack[j].level <= thisLevel) break;
    truncateStack(stack, heads, j + 1);
    if (token3.type !== "text") continue;
    const text2 = token3.content;
    let pos = 0;
    const max2 = text2.length;
    OUTER: while (pos < max2) {
      QUOTE_RE.lastIndex = pos;
      const t = QUOTE_RE.exec(text2);
      if (!t) break;
      let canOpen = true;
      let canClose = true;
      pos = t.index + 1;
      const isSingle = t[0] === "'";
      let lastChar = 32;
      if (t.index - 1 >= 0) lastChar = text2.charCodeAt(t.index - 1);
      else for (j = i - 1; j >= 0; j--) {
        if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
        if (!tokens[j].content) continue;
        lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
        break;
      }
      let nextChar = 32;
      if (pos < max2) nextChar = text2.charCodeAt(pos);
      else for (j = i + 1; j < tokens.length; j++) {
        if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
        if (!tokens[j].content) continue;
        nextChar = tokens[j].content.charCodeAt(0);
        break;
      }
      const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
      const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
      const isLastWhiteSpace = isWhiteSpace(lastChar);
      const isNextWhiteSpace = isWhiteSpace(nextChar);
      if (isNextWhiteSpace) canOpen = false;
      else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) canOpen = false;
      }
      if (isLastWhiteSpace) canClose = false;
      else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) canClose = false;
      }
      if (nextChar === 34 && t[0] === '"') {
        if (lastChar >= 48 && lastChar <= 57) canClose = canOpen = false;
      }
      if (canOpen && canClose) {
        canOpen = isLastPunctChar;
        canClose = isNextPunctChar;
      }
      if (!canOpen && !canClose) {
        if (isSingle) addReplacement(replacements, i, t.index, APOSTROPHE);
        continue;
      }
      if (canClose) {
        j = isSingle ? heads.single : heads.double;
        if (j >= 0 && stack[j].level === thisLevel) {
          const item = stack[j];
          let openQuote;
          let closeQuote;
          if (isSingle) {
            openQuote = state2.md.options.quotes[2];
            closeQuote = state2.md.options.quotes[3];
          } else {
            openQuote = state2.md.options.quotes[0];
            closeQuote = state2.md.options.quotes[1];
          }
          addReplacement(replacements, i, t.index, closeQuote);
          addReplacement(replacements, item.tokenIdx, item.contentPos, openQuote);
          truncateStack(stack, heads, j);
          continue OUTER;
        }
      }
      if (canOpen) {
        if (stack.length >= MAX_OPENERS) return;
        stack.push({
          tokenIdx: i,
          contentPos: t.index,
          isSingleQuote: isSingle,
          level: thisLevel,
          prevSameQuoteIdx: isSingle ? heads.single : heads.double
        });
        if (isSingle) heads.single = stack.length - 1;
        else heads.double = stack.length - 1;
      } else if (canClose && isSingle) addReplacement(replacements, i, t.index, APOSTROPHE);
    }
  }
  Object.keys(replacements).forEach(function(tokenIdx) {
    const idx = Number(tokenIdx);
    tokens[idx].content = applyReplacements(tokens[idx].content, replacements[tokenIdx]);
  });
}
function smartquotes(state2) {
  if (!state2.md.options.typographer) return;
  for (let blkIdx = state2.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state2.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state2.tokens[blkIdx].content)) continue;
    process_inlines(state2.tokens[blkIdx].children, state2);
  }
}
function join_alt(tokens) {
  let curr, last;
  const max2 = tokens.length;
  for (curr = 0; curr < max2; curr++) if (tokens[curr].type === "text_special") tokens[curr].type = "text";
  for (curr = last = 0; curr < max2; curr++) if (tokens[curr].type === "text" && curr + 1 < max2 && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
  else {
    if (curr !== last) tokens[last] = tokens[curr];
    last++;
  }
  if (curr !== last) tokens.length = last;
}
function text_join(state2) {
  let curr, last;
  const blockTokens = state2.tokens;
  const l = blockTokens.length;
  for (let j = 0; j < l; j++) {
    if (blockTokens[j].type !== "inline") continue;
    const tokens = blockTokens[j].children;
    const max2 = tokens.length;
    for (curr = 0; curr < max2; curr++) {
      if (tokens[curr].type === "text_special") tokens[curr].type = "text";
      if (tokens[curr].children) join_alt(tokens[curr].children);
    }
    for (curr = last = 0; curr < max2; curr++) if (tokens[curr].type === "text" && curr + 1 < max2 && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    else {
      if (curr !== last) tokens[last] = tokens[curr];
      last++;
    }
    if (curr !== last) tokens.length = last;
  }
}
var _rules$2 = [
  ["normalize", normalize],
  ["block", block],
  ["strip_references", strip_references],
  ["inline", inline],
  ["linkify", linkify$1],
  ["replacements", replace],
  ["smartquotes", smartquotes],
  ["text_join", text_join]
];
var ParserCore = class {
  constructor() {
    _defineProperty(
      this,
      /**
      * {@link Ruler} instance. Keep configuration of core rules.
      */
      "ruler",
      new Ruler()
    );
    _defineProperty(this, "State", StateCore);
    for (let i = 0; i < _rules$2.length; i++) this.ruler.push(_rules$2[i][0], _rules$2[i][1]);
  }
  /**
  * Executes core chain rules.
  */
  process(state2) {
    const rules = this.ruler.getRules("");
    for (let i = 0, l = rules.length; i < l; i++) rules[i](state2);
  }
};
var StateBlock = class {
  constructor(src, md, env, tokens) {
    _defineProperty(this, "bMarks", []);
    _defineProperty(this, "eMarks", []);
    _defineProperty(this, "tShift", []);
    _defineProperty(this, "sCount", []);
    _defineProperty(this, "bsCount", []);
    _defineProperty(this, "blkIndent", 0);
    _defineProperty(this, "line", 0);
    _defineProperty(this, "lineMax", 0);
    _defineProperty(this, "tight", false);
    _defineProperty(this, "listIndent", -1);
    _defineProperty(this, "parentType", "root");
    _defineProperty(this, "level", 0);
    _defineProperty(this, "Token", Token);
    this.src = src;
    this.md = md;
    this.env = env;
    this.tokens = tokens;
    const s = this.src;
    for (let start = 0, pos = 0, indent = 0, offset = 0, len = s.length, indent_found = false; pos < len; pos++) {
      const ch = s.charCodeAt(pos);
      if (!indent_found) {
        if (isSpace(ch)) {
          indent++;
          if (ch === 9) offset += 4 - offset % 4;
          else offset++;
          continue;
        } else indent_found = true;
      }
      if (ch === 10 || pos === len - 1) {
        if (ch !== 10) pos++;
        this.bMarks.push(start);
        this.eMarks.push(pos);
        this.tShift.push(indent);
        this.sCount.push(offset);
        this.bsCount.push(0);
        indent_found = false;
        indent = 0;
        offset = 0;
        start = pos + 1;
      }
    }
    this.bMarks.push(s.length);
    this.eMarks.push(s.length);
    this.tShift.push(0);
    this.sCount.push(0);
    this.bsCount.push(0);
    this.lineMax = this.bMarks.length - 1;
  }
  push(type, tag2, nesting) {
    const token3 = new Token(type, tag2, nesting);
    token3.block = true;
    if (nesting < 0) this.level--;
    token3.level = this.level;
    if (nesting > 0) this.level++;
    this.tokens.push(token3);
    return token3;
  }
  isEmpty(line2) {
    return this.bMarks[line2] + this.tShift[line2] >= this.eMarks[line2];
  }
  skipEmptyLines(from) {
    for (let max2 = this.lineMax; from < max2; from++) if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
    return from;
  }
  skipSpaces(pos) {
    for (let max2 = this.src.length; pos < max2; pos++) if (!isSpace(this.src.charCodeAt(pos))) break;
    return pos;
  }
  skipSpacesBack(pos, min) {
    if (pos <= min) return pos;
    while (pos > min) if (!isSpace(this.src.charCodeAt(--pos))) return pos + 1;
    return pos;
  }
  skipChars(pos, code3) {
    for (let max2 = this.src.length; pos < max2; pos++) if (this.src.charCodeAt(pos) !== code3) break;
    return pos;
  }
  skipCharsBack(pos, code3, min) {
    if (pos <= min) return pos;
    while (pos > min) if (code3 !== this.src.charCodeAt(--pos)) return pos + 1;
    return pos;
  }
  getLines(begin, end, indent, keepLastLF) {
    if (begin >= end) return "";
    const queue = new Array(end - begin);
    for (let i = 0, line2 = begin; line2 < end; line2++, i++) {
      let lineIndent = 0;
      const lineStart = this.bMarks[line2];
      let first2 = lineStart;
      let last;
      if (line2 + 1 < end || keepLastLF) last = this.eMarks[line2] + 1;
      else last = this.eMarks[line2];
      while (first2 < last && lineIndent < indent) {
        const ch = this.src.charCodeAt(first2);
        if (isSpace(ch)) {
          if (ch === 9) lineIndent += 4 - (lineIndent + this.bsCount[line2]) % 4;
          else lineIndent++;
        } else if (first2 - lineStart < this.tShift[line2]) lineIndent++;
        else break;
        first2++;
      }
      if (lineIndent > indent) queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first2, last);
      else queue[i] = this.src.slice(first2, last);
    }
    return queue.join("");
  }
};
var MAX_AUTOCOMPLETED_CELLS = 65536;
function getLine(state2, line2) {
  const pos = state2.bMarks[line2] + state2.tShift[line2];
  const max2 = state2.eMarks[line2];
  return state2.src.slice(pos, max2);
}
function escapedSplit(str) {
  const result = [];
  const max2 = str.length;
  let pos = 0;
  let ch = str.charCodeAt(pos);
  let isEscaped = false;
  let lastPos = 0;
  let current2 = "";
  while (pos < max2) {
    if (ch === 124) {
      if (!isEscaped) {
        result.push(current2 + str.substring(lastPos, pos));
        current2 = "";
        lastPos = pos + 1;
      } else {
        current2 += str.substring(lastPos, pos - 1);
        lastPos = pos;
      }
    }
    isEscaped = ch === 92;
    pos++;
    ch = str.charCodeAt(pos);
  }
  result.push(current2 + str.substring(lastPos));
  return result;
}
function table(state2, startLine, endLine, silent) {
  if (startLine + 2 > endLine) return false;
  let nextLine = startLine + 1;
  if (state2.sCount[nextLine] < state2.blkIndent) return false;
  if (state2.sCount[nextLine] - state2.blkIndent >= 4) return false;
  let pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
  if (pos >= state2.eMarks[nextLine]) return false;
  const firstCh = state2.src.charCodeAt(pos++);
  if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) return false;
  if (pos >= state2.eMarks[nextLine]) return false;
  const secondCh = state2.src.charCodeAt(pos++);
  if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) return false;
  if (firstCh === 45 && isSpace(secondCh)) return false;
  while (pos < state2.eMarks[nextLine]) {
    const ch = state2.src.charCodeAt(pos);
    if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) return false;
    pos++;
  }
  let lineText = getLine(state2, startLine + 1);
  let columns = lineText.split("|");
  const aligns = [];
  for (let i = 0; i < columns.length; i++) {
    const t = columns[i].trim();
    if (!t) {
      if (i === 0 || i === columns.length - 1) continue;
      else return false;
    }
    if (!/^:?-+:?$/.test(t)) return false;
    if (t.charCodeAt(t.length - 1) === 58) aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
    else if (t.charCodeAt(0) === 58) aligns.push("left");
    else aligns.push("");
  }
  lineText = getLine(state2, startLine).trim();
  if (lineText.indexOf("|") === -1) return false;
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  columns = escapedSplit(lineText);
  if (columns.length && columns[0] === "") columns.shift();
  if (columns.length && columns[columns.length - 1] === "") columns.pop();
  const columnCount = columns.length;
  if (columnCount === 0 || columnCount !== aligns.length) return false;
  if (silent) return true;
  const oldParentType = state2.parentType;
  state2.parentType = "table";
  const terminatorRules = state2.md.block.ruler.getRules("blockquote");
  const token_to = state2.push("table_open", "table", 1);
  const tableLines = [startLine, 0];
  token_to.map = tableLines;
  const token_tho = state2.push("thead_open", "thead", 1);
  token_tho.map = [startLine, startLine + 1];
  const token_htro = state2.push("tr_open", "tr", 1);
  token_htro.map = [startLine, startLine + 1];
  for (let i = 0; i < columns.length; i++) {
    const token_ho = state2.push("th_open", "th", 1);
    if (aligns[i]) token_ho.attrs = [["style", `text-align:${aligns[i]}`]];
    const token_il = state2.push("inline", "", 0);
    token_il.content = columns[i].trim();
    token_il.children = [];
    state2.push("th_close", "th", -1);
  }
  state2.push("tr_close", "tr", -1);
  state2.push("thead_close", "thead", -1);
  let tbodyLines;
  let autocompletedCells = 0;
  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state2.sCount[nextLine] < state2.blkIndent) break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
    lineText = getLine(state2, nextLine).trim();
    if (!lineText) break;
    if (state2.sCount[nextLine] - state2.blkIndent >= 4) break;
    columns = escapedSplit(lineText);
    if (columns.length && columns[0] === "") columns.shift();
    if (columns.length && columns[columns.length - 1] === "") columns.pop();
    autocompletedCells += columnCount - columns.length;
    if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) break;
    if (nextLine === startLine + 2) {
      const token_tbo = state2.push("tbody_open", "tbody", 1);
      token_tbo.map = tbodyLines = [startLine + 2, 0];
    }
    const token_tro = state2.push("tr_open", "tr", 1);
    token_tro.map = [nextLine, nextLine + 1];
    for (let i = 0; i < columnCount; i++) {
      const token_tdo = state2.push("td_open", "td", 1);
      if (aligns[i]) token_tdo.attrs = [["style", `text-align:${aligns[i]}`]];
      const token_il = state2.push("inline", "", 0);
      token_il.content = columns[i] ? columns[i].trim() : "";
      token_il.children = [];
      state2.push("td_close", "td", -1);
    }
    state2.push("tr_close", "tr", -1);
  }
  if (tbodyLines) {
    state2.push("tbody_close", "tbody", -1);
    tbodyLines[1] = nextLine;
  }
  state2.push("table_close", "table", -1);
  tableLines[1] = nextLine;
  state2.parentType = oldParentType;
  state2.line = nextLine;
  return true;
}
function code2(state2, startLine, endLine) {
  if (state2.sCount[startLine] - state2.blkIndent < 4) return false;
  let nextLine = startLine + 1;
  let last = nextLine;
  while (nextLine < endLine) {
    if (state2.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }
    if (state2.sCount[nextLine] - state2.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }
  state2.line = last;
  const token3 = state2.push("code_block", "code", 0);
  token3.content = state2.getLines(startLine, last, 4 + state2.blkIndent, false) + "\n";
  token3.map = [startLine, state2.line];
  return true;
}
function fence(state2, startLine, endLine, silent) {
  let pos = state2.bMarks[startLine] + state2.tShift[startLine];
  let max2 = state2.eMarks[startLine];
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  if (pos + 3 > max2) return false;
  const marker = state2.src.charCodeAt(pos);
  if (marker !== 126 && marker !== 96) return false;
  let mem = pos;
  pos = state2.skipChars(pos, marker);
  let len = pos - mem;
  if (len < 3) return false;
  const markup = state2.src.slice(mem, pos);
  const params = state2.src.slice(pos, max2);
  if (marker === 96) {
    if (params.indexOf(String.fromCharCode(marker)) >= 0) return false;
  }
  if (silent) return true;
  let nextLine = startLine;
  let haveEndMarker = false;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) break;
    pos = mem = state2.bMarks[nextLine] + state2.tShift[nextLine];
    max2 = state2.eMarks[nextLine];
    if (pos < max2 && state2.sCount[nextLine] < state2.blkIndent) break;
    if (state2.src.charCodeAt(pos) !== marker) continue;
    if (state2.sCount[nextLine] - state2.blkIndent >= 4) continue;
    pos = state2.skipChars(pos, marker);
    if (pos - mem < len) continue;
    pos = state2.skipSpaces(pos);
    if (pos < max2) continue;
    haveEndMarker = true;
    break;
  }
  len = state2.sCount[startLine];
  state2.line = nextLine + (haveEndMarker ? 1 : 0);
  const token3 = state2.push("fence", "code", 0);
  token3.info = params;
  token3.content = state2.getLines(startLine + 1, nextLine, len, true);
  token3.markup = markup;
  token3.map = [startLine, state2.line];
  return true;
}
function blockquote(state2, startLine, endLine, silent) {
  let pos = state2.bMarks[startLine] + state2.tShift[startLine];
  let max2 = state2.eMarks[startLine];
  const oldLineMax = state2.lineMax;
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  if (state2.src.charCodeAt(pos) !== 62) return false;
  if (silent) return true;
  const oldBMarks = [];
  const oldBSCount = [];
  const oldSCount = [];
  const oldTShift = [];
  const terminatorRules = state2.md.block.ruler.getRules("blockquote");
  const oldParentType = state2.parentType;
  state2.parentType = "blockquote";
  let lastLineEmpty = false;
  let nextLine;
  for (nextLine = startLine; nextLine < endLine; nextLine++) {
    const isOutdented = state2.sCount[nextLine] < state2.blkIndent;
    pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
    max2 = state2.eMarks[nextLine];
    if (pos >= max2) break;
    if (state2.src.charCodeAt(pos++) === 62 && !isOutdented) {
      let initial = state2.sCount[nextLine] + 1;
      let spaceAfterMarker;
      let adjustTab;
      if (state2.src.charCodeAt(pos) === 32) {
        pos++;
        initial++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state2.src.charCodeAt(pos) === 9) {
        spaceAfterMarker = true;
        if ((state2.bsCount[nextLine] + initial) % 4 === 3) {
          pos++;
          initial++;
          adjustTab = false;
        } else adjustTab = true;
      } else spaceAfterMarker = false;
      let offset = initial;
      oldBMarks.push(state2.bMarks[nextLine]);
      state2.bMarks[nextLine] = pos;
      while (pos < max2) {
        const ch = state2.src.charCodeAt(pos);
        if (isSpace(ch)) {
          if (ch === 9) offset += 4 - (offset + state2.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          else offset++;
        } else break;
        pos++;
      }
      lastLineEmpty = pos >= max2;
      oldBSCount.push(state2.bsCount[nextLine]);
      state2.bsCount[nextLine] = state2.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
      oldSCount.push(state2.sCount[nextLine]);
      state2.sCount[nextLine] = offset - initial;
      oldTShift.push(state2.tShift[nextLine]);
      state2.tShift[nextLine] = pos - state2.bMarks[nextLine];
      continue;
    }
    if (lastLineEmpty) break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) {
      state2.lineMax = nextLine;
      if (state2.blkIndent !== 0) {
        oldBMarks.push(state2.bMarks[nextLine]);
        oldBSCount.push(state2.bsCount[nextLine]);
        oldTShift.push(state2.tShift[nextLine]);
        oldSCount.push(state2.sCount[nextLine]);
        state2.sCount[nextLine] -= state2.blkIndent;
      }
      break;
    }
    oldBMarks.push(state2.bMarks[nextLine]);
    oldBSCount.push(state2.bsCount[nextLine]);
    oldTShift.push(state2.tShift[nextLine]);
    oldSCount.push(state2.sCount[nextLine]);
    state2.sCount[nextLine] = -1;
  }
  const oldIndent = state2.blkIndent;
  state2.blkIndent = 0;
  const token_o = state2.push("blockquote_open", "blockquote", 1);
  token_o.markup = ">";
  const lines2 = [startLine, 0];
  token_o.map = lines2;
  state2.md.block.tokenize(state2, startLine, nextLine);
  const token_c = state2.push("blockquote_close", "blockquote", -1);
  token_c.markup = ">";
  state2.lineMax = oldLineMax;
  state2.parentType = oldParentType;
  lines2[1] = state2.line;
  for (let i = 0; i < oldTShift.length; i++) {
    state2.bMarks[i + startLine] = oldBMarks[i];
    state2.tShift[i + startLine] = oldTShift[i];
    state2.sCount[i + startLine] = oldSCount[i];
    state2.bsCount[i + startLine] = oldBSCount[i];
  }
  state2.blkIndent = oldIndent;
  return true;
}
function hr(state2, startLine, endLine, silent) {
  const max2 = state2.eMarks[startLine];
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  let pos = state2.bMarks[startLine] + state2.tShift[startLine];
  const marker = state2.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 95) return false;
  let cnt = 1;
  while (pos < max2) {
    const ch = state2.src.charCodeAt(pos++);
    if (ch !== marker && !isSpace(ch)) return false;
    if (ch === marker) cnt++;
  }
  if (cnt < 3) return false;
  if (silent) return true;
  state2.line = startLine + 1;
  const token3 = state2.push("hr", "hr", 0);
  token3.map = [startLine, state2.line];
  token3.markup = Array(cnt + 1).join(String.fromCharCode(marker));
  return true;
}
function skipBulletListMarker(state2, startLine) {
  const max2 = state2.eMarks[startLine];
  let pos = state2.bMarks[startLine] + state2.tShift[startLine];
  const marker = state2.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 43) return -1;
  if (pos < max2) {
    if (!isSpace(state2.src.charCodeAt(pos))) return -1;
  }
  return pos;
}
function skipOrderedListMarker(state2, startLine) {
  const start = state2.bMarks[startLine] + state2.tShift[startLine];
  const max2 = state2.eMarks[startLine];
  let pos = start;
  if (pos + 1 >= max2) return -1;
  let ch = state2.src.charCodeAt(pos++);
  if (ch < 48 || ch > 57) return -1;
  for (; ; ) {
    if (pos >= max2) return -1;
    ch = state2.src.charCodeAt(pos++);
    if (ch >= 48 && ch <= 57) {
      if (pos - start >= 10) return -1;
      continue;
    }
    if (ch === 41 || ch === 46) break;
    return -1;
  }
  if (pos < max2) {
    ch = state2.src.charCodeAt(pos);
    if (!isSpace(ch)) return -1;
  }
  return pos;
}
function markTightParagraphs(state2, idx) {
  const level = state2.level + 2;
  for (let i = idx + 2, l = state2.tokens.length - 2; i < l; i++) if (state2.tokens[i].level === level && state2.tokens[i].type === "paragraph_open") {
    state2.tokens[i + 2].hidden = true;
    state2.tokens[i].hidden = true;
    i += 2;
  }
}
function list(state2, startLine, endLine, silent) {
  let max2, pos, start, token3;
  let nextLine = startLine;
  let tight = true;
  if (state2.sCount[nextLine] - state2.blkIndent >= 4) return false;
  if (state2.listIndent >= 0 && state2.sCount[nextLine] - state2.listIndent >= 4 && state2.sCount[nextLine] < state2.blkIndent) return false;
  let isTerminatingParagraph = false;
  if (silent && state2.parentType === "paragraph") {
    if (state2.sCount[nextLine] >= state2.blkIndent) isTerminatingParagraph = true;
  }
  let isOrdered;
  let markerValue;
  let posAfterMarker;
  if ((posAfterMarker = skipOrderedListMarker(state2, nextLine)) >= 0) {
    isOrdered = true;
    start = state2.bMarks[nextLine] + state2.tShift[nextLine];
    markerValue = Number(state2.src.slice(start, posAfterMarker - 1));
    if (isTerminatingParagraph && markerValue !== 1) return false;
  } else if ((posAfterMarker = skipBulletListMarker(state2, nextLine)) >= 0) isOrdered = false;
  else return false;
  if (isTerminatingParagraph) {
    if (state2.skipSpaces(posAfterMarker) >= state2.eMarks[nextLine]) return false;
  }
  if (silent) return true;
  const markerCharCode = state2.src.charCodeAt(posAfterMarker - 1);
  const listTokIdx = state2.tokens.length;
  if (isOrdered) {
    token3 = state2.push("ordered_list_open", "ol", 1);
    if (markerValue !== 1) token3.attrs = [["start", markerValue]];
  } else token3 = state2.push("bullet_list_open", "ul", 1);
  const listLines = [nextLine, 0];
  token3.map = listLines;
  token3.markup = String.fromCharCode(markerCharCode);
  let prevEmptyEnd = false;
  const terminatorRules = state2.md.block.ruler.getRules("list");
  const oldParentType = state2.parentType;
  state2.parentType = "list";
  while (nextLine < endLine) {
    pos = posAfterMarker;
    max2 = state2.eMarks[nextLine];
    const initial = state2.sCount[nextLine] + posAfterMarker - (state2.bMarks[nextLine] + state2.tShift[nextLine]);
    let offset = initial;
    while (pos < max2) {
      const ch = state2.src.charCodeAt(pos);
      if (ch === 9) offset += 4 - (offset + state2.bsCount[nextLine]) % 4;
      else if (ch === 32) offset++;
      else break;
      pos++;
    }
    const contentStart = pos;
    let indentAfterMarker;
    if (contentStart >= max2) indentAfterMarker = 1;
    else indentAfterMarker = offset - initial;
    if (indentAfterMarker > 4) indentAfterMarker = 1;
    const indent = initial + indentAfterMarker;
    token3 = state2.push("list_item_open", "li", 1);
    token3.markup = String.fromCharCode(markerCharCode);
    const itemLines = [nextLine, 0];
    token3.map = itemLines;
    if (isOrdered) token3.info = state2.src.slice(start, posAfterMarker - 1);
    const oldTight = state2.tight;
    const oldTShift = state2.tShift[nextLine];
    const oldSCount = state2.sCount[nextLine];
    const oldListIndent = state2.listIndent;
    state2.listIndent = state2.blkIndent;
    state2.blkIndent = indent;
    state2.tight = true;
    state2.tShift[nextLine] = contentStart - state2.bMarks[nextLine];
    state2.sCount[nextLine] = offset;
    if (contentStart >= max2 && state2.isEmpty(nextLine + 1)) state2.line = Math.min(state2.line + 2, endLine);
    else state2.md.block.tokenize(state2, nextLine, endLine);
    if (!state2.tight || prevEmptyEnd) tight = false;
    prevEmptyEnd = state2.line - nextLine > 1 && state2.isEmpty(state2.line - 1);
    state2.blkIndent = state2.listIndent;
    state2.listIndent = oldListIndent;
    state2.tShift[nextLine] = oldTShift;
    state2.sCount[nextLine] = oldSCount;
    state2.tight = oldTight;
    token3 = state2.push("list_item_close", "li", -1);
    token3.markup = String.fromCharCode(markerCharCode);
    nextLine = state2.line;
    itemLines[1] = nextLine;
    if (nextLine >= endLine) break;
    if (state2.sCount[nextLine] < state2.blkIndent) break;
    if (state2.sCount[nextLine] - state2.blkIndent >= 4) break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state2, nextLine);
      if (posAfterMarker < 0) break;
      start = state2.bMarks[nextLine] + state2.tShift[nextLine];
    } else {
      posAfterMarker = skipBulletListMarker(state2, nextLine);
      if (posAfterMarker < 0) break;
    }
    if (markerCharCode !== state2.src.charCodeAt(posAfterMarker - 1)) break;
  }
  if (isOrdered) token3 = state2.push("ordered_list_close", "ol", -1);
  else token3 = state2.push("bullet_list_close", "ul", -1);
  token3.markup = String.fromCharCode(markerCharCode);
  listLines[1] = nextLine;
  state2.line = nextLine;
  state2.parentType = oldParentType;
  if (tight) markTightParagraphs(state2, listTokIdx);
  return true;
}
var MAX_LABEL_LENGTH = 999;
function countCodePoints(str) {
  let length = str.length;
  for (let i = 0; i < str.length - 1; i++) {
    const high = str.charCodeAt(i);
    if (high < 55296 || high > 56319) continue;
    const low = str.charCodeAt(i + 1);
    if (low >= 56320 && low <= 57343) {
      length--;
      i++;
    }
  }
  return length;
}
function lineEnd(state2, line2) {
  return Math.min(state2.eMarks[line2] + 1, state2.src.length);
}
function getNextLinePos(state2, nextLine) {
  const endLine = state2.lineMax;
  if (nextLine >= endLine || state2.isEmpty(nextLine)) return -1;
  let isContinuation = false;
  if (state2.sCount[nextLine] - state2.blkIndent > 3) isContinuation = true;
  if (state2.sCount[nextLine] < 0) isContinuation = true;
  if (!isContinuation) {
    const terminatorRules = state2.md.block.ruler.getRules("reference");
    const oldParentType = state2.parentType;
    state2.parentType = "reference";
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    state2.parentType = oldParentType;
    if (terminate) return -1;
  }
  return state2.bMarks[nextLine] + state2.tShift[nextLine];
}
function reference(state2, startLine, _endLine, silent) {
  const src = state2.src;
  let pos = state2.bMarks[startLine] + state2.tShift[startLine];
  let nextLine = startLine + 1;
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  if (src.charCodeAt(pos) !== 91) return false;
  let max2 = lineEnd(state2, startLine);
  let rawLabel = "";
  let labelEnd = -1;
  let segmentStart = ++pos;
  while (pos < max2) {
    if (rawLabel.length + pos - segmentStart > MAX_LABEL_LENGTH * 2) return false;
    let ch = src.charCodeAt(pos);
    if (ch === 91) return false;
    if (ch === 93) {
      labelEnd = pos;
      break;
    }
    if (ch === 92) ch = src.charCodeAt(++pos);
    if (ch === 10 && pos < max2) {
      const nextPos = getNextLinePos(state2, nextLine);
      if (nextPos < 0) return false;
      rawLabel += src.slice(segmentStart, max2);
      pos = segmentStart = nextPos;
      max2 = lineEnd(state2, nextLine++);
      continue;
    }
    pos++;
  }
  if (labelEnd < 0 || src.charCodeAt(labelEnd + 1) !== 58) return false;
  rawLabel += src.slice(segmentStart, labelEnd);
  if (rawLabel.length > MAX_LABEL_LENGTH && countCodePoints(rawLabel) > MAX_LABEL_LENGTH) return false;
  pos = labelEnd + 2;
  while (pos < max2) {
    const ch = src.charCodeAt(pos);
    if (ch === 10) {
      const nextPos = getNextLinePos(state2, nextLine);
      if (nextPos < 0) break;
      pos = nextPos;
      max2 = lineEnd(state2, nextLine++);
    } else if (isSpace(ch)) pos++;
    else break;
  }
  const destRes = state2.md.helpers.parseLinkDestination(src, pos, max2);
  if (!destRes.ok) return false;
  const href = state2.md.normalizeLink(destRes.str);
  if (!state2.md.validateLink(href)) return false;
  pos = destRes.pos;
  const destEndPos = pos;
  const destEndMax = max2;
  const destEndLineNo = nextLine;
  while (pos < max2) {
    const ch = src.charCodeAt(pos);
    if (ch === 10) {
      const nextPos = getNextLinePos(state2, nextLine);
      if (nextPos < 0) break;
      pos = nextPos;
      max2 = lineEnd(state2, nextLine++);
    } else if (isSpace(ch)) pos++;
    else break;
  }
  const titleStart = pos;
  let titleRes = state2.md.helpers.parseLinkTitle(src, pos, max2);
  while (titleRes.can_continue) {
    const nextPos = getNextLinePos(state2, nextLine);
    if (nextPos < 0) break;
    pos = nextPos;
    max2 = lineEnd(state2, nextLine++);
    titleRes = state2.md.helpers.parseLinkTitle(src, pos, max2, titleRes);
  }
  let title;
  if (titleStart !== destEndPos && titleRes.ok) {
    title = titleRes.str;
    pos = titleRes.pos;
  } else {
    title = "";
    pos = destEndPos;
    max2 = destEndMax;
    nextLine = destEndLineNo;
  }
  while (pos < max2) {
    if (!isSpace(src.charCodeAt(pos))) break;
    pos++;
  }
  if (pos < max2 && src.charCodeAt(pos) !== 10) {
    if (title) {
      title = "";
      pos = destEndPos;
      max2 = destEndMax;
      nextLine = destEndLineNo;
      while (pos < max2) {
        if (!isSpace(src.charCodeAt(pos))) break;
        pos++;
      }
    }
  }
  if (pos < max2 && src.charCodeAt(pos) !== 10) return false;
  const label = normalizeReference(rawLabel);
  if (!label) return false;
  if (silent) return true;
  if (typeof state2.env.references === "undefined") state2.env.references = {};
  if (typeof state2.env.references[label] === "undefined") state2.env.references[label] = {
    title,
    href
  };
  const token3 = state2.push("reference_definition", "", 0);
  token3.map = [startLine, nextLine];
  token3.hidden = true;
  const meta = /* @__PURE__ */ Object.create(null);
  meta.label = label;
  token3.meta = meta;
  state2.line = nextLine;
  return true;
}
var html_blocks_default = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
];
var open_tag = `<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>`;
var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
new RegExp(`^(?:${open_tag}|${close_tag}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`);
var HTML_OPEN_CLOSE_TAG_RE = new RegExp(`^(?:${open_tag}|${close_tag})`);
var HTML_SEQUENCES = [
  [
    /^<(script|pre|style|textarea)(?=(\s|>|$))/i,
    /<\/(script|pre|style|textarea)>/i,
    true
  ],
  [
    /^<!--/,
    /-->/,
    true
  ],
  [
    /^<\?/,
    /\?>/,
    true
  ],
  [
    /^<![A-Za-z]/,
    />/,
    true
  ],
  [
    /^<!\[CDATA\[/,
    /\]\]>/,
    true
  ],
  [
    new RegExp(`^</?(${html_blocks_default.join("|")})(?=(\\s|/?>|$))`, "i"),
    /^$/,
    true
  ],
  [
    new RegExp(`${HTML_OPEN_CLOSE_TAG_RE.source}\\s*$`),
    /^$/,
    false
  ]
];
function html_block(state2, startLine, endLine, silent) {
  let pos = state2.bMarks[startLine] + state2.tShift[startLine];
  let max2 = state2.eMarks[startLine];
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  if (!state2.md.options.html) return false;
  if (state2.src.charCodeAt(pos) !== 60) return false;
  let lineText = state2.src.slice(pos, max2);
  let i = 0;
  for (; i < HTML_SEQUENCES.length; i++) if (HTML_SEQUENCES[i][0].test(lineText)) break;
  if (i === HTML_SEQUENCES.length) return false;
  if (silent) return HTML_SEQUENCES[i][2];
  let nextLine = startLine + 1;
  const endsOnBlankLine = HTML_SEQUENCES[i][1].test("");
  if (!HTML_SEQUENCES[i][1].test(lineText)) for (; nextLine < endLine; nextLine++) {
    if (state2.sCount[nextLine] < state2.blkIndent) {
      if (endsOnBlankLine || !state2.isEmpty(nextLine)) break;
    }
    pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
    max2 = state2.eMarks[nextLine];
    lineText = state2.src.slice(pos, max2);
    if (HTML_SEQUENCES[i][1].test(lineText)) {
      if (lineText.length !== 0) nextLine++;
      break;
    }
  }
  state2.line = nextLine;
  const token3 = state2.push("html_block", "", 0);
  token3.map = [startLine, nextLine];
  token3.content = state2.getLines(startLine, nextLine, state2.blkIndent, true);
  return true;
}
function heading(state2, startLine, endLine, silent) {
  let pos = state2.bMarks[startLine] + state2.tShift[startLine];
  let max2 = state2.eMarks[startLine];
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  let ch = state2.src.charCodeAt(pos);
  if (ch !== 35 || pos >= max2) return false;
  let level = 1;
  ch = state2.src.charCodeAt(++pos);
  while (ch === 35 && pos < max2 && level <= 6) {
    level++;
    ch = state2.src.charCodeAt(++pos);
  }
  if (level > 6 || pos < max2 && !isSpace(ch)) return false;
  if (silent) return true;
  max2 = state2.skipSpacesBack(max2, pos);
  const tmp = state2.skipCharsBack(max2, 35, pos);
  if (tmp > pos && isSpace(state2.src.charCodeAt(tmp - 1))) max2 = tmp;
  state2.line = startLine + 1;
  const token_o = state2.push("heading_open", `h${level}`, 1);
  token_o.markup = "########".slice(0, level);
  token_o.map = [startLine, state2.line];
  const token_i = state2.push("inline", "", 0);
  token_i.content = asciiTrim(state2.src.slice(pos, max2));
  token_i.map = [startLine, state2.line];
  token_i.children = [];
  const token_c = state2.push("heading_close", `h${level}`, -1);
  token_c.markup = "########".slice(0, level);
  return true;
}
function lheading(state2, startLine, endLine) {
  const terminatorRules = state2.md.block.ruler.getRules("paragraph");
  if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
  const oldParentType = state2.parentType;
  state2.parentType = "paragraph";
  let level = 0;
  let marker;
  let nextLine = startLine + 1;
  for (; nextLine < endLine && !state2.isEmpty(nextLine); nextLine++) {
    if (state2.sCount[nextLine] - state2.blkIndent > 3) continue;
    if (state2.sCount[nextLine] >= state2.blkIndent) {
      let pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
      const max2 = state2.eMarks[nextLine];
      if (pos < max2) {
        marker = state2.src.charCodeAt(pos);
        if (marker === 45 || marker === 61) {
          pos = state2.skipChars(pos, marker);
          pos = state2.skipSpaces(pos);
          if (pos >= max2) {
            level = marker === 61 ? 1 : 2;
            break;
          }
        }
      }
    }
    if (state2.sCount[nextLine] < 0) continue;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
  }
  if (!level) {
    state2.parentType = oldParentType;
    return false;
  }
  const content2 = asciiTrim(state2.getLines(startLine, nextLine, state2.blkIndent, false));
  state2.line = nextLine + 1;
  const token_o = state2.push("heading_open", `h${level}`, 1);
  token_o.markup = String.fromCharCode(marker);
  token_o.map = [startLine, state2.line];
  const token_i = state2.push("inline", "", 0);
  token_i.content = content2;
  token_i.map = [startLine, state2.line - 1];
  token_i.children = [];
  const token_c = state2.push("heading_close", `h${level}`, -1);
  token_c.markup = String.fromCharCode(marker);
  state2.parentType = oldParentType;
  return true;
}
function paragraph(state2, startLine, endLine) {
  const terminatorRules = state2.md.block.ruler.getRules("paragraph");
  const oldParentType = state2.parentType;
  let nextLine = startLine + 1;
  state2.parentType = "paragraph";
  for (; nextLine < endLine && !state2.isEmpty(nextLine); nextLine++) {
    if (state2.sCount[nextLine] - state2.blkIndent > 3) continue;
    if (state2.sCount[nextLine] < 0) continue;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
  }
  const content2 = asciiTrim(state2.getLines(startLine, nextLine, state2.blkIndent, false));
  state2.line = nextLine;
  const token_o = state2.push("paragraph_open", "p", 1);
  token_o.map = [startLine, state2.line];
  const token_i = state2.push("inline", "", 0);
  token_i.content = content2;
  token_i.map = [startLine, state2.line];
  token_i.children = [];
  state2.push("paragraph_close", "p", -1);
  state2.parentType = oldParentType;
  return true;
}
var _rules$1 = [
  [
    "table",
    table,
    ["paragraph", "reference"]
  ],
  ["code", code2],
  [
    "fence",
    fence,
    [
      "paragraph",
      "reference",
      "blockquote",
      "list"
    ]
  ],
  [
    "blockquote",
    blockquote,
    [
      "paragraph",
      "reference",
      "blockquote",
      "list"
    ]
  ],
  [
    "hr",
    hr,
    [
      "paragraph",
      "reference",
      "blockquote",
      "list"
    ]
  ],
  [
    "list",
    list,
    [
      "paragraph",
      "reference",
      "blockquote"
    ]
  ],
  ["reference", reference],
  [
    "html_block",
    html_block,
    [
      "paragraph",
      "reference",
      "blockquote"
    ]
  ],
  [
    "heading",
    heading,
    [
      "paragraph",
      "reference",
      "blockquote"
    ]
  ],
  ["lheading", lheading],
  ["paragraph", paragraph]
];
var ParserBlock = class {
  constructor() {
    _defineProperty(
      this,
      /**
      * {@link Ruler} instance. Keep configuration of block rules.
      */
      "ruler",
      new Ruler()
    );
    _defineProperty(this, "State", StateBlock);
    for (let i = 0; i < _rules$1.length; i++) this.ruler.push(_rules$1[i][0], _rules$1[i][1], { alt: (_rules$1[i][2] || []).slice() });
  }
  tokenize(state2, startLine, endLine) {
    const rules = this.ruler.getRules("");
    const len = rules.length;
    const maxNesting = state2.md.options.maxNesting;
    let line2 = startLine;
    let hasEmptyLines = false;
    while (line2 < endLine) {
      state2.line = line2 = state2.skipEmptyLines(line2);
      if (line2 >= endLine) break;
      if (state2.sCount[line2] < state2.blkIndent) break;
      if (state2.level >= maxNesting) {
        state2.line = endLine;
        break;
      }
      const prevLine = state2.line;
      let ok = false;
      for (let i = 0; i < len; i++) {
        ok = rules[i](state2, line2, endLine, false);
        if (ok) {
          if (prevLine >= state2.line) throw new Error("block rule didn't increment state.line");
          break;
        }
      }
      if (!ok) throw new Error("none of the block rules matched");
      state2.tight = !hasEmptyLines;
      if (state2.isEmpty(state2.line - 1)) hasEmptyLines = true;
      line2 = state2.line;
      if (line2 < endLine && state2.isEmpty(line2)) {
        hasEmptyLines = true;
        line2++;
        state2.line = line2;
      }
    }
  }
  /**
  * Process input string and push block tokens into `outTokens`
  */
  parse(src, md, env, outTokens) {
    if (!src) return;
    const state2 = new this.State(src, md, env, outTokens);
    this.tokenize(state2, state2.line, state2.lineMax);
  }
};
var StateInline = class {
  constructor(src, md, env, outTokens) {
    _defineProperty(this, "pos", 0);
    _defineProperty(this, "level", 0);
    _defineProperty(this, "pending", "");
    _defineProperty(this, "pendingLevel", 0);
    _defineProperty(this, "cache", {});
    _defineProperty(this, "backticks", {});
    _defineProperty(this, "backticksScanned", false);
    _defineProperty(this, "skipHtmlSpecial", false);
    _defineProperty(this, "linkLevel", 0);
    _defineProperty(this, "delimiters", []);
    _defineProperty(this, "_prev_delimiters", []);
    _defineProperty(this, "Token", Token);
    this.src = src;
    this.env = env;
    this.md = md;
    this.tokens = outTokens;
    this.tokens_meta = Array(outTokens.length);
    this.posMax = this.src.length;
  }
  pushPending() {
    const token3 = new Token("text", "", 0);
    token3.content = this.pending;
    token3.level = this.pendingLevel;
    this.tokens.push(token3);
    this.pending = "";
    return token3;
  }
  push(type, tag2, nesting) {
    if (this.pending) this.pushPending();
    const token3 = new Token(type, tag2, nesting);
    let token_meta = void 0;
    if (nesting < 0) {
      this.level--;
      this.delimiters = this._prev_delimiters.pop();
    }
    token3.level = this.level;
    if (nesting > 0) {
      this.level++;
      this._prev_delimiters.push(this.delimiters);
      this.delimiters = [];
      token_meta = { delimiters: this.delimiters };
    }
    this.pendingLevel = this.level;
    this.tokens.push(token3);
    this.tokens_meta.push(token_meta);
    return token3;
  }
  scanDelims(start, canSplitWord) {
    const max2 = this.posMax;
    const marker = this.src.charCodeAt(start);
    let lastChar;
    if (start === 0) lastChar = 32;
    else if (start === 1) {
      lastChar = this.src.charCodeAt(0);
      if ((lastChar & 63488) === 55296) lastChar = 65533;
    } else {
      lastChar = this.src.charCodeAt(start - 1);
      if ((lastChar & 64512) === 56320) {
        const highSurr = this.src.charCodeAt(start - 2);
        lastChar = (highSurr & 64512) === 55296 ? 65536 + (highSurr - 55296 << 10) + (lastChar - 56320) : 65533;
      } else if ((lastChar & 64512) === 55296) lastChar = 65533;
    }
    let pos = start;
    while (pos < max2 && this.src.charCodeAt(pos) === marker) pos++;
    const count = pos - start;
    let nextChar = pos < max2 ? this.src.charCodeAt(pos) : 32;
    if ((nextChar & 64512) === 55296) {
      const lowSurr = this.src.charCodeAt(pos + 1);
      nextChar = (lowSurr & 64512) === 56320 ? 65536 + (nextChar - 55296 << 10) + (lowSurr - 56320) : 65533;
    } else if ((nextChar & 64512) === 56320) nextChar = 65533;
    const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
    const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
    const isLastWhiteSpace = isWhiteSpace(lastChar);
    const isNextWhiteSpace = isWhiteSpace(nextChar);
    const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
    const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
    return {
      can_open: left_flanking && (canSplitWord || !right_flanking || isLastPunctChar),
      can_close: right_flanking && (canSplitWord || !left_flanking || isNextPunctChar),
      length: count
    };
  }
};
function isTerminatorChar(ch) {
  switch (ch) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function text(state2, silent) {
  let pos = state2.pos;
  while (pos < state2.posMax && !isTerminatorChar(state2.src.charCodeAt(pos))) pos++;
  if (pos === state2.pos) return false;
  if (!silent) state2.pending += state2.src.slice(state2.pos, pos);
  state2.pos = pos;
  return true;
}
function isAsciiAlpha(code3) {
  return code3 >= 65 && code3 <= 90 || code3 >= 97 && code3 <= 122;
}
function isSchemeChar(code3) {
  return code3 >= 65 && code3 <= 90 || code3 >= 97 && code3 <= 122 || code3 >= 48 && code3 <= 57 || code3 === 43 || code3 === 45 || code3 === 46;
}
function linkify(state2, silent) {
  if (!state2.md.options.linkify) return false;
  if (state2.linkLevel > 0) return false;
  const pos = state2.pos;
  const max2 = state2.posMax;
  if (pos + 3 > max2) return false;
  if (state2.src.charCodeAt(pos) !== 58) return false;
  if (state2.src.charCodeAt(pos + 1) !== 47) return false;
  if (state2.src.charCodeAt(pos + 2) !== 47) return false;
  const protoMin = pos - Math.min(10, state2.pending.length, pos);
  let protoStart = pos;
  while (protoStart > protoMin && isSchemeChar(state2.src.charCodeAt(protoStart - 1))) protoStart--;
  if (protoStart === pos || !isAsciiAlpha(state2.src.charCodeAt(protoStart))) return false;
  const protoLength = pos - protoStart;
  const link2 = state2.md.linkify.matchAtStart(state2.src.slice(protoStart));
  if (!link2) return false;
  let url = link2.url;
  if (url.length <= protoLength) return false;
  let urlEnd = url.length;
  while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) urlEnd--;
  if (urlEnd !== url.length) url = url.slice(0, urlEnd);
  const fullUrl = state2.md.normalizeLink(url);
  if (!state2.md.validateLink(fullUrl)) return false;
  if (!silent) {
    state2.pending = state2.pending.slice(0, -protoLength);
    const token_o = state2.push("link_open", "a", 1);
    token_o.attrs = [["href", fullUrl]];
    token_o.markup = "linkify";
    token_o.info = "auto";
    const token_t = state2.push("text", "", 0);
    token_t.content = state2.md.normalizeLinkText(url);
    const token_c = state2.push("link_close", "a", -1);
    token_c.markup = "linkify";
    token_c.info = "auto";
  }
  state2.pos += url.length - protoLength;
  return true;
}
function newline(state2, silent) {
  let pos = state2.pos;
  if (state2.src.charCodeAt(pos) !== 10) return false;
  const pmax = state2.pending.length - 1;
  const max2 = state2.posMax;
  if (!silent) {
    if (pmax >= 0 && state2.pending.charCodeAt(pmax) === 32) {
      if (pmax >= 1 && state2.pending.charCodeAt(pmax - 1) === 32) {
        let ws = pmax - 1;
        while (ws >= 1 && state2.pending.charCodeAt(ws - 1) === 32) ws--;
        state2.pending = state2.pending.slice(0, ws);
        state2.push("hardbreak", "br", 0);
      } else {
        state2.pending = state2.pending.slice(0, -1);
        state2.push("softbreak", "br", 0);
      }
    } else state2.push("softbreak", "br", 0);
  }
  pos++;
  while (pos < max2 && isSpace(state2.src.charCodeAt(pos))) pos++;
  state2.pos = pos;
  return true;
}
var ESCAPED = [];
for (let i = 0; i < 256; i++) ESCAPED.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
  ESCAPED[ch.charCodeAt(0)] = 1;
});
function escape(state2, silent) {
  let pos = state2.pos;
  const max2 = state2.posMax;
  if (state2.src.charCodeAt(pos) !== 92) return false;
  pos++;
  if (pos >= max2) return false;
  let ch1 = state2.src.charCodeAt(pos);
  if (ch1 === 10) {
    if (!silent) state2.push("hardbreak", "br", 0);
    pos++;
    while (pos < max2) {
      ch1 = state2.src.charCodeAt(pos);
      if (!isSpace(ch1)) break;
      pos++;
    }
    state2.pos = pos;
    return true;
  }
  if (ch1 === 32) {
    if (!silent) {
      const token3 = state2.push("text_special", "", 0);
      token3.content = "\\";
      token3.markup = "\\";
      token3.info = "escape";
    }
    state2.pos = pos;
    return true;
  }
  let escapedStr = state2.src[pos];
  if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max2) {
    const ch2 = state2.src.charCodeAt(pos + 1);
    if (ch2 >= 56320 && ch2 <= 57343) {
      escapedStr += state2.src[pos + 1];
      pos++;
    }
  }
  const origStr = "\\" + escapedStr;
  if (!silent) {
    const token3 = state2.push("text_special", "", 0);
    if (ch1 < 256 && ESCAPED[ch1] !== 0) token3.content = escapedStr;
    else token3.content = origStr;
    token3.markup = origStr;
    token3.info = "escape";
  }
  state2.pos = pos + 1;
  return true;
}
function buildLastRuns(src) {
  const lastRuns = {};
  let pos = 0;
  while ((pos = src.indexOf("`", pos)) !== -1) {
    const start = pos;
    while (src.charCodeAt(++pos) === 96) ;
    lastRuns[pos - start] = start;
  }
  return lastRuns;
}
function backtick(state2, silent) {
  var _state$backticks$open;
  const start = state2.pos;
  if (state2.src.charCodeAt(start) !== 96) return false;
  const max2 = state2.posMax;
  let pos = start + 1;
  while (pos < max2 && state2.src.charCodeAt(pos) === 96) pos++;
  const marker = state2.src.slice(start, pos);
  const openerLength = marker.length;
  if (!state2.backticksScanned) {
    state2.backticks = buildLastRuns(state2.src);
    state2.backticksScanned = true;
  }
  if (((_state$backticks$open = state2.backticks[openerLength]) !== null && _state$backticks$open !== void 0 ? _state$backticks$open : -1) >= pos) {
    let matchEnd = pos;
    let matchStart;
    while ((matchStart = state2.src.indexOf("`", matchEnd)) !== -1 && matchStart < max2) {
      matchEnd = matchStart + 1;
      while (state2.src.charCodeAt(matchEnd) === 96) matchEnd++;
      if (matchEnd > max2) break;
      if (matchEnd - matchStart === openerLength) {
        if (!silent) {
          const token3 = state2.push("code_inline", "code", 0);
          token3.markup = marker;
          let content2 = state2.src.slice(pos, matchStart).replace(/\n/g, " ");
          if (content2.startsWith(" ") && content2.endsWith(" ") && /[^ ]/.test(content2)) content2 = content2.slice(1, -1);
          token3.content = content2;
        }
        state2.pos = matchEnd;
        return true;
      }
    }
  }
  if (!silent) state2.pending += marker;
  state2.pos = pos;
  return true;
}
function strikethrough_tokenize(state2, silent) {
  const start = state2.pos;
  const marker = state2.src.charCodeAt(start);
  if (silent) return false;
  if (marker !== 126) return false;
  const scanned = state2.scanDelims(state2.pos, true);
  let len = scanned.length;
  const ch = String.fromCharCode(marker);
  if (len < 2) return false;
  let token3;
  if (len % 2) {
    token3 = state2.push("text", "", 0);
    token3.content = ch;
    len--;
  }
  for (let i = 0; i < len; i += 2) {
    token3 = state2.push("text", "", 0);
    token3.content = ch + ch;
    state2.delimiters.push({
      marker,
      length: 0,
      token: state2.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state2.pos += scanned.length;
  return true;
}
function postProcess$1(state2, delimiters) {
  let token3;
  const loneMarkers = [];
  const max2 = delimiters.length;
  for (let i = 0; i < max2; i++) {
    const startDelim = delimiters[i];
    if (startDelim.marker !== 126) continue;
    if (startDelim.end === -1) continue;
    const endDelim = delimiters[startDelim.end];
    token3 = state2.tokens[startDelim.token];
    token3.type = "s_open";
    token3.tag = "s";
    token3.nesting = 1;
    token3.markup = "~~";
    token3.content = "";
    token3 = state2.tokens[endDelim.token];
    token3.type = "s_close";
    token3.tag = "s";
    token3.nesting = -1;
    token3.markup = "~~";
    token3.content = "";
    if (state2.tokens[endDelim.token - 1].type === "text" && state2.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
  }
  while (loneMarkers.length) {
    const i = loneMarkers.pop();
    let j = i + 1;
    while (j < state2.tokens.length && state2.tokens[j].type === "s_close") j++;
    j--;
    if (i !== j) {
      token3 = state2.tokens[j];
      state2.tokens[j] = state2.tokens[i];
      state2.tokens[i] = token3;
    }
  }
}
function strikethrough_postProcess(state2) {
  const tokens_meta = state2.tokens_meta;
  const max2 = state2.tokens_meta.length;
  postProcess$1(state2, state2.delimiters);
  for (let curr = 0; curr < max2; curr++) {
    var _tokens_meta$curr;
    const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
    if (delimiters) postProcess$1(state2, delimiters);
  }
}
var strikethrough_default = {
  tokenize: strikethrough_tokenize,
  postProcess: strikethrough_postProcess
};
function emphasis_tokenize(state2, silent) {
  const start = state2.pos;
  const marker = state2.src.charCodeAt(start);
  if (silent) return false;
  if (marker !== 95 && marker !== 42) return false;
  const scanned = state2.scanDelims(state2.pos, marker === 42);
  for (let i = 0; i < scanned.length; i++) {
    const token3 = state2.push("text", "", 0);
    token3.content = String.fromCharCode(marker);
    state2.delimiters.push({
      marker,
      length: scanned.length,
      token: state2.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state2.pos += scanned.length;
  return true;
}
function postProcess(state2, delimiters) {
  const max2 = delimiters.length;
  for (let i = max2 - 1; i >= 0; i--) {
    const startDelim = delimiters[i];
    if (startDelim.marker !== 95 && startDelim.marker !== 42) continue;
    if (startDelim.end === -1) continue;
    const endDelim = delimiters[startDelim.end];
    const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
    const ch = String.fromCharCode(startDelim.marker);
    const token_o = state2.tokens[startDelim.token];
    token_o.type = isStrong ? "strong_open" : "em_open";
    token_o.tag = isStrong ? "strong" : "em";
    token_o.nesting = 1;
    token_o.markup = isStrong ? ch + ch : ch;
    token_o.content = "";
    const token_c = state2.tokens[endDelim.token];
    token_c.type = isStrong ? "strong_close" : "em_close";
    token_c.tag = isStrong ? "strong" : "em";
    token_c.nesting = -1;
    token_c.markup = isStrong ? ch + ch : ch;
    token_c.content = "";
    if (isStrong) {
      state2.tokens[delimiters[i - 1].token].content = "";
      state2.tokens[delimiters[startDelim.end + 1].token].content = "";
      i--;
    }
  }
}
function emphasis_post_process(state2) {
  const tokens_meta = state2.tokens_meta;
  const max2 = state2.tokens_meta.length;
  postProcess(state2, state2.delimiters);
  for (let curr = 0; curr < max2; curr++) {
    var _tokens_meta$curr;
    const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
    if (delimiters) postProcess(state2, delimiters);
  }
}
var emphasis_default = {
  tokenize: emphasis_tokenize,
  postProcess: emphasis_post_process
};
function link(state2, silent) {
  let code3, label, res, ref;
  let href = "";
  let title = "";
  let start = state2.pos;
  let parseReference = true;
  if (state2.src.charCodeAt(state2.pos) !== 91) return false;
  const oldPos = state2.pos;
  const max2 = state2.posMax;
  const labelStart = state2.pos + 1;
  const labelEnd = state2.md.helpers.parseLinkLabel(state2, state2.pos, true);
  if (labelEnd < 0) return false;
  let pos = labelEnd + 1;
  if (pos < max2 && state2.src.charCodeAt(pos) === 40) {
    parseReference = false;
    pos++;
    for (; pos < max2; pos++) {
      code3 = state2.src.charCodeAt(pos);
      if (!isSpace(code3) && code3 !== 10) break;
    }
    if (pos >= max2) return false;
    start = pos;
    res = state2.md.helpers.parseLinkDestination(state2.src, pos, state2.posMax);
    if (res.ok) {
      href = state2.md.normalizeLink(res.str);
      if (state2.md.validateLink(href)) pos = res.pos;
      else href = "";
      start = pos;
      for (; pos < max2; pos++) {
        code3 = state2.src.charCodeAt(pos);
        if (!isSpace(code3) && code3 !== 10) break;
      }
      res = state2.md.helpers.parseLinkTitle(state2.src, pos, state2.posMax);
      if (pos < max2 && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        for (; pos < max2; pos++) {
          code3 = state2.src.charCodeAt(pos);
          if (!isSpace(code3) && code3 !== 10) break;
        }
      }
    }
    if (pos >= max2 || state2.src.charCodeAt(pos) !== 41) parseReference = true;
    pos++;
  }
  if (parseReference) {
    if (typeof state2.env.references === "undefined") return false;
    if (pos < max2 && state2.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state2.md.helpers.parseLinkLabel(state2, pos);
      if (pos >= 0) label = state2.src.slice(start, pos++);
      else pos = labelEnd + 1;
    } else pos = labelEnd + 1;
    if (!label) label = state2.src.slice(labelStart, labelEnd);
    label = normalizeReference(label);
    ref = state2.env.references[label];
    if (!ref) {
      state2.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }
  if (!silent) {
    state2.pos = labelStart;
    state2.posMax = labelEnd;
    const token_o = state2.push("link_open", "a", 1);
    const attrs2 = [["href", href]];
    token_o.attrs = attrs2;
    if (title) attrs2.push(["title", title]);
    if (label) {
      const meta = /* @__PURE__ */ Object.create(null);
      meta.label = label;
      token_o.meta = meta;
    }
    state2.linkLevel++;
    state2.md.inline.tokenize(state2);
    state2.linkLevel--;
    state2.push("link_close", "a", -1);
  }
  state2.pos = pos;
  state2.posMax = max2;
  return true;
}
function image(state2, silent) {
  let code3, content2, label, pos, ref, res, title, start;
  let href = "";
  const oldPos = state2.pos;
  const max2 = state2.posMax;
  if (state2.src.charCodeAt(state2.pos) !== 33) return false;
  if (state2.src.charCodeAt(state2.pos + 1) !== 91) return false;
  const labelStart = state2.pos + 2;
  const labelEnd = state2.md.helpers.parseLinkLabel(state2, state2.pos + 1, false);
  if (labelEnd < 0) return false;
  pos = labelEnd + 1;
  if (pos < max2 && state2.src.charCodeAt(pos) === 40) {
    pos++;
    for (; pos < max2; pos++) {
      code3 = state2.src.charCodeAt(pos);
      if (!isSpace(code3) && code3 !== 10) break;
    }
    if (pos >= max2) return false;
    start = pos;
    res = state2.md.helpers.parseLinkDestination(state2.src, pos, state2.posMax);
    if (res.ok) {
      href = state2.md.normalizeLink(res.str);
      if (state2.md.validateLink(href)) pos = res.pos;
      else href = "";
    }
    start = pos;
    for (; pos < max2; pos++) {
      code3 = state2.src.charCodeAt(pos);
      if (!isSpace(code3) && code3 !== 10) break;
    }
    res = state2.md.helpers.parseLinkTitle(state2.src, pos, state2.posMax);
    if (pos < max2 && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;
      for (; pos < max2; pos++) {
        code3 = state2.src.charCodeAt(pos);
        if (!isSpace(code3) && code3 !== 10) break;
      }
    } else title = "";
    if (pos >= max2 || state2.src.charCodeAt(pos) !== 41) {
      state2.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    if (typeof state2.env.references === "undefined") return false;
    if (pos < max2 && state2.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state2.md.helpers.parseLinkLabel(state2, pos);
      if (pos >= 0) label = state2.src.slice(start, pos++);
      else pos = labelEnd + 1;
    } else pos = labelEnd + 1;
    if (!label) label = state2.src.slice(labelStart, labelEnd);
    label = normalizeReference(label);
    ref = state2.env.references[label];
    if (!ref) {
      state2.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }
  if (!silent) {
    content2 = state2.src.slice(labelStart, labelEnd);
    const tokens = [];
    state2.md.inline.parse(content2, state2.md, state2.env, tokens);
    const token3 = state2.push("image", "img", 0);
    const attrs2 = [["src", href], ["alt", ""]];
    token3.attrs = attrs2;
    token3.children = tokens;
    token3.content = content2;
    if (title) attrs2.push(["title", title]);
    if (label) {
      const meta = /* @__PURE__ */ Object.create(null);
      meta.label = label;
      token3.meta = meta;
    }
  }
  state2.pos = pos;
  state2.posMax = max2;
  return true;
}
var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function autolink(state2, silent) {
  let pos = state2.pos;
  if (state2.src.charCodeAt(pos) !== 60) return false;
  const start = state2.pos;
  const max2 = state2.posMax;
  for (; ; ) {
    if (++pos >= max2) return false;
    const ch = state2.src.charCodeAt(pos);
    if (ch === 60) return false;
    if (ch === 62) break;
  }
  const url = state2.src.slice(start + 1, pos);
  if (AUTOLINK_RE.test(url)) {
    const fullUrl = state2.md.normalizeLink(url);
    if (!state2.md.validateLink(fullUrl)) return false;
    if (!silent) {
      const token_o = state2.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state2.push("text", "", 0);
      token_t.content = state2.md.normalizeLinkText(url);
      const token_c = state2.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state2.pos += url.length + 2;
    return true;
  }
  if (EMAIL_RE.test(url)) {
    const fullUrl = state2.md.normalizeLink(`mailto:${url}`);
    if (!state2.md.validateLink(fullUrl)) return false;
    if (!silent) {
      const token_o = state2.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state2.push("text", "", 0);
      token_t.content = state2.md.normalizeLinkText(url);
      const token_c = state2.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state2.pos += url.length + 2;
    return true;
  }
  return false;
}
function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}
function isLetter(ch) {
  const lc = ch | 32;
  return lc >= 97 && lc <= 122;
}
function scanSpecial(state2, pos) {
  const src = state2.src;
  let start;
  let terminator;
  if (src.startsWith("<!--", pos)) {
    if (src.startsWith(">", pos + 4)) return pos + 5;
    if (src.startsWith("->", pos + 4)) return pos + 6;
    start = pos + 4;
    terminator = "-->";
  } else if (src.startsWith("<![CDATA[", pos)) {
    start = pos + 9;
    terminator = "]]>";
  } else if (src.charCodeAt(pos + 1) === 63) {
    start = pos + 2;
    terminator = "?>";
  } else if (isLetter(src.charCodeAt(pos + 2))) {
    start = pos + 3;
    terminator = ">";
  } else return -1;
  if (state2.skipHtmlSpecial) return -1;
  const end = src.indexOf(terminator, start);
  if (end < 0) {
    state2.skipHtmlSpecial = true;
    return -1;
  }
  return end + terminator.length;
}
function html_inline(state2, silent) {
  if (!state2.md.options.html) return false;
  const max2 = state2.posMax;
  const pos = state2.pos;
  if (state2.src.charCodeAt(pos) !== 60 || pos + 2 >= max2) return false;
  let end;
  const ch = state2.src.charCodeAt(pos + 1);
  if (ch === 33 || ch === 63) end = scanSpecial(state2, pos);
  else if (ch === 47 || isLetter(ch)) {
    const match = state2.src.slice(pos).match(HTML_OPEN_CLOSE_TAG_RE);
    end = match ? pos + match[0].length : -1;
  } else return false;
  if (end < 0) return false;
  if (!silent) {
    const token3 = state2.push("html_inline", "", 0);
    token3.content = state2.src.slice(pos, end);
    if (isLinkOpen(token3.content)) state2.linkLevel++;
    if (isLinkClose(token3.content)) state2.linkLevel--;
  }
  state2.pos = end;
  return true;
}
var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
function entity(state2, silent) {
  const pos = state2.pos;
  const max2 = state2.posMax;
  if (state2.src.charCodeAt(pos) !== 38) return false;
  if (pos + 1 >= max2) return false;
  if (state2.src.charCodeAt(pos + 1) === 35) {
    const match = state2.src.slice(pos).match(DIGITAL_RE);
    if (match) {
      if (!silent) {
        const code3 = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
        const token3 = state2.push("text_special", "", 0);
        token3.content = isValidEntityCode(code3) ? fromCodePoint(code3) : fromCodePoint(65533);
        token3.markup = match[0];
        token3.info = "entity";
      }
      state2.pos += match[0].length;
      return true;
    }
  } else {
    const match = state2.src.slice(pos).match(NAMED_RE);
    if (match) {
      const decoded = decodeHTMLStrict(match[0]);
      if (decoded !== match[0]) {
        if (!silent) {
          const token3 = state2.push("text_special", "", 0);
          token3.content = decoded;
          token3.markup = match[0];
          token3.info = "entity";
        }
        state2.pos += match[0].length;
        return true;
      }
    }
  }
  return false;
}
function processDelimiters(delimiters) {
  const openersBottom = {};
  const max2 = delimiters.length;
  if (!max2) return;
  let headerIdx = 0;
  let lastTokenIdx = -2;
  const jumps = [];
  for (let closerIdx = 0; closerIdx < max2; closerIdx++) {
    const closer = delimiters[closerIdx];
    jumps.push(0);
    if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) headerIdx = closerIdx;
    lastTokenIdx = closer.token;
    closer.length = closer.length || 0;
    if (!closer.close) continue;
    if (!openersBottom.hasOwnProperty(closer.marker)) openersBottom[closer.marker] = [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ];
    const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
    let openerIdx = headerIdx - jumps[headerIdx] - 1;
    let newMinOpenerIdx = openerIdx;
    for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
      const opener = delimiters[openerIdx];
      if (opener.marker !== closer.marker) continue;
      if (opener.open && opener.end < 0) {
        let isOddMatch = false;
        if (opener.close || closer.open) {
          if ((opener.length + closer.length) % 3 === 0) {
            if (opener.length % 3 !== 0 || closer.length % 3 !== 0) isOddMatch = true;
          }
        }
        if (!isOddMatch) {
          const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
          jumps[closerIdx] = closerIdx - openerIdx + lastJump;
          jumps[openerIdx] = lastJump;
          closer.open = false;
          opener.end = closerIdx;
          opener.close = false;
          newMinOpenerIdx = -1;
          lastTokenIdx = -2;
          break;
        }
      }
    }
    if (newMinOpenerIdx !== -1) openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
  }
}
function link_pairs(state2) {
  const tokens_meta = state2.tokens_meta;
  const max2 = state2.tokens_meta.length;
  processDelimiters(state2.delimiters);
  for (let curr = 0; curr < max2; curr++) {
    var _tokens_meta$curr;
    const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
    if (delimiters) processDelimiters(delimiters);
  }
}
function fragments_join(state2) {
  let curr, last;
  let level = 0;
  const tokens = state2.tokens;
  const max2 = state2.tokens.length;
  for (curr = last = 0; curr < max2; curr++) {
    if (tokens[curr].nesting < 0) level--;
    tokens[curr].level = level;
    if (tokens[curr].nesting > 0) level++;
    if (tokens[curr].type === "text" && curr + 1 < max2 && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    else {
      if (curr !== last) tokens[last] = tokens[curr];
      last++;
    }
  }
  if (curr !== last) tokens.length = last;
}
var _rules = [
  ["text", text],
  ["linkify", linkify],
  ["newline", newline],
  ["escape", escape],
  ["backticks", backtick],
  ["strikethrough", strikethrough_default.tokenize],
  ["emphasis", emphasis_default.tokenize],
  ["link", link],
  ["image", image],
  ["autolink", autolink],
  ["html_inline", html_inline],
  ["entity", entity]
];
var _rules2 = [
  ["balance_pairs", link_pairs],
  ["strikethrough", strikethrough_default.postProcess],
  ["emphasis", emphasis_default.postProcess],
  ["fragments_join", fragments_join]
];
var ParserInline = class {
  constructor() {
    _defineProperty(
      this,
      /**
      * {@link Ruler} instance. Keep configuration of inline rules.
      */
      "ruler",
      new Ruler()
    );
    _defineProperty(
      this,
      /**
      * {@link Ruler} instance. Second ruler used for post-processing
      * (e.g. in emphasis-like rules).
      */
      "ruler2",
      new Ruler()
    );
    _defineProperty(this, "State", StateInline);
    for (let i = 0; i < _rules.length; i++) this.ruler.push(_rules[i][0], _rules[i][1]);
    for (let i = 0; i < _rules2.length; i++) this.ruler2.push(_rules2[i][0], _rules2[i][1]);
  }
  skipToken(state2) {
    const pos = state2.pos;
    const rules = this.ruler.getRules("");
    const len = rules.length;
    const maxNesting = state2.md.options.maxNesting;
    const cache = state2.cache;
    if (typeof cache[pos] !== "undefined") {
      state2.pos = cache[pos];
      return;
    }
    let ok = false;
    if (state2.level < maxNesting) for (let i = 0; i < len; i++) {
      state2.level++;
      ok = rules[i](state2, true);
      state2.level--;
      if (ok) {
        if (pos >= state2.pos) throw new Error("inline rule didn't increment state.pos");
        break;
      }
    }
    else state2.pos = state2.posMax;
    if (!ok) state2.pos++;
    cache[pos] = state2.pos;
  }
  tokenize(state2) {
    const rules = this.ruler.getRules("");
    const len = rules.length;
    const end = state2.posMax;
    const maxNesting = state2.md.options.maxNesting;
    while (state2.pos < end) {
      const prevPos = state2.pos;
      let ok = false;
      if (state2.level < maxNesting) for (let i = 0; i < len; i++) {
        ok = rules[i](state2, false);
        if (ok) {
          if (prevPos >= state2.pos) throw new Error("inline rule didn't increment state.pos");
          break;
        }
      }
      if (ok) {
        if (state2.pos >= end) break;
        continue;
      }
      state2.pending += state2.src[state2.pos++];
    }
    if (state2.pending) state2.pushPending();
  }
  /**
  * Process input string and push inline tokens into `outTokens`
  */
  parse(str, md, env, outTokens) {
    const state2 = new this.State(str, md, env, outTokens);
    this.tokenize(state2);
    const rules = this.ruler2.getRules("");
    const len = rules.length;
    for (let i = 0; i < len; i++) rules[i](state2);
  }
};
var config = {
  default: {
    options: {
      html: false,
      xhtmlOut: false,
      breaks: false,
      langPrefix: "language-",
      linkify: false,
      typographer: false,
      quotes: "\u201C\u201D\u2018\u2019",
      highlight: null,
      maxNesting: 100
    },
    components: {
      core: {},
      block: {},
      inline: {}
    }
  },
  zero: {
    options: {
      html: false,
      xhtmlOut: false,
      breaks: false,
      langPrefix: "language-",
      linkify: false,
      typographer: false,
      quotes: "\u201C\u201D\u2018\u2019",
      highlight: null,
      maxNesting: 20
    },
    components: {
      core: { rules: [
        "normalize",
        "block",
        "strip_references",
        "inline",
        "text_join"
      ] },
      block: { rules: ["paragraph"] },
      inline: {
        rules: ["text"],
        rules2: ["balance_pairs", "fragments_join"]
      }
    }
  },
  commonmark: {
    options: {
      html: true,
      xhtmlOut: true,
      breaks: false,
      langPrefix: "language-",
      linkify: false,
      typographer: false,
      quotes: "\u201C\u201D\u2018\u2019",
      highlight: null,
      maxNesting: 20
    },
    components: {
      core: { rules: [
        "normalize",
        "block",
        "strip_references",
        "inline",
        "text_join"
      ] },
      block: { rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ] },
      inline: {
        rules: [
          "autolink",
          "backticks",
          "emphasis",
          "entity",
          "escape",
          "html_inline",
          "image",
          "link",
          "newline",
          "text"
        ],
        rules2: [
          "balance_pairs",
          "emphasis",
          "fragments_join"
        ]
      }
    }
  }
};
var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
var RECODE_HOSTNAME_FOR = [
  "http:",
  "https:",
  "mailto:"
];
var MarkdownIt = class {
  /**
  * Link validation function. CommonMark allows too much in links. By default
  * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
  * except some embedded image types.
  *
  * You can change this behaviour:
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * // enable everything
  * md.validateLink = function () { return true; }
  * ```
  */
  validateLink(url) {
    const str = url.trim().toLowerCase();
    return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
  }
  /**
  * Function used to encode link url to a machine-readable format,
  * which includes url-encoding, punycode, etc.
  */
  normalizeLink(url) {
    const parsed = parse_default(url, true);
    if (parsed.hostname) {
      if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
        parsed.hostname = punycode_es6_default.toASCII(parsed.hostname);
      } catch (er) {
      }
    }
    if (parsed.auth) parsed.auth = encode_default(parsed.auth);
    if (parsed.hostname) parsed.hostname = encode_default(parsed.hostname);
    if (parsed.pathname) parsed.pathname = encode_default(parsed.pathname);
    if (parsed.search) parsed.search = encode_default(parsed.search);
    if (parsed.hash) parsed.hash = encode_default(parsed.hash);
    return format(parsed);
  }
  /**
  * Function used to decode link url to a human-readable format`
  */
  normalizeLinkText(url) {
    const parsed = parse_default(url, true);
    if (parsed.hostname) {
      if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
        parsed.hostname = punycode_es6_default.toUnicode(parsed.hostname);
      } catch (er) {
      }
    }
    return decode_default(format(parsed), decode_default.defaultChars + "%");
  }
  constructor(...args) {
    _defineProperty(
      this,
      /**
      * Instance of {@link ParserInline}. You may need it to add new rules when
      * writing plugins. For simple rules control use {@link MarkdownIt.disable}
      * and {@link MarkdownIt.enable}.
      */
      "inline",
      new ParserInline()
    );
    _defineProperty(
      this,
      /**
      * Instance of {@link ParserBlock}. You may need it to add new rules when
      * writing plugins. For simple rules control use {@link MarkdownIt.disable}
      * and {@link MarkdownIt.enable}.
      */
      "block",
      new ParserBlock()
    );
    _defineProperty(
      this,
      /**
      * Instance of {@link ParserCore} chain executor. You may need it to add new
      * rules when writing plugins. For simple rules control use
      * {@link MarkdownIt.disable} and {@link MarkdownIt.enable}.
      */
      "core",
      new ParserCore()
    );
    _defineProperty(
      this,
      /**
      * Instance of {@link Renderer}. Use it to modify output look. Or to add rendering
      * rules for new token types, generated by plugins.
      *
      * See {@link Renderer} docs and
      * [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts).
      *
      * @example
      * ```javascript
      * import MarkdownIt from 'markdown-it'
      * const md = new MarkdownIt()
      *
      * function myToken(tokens, idx, options, env, self) {
      *   //...
      *   return result;
      * };
      *
      * md.renderer.rules['my_token'] = myToken
      * ```
      */
      "renderer",
      new Renderer()
    );
    _defineProperty(
      this,
      /**
      * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
      * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/src/rules_core/linkify.ts)
      * rule.
      */
      "linkify",
      new LinkifyIt()
    );
    _defineProperty(
      this,
      /**
      * Assorted utility functions, useful to write plugins. See details
      * [here](https://github.com/markdown-it/markdown-it/blob/master/src/common/utils.ts).
      */
      "utils",
      utils_exports
    );
    _defineProperty(
      this,
      /**
      * Link components parser functions, useful to write plugins. See details
      * [here](https://github.com/markdown-it/markdown-it/blob/master/src/helpers).
      */
      "helpers",
      Object.assign({}, helpers_exports)
    );
    const [presetNameOrOptions, options] = args;
    if (typeof presetNameOrOptions === "string") {
      this.configure(presetNameOrOptions);
      if (options) this.set(options);
    } else {
      this.configure("default");
      this.set(presetNameOrOptions || {});
    }
  }
  /**
  * Set parser options (in the same format as in constructor). Probably, you
  * will never need it, but you can change options after constructor call.
  *
  * __Note:__ To achieve the best possible performance, don't modify a
  * `markdown-it` instance options on the fly. If you need multiple configurations
  * it's best to create multiple instances and initialize each with separate
  * config.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  *
  * const md = new MarkdownIt()
  *   .set({ html: true, breaks: true })
  *   .set({ typographer: true })
  * ```
  */
  set(options) {
    Object.assign(this.options, options);
    return this;
  }
  /**
  * Batch load of all options and compenent settings. This is internal method,
  * and you probably will not need it. But if you will - see available presets
  * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/src/presets)
  *
  * We strongly recommend to use presets instead of direct config loads. That
  * will give better compatibility with next versions.
  */
  configure(presets) {
    let p;
    if (typeof presets === "string") {
      const presetName = presets;
      p = config[presetName];
      if (!p) throw new Error(`Wrong 'markdown-it' preset "${presetName}", check name`);
    } else p = presets;
    if (!p) throw new Error("Wrong `markdown-it` preset, can't be empty");
    if (p.options) this.options = { ...p.options };
    const components = p.components;
    if (components) {
      var _components$inline;
      [
        "core",
        "block",
        "inline"
      ].forEach((name) => {
        var _components$name;
        const rules = (_components$name = components[name]) === null || _components$name === void 0 ? void 0 : _components$name.rules;
        if (rules) this[name].ruler.enableOnly(rules);
      });
      const rules2 = (_components$inline = components.inline) === null || _components$inline === void 0 ? void 0 : _components$inline.rules2;
      if (rules2) this.inline.ruler2.enableOnly(rules2);
    }
    return this;
  }
  /**
  * Enable list or rules. It will automatically find appropriate components,
  * containing rules with given names. If rule not found, and `ignoreInvalid`
  * not set - throws exception.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  *
  * const md = new MarkdownIt()
  *   .enable(['sub', 'sup'])
  *   .disable('smartquotes')
  * ```
  */
  enable(list2, ignoreInvalid = false) {
    let result = [];
    if (!Array.isArray(list2)) list2 = [list2];
    [
      "core",
      "block",
      "inline"
    ].forEach((chain) => {
      result = result.concat(this[chain].ruler.enable(list2, true));
    });
    result = result.concat(this.inline.ruler2.enable(list2, true));
    const missed = list2.filter((name) => result.indexOf(name) < 0);
    if (missed.length && !ignoreInvalid) throw new Error(`MarkdownIt. Failed to enable unknown rule(s): ${missed}`);
    return this;
  }
  /**
  * The same as {@link MarkdownIt.enable}, but turn specified rules off.
  */
  disable(list2, ignoreInvalid = false) {
    let result = [];
    if (!Array.isArray(list2)) list2 = [list2];
    [
      "core",
      "block",
      "inline"
    ].forEach((chain) => {
      result = result.concat(this[chain].ruler.disable(list2, true));
    });
    result = result.concat(this.inline.ruler2.disable(list2, true));
    const missed = list2.filter((name) => result.indexOf(name) < 0);
    if (missed.length && !ignoreInvalid) throw new Error(`MarkdownIt. Failed to disable unknown rule(s): ${missed}`);
    return this;
  }
  /**
  * Load specified plugin with given params into current parser instance.
  * It's just a sugar to call `plugin(md, params)` with curring.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * import iterator from 'markdown-it-for-inline'
  *
  * const md = new MarkdownIt()
  *   .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
  *     tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar')
  *   })
  * ```
  */
  use(plugin, ...params) {
    plugin.apply(plugin, [this, ...params]);
    return this;
  }
  /**
  * Parse input string and return list of block tokens (special token type
  * "inline" will contain list of inline tokens). You should not call this
  * method directly, until you write custom renderer (for example, to produce
  * AST).
  *
  * `env` is used to pass data between "distributed" rules and return additional
  * metadata like reference info, needed for the renderer. It also can be used to
  * inject data in specific cases. Usually, you will be ok to pass `{}`,
  * and then pass updated object to renderer.
  */
  parse(src, env) {
    if (typeof src !== "string") throw new Error("Input data should be a String");
    const state2 = new this.core.State(src, this, env);
    this.core.process(state2);
    return state2.tokens;
  }
  /**
  * Render markdown string into html. It does all magic for you :).
  *
  * `env` can be used to inject additional metadata (`{}` by default).
  * But you will not need it with high probability. See also comment
  * in {@link MarkdownIt.parse}.
  */
  render(src, env = {}) {
    return this.renderer.render(this.parse(src, env), this.options, env);
  }
  /**
  * The same as {@link MarkdownIt.parse} but skip all block rules. It returns
  * the block tokens list with the single `inline` element, containing parsed
  * inline tokens in `children` property. Also updates `env` object.
  */
  parseInline(src, env) {
    const state2 = new this.core.State(src, this, env);
    state2.inlineMode = true;
    this.core.process(state2);
    return state2.tokens;
  }
  /**
  * Similar to {@link MarkdownIt.render} but for single paragraph content.
  * Result will NOT be wrapped into `<p>` tags.
  */
  renderInline(src, env = {}) {
    return this.renderer.render(this.parseInline(src, env), this.options, env);
  }
};
_defineProperty(MarkdownIt, "Token", Token);
_defineProperty(MarkdownIt, "Ruler", Ruler);
_defineProperty(MarkdownIt, "Renderer", Renderer);
_defineProperty(MarkdownIt, "ParserCore", ParserCore);
_defineProperty(MarkdownIt, "StateCore", StateCore);
_defineProperty(MarkdownIt, "ParserBlock", ParserBlock);
_defineProperty(MarkdownIt, "StateBlock", StateBlock);
_defineProperty(MarkdownIt, "ParserInline", ParserInline);
_defineProperty(MarkdownIt, "StateInline", StateInline);
var MarkdownItCallable = callable(MarkdownIt);

// node_modules/image-size/dist/esm/types/utils.js
var decoder = new TextDecoder();
var toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
var toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + `0${i.toString(16)}`.slice(-2), "");
var getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
var readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
var readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
var readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
var readUInt24LE = (input, offset = 0) => {
  const view = getView(input, offset);
  return view.getUint16(0, true) + (view.getUint8(2) << 16);
};
var readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
var readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
var readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
var methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset = 0, isBigEndian = false) {
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = `readUInt${bits}${endian}`;
  return methods[methodName](input, offset);
}
var BOX_HEADER_SIZE = 8;
function readBox(input, view, base2, offset, boxCode) {
  if (input.length - offset < BOX_HEADER_SIZE)
    return void 0;
  const boxSize = view.getUint32(base2 + offset, false);
  if (input.length - offset < boxSize)
    return void 0;
  return {
    offset,
    size: boxSize,
    matches: view.getUint32(base2 + 4 + offset, false) === boxCode
  };
}
var boxViews = /* @__PURE__ */ new WeakMap();
function getBoxView(input) {
  let view = boxViews.get(input.buffer);
  if (!view) {
    view = new DataView(input.buffer);
    boxViews.set(input.buffer, view);
  }
  return view;
}
function findBox(input, boxName, startOffset) {
  const view = getBoxView(input);
  const boxCode = boxName.charCodeAt(0) << 24 | boxName.charCodeAt(1) << 16 | boxName.charCodeAt(2) << 8 | boxName.charCodeAt(3);
  const base2 = input.byteOffset;
  let currentOffset = startOffset;
  while (currentOffset < input.length) {
    if (input.length - currentOffset < 4)
      break;
    if (view.getUint32(base2 + currentOffset, false) < BOX_HEADER_SIZE) {
      currentOffset += BOX_HEADER_SIZE;
      continue;
    }
    const box2 = readBox(input, view, base2, currentOffset, boxCode);
    if (!box2)
      break;
    if (box2.matches) {
      return { name: boxName, offset: box2.offset, size: box2.size };
    }
    currentOffset += box2.size;
  }
  return void 0;
}

// node_modules/image-size/dist/esm/types/bmp.js
var BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

// node_modules/image-size/dist/esm/types/ico.js
var TYPE_ICON = 1;
var SIZE_HEADER = 2 + 2 + 2;
var SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize(input, imageIndex) {
  const offset = SIZE_HEADER + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
var ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    if (SIZE_HEADER + nbImages * SIZE_IMAGE_ENTRY > input.length) {
      throw new TypeError("Invalid ICO");
    }
    const imageSize2 = getImageSize(input, 0);
    if (nbImages === 1)
      return imageSize2;
    const images = [];
    for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) {
      images.push(getImageSize(input, imageIndex));
    }
    return {
      width: imageSize2.width,
      height: imageSize2.height,
      images
    };
  }
};

// node_modules/image-size/dist/esm/types/cur.js
var TYPE_CURSOR = 2;
var CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0)
      return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

// node_modules/image-size/dist/esm/types/dds.js
var DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

// node_modules/image-size/dist/esm/types/gif.js
var gifRegexp = /^GIF8[79]a/;
var GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

// node_modules/image-size/dist/esm/types/heif.js
var brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  hevx: "heic"
};
var HEIF = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "ftyp")
      return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox)
      return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand in brandMap;
  },
  calculate(input) {
    const metaBox = findBox(input, "meta", 0);
    const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
    if (!ipcoBox) {
      throw new TypeError("Invalid HEIF, no ipco box found");
    }
    const type = toUTF8String(input, 8, 12);
    const images = [];
    let currentOffset = ipcoBox.offset + 8;
    while (currentOffset < ipcoBox.offset + ipcoBox.size) {
      const ispeBox = findBox(input, "ispe", currentOffset);
      if (!ispeBox)
        break;
      if (ispeBox.size < 20) {
        throw new TypeError("Invalid HEIF");
      }
      const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
      const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
      const clapBox = findBox(input, "clap", currentOffset);
      let width = rawWidth;
      const height = rawHeight;
      if (clapBox && clapBox.size >= 16 && clapBox.offset < ipcoBox.offset + ipcoBox.size) {
        const cropRight = readUInt32BE(input, clapBox.offset + 12);
        width = rawWidth - cropRight;
      }
      images.push({ height, width });
      const nextOffset = ispeBox.offset + ispeBox.size;
      if (nextOffset <= currentOffset) {
        throw new TypeError("Invalid HEIF");
      }
      currentOffset = nextOffset;
    }
    if (images.length === 0) {
      throw new TypeError("Invalid HEIF, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      type,
      ...images.length > 1 ? { images } : {}
    };
  }
};

// node_modules/image-size/dist/esm/types/icns.js
var SIZE_HEADER2 = 4 + 4;
var FILE_LENGTH_OFFSET = 4;
var ENTRY_LENGTH_OFFSET = 4;
var ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  icp6: 64,
  ic12: 32,
  it32: 128,
  t8mk: 128,
  ic07: 128,
  ic08: 256,
  ic13: 256,
  ic09: 512,
  ic14: 512,
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  if (imageLengthOffset + 4 > input.length) {
    throw new TypeError("Invalid ICNS");
  }
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize2(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
var ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER2;
    const images = [];
    while (imageOffset < fileLength && imageOffset < inputLength) {
      const imageHeader = readImageHeader(input, imageOffset);
      const entryLength = imageHeader[1];
      if (entryLength < 8) {
        throw new TypeError("Invalid ICNS");
      }
      const imageSize2 = getImageSize2(imageHeader[0]);
      images.push(imageSize2);
      imageOffset += entryLength;
    }
    if (images.length === 0) {
      throw new TypeError("Invalid ICNS, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      ...images.length > 1 ? { images } : {}
    };
  }
};

// node_modules/image-size/dist/esm/types/j2c.js
var J2C = {
  validate: (input) => readUInt32BE(input, 0) === 4283432785,
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

// node_modules/image-size/dist/esm/types/jp2.js
var JP2 = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "jP  ")
      return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox)
      return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jp2 ";
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

// node_modules/image-size/dist/esm/types/jpg.js
var EXIF_MARKER = "45786966";
var APP1_DATA_SIZE_BYTES = 2;
var EXIF_HEADER_BYTES = 6;
var TIFF_BYTE_ALIGN_BYTES = 2;
var BIG_ENDIAN_BYTE_ALIGN = "4d4d";
var LITTLE_ENDIAN_BYTE_ALIGN = "4949";
var IDF_ENTRY_BYTES = 12;
var NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block2 = exifBlock.slice(start, end);
    const tagNumber = readUInt(block2, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block2, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block2, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block2, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(exifBlock, EXIF_HEADER_BYTES, EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES);
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
var JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(_input) {
    let input = _input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      validateInput(input, i);
      if (input[i] !== 255) {
        input = input.subarray(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.subarray(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

// node_modules/image-size/dist/esm/utils/bit-reader.js
var BitReader = class {
  input;
  endianness;
  byteOffset = 2;
  bitOffset = 0;
  constructor(input, endianness) {
    this.input = input;
    this.endianness = endianness;
  }
  getBits(length = 1) {
    let result = 0;
    let bitsRead = 0;
    while (bitsRead < length) {
      if (this.byteOffset >= this.input.length) {
        throw new Error("Reached end of input");
      }
      const currentByte = this.input[this.byteOffset];
      const bitsLeft = 8 - this.bitOffset;
      const bitsToRead = Math.min(length - bitsRead, bitsLeft);
      if (this.endianness === "little-endian") {
        const mask = (1 << bitsToRead) - 1;
        const bits = currentByte >> this.bitOffset & mask;
        result |= bits << bitsRead;
      } else {
        const mask = (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead;
        const bits = (currentByte & mask) >> 8 - this.bitOffset - bitsToRead;
        result = result << bitsToRead | bits;
      }
      bitsRead += bitsToRead;
      this.bitOffset += bitsToRead;
      if (this.bitOffset === 8) {
        this.byteOffset++;
        this.bitOffset = 0;
      }
    }
    return result;
  }
};

// node_modules/image-size/dist/esm/types/jxl-stream.js
function calculateImageDimension(reader, isSmallImage) {
  if (isSmallImage) {
    return 8 * (1 + reader.getBits(5));
  }
  const sizeClass = reader.getBits(2);
  const extraBits = [9, 13, 18, 30][sizeClass];
  return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
  if (isSmallImage && widthMode === 0) {
    return 8 * (1 + reader.getBits(5));
  }
  if (widthMode === 0) {
    return calculateImageDimension(reader, false);
  }
  const aspectRatios = [1, 1.2, 4 / 3, 1.5, 16 / 9, 5 / 4, 2];
  return Math.floor(height * aspectRatios[widthMode - 1]);
}
var JXLStream = {
  validate: (input) => {
    return toHexString(input, 0, 2) === "ff0a";
  },
  calculate(input) {
    const reader = new BitReader(input, "little-endian");
    const isSmallImage = reader.getBits(1) === 1;
    const height = calculateImageDimension(reader, isSmallImage);
    const widthMode = reader.getBits(3);
    const width = calculateImageWidth(reader, isSmallImage, widthMode, height);
    return { width, height };
  }
};

// node_modules/image-size/dist/esm/types/jxl.js
function extractCodestream(input) {
  const jxlcBox = findBox(input, "jxlc", 0);
  if (jxlcBox) {
    return input.subarray(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
  }
  const partialStreams = extractPartialStreams(input);
  if (partialStreams.length > 0) {
    return concatenateCodestreams(partialStreams);
  }
  return void 0;
}
function extractPartialStreams(input) {
  const partialStreams = [];
  let offset = 0;
  while (offset < input.length) {
    const jxlpBox = findBox(input, "jxlp", offset);
    if (!jxlpBox)
      break;
    if (jxlpBox.size < 12) {
      throw new TypeError("Invalid JXL");
    }
    partialStreams.push(input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size));
    offset = jxlpBox.offset + jxlpBox.size;
  }
  return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
  const totalLength = partialCodestreams.reduce((acc, curr) => acc + curr.length, 0);
  const codestream = new Uint8Array(Math.min(16, totalLength));
  let position = 0;
  for (const partial of partialCodestreams) {
    if (position >= codestream.length)
      break;
    const byteCount = Math.min(partial.length, codestream.length - position);
    codestream.set(partial.subarray(0, byteCount), position);
    position += byteCount;
  }
  return codestream;
}
var JXL = {
  validate: (input) => {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "JXL ")
      return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox)
      return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jxl ";
  },
  calculate(input) {
    const codestream = extractCodestream(input);
    if (codestream)
      return JXLStream.calculate(codestream);
    throw new TypeError("Invalid JXL");
  }
};

// node_modules/image-size/dist/esm/types/ktx.js
var KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

// node_modules/image-size/dist/esm/types/png.js
var pngSignature = "PNG\r\n\n";
var pngImageHeaderChunkName = "IHDR";
var pngFriedChunkName = "CgBI";
var PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

// node_modules/image-size/dist/esm/types/pnm.js
var PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
var HEADER_SCAN_LIMIT = 64;
var PAM_HEADER_LIMIT = 256;
var isWhitespace = (byte) => byte === 32 || byte === 9 || byte === 10 || byte === 13;
var isEndOfLine = (byte) => byte === 10 || byte === 13;
var handlers = {
  default: (input) => {
    const end = Math.min(input.length, HEADER_SCAN_LIMIT);
    const tokens = [];
    let token3 = "";
    let inComment = false;
    for (let i = 2; i < end && tokens.length < 2; i++) {
      const byte = input[i];
      if (inComment) {
        inComment = !isEndOfLine(byte);
      } else if (byte === 35) {
        inComment = true;
      } else if (isWhitespace(byte)) {
        if (token3) {
          tokens.push(token3);
          token3 = "";
        }
      } else {
        token3 += String.fromCharCode(byte);
      }
    }
    if (token3 && tokens.length < 2)
      tokens.push(token3);
    if (tokens.length < 2) {
      throw new TypeError("Invalid PNM");
    }
    return {
      width: Number.parseInt(tokens[0], 10),
      height: Number.parseInt(tokens[1], 10)
    };
  },
  pam: (input) => {
    const header2 = toUTF8String(input, 0, Math.min(input.length, PAM_HEADER_LIMIT));
    const size = {};
    for (const line2 of header2.split(/[\r\n]+/)) {
      if (line2.length > 16 || line2.charCodeAt(0) > 128) {
        continue;
      }
      const [key2, value] = line2.split(" ");
      if (key2 && value) {
        size[key2.toLowerCase()] = Number.parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    }
    throw new TypeError("Invalid PAM");
  }
};
var PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const handler = handlers[type] || handlers.default;
    return handler(input);
  }
};

// node_modules/image-size/dist/esm/types/psd.js
var PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

// node_modules/image-size/dist/esm/types/svg.js
var svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
var extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
var INCH_CM = 2.54;
var units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
var unitsReg = new RegExp(`^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root2) {
  const width = root2.match(extractorRegExps.width);
  const height = root2.match(extractorRegExps.height);
  const viewbox = root2.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs2) {
  return {
    height: attrs2.height,
    width: attrs2.width
  };
}
function calculateByViewbox(attrs2, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs2.width) {
    return {
      height: Math.floor(attrs2.width / ratio),
      width: attrs2.width
    };
  }
  if (attrs2.height) {
    return {
      height: attrs2.height,
      width: Math.floor(attrs2.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
var SVG2 = {
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root2 = toUTF8String(input).match(extractorRegExps.root);
    if (root2) {
      const attrs2 = parseAttributes(root2[0]);
      if (attrs2.width && attrs2.height) {
        return calculateByDimensions(attrs2);
      }
      if (attrs2.viewbox) {
        return calculateByViewbox(attrs2, attrs2.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

// node_modules/image-size/dist/esm/types/tga.js
var TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

// node_modules/image-size/dist/esm/types/tiff.js
var CONSTANTS = {
  TAG: {
    WIDTH: 256,
    HEIGHT: 257,
    COMPRESSION: 259
  },
  TYPE: {
    SHORT: 3,
    LONG: 4,
    LONG8: 16
  },
  ENTRY_SIZE: {
    STANDARD: 12,
    BIG: 20
  },
  COUNT_SIZE: {
    STANDARD: 2,
    BIG: 8
  }
};
function readIFD(input, { isBigEndian, isBigTiff }) {
  const view = new DataView(input.buffer, input.byteOffset);
  const le = !isBigEndian;
  const ifdOffset = isBigTiff ? Number(view.getBigUint64(8, le)) : view.getUint32(4, le);
  const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
  return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(view, type, offset, le) {
  switch (type) {
    case CONSTANTS.TYPE.SHORT:
      return view.getUint16(offset, le);
    case CONSTANTS.TYPE.LONG:
      return view.getUint32(offset, le);
    case CONSTANTS.TYPE.LONG8: {
      const value = Number(view.getBigUint64(offset, le));
      if (value > Number.MAX_SAFE_INTEGER) {
        throw new TypeError("Value too large");
      }
      return value;
    }
    default:
      return 0;
  }
}
function extractTags(input, { isBigEndian, isBigTiff }) {
  const tags = {};
  const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
  const valueOffset = isBigTiff ? 12 : 8;
  const view = new DataView(input.buffer, input.byteOffset);
  const le = !isBigEndian;
  for (let offset = 0; offset + entrySize < input.length; offset += entrySize) {
    const code3 = view.getUint16(offset, le);
    const type = view.getUint16(offset + 2, le);
    const length = isBigTiff ? Number(view.getBigUint64(offset + 4, le)) : view.getUint32(offset + 4, le);
    if (code3 === 0)
      break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) {
      tags[code3] = readTagValue(view, type, offset + valueOffset, le);
    }
  }
  return tags;
}
function determineFormat(input) {
  const signature = toUTF8String(input, 0, 2);
  const isBigEndian = signature === "MM";
  const view = new DataView(input.buffer, input.byteOffset);
  const version = view.getUint16(2, !isBigEndian);
  return {
    isBigEndian,
    isBigTiff: version === 43
  };
}
function validateBigTIFFHeader(input, isBigEndian) {
  const view = new DataView(input.buffer, input.byteOffset);
  const le = !isBigEndian;
  const byteSize = view.getUint16(4, le);
  const reserved = view.getUint16(6, le);
  if (byteSize !== 8 || reserved !== 0) {
    throw new TypeError("Invalid BigTIFF header");
  }
}
var signatures = /* @__PURE__ */ new Set([
  "49492a00",
  "4d4d002a",
  "49492b00",
  "4d4d002b"
]);
var TIFF = {
  validate: (input) => {
    const signature = toHexString(input, 0, 4);
    return signatures.has(signature);
  },
  calculate(input) {
    const format2 = determineFormat(input);
    if (format2.isBigTiff) {
      validateBigTIFFHeader(input, format2.isBigEndian);
    }
    const ifdBuffer = readIFD(input, format2);
    const tags = extractTags(ifdBuffer, format2);
    const info = {
      height: tags[CONSTANTS.TAG.HEIGHT],
      width: tags[CONSTANTS.TAG.WIDTH],
      type: format2.isBigTiff ? "bigtiff" : "tiff"
    };
    if (tags[CONSTANTS.TAG.COMPRESSION]) {
      info.compression = tags[CONSTANTS.TAG.COMPRESSION];
    }
    if (!info.width || !info.height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return info;
  }
};

// node_modules/image-size/dist/esm/types/webp.js
function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
var WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(_input) {
    const chunkHeader = toUTF8String(_input, 12, 16);
    const input = _input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      }
      throw new TypeError("Invalid WebP");
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

// node_modules/image-size/dist/esm/types/index.js
var typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["jxl", JXL],
  ["jxl-stream", JXLStream],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG2],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
var types = Array.from(typeHandlers.keys());

// src/preview.ts
var TYPES = {
  md: "text/markdown; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
  apng: "image/apng",
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function previewType(file) {
  const extension = /\.([^./]+)$/.exec(file)?.[1]?.toLowerCase() ?? "";
  return Object.hasOwn(TYPES, extension) ? TYPES[extension] : void 0;
}
function imagePath(markdownFile, src) {
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return null;
  let wanted;
  try {
    wanted = decodeURIComponent(src.replace(/[?#].*$/s, ""));
  } catch {
    return null;
  }
  if (!wanted) return null;
  const parts = wanted.startsWith("/") ? [] : markdownFile.split("/").slice(0, -1);
  for (const part of wanted.split("/")) {
    if (part === "..") {
      if (parts.pop() === void 0) return null;
    } else if (part && part !== ".") parts.push(part);
  }
  return parts.length > 0 ? parts.join("/") : null;
}
var parser = new MarkdownItCallable();

// src/page/markdown.ts
function renderer() {
  const markdown2 = new MarkdownItCallable({ html: false, linkify: true });
  markdown2.core.ruler.push("align_by_class", (state2) => {
    for (const token3 of state2.tokens) {
      const align = /^text-align:(left|center|right)$/.exec(String(token3.attrGet("style")))?.[1];
      if (!align) continue;
      token3.attrs = (token3.attrs ?? []).filter(([name]) => name !== "style");
      token3.attrJoin("class", `align-${align}`);
    }
  });
  markdown2.renderer.rules["link_open"] = (tokens, at, options, _env, self) => {
    tokens[at]?.attrSet("target", "_blank");
    tokens[at]?.attrSet("rel", "noopener noreferrer");
    return self.renderToken(tokens, at, options);
  };
  return markdown2;
}
var withImages = renderer();
var image2 = withImages.renderer.rules["image"];
withImages.renderer.rules["image"] = (tokens, at, options, env, self) => {
  const token3 = tokens[at];
  const file = env?.file ?? "";
  const repoPath = token3 && imagePath(file, String(token3.attrGet("src") ?? ""));
  if (repoPath) token3.attrSet("src", `file?path=${encodeURIComponent(repoPath)}`);
  return image2 ? image2(tokens, at, options, env, self) : "";
};
withImages.core.ruler.push("mark_added", (state2) => {
  const added = state2.env?.added;
  if (!added?.size) return;
  for (const token3 of state2.tokens) {
    if (token3.level !== 0 || token3.nesting === -1 || !token3.map) continue;
    const [first2, end] = token3.map;
    for (let line2 = first2 + 1; line2 <= end; line2++)
      if (added.has(line2)) {
        token3.attrJoin("class", "inserted");
        break;
      }
  }
});
var withoutImages = renderer().disable("image");
var fence2 = withoutImages.renderer.rules["fence"];
withoutImages.renderer.rules["fence"] = (tokens, at, options, env, self) => {
  const token3 = tokens[at];
  const code3 = env?.code;
  if (!token3 || !code3?.length || token3.info.trim() !== "suggestion") return fence2 ? fence2(tokens, at, options, env, self) : "";
  const { escapeHtml: escapeHtml2 } = withoutImages.utils;
  const row = (kind, before, after, text2) => `<tr class="suggestion-${kind}"><td class="suggestion-number">${before}</td><td class="suggestion-number">${after}</td><td class="suggestion-line"><span class="suggestion-sign">${kind === "del" ? "-" : "+"}</span>${escapeHtml2(text2)}</td></tr>`;
  const first2 = code3[0]?.[0] ?? 1;
  const added = token3.content ? token3.content.replace(/\n$/, "").split("\n") : [];
  return `<div class="suggestion"><div class="suggestion-head">Suggested change</div><div class="suggestion-scroll"><table class="suggestion-code">${[
    ...code3.map(([number, text2]) => row("del", String(number), "", text2)),
    ...added.map((text2, offset) => row("add", "", String(first2 + offset), text2))
  ].join("")}</table></div></div>
`;
};
var renderMarkdown = (text2, file, added) => file === void 0 ? withoutImages.render(text2) : withImages.render(text2, { file, added });
var renderComment = (text2, code3) => withoutImages.render(text2, { code: code3 });

// src/page/state.ts
var PAGE = { name: "walkthrough", lost: () => {
} };
var state = {
  view: void 0,
  /** Redraws what changed; `own` when the change is what the person just did, which never waits behind the pill. */
  render: (() => {
  }),
  /** Counts what the page sent, so a poll that left before an answer does not put back what it replaced. */
  sends: 0,
  /** Set when the page shows what the server never took, so the next poll fetches the view whole. */
  stale: false
};
var phone = matchMedia("(max-width: 760px)");
var sending = Promise.resolve();
async function send2(route, body) {
  const mine = ++state.sends;
  const posted = sending.then(() => post(PAGE, route, body));
  sending = posted;
  const answer = await posted;
  if (!answer) {
    state.stale = true;
    return false;
  }
  const view = await answer.json();
  if (mine !== state.sends) return true;
  state.view = view;
  state.render(true);
  return true;
}
var allFiles = () => state.view.steps.flatMap((step) => step.files);
var stepOfFile = (file) => state.view.steps.find((step) => step.files.includes(file));
var pendingComments = () => state.view.threads.flatMap((thread) => thread.comments.filter((one) => one.pending).map((comment) => ({ thread, comment })));
var sentComments = (review) => state.view.threads.flatMap((thread) => thread.comments.filter((one) => one.review === review).map((comment) => ({ thread, comment })));
var threadsIn = (step, file) => state.view.threads.filter((one) => one.step === step && one.file === file);
var outdatedIn = (step, file) => state.view.threads.filter((one) => one.step === null && one.fileStep === step && one.file === file);
var commentCount = (step, file) => [...threadsIn(step, file), ...outdatedIn(step, file)].reduce((sum, one) => sum + one.comments.length, 0);
var threadStep = (thread) => thread.step ?? thread.fileStep;
var unresolved = () => state.view.threads.filter((one) => one.colleague && !one.resolved && threadStep(one) !== void 0);
var notViewed = () => allFiles().filter((file) => !state.view.viewed.includes(file));
var threadBy = (thread) => thread.comments[0]?.by ?? "you";
var plural = (count, one, many = `${one}s`) => `${String(count)} ${count === 1 ? one : many}`;
var linesLabel = ([first2, last]) => first2 === last ? String(first2) : `${String(first2)}\u2013${String(last)}`;
var baseName = (file) => file.slice(file.lastIndexOf("/") + 1);
function markdown(text2, className, code3) {
  const box2 = document.createElement("div");
  box2.className = `markdown ${className}`.trim();
  box2.innerHTML = code3 ? renderComment(text2, code3) : renderMarkdown(text2);
  colourCode(box2);
  return box2;
}
var UNITS = [
  ["year", 31536e3],
  ["month", 2592e3],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60]
];
var relative = new Intl.RelativeTimeFormat("en", { numeric: "always" });
function ago(iso) {
  const seconds = (Date.parse(iso) - Date.now()) / 1e3;
  for (const [unit, size] of UNITS) if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  return "now";
}
var suggestionCode = (thread) => thread.lines && thread.step !== null ? thread.code : void 0;
var goesOut = (comment) => comment.by === "ai" && (comment.pending === true || comment.review !== void 0);

// src/page/end.ts
var COPIED_MS = 2e3;
var TYPE_NAMES = { comment: "Comment", approve: "Approve", "request-changes": "Request changes" };
function sentLine() {
  const { pr, submitted } = state.view;
  const comments = plural(submitted?.comments ?? 0, "comment");
  return pr ? `${submitted?.type ? TYPE_NAMES[submitted.type] : ""}, with ${comments}, on #${pr.number}.` : `${comments}.`;
}
var them = () => state.view.submitted?.comments === 1 ? "it" : "them";
var viewReview = () => {
  const address = state.view.submitted?.address;
  return address ? [el("a", { className: "btn small", href: address, target: "_blank", rel: "noopener noreferrer" }, icon("external"), "View review")] : [];
};
function commandBox(update = false) {
  const skill = update ? "/walkthrough:update" : state.view.pr ? "/walkthrough:pr" : "/walkthrough";
  const command = state.view.pr ? `${skill} ${state.view.pr.number}` : skill;
  const word = el("span", {}, "Copy command");
  const copy = attrs(el("button", { type: "button", className: "btn small" }, icon("copy"), word), { "aria-live": "polite" });
  let shown = 0;
  copy.onclick = () => {
    void navigator.clipboard.writeText(command).then(() => {
      word.textContent = "Copied";
      clearTimeout(shown);
      shown = window.setTimeout(() => {
        word.textContent = "Copy command";
      }, COPIED_MS);
    });
  };
  return el("div", { className: "command" }, el("code", {}, command), copy);
}
function endScreen(ending2, retry) {
  const { pr, submitted } = state.view;
  const lost = ending2 === "lost";
  const robot2 = byeScene(lost ? "asleep" : submitted ? "happy" : "plain");
  const pending = pendingComments().length;
  const kept = pending ? `Your ${plural(pending, "comment")} and Viewed marks are kept for next time.` : "Your Viewed marks are kept for next time.";
  const outcome = lost ? box(false, "This page lost its session.", "Nothing is lost; your comments and Viewed marks are saved.", [
    el("button", { type: "button", className: "btn small primary", onclick: retry }, "Try again")
  ]) : submitted ? pr ? box(true, "Review submitted", sentLine(), viewReview()) : box(true, "Sent to the agent", `${sentLine()} The agent picks ${them()} up in your conversation.`, []) : box(false, pr ? "Nothing was posted." : "Nothing was sent to the agent.", kept, []);
  const page = el(
    "div",
    { className: "end" },
    robot2.box,
    el("h1", { className: "end-title", tabIndex: -1 }, lost ? "The session isn\u2019t running" : "Session ended"),
    outcome,
    el(
      "section",
      { className: "pick-up" },
      el("h2", {}, "Pick it up again"),
      el("p", { className: "end-line" }, "Run this in your agent:"),
      commandBox(),
      el("p", { className: "end-line" }, "A new commit reopens only the steps that changed.")
    ),
    ...lost ? [] : [el("p", { className: "end-line bye" }, "You can close this tab.")]
  );
  return { box: page, stop: robot2.stop };
}
function box(sent, title, line2, actions) {
  return el(
    "div",
    { className: `outcome ${sent ? "sent" : "kept"}` },
    icon(sent ? "met" : "info"),
    el("div", {}, el("strong", {}, title), el("p", {}, line2), ...actions.length ? [el("p", { className: "outcome-actions" }, ...actions)] : [])
  );
}

// node_modules/diff2html/lib-esm/types.js
var LineType;
(function(LineType2) {
  LineType2["INSERT"] = "insert";
  LineType2["DELETE"] = "delete";
  LineType2["CONTEXT"] = "context";
})(LineType || (LineType = {}));
var OutputFormatType = {
  LINE_BY_LINE: "line-by-line",
  SIDE_BY_SIDE: "side-by-side"
};
var LineMatchingType = {
  LINES: "lines",
  WORDS: "words",
  NONE: "none"
};
var DiffStyleType = {
  WORD: "word",
  CHAR: "char"
};
var ColorSchemeType;
(function(ColorSchemeType2) {
  ColorSchemeType2["AUTO"] = "auto";
  ColorSchemeType2["DARK"] = "dark";
  ColorSchemeType2["LIGHT"] = "light";
})(ColorSchemeType || (ColorSchemeType = {}));

// node_modules/diff2html/lib-esm/utils.js
var specials = [
  "-",
  "[",
  "]",
  "/",
  "{",
  "}",
  "(",
  ")",
  "*",
  "+",
  "?",
  ".",
  "\\",
  "^",
  "$",
  "|"
];
var regex = RegExp("[" + specials.join("\\") + "]", "g");
function escapeForRegExp(str) {
  return str.replace(regex, "\\$&");
}
function unifyPath(path) {
  return path ? path.replace(/\\/g, "/") : path;
}
function hashCode(text2) {
  let i, chr, len;
  let hash = 0;
  for (i = 0, len = text2.length; i < len; i++) {
    chr = text2.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
function max(arr) {
  const length = arr.length;
  let max2 = -Infinity;
  for (let i = 0; i < length; i++) {
    max2 = Math.max(max2, arr[i]);
  }
  return max2;
}

// node_modules/diff2html/lib-esm/diff-parser.js
function getExtension(filename, language) {
  const filenameParts = filename.split(".");
  return filenameParts.length > 1 ? filenameParts[filenameParts.length - 1] : language;
}
function startsWithAny(str, prefixes) {
  return prefixes.reduce((startsWith, prefix) => startsWith || str.startsWith(prefix), false);
}
var baseDiffFilenamePrefixes = ["a/", "b/", "i/", "w/", "c/", "o/"];
function getFilename(line2, linePrefix, extraPrefix) {
  const prefixes = extraPrefix !== void 0 ? [...baseDiffFilenamePrefixes, extraPrefix] : baseDiffFilenamePrefixes;
  const FilenameRegExp = linePrefix ? new RegExp(`^${escapeForRegExp(linePrefix)} "?(.+?)"?$`) : new RegExp('^"?(.+?)"?$');
  const [, filename = ""] = FilenameRegExp.exec(line2) || [];
  const matchingPrefix = prefixes.find((p) => filename.indexOf(p) === 0);
  const fnameWithoutPrefix = matchingPrefix ? filename.slice(matchingPrefix.length) : filename;
  return fnameWithoutPrefix.replace(/\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)? [+-]\d{4}.*$/, "");
}
function getSrcFilename(line2, srcPrefix) {
  return getFilename(line2, "---", srcPrefix);
}
function getDstFilename(line2, dstPrefix) {
  return getFilename(line2, "+++", dstPrefix);
}
function parse(diffInput, config2 = {}) {
  const files = [];
  let currentFile = null;
  let currentBlock = null;
  let oldLine = null;
  let oldLine2 = null;
  let newLine = null;
  let possibleOldName = null;
  let possibleNewName = null;
  const oldFileNameHeader = "--- ";
  const newFileNameHeader = "+++ ";
  const hunkHeaderPrefix = "@@";
  const oldMode = /^old mode (\d{6})/;
  const newMode = /^new mode (\d{6})/;
  const deletedFileMode = /^deleted file mode (\d{6})/;
  const newFileMode = /^new file mode (\d{6})/;
  const copyFrom = /^copy from "?(.+)"?/;
  const copyTo = /^copy to "?(.+)"?/;
  const renameFrom = /^rename from "?(.+)"?/;
  const renameTo = /^rename to "?(.+)"?/;
  const similarityIndex = /^similarity index (\d+)%/;
  const dissimilarityIndex = /^dissimilarity index (\d+)%/;
  const index = /^index ([\da-z]+)\.\.([\da-z]+)\s*(\d{6})?/;
  const binaryFiles = /^Binary files (.*) and (.*) differ/;
  const binaryDiff = /^GIT binary patch/;
  const combinedIndex = /^index ([\da-z]+),([\da-z]+)\.\.([\da-z]+)/;
  const combinedMode = /^mode (\d{6}),(\d{6})\.\.(\d{6})/;
  const combinedNewFile = /^new file mode (\d{6})/;
  const combinedDeletedFile = /^deleted file mode (\d{6}),(\d{6})/;
  const diffLines = diffInput.replace(/\\ No newline at end of file/g, "").replace(/\r\n?/g, "\n").split("\n");
  function saveBlock() {
    if (currentBlock !== null && currentFile !== null) {
      currentFile.blocks.push(currentBlock);
      currentBlock = null;
    }
  }
  function saveFile() {
    if (currentFile !== null) {
      if (!currentFile.oldName && possibleOldName !== null) {
        currentFile.oldName = possibleOldName;
      }
      if (!currentFile.newName && possibleNewName !== null) {
        currentFile.newName = possibleNewName;
      }
      if (currentFile.newName) {
        files.push(currentFile);
        currentFile = null;
      }
    }
    possibleOldName = null;
    possibleNewName = null;
  }
  function startFile() {
    saveBlock();
    saveFile();
    currentFile = {
      blocks: [],
      deletedLines: 0,
      addedLines: 0
    };
  }
  function startBlock(line2) {
    saveBlock();
    let values;
    if (currentFile !== null) {
      if (values = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/.exec(line2)) {
        currentFile.isCombined = false;
        oldLine = parseInt(values[1], 10);
        newLine = parseInt(values[2], 10);
      } else if (values = /^@@@ -(\d+)(?:,\d+)? -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@@.*/.exec(line2)) {
        currentFile.isCombined = true;
        oldLine = parseInt(values[1], 10);
        oldLine2 = parseInt(values[2], 10);
        newLine = parseInt(values[3], 10);
      } else {
        if (line2.startsWith(hunkHeaderPrefix)) {
          console.error("Failed to parse lines, starting in 0!");
        }
        oldLine = 0;
        newLine = 0;
        currentFile.isCombined = false;
      }
    }
    currentBlock = {
      lines: [],
      oldStartLine: oldLine,
      oldStartLine2: oldLine2,
      newStartLine: newLine,
      header: line2
    };
  }
  function createLine(line2) {
    if (currentFile === null || currentBlock === null || oldLine === null || newLine === null)
      return;
    const currentLine = {
      content: line2
    };
    const addedPrefixes = currentFile.isCombined ? ["+ ", " +", "++"] : ["+"];
    const deletedPrefixes = currentFile.isCombined ? ["- ", " -", "--"] : ["-"];
    if (startsWithAny(line2, addedPrefixes)) {
      currentFile.addedLines++;
      currentLine.type = LineType.INSERT;
      currentLine.oldNumber = void 0;
      currentLine.newNumber = newLine++;
    } else if (startsWithAny(line2, deletedPrefixes)) {
      currentFile.deletedLines++;
      currentLine.type = LineType.DELETE;
      currentLine.oldNumber = oldLine++;
      currentLine.newNumber = void 0;
    } else {
      currentLine.type = LineType.CONTEXT;
      currentLine.oldNumber = oldLine++;
      currentLine.newNumber = newLine++;
    }
    currentBlock.lines.push(currentLine);
  }
  function existHunkHeader(line2, lineIdx) {
    let idx = lineIdx;
    while (idx < diffLines.length - 3) {
      if (line2.startsWith("diff")) {
        return false;
      }
      if (diffLines[idx].startsWith(oldFileNameHeader) && diffLines[idx + 1].startsWith(newFileNameHeader) && diffLines[idx + 2].startsWith(hunkHeaderPrefix)) {
        return true;
      }
      idx++;
    }
    return false;
  }
  diffLines.forEach((line2, lineIndex) => {
    if (!line2 || line2.startsWith("*")) {
      return;
    }
    let values;
    const prevLine = diffLines[lineIndex - 1];
    const nxtLine = diffLines[lineIndex + 1];
    const afterNxtLine = diffLines[lineIndex + 2];
    if (line2.startsWith("diff --git") || line2.startsWith("diff --combined")) {
      startFile();
      const gitDiffStart = /^diff --git "?([a-ciow]\/.+)"? "?([a-ciow]\/.+)"?/;
      if (values = gitDiffStart.exec(line2)) {
        possibleOldName = getFilename(values[1], void 0, config2.dstPrefix);
        possibleNewName = getFilename(values[2], void 0, config2.srcPrefix);
      }
      if (currentFile === null) {
        throw new Error("Where is my file !!!");
      }
      currentFile.isGitDiff = true;
      return;
    }
    if (line2.startsWith("Binary files") && !(currentFile === null || currentFile === void 0 ? void 0 : currentFile.isGitDiff)) {
      startFile();
      const unixDiffBinaryStart = /^Binary files "?([a-ciow]\/.+)"? and "?([a-ciow]\/.+)"? differ/;
      if (values = unixDiffBinaryStart.exec(line2)) {
        possibleOldName = getFilename(values[1], void 0, config2.dstPrefix);
        possibleNewName = getFilename(values[2], void 0, config2.srcPrefix);
      }
      if (currentFile === null) {
        throw new Error("Where is my file !!!");
      }
      currentFile.isBinary = true;
      return;
    }
    if (!currentFile || !currentFile.isGitDiff && currentFile && line2.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) && afterNxtLine.startsWith(hunkHeaderPrefix)) {
      startFile();
    }
    if (currentFile === null || currentFile === void 0 ? void 0 : currentFile.isTooBig) {
      return;
    }
    if (currentFile && (typeof config2.diffMaxChanges === "number" && currentFile.addedLines + currentFile.deletedLines > config2.diffMaxChanges || typeof config2.diffMaxLineLength === "number" && line2.length > config2.diffMaxLineLength)) {
      currentFile.isTooBig = true;
      currentFile.addedLines = 0;
      currentFile.deletedLines = 0;
      currentFile.blocks = [];
      currentBlock = null;
      const message = typeof config2.diffTooBigMessage === "function" ? config2.diffTooBigMessage(files.length) : "Diff too big to be displayed";
      startBlock(message);
      return;
    }
    if (line2.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) || line2.startsWith(newFileNameHeader) && prevLine.startsWith(oldFileNameHeader)) {
      if (currentFile && !currentFile.oldName && line2.startsWith("--- ") && (values = getSrcFilename(line2, config2.srcPrefix))) {
        currentFile.oldName = values;
        currentFile.language = getExtension(currentFile.oldName, currentFile.language);
        return;
      }
      if (currentFile && !currentFile.newName && line2.startsWith("+++ ") && (values = getDstFilename(line2, config2.dstPrefix))) {
        currentFile.newName = values;
        currentFile.language = getExtension(currentFile.newName, currentFile.language);
        return;
      }
    }
    if (currentFile && (line2.startsWith(hunkHeaderPrefix) || currentFile.isGitDiff && currentFile.oldName && currentFile.newName && !currentBlock)) {
      startBlock(line2);
      return;
    }
    if (currentBlock && (line2.startsWith("+") || line2.startsWith("-") || line2.startsWith(" "))) {
      createLine(line2);
      return;
    }
    const doesNotExistHunkHeader = !existHunkHeader(line2, lineIndex);
    if (currentFile === null) {
      throw new Error("Where is my file !!!");
    }
    if (values = oldMode.exec(line2)) {
      currentFile.oldMode = values[1];
    } else if (values = newMode.exec(line2)) {
      currentFile.newMode = values[1];
    } else if (values = deletedFileMode.exec(line2)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    } else if (values = newFileMode.exec(line2)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = copyFrom.exec(line2)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = copyTo.exec(line2)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = renameFrom.exec(line2)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = renameTo.exec(line2)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = binaryFiles.exec(line2)) {
      currentFile.isBinary = true;
      currentFile.oldName = getFilename(values[1], void 0, config2.srcPrefix);
      currentFile.newName = getFilename(values[2], void 0, config2.dstPrefix);
      startBlock("Binary file");
    } else if (binaryDiff.test(line2)) {
      currentFile.isBinary = true;
      startBlock(line2);
    } else if (values = similarityIndex.exec(line2)) {
      currentFile.unchangedPercentage = parseInt(values[1], 10);
    } else if (values = dissimilarityIndex.exec(line2)) {
      currentFile.changedPercentage = parseInt(values[1], 10);
    } else if (values = index.exec(line2)) {
      currentFile.checksumBefore = values[1];
      currentFile.checksumAfter = values[2];
      if (values[3])
        currentFile.mode = values[3];
    } else if (values = combinedIndex.exec(line2)) {
      currentFile.checksumBefore = [values[2], values[3]];
      currentFile.checksumAfter = values[1];
    } else if (values = combinedMode.exec(line2)) {
      currentFile.oldMode = [values[2], values[3]];
      currentFile.newMode = values[1];
    } else if (values = combinedNewFile.exec(line2)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = combinedDeletedFile.exec(line2)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    }
  });
  saveBlock();
  saveFile();
  return files;
}

// node_modules/diff/libesm/diff/base.js
var Diff = class {
  diff(oldStr, newStr, options = {}) {
    let callback;
    if (typeof options === "function") {
      callback = options;
      options = {};
    } else if ("callback" in options) {
      callback = options.callback;
    }
    const oldString = this.castInput(oldStr, options);
    const newString = this.castInput(newStr, options);
    const oldTokens = this.removeEmpty(this.tokenize(oldString, options));
    const newTokens = this.removeEmpty(this.tokenize(newString, options));
    return this.diffWithOptionsObj(oldTokens, newTokens, options, callback);
  }
  diffWithOptionsObj(oldTokens, newTokens, options, callback) {
    var _a;
    const done = (value) => {
      value = this.postProcess(value, options);
      if (callback) {
        setTimeout(function() {
          callback(value);
        }, 0);
        return void 0;
      } else {
        return value;
      }
    };
    const newLen = newTokens.length, oldLen = oldTokens.length;
    let editLength = 1;
    let maxEditLength = newLen + oldLen;
    if (options.maxEditLength != null) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    const maxExecutionTime = (_a = options.timeout) !== null && _a !== void 0 ? _a : Infinity;
    const abortAfterTimestamp = Date.now() + maxExecutionTime;
    const bestPath = [{ oldPos: -1, lastComponent: void 0 }];
    let newPos = this.extractCommon(bestPath[0], newTokens, oldTokens, 0, options);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      return done(this.buildValues(bestPath[0].lastComponent, newTokens, oldTokens));
    }
    let minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
    const execEditLength = () => {
      for (let diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        let basePath;
        const removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
        if (removePath) {
          bestPath[diagonalPath - 1] = void 0;
        }
        let canAdd = false;
        if (addPath) {
          const addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }
        const canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = void 0;
          continue;
        }
        if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
          basePath = this.addToPath(addPath, true, false, 0, options);
        } else {
          basePath = this.addToPath(removePath, false, true, 1, options);
        }
        newPos = this.extractCommon(basePath, newTokens, oldTokens, diagonalPath, options);
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return done(this.buildValues(basePath.lastComponent, newTokens, oldTokens)) || true;
        } else {
          bestPath[diagonalPath] = basePath;
          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }
          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }
      editLength++;
    };
    if (callback) {
      (function exec() {
        setTimeout(function() {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback(void 0);
          }
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        const ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  }
  addToPath(path, added, removed, oldPosInc, options) {
    const last = path.lastComponent;
    if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: { count: last.count + 1, added, removed, previousComponent: last.previousComponent }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: { count: 1, added, removed, previousComponent: last }
      };
    }
  }
  extractCommon(basePath, newTokens, oldTokens, diagonalPath, options) {
    const newLen = newTokens.length, oldLen = oldTokens.length;
    let oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldTokens[oldPos + 1], newTokens[newPos + 1], options)) {
      newPos++;
      oldPos++;
      commonCount++;
      if (options.oneChangePerToken) {
        basePath.lastComponent = { count: 1, previousComponent: basePath.lastComponent, added: false, removed: false };
      }
    }
    if (commonCount && !options.oneChangePerToken) {
      basePath.lastComponent = { count: commonCount, previousComponent: basePath.lastComponent, added: false, removed: false };
    }
    basePath.oldPos = oldPos;
    return newPos;
  }
  equals(left, right, options) {
    if (options.comparator) {
      return options.comparator(left, right);
    } else {
      return left === right || !!options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  }
  removeEmpty(array) {
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  castInput(value, options) {
    return value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenize(value, options) {
    return Array.from(value);
  }
  join(chars) {
    return chars.join("");
  }
  postProcess(changeObjects, options) {
    return changeObjects;
  }
  get useLongestToken() {
    return false;
  }
  buildValues(lastComponent, newTokens, oldTokens) {
    const components = [];
    let nextComponent;
    while (lastComponent) {
      components.push(lastComponent);
      nextComponent = lastComponent.previousComponent;
      delete lastComponent.previousComponent;
      lastComponent = nextComponent;
    }
    components.reverse();
    const componentLen = components.length;
    let componentPos = 0, newPos = 0, oldPos = 0;
    for (; componentPos < componentLen; componentPos++) {
      const component = components[componentPos];
      if (!component.removed) {
        if (!component.added && this.useLongestToken) {
          let value = newTokens.slice(newPos, newPos + component.count);
          value = value.map(function(value2, i) {
            const oldValue = oldTokens[oldPos + i];
            return oldValue.length > value2.length ? oldValue : value2;
          });
          component.value = this.join(value);
        } else {
          component.value = this.join(newTokens.slice(newPos, newPos + component.count));
        }
        newPos += component.count;
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = this.join(oldTokens.slice(oldPos, oldPos + component.count));
        oldPos += component.count;
      }
    }
    return components;
  }
};

// node_modules/diff/libesm/diff/character.js
var CharacterDiff = class extends Diff {
};
var characterDiff = new CharacterDiff();
function diffChars(oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options);
}

// node_modules/diff/libesm/util/string.js
function longestCommonPrefix(str1, str2) {
  let i;
  for (i = 0; i < str1.length && i < str2.length; i++) {
    if (str1[i] != str2[i]) {
      return str1.slice(0, i);
    }
  }
  return str1.slice(0, i);
}
function longestCommonSuffix(str1, str2) {
  let i;
  if (!str1 || !str2 || str1[str1.length - 1] != str2[str2.length - 1]) {
    return "";
  }
  for (i = 0; i < str1.length && i < str2.length; i++) {
    if (str1[str1.length - (i + 1)] != str2[str2.length - (i + 1)]) {
      return str1.slice(-i);
    }
  }
  return str1.slice(-i);
}
function replacePrefix(string, oldPrefix, newPrefix) {
  if (string.slice(0, oldPrefix.length) != oldPrefix) {
    throw Error(`string ${JSON.stringify(string)} doesn't start with prefix ${JSON.stringify(oldPrefix)}; this is a bug`);
  }
  return newPrefix + string.slice(oldPrefix.length);
}
function replaceSuffix(string, oldSuffix, newSuffix) {
  if (!oldSuffix) {
    return string + newSuffix;
  }
  if (string.slice(-oldSuffix.length) != oldSuffix) {
    throw Error(`string ${JSON.stringify(string)} doesn't end with suffix ${JSON.stringify(oldSuffix)}; this is a bug`);
  }
  return string.slice(0, -oldSuffix.length) + newSuffix;
}
function removePrefix(string, oldPrefix) {
  return replacePrefix(string, oldPrefix, "");
}
function removeSuffix(string, oldSuffix) {
  return replaceSuffix(string, oldSuffix, "");
}
function maximumOverlap(string1, string2) {
  return string2.slice(0, overlapCount(string1, string2));
}
function overlapCount(a, b) {
  let startA = 0;
  if (a.length > b.length) {
    startA = a.length - b.length;
  }
  let endB = b.length;
  if (a.length < b.length) {
    endB = a.length;
  }
  const map2 = Array(endB);
  let k = 0;
  map2[0] = 0;
  for (let j = 1; j < endB; j++) {
    if (b[j] == b[k]) {
      map2[j] = map2[k];
    } else {
      map2[j] = k;
    }
    while (k > 0 && b[j] != b[k]) {
      k = map2[k];
    }
    if (b[j] == b[k]) {
      k++;
    }
  }
  k = 0;
  for (let i = startA; i < a.length; i++) {
    while (k > 0 && a[i] != b[k]) {
      k = map2[k];
    }
    if (a[i] == b[k]) {
      k++;
    }
  }
  return k;
}
function segment(string, segmenter) {
  const parts = [];
  for (const segmentObj of Array.from(segmenter.segment(string))) {
    const segment2 = segmentObj.segment;
    if (parts.length && /\s/.test(parts[parts.length - 1]) && /\s/.test(segment2)) {
      parts[parts.length - 1] += segment2;
    } else {
      parts.push(segment2);
    }
  }
  return parts;
}
function trailingWs(string, segmenter) {
  if (segmenter) {
    return leadingAndTrailingWs(string, segmenter)[1];
  }
  let i;
  for (i = string.length - 1; i >= 0; i--) {
    if (!string[i].match(/\s/)) {
      break;
    }
  }
  return string.substring(i + 1);
}
function leadingWs(string, segmenter) {
  if (segmenter) {
    return leadingAndTrailingWs(string, segmenter)[0];
  }
  const match = string.match(/^\s*/);
  return match ? match[0] : "";
}
function leadingAndTrailingWs(string, segmenter) {
  if (!segmenter) {
    return [leadingWs(string), trailingWs(string)];
  }
  if (segmenter.resolvedOptions().granularity != "word") {
    throw new Error('The segmenter passed must have a granularity of "word"');
  }
  const segments = segment(string, segmenter);
  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];
  const head = /\s/.test(firstSeg) ? firstSeg : "";
  const tail = /\s/.test(lastSeg) ? lastSeg : "";
  return [head, tail];
}

// node_modules/diff/libesm/diff/word.js
var extendedWordChars = "a-zA-Z0-9_\\u{AD}\\u{C0}-\\u{D6}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}";
var tokenizeIncludingWhitespace = new RegExp(`[${extendedWordChars}]+|\\s+|[^${extendedWordChars}]`, "ug");
var WordDiff = class extends Diff {
  equals(left, right, options) {
    if (options.ignoreCase) {
      left = left.toLowerCase();
      right = right.toLowerCase();
    }
    return left.trim() === right.trim();
  }
  tokenize(value, options = {}) {
    let parts;
    if (options.intlSegmenter) {
      const segmenter = options.intlSegmenter;
      if (segmenter.resolvedOptions().granularity != "word") {
        throw new Error('The segmenter passed must have a granularity of "word"');
      }
      parts = segment(value, segmenter);
    } else {
      parts = value.match(tokenizeIncludingWhitespace) || [];
    }
    const tokens = [];
    let prevPart = null;
    parts.forEach((part) => {
      if (/\s/.test(part)) {
        if (prevPart == null) {
          tokens.push(part);
        } else {
          tokens.push(tokens.pop() + part);
        }
      } else if (prevPart != null && /\s/.test(prevPart)) {
        if (tokens[tokens.length - 1] == prevPart) {
          tokens.push(tokens.pop() + part);
        } else {
          tokens.push(prevPart + part);
        }
      } else {
        tokens.push(part);
      }
      prevPart = part;
    });
    return tokens;
  }
  join(tokens) {
    return tokens.map((token3, i) => {
      if (i == 0) {
        return token3;
      } else {
        return token3.replace(/^\s+/, "");
      }
    }).join("");
  }
  postProcess(changes2, options) {
    if (!changes2 || options.oneChangePerToken) {
      return changes2;
    }
    let lastKeep = null;
    let insertion = null;
    let deletion = null;
    changes2.forEach((change) => {
      if (change.added) {
        insertion = change;
      } else if (change.removed) {
        deletion = change;
      } else {
        if (insertion || deletion) {
          dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, change, options.intlSegmenter);
        }
        lastKeep = change;
        insertion = null;
        deletion = null;
      }
    });
    if (insertion || deletion) {
      dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, null, options.intlSegmenter);
    }
    return changes2;
  }
};
var wordDiff = new WordDiff();
function dedupeWhitespaceInChangeObjects(startKeep, deletion, insertion, endKeep, segmenter) {
  if (deletion && insertion) {
    const [oldWsPrefix, oldWsSuffix] = leadingAndTrailingWs(deletion.value, segmenter);
    const [newWsPrefix, newWsSuffix] = leadingAndTrailingWs(insertion.value, segmenter);
    if (startKeep) {
      const commonWsPrefix = longestCommonPrefix(oldWsPrefix, newWsPrefix);
      startKeep.value = replaceSuffix(startKeep.value, newWsPrefix, commonWsPrefix);
      deletion.value = removePrefix(deletion.value, commonWsPrefix);
      insertion.value = removePrefix(insertion.value, commonWsPrefix);
    }
    if (endKeep) {
      const commonWsSuffix = longestCommonSuffix(oldWsSuffix, newWsSuffix);
      endKeep.value = replacePrefix(endKeep.value, newWsSuffix, commonWsSuffix);
      deletion.value = removeSuffix(deletion.value, commonWsSuffix);
      insertion.value = removeSuffix(insertion.value, commonWsSuffix);
    }
  } else if (insertion) {
    if (startKeep) {
      const ws = leadingWs(insertion.value, segmenter);
      insertion.value = insertion.value.substring(ws.length);
    }
    if (endKeep) {
      const ws = leadingWs(endKeep.value, segmenter);
      endKeep.value = endKeep.value.substring(ws.length);
    }
  } else if (startKeep && endKeep) {
    const newWsFull = leadingWs(endKeep.value, segmenter), [delWsStart, delWsEnd] = leadingAndTrailingWs(deletion.value, segmenter);
    const newWsStart = longestCommonPrefix(newWsFull, delWsStart);
    deletion.value = removePrefix(deletion.value, newWsStart);
    const newWsEnd = longestCommonSuffix(removePrefix(newWsFull, newWsStart), delWsEnd);
    deletion.value = removeSuffix(deletion.value, newWsEnd);
    endKeep.value = replacePrefix(endKeep.value, newWsFull, newWsEnd);
    startKeep.value = replaceSuffix(startKeep.value, newWsFull, newWsFull.slice(0, newWsFull.length - newWsEnd.length));
  } else if (endKeep) {
    const endKeepWsPrefix = leadingWs(endKeep.value, segmenter);
    const deletionWsSuffix = trailingWs(deletion.value, segmenter);
    const overlap = maximumOverlap(deletionWsSuffix, endKeepWsPrefix);
    deletion.value = removeSuffix(deletion.value, overlap);
  } else if (startKeep) {
    const startKeepWsSuffix = trailingWs(startKeep.value, segmenter);
    const deletionWsPrefix = leadingWs(deletion.value, segmenter);
    const overlap = maximumOverlap(startKeepWsSuffix, deletionWsPrefix);
    deletion.value = removePrefix(deletion.value, overlap);
  }
}
var WordsWithSpaceDiff = class extends Diff {
  tokenize(value) {
    const regex2 = new RegExp(`(\\r?\\n)|[${extendedWordChars}]+|[^\\S\\n\\r]+|[^${extendedWordChars}]`, "ug");
    return value.match(regex2) || [];
  }
};
var wordsWithSpaceDiff = new WordsWithSpaceDiff();
function diffWordsWithSpace(oldStr, newStr, options) {
  return wordsWithSpaceDiff.diff(oldStr, newStr, options);
}

// node_modules/diff2html/lib-esm/rematch.js
function levenshtein(a, b) {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }
  const matrix = [];
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
}
function newDistanceFn(str) {
  return (x, y) => {
    const xValue = str(x).trim();
    const yValue = str(y).trim();
    const lev = levenshtein(xValue, yValue);
    return lev / (xValue.length + yValue.length);
  };
}
function newMatcherFn(distance2) {
  function findBestMatch(a, b, cache = /* @__PURE__ */ new Map()) {
    let bestMatchDist = Infinity;
    let bestMatch;
    for (let i = 0; i < a.length; ++i) {
      for (let j = 0; j < b.length; ++j) {
        const cacheKey = JSON.stringify([a[i], b[j]]);
        let md;
        if (!(cache.has(cacheKey) && (md = cache.get(cacheKey)))) {
          md = distance2(a[i], b[j]);
          cache.set(cacheKey, md);
        }
        if (md < bestMatchDist) {
          bestMatchDist = md;
          bestMatch = { indexA: i, indexB: j, score: bestMatchDist };
        }
      }
    }
    return bestMatch;
  }
  function group(a, b, level = 0, cache = /* @__PURE__ */ new Map()) {
    const bm = findBestMatch(a, b, cache);
    if (!bm || a.length + b.length < 3) {
      return [[a, b]];
    }
    const a1 = a.slice(0, bm.indexA);
    const b1 = b.slice(0, bm.indexB);
    const aMatch = [a[bm.indexA]];
    const bMatch = [b[bm.indexB]];
    const tailA = bm.indexA + 1;
    const tailB = bm.indexB + 1;
    const a2 = a.slice(tailA);
    const b2 = b.slice(tailB);
    const group1 = group(a1, b1, level + 1, cache);
    const groupMatch = group(aMatch, bMatch, level + 1, cache);
    const group2 = group(a2, b2, level + 1, cache);
    let result = groupMatch;
    if (bm.indexA > 0 || bm.indexB > 0) {
      result = group1.concat(result);
    }
    if (a.length > tailA || b.length > tailB) {
      result = result.concat(group2);
    }
    return result;
  }
  return group;
}

// node_modules/diff2html/lib-esm/render-utils.js
var CSSLineClass = {
  INSERTS: "d2h-ins",
  DELETES: "d2h-del",
  CONTEXT: "d2h-cntx",
  INFO: "d2h-info",
  INSERT_CHANGES: "d2h-ins d2h-change",
  DELETE_CHANGES: "d2h-del d2h-change"
};
var defaultRenderConfig = {
  matching: LineMatchingType.NONE,
  matchWordsThreshold: 0.25,
  maxLineLengthHighlight: 1e4,
  diffStyle: DiffStyleType.WORD,
  colorScheme: ColorSchemeType.LIGHT
};
var separator = "/";
var distance = newDistanceFn((change) => change.value);
var matcher = newMatcherFn(distance);
function isDevNullName(name) {
  return name.indexOf("dev/null") !== -1;
}
function removeInsElements(line2) {
  return line2.replace(/(<ins[^>]*>((.|\n)*?)<\/ins>)/g, "");
}
function removeDelElements(line2) {
  return line2.replace(/(<del[^>]*>((.|\n)*?)<\/del>)/g, "");
}
function toCSSClass(lineType) {
  switch (lineType) {
    case LineType.CONTEXT:
      return CSSLineClass.CONTEXT;
    case LineType.INSERT:
      return CSSLineClass.INSERTS;
    case LineType.DELETE:
      return CSSLineClass.DELETES;
  }
}
function colorSchemeToCss(colorScheme) {
  switch (colorScheme) {
    case ColorSchemeType.DARK:
      return "d2h-dark-color-scheme";
    case ColorSchemeType.AUTO:
      return "d2h-auto-color-scheme";
    case ColorSchemeType.LIGHT:
    default:
      return "d2h-light-color-scheme";
  }
}
function prefixLength(isCombined) {
  return isCombined ? 2 : 1;
}
function escapeForHtml(str) {
  return str.slice(0).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
}
function deconstructLine(line2, isCombined, escape2 = true) {
  const indexToSplit = prefixLength(isCombined);
  return {
    prefix: line2.substring(0, indexToSplit),
    content: escape2 ? escapeForHtml(line2.substring(indexToSplit)) : line2.substring(indexToSplit)
  };
}
function filenameDiff(file) {
  const oldFilename = unifyPath(file.oldName);
  const newFilename = unifyPath(file.newName);
  if (oldFilename !== newFilename && !isDevNullName(oldFilename) && !isDevNullName(newFilename)) {
    const prefixPaths = [];
    const suffixPaths = [];
    const oldFilenameParts = oldFilename.split(separator);
    const newFilenameParts = newFilename.split(separator);
    const oldFilenamePartsSize = oldFilenameParts.length;
    const newFilenamePartsSize = newFilenameParts.length;
    let i = 0;
    let j = oldFilenamePartsSize - 1;
    let k = newFilenamePartsSize - 1;
    while (i < j && i < k) {
      if (oldFilenameParts[i] === newFilenameParts[i]) {
        prefixPaths.push(newFilenameParts[i]);
        i += 1;
      } else {
        break;
      }
    }
    while (j > i && k > i) {
      if (oldFilenameParts[j] === newFilenameParts[k]) {
        suffixPaths.unshift(newFilenameParts[k]);
        j -= 1;
        k -= 1;
      } else {
        break;
      }
    }
    const finalPrefix = prefixPaths.join(separator);
    const finalSuffix = suffixPaths.join(separator);
    const oldRemainingPath = oldFilenameParts.slice(i, j + 1).join(separator);
    const newRemainingPath = newFilenameParts.slice(i, k + 1).join(separator);
    if (finalPrefix.length && finalSuffix.length) {
      return finalPrefix + separator + "{" + oldRemainingPath + " \u2192 " + newRemainingPath + "}" + separator + finalSuffix;
    } else if (finalPrefix.length) {
      return finalPrefix + separator + "{" + oldRemainingPath + " \u2192 " + newRemainingPath + "}";
    } else if (finalSuffix.length) {
      return "{" + oldRemainingPath + " \u2192 " + newRemainingPath + "}" + separator + finalSuffix;
    }
    return oldFilename + " \u2192 " + newFilename;
  } else if (!isDevNullName(newFilename)) {
    return newFilename;
  } else {
    return oldFilename;
  }
}
function getHtmlId(file) {
  return `d2h-${hashCode(filenameDiff(file)).toString().slice(-6)}`;
}
function getFileIcon(file) {
  let templateName = "file-changed";
  if (file.isRename) {
    templateName = "file-renamed";
  } else if (file.isCopy) {
    templateName = "file-renamed";
  } else if (file.isNew) {
    templateName = "file-added";
  } else if (file.isDeleted) {
    templateName = "file-deleted";
  } else if (file.newName !== file.oldName) {
    templateName = "file-renamed";
  }
  return templateName;
}
function diffHighlight(diffLine1, diffLine2, isCombined, config2 = {}) {
  const { matching, maxLineLengthHighlight, matchWordsThreshold, diffStyle } = Object.assign(Object.assign({}, defaultRenderConfig), config2);
  const line1 = deconstructLine(diffLine1, isCombined, false);
  const line2 = deconstructLine(diffLine2, isCombined, false);
  if (line1.content.length > maxLineLengthHighlight || line2.content.length > maxLineLengthHighlight) {
    return {
      oldLine: {
        prefix: line1.prefix,
        content: escapeForHtml(line1.content)
      },
      newLine: {
        prefix: line2.prefix,
        content: escapeForHtml(line2.content)
      }
    };
  }
  const diff = diffStyle === "char" ? diffChars(line1.content, line2.content) : diffWordsWithSpace(line1.content, line2.content);
  const changedWords = [];
  if (diffStyle === "word" && matching === "words") {
    const removed = diff.filter((element) => element.removed);
    const added = diff.filter((element) => element.added);
    const chunks = matcher(added, removed);
    chunks.forEach((chunk) => {
      if (chunk[0].length === 1 && chunk[1].length === 1) {
        const dist = distance(chunk[0][0], chunk[1][0]);
        if (dist < matchWordsThreshold) {
          changedWords.push(chunk[0][0]);
          changedWords.push(chunk[1][0]);
        }
      }
    });
  }
  const highlightedLine = diff.reduce((highlightedLine2, part) => {
    const elemType = part.added ? "ins" : part.removed ? "del" : null;
    const addClass = changedWords.indexOf(part) > -1 ? ' class="d2h-change"' : "";
    const escapedValue = escapeForHtml(part.value);
    return elemType !== null ? `${highlightedLine2}<${elemType}${addClass}>${escapedValue}</${elemType}>` : `${highlightedLine2}${escapedValue}`;
  }, "");
  return {
    oldLine: {
      prefix: line1.prefix,
      content: removeInsElements(highlightedLine)
    },
    newLine: {
      prefix: line2.prefix,
      content: removeDelElements(highlightedLine)
    }
  };
}

// node_modules/diff2html/lib-esm/file-list-renderer.js
var baseTemplatesPath = "file-summary";
var iconsBaseTemplatesPath = "icon";
var defaultFileListRendererConfig = {
  colorScheme: defaultRenderConfig.colorScheme
};
var FileListRenderer = class {
  constructor(hoganUtils, config2 = {}) {
    this.hoganUtils = hoganUtils;
    this.config = Object.assign(Object.assign({}, defaultFileListRendererConfig), config2);
  }
  render(diffFiles) {
    const files = diffFiles.map((file) => this.hoganUtils.render(baseTemplatesPath, "line", {
      fileHtmlId: getHtmlId(file),
      oldName: file.oldName,
      newName: file.newName,
      fileName: filenameDiff(file),
      deletedLines: "-" + file.deletedLines,
      addedLines: "+" + file.addedLines
    }, {
      fileIcon: this.hoganUtils.template(iconsBaseTemplatesPath, getFileIcon(file))
    })).join("\n");
    return this.hoganUtils.render(baseTemplatesPath, "wrapper", {
      colorScheme: colorSchemeToCss(this.config.colorScheme),
      filesNumber: diffFiles.length,
      files
    });
  }
};

// node_modules/diff2html/lib-esm/line-by-line-renderer.js
var defaultLineByLineRendererConfig = Object.assign(Object.assign({}, defaultRenderConfig), { renderNothingWhenEmpty: false, matchingMaxComparisons: 2500, maxLineSizeInBlockForComparison: 200 });
var genericTemplatesPath = "generic";
var baseTemplatesPath2 = "line-by-line";
var iconsBaseTemplatesPath2 = "icon";
var tagsBaseTemplatesPath = "tag";
var LineByLineRenderer = class {
  constructor(hoganUtils, config2 = {}) {
    this.hoganUtils = hoganUtils;
    this.config = Object.assign(Object.assign({}, defaultLineByLineRendererConfig), config2);
  }
  render(diffFiles) {
    const diffsHtml = diffFiles.map((file) => {
      let diffs;
      if (file.blocks.length) {
        diffs = this.generateFileHtml(file);
      } else {
        diffs = this.generateEmptyDiff();
      }
      return this.makeFileDiffHtml(file, diffs);
    }).join("\n");
    return this.hoganUtils.render(genericTemplatesPath, "wrapper", {
      colorScheme: colorSchemeToCss(this.config.colorScheme),
      content: diffsHtml
    });
  }
  makeFileDiffHtml(file, diffs) {
    if (this.config.renderNothingWhenEmpty && Array.isArray(file.blocks) && file.blocks.length === 0)
      return "";
    const fileDiffTemplate = this.hoganUtils.template(baseTemplatesPath2, "file-diff");
    const filePathTemplate = this.hoganUtils.template(genericTemplatesPath, "file-path");
    const fileIconTemplate = this.hoganUtils.template(iconsBaseTemplatesPath2, "file");
    const fileTagTemplate = this.hoganUtils.template(tagsBaseTemplatesPath, getFileIcon(file));
    return fileDiffTemplate.render({
      file,
      fileHtmlId: getHtmlId(file),
      diffs,
      filePath: filePathTemplate.render({
        fileDiffName: filenameDiff(file)
      }, {
        fileIcon: fileIconTemplate,
        fileTag: fileTagTemplate
      })
    });
  }
  generateEmptyDiff() {
    return this.hoganUtils.render(genericTemplatesPath, "empty-diff", {
      contentClass: "d2h-code-line",
      CSSLineClass
    });
  }
  generateFileHtml(file) {
    const matcher2 = newMatcherFn(newDistanceFn((e) => deconstructLine(e.content, file.isCombined).content));
    return file.blocks.map((block2) => {
      let lines2 = this.hoganUtils.render(genericTemplatesPath, "block-header", {
        CSSLineClass,
        blockHeader: file.isTooBig ? block2.header : escapeForHtml(block2.header),
        lineClass: "d2h-code-linenumber",
        contentClass: "d2h-code-line"
      });
      this.applyLineGroupping(block2).forEach(([contextLines, oldLines, newLines]) => {
        if (oldLines.length && newLines.length && !contextLines.length) {
          this.applyRematchMatching(oldLines, newLines, matcher2).map(([oldLines2, newLines2]) => {
            const { left, right } = this.processChangedLines(file, file.isCombined, oldLines2, newLines2);
            lines2 += left;
            lines2 += right;
          });
        } else if (contextLines.length) {
          contextLines.forEach((line2) => {
            const { prefix, content: content2 } = deconstructLine(line2.content, file.isCombined);
            lines2 += this.generateSingleLineHtml(file, {
              type: CSSLineClass.CONTEXT,
              prefix,
              content: content2,
              oldNumber: line2.oldNumber,
              newNumber: line2.newNumber
            });
          });
        } else if (oldLines.length || newLines.length) {
          const { left, right } = this.processChangedLines(file, file.isCombined, oldLines, newLines);
          lines2 += left;
          lines2 += right;
        } else {
          console.error("Unknown state reached while processing groups of lines", contextLines, oldLines, newLines);
        }
      });
      return lines2;
    }).join("\n");
  }
  applyLineGroupping(block2) {
    const blockLinesGroups = [];
    let oldLines = [];
    let newLines = [];
    for (let i = 0; i < block2.lines.length; i++) {
      const diffLine = block2.lines[i];
      if (diffLine.type !== LineType.INSERT && newLines.length || diffLine.type === LineType.CONTEXT && oldLines.length > 0) {
        blockLinesGroups.push([[], oldLines, newLines]);
        oldLines = [];
        newLines = [];
      }
      if (diffLine.type === LineType.CONTEXT) {
        blockLinesGroups.push([[diffLine], [], []]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length === 0) {
        blockLinesGroups.push([[], [], [diffLine]]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length > 0) {
        newLines.push(diffLine);
      } else if (diffLine.type === LineType.DELETE) {
        oldLines.push(diffLine);
      }
    }
    if (oldLines.length || newLines.length) {
      blockLinesGroups.push([[], oldLines, newLines]);
      oldLines = [];
      newLines = [];
    }
    return blockLinesGroups;
  }
  applyRematchMatching(oldLines, newLines, matcher2) {
    const comparisons = oldLines.length * newLines.length;
    const maxLineSizeInBlock = max(oldLines.concat(newLines).map((elem) => elem.content.length));
    const doMatching = comparisons < this.config.matchingMaxComparisons && maxLineSizeInBlock < this.config.maxLineSizeInBlockForComparison && (this.config.matching === "lines" || this.config.matching === "words");
    return doMatching ? matcher2(oldLines, newLines) : [[oldLines, newLines]];
  }
  processChangedLines(file, isCombined, oldLines, newLines) {
    const fileHtml = {
      right: "",
      left: ""
    };
    const maxLinesNumber = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLinesNumber; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      const diff = oldLine !== void 0 && newLine !== void 0 ? diffHighlight(oldLine.content, newLine.content, isCombined, this.config) : void 0;
      const preparedOldLine = oldLine !== void 0 && oldLine.oldNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
        prefix: diff.oldLine.prefix,
        content: diff.oldLine.content,
        type: CSSLineClass.DELETE_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(oldLine.content, isCombined)), { type: toCSSClass(oldLine.type) })), { oldNumber: oldLine.oldNumber, newNumber: oldLine.newNumber }) : void 0;
      const preparedNewLine = newLine !== void 0 && newLine.newNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
        prefix: diff.newLine.prefix,
        content: diff.newLine.content,
        type: CSSLineClass.INSERT_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(newLine.content, isCombined)), { type: toCSSClass(newLine.type) })), { oldNumber: newLine.oldNumber, newNumber: newLine.newNumber }) : void 0;
      const { left, right } = this.generateLineHtml(file, preparedOldLine, preparedNewLine);
      fileHtml.left += left;
      fileHtml.right += right;
    }
    return fileHtml;
  }
  generateLineHtml(file, oldLine, newLine) {
    return {
      left: this.generateSingleLineHtml(file, oldLine),
      right: this.generateSingleLineHtml(file, newLine)
    };
  }
  generateSingleLineHtml(file, line2) {
    if (line2 === void 0)
      return "";
    const lineNumberHtml = this.hoganUtils.render(baseTemplatesPath2, "numbers", {
      oldNumber: line2.oldNumber || "",
      newNumber: line2.newNumber || ""
    });
    return this.hoganUtils.render(genericTemplatesPath, "line", {
      type: line2.type,
      lineClass: "d2h-code-linenumber",
      contentClass: "d2h-code-line",
      prefix: line2.prefix === " " ? "&nbsp;" : line2.prefix,
      content: line2.content,
      lineNumber: lineNumberHtml,
      line: line2,
      file
    });
  }
};

// node_modules/diff2html/lib-esm/side-by-side-renderer.js
var defaultSideBySideRendererConfig = Object.assign(Object.assign({}, defaultRenderConfig), { renderNothingWhenEmpty: false, matchingMaxComparisons: 2500, maxLineSizeInBlockForComparison: 200 });
var genericTemplatesPath2 = "generic";
var baseTemplatesPath3 = "side-by-side";
var iconsBaseTemplatesPath3 = "icon";
var tagsBaseTemplatesPath2 = "tag";
var SideBySideRenderer = class {
  constructor(hoganUtils, config2 = {}) {
    this.hoganUtils = hoganUtils;
    this.config = Object.assign(Object.assign({}, defaultSideBySideRendererConfig), config2);
  }
  render(diffFiles) {
    const diffsHtml = diffFiles.map((file) => {
      let diffs;
      if (file.blocks.length) {
        diffs = this.generateFileHtml(file);
      } else {
        diffs = this.generateEmptyDiff();
      }
      return this.makeFileDiffHtml(file, diffs);
    }).join("\n");
    return this.hoganUtils.render(genericTemplatesPath2, "wrapper", {
      colorScheme: colorSchemeToCss(this.config.colorScheme),
      content: diffsHtml
    });
  }
  makeFileDiffHtml(file, diffs) {
    if (this.config.renderNothingWhenEmpty && Array.isArray(file.blocks) && file.blocks.length === 0)
      return "";
    const fileDiffTemplate = this.hoganUtils.template(baseTemplatesPath3, "file-diff");
    const filePathTemplate = this.hoganUtils.template(genericTemplatesPath2, "file-path");
    const fileIconTemplate = this.hoganUtils.template(iconsBaseTemplatesPath3, "file");
    const fileTagTemplate = this.hoganUtils.template(tagsBaseTemplatesPath2, getFileIcon(file));
    return fileDiffTemplate.render({
      file,
      fileHtmlId: getHtmlId(file),
      diffs,
      filePath: filePathTemplate.render({
        fileDiffName: filenameDiff(file)
      }, {
        fileIcon: fileIconTemplate,
        fileTag: fileTagTemplate
      })
    });
  }
  generateEmptyDiff() {
    return {
      right: "",
      left: this.hoganUtils.render(genericTemplatesPath2, "empty-diff", {
        contentClass: "d2h-code-side-line",
        CSSLineClass
      })
    };
  }
  generateFileHtml(file) {
    const matcher2 = newMatcherFn(newDistanceFn((e) => deconstructLine(e.content, file.isCombined).content));
    return file.blocks.map((block2) => {
      const fileHtml = {
        left: this.makeHeaderHtml(block2.header, file),
        right: this.makeHeaderHtml("")
      };
      this.applyLineGroupping(block2).forEach(([contextLines, oldLines, newLines]) => {
        if (oldLines.length && newLines.length && !contextLines.length) {
          this.applyRematchMatching(oldLines, newLines, matcher2).map(([oldLines2, newLines2]) => {
            const { left, right } = this.processChangedLines(file.isCombined, oldLines2, newLines2);
            fileHtml.left += left;
            fileHtml.right += right;
          });
        } else if (contextLines.length) {
          contextLines.forEach((line2) => {
            const { prefix, content: content2 } = deconstructLine(line2.content, file.isCombined);
            const { left, right } = this.generateLineHtml({
              type: CSSLineClass.CONTEXT,
              prefix,
              content: content2,
              number: line2.oldNumber
            }, {
              type: CSSLineClass.CONTEXT,
              prefix,
              content: content2,
              number: line2.newNumber
            });
            fileHtml.left += left;
            fileHtml.right += right;
          });
        } else if (oldLines.length || newLines.length) {
          const { left, right } = this.processChangedLines(file.isCombined, oldLines, newLines);
          fileHtml.left += left;
          fileHtml.right += right;
        } else {
          console.error("Unknown state reached while processing groups of lines", contextLines, oldLines, newLines);
        }
      });
      return fileHtml;
    }).reduce((accomulated, html2) => {
      return { left: accomulated.left + html2.left, right: accomulated.right + html2.right };
    }, { left: "", right: "" });
  }
  applyLineGroupping(block2) {
    const blockLinesGroups = [];
    let oldLines = [];
    let newLines = [];
    for (let i = 0; i < block2.lines.length; i++) {
      const diffLine = block2.lines[i];
      if (diffLine.type !== LineType.INSERT && newLines.length || diffLine.type === LineType.CONTEXT && oldLines.length > 0) {
        blockLinesGroups.push([[], oldLines, newLines]);
        oldLines = [];
        newLines = [];
      }
      if (diffLine.type === LineType.CONTEXT) {
        blockLinesGroups.push([[diffLine], [], []]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length === 0) {
        blockLinesGroups.push([[], [], [diffLine]]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length > 0) {
        newLines.push(diffLine);
      } else if (diffLine.type === LineType.DELETE) {
        oldLines.push(diffLine);
      }
    }
    if (oldLines.length || newLines.length) {
      blockLinesGroups.push([[], oldLines, newLines]);
      oldLines = [];
      newLines = [];
    }
    return blockLinesGroups;
  }
  applyRematchMatching(oldLines, newLines, matcher2) {
    const comparisons = oldLines.length * newLines.length;
    const maxLineSizeInBlock = max(oldLines.concat(newLines).map((elem) => elem.content.length));
    const doMatching = comparisons < this.config.matchingMaxComparisons && maxLineSizeInBlock < this.config.maxLineSizeInBlockForComparison && (this.config.matching === "lines" || this.config.matching === "words");
    return doMatching ? matcher2(oldLines, newLines) : [[oldLines, newLines]];
  }
  makeHeaderHtml(blockHeader, file) {
    return this.hoganUtils.render(genericTemplatesPath2, "block-header", {
      CSSLineClass,
      blockHeader: (file === null || file === void 0 ? void 0 : file.isTooBig) ? blockHeader : escapeForHtml(blockHeader),
      lineClass: "d2h-code-side-linenumber",
      contentClass: "d2h-code-side-line"
    });
  }
  processChangedLines(isCombined, oldLines, newLines) {
    const fileHtml = {
      right: "",
      left: ""
    };
    const maxLinesNumber = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLinesNumber; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      const diff = oldLine !== void 0 && newLine !== void 0 ? diffHighlight(oldLine.content, newLine.content, isCombined, this.config) : void 0;
      const preparedOldLine = oldLine !== void 0 && oldLine.oldNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
        prefix: diff.oldLine.prefix,
        content: diff.oldLine.content,
        type: CSSLineClass.DELETE_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(oldLine.content, isCombined)), { type: toCSSClass(oldLine.type) })), { number: oldLine.oldNumber }) : void 0;
      const preparedNewLine = newLine !== void 0 && newLine.newNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
        prefix: diff.newLine.prefix,
        content: diff.newLine.content,
        type: CSSLineClass.INSERT_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(newLine.content, isCombined)), { type: toCSSClass(newLine.type) })), { number: newLine.newNumber }) : void 0;
      const { left, right } = this.generateLineHtml(preparedOldLine, preparedNewLine);
      fileHtml.left += left;
      fileHtml.right += right;
    }
    return fileHtml;
  }
  generateLineHtml(oldLine, newLine) {
    return {
      left: this.generateSingleHtml(oldLine),
      right: this.generateSingleHtml(newLine)
    };
  }
  generateSingleHtml(line2) {
    const lineClass = "d2h-code-side-linenumber";
    const contentClass = "d2h-code-side-line";
    return this.hoganUtils.render(genericTemplatesPath2, "line", {
      type: (line2 === null || line2 === void 0 ? void 0 : line2.type) || `${CSSLineClass.CONTEXT} d2h-emptyplaceholder`,
      lineClass: line2 !== void 0 ? lineClass : `${lineClass} d2h-code-side-emptyplaceholder`,
      contentClass: line2 !== void 0 ? contentClass : `${contentClass} d2h-code-side-emptyplaceholder`,
      prefix: (line2 === null || line2 === void 0 ? void 0 : line2.prefix) === " " ? "&nbsp;" : line2 === null || line2 === void 0 ? void 0 : line2.prefix,
      content: line2 === null || line2 === void 0 ? void 0 : line2.content,
      lineNumber: line2 === null || line2 === void 0 ? void 0 : line2.number
    });
  }
};

// node_modules/diff2html/lib-esm/hoganjs-utils.js
var Hogan3 = __toESM(require_hogan());

// node_modules/diff2html/lib-esm/diff2html-templates.js
var Hogan2 = __toESM(require_hogan());
var defaultTemplates = {};
defaultTemplates["file-summary-line"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<li class="d2h-file-list-line">');
  t.b("\n" + i);
  t.b('    <span class="d2h-file-name-wrapper">');
  t.b("\n" + i);
  t.b(t.rp("<fileIcon0", c, p, "      "));
  t.b('      <a href="#');
  t.b(t.v(t.f("fileHtmlId", c, p, 0)));
  t.b('" class="d2h-file-name">');
  t.b(t.v(t.f("fileName", c, p, 0)));
  t.b("</a>");
  t.b("\n" + i);
  t.b('      <span class="d2h-file-stats">');
  t.b("\n" + i);
  t.b('          <span class="d2h-lines-added">');
  t.b(t.v(t.f("addedLines", c, p, 0)));
  t.b("</span>");
  t.b("\n" + i);
  t.b('          <span class="d2h-lines-deleted">');
  t.b(t.v(t.f("deletedLines", c, p, 0)));
  t.b("</span>");
  t.b("\n" + i);
  t.b("      </span>");
  t.b("\n" + i);
  t.b("    </span>");
  t.b("\n" + i);
  t.b("</li>");
  return t.fl();
}, partials: { "<fileIcon0": { name: "fileIcon", partials: {}, subs: {} } }, subs: {} });
defaultTemplates["file-summary-wrapper"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div class="d2h-file-list-wrapper ');
  t.b(t.v(t.f("colorScheme", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('    <div class="d2h-file-list-header">');
  t.b("\n" + i);
  t.b('        <span class="d2h-file-list-title">Files changed (');
  t.b(t.v(t.f("filesNumber", c, p, 0)));
  t.b(")</span>");
  t.b("\n" + i);
  t.b('        <a class="d2h-file-switch d2h-hide">hide</a>');
  t.b("\n" + i);
  t.b('        <a class="d2h-file-switch d2h-show">show</a>');
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b('    <ol class="d2h-file-list">');
  t.b("\n" + i);
  t.b("    ");
  t.b(t.t(t.f("files", c, p, 0)));
  t.b("\n" + i);
  t.b("    </ol>");
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-block-header"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b("<tr>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.f("lineClass", c, p, 0)));
  t.b(" ");
  t.b(t.v(t.d("CSSLineClass.INFO", c, p, 0)));
  t.b('"></td>');
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.d("CSSLineClass.INFO", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('        <div class="');
  t.b(t.v(t.f("contentClass", c, p, 0)));
  t.b('">');
  if (t.s(t.f("blockHeader", c, p, 1), c, p, 0, 156, 173, "{{ }}")) {
    t.rs(c, p, function(c2, p2, t2) {
      t2.b(t2.t(t2.f("blockHeader", c2, p2, 0)));
    });
    c.pop();
  }
  if (!t.s(t.f("blockHeader", c, p, 1), c, p, 1, 0, 0, "")) {
    t.b("&nbsp;");
  }
  ;
  t.b("</div>");
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b("</tr>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-empty-diff"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b("<tr>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.d("CSSLineClass.INFO", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('        <div class="');
  t.b(t.v(t.f("contentClass", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b("            File without changes");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b("</tr>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-file-path"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-file-name-wrapper">');
  t.b("\n" + i);
  t.b(t.rp("<fileIcon0", c, p, "    "));
  t.b('    <span class="d2h-file-name">');
  t.b(t.v(t.f("fileDiffName", c, p, 0)));
  t.b("</span>");
  t.b("\n" + i);
  t.b(t.rp("<fileTag1", c, p, "    "));
  t.b("</span>");
  t.b("\n" + i);
  t.b('<label class="d2h-file-collapse">');
  t.b("\n" + i);
  t.b('    <input class="d2h-file-collapse-input" type="checkbox" name="viewed" value="viewed">');
  t.b("\n" + i);
  t.b("    Viewed");
  t.b("\n" + i);
  t.b("</label>");
  return t.fl();
}, partials: { "<fileIcon0": { name: "fileIcon", partials: {}, subs: {} }, "<fileTag1": { name: "fileTag", partials: {}, subs: {} } }, subs: {} });
defaultTemplates["generic-line"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b("<tr>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.f("lineClass", c, p, 0)));
  t.b(" ");
  t.b(t.v(t.f("type", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b("      ");
  t.b(t.t(t.f("lineNumber", c, p, 0)));
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.f("type", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('        <div class="');
  t.b(t.v(t.f("contentClass", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  if (t.s(t.f("prefix", c, p, 1), c, p, 0, 162, 238, "{{ }}")) {
    t.rs(c, p, function(c2, p2, t2) {
      t2.b('            <span class="d2h-code-line-prefix">');
      t2.b(t2.t(t2.f("prefix", c2, p2, 0)));
      t2.b("</span>");
      t2.b("\n" + i);
    });
    c.pop();
  }
  if (!t.s(t.f("prefix", c, p, 1), c, p, 1, 0, 0, "")) {
    t.b('            <span class="d2h-code-line-prefix">&nbsp;</span>');
    t.b("\n" + i);
  }
  ;
  if (t.s(t.f("content", c, p, 1), c, p, 0, 371, 445, "{{ }}")) {
    t.rs(c, p, function(c2, p2, t2) {
      t2.b('            <span class="d2h-code-line-ctn">');
      t2.b(t2.t(t2.f("content", c2, p2, 0)));
      t2.b("</span>");
      t2.b("\n" + i);
    });
    c.pop();
  }
  if (!t.s(t.f("content", c, p, 1), c, p, 1, 0, 0, "")) {
    t.b('            <span class="d2h-code-line-ctn"><br></span>');
    t.b("\n" + i);
  }
  ;
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b("</tr>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-wrapper"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div class="d2h-wrapper ');
  t.b(t.v(t.f("colorScheme", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b("    ");
  t.b(t.t(t.f("content", c, p, 0)));
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-added"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-added" height="16" title="added" version="1.1" viewBox="0 0 14 16"');
  t.b("\n" + i);
  t.b('     width="14">');
  t.b("\n" + i);
  t.b('    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM6 9H3V7h3V4h2v3h3v2H8v3H6V9z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-changed"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-changed" height="16" title="modified" version="1.1"');
  t.b("\n" + i);
  t.b('     viewBox="0 0 14 16" width="14">');
  t.b("\n" + i);
  t.b('    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-deleted"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-deleted" height="16" title="removed" version="1.1"');
  t.b("\n" + i);
  t.b('     viewBox="0 0 14 16" width="14">');
  t.b("\n" + i);
  t.b('    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM11 9H3V7h8v2z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-renamed"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-moved" height="16" title="renamed" version="1.1"');
  t.b("\n" + i);
  t.b('     viewBox="0 0 14 16" width="14">');
  t.b("\n" + i);
  t.b('    <path d="M6 9H3V7h3V4l5 4-5 4V9z m8-7v12c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h12c0.55 0 1 0.45 1 1z m-1 0H1v12h12V2z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">');
  t.b("\n" + i);
  t.b('    <path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["line-by-line-file-diff"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div id="');
  t.b(t.v(t.f("fileHtmlId", c, p, 0)));
  t.b('" class="d2h-file-wrapper" data-lang="');
  t.b(t.v(t.d("file.language", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('    <div class="d2h-file-header">');
  t.b("\n" + i);
  t.b("    ");
  t.b(t.t(t.f("filePath", c, p, 0)));
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b('    <div class="d2h-file-diff">');
  t.b("\n" + i);
  t.b('        <div class="d2h-code-wrapper">');
  t.b("\n" + i);
  t.b('            <table class="d2h-diff-table">');
  t.b("\n" + i);
  t.b('                <tbody class="d2h-diff-tbody">');
  t.b("\n" + i);
  t.b("                ");
  t.b(t.t(t.f("diffs", c, p, 0)));
  t.b("\n" + i);
  t.b("                </tbody>");
  t.b("\n" + i);
  t.b("            </table>");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["line-by-line-numbers"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div class="line-num1">');
  t.b(t.v(t.f("oldNumber", c, p, 0)));
  t.b("</div>");
  t.b("\n" + i);
  t.b('<div class="line-num2">');
  t.b(t.v(t.f("newNumber", c, p, 0)));
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["side-by-side-file-diff"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div id="');
  t.b(t.v(t.f("fileHtmlId", c, p, 0)));
  t.b('" class="d2h-file-wrapper" data-lang="');
  t.b(t.v(t.d("file.language", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('    <div class="d2h-file-header">');
  t.b("\n" + i);
  t.b("      ");
  t.b(t.t(t.f("filePath", c, p, 0)));
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b('    <div class="d2h-files-diff">');
  t.b("\n" + i);
  t.b('        <div class="d2h-file-side-diff">');
  t.b("\n" + i);
  t.b('            <div class="d2h-code-wrapper">');
  t.b("\n" + i);
  t.b('                <table class="d2h-diff-table">');
  t.b("\n" + i);
  t.b('                    <tbody class="d2h-diff-tbody">');
  t.b("\n" + i);
  t.b("                    ");
  t.b(t.t(t.d("diffs.left", c, p, 0)));
  t.b("\n" + i);
  t.b("                    </tbody>");
  t.b("\n" + i);
  t.b("                </table>");
  t.b("\n" + i);
  t.b("            </div>");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b('        <div class="d2h-file-side-diff">');
  t.b("\n" + i);
  t.b('            <div class="d2h-code-wrapper">');
  t.b("\n" + i);
  t.b('                <table class="d2h-diff-table">');
  t.b("\n" + i);
  t.b('                    <tbody class="d2h-diff-tbody">');
  t.b("\n" + i);
  t.b("                    ");
  t.b(t.t(t.d("diffs.right", c, p, 0)));
  t.b("\n" + i);
  t.b("                    </tbody>");
  t.b("\n" + i);
  t.b("                </table>");
  t.b("\n" + i);
  t.b("            </div>");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-added"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-added d2h-added-tag">ADDED</span>');
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-changed"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-changed d2h-changed-tag">CHANGED</span>');
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-deleted"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-deleted d2h-deleted-tag">DELETED</span>');
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-renamed"] = new Hogan2.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-moved d2h-moved-tag">RENAMED</span>');
  return t.fl();
}, partials: {}, subs: {} });

// node_modules/diff2html/lib-esm/hoganjs-utils.js
var HoganJsUtils = class {
  constructor({ compiledTemplates = {}, rawTemplates = {} }) {
    const compiledRawTemplates = Object.entries(rawTemplates).reduce((previousTemplates, [name, templateString]) => {
      const compiledTemplate = Hogan3.compile(templateString, { asString: false });
      return Object.assign(Object.assign({}, previousTemplates), { [name]: compiledTemplate });
    }, {});
    this.preCompiledTemplates = Object.assign(Object.assign(Object.assign({}, defaultTemplates), compiledTemplates), compiledRawTemplates);
  }
  static compile(templateString) {
    return Hogan3.compile(templateString, { asString: false });
  }
  render(namespace, view, params, partials, indent) {
    const templateKey = this.templateKey(namespace, view);
    try {
      const template = this.preCompiledTemplates[templateKey];
      return template.render(params, partials, indent);
    } catch (_e) {
      throw new Error(`Could not find template to render '${templateKey}'`);
    }
  }
  template(namespace, view) {
    return this.preCompiledTemplates[this.templateKey(namespace, view)];
  }
  templateKey(namespace, view) {
    return `${namespace}-${view}`;
  }
};

// node_modules/diff2html/lib-esm/diff2html.js
var defaultDiff2HtmlConfig = Object.assign(Object.assign(Object.assign({}, defaultLineByLineRendererConfig), defaultSideBySideRendererConfig), { outputFormat: OutputFormatType.LINE_BY_LINE, drawFileList: true });
function html(diffInput, configuration = {}) {
  const config2 = Object.assign(Object.assign({}, defaultDiff2HtmlConfig), configuration);
  const diffJson = typeof diffInput === "string" ? parse(diffInput, config2) : diffInput;
  const hoganUtils = new HoganJsUtils(config2);
  const { colorScheme } = config2;
  const fileListRendererConfig = { colorScheme };
  const fileList = config2.drawFileList ? new FileListRenderer(hoganUtils, fileListRendererConfig).render(diffJson) : "";
  const diffOutput = config2.outputFormat === "side-by-side" ? new SideBySideRenderer(hoganUtils, config2).render(diffJson) : new LineByLineRenderer(hoganUtils, config2).render(diffJson);
  return fileList + diffOutput;
}

// src/diff.ts
var encoder = new TextEncoder();
var ESCAPED2 = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34, "\\": 92 };
function pathOf(name) {
  const padless = name.replace(/\t$/, "");
  if (!padless.includes("\\")) return padless;
  const bytes = [];
  for (let at = 0; at < padless.length; at++) {
    const char = padless.charAt(at);
    if (char === '"') continue;
    if (char !== "\\") bytes.push(...encoder.encode(char));
    else if (/^[0-7]{3}$/.test(padless.slice(at + 1, at + 4))) {
      bytes.push(parseInt(padless.slice(at + 1, at + 4), 8));
      at += 3;
    } else bytes.push(ESCAPED2[padless.charAt(++at)] ?? 92);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}
var parseDiff = (diff) => parse(diff).map((file) => ({ ...file, oldName: pathOf(file.oldName), newName: pathOf(file.newName) }));

// src/page/motion.ts
var root = getComputedStyle(document.documentElement);
var token2 = (name) => root.getPropertyValue(`--${name}`).trim();
var reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
var FADE_IN = [{ opacity: 0 }, { opacity: 1 }];
var duration = (ms) => typeof ms === "number" ? ms : Number.parseFloat(token2(ms));
var animate = (element, id, frames, { ms, curve, delay = 0, fill = "backwards" }) => element.animate(frames, { id, duration: duration(ms), delay, fill, easing: curve === "linear" ? "linear" : token2(curve) });
function settle(element) {
  for (const running of element.getAnimations()) if (running.id) running.cancel();
}
function fadeOut(element, ms, done, curve = "linear") {
  if (element.getAnimations().some((running) => running.id === "fade-out")) return;
  const fade = animate(element, "fade-out", [{ opacity: 1 }, { opacity: 0 }], { ms, curve, fill: "forwards" });
  fade.finished.then(
    () => {
      done();
      fade.cancel();
    },
    () => {
    }
  );
}
var tick = (element) => animate(element, "tick", reduced() ? [{ opacity: 0.55 }, { opacity: 1 }] : [{ opacity: 0.55, transform: "translateY(2px)" }, { opacity: 1, transform: "none" }], {
  ms: "base",
  curve: reduced() ? "linear" : "ease-out"
});
function grow(element) {
  settle(element);
  if (reduced()) {
    animate(element, "grow", FADE_IN, { ms: "base", curve: "linear" });
    return;
  }
  const { paddingTop, paddingBottom } = getComputedStyle(element);
  element.classList.add("growing");
  const opening2 = animate(element, "grow", [{ height: "0px", paddingTop: "0px", paddingBottom: "0px" }, { height: `${String(element.offsetHeight)}px`, paddingTop, paddingBottom }], {
    ms: "slow",
    curve: "ease-out"
  });
  animate(element, "grow-fade", FADE_IN, { ms: "base", curve: "linear", delay: 80 });
  const done = () => {
    element.classList.remove("growing");
  };
  opening2.finished.then(done, done);
}
function shrink(element, done) {
  const fade = duration("fast");
  if (reduced()) {
    fadeOut(element, "base", done);
    return;
  }
  const { paddingTop, paddingBottom } = getComputedStyle(element);
  element.classList.add("growing");
  animate(element, "shrink-fade", [{ opacity: 1 }, { opacity: 0 }], { ms: "fast", curve: "linear", fill: "forwards" });
  const closing = animate(element, "shrink", [{ height: `${String(element.offsetHeight)}px`, paddingTop, paddingBottom }, { height: "0px", paddingTop: "0px", paddingBottom: "0px" }], {
    ms: "slow",
    curve: "ease-out",
    delay: fade,
    fill: "forwards"
  });
  closing.finished.then(done, () => {
    element.classList.remove("growing");
  });
}
function scrollPane(scroller, top) {
  for (const running of scroller.getAnimations()) if (running.id === "scroll") running.cancel();
  const to = Math.max(0, top);
  if (reduced()) {
    scroller.scrollTop = to;
    return;
  }
  const screen = scroller.clientHeight;
  scroller.scrollTop = Math.max(to - screen, Math.min(to + screen, scroller.scrollTop));
  const from = scroller.scrollTop;
  const timing = animate(scroller, "scroll", [], { ms: "slow", curve: "ease-out", fill: "none" });
  let last = from;
  const step = () => {
    if (timing.playState === "idle") return;
    if (Math.abs(scroller.scrollTop - last) > 1) {
      timing.cancel();
      return;
    }
    const progress = timing.playState === "finished" ? 1 : timing.effect?.getComputedTiming().progress ?? 0;
    scroller.scrollTop = from + (to - from) * progress;
    last = scroller.scrollTop;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function flash(elements) {
  for (const marked of document.querySelectorAll(".flash")) if (!elements.includes(marked)) marked.classList.remove("flash");
  for (const element of elements) {
    for (const running of element.getAnimations({ subtree: true })) if (running instanceof CSSAnimation && running.animationName === "flash") running.cancel();
    element.classList.remove("flash");
    element.getBoundingClientRect();
    element.classList.add("flash");
  }
}
function fadeAway(element) {
  attrs(element, { inert: "", "aria-hidden": "true" });
  fadeOut(element, "fast", () => {
    element.remove();
  });
}

// src/moves.ts
var MIN_LINES = 3;
var MIN_ALNUM = 20;
function runsOf(files, type) {
  const runs = [];
  let change = 0;
  for (const file of files) {
    const name = file.isDeleted ? file.oldName : file.newName;
    let run = [];
    for (const block2 of file.blocks) {
      change++;
      for (const one of block2.lines) {
        if (one.type === LineType.CONTEXT) change++;
        const line2 = type === LineType.DELETE ? one.oldNumber : one.newNumber;
        if (one.type !== type || line2 === void 0) continue;
        if (run.at(-1)?.line !== line2 - 1) runs.push(run = []);
        run.push({ file: name, line: line2, text: one.content.slice(1).trimEnd(), change });
      }
    }
  }
  return runs;
}
var enough = (lines2) => lines2.length >= MIN_LINES && lines2.reduce((sum, { text: text2 }) => sum + (text2.match(/[\p{L}\p{N}]/gu)?.length ?? 0), 0) >= MIN_ALNUM;
function findMoves(files) {
  const added = runsOf(files, LineType.INSERT);
  const starts = /* @__PURE__ */ new Map();
  for (const run of added) run.forEach(({ text: text2 }, at) => starts.set(text2, [...starts.get(text2) ?? [], [run, at]]));
  const used = /* @__PURE__ */ new Set();
  const moves = [];
  for (const gone of runsOf(files, LineType.DELETE))
    for (let at = 0; at < gone.length; ) {
      let best = null;
      for (const [run, from] of starts.get(gone[at]?.text ?? "") ?? []) {
        let count = 0;
        for (let line2 = run[from + count]; line2 && !used.has(line2) && gone[at + count]?.text === line2.text && gone[at + count]?.change !== line2.change; line2 = run[from + count]) count++;
        if (count > (best?.count ?? 0)) best = { run, from, count };
      }
      const left = gone.slice(at, at + (best?.count ?? 0));
      const [first2] = left;
      const arrived2 = best?.run[best.from];
      if (!best || !first2 || !arrived2 || !enough(left)) {
        at++;
        continue;
      }
      for (const line2 of best.run.slice(best.from, best.from + best.count)) used.add(line2);
      moves.push({ from: { file: first2.file, line: first2.line }, to: { file: arrived2.file, line: arrived2.line }, count: best.count });
      at += best.count;
    }
  return moves;
}

// src/page/since.ts
var changes = {
  /** Whether the page shows only what changed since the last review. */
  since: false,
  /** Shows that view, or all changes; set by the page. */
  choose: (() => {
  }),
  /** Shows lines that only all changes show; set by the page. */
  look: (() => {
  })
};
var shownSince = () => changes.since ? state.view.since : null;
function shownFiles(step) {
  const since = shownSince();
  return since ? step.files.filter((file) => Object.hasOwn(since.files, file)) : step.files;
}
var SINCE = "Changes since your last review";
var ALL = "All changes";
var ChangesSwitch = class {
  box = el("span", { className: "changes-switch" });
  label = el("span", { className: "changes-label" });
  button = attrs(
    el("button", { type: "button", className: "btn small changes-button", title: `${SINCE} (C)` }, icon("branch"), this.label, icon("chevron-down")),
    { "aria-haspopup": "menu", "aria-expanded": "false" }
  );
  menu = null;
  constructor() {
    this.button.onclick = () => {
      if (this.menu) this.close(true);
      else this.open();
    };
    this.box.append(this.button);
    document.addEventListener("pointerdown", (event) => {
      if (this.menu && event.target instanceof Node && !this.box.contains(event.target)) this.close(false);
    });
  }
  update() {
    this.label.textContent = changes.since ? SINCE : ALL;
  }
  get isOpen() {
    return this.menu !== null;
  }
  open() {
    const since = state.view.since;
    if (this.menu || !since || this.box.hidden) return;
    const files = Object.keys(since.files).length;
    const item = (shows, name, meta) => {
      const checked = changes.since === shows;
      const button = attrs(
        el(
          "button",
          { type: "button", className: "menu-item", tabIndex: -1 },
          el("span", { className: "menu-check" }, ...checked ? [icon("met")] : []),
          el("span", { className: "menu-text" }, name, el("span", { className: "menu-meta" }, meta))
        ),
        { role: "menuitemradio", "aria-checked": String(checked) }
      );
      button.onclick = () => {
        this.close(true);
        if (!checked) changes.choose(shows);
      };
      return button;
    };
    const menu2 = attrs(
      el(
        "div",
        { className: "menu changes-menu" },
        item(false, ALL, plural(allFiles().length, "file")),
        item(true, SINCE, `${plural(since.commits, "commit")} \xB7 ${plural(files, "file")}`)
      ),
      { role: "menu", "aria-label": "Changes" }
    );
    menuKeys(menu2, () => {
      this.close(true);
    });
    this.menu = menu2;
    this.box.append(menu2);
    this.button.setAttribute("aria-expanded", "true");
    animate(menu2, "menu-in", FADE_IN, { ms: "fast", curve: "linear" });
    menu2.querySelector('[aria-checked="true"]')?.focus();
  }
  close(refocus) {
    if (!this.menu) return;
    fadeAway(this.menu);
    this.menu = null;
    this.button.setAttribute("aria-expanded", "false");
    if (refocus) this.button.focus();
  }
};

// src/page/moves.ts
var found = { diff: "", moves: [] };
function shownMoves() {
  const since = shownSince();
  const diff = since ? Object.values(since.files).join("") : state.view.steps.map((step) => step.diff).join("");
  if (diff !== found.diff) found = { diff, moves: findMoves(parseDiff(diff)) };
  return found.moves;
}
var moving = { show: (() => {
}), copied: (() => {
}) };
function drawMoves(table2, file, copies = []) {
  const row = (type, line2) => [...table2.querySelectorAll(`tr:has(> td.d2h-${type})`)].find((one) => Number(one.querySelector(type === "del" ? ".line-num1" : ".line-num2")?.textContent.trim()) === line2);
  const link2 = (onclick, down, ...text2) => el("button", { type: "button", className: "moved-link", onclick }, icon(down ? "chevron-down" : "chevron-right"), el("span", {}, ...text2));
  const label = (number, content2) => el("tr", { className: "moved-label" }, el("td", { className: "d2h-code-linenumber" }, el("div", { className: "line-num1" }, number)), el("td", {}, el("div", { className: "d2h-code-line" }, content2)));
  const goTo2 = (move, to) => () => {
    moving.show(move, to);
  };
  const where = (one, other) => one === other ? "" : `${other} `;
  const source = (verb, { file: from, line: line2 }, count) => {
    const lines2 = count === 1 ? `line ${String(line2)}` : `lines ${String(line2)}\u2013${String(line2 + count - 1)}`;
    const cut = from.lastIndexOf("/") + 1;
    if (from === file) return { title: "", text: [`${verb} from ${lines2}`] };
    return { title: cut ? `${verb} from ${from} ${lines2}` : "", text: [`${verb} from `, el("span", { className: "long" }, from.slice(0, cut)), `${from.slice(cut)} ${lines2}`] };
  };
  for (const move of shownMoves()) {
    const { from, to, count } = move;
    if (from.file === file) {
      const rows = Array.from({ length: count }, (_, at) => row("del", from.line + at));
      const departure = label(
        String(from.line),
        link2(goTo2(move, "to"), true, `${plural(count, "line")} moved to ${where(from.file, to.file)}line ${String(to.line)}`)
      );
      departure.dataset["movedFrom"] = String(from.line);
      rows[0]?.before(departure);
      for (const one of rows) one?.remove();
    }
    if (to.file === file) {
      const rows = Array.from({ length: count }, (_, at) => row("ins", to.line + at));
      const { title, text: text2 } = source("Moved", from, count);
      rows[0]?.before(label("", Object.assign(link2(goTo2(move, "from"), false, ...text2), { title })));
      for (const one of rows) {
        one?.classList.add("moved");
        for (const cell of one?.cells ?? []) cell.classList.replace("d2h-ins", "d2h-cntx");
        const prefix = one?.querySelector(".d2h-code-line-prefix");
        if (prefix) prefix.textContent = " ";
        const code3 = one?.querySelector(".d2h-code-line-ctn");
        if (code3) code3.textContent = code3.textContent;
      }
    }
  }
  for (const copy of copies) {
    const { from, to, count } = copy;
    if (to.file !== file) continue;
    const { title, text: text2 } = source("Copied", from, count);
    const go2 = () => {
      moving.copied(copy);
    };
    const rows = Array.from({ length: count }, (_, at) => row("ins", to.line + at));
    const top = label("", Object.assign(copy.inDiff ? link2(go2, false, ...text2) : el("span", {}, ...text2), { title }));
    rows[0]?.before(top);
    for (const one of [top, ...rows]) one?.classList.add("copied");
    rows.at(-1)?.classList.add("copied-end");
  }
}

// src/page/threads.ts
var initials = (handle) => handle.split(/[-_.\s]+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "?";
var authorName = (comment) => comment.by === "you" ? "You" : comment.by === "ai" ? "AI" : comment.author ?? "";
function avatar(comment) {
  const text2 = comment.by === "you" ? "Y" : comment.by === "ai" ? "AI" : initials(comment.author ?? "");
  return attrs(el("span", { className: `avatar avatar-${comment.by}` }, text2), { "aria-hidden": "true" });
}
function commentBody(comment, code3) {
  const body = markdown(comment.ask ? `Ask AI: ${comment.body}` : comment.body, "comment-text", code3);
  if (goesOut(comment)) (body.querySelector("p") ?? body).prepend(el("span", { className: "ai-tag" }, "[AI]"), " ");
  return body;
}
function composer({ placeholder, label = placeholder, text: text2 = "", primary, onPrimary, onAsk, onCancel }) {
  const area = el("textarea", { className: "composer-text", placeholder, value: text2, rows: 3 });
  area.setAttribute("aria-label", label);
  const add = el("button", { type: "button", className: "btn primary small", disabled: !text2.trim() }, primary);
  const busy = (doing) => {
    for (const button of box2.querySelectorAll("button")) button.disabled = doing;
    if (!doing) add.disabled = !area.value.trim();
  };
  const run = async (action) => {
    if (!area.value.trim()) {
      area.focus();
      return;
    }
    busy(true);
    if (!await action(area.value.trim())) busy(false);
  };
  area.oninput = () => {
    add.disabled = !area.value.trim();
  };
  area.onkeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void run(onPrimary);
    }
  };
  add.onclick = () => void run(onPrimary);
  const box2 = el(
    "div",
    { className: "composer" },
    area,
    el(
      "div",
      { className: "composer-row" },
      ...onAsk ? [askButton(() => void run(onAsk))] : [],
      el("span", { className: "spacer" }),
      el("button", { type: "button", className: "btn ghost small", onclick: onCancel }, "Cancel"),
      add
    )
  );
  return box2;
}
var askButton = (onclick) => el("button", { type: "button", className: "btn small ask", onclick }, icon("ask"), "Ask AI");
function iconButton(name, label, onclick) {
  return attrs(el("button", { type: "button", className: "icon-button", title: label, onclick }, icon(name)), { "aria-label": label });
}
var ThreadBox = class {
  box = el("div", { className: "thread" });
  list = el("div", { className: "thread-comments" });
  foot = el("div", { className: "thread-foot" });
  outdated = el("div", { className: "outdated", hidden: true });
  body = el("div", { className: "thread-body" }, el("div", { className: "thread-inner" }, this.outdated, this.list, this.foot));
  resolvedPending = el("span", { className: "pending-tag" }, "Pending");
  resolver = el("strong", {}, "AI");
  resolvedText = el("span", { className: "resolved-text" }, this.resolver, " marked this conversation as resolved.");
  showButton = attrs(el("button", { type: "button", className: "btn small ghost" }), { "aria-expanded": "false" });
  /** GitHub's collapsed line of a resolved thread, naming who resolved it. */
  resolvedLine = el(
    "div",
    { className: "resolved-line" },
    avatar({ by: "ai" }),
    this.resolvedText,
    el("span", { className: "spacer" }),
    this.showButton
  );
  showResolved = false;
  drawnFoot = "";
  shown = /* @__PURE__ */ new Map();
  answering = null;
  editing = null;
  replying = false;
  thread;
  constructor(thread) {
    this.thread = thread;
    this.box.dataset["thread"] = thread.id;
    this.box.append(this.body);
    this.showButton.onclick = () => {
      this.show(!this.showResolved);
    };
    this.update(thread);
  }
  /** Opens or closes a resolved thread; an open thread is always open. */
  show(open = true) {
    this.showResolved = open;
    const folded = !!this.thread.resolvedBy && !open;
    this.box.classList.toggle("folded", folded);
    this.body.inert = folded;
    this.showButton.textContent = open ? "Hide resolved" : "Show resolved";
    this.showButton.setAttribute("aria-expanded", String(open));
  }
  drawOutdated() {
    const { thread } = this;
    this.outdated.hidden = thread.step !== null;
    if (thread.step !== null || this.outdated.hasChildNodes()) return;
    const texts = (thread.code ?? []).map(([, text2]) => el("span", {}, text2));
    const code3 = (thread.code ?? []).flatMap(([number], at, all) => [
      ...at > 0 && number !== (all[at - 1]?.[0] ?? 0) + 1 ? [attrs(el("div", { className: "outdated-gap" }), { "aria-hidden": "true" })] : [],
      el("div", { className: "outdated-line" }, el("span", { className: "outdated-number" }, String(number)), texts[at] ?? "")
    ]);
    colourLines(texts, thread.file);
    this.outdated.append(
      el("div", { className: "outdated-head" }, el("span", { className: "outdated-path", title: thread.file }, thread.file), el("span", { className: "outdated-tag" }, "Outdated")),
      ...code3.length ? [el("div", { className: "outdated-code" }, ...code3)] : []
    );
  }
  /** Brings the thread up to date; returns the comments that arrived, which the file may hold behind the pill. */
  update(thread) {
    this.thread = thread;
    const by = thread.resolvedBy;
    this.box.classList.toggle("resolved", !!by);
    if (!by) this.resolvedLine.remove();
    else {
      if (this.resolver.textContent !== (by === "ai" ? "AI" : "You")) {
        this.resolver.textContent = by === "ai" ? "AI" : "You";
        this.resolvedLine.firstElementChild?.replaceWith(avatar({ by }));
      }
      if (!this.resolvedLine.isConnected) this.box.prepend(this.resolvedLine);
    }
    if (thread.resolvePending) {
      if (!this.resolvedPending.isConnected) this.resolvedText.after(this.resolvedPending);
    } else this.resolvedPending.remove();
    this.show(this.showResolved);
    this.drawOutdated();
    const arrived2 = [];
    const ids = new Set(thread.comments.map((one) => one.id));
    for (const [id, { element }] of this.shown)
      if (!ids.has(id)) {
        element.remove();
        this.shown.delete(id);
      }
    let before = null;
    for (const comment of thread.comments) {
      const key2 = JSON.stringify([comment.body, comment.pending, comment.review, comment.waiting, this.editing === comment.id, suggestionCode(thread)]);
      const was = this.shown.get(comment.id);
      let element = was?.element;
      if (!was || was.key !== key2 && this.editing !== comment.id || this.editing === comment.id && !was.element.querySelector("textarea")) {
        element = this.commentRow(comment);
        if (was) was.element.replaceWith(element);
        else {
          if (this.shown.size) arrived2.push(element);
          if (comment.answer) element.classList.add("arrive");
        }
        this.shown.set(comment.id, { element, key: key2 });
      }
      if (element && (element.parentElement !== this.list || element.previousElementSibling !== before)) {
        if (before) before.after(element);
        else this.list.prepend(element);
      }
      before = element ?? before;
    }
    const waiting = thread.comments.some((one) => one.waiting);
    if (waiting && !this.answering)
      this.answering = el(
        "div",
        { className: "comment answering arrive" },
        avatar({ by: "ai" }),
        el("span", { className: "answering-text" }, attrs(icon("spinner"), { role: "img", "aria-label": "AI is answering" }), "Answering\u2026")
      );
    if (waiting && this.answering && this.list.lastElementChild !== this.answering) this.list.append(this.answering);
    if (!waiting) {
      this.answering?.remove();
      this.answering = null;
    }
    this.drawFoot();
    return arrived2.filter((element) => !element.classList.contains("arrive"));
  }
  /** Opens a pending comment of the thread in the composer. */
  edit(id) {
    this.editing = id;
    this.update(this.thread);
    this.box.querySelector(`[data-comment="${CSS.escape(id)}"] textarea`)?.focus();
  }
  commentRow(comment) {
    const row = el("div", { className: `comment comment-${comment.by}` });
    row.dataset["comment"] = comment.id;
    const head = el(
      "div",
      { className: "comment-head" },
      el("strong", { className: "comment-name" }, authorName(comment)),
      ...comment.pending ? [el("span", { className: "pending-tag" }, "Pending")] : [],
      el("time", { className: "comment-time", dateTime: comment.at, title: new Date(comment.at).toLocaleString() }, ago(comment.at))
    );
    if (comment.pending && this.editing !== comment.id)
      head.append(
        el(
          "span",
          { className: "comment-actions" },
          iconButton("edit", "Edit", () => {
            this.edit(comment.id);
          }),
          iconButton("trash", "Delete", () => void send2("comment", { comment: comment.id, delete: true }))
        )
      );
    const body = this.editing === comment.id ? composer({
      placeholder: "Leave a comment",
      text: comment.body,
      primary: "Update comment",
      onPrimary: async (text2) => {
        this.editing = null;
        const done = await send2("comment", { comment: comment.id, text: text2 });
        if (!done) this.editing = comment.id;
        return done;
      },
      onCancel: () => {
        this.editing = null;
        this.update(this.thread);
      }
    }) : commentBody(comment, suggestionCode(this.thread));
    row.append(avatar(comment), el("div", { className: "comment-main" }, head, body));
    return row;
  }
  drawFoot() {
    const { thread } = this;
    if (this.replying) {
      if (this.foot.querySelector(".composer")) return;
      const box2 = composer({
        placeholder: "Reply\u2026",
        primary: "Add comment",
        onPrimary: async (text2) => this.closeAfter(await send2("comment", { thread: thread.id, text: text2 })),
        onAsk: async (text2) => this.closeAfter(await send2("ask", { thread: thread.id, text: text2 })),
        onCancel: () => {
          this.replying = false;
          this.drawFoot();
          this.foot.querySelector(".reply-field")?.focus();
        }
      });
      this.foot.replaceChildren(box2);
      this.foot.classList.add("composing");
      box2.querySelector("textarea")?.focus();
      return;
    }
    const key2 = JSON.stringify([thread.colleague && !thread.resolved, thread.unresolvable]);
    if (this.foot.querySelector(".reply-field") && key2 === this.drawnFoot) return;
    this.drawnFoot = key2;
    this.foot.classList.remove("composing");
    const open = () => {
      this.replying = true;
      this.drawFoot();
    };
    const flip = async (route) => {
      if (await send2(route, { thread: thread.id })) this.foot.querySelector(".resolve, .unresolve, .reply-field")?.focus();
    };
    const field = el("button", { type: "button", className: "reply-field", onclick: open }, "Reply\u2026");
    this.foot.replaceChildren(
      field,
      askButton(open),
      ...thread.colleague && !thread.resolved ? [el("button", { type: "button", className: "btn small resolve", onclick: () => void flip("resolve") }, "Resolve")] : [],
      ...thread.unresolvable ? [el("button", { type: "button", className: "btn small unresolve", onclick: () => void flip("unresolve") }, "Unresolve conversation")] : []
    );
  }
  closeAfter(done) {
    if (done) {
      this.replying = false;
      this.drawFoot();
    }
    return done;
  }
};

// src/page/files.ts
var picked = null;
function pick(next) {
  picked = next;
  state.render(true);
  const cell = next && document.querySelector(".composer-line .thread-cell");
  if (!cell) return;
  cell.querySelector("textarea")?.focus({ preventScroll: true });
  const scroller = cell.closest(".main");
  const below = cell.getBoundingClientRect().top + cell.scrollHeight - (scroller?.getBoundingClientRect().bottom ?? innerHeight);
  if (scroller instanceof HTMLElement && below > 0) scrollPane(scroller, scroller.scrollTop + below);
}
var folds = /* @__PURE__ */ new Map();
var reopened = /* @__PURE__ */ new Set();
var LARGE_FILE = 400;
var SVG3 = "http://www.w3.org/2000/svg";
function setViewed(file, now) {
  const { view } = state;
  if (view.viewed.includes(file) === now) return;
  state.view = {
    ...view,
    viewed: now ? [...view.viewed, file] : view.viewed.filter((one) => one !== file),
    changed: view.changed.filter((one) => one !== file)
  };
  folds.set(file, now);
  state.render(true);
  void send2("viewed", { file, viewed: now });
}
function goTo(scroller, target, above, smooth) {
  const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - above;
  if (smooth) scrollPane(scroller, top);
  else scroller.scrollTop = top;
}
var FilePane = class {
  constructor(step, parsed, diff, shown = {}) {
    this.step = step;
    this.shown = shown;
    this.name = parsed.isDeleted ? parsed.oldName : parsed.newName;
    this.changedLines = parsed.addedLines + parsed.deletedLines;
    this.box.dataset["file"] = this.name;
    this.diffBox = el("div", { className: "diff-scroll" }, ...diff ? [diff] : []);
    const area = el("div", { className: "diff-area" }, this.diffBox, this.stripe);
    this.preview = this.previewBox(parsed);
    if (this.preview) area.append(this.preview);
    this.body.append(el("div", { className: "file-inner" }, this.band, area));
    this.box.append(this.header, this.body);
    this.stripe.classList.add("overview-stripe");
    attrs(this.stripe, { "aria-hidden": "true", preserveAspectRatio: "none" });
    if (diff) drawMoves(diff, this.name, step.copies);
    this.prepareRows();
    this.drawHeader(parsed);
  }
  step;
  shown;
  box = el("section", { className: "file" });
  header = el("div", { className: "file-header" });
  body = el("div", { className: "file-body" });
  rows = /* @__PURE__ */ new Map();
  /** Runs of added and removed lines, by their first and last row. */
  runs = [];
  /** Each thread with what holds it: a row under its line, or its own box in the band above the diff. */
  threads = /* @__PURE__ */ new Map();
  /** Above the diff: the composer for the whole file, its threads oldest first, then outdated threads. */
  band = el("div", { className: "file-threads", hidden: true });
  stripe = document.createElementNS(SVG3, "svg");
  composerRow = null;
  /** Whether the threads were drawn before, so what is new since then can arrive. */
  drawn = false;
  name;
  changedLines;
  previewing = false;
  preview;
  diffBox;
  get file() {
    return this.name;
  }
  closed() {
    const { view } = state;
    return folds.get(this.name) ?? (!!this.shown.quiet || view.viewed.includes(this.name) || this.name in (this.step.folded ?? {}) || this.changedLines > LARGE_FILE);
  }
  /**
   * Opens the file and its lines, brings them into view with 120px above, and flashes them; false when the diff does not show them.
   * `smooth` scrolls there, as on the step you are on; otherwise the pane that just swapped in starts there.
   */
  look(start, end, scroller, smooth = true) {
    if (!this.rows.has(start)) return false;
    return this.flashRows(
      [...this.rows].flatMap(([line2, row]) => line2 >= start && line2 <= end ? [row] : []),
      scroller,
      smooth
    );
  }
  /** The same for the row that says lines moved away from `line`. */
  lookDeparture(line2, scroller, smooth = true) {
    const row = this.diffBox.querySelector(`tr[data-moved-from="${String(line2)}"]`);
    return this.flashRows(row ? [row] : [], scroller, smooth);
  }
  /** Brings the file's header to the top of the pane and flashes it. */
  mark(scroller, smooth) {
    goTo(scroller, this.box, 16, smooth);
    flash([this.header]);
  }
  /** The rows of a thread's lines, to mark when it is reached; none on a whole file or once outdated, as those lines are gone. */
  linesOf(id) {
    const thread = state.view.threads.find((one) => one.id === id);
    const lines2 = thread?.step === null ? void 0 : thread?.lines;
    return lines2 ? [...this.rows].flatMap(([line2, row]) => line2 >= lines2[0] && line2 <= lines2[1] ? [row] : []) : [];
  }
  /** The thread that shows first in the file, in the band above the diff or under its lines. */
  firstThread() {
    return this.box.querySelector("[data-thread]")?.dataset["thread"];
  }
  /** Takes the keyboard to the file, at its header. */
  focus() {
    this.header.querySelector(".file-toggle")?.focus({ preventScroll: true });
  }
  flashRows(rows, scroller, smooth) {
    const [first2] = rows;
    if (!first2) return false;
    this.open();
    if (this.previewing) void this.showPreview(false);
    goTo(scroller, first2, 120, smooth);
    flash(rows);
    return true;
  }
  thread(id) {
    return this.threads.get(id);
  }
  /** Opens the file at once, with no animation: it is being jumped to, so its lines must be where they stay before the jump. */
  open() {
    if (!this.closed()) return;
    folds.set(this.name, false);
    this.box.classList.add("opening-now");
    this.update(() => false);
    void this.box.getBoundingClientRect();
    this.box.classList.remove("opening-now");
  }
  /** Brings the file up to date; returns what arrived where the reader would see it move, which waits behind the pill. */
  update(shows) {
    const { view } = state;
    if (!view.changed.includes(this.name)) reopened.delete(this.name);
    else if (!reopened.has(this.name)) {
      reopened.add(this.name);
      folds.delete(this.name);
    }
    const closed = this.closed();
    this.box.classList.toggle("closed", closed);
    this.box.classList.toggle("viewed", view.viewed.includes(this.name));
    const toggle = this.header.querySelector(".file-toggle");
    if (toggle) attrs(toggle, { "aria-expanded": String(!closed), "aria-label": `${closed ? "Expand" : "Collapse"} ${this.name}` });
    this.body.inert = closed;
    const checkbox = this.header.querySelector(".viewed-toggle input");
    if (checkbox) checkbox.checked = view.viewed.includes(this.name);
    const count = commentCount(this.step.id, this.name);
    const counter = this.header.querySelector(".file-comments");
    if (counter) {
      counter.hidden = count === 0;
      counter.title = plural(count, "comment");
      counter.lastChild?.replaceWith(String(count));
    }
    const changed = this.header.querySelector(".changed-tag");
    if (changed) changed.hidden = !view.changed.includes(this.name);
    const arrived2 = this.drawThreads(shows, closed);
    colourSuggestions(this.box, this.name, view.head);
    return arrived2;
  }
  drawHeader(parsed) {
    const chevron = el("button", { type: "button", className: "icon-button file-toggle" }, icon("chevron-right"));
    chevron.onclick = () => {
      folds.set(this.name, !this.closed());
      this.update(() => false);
    };
    const viewed = el("input", { type: "checkbox" });
    viewed.onchange = () => {
      setViewed(this.name, viewed.checked);
    };
    const stats = parsed.isBinary ? [el("span", { className: "file-stats" }, "binary")] : [el("span", { className: "file-stats" }, el("span", { className: "added" }, `+${String(parsed.addedLines)}`), " ", el("span", { className: "deleted" }, `\u2212${String(parsed.deletedLines)}`))];
    const reason = this.step.folded?.[this.name];
    this.header.append(
      chevron,
      el("span", { className: "file-path", title: this.name }, this.name),
      ...stats,
      el("span", { className: "file-comments", hidden: true }, icon("message"), "0"),
      el("span", { className: "changed-tag", hidden: true }, "Changed since last view"),
      ...reason ? [el("span", { className: "folded-reason", title: reason }, reason)] : [],
      el("span", { className: "spacer" }),
      ...this.preview ? [this.previewToggle()] : [],
      el("label", { className: "viewed-toggle", title: "Viewed (V)" }, viewed, "Viewed"),
      attrs(
        el("button", { type: "button", className: "icon-button file-comment", title: "Comment on this file", onclick: () => {
          if (this.fileComposing()) {
            const draft = this.band.querySelector(".composer textarea");
            if (draft?.value.trim()) draft.focus();
            else pick(null);
          } else {
            this.open();
            pick({ step: this.step.id, file: this.name });
          }
        } }, icon("message")),
        { "aria-label": "Comment on this file", "aria-pressed": "false" }
      )
    );
  }
  prepareRows() {
    const all = [...this.diffBox.querySelectorAll("tbody > tr")];
    const types2 = all.map((row) => row.querySelector("td.d2h-ins") ? "add" : row.querySelector("td.d2h-del") ? "del" : null);
    all.forEach((row, at) => {
      const number = row.querySelector(".line-num2");
      const line2 = Number(number?.textContent.trim());
      if (number && line2) {
        this.rows.set(line2, row);
        row.dataset["line"] = String(line2);
      }
      if (number && line2 && (this.shown.commentable?.has(line2) ?? true)) {
        number.tabIndex = this.diffBox.querySelector('.line-num2[role="button"]') ? -1 : 0;
        attrs(number, { role: "button", "aria-label": `Comment on line ${String(line2)}` });
      }
      const type = types2[at];
      if (!type || types2[at - 1] === type) return;
      let end = at;
      while (types2[end + 1] === type) end++;
      const to = all[end];
      if (to) this.runs.push({ type, from: row, to });
    });
    this.diffBox.onclick = (event) => {
      const number = event.target instanceof Element ? event.target.closest('.line-num2[role="button"]') : null;
      if (number) this.choose(Number(number.closest("tr")?.dataset["line"]), event.shiftKey);
    };
    this.diffBox.onkeydown = (event) => {
      const number = event.target instanceof HTMLElement && event.target.matches('.line-num2[role="button"]') ? event.target : null;
      if (!number) return;
      const line2 = Number(number.closest("tr")?.dataset["line"]);
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.choose(line2, event.shiftKey);
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const numbers = [...this.diffBox.querySelectorAll('.line-num2[role="button"]')];
        const target = numbers[numbers.indexOf(number) + (event.key === "ArrowDown" ? 1 : -1)];
        if (target) {
          number.tabIndex = -1;
          target.tabIndex = 0;
          target.focus();
        }
      }
    };
  }
  choose(line2, extend) {
    const same = picked?.step === this.step.id && picked.file === this.name;
    if (extend && same && picked?.start !== void 0) pick({ ...picked, start: Math.min(picked.start, line2), end: Math.max(picked.start, line2) });
    else pick({ step: this.step.id, file: this.name, start: line2, end: line2 });
  }
  /** The whole file's runs and threads, placed by where their rows sit now that threads take room between them. */
  drawStripe() {
    const total = this.diffBox.querySelector("table")?.offsetHeight ?? 0;
    if (!total) return;
    const mark = (className, top, height) => {
      const rect = document.createElementNS(SVG3, "rect");
      rect.classList.add(...className.split(" "));
      attrs(rect, { y: `${String(top / total * 100)}%`, height: `${String(height / total * 100)}%`, x: "2", width: "6" });
      return rect;
    };
    this.stripe.replaceChildren(
      ...this.runs.map(({ type, from, to }) => mark(`run-${type}`, from.offsetTop, to.offsetTop + to.offsetHeight - from.offsetTop)),
      ...threadsIn(this.step.id, this.name).flatMap((thread) => {
        const row = thread.lines && this.rows.get(thread.lines[1]);
        return row ? [mark(`tick ${threadBy(thread)}`, row.offsetTop, 3)] : [];
      })
    );
  }
  /** Puts each thread under its last line, in the band above the diff once outdated or when on the whole file, and the composer where it was picked; returns what arrived where it would move the page. */
  drawThreads(shows, closed) {
    const here = threadsIn(this.step.id, this.name);
    const onFile2 = here.filter((one) => !one.lines).sort((one, other) => Date.parse(one.comments[0]?.at ?? "") - Date.parse(other.comments[0]?.at ?? ""));
    const banded = [...onFile2, ...outdatedIn(this.step.id, this.name)];
    const arrived2 = [];
    const ids = new Set([...here, ...banded].map((one) => one.id));
    for (const [id, { row }] of this.threads)
      if (!ids.has(id) || row.parentElement === this.band !== banded.some((one) => one.id === id)) {
        row.remove();
        this.threads.delete(id);
      }
    for (const old of this.diffBox.querySelectorAll(".gutter-mark")) old.remove();
    if (banded.length) this.band.hidden = false;
    for (const thread of [...banded, ...here.filter((one) => one.lines)]) {
      const anchor = thread.step !== null && thread.lines ? this.rows.get(thread.lines[1]) : void 0;
      const holder = anchor ?? (banded.includes(thread) ? this.band : void 0);
      if (!holder) continue;
      const held = !closed && shows(holder);
      const kept = this.threads.get(thread.id);
      if (kept) {
        const fresh = kept.box.update(thread);
        if (held) arrived2.push(...fresh.map(hold));
        else for (const one of fresh) one.classList.add("arrive");
        continue;
      }
      const box2 = new ThreadBox(thread);
      const row = anchor ? threadRow(box2.box) : box2.box;
      row.dataset["thread"] = thread.id;
      if (anchor) this.placeAfter(anchor, row);
      else holder.append(row);
      this.threads.set(thread.id, { row, box: box2 });
      if (held) arrived2.push(hold(row));
      else if (this.drawn) for (const one of box2.box.querySelectorAll(".comment")) one.classList.add("arrive");
    }
    this.drawn = true;
    banded.forEach((thread, at) => {
      const row = this.threads.get(thread.id)?.row;
      const now = this.band.children[at + (this.composerRow?.parentElement === this.band ? 1 : 0)];
      if (row && row !== now) this.band.insertBefore(row, now ?? null);
    });
    for (const thread of here) this.markThread(thread);
    this.drawComposer();
    this.header.querySelector(".file-comment")?.setAttribute("aria-pressed", String(this.fileComposing()));
    this.band.hidden = !this.band.childElementCount;
    this.drawStripe();
    return arrived2;
  }
  fileComposing() {
    return picked?.step === this.step.id && picked.file === this.name && picked.start === void 0;
  }
  placeAfter(anchor, row) {
    let last = anchor;
    while (last.nextElementSibling?.classList.contains("thread-row")) last = last.nextElementSibling;
    last.after(row);
  }
  markThread(thread) {
    const row = thread.lines && this.rows.get(thread.lines[1]);
    const cell = row?.querySelector(".line-num2");
    if (!row || !cell) return;
    const by = threadBy(thread);
    if (!cell.querySelector(".gutter-mark"))
      cell.prepend(attrs(el("span", { className: `gutter-mark ${by}` }, icon(by === "you" ? "own" : "message")), { "aria-hidden": "true" }));
  }
  drawComposer() {
    const mine = picked?.step === this.step.id && picked.file === this.name ? picked : null;
    const lines2 = mine?.start !== void 0 && mine.end !== void 0 ? [mine.start, mine.end] : null;
    for (const [line2, row] of this.rows) row.classList.toggle("picked", !!lines2 && line2 >= lines2[0] && line2 <= lines2[1]);
    const key2 = mine && (lines2 ? lines2.join("-") : "file");
    if (this.composerRow && this.composerRow.dataset["lines"] !== key2) {
      this.composerRow.remove();
      this.composerRow = null;
    }
    if (!mine || this.composerRow) return;
    const anchor = lines2 && this.rows.get(lines2[1]);
    if (lines2 && !anchor) return;
    const where = { file: this.name, ...lines2 && { lines: lines2 } };
    const box2 = composer({
      placeholder: "Leave a comment",
      ...!lines2 && { label: "Comment on this file" },
      primary: "Add comment",
      onPrimary: async (text2) => {
        const done = await send2("comment", { ...where, text: text2 });
        if (done) pick(null);
        return done;
      },
      onAsk: async (text2) => {
        const done = await send2("ask", { ...where, text: text2 });
        if (done) pick(null);
        return done;
      },
      onCancel: () => {
        pick(null);
      }
    });
    const thread = el("div", { className: "thread" }, box2);
    this.composerRow = anchor ? threadRow(thread) : el("div", {}, el("div", { className: "thread-cell" }, thread));
    this.composerRow.classList.add("composer-line");
    this.composerRow.dataset["lines"] = key2 ?? "";
    if (anchor) this.placeAfter(anchor, this.composerRow);
    else this.band.prepend(this.composerRow);
    const cell = this.composerRow.querySelector(".thread-cell");
    if (cell) grow(cell);
  }
  previewBox(parsed) {
    const head = parsed.isDeleted ? null : parsed.newName;
    const type = previewType(head ?? parsed.oldName);
    if (!type || head === null && !type.startsWith("image/")) return null;
    return attrs(el("div", { className: "preview", hidden: true }), { role: "region", "aria-label": `Preview of ${this.name}` });
  }
  previewToggle() {
    const choices = ["Diff", "Preview"].map(
      (label, at) => attrs(el("button", { type: "button", onclick: () => void this.showPreview(at === 1) }, label), { "aria-pressed": String(at === 0) })
    );
    return attrs(el("div", { className: "segmented" }, ...choices), { role: "group", "aria-label": `Show ${this.name} as` });
  }
  async showPreview(previewing) {
    const box2 = this.preview;
    if (!box2) return;
    this.previewing = previewing;
    this.header.querySelectorAll(".segmented button").forEach((button, at2) => {
      button.setAttribute("aria-pressed", String(previewing === (at2 === 1)));
    });
    this.diffBox.hidden = previewing;
    this.stripe.classList.toggle("hidden", previewing);
    box2.hidden = !previewing;
    if (!previewing || box2.hasChildNodes()) return;
    const parsed = parseDiff(this.step.diff).find((one) => (one.isDeleted ? one.oldName : one.newName) === this.name);
    if (!parsed) return;
    const at = (path) => `file?path=${encodeURIComponent(path)}`;
    if (previewType(this.name)?.startsWith("image/")) {
      const figure = (side, source) => {
        const caption = el("figcaption", {}, side);
        const image3 = el("img", { src: source, alt: `${this.name}, ${side.toLowerCase()}` });
        image3.onload = () => {
          caption.textContent = `${side} \xB7 ${String(image3.naturalWidth)}\xD7${String(image3.naturalHeight)}`;
        };
        return el("figure", {}, el("div", { className: "image-box" }, image3), caption);
      };
      box2.replaceChildren(
        el(
          "div",
          { className: "image-compare" },
          ...parsed.isNew ? [] : [figure("Before", `${at(parsed.oldName)}&at=base`)],
          ...parsed.isDeleted ? [] : [figure("After", at(parsed.newName))]
        )
      );
      return;
    }
    const answer = await fetch(at(this.name), { signal: readSignal }).catch(() => null);
    const added = new Set(parsed.blocks.flatMap((block2) => block2.lines).flatMap((line2) => line2.type === LineType.INSERT && line2.newNumber ? [line2.newNumber] : []));
    if (!answer?.ok) {
      box2.replaceChildren(el("p", { className: "muted" }, "Preview failed."));
      return;
    }
    box2.innerHTML = renderMarkdown(await answer.text(), this.name, added);
    box2.classList.add("markdown");
    colourCode(box2);
  }
};
var threadRow = (content2) => el("tr", { className: "thread-row" }, el("td", { colSpan: 2 }, el("div", { className: "thread-cell" }, content2)));
function hold(element) {
  element.classList.add("arriving");
  return element;
}
function drawFiles(step, { own, quiet } = {}) {
  const parsed = parseDiff(step.diff);
  const ownFiles = own && parseDiff(own.diff);
  const shown = (file) => {
    if (quiet) return { quiet };
    const mine = ownFiles?.find((one) => one.newName === file.newName);
    return ownFiles ? { commentable: new Set(mine?.blocks.flatMap((block2) => block2.lines.flatMap((line2) => line2.newNumber ? [line2.newNumber] : []))) } : {};
  };
  const holder = el("div");
  holder.innerHTML = html(parsed, { outputFormat: "line-by-line", drawFileList: false, matching: "lines" });
  const tables = [...holder.querySelectorAll(".d2h-file-wrapper")].map((wrapper) => wrapper.querySelector(".d2h-file-diff"));
  const panes2 = parsed.map((file, at) => new FilePane(step, file, tables[at] ?? null, shown(file)));
  const revs = { base: own ? state.view.since?.head : state.view.base, head: state.view.head };
  parsed.forEach((file, at) => {
    const table2 = tables[at];
    if (table2) void colourDiff(table2, file, revs);
  });
  return step.files.flatMap((file) => panes2.filter((pane) => pane.file === file));
}

// src/page/opening.ts
var Opening = class {
  box = el("div", { className: "opening" });
  scene = null;
  drawn = "";
  update() {
    const { sessionGone, changedFiles, pr } = state.view;
    const key2 = JSON.stringify([sessionGone, changedFiles, pr?.number]);
    if (key2 === this.drawn) return;
    this.drawn = key2;
    const files = plural(changedFiles.length, "changed file");
    if (sessionGone) {
      this.scene?.stop();
      this.scene = null;
      this.box.replaceChildren(this.failed(), this.fileList(files));
      return;
    }
    this.scene ??= deskScene();
    this.box.replaceChildren(
      this.scene.box,
      attrs(
        el(
          "div",
          {},
          el("h1", { className: "opening-title" }, "Preparing the walkthrough"),
          el("p", { className: "opening-line" }, "The AI is finishing its review, usually within a minute.")
        ),
        { role: "status" }
      ),
      this.fileList(files)
    );
  }
  /** Lets the scene go, once the walkthrough shows. */
  stop() {
    this.scene?.stop();
    this.scene = null;
  }
  failed() {
    return attrs(
      el(
        "div",
        { className: "opening-failed" },
        icon("not-met"),
        el(
          "div",
          {},
          el("h1", { className: "opening-title" }, "The AI couldn\u2019t prepare the walkthrough"),
          el("p", { className: "opening-line" }, "It stopped before the review was done. Nothing was posted."),
          el("p", { className: "end-line opening-lead" }, "Start it over in your agent:"),
          commandBox()
        )
      ),
      { role: "status" }
    );
  }
  fileList(files) {
    const { changedFiles } = state.view;
    const sum = (key2) => changedFiles.reduce((total, one) => total + (one[key2] ?? 0), 0);
    return el(
      "section",
      { className: "changed-files" },
      el("h2", {}, files, el("span", { className: "changed-total" }, `+${String(sum("additions"))} \u2212${String(sum("deletions"))}`)),
      el(
        "ul",
        {},
        ...changedFiles.map(
          ({ path, additions, deletions }) => el(
            "li",
            {},
            el("span", { className: "changed-path", title: path }, path),
            ...additions === void 0 ? [] : [el("span", { className: "changed-stat" }, el("span", { className: "added" }, `+${String(additions)}`), " ", el("span", { className: "deleted" }, `\u2212${String(deletions ?? 0)}`))]
          )
        )
      )
    );
  }
};
var PLACEHOLDERS = [
  ["w70", "w45", "w35"],
  ["w55", "w40", "w50"],
  ["w80", "w30", "w45"]
];
function openingNav() {
  const gone = state.view.sessionGone;
  const rows = gone ? [] : PLACEHOLDERS.map(
    ([step = "", ...files]) => el(
      "li",
      { className: "step-placeholder" },
      el("span", { className: "step-row" }, el("span", { className: "step-number" }), el("span", { className: `placeholder-bar ${step}` })),
      el("ul", { className: "file-list" }, ...files.map((width) => el("li", {}, el("span", { className: `placeholder-bar ${width}` }))))
    )
  );
  return [
    el("p", { className: "steps-note" }, gone ? "No steps yet." : "Steps appear here when the AI is done."),
    attrs(el("ol", { className: "steps" }, ...rows), { "aria-hidden": "true" }),
    el("div", { className: "summary-dock" }, el("span", { className: "step-row summary-row still" }, icon("summary"), el("span", { className: "step-name" }, "Summary"), el("span", { className: "file-count" }, "0")))
  ];
}

// src/page/step.ts
var StepPane = class {
  /** `since` shows only what changed in each file since the last review; a step with nothing new shows its files quiet. */
  constructor(step, scroller, since = null) {
    this.step = step;
    this.scroller = scroller;
    const changed = since && step.files.filter((file) => Object.hasOwn(since.files, file));
    const quiet = changed?.length === 0;
    this.files = !changed || quiet ? drawFiles(step, quiet ? { quiet } : {}) : drawFiles({ ...step, files: changed, diff: changed.map((file) => since.files[file]).join("") }, { own: step });
    this.box.dataset["step"] = step.id;
    this.box.append(this.head, ...quiet ? [nothingNew()] : [], el("div", { className: quiet ? "files quiet" : "files" }, ...this.files.map((pane) => pane.box)), this.foot);
  }
  step;
  scroller;
  box = el("section", { className: "step" });
  head = el("div", { className: "step-head" });
  files;
  foot = el("div", { className: "step-foot" });
  more = false;
  drawnHead = "";
  shot;
  fileNamed(file) {
    return this.files.find((pane) => pane.file === file);
  }
  update(shows, go2) {
    const step = state.view.steps.find((one) => one.id === this.step.id) ?? this.step;
    const key2 = JSON.stringify([step.title, step.explanation, step.look, step.screenshot, this.more]);
    if (key2 !== this.drawnHead) {
      this.drawnHead = key2;
      this.drawHead(step);
    }
    this.drawFoot(go2);
    return this.files.flatMap((pane) => pane.update(shows));
  }
  drawHead(step) {
    const [first2 = "", ...rest] = step.explanation.trim().split(/\n\s*\n/);
    const explanation = markdown(this.more ? step.explanation : first2, "explanation");
    if (rest.length && !this.more) {
      const more = el("button", { type: "button", className: "link more" }, "More");
      more.onclick = () => {
        this.more = true;
        this.drawHead(step);
        this.head.querySelector(".explanation")?.focus();
      };
      (explanation.lastElementChild ?? explanation).append(" ", more);
    }
    explanation.tabIndex = -1;
    const look = step.look.map(
      (pointer) => el(
        "button",
        { type: "button", className: "look-link", title: `${pointer.file} ${linesLabel([pointer.start, pointer.end])}`, onclick: () => {
          if (!this.fileNamed(pointer.file)?.look(pointer.start, pointer.end, this.scroller)) changes.look(pointer);
        } },
        icon("next"),
        el("code", {}, pointer.file.split("/").slice(-2).join("/")),
        ` ${linesLabel([pointer.start, pointer.end])} `,
        el("span", { className: "look-label" }, pointer.label)
      )
    );
    this.head.replaceChildren(
      el("h1", { className: "step-title", tabIndex: -1 }, step.title),
      ...look.length ? [el("div", { className: "look" }, el("span", { className: "look-at" }, "Look at:"), ...look)] : [],
      explanation,
      ...step.screenshot ? [this.screenshot(step.screenshot)] : []
    );
  }
  // Kept while the screenshot is the same, so redrawing the head leaves it open.
  screenshot(shot) {
    const key2 = JSON.stringify(shot);
    if (this.shot?.key !== key2) this.shot = { key: key2, figure: screenshot(shot) };
    return this.shot.figure;
  }
  drawFoot(go2) {
    const { steps } = state.view;
    const at = steps.findIndex((one) => one.id === this.step.id);
    const before = steps[at - 1];
    const after = steps[at + 1];
    const key2 = JSON.stringify([before?.title, after?.title]);
    if (this.foot.dataset["key"] === key2) return;
    this.foot.dataset["key"] = key2;
    const link2 = (title, address, side) => el(
      "a",
      { className: `btn step-link ${side}`, href: `#${address}`, onclick: (event) => {
        event.preventDefault();
        go2(address);
      } },
      ...side === "previous" ? [icon("previous"), el("span", {}, title)] : [el("span", {}, title), icon("next")]
    );
    this.foot.replaceChildren(
      ...before ? [link2(before.title, `step-${before.id}`, "previous")] : [el("span")],
      after ? link2(after.title, `step-${after.id}`, "next") : link2("Summary", "summary", "next")
    );
  }
};
function screenshot({ name, alt }) {
  const image3 = el("img", { className: "screenshot-image", src: `screenshot/${name}`, alt: "" });
  const button = el("button", { type: "button", className: "screenshot-button" }, image3);
  const close = el("button", { type: "button", className: "btn small ghost screenshot-close" }, "Close");
  const figure = el("figure", { className: "screenshot" }, button, el("figcaption", {}, ...alt ? [el("span", {}, alt)] : [], close));
  const onKey = (event) => {
    if (event.key !== "Escape" || event.defaultPrevented || !figure.isConnected) return;
    event.preventDefault();
    toggle(false);
  };
  const toggle = (open) => {
    const from = image3.getBoundingClientRect();
    const hadFocus = figure.contains(document.activeElement);
    settle(image3);
    figure.classList.toggle("open", open);
    attrs(button, { "aria-expanded": String(open), "aria-label": open ? "Close the screenshot" : alt ? `Open the screenshot: ${alt}` : "Open the screenshot" });
    close.hidden = !open;
    if (open) document.addEventListener("keydown", onKey);
    else document.removeEventListener("keydown", onKey);
    if (!open && hadFocus) button.focus();
    if (!figure.isConnected || reduced()) return;
    const to = image3.getBoundingClientRect();
    const size = ({ width, height }) => ({ width: `${String(width)}px`, height: `${String(height)}px` });
    animate(image3, "screenshot", [size(from), size(to)], open ? { ms: "slow", curve: "ease-out" } : { ms: "base", curve: "ease-in" });
  };
  button.onclick = () => {
    toggle(!figure.classList.contains("open"));
  };
  close.onclick = () => {
    toggle(false);
    button.focus();
  };
  toggle(false);
  return figure;
}
function nothingNew() {
  const all = el("button", { type: "button", className: "btn small" }, "Show all changes");
  all.onclick = () => {
    changes.choose(false);
  };
  return el(
    "div",
    { className: "nothing-new" },
    icon("met"),
    el("div", {}, el("strong", {}, "No changes since your last review."), el("p", {}, "The files are as you viewed them.")),
    all
  );
}

// src/page/summary.ts
var TYPES2 = Object.entries(TYPE_NAMES);
var CRITERIA = {
  met: ["met", "Met"],
  partly: ["partly", "Partly met"],
  "not-met": ["not-met", "Not met"],
  "not-checked": ["unchecked", "Not checked"]
};
var ORDER = ["not-met", "partly", "not-checked", "met"];
var linesWord = (lines2) => `${lines2[0] === lines2[1] ? "line" : "lines"} ${linesLabel(lines2)}`;
function rowText(body) {
  const box2 = markdown(body, "row-text");
  const blocks = [...box2.querySelectorAll("pre > code.language-suggestion")];
  for (const block2 of blocks) block2.parentElement?.remove();
  return { text: box2.textContent.replace(/\s+/g, " ").trim(), suggests: blocks.length > 0 };
}
var resolvedByAi = () => state.view.threads.filter((one) => one.resolvedBy === "ai" && (one.resolveReview === void 0 || one.resolveReview === state.view.submitted?.id));
var SummaryPane = class {
  constructor(reveal2, end) {
    this.reveal = reveal2;
    this.end = end;
  }
  reveal;
  end;
  box = el("section", { className: "summary" });
  draft = "";
  type = "comment";
  drawn = "";
  sending = false;
  /** Whether the last drawing showed the review sent; unset before the first. */
  shownSent;
  shownCount;
  /** Rows deleted and still closing, by comment, with the comment that followed each. */
  leaving = /* @__PURE__ */ new Map();
  /** The review box fading out while the review is sent. */
  sentBox = null;
  update() {
    const { view } = state;
    const key2 = JSON.stringify([pendingComments(), resolvedByAi(), view.submitted, view.criteria, unresolved().length, notViewed().length, view.pr, this.sending]);
    if (key2 === this.drawn) return;
    this.drawn = key2;
    const focused = document.activeElement;
    const typing = focused instanceof HTMLTextAreaElement && this.box.contains(focused) ? [focused.selectionStart, focused.selectionEnd] : null;
    const submitted = view.submitted;
    const rows = submitted ? sentComments(submitted.id) : pendingComments();
    const counter = el("span", { className: "counter" }, String(rows.length));
    const list2 = el("ul", { className: "going-out" }, ...rows.map(({ thread, comment }) => this.leaving.get(comment.id)?.row ?? this.row(thread, comment, !submitted)));
    for (const { row, next } of this.leaving.values())
      if (row.parentElement !== list2) list2.insertBefore(row, [...list2.children].find((one) => one instanceof HTMLElement && one.dataset["comment"] === next) ?? null);
    const going = el(
      "section",
      { className: "summary-section" },
      el("h2", { className: "section-head" }, submitted ? "Sent" : "Going out", counter),
      ...list2.children.length ? [list2] : [],
      ...rows.length || submitted ? [] : [el("p", { className: "empty" }, "No comments. Add one on a line.")],
      ...submitted ? [] : this.counts()
    );
    const left = el("div", { className: "summary-lists" }, going, ...this.resolved(), ...this.criteria());
    const right = el("div", { className: "review-side" }, submitted ? this.done() : this.reviewBox());
    this.box.replaceChildren(el("h1", { className: "step-title", tabIndex: -1 }, "Summary"), el("div", { className: "summary-grid" }, left, right));
    if (submitted && this.shownSent === false) this.arrive(right);
    this.shownSent = !!submitted;
    if (this.shownCount !== void 0 && this.shownCount !== rows.length) tick(counter);
    this.shownCount = rows.length;
    if (typing) {
      const area = this.box.querySelector("textarea");
      area?.focus();
      area?.setSelectionRange(typing[0] ?? null, typing[1] ?? null);
    }
  }
  /** The submitted note fades and rises in where the review box fades out, its check popping. */
  arrive(side) {
    const note = side.firstElementChild;
    if (!note) return;
    const { box: old, fading } = this.sentBox ?? {};
    this.sentBox = null;
    let after = 0;
    if (old && fading?.playState === "running") {
      side.append(attrs(old, { inert: "", "aria-hidden": "true" }));
      after = Math.max(0, duration("fast") - Number(fading.currentTime ?? 0));
      fading.finished.then(
        () => {
          old.remove();
        },
        () => {
        }
      );
    }
    animate(note, "review-done", FADE_IN, { ms: "base", curve: "linear", delay: after });
  }
  /** The row fades, then closes, while the comment is deleted. */
  delete(row, id) {
    const next = row.nextElementSibling instanceof HTMLElement ? row.nextElementSibling.dataset["comment"] : void 0;
    this.leaving.set(id, { row, next });
    row.inert = true;
    shrink(row, () => {
      this.leaving.delete(id);
      row.remove();
    });
    void send2("comment", { comment: id, delete: true }).then((done) => {
      if (done) return;
      this.leaving.delete(id);
      row.remove();
      this.drawn = "";
      this.update();
    });
  }
  /** The thread's file and lines, or the file alone for a comment on the whole file; a link to it while it shows in a step. */
  where(thread) {
    const where = thread.lines ? `${baseName(thread.file)}:${linesLabel(thread.lines)}` : baseName(thread.file);
    return threadStep(thread) === void 0 ? el("span", { className: "where", title: thread.file }, where) : el("a", { className: "where", href: "#", title: thread.lines ? thread.file : `${thread.file}: go to the comment`, onclick: (event) => {
      event.preventDefault();
      this.reveal({ thread: thread.id });
    } }, where);
  }
  row(thread, comment, pending) {
    const link2 = this.where(thread);
    const { text: text2, suggests } = rowText(comment.body);
    const item = el("li", { className: "going-row" });
    item.dataset["comment"] = comment.id;
    const actions = pending ? [
      el(
        "span",
        { className: "comment-actions" },
        attrs(el("button", { type: "button", className: "icon-button", title: "Edit", onclick: () => {
          this.reveal({ thread: thread.id, edit: comment.id });
        } }, icon("edit")), { "aria-label": "Edit" }),
        attrs(el("button", { type: "button", className: "icon-button", title: "Delete", onclick: () => {
          this.delete(item, comment.id);
        } }, icon("trash")), { "aria-label": "Delete" })
      )
    ] : [];
    const body = el(
      "span",
      { className: "row-text", title: comment.by === "ai" ? `[AI] ${text2}` : text2 },
      ...thread.step === null && comment.id === thread.id ? [el("span", { className: "outdated-tag" }, "Outdated")] : [],
      ...suggests && suggestionCode(thread) ? [el("span", { className: "suggestion-tag" }, "Suggested change")] : [],
      ...comment.by === "ai" ? [el("span", { className: "ai-tag" }, "[AI]"), " "] : [],
      text2
    );
    item.append(avatar(comment), link2, body, ...actions);
    return item;
  }
  counts() {
    const open = unresolved();
    const files = notViewed();
    const links = [
      ...open.length ? [el("a", { href: "#", onclick: (event) => {
        event.preventDefault();
        this.reveal({ thread: open[0]?.id ?? "" });
      } }, icon("message"), plural(open.length, "unresolved thread"))] : [],
      ...files.length ? [el("a", { href: "#", onclick: (event) => {
        event.preventDefault();
        this.reveal({ file: files[0] ?? "" });
      } }, icon("eye"), `${String(files.length)} ${files.length === 1 ? "file" : "files"} not viewed`)] : []
    ];
    return links.length ? [el("p", { className: "counts" }, ...links)] : [];
  }
  /** The conversations the AI resolved that go out with the review, or went out with the one submitted. */
  resolved() {
    const rows = resolvedByAi();
    if (!rows.length) return [];
    return [
      el(
        "section",
        { className: "summary-section" },
        el("h2", { className: "section-head" }, "Resolved conversations", el("span", { className: "counter" }, String(rows.length))),
        el(
          "ul",
          { className: "going-out" },
          ...rows.map((thread) => {
            const { text: text2 } = rowText(thread.comments[0]?.body ?? "");
            const item = el(
              "li",
              { className: "going-row resolved-row" },
              avatar({ by: "ai" }),
              this.where(thread),
              el(
                "span",
                { className: "row-text", title: text2 },
                el("span", { className: "resolved-tag" }, "Resolved"),
                ...thread.resolvePending ? [el("span", { className: "pending-tag" }, "Pending")] : [],
                text2
              )
            );
            item.dataset["thread"] = thread.id;
            return item;
          })
        )
      )
    ];
  }
  criteria() {
    const criteria = state.view.criteria ?? [];
    if (!criteria.length) return [];
    return [
      el(
        "section",
        { className: "summary-section" },
        el("h2", { className: "section-head" }, "Acceptance criteria", el("span", { className: "section-note" }, "checked by the AI")),
        el(
          "ul",
          { className: "criteria" },
          ...[...criteria].sort((one, other) => ORDER.indexOf(one.status) - ORDER.indexOf(other.status)).map((criterion) => {
            const { text: text2, status } = criterion;
            const [mark, word] = CRITERIA[status];
            const shows = this.shows(criterion);
            return el(
              "li",
              { className: `criterion ${status}` },
              icon(mark),
              el("span", { className: "criterion-body" }, el("span", { className: "criterion-text" }, text2), ...shows.length ? [el("span", { className: "criterion-shows" }, ...shows)] : []),
              el("span", { className: "criterion-word" }, word)
            );
          })
        )
      )
    ];
  }
  /** A gap's link to the AI comment that closes it and what is missing; met's link to its lines; not checked's reason. */
  shows({ comment, missing, file, lines: lines2, reason }) {
    if (reason) return [reason];
    if (file && lines2)
      return [
        el(
          "a",
          { className: "where", href: "#", title: `${file} ${linesWord(lines2)}: go to the lines`, onclick: (event) => {
            event.preventDefault();
            this.reveal({ file, lines: lines2 });
          } },
          `${baseName(file)}:${linesLabel(lines2)}`
        )
      ];
    const thread = comment === void 0 ? void 0 : state.view.threads.find((one) => one.comments.some((said) => said.id === comment));
    const where = thread ? `${baseName(thread.file)}${thread.lines ? `:${linesLabel(thread.lines)}` : ""}` : "";
    const title = thread ? `${thread.file}${thread.lines ? ` ${linesWord(thread.lines)}` : ""}: go to the comment` : "";
    const link2 = !thread ? [] : threadStep(thread) === void 0 ? [el("span", { className: "where", title }, where)] : [el("a", { className: "where", href: "#", title, onclick: (event) => {
      event.preventDefault();
      this.reveal({ thread: thread.id });
    } }, where)];
    return [...link2, ...missing ? [missing] : []];
  }
  reviewBox() {
    const own = !state.view.pr;
    const area = el("textarea", { className: "composer-text", placeholder: "Leave a comment", value: this.draft, rows: 3 });
    attrs(area, { "aria-label": "Summary" });
    area.oninput = () => {
      this.draft = area.value;
    };
    const types2 = !own && !state.view.pr?.yours;
    const blocked = own && pendingComments().length === 0;
    const submit = el("button", { type: "button", className: "btn primary wide", disabled: blocked || this.sending }, own ? "Send to agent" : "Submit review");
    const note = el("p", { className: "review-note", hidden: !blocked }, "Add a comment to send it.");
    attrs(submit, { "aria-describedby": "review-note" });
    note.id = "review-note";
    const radios = TYPES2.map(([value, label]) => {
      const radio = el("input", { type: "radio", name: "review-type", value, checked: value === this.type });
      radio.onchange = () => {
        this.type = value;
      };
      return el("label", { className: "radio" }, radio, label);
    });
    submit.onclick = async () => {
      this.sending = true;
      submit.disabled = true;
      const fading = animate(box2, "review-leave", [{ opacity: 1 }, { opacity: 0 }], {
        ms: "fast",
        curve: "ease-in",
        fill: "forwards"
      });
      this.sentBox = { box: box2, fading };
      const done = await send2("submit", { ...!own && { type: types2 ? this.type : "comment" }, summary: this.draft.trim() });
      this.sending = false;
      if (done) this.draft = "";
      else {
        this.sentBox = null;
        this.update();
      }
    };
    const box2 = el(
      "div",
      { className: "review-box" },
      el("h2", { className: "section-head" }, "Finish your review"),
      area,
      ...types2 ? [attrs(el("div", { className: "radios" }, ...radios), { role: "radiogroup", "aria-label": "Finish your review" })] : [],
      submit,
      note
    );
    return box2;
  }
  done() {
    const end = el("button", { type: "button", className: "btn small ghost", onclick: this.end }, "End session");
    const lines2 = state.view.pr ? [el("strong", {}, "Review submitted"), el("p", {}, sentLine()), el("p", { className: "outcome-actions" }, ...viewReview(), end)] : [el("strong", {}, "Sent to the agent"), el("p", {}, `${sentLine()} The agent is fixing ${them()}; follow along there.`), el("p", { className: "outcome-actions" }, end)];
    return attrs(el("div", { className: "review-box done" }, icon("met"), el("div", {}, ...lines2)), { role: "status" });
  }
};

// src/page/app.ts
var header = region("header");
var nav = region("nav");
var main = region("main");
var pill = attrs(el("button", { type: "button", className: "new-pill", hidden: true }), { "aria-live": "polite" });
var content = el("div", { className: "content" });
main.append(el("div", { className: "pill-dock" }, pill), content);
new ResizeObserver(() => {
  main.style.setProperty("--pane", `${String(content.clientWidth)}px`);
}).observe(content);
var viewer = { ...DEFAULT_VIEWER };
var stopped = false;
var panes = /* @__PURE__ */ new Map();
var summary = new SummaryPane(
  (target) => {
    reveal(target);
  },
  () => {
    endSession();
  }
);
var arrived = [];
var opening = null;
var stepAddress = (id) => `step-${id}`;
var firstAddress = () => state.view.steps[0] ? stepAddress(state.view.steps[0].id) : "";
function current() {
  const address = decodeURIComponent(location.hash.slice(1));
  if (!state.view.ready) return { kind: "opening" };
  if (address === "summary") return { kind: "summary" };
  const step = state.view.steps.find((one) => stepAddress(one.id) === address) ?? state.view.steps[0];
  return step ? { kind: "step", pane: paneOf(step.id) } : { kind: "opening" };
}
function paneOf(id) {
  const step = state.view.steps.find((one) => one.id === id);
  if (!step) throw new Error(`no step ${id}`);
  const since = shownSince();
  const moves = shownMoves().filter(({ from, to }) => step.files.includes(from.file) || step.files.includes(to.file));
  const key2 = JSON.stringify([step.diff, step.files, step.folded, since && step.files.map((file) => since.files[file] ?? null), moves, step.copies]);
  const kept = panes.get(`${String(!!since)}:${id}`);
  if (kept?.key === key2) return kept.pane;
  const pane = new StepPane(step, main, since);
  panes.set(`${String(!!since)}:${id}`, { key: key2, pane });
  pane.update(() => false, go);
  return pane;
}
function go(address) {
  pick(null);
  if (decodeURIComponent(location.hash.slice(1)) !== address) history.pushState(null, "", `#${address}`);
  showDrawer(false);
  moved();
}
function moved() {
  onFile = null;
  const to = current();
  if (to.kind === "step" && stepFolds.get(to.pane.step.id) === false) stepFolds.delete(to.pane.step.id);
  for (const one of arrived) one.classList.remove("arriving");
  arrived = [];
  const old = content.firstElementChild;
  const scrolled = main.scrollTop;
  if (old) settle(old);
  render(true, true);
  main.scrollTop = 0;
  const shown = content.firstElementChild;
  if (shown && shown !== old) {
    settle(shown);
    shown.removeAttribute("inert");
    shown.removeAttribute("aria-hidden");
    const leaving = old instanceof HTMLElement && !old.classList.contains("opening");
    if (leaving) leave(old, scrolled);
    const still = reduced();
    animate(shown, "pane-enter", still ? FADE_IN : [{ opacity: 0, transform: "translateX(12px)" }, { opacity: 1, transform: "none" }], {
      ms: "base",
      curve: still ? "linear" : "ease-out",
      delay: leaving ? LEAVE_MS : 0
    });
  }
  content.querySelector(".step-title")?.focus({ preventScroll: true });
}
var LEAVE_MS = 100;
function leave(old, scrolled, slide = true) {
  attrs(old, { inert: "", "aria-hidden": "true" });
  content.append(old);
  const at = `translateY(${String(main.scrollTop - scrolled)}px)`;
  const still = reduced() || !slide;
  const leaving = animate(old, "pane-leave", [{ opacity: 1, transform: at }, { opacity: 0, transform: still ? at : `${at} translateX(-12px)` }], {
    ms: slide ? LEAVE_MS : "fast",
    curve: still ? "linear" : "ease-in",
    fill: "forwards"
  });
  leaving.finished.then(
    () => {
      if (content.firstElementChild !== old) old.remove();
    },
    () => {
    }
  );
}
function reveal({ thread: id, edit, file, lines: lines2 }) {
  if (file !== void 0 && lines2) {
    const look = { file, start: lines2[0], end: lines2[1], label: "" };
    const found3 = paneOfFile(file);
    if (!found3?.pane?.look(look.start, look.end, main, found3.smooth)) changes.look(look);
    return;
  }
  const thread = state.view.threads.find((one) => one.id === id);
  const stepId = thread ? threadStep(thread) : file === void 0 ? void 0 : stepOfFile(file)?.id;
  if (stepId === void 0) return;
  const name = thread?.file ?? file ?? "";
  const found2 = paneOf(stepId).fileNamed(name);
  const widen = changes.since && (!found2 || thread && !found2.thread(thread.id));
  if (widen) changes.since = false;
  const at = current();
  const smooth = !widen && at.kind === "step" && at.pane.step.id === stepId;
  if (smooth) {
    pick(null);
    showDrawer(false);
  } else go(stepAddress(stepId));
  const pane = paneOf(stepId).fileNamed(name);
  if (!pane) return;
  pane.open();
  for (const leaving of content.querySelectorAll(":scope > [inert]")) leaving.remove();
  onFile = name;
  drawOnFile();
  const shown = thread && pane.thread(thread.id);
  if (shown) {
    shown.box.show();
    goTo(main, shown.row, 120, smooth);
    const marked = pane.linesOf(thread.id);
    flash(marked.length ? marked : [shown.row]);
  } else pane.mark(main, smooth);
  pane.focus();
  if (shown && edit) shown.box.edit(edit);
}
function readingAnchor() {
  const top = main.getBoundingClientRect().top;
  for (const element of content.firstElementChild?.querySelectorAll(".step-head, .file-header, tr, .step-foot") ?? []) {
    const box2 = element.getBoundingClientRect();
    const stuck = element.classList.contains("file-header") && (element.parentElement?.getBoundingClientRect().top ?? top) < top;
    if (box2.height && box2.bottom > top && !stuck) return { element, top: box2.top };
  }
  return null;
}
function drawPill() {
  arrived = arrived.filter((one) => one.isConnected && one.classList.contains("arriving"));
  const count = arrived.reduce((sum, one) => sum + Math.max(1, one.querySelectorAll(".comment").length), 0);
  if (count) {
    settle(pill);
    pill.hidden = false;
    pill.replaceChildren(icon("up"), count === 1 ? "1 new comment above" : `${String(count)} new comments above`);
  } else if (!pill.hidden)
    fadeOut(
      pill,
      "fast",
      () => {
        pill.hidden = true;
      },
      "ease-in"
    );
}
pill.onclick = () => {
  for (const one of arrived) one.classList.remove("arriving");
  const [first2] = [...arrived].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  for (const one of arrived) grow(one.querySelector(":scope > td > .thread-cell") ?? one);
  arrived = [];
  drawPill();
  if (first2) {
    goTo(main, first2, 120, true);
    flash([first2]);
  }
};
var viewedFill = el("i");
var viewedNumber = el("span", { className: "viewed-number" });
var viewedTotal = document.createTextNode("");
var filesViewed = el(
  "span",
  { className: "files-viewed" },
  attrs(el("span", { className: "bar" }, viewedFill), { "aria-hidden": "true" }),
  el("span", { className: "count" }, viewedNumber, viewedTotal, el("span", { className: "long" }, " files viewed"))
);
var filesChanged = el("span", { className: "files-changed", hidden: true });
var reviewingNow = attrs(el("span", { className: "ai-reviewing" }, icon("spinner"), el("span", { className: "long" }, "AI reviewing")), {
  role: "status",
  "aria-label": "AI reviewing"
});
var finish = attrs(
  el("a", { className: "btn primary small finish", href: "#summary", title: "Go to the Summary (G S)" }, el("span", { className: "long" }, "Finish review"), el("span", { className: "short" }, "Finish")),
  { "aria-label": "Finish review" }
);
finish.onclick = (event) => {
  event.preventDefault();
  go("summary");
};
var changeLabel = el("span");
var changesSwitch = new ChangesSwitch();
var behindLine = attrs(el("div", { className: "behind", hidden: true }), { role: "status" });
header.after(behindLine);
header.append(
  attrs(el("span", { className: "mark" }, icon("mark")), { "aria-hidden": "true" }),
  attrs(el("button", { type: "button", className: "icon-button steps-button", onclick: toggleDrawer }, icon("sidebar")), {
    "aria-label": "Steps and files",
    "aria-expanded": "false",
    "aria-controls": "nav"
  }),
  changeLabel,
  changesSwitch.box,
  filesViewed,
  filesChanged,
  el("span", { className: "spacer" }),
  finish,
  attrs(el("button", { type: "button", className: "icon-button menu-button", onclick: toggleMenu }, icon("more")), {
    "aria-label": "Menu",
    "aria-haspopup": "menu",
    "aria-expanded": "false"
  })
);
var drawnLabel = "";
var shownViewed;
function drawHeader(onSummary) {
  const { view } = state;
  const name = view.kind === "branch" ? view.branch : view.label;
  const label = JSON.stringify([view.pr, name]);
  if (label !== drawnLabel) {
    drawnLabel = label;
    const fresh = view.pr ? el("span", { className: "change-label", title: `#${view.pr.number} ${view.pr.title}` }, el("span", { className: "pr-number" }, `#${view.pr.number}`), ` ${view.pr.title}`) : el("code", { className: "change-label branch", title: name }, name);
    changeLabel.replaceWith(fresh);
    changeLabel = fresh;
  }
  const reviewing = !view.ready && !view.sessionGone && !ending;
  const title = `${reviewing ? "Reviewing \xB7 " : ""}${view.pr ? `#${view.pr.number} ${view.pr.title}` : name} \xB7 Walkthrough`;
  if (document.title !== title) document.title = title;
  const asleep = ending?.kind === "lost" || view.sessionGone;
  const ended = ending?.kind === "ended" ? view.submitted ? "done" : "ended" : null;
  const favicon = `favicon-${asleep ? "asleep" : ended ?? (view.ready ? "awake" : "reading")}.svg`;
  const icon2 = document.querySelector('link[rel="icon"]');
  if (icon2 && icon2.getAttribute("href") !== favicon) icon2.setAttribute("href", favicon);
  const files = allFiles().length;
  const viewed = view.viewed.length;
  viewedTotal.data = ` / ${String(files)}`;
  viewedFill.style.setProperty("width", `${String(files ? viewed / files * 100 : 0)}%`);
  if (viewed !== shownViewed) {
    viewedNumber.textContent = String(viewed);
    if (shownViewed !== void 0) tick(viewedNumber);
    shownViewed = viewed;
  }
  const ready = view.ready;
  filesViewed.hidden = !ready;
  filesChanged.hidden = ready;
  const changed = view.changedFiles.length;
  if (!ready) filesChanged.replaceChildren(el("span", {}, plural(changed, "file"), el("span", { className: "long" }, " changed")));
  finish.hidden = onSummary || !ready;
  changesSwitch.update();
  changesSwitch.box.hidden = onSummary || !ready || !view.since;
  if (changesSwitch.box.hidden) changesSwitch.close(false);
  if (phone.matches && changesSwitch.box.parentElement !== main) content.before(changesSwitch.box);
  else if (!phone.matches && changesSwitch.box.parentElement !== header) changeLabel.after(changesSwitch.box);
  drawBehind(view.behind && !view.sessionGone && !ending);
  if (!ready && !view.sessionGone) {
    settle(reviewingNow);
    if (!reviewingNow.isConnected) filesChanged.after(reviewingNow);
  } else if (reviewingNow.isConnected)
    fadeOut(reviewingNow, "base", () => {
      reviewingNow.remove();
    });
}
function drawBehind(behind) {
  if (behindLine.hidden === !behind) return;
  if (behind && !behindLine.hasChildNodes())
    behindLine.append(icon("info"), el("span", { className: "behind-text" }, "The branch has new commits. Run the walkthrough again to see them:"), commandBox(true));
  const top = main.getBoundingClientRect().top;
  behindLine.hidden = !behind;
  main.scrollTop += main.getBoundingClientRect().top - top;
}
function showDrawer(open) {
  document.body.classList.toggle("drawer-open", open);
  header.querySelector(".steps-button")?.setAttribute("aria-expanded", String(open));
}
function toggleDrawer() {
  const open = !document.body.classList.contains("drawer-open");
  showDrawer(open);
  if (open) nav.querySelector('[aria-current="page"]')?.focus();
}
var menu = null;
function closeMenu(refocus) {
  if (!menu) return;
  fadeAway(menu);
  menu = null;
  const button = header.querySelector(".menu-button");
  button?.setAttribute("aria-expanded", "false");
  if (refocus) button?.focus();
}
function toggleMenu() {
  if (menu) {
    closeMenu(true);
    return;
  }
  const item = (label, role, choose, checked) => {
    const button = attrs(el("button", { type: "button", className: "menu-item", tabIndex: -1 }, label), { role });
    if (checked !== void 0) button.setAttribute("aria-checked", String(checked));
    button.onclick = () => {
      closeMenu(true);
      choose();
    };
    return button;
  };
  const names = { system: "System", light: "Light", dark: "Dark" };
  const themes = ["system", "light", "dark"].map(
    (one) => item(
      names[one],
      "menuitemradio",
      () => {
        viewer = chooseViewer(viewer, { theme: one });
      },
      viewer.theme === one
    )
  );
  const colourBlind = item("Colorblind", "menuitemcheckbox", () => {
    viewer = chooseViewer(viewer, { colourBlind: !viewer.colourBlind });
  }, viewer.colourBlind);
  colourBlind.prepend(el("span", { className: "menu-check" }, icon("checkbox")));
  const opened = attrs(
    el(
      "div",
      { className: "menu" },
      attrs(el("div", {}, el("p", { className: "menu-label", id: "menu-theme" }, "Theme"), ...themes, colourBlind), { role: "group", "aria-labelledby": "menu-theme" }),
      el("hr"),
      item("End session", "menuitem", endSession)
    ),
    { role: "menu", "aria-label": "Menu" }
  );
  menuKeys(opened, () => {
    closeMenu(true);
  });
  menu = opened;
  header.append(opened);
  header.querySelector(".menu-button")?.setAttribute("aria-expanded", "true");
  animate(opened, "menu-in", FADE_IN, { ms: "fast", curve: "linear" });
  (opened.querySelector('[aria-checked="true"]') ?? opened.querySelector(".menu-item"))?.focus();
}
document.addEventListener("pointerdown", (event) => {
  const button = header.querySelector(".menu-button");
  if (menu && event.target instanceof Node && !menu.contains(event.target) && !button?.contains(event.target)) closeMenu(false);
});
function endSession() {
  stopped = true;
  clearInterval(poller);
  showEnd("ended");
  stopReading();
  void postQuietly("stop", {});
}
var endPage = el("main", { className: "end-page", hidden: true });
document.body.append(endPage);
var ending = null;
var walkthroughParts = () => [frame, ...[...header.children].filter((one) => one instanceof HTMLElement && !one.matches(".mark, .change-label"))];
function settleWalkthrough() {
  document.body.classList.remove("fading");
  for (const part of walkthroughParts()) {
    settle(part);
    part.inert = false;
  }
}
function showEnd(kind) {
  if (ending?.kind === kind) return;
  const fromWalkthrough = !ending;
  ending?.stop();
  closeMenu(false);
  showDrawer(false);
  showAlert(null);
  const screen = endScreen(kind, poll);
  ending = { kind, stop: screen.stop, scrolled: ending?.scrolled ?? [main.scrollTop, nav.scrollTop] };
  endPage.replaceChildren(screen.box);
  endPage.hidden = false;
  endPage.scrollTop = 0;
  if (fromWalkthrough) document.body.classList.add("fading");
  document.body.classList.add("ended");
  drawHeader(current().kind === "summary");
  endPage.querySelector(".end-title")?.focus({ preventScroll: true });
  if (!fromWalkthrough) {
    animate(endPage, "end-in", FADE_IN, { ms: "base", curve: "linear" });
    return;
  }
  const fades = walkthroughParts().map((part) => {
    part.inert = true;
    return animate(part, "end-leave", [{ opacity: 1 }, { opacity: 0 }], { ms: "fast", curve: "ease-in", fill: "forwards" }).finished;
  });
  animate(endPage, "end-in", FADE_IN, { ms: "base", curve: "linear", delay: duration("fast") });
  Promise.all(fades).then(settleWalkthrough, () => {
  });
}
function hideEnd() {
  if (!ending) return;
  const [mainTop, navTop] = ending.scrolled;
  ending.stop();
  ending = null;
  settleWalkthrough();
  endPage.hidden = true;
  endPage.replaceChildren();
  document.body.classList.remove("ended");
  render(true);
  main.scrollTop = mainTop;
  nav.scrollTop = navTop;
  content.querySelector(".step-title")?.focus({ preventScroll: true });
}
var drawnNav = "";
var navSteps = [];
var stepFolds = /* @__PURE__ */ new Map();
var pendingCount = el("span", { className: "file-count" });
var summaryRow = navLink("summary", "step-row summary-row", icon("summary"), el("span", { className: "step-name" }, "Summary"), pendingCount);
summaryRow.dataset["key"] = "summary";
var shownPending;
function navLink(address, className, ...children) {
  const row = el("a", { className, href: `#${address}` }, ...children);
  row.onclick = (event) => {
    event.preventDefault();
    go(address);
  };
  return row;
}
function navFile(step, file, id) {
  const mark = attrs(el("button", { type: "button", className: "viewed-mark", title: "Viewed" }, icon("ring"), icon("met")), {
    role: "checkbox",
    "aria-label": "Viewed",
    "aria-describedby": id
  });
  mark.dataset["key"] = `mark:${file}`;
  mark.onclick = () => {
    setViewed(file, !state.view.viewed.includes(file));
  };
  const name = el("a", { className: "file-name", id, href: `#${stepAddress(step)}`, title: file }, baseName(file));
  name.dataset["key"] = `file:${file}`;
  name.onclick = (event) => {
    event.preventDefault();
    reveal({ file });
  };
  const count = el("a", { className: "file-count", href: `#${stepAddress(step)}`, hidden: true }, icon("message"), "");
  count.dataset["key"] = `count:${file}`;
  count.onclick = (event) => {
    event.preventDefault();
    const first2 = paneOf(step).fileNamed(file)?.firstThread();
    if (first2) reveal({ thread: first2 });
  };
  const row = el("div", { className: "file-row" }, mark, name, count);
  row.dataset["file"] = file;
  return { file, row, mark, count, shown: -1 };
}
function buildNav() {
  const focused = document.activeElement instanceof HTMLElement && nav.contains(document.activeElement) ? document.activeElement.dataset["key"] : void 0;
  const scrolled = nav.scrollTop;
  navSteps = state.view.steps.map((step, index) => {
    const row = navLink(stepAddress(step.id), "step-row", el("span", { className: "step-number" }, String(index + 1)), el("span", { className: "step-name", title: step.title }, step.title));
    row.dataset["key"] = `step:${step.id}`;
    row.classList.toggle("quiet", shownFiles(step).length === 0);
    const files = shownFiles(step).map((file, at) => navFile(step.id, file, `nav-file-${String(index)}-${String(at)}`));
    const list2 = el("ul", { className: "file-list", id: `nav-files-${String(index)}` }, ...files.map((one) => el("li", {}, one.row)));
    const toggle = attrs(el("button", { type: "button", className: "icon-button step-toggle" }, icon("chevron-right")), { "aria-controls": list2.id });
    toggle.dataset["key"] = `fold:${step.id}`;
    toggle.onclick = () => {
      stepFolds.set(step.id, !navSteps.find((one) => one.id === step.id)?.item.classList.contains("open"));
      drawNav(current());
    };
    const meta = el("p", { className: "step-meta" });
    const item = el("li", { className: "step-item" }, el("div", { className: "step-line" }, toggle, row), meta, el("div", { className: "step-files" }, list2));
    return { id: step.id, item, row, toggle, meta, files };
  });
  nav.replaceChildren(el("ol", { className: "steps" }, ...navSteps.map(({ item }) => item)), el("div", { className: "summary-dock" }, summaryRow));
  nav.scrollTop = scrolled;
  if (focused !== void 0) nav.querySelector(`[data-key="${CSS.escape(focused)}"]`)?.focus();
}
function drawNav(at) {
  const { view } = state;
  if (at.kind === "opening") {
    const key3 = view.sessionGone ? "gone" : "opening";
    if (key3 !== drawnNav) nav.replaceChildren(...openingNav());
    drawnNav = key3;
    shownPending = void 0;
    return;
  }
  const key2 = JSON.stringify(view.steps.map((step) => [step.id, step.title, step.files, shownFiles(step)]));
  if (key2 !== drawnNav) {
    drawnNav = key2;
    buildNav();
  }
  const here = at.kind === "step" ? at.pane.step.id : at.kind;
  for (const { id, item, row, toggle, meta, files } of navSteps) {
    if (here === id) row.setAttribute("aria-current", "page");
    else row.removeAttribute("aria-current");
    const open = stepFolds.get(id) ?? here === id;
    item.classList.toggle("open", open);
    const fold = open ? "Hide files" : "Show files";
    attrs(toggle, { "aria-expanded": String(open), "aria-label": fold, title: fold });
    const list2 = item.querySelector(".step-files");
    if (list2) list2.inert = !open;
    let viewed = 0;
    let comments = 0;
    for (const one of files) {
      const seen = view.viewed.includes(one.file);
      if (seen) viewed++;
      one.row.classList.toggle("viewed", seen);
      one.mark.setAttribute("aria-checked", String(seen));
      const count = commentCount(id, one.file);
      comments += count;
      if (count === one.shown) continue;
      one.count.hidden = count === 0;
      one.count.title = `${plural(count, "comment")}: go to the first`;
      one.count.setAttribute("aria-label", `${plural(count, "comment")} on ${baseName(one.file)}: go to the first`);
      one.count.lastChild?.replaceWith(String(count));
      if (one.shown > 0 && count > 0) tick(one.count);
      one.shown = count;
    }
    meta.hidden = open || files.length === 0;
    meta.replaceChildren(
      el("span", {}, viewed ? `${String(viewed)} of ${String(files.length)} viewed` : plural(files.length, "file")),
      ...comments ? [attrs(el("span", { className: "file-count", title: plural(comments, "comment") }, icon("message"), String(comments)), { role: "img", "aria-label": plural(comments, "comment") })] : []
    );
  }
  if (here === "summary") summaryRow.setAttribute("aria-current", "page");
  else summaryRow.removeAttribute("aria-current");
  const pending = pendingComments().length;
  if (pending !== shownPending) {
    pendingCount.textContent = String(pending);
    if (shownPending !== void 0) tick(pendingCount);
    shownPending = pending;
  }
}
var WIDTH = { least: 200, most: 400, start: 248, key: 16 };
var frame = nav.parentElement ?? document.body;
var stepListWidth = WIDTH.start;
var edge = attrs(el("div", { className: "step-list-edge", tabIndex: 0, title: "Resize the step list" }), {
  role: "separator",
  "aria-label": "Resize the step list",
  "aria-orientation": "vertical",
  "aria-controls": "nav",
  "aria-valuemin": String(WIDTH.least),
  "aria-valuemax": String(WIDTH.most)
});
function resizeStepList(width) {
  stepListWidth = Math.round(Math.min(WIDTH.most, Math.max(WIDTH.least, width)));
  frame.style.setProperty("--step-list-width", `${String(stepListWidth)}px`);
  edge.setAttribute("aria-valuenow", String(stepListWidth));
}
edge.onpointerdown = (event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  edge.setPointerCapture(event.pointerId);
  edge.classList.add("dragging");
};
edge.onpointermove = (event) => {
  if (edge.hasPointerCapture(event.pointerId)) resizeStepList(event.clientX - frame.getBoundingClientRect().left);
};
edge.onlostpointercapture = () => {
  edge.classList.remove("dragging");
};
edge.ondblclick = () => {
  resizeStepList(WIDTH.start);
};
edge.onkeydown = (event) => {
  const by = event.key === "ArrowLeft" ? -WIDTH.key : event.key === "ArrowRight" ? WIDTH.key : 0;
  if (!by) return;
  event.preventDefault();
  resizeStepList(stepListWidth + by);
};
resizeStepList(WIDTH.start);
nav.after(edge);
function render(own, navigated = false) {
  followSince();
  const at = current();
  drawHeader(at.kind === "summary");
  drawNav(at);
  document.body.dataset["view"] = at.kind;
  const anchor = navigated ? null : readingAnchor();
  const old = content.firstElementChild;
  const fromOpening = !!opening && old === opening.box;
  if (at.kind === "opening") {
    opening ??= new Opening();
    opening.update();
    if (old !== opening.box) {
      content.replaceChildren(opening.box);
      main.scrollTop = 0;
    }
  } else if (at.kind === "summary") {
    summary.update();
    if (content.firstElementChild !== summary.box) content.replaceChildren(summary.box);
  } else {
    if (content.firstElementChild !== at.pane.box) content.replaceChildren(at.pane.box);
    const bottom = main.getBoundingClientRect().bottom;
    const shows = (element) => !own && !fromOpening && element.getBoundingClientRect().top < bottom;
    arrived.push(...at.pane.update(shows, go));
  }
  if (fromOpening && content.firstElementChild !== old) leaveOpening();
  if (anchor?.element.isConnected) main.scrollTop += anchor.element.getBoundingClientRect().top - anchor.top;
  drawPill();
  drawOnFile();
  for (const time of content.querySelectorAll("time.comment-time")) time.textContent = ago(time.dateTime);
}
var sinceFor = "";
function followSince() {
  const { since, head } = state.view;
  const key2 = since ? `${since.head}:${head}` : "";
  if (key2 === sinceFor) return;
  sinceFor = key2;
  changes.since = !!since;
}
function showChanges(since) {
  const top = main.getBoundingClientRect().top;
  const reading = [...content.querySelectorAll(":scope > :first-child .file")].find((box2) => box2.getBoundingClientRect().bottom > top);
  const was = reading?.getBoundingClientRect().top;
  const old = content.firstElementChild;
  const scrolled = main.scrollTop;
  if (old) settle(old);
  changes.since = since;
  render(true, true);
  const shown = content.firstElementChild;
  if (shown) {
    settle(shown);
    shown.removeAttribute("inert");
    shown.removeAttribute("aria-hidden");
  }
  const same = reading && content.querySelector(`:scope > :first-child .file[data-file="${CSS.escape(reading.dataset["file"] ?? "")}"]`);
  if (same && was !== void 0) main.scrollTop += same.getBoundingClientRect().top - was;
  if (old instanceof HTMLElement && shown && shown !== old) {
    leave(old, scrolled, false);
    animate(shown, "pane-enter", FADE_IN, { ms: "base", curve: "linear" });
  }
}
changes.choose = showChanges;
changes.look = ({ file, start, end }) => {
  if (!changes.since) return;
  showChanges(false);
  const at = current();
  if (at.kind === "step") at.pane.fileNamed(file)?.look(start, end, main, false);
};
function paneOfFile(file) {
  const step = stepOfFile(file);
  const at = current();
  if (!step || at.kind === "opening") return void 0;
  const smooth = at.kind === "step" && at.pane.step.id === step.id;
  if (!smooth) go(stepAddress(step.id));
  for (const leaving of content.querySelectorAll(":scope > [inert]")) leaving.remove();
  return { pane: paneOf(step.id).fileNamed(file), smooth };
}
moving.show = (move, to) => {
  const { file, line: line2 } = move[to];
  const found2 = paneOfFile(file);
  if (to === "from") found2?.pane?.lookDeparture(line2, main, found2.smooth);
  else found2?.pane?.look(line2, line2 + move.count - 1, main, found2.smooth);
};
moving.copied = ({ from: { file, line: line2 }, count }) => {
  const look = { file, start: line2, end: line2 + count - 1, label: "" };
  const found2 = paneOfFile(file);
  if (!found2?.pane?.look(look.start, look.end, main, found2.smooth)) changes.look(look);
};
var onFile = null;
function drawOnFile() {
  for (const box2 of content.querySelectorAll(".file")) box2.classList.toggle("on", box2.dataset["file"] === onFile);
  for (const { files } of navSteps) for (const one of files) one.row.classList.toggle("on", one.file === onFile);
}
function fileAtTop() {
  const top = main.getBoundingClientRect().top;
  return [...content.querySelectorAll(":scope > :first-child .file")].find((box2) => box2.getBoundingClientRect().bottom > top)?.dataset["file"];
}
function moveFile(by) {
  const at = current();
  if (at.kind !== "step") return;
  const { steps } = state.view;
  const order = steps.flatMap((step, index) => shownFiles(step).map((file) => ({ step: step.id, index, file })));
  const here = steps.findIndex((step) => step.id === at.pane.step.id);
  const top = fileAtTop();
  const on = order.findIndex((one) => one.file === onFile);
  const next = on === -1 ? order.find((one) => one.file === top) ?? (by > 0 ? order.find((one) => one.index > here) : order.findLast((one) => one.index < here)) : order[on + by];
  if (!next) return;
  const smooth = next.step === at.pane.step.id;
  if (!smooth) go(stepAddress(next.step));
  onFile = next.file;
  drawOnFile();
  for (const leaving of content.querySelectorAll(":scope > [inert]")) leaving.remove();
  paneOf(next.step).fileNamed(next.file)?.mark(main, smooth);
}
function toggleViewed() {
  onFile ??= fileAtTop() ?? null;
  drawOnFile();
  if (onFile) setViewed(onFile, !state.view.viewed.includes(onFile));
}
function leaveOpening() {
  const leaving = opening;
  const shown = content.firstElementChild;
  if (!leaving || !shown) return;
  opening = null;
  if (!location.hash && firstAddress()) history.replaceState(null, "", `#${firstAddress()}`);
  attrs(leaving.box, { inert: "", "aria-hidden": "true" });
  content.append(leaving.box);
  const scrolled = main.scrollTop;
  main.scrollTop = 0;
  const at = `translateY(${String(-scrolled)}px)`;
  animate(leaving.box, "pane-leave", [{ opacity: 1, transform: at }, { opacity: 0, transform: at }], { ms: "fast", curve: "ease-in", fill: "forwards" }).finished.then(
    () => {
      leaving.stop();
      leaving.box.remove();
    },
    () => {
    }
  );
  const still = reduced();
  animate(shown, "pane-enter", still ? FADE_IN : [{ opacity: 0, transform: "translateX(12px)" }, { opacity: 1, transform: "none" }], {
    ms: "base",
    curve: still ? "linear" : "ease-out",
    delay: duration("fast")
  });
}
state.render = (own) => {
  render(own);
};
window.addEventListener("popstate", moved);
phone.addEventListener("change", () => {
  showDrawer(false);
  render(true);
});
var pendingKey = "";
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (event.defaultPrevented) return;
    const close = changesSwitch.isOpen ? () => {
      changesSwitch.close(true);
    } : menu ? () => {
      closeMenu(true);
    } : document.body.classList.contains("drawer-open") ? () => {
      toggleDrawer();
      header.querySelector(".steps-button")?.focus();
    } : null;
    if (close) {
      event.preventDefault();
      close();
      return;
    }
  }
  const typing = event.target instanceof HTMLElement && event.target.closest('textarea, select, [contenteditable], input:not([type="checkbox"], [type="radio"])');
  if (typing || event.altKey || event.ctrlKey || event.metaKey) return;
  const keys = {
    j: () => {
      moveFile(1);
    },
    k: () => {
      moveFile(-1);
    },
    v: toggleViewed,
    c: () => {
      changesSwitch.open();
    }
  };
  const key2 = event.shiftKey || !Object.hasOwn(keys, event.key) ? void 0 : keys[event.key];
  if (key2 && state.view.ready && !ending && !menu) {
    event.preventDefault();
    key2();
  }
  if (pendingKey === "g" && event.key === "s" && state.view.ready && !ending) go("summary");
  pendingKey = event.key === "g" ? "g" : "";
});
var POLL_MS = 1500;
var LOST_AFTER = 2;
var polling = false;
var failed = 0;
var tag = "";
function poll() {
  if (polling || stopped) return;
  polling = true;
  const since = state.sends;
  if (state.stale) tag = "";
  state.stale = false;
  fetch("data/walkthrough.json", tag ? { headers: { "if-none-match": tag } } : {}).then(async (answer) => {
    if (answer.status !== 304 && !answer.ok) throw new Error(String(answer.status));
    if (stopped) return;
    failed = 0;
    const fresh = answer.status !== 304 && since === state.sends;
    if (fresh) {
      tag = answer.headers.get("etag") ?? "";
      state.view = await answer.json();
    }
    if (ending) hideEnd();
    else if (fresh) render(false);
  }).catch(() => {
    if (!stopped && ++failed >= LOST_AFTER) showEnd("lost");
  }).finally(() => {
    polling = false;
  });
}
PAGE.lost = poll;
viewer = await loadViewer();
var first;
while (!first)
  first = await fetch("data/walkthrough.json").catch(
    () => new Promise((done) => {
      setTimeout(done, POLL_MS);
    })
  );
tag = first.headers.get("etag") ?? "";
state.view = await first.json();
if (!location.hash && firstAddress()) history.replaceState(null, "", `#${firstAddress()}`);
render(true, true);
var poller = setInterval(poll, POLL_MS);
/*! Bundled license information:

markdown-it/dist/markdown-it.mjs:
  (*! markdown-it 15.0.3 https://github.com/markdown-it/markdown-it @license MIT *)
*/
