import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// <define:GRAMMARS>
var define_GRAMMARS_default;
var init_define_GRAMMARS = __esm({
  "<define:GRAMMARS>"() {
    define_GRAMMARS_default = { version: "1.32.22", extensions: { ".bsl": "bsl", ".os": "bsl", ".abap": "abap", ".apl": "apl", ".dyalog": "apl", ".as": "actionscript-3", ".adb": "ada", ".ada": "ada", ".ads": "ada", ".outjob": "ini", ".pcbdoc": "ini", ".prjpcb": "ini", ".schdoc": "ini", ".apacheconf": "apache", ".vhost": "apache", ".cls": "apex", ".apex": "apex", ".trigger": "apex", ".applescript": "applescript", ".scpt": "applescript", ".asciidoc": "asciidoc", ".adoc": "asciidoc", ".asc": "asciidoc", ".asm": "asm", ".a51": "asm", ".i": "asm", ".inc": "asm", ".nas": "asm", ".nasm": "asm", ".s": "asm", ".astro": "astro", ".ahk": "ahk", ".ah1": "ahk", ".ah2": "ahk", ".ahkl": "ahk", ".awk": "awk", ".auk": "awk", ".gawk": "awk", ".mawk": "awk", ".nawk": "awk", ".b": "c", ".bal": "ballerina", ".bat": "bat", ".cmd": "bat", ".bf": "csharp", ".be": "berry", ".bib": "bibtex", ".bibtex": "bibtex", ".bicep": "bicep", ".bicepparam": "bicep", ".blade": "blade", ".blade.php": "blade", ".bst": "yaml", ".c": "c", ".cats": "c", ".h": "c", ".h.in": "c", ".idc": "c", ".cs": "csharp", ".cake": "csharp", ".cs.pp": "csharp", ".csx": "csharp", ".linq": "csharp", ".cpp": "cpp", ".c++": "cpp", ".cc": "cpp", ".cp": "pascal", ".cppm": "cpp", ".cxx": "cpp", ".h++": "cpp", ".hh": "cpp", ".hpp": "cpp", ".hxx": "cpp", ".inl": "cpp", ".ino": "cpp", ".ipp": "cpp", ".ixx": "cpp", ".re": "cpp", ".tcc": "cpp", ".tpp": "cpp", ".txx": "cpp", ".chs": "haskell", ".c3": "c3", ".cmake": "cmake", ".cmake.in": "cmake", ".cob": "cobol", ".cbl": "cobol", ".ccp": "cobol", ".cobol": "cobol", ".cpy": "cobol", ".dae": "xml", ".cql": "cypher", ".cson": "coffee", ".css": "css", ".csv": "csv", ".cue": "cue", ".cdc": "cadence", ".cairo": "cairo", ".chpl": "chapel", ".ck": "java", ".clar": "clarity", ".clj": "clojure", ".bb": "clojure", ".boot": "clojure", ".cl2": "clojure", ".cljc": "clojure", ".cljs": "clojure", ".cljs.hl": "clojure", ".cljscm": "clojure", ".cljx": "clojure", ".hic": "clojure", ".soy": "soy", ".ql": "codeql", ".qll": "codeql", ".coffee": "coffee", "._coffee": "coffee", ".cjsx": "coffee", ".coffee.erb": "coffee", ".iced": "coffee", ".lisp": "common-lisp", ".asd": "common-lisp", ".cl": "c", ".l": "common-lisp", ".lsp": "common-lisp", ".ny": "common-lisp", ".podsl": "common-lisp", ".sexp": "common-lisp", ".cps": "pascal", ".cr": "crystal", ".cy": "javascript", ".cyp": "cypher", ".cypher": "cypher", ".d": "d", ".di": "d", ".dm": "dream-maker", ".dart": "dart", ".dhall": "haskell", ".diff": "diff", ".patch": "diff", ".dockerfile": "docker", ".containerfile": "docker", ".env": "dotenv", ".eq": "csharp", ".sch": "xml", ".brd": "xml", ".eb": "python", ".epj": "json", ".edge": "edge", ".ex": "elixir", ".exs": "elixir", ".elm": "elm", ".el": "emacs-lisp", ".emacs": "emacs-lisp", ".emacs.desktop": "emacs-lisp", ".em": "coffee", ".emberscript": "coffee", ".erl": "erlang", ".app": "erlang", ".app.src": "erlang", ".es": "erlang", ".escript": "erlang", ".hrl": "erlang", ".xrl": "erlang", ".yrl": "erlang", ".fs": "fsharp", ".fsi": "fsharp", ".fsx": "fsharp", ".fnl": "fennel", ".ftl": "fluent", ".ftlh": "fluent", ".fr": "haskell", ".gd": "gdscript", ".gdshader": "gdshader", ".gdshaderinc": "gdshader", ".glsl": "glsl", ".fp": "glsl", ".frag": "glsl", ".frg": "glsl", ".fsh": "glsl", ".fshader": "glsl", ".geo": "glsl", ".geom": "glsl", ".glslf": "glsl", ".glslv": "glsl", ".gs": "genie", ".gshader": "glsl", ".rchit": "glsl", ".rmiss": "glsl", ".shader": "shaderlab", ".tesc": "glsl", ".tese": "glsl", ".vert": "glsl", ".vrx": "glsl", ".vs": "glsl", ".vsh": "glsl", ".vshader": "glsl", ".gn": "gn", ".gni": "gn", ".ebuild": "shellscript", ".eclass": "shellscript", ".po": "po", ".pot": "po", ".feature": "gherkin", ".story": "gherkin", ".gleam": "gleam", ".gjs": "glimmer-js", ".gts": "glimmer-ts", ".glf": "tcl", ".gp": "gnuplot", ".gnu": "gnuplot", ".gnuplot": "gnuplot", ".p": "gnuplot", ".plot": "gnuplot", ".plt": "gnuplot", ".go": "go", ".gdnlib": "gdresource", ".gdns": "gdresource", ".tres": "gdresource", ".tscn": "gdresource", ".gradle.kts": "kotlin", ".graphql": "graphql", ".gql": "graphql", ".graphqls": "graphql", ".groovy": "groovy", ".grt": "groovy", ".gtpl": "groovy", ".gvy": "groovy", ".hcl": "hcl", ".nomad": "hcl", ".tf": "hcl", ".tfvars": "hcl", ".tofu": "hcl", ".workflow": "hcl", ".hlsl": "hlsl", ".cginc": "hlsl", ".fx": "hlsl", ".fxh": "hlsl", ".hlsli": "hlsl", ".html": "html", ".hta": "html", ".htm": "html", ".html.hl": "html", ".xht": "html", ".xhtml": "html", ".erb": "erb", ".erb.deface": "erb", ".rhtml": "erb", ".cshtml": "razor", ".razor": "razor", ".http": "http", ".hxml": "hxml", ".hack": "hack", ".hhi": "hack", ".php": "php", ".haml": "haml", ".haml.deface": "haml", ".handlebars": "handlebars", ".hbs": "handlebars", ".hs": "haskell", ".hs-boot": "haskell", ".hsc": "haskell", ".hx": "haxe", ".hxsl": "haxe", ".hurl": "hurl", ".hy": "hy", ".ini": "ini", ".cfg": "ini", ".cnf": "ini", ".container": "ini", ".dof": "ini", ".frm": "ini", ".lektorproject": "ini", ".mount": "ini", ".network": "ini", ".prefs": "ini", ".pro": "ini", ".properties": "ini", ".service": "ini", ".socket": "ini", ".target": "ini", ".timer": "ini", ".url": "ini", ".imba": "imba", ".json": "json", ".4dform": "json", ".4dproject": "json", ".avsc": "json", ".geojson": "json", ".gltf": "json", ".har": "json", ".ice": "json", ".json-tmlanguage": "json", ".json.example": "json", ".jsonl": "json", ".mcmeta": "json", ".sarif": "json", ".slnlaunch": "json", ".tact": "json", ".tfstate": "json", ".tfstate.backup": "json", ".topojson": "json", ".webapp": "json", ".webmanifest": "json", ".yy": "json", ".yyp": "json", ".jsonc": "jsonc", ".code-snippets": "jsonc", ".code-workspace": "jsonc", ".hujson": "jsonc", ".sublime-build": "jsonc", ".sublime-color-scheme": "jsonc", ".sublime-commands": "jsonc", ".sublime-completions": "jsonc", ".sublime-keymap": "jsonc", ".sublime-macro": "jsonc", ".sublime-menu": "jsonc", ".sublime-mousemap": "jsonc", ".sublime-project": "jsonc", ".sublime-settings": "jsonc", ".sublime-theme": "jsonc", ".sublime-workspace": "jsonc", ".sublime_metrics": "jsonc", ".sublime_session": "jsonc", ".tsconfig.json": "jsonc", ".json5": "json5", ".jsonld": "javascript", ".java": "java", ".jav": "java", ".jsh": "java", ".js": "javascript", "._js": "javascript", ".bones": "javascript", ".cjs": "javascript", ".es6": "javascript", ".jake": "javascript", ".javascript": "javascript", ".jsb": "javascript", ".jscad": "javascript", ".jsfl": "javascript", ".jslib": "javascript", ".jsm": "javascript", ".jspre": "javascript", ".jss": "javascript", ".jsx": "javascript", ".mjs": "javascript", ".njs": "javascript", ".pac": "javascript", ".sjs": "javascript", ".ssjs": "javascript", ".xsjs": "javascript", ".xsjslib": "javascript", ".js.erb": "javascript", ".jinja": "jinja", ".j2": "jinja", ".jinja2": "jinja", ".jison": "jison", ".jsonnet": "jsonnet", ".libsonnet": "jsonnet", ".jl": "julia", ".ipynb": "json", ".just": "just", ".kdl": "kdl", ".ksy": "yaml", ".kit": "html", ".kt": "kotlin", ".ktm": "kotlin", ".kts": "kotlin", ".csl": "kusto", ".kql": "kusto", ".ll": "llvm", ".lvproj": "xml", ".lvclass": "xml", ".lvlib": "xml", ".lean": "lean", ".hlean": "lean", ".less": "less", ".liquid": "liquid", ".lkml": "yaml", ".lookml": "yaml", ".lua": "lua", ".fcgi": "lua", ".nse": "lua", ".p8": "lua", ".pd_lua": "lua", ".rbxs": "lua", ".rockspec": "lua", ".wlua": "lua", ".luau": "luau", ".matlab": "matlab", ".m": "objective-c", ".mdx": "mdx", ".mtml": "html", ".mak": "make", ".make": "make", ".makefile": "make", ".mk": "make", ".mkfile": "make", ".md": "markdown", ".livemd": "markdown", ".markdown": "markdown", ".mdown": "markdown", ".mdwn": "markdown", ".mkd": "markdown", ".mkdn": "markdown", ".mkdown": "markdown", ".ronn": "markdown", ".scd": "markdown", ".workbook": "markdown", ".marko": "marko", ".maxpat": "json", ".maxhelp": "json", ".maxproj": "json", ".mxt": "json", ".pat": "json", ".mmd": "mermaid", ".mermaid": "mermaid", ".druby": "ruby", ".duby": "ruby", ".mirah": "ruby", ".mojo": "mojo", ".mbt": "moonbit", ".move": "move", ".nsi": "nsis", ".nsh": "nsis", ".nf": "nextflow", ".nginx": "nginx", ".nginxconf": "nginx", ".nim": "nim", ".nim.cfg": "nim", ".nimble": "nim", ".nimrod": "nim", ".nims": "nim", ".nix": "nix", ".nu": "nushell", ".yaml": "yaml", ".yml": "yaml", ".ml": "ocaml", ".eliom": "ocaml", ".eliomi": "ocaml", ".ml4": "ocaml", ".mli": "ocaml", ".mll": "ocaml", ".mly": "ocaml", ".mm": "objective-cpp", ".odin": "odin", ".opencl": "c", ".scad": "openscad", ".org": "org", ".aw": "php", ".ctp": "php", ".php3": "php", ".php4": "php", ".php5": "php", ".phps": "php", ".phpt": "php", ".pls": "plsql", ".bdy": "plsql", ".ddl": "plsql", ".fnc": "plsql", ".pck": "plsql", ".pkb": "plsql", ".pks": "plsql", ".plb": "plsql", ".plsql": "plsql", ".prc": "plsql", ".spc": "plsql", ".sql": "sql", ".tpb": "plsql", ".tps": "plsql", ".trg": "plsql", ".vw": "plsql", ".pgsql": "sql", ".pas": "pascal", ".dfm": "pascal", ".dpr": "pascal", ".lpr": "pascal", ".pascal": "pascal", ".pp": "puppet", ".pl": "perl", ".al": "perl", ".cgi": "perl", ".perl": "perl", ".ph": "perl", ".plx": "perl", ".pm": "perl", ".psgi": "perl", ".t": "perl", ".pkl": "pkl", ".polar": "polar", ".pcss": "postcss", ".postcss": "postcss", ".pq": "powerquery", ".ps1": "powershell", ".psd1": "powershell", ".psm1": "powershell", ".prisma": "prisma", ".pc": "c", ".prolog": "prolog", ".yap": "prolog", ".proto": "proto", ".jade": "pug", ".pug": "pug", ".purs": "purescript", ".py": "python", ".gyp": "python", ".gypi": "python", ".lmi": "python", ".py3": "python", ".pyde": "python", ".pyi": "python", ".pyp": "python", ".pyt": "python", ".pyw": "python", ".rpy": "python", ".spec": "python", ".tac": "python", ".wsgi": "python", ".xpy": "python", ".qml": "qml", ".qbs": "qml", ".qs": "javascript", ".sip": "tcl", ".r": "r", ".rd": "r", ".rhistory": "r", ".rsx": "r", ".raml": "yaml", ".rbs": "rbs", ".ron": "ron", ".msg": "rosmsg", ".action": "rosmsg", ".srv": "rosmsg", ".x": "c", ".rkt": "racket", ".rktd": "racket", ".rktl": "racket", ".scrbl": "racket", ".6pl": "raku", ".6pm": "raku", ".nqp": "raku", ".p6": "raku", ".p6l": "raku", ".p6m": "raku", ".pl6": "raku", ".pm6": "raku", ".raku": "raku", ".rakumod": "raku", ".regexp": "regexp", ".regex": "regexp", ".v": "coq", ".coq": "coq", ".rg": "clojure", ".rb": "ruby", ".builder": "ruby", ".eye": "ruby", ".gemspec": "ruby", ".god": "ruby", ".jbuilder": "ruby", ".mspec": "ruby", ".pluginspec": "ruby", ".podspec": "ruby", ".prawn": "ruby", ".rabl": "ruby", ".rake": "ruby", ".rbi": "ruby", ".rbuild": "ruby", ".rbw": "ruby", ".rbx": "ruby", ".ru": "ruby", ".ruby": "ruby", ".thor": "ruby", ".watchr": "ruby", ".rs": "rust", ".rs.in": "rust", ".sas": "sas", ".scss": "scss", ".sparql": "sparql", ".rq": "sparql", ".mysql": "sql", ".tab": "sql", ".udf": "sql", ".viw": "sql", ".db2": "sql", ".sage": "python", ".sagews": "python", ".sass": "sass", ".scala": "scala", ".kojo": "scala", ".sbt": "scala", ".sc": "scala", ".scm": "scheme", ".sld": "scheme", ".sls": "scheme", ".sps": "scheme", ".ss": "scheme", ".sh": "shellscript", ".bash": "shellscript", ".bats": "shellscript", ".command": "shellscript", ".ksh": "shellscript", ".pacscript": "shellscript", ".sbatch": "shellscript", ".sh.in": "shellscript", ".slurm": "shellscript", ".tmux": "shellscript", ".tool": "shellscript", ".zsh": "shellscript", ".zsh-theme": "shellscript", ".sh-session": "shellsession", ".st": "smalltalk", ".smithy": "smithy", ".smk": "python", ".snakefile": "python", ".sol": "solidity", ".bzl": "python", ".star": "python", ".do": "stata", ".ado": "stata", ".doh": "stata", ".ihlp": "stata", ".mata": "stata", ".matah": "stata", ".sthlp": "stata", ".styl": "stylus", ".surql": "surrealql", ".svelte": "svelte", ".swift": "swift", ".sv": "system-verilog", ".svh": "system-verilog", ".vh": "system-verilog", ".toml": "toml", ".toml.example": "toml", ".tsv": "tsv", ".vcf": "tsv", ".tsx": "tsx", ".talon": "talonscript", ".tcl": "tcl", ".adp": "tcl", ".sdc": "tcl", ".tcl.in": "tcl", ".tm": "tcl", ".xdc": "tcl", ".tcsh": "shellscript", ".csh": "shellscript", ".tex": "tex", ".aux": "tex", ".bbx": "tex", ".cbx": "tex", ".dtx": "tex", ".ins": "tex", ".lbx": "tex", ".ltx": "tex", ".mkii": "tex", ".mkiv": "tex", ".mkvi": "tex", ".sty": "tex", ".toc": "tex", ".tftpl": "terraform", ".ttl": "turtle", ".twig": "twig", ".ts": "typescript", ".cts": "typescript", ".mts": "typescript", ".tsp": "typespec", ".typ": "typst", ".upc": "c", ".anim": "yaml", ".asset": "yaml", ".mask": "yaml", ".mat": "yaml", ".meta": "yaml", ".prefab": "yaml", ".unity": "yaml", ".uno": "csharp", ".uc": "java", ".vhdl": "vhdl", ".vhd": "vhdl", ".vhf": "vhdl", ".vhi": "vhdl", ".vho": "vhdl", ".vhs": "vhdl", ".vht": "vhdl", ".vhw": "vhdl", ".vala": "vala", ".vapi": "vala", ".veo": "verilog", ".vim": "viml", ".vba": "viml", ".vimrc": "viml", ".vmb": "viml", ".vb": "vb", ".vbhtml": "vb", ".volt": "d", ".vue": "vue", ".vy": "vyper", ".wgsl": "wgsl", ".owl": "xml", ".wast": "wasm", ".wat": "wasm", ".wit": "wit", ".mediawiki": "wikitext", ".wiki": "wikitext", ".wikitext": "wikitext", ".reg": "reg", ".mathematica": "wolfram", ".cdf": "wolfram", ".ma": "wolfram", ".mt": "wolfram", ".nb": "wolfram", ".nbp": "wolfram", ".wl": "wolfram", ".wls": "wolfram", ".wlt": "wolfram", ".xbm": "c", ".xpm": "c", ".xml": "xml", ".adml": "xml", ".admx": "xml", ".ant": "xml", ".axaml": "xml", ".axml": "xml", ".builds": "xml", ".ccproj": "xml", ".ccxml": "xml", ".clixml": "xml", ".cproject": "xml", ".cscfg": "xml", ".csdef": "xml", ".csproj": "xml", ".ct": "xml", ".depproj": "xml", ".dita": "xml", ".ditamap": "xml", ".ditaval": "xml", ".dll.config": "xml", ".dotsettings": "xml", ".filters": "xml", ".fsproj": "xml", ".fxml": "xml", ".glade": "xml", ".gml": "xml", ".gmx": "xml", ".gpx": "xml", ".grxml": "xml", ".gst": "xml", ".hzp": "xml", ".icls": "xml", ".iml": "xml", ".ivy": "xml", ".jelly": "xml", ".jsproj": "xml", ".kml": "xml", ".launch": "xml", ".mdpolicy": "xml", ".meta4": "xml", ".mjml": "xml", ".mod": "xml", ".mxml": "xml", ".natvis": "xml", ".ncl": "xml", ".ndproj": "xml", ".nproj": "xml", ".nuspec": "xml", ".odd": "xml", ".osm": "xml", ".pkgproj": "xml", ".proj": "xml", ".props": "xml", ".ps1xml": "xml", ".psc1": "xml", ".pt": "xml", ".pubxml": "xml", ".qhelp": "xml", ".rbxmx": "xml", ".rdf": "xml", ".res": "xml", ".resx": "xml", ".rss": "xml", ".scxml": "xml", ".sfproj": "xml", ".shproj": "xml", ".slnx": "xml", ".srdf": "xml", ".storyboard": "xml", ".sublime-snippet": "xml", ".sw": "xml", ".targets": "xml", ".tml": "xml", ".ui": "xml", ".urdf": "xml", ".ux": "xml", ".vbproj": "xml", ".vcxproj": "xml", ".vsixmanifest": "xml", ".vssettings": "xml", ".vstemplate": "xml", ".vxml": "xml", ".wixproj": "xml", ".wsdl": "xml", ".wsf": "xml", ".wxi": "xml", ".wxl": "xml", ".wxs": "xml", ".x3d": "xml", ".xacro": "xml", ".xaml": "xml", ".xib": "xml", ".xlf": "xml", ".xliff": "xml", ".xmi": "xml", ".xml.dist": "xml", ".xmp": "xml", ".xproj": "xml", ".xsd": "xml", ".xspec": "xml", ".xul": "xml", ".zcml": "xml", ".xsp-config": "xml", ".xsp.metadata": "xml", ".xpl": "xml", ".xproc": "xml", ".xs": "c", ".xslt": "xsl", ".xsl": "xsl", ".xsh": "python", ".mir": "yaml", ".reek": "yaml", ".rviz": "yaml", ".sublime-syntax": "yaml", ".syntax": "yaml", ".yaml-tmlanguage": "yaml", ".yaml.sed": "yaml", ".yml.mysql": "yaml", ".zs": "zenscript", ".zig": "zig", ".zig.zon": "zig", ".desktop": "desktop", ".desktop.in": "desktop", ".edn": "clojure", ".fish": "fish", ".rst": "rst", ".rest": "rst", ".rest.txt": "rst", ".rst.txt": "rst", ".templ": "templ", ".wisp": "clojure" }, filenames: { APKBUILD: "shellscript", ".htaccess": "apache", "apache2.conf": "apache", "httpd.conf": "apache", "bird.conf": "bird2", "gradlew.bat": "bat", "mvnw.cmd": "bat", "CMakeLists.txt": "cmake", CODEOWNERS: "codeowners", "riemann.config": "clojure", Cakefile: "coffee", Containerfile: "docker", Dockerfile: "docker", ".env": "dotenv", ".env.ci": "dotenv", ".env.dev": "dotenv", ".env.development": "dotenv", ".env.development.local": "dotenv", ".env.example": "dotenv", ".env.local": "dotenv", ".env.prod": "dotenv", ".env.production": "dotenv", ".env.sample": "dotenv", ".env.staging": "dotenv", ".env.template": "dotenv", ".env.test": "dotenv", ".env.testing": "dotenv", "mix.lock": "elixir", ".abbrev_defs": "emacs-lisp", ".emacs": "emacs-lisp", ".emacs.desktop": "emacs-lisp", ".gnus": "emacs-lisp", ".spacemacs": "emacs-lisp", ".viper": "emacs-lisp", Cask: "emacs-lisp", Eask: "emacs-lisp", "Project.ede": "emacs-lisp", _emacs: "emacs-lisp", abbrev_defs: "emacs-lisp", Emakefile: "erlang", "rebar.config": "erlang", "rebar.config.lock": "erlang", "rebar.lock": "erlang", ".gn": "gn", ".gitmessage": "git-commit", COMMIT_EDITMSG: "git-commit", "project.godot": "gdresource", Jenkinsfile: "groovy", ".buckconfig": "ini", ".coveragerc": "ini", ".flake8": "ini", ".gitreview": "ini", ".pylintrc": "ini", HOSTS: "ini", "buildozer.spec": "ini", hosts: "ini", pylintrc: "ini", vlcrc: "ini", "MANIFEST.MF": "yaml", ".all-contributorsrc": "json", ".arcconfig": "json", ".auto-changelog": "json", ".c8rc": "json", ".htmlhintrc": "json", ".imgbotconfig": "json", ".nycrc": "json", ".releaserc": "json", ".secrets.baseline": "json", ".tern-config": "json", ".tern-project": "json", ".watchmanconfig": "json", "MODULE.bazel.lock": "json", "Package.resolved": "json", "Pipfile.lock": "json", "bun.lock": "json", "composer.lock": "json", "deno.lock": "json", "flake.lock": "json", "mcmod.info": "json", ".babelrc": "jsonc", ".devcontainer.json": "jsonc", ".eslintrc": "jsonc", ".eslintrc.json": "jsonc", ".jscsrc": "jsonc", ".jshintrc": "jsonc", ".jslintrc": "jsonc", ".oxlintrc.json": "jsonc", ".swcrc": "jsonc", "api-extractor.json": "jsonc", "devcontainer.json": "jsonc", "jsconfig.json": "jsonc", "language-configuration.json": "jsonc", "tsconfig.json": "jsonc", "tslint.json": "jsonc", Jakefile: "javascript", Notebook: "json", ".JUSTFILE": "just", ".Justfile": "just", ".justfile": "just", JUSTFILE: "just", Justfile: "just", justfile: "just", ".luacheckrc": "lua", BSDmakefile: "make", GNUmakefile: "make", Kbuild: "make", Makefile: "make", "Makefile.am": "make", "Makefile.boot": "make", "Makefile.frag": "make", "Makefile.in": "make", "Makefile.inc": "make", "Makefile.pc": "make", "Makefile.wat": "make", makefile: "make", "makefile.sco": "make", mkfile: "make", "contents.lr": "markdown", "nextflow.config": "nextflow", "nginx.conf": "nginx", "nim.cfg": "nim", Nukefile: "nushell", ".php": "php", ".php_cs": "php", ".php_cs.dist": "php", Phakefile: "php", ".latexmkrc": "perl", "Makefile.PL": "perl", Rexfile: "perl", ack: "perl", cpanfile: "perl", latexmkrc: "perl", Modulefile: "puppet", ".gclient": "python", DEPS: "python", SConscript: "python", SConstruct: "python", wscript: "python", "installscript.qs": "javascript", "toolchain_installscript.qs": "javascript", ".Rapp.history": "r", ".Rhistory": "r", ".Rprofile": "r", "expr-dist": "r", ".irbrc": "ruby", ".pryrc": "ruby", ".simplecov": "ruby", Appraisals: "ruby", Berksfile: "ruby", Brewfile: "ruby", Buildfile: "ruby", Capfile: "ruby", Dangerfile: "ruby", Deliverfile: "ruby", Fastfile: "ruby", Gemfile: "ruby", Guardfile: "ruby", Jarfile: "ruby", Mavenfile: "ruby", Podfile: "ruby", Puppetfile: "ruby", Rakefile: "ruby", Snapfile: "ruby", Steepfile: "ruby", Thorfile: "ruby", Vagrantfile: "ruby", buildfile: "ruby", "ssh-config": "ssh-config", ssh_config: "ssh-config", sshconfig: "ssh-config", "sshconfig.snip": "ssh-config", "sshd-config": "ssh-config", sshd_config: "ssh-config", ".bash_aliases": "shellscript", ".bash_functions": "shellscript", ".bash_history": "shellscript", ".bash_logout": "shellscript", ".bash_profile": "shellscript", ".bashrc": "shellscript", ".cshrc": "shellscript", ".envrc": "shellscript", ".flaskenv": "shellscript", ".kshrc": "shellscript", ".login": "shellscript", ".profile": "shellscript", ".tmux.conf": "shellscript", ".xinitrc": "shellscript", ".xsession": "shellscript", ".zlogin": "shellscript", ".zlogout": "shellscript", ".zprofile": "shellscript", ".zshenv": "shellscript", ".zshrc": "shellscript", "9fs": "shellscript", PKGBUILD: "shellscript", bash_aliases: "shellscript", bash_logout: "shellscript", bash_profile: "shellscript", bashrc: "shellscript", cshrc: "shellscript", gradlew: "shellscript", kshrc: "shellscript", login: "shellscript", man: "shellscript", mvnw: "shellscript", profile: "shellscript", "tmux.conf": "shellscript", xinitrc: "shellscript", xsession: "shellscript", zlogin: "shellscript", zlogout: "shellscript", zprofile: "shellscript", zshenv: "shellscript", zshrc: "shellscript", Snakefile: "python", BUCK: "python", BUILD: "python", "BUILD.bazel": "python", "MODULE.bazel": "python", Tiltfile: "python", WORKSPACE: "python", "WORKSPACE.bazel": "python", "WORKSPACE.bzlmod": "python", "Cargo.lock": "toml", "Cargo.toml.orig": "toml", "Gopkg.lock": "toml", Pipfile: "toml", "mise.local.lock": "toml", "mise.lock": "toml", "pdm.lock": "toml", "poetry.lock": "toml", "uv.lock": "toml", owh: "tcl", starfield: "tcl", ".exrc": "viml", ".gvimrc": "viml", ".nvimrc": "viml", ".vimrc": "viml", _vimrc: "viml", gvimrc: "viml", nvimrc: "viml", vimrc: "viml", ".classpath": "xml", ".cproject": "xml", ".project": "xml", "App.config": "xml", "NuGet.config": "xml", "Settings.StyleCop": "xml", "Web.Debug.config": "xml", "Web.Release.config": "xml", "Web.config": "xml", "packages.config": "xml", ".clang-format": "yaml", ".clang-tidy": "yaml", ".clangd": "yaml", ".gemrc": "yaml", "CITATION.cff": "yaml", "glide.lock": "yaml", "pixi.lock": "yaml", "yarn.lock": "yaml" }, names: { abap: "abap", "actionscript-3": "actionscript-3", actionscript: "actionscript-3", as3: "actionscript-3", ada: "ada", ahk: "ahk", autohotkey: "ahk", ahk1: "ahk", ahk2: "ahk2", autohotkey2: "ahk2", "angular-html": "angular-html", "angular html": "angular-html", "angular-ts": "angular-ts", "angular typescript": "angular-ts", apache: "apache", "apache conf": "apache", apex: "apex", apl: "apl", applescript: "applescript", ara: "ara", asciidoc: "asciidoc", adoc: "asciidoc", asm: "asm", assembly: "asm", astro: "astro", awk: "awk", ballerina: "ballerina", bat: "bat", "batch file": "bat", batch: "bat", cmd: "bat", beancount: "beancount", berry: "berry", be: "berry", bibtex: "bibtex", bicep: "bicep", bird2: "bird2", "bird2 configuration": "bird2", bird: "bird2", blade: "blade", bsl: "bsl", "1c (enterprise)": "bsl", "1c": "bsl", c: "c", c3: "c3", cadence: "cadence", cdc: "cadence", cairo: "cairo", chapel: "chapel", chpl: "chapel", clarity: "clarity", clojure: "clojure", clj: "clojure", cmake: "cmake", cobol: "cobol", codeowners: "codeowners", codeql: "codeql", ql: "codeql", coffee: "coffee", coffeescript: "coffee", "common-lisp": "common-lisp", "common lisp": "common-lisp", lisp: "common-lisp", coq: "coq", rocq: "coq", cpp: "cpp", "c++": "cpp", crystal: "crystal", csharp: "csharp", "c#": "csharp", cs: "csharp", css: "css", csv: "csv", cue: "cue", cypher: "cypher", cql: "cypher", d: "d", dart: "dart", dax: "dax", desktop: "desktop", diff: "diff", docker: "docker", dockerfile: "docker", dotenv: "dotenv", "dream-maker": "dream-maker", "dream maker": "dream-maker", edge: "edge", elixir: "elixir", elm: "elm", "emacs-lisp": "emacs-lisp", "emacs lisp": "emacs-lisp", elisp: "emacs-lisp", erb: "erb", erlang: "erlang", erl: "erlang", fennel: "fennel", fish: "fish", fluent: "fluent", ftl: "fluent", "fortran-fixed-form": "fortran-fixed-form", "fortran (fixed form)": "fortran-fixed-form", f: "fortran-fixed-form", for: "fortran-fixed-form", f77: "fortran-fixed-form", "fortran-free-form": "fortran-free-form", "fortran (free form)": "fortran-free-form", f90: "fortran-free-form", f95: "fortran-free-form", f03: "fortran-free-form", f08: "fortran-free-form", f18: "fortran-free-form", fsharp: "fsharp", "f#": "fsharp", fs: "fsharp", gdresource: "gdresource", tscn: "gdresource", tres: "gdresource", gdscript: "gdscript", gd: "gdscript", gdshader: "gdshader", genie: "genie", gherkin: "gherkin", "git-commit": "git-commit", "git commit message": "git-commit", "git-rebase": "git-rebase", "git rebase message": "git-rebase", gleam: "gleam", "glimmer-js": "glimmer-js", "glimmer js": "glimmer-js", gjs: "glimmer-js", "glimmer-ts": "glimmer-ts", "glimmer ts": "glimmer-ts", gts: "glimmer-ts", glsl: "glsl", gn: "gn", gnuplot: "gnuplot", go: "go", graphql: "graphql", gql: "graphql", groovy: "groovy", hack: "hack", haml: "haml", "ruby haml": "haml", handlebars: "handlebars", hbs: "handlebars", haskell: "haskell", hs: "haskell", haxe: "haxe", hcl: "hcl", "hashicorp hcl": "hcl", hjson: "hjson", hlsl: "hlsl", html: "html", "html-derivative": "html-derivative", "html (derivative)": "html-derivative", http: "http", hurl: "hurl", hxml: "hxml", hy: "hy", imba: "imba", ini: "ini", properties: "ini", java: "java", javascript: "javascript", js: "javascript", cjs: "javascript", mjs: "javascript", jinja: "jinja", jison: "jison", json: "json", json5: "json5", jsonc: "jsonc", "json with comments": "jsonc", jsonl: "jsonl", "json lines": "jsonl", jsonnet: "jsonnet", jssm: "jssm", fsl: "jssm", jsx: "jsx", julia: "julia", jl: "julia", just: "just", justfile: "just", kdl: "kdl", kotlin: "kotlin", kt: "kotlin", kts: "kotlin", kusto: "kusto", kql: "kusto", latex: "latex", lean: "lean", "lean 4": "lean", lean4: "lean", less: "less", liquid: "liquid", llvm: "llvm", "llvm ir": "llvm", log: "log", "log file": "log", logo: "logo", lua: "lua", luau: "luau", make: "make", makefile: "make", markdown: "markdown", md: "markdown", marko: "marko", matlab: "matlab", mdc: "mdc", mdx: "mdx", mermaid: "mermaid", mmd: "mermaid", mipsasm: "mipsasm", "mips assembly": "mipsasm", mips: "mipsasm", mojo: "mojo", moonbit: "moonbit", mbt: "moonbit", mbti: "moonbit", move: "move", narrat: "narrat", "narrat language": "narrat", nar: "narrat", nextflow: "nextflow", nf: "nextflow", "nextflow-groovy": "nextflow-groovy", "nextflow groovy": "nextflow-groovy", nginx: "nginx", nim: "nim", nix: "nix", nsis: "nsis", nushell: "nushell", nu: "nushell", "objective-c": "objective-c", objc: "objective-c", "objective-cpp": "objective-cpp", "objective-c++": "objective-cpp", ocaml: "ocaml", odin: "odin", openscad: "openscad", scad: "openscad", org: "org", "org markup": "org", pascal: "pascal", perl: "perl", php: "php", pkl: "pkl", plsql: "plsql", "pl/sql": "plsql", po: "po", "gettext po": "po", pot: "po", potx: "po", polar: "polar", postcss: "postcss", powerquery: "powerquery", powershell: "powershell", ps: "powershell", ps1: "powershell", pwsh: "powershell", prisma: "prisma", prolog: "prolog", proto: "proto", "protocol buffer 3": "proto", protobuf: "proto", pug: "pug", jade: "pug", puppet: "puppet", purescript: "purescript", python: "python", py: "python", qml: "qml", qmldir: "qmldir", "qml directory": "qmldir", qss: "qss", "qt style sheets": "qss", r: "r", racket: "racket", raku: "raku", perl6: "raku", razor: "razor", "asp.net razor": "razor", rbs: "rbs", "ruby-signature": "rbs", reg: "reg", "windows registry script": "reg", regexp: "regexp", regex: "regexp", rel: "rel", riscv: "riscv", "risc-v": "riscv", ron: "ron", rosmsg: "rosmsg", "ros interface": "rosmsg", rst: "rst", restructuredtext: "rst", ruby: "ruby", rb: "ruby", rust: "rust", rs: "rust", sas: "sas", sass: "sass", scala: "scala", scheme: "scheme", scss: "scss", sdbl: "sdbl", "1c (query)": "sdbl", "1c-query": "sdbl", shaderlab: "shaderlab", shader: "shaderlab", shellscript: "shellscript", shell: "shellscript", bash: "shellscript", sh: "shellscript", zsh: "shellscript", shellsession: "shellsession", "shell session": "shellsession", console: "shellsession", smalltalk: "smalltalk", "gnu smalltalk": "smalltalk", smithy: "smithy", solidity: "solidity", soy: "soy", "closure templates": "soy", "closure-templates": "soy", sparql: "sparql", splunk: "splunk", "splunk query language": "splunk", spl: "splunk", sql: "sql", "ssh-config": "ssh-config", "ssh config": "ssh-config", stata: "stata", stylus: "stylus", styl: "stylus", surrealql: "surrealql", surql: "surrealql", svelte: "svelte", swift: "swift", "system-verilog": "system-verilog", systemverilog: "system-verilog", systemd: "systemd", "systemd units": "systemd", talonscript: "talonscript", talon: "talonscript", tasl: "tasl", tcl: "tcl", templ: "templ", terraform: "terraform", tf: "terraform", tfvars: "terraform", tex: "tex", toml: "toml", "ts-tags": "ts-tags", "typescript with tags": "ts-tags", lit: "ts-tags", tsv: "tsv", tsx: "tsx", turtle: "turtle", twig: "twig", typescript: "typescript", ts: "typescript", cts: "typescript", mts: "typescript", typespec: "typespec", tsp: "typespec", typst: "typst", typ: "typst", v: "v", vala: "vala", vb: "vb", "visual basic": "vb", verilog: "verilog", vhdl: "vhdl", viml: "viml", "vim script": "viml", vim: "viml", vimscript: "viml", vue: "vue", "vue-html": "vue-html", "vue html": "vue-html", "vue-vine": "vue-vine", "vue vine": "vue-vine", vyper: "vyper", vy: "vyper", wasm: "wasm", webassembly: "wasm", wenyan: "wenyan", \u6587\u8A00: "wenyan", wgsl: "wgsl", wikitext: "wikitext", mediawiki: "wikitext", wiki: "wikitext", wit: "wit", "webassembly interface types": "wit", wolfram: "wolfram", wl: "wolfram", xml: "xml", xsl: "xsl", yaml: "yaml", yml: "yaml", zenscript: "zenscript", zig: "zig", "1c enterprise": "bsl", "actionscript 3": "actionscript-3", actionscript3: "actionscript-3", ada95: "ada", ada2005: "ada", "alpine abuild": "shellscript", abuild: "shellscript", apkbuild: "shellscript", "altium designer": "ini", altium: "ini", apacheconf: "apache", aconf: "apache", apples: "applescript", osascript: "applescript", nasm: "asm", b: "c", bird3: "bird2", batchfile: "bat", dosbatch: "bat", winbatch: "bat", beef: "csharp", buildstream: "yaml", cake: "csharp", cakescript: "csharp", "c2hs haskell": "haskell", c2hs: "haskell", collada: "xml", cson: "coffee", "cairo zero": "cairo", chuck: "java", "coffee-script": "coffee", "component pascal": "pascal", cycript: "javascript", dlang: "d", dm: "dream-maker", byond: "dream-maker", dtrace: "c", "dtrace-script": "c", dhall: "haskell", udiff: "diff", containerfile: "docker", eq: "csharp", eagle: "xml", easybuild: "python", "ecere projects": "json", cask: "emacs-lisp", eask: "emacs-lisp", emacs: "emacs-lisp", emberscript: "coffee", freemarker: "fluent", frege: "haskell", "gentoo ebuild": "shellscript", "gentoo eclass": "shellscript", "gettext catalog": "po", cucumber: "gherkin", "git commit": "git-commit", commit: "git-commit", glyph: "tcl", golang: "go", "godot resource": "gdresource", "gradle kotlin dsl": "kotlin", "hashicorp configuration language": "hcl", opentofu: "hcl", xhtml: "html", "html+erb": "erb", rhtml: "erb", "html+ruby": "erb", "html+razor": "razor", htmlbars: "handlebars", hylang: "hy", conf: "ini", dosini: "ini", "jar manifest": "yaml", geojson: "json", sarif: "json", topojson: "json", jsonld: "javascript", node: "javascript", "javascript+erb": "javascript", django: "jinja", "html+django": "jinja", "html+jinja": "jinja", htmldjango: "jinja", "jupyter notebook": "json", "ipython notebook": "json", "kaitai struct": "yaml", ksy: "yaml", kit: "html", labview: "xml", "less-css": "less", lookml: "yaml", octave: "matlab", mtml: "html", bsdmake: "make", mf: "make", pandoc: "markdown", markojs: "marko", max: "json", "max/msp": "json", maxmsp: "json", "mermaid example": "mermaid", mirah: "ruby", "nginx configuration file": "nginx", nixos: "nix", nush: "nushell", "nu-script": "nushell", "nushell-script": "nushell", "oasv2-json": "json", "oasv2-yaml": "yaml", "oasv3-json": "json", "oasv3-yaml": "yaml", "obj-c": "objective-c", objectivec: "objective-c", "obj-c++": "objective-cpp", "objc++": "objective-cpp", "objectivec++": "objective-cpp", odinlang: "odin", "odin-lang": "odin", opencl: "c", "openrc runscript": "shellscript", openrc: "shellscript", inc: "php", plpgsql: "sql", delphi: "pascal", objectpascal: "pascal", cperl: "perl", "power query": "powerquery", posh: "powershell", "pro*c": "c", "protocol buffer": "proto", "protocol buffers": "proto", py3: "python", python3: "python", rusthon: "python", "qt script": "javascript", "quartus simulation ip": "tcl", rscript: "r", splus: "r", raml: "yaml", rpc: "c", rpcgen: "c", oncrpc: "c", xdr: "c", "perl-6": "raku", "regular expression": "regexp", "rocq prover": "coq", rouge: "clojure", jruby: "ruby", macruby: "ruby", rake: "ruby", rbx: "ruby", sqlpl: "sql", sshconfig: "ssh-config", sshdconfig: "ssh-config", ssh_config: "ssh-config", sshd_config: "ssh-config", sage: "python", "shell-script": "shellscript", envrc: "shellscript", "bash session": "shellsession", squeak: "smalltalk", snakemake: "python", snakefile: "python", starlark: "python", bazel: "python", bzl: "python", "tab-seperated values": "tsv", typescriptreact: "tsx", sdc: "tcl", xdc: "tcl", tcsh: "shellscript", "terraform template": "terraform", "unified parallel c": "c", "unity3d asset": "yaml", uno: "csharp", unrealscript: "java", vlang: "v", nvim: "viml", "visual basic .net": "vb", vbnet: "vb", "vb .net": "vb", "vb.net": "vb", volt: "d", "web ontology language": "xml", wast: "wasm", "webassembly interface type": "wit", "windows registry entries": "reg", "wolfram language": "wolfram", mathematica: "wolfram", mma: "wolfram", "wolfram lang": "wolfram", "x bitmap": "c", xbm: "c", "x pixmap": "c", xpm: "c", rss: "xml", xsd: "xml", wsdl: "xml", xpages: "xml", xproc: "xml", xs: "c", xslt: "xsl", xonsh: "python", edn: "clojure", wisp: "clojure" }, grammars: { abap: { sha256: "d665cc8a82dcf96eaf4b0543459786f0d9192a5e712b757e526dc60369bce96e" }, "actionscript-3": { sha256: "617a08d5cfe2fe49e9595ead20ef782736818e88f33d43741cb90838a47c6e9f" }, ada: { sha256: "79ab75d131fd46981a2e13af4b159ff8a827f2140195dc05038cdc5883aa4fe0" }, ahk: { sha256: "2ad57e24f70aa2c03030b94dd1be23281aa0098a77406b903651965ce367ca4d" }, ahk2: { sha256: "2f469451115474bde9d93b09c48081940ffcda82f5986321bee03a7bba1adb29" }, "angular-html": { sha256: "c65057850a021d5c725c424cb936a9ef5cbfa8cdf28a05261090e0800ef777eb", embedded: ["html", "angular-expression", "angular-let-declaration", "angular-template", "angular-template-blocks"] }, "angular-ts": { sha256: "226afba87e11e01ecfd479c6c44858b8de7c87af30f902cab2524d31fc4e4331", embedded: ["angular-expression", "angular-inline-style", "angular-inline-template", "angular-let-declaration", "angular-template", "angular-template-blocks"] }, apache: { sha256: "37d28440d01d2d70a961f8f25f58a7e6e591556e5afbfdd5f3b5345657d9b82c" }, apex: { sha256: "1d270d92de461aae47f30186e8693144fd37a4cc0405c71a3c4141b661f02006" }, apl: { sha256: "2571df1b33bf5d2f735eb7a0697eb40adcd1f9d7559b2c1382b9974a088a59c4", embedded: ["html", "xml", "css", "javascript", "json"] }, applescript: { sha256: "5649f528fcc7c4866159bc0aa5a13ab07473fccfc21be7be619cbd8731a212bc" }, ara: { sha256: "c61143712af64cb8119b95c7dd2773a58500168f22f93e065c06e09e7af7b576" }, asciidoc: { sha256: "890bbf5f9fa6a6347c53c1119edd3dd20a8c400f6e98968ff6c30ecdfebde4a9", embedded: ["html", "yaml", "csv", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "markdown", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "haskell", "kotlin"], lazy: ["html", "yaml", "csv", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "markdown", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "haskell", "kotlin"] }, asm: { sha256: "fb2985f84149f8d230ec89d4b09c305b92660b372e6e8295f2a92553f7ad7426" }, astro: { sha256: "570296dd8ce84a7fe5e64dbb95e180a0c1554a9065aeb2868fbedf2eafbb6c97", embedded: ["json", "javascript", "typescript", "stylus", "sass", "css", "scss", "less", "postcss", "tsx"], lazy: ["sass", "scss", "stylus", "less"] }, awk: { sha256: "10d61873d5e08a77781a058910d6e17ce5626cd8026012714dfbaafcc2f9f5e6" }, ballerina: { sha256: "08d1179dc57551a0084d4a48a627d1e2d04a5d5673d2f815dd3215d88d021c6a" }, bat: { sha256: "187895f26d25236be6501e8c8d94192ceace95a4f6ae1f47e47fed19103ae904" }, beancount: { sha256: "2d84b71a502299747a1d0a2abf210aa6fc8dfa4386cba7531d7fcbb588a7116e" }, berry: { sha256: "71ce1be49a48ff357f03545f410a76e4b8f51a9b0156169eabd8cfb9867c06ae" }, bibtex: { sha256: "2031f0fe56abab3490a9768ffa6ee94a7c8d05dc1fba8b130effea9d7587136c" }, bicep: { sha256: "42a31507fec15f20372067f7f05bf77bf5d414b96ac36a3a016df024ff8446ad" }, bird2: { sha256: "dd066764165bc60aeba82f10488ce6291899bb444446b941c541c37023c08606" }, blade: { sha256: "1913ab44249fb5ba7ff5d93828165c7c817cdb8413ab84b1cc36b8ebabf21c4a", embedded: ["html-derivative", "html", "xml", "sql", "javascript", "json", "css"] }, bsl: { sha256: "e87ca277cc8daa5f1b7e23863e0848dd193e098791a866a33ecc16be91ec6d20", embedded: ["sdbl"] }, c: { sha256: "6a783a491f44106a4c4710b87422bdcd8540ebe6ec2510dfcdcf7df7edd403f9" }, c3: { sha256: "abeba47760cb650ec622bb2f81b13a878a4a2c11440183d045558093d5245bab" }, cadence: { sha256: "d2d5fef00e56f61005590ed953f90f4da53502411a94183939e9f043a8afbf75" }, cairo: { sha256: "63bcccfa07952be82564b438969de40417314cefeed51e73a3f4e40bb21144b6", embedded: ["python"] }, chapel: { sha256: "03b6937c978a6320b5823d1eb11b37a2885831d0e917899ba5524aec3b7b2b99", embedded: ["c"] }, clarity: { sha256: "fbf9bc255029db55bbb7444dd67a55f0a684bfaa99feb99744ed003ad2250174" }, clojure: { sha256: "de03d10ea8a39ba74fda529e0c25c977cfce6a59f3eef8c1224f536a27c984d4" }, cmake: { sha256: "c02ac569fe3d30b1e36ee5ff9f8548b9f10ce6d8ae7338ef867a1133c1c130b3" }, cobol: { sha256: "e4165fee038b07de87049bef3bf3f02f41d4dbe3d99e9f12aaea0c49e685bf3b", embedded: ["html", "java"] }, codeowners: { sha256: "f4a20cbf42bafc1e34f84da7461979bb229bf14506b2539e42cfce5cf12325a0" }, codeql: { sha256: "a970b5ed5568449349aba1a17e0af933e9789eb3e941b886a3944cc6c65a558b" }, coffee: { sha256: "b22b4e8fbbe6a2683f65265aa071c4815646e5b955ee1dd1662d76efb1761104", embedded: ["javascript"] }, "common-lisp": { sha256: "2e0efc1439447982e8f534de23c9c4f2a393c070e602e503f74ba07ccb21b95a" }, coq: { sha256: "00c967655ff6dafee4a474150b749d0b9099e984090b474038557e9955780390" }, cpp: { sha256: "6a8899737f618f3ae6da693c782b32d5d1bb7c772ce9994a29b0d332cf8d0c83", embedded: ["cpp-macro", "regexp", "glsl"] }, crystal: { sha256: "e3fc3a4417144fbbdfa5e7fe3bcfd3f3d0b898a20e3fbb941485803a2cc7c9e7", embedded: ["html", "sql", "css", "c", "javascript", "shellscript"] }, csharp: { sha256: "31ffc2468705f77f9dc601c83e496e61b752d15ed7c3f6f6ac43758ca15c8518" }, css: { sha256: "02060a327b550d015f0b9b0c1aff69e87951f9a6b18a1c75e4405d50ee83c95d" }, csv: { sha256: "7b270d9c4ce6c1db8442f682146ddb337f4c245b999b5a81c6287fe0aa2b1eb7" }, cue: { sha256: "206716eb41ec7d426dff3c1ac8ac3f85f4fe183ebefc4ad64200eec200c1cd82" }, cypher: { sha256: "cd00bf1f7383fcd72f7679d268c61c32556cdb32354a80202bf3e0d96606d5bc" }, d: { sha256: "3f9ad1e7119398651dc6ed30f5fcce770b53d566512685548e1a63cc363965df" }, dart: { sha256: "6e4eec104a6881fcb6ae63a318b6b20d560ff44c2a069e541dedd81297c79eee" }, dax: { sha256: "c55a889051da21cca214c006a75a7ab31a273fd445602189313609979e342c2b" }, desktop: { sha256: "e7fe0a770ad2e726d5d736fa7cc315105f4486084de3b1664afbba62355f83e7" }, diff: { sha256: "a711eda13cbf7abe386bf729dc088e127613641f2d0d1a28b62a9fece2877756" }, docker: { sha256: "4b407996ccef6df7feae745ed51e82a6a683339022d3a22cf5e5b2ea0a6db75e" }, dotenv: { sha256: "71426f619467549b623ca2ca3bd826a6596d599faaf0f65b808f6d0fc1a815a7" }, "dream-maker": { sha256: "3e807e766a98ff523b380d3bcc771d5f3c57f3717a5371fcc8651d607e5c4783" }, edge: { sha256: "b2d4c31946713943b3abdde58ea63c8fa419b1b51cc25306684e9b760c714a01", embedded: ["typescript", "html", "html-derivative"] }, elixir: { sha256: "feb3a4de9674321042744c3c0934f97639379a885e42bfee5a9a191fd68db01d", embedded: ["html"] }, elm: { sha256: "e1f1f560d87dc5148d47f4f71589c88dd1bd2e27c1e265cd35edf919b4bb8ece", embedded: ["glsl"] }, "emacs-lisp": { sha256: "bec5f69637fd69dfbe65811d71aaf0fd0016841fdbaa7b04ec154c59d373bc92" }, erb: { sha256: "12d8c9209174f117d09e8bce5b2237c1cc4049dc1336b0eb68706531c8df4cf2", embedded: ["html", "ruby"] }, erlang: { sha256: "42de67bb8d971786462e99f0c8d59bc9166163dd60655bd9220e1b11dc02f92e", embedded: ["markdown"] }, fennel: { sha256: "e1bbbd66d2f08396aec83c5f5d83445f825bef2678d65abe877700fdb4d49ade" }, fish: { sha256: "17a34e3a0003c35fe0cca0fc5be36928addfaeabbd04adefcd8083529a61c854" }, fluent: { sha256: "73c7a2e94da069af7f6092cfd9a29775e319e9ef4fdb0bd5eccc2b18bb703366" }, "fortran-fixed-form": { sha256: "3476527231cded8daa9f95ef228ea2b370ccb6a3cb54d2816c7cb66eff7b670c", embedded: ["fortran-free-form"] }, "fortran-free-form": { sha256: "8f5cdc19cbb98f244521158c0e9e24cbf4d6660ed60c5bd316f1058b17adc54c" }, fsharp: { sha256: "8e4c5c084814e2264771730fb40e2e9919d3c6512031c43cfe7a4f6b0239d955", embedded: ["markdown"] }, gdresource: { sha256: "1e858e080db64e878ef3d6ea36b61229be9759da33839177714a11abe604a2a3", embedded: ["gdshader", "gdscript"] }, gdscript: { sha256: "69eab8c23ab46c66068eb3644de73d3527a60465b4c2947ee03c7eef6495c955" }, gdshader: { sha256: "197dc28eee040ba1974bb31173cbd9cc35eefa14e1509129834f4f9ebcec6426" }, genie: { sha256: "959113f8405fd5fb8eea778aaf90e571838220edb276ac1f5d9e6774b959f307" }, gherkin: { sha256: "61e128931e5243c24f86afc24191f380ebd231e47854a37d0ae15d82596c6483" }, "git-commit": { sha256: "21be35dcd1572e2d08c3d788840475744765c9b9d148e82057a0b68af109cba9", embedded: ["diff"] }, "git-rebase": { sha256: "d3abee61347a7bafa3623fddb1bbca3707b565e9e32cd7b886ba3ab06de6f504", embedded: ["shellscript"] }, gleam: { sha256: "64ab9915c3e21f9787b4b789ea68c59d2c3cf81fd40df7f1eb87ff7fafca79c5" }, "glimmer-js": { sha256: "4c1bcb5c99c4b9b173087c960a82fe715d6ffc7072424497669d7d2e8440c842", embedded: ["javascript", "typescript", "css", "html"] }, "glimmer-ts": { sha256: "1dda048a83b57ffe159d7147927371bdb9797b81aaf2e4cbcb7398899680bbfe", embedded: ["typescript", "css", "javascript", "html"] }, glsl: { sha256: "c4dd4bd5b1ff3a8c0fd729261a06e0d7cd2141177cf34f53684297d524e72bef", embedded: ["c"] }, gn: { sha256: "d6276992d21a3493b7ab64f4e1da75d107beb782ffd3138d08351d86a02bf8c9" }, gnuplot: { sha256: "8a396e2c4d8aa121156d0069aabbdfc70451ac888583472eb5cf3476aa27d26f" }, go: { sha256: "ce39c438983c2eb8680c6612fb949598fdf780f79c91711d1380a5cd988a7dd7" }, graphql: { sha256: "f24255a06c7e9e80256fe65e3d8b68505e4a4f20f068007a739219ec386e73c8", embedded: ["javascript", "typescript", "jsx", "tsx"] }, groovy: { sha256: "1d3f39d1e474ae3bbd92480f9f985fe660d4af5e72b2ef7aee9e3937970bf8be" }, hack: { sha256: "435fb268a4223fc8b6facaa6243be1103bf21b6e9296472f7f3e36ecd2fb818f", embedded: ["html", "sql"] }, haml: { sha256: "2ae1dd6bf77a716f4d96a90097c59a3a1548d64d92045a8cc8c19c2a55af5de9", embedded: ["ruby", "javascript", "sass", "coffee", "markdown", "css"], lazy: ["ruby", "sass", "coffee", "markdown"] }, handlebars: { sha256: "63410dba62699aa84008274fec2f733461b97b23d948e23cd1831b62c68c76fa", embedded: ["html", "css", "javascript", "yaml"] }, haskell: { sha256: "030927a96a7d4ca5548e6d6631efb048617b6098fde26049d87dd7d17221af00" }, haxe: { sha256: "a26d9810c50a1b4775a4562c1b897294d12e7e04aefbe89d948c0659d22ddd41" }, hcl: { sha256: "8ad2847f1765adbe564202c7bf0226ffa7a11c3e14c3cf9ff79812c69d250a1b" }, hjson: { sha256: "eee2f1aa3472ed3d3fc82443ace80be33a921dcdd8fb7210e6822c060790d4e8" }, hlsl: { sha256: "451c884bbe6acdd0b94c7564fed3d161746619d47bb71a6de0ca2032ababb428" }, html: { sha256: "7538c38e0d1703bae90fb097a0fbc8501bc112ae06f149934ea6464f2c5ddae4", embedded: ["javascript", "css"] }, "html-derivative": { sha256: "9e90d5770e508d0c8a43004f782014fe0bfa97867e27c06fef46bcc82f0dfe4c", embedded: ["html"] }, http: { sha256: "577c6a4259737bb723f693300e2dc80b868aa34c00ba824a695a9473cf5ac6e1", embedded: ["shellscript", "json", "xml", "graphql"] }, hurl: { sha256: "2eee942fd805099f11c9572d44eff05a5649a97ae3f9f3338d943eaa31f945f1", embedded: ["graphql", "xml", "csv"] }, hxml: { sha256: "5b6cee11134d967bb91c0803dbba0804618e422eb64b4804b7aeac8efb8c5dec", embedded: ["haxe"] }, hy: { sha256: "d5a356367e00a46688b348d186cca39893e15bcde35dfb807e541e1c78d63ff1" }, imba: { sha256: "f244f61f9358ae6fab62c15134dc209a8ba1c7cee72bf294576998cb3d7a1446" }, ini: { sha256: "5b4a4ef9673429f7f13fec73eae543e3e00e1245762aacd89bb1849322338b61" }, java: { sha256: "c2d622b901b19119f2b3469583ef50fe6998788c179c0d3bbd7a0eab019378cb" }, javascript: { sha256: "a30cb0504491961b3d1bc99971daa5c2aedc7387f4782b567e1f0ac47aa83cba" }, jinja: { sha256: "f17c9a7064fcf6f1fb7b900b4180650f69505cb53e82123203541c1af26b40a0", embedded: ["jinja-html"] }, jison: { sha256: "984b4ec444bdbf651160f6d787ba626c44ae7e7a586e7ded188765704b4b553a", embedded: ["javascript"] }, json: { sha256: "f726cfcd953e00567c714a93c15a6227ef7bdb92c939cb07217e036ef5716dc0" }, json5: { sha256: "f034701d1180b6e9b05ed45f135a9798790f42a4ca757a5eedf46bf621413fca" }, jsonc: { sha256: "87374ba1bee9a9af779038accbcbe4ecc7c30ae891b2fefcbc411aa88db24cfc" }, jsonl: { sha256: "d9d9f117f348eec4d85e1ea2133b1e07316c566a8cafc151a42da87d1fb28ccc" }, jsonnet: { sha256: "b8d23e7e2736ca5139ff9f61461ddedb7950654b3e1f84d46be38cdad073c8ab" }, jssm: { sha256: "f643722c2aacda4fe77e95469c410565861ba77206534e135adab59dbe24c7c4" }, jsx: { sha256: "e1a2dadc98b5750946aca0a754a974216fb0d7d5d0c9bdb9d9ad19450a56322b" }, julia: { sha256: "95d3eeb8f35d9ea5fe10edb3a6bdb9fb5e6b9363e71965614141993aeabc7893", embedded: ["cpp", "python", "javascript", "r", "sql"] }, just: { sha256: "9c6ed82a9fef493c9cc7857f44c2b72128153dac9ec5f80f6a47c51056d42d44", embedded: ["shellscript", "javascript", "typescript", "perl", "python", "ruby"] }, kdl: { sha256: "f19e3edcd2e8f387a7cd3ee1414e3a0656eed4c675afd1e2bb15c8e84887aec9" }, kotlin: { sha256: "df113ce9452b3938bdee7a18e88f688eb7eb2023607e62dbad46e756c68f7729" }, kusto: { sha256: "266102e01feea9e67812dee2539f1dc5535e5fa391973f59beb65131c8faf873" }, latex: { sha256: "aab4fa80c27b22be4dfbe68ed55411c13534929b5fa96ba4a8af1d18d749ad53", embedded: ["tex", "shellscript", "css", "gnuplot", "haskell", "html", "java", "julia", "javascript", "lua", "python", "ruby", "rust", "typescript", "xml", "yaml", "scala"], lazy: ["shellscript", "css", "gnuplot", "haskell", "html", "java", "julia", "javascript", "lua", "python", "ruby", "rust", "typescript", "xml", "yaml", "scala"] }, lean: { sha256: "fa48db0d69244fe7556e5201525cf04bb8ee5146d8626deac1989ddff768fb59" }, less: { sha256: "2dcc623cd0f6457b77ce12765db469707d9da44c2033aa63bfb645bc670f44e9" }, liquid: { sha256: "c94cd418d9f839d5dc922c5cc1a9cffb35d4c82c5be56bf64bc823d29fded9de", embedded: ["html", "css", "json", "javascript"] }, llvm: { sha256: "74bd5b6a9f59612cec2943ce36bbf102fb9914a55b95db5733b1a48531a9dd48" }, log: { sha256: "41f32399f600df1710db2e417b5160a3c015c71f97ce851bce3068dd6b157860" }, logo: { sha256: "b8e96bdf1cafe536ed9b79c7de10ddb10e1b102fb58e5716729d742f7384f19a" }, lua: { sha256: "cba0798e8a1155fa81b72d029332e097a6b7b1f2e45eff036adba602d2efea93", embedded: ["c"] }, luau: { sha256: "8fcbabf53a194b6f687cf36b5a462717fa6200949603998842d70fbeddaf9ea7" }, make: { sha256: "b39266e91f2b7619395e7c164674bb52ecf7c9ce815beb1065297766e1e2af03" }, markdown: { sha256: "02f472fd0df82f212be5dfde4d9ee90982885247a884323d8a6c80ecf87114b3", embedded: ["css", "html", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "jsonl", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "html-derivative"], lazy: ["css", "html", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "jsonl", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "html-derivative"] }, marko: { sha256: "bbbd87a18b6a4a8b328049bcba9509be13afc09cac40a7887544bb70c526e5e4", embedded: ["css", "less", "scss", "typescript"] }, matlab: { sha256: "ab688e8332e7a7bf7cffbf8f98a9d0d32cab1fe51bc1b589297e45de6a6c2f8f" }, mdc: { sha256: "f5188840eede1fdeb22e1bbcb772e560998d8668bb701b69426608eb9de53e52", embedded: ["markdown", "yaml", "html-derivative"] }, mdx: { sha256: "1b9569f7369728ba9d088a1720121b4f8129441306e8968fdd747a1c3d73d7d6", embedded: ["tsx", "toml", "yaml", "c", "clojure", "coffee", "cpp", "csharp", "css", "diff", "docker", "elixir", "elm", "erlang", "go", "graphql", "haskell", "html", "ini", "java", "javascript", "json", "julia", "kotlin", "less", "lua", "make", "markdown", "objective-c", "perl", "python", "r", "ruby", "rust", "scala", "scss", "shellscript", "shellsession", "sql", "xml", "swift", "typescript"], lazy: ["tsx", "toml", "yaml", "c", "clojure", "coffee", "cpp", "csharp", "css", "diff", "docker", "elixir", "elm", "erlang", "go", "graphql", "haskell", "html", "ini", "java", "javascript", "json", "julia", "kotlin", "less", "lua", "make", "markdown", "objective-c", "perl", "python", "r", "ruby", "rust", "scala", "scss", "shellscript", "shellsession", "sql", "xml", "swift", "typescript"] }, mermaid: { sha256: "00f2399649293bcd4d9557a82d5e414628d4c675f366fbd73a419b53922e76e7" }, mipsasm: { sha256: "1e677d62ff64d2c00cb0adac472217d7a3dcd403b8cd244876f234b66a651df1" }, mojo: { sha256: "742bbf1145b3bc47391927128c427a27f3f694d62cb4c4b10fecb8bc3984f148" }, moonbit: { sha256: "0f9cf0bfe8609d49144685dd00b4be9d97aa1e4ee91a80ecf2e039ac389fa8a3" }, move: { sha256: "d37f59207665d42415f071b11116c58e815ca06310409aa917e6007168cda985" }, narrat: { sha256: "7aea8b615eba280e7919a2e63c9ce3bd6fa5f45901d9ba5b60dc8570c8d9b6f0" }, nextflow: { sha256: "cac2155ebedb2522f277e1f45d2800b995d72cc2fa39d0b330868c3ce65cb4aa", embedded: ["nextflow-groovy"] }, "nextflow-groovy": { sha256: "02333af8e2fc69b7dff83bd432036048c5829bc28c89db75ed9572b40f2bcbbc" }, nginx: { sha256: "c63bba1384fe4dec1c650015f6f102f2355c48dc75b3e653929d218229db7317", embedded: ["lua"] }, nim: { sha256: "d1302634a0b1396a7642330d9c4115eda66f4e277f2b067531b981cf325d72a3", embedded: ["c", "html", "xml", "javascript", "css", "glsl", "markdown"] }, nix: { sha256: "33555de7449551044cf017d1f3c12ee9df1c7f6a7eb2d9b7357eade16f2363af", embedded: ["markdown-nix"] }, nsis: { sha256: "4636d51d848f215e1811b3432c9e747554a9cdcf2273c066774e04e8f8039c37" }, nushell: { sha256: "186d3aa0dd8914008bcd4d2284a92613d35e63cfc67cd868ecd41d5fc21c1674" }, "objective-c": { sha256: "b4d74efae95f6320e43e77a7d2f944b6ad08a647ea9818aa846fea89601ece31" }, "objective-cpp": { sha256: "6afdca5beb7414f0861cf8b02d688356b60705b4fb3bba793b70b1519f097eb9" }, ocaml: { sha256: "663942ddd7e33be24edf4dd2029642e171a54bb42aeb3074b542fa2b67410a7b" }, odin: { sha256: "547d78475dbe5677c9caf6e6d32701dd9bdf4541eb61a0107d7d87329b8e4c01" }, openscad: { sha256: "9f997b66068ccd2df78a692dbd0d6b1ade1080dfa97dbca235a828626fa5ac04" }, org: { sha256: "776225e588c8e91e28afcb1eb68b50b35a26f73c2828b7478044e19f5654e1c1", embedded: ["javascript", "typescript", "tsx", "java", "python", "regexp", "css", "lua", "ini", "make", "perl", "r", "ruby", "php", "sql", "vb", "clojure", "coffee", "c", "cpp", "objective-c", "diff", "docker", "go", "groovy", "less", "scss", "raku", "rust", "scala", "shellscript", "csharp", "dart", "nim", "elixir", "erlang", "ocaml", "zig", "yaml", "json", "xml", "xsl", "markdown", "html", "git-commit", "git-rebase", "latex"] }, pascal: { sha256: "a7fb5cdb176b58d998c4af0eb61976c2d487201e2691fc2b3cedbb6e2ed1b7a1" }, perl: { sha256: "f13691f0d72752898f390d2dfbf014a43abe493995140986562e91ed99693688", embedded: ["html", "xml", "css", "javascript", "sql"] }, php: { sha256: "f2981c0553e5c0b95f11cc5d2435d6022fcf3bf0a2179c4e52407e8b61d7089f", embedded: ["html", "xml", "sql", "javascript", "json", "css"] }, pkl: { sha256: "7bd32ba65e24636ac96bbc382eff195c61ef2774db9f30843b4e8dc9f891b479" }, plsql: { sha256: "f1bda1268a547a0b588cc944f6685b94f585cdcf204e96509981d6d671acc09d" }, po: { sha256: "2e1303ec69fb38db11b1e18517b5ebb1c98361ce2a86c640620fab0db2266db1" }, polar: { sha256: "86403d6999b32c8ce513a64a578032b9d15dc54847109f8e92667d48ea187845" }, postcss: { sha256: "14e9809ba04f4ca03e8f05675f3e56dadfdfb5a4c12263d6935685baae064659" }, powerquery: { sha256: "e73f4b6e59ec522738180f7ac55e458963ecbad0cabe659679bb772d8a57fc9a" }, powershell: { sha256: "4e01664d850d278e259858fd436eb969aae620f70c4d925ffe3c8d0a188c1479" }, prisma: { sha256: "cb83788493581bebd52594eb6f7a7b66edfc869dbc099c1c42e4e655ba42cbd1" }, prolog: { sha256: "490a5743f8a293cd0bb18db7a79701837869f84595520abc04c01f69fbcd9ffc" }, proto: { sha256: "61d8dbdaf915b9628ce53f13e0d467c95db1b263edc827dfd2499745d7f0f9fc" }, pug: { sha256: "98b0c9fe3464e55029a964658a6a701022957df0391006248ae857bc82b96174", embedded: ["javascript", "css", "sass", "scss", "stylus", "coffee", "html"], lazy: ["sass", "scss", "stylus", "coffee"] }, puppet: { sha256: "6e7a8494e4b619a4efc2018ac86121e816c1e2631fed7eafc0a8beb6aa84fb67" }, purescript: { sha256: "b18d2ab9e7a31d3c1d453fd6f585786f65f6044743f5b0cad7f6867ee2f41340" }, python: { sha256: "8b6b4cb21cce413b2f764ef6b71dfae059a77433530f9dd77ea9b5a53af1ee35" }, qml: { sha256: "51471372dd6d2fbe5f08d26b7100b7b5ae8890560b6b9f21c48deb0cc6316972", embedded: ["javascript"] }, qmldir: { sha256: "dc22b0d9a691e863ffe3ba9ccb32ab7343eb62bb0db537005353d0569974659c" }, qss: { sha256: "d1e706c75c490163dee96ff70e12cebb656dc4a52cc8ef77c15cc9a12440e09b" }, r: { sha256: "87050d7d24035c6d7bc5c7b409e134f85d1dcaf2a5f08ef532fe1e25491c47de" }, racket: { sha256: "f1c7ab4fe54e0b57f22afe4978c1b2dbea5bba4f9c06b2256a35a15a87bd9d56" }, raku: { sha256: "30014c56087f97be1c4732dd86ac845d521de27b54264bc205d01d86ee6bfd50" }, razor: { sha256: "e094c40aa157fb020ee9204de9661370cd0851a4c56b30bd19344707ae29f279", embedded: ["html", "csharp"] }, rbs: { sha256: "198654ecccaa8c7bb2b27e86f24d55eb14e8c5d24a72f2f56caa8437f3cbb579" }, reg: { sha256: "88bdcd8fea9759d67beae18d7f6255a8c66dd2aebaf48f3a18cf2af110bc75f3" }, regexp: { sha256: "87b56f94dc703cea1cd330d4cd088e4944d8df4358b235f2ae867cfb14143f2d" }, rel: { sha256: "8ac2d6f1f12c13ec1c6f9e3a641d569fbc51c7ee88579c5d322ceec81a88b002" }, riscv: { sha256: "edd55d53350f5f34c37278d75c23c1dcb36dbea5d5c039d4923513c5df88b2f2" }, ron: { sha256: "0862776e3d701003f381f7877e096a4ccc16fe190e492ac78f80b53b6ee2e72c" }, rosmsg: { sha256: "2997167030755ea64c7e88d79241864d1b87d19b1a7886df3b2d20eee2107d62" }, rst: { sha256: "0de16f7839b2057fda5d59bf9c973185e5d596381d779e60131a350fc6d7620b", embedded: ["html-derivative", "cpp", "python", "javascript", "shellscript", "yaml", "cmake", "ruby"] }, ruby: { sha256: "ff3e48c0958a75e6bbc794978083320f761c9bc3cfe20a6435f479c7be4c78b0", embedded: ["html", "haml", "xml", "sql", "graphql", "css", "cpp", "c", "javascript", "shellscript", "lua", "yaml"] }, rust: { sha256: "e6ecf805e26ea7db8f32dfca38afcf19192cc45c942f7cedfff33889183c548d" }, sas: { sha256: "730592dc6a79b52f65731e083e3228ea5f694a0465155648b5970b43957059e9", embedded: ["sql"] }, sass: { sha256: "17504b4f319ae6ac8b1e137754bcde9ed6c0be6de46082999aa57467d3bd7fc8" }, scala: { sha256: "ac7c4f2cc8b0f79e975048eefb40751ed6435727cac6dd4df07ce949436b1df5" }, scheme: { sha256: "14620ef4a000f89a39f9e6c53301abbb231b686d8b4fc089f2a91ed6d494e4d4" }, scss: { sha256: "35977f043318d4877b31e40064d90028bfeb085e240e72ae0defa167346112bf", embedded: ["css"] }, sdbl: { sha256: "02add596f17115e7bbf80764f2981e135e3b7a6737e985ae34a6128b3dd08ada" }, shaderlab: { sha256: "a1173a39c7ac3b5376606c1457f287a6d42c5c39cf7942fbcc9a97b3ed5fe9a3", embedded: ["hlsl"] }, shellscript: { sha256: "f9a7ca3def50407b4500311cc47275295f6a2d3f9f683f1f0accc3056f0e4cc8" }, shellsession: { sha256: "0a19fe818f6021a6ffdd6768d35c33cc9469deeab9adcc6754039f71e1f39ef4", embedded: ["shellscript"] }, smalltalk: { sha256: "f557c22367520ded3fd0c296e124f3a2f56466a2e12dff9bf38273b97c1d87cf" }, smithy: { sha256: "cb8a779be9c53ab1f14a86ba8a5f1c068a9014351ac0d78c3ff11a138d5b2ae1" }, solidity: { sha256: "3b8236fbb32ac373e43629032d477e773e76f3d5d262090e824c3d9b42d0deab" }, soy: { sha256: "56901c68e495d7d2c96d6da6ca5e9aed7c50c12352102373d17d657590284ae3", embedded: ["html"] }, sparql: { sha256: "27cd16ef126d0fe2567d8b86128f54d4c33a155225742fb2c6a490b8f254aa19", embedded: ["turtle"] }, splunk: { sha256: "3f7a7a37dc07e259eb0c15b8d201b2f0d8fc4d32a6d911a6d0d20f7e93b541fa" }, sql: { sha256: "a79bd625f928c0c2297ee4d96248b30c357e7c33aba8d6cb8d41d6ae801c8758" }, "ssh-config": { sha256: "067252a98779c19bef2fe1a507994ee4c28965659b4276afea269f6bd43e7523" }, stata: { sha256: "cee50b9b4cad9f9f1a4685384ae7869a2b445e76c5ffa7381a6844827ee6a3cc", embedded: ["sql"] }, stylus: { sha256: "39d238fe3c42cd48f150dc0f21bc92beee534585f7026e5b1ef4c445ba797045" }, surrealql: { sha256: "889e98d5adcb1cbe88ef1a8fa12210c1af5923208eaf849916a1037b31ecc196", embedded: ["javascript"] }, svelte: { sha256: "cf6fdcd8f16b676bee9d727e661718a6e3b7ac4722c13987d94db551a7d183d5", embedded: ["javascript", "typescript", "coffee", "stylus", "sass", "css", "scss", "less", "postcss", "pug", "markdown"], lazy: ["coffee", "stylus", "sass", "scss", "less", "pug", "markdown"] }, swift: { sha256: "1bb401139dda5ef99bc39dc1719ffeefcb3ba4c2ad6a72457e2b3ff8248e86f9" }, "system-verilog": { sha256: "26b3ef7f1bbe16faff89f8059e590667078628fdccb641ca3c02b35082bd265e" }, systemd: { sha256: "6bc98263dec1c7365221ab9488b2dc547f06f2997b195db91c2c1e922913b123" }, talonscript: { sha256: "281d25bf296a66728878265b732d01d0d7fd06e1aecdb2c69a52b945d5994c03" }, tasl: { sha256: "e8d2ce8082be37c7021bf5a173e5ae277143ddb64050bb8ad703a282c13fa205" }, tcl: { sha256: "3abed0f91139705027c0fbfbf0e977ed3550a191b68a53e93ec0199f34fc08e5" }, templ: { sha256: "8e4d5ba677ec70c2376d672a1523e45ac716b77591b6b23894f7cb22d85cc2a9", embedded: ["go", "javascript", "css"] }, terraform: { sha256: "3c4984f932c6c9d672505b737e75fb6612b1849ca32cffd62efaf731babb6c6e" }, tex: { sha256: "5a6795ecb5dcc0bccc65ed86b9beebbd1410c80fc92e325041ba974fe6f19b77", embedded: ["r"] }, toml: { sha256: "d54ac615bfbf5d7f05c11723cf145470f74ea8cc59bb7b2a20e598d0abf92d08" }, "ts-tags": { sha256: "4868de0363ce6bedfd18b7f1e70578c3a6c7eef87a05091ebcd0c125e1470a92", embedded: ["typescript", "es-tag-css", "es-tag-glsl", "es-tag-html", "es-tag-sql", "es-tag-xml"] }, tsv: { sha256: "16ecf93386f646cdb792c5cde49ce05ed397ca9e5eb55bfa262943dc43f62fc5" }, tsx: { sha256: "367120b5adb2fe51f4c4b3edcab86e569e5a1e2a6c3652e318ba52281033fddd" }, turtle: { sha256: "554934a49f95ae4be3e607de5c645c0929dda389a4683a3e62634caacb52fa0d" }, twig: { sha256: "ef429919b88bb9da5fcc40188c40d51611a4fb21571b69e53593d48f0077e5da", embedded: ["javascript", "css", "scss", "php", "python", "ruby"] }, typescript: { sha256: "e86e45f551919f50ac5e5cf89990c3520877305b35708294de5ae83c9b6ca559" }, typespec: { sha256: "23ace3084f239c237574e53e53b31e8267859422d5360aa65860010d3176c886" }, typst: { sha256: "5cc026431ee28ba576cd67fbdea31b5bf9de6bc4de6c08dd34f642e3b03a55f7", embedded: ["bat", "bibtex", "c", "clojure", "coffee", "cpp", "css", "csharp", "dart", "diff", "docker", "elixir", "erlang", "fsharp", "git-commit", "git-rebase", "go", "groovy", "handlebars", "html", "ini", "java", "javascript", "jsonc", "json", "julia", "latex", "less", "log", "lua", "make", "markdown", "objective-c", "perl", "raku", "php", "powershell", "pug", "r", "regexp", "ruby", "scss", "sql", "swift", "xml", "xsl", "yaml", "python", "rust", "scala", "shellscript", "typescript", "tsx", "twig", "verilog", "system-verilog", "vb"] }, v: { sha256: "27e96ecd7a289dcfc9f474c110c8bc91d24ab156bd8ed15630bc6d236003cad0" }, vala: { sha256: "b4e9fbb5d6527685fd7eed19c4267a5af6105ed425b731bb55c08702fc01728d" }, vb: { sha256: "f69b366bee20af30507108d1e4ebf1844114084ea8af19fa704dc011081ba0d5" }, verilog: { sha256: "b82b36604f451426f04efe26f6d83ca27e2f2b6eae8fb3c2ac9beef316bfdfff" }, vhdl: { sha256: "36eb1d1977150f0c4b8d2eaf5c5cc80a3c1089c5f66d2518f79850fb74e302bf" }, viml: { sha256: "56bd0d022416dd0458949fd36ea0e35fb63c049cb8f597c7b77f2f41e660b43d" }, vue: { sha256: "86b4d7e883cb346849cce467711eb100695d8ab029481f3e1e82e30626c8a185", embedded: ["markdown", "pug", "stylus", "sass", "css", "scss", "less", "javascript", "typescript", "jsx", "tsx", "coffee", "json", "jsonc", "json5", "yaml", "toml", "graphql", "html", "html-derivative", "markdown-vue", "vue-directives", "vue-interpolations", "vue-sfc-style-variable-injection"], lazy: ["markdown", "pug", "stylus", "sass", "scss", "less", "jsx", "tsx", "coffee", "jsonc", "json5", "yaml", "toml", "graphql"] }, "vue-html": { sha256: "c01bbff38118975292729762527dfd3f68cc67ddf4886a3b51675acc24bfd958", embedded: ["javascript"] }, "vue-vine": { sha256: "6a5274d61e01a5928e4b496613b4be72cf835eac3c5c64bbbaff15219598cae7", embedded: ["css", "scss", "less", "stylus", "postcss", "javascript"] }, vyper: { sha256: "4c34391c19b7cd5ee8da086e13435b1c0577c0dc7fc8fb45b4ee2a8d3b78fb70" }, wasm: { sha256: "6609162d75e0569dd829b754675695ecb5c02fd27fb290a42f4e8aed6c5197b4" }, wenyan: { sha256: "8bc2aaa23401eb0720eb0eb1d2be0a7b52a1ee78e396a66d394f3d684d2f8623" }, wgsl: { sha256: "7b5f275146ead9da3d0ff8c9bd0a72cc898060c55aa872357fb21cbabbf76aa7" }, wikitext: { sha256: "86dba29565e8a2697a9d7befc6587b1c8b10c742096fa1a9b9f1d9725d2dcaf7", embedded: ["html", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "go", "groovy", "pug", "javascript", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "rust", "scala", "shellscript", "typescript", "csharp", "fsharp", "dart", "handlebars", "markdown", "erlang", "elixir", "latex", "bibtex", "json"], lazy: ["html", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "go", "groovy", "pug", "javascript", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "rust", "scala", "shellscript", "typescript", "csharp", "fsharp", "dart", "handlebars", "markdown", "erlang", "elixir", "latex", "bibtex", "json"] }, wit: { sha256: "c23035ea7b269b51f9bce46732cc7016185b3e825302e2b2c3d4145e85bd7b4c" }, wolfram: { sha256: "8601f9148462061df5cb1c22714314ca4244ae78a93fef44ae8a0d984f3db27a" }, xml: { sha256: "4432e3aa5974256559326a692830cc5b375a21aac895de739e8b0a73a396edf6", embedded: ["java"] }, xsl: { sha256: "bda17f37f2f316482c6d85a9edd4c36819c101904f0de2bdcad0db44b949fdd4", embedded: ["xml"] }, yaml: { sha256: "960c376ae415e3258da44b8afe603828c919a2d6efbf8072b26b744246116542" }, zenscript: { sha256: "9794c14bd839a6dfe19274c89bd5d8c3e4d3d99359e0cae55e7175fb4e4095d7" }, zig: { sha256: "109b561fe38adb2bf9961089e42212ed27e160ab4178dfb5ec4c377cbe2a402f" }, "angular-expression": { sha256: "0fc8f4c158dccc522d0ad27153e5e63aa4d26f733c25bd54bebb87309f9d9da8" }, "angular-inline-style": { sha256: "733ce2509055659080e36ad58d83eb057242ea8ed7ede118696cc270e7d7e866", embedded: ["scss"] }, "angular-inline-template": { sha256: "23eeb4a08a3f67a9d40d09a327a8a43621ab054c6fb45eea8eb0ee05b7edd517", embedded: ["angular-html", "angular-template"] }, "angular-let-declaration": { sha256: "d68fe60f06ddfbeaeef3168c66999cc5d986668bd489d5783ff2e95d24489005", embedded: ["angular-expression"] }, "angular-template": { sha256: "67dbbdbb936ff0e9f5fb8cadefc0c33984369872576f45ee13685ec2316a84b5", embedded: ["angular-expression"] }, "angular-template-blocks": { sha256: "0dbb6a2872a8ea633687db4bb8e5a75064a78fb3628ae809a296920abd4b0615", embedded: ["angular-expression", "angular-template"] }, "cpp-macro": { sha256: "02e157a7c1a96d98a3c8d3b3f3f33719886410de3a6fdbd6e05826ce2987a7e5", embedded: ["regexp", "glsl"] }, "es-tag-css": { sha256: "e7ab773b39220851de32dd949cd2d875f9acc49914401b729a0bea0fff9027b4", embedded: ["typescript", "css", "javascript"] }, "es-tag-glsl": { sha256: "f7475721a2c19e907b97146ef9153ecba8fc948432e0ec203539ca9b6a0288ed", embedded: ["typescript", "glsl", "javascript"] }, "es-tag-html": { sha256: "e5e5d8b20bc4ac5a022f3cd541d6ca4de49867e9b845fb8e0db7fc84f5009107", embedded: ["typescript", "html", "javascript"] }, "es-tag-sql": { sha256: "dbf6329640c027e24a918c76a45463185230b0d7b690352a437d0bd6a15a22a0", embedded: ["typescript", "sql"] }, "es-tag-xml": { sha256: "ee89cadce96b92902cf8bd25ca50c26d0b1db92636c76365504433c6b2a96db9", embedded: ["xml"] }, "jinja-html": { sha256: "6e2c5dff69a40d21cecc2dda253bd453fb96e9d1259294fa1a0052978e429632", embedded: ["html"] }, "markdown-nix": { sha256: "3112dca736910793b9fbe583de8d0159873d3b96fa78f766b43db2fbc2d62199" }, "markdown-vue": { sha256: "90267df7bb8adc7cc8a9e9dc379f3b7e53f4f5547c80c534c64cb613a05355c2" }, "vue-directives": { sha256: "9bb72cafd98da0395423779319c2bb696063c30dd4cbd2219d30db1be3d86593" }, "vue-interpolations": { sha256: "2397d16983e9cc60afcb239833b5ed35c9e48369d435642eff0fc3e64235465e" }, "vue-sfc-style-variable-injection": { sha256: "4cf171a65bc6c036ed0d26c7c36c3984a33a57ee9aa6d492905aac21dbc2fa0b", embedded: ["javascript"] } } };
  }
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/graceful-fs/polyfills.js"(exports, module) {
    init_define_GRAMMARS();
    var constants = __require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module.exports = patch;
    function patch(fs13) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs13);
      }
      if (!fs13.lutimes) {
        patchLutimes(fs13);
      }
      fs13.chown = chownFix(fs13.chown);
      fs13.fchown = chownFix(fs13.fchown);
      fs13.lchown = chownFix(fs13.lchown);
      fs13.chmod = chmodFix(fs13.chmod);
      fs13.fchmod = chmodFix(fs13.fchmod);
      fs13.lchmod = chmodFix(fs13.lchmod);
      fs13.chownSync = chownFixSync(fs13.chownSync);
      fs13.fchownSync = chownFixSync(fs13.fchownSync);
      fs13.lchownSync = chownFixSync(fs13.lchownSync);
      fs13.chmodSync = chmodFixSync(fs13.chmodSync);
      fs13.fchmodSync = chmodFixSync(fs13.fchmodSync);
      fs13.lchmodSync = chmodFixSync(fs13.lchmodSync);
      fs13.stat = statFix(fs13.stat);
      fs13.fstat = statFix(fs13.fstat);
      fs13.lstat = statFix(fs13.lstat);
      fs13.statSync = statFixSync(fs13.statSync);
      fs13.fstatSync = statFixSync(fs13.fstatSync);
      fs13.lstatSync = statFixSync(fs13.lstatSync);
      if (fs13.chmod && !fs13.lchmod) {
        fs13.lchmod = function(path14, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs13.lchmodSync = function() {
        };
      }
      if (fs13.chown && !fs13.lchown) {
        fs13.lchown = function(path14, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs13.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs13.rename = typeof fs13.rename !== "function" ? fs13.rename : (function(fs$rename) {
          function rename(from, to, cb) {
            var start3 = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start3 < 6e4) {
                setTimeout(function() {
                  fs13.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb) cb(er);
            });
          }
          if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
          return rename;
        })(fs13.rename);
      }
      fs13.read = typeof fs13.read !== "function" ? fs13.read : (function(fs$read) {
        function read2(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs13, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs13, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read2, fs$read);
        return read2;
      })(fs13.read);
      fs13.readSync = typeof fs13.readSync !== "function" ? fs13.readSync : /* @__PURE__ */ (function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs13, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      })(fs13.readSync);
      function patchLchmod(fs14) {
        fs14.lchmod = function(path14, mode, callback) {
          fs14.open(
            path14,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback) callback(err);
                return;
              }
              fs14.fchmod(fd, mode, function(err2) {
                fs14.close(fd, function(err22) {
                  if (callback) callback(err2 || err22);
                });
              });
            }
          );
        };
        fs14.lchmodSync = function(path14, mode) {
          var fd = fs14.openSync(path14, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs14.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs14.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs14.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs14) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs14.futimes) {
          fs14.lutimes = function(path14, at, mt, cb) {
            fs14.open(path14, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs14.futimes(fd, at, mt, function(er2) {
                fs14.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs14.lutimesSync = function(path14, at, mt) {
            var fd = fs14.openSync(path14, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs14.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs14.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs14.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs14.futimes) {
          fs14.lutimes = function(_a, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs14.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
          return orig.call(fs13, target, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
          try {
            return orig.call(fs13, target, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs13, target, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs13, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig) return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0) stats.uid += 4294967296;
              if (stats.gid < 0) stats.gid += 4294967296;
            }
            if (cb) cb.apply(this, arguments);
          }
          return options ? orig.call(fs13, target, options, callback) : orig.call(fs13, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs13, target, options) : orig.call(fs13, target);
          if (stats) {
            if (stats.uid < 0) stats.uid += 4294967296;
            if (stats.gid < 0) stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/graceful-fs/legacy-streams.js"(exports, module) {
    init_define_GRAMMARS();
    var Stream = __require("stream").Stream;
    module.exports = legacy;
    function legacy(fs13) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path14, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path14, options);
        Stream.call(this);
        var self = this;
        this.path = path14;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key2 = keys[index];
          this[key2] = options[key2];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self._read();
          });
          return;
        }
        fs13.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self.emit("error", err);
            self.readable = false;
            return;
          }
          self.fd = fd;
          self.emit("open", fd);
          self._read();
        });
      }
      function WriteStream(path14, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path14, options);
        Stream.call(this);
        this.path = path14;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key2 = keys[index];
          this[key2] = options[key2];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs13.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/graceful-fs/clone.js"(exports, module) {
    "use strict";
    init_define_GRAMMARS();
    module.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key2) {
        Object.defineProperty(copy, key2, Object.getOwnPropertyDescriptor(obj, key2));
      });
      return copy;
    }
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/graceful-fs/graceful-fs.js"(exports, module) {
    init_define_GRAMMARS();
    var fs13 = __require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = __require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = /* @__PURE__ */ Symbol.for("graceful-fs.queue");
      previousSymbol = /* @__PURE__ */ Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs13[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs13, queue);
      fs13.close = (function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs13, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      })(fs13.close);
      fs13.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs13, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      })(fs13.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs13[gracefulQueue]);
          __require("assert").equal(fs13[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs13[gracefulQueue]);
    }
    module.exports = patch(clone(fs13));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs13.__patched) {
      module.exports = patch(fs13);
      fs13.__patched = true;
    }
    function patch(fs14) {
      polyfills(fs14);
      fs14.gracefulify = patch;
      fs14.createReadStream = createReadStream;
      fs14.createWriteStream = createWriteStream;
      var fs$readFile = fs14.readFile;
      fs14.readFile = readFile;
      function readFile(path14, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path14, options, cb);
        function go$readFile(path15, options2, cb2, startTime) {
          return fs$readFile(path15, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path15, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs14.writeFile;
      fs14.writeFile = writeFile;
      function writeFile(path14, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path14, data, options, cb);
        function go$writeFile(path15, data2, options2, cb2, startTime) {
          return fs$writeFile(path15, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path15, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs14.appendFile;
      if (fs$appendFile)
        fs14.appendFile = appendFile;
      function appendFile(path14, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path14, data, options, cb);
        function go$appendFile(path15, data2, options2, cb2, startTime) {
          return fs$appendFile(path15, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path15, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs14.copyFile;
      if (fs$copyFile)
        fs14.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs14.readdir;
      fs14.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path14, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path15, options2, cb2, startTime) {
          return fs$readdir(path15, fs$readdirCallback(
            path15,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path15, options2, cb2, startTime) {
          return fs$readdir(path15, options2, fs$readdirCallback(
            path15,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path14, options, cb);
        function fs$readdirCallback(path15, options2, cb2, startTime) {
          return function(err, files3) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path15, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files3 && files3.sort)
                files3.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files3);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs14);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs14.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs14.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs14, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs14, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs14, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs14, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path14, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open2(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path14, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open2(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path14, options) {
        return new fs14.ReadStream(path14, options);
      }
      function createWriteStream(path14, options) {
        return new fs14.WriteStream(path14, options);
      }
      var fs$open = fs14.open;
      fs14.open = open2;
      function open2(path14, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path14, flags, mode, cb);
        function go$open(path15, flags2, mode2, cb2, startTime) {
          return fs$open(path15, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path15, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs14;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs13[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs13[gracefulQueue].length; ++i) {
        if (fs13[gracefulQueue][i].length > 2) {
          fs13[gracefulQueue][i][3] = now;
          fs13[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs13[gracefulQueue].length === 0)
        return;
      var elem = fs13[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs13[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/retry/lib/retry_operation.js
var require_retry_operation = __commonJS({
  "node_modules/retry/lib/retry_operation.js"(exports, module) {
    init_define_GRAMMARS();
    function RetryOperation(timeouts, options) {
      if (typeof options === "boolean") {
        options = { forever: options };
      }
      this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
      this._timeouts = timeouts;
      this._options = options || {};
      this._maxRetryTime = options && options.maxRetryTime || Infinity;
      this._fn = null;
      this._errors = [];
      this._attempts = 1;
      this._operationTimeout = null;
      this._operationTimeoutCb = null;
      this._timeout = null;
      this._operationStart = null;
      if (this._options.forever) {
        this._cachedTimeouts = this._timeouts.slice(0);
      }
    }
    module.exports = RetryOperation;
    RetryOperation.prototype.reset = function() {
      this._attempts = 1;
      this._timeouts = this._originalTimeouts;
    };
    RetryOperation.prototype.stop = function() {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      this._timeouts = [];
      this._cachedTimeouts = null;
    };
    RetryOperation.prototype.retry = function(err) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      if (!err) {
        return false;
      }
      var currentTime = (/* @__PURE__ */ new Date()).getTime();
      if (err && currentTime - this._operationStart >= this._maxRetryTime) {
        this._errors.unshift(new Error("RetryOperation timeout occurred"));
        return false;
      }
      this._errors.push(err);
      var timeout = this._timeouts.shift();
      if (timeout === void 0) {
        if (this._cachedTimeouts) {
          this._errors.splice(this._errors.length - 1, this._errors.length);
          this._timeouts = this._cachedTimeouts.slice(0);
          timeout = this._timeouts.shift();
        } else {
          return false;
        }
      }
      var self = this;
      var timer = setTimeout(function() {
        self._attempts++;
        if (self._operationTimeoutCb) {
          self._timeout = setTimeout(function() {
            self._operationTimeoutCb(self._attempts);
          }, self._operationTimeout);
          if (self._options.unref) {
            self._timeout.unref();
          }
        }
        self._fn(self._attempts);
      }, timeout);
      if (this._options.unref) {
        timer.unref();
      }
      return true;
    };
    RetryOperation.prototype.attempt = function(fn, timeoutOps) {
      this._fn = fn;
      if (timeoutOps) {
        if (timeoutOps.timeout) {
          this._operationTimeout = timeoutOps.timeout;
        }
        if (timeoutOps.cb) {
          this._operationTimeoutCb = timeoutOps.cb;
        }
      }
      var self = this;
      if (this._operationTimeoutCb) {
        this._timeout = setTimeout(function() {
          self._operationTimeoutCb();
        }, self._operationTimeout);
      }
      this._operationStart = (/* @__PURE__ */ new Date()).getTime();
      this._fn(this._attempts);
    };
    RetryOperation.prototype.try = function(fn) {
      console.log("Using RetryOperation.try() is deprecated");
      this.attempt(fn);
    };
    RetryOperation.prototype.start = function(fn) {
      console.log("Using RetryOperation.start() is deprecated");
      this.attempt(fn);
    };
    RetryOperation.prototype.start = RetryOperation.prototype.try;
    RetryOperation.prototype.errors = function() {
      return this._errors;
    };
    RetryOperation.prototype.attempts = function() {
      return this._attempts;
    };
    RetryOperation.prototype.mainError = function() {
      if (this._errors.length === 0) {
        return null;
      }
      var counts = {};
      var mainError = null;
      var mainErrorCount = 0;
      for (var i = 0; i < this._errors.length; i++) {
        var error = this._errors[i];
        var message = error.message;
        var count = (counts[message] || 0) + 1;
        counts[message] = count;
        if (count >= mainErrorCount) {
          mainError = error;
          mainErrorCount = count;
        }
      }
      return mainError;
    };
  }
});

// node_modules/retry/lib/retry.js
var require_retry = __commonJS({
  "node_modules/retry/lib/retry.js"(exports) {
    init_define_GRAMMARS();
    var RetryOperation = require_retry_operation();
    exports.operation = function(options) {
      var timeouts = exports.timeouts(options);
      return new RetryOperation(timeouts, {
        forever: options && options.forever,
        unref: options && options.unref,
        maxRetryTime: options && options.maxRetryTime
      });
    };
    exports.timeouts = function(options) {
      if (options instanceof Array) {
        return [].concat(options);
      }
      var opts = {
        retries: 10,
        factor: 2,
        minTimeout: 1 * 1e3,
        maxTimeout: Infinity,
        randomize: false
      };
      for (var key2 in options) {
        opts[key2] = options[key2];
      }
      if (opts.minTimeout > opts.maxTimeout) {
        throw new Error("minTimeout is greater than maxTimeout");
      }
      var timeouts = [];
      for (var i = 0; i < opts.retries; i++) {
        timeouts.push(this.createTimeout(i, opts));
      }
      if (options && options.forever && !timeouts.length) {
        timeouts.push(this.createTimeout(i, opts));
      }
      timeouts.sort(function(a, b) {
        return a - b;
      });
      return timeouts;
    };
    exports.createTimeout = function(attempt, opts) {
      var random = opts.randomize ? Math.random() + 1 : 1;
      var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
      timeout = Math.min(timeout, opts.maxTimeout);
      return timeout;
    };
    exports.wrap = function(obj, options, methods2) {
      if (options instanceof Array) {
        methods2 = options;
        options = null;
      }
      if (!methods2) {
        methods2 = [];
        for (var key2 in obj) {
          if (typeof obj[key2] === "function") {
            methods2.push(key2);
          }
        }
      }
      for (var i = 0; i < methods2.length; i++) {
        var method = methods2[i];
        var original = obj[method];
        obj[method] = function retryWrapper(original2) {
          var op = exports.operation(options);
          var args = Array.prototype.slice.call(arguments, 1);
          var callback = args.pop();
          args.push(function(err) {
            if (op.retry(err)) {
              return;
            }
            if (err) {
              arguments[0] = op.mainError();
            }
            callback.apply(this, arguments);
          });
          op.attempt(function() {
            original2.apply(obj, args);
          });
        }.bind(obj, original);
        obj[method].options = options;
      }
    };
  }
});

// node_modules/retry/index.js
var require_retry2 = __commonJS({
  "node_modules/retry/index.js"(exports, module) {
    init_define_GRAMMARS();
    module.exports = require_retry();
  }
});

// node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "node_modules/signal-exit/signals.js"(exports, module) {
    init_define_GRAMMARS();
    module.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      module.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/signal-exit/index.js"(exports, module) {
    init_define_GRAMMARS();
    var process2 = global.process;
    var processOk = function(process3) {
      return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
    };
    if (!processOk(process2)) {
      module.exports = function() {
        return function() {
        };
      };
    } else {
      assert = __require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process2.platform);
      EE = __require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process2.__signal_exit_emitter__) {
        emitter = process2.__signal_exit_emitter__;
      } else {
        emitter = process2.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove2 = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove2;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process2.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process2.emit = originalProcessEmit;
        process2.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module.exports.unload = unload;
      emit = function emit2(event, code2, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code2, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process2.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process2.kill(process2.pid, sig);
          }
        };
      });
      module.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process2.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process2.emit = processEmit;
        process2.reallyExit = processReallyExit;
      };
      module.exports.load = load;
      originalProcessReallyExit = process2.reallyExit;
      processReallyExit = function processReallyExit2(code2) {
        if (!processOk(global.process)) {
          return;
        }
        process2.exitCode = code2 || /* istanbul ignore next */
        0;
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        originalProcessReallyExit.call(process2, process2.exitCode);
      };
      originalProcessEmit = process2.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process2.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/proper-lockfile/lib/mtime-precision.js
var require_mtime_precision = __commonJS({
  "node_modules/proper-lockfile/lib/mtime-precision.js"(exports, module) {
    "use strict";
    init_define_GRAMMARS();
    var cacheSymbol = /* @__PURE__ */ Symbol();
    function probe(file2, fs13, callback) {
      const cachedPrecision = fs13[cacheSymbol];
      if (cachedPrecision) {
        return fs13.stat(file2, (err, stat) => {
          if (err) {
            return callback(err);
          }
          callback(null, stat.mtime, cachedPrecision);
        });
      }
      const mtime = new Date(Math.ceil(Date.now() / 1e3) * 1e3 + 5);
      fs13.utimes(file2, mtime, mtime, (err) => {
        if (err) {
          return callback(err);
        }
        fs13.stat(file2, (err2, stat) => {
          if (err2) {
            return callback(err2);
          }
          const precision = stat.mtime.getTime() % 1e3 === 0 ? "s" : "ms";
          Object.defineProperty(fs13, cacheSymbol, { value: precision });
          callback(null, stat.mtime, precision);
        });
      });
    }
    function getMtime(precision) {
      let now = Date.now();
      if (precision === "s") {
        now = Math.ceil(now / 1e3) * 1e3;
      }
      return new Date(now);
    }
    module.exports.probe = probe;
    module.exports.getMtime = getMtime;
  }
});

// node_modules/proper-lockfile/lib/lockfile.js
var require_lockfile = __commonJS({
  "node_modules/proper-lockfile/lib/lockfile.js"(exports, module) {
    "use strict";
    init_define_GRAMMARS();
    var path14 = __require("path");
    var fs13 = require_graceful_fs();
    var retry = require_retry2();
    var onExit = require_signal_exit();
    var mtimePrecision = require_mtime_precision();
    var locks = {};
    function getLockFile(file2, options) {
      return options.lockfilePath || `${file2}.lock`;
    }
    function resolveCanonicalPath(file2, options, callback) {
      if (!options.realpath) {
        return callback(null, path14.resolve(file2));
      }
      options.fs.realpath(file2, callback);
    }
    function acquireLock(file2, options, callback) {
      const lockfilePath = getLockFile(file2, options);
      options.fs.mkdir(lockfilePath, (err) => {
        if (!err) {
          return mtimePrecision.probe(lockfilePath, options.fs, (err2, mtime, mtimePrecision2) => {
            if (err2) {
              options.fs.rmdir(lockfilePath, () => {
              });
              return callback(err2);
            }
            callback(null, mtime, mtimePrecision2);
          });
        }
        if (err.code !== "EEXIST") {
          return callback(err);
        }
        if (options.stale <= 0) {
          return callback(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file: file2 }));
        }
        options.fs.stat(lockfilePath, (err2, stat) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return acquireLock(file2, { ...options, stale: 0 }, callback);
            }
            return callback(err2);
          }
          if (!isLockStale(stat, options)) {
            return callback(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file: file2 }));
          }
          removeLock(file2, options, (err3) => {
            if (err3) {
              return callback(err3);
            }
            acquireLock(file2, { ...options, stale: 0 }, callback);
          });
        });
      });
    }
    function isLockStale(stat, options) {
      return stat.mtime.getTime() < Date.now() - options.stale;
    }
    function removeLock(file2, options, callback) {
      options.fs.rmdir(getLockFile(file2, options), (err) => {
        if (err && err.code !== "ENOENT") {
          return callback(err);
        }
        callback();
      });
    }
    function updateLock(file2, options) {
      const lock3 = locks[file2];
      if (lock3.updateTimeout) {
        return;
      }
      lock3.updateDelay = lock3.updateDelay || options.update;
      lock3.updateTimeout = setTimeout(() => {
        lock3.updateTimeout = null;
        options.fs.stat(lock3.lockfilePath, (err, stat) => {
          const isOverThreshold = lock3.lastUpdate + options.stale < Date.now();
          if (err) {
            if (err.code === "ENOENT" || isOverThreshold) {
              return setLockAsCompromised(file2, lock3, Object.assign(err, { code: "ECOMPROMISED" }));
            }
            lock3.updateDelay = 1e3;
            return updateLock(file2, options);
          }
          const isMtimeOurs = lock3.mtime.getTime() === stat.mtime.getTime();
          if (!isMtimeOurs) {
            return setLockAsCompromised(
              file2,
              lock3,
              Object.assign(
                new Error("Unable to update lock within the stale threshold"),
                { code: "ECOMPROMISED" }
              )
            );
          }
          const mtime = mtimePrecision.getMtime(lock3.mtimePrecision);
          options.fs.utimes(lock3.lockfilePath, mtime, mtime, (err2) => {
            const isOverThreshold2 = lock3.lastUpdate + options.stale < Date.now();
            if (lock3.released) {
              return;
            }
            if (err2) {
              if (err2.code === "ENOENT" || isOverThreshold2) {
                return setLockAsCompromised(file2, lock3, Object.assign(err2, { code: "ECOMPROMISED" }));
              }
              lock3.updateDelay = 1e3;
              return updateLock(file2, options);
            }
            lock3.mtime = mtime;
            lock3.lastUpdate = Date.now();
            lock3.updateDelay = null;
            updateLock(file2, options);
          });
        });
      }, lock3.updateDelay);
      if (lock3.updateTimeout.unref) {
        lock3.updateTimeout.unref();
      }
    }
    function setLockAsCompromised(file2, lock3, err) {
      lock3.released = true;
      if (lock3.updateTimeout) {
        clearTimeout(lock3.updateTimeout);
      }
      if (locks[file2] === lock3) {
        delete locks[file2];
      }
      lock3.options.onCompromised(err);
    }
    function lock2(file2, options, callback) {
      options = {
        stale: 1e4,
        update: null,
        realpath: true,
        retries: 0,
        fs: fs13,
        onCompromised: (err) => {
          throw err;
        },
        ...options
      };
      options.retries = options.retries || 0;
      options.retries = typeof options.retries === "number" ? { retries: options.retries } : options.retries;
      options.stale = Math.max(options.stale || 0, 2e3);
      options.update = options.update == null ? options.stale / 2 : options.update || 0;
      options.update = Math.max(Math.min(options.update, options.stale / 2), 1e3);
      resolveCanonicalPath(file2, options, (err, file3) => {
        if (err) {
          return callback(err);
        }
        const operation = retry.operation(options.retries);
        operation.attempt(() => {
          acquireLock(file3, options, (err2, mtime, mtimePrecision2) => {
            if (operation.retry(err2)) {
              return;
            }
            if (err2) {
              return callback(operation.mainError());
            }
            const lock3 = locks[file3] = {
              lockfilePath: getLockFile(file3, options),
              mtime,
              mtimePrecision: mtimePrecision2,
              options,
              lastUpdate: Date.now()
            };
            updateLock(file3, options);
            callback(null, (releasedCallback) => {
              if (lock3.released) {
                return releasedCallback && releasedCallback(Object.assign(new Error("Lock is already released"), { code: "ERELEASED" }));
              }
              unlock(file3, { ...options, realpath: false }, releasedCallback);
            });
          });
        });
      });
    }
    function unlock(file2, options, callback) {
      options = {
        fs: fs13,
        realpath: true,
        ...options
      };
      resolveCanonicalPath(file2, options, (err, file3) => {
        if (err) {
          return callback(err);
        }
        const lock3 = locks[file3];
        if (!lock3) {
          return callback(Object.assign(new Error("Lock is not acquired/owned by you"), { code: "ENOTACQUIRED" }));
        }
        lock3.updateTimeout && clearTimeout(lock3.updateTimeout);
        lock3.released = true;
        delete locks[file3];
        removeLock(file3, options, callback);
      });
    }
    function check(file2, options, callback) {
      options = {
        stale: 1e4,
        realpath: true,
        fs: fs13,
        ...options
      };
      options.stale = Math.max(options.stale || 0, 2e3);
      resolveCanonicalPath(file2, options, (err, file3) => {
        if (err) {
          return callback(err);
        }
        options.fs.stat(getLockFile(file3, options), (err2, stat) => {
          if (err2) {
            return err2.code === "ENOENT" ? callback(null, false) : callback(err2);
          }
          return callback(null, !isLockStale(stat, options));
        });
      });
    }
    function getLocks() {
      return locks;
    }
    onExit(() => {
      for (const file2 in locks) {
        const options = locks[file2].options;
        try {
          options.fs.rmdirSync(getLockFile(file2, options));
        } catch (e) {
        }
      }
    });
    module.exports.lock = lock2;
    module.exports.unlock = unlock;
    module.exports.check = check;
    module.exports.getLocks = getLocks;
  }
});

// node_modules/proper-lockfile/lib/adapter.js
var require_adapter = __commonJS({
  "node_modules/proper-lockfile/lib/adapter.js"(exports, module) {
    "use strict";
    init_define_GRAMMARS();
    var fs13 = require_graceful_fs();
    function createSyncFs(fs14) {
      const methods2 = ["mkdir", "realpath", "stat", "rmdir", "utimes"];
      const newFs = { ...fs14 };
      methods2.forEach((method) => {
        newFs[method] = (...args) => {
          const callback = args.pop();
          let ret;
          try {
            ret = fs14[`${method}Sync`](...args);
          } catch (err) {
            return callback(err);
          }
          callback(null, ret);
        };
      });
      return newFs;
    }
    function toPromise(method) {
      return (...args) => new Promise((resolve2, reject) => {
        args.push((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve2(result);
          }
        });
        method(...args);
      });
    }
    function toSync(method) {
      return (...args) => {
        let err;
        let result;
        args.push((_err, _result) => {
          err = _err;
          result = _result;
        });
        method(...args);
        if (err) {
          throw err;
        }
        return result;
      };
    }
    function toSyncOptions(options) {
      options = { ...options };
      options.fs = createSyncFs(options.fs || fs13);
      if (typeof options.retries === "number" && options.retries > 0 || options.retries && typeof options.retries.retries === "number" && options.retries.retries > 0) {
        throw Object.assign(new Error("Cannot use retries with the sync api"), { code: "ESYNC" });
      }
      return options;
    }
    module.exports = {
      toPromise,
      toSync,
      toSyncOptions
    };
  }
});

// node_modules/proper-lockfile/index.js
var require_proper_lockfile = __commonJS({
  "node_modules/proper-lockfile/index.js"(exports, module) {
    "use strict";
    init_define_GRAMMARS();
    var lockfile = require_lockfile();
    var { toPromise, toSync, toSyncOptions } = require_adapter();
    async function lock2(file2, options) {
      const release = await toPromise(lockfile.lock)(file2, options);
      return toPromise(release);
    }
    function lockSync(file2, options) {
      const release = toSync(lockfile.lock)(file2, toSyncOptions(options));
      return toSync(release);
    }
    function unlock(file2, options) {
      return toPromise(lockfile.unlock)(file2, options);
    }
    function unlockSync(file2, options) {
      return toSync(lockfile.unlock)(file2, toSyncOptions(options));
    }
    function check(file2, options) {
      return toPromise(lockfile.check)(file2, options);
    }
    function checkSync(file2, options) {
      return toSync(lockfile.check)(file2, toSyncOptions(options));
    }
    module.exports = lock2;
    module.exports.lock = lock2;
    module.exports.unlock = unlock;
    module.exports.lockSync = lockSync;
    module.exports.unlockSync = unlockSync;
    module.exports.check = check;
    module.exports.checkSync = checkSync;
  }
});

// node_modules/punycode.js/punycode.js
var require_punycode = __commonJS({
  "node_modules/punycode.js/punycode.js"(exports, module) {
    "use strict";
    init_define_GRAMMARS();
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
    var encode3 = function(input) {
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
        return regexNonASCII.test(string) ? "xn--" + encode3(string) : string;
      });
    };
    var punycode2 = {
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
      "encode": encode3,
      "toASCII": toASCII,
      "toUnicode": toUnicode
    };
    module.exports = punycode2;
  }
});

// node_modules/diff2html/lib/types.js
var require_types = __commonJS({
  "node_modules/diff2html/lib/types.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ColorSchemeType = exports.DiffStyleType = exports.LineMatchingType = exports.OutputFormatType = exports.LineType = void 0;
    var LineType2;
    (function(LineType3) {
      LineType3["INSERT"] = "insert";
      LineType3["DELETE"] = "delete";
      LineType3["CONTEXT"] = "context";
    })(LineType2 || (exports.LineType = LineType2 = {}));
    exports.OutputFormatType = {
      LINE_BY_LINE: "line-by-line",
      SIDE_BY_SIDE: "side-by-side"
    };
    exports.LineMatchingType = {
      LINES: "lines",
      WORDS: "words",
      NONE: "none"
    };
    exports.DiffStyleType = {
      WORD: "word",
      CHAR: "char"
    };
    var ColorSchemeType2;
    (function(ColorSchemeType3) {
      ColorSchemeType3["AUTO"] = "auto";
      ColorSchemeType3["DARK"] = "dark";
      ColorSchemeType3["LIGHT"] = "light";
    })(ColorSchemeType2 || (exports.ColorSchemeType = ColorSchemeType2 = {}));
  }
});

// node_modules/diff2html/lib/utils.js
var require_utils = __commonJS({
  "node_modules/diff2html/lib/utils.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeForRegExp = escapeForRegExp2;
    exports.unifyPath = unifyPath;
    exports.hashCode = hashCode;
    exports.max = max;
    var specials2 = [
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
    var regex2 = RegExp("[" + specials2.join("\\") + "]", "g");
    function escapeForRegExp2(str) {
      return str.replace(regex2, "\\$&");
    }
    function unifyPath(path14) {
      return path14 ? path14.replace(/\\/g, "/") : path14;
    }
    function hashCode(text2) {
      let i, chr, len;
      let hash2 = 0;
      for (i = 0, len = text2.length; i < len; i++) {
        chr = text2.charCodeAt(i);
        hash2 = (hash2 << 5) - hash2 + chr;
        hash2 |= 0;
      }
      return hash2;
    }
    function max(arr) {
      const length = arr.length;
      let max2 = -Infinity;
      for (let i = 0; i < length; i++) {
        max2 = Math.max(max2, arr[i]);
      }
      return max2;
    }
  }
});

// node_modules/diff2html/lib/diff-parser.js
var require_diff_parser = __commonJS({
  "node_modules/diff2html/lib/diff-parser.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse2;
    var types_1 = require_types();
    var utils_1 = require_utils();
    function getExtension2(filename, language) {
      const filenameParts = filename.split(".");
      return filenameParts.length > 1 ? filenameParts[filenameParts.length - 1] : language;
    }
    function startsWithAny2(str, prefixes) {
      return prefixes.reduce((startsWith, prefix) => startsWith || str.startsWith(prefix), false);
    }
    var baseDiffFilenamePrefixes2 = ["a/", "b/", "i/", "w/", "c/", "o/"];
    function getFilename2(line, linePrefix, extraPrefix) {
      const prefixes = extraPrefix !== void 0 ? [...baseDiffFilenamePrefixes2, extraPrefix] : baseDiffFilenamePrefixes2;
      const FilenameRegExp = linePrefix ? new RegExp(`^${(0, utils_1.escapeForRegExp)(linePrefix)} "?(.+?)"?$`) : new RegExp('^"?(.+?)"?$');
      const [, filename = ""] = FilenameRegExp.exec(line) || [];
      const matchingPrefix = prefixes.find((p) => filename.indexOf(p) === 0);
      const fnameWithoutPrefix = matchingPrefix ? filename.slice(matchingPrefix.length) : filename;
      return fnameWithoutPrefix.replace(/\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)? [+-]\d{4}.*$/, "");
    }
    function getSrcFilename2(line, srcPrefix) {
      return getFilename2(line, "---", srcPrefix);
    }
    function getDstFilename2(line, dstPrefix) {
      return getFilename2(line, "+++", dstPrefix);
    }
    function parse2(diffInput, config2 = {}) {
      const files3 = [];
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
            files3.push(currentFile);
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
      function startBlock(line) {
        saveBlock();
        let values;
        if (currentFile !== null) {
          if (values = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/.exec(line)) {
            currentFile.isCombined = false;
            oldLine = parseInt(values[1], 10);
            newLine = parseInt(values[2], 10);
          } else if (values = /^@@@ -(\d+)(?:,\d+)? -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@@.*/.exec(line)) {
            currentFile.isCombined = true;
            oldLine = parseInt(values[1], 10);
            oldLine2 = parseInt(values[2], 10);
            newLine = parseInt(values[3], 10);
          } else {
            if (line.startsWith(hunkHeaderPrefix)) {
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
          header: line
        };
      }
      function createLine(line) {
        if (currentFile === null || currentBlock === null || oldLine === null || newLine === null)
          return;
        const currentLine = {
          content: line
        };
        const addedPrefixes = currentFile.isCombined ? ["+ ", " +", "++"] : ["+"];
        const deletedPrefixes = currentFile.isCombined ? ["- ", " -", "--"] : ["-"];
        if (startsWithAny2(line, addedPrefixes)) {
          currentFile.addedLines++;
          currentLine.type = types_1.LineType.INSERT;
          currentLine.oldNumber = void 0;
          currentLine.newNumber = newLine++;
        } else if (startsWithAny2(line, deletedPrefixes)) {
          currentFile.deletedLines++;
          currentLine.type = types_1.LineType.DELETE;
          currentLine.oldNumber = oldLine++;
          currentLine.newNumber = void 0;
        } else {
          currentLine.type = types_1.LineType.CONTEXT;
          currentLine.oldNumber = oldLine++;
          currentLine.newNumber = newLine++;
        }
        currentBlock.lines.push(currentLine);
      }
      function existHunkHeader(line, lineIdx) {
        let idx = lineIdx;
        while (idx < diffLines.length - 3) {
          if (line.startsWith("diff")) {
            return false;
          }
          if (diffLines[idx].startsWith(oldFileNameHeader) && diffLines[idx + 1].startsWith(newFileNameHeader) && diffLines[idx + 2].startsWith(hunkHeaderPrefix)) {
            return true;
          }
          idx++;
        }
        return false;
      }
      diffLines.forEach((line, lineIndex) => {
        if (!line || line.startsWith("*")) {
          return;
        }
        let values;
        const prevLine = diffLines[lineIndex - 1];
        const nxtLine = diffLines[lineIndex + 1];
        const afterNxtLine = diffLines[lineIndex + 2];
        if (line.startsWith("diff --git") || line.startsWith("diff --combined")) {
          startFile();
          const gitDiffStart = /^diff --git "?([a-ciow]\/.+)"? "?([a-ciow]\/.+)"?/;
          if (values = gitDiffStart.exec(line)) {
            possibleOldName = getFilename2(values[1], void 0, config2.dstPrefix);
            possibleNewName = getFilename2(values[2], void 0, config2.srcPrefix);
          }
          if (currentFile === null) {
            throw new Error("Where is my file !!!");
          }
          currentFile.isGitDiff = true;
          return;
        }
        if (line.startsWith("Binary files") && !(currentFile === null || currentFile === void 0 ? void 0 : currentFile.isGitDiff)) {
          startFile();
          const unixDiffBinaryStart = /^Binary files "?([a-ciow]\/.+)"? and "?([a-ciow]\/.+)"? differ/;
          if (values = unixDiffBinaryStart.exec(line)) {
            possibleOldName = getFilename2(values[1], void 0, config2.dstPrefix);
            possibleNewName = getFilename2(values[2], void 0, config2.srcPrefix);
          }
          if (currentFile === null) {
            throw new Error("Where is my file !!!");
          }
          currentFile.isBinary = true;
          return;
        }
        if (!currentFile || !currentFile.isGitDiff && currentFile && line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) && afterNxtLine.startsWith(hunkHeaderPrefix)) {
          startFile();
        }
        if (currentFile === null || currentFile === void 0 ? void 0 : currentFile.isTooBig) {
          return;
        }
        if (currentFile && (typeof config2.diffMaxChanges === "number" && currentFile.addedLines + currentFile.deletedLines > config2.diffMaxChanges || typeof config2.diffMaxLineLength === "number" && line.length > config2.diffMaxLineLength)) {
          currentFile.isTooBig = true;
          currentFile.addedLines = 0;
          currentFile.deletedLines = 0;
          currentFile.blocks = [];
          currentBlock = null;
          const message = typeof config2.diffTooBigMessage === "function" ? config2.diffTooBigMessage(files3.length) : "Diff too big to be displayed";
          startBlock(message);
          return;
        }
        if (line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) || line.startsWith(newFileNameHeader) && prevLine.startsWith(oldFileNameHeader)) {
          if (currentFile && !currentFile.oldName && line.startsWith("--- ") && (values = getSrcFilename2(line, config2.srcPrefix))) {
            currentFile.oldName = values;
            currentFile.language = getExtension2(currentFile.oldName, currentFile.language);
            return;
          }
          if (currentFile && !currentFile.newName && line.startsWith("+++ ") && (values = getDstFilename2(line, config2.dstPrefix))) {
            currentFile.newName = values;
            currentFile.language = getExtension2(currentFile.newName, currentFile.language);
            return;
          }
        }
        if (currentFile && (line.startsWith(hunkHeaderPrefix) || currentFile.isGitDiff && currentFile.oldName && currentFile.newName && !currentBlock)) {
          startBlock(line);
          return;
        }
        if (currentBlock && (line.startsWith("+") || line.startsWith("-") || line.startsWith(" "))) {
          createLine(line);
          return;
        }
        const doesNotExistHunkHeader = !existHunkHeader(line, lineIndex);
        if (currentFile === null) {
          throw new Error("Where is my file !!!");
        }
        if (values = oldMode.exec(line)) {
          currentFile.oldMode = values[1];
        } else if (values = newMode.exec(line)) {
          currentFile.newMode = values[1];
        } else if (values = deletedFileMode.exec(line)) {
          currentFile.deletedFileMode = values[1];
          currentFile.isDeleted = true;
        } else if (values = newFileMode.exec(line)) {
          currentFile.newFileMode = values[1];
          currentFile.isNew = true;
        } else if (values = copyFrom.exec(line)) {
          if (doesNotExistHunkHeader) {
            currentFile.oldName = values[1];
          }
          currentFile.isCopy = true;
        } else if (values = copyTo.exec(line)) {
          if (doesNotExistHunkHeader) {
            currentFile.newName = values[1];
          }
          currentFile.isCopy = true;
        } else if (values = renameFrom.exec(line)) {
          if (doesNotExistHunkHeader) {
            currentFile.oldName = values[1];
          }
          currentFile.isRename = true;
        } else if (values = renameTo.exec(line)) {
          if (doesNotExistHunkHeader) {
            currentFile.newName = values[1];
          }
          currentFile.isRename = true;
        } else if (values = binaryFiles.exec(line)) {
          currentFile.isBinary = true;
          currentFile.oldName = getFilename2(values[1], void 0, config2.srcPrefix);
          currentFile.newName = getFilename2(values[2], void 0, config2.dstPrefix);
          startBlock("Binary file");
        } else if (binaryDiff.test(line)) {
          currentFile.isBinary = true;
          startBlock(line);
        } else if (values = similarityIndex.exec(line)) {
          currentFile.unchangedPercentage = parseInt(values[1], 10);
        } else if (values = dissimilarityIndex.exec(line)) {
          currentFile.changedPercentage = parseInt(values[1], 10);
        } else if (values = index.exec(line)) {
          currentFile.checksumBefore = values[1];
          currentFile.checksumAfter = values[2];
          if (values[3])
            currentFile.mode = values[3];
        } else if (values = combinedIndex.exec(line)) {
          currentFile.checksumBefore = [values[2], values[3]];
          currentFile.checksumAfter = values[1];
        } else if (values = combinedMode.exec(line)) {
          currentFile.oldMode = [values[2], values[3]];
          currentFile.newMode = values[1];
        } else if (values = combinedNewFile.exec(line)) {
          currentFile.newFileMode = values[1];
          currentFile.isNew = true;
        } else if (values = combinedDeletedFile.exec(line)) {
          currentFile.deletedFileMode = values[1];
          currentFile.isDeleted = true;
        }
      });
      saveBlock();
      saveFile();
      return files3;
    }
  }
});

// node_modules/diff/libcjs/diff/base.js
var require_base = __commonJS({
  "node_modules/diff/libcjs/diff/base.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Diff = (
      /** @class */
      (function() {
        function Diff2() {
        }
        Diff2.prototype.diff = function(oldStr, newStr, options) {
          if (options === void 0) {
            options = {};
          }
          var callback;
          if (typeof options === "function") {
            callback = options;
            options = {};
          } else if ("callback" in options) {
            callback = options.callback;
          }
          var oldString = this.castInput(oldStr, options);
          var newString = this.castInput(newStr, options);
          var oldTokens = this.removeEmpty(this.tokenize(oldString, options));
          var newTokens = this.removeEmpty(this.tokenize(newString, options));
          return this.diffWithOptionsObj(oldTokens, newTokens, options, callback);
        };
        Diff2.prototype.diffWithOptionsObj = function(oldTokens, newTokens, options, callback) {
          var _this = this;
          var _a;
          var done = function(value) {
            value = _this.postProcess(value, options);
            if (callback) {
              setTimeout(function() {
                callback(value);
              }, 0);
              return void 0;
            } else {
              return value;
            }
          };
          var newLen = newTokens.length, oldLen = oldTokens.length;
          var editLength = 1;
          var maxEditLength = newLen + oldLen;
          if (options.maxEditLength != null) {
            maxEditLength = Math.min(maxEditLength, options.maxEditLength);
          }
          var maxExecutionTime = (_a = options.timeout) !== null && _a !== void 0 ? _a : Infinity;
          var abortAfterTimestamp = Date.now() + maxExecutionTime;
          var bestPath = [{ oldPos: -1, lastComponent: void 0 }];
          var newPos = this.extractCommon(bestPath[0], newTokens, oldTokens, 0, options);
          if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
            return done(this.buildValues(bestPath[0].lastComponent, newTokens, oldTokens));
          }
          var minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
          var execEditLength = function() {
            for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
              var basePath = void 0;
              var removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
              if (removePath) {
                bestPath[diagonalPath - 1] = void 0;
              }
              var canAdd = false;
              if (addPath) {
                var addPathNewPos = addPath.oldPos - diagonalPath;
                canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
              }
              var canRemove = removePath && removePath.oldPos + 1 < oldLen;
              if (!canAdd && !canRemove) {
                bestPath[diagonalPath] = void 0;
                continue;
              }
              if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
                basePath = _this.addToPath(addPath, true, false, 0, options);
              } else {
                basePath = _this.addToPath(removePath, false, true, 1, options);
              }
              newPos = _this.extractCommon(basePath, newTokens, oldTokens, diagonalPath, options);
              if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
                return done(_this.buildValues(basePath.lastComponent, newTokens, oldTokens)) || true;
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
              var ret = execEditLength();
              if (ret) {
                return ret;
              }
            }
          }
        };
        Diff2.prototype.addToPath = function(path14, added, removed, oldPosInc, options) {
          var last = path14.lastComponent;
          if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
            return {
              oldPos: path14.oldPos + oldPosInc,
              lastComponent: { count: last.count + 1, added, removed, previousComponent: last.previousComponent }
            };
          } else {
            return {
              oldPos: path14.oldPos + oldPosInc,
              lastComponent: { count: 1, added, removed, previousComponent: last }
            };
          }
        };
        Diff2.prototype.extractCommon = function(basePath, newTokens, oldTokens, diagonalPath, options) {
          var newLen = newTokens.length, oldLen = oldTokens.length;
          var oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
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
        };
        Diff2.prototype.equals = function(left, right, options) {
          if (options.comparator) {
            return options.comparator(left, right);
          } else {
            return left === right || !!options.ignoreCase && left.toLowerCase() === right.toLowerCase();
          }
        };
        Diff2.prototype.removeEmpty = function(array) {
          var ret = [];
          for (var i = 0; i < array.length; i++) {
            if (array[i]) {
              ret.push(array[i]);
            }
          }
          return ret;
        };
        Diff2.prototype.castInput = function(value, options) {
          return value;
        };
        Diff2.prototype.tokenize = function(value, options) {
          return Array.from(value);
        };
        Diff2.prototype.join = function(chars) {
          return chars.join("");
        };
        Diff2.prototype.postProcess = function(changeObjects, options) {
          return changeObjects;
        };
        Object.defineProperty(Diff2.prototype, "useLongestToken", {
          get: function() {
            return false;
          },
          enumerable: false,
          configurable: true
        });
        Diff2.prototype.buildValues = function(lastComponent, newTokens, oldTokens) {
          var components = [];
          var nextComponent;
          while (lastComponent) {
            components.push(lastComponent);
            nextComponent = lastComponent.previousComponent;
            delete lastComponent.previousComponent;
            lastComponent = nextComponent;
          }
          components.reverse();
          var componentLen = components.length;
          var componentPos = 0, newPos = 0, oldPos = 0;
          for (; componentPos < componentLen; componentPos++) {
            var component = components[componentPos];
            if (!component.removed) {
              if (!component.added && this.useLongestToken) {
                var value = newTokens.slice(newPos, newPos + component.count);
                value = value.map(function(value2, i) {
                  var oldValue = oldTokens[oldPos + i];
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
        };
        return Diff2;
      })()
    );
    exports.default = Diff;
  }
});

// node_modules/diff/libcjs/diff/character.js
var require_character = __commonJS({
  "node_modules/diff/libcjs/diff/character.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.characterDiff = void 0;
    exports.diffChars = diffChars;
    var base_js_1 = require_base();
    var CharacterDiff = (
      /** @class */
      (function(_super) {
        __extends(CharacterDiff2, _super);
        function CharacterDiff2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return CharacterDiff2;
      })(base_js_1.default)
    );
    exports.characterDiff = new CharacterDiff();
    function diffChars(oldStr, newStr, options) {
      return exports.characterDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/libcjs/util/string.js
var require_string = __commonJS({
  "node_modules/diff/libcjs/util/string.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.longestCommonPrefix = longestCommonPrefix;
    exports.longestCommonSuffix = longestCommonSuffix;
    exports.replacePrefix = replacePrefix;
    exports.replaceSuffix = replaceSuffix;
    exports.removePrefix = removePrefix;
    exports.removeSuffix = removeSuffix;
    exports.maximumOverlap = maximumOverlap;
    exports.hasOnlyWinLineEndings = hasOnlyWinLineEndings;
    exports.hasOnlyUnixLineEndings = hasOnlyUnixLineEndings;
    exports.segment = segment;
    exports.trailingWs = trailingWs;
    exports.leadingWs = leadingWs;
    exports.leadingAndTrailingWs = leadingAndTrailingWs;
    function longestCommonPrefix(str1, str2) {
      var i;
      for (i = 0; i < str1.length && i < str2.length; i++) {
        if (str1[i] != str2[i]) {
          return str1.slice(0, i);
        }
      }
      return str1.slice(0, i);
    }
    function longestCommonSuffix(str1, str2) {
      var i;
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
        throw Error("string ".concat(JSON.stringify(string), " doesn't start with prefix ").concat(JSON.stringify(oldPrefix), "; this is a bug"));
      }
      return newPrefix + string.slice(oldPrefix.length);
    }
    function replaceSuffix(string, oldSuffix, newSuffix) {
      if (!oldSuffix) {
        return string + newSuffix;
      }
      if (string.slice(-oldSuffix.length) != oldSuffix) {
        throw Error("string ".concat(JSON.stringify(string), " doesn't end with suffix ").concat(JSON.stringify(oldSuffix), "; this is a bug"));
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
      var startA = 0;
      if (a.length > b.length) {
        startA = a.length - b.length;
      }
      var endB = b.length;
      if (a.length < b.length) {
        endB = a.length;
      }
      var map = Array(endB);
      var k = 0;
      map[0] = 0;
      for (var j = 1; j < endB; j++) {
        if (b[j] == b[k]) {
          map[j] = map[k];
        } else {
          map[j] = k;
        }
        while (k > 0 && b[j] != b[k]) {
          k = map[k];
        }
        if (b[j] == b[k]) {
          k++;
        }
      }
      k = 0;
      for (var i = startA; i < a.length; i++) {
        while (k > 0 && a[i] != b[k]) {
          k = map[k];
        }
        if (a[i] == b[k]) {
          k++;
        }
      }
      return k;
    }
    function hasOnlyWinLineEndings(string) {
      return string.includes("\r\n") && !string.startsWith("\n") && !string.match(/[^\r]\n/);
    }
    function hasOnlyUnixLineEndings(string) {
      return !string.includes("\r\n") && string.includes("\n");
    }
    function segment(string, segmenter) {
      var parts = [];
      for (var _i = 0, _a = Array.from(segmenter.segment(string)); _i < _a.length; _i++) {
        var segmentObj = _a[_i];
        var segment_1 = segmentObj.segment;
        if (parts.length && /\s/.test(parts[parts.length - 1]) && /\s/.test(segment_1)) {
          parts[parts.length - 1] += segment_1;
        } else {
          parts.push(segment_1);
        }
      }
      return parts;
    }
    function trailingWs(string, segmenter) {
      if (segmenter) {
        return leadingAndTrailingWs(string, segmenter)[1];
      }
      var i;
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
      var match = string.match(/^\s*/);
      return match ? match[0] : "";
    }
    function leadingAndTrailingWs(string, segmenter) {
      if (!segmenter) {
        return [leadingWs(string), trailingWs(string)];
      }
      if (segmenter.resolvedOptions().granularity != "word") {
        throw new Error('The segmenter passed must have a granularity of "word"');
      }
      var segments = segment(string, segmenter);
      var firstSeg = segments[0];
      var lastSeg = segments[segments.length - 1];
      var head = /\s/.test(firstSeg) ? firstSeg : "";
      var tail = /\s/.test(lastSeg) ? lastSeg : "";
      return [head, tail];
    }
  }
});

// node_modules/diff/libcjs/diff/word.js
var require_word = __commonJS({
  "node_modules/diff/libcjs/diff/word.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wordsWithSpaceDiff = exports.wordDiff = void 0;
    exports.diffWords = diffWords;
    exports.diffWordsWithSpace = diffWordsWithSpace;
    var base_js_1 = require_base();
    var string_js_1 = require_string();
    var extendedWordChars = "a-zA-Z0-9_\\u{AD}\\u{C0}-\\u{D6}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}";
    var tokenizeIncludingWhitespace = new RegExp("[".concat(extendedWordChars, "]+|\\s+|[^").concat(extendedWordChars, "]"), "ug");
    var WordDiff = (
      /** @class */
      (function(_super) {
        __extends(WordDiff2, _super);
        function WordDiff2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        WordDiff2.prototype.equals = function(left, right, options) {
          if (options.ignoreCase) {
            left = left.toLowerCase();
            right = right.toLowerCase();
          }
          return left.trim() === right.trim();
        };
        WordDiff2.prototype.tokenize = function(value, options) {
          if (options === void 0) {
            options = {};
          }
          var parts;
          if (options.intlSegmenter) {
            var segmenter = options.intlSegmenter;
            if (segmenter.resolvedOptions().granularity != "word") {
              throw new Error('The segmenter passed must have a granularity of "word"');
            }
            parts = (0, string_js_1.segment)(value, segmenter);
          } else {
            parts = value.match(tokenizeIncludingWhitespace) || [];
          }
          var tokens = [];
          var prevPart = null;
          parts.forEach(function(part) {
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
        };
        WordDiff2.prototype.join = function(tokens) {
          return tokens.map(function(token, i) {
            if (i == 0) {
              return token;
            } else {
              return token.replace(/^\s+/, "");
            }
          }).join("");
        };
        WordDiff2.prototype.postProcess = function(changes, options) {
          if (!changes || options.oneChangePerToken) {
            return changes;
          }
          var lastKeep = null;
          var insertion = null;
          var deletion = null;
          changes.forEach(function(change) {
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
          return changes;
        };
        return WordDiff2;
      })(base_js_1.default)
    );
    exports.wordDiff = new WordDiff();
    function diffWords(oldStr, newStr, options) {
      if ((options === null || options === void 0 ? void 0 : options.ignoreWhitespace) != null && !options.ignoreWhitespace) {
        return diffWordsWithSpace(oldStr, newStr, options);
      }
      return exports.wordDiff.diff(oldStr, newStr, options);
    }
    function dedupeWhitespaceInChangeObjects(startKeep, deletion, insertion, endKeep, segmenter) {
      if (deletion && insertion) {
        var _a = (0, string_js_1.leadingAndTrailingWs)(deletion.value, segmenter), oldWsPrefix = _a[0], oldWsSuffix = _a[1];
        var _b = (0, string_js_1.leadingAndTrailingWs)(insertion.value, segmenter), newWsPrefix = _b[0], newWsSuffix = _b[1];
        if (startKeep) {
          var commonWsPrefix = (0, string_js_1.longestCommonPrefix)(oldWsPrefix, newWsPrefix);
          startKeep.value = (0, string_js_1.replaceSuffix)(startKeep.value, newWsPrefix, commonWsPrefix);
          deletion.value = (0, string_js_1.removePrefix)(deletion.value, commonWsPrefix);
          insertion.value = (0, string_js_1.removePrefix)(insertion.value, commonWsPrefix);
        }
        if (endKeep) {
          var commonWsSuffix = (0, string_js_1.longestCommonSuffix)(oldWsSuffix, newWsSuffix);
          endKeep.value = (0, string_js_1.replacePrefix)(endKeep.value, newWsSuffix, commonWsSuffix);
          deletion.value = (0, string_js_1.removeSuffix)(deletion.value, commonWsSuffix);
          insertion.value = (0, string_js_1.removeSuffix)(insertion.value, commonWsSuffix);
        }
      } else if (insertion) {
        if (startKeep) {
          var ws = (0, string_js_1.leadingWs)(insertion.value, segmenter);
          insertion.value = insertion.value.substring(ws.length);
        }
        if (endKeep) {
          var ws = (0, string_js_1.leadingWs)(endKeep.value, segmenter);
          endKeep.value = endKeep.value.substring(ws.length);
        }
      } else if (startKeep && endKeep) {
        var newWsFull = (0, string_js_1.leadingWs)(endKeep.value, segmenter), _c = (0, string_js_1.leadingAndTrailingWs)(deletion.value, segmenter), delWsStart = _c[0], delWsEnd = _c[1];
        var newWsStart = (0, string_js_1.longestCommonPrefix)(newWsFull, delWsStart);
        deletion.value = (0, string_js_1.removePrefix)(deletion.value, newWsStart);
        var newWsEnd = (0, string_js_1.longestCommonSuffix)((0, string_js_1.removePrefix)(newWsFull, newWsStart), delWsEnd);
        deletion.value = (0, string_js_1.removeSuffix)(deletion.value, newWsEnd);
        endKeep.value = (0, string_js_1.replacePrefix)(endKeep.value, newWsFull, newWsEnd);
        startKeep.value = (0, string_js_1.replaceSuffix)(startKeep.value, newWsFull, newWsFull.slice(0, newWsFull.length - newWsEnd.length));
      } else if (endKeep) {
        var endKeepWsPrefix = (0, string_js_1.leadingWs)(endKeep.value, segmenter);
        var deletionWsSuffix = (0, string_js_1.trailingWs)(deletion.value, segmenter);
        var overlap = (0, string_js_1.maximumOverlap)(deletionWsSuffix, endKeepWsPrefix);
        deletion.value = (0, string_js_1.removeSuffix)(deletion.value, overlap);
      } else if (startKeep) {
        var startKeepWsSuffix = (0, string_js_1.trailingWs)(startKeep.value, segmenter);
        var deletionWsPrefix = (0, string_js_1.leadingWs)(deletion.value, segmenter);
        var overlap = (0, string_js_1.maximumOverlap)(startKeepWsSuffix, deletionWsPrefix);
        deletion.value = (0, string_js_1.removePrefix)(deletion.value, overlap);
      }
    }
    var WordsWithSpaceDiff = (
      /** @class */
      (function(_super) {
        __extends(WordsWithSpaceDiff2, _super);
        function WordsWithSpaceDiff2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        WordsWithSpaceDiff2.prototype.tokenize = function(value) {
          var regex2 = new RegExp("(\\r?\\n)|[".concat(extendedWordChars, "]+|[^\\S\\n\\r]+|[^").concat(extendedWordChars, "]"), "ug");
          return value.match(regex2) || [];
        };
        return WordsWithSpaceDiff2;
      })(base_js_1.default)
    );
    exports.wordsWithSpaceDiff = new WordsWithSpaceDiff();
    function diffWordsWithSpace(oldStr, newStr, options) {
      return exports.wordsWithSpaceDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/libcjs/util/params.js
var require_params = __commonJS({
  "node_modules/diff/libcjs/util/params.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateOptions = generateOptions;
    function generateOptions(options, defaults) {
      if (typeof options === "function") {
        defaults.callback = options;
      } else if (options) {
        for (var name2 in options) {
          if (Object.prototype.hasOwnProperty.call(options, name2)) {
            defaults[name2] = options[name2];
          }
        }
      }
      return defaults;
    }
  }
});

// node_modules/diff/libcjs/diff/line.js
var require_line = __commonJS({
  "node_modules/diff/libcjs/diff/line.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lineDiff = void 0;
    exports.diffLines = diffLines;
    exports.diffTrimmedLines = diffTrimmedLines;
    exports.tokenize = tokenize;
    var base_js_1 = require_base();
    var params_js_1 = require_params();
    var LineDiff = (
      /** @class */
      (function(_super) {
        __extends(LineDiff2, _super);
        function LineDiff2() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.tokenize = tokenize;
          return _this;
        }
        LineDiff2.prototype.equals = function(left, right, options) {
          if (options.ignoreWhitespace) {
            if (!options.newlineIsToken || !left.includes("\n")) {
              left = left.trim();
            }
            if (!options.newlineIsToken || !right.includes("\n")) {
              right = right.trim();
            }
          } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
            if (left.endsWith("\n")) {
              left = left.slice(0, -1);
            }
            if (right.endsWith("\n")) {
              right = right.slice(0, -1);
            }
          }
          return _super.prototype.equals.call(this, left, right, options);
        };
        return LineDiff2;
      })(base_js_1.default)
    );
    exports.lineDiff = new LineDiff();
    function diffLines(oldStr, newStr, options) {
      return exports.lineDiff.diff(oldStr, newStr, options);
    }
    function diffTrimmedLines(oldStr, newStr, options) {
      options = (0, params_js_1.generateOptions)(options, { ignoreWhitespace: true });
      return exports.lineDiff.diff(oldStr, newStr, options);
    }
    function tokenize(value, options) {
      if (options.stripTrailingCr) {
        value = value.replace(/\r\n/g, "\n");
      }
      var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
      if (!linesAndNewlines[linesAndNewlines.length - 1]) {
        linesAndNewlines.pop();
      }
      for (var i = 0; i < linesAndNewlines.length; i++) {
        var line = linesAndNewlines[i];
        if (i % 2 && !options.newlineIsToken) {
          retLines[retLines.length - 1] += line;
        } else {
          retLines.push(line);
        }
      }
      return retLines;
    }
  }
});

// node_modules/diff/libcjs/diff/sentence.js
var require_sentence = __commonJS({
  "node_modules/diff/libcjs/diff/sentence.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sentenceDiff = void 0;
    exports.diffSentences = diffSentences;
    var base_js_1 = require_base();
    function isSentenceEndPunct(char) {
      return char == "." || char == "!" || char == "?";
    }
    var SentenceDiff = (
      /** @class */
      (function(_super) {
        __extends(SentenceDiff2, _super);
        function SentenceDiff2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        SentenceDiff2.prototype.tokenize = function(value) {
          var _a;
          var result = [];
          var tokenStartI = 0;
          for (var i = 0; i < value.length; i++) {
            if (i == value.length - 1) {
              result.push(value.slice(tokenStartI));
              break;
            }
            if (isSentenceEndPunct(value[i]) && value[i + 1].match(/\s/)) {
              result.push(value.slice(tokenStartI, i + 1));
              i = tokenStartI = i + 1;
              while ((_a = value[i + 1]) === null || _a === void 0 ? void 0 : _a.match(/\s/)) {
                i++;
              }
              result.push(value.slice(tokenStartI, i + 1));
              tokenStartI = i + 1;
            }
          }
          return result;
        };
        return SentenceDiff2;
      })(base_js_1.default)
    );
    exports.sentenceDiff = new SentenceDiff();
    function diffSentences(oldStr, newStr, options) {
      return exports.sentenceDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/libcjs/diff/css.js
var require_css = __commonJS({
  "node_modules/diff/libcjs/diff/css.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cssDiff = void 0;
    exports.diffCss = diffCss;
    var base_js_1 = require_base();
    var CssDiff = (
      /** @class */
      (function(_super) {
        __extends(CssDiff2, _super);
        function CssDiff2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        CssDiff2.prototype.tokenize = function(value) {
          return value.split(/([{}:;,]|\s+)/);
        };
        return CssDiff2;
      })(base_js_1.default)
    );
    exports.cssDiff = new CssDiff();
    function diffCss(oldStr, newStr, options) {
      return exports.cssDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/libcjs/diff/json.js
var require_json = __commonJS({
  "node_modules/diff/libcjs/diff/json.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.jsonDiff = void 0;
    exports.diffJson = diffJson;
    exports.canonicalize = canonicalize;
    var base_js_1 = require_base();
    var line_js_1 = require_line();
    var JsonDiff = (
      /** @class */
      (function(_super) {
        __extends(JsonDiff2, _super);
        function JsonDiff2() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.tokenize = line_js_1.tokenize;
          return _this;
        }
        Object.defineProperty(JsonDiff2.prototype, "useLongestToken", {
          get: function() {
            return true;
          },
          enumerable: false,
          configurable: true
        });
        JsonDiff2.prototype.castInput = function(value, options) {
          var undefinedReplacement = options.undefinedReplacement, _a = options.stringifyReplacer, stringifyReplacer = _a === void 0 ? function(k, v) {
            return typeof v === "undefined" ? undefinedReplacement : v;
          } : _a;
          return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), null, "  ");
        };
        JsonDiff2.prototype.equals = function(left, right, options) {
          return _super.prototype.equals.call(this, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"), options);
        };
        return JsonDiff2;
      })(base_js_1.default)
    );
    exports.jsonDiff = new JsonDiff();
    function diffJson(oldStr, newStr, options) {
      return exports.jsonDiff.diff(oldStr, newStr, options);
    }
    function canonicalize(obj, stack, replacementStack, replacer, key2) {
      stack = stack || [];
      replacementStack = replacementStack || [];
      if (replacer) {
        obj = replacer(key2 === void 0 ? "" : key2, obj);
      }
      var i;
      for (i = 0; i < stack.length; i += 1) {
        if (stack[i] === obj) {
          return replacementStack[i];
        }
      }
      var canonicalizedObj;
      if ("[object Array]" === Object.prototype.toString.call(obj)) {
        stack.push(obj);
        canonicalizedObj = new Array(obj.length);
        replacementStack.push(canonicalizedObj);
        for (i = 0; i < obj.length; i += 1) {
          canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, String(i));
        }
        stack.pop();
        replacementStack.pop();
        return canonicalizedObj;
      }
      if (obj && obj.toJSON) {
        obj = obj.toJSON();
      }
      if (typeof obj === "object" && obj !== null) {
        stack.push(obj);
        canonicalizedObj = {};
        replacementStack.push(canonicalizedObj);
        var sortedKeys = [];
        var key_1;
        for (key_1 in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key_1)) {
            sortedKeys.push(key_1);
          }
        }
        sortedKeys.sort();
        for (i = 0; i < sortedKeys.length; i += 1) {
          key_1 = sortedKeys[i];
          canonicalizedObj[key_1] = canonicalize(obj[key_1], stack, replacementStack, replacer, key_1);
        }
        stack.pop();
        replacementStack.pop();
      } else {
        canonicalizedObj = obj;
      }
      return canonicalizedObj;
    }
  }
});

// node_modules/diff/libcjs/diff/array.js
var require_array = __commonJS({
  "node_modules/diff/libcjs/diff/array.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.arrayDiff = void 0;
    exports.diffArrays = diffArrays;
    var base_js_1 = require_base();
    var ArrayDiff = (
      /** @class */
      (function(_super) {
        __extends(ArrayDiff2, _super);
        function ArrayDiff2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        ArrayDiff2.prototype.tokenize = function(value) {
          return value.slice();
        };
        ArrayDiff2.prototype.join = function(value) {
          return value;
        };
        ArrayDiff2.prototype.removeEmpty = function(value) {
          return value;
        };
        return ArrayDiff2;
      })(base_js_1.default)
    );
    exports.arrayDiff = new ArrayDiff();
    function diffArrays(oldArr, newArr, options) {
      return exports.arrayDiff.diff(oldArr, newArr, options);
    }
  }
});

// node_modules/diff/libcjs/patch/line-endings.js
var require_line_endings = __commonJS({
  "node_modules/diff/libcjs/patch/line-endings.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unixToWin = unixToWin;
    exports.winToUnix = winToUnix;
    exports.isUnix = isUnix;
    exports.isWin = isWin;
    function unixToWin(patch) {
      if (Array.isArray(patch)) {
        return patch.map(function(p) {
          return unixToWin(p);
        });
      }
      return __assign(__assign({}, patch), { hunks: patch.hunks.map(function(hunk) {
        return __assign(__assign({}, hunk), { lines: hunk.lines.map(function(line, i) {
          var _a;
          return line.startsWith("\\") || line.endsWith("\r") || ((_a = hunk.lines[i + 1]) === null || _a === void 0 ? void 0 : _a.startsWith("\\")) ? line : line + "\r";
        }) });
      }) });
    }
    function winToUnix(patch) {
      if (Array.isArray(patch)) {
        return patch.map(function(p) {
          return winToUnix(p);
        });
      }
      return __assign(__assign({}, patch), { hunks: patch.hunks.map(function(hunk) {
        return __assign(__assign({}, hunk), { lines: hunk.lines.map(function(line) {
          return line.endsWith("\r") ? line.substring(0, line.length - 1) : line;
        }) });
      }) });
    }
    function isUnix(patch) {
      if (!Array.isArray(patch)) {
        patch = [patch];
      }
      return !patch.some(function(index) {
        return index.hunks.some(function(hunk) {
          return hunk.lines.some(function(line) {
            return !line.startsWith("\\") && line.endsWith("\r");
          });
        });
      });
    }
    function isWin(patch) {
      if (!Array.isArray(patch)) {
        patch = [patch];
      }
      return patch.some(function(index) {
        return index.hunks.some(function(hunk) {
          return hunk.lines.some(function(line) {
            return line.endsWith("\r");
          });
        });
      }) && patch.every(function(index) {
        return index.hunks.every(function(hunk) {
          return hunk.lines.every(function(line, i) {
            var _a;
            return line.startsWith("\\") || line.endsWith("\r") || ((_a = hunk.lines[i + 1]) === null || _a === void 0 ? void 0 : _a.startsWith("\\"));
          });
        });
      });
    }
  }
});

// node_modules/diff/libcjs/patch/parse.js
var require_parse = __commonJS({
  "node_modules/diff/libcjs/patch/parse.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsePatch = parsePatch;
    function parsePatch(uniDiff) {
      var diffstr = uniDiff.split(/\n/), list3 = [];
      var i = 0;
      function parseIndex() {
        var index = {};
        list3.push(index);
        while (i < diffstr.length) {
          var line = diffstr[i];
          if (/^(---|\+\+\+|@@)\s/.test(line)) {
            break;
          }
          var headerMatch = /^(?:Index:|diff(?: -r \w+)+)\s+/.exec(line);
          if (headerMatch) {
            index.index = line.substring(headerMatch[0].length).trim();
          }
          i++;
        }
        parseFileHeader(index);
        parseFileHeader(index);
        index.hunks = [];
        while (i < diffstr.length) {
          var line = diffstr[i];
          if (/^(Index:\s|diff\s|---\s|\+\+\+\s|===================================================================)/.test(line)) {
            break;
          } else if (/^@@/.test(line)) {
            index.hunks.push(parseHunk());
          } else if (line) {
            throw new Error("Unknown line " + (i + 1) + " " + JSON.stringify(line));
          } else {
            i++;
          }
        }
      }
      function parseFileHeader(index) {
        var fileHeaderMatch = /^(---|\+\+\+)\s+/.exec(diffstr[i]);
        if (fileHeaderMatch) {
          var prefix = fileHeaderMatch[1], data = diffstr[i].substring(3).trim().split("	", 2), header = (data[1] || "").trim();
          var fileName = data[0].replace(/\\\\/g, "\\");
          if (fileName.startsWith('"') && fileName.endsWith('"')) {
            fileName = fileName.substr(1, fileName.length - 2);
          }
          if (prefix === "---") {
            index.oldFileName = fileName;
            index.oldHeader = header;
          } else {
            index.newFileName = fileName;
            index.newHeader = header;
          }
          i++;
        }
      }
      function parseHunk() {
        var _a;
        var chunkHeaderIndex = i, chunkHeaderLine = diffstr[i++], chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
        var hunk = {
          oldStart: +chunkHeader[1],
          oldLines: typeof chunkHeader[2] === "undefined" ? 1 : +chunkHeader[2],
          newStart: +chunkHeader[3],
          newLines: typeof chunkHeader[4] === "undefined" ? 1 : +chunkHeader[4],
          lines: []
        };
        if (hunk.oldLines === 0) {
          hunk.oldStart += 1;
        }
        if (hunk.newLines === 0) {
          hunk.newStart += 1;
        }
        var addCount = 0, removeCount = 0;
        for (; i < diffstr.length && (removeCount < hunk.oldLines || addCount < hunk.newLines || ((_a = diffstr[i]) === null || _a === void 0 ? void 0 : _a.startsWith("\\"))); i++) {
          var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? " " : diffstr[i][0];
          if (operation === "+" || operation === "-" || operation === " " || operation === "\\") {
            hunk.lines.push(diffstr[i]);
            if (operation === "+") {
              addCount++;
            } else if (operation === "-") {
              removeCount++;
            } else if (operation === " ") {
              addCount++;
              removeCount++;
            }
          } else {
            throw new Error("Hunk at line ".concat(chunkHeaderIndex + 1, " contained invalid line ").concat(diffstr[i]));
          }
        }
        if (!addCount && hunk.newLines === 1) {
          hunk.newLines = 0;
        }
        if (!removeCount && hunk.oldLines === 1) {
          hunk.oldLines = 0;
        }
        if (addCount !== hunk.newLines) {
          throw new Error("Added line count did not match for hunk at line " + (chunkHeaderIndex + 1));
        }
        if (removeCount !== hunk.oldLines) {
          throw new Error("Removed line count did not match for hunk at line " + (chunkHeaderIndex + 1));
        }
        return hunk;
      }
      while (i < diffstr.length) {
        parseIndex();
      }
      return list3;
    }
  }
});

// node_modules/diff/libcjs/util/distance-iterator.js
var require_distance_iterator = __commonJS({
  "node_modules/diff/libcjs/util/distance-iterator.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    function default_1(start3, minLine, maxLine) {
      var wantForward = true, backwardExhausted = false, forwardExhausted = false, localOffset = 1;
      return function iterator() {
        if (wantForward && !forwardExhausted) {
          if (backwardExhausted) {
            localOffset++;
          } else {
            wantForward = false;
          }
          if (start3 + localOffset <= maxLine) {
            return start3 + localOffset;
          }
          forwardExhausted = true;
        }
        if (!backwardExhausted) {
          if (!forwardExhausted) {
            wantForward = true;
          }
          if (minLine <= start3 - localOffset) {
            return start3 - localOffset++;
          }
          backwardExhausted = true;
          return iterator();
        }
        return void 0;
      };
    }
  }
});

// node_modules/diff/libcjs/patch/apply.js
var require_apply = __commonJS({
  "node_modules/diff/libcjs/patch/apply.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyPatch = applyPatch;
    exports.applyPatches = applyPatches;
    var string_js_1 = require_string();
    var line_endings_js_1 = require_line_endings();
    var parse_js_1 = require_parse();
    var distance_iterator_js_1 = require_distance_iterator();
    function applyPatch(source, patch, options) {
      if (options === void 0) {
        options = {};
      }
      var patches;
      if (typeof patch === "string") {
        patches = (0, parse_js_1.parsePatch)(patch);
      } else if (Array.isArray(patch)) {
        patches = patch;
      } else {
        patches = [patch];
      }
      if (patches.length > 1) {
        throw new Error("applyPatch only works with a single input.");
      }
      return applyStructuredPatch(source, patches[0], options);
    }
    function applyStructuredPatch(source, patch, options) {
      if (options === void 0) {
        options = {};
      }
      if (options.autoConvertLineEndings || options.autoConvertLineEndings == null) {
        if ((0, string_js_1.hasOnlyWinLineEndings)(source) && (0, line_endings_js_1.isUnix)(patch)) {
          patch = (0, line_endings_js_1.unixToWin)(patch);
        } else if ((0, string_js_1.hasOnlyUnixLineEndings)(source) && (0, line_endings_js_1.isWin)(patch)) {
          patch = (0, line_endings_js_1.winToUnix)(patch);
        }
      }
      var lines = source.split("\n"), hunks = patch.hunks, compareLine = options.compareLine || (function(lineNumber, line2, operation, patchContent) {
        return line2 === patchContent;
      }), fuzzFactor = options.fuzzFactor || 0;
      var minLine = 0;
      if (fuzzFactor < 0 || !Number.isInteger(fuzzFactor)) {
        throw new Error("fuzzFactor must be a non-negative integer");
      }
      if (!hunks.length) {
        return source;
      }
      var prevLine = "", removeEOFNL = false, addEOFNL = false;
      for (var i = 0; i < hunks[hunks.length - 1].lines.length; i++) {
        var line = hunks[hunks.length - 1].lines[i];
        if (line[0] == "\\") {
          if (prevLine[0] == "+") {
            removeEOFNL = true;
          } else if (prevLine[0] == "-") {
            addEOFNL = true;
          }
        }
        prevLine = line;
      }
      if (removeEOFNL) {
        if (addEOFNL) {
          if (!fuzzFactor && lines[lines.length - 1] == "") {
            return false;
          }
        } else if (lines[lines.length - 1] == "") {
          lines.pop();
        } else if (!fuzzFactor) {
          return false;
        }
      } else if (addEOFNL) {
        if (lines[lines.length - 1] != "") {
          lines.push("");
        } else if (!fuzzFactor) {
          return false;
        }
      }
      function applyHunk(hunkLines, toPos2, maxErrors2, hunkLinesI, lastContextLineMatched, patchedLines, patchedLinesLength) {
        if (hunkLinesI === void 0) {
          hunkLinesI = 0;
        }
        if (lastContextLineMatched === void 0) {
          lastContextLineMatched = true;
        }
        if (patchedLines === void 0) {
          patchedLines = [];
        }
        if (patchedLinesLength === void 0) {
          patchedLinesLength = 0;
        }
        var nConsecutiveOldContextLines = 0;
        var nextContextLineMustMatch = false;
        for (; hunkLinesI < hunkLines.length; hunkLinesI++) {
          var hunkLine = hunkLines[hunkLinesI], operation = hunkLine.length > 0 ? hunkLine[0] : " ", content = hunkLine.length > 0 ? hunkLine.substr(1) : hunkLine;
          if (operation === "-") {
            if (compareLine(toPos2 + 1, lines[toPos2], operation, content)) {
              toPos2++;
              nConsecutiveOldContextLines = 0;
            } else {
              if (!maxErrors2 || lines[toPos2] == null) {
                return null;
              }
              patchedLines[patchedLinesLength] = lines[toPos2];
              return applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1);
            }
          }
          if (operation === "+") {
            if (!lastContextLineMatched) {
              return null;
            }
            patchedLines[patchedLinesLength] = content;
            patchedLinesLength++;
            nConsecutiveOldContextLines = 0;
            nextContextLineMustMatch = true;
          }
          if (operation === " ") {
            nConsecutiveOldContextLines++;
            patchedLines[patchedLinesLength] = lines[toPos2];
            if (compareLine(toPos2 + 1, lines[toPos2], operation, content)) {
              patchedLinesLength++;
              lastContextLineMatched = true;
              nextContextLineMustMatch = false;
              toPos2++;
            } else {
              if (nextContextLineMustMatch || !maxErrors2) {
                return null;
              }
              return lines[toPos2] && (applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength + 1) || applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1)) || applyHunk(hunkLines, toPos2, maxErrors2 - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength);
            }
          }
        }
        patchedLinesLength -= nConsecutiveOldContextLines;
        toPos2 -= nConsecutiveOldContextLines;
        patchedLines.length = patchedLinesLength;
        return {
          patchedLines,
          oldLineLastI: toPos2 - 1
        };
      }
      var resultLines = [];
      var prevHunkOffset = 0;
      for (var i = 0; i < hunks.length; i++) {
        var hunk = hunks[i];
        var hunkResult = void 0;
        var maxLine = lines.length - hunk.oldLines + fuzzFactor;
        var toPos = void 0;
        for (var maxErrors = 0; maxErrors <= fuzzFactor; maxErrors++) {
          toPos = hunk.oldStart + prevHunkOffset - 1;
          var iterator = (0, distance_iterator_js_1.default)(toPos, minLine, maxLine);
          for (; toPos !== void 0; toPos = iterator()) {
            hunkResult = applyHunk(hunk.lines, toPos, maxErrors);
            if (hunkResult) {
              break;
            }
          }
          if (hunkResult) {
            break;
          }
        }
        if (!hunkResult) {
          return false;
        }
        for (var i_1 = minLine; i_1 < toPos; i_1++) {
          resultLines.push(lines[i_1]);
        }
        for (var i_2 = 0; i_2 < hunkResult.patchedLines.length; i_2++) {
          var line = hunkResult.patchedLines[i_2];
          resultLines.push(line);
        }
        minLine = hunkResult.oldLineLastI + 1;
        prevHunkOffset = toPos + 1 - hunk.oldStart;
      }
      for (var i = minLine; i < lines.length; i++) {
        resultLines.push(lines[i]);
      }
      return resultLines.join("\n");
    }
    function applyPatches(uniDiff, options) {
      var spDiff = typeof uniDiff === "string" ? (0, parse_js_1.parsePatch)(uniDiff) : uniDiff;
      var currentIndex = 0;
      function processIndex() {
        var index = spDiff[currentIndex++];
        if (!index) {
          return options.complete();
        }
        options.loadFile(index, function(err, data) {
          if (err) {
            return options.complete(err);
          }
          var updatedContent = applyPatch(data, index, options);
          options.patched(index, updatedContent, function(err2) {
            if (err2) {
              return options.complete(err2);
            }
            processIndex();
          });
        });
      }
      processIndex();
    }
  }
});

// node_modules/diff/libcjs/patch/reverse.js
var require_reverse = __commonJS({
  "node_modules/diff/libcjs/patch/reverse.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reversePatch = reversePatch;
    function reversePatch(structuredPatch) {
      if (Array.isArray(structuredPatch)) {
        return structuredPatch.map(function(patch) {
          return reversePatch(patch);
        }).reverse();
      }
      return __assign(__assign({}, structuredPatch), { oldFileName: structuredPatch.newFileName, oldHeader: structuredPatch.newHeader, newFileName: structuredPatch.oldFileName, newHeader: structuredPatch.oldHeader, hunks: structuredPatch.hunks.map(function(hunk) {
        return {
          oldLines: hunk.newLines,
          oldStart: hunk.newStart,
          newLines: hunk.oldLines,
          newStart: hunk.oldStart,
          lines: hunk.lines.map(function(l) {
            if (l.startsWith("-")) {
              return "+".concat(l.slice(1));
            }
            if (l.startsWith("+")) {
              return "-".concat(l.slice(1));
            }
            return l;
          })
        };
      }) });
    }
  }
});

// node_modules/diff/libcjs/patch/create.js
var require_create = __commonJS({
  "node_modules/diff/libcjs/patch/create.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OMIT_HEADERS = exports.FILE_HEADERS_ONLY = exports.INCLUDE_HEADERS = void 0;
    exports.structuredPatch = structuredPatch;
    exports.formatPatch = formatPatch;
    exports.createTwoFilesPatch = createTwoFilesPatch;
    exports.createPatch = createPatch;
    var line_js_1 = require_line();
    exports.INCLUDE_HEADERS = {
      includeIndex: true,
      includeUnderline: true,
      includeFileHeaders: true
    };
    exports.FILE_HEADERS_ONLY = {
      includeIndex: false,
      includeUnderline: false,
      includeFileHeaders: true
    };
    exports.OMIT_HEADERS = {
      includeIndex: false,
      includeUnderline: false,
      includeFileHeaders: false
    };
    function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
      var optionsObj;
      if (!options) {
        optionsObj = {};
      } else if (typeof options === "function") {
        optionsObj = { callback: options };
      } else {
        optionsObj = options;
      }
      if (typeof optionsObj.context === "undefined") {
        optionsObj.context = 4;
      }
      var context = optionsObj.context;
      if (optionsObj.newlineIsToken) {
        throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
      }
      if (!optionsObj.callback) {
        return diffLinesResultToPatch((0, line_js_1.diffLines)(oldStr, newStr, optionsObj));
      } else {
        var callback_1 = optionsObj.callback;
        (0, line_js_1.diffLines)(oldStr, newStr, __assign(__assign({}, optionsObj), { callback: function(diff) {
          var patch = diffLinesResultToPatch(diff);
          callback_1(patch);
        } }));
      }
      function diffLinesResultToPatch(diff) {
        if (!diff) {
          return;
        }
        diff.push({ value: "", lines: [] });
        function contextLines(lines2) {
          return lines2.map(function(entry) {
            return " " + entry;
          });
        }
        var hunks = [];
        var oldRangeStart = 0, newRangeStart = 0, curRange = [], oldLine = 1, newLine = 1;
        for (var i = 0; i < diff.length; i++) {
          var current3 = diff[i], lines = current3.lines || splitLines(current3.value);
          current3.lines = lines;
          if (current3.added || current3.removed) {
            if (!oldRangeStart) {
              var prev = diff[i - 1];
              oldRangeStart = oldLine;
              newRangeStart = newLine;
              if (prev) {
                curRange = context > 0 ? contextLines(prev.lines.slice(-context)) : [];
                oldRangeStart -= curRange.length;
                newRangeStart -= curRange.length;
              }
            }
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
              var line = lines_1[_i];
              curRange.push((current3.added ? "+" : "-") + line);
            }
            if (current3.added) {
              newLine += lines.length;
            } else {
              oldLine += lines.length;
            }
          } else {
            if (oldRangeStart) {
              if (lines.length <= context * 2 && i < diff.length - 2) {
                for (var _a = 0, _b = contextLines(lines); _a < _b.length; _a++) {
                  var line = _b[_a];
                  curRange.push(line);
                }
              } else {
                var contextSize = Math.min(lines.length, context);
                for (var _c = 0, _d = contextLines(lines.slice(0, contextSize)); _c < _d.length; _c++) {
                  var line = _d[_c];
                  curRange.push(line);
                }
                var hunk = {
                  oldStart: oldRangeStart,
                  oldLines: oldLine - oldRangeStart + contextSize,
                  newStart: newRangeStart,
                  newLines: newLine - newRangeStart + contextSize,
                  lines: curRange
                };
                hunks.push(hunk);
                oldRangeStart = 0;
                newRangeStart = 0;
                curRange = [];
              }
            }
            oldLine += lines.length;
            newLine += lines.length;
          }
        }
        for (var _e = 0, hunks_1 = hunks; _e < hunks_1.length; _e++) {
          var hunk = hunks_1[_e];
          for (var i = 0; i < hunk.lines.length; i++) {
            if (hunk.lines[i].endsWith("\n")) {
              hunk.lines[i] = hunk.lines[i].slice(0, -1);
            } else {
              hunk.lines.splice(i + 1, 0, "\\ No newline at end of file");
              i++;
            }
          }
        }
        return {
          oldFileName,
          newFileName,
          oldHeader,
          newHeader,
          hunks
        };
      }
    }
    function formatPatch(patch, headerOptions) {
      if (!headerOptions) {
        headerOptions = exports.INCLUDE_HEADERS;
      }
      if (Array.isArray(patch)) {
        if (patch.length > 1 && !headerOptions.includeFileHeaders) {
          throw new Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");
        }
        return patch.map(function(p) {
          return formatPatch(p, headerOptions);
        }).join("\n");
      }
      var ret = [];
      if (headerOptions.includeIndex && patch.oldFileName == patch.newFileName) {
        ret.push("Index: " + patch.oldFileName);
      }
      if (headerOptions.includeUnderline) {
        ret.push("===================================================================");
      }
      if (headerOptions.includeFileHeaders) {
        ret.push("--- " + patch.oldFileName + (typeof patch.oldHeader === "undefined" ? "" : "	" + patch.oldHeader));
        ret.push("+++ " + patch.newFileName + (typeof patch.newHeader === "undefined" ? "" : "	" + patch.newHeader));
      }
      for (var i = 0; i < patch.hunks.length; i++) {
        var hunk = patch.hunks[i];
        if (hunk.oldLines === 0) {
          hunk.oldStart -= 1;
        }
        if (hunk.newLines === 0) {
          hunk.newStart -= 1;
        }
        ret.push("@@ -" + hunk.oldStart + "," + hunk.oldLines + " +" + hunk.newStart + "," + hunk.newLines + " @@");
        for (var _i = 0, _a = hunk.lines; _i < _a.length; _i++) {
          var line = _a[_i];
          ret.push(line);
        }
      }
      return ret.join("\n") + "\n";
    }
    function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
      if (typeof options === "function") {
        options = { callback: options };
      }
      if (!(options === null || options === void 0 ? void 0 : options.callback)) {
        var patchObj = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
        if (!patchObj) {
          return;
        }
        return formatPatch(patchObj, options === null || options === void 0 ? void 0 : options.headerOptions);
      } else {
        var callback_2 = options.callback;
        structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, __assign(__assign({}, options), { callback: function(patchObj2) {
          if (!patchObj2) {
            callback_2(void 0);
          } else {
            callback_2(formatPatch(patchObj2, options.headerOptions));
          }
        } }));
      }
    }
    function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
      return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
    }
    function splitLines(text2) {
      var hasTrailingNl = text2.endsWith("\n");
      var result = text2.split("\n").map(function(line) {
        return line + "\n";
      });
      if (hasTrailingNl) {
        result.pop();
      } else {
        result.push(result.pop().slice(0, -1));
      }
      return result;
    }
  }
});

// node_modules/diff/libcjs/convert/dmp.js
var require_dmp = __commonJS({
  "node_modules/diff/libcjs/convert/dmp.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertChangesToDMP = convertChangesToDMP;
    function convertChangesToDMP(changes) {
      var ret = [];
      var change, operation;
      for (var i = 0; i < changes.length; i++) {
        change = changes[i];
        if (change.added) {
          operation = 1;
        } else if (change.removed) {
          operation = -1;
        } else {
          operation = 0;
        }
        ret.push([operation, change.value]);
      }
      return ret;
    }
  }
});

// node_modules/diff/libcjs/convert/xml.js
var require_xml = __commonJS({
  "node_modules/diff/libcjs/convert/xml.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertChangesToXML = convertChangesToXML;
    function convertChangesToXML(changes) {
      var ret = [];
      for (var i = 0; i < changes.length; i++) {
        var change = changes[i];
        if (change.added) {
          ret.push("<ins>");
        } else if (change.removed) {
          ret.push("<del>");
        }
        ret.push(escapeHTML(change.value));
        if (change.added) {
          ret.push("</ins>");
        } else if (change.removed) {
          ret.push("</del>");
        }
      }
      return ret.join("");
    }
    function escapeHTML(s) {
      var n = s;
      n = n.replace(/&/g, "&amp;");
      n = n.replace(/</g, "&lt;");
      n = n.replace(/>/g, "&gt;");
      n = n.replace(/"/g, "&quot;");
      return n;
    }
  }
});

// node_modules/diff/libcjs/index.js
var require_libcjs = __commonJS({
  "node_modules/diff/libcjs/index.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.canonicalize = exports.convertChangesToXML = exports.convertChangesToDMP = exports.reversePatch = exports.parsePatch = exports.applyPatches = exports.applyPatch = exports.OMIT_HEADERS = exports.FILE_HEADERS_ONLY = exports.INCLUDE_HEADERS = exports.formatPatch = exports.createPatch = exports.createTwoFilesPatch = exports.structuredPatch = exports.arrayDiff = exports.diffArrays = exports.jsonDiff = exports.diffJson = exports.cssDiff = exports.diffCss = exports.sentenceDiff = exports.diffSentences = exports.diffTrimmedLines = exports.lineDiff = exports.diffLines = exports.wordsWithSpaceDiff = exports.diffWordsWithSpace = exports.wordDiff = exports.diffWords = exports.characterDiff = exports.diffChars = exports.Diff = void 0;
    var base_js_1 = require_base();
    exports.Diff = base_js_1.default;
    var character_js_1 = require_character();
    Object.defineProperty(exports, "diffChars", { enumerable: true, get: function() {
      return character_js_1.diffChars;
    } });
    Object.defineProperty(exports, "characterDiff", { enumerable: true, get: function() {
      return character_js_1.characterDiff;
    } });
    var word_js_1 = require_word();
    Object.defineProperty(exports, "diffWords", { enumerable: true, get: function() {
      return word_js_1.diffWords;
    } });
    Object.defineProperty(exports, "diffWordsWithSpace", { enumerable: true, get: function() {
      return word_js_1.diffWordsWithSpace;
    } });
    Object.defineProperty(exports, "wordDiff", { enumerable: true, get: function() {
      return word_js_1.wordDiff;
    } });
    Object.defineProperty(exports, "wordsWithSpaceDiff", { enumerable: true, get: function() {
      return word_js_1.wordsWithSpaceDiff;
    } });
    var line_js_1 = require_line();
    Object.defineProperty(exports, "diffLines", { enumerable: true, get: function() {
      return line_js_1.diffLines;
    } });
    Object.defineProperty(exports, "diffTrimmedLines", { enumerable: true, get: function() {
      return line_js_1.diffTrimmedLines;
    } });
    Object.defineProperty(exports, "lineDiff", { enumerable: true, get: function() {
      return line_js_1.lineDiff;
    } });
    var sentence_js_1 = require_sentence();
    Object.defineProperty(exports, "diffSentences", { enumerable: true, get: function() {
      return sentence_js_1.diffSentences;
    } });
    Object.defineProperty(exports, "sentenceDiff", { enumerable: true, get: function() {
      return sentence_js_1.sentenceDiff;
    } });
    var css_js_1 = require_css();
    Object.defineProperty(exports, "diffCss", { enumerable: true, get: function() {
      return css_js_1.diffCss;
    } });
    Object.defineProperty(exports, "cssDiff", { enumerable: true, get: function() {
      return css_js_1.cssDiff;
    } });
    var json_js_1 = require_json();
    Object.defineProperty(exports, "diffJson", { enumerable: true, get: function() {
      return json_js_1.diffJson;
    } });
    Object.defineProperty(exports, "canonicalize", { enumerable: true, get: function() {
      return json_js_1.canonicalize;
    } });
    Object.defineProperty(exports, "jsonDiff", { enumerable: true, get: function() {
      return json_js_1.jsonDiff;
    } });
    var array_js_1 = require_array();
    Object.defineProperty(exports, "diffArrays", { enumerable: true, get: function() {
      return array_js_1.diffArrays;
    } });
    Object.defineProperty(exports, "arrayDiff", { enumerable: true, get: function() {
      return array_js_1.arrayDiff;
    } });
    var apply_js_1 = require_apply();
    Object.defineProperty(exports, "applyPatch", { enumerable: true, get: function() {
      return apply_js_1.applyPatch;
    } });
    Object.defineProperty(exports, "applyPatches", { enumerable: true, get: function() {
      return apply_js_1.applyPatches;
    } });
    var parse_js_1 = require_parse();
    Object.defineProperty(exports, "parsePatch", { enumerable: true, get: function() {
      return parse_js_1.parsePatch;
    } });
    var reverse_js_1 = require_reverse();
    Object.defineProperty(exports, "reversePatch", { enumerable: true, get: function() {
      return reverse_js_1.reversePatch;
    } });
    var create_js_1 = require_create();
    Object.defineProperty(exports, "structuredPatch", { enumerable: true, get: function() {
      return create_js_1.structuredPatch;
    } });
    Object.defineProperty(exports, "createTwoFilesPatch", { enumerable: true, get: function() {
      return create_js_1.createTwoFilesPatch;
    } });
    Object.defineProperty(exports, "createPatch", { enumerable: true, get: function() {
      return create_js_1.createPatch;
    } });
    Object.defineProperty(exports, "formatPatch", { enumerable: true, get: function() {
      return create_js_1.formatPatch;
    } });
    Object.defineProperty(exports, "INCLUDE_HEADERS", { enumerable: true, get: function() {
      return create_js_1.INCLUDE_HEADERS;
    } });
    Object.defineProperty(exports, "FILE_HEADERS_ONLY", { enumerable: true, get: function() {
      return create_js_1.FILE_HEADERS_ONLY;
    } });
    Object.defineProperty(exports, "OMIT_HEADERS", { enumerable: true, get: function() {
      return create_js_1.OMIT_HEADERS;
    } });
    var dmp_js_1 = require_dmp();
    Object.defineProperty(exports, "convertChangesToDMP", { enumerable: true, get: function() {
      return dmp_js_1.convertChangesToDMP;
    } });
    var xml_js_1 = require_xml();
    Object.defineProperty(exports, "convertChangesToXML", { enumerable: true, get: function() {
      return xml_js_1.convertChangesToXML;
    } });
  }
});

// node_modules/diff2html/lib/rematch.js
var require_rematch = __commonJS({
  "node_modules/diff2html/lib/rematch.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.levenshtein = levenshtein;
    exports.newDistanceFn = newDistanceFn;
    exports.newMatcherFn = newMatcherFn;
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
    function newMatcherFn(distance) {
      function findBestMatch(a, b, cache = /* @__PURE__ */ new Map()) {
        let bestMatchDist = Infinity;
        let bestMatch;
        for (let i = 0; i < a.length; ++i) {
          for (let j = 0; j < b.length; ++j) {
            const cacheKey = JSON.stringify([a[i], b[j]]);
            let md;
            if (!(cache.has(cacheKey) && (md = cache.get(cacheKey)))) {
              md = distance(a[i], b[j]);
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
  }
});

// node_modules/diff2html/lib/render-utils.js
var require_render_utils = __commonJS({
  "node_modules/diff2html/lib/render-utils.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultRenderConfig = exports.CSSLineClass = void 0;
    exports.toCSSClass = toCSSClass;
    exports.colorSchemeToCss = colorSchemeToCss;
    exports.escapeForHtml = escapeForHtml;
    exports.deconstructLine = deconstructLine;
    exports.filenameDiff = filenameDiff;
    exports.getHtmlId = getHtmlId;
    exports.getFileIcon = getFileIcon;
    exports.diffHighlight = diffHighlight;
    var jsDiff = __importStar(require_libcjs());
    var utils_1 = require_utils();
    var rematch = __importStar(require_rematch());
    var types_1 = require_types();
    exports.CSSLineClass = {
      INSERTS: "d2h-ins",
      DELETES: "d2h-del",
      CONTEXT: "d2h-cntx",
      INFO: "d2h-info",
      INSERT_CHANGES: "d2h-ins d2h-change",
      DELETE_CHANGES: "d2h-del d2h-change"
    };
    exports.defaultRenderConfig = {
      matching: types_1.LineMatchingType.NONE,
      matchWordsThreshold: 0.25,
      maxLineLengthHighlight: 1e4,
      diffStyle: types_1.DiffStyleType.WORD,
      colorScheme: types_1.ColorSchemeType.LIGHT
    };
    var separator = "/";
    var distance = rematch.newDistanceFn((change) => change.value);
    var matcher = rematch.newMatcherFn(distance);
    function isDevNullName(name2) {
      return name2.indexOf("dev/null") !== -1;
    }
    function removeInsElements(line) {
      return line.replace(/(<ins[^>]*>((.|\n)*?)<\/ins>)/g, "");
    }
    function removeDelElements(line) {
      return line.replace(/(<del[^>]*>((.|\n)*?)<\/del>)/g, "");
    }
    function toCSSClass(lineType) {
      switch (lineType) {
        case types_1.LineType.CONTEXT:
          return exports.CSSLineClass.CONTEXT;
        case types_1.LineType.INSERT:
          return exports.CSSLineClass.INSERTS;
        case types_1.LineType.DELETE:
          return exports.CSSLineClass.DELETES;
      }
    }
    function colorSchemeToCss(colorScheme) {
      switch (colorScheme) {
        case types_1.ColorSchemeType.DARK:
          return "d2h-dark-color-scheme";
        case types_1.ColorSchemeType.AUTO:
          return "d2h-auto-color-scheme";
        case types_1.ColorSchemeType.LIGHT:
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
    function deconstructLine(line, isCombined, escape3 = true) {
      const indexToSplit = prefixLength(isCombined);
      return {
        prefix: line.substring(0, indexToSplit),
        content: escape3 ? escapeForHtml(line.substring(indexToSplit)) : line.substring(indexToSplit)
      };
    }
    function filenameDiff(file2) {
      const oldFilename = (0, utils_1.unifyPath)(file2.oldName);
      const newFilename = (0, utils_1.unifyPath)(file2.newName);
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
    function getHtmlId(file2) {
      return `d2h-${(0, utils_1.hashCode)(filenameDiff(file2)).toString().slice(-6)}`;
    }
    function getFileIcon(file2) {
      let templateName = "file-changed";
      if (file2.isRename) {
        templateName = "file-renamed";
      } else if (file2.isCopy) {
        templateName = "file-renamed";
      } else if (file2.isNew) {
        templateName = "file-added";
      } else if (file2.isDeleted) {
        templateName = "file-deleted";
      } else if (file2.newName !== file2.oldName) {
        templateName = "file-renamed";
      }
      return templateName;
    }
    function diffHighlight(diffLine1, diffLine2, isCombined, config2 = {}) {
      const { matching, maxLineLengthHighlight, matchWordsThreshold, diffStyle } = Object.assign(Object.assign({}, exports.defaultRenderConfig), config2);
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
      const diff = diffStyle === "char" ? jsDiff.diffChars(line1.content, line2.content) : jsDiff.diffWordsWithSpace(line1.content, line2.content);
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
  }
});

// node_modules/diff2html/lib/file-list-renderer.js
var require_file_list_renderer = __commonJS({
  "node_modules/diff2html/lib/file-list-renderer.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileListRenderer = exports.defaultFileListRendererConfig = void 0;
    var renderUtils = __importStar(require_render_utils());
    var baseTemplatesPath = "file-summary";
    var iconsBaseTemplatesPath = "icon";
    exports.defaultFileListRendererConfig = {
      colorScheme: renderUtils.defaultRenderConfig.colorScheme
    };
    var FileListRenderer = class {
      constructor(hoganUtils, config2 = {}) {
        this.hoganUtils = hoganUtils;
        this.config = Object.assign(Object.assign({}, exports.defaultFileListRendererConfig), config2);
      }
      render(diffFiles) {
        const files3 = diffFiles.map((file2) => this.hoganUtils.render(baseTemplatesPath, "line", {
          fileHtmlId: renderUtils.getHtmlId(file2),
          oldName: file2.oldName,
          newName: file2.newName,
          fileName: renderUtils.filenameDiff(file2),
          deletedLines: "-" + file2.deletedLines,
          addedLines: "+" + file2.addedLines
        }, {
          fileIcon: this.hoganUtils.template(iconsBaseTemplatesPath, renderUtils.getFileIcon(file2))
        })).join("\n");
        return this.hoganUtils.render(baseTemplatesPath, "wrapper", {
          colorScheme: renderUtils.colorSchemeToCss(this.config.colorScheme),
          filesNumber: diffFiles.length,
          files: files3
        });
      }
    };
    exports.FileListRenderer = FileListRenderer;
  }
});

// node_modules/diff2html/lib/line-by-line-renderer.js
var require_line_by_line_renderer = __commonJS({
  "node_modules/diff2html/lib/line-by-line-renderer.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultLineByLineRendererConfig = void 0;
    var Rematch = __importStar(require_rematch());
    var renderUtils = __importStar(require_render_utils());
    var types_1 = require_types();
    var utils_1 = require_utils();
    exports.defaultLineByLineRendererConfig = Object.assign(Object.assign({}, renderUtils.defaultRenderConfig), { renderNothingWhenEmpty: false, matchingMaxComparisons: 2500, maxLineSizeInBlockForComparison: 200 });
    var genericTemplatesPath = "generic";
    var baseTemplatesPath = "line-by-line";
    var iconsBaseTemplatesPath = "icon";
    var tagsBaseTemplatesPath = "tag";
    var LineByLineRenderer = class {
      constructor(hoganUtils, config2 = {}) {
        this.hoganUtils = hoganUtils;
        this.config = Object.assign(Object.assign({}, exports.defaultLineByLineRendererConfig), config2);
      }
      render(diffFiles) {
        const diffsHtml = diffFiles.map((file2) => {
          let diffs;
          if (file2.blocks.length) {
            diffs = this.generateFileHtml(file2);
          } else {
            diffs = this.generateEmptyDiff();
          }
          return this.makeFileDiffHtml(file2, diffs);
        }).join("\n");
        return this.hoganUtils.render(genericTemplatesPath, "wrapper", {
          colorScheme: renderUtils.colorSchemeToCss(this.config.colorScheme),
          content: diffsHtml
        });
      }
      makeFileDiffHtml(file2, diffs) {
        if (this.config.renderNothingWhenEmpty && Array.isArray(file2.blocks) && file2.blocks.length === 0)
          return "";
        const fileDiffTemplate = this.hoganUtils.template(baseTemplatesPath, "file-diff");
        const filePathTemplate = this.hoganUtils.template(genericTemplatesPath, "file-path");
        const fileIconTemplate = this.hoganUtils.template(iconsBaseTemplatesPath, "file");
        const fileTagTemplate = this.hoganUtils.template(tagsBaseTemplatesPath, renderUtils.getFileIcon(file2));
        return fileDiffTemplate.render({
          file: file2,
          fileHtmlId: renderUtils.getHtmlId(file2),
          diffs,
          filePath: filePathTemplate.render({
            fileDiffName: renderUtils.filenameDiff(file2)
          }, {
            fileIcon: fileIconTemplate,
            fileTag: fileTagTemplate
          })
        });
      }
      generateEmptyDiff() {
        return this.hoganUtils.render(genericTemplatesPath, "empty-diff", {
          contentClass: "d2h-code-line",
          CSSLineClass: renderUtils.CSSLineClass
        });
      }
      generateFileHtml(file2) {
        const matcher = Rematch.newMatcherFn(Rematch.newDistanceFn((e) => renderUtils.deconstructLine(e.content, file2.isCombined).content));
        return file2.blocks.map((block2) => {
          let lines = this.hoganUtils.render(genericTemplatesPath, "block-header", {
            CSSLineClass: renderUtils.CSSLineClass,
            blockHeader: file2.isTooBig ? block2.header : renderUtils.escapeForHtml(block2.header),
            lineClass: "d2h-code-linenumber",
            contentClass: "d2h-code-line"
          });
          this.applyLineGroupping(block2).forEach(([contextLines, oldLines, newLines]) => {
            if (oldLines.length && newLines.length && !contextLines.length) {
              this.applyRematchMatching(oldLines, newLines, matcher).map(([oldLines2, newLines2]) => {
                const { left, right } = this.processChangedLines(file2, file2.isCombined, oldLines2, newLines2);
                lines += left;
                lines += right;
              });
            } else if (contextLines.length) {
              contextLines.forEach((line) => {
                const { prefix, content } = renderUtils.deconstructLine(line.content, file2.isCombined);
                lines += this.generateSingleLineHtml(file2, {
                  type: renderUtils.CSSLineClass.CONTEXT,
                  prefix,
                  content,
                  oldNumber: line.oldNumber,
                  newNumber: line.newNumber
                });
              });
            } else if (oldLines.length || newLines.length) {
              const { left, right } = this.processChangedLines(file2, file2.isCombined, oldLines, newLines);
              lines += left;
              lines += right;
            } else {
              console.error("Unknown state reached while processing groups of lines", contextLines, oldLines, newLines);
            }
          });
          return lines;
        }).join("\n");
      }
      applyLineGroupping(block2) {
        const blockLinesGroups = [];
        let oldLines = [];
        let newLines = [];
        for (let i = 0; i < block2.lines.length; i++) {
          const diffLine = block2.lines[i];
          if (diffLine.type !== types_1.LineType.INSERT && newLines.length || diffLine.type === types_1.LineType.CONTEXT && oldLines.length > 0) {
            blockLinesGroups.push([[], oldLines, newLines]);
            oldLines = [];
            newLines = [];
          }
          if (diffLine.type === types_1.LineType.CONTEXT) {
            blockLinesGroups.push([[diffLine], [], []]);
          } else if (diffLine.type === types_1.LineType.INSERT && oldLines.length === 0) {
            blockLinesGroups.push([[], [], [diffLine]]);
          } else if (diffLine.type === types_1.LineType.INSERT && oldLines.length > 0) {
            newLines.push(diffLine);
          } else if (diffLine.type === types_1.LineType.DELETE) {
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
      applyRematchMatching(oldLines, newLines, matcher) {
        const comparisons = oldLines.length * newLines.length;
        const maxLineSizeInBlock = (0, utils_1.max)(oldLines.concat(newLines).map((elem) => elem.content.length));
        const doMatching = comparisons < this.config.matchingMaxComparisons && maxLineSizeInBlock < this.config.maxLineSizeInBlockForComparison && (this.config.matching === "lines" || this.config.matching === "words");
        return doMatching ? matcher(oldLines, newLines) : [[oldLines, newLines]];
      }
      processChangedLines(file2, isCombined, oldLines, newLines) {
        const fileHtml = {
          right: "",
          left: ""
        };
        const maxLinesNumber = Math.max(oldLines.length, newLines.length);
        for (let i = 0; i < maxLinesNumber; i++) {
          const oldLine = oldLines[i];
          const newLine = newLines[i];
          const diff = oldLine !== void 0 && newLine !== void 0 ? renderUtils.diffHighlight(oldLine.content, newLine.content, isCombined, this.config) : void 0;
          const preparedOldLine = oldLine !== void 0 && oldLine.oldNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
            prefix: diff.oldLine.prefix,
            content: diff.oldLine.content,
            type: renderUtils.CSSLineClass.DELETE_CHANGES
          } : Object.assign(Object.assign({}, renderUtils.deconstructLine(oldLine.content, isCombined)), { type: renderUtils.toCSSClass(oldLine.type) })), { oldNumber: oldLine.oldNumber, newNumber: oldLine.newNumber }) : void 0;
          const preparedNewLine = newLine !== void 0 && newLine.newNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
            prefix: diff.newLine.prefix,
            content: diff.newLine.content,
            type: renderUtils.CSSLineClass.INSERT_CHANGES
          } : Object.assign(Object.assign({}, renderUtils.deconstructLine(newLine.content, isCombined)), { type: renderUtils.toCSSClass(newLine.type) })), { oldNumber: newLine.oldNumber, newNumber: newLine.newNumber }) : void 0;
          const { left, right } = this.generateLineHtml(file2, preparedOldLine, preparedNewLine);
          fileHtml.left += left;
          fileHtml.right += right;
        }
        return fileHtml;
      }
      generateLineHtml(file2, oldLine, newLine) {
        return {
          left: this.generateSingleLineHtml(file2, oldLine),
          right: this.generateSingleLineHtml(file2, newLine)
        };
      }
      generateSingleLineHtml(file2, line) {
        if (line === void 0)
          return "";
        const lineNumberHtml = this.hoganUtils.render(baseTemplatesPath, "numbers", {
          oldNumber: line.oldNumber || "",
          newNumber: line.newNumber || ""
        });
        return this.hoganUtils.render(genericTemplatesPath, "line", {
          type: line.type,
          lineClass: "d2h-code-linenumber",
          contentClass: "d2h-code-line",
          prefix: line.prefix === " " ? "&nbsp;" : line.prefix,
          content: line.content,
          lineNumber: lineNumberHtml,
          line,
          file: file2
        });
      }
    };
    exports.default = LineByLineRenderer;
  }
});

// node_modules/diff2html/lib/side-by-side-renderer.js
var require_side_by_side_renderer = __commonJS({
  "node_modules/diff2html/lib/side-by-side-renderer.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultSideBySideRendererConfig = void 0;
    var Rematch = __importStar(require_rematch());
    var renderUtils = __importStar(require_render_utils());
    var types_1 = require_types();
    var utils_1 = require_utils();
    exports.defaultSideBySideRendererConfig = Object.assign(Object.assign({}, renderUtils.defaultRenderConfig), { renderNothingWhenEmpty: false, matchingMaxComparisons: 2500, maxLineSizeInBlockForComparison: 200 });
    var genericTemplatesPath = "generic";
    var baseTemplatesPath = "side-by-side";
    var iconsBaseTemplatesPath = "icon";
    var tagsBaseTemplatesPath = "tag";
    var SideBySideRenderer = class {
      constructor(hoganUtils, config2 = {}) {
        this.hoganUtils = hoganUtils;
        this.config = Object.assign(Object.assign({}, exports.defaultSideBySideRendererConfig), config2);
      }
      render(diffFiles) {
        const diffsHtml = diffFiles.map((file2) => {
          let diffs;
          if (file2.blocks.length) {
            diffs = this.generateFileHtml(file2);
          } else {
            diffs = this.generateEmptyDiff();
          }
          return this.makeFileDiffHtml(file2, diffs);
        }).join("\n");
        return this.hoganUtils.render(genericTemplatesPath, "wrapper", {
          colorScheme: renderUtils.colorSchemeToCss(this.config.colorScheme),
          content: diffsHtml
        });
      }
      makeFileDiffHtml(file2, diffs) {
        if (this.config.renderNothingWhenEmpty && Array.isArray(file2.blocks) && file2.blocks.length === 0)
          return "";
        const fileDiffTemplate = this.hoganUtils.template(baseTemplatesPath, "file-diff");
        const filePathTemplate = this.hoganUtils.template(genericTemplatesPath, "file-path");
        const fileIconTemplate = this.hoganUtils.template(iconsBaseTemplatesPath, "file");
        const fileTagTemplate = this.hoganUtils.template(tagsBaseTemplatesPath, renderUtils.getFileIcon(file2));
        return fileDiffTemplate.render({
          file: file2,
          fileHtmlId: renderUtils.getHtmlId(file2),
          diffs,
          filePath: filePathTemplate.render({
            fileDiffName: renderUtils.filenameDiff(file2)
          }, {
            fileIcon: fileIconTemplate,
            fileTag: fileTagTemplate
          })
        });
      }
      generateEmptyDiff() {
        return {
          right: "",
          left: this.hoganUtils.render(genericTemplatesPath, "empty-diff", {
            contentClass: "d2h-code-side-line",
            CSSLineClass: renderUtils.CSSLineClass
          })
        };
      }
      generateFileHtml(file2) {
        const matcher = Rematch.newMatcherFn(Rematch.newDistanceFn((e) => renderUtils.deconstructLine(e.content, file2.isCombined).content));
        return file2.blocks.map((block2) => {
          const fileHtml = {
            left: this.makeHeaderHtml(block2.header, file2),
            right: this.makeHeaderHtml("")
          };
          this.applyLineGroupping(block2).forEach(([contextLines, oldLines, newLines]) => {
            if (oldLines.length && newLines.length && !contextLines.length) {
              this.applyRematchMatching(oldLines, newLines, matcher).map(([oldLines2, newLines2]) => {
                const { left, right } = this.processChangedLines(file2.isCombined, oldLines2, newLines2);
                fileHtml.left += left;
                fileHtml.right += right;
              });
            } else if (contextLines.length) {
              contextLines.forEach((line) => {
                const { prefix, content } = renderUtils.deconstructLine(line.content, file2.isCombined);
                const { left, right } = this.generateLineHtml({
                  type: renderUtils.CSSLineClass.CONTEXT,
                  prefix,
                  content,
                  number: line.oldNumber
                }, {
                  type: renderUtils.CSSLineClass.CONTEXT,
                  prefix,
                  content,
                  number: line.newNumber
                });
                fileHtml.left += left;
                fileHtml.right += right;
              });
            } else if (oldLines.length || newLines.length) {
              const { left, right } = this.processChangedLines(file2.isCombined, oldLines, newLines);
              fileHtml.left += left;
              fileHtml.right += right;
            } else {
              console.error("Unknown state reached while processing groups of lines", contextLines, oldLines, newLines);
            }
          });
          return fileHtml;
        }).reduce((accomulated, html) => {
          return { left: accomulated.left + html.left, right: accomulated.right + html.right };
        }, { left: "", right: "" });
      }
      applyLineGroupping(block2) {
        const blockLinesGroups = [];
        let oldLines = [];
        let newLines = [];
        for (let i = 0; i < block2.lines.length; i++) {
          const diffLine = block2.lines[i];
          if (diffLine.type !== types_1.LineType.INSERT && newLines.length || diffLine.type === types_1.LineType.CONTEXT && oldLines.length > 0) {
            blockLinesGroups.push([[], oldLines, newLines]);
            oldLines = [];
            newLines = [];
          }
          if (diffLine.type === types_1.LineType.CONTEXT) {
            blockLinesGroups.push([[diffLine], [], []]);
          } else if (diffLine.type === types_1.LineType.INSERT && oldLines.length === 0) {
            blockLinesGroups.push([[], [], [diffLine]]);
          } else if (diffLine.type === types_1.LineType.INSERT && oldLines.length > 0) {
            newLines.push(diffLine);
          } else if (diffLine.type === types_1.LineType.DELETE) {
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
      applyRematchMatching(oldLines, newLines, matcher) {
        const comparisons = oldLines.length * newLines.length;
        const maxLineSizeInBlock = (0, utils_1.max)(oldLines.concat(newLines).map((elem) => elem.content.length));
        const doMatching = comparisons < this.config.matchingMaxComparisons && maxLineSizeInBlock < this.config.maxLineSizeInBlockForComparison && (this.config.matching === "lines" || this.config.matching === "words");
        return doMatching ? matcher(oldLines, newLines) : [[oldLines, newLines]];
      }
      makeHeaderHtml(blockHeader, file2) {
        return this.hoganUtils.render(genericTemplatesPath, "block-header", {
          CSSLineClass: renderUtils.CSSLineClass,
          blockHeader: (file2 === null || file2 === void 0 ? void 0 : file2.isTooBig) ? blockHeader : renderUtils.escapeForHtml(blockHeader),
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
          const diff = oldLine !== void 0 && newLine !== void 0 ? renderUtils.diffHighlight(oldLine.content, newLine.content, isCombined, this.config) : void 0;
          const preparedOldLine = oldLine !== void 0 && oldLine.oldNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
            prefix: diff.oldLine.prefix,
            content: diff.oldLine.content,
            type: renderUtils.CSSLineClass.DELETE_CHANGES
          } : Object.assign(Object.assign({}, renderUtils.deconstructLine(oldLine.content, isCombined)), { type: renderUtils.toCSSClass(oldLine.type) })), { number: oldLine.oldNumber }) : void 0;
          const preparedNewLine = newLine !== void 0 && newLine.newNumber !== void 0 ? Object.assign(Object.assign({}, diff !== void 0 ? {
            prefix: diff.newLine.prefix,
            content: diff.newLine.content,
            type: renderUtils.CSSLineClass.INSERT_CHANGES
          } : Object.assign(Object.assign({}, renderUtils.deconstructLine(newLine.content, isCombined)), { type: renderUtils.toCSSClass(newLine.type) })), { number: newLine.newNumber }) : void 0;
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
      generateSingleHtml(line) {
        const lineClass = "d2h-code-side-linenumber";
        const contentClass = "d2h-code-side-line";
        return this.hoganUtils.render(genericTemplatesPath, "line", {
          type: (line === null || line === void 0 ? void 0 : line.type) || `${renderUtils.CSSLineClass.CONTEXT} d2h-emptyplaceholder`,
          lineClass: line !== void 0 ? lineClass : `${lineClass} d2h-code-side-emptyplaceholder`,
          contentClass: line !== void 0 ? contentClass : `${contentClass} d2h-code-side-emptyplaceholder`,
          prefix: (line === null || line === void 0 ? void 0 : line.prefix) === " " ? "&nbsp;" : line === null || line === void 0 ? void 0 : line.prefix,
          content: line === null || line === void 0 ? void 0 : line.content,
          lineNumber: line === null || line === void 0 ? void 0 : line.number
        });
      }
    };
    exports.default = SideBySideRenderer;
  }
});

// node_modules/@profoundlogic/hogan/lib/compiler.js
var require_compiler = __commonJS({
  "node_modules/@profoundlogic/hogan/lib/compiler.js"(exports) {
    init_define_GRAMMARS();
    (function(Hogan2) {
      var rIsWhitespace = /\S/, rQuot = /\"/g, rNewline = /\n/g, rCr = /\r/g, rSlash = /\\/g, rLineSep = /\u2028/, rParagraphSep = /\u2029/;
      Hogan2.tags = {
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
      Hogan2.scan = function scan(text2, delimiters) {
        var len = text2.length, IN_TEXT = 0, IN_TAG_TYPE = 1, IN_TAG = 2, state = IN_TEXT, tagType = null, tag = null, buf = "", tokens = [], seenTag = false, i = 0, lineStart = 0, otag = "{{", ctag = "}}";
        function addBuf() {
          if (buf.length > 0) {
            tokens.push({ tag: "_t", text: new String(buf) });
            buf = "";
          }
        }
        function lineIsWhitespace() {
          var isAllWhitespace = true;
          for (var j = lineStart; j < tokens.length; j++) {
            isAllWhitespace = Hogan2.tags[tokens[j].tag] < Hogan2.tags["_v"] || tokens[j].tag == "_t" && tokens[j].text.match(rIsWhitespace) === null;
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
          if (state == IN_TEXT) {
            if (tagChange(otag, text2, i)) {
              --i;
              addBuf();
              state = IN_TAG_TYPE;
            } else {
              if (text2.charAt(i) == "\n") {
                filterLine(seenTag);
              } else {
                buf += text2.charAt(i);
              }
            }
          } else if (state == IN_TAG_TYPE) {
            i += otag.length - 1;
            tag = Hogan2.tags[text2.charAt(i + 1)];
            tagType = tag ? text2.charAt(i + 1) : "_v";
            if (tagType == "=") {
              i = changeDelimiters(text2, i);
              state = IN_TEXT;
            } else {
              if (tag) {
                i++;
              }
              state = IN_TAG;
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
              state = IN_TEXT;
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
      function cleanTripleStache(token) {
        if (token.n.substr(token.n.length - 1) === "}") {
          token.n = token.n.substring(0, token.n.length - 1);
        }
      }
      function trim(s) {
        if (s.trim) {
          return s.trim();
        }
        return s.replace(/^\s*|\s*$/g, "");
      }
      function tagChange(tag, text2, index) {
        if (text2.charAt(index) != tag.charAt(0)) {
          return false;
        }
        for (var i = 1, l = tag.length; i < l; i++) {
          if (text2.charAt(index + i) != tag.charAt(i)) {
            return false;
          }
        }
        return true;
      }
      var allowedInSuper = { "_t": true, "\n": true, "$": true, "/": true };
      function buildTree(tokens, kind, stack, customTags) {
        var instructions = [], opener = null, tail = null, token = null;
        tail = stack[stack.length - 1];
        while (tokens.length > 0) {
          token = tokens.shift();
          if (tail && tail.tag == "<" && !(token.tag in allowedInSuper)) {
            throw new Error("Illegal content in < super tag.");
          }
          if (Hogan2.tags[token.tag] <= Hogan2.tags["$"] || isOpener(token, customTags)) {
            stack.push(token);
            token.nodes = buildTree(tokens, token.tag, stack, customTags);
          } else if (token.tag == "/") {
            if (stack.length === 0) {
              throw new Error("Closing tag without opener: /" + token.n);
            }
            opener = stack.pop();
            if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
              throw new Error("Nesting error: " + opener.n + " vs. " + token.n);
            }
            opener.end = token.i;
            return instructions;
          } else if (token.tag == "\n") {
            token.last = tokens.length == 0 || tokens[0].tag == "\n";
          }
          instructions.push(token);
        }
        if (stack.length > 0) {
          throw new Error("missing closing tag: " + stack.pop().n);
        }
        return instructions;
      }
      function isOpener(token, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].o == token.n) {
            token.tag = "#";
            return true;
          }
        }
      }
      function isCloser(close, open2, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].c == close && tags[i].o == open2) {
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
      Hogan2.stringify = function(codeObj, text2, options) {
        return "{code: function (c,p,i) { " + Hogan2.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) + "}";
      };
      var serialNo = 0;
      Hogan2.generate = function(tree, text2, options) {
        serialNo = 0;
        var context = { code: "", subs: {}, partials: {} };
        Hogan2.walk(tree, context);
        if (options.asString) {
          return this.stringify(context, text2, options);
        }
        return this.makeTemplate(context, text2, options);
      };
      Hogan2.wrapMain = function(code2) {
        return 'var t=this;t.b(i=i||"");' + code2 + "return t.fl();";
      };
      Hogan2.template = Hogan2.Template;
      Hogan2.makeTemplate = function(codeObj, text2, options) {
        var template = this.makePartials(codeObj);
        template.code = new Function("c", "p", "i", this.wrapMain(codeObj.code));
        return new this.template(template, text2, this, options);
      };
      Hogan2.makePartials = function(codeObj) {
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
      Hogan2.codegen = {
        "#": function(node, context) {
          context.code += "if(t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,0,' + node.i + "," + node.end + ',"' + node.otag + " " + node.ctag + '")){t.rs(c,p,function(c,p,t){';
          Hogan2.walk(node.nodes, context);
          context.code += "});c.pop();}";
        },
        "^": function(node, context) {
          context.code += "if(!t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
          Hogan2.walk(node.nodes, context);
          context.code += "};";
        },
        ">": createPartial,
        "<": function(node, context) {
          var ctx = { partials: {}, code: "", subs: {}, inPartial: true };
          Hogan2.walk(node.nodes, ctx);
          var template = context.partials[createPartial(node, context)];
          template.subs = ctx.subs;
          template.partials = ctx.partials;
        },
        "$": function(node, context) {
          var ctx = { subs: {}, code: "", partials: context.partials, prefix: node.n };
          Hogan2.walk(node.nodes, ctx);
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
      Hogan2.walk = function(nodelist, context) {
        var func;
        for (var i = 0, l = nodelist.length; i < l; i++) {
          func = Hogan2.codegen[nodelist[i].tag];
          func && func(nodelist[i], context);
        }
        return context;
      };
      Hogan2.parse = function(tokens, text2, options) {
        options = options || {};
        return buildTree(tokens, "", [], options.sectionTags || []);
      };
      Hogan2.cache = {};
      Hogan2.cacheKey = function(text2, options) {
        return [text2, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join("||");
      };
      Hogan2.compile = function(text2, options) {
        options = options || {};
        var key2 = Hogan2.cacheKey(text2, options);
        var template = this.cache[key2];
        if (template) {
          var partials = template.partials;
          for (var name2 in partials) {
            delete partials[name2].instance;
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
    init_define_GRAMMARS();
    var Hogan2 = {};
    (function(Hogan3) {
      Hogan3.Template = function(codeObj, text2, compiler, options) {
        codeObj = codeObj || {};
        this.r = codeObj.code || this.r;
        this.c = compiler;
        this.options = options || {};
        this.text = text2 || "";
        this.partials = codeObj.partials || {};
        this.subs = codeObj.subs || {};
        this.buf = "";
      };
      Hogan3.Template.prototype = {
        // render: replaced by generated code.
        r: function(context, partials, indent) {
          return "";
        },
        // variable escaping
        v: hoganEscape,
        // triple stache
        t: coerceToString,
        render: function render(context, partials, indent) {
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
        s: function(val, ctx, partials, inverted, start3, end, tags) {
          var pass;
          if (isArray(val) && val.length === 0) {
            return false;
          }
          if (typeof val == "function") {
            val = this.ms(val, ctx, partials, inverted, start3, end, tags);
          }
          pass = !!val;
          if (!inverted && pass && ctx) {
            ctx.push(typeof val == "object" ? val : ctx[ctx.length - 1]);
          }
          return pass;
        },
        // find values with dotted names
        d: function(key2, ctx, partials, returnFound) {
          var found, names = key2.split("."), val = this.f(names[0], ctx, partials, returnFound), doModelGet = this.options.modelGet, cx = null;
          if (key2 === "." && isArray(ctx[ctx.length - 2])) {
            val = ctx[ctx.length - 1];
          } else {
            for (var i = 1; i < names.length; i++) {
              found = findInScope(names[i], val, doModelGet);
              if (found !== void 0) {
                cx = val;
                val = found;
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
          var val = false, v = null, found = false, doModelGet = this.options.modelGet;
          for (var i = ctx.length - 1; i >= 0; i--) {
            v = ctx[i];
            val = findInScope(key2, v, doModelGet);
            if (val !== void 0) {
              found = true;
              break;
            }
          }
          if (!found) {
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
        ms: function(func, ctx, partials, inverted, start3, end, tags) {
          var textSource, cx = ctx[ctx.length - 1], result = func.call(cx);
          if (typeof result == "function") {
            if (inverted) {
              return true;
            } else {
              textSource = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text;
              return this.ls(result, cx, ctx, partials, textSource.substring(start3, end), tags);
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
        sub: function(name2, context, partials, indent) {
          var f = this.subs[name2];
          if (f) {
            this.activeSub = name2;
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
    })(typeof exports !== "undefined" ? exports : Hogan2);
  }
});

// node_modules/@profoundlogic/hogan/lib/hogan.js
var require_hogan = __commonJS({
  "node_modules/@profoundlogic/hogan/lib/hogan.js"(exports, module) {
    init_define_GRAMMARS();
    var Hogan2 = require_compiler();
    Hogan2.Template = require_template().Template;
    Hogan2.template = Hogan2.Template;
    module.exports = Hogan2;
  }
});

// node_modules/diff2html/lib/diff2html-templates.js
var require_diff2html_templates = __commonJS({
  "node_modules/diff2html/lib/diff2html-templates.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultTemplates = void 0;
    var Hogan2 = __importStar(require_hogan());
    exports.defaultTemplates = {};
    exports.defaultTemplates["file-summary-line"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["file-summary-wrapper"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["generic-block-header"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["generic-empty-diff"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["generic-file-path"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["generic-line"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["generic-wrapper"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["icon-file-added"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["icon-file-changed"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["icon-file-deleted"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["icon-file-renamed"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["icon-file"] = new Hogan2.Template({ code: function(c, p, i) {
      var t = this;
      t.b(i = i || "");
      t.b('<svg aria-hidden="true" class="d2h-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">');
      t.b("\n" + i);
      t.b('    <path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z"></path>');
      t.b("\n" + i);
      t.b("</svg>");
      return t.fl();
    }, partials: {}, subs: {} });
    exports.defaultTemplates["line-by-line-file-diff"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["line-by-line-numbers"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["side-by-side-file-diff"] = new Hogan2.Template({ code: function(c, p, i) {
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
    exports.defaultTemplates["tag-file-added"] = new Hogan2.Template({ code: function(c, p, i) {
      var t = this;
      t.b(i = i || "");
      t.b('<span class="d2h-tag d2h-added d2h-added-tag">ADDED</span>');
      return t.fl();
    }, partials: {}, subs: {} });
    exports.defaultTemplates["tag-file-changed"] = new Hogan2.Template({ code: function(c, p, i) {
      var t = this;
      t.b(i = i || "");
      t.b('<span class="d2h-tag d2h-changed d2h-changed-tag">CHANGED</span>');
      return t.fl();
    }, partials: {}, subs: {} });
    exports.defaultTemplates["tag-file-deleted"] = new Hogan2.Template({ code: function(c, p, i) {
      var t = this;
      t.b(i = i || "");
      t.b('<span class="d2h-tag d2h-deleted d2h-deleted-tag">DELETED</span>');
      return t.fl();
    }, partials: {}, subs: {} });
    exports.defaultTemplates["tag-file-renamed"] = new Hogan2.Template({ code: function(c, p, i) {
      var t = this;
      t.b(i = i || "");
      t.b('<span class="d2h-tag d2h-moved d2h-moved-tag">RENAMED</span>');
      return t.fl();
    }, partials: {}, subs: {} });
  }
});

// node_modules/diff2html/lib/hoganjs-utils.js
var require_hoganjs_utils = __commonJS({
  "node_modules/diff2html/lib/hoganjs-utils.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var Hogan2 = __importStar(require_hogan());
    var diff2html_templates_1 = require_diff2html_templates();
    var HoganJsUtils = class {
      constructor({ compiledTemplates = {}, rawTemplates = {} }) {
        const compiledRawTemplates = Object.entries(rawTemplates).reduce((previousTemplates, [name2, templateString]) => {
          const compiledTemplate = Hogan2.compile(templateString, { asString: false });
          return Object.assign(Object.assign({}, previousTemplates), { [name2]: compiledTemplate });
        }, {});
        this.preCompiledTemplates = Object.assign(Object.assign(Object.assign({}, diff2html_templates_1.defaultTemplates), compiledTemplates), compiledRawTemplates);
      }
      static compile(templateString) {
        return Hogan2.compile(templateString, { asString: false });
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
    exports.default = HoganJsUtils;
  }
});

// node_modules/diff2html/lib/diff2html.js
var require_diff2html = __commonJS({
  "node_modules/diff2html/lib/diff2html.js"(exports) {
    "use strict";
    init_define_GRAMMARS();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultDiff2HtmlConfig = void 0;
    exports.parse = parse2;
    exports.html = html;
    var DiffParser = __importStar(require_diff_parser());
    var file_list_renderer_1 = require_file_list_renderer();
    var line_by_line_renderer_1 = __importStar(require_line_by_line_renderer());
    var side_by_side_renderer_1 = __importStar(require_side_by_side_renderer());
    var types_1 = require_types();
    var hoganjs_utils_1 = __importDefault(require_hoganjs_utils());
    exports.defaultDiff2HtmlConfig = Object.assign(Object.assign(Object.assign({}, line_by_line_renderer_1.defaultLineByLineRendererConfig), side_by_side_renderer_1.defaultSideBySideRendererConfig), { outputFormat: types_1.OutputFormatType.LINE_BY_LINE, drawFileList: true });
    function parse2(diffInput, configuration = {}) {
      return DiffParser.parse(diffInput, Object.assign(Object.assign({}, exports.defaultDiff2HtmlConfig), configuration));
    }
    function html(diffInput, configuration = {}) {
      const config2 = Object.assign(Object.assign({}, exports.defaultDiff2HtmlConfig), configuration);
      const diffJson = typeof diffInput === "string" ? DiffParser.parse(diffInput, config2) : diffInput;
      const hoganUtils = new hoganjs_utils_1.default(config2);
      const { colorScheme } = config2;
      const fileListRendererConfig = { colorScheme };
      const fileList = config2.drawFileList ? new file_list_renderer_1.FileListRenderer(hoganUtils, fileListRendererConfig).render(diffJson) : "";
      const diffOutput = config2.outputFormat === "side-by-side" ? new side_by_side_renderer_1.default(hoganUtils, config2).render(diffJson) : new line_by_line_renderer_1.default(hoganUtils, config2).render(diffJson);
      return fileList + diffOutput;
    }
  }
});

// src/cli.ts
init_define_GRAMMARS();
import { spawnSync as spawnSync4 } from "node:child_process";
import fs12 from "node:fs";
import path13 from "node:path";
import { parseArgs as parseArgs2 } from "node:util";

// src/change.ts
init_define_GRAMMARS();
import { execFile, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

// src/diff.ts
init_define_GRAMMARS();

// node_modules/diff2html/lib-esm/diff-parser.js
init_define_GRAMMARS();

// node_modules/diff2html/lib-esm/types.js
init_define_GRAMMARS();
var LineType;
(function(LineType2) {
  LineType2["INSERT"] = "insert";
  LineType2["DELETE"] = "delete";
  LineType2["CONTEXT"] = "context";
})(LineType || (LineType = {}));
var ColorSchemeType;
(function(ColorSchemeType2) {
  ColorSchemeType2["AUTO"] = "auto";
  ColorSchemeType2["DARK"] = "dark";
  ColorSchemeType2["LIGHT"] = "light";
})(ColorSchemeType || (ColorSchemeType = {}));

// node_modules/diff2html/lib-esm/utils.js
init_define_GRAMMARS();
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

// node_modules/diff2html/lib-esm/diff-parser.js
function getExtension(filename, language) {
  const filenameParts = filename.split(".");
  return filenameParts.length > 1 ? filenameParts[filenameParts.length - 1] : language;
}
function startsWithAny(str, prefixes) {
  return prefixes.reduce((startsWith, prefix) => startsWith || str.startsWith(prefix), false);
}
var baseDiffFilenamePrefixes = ["a/", "b/", "i/", "w/", "c/", "o/"];
function getFilename(line, linePrefix, extraPrefix) {
  const prefixes = extraPrefix !== void 0 ? [...baseDiffFilenamePrefixes, extraPrefix] : baseDiffFilenamePrefixes;
  const FilenameRegExp = linePrefix ? new RegExp(`^${escapeForRegExp(linePrefix)} "?(.+?)"?$`) : new RegExp('^"?(.+?)"?$');
  const [, filename = ""] = FilenameRegExp.exec(line) || [];
  const matchingPrefix = prefixes.find((p) => filename.indexOf(p) === 0);
  const fnameWithoutPrefix = matchingPrefix ? filename.slice(matchingPrefix.length) : filename;
  return fnameWithoutPrefix.replace(/\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)? [+-]\d{4}.*$/, "");
}
function getSrcFilename(line, srcPrefix) {
  return getFilename(line, "---", srcPrefix);
}
function getDstFilename(line, dstPrefix) {
  return getFilename(line, "+++", dstPrefix);
}
function parse(diffInput, config2 = {}) {
  const files3 = [];
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
        files3.push(currentFile);
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
  function startBlock(line) {
    saveBlock();
    let values;
    if (currentFile !== null) {
      if (values = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/.exec(line)) {
        currentFile.isCombined = false;
        oldLine = parseInt(values[1], 10);
        newLine = parseInt(values[2], 10);
      } else if (values = /^@@@ -(\d+)(?:,\d+)? -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@@.*/.exec(line)) {
        currentFile.isCombined = true;
        oldLine = parseInt(values[1], 10);
        oldLine2 = parseInt(values[2], 10);
        newLine = parseInt(values[3], 10);
      } else {
        if (line.startsWith(hunkHeaderPrefix)) {
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
      header: line
    };
  }
  function createLine(line) {
    if (currentFile === null || currentBlock === null || oldLine === null || newLine === null)
      return;
    const currentLine = {
      content: line
    };
    const addedPrefixes = currentFile.isCombined ? ["+ ", " +", "++"] : ["+"];
    const deletedPrefixes = currentFile.isCombined ? ["- ", " -", "--"] : ["-"];
    if (startsWithAny(line, addedPrefixes)) {
      currentFile.addedLines++;
      currentLine.type = LineType.INSERT;
      currentLine.oldNumber = void 0;
      currentLine.newNumber = newLine++;
    } else if (startsWithAny(line, deletedPrefixes)) {
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
  function existHunkHeader(line, lineIdx) {
    let idx = lineIdx;
    while (idx < diffLines.length - 3) {
      if (line.startsWith("diff")) {
        return false;
      }
      if (diffLines[idx].startsWith(oldFileNameHeader) && diffLines[idx + 1].startsWith(newFileNameHeader) && diffLines[idx + 2].startsWith(hunkHeaderPrefix)) {
        return true;
      }
      idx++;
    }
    return false;
  }
  diffLines.forEach((line, lineIndex) => {
    if (!line || line.startsWith("*")) {
      return;
    }
    let values;
    const prevLine = diffLines[lineIndex - 1];
    const nxtLine = diffLines[lineIndex + 1];
    const afterNxtLine = diffLines[lineIndex + 2];
    if (line.startsWith("diff --git") || line.startsWith("diff --combined")) {
      startFile();
      const gitDiffStart = /^diff --git "?([a-ciow]\/.+)"? "?([a-ciow]\/.+)"?/;
      if (values = gitDiffStart.exec(line)) {
        possibleOldName = getFilename(values[1], void 0, config2.dstPrefix);
        possibleNewName = getFilename(values[2], void 0, config2.srcPrefix);
      }
      if (currentFile === null) {
        throw new Error("Where is my file !!!");
      }
      currentFile.isGitDiff = true;
      return;
    }
    if (line.startsWith("Binary files") && !(currentFile === null || currentFile === void 0 ? void 0 : currentFile.isGitDiff)) {
      startFile();
      const unixDiffBinaryStart = /^Binary files "?([a-ciow]\/.+)"? and "?([a-ciow]\/.+)"? differ/;
      if (values = unixDiffBinaryStart.exec(line)) {
        possibleOldName = getFilename(values[1], void 0, config2.dstPrefix);
        possibleNewName = getFilename(values[2], void 0, config2.srcPrefix);
      }
      if (currentFile === null) {
        throw new Error("Where is my file !!!");
      }
      currentFile.isBinary = true;
      return;
    }
    if (!currentFile || !currentFile.isGitDiff && currentFile && line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) && afterNxtLine.startsWith(hunkHeaderPrefix)) {
      startFile();
    }
    if (currentFile === null || currentFile === void 0 ? void 0 : currentFile.isTooBig) {
      return;
    }
    if (currentFile && (typeof config2.diffMaxChanges === "number" && currentFile.addedLines + currentFile.deletedLines > config2.diffMaxChanges || typeof config2.diffMaxLineLength === "number" && line.length > config2.diffMaxLineLength)) {
      currentFile.isTooBig = true;
      currentFile.addedLines = 0;
      currentFile.deletedLines = 0;
      currentFile.blocks = [];
      currentBlock = null;
      const message = typeof config2.diffTooBigMessage === "function" ? config2.diffTooBigMessage(files3.length) : "Diff too big to be displayed";
      startBlock(message);
      return;
    }
    if (line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) || line.startsWith(newFileNameHeader) && prevLine.startsWith(oldFileNameHeader)) {
      if (currentFile && !currentFile.oldName && line.startsWith("--- ") && (values = getSrcFilename(line, config2.srcPrefix))) {
        currentFile.oldName = values;
        currentFile.language = getExtension(currentFile.oldName, currentFile.language);
        return;
      }
      if (currentFile && !currentFile.newName && line.startsWith("+++ ") && (values = getDstFilename(line, config2.dstPrefix))) {
        currentFile.newName = values;
        currentFile.language = getExtension(currentFile.newName, currentFile.language);
        return;
      }
    }
    if (currentFile && (line.startsWith(hunkHeaderPrefix) || currentFile.isGitDiff && currentFile.oldName && currentFile.newName && !currentBlock)) {
      startBlock(line);
      return;
    }
    if (currentBlock && (line.startsWith("+") || line.startsWith("-") || line.startsWith(" "))) {
      createLine(line);
      return;
    }
    const doesNotExistHunkHeader = !existHunkHeader(line, lineIndex);
    if (currentFile === null) {
      throw new Error("Where is my file !!!");
    }
    if (values = oldMode.exec(line)) {
      currentFile.oldMode = values[1];
    } else if (values = newMode.exec(line)) {
      currentFile.newMode = values[1];
    } else if (values = deletedFileMode.exec(line)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    } else if (values = newFileMode.exec(line)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = copyFrom.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = copyTo.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = renameFrom.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = renameTo.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = binaryFiles.exec(line)) {
      currentFile.isBinary = true;
      currentFile.oldName = getFilename(values[1], void 0, config2.srcPrefix);
      currentFile.newName = getFilename(values[2], void 0, config2.dstPrefix);
      startBlock("Binary file");
    } else if (binaryDiff.test(line)) {
      currentFile.isBinary = true;
      startBlock(line);
    } else if (values = similarityIndex.exec(line)) {
      currentFile.unchangedPercentage = parseInt(values[1], 10);
    } else if (values = dissimilarityIndex.exec(line)) {
      currentFile.changedPercentage = parseInt(values[1], 10);
    } else if (values = index.exec(line)) {
      currentFile.checksumBefore = values[1];
      currentFile.checksumAfter = values[2];
      if (values[3])
        currentFile.mode = values[3];
    } else if (values = combinedIndex.exec(line)) {
      currentFile.checksumBefore = [values[2], values[3]];
      currentFile.checksumAfter = values[1];
    } else if (values = combinedMode.exec(line)) {
      currentFile.oldMode = [values[2], values[3]];
      currentFile.newMode = values[1];
    } else if (values = combinedNewFile.exec(line)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = combinedDeletedFile.exec(line)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    }
  });
  saveBlock();
  saveFile();
  return files3;
}

// src/diff.ts
var encoder = new TextEncoder();
var ESCAPED = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34, "\\": 92 };
function pathOf(name2) {
  const padless = name2.replace(/\t$/, "");
  if (!padless.includes("\\")) return padless;
  const bytes = [];
  for (let at = 0; at < padless.length; at++) {
    const char = padless.charAt(at);
    if (char === '"') continue;
    if (char !== "\\") bytes.push(...encoder.encode(char));
    else if (/^[0-7]{3}$/.test(padless.slice(at + 1, at + 4))) {
      bytes.push(parseInt(padless.slice(at + 1, at + 4), 8));
      at += 3;
    } else bytes.push(ESCAPED[padless.charAt(++at)] ?? 92);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}
var parseDiff = (diff) => parse(diff).map((file2) => ({ ...file2, oldName: pathOf(file2.oldName), newName: pathOf(file2.newName) }));

// src/change.ts
function git(cwd, ...args) {
  return gitWith(cwd, void 0, ...args);
}
var MAX_BUFFER = 256 * 1024 * 1024;
function gitWith(cwd, input, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", input, maxBuffer: MAX_BUFFER });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  return result.stdout;
}
var execGit = promisify(execFile);
async function gitAsync(cwd, ...args) {
  try {
    return (await execGit("git", args, { cwd, encoding: "utf8", maxBuffer: MAX_BUFFER })).stdout;
  } catch (error) {
    throw new Error(error.stderr?.trim() || `git ${args.join(" ")} failed`);
  }
}
var commonDir = (cwd) => fs.realpathSync(git(cwd, "rev-parse", "--path-format=absolute", "--git-common-dir").trim());
function currentRepo(cwd) {
  const common = commonDir(cwd);
  const hash2 = crypto.createHash("sha256").update(common).digest("hex").slice(0, 8);
  return `${path.basename(path.dirname(common))}-${hash2}`;
}
function currentBranch(cwd) {
  const branch = git(cwd, "branch", "--show-current").trim();
  if (!branch) throw new Error("not on a branch; check out the branch to walk through, or pass --base and --head");
  return branch;
}
function commitOf(cwd, rev) {
  try {
    return git(cwd, "rev-parse", "--verify", "--quiet", `${rev}^{commit}`).trim();
  } catch {
    return null;
  }
}
function branchOf(cwd, rev) {
  const name2 = git(cwd, "rev-parse", "--symbolic-full-name", rev).trim();
  return /^refs\/(heads|remotes)\//.test(name2) ? name2.replace(/^refs\/(heads|remotes)\//, "") : null;
}
async function changeOf(cwd, source) {
  const range = source.kind === "range";
  const target = range ? source.base : source.target ? targetBranch(cwd, source.target) : defaultTarget(cwd);
  if (!commitOf(cwd, target))
    throw new Error(range ? `there is no commit ${target}` : `there is no ${target}; pass --target <branch>`);
  const head = commitOf(cwd, range ? source.head : "HEAD");
  if (!head) throw new Error(range ? `there is no commit ${source.head}` : `${source.branch} has no commit yet`);
  let base;
  try {
    base = git(cwd, "merge-base", target, head).trim();
  } catch {
    const shallow = git(cwd, "rev-parse", "--is-shallow-repository").trim() === "true";
    throw new Error(
      `${target} and ${range ? source.head : source.branch} share no history${shallow ? " this clone has; it is shallow, so run git fetch --unshallow first" : ""}`
    );
  }
  if ((await changedFiles(cwd, base, head)).length === 0)
    throw new Error(`nothing changed from ${target} to ${range ? source.head : source.branch}`);
  return {
    target: range ? branchOf(cwd, target) ?? commitOf(cwd, target) ?? target : target,
    base,
    head,
    uncommitted: commitOf(cwd, "HEAD") === head ? git(cwd, "status", "--porcelain").split("\n").filter(Boolean).length : 0
  };
}
async function changedFiles(cwd, base, head) {
  const fields = (await gitAsync(cwd, "diff", "--name-status", "-z", "-M", "--no-ext-diff", base, head)).split("\0");
  const files3 = [];
  for (let at = 0; at < fields.length - 1; ) {
    const status2 = fields[at++] ?? "";
    const first = fields[at++] ?? "";
    if (status2.startsWith("R")) files3.push({ path: fields[at++] ?? "", from: first });
    else files3.push({ path: first });
  }
  return files3;
}
function fileStats(cwd, base, head) {
  const fields = git(cwd, "diff", "--numstat", "-z", "-M", "--no-ext-diff", base, head).split("\0");
  const stats = [];
  for (let at = 0; at < fields.length - 1; ) {
    const [added = "", deleted = "", name2 = ""] = (fields[at++] ?? "").split("	");
    const path14 = name2 || (at += 2, fields[at - 1] ?? "");
    stats.push(added === "-" ? { path: path14 } : { path: path14, additions: Number(added), deletions: Number(deleted) });
  }
  return stats;
}
var orderOf = (files3) => files3.map((file2) => file2.path.replace(/[\\*?[\]#!]/g, "\\$&")).join("\n");
async function diffOf(cwd, base, head, files3) {
  if (files3.length === 0) return "";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "walkthrough-order-"));
  const order = path.join(dir, "order");
  fs.writeFileSync(order, orderOf(files3), { mode: 384 });
  try {
    return await gitAsync(
      cwd,
      "diff",
      "--no-color",
      "--no-ext-diff",
      "-M",
      `-O${order}`,
      base,
      head,
      "--",
      ...files3.flatMap((file2) => file2.from ? [file2.from, file2.path] : [file2.path]).map((one) => `:(top,literal)${one}`)
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
function changesBetween(cwd, from, to) {
  if (!commitOf(cwd, from)) return null;
  const files3 = {};
  for (const one of git(cwd, "diff", "--no-color", "--no-ext-diff", "-M", from, to).split(/^(?=diff --git )/m)) {
    const [file2] = parseDiff(one);
    if (file2) files3[file2.isDeleted ? file2.oldName : file2.newName] = one;
  }
  return { commits: Number(git(cwd, "rev-list", "--count", `${from}..${to}`).trim()), files: files3 };
}
function fileAt(cwd, rev, file2) {
  const result = spawnSync("git", ["cat-file", "blob", `${rev}:${file2}`], { cwd, maxBuffer: 256 * 1024 * 1024 });
  return result.status === 0 ? result.stdout : null;
}
var targetBranch = (cwd, name2) => !commitOf(cwd, `origin/${name2}`) && commitOf(cwd, `refs/heads/${name2}`) ? name2 : `origin/${name2}`;
function defaultTarget(cwd) {
  try {
    return git(cwd, "symbolic-ref", "--short", "refs/remotes/origin/HEAD").trim();
  } catch {
    return "origin/main";
  }
}

// src/prune.ts
init_define_GRAMMARS();
import { spawnSync as spawnSync3 } from "node:child_process";
import fs9 from "node:fs";
import path10 from "node:path";

// src/json-files.ts
init_define_GRAMMARS();
var import_proper_lockfile = __toESM(require_proper_lockfile(), 1);
import fs2 from "node:fs";
import path2 from "node:path";
function readJson(file2, fallback) {
  try {
    return readSavedJson(file2) ?? fallback;
  } catch {
    return fallback;
  }
}
function readSavedJson(file2) {
  try {
    return JSON.parse(fs2.readFileSync(file2, "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    if (error.code === "ENOENT") return void 0;
    throw new Error(`cannot read ${file2}: ${error.message}`);
  }
}
function writeJson(file2, value) {
  fs2.mkdirSync(path2.dirname(file2), { recursive: true, mode: 448 });
  const beside = `${file2}.${String(process.pid)}.tmp`;
  const fd = fs2.openSync(beside, "w", 384);
  try {
    fs2.writeFileSync(fd, `${JSON.stringify(value, null, 2)}
`);
    fs2.fsyncSync(fd);
  } finally {
    fs2.closeSync(fd);
  }
  fs2.renameSync(beside, file2);
}
async function locked(file2, work, stale = 1e4) {
  fs2.mkdirSync(path2.dirname(file2), { recursive: true, mode: 448 });
  const release = await (0, import_proper_lockfile.lock)(file2, { realpath: false, stale, retries: { forever: true, minTimeout: 10, maxTimeout: 100 } });
  try {
    return await work();
  } finally {
    await release();
  }
}

// src/paths.ts
init_define_GRAMMARS();
import fs3 from "node:fs";
import os2 from "node:os";
import path3 from "node:path";
var outsideOwn = (dir) => {
  if (!process.env["WALKTHROUGH_TEST_SANDBOX"]) return dir;
  const own2 = path3.join(os2.userInfo().homedir, ".local", "state", "walkthrough");
  const full = path3.resolve(dir);
  if (full === own2 || full.startsWith(own2 + path3.sep)) throw new Error(`a test reached ${full}; tests keep to their sandbox`);
  return dir;
};
var stateDir = () => outsideOwn(
  process.env["WALKTHROUGH_STATE"] || path3.join(process.env["XDG_STATE_HOME"] || path3.join(os2.homedir(), ".local", "state"), "walkthrough")
);
var INBOX = "inbox";
function makeInbox(dir) {
  const inbox = path3.join(dir, INBOX);
  fs3.mkdirSync(inbox, { recursive: true, mode: 448 });
  return inbox;
}
function inState(dir) {
  try {
    return fs3.realpathSync(dir).startsWith(fs3.realpathSync(stateDir()) + path3.sep);
  } catch {
    return false;
  }
}
function inInbox(file2) {
  const parent = path3.dirname(path3.resolve(file2));
  if (path3.basename(parent) !== INBOX || !inState(parent)) return false;
  try {
    const stat = fs3.lstatSync(file2, { throwIfNoEntry: false });
    return !stat || stat.isFile();
  } catch {
    return false;
  }
}

// src/server.ts
init_define_GRAMMARS();
import { spawn as spawn2 } from "node:child_process";
import crypto5 from "node:crypto";
import fs8 from "node:fs";
import http from "node:http";
import path9 from "node:path";
import { fileURLToPath } from "node:url";

// src/colours.ts
init_define_GRAMMARS();
var PLAIN = "plain";
var KINDS = /* @__PURE__ */ new Set(["c", "k", "n", "e", "t", "s", "r", "v", "x"]);
var joinLines = (lines) => lines.flatMap((line, at) => at ? [[1, ""], ...line] : line);
function colourHtml(html, runs) {
  let out = "";
  let at = 0;
  let run = -1;
  let end = 0;
  let open2 = "";
  const close = () => {
    if (open2) out += "</span>";
    open2 = "";
  };
  for (const part of html.match(/<[^>]*>|&[^;\s]+;|[\s\S]/g) ?? []) {
    if (part.startsWith("<") && part.length > 1) {
      close();
      out += part;
      continue;
    }
    while (at >= end && run < runs.length) end += runs[++run]?.[0] ?? 0;
    const kind = runs[run]?.[1] ?? "";
    if (kind !== open2) {
      close();
      if (KINDS.has(kind)) {
        out += `<span class="sx-${kind}">`;
        open2 = kind;
      }
    }
    out += part;
    at++;
  }
  close();
  return at === runs.reduce((sum, [length]) => sum + length, 0) ? out : null;
}

// src/highlight.ts
init_define_GRAMMARS();
import { Worker } from "node:worker_threads";

// src/grammars.ts
init_define_GRAMMARS();
import path4 from "node:path";
var own = (table2, key2) => Object.hasOwn(table2, key2) ? table2[key2] : void 0;
function grammarOf(file2) {
  const name2 = path4.posix.basename(file2);
  const byName = own(define_GRAMMARS_default.filenames, name2);
  if (byName) return byName;
  for (let dot = name2.indexOf(".", 1); dot !== -1; dot = name2.indexOf(".", dot + 1)) {
    const found = own(define_GRAMMARS_default.extensions, name2.slice(dot).toLowerCase());
    if (found) return found;
  }
  return null;
}
var grammarNamed = (language) => own(define_GRAMMARS_default.names, language.trim().toLowerCase()) ?? null;

// src/highlight.ts
var worker = null;
function start() {
  const thread = new Worker(new URL("./highlight-worker.mjs", import.meta.url));
  const waiting = /* @__PURE__ */ new Map();
  let next = 0;
  const hold2 = () => {
    if (waiting.size) thread.ref();
    else thread.unref();
  };
  const answer2 = ({ id, runs }) => {
    waiting.get(id)?.(runs);
    waiting.delete(id);
    hold2();
  };
  const fail = () => {
    if (worker === self) worker = null;
    for (const done of waiting.values()) done(null);
    waiting.clear();
  };
  thread.on("message", answer2).on("error", fail).on("exit", fail);
  hold2();
  const self = {
    post: (job) => new Promise((resolve2) => {
      const id = next++;
      waiting.set(id, resolve2);
      hold2();
      thread.postMessage({ ...job, id });
    })
  };
  return self;
}
var tokenise = (text2, grammar) => grammar ? (worker ??= start()).post({ text: text2, grammar }) : Promise.resolve(null);
var byBlob = /* @__PURE__ */ new Map();
function tokensAt(cwd, rev, file2) {
  const grammar = grammarOf(file2);
  if (!grammar || !/^[0-9a-f]{40,64}$/.test(rev)) return Promise.resolve(null);
  let blob;
  try {
    blob = git(cwd, "rev-parse", "--verify", "--quiet", `${rev}:${file2}`).trim();
  } catch {
    return Promise.resolve(null);
  }
  const key2 = `${blob}:${grammar}`;
  let found = byBlob.get(key2);
  if (!found) {
    found = tokenise(git(cwd, "cat-file", "blob", blob), grammar);
    byBlob.set(key2, found);
  }
  return found;
}
var tokensFor = (code2, { language, file: file2 }) => tokenise(code2, language !== void 0 ? grammarNamed(language) : file2 !== void 0 ? grammarOf(file2) : null);
var orders = /* @__PURE__ */ new Map();
function warm(cwd, base, head, first) {
  const range = `${base}..${head}`;
  const running = orders.has(range);
  orders.set(range, first);
  if (running) return;
  void (async () => {
    const files3 = await changedFiles(cwd, base, head);
    const done = /* @__PURE__ */ new Set();
    for (; ; ) {
      const order = orders.get(range) ?? [];
      const file2 = [...order.flatMap((one) => files3.filter((changed) => changed.path === one)), ...files3].find((changed) => !done.has(changed.path));
      if (!file2) return;
      done.add(file2.path);
      await Promise.all([tokensAt(cwd, base, file2.from ?? file2.path), tokensAt(cwd, head, file2.path)]);
    }
  })().catch(() => {
  });
}

// src/preview.ts
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/index.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/lookup.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/detector.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/types/index.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/types/bmp.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/types/utils.js
init_define_GRAMMARS();
var decoder = new TextDecoder();
var toUTF8String = (input, start3 = 0, end = input.length) => decoder.decode(input.slice(start3, end));
var toHexString = (input, start3 = 0, end = input.length) => input.slice(start3, end).reduce((memo, i) => memo + `0${i.toString(16)}`.slice(-2), "");
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
function readBox(input, view, base, offset, boxCode) {
  if (input.length - offset < BOX_HEADER_SIZE)
    return void 0;
  const boxSize = view.getUint32(base + offset, false);
  if (input.length - offset < boxSize)
    return void 0;
  return {
    offset,
    size: boxSize,
    matches: view.getUint32(base + 4 + offset, false) === boxCode
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
  const base = input.byteOffset;
  let currentOffset = startOffset;
  while (currentOffset < input.length) {
    if (input.length - currentOffset < 4)
      break;
    if (view.getUint32(base + currentOffset, false) < BOX_HEADER_SIZE) {
      currentOffset += BOX_HEADER_SIZE;
      continue;
    }
    const box = readBox(input, view, base, currentOffset, boxCode);
    if (!box)
      break;
    if (box.matches) {
      return { name: boxName, offset: box.offset, size: box.size };
    }
    currentOffset += box.size;
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

// node_modules/image-size/dist/esm/types/cur.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/types/ico.js
init_define_GRAMMARS();
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
    const imageType2 = readUInt16LE(input, 2);
    return imageType2 === TYPE_ICON;
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
    const imageType2 = readUInt16LE(input, 2);
    return imageType2 === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

// node_modules/image-size/dist/esm/types/dds.js
init_define_GRAMMARS();
var DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

// node_modules/image-size/dist/esm/types/gif.js
init_define_GRAMMARS();
var gifRegexp = /^GIF8[79]a/;
var GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

// node_modules/image-size/dist/esm/types/heif.js
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
init_define_GRAMMARS();
var J2C = {
  validate: (input) => readUInt32BE(input, 0) === 4283432785,
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

// node_modules/image-size/dist/esm/types/jp2.js
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
    const start3 = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start3 + IDF_ENTRY_BYTES;
    if (start3 > exifBlock.length) {
      return;
    }
    const block2 = exifBlock.slice(start3, end);
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

// node_modules/image-size/dist/esm/types/jxl.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/types/jxl-stream.js
init_define_GRAMMARS();

// node_modules/image-size/dist/esm/utils/bit-reader.js
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
    let token = "";
    let inComment = false;
    for (let i = 2; i < end && tokens.length < 2; i++) {
      const byte = input[i];
      if (inComment) {
        inComment = !isEndOfLine(byte);
      } else if (byte === 35) {
        inComment = true;
      } else if (isWhitespace(byte)) {
        if (token) {
          tokens.push(token);
          token = "";
        }
      } else {
        token += String.fromCharCode(byte);
      }
    }
    if (token && tokens.length < 2)
      tokens.push(token);
    if (tokens.length < 2) {
      throw new TypeError("Invalid PNM");
    }
    return {
      width: Number.parseInt(tokens[0], 10),
      height: Number.parseInt(tokens[1], 10)
    };
  },
  pam: (input) => {
    const header = toUTF8String(input, 0, Math.min(input.length, PAM_HEADER_LIMIT));
    const size = {};
    for (const line of header.split(/[\r\n]+/)) {
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key2, value] = line.split(" ");
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
init_define_GRAMMARS();
var PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

// node_modules/image-size/dist/esm/types/svg.js
init_define_GRAMMARS();
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
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
var SVG = {
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

// node_modules/image-size/dist/esm/types/tga.js
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
    const code2 = view.getUint16(offset, le);
    const type = view.getUint16(offset + 2, le);
    const length = isBigTiff ? Number(view.getBigUint64(offset + 4, le)) : view.getUint32(offset + 4, le);
    if (code2 === 0)
      break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) {
      tags[code2] = readTagValue(view, type, offset + valueOffset, le);
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
init_define_GRAMMARS();
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
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
var types = Array.from(typeHandlers.keys());

// node_modules/markdown-it/dist/markdown-it.mjs
init_define_GRAMMARS();

// node_modules/mdurl/index.mjs
var mdurl_exports = {};
__export(mdurl_exports, {
  decode: () => decode_default,
  encode: () => encode_default,
  format: () => format,
  parse: () => parse_default
});
init_define_GRAMMARS();

// node_modules/mdurl/lib/decode.mjs
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
    const code2 = string.charCodeAt(i);
    if (keepEscaped && code2 === 37 && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }
    if (code2 < 128) {
      result += cache[code2];
      continue;
    }
    if (code2 >= 55296 && code2 <= 57343) {
      if (code2 >= 55296 && code2 <= 56319 && i + 1 < l) {
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
init_define_GRAMMARS();
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
init_define_GRAMMARS();
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
  let rest2 = url;
  rest2 = rest2.trim();
  if (!slashesDenoteHost && url.split("#").length === 1) {
    const simplePath = simplePathPattern.exec(rest2);
    if (simplePath) {
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
      }
      return this;
    }
  }
  let proto = protocolPattern.exec(rest2);
  if (proto) {
    proto = proto[0];
    lowerProto = proto.toLowerCase();
    this.protocol = proto;
    rest2 = rest2.substr(proto.length);
  }
  if (slashesDenoteHost || proto || rest2.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    slashes = rest2.substr(0, 2) === "//";
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest2 = rest2.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    let hostEnd = -1;
    for (let i = 0; i < hostEndingChars.length; i++) {
      hec = rest2.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    let auth, atSign;
    if (hostEnd === -1) {
      atSign = rest2.lastIndexOf("@");
    } else {
      atSign = rest2.lastIndexOf("@", hostEnd);
    }
    if (atSign !== -1) {
      auth = rest2.slice(0, atSign);
      rest2 = rest2.slice(atSign + 1);
      this.auth = auth;
    }
    hostEnd = -1;
    for (let i = 0; i < nonHostChars.length; i++) {
      hec = rest2.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    if (hostEnd === -1) {
      hostEnd = rest2.length;
    }
    if (rest2[hostEnd - 1] === ":") {
      hostEnd--;
    }
    const host = rest2.slice(0, hostEnd);
    rest2 = rest2.slice(hostEnd);
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
              rest2 = notHost.join(".") + rest2;
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
  const hash2 = rest2.indexOf("#");
  if (hash2 !== -1) {
    this.hash = rest2.substr(hash2);
    rest2 = rest2.slice(0, hash2);
  }
  const qm = rest2.indexOf("?");
  if (qm !== -1) {
    this.search = rest2.substr(qm);
    rest2 = rest2.slice(0, qm);
  }
  if (rest2) {
    this.pathname = rest2;
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
init_define_GRAMMARS();
var Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var Cc = /[\0-\x1F\x7F-\x9F]/;
var Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
var P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/;
var S = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/;
var Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

// node_modules/entities/dist/index.js
init_define_GRAMMARS();

// node_modules/entities/dist/decode.js
init_define_GRAMMARS();

// node_modules/entities/dist/decode-codepoint.js
init_define_GRAMMARS();
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

// node_modules/entities/dist/generated/decode-data-html.js
init_define_GRAMMARS();

// node_modules/entities/dist/internal/decode-shared.js
init_define_GRAMMARS();
var BASE91_INVERSE = /* @__PURE__ */ (() => {
  const table2 = new Uint8Array(127);
  let code2 = 0;
  for (let char = 33; char <= 126; char++) {
    if (char !== 34 && char !== 36 && char !== 92) {
      table2[char] = code2++;
    }
  }
  return table2;
})();
function decodeTrieDict(input, resultLength, atomCount, dict1AtomCount, ngramCount, dictSize) {
  const base = 91;
  const inputLength = input.length;
  const twoCharBias = dictSize * (base - 1);
  let pos = 0;
  const readSlotCode = () => {
    const c12 = BASE91_INVERSE[input.charCodeAt(pos++)];
    return c12 < dictSize ? c12 : c12 * base - twoCharBias + BASE91_INVERSE[input.charCodeAt(pos++)];
  };
  const dict2AtomCount = atomCount - dict1AtomCount;
  const slotCount = atomCount + ngramCount;
  const single = new Int32Array(slotCount);
  single.fill(-1, dict1AtomCount, dictSize);
  single.fill(-1, dictSize + dict2AtomCount, slotCount);
  const start3 = new Int32Array(slotCount);
  const length = new Int32Array(slotCount);
  function decodeDelta(count, off) {
    let previous = 0;
    let slot = off;
    const end = off + count;
    while (slot < end) {
      const code2 = BASE91_INVERSE[input.charCodeAt(pos++)];
      if (code2 < 89) {
        previous += code2;
        single[slot++] = previous;
      } else if (code2 === 89) {
        let runLength = BASE91_INVERSE[input.charCodeAt(pos++)] + 2;
        while (runLength--)
          single[slot++] = ++previous;
      } else {
        const next = BASE91_INVERSE[input.charCodeAt(pos++)];
        previous += 89 + // eslint-disable-next-line unicorn/prefer-minimal-ternary -- branches read a different number of side-effecting input bytes
        (next < 90 ? next * base + BASE91_INVERSE[input.charCodeAt(pos++)] : BASE91_INVERSE[input.charCodeAt(pos++)] * 8281 + BASE91_INVERSE[input.charCodeAt(pos++)] * base + BASE91_INVERSE[input.charCodeAt(pos++)]);
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
      start3[slot] = poolSize;
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
        let read2 = start3[source];
        const readEnd = read2 + length[source];
        while (read2 < readEnd)
          pool[write++] = pool[read2++];
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
      slot = slot * base - twoCharBias + BASE91_INVERSE[input.charCodeAt(pos++)];
    }
    const value = single[slot];
    if (value < 0) {
      let read2 = start3[slot];
      const readEnd = read2 + length[slot];
      while (read2 < readEnd)
        out[outIndex++] = pool[read2++];
    } else {
      out[outIndex++] = value;
    }
  }
  return out;
}

// node_modules/entities/dist/generated/decode-data-html.js
var htmlDecodeTree = /* @__PURE__ */ decodeTrieDict("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61);

// node_modules/entities/dist/internal/bin-trie-flags.js
init_define_GRAMMARS();
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
function isNumber(code2) {
  return code2 - CharCodes.ZERO >>> 0 <= 9;
}
function isHexadecimalCharacter(code2) {
  return (code2 | TO_LOWER_BIT) - CharCodes.LOWER_A >>> 0 <= 5;
}
function isAlpha(code2) {
  return (code2 | TO_LOWER_BIT) - CharCodes.LOWER_A >>> 0 <= 25;
}
function isEntityInAttributeInvalidEnd(code2) {
  return code2 === CharCodes.EQUALS || isAlpha(code2) || isNumber(code2);
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
function determineBranch(decodeTree, current3, nodeIndex, char) {
  const branchCount = (current3 & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current3 & BinTrieFlags.JUMP_TABLE;
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
  const root = decodeTree[0];
  const rootJumpOffset = root & BinTrieFlags.JUMP_TABLE;
  const rootBranchCount = (root & BinTrieFlags.BRANCH_LENGTH) >> 7;
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
      let current3 = nodeIndex < 0 ? 0 : decodeTree[nodeIndex];
      let index = entityStart + 1;
      trie: while (index < inputLength) {
        while (
          // Value-less, non-run node with a nonzero jump offset.
          (current3 & (BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13)) === 0 && (current3 & BinTrieFlags.JUMP_TABLE) !== 0
        ) {
          const jumpOffset = current3 & BinTrieFlags.JUMP_TABLE;
          const branchCount = (current3 & BinTrieFlags.BRANCH_LENGTH) >> 7;
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
          current3 = decodeTree[nodeIndex];
          index += 1;
          if (index >= inputLength)
            break trie;
        }
        if ((current3 & (BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13)) === BinTrieFlags.FLAG13) {
          const runLength = (current3 & BinTrieFlags.BRANCH_LENGTH) >> 7;
          if (input.charCodeAt(index) !== (current3 & BinTrieFlags.JUMP_TABLE)) {
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
          current3 = decodeTree[nodeIndex];
          continue;
        }
        const valueLength = current3 >>> 14;
        const char = input.charCodeAt(index);
        if (valueLength !== 0) {
          if (char === CharCodes.SEMI) {
            consumed = index - entityStart + 1;
            value = valueLength === 1 ? String.fromCharCode(current3 & BinTrieFlags.VALUE_MASK) : readTrieValue(decodeTree, nodeIndex, valueLength);
            break;
          }
          if (!isStrict && (current3 & BinTrieFlags.FLAG13) === 0) {
            consumed = index - entityStart;
            bestNodeIndex = nodeIndex;
            bestValueLength = valueLength;
          }
          if (valueLength === 1)
            break;
        }
        const next = determineBranch(decodeTree, current3, nodeIndex + (valueLength || 1), char);
        if (next < 0)
          break;
        nodeIndex = next;
        current3 = decodeTree[nodeIndex];
        index += 1;
      }
      if (value === "") {
        const finalVL = current3 >>> 14;
        if (finalVL !== 0 && !isStrict && (current3 & BinTrieFlags.FLAG13) === 0) {
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
init_define_GRAMMARS();
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
  nestedPairRE(open2, close, depth = 4) {
    const openRE = this.escapeRE(open2);
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
    return this.cache.schema_names ??= new RegExp((this.opts.schema_names || []).map((name2) => this.escapeRE(name2)).join("|"));
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
          const name2 = text2.slice(Math.max(0, m.index - 65), m.index);
          if (mailNameRe.test(name2)) return true;
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
          const name2 = mailNameRe.exec(text2.slice(Math.max(0, m.index - 65), m.index));
          if (!name2) continue;
          fuzzyEmailCandidate = {
            schema: "mailto:",
            index: m.index - name2[1].length,
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
  tlds(list3, keepOld = false) {
    list3 = Array.isArray(list3) ? list3 : [list3];
    if (!keepOld) this.__opts__.tlds = list3;
    else this.__opts__.tlds = this.__opts__.tlds.concat(list3);
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

// node_modules/markdown-it/dist/markdown-it.mjs
var import_punycode = __toESM(require_punycode(), 1);
var __defProp2 = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name2 in all) __defProp2(target, name2, {
    get: all[name2],
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
function replaceEntityPattern(match, name2) {
  if (name2.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name2)) {
    const code2 = name2[1].toLowerCase() === "x" ? parseInt(name2.slice(2), 16) : parseInt(name2.slice(1), 10);
    if (isValidEntityCode(code2)) return fromCodePoint(code2);
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
function isSpace(code2) {
  switch (code2) {
    case 9:
    case 32:
      return true;
  }
  return false;
}
function isWhiteSpace(code2) {
  if (code2 >= 8192 && code2 <= 8202) return true;
  switch (code2) {
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
function isPunctCharCode(code2) {
  return isPunctChar(fromCodePoint(code2));
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
  let start3 = 0;
  for (; start3 < str.length; start3++) if (!isAsciiTrimmable(str.charCodeAt(start3))) break;
  let end = str.length - 1;
  for (; end >= start3; end--) if (!isAsciiTrimmable(str.charCodeAt(end))) break;
  return str.slice(start3, end + 1);
}
var lib = {
  mdurl: mdurl_exports,
  ucmicro: build_exports
};
function parseLinkLabel(state, start3, disableNested) {
  let level, found, marker, prevPos;
  const max = state.posMax;
  const oldPos = state.pos;
  state.pos = start3 + 1;
  level = 1;
  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 93) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }
    prevPos = state.pos;
    state.md.inline.skipToken(state);
    if (marker === 91) {
      if (prevPos === state.pos - 1) level++;
      else if (disableNested) {
        state.pos = oldPos;
        return -1;
      }
    }
  }
  let labelEnd = -1;
  if (found) labelEnd = state.pos;
  state.pos = oldPos;
  return labelEnd;
}
function parseLinkDestination(str, start3, max) {
  let code2;
  let pos = start3;
  const result = {
    ok: false,
    pos: 0,
    str: ""
  };
  if (str.charCodeAt(pos) === 60) {
    pos++;
    while (pos < max) {
      code2 = str.charCodeAt(pos);
      if (code2 === 10) return result;
      if (code2 === 60) return result;
      if (code2 === 62) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start3 + 1, pos));
        result.ok = true;
        return result;
      }
      if (code2 === 92 && pos + 1 < max) {
        pos += 2;
        continue;
      }
      pos++;
    }
    return result;
  }
  let level = 0;
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === 32) break;
    if (code2 < 32 || code2 === 127) break;
    if (code2 === 92 && pos + 1 < max) {
      if (str.charCodeAt(pos + 1) === 32) {
        pos++;
        continue;
      }
      pos += 2;
      continue;
    }
    if (code2 === 40) {
      level++;
      if (level > 32) return result;
    }
    if (code2 === 41) {
      if (level === 0) break;
      level--;
    }
    pos++;
  }
  if (start3 === pos) return result;
  if (level !== 0) return result;
  result.str = unescapeAll(str.slice(start3, pos));
  result.pos = pos;
  result.ok = true;
  return result;
}
function parseLinkTitle(str, start3, max, prev_state) {
  let code2;
  let pos = start3;
  const state = {
    ok: false,
    can_continue: false,
    pos: 0,
    str: "",
    marker: 0
  };
  if (prev_state) {
    state.str = prev_state.str;
    state.marker = prev_state.marker;
  } else {
    if (pos >= max) return state;
    let marker = str.charCodeAt(pos);
    if (marker !== 34 && marker !== 39 && marker !== 40) return state;
    start3++;
    pos++;
    if (marker === 40) marker = 41;
    state.marker = marker;
  }
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === state.marker) {
      state.pos = pos + 1;
      state.str += unescapeAll(str.slice(start3, pos));
      state.ok = true;
      return state;
    } else if (code2 === 40 && state.marker === 41) return state;
    else if (code2 === 92 && pos + 1 < max) pos++;
    pos++;
  }
  state.can_continue = true;
  state.str += unescapeAll(str.slice(start3, pos));
  return state;
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
  constructor(type, tag, nesting) {
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
    this.tag = tag;
    this.attrs = null;
    this.nesting = nesting;
    this.meta = null;
  }
  /**
  * Search attribute index by name.
  */
  attrIndex(name2) {
    if (!this.attrs) return -1;
    const attrs = this.attrs;
    for (let i = 0, len = attrs.length; i < len; i++) if (attrs[i][0] === name2) return i;
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
  attrSet(name2, value) {
    const idx = this.attrIndex(name2);
    const attrData = [name2, value];
    if (idx < 0) this.attrPush(attrData);
    else this.attrs[idx] = attrData;
  }
  /**
  * Get the value of attribute `name`, or null if it does not exist.
  */
  attrGet(name2) {
    const idx = this.attrIndex(name2);
    let value = null;
    if (idx >= 0) value = this.attrs[idx][1];
    return value;
  }
  /**
  * Join value to existing attribute via space. Or create new attribute if not
  * exists. Useful to operate with token classes.
  */
  attrJoin(name2, value) {
    const idx = this.attrIndex(name2);
    if (idx < 0) this.attrPush([name2, value]);
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
  __find__(name2) {
    for (let i = 0; i < this.__rules__.length; i++) if (this.__rules__[i].name === name2) return i;
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
  at(name2, fn, options = {}) {
    const index = this.__find__(name2);
    if (index === -1) throw new Error(`Parser rule not found: ${name2}`);
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
  enable(list3, ignoreInvalid = false) {
    if (!Array.isArray(list3)) list3 = [list3];
    const result = [];
    list3.forEach((name2) => {
      const idx = this.__find__(name2);
      if (idx < 0) {
        if (ignoreInvalid) return;
        throw new Error(`Rules manager: invalid rule name ${name2}`);
      }
      this.__rules__[idx].enabled = true;
      result.push(name2);
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
  enableOnly(list3, ignoreInvalid = false) {
    if (!Array.isArray(list3)) list3 = [list3];
    this.__rules__.forEach((rule) => {
      rule.enabled = false;
    });
    this.enable(list3, ignoreInvalid);
  }
  /**
  * Disable rules with given names. If any rule name not found - throw Error.
  * Errors can be disabled by second param.
  *
  * See also {@link Ruler.enable}, {@link Ruler.enableOnly}.
  *
  * Returns list of found rule names (if no exception happened).
  */
  disable(list3, ignoreInvalid = false) {
    if (!Array.isArray(list3)) list3 = [list3];
    const result = [];
    list3.forEach((name2) => {
      const idx = this.__find__(name2);
      if (idx < 0) {
        if (ignoreInvalid) return;
        throw new Error(`Rules manager: invalid rule name ${name2}`);
      }
      this.__rules__[idx].enabled = false;
      result.push(name2);
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
  const token = tokens[idx];
  return `<code${slf.renderAttrs(token)}>${escapeHtml(token.content)}</code>`;
};
default_rules.code_block = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  return `<pre${slf.renderAttrs(token)}><code>${escapeHtml(tokens[idx].content)}</code></pre>
`;
};
default_rules.fence = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  const info = token.info ? unescapeAll(token.info).trim() : "";
  let langName = "";
  let langAttrs = "";
  if (info) {
    const arr = info.split(/(\s+)/g);
    langName = arr[0];
    langAttrs = arr.slice(2).join("");
  }
  let highlighted;
  if (options.highlight) highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
  else highlighted = escapeHtml(token.content);
  if (highlighted.indexOf("<pre") === 0) return highlighted + "\n";
  if (info) {
    const i = token.attrIndex("class");
    const tmpAttrs = token.attrs ? token.attrs.slice() : [];
    if (i < 0) tmpAttrs.push(["class", `${options.langPrefix}${langName}`]);
    else {
      tmpAttrs[i] = [tmpAttrs[i][0], tmpAttrs[i][1]];
      tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`;
    }
    const tmpToken = { attrs: tmpAttrs };
    return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>
`;
  }
  return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>
`;
};
default_rules.image = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
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
  renderAttrs(token) {
    let i, l, result;
    if (!token.attrs) return "";
    result = "";
    for (i = 0, l = token.attrs.length; i < l; i++) result += ` ${escapeHtml(token.attrs[i][0])}="${escapeHtml(String(token.attrs[i][1]))}"`;
    return result;
  }
  /**
  * Default token renderer. Can be overriden by custom function
  * in {@link Renderer.rules}.
  */
  renderToken(tokens, idx, options) {
    const token = tokens[idx];
    let result = "";
    if (token.hidden) return "";
    let prev = idx - 1;
    while (prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === 0) prev--;
    if (token.block && token.nesting !== -1 && prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === -1) result += "\n";
    result += (token.nesting === -1 ? "</" : "<") + token.tag;
    result += this.renderAttrs(token);
    if (token.nesting === 0 && options.xhtmlOut) result += " /";
    let needLf = false;
    if (token.block) {
      needLf = true;
      if (token.nesting === 1) {
        let next = idx + 1;
        while (next < tokens.length && tokens[next].hidden && tokens[next].nesting === 0) next++;
        if (next < tokens.length) {
          const nextToken = tokens[next];
          if (nextToken.type === "inline" || nextToken.hidden) needLf = false;
          else if (nextToken.nesting === -1 && nextToken.tag === token.tag) needLf = false;
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
function normalize(state) {
  let str;
  str = state.src.replace(UNNORMALIZED_NEWLINE_RE, "\n");
  str = str.replace(NULL_RE, "\uFFFD");
  state.src = str;
}
function block(state) {
  let token;
  if (state.inlineMode) {
    token = new state.Token("inline", "", 0);
    token.content = state.src;
    token.map = [0, 1];
    token.children = [];
    state.tokens.push(token);
  } else state.md.block.parse(state.src, state.md, state.env, state.tokens);
}
function strip_references(state) {
  const tokens = state.tokens;
  let last = 0;
  for (let curr = 0; curr < tokens.length; curr++) {
    if (tokens[curr].type === "reference_definition") continue;
    if (curr !== last) tokens[last] = tokens[curr];
    last++;
  }
  if (tokens.length !== last) tokens.length = last;
}
function inline(state) {
  const tokens = state.tokens;
  for (let i = 0, l = tokens.length; i < l; i++) {
    const tok = tokens[i];
    if (tok.type === "inline") state.md.inline.parse(tok.content, state.md, state.env, tok.children);
  }
}
function isLinkOpen$1(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose$1(str) {
  return /^<\/a\s*>/i.test(str);
}
function linkify$1(state) {
  const blockTokens = state.tokens;
  if (!state.md.options.linkify) return;
  for (let j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== "inline" || !state.md.linkify.test(blockTokens[j].content)) continue;
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
      if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
        const text2 = currentToken.content;
        let links = state.md.linkify.match(text2);
        const nodes = [];
        let level = currentToken.level;
        let lastPos = 0;
        if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") links = links.slice(1);
        for (let ln = 0; ln < links.length; ln++) {
          const url = links[ln].url;
          const fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) continue;
          let urlText = links[ln].text;
          if (!links[ln].schema) urlText = state.md.normalizeLinkText(`http://${urlText}`).replace(/^http:\/\//, "");
          else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state.md.normalizeLinkText(`mailto:${urlText}`).replace(/^mailto:/, "");
          else urlText = state.md.normalizeLinkText(urlText);
          const pos = links[ln].index;
          if (pos > lastPos) {
            const token = new state.Token("text", "", 0);
            token.content = text2.slice(lastPos, pos);
            token.level = level;
            nodes.push(token);
          }
          const token_o = new state.Token("link_open", "a", 1);
          token_o.attrs = [["href", fullUrl]];
          token_o.level = level++;
          token_o.markup = "linkify";
          token_o.info = "auto";
          nodes.push(token_o);
          const token_t = new state.Token("text", "", 0);
          token_t.content = urlText;
          token_t.level = level;
          nodes.push(token_t);
          const token_c = new state.Token("link_close", "a", -1);
          token_c.level = --level;
          token_c.markup = "linkify";
          token_c.info = "auto";
          nodes.push(token_c);
          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text2.length) {
          const token = new state.Token("text", "", 0);
          token.content = text2.slice(lastPos);
          token.level = level;
          nodes.push(token);
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
function replaceFn(match, name2) {
  return SCOPED_ABBR[name2.toLowerCase()];
}
function replace_scoped(inlineTokens) {
  let inside_autolink = 0;
  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token = inlineTokens[i];
    if (token.type === "text" && !inside_autolink) token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
    if (token.type === "link_open" && token.info === "auto") inside_autolink--;
    if (token.type === "link_close" && token.info === "auto") inside_autolink++;
  }
}
function replace_rare(inlineTokens) {
  let inside_autolink = 0;
  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token = inlineTokens[i];
    if (token.type === "text" && !inside_autolink) {
      if (RARE_RE.test(token.content)) token.content = token.content.replace(/\+-/g, "\xB1").replace(/\.{2,}/g, "\u2026").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1\u2014").replace(/(^|\s)--(?=\s|$)/gm, "$1\u2013").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1\u2013");
    }
    if (token.type === "link_open" && token.info === "auto") inside_autolink--;
    if (token.type === "link_close" && token.info === "auto") inside_autolink++;
  }
}
function replace(state) {
  let blkIdx;
  if (!state.md.options.typographer) return;
  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline") continue;
    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) replace_scoped(state.tokens[blkIdx].children);
    if (RARE_RE.test(state.tokens[blkIdx].content)) replace_rare(state.tokens[blkIdx].children);
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
function process_inlines(tokens, state) {
  let j;
  const stack = [];
  const heads = {
    single: -1,
    double: -1
  };
  const replacements = {};
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const thisLevel = tokens[i].level;
    for (j = stack.length - 1; j >= 0; j--) if (stack[j].level <= thisLevel) break;
    truncateStack(stack, heads, j + 1);
    if (token.type !== "text") continue;
    const text2 = token.content;
    let pos = 0;
    const max = text2.length;
    OUTER: while (pos < max) {
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
      if (pos < max) nextChar = text2.charCodeAt(pos);
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
            openQuote = state.md.options.quotes[2];
            closeQuote = state.md.options.quotes[3];
          } else {
            openQuote = state.md.options.quotes[0];
            closeQuote = state.md.options.quotes[1];
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
function smartquotes(state) {
  if (!state.md.options.typographer) return;
  for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) continue;
    process_inlines(state.tokens[blkIdx].children, state);
  }
}
function join_alt(tokens) {
  let curr, last;
  const max = tokens.length;
  for (curr = 0; curr < max; curr++) if (tokens[curr].type === "text_special") tokens[curr].type = "text";
  for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
  else {
    if (curr !== last) tokens[last] = tokens[curr];
    last++;
  }
  if (curr !== last) tokens.length = last;
}
function text_join(state) {
  let curr, last;
  const blockTokens = state.tokens;
  const l = blockTokens.length;
  for (let j = 0; j < l; j++) {
    if (blockTokens[j].type !== "inline") continue;
    const tokens = blockTokens[j].children;
    const max = tokens.length;
    for (curr = 0; curr < max; curr++) {
      if (tokens[curr].type === "text_special") tokens[curr].type = "text";
      if (tokens[curr].children) join_alt(tokens[curr].children);
    }
    for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
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
  process(state) {
    const rules = this.ruler.getRules("");
    for (let i = 0, l = rules.length; i < l; i++) rules[i](state);
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
    for (let start3 = 0, pos = 0, indent = 0, offset = 0, len = s.length, indent_found = false; pos < len; pos++) {
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
        this.bMarks.push(start3);
        this.eMarks.push(pos);
        this.tShift.push(indent);
        this.sCount.push(offset);
        this.bsCount.push(0);
        indent_found = false;
        indent = 0;
        offset = 0;
        start3 = pos + 1;
      }
    }
    this.bMarks.push(s.length);
    this.eMarks.push(s.length);
    this.tShift.push(0);
    this.sCount.push(0);
    this.bsCount.push(0);
    this.lineMax = this.bMarks.length - 1;
  }
  push(type, tag, nesting) {
    const token = new Token(type, tag, nesting);
    token.block = true;
    if (nesting < 0) this.level--;
    token.level = this.level;
    if (nesting > 0) this.level++;
    this.tokens.push(token);
    return token;
  }
  isEmpty(line) {
    return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
  }
  skipEmptyLines(from) {
    for (let max = this.lineMax; from < max; from++) if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
    return from;
  }
  skipSpaces(pos) {
    for (let max = this.src.length; pos < max; pos++) if (!isSpace(this.src.charCodeAt(pos))) break;
    return pos;
  }
  skipSpacesBack(pos, min) {
    if (pos <= min) return pos;
    while (pos > min) if (!isSpace(this.src.charCodeAt(--pos))) return pos + 1;
    return pos;
  }
  skipChars(pos, code2) {
    for (let max = this.src.length; pos < max; pos++) if (this.src.charCodeAt(pos) !== code2) break;
    return pos;
  }
  skipCharsBack(pos, code2, min) {
    if (pos <= min) return pos;
    while (pos > min) if (code2 !== this.src.charCodeAt(--pos)) return pos + 1;
    return pos;
  }
  getLines(begin, end, indent, keepLastLF) {
    if (begin >= end) return "";
    const queue = new Array(end - begin);
    for (let i = 0, line = begin; line < end; line++, i++) {
      let lineIndent = 0;
      const lineStart = this.bMarks[line];
      let first = lineStart;
      let last;
      if (line + 1 < end || keepLastLF) last = this.eMarks[line] + 1;
      else last = this.eMarks[line];
      while (first < last && lineIndent < indent) {
        const ch = this.src.charCodeAt(first);
        if (isSpace(ch)) {
          if (ch === 9) lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
          else lineIndent++;
        } else if (first - lineStart < this.tShift[line]) lineIndent++;
        else break;
        first++;
      }
      if (lineIndent > indent) queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
      else queue[i] = this.src.slice(first, last);
    }
    return queue.join("");
  }
};
var MAX_AUTOCOMPLETED_CELLS = 65536;
function getLine(state, line) {
  const pos = state.bMarks[line] + state.tShift[line];
  const max = state.eMarks[line];
  return state.src.slice(pos, max);
}
function escapedSplit(str) {
  const result = [];
  const max = str.length;
  let pos = 0;
  let ch = str.charCodeAt(pos);
  let isEscaped = false;
  let lastPos = 0;
  let current3 = "";
  while (pos < max) {
    if (ch === 124) {
      if (!isEscaped) {
        result.push(current3 + str.substring(lastPos, pos));
        current3 = "";
        lastPos = pos + 1;
      } else {
        current3 += str.substring(lastPos, pos - 1);
        lastPos = pos;
      }
    }
    isEscaped = ch === 92;
    pos++;
    ch = str.charCodeAt(pos);
  }
  result.push(current3 + str.substring(lastPos));
  return result;
}
function table(state, startLine, endLine, silent) {
  if (startLine + 2 > endLine) return false;
  let nextLine = startLine + 1;
  if (state.sCount[nextLine] < state.blkIndent) return false;
  if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
  let pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) return false;
  const firstCh = state.src.charCodeAt(pos++);
  if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) return false;
  if (pos >= state.eMarks[nextLine]) return false;
  const secondCh = state.src.charCodeAt(pos++);
  if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) return false;
  if (firstCh === 45 && isSpace(secondCh)) return false;
  while (pos < state.eMarks[nextLine]) {
    const ch = state.src.charCodeAt(pos);
    if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) return false;
    pos++;
  }
  let lineText = getLine(state, startLine + 1);
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
  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf("|") === -1) return false;
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  columns = escapedSplit(lineText);
  if (columns.length && columns[0] === "") columns.shift();
  if (columns.length && columns[columns.length - 1] === "") columns.pop();
  const columnCount = columns.length;
  if (columnCount === 0 || columnCount !== aligns.length) return false;
  if (silent) return true;
  const oldParentType = state.parentType;
  state.parentType = "table";
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const token_to = state.push("table_open", "table", 1);
  const tableLines = [startLine, 0];
  token_to.map = tableLines;
  const token_tho = state.push("thead_open", "thead", 1);
  token_tho.map = [startLine, startLine + 1];
  const token_htro = state.push("tr_open", "tr", 1);
  token_htro.map = [startLine, startLine + 1];
  for (let i = 0; i < columns.length; i++) {
    const token_ho = state.push("th_open", "th", 1);
    if (aligns[i]) token_ho.attrs = [["style", `text-align:${aligns[i]}`]];
    const token_il = state.push("inline", "", 0);
    token_il.content = columns[i].trim();
    token_il.children = [];
    state.push("th_close", "th", -1);
  }
  state.push("tr_close", "tr", -1);
  state.push("thead_close", "thead", -1);
  let tbodyLines;
  let autocompletedCells = 0;
  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
    lineText = getLine(state, nextLine).trim();
    if (!lineText) break;
    if (state.sCount[nextLine] - state.blkIndent >= 4) break;
    columns = escapedSplit(lineText);
    if (columns.length && columns[0] === "") columns.shift();
    if (columns.length && columns[columns.length - 1] === "") columns.pop();
    autocompletedCells += columnCount - columns.length;
    if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) break;
    if (nextLine === startLine + 2) {
      const token_tbo = state.push("tbody_open", "tbody", 1);
      token_tbo.map = tbodyLines = [startLine + 2, 0];
    }
    const token_tro = state.push("tr_open", "tr", 1);
    token_tro.map = [nextLine, nextLine + 1];
    for (let i = 0; i < columnCount; i++) {
      const token_tdo = state.push("td_open", "td", 1);
      if (aligns[i]) token_tdo.attrs = [["style", `text-align:${aligns[i]}`]];
      const token_il = state.push("inline", "", 0);
      token_il.content = columns[i] ? columns[i].trim() : "";
      token_il.children = [];
      state.push("td_close", "td", -1);
    }
    state.push("tr_close", "tr", -1);
  }
  if (tbodyLines) {
    state.push("tbody_close", "tbody", -1);
    tbodyLines[1] = nextLine;
  }
  state.push("table_close", "table", -1);
  tableLines[1] = nextLine;
  state.parentType = oldParentType;
  state.line = nextLine;
  return true;
}
function code(state, startLine, endLine) {
  if (state.sCount[startLine] - state.blkIndent < 4) return false;
  let nextLine = startLine + 1;
  let last = nextLine;
  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }
  state.line = last;
  const token = state.push("code_block", "code", 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
  token.map = [startLine, state.line];
  return true;
}
function fence(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  if (pos + 3 > max) return false;
  const marker = state.src.charCodeAt(pos);
  if (marker !== 126 && marker !== 96) return false;
  let mem = pos;
  pos = state.skipChars(pos, marker);
  let len = pos - mem;
  if (len < 3) return false;
  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max);
  if (marker === 96) {
    if (params.indexOf(String.fromCharCode(marker)) >= 0) return false;
  }
  if (silent) return true;
  let nextLine = startLine;
  let haveEndMarker = false;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) break;
    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos < max && state.sCount[nextLine] < state.blkIndent) break;
    if (state.src.charCodeAt(pos) !== marker) continue;
    if (state.sCount[nextLine] - state.blkIndent >= 4) continue;
    pos = state.skipChars(pos, marker);
    if (pos - mem < len) continue;
    pos = state.skipSpaces(pos);
    if (pos < max) continue;
    haveEndMarker = true;
    break;
  }
  len = state.sCount[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  const token = state.push("fence", "code", 0);
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup = markup;
  token.map = [startLine, state.line];
  return true;
}
function blockquote(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  const oldLineMax = state.lineMax;
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  if (state.src.charCodeAt(pos) !== 62) return false;
  if (silent) return true;
  const oldBMarks = [];
  const oldBSCount = [];
  const oldSCount = [];
  const oldTShift = [];
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const oldParentType = state.parentType;
  state.parentType = "blockquote";
  let lastLineEmpty = false;
  let nextLine;
  for (nextLine = startLine; nextLine < endLine; nextLine++) {
    const isOutdented = state.sCount[nextLine] < state.blkIndent;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos >= max) break;
    if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
      let initial = state.sCount[nextLine] + 1;
      let spaceAfterMarker;
      let adjustTab;
      if (state.src.charCodeAt(pos) === 32) {
        pos++;
        initial++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state.src.charCodeAt(pos) === 9) {
        spaceAfterMarker = true;
        if ((state.bsCount[nextLine] + initial) % 4 === 3) {
          pos++;
          initial++;
          adjustTab = false;
        } else adjustTab = true;
      } else spaceAfterMarker = false;
      let offset = initial;
      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;
      while (pos < max) {
        const ch = state.src.charCodeAt(pos);
        if (isSpace(ch)) {
          if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          else offset++;
        } else break;
        pos++;
      }
      lastLineEmpty = pos >= max;
      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;
      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }
    if (lastLineEmpty) break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) {
      state.lineMax = nextLine;
      if (state.blkIndent !== 0) {
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }
      break;
    }
    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);
    state.sCount[nextLine] = -1;
  }
  const oldIndent = state.blkIndent;
  state.blkIndent = 0;
  const token_o = state.push("blockquote_open", "blockquote", 1);
  token_o.markup = ">";
  const lines = [startLine, 0];
  token_o.map = lines;
  state.md.block.tokenize(state, startLine, nextLine);
  const token_c = state.push("blockquote_close", "blockquote", -1);
  token_c.markup = ">";
  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;
  for (let i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
    state.sCount[i + startLine] = oldSCount[i];
    state.bsCount[i + startLine] = oldBSCount[i];
  }
  state.blkIndent = oldIndent;
  return true;
}
function hr(state, startLine, endLine, silent) {
  const max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 95) return false;
  let cnt = 1;
  while (pos < max) {
    const ch = state.src.charCodeAt(pos++);
    if (ch !== marker && !isSpace(ch)) return false;
    if (ch === marker) cnt++;
  }
  if (cnt < 3) return false;
  if (silent) return true;
  state.line = startLine + 1;
  const token = state.push("hr", "hr", 0);
  token.map = [startLine, state.line];
  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
  return true;
}
function skipBulletListMarker(state, startLine) {
  const max = state.eMarks[startLine];
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 43) return -1;
  if (pos < max) {
    if (!isSpace(state.src.charCodeAt(pos))) return -1;
  }
  return pos;
}
function skipOrderedListMarker(state, startLine) {
  const start3 = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  let pos = start3;
  if (pos + 1 >= max) return -1;
  let ch = state.src.charCodeAt(pos++);
  if (ch < 48 || ch > 57) return -1;
  for (; ; ) {
    if (pos >= max) return -1;
    ch = state.src.charCodeAt(pos++);
    if (ch >= 48 && ch <= 57) {
      if (pos - start3 >= 10) return -1;
      continue;
    }
    if (ch === 41 || ch === 46) break;
    return -1;
  }
  if (pos < max) {
    ch = state.src.charCodeAt(pos);
    if (!isSpace(ch)) return -1;
  }
  return pos;
}
function markTightParagraphs(state, idx) {
  const level = state.level + 2;
  for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
    state.tokens[i + 2].hidden = true;
    state.tokens[i].hidden = true;
    i += 2;
  }
}
function list(state, startLine, endLine, silent) {
  let max, pos, start3, token;
  let nextLine = startLine;
  let tight = true;
  if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
  if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) return false;
  let isTerminatingParagraph = false;
  if (silent && state.parentType === "paragraph") {
    if (state.sCount[nextLine] >= state.blkIndent) isTerminatingParagraph = true;
  }
  let isOrdered;
  let markerValue;
  let posAfterMarker;
  if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
    isOrdered = true;
    start3 = state.bMarks[nextLine] + state.tShift[nextLine];
    markerValue = Number(state.src.slice(start3, posAfterMarker - 1));
    if (isTerminatingParagraph && markerValue !== 1) return false;
  } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) isOrdered = false;
  else return false;
  if (isTerminatingParagraph) {
    if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
  }
  if (silent) return true;
  const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
  const listTokIdx = state.tokens.length;
  if (isOrdered) {
    token = state.push("ordered_list_open", "ol", 1);
    if (markerValue !== 1) token.attrs = [["start", markerValue]];
  } else token = state.push("bullet_list_open", "ul", 1);
  const listLines = [nextLine, 0];
  token.map = listLines;
  token.markup = String.fromCharCode(markerCharCode);
  let prevEmptyEnd = false;
  const terminatorRules = state.md.block.ruler.getRules("list");
  const oldParentType = state.parentType;
  state.parentType = "list";
  while (nextLine < endLine) {
    pos = posAfterMarker;
    max = state.eMarks[nextLine];
    const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine]) % 4;
      else if (ch === 32) offset++;
      else break;
      pos++;
    }
    const contentStart = pos;
    let indentAfterMarker;
    if (contentStart >= max) indentAfterMarker = 1;
    else indentAfterMarker = offset - initial;
    if (indentAfterMarker > 4) indentAfterMarker = 1;
    const indent = initial + indentAfterMarker;
    token = state.push("list_item_open", "li", 1);
    token.markup = String.fromCharCode(markerCharCode);
    const itemLines = [nextLine, 0];
    token.map = itemLines;
    if (isOrdered) token.info = state.src.slice(start3, posAfterMarker - 1);
    const oldTight = state.tight;
    const oldTShift = state.tShift[nextLine];
    const oldSCount = state.sCount[nextLine];
    const oldListIndent = state.listIndent;
    state.listIndent = state.blkIndent;
    state.blkIndent = indent;
    state.tight = true;
    state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
    state.sCount[nextLine] = offset;
    if (contentStart >= max && state.isEmpty(nextLine + 1)) state.line = Math.min(state.line + 2, endLine);
    else state.md.block.tokenize(state, nextLine, endLine);
    if (!state.tight || prevEmptyEnd) tight = false;
    prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
    state.blkIndent = state.listIndent;
    state.listIndent = oldListIndent;
    state.tShift[nextLine] = oldTShift;
    state.sCount[nextLine] = oldSCount;
    state.tight = oldTight;
    token = state.push("list_item_close", "li", -1);
    token.markup = String.fromCharCode(markerCharCode);
    nextLine = state.line;
    itemLines[1] = nextLine;
    if (nextLine >= endLine) break;
    if (state.sCount[nextLine] < state.blkIndent) break;
    if (state.sCount[nextLine] - state.blkIndent >= 4) break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) break;
      start3 = state.bMarks[nextLine] + state.tShift[nextLine];
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) break;
    }
    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) break;
  }
  if (isOrdered) token = state.push("ordered_list_close", "ol", -1);
  else token = state.push("bullet_list_close", "ul", -1);
  token.markup = String.fromCharCode(markerCharCode);
  listLines[1] = nextLine;
  state.line = nextLine;
  state.parentType = oldParentType;
  if (tight) markTightParagraphs(state, listTokIdx);
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
function lineEnd(state, line) {
  return Math.min(state.eMarks[line] + 1, state.src.length);
}
function getNextLinePos(state, nextLine) {
  const endLine = state.lineMax;
  if (nextLine >= endLine || state.isEmpty(nextLine)) return -1;
  let isContinuation = false;
  if (state.sCount[nextLine] - state.blkIndent > 3) isContinuation = true;
  if (state.sCount[nextLine] < 0) isContinuation = true;
  if (!isContinuation) {
    const terminatorRules = state.md.block.ruler.getRules("reference");
    const oldParentType = state.parentType;
    state.parentType = "reference";
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    state.parentType = oldParentType;
    if (terminate) return -1;
  }
  return state.bMarks[nextLine] + state.tShift[nextLine];
}
function reference(state, startLine, _endLine, silent) {
  const src = state.src;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let nextLine = startLine + 1;
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  if (src.charCodeAt(pos) !== 91) return false;
  let max = lineEnd(state, startLine);
  let rawLabel = "";
  let labelEnd = -1;
  let segmentStart = ++pos;
  while (pos < max) {
    if (rawLabel.length + pos - segmentStart > MAX_LABEL_LENGTH * 2) return false;
    let ch = src.charCodeAt(pos);
    if (ch === 91) return false;
    if (ch === 93) {
      labelEnd = pos;
      break;
    }
    if (ch === 92) ch = src.charCodeAt(++pos);
    if (ch === 10 && pos < max) {
      const nextPos = getNextLinePos(state, nextLine);
      if (nextPos < 0) return false;
      rawLabel += src.slice(segmentStart, max);
      pos = segmentStart = nextPos;
      max = lineEnd(state, nextLine++);
      continue;
    }
    pos++;
  }
  if (labelEnd < 0 || src.charCodeAt(labelEnd + 1) !== 58) return false;
  rawLabel += src.slice(segmentStart, labelEnd);
  if (rawLabel.length > MAX_LABEL_LENGTH && countCodePoints(rawLabel) > MAX_LABEL_LENGTH) return false;
  pos = labelEnd + 2;
  while (pos < max) {
    const ch = src.charCodeAt(pos);
    if (ch === 10) {
      const nextPos = getNextLinePos(state, nextLine);
      if (nextPos < 0) break;
      pos = nextPos;
      max = lineEnd(state, nextLine++);
    } else if (isSpace(ch)) pos++;
    else break;
  }
  const destRes = state.md.helpers.parseLinkDestination(src, pos, max);
  if (!destRes.ok) return false;
  const href = state.md.normalizeLink(destRes.str);
  if (!state.md.validateLink(href)) return false;
  pos = destRes.pos;
  const destEndPos = pos;
  const destEndMax = max;
  const destEndLineNo = nextLine;
  while (pos < max) {
    const ch = src.charCodeAt(pos);
    if (ch === 10) {
      const nextPos = getNextLinePos(state, nextLine);
      if (nextPos < 0) break;
      pos = nextPos;
      max = lineEnd(state, nextLine++);
    } else if (isSpace(ch)) pos++;
    else break;
  }
  const titleStart = pos;
  let titleRes = state.md.helpers.parseLinkTitle(src, pos, max);
  while (titleRes.can_continue) {
    const nextPos = getNextLinePos(state, nextLine);
    if (nextPos < 0) break;
    pos = nextPos;
    max = lineEnd(state, nextLine++);
    titleRes = state.md.helpers.parseLinkTitle(src, pos, max, titleRes);
  }
  let title;
  if (titleStart !== destEndPos && titleRes.ok) {
    title = titleRes.str;
    pos = titleRes.pos;
  } else {
    title = "";
    pos = destEndPos;
    max = destEndMax;
    nextLine = destEndLineNo;
  }
  while (pos < max) {
    if (!isSpace(src.charCodeAt(pos))) break;
    pos++;
  }
  if (pos < max && src.charCodeAt(pos) !== 10) {
    if (title) {
      title = "";
      pos = destEndPos;
      max = destEndMax;
      nextLine = destEndLineNo;
      while (pos < max) {
        if (!isSpace(src.charCodeAt(pos))) break;
        pos++;
      }
    }
  }
  if (pos < max && src.charCodeAt(pos) !== 10) return false;
  const label = normalizeReference(rawLabel);
  if (!label) return false;
  if (silent) return true;
  if (typeof state.env.references === "undefined") state.env.references = {};
  if (typeof state.env.references[label] === "undefined") state.env.references[label] = {
    title,
    href
  };
  const token = state.push("reference_definition", "", 0);
  token.map = [startLine, nextLine];
  token.hidden = true;
  const meta = /* @__PURE__ */ Object.create(null);
  meta.label = label;
  token.meta = meta;
  state.line = nextLine;
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
function html_block(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  if (!state.md.options.html) return false;
  if (state.src.charCodeAt(pos) !== 60) return false;
  let lineText = state.src.slice(pos, max);
  let i = 0;
  for (; i < HTML_SEQUENCES.length; i++) if (HTML_SEQUENCES[i][0].test(lineText)) break;
  if (i === HTML_SEQUENCES.length) return false;
  if (silent) return HTML_SEQUENCES[i][2];
  let nextLine = startLine + 1;
  const endsOnBlankLine = HTML_SEQUENCES[i][1].test("");
  if (!HTML_SEQUENCES[i][1].test(lineText)) for (; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) {
      if (endsOnBlankLine || !state.isEmpty(nextLine)) break;
    }
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);
    if (HTML_SEQUENCES[i][1].test(lineText)) {
      if (lineText.length !== 0) nextLine++;
      break;
    }
  }
  state.line = nextLine;
  const token = state.push("html_block", "", 0);
  token.map = [startLine, nextLine];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
  return true;
}
function heading(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  let ch = state.src.charCodeAt(pos);
  if (ch !== 35 || pos >= max) return false;
  let level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 35 && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }
  if (level > 6 || pos < max && !isSpace(ch)) return false;
  if (silent) return true;
  max = state.skipSpacesBack(max, pos);
  const tmp = state.skipCharsBack(max, 35, pos);
  if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) max = tmp;
  state.line = startLine + 1;
  const token_o = state.push("heading_open", `h${level}`, 1);
  token_o.markup = "########".slice(0, level);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = asciiTrim(state.src.slice(pos, max));
  token_i.map = [startLine, state.line];
  token_i.children = [];
  const token_c = state.push("heading_close", `h${level}`, -1);
  token_c.markup = "########".slice(0, level);
  return true;
}
function lheading(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  const oldParentType = state.parentType;
  state.parentType = "paragraph";
  let level = 0;
  let marker;
  let nextLine = startLine + 1;
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) continue;
    if (state.sCount[nextLine] >= state.blkIndent) {
      let pos = state.bMarks[nextLine] + state.tShift[nextLine];
      const max = state.eMarks[nextLine];
      if (pos < max) {
        marker = state.src.charCodeAt(pos);
        if (marker === 45 || marker === 61) {
          pos = state.skipChars(pos, marker);
          pos = state.skipSpaces(pos);
          if (pos >= max) {
            level = marker === 61 ? 1 : 2;
            break;
          }
        }
      }
    }
    if (state.sCount[nextLine] < 0) continue;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
  }
  if (!level) {
    state.parentType = oldParentType;
    return false;
  }
  const content = asciiTrim(state.getLines(startLine, nextLine, state.blkIndent, false));
  state.line = nextLine + 1;
  const token_o = state.push("heading_open", `h${level}`, 1);
  token_o.markup = String.fromCharCode(marker);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line - 1];
  token_i.children = [];
  const token_c = state.push("heading_close", `h${level}`, -1);
  token_c.markup = String.fromCharCode(marker);
  state.parentType = oldParentType;
  return true;
}
function paragraph(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  const oldParentType = state.parentType;
  let nextLine = startLine + 1;
  state.parentType = "paragraph";
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) continue;
    if (state.sCount[nextLine] < 0) continue;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
      terminate = true;
      break;
    }
    if (terminate) break;
  }
  const content = asciiTrim(state.getLines(startLine, nextLine, state.blkIndent, false));
  state.line = nextLine;
  const token_o = state.push("paragraph_open", "p", 1);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line];
  token_i.children = [];
  state.push("paragraph_close", "p", -1);
  state.parentType = oldParentType;
  return true;
}
var _rules$1 = [
  [
    "table",
    table,
    ["paragraph", "reference"]
  ],
  ["code", code],
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
  tokenize(state, startLine, endLine) {
    const rules = this.ruler.getRules("");
    const len = rules.length;
    const maxNesting = state.md.options.maxNesting;
    let line = startLine;
    let hasEmptyLines = false;
    while (line < endLine) {
      state.line = line = state.skipEmptyLines(line);
      if (line >= endLine) break;
      if (state.sCount[line] < state.blkIndent) break;
      if (state.level >= maxNesting) {
        state.line = endLine;
        break;
      }
      const prevLine = state.line;
      let ok = false;
      for (let i = 0; i < len; i++) {
        ok = rules[i](state, line, endLine, false);
        if (ok) {
          if (prevLine >= state.line) throw new Error("block rule didn't increment state.line");
          break;
        }
      }
      if (!ok) throw new Error("none of the block rules matched");
      state.tight = !hasEmptyLines;
      if (state.isEmpty(state.line - 1)) hasEmptyLines = true;
      line = state.line;
      if (line < endLine && state.isEmpty(line)) {
        hasEmptyLines = true;
        line++;
        state.line = line;
      }
    }
  }
  /**
  * Process input string and push block tokens into `outTokens`
  */
  parse(src, md, env, outTokens) {
    if (!src) return;
    const state = new this.State(src, md, env, outTokens);
    this.tokenize(state, state.line, state.lineMax);
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
    const token = new Token("text", "", 0);
    token.content = this.pending;
    token.level = this.pendingLevel;
    this.tokens.push(token);
    this.pending = "";
    return token;
  }
  push(type, tag, nesting) {
    if (this.pending) this.pushPending();
    const token = new Token(type, tag, nesting);
    let token_meta = void 0;
    if (nesting < 0) {
      this.level--;
      this.delimiters = this._prev_delimiters.pop();
    }
    token.level = this.level;
    if (nesting > 0) {
      this.level++;
      this._prev_delimiters.push(this.delimiters);
      this.delimiters = [];
      token_meta = { delimiters: this.delimiters };
    }
    this.pendingLevel = this.level;
    this.tokens.push(token);
    this.tokens_meta.push(token_meta);
    return token;
  }
  scanDelims(start3, canSplitWord) {
    const max = this.posMax;
    const marker = this.src.charCodeAt(start3);
    let lastChar;
    if (start3 === 0) lastChar = 32;
    else if (start3 === 1) {
      lastChar = this.src.charCodeAt(0);
      if ((lastChar & 63488) === 55296) lastChar = 65533;
    } else {
      lastChar = this.src.charCodeAt(start3 - 1);
      if ((lastChar & 64512) === 56320) {
        const highSurr = this.src.charCodeAt(start3 - 2);
        lastChar = (highSurr & 64512) === 55296 ? 65536 + (highSurr - 55296 << 10) + (lastChar - 56320) : 65533;
      } else if ((lastChar & 64512) === 55296) lastChar = 65533;
    }
    let pos = start3;
    while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
    const count = pos - start3;
    let nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
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
function text(state, silent) {
  let pos = state.pos;
  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) pos++;
  if (pos === state.pos) return false;
  if (!silent) state.pending += state.src.slice(state.pos, pos);
  state.pos = pos;
  return true;
}
function isAsciiAlpha(code2) {
  return code2 >= 65 && code2 <= 90 || code2 >= 97 && code2 <= 122;
}
function isSchemeChar(code2) {
  return code2 >= 65 && code2 <= 90 || code2 >= 97 && code2 <= 122 || code2 >= 48 && code2 <= 57 || code2 === 43 || code2 === 45 || code2 === 46;
}
function linkify(state, silent) {
  if (!state.md.options.linkify) return false;
  if (state.linkLevel > 0) return false;
  const pos = state.pos;
  const max = state.posMax;
  if (pos + 3 > max) return false;
  if (state.src.charCodeAt(pos) !== 58) return false;
  if (state.src.charCodeAt(pos + 1) !== 47) return false;
  if (state.src.charCodeAt(pos + 2) !== 47) return false;
  const protoMin = pos - Math.min(10, state.pending.length, pos);
  let protoStart = pos;
  while (protoStart > protoMin && isSchemeChar(state.src.charCodeAt(protoStart - 1))) protoStart--;
  if (protoStart === pos || !isAsciiAlpha(state.src.charCodeAt(protoStart))) return false;
  const protoLength = pos - protoStart;
  const link2 = state.md.linkify.matchAtStart(state.src.slice(protoStart));
  if (!link2) return false;
  let url = link2.url;
  if (url.length <= protoLength) return false;
  let urlEnd = url.length;
  while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) urlEnd--;
  if (urlEnd !== url.length) url = url.slice(0, urlEnd);
  const fullUrl = state.md.normalizeLink(url);
  if (!state.md.validateLink(fullUrl)) return false;
  if (!silent) {
    state.pending = state.pending.slice(0, -protoLength);
    const token_o = state.push("link_open", "a", 1);
    token_o.attrs = [["href", fullUrl]];
    token_o.markup = "linkify";
    token_o.info = "auto";
    const token_t = state.push("text", "", 0);
    token_t.content = state.md.normalizeLinkText(url);
    const token_c = state.push("link_close", "a", -1);
    token_c.markup = "linkify";
    token_c.info = "auto";
  }
  state.pos += url.length - protoLength;
  return true;
}
function newline(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 10) return false;
  const pmax = state.pending.length - 1;
  const max = state.posMax;
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
        let ws = pmax - 1;
        while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
        state.pending = state.pending.slice(0, ws);
        state.push("hardbreak", "br", 0);
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push("softbreak", "br", 0);
      }
    } else state.push("softbreak", "br", 0);
  }
  pos++;
  while (pos < max && isSpace(state.src.charCodeAt(pos))) pos++;
  state.pos = pos;
  return true;
}
var ESCAPED2 = [];
for (let i = 0; i < 256; i++) ESCAPED2.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
  ESCAPED2[ch.charCodeAt(0)] = 1;
});
function escape(state, silent) {
  let pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 92) return false;
  pos++;
  if (pos >= max) return false;
  let ch1 = state.src.charCodeAt(pos);
  if (ch1 === 10) {
    if (!silent) state.push("hardbreak", "br", 0);
    pos++;
    while (pos < max) {
      ch1 = state.src.charCodeAt(pos);
      if (!isSpace(ch1)) break;
      pos++;
    }
    state.pos = pos;
    return true;
  }
  if (ch1 === 32) {
    if (!silent) {
      const token = state.push("text_special", "", 0);
      token.content = "\\";
      token.markup = "\\";
      token.info = "escape";
    }
    state.pos = pos;
    return true;
  }
  let escapedStr = state.src[pos];
  if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
    const ch2 = state.src.charCodeAt(pos + 1);
    if (ch2 >= 56320 && ch2 <= 57343) {
      escapedStr += state.src[pos + 1];
      pos++;
    }
  }
  const origStr = "\\" + escapedStr;
  if (!silent) {
    const token = state.push("text_special", "", 0);
    if (ch1 < 256 && ESCAPED2[ch1] !== 0) token.content = escapedStr;
    else token.content = origStr;
    token.markup = origStr;
    token.info = "escape";
  }
  state.pos = pos + 1;
  return true;
}
function buildLastRuns(src) {
  const lastRuns = {};
  let pos = 0;
  while ((pos = src.indexOf("`", pos)) !== -1) {
    const start3 = pos;
    while (src.charCodeAt(++pos) === 96) ;
    lastRuns[pos - start3] = start3;
  }
  return lastRuns;
}
function backtick(state, silent) {
  var _state$backticks$open;
  const start3 = state.pos;
  if (state.src.charCodeAt(start3) !== 96) return false;
  const max = state.posMax;
  let pos = start3 + 1;
  while (pos < max && state.src.charCodeAt(pos) === 96) pos++;
  const marker = state.src.slice(start3, pos);
  const openerLength = marker.length;
  if (!state.backticksScanned) {
    state.backticks = buildLastRuns(state.src);
    state.backticksScanned = true;
  }
  if (((_state$backticks$open = state.backticks[openerLength]) !== null && _state$backticks$open !== void 0 ? _state$backticks$open : -1) >= pos) {
    let matchEnd = pos;
    let matchStart;
    while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1 && matchStart < max) {
      matchEnd = matchStart + 1;
      while (state.src.charCodeAt(matchEnd) === 96) matchEnd++;
      if (matchEnd > max) break;
      if (matchEnd - matchStart === openerLength) {
        if (!silent) {
          const token = state.push("code_inline", "code", 0);
          token.markup = marker;
          let content = state.src.slice(pos, matchStart).replace(/\n/g, " ");
          if (content.startsWith(" ") && content.endsWith(" ") && /[^ ]/.test(content)) content = content.slice(1, -1);
          token.content = content;
        }
        state.pos = matchEnd;
        return true;
      }
    }
  }
  if (!silent) state.pending += marker;
  state.pos = pos;
  return true;
}
function strikethrough_tokenize(state, silent) {
  const start3 = state.pos;
  const marker = state.src.charCodeAt(start3);
  if (silent) return false;
  if (marker !== 126) return false;
  const scanned = state.scanDelims(state.pos, true);
  let len = scanned.length;
  const ch = String.fromCharCode(marker);
  if (len < 2) return false;
  let token;
  if (len % 2) {
    token = state.push("text", "", 0);
    token.content = ch;
    len--;
  }
  for (let i = 0; i < len; i += 2) {
    token = state.push("text", "", 0);
    token.content = ch + ch;
    state.delimiters.push({
      marker,
      length: 0,
      token: state.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess$1(state, delimiters) {
  let token;
  const loneMarkers = [];
  const max = delimiters.length;
  for (let i = 0; i < max; i++) {
    const startDelim = delimiters[i];
    if (startDelim.marker !== 126) continue;
    if (startDelim.end === -1) continue;
    const endDelim = delimiters[startDelim.end];
    token = state.tokens[startDelim.token];
    token.type = "s_open";
    token.tag = "s";
    token.nesting = 1;
    token.markup = "~~";
    token.content = "";
    token = state.tokens[endDelim.token];
    token.type = "s_close";
    token.tag = "s";
    token.nesting = -1;
    token.markup = "~~";
    token.content = "";
    if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
  }
  while (loneMarkers.length) {
    const i = loneMarkers.pop();
    let j = i + 1;
    while (j < state.tokens.length && state.tokens[j].type === "s_close") j++;
    j--;
    if (i !== j) {
      token = state.tokens[j];
      state.tokens[j] = state.tokens[i];
      state.tokens[i] = token;
    }
  }
}
function strikethrough_postProcess(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess$1(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    var _tokens_meta$curr;
    const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
    if (delimiters) postProcess$1(state, delimiters);
  }
}
var strikethrough_default = {
  tokenize: strikethrough_tokenize,
  postProcess: strikethrough_postProcess
};
function emphasis_tokenize(state, silent) {
  const start3 = state.pos;
  const marker = state.src.charCodeAt(start3);
  if (silent) return false;
  if (marker !== 95 && marker !== 42) return false;
  const scanned = state.scanDelims(state.pos, marker === 42);
  for (let i = 0; i < scanned.length; i++) {
    const token = state.push("text", "", 0);
    token.content = String.fromCharCode(marker);
    state.delimiters.push({
      marker,
      length: scanned.length,
      token: state.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess(state, delimiters) {
  const max = delimiters.length;
  for (let i = max - 1; i >= 0; i--) {
    const startDelim = delimiters[i];
    if (startDelim.marker !== 95 && startDelim.marker !== 42) continue;
    if (startDelim.end === -1) continue;
    const endDelim = delimiters[startDelim.end];
    const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
    const ch = String.fromCharCode(startDelim.marker);
    const token_o = state.tokens[startDelim.token];
    token_o.type = isStrong ? "strong_open" : "em_open";
    token_o.tag = isStrong ? "strong" : "em";
    token_o.nesting = 1;
    token_o.markup = isStrong ? ch + ch : ch;
    token_o.content = "";
    const token_c = state.tokens[endDelim.token];
    token_c.type = isStrong ? "strong_close" : "em_close";
    token_c.tag = isStrong ? "strong" : "em";
    token_c.nesting = -1;
    token_c.markup = isStrong ? ch + ch : ch;
    token_c.content = "";
    if (isStrong) {
      state.tokens[delimiters[i - 1].token].content = "";
      state.tokens[delimiters[startDelim.end + 1].token].content = "";
      i--;
    }
  }
}
function emphasis_post_process(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    var _tokens_meta$curr;
    const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
    if (delimiters) postProcess(state, delimiters);
  }
}
var emphasis_default = {
  tokenize: emphasis_tokenize,
  postProcess: emphasis_post_process
};
function link(state, silent) {
  let code2, label, res, ref;
  let href = "";
  let title = "";
  let start3 = state.pos;
  let parseReference = true;
  if (state.src.charCodeAt(state.pos) !== 91) return false;
  const oldPos = state.pos;
  const max = state.posMax;
  const labelStart = state.pos + 1;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
  if (labelEnd < 0) return false;
  let pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    parseReference = false;
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) break;
    }
    if (pos >= max) return false;
    start3 = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) pos = res.pos;
      else href = "";
      start3 = pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) break;
      }
      res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
      if (pos < max && start3 !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        for (; pos < max; pos++) {
          code2 = state.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) break;
        }
      }
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 41) parseReference = true;
    pos++;
  }
  if (parseReference) {
    if (typeof state.env.references === "undefined") return false;
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start3 = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) label = state.src.slice(start3, pos++);
      else pos = labelEnd + 1;
    } else pos = labelEnd + 1;
    if (!label) label = state.src.slice(labelStart, labelEnd);
    label = normalizeReference(label);
    ref = state.env.references[label];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;
    const token_o = state.push("link_open", "a", 1);
    const attrs = [["href", href]];
    token_o.attrs = attrs;
    if (title) attrs.push(["title", title]);
    if (label) {
      const meta = /* @__PURE__ */ Object.create(null);
      meta.label = label;
      token_o.meta = meta;
    }
    state.linkLevel++;
    state.md.inline.tokenize(state);
    state.linkLevel--;
    state.push("link_close", "a", -1);
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
function image(state, silent) {
  let code2, content, label, pos, ref, res, title, start3;
  let href = "";
  const oldPos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(state.pos) !== 33) return false;
  if (state.src.charCodeAt(state.pos + 1) !== 91) return false;
  const labelStart = state.pos + 2;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
  if (labelEnd < 0) return false;
  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) break;
    }
    if (pos >= max) return false;
    start3 = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) pos = res.pos;
      else href = "";
    }
    start3 = pos;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) break;
    }
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start3 !== pos && res.ok) {
      title = res.str;
      pos = res.pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) break;
      }
    } else title = "";
    if (pos >= max || state.src.charCodeAt(pos) !== 41) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    if (typeof state.env.references === "undefined") return false;
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start3 = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) label = state.src.slice(start3, pos++);
      else pos = labelEnd + 1;
    } else pos = labelEnd + 1;
    if (!label) label = state.src.slice(labelStart, labelEnd);
    label = normalizeReference(label);
    ref = state.env.references[label];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }
  if (!silent) {
    content = state.src.slice(labelStart, labelEnd);
    const tokens = [];
    state.md.inline.parse(content, state.md, state.env, tokens);
    const token = state.push("image", "img", 0);
    const attrs = [["src", href], ["alt", ""]];
    token.attrs = attrs;
    token.children = tokens;
    token.content = content;
    if (title) attrs.push(["title", title]);
    if (label) {
      const meta = /* @__PURE__ */ Object.create(null);
      meta.label = label;
      token.meta = meta;
    }
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function autolink(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60) return false;
  const start3 = state.pos;
  const max = state.posMax;
  for (; ; ) {
    if (++pos >= max) return false;
    const ch = state.src.charCodeAt(pos);
    if (ch === 60) return false;
    if (ch === 62) break;
  }
  const url = state.src.slice(start3 + 1, pos);
  if (AUTOLINK_RE.test(url)) {
    const fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) return false;
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url.length + 2;
    return true;
  }
  if (EMAIL_RE.test(url)) {
    const fullUrl = state.md.normalizeLink(`mailto:${url}`);
    if (!state.md.validateLink(fullUrl)) return false;
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url.length + 2;
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
function scanSpecial(state, pos) {
  const src = state.src;
  let start3;
  let terminator;
  if (src.startsWith("<!--", pos)) {
    if (src.startsWith(">", pos + 4)) return pos + 5;
    if (src.startsWith("->", pos + 4)) return pos + 6;
    start3 = pos + 4;
    terminator = "-->";
  } else if (src.startsWith("<![CDATA[", pos)) {
    start3 = pos + 9;
    terminator = "]]>";
  } else if (src.charCodeAt(pos + 1) === 63) {
    start3 = pos + 2;
    terminator = "?>";
  } else if (isLetter(src.charCodeAt(pos + 2))) {
    start3 = pos + 3;
    terminator = ">";
  } else return -1;
  if (state.skipHtmlSpecial) return -1;
  const end = src.indexOf(terminator, start3);
  if (end < 0) {
    state.skipHtmlSpecial = true;
    return -1;
  }
  return end + terminator.length;
}
function html_inline(state, silent) {
  if (!state.md.options.html) return false;
  const max = state.posMax;
  const pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) return false;
  let end;
  const ch = state.src.charCodeAt(pos + 1);
  if (ch === 33 || ch === 63) end = scanSpecial(state, pos);
  else if (ch === 47 || isLetter(ch)) {
    const match = state.src.slice(pos).match(HTML_OPEN_CLOSE_TAG_RE);
    end = match ? pos + match[0].length : -1;
  } else return false;
  if (end < 0) return false;
  if (!silent) {
    const token = state.push("html_inline", "", 0);
    token.content = state.src.slice(pos, end);
    if (isLinkOpen(token.content)) state.linkLevel++;
    if (isLinkClose(token.content)) state.linkLevel--;
  }
  state.pos = end;
  return true;
}
var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
function entity(state, silent) {
  const pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 38) return false;
  if (pos + 1 >= max) return false;
  if (state.src.charCodeAt(pos + 1) === 35) {
    const match = state.src.slice(pos).match(DIGITAL_RE);
    if (match) {
      if (!silent) {
        const code2 = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
        const token = state.push("text_special", "", 0);
        token.content = isValidEntityCode(code2) ? fromCodePoint(code2) : fromCodePoint(65533);
        token.markup = match[0];
        token.info = "entity";
      }
      state.pos += match[0].length;
      return true;
    }
  } else {
    const match = state.src.slice(pos).match(NAMED_RE);
    if (match) {
      const decoded = decodeHTMLStrict(match[0]);
      if (decoded !== match[0]) {
        if (!silent) {
          const token = state.push("text_special", "", 0);
          token.content = decoded;
          token.markup = match[0];
          token.info = "entity";
        }
        state.pos += match[0].length;
        return true;
      }
    }
  }
  return false;
}
function processDelimiters(delimiters) {
  const openersBottom = {};
  const max = delimiters.length;
  if (!max) return;
  let headerIdx = 0;
  let lastTokenIdx = -2;
  const jumps = [];
  for (let closerIdx = 0; closerIdx < max; closerIdx++) {
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
function link_pairs(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  processDelimiters(state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    var _tokens_meta$curr;
    const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
    if (delimiters) processDelimiters(delimiters);
  }
}
function fragments_join(state) {
  let curr, last;
  let level = 0;
  const tokens = state.tokens;
  const max = state.tokens.length;
  for (curr = last = 0; curr < max; curr++) {
    if (tokens[curr].nesting < 0) level--;
    tokens[curr].level = level;
    if (tokens[curr].nesting > 0) level++;
    if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
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
  skipToken(state) {
    const pos = state.pos;
    const rules = this.ruler.getRules("");
    const len = rules.length;
    const maxNesting = state.md.options.maxNesting;
    const cache = state.cache;
    if (typeof cache[pos] !== "undefined") {
      state.pos = cache[pos];
      return;
    }
    let ok = false;
    if (state.level < maxNesting) for (let i = 0; i < len; i++) {
      state.level++;
      ok = rules[i](state, true);
      state.level--;
      if (ok) {
        if (pos >= state.pos) throw new Error("inline rule didn't increment state.pos");
        break;
      }
    }
    else state.pos = state.posMax;
    if (!ok) state.pos++;
    cache[pos] = state.pos;
  }
  tokenize(state) {
    const rules = this.ruler.getRules("");
    const len = rules.length;
    const end = state.posMax;
    const maxNesting = state.md.options.maxNesting;
    while (state.pos < end) {
      const prevPos = state.pos;
      let ok = false;
      if (state.level < maxNesting) for (let i = 0; i < len; i++) {
        ok = rules[i](state, false);
        if (ok) {
          if (prevPos >= state.pos) throw new Error("inline rule didn't increment state.pos");
          break;
        }
      }
      if (ok) {
        if (state.pos >= end) break;
        continue;
      }
      state.pending += state.src[state.pos++];
    }
    if (state.pending) state.pushPending();
  }
  /**
  * Process input string and push inline tokens into `outTokens`
  */
  parse(str, md, env, outTokens) {
    const state = new this.State(str, md, env, outTokens);
    this.tokenize(state);
    const rules = this.ruler2.getRules("");
    const len = rules.length;
    for (let i = 0; i < len; i++) rules[i](state);
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
    const parsed3 = parse_default(url, true);
    if (parsed3.hostname) {
      if (!parsed3.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed3.protocol) >= 0) try {
        parsed3.hostname = import_punycode.default.toASCII(parsed3.hostname);
      } catch (er) {
      }
    }
    if (parsed3.auth) parsed3.auth = encode_default(parsed3.auth);
    if (parsed3.hostname) parsed3.hostname = encode_default(parsed3.hostname);
    if (parsed3.pathname) parsed3.pathname = encode_default(parsed3.pathname);
    if (parsed3.search) parsed3.search = encode_default(parsed3.search);
    if (parsed3.hash) parsed3.hash = encode_default(parsed3.hash);
    return format(parsed3);
  }
  /**
  * Function used to decode link url to a human-readable format`
  */
  normalizeLinkText(url) {
    const parsed3 = parse_default(url, true);
    if (parsed3.hostname) {
      if (!parsed3.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed3.protocol) >= 0) try {
        parsed3.hostname = import_punycode.default.toUnicode(parsed3.hostname);
      } catch (er) {
      }
    }
    return decode_default(format(parsed3), decode_default.defaultChars + "%");
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
      ].forEach((name2) => {
        var _components$name;
        const rules = (_components$name = components[name2]) === null || _components$name === void 0 ? void 0 : _components$name.rules;
        if (rules) this[name2].ruler.enableOnly(rules);
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
  enable(list3, ignoreInvalid = false) {
    let result = [];
    if (!Array.isArray(list3)) list3 = [list3];
    [
      "core",
      "block",
      "inline"
    ].forEach((chain) => {
      result = result.concat(this[chain].ruler.enable(list3, true));
    });
    result = result.concat(this.inline.ruler2.enable(list3, true));
    const missed = list3.filter((name2) => result.indexOf(name2) < 0);
    if (missed.length && !ignoreInvalid) throw new Error(`MarkdownIt. Failed to enable unknown rule(s): ${missed}`);
    return this;
  }
  /**
  * The same as {@link MarkdownIt.enable}, but turn specified rules off.
  */
  disable(list3, ignoreInvalid = false) {
    let result = [];
    if (!Array.isArray(list3)) list3 = [list3];
    [
      "core",
      "block",
      "inline"
    ].forEach((chain) => {
      result = result.concat(this[chain].ruler.disable(list3, true));
    });
    result = result.concat(this.inline.ruler2.disable(list3, true));
    const missed = list3.filter((name2) => result.indexOf(name2) < 0);
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
    const state = new this.core.State(src, this, env);
    this.core.process(state);
    return state.tokens;
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
    const state = new this.core.State(src, this, env);
    state.inlineMode = true;
    this.core.process(state);
    return state.tokens;
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
function previewType(file2) {
  const extension = /\.([^./]+)$/.exec(file2)?.[1]?.toLowerCase() ?? "";
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
var imagesIn = (markdownFile, text2) => parser.parse(text2, {}).flatMap((token) => token.children ?? []).filter((token) => token.type === "image").map((token) => imagePath(markdownFile, String(token.attrGet("src") ?? "")));

// src/processes.ts
init_define_GRAMMARS();
import { spawnSync as spawnSync2 } from "node:child_process";
var psStart = (pid) => spawnSync2("ps", ["-p", String(pid), "-o", "lstart="], { encoding: "utf8" }).stdout.trim();
function alive(record2) {
  try {
    process.kill(record2.pid, 0);
  } catch {
    return false;
  }
  return record2.started === void 0 || psStart(record2.pid) === record2.started;
}

// src/list.ts
init_define_GRAMMARS();
import fs6 from "node:fs";
import path7 from "node:path";

// src/review.ts
init_define_GRAMMARS();
import crypto3 from "node:crypto";
import fs5 from "node:fs";
import path6 from "node:path";

// src/lines.ts
init_define_GRAMMARS();
import crypto2 from "node:crypto";

// src/input.ts
init_define_GRAMMARS();
import fs4 from "node:fs";
function readInput(file2) {
  if (file2 === void 0) return fs4.readFileSync(0, "utf8");
  const text2 = fs4.readFileSync(file2, "utf8");
  if (inInbox(file2)) fs4.rmSync(file2);
  return text2;
}
var filled = (value) => typeof value === "string" && value.trim() !== "";
var fieldsOf = (value) => typeof value === "object" && value !== null ? value : {};
function parsed(text2) {
  try {
    return JSON.parse(text2);
  } catch {
    return null;
  }
}
var wrongShape = (what, shape) => new Error(`${what} must be a JSON ${shape}; see walkthrough guide`);
function parseList(text2, what, check) {
  const list3 = parsed(text2);
  if (!Array.isArray(list3)) throw wrongShape(what, "array");
  return list3.map((one, at) => check(fieldsOf(one), at + 1));
}

// src/lines.ts
var isLines = (value) => Array.isArray(value) && value.length === 2 && value.every((line) => Number.isInteger(line) && line >= 1) && value[0] <= value[1];
var parsed2 = /* @__PURE__ */ new WeakMap();
function shownLines(step, file2) {
  const files3 = parsed2.get(step) ?? parseDiff(step.diff);
  parsed2.set(step, files3);
  const shown = files3.find((one) => one.newName === file2);
  if (!shown) return null;
  const lines = shown.blocks.flatMap((block2) => block2.lines);
  return new Map(lines.flatMap((line) => line.newNumber === void 0 ? [] : [[line.newNumber, line.content.slice(1)]]));
}
var codeOf = (shown, [first, last]) => [...shown].filter(([number]) => number >= first && number <= last);
var hashOf = (shown, lines) => crypto2.createHash("sha256").update(JSON.stringify(codeOf(shown, lines).map(([, line]) => line))).digest("hex").slice(0, 16);
var stepOf = ({ steps: steps3 }, file2) => steps3.find((one) => one.files.includes(file2));
function codeAt(walkthrough, file2, lines) {
  const found = stepOf(walkthrough, file2);
  const shown = found && shownLines(found, file2);
  return shown ? codeOf(shown, lines) : [];
}
var stepOfFile = (walkthrough, file2) => stepOf(walkthrough, file2)?.id;
function anchorOf(walkthrough, place) {
  const found = stepOf(walkthrough, place.file);
  if (!("lines" in place)) return found?.id ?? null;
  const { file: file2, lines, linesHash } = place;
  const shown = found && shownLines(found, file2);
  if (!found || !shown?.has(lines[0]) || !shown.has(lines[1])) return null;
  return hashOf(shown, lines) === linesHash ? found.id : null;
}
function placeIn(walkthrough, { file: file2, lines }) {
  if (!filled(file2)) throw new Error("a comment needs a file");
  const found = walkthrough && stepOf(walkthrough, file2);
  if (lines === void 0) {
    if (!found) throw new Error(`no step changes ${file2}`);
    return { file: file2 };
  }
  if (!isLines(lines)) throw new Error("lines must be [first, last], or left out for the whole file");
  const shown = found && shownLines(found, file2);
  if (!shown) throw new Error(`no step changes ${file2}`);
  const [first, last] = lines;
  if (!shown.has(first) || !shown.has(last)) throw new Error(`lines ${String(first)}-${String(last)} of ${file2} are not in its diff`);
  return { file: file2, lines: [first, last], linesHash: hashOf(shown, [first, last]), code: codeOf(shown, [first, last]) };
}

// src/walkthrough.ts
init_define_GRAMMARS();
import path5 from "node:path";
var CRITERION_STATUSES = ["met", "partly", "not-met", "not-checked"];
var file = (dir) => path5.join(dir, "walkthrough.json");
var encode2 = (name2) => encodeURIComponent(name2).replace(/[!'()*~]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
function walkthroughDir(repo, source) {
  const name2 = `${source.kind}-${encode2(nameOf(source))}`;
  if (Buffer.byteLength(name2) > 255)
    throw new Error(`${nameOf(source)} is too long to name a walkthrough; pass a shorter --label`);
  return path5.join(stateDir(), repo, name2);
}
var earlierDir = (repo, source) => path5.join(
  stateDir(),
  repo,
  source.kind === "branch" ? `branch-${source.branch.replaceAll("/", "~")}` : `range-${encodeURIComponent(source.label)}`
);
var branchOfDir = (dir) => {
  const name2 = path5.basename(dir);
  if (!name2.startsWith("branch-")) return void 0;
  const branch = name2.slice("branch-".length).replaceAll("~", "/");
  try {
    return decodeURIComponent(branch);
  } catch {
    return branch;
  }
};
var targetName = (target) => /^[0-9a-f]{40,64}$/.test(target) ? target.slice(0, 7) : target;
var nameOf = (named) => named.kind === "branch" ? named.branch : named.label;
var EARLIER_FIELDS = ["kindLabel", "commentHint", "checking", "checklist", "lastChecklistItem", "actions", "hints", "reviewing"];
function current(saved) {
  if (!saved) return null;
  const upgraded = Object.fromEntries(Object.entries(saved).filter(([key2]) => !EARLIER_FIELDS.includes(key2)));
  if (!saved.steps.every((step) => Array.isArray(step.look) && step.files.every((one) => typeof one === "string"))) upgraded.steps = [];
  return upgraded;
}
var readWalkthrough = (dir) => current(readJson(file(dir), null));
var savedWalkthrough = (dir) => current(readSavedJson(file(dir)) ?? null);
function openWalkthrough(dir, source, change, pr, carry) {
  return locked(file(dir), async () => {
    const saved = savedWalkthrough(dir);
    const given = pr ? { pr } : {};
    if (saved?.head === change.head && saved.base === change.base) {
      if (!pr || JSON.stringify(saved.pr) === JSON.stringify(pr)) return { walkthrough: saved, opened: "resumed" };
      const relabelled = { ...saved, pr };
      writeJson(file(dir), relabelled);
      return { walkthrough: relabelled, opened: "resumed" };
    }
    if (saved) {
      const reviewedAt = saved.ready === false ? saved.reviewedAt : saved.head;
      const moved = { ...saved, ...given, target: change.target, base: change.base, head: change.head, ready: false };
      if (reviewedAt) moved.reviewedAt = reviewedAt;
      const { steps: steps3, unplaced } = await carry(moved);
      setSteps(moved, steps3);
      if (saved.steps.length && unplaced.length) moved.unplaced = unplaced;
      writeJson(file(dir), moved);
      return { walkthrough: moved, opened: "moved" };
    }
    const walkthrough = {
      ...source.kind === "branch" ? { kind: "branch", branch: source.branch } : { kind: "range", label: source.label },
      target: change.target,
      ...given,
      base: change.base,
      head: change.head,
      steps: [],
      ready: false
    };
    writeJson(file(dir), walkthrough);
    return { walkthrough, opened: "new" };
  });
}
function updateWalkthrough(dir, change) {
  return locked(file(dir), async () => {
    const walkthrough = savedWalkthrough(dir);
    if (!walkthrough) throw new Error("there is no such walkthrough yet; run walkthrough start first");
    const changed = await change(walkthrough);
    writeJson(file(dir), walkthrough);
    return changed;
  });
}
function setSteps(walkthrough, steps3) {
  walkthrough.steps = steps3;
  delete walkthrough.unplaced;
  walkthrough.lastStep = Math.max(walkthrough.lastStep ?? 0, ...steps3.map((step) => Number(step.id)));
}
function recordSteps(dir, build) {
  return updateWalkthrough(dir, async (walkthrough) => {
    setSteps(walkthrough, await build(walkthrough));
    return walkthrough;
  });
}
function markReady(dir) {
  return updateWalkthrough(dir, (walkthrough) => {
    if (!walkthrough.steps.length) throw new Error("record the steps before the walkthrough is ready");
    const left = walkthrough.unplaced ?? [];
    if (left.length) throw new Error(`these files are in no step yet: ${left.join(", ")}; record the steps again with them`);
    walkthrough.ready = true;
    const opened = walkthrough.opened === true;
    walkthrough.opened = true;
    return opened;
  });
}
var markOpened = (dir) => updateWalkthrough(dir, (walkthrough) => {
  walkthrough.opened = true;
});

// src/review.ts
var REVIEW_TYPES = ["comment", "approve", "request-changes"];
var files = (dir) => ({
  log: path6.join(dir, "review.jsonl"),
  inbox: path6.join(dir, "inbox.jsonl"),
  listener: path6.join(dir, "listener.json"),
  viewed: path6.join(dir, "viewed.json")
});
var hold = (dir, work) => locked(path6.join(dir, "review"), work, 2e3);
function readLines(file2) {
  let text2 = "";
  try {
    text2 = fs5.readFileSync(file2, "utf8");
  } catch {
    return [];
  }
  return text2.split("\n").flatMap((line) => {
    try {
      return line.trim() ? [JSON.parse(line)] : [];
    } catch {
      return [];
    }
  });
}
var append = (file2, entry) => {
  fs5.appendFileSync(file2, `${JSON.stringify(entry)}
`, { mode: 384 });
};
var newId = () => crypto3.randomBytes(4).toString("hex");
var fingerprint = (content) => crypto3.createHash("sha256").update(content).digest("hex").slice(0, 16);
var markedFile = (mark) => mark.slice(0, -17);
var cleanText = (text2) => typeof text2 === "string" ? text2.trim() : "";
var logOf = (dir) => readLines(files(dir).log);
var WAKES = /* @__PURE__ */ new Set(["ask", "submit"]);
function record(dir, fields) {
  const entry = { id: newId(), at: (/* @__PURE__ */ new Date()).toISOString(), ...fields };
  return hold(dir, () => {
    append(files(dir).log, entry);
    if (WAKES.has(entry.kind)) append(files(dir).inbox, entry);
    return entry;
  });
}
function replay(walkthrough, log) {
  const comments3 = /* @__PURE__ */ new Map();
  const roots = /* @__PURE__ */ new Map();
  const resolved = /* @__PURE__ */ new Map();
  const takesBack = (one) => one.review === void 0 || !walkthrough.pr && one.by === "ai";
  const submits = [];
  const posted2 = /* @__PURE__ */ new Map();
  for (const event of log) {
    switch (event.kind) {
      case "comment":
      case "ask": {
        const thread = event.thread ?? event.id;
        if (event.place && !event.thread) roots.set(event.id, event.place);
        const said2 = { id: event.id, at: event.at, body: event.text };
        const view = event.kind === "comment" ? { ...said2, by: event.by, pending: true } : { ...said2, by: "you", ask: true, waiting: true };
        comments3.set(event.id, { view, thread, wrote: event.text });
        break;
      }
      case "edit": {
        const comment2 = comments3.get(event.comment);
        if (comment2) comment2.view.body = event.text;
        break;
      }
      case "delete": {
        const comment2 = comments3.get(event.comment);
        if (comment2) comment2.deleted = true;
        break;
      }
      case "answer": {
        const ask2 = comments3.get(event.ask);
        if (!ask2) break;
        delete ask2.view.waiting;
        comments3.set(event.id, { view: { id: event.id, at: event.at, body: event.text, by: "ai", answer: true }, thread: ask2.thread, wrote: event.text });
        break;
      }
      case "resolve":
        if (!resolved.has(event.thread)) resolved.set(event.thread, { by: event.by ?? "you" });
        break;
      case "unresolve": {
        const one = resolved.get(event.thread);
        if (one && takesBack(one)) resolved.delete(event.thread);
        break;
      }
      case "submit":
        submits.push(event);
        for (const { view, deleted } of comments3.values())
          if (view.pending && !deleted) {
            delete view.pending;
            view.review = event.id;
          }
        for (const one of resolved.values()) one.review ??= event.id;
        break;
      case "posted":
        posted2.set(event.submit, event.address);
        break;
    }
  }
  const gone = new Set([...comments3.values()].filter((one) => one.deleted && one.thread === one.view.id).map((one) => one.thread));
  const live = [...comments3.values()].filter((one) => !one.deleted && !gone.has(one.thread));
  const kept = live.map((one) => one.view);
  const ownIn = (thread) => live.filter((one) => one.thread === thread).map((one) => one.view);
  const resolvedIn = (id, was) => {
    const one = resolved.get(id);
    if (!one) return was ? { resolved: true } : {};
    return {
      resolved: true,
      resolvedBy: one.by,
      ...walkthrough.pr && one.review === void 0 && { resolvePending: true },
      ...one.review !== void 0 && { resolveReview: one.review },
      ...takesBack(one) && { unresolvable: true }
    };
  };
  const placed2 = (place) => {
    const step = anchorOf(walkthrough, place);
    const fileStep = step === null ? stepOfFile(walkthrough, place.file) : void 0;
    const code2 = "lines" in place ? place.code ?? (step === null ? void 0 : codeAt(walkthrough, place.file, place.lines)) : void 0;
    return {
      file: place.file,
      ..."lines" in place && { lines: place.lines },
      step,
      ...code2?.length && { code: code2 },
      ...fileStep !== void 0 && { fileStep }
    };
  };
  const threads3 = [
    ...(walkthrough.threads ?? []).map(({ id, file: file2, lines, linesHash = "", code: code2, resolved: was, author, at, body, replies }) => ({
      id,
      ...placed2(lines ? { file: file2, lines, linesHash, ...code2 && { code: code2 } } : { file: file2 }),
      colleague: true,
      ...resolvedIn(id, was),
      comments: [
        { id, by: "colleague", author, at, body },
        ...replies.map((reply, number) => ({ id: `${id}.${String(number + 1)}`, by: "colleague", ...reply })),
        ...ownIn(id)
      ]
    })),
    ...[...roots].filter(([id]) => !gone.has(id)).map(([id, place]) => ({ id, ...placed2(place), ...resolvedIn(id), comments: ownIn(id) }))
  ];
  const wrote = new Map([...comments3].map(([id, one]) => [id, one.wrote]));
  const dropped = [...comments3.values()].filter((one) => one.deleted && one.view.by === "ai" && roots.has(one.view.id)).map((one) => ({ ...one, place: roots.get(one.view.id) }));
  return { threads: threads3, submits, posted: posted2, resolved, kept, wrote, dropped };
}
function fileMarks(steps3) {
  return Object.fromEntries(
    steps3.flatMap(
      (step) => parseDiff(step.diff).map((file2) => {
        const name2 = file2.isDeleted ? file2.oldName : file2.newName;
        return [name2, `${name2}:${fingerprint(JSON.stringify(file2))}`];
      })
    )
  );
}
function walkthroughVersion(dir) {
  const branch = branchOfDir(dir);
  const stats = ["walkthrough.json", "review.jsonl", "viewed.json", "listener.json"].map((name2) => {
    const stat = fs5.statSync(path6.join(dir, name2), { throwIfNoEntry: false });
    return stat ? `${String(stat.ino)}-${String(stat.size)}-${String(stat.mtimeMs)}` : "";
  });
  return fingerprint([...stats, String(listenerGone(dir)), branch === void 0 ? "" : branchHead(branch) ?? ""].join(":"));
}
var branchHead = (branch) => commitOf(process.cwd(), `refs/heads/${branch}`);
var between = /* @__PURE__ */ new Map();
function sinceOf(walkthrough, head) {
  const key2 = [process.cwd(), head, walkthrough.head].join(":");
  if (!between.has(key2)) {
    between.clear();
    between.set(key2, changesBetween(process.cwd(), head, walkthrough.head));
  }
  const found = between.get(key2);
  if (!found) return null;
  const shown = new Set(walkthrough.steps.flatMap((step) => step.files));
  return { head, commits: found.commits, files: Object.fromEntries(Object.entries(found.files).filter(([file2]) => shown.has(file2))) };
}
function walkthroughView(dir) {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return null;
  const { threads: threads3, submits, posted: posted2, kept } = replay(walkthrough, logOf(dir));
  const marks = readJson(files(dir).viewed, []);
  const current3 = fileMarks(walkthrough.steps);
  const last = submits.at(-1);
  const showsSubmitted = last && last.head === walkthrough.head && !kept.some((one) => one.pending) && !threads3.some((one) => one.resolvePending);
  const address = last && posted2.get(last.id);
  const ready2 = walkthrough.ready !== false && walkthrough.steps.length > 0;
  return {
    ...walkthrough,
    ready: ready2,
    sessionGone: !ready2 && listenerGone(dir),
    changedFiles: ready2 ? [] : fileStats(process.cwd(), walkthrough.base, walkthrough.head),
    threads: threads3,
    viewed: Object.entries(current3).flatMap(([file2, mark]) => marks.includes(mark) ? [file2] : []),
    changed: Object.entries(current3).flatMap(
      ([file2, mark]) => !marks.includes(mark) && marks.some((one) => markedFile(one) === file2) ? [file2] : []
    ),
    submitted: showsSubmitted ? {
      id: last.id,
      ...last.type && { type: last.type },
      summary: last.summary,
      comments: kept.filter((one) => one.review === last.id).length,
      posted: posted2.has(last.id),
      ...address !== void 0 && { address }
    } : null,
    since: ready2 && last && last.head !== walkthrough.head ? sinceOf(walkthrough, last.head) : null,
    behind: walkthrough.kind === "branch" && (branchHead(walkthrough.branch) ?? walkthrough.head) !== walkthrough.head
  };
}
async function comment(dir, { comment: id, text: text2, delete: deleting, thread, ...where }) {
  const said2 = cleanText(text2);
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return false;
  const { threads: threads3 } = replay(walkthrough, logOf(dir));
  if (id !== void 0) {
    const pending = threads3.flatMap((one) => one.comments).some((one) => one.id === id && one.pending);
    if (typeof id !== "string" || !pending) return false;
    if (deleting === true && text2 === void 0) return !!await record(dir, { kind: "delete", comment: id });
    return !!said2 && deleting === void 0 && !!await record(dir, { kind: "edit", comment: id, text: said2 });
  }
  if (!said2) return false;
  if (thread !== void 0) {
    if (!threads3.some((one) => one.id === thread)) return false;
    return !!await record(dir, { kind: "comment", by: "you", text: said2, thread });
  }
  const place = placeOrNull(walkthrough, where);
  return !!place && !!await record(dir, { kind: "comment", by: "you", text: said2, place });
}
var placeOrNull = (walkthrough, where) => {
  try {
    return placeIn(walkthrough, where);
  } catch {
    return null;
  }
};
async function ask(dir, { text: text2, thread, ...where }) {
  const said2 = cleanText(text2);
  const walkthrough = readWalkthrough(dir);
  if (!said2 || !walkthrough) return false;
  if (thread !== void 0) {
    if (!replay(walkthrough, logOf(dir)).threads.some((one) => one.id === thread)) return false;
    return !!await record(dir, { kind: "ask", text: said2, thread });
  }
  const place = placeOrNull(walkthrough, where);
  return !!place && !!await record(dir, { kind: "ask", text: said2, place });
}
var threadOf = (dir, id) => {
  const walkthrough = readWalkthrough(dir);
  return walkthrough ? replay(walkthrough, logOf(dir)).threads.find((one) => one.id === id) : void 0;
};
async function resolve(dir, { thread }) {
  const found = threadOf(dir, thread);
  return !!found?.colleague && !found.resolved && !!await record(dir, { kind: "resolve", thread: found.id, by: "you" });
}
async function unresolve(dir, { thread }) {
  const found = threadOf(dir, thread);
  return !!found?.unresolvable && !!await record(dir, { kind: "unresolve", thread: found.id });
}
async function aiResolve(dir, id) {
  const found = threadOf(dir, id);
  const first = found?.comments[0];
  if (logOf(dir).some((event) => event.kind === "delete" && event.comment === id)) throw new Error(`the comment ${id} was deleted`);
  if (!found || !first) throw new Error(`no thread starts with the comment ${id}; pass the id of your comment that started it`);
  if (first.by !== "ai") throw new Error(`the comment ${id} is not yours`);
  if (first.pending) throw new Error(`the comment ${id} is still pending: it has not gone out with a review`);
  if (found.resolved) throw new Error(`the thread of the comment ${id} is already resolved`);
  await record(dir, { kind: "resolve", thread: id, by: "ai" });
}
async function submit(dir, { type, summary }) {
  const view = walkthroughView(dir);
  if (!view || summary !== void 0 && typeof summary !== "string" || view.submitted) return false;
  const pending = view.threads.flatMap((one) => one.comments).some((one) => one.pending);
  if (view.pr ? !REVIEW_TYPES.includes(type) || view.pr.yours && type !== "comment" : type !== void 0 || !pending) return false;
  return !!await record(dir, { kind: "submit", ...view.pr && { type }, summary: cleanText(summary), head: view.head });
}
async function markViewed(dir, { file: file2, viewed }) {
  const walkthrough = readWalkthrough(dir);
  const mark = walkthrough && typeof file2 === "string" ? fileMarks(walkthrough.steps)[file2] : void 0;
  if (!mark || typeof viewed !== "boolean") return false;
  const marks = files(dir).viewed;
  await locked(marks, () => {
    const kept = readJson(marks, []).filter((one) => markedFile(one) !== file2);
    writeJson(marks, viewed ? [...kept, mark] : kept);
  });
  return true;
}
async function aiComments(dir, given) {
  const recorded = [];
  for (const { place, body } of given) recorded.push(await record(dir, { kind: "comment", by: "ai", text: body, place }));
  return recorded;
}
async function answer(dir, id, text2) {
  if (!logOf(dir).some((event) => event.kind === "ask" && event.id === id)) throw new Error(`the page asked nothing with the id ${id}`);
  await record(dir, { kind: "answer", ask: id, text: text2 });
}
async function markPosted(dir, address) {
  const log = logOf(dir);
  const last = log.findLast((event) => event.kind === "submit");
  if (!last || log.some((event) => event.kind === "posted" && event.submit === last.id)) throw new Error("the person has submitted no review that is not posted yet");
  await record(dir, { kind: "posted", submit: last.id, ...address !== void 0 && { address } });
}
var AI_PREFIX = "[AI] ";
var whereOf = ({ file: file2, lines }) => lines ? { file: file2, lines } : { file: file2, subject: "file" };
function reviewComments(dir, all = false) {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return [];
  const log = logOf(dir);
  const { threads: threads3, submits, posted: posted2, resolved, wrote, dropped } = replay(walkthrough, log);
  const review = submits.findLast((one) => !posted2.has(one.id))?.id;
  const reworded = (one) => all && one.by === "ai" && wrote.get(one.id) !== one.body ? { wrote: AI_PREFIX + (wrote.get(one.id) ?? "") } : {};
  const inReview = (one) => all ? one.pending === true || one.review !== void 0 : review === void 0 ? one.pending : one.review === review;
  return [
    ...threads3.flatMap(
      (thread) => thread.comments.filter(inReview).map((one) => {
        const body = one.by === "ai" ? AI_PREFIX + one.body : one.body;
        const by = one.by === "colleague" ? one.author : one.by;
        return one.id === thread.id ? { kind: "comment", id: one.id, by, ...whereOf(thread), body, ...reworded(one), ...thread.step === null && { outdated: true } } : { kind: "reply", id: one.id, by, thread: thread.id, body, ...reworded(one) };
      })
    ),
    ...(all ? dropped : []).map(({ view, wrote: text2, place }) => ({ kind: "comment", id: view.id, by: "ai", ...whereOf(place), body: AI_PREFIX + text2, deleted: true })),
    ...[...resolved].filter(([, one]) => all || one.review === review && (walkthrough.pr || one.by === "you")).map(([id, one]) => {
      const thread = one.by === "ai" ? threads3.find((found) => found.id === id) : void 0;
      return thread ? { kind: "resolve", thread: id, by: "ai", ...whereOf(thread), body: AI_PREFIX + (thread.comments[0]?.body ?? "") } : { kind: "resolve", thread: id };
    })
  ];
}
var withoutPrefix = (body) => body.startsWith(AI_PREFIX) ? body.slice(AI_PREFIX.length).trim() : body.trim();
var LISTEN_EVERY_MS = 500;
var LISTEN_GAP_MS = 15e3;
var listenerAlive = (dir) => {
  const now = readJson(files(dir).listener, null);
  return now?.state === "listening" && alive(now);
};
function listenerGone(dir) {
  const stat = fs5.statSync(files(dir).listener, { throwIfNoEntry: false });
  return !!stat && Date.now() - stat.mtimeMs > LISTEN_GAP_MS && !listenerAlive(dir);
}
var forgetStoppedListener = (dir) => hold(dir, () => {
  if (!listenerAlive(dir)) fs5.rmSync(files(dir).listener, { force: true });
});
function handedAsk(dir, event) {
  const walkthrough = readWalkthrough(dir);
  const thread = walkthrough && replay(walkthrough, logOf(dir)).threads.find((one) => one.comments.some((said2) => said2.id === event.id));
  const before = thread?.comments.slice(0, thread.comments.findIndex((said2) => said2.id === event.id)) ?? [];
  return {
    kind: "ask",
    id: event.id,
    text: event.text,
    ...thread && whereOf(thread),
    thread: before.map((said2) => ({ by: said2.by === "colleague" ? said2.author : said2.by, body: said2.body }))
  };
}
async function listen(dir, pageRunning) {
  const { inbox, listener } = files(dir);
  const mine = () => {
    const now = readJson(listener, null);
    return now?.state === "listening" && now.pid === process.pid;
  };
  const started = psStart(process.pid);
  await hold(dir, () => {
    writeJson(listener, { state: "listening", pid: process.pid, started });
  });
  const release = () => hold(dir, () => {
    if (mine()) writeJson(listener, { state: "stopped" });
  });
  for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"])
    process.once(signal, () => {
      void release().finally(() => process.exit(0));
    });
  for (; ; ) {
    const taken = await hold(dir, () => {
      if (!mine()) return "replaced";
      const events = readLines(inbox);
      if (!events.length) return null;
      fs5.rmSync(inbox, { force: true });
      writeJson(listener, { state: "stopped" });
      return events;
    });
    if (taken) return taken;
    if (!pageRunning()) {
      await release();
      return "stopped";
    }
    await new Promise((resolve2) => setTimeout(resolve2, LISTEN_EVERY_MS));
  }
}

// src/list.ts
var ACTIVITY = ["walkthrough.json", "review.jsonl", "viewed.json"];
function listView(repoDir2) {
  const entries = fs6.existsSync(repoDir2) ? fs6.readdirSync(repoDir2, { withFileTypes: true }) : [];
  const listed = entries.flatMap((entry) => {
    const dir = path7.join(repoDir2, entry.name);
    const view = entry.isDirectory() ? walkthroughView(dir) : null;
    if (!view) return [];
    const changed = ACTIVITY.map((file2) => fs6.statSync(path7.join(dir, file2), { throwIfNoEntry: false })?.mtimeMs ?? 0);
    return [
      {
        id: entry.name,
        name: view.pr ? `#${view.pr.number} ${view.pr.title}` : nameOf(view),
        files: view.steps.flatMap((step) => step.files).length,
        viewed: view.viewed.length,
        ...view.submitted && { submitted: view.submitted.type ?? "sent" },
        last: new Date(Math.max(...changed)).toISOString()
      }
    ];
  });
  return listed.sort((one, other) => other.last.localeCompare(one.last));
}
var listPage = (repoDir2) => ({
  repo: path7.basename(repoDir2).replace(/-[0-9a-f]{8}$/, ""),
  walkthroughs: listView(repoDir2)
});

// src/steps.ts
init_define_GRAMMARS();
import crypto4 from "node:crypto";
import fs7 from "node:fs";
import path8 from "node:path";

// src/copies.ts
init_define_GRAMMARS();
import { spawn } from "node:child_process";

// src/moves.ts
init_define_GRAMMARS();
var MIN_LINES = 3;
var MIN_ALNUM = 20;
function runsOf(files3, type) {
  const runs = [];
  let change = 0;
  for (const file2 of files3) {
    const name2 = file2.isDeleted ? file2.oldName : file2.newName;
    let run = [];
    for (const block2 of file2.blocks) {
      change++;
      for (const one of block2.lines) {
        if (one.type === LineType.CONTEXT) change++;
        const line = type === LineType.DELETE ? one.oldNumber : one.newNumber;
        if (one.type !== type || line === void 0) continue;
        if (run.at(-1)?.line !== line - 1) runs.push(run = []);
        run.push({ file: name2, line, text: one.content.slice(1).trimEnd(), change });
      }
    }
  }
  return runs;
}
var enough = (lines) => lines.length >= MIN_LINES && lines.reduce((sum, { text: text2 }) => sum + (text2.match(/[\p{L}\p{N}]/gu)?.length ?? 0), 0) >= MIN_ALNUM;
function findMoves(files3) {
  const added = runsOf(files3, LineType.INSERT);
  const starts = /* @__PURE__ */ new Map();
  for (const run of added) run.forEach(({ text: text2 }, at) => starts.set(text2, [...starts.get(text2) ?? [], [run, at]]));
  const used = /* @__PURE__ */ new Set();
  const moves = [];
  for (const gone of runsOf(files3, LineType.DELETE))
    for (let at = 0; at < gone.length; ) {
      let best = null;
      for (const [run, from] of starts.get(gone[at]?.text ?? "") ?? []) {
        let count = 0;
        for (let line = run[from + count]; line && !used.has(line) && gone[at + count]?.text === line.text && gone[at + count]?.change !== line.change; line = run[from + count]) count++;
        if (count > (best?.count ?? 0)) best = { run, from, count };
      }
      const left = gone.slice(at, at + (best?.count ?? 0));
      const [first] = left;
      const arrived = best?.run[best.from];
      if (!best || !first || !arrived || !enough(left)) {
        at++;
        continue;
      }
      for (const line of best.run.slice(best.from, best.from + best.count)) used.add(line);
      moves.push({ from: { file: first.file, line: first.line }, to: { file: arrived.file, line: arrived.line }, count: best.count });
      at += best.count;
    }
  return moves;
}

// src/copies.ts
var MAX_ADDED = 5e3;
function gitOut(cwd, args, input) {
  return new Promise((resolve2) => {
    const child = spawn("git", args, { cwd, stdio: ["pipe", "pipe", "ignore"] });
    const chunks = [];
    child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.on("error", () => {
      resolve2(Buffer.alloc(0));
    });
    child.on("close", (code2) => {
      resolve2(code2 === 0 ? Buffer.concat(chunks) : Buffer.alloc(0));
    });
    child.stdin.end(input);
  });
}
var keyOf = (file2, line) => `${file2}
${String(line)}`;
var MAX_HITS = 20;
var hasWord = (text2) => /[\p{L}\p{N}]/u.test(text2);
async function grep(cwd, head, patterns) {
  const out = await gitOut(cwd, ["grep", "-F", "--line-number", "-z", "-I", "--full-name", "--no-color", "-f", "-", head, "--", ":(top)"], `${patterns.join("\n")}
`);
  return out.toString("utf8").split("\n").flatMap((record2) => {
    const [file2 = "", line = "", ...text2] = record2.split("\0");
    return file2.startsWith(`${head}:`) ? [{ file: file2.slice(head.length + 1), line: Number(line), text: text2.join("\0").trimEnd() }] : [];
  });
}
async function linesAt(cwd, head, files3) {
  const out = await gitOut(cwd, ["cat-file", "--batch"], files3.map((file2) => `${head}:${file2}
`).join(""));
  const read2 = /* @__PURE__ */ new Map();
  let at = 0;
  for (const file2 of files3) {
    const end = out.indexOf(10, at);
    if (end < 0) break;
    const size = Number(/ blob (\d+)$/.exec(out.subarray(at, end).toString())?.[1] ?? -1);
    if (size < 0) {
      at = end + 1;
      continue;
    }
    read2.set(file2, out.subarray(end + 1, end + 1 + size).toString("utf8").split("\n"));
    at = end + 1 + size + 1;
  }
  return read2;
}
async function findCopies(cwd, head, diff, steps3) {
  const files3 = parseDiff(diff);
  const moved = new Set(findMoves(files3).flatMap(({ to, count }) => Array.from({ length: count }, (_, at) => keyOf(to.file, to.line + at))));
  const added = runsOf(files3, LineType.INSERT).flatMap((run) => {
    const pieces = [];
    let piece = [];
    for (const line of run)
      if (moved.has(keyOf(line.file, line.line))) piece = [];
      else {
        if (!piece.length) pieces.push(piece);
        piece.push(line);
      }
    return pieces;
  });
  if (added.reduce((sum, run) => sum + run.length, 0) > MAX_ADDED) return [];
  const runOf = new Map(added.flatMap((run, at) => run.map((line) => [keyOf(line.file, line.line), at])));
  const deleted = new Set(runsOf(files3, LineType.DELETE).flatMap((run) => run.map((line) => `${String(line.change)}
${line.text}`)));
  const runs = added.map((lines, at) => ({ lines, at })).filter(({ lines }) => enough(lines) && !lines.some((line) => deleted.has(`${String(line.change)}
${line.text}`)));
  if (!runs.length) return [];
  const hits = /* @__PURE__ */ new Map();
  const starts = new Set(runs.flatMap(({ lines }) => lines.filter((line) => hasWord(line.text)).map((line) => line.text)));
  for (const hit of await grep(cwd, head, [...starts])) if (starts.has(hit.text)) hits.set(hit.text, [...hits.get(hit.text) ?? [], hit]);
  for (const [text2, found] of hits) if (found.length > MAX_HITS) hits.delete(text2);
  const read2 = await linesAt(cwd, head, [...new Set([...hits.values()].flat().map((hit) => hit.file))].filter((file2) => !file2.includes("\n")));
  const copies = [];
  for (const { lines, at: index } of runs)
    for (let at = 0; at < lines.length; ) {
      const first = lines[at];
      const later = (file3, line2) => (runOf.get(keyOf(file3, line2)) ?? -1) >= index;
      const isAdded = (file3, line2, count2) => Array.from({ length: count2 }, (_, offset) => runOf.has(keyOf(file3, line2 + offset))).includes(true);
      const score = (file3, line2, count2) => count2 * 4 - (isAdded(file3, line2, count2) ? 2 : 0) - (file3 === first?.file ? 0 : 1);
      let best = null;
      for (const { file: file3, line: line2 } of hits.get(first?.text ?? "") ?? []) {
        let count2 = 0;
        while (lines[at + count2] && !later(file3, line2 + count2) && read2.get(file3)?.[line2 - 1 + count2]?.trimEnd() === lines[at + count2]?.text) count2++;
        if (count2 && score(file3, line2, count2) > (best?.score ?? 0)) best = { file: file3, line: line2, count: count2, score: score(file3, line2, count2) };
      }
      const part = lines.slice(at, at + (best?.count ?? 0));
      if (!best || !first || !enough(part)) {
        at++;
        continue;
      }
      const { file: file2, line, count } = best;
      const step = steps3.find((one) => one.files.includes(file2));
      const shown = step && shownLines(step, file2);
      const inDiff = !!shown && part.every((_, offset) => shown.has(line + offset));
      copies.push({ from: { file: file2, line }, to: { file: first.file, line: first.line }, count, inDiff });
      at += count;
    }
  return copies;
}
async function withCopies(cwd, head, steps3) {
  const copies = await findCopies(cwd, head, steps3.map((step) => step.diff).join(""), steps3);
  return steps3.map((step) => {
    const mine = copies.filter((copy) => step.files.includes(copy.to.file));
    const kept = { ...step };
    delete kept.copies;
    return mine.length ? { ...kept, copies: mine } : kept;
  });
}

// src/steps.ts
var MAX_LOOK = 2;
var LOOK_WORDS = 4;
var wordCount = (text2) => text2.trim().split(/\s+/).length;
function parseLook(given, name2) {
  const { file: file2, start: start3, end, label } = fieldsOf(given);
  if (!filled(file2)) throw new Error(`${name2} needs a file`);
  if (!Number.isInteger(start3) || !Number.isInteger(end) || start3 < 1 || start3 > end)
    throw new Error(`${name2} needs a start and an end line, the start first`);
  if (!filled(label) || wordCount(label) > LOOK_WORDS) throw new Error(`${name2} needs a label of 1 to ${String(LOOK_WORDS)} words`);
  return { file: file2, start: start3, end, label: label.trim() };
}
var SCREENSHOT_TYPES = { png: "image/png", jpg: "image/jpeg", gif: "image/gif", webp: "image/webp" };
var MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
var imageType = (bytes) => {
  const starts = (text2, at = 0) => bytes.subarray(at, at + text2.length).equals(Buffer.from(text2, "latin1"));
  if (starts("\x89PNG\r\n\n")) return "png";
  if (starts("\xFF\xD8\xFF")) return "jpg";
  if (starts("GIF87a") || starts("GIF89a")) return "gif";
  return starts("RIFF") && starts("WEBP", 8) ? "webp" : null;
};
function readScreenshot(file2, name2) {
  let bytes;
  try {
    if (fs7.statSync(file2).size > MAX_SCREENSHOT_BYTES) return `${name2}: its screenshot ${file2} is over 5 MB`;
    bytes = fs7.readFileSync(file2);
  } catch {
    return `${name2}: its screenshot ${file2} cannot be read`;
  }
  const type = imageType(bytes);
  if (!type) return `${name2}: its screenshot ${file2} is not a PNG, JPEG, GIF or WebP image`;
  return { file: file2, bytes, name: `${crypto4.createHash("sha256").update(bytes).digest("hex")}.${type}` };
}
function parseScreenshot(given, name2) {
  const { file: file2, alt = "" } = fieldsOf(given);
  if (!filled(file2) || typeof alt !== "string") throw new Error(`${name2}: a screenshot is {"file": path, "alt": text}`);
  return { file: file2, alt: alt.trim() };
}
function parseSteps(text2) {
  return parseList(text2, "the steps", (step, number) => {
    const name2 = `step ${String(number)}`;
    const { title, explanation, files: files3, look = [], screenshot } = step;
    if (!filled(title)) throw new Error(`${name2} needs a title`);
    if (!filled(explanation)) throw new Error(`${name2} needs an explanation`);
    if (!Array.isArray(files3) || !files3.length) throw new Error(`${name2}: files must be a list of at least one file`);
    const folded = {};
    const paths = files3.map((file2) => {
      if (filled(file2)) return file2;
      const { path: path14, folded: reason } = fieldsOf(file2);
      if (!filled(path14) || !filled(reason)) throw new Error(`${name2}: each file is a path, or a path with the reason it is folded`);
      folded[path14] = reason.trim();
      return path14;
    });
    if (!Array.isArray(look) || look.length > MAX_LOOK) throw new Error(`${name2}: look must be a list of at most ${String(MAX_LOOK)} pointers`);
    return {
      title,
      explanation,
      files: paths,
      ...Object.keys(folded).length && { folded },
      look: look.map((one, at) => parseLook(one, `${name2}, pointer ${String(at + 1)}`)),
      ...screenshot !== void 0 && { screenshot: screenshot === null ? null : parseScreenshot(screenshot, name2) }
    };
  });
}
function stepIds({ steps: steps3, lastStep = 0 }, inputs) {
  let next = Math.max(lastStep, ...steps3.map((step) => Number(step.id)));
  const pairs = inputs.flatMap((input, at) => {
    const files3 = new Set(input.files);
    return steps3.map((step, old) => ({ at, old, id: step.id, shared: step.files.filter((one) => files3.has(one)).length }));
  });
  pairs.sort((one, other) => other.shared - one.shared || one.old - other.old || one.at - other.at);
  const ids = inputs.map(() => void 0);
  const taken = /* @__PURE__ */ new Set();
  for (const { at, id, shared } of pairs)
    if (shared > 0 && ids[at] === void 0 && !taken.has(id)) {
      ids[at] = id;
      taken.add(id);
    }
  return ids.map((id) => id ?? String(++next));
}
var lookShown = (step, { file: file2, start: start3, end }) => {
  const shown = step.files.includes(file2) ? shownLines(step, file2) : null;
  return !!shown?.has(start3) && shown.has(end);
};
async function buildSteps(cwd, dir, walkthrough, inputs) {
  const { base, head } = walkthrough;
  const changed = new Map((await changedFiles(cwd, base, head)).map((file2) => [file2.path, file2]));
  const problems = [];
  const placed2 = /* @__PURE__ */ new Set();
  for (const one of inputs.flatMap((input) => input.files)) {
    if (!changed.has(one)) problems.push(`${one} is not changed in this walkthrough`);
    else if (placed2.has(one)) problems.push(`${one} is in more than one step`);
    placed2.add(one);
  }
  const left = [...changed.keys()].filter((one) => !placed2.has(one));
  if (left.length > 0) problems.push(`no step has ${left.join(", ")}`);
  const shots = inputs.map((input, at) => input.screenshot ? readScreenshot(input.screenshot.file, `step ${String(at + 1)}`) : null);
  problems.push(...shots.filter((shot) => typeof shot === "string"));
  if (problems.length > 0) throw new Error(`the steps were not recorded:
  ${[...new Set(problems)].join("\n  ")}`);
  const ids = stepIds(walkthrough, inputs);
  const steps3 = await Promise.all(
    inputs.map(async ({ screenshot, ...input }, at) => {
      const id = ids[at] ?? "";
      const shot = shots[at];
      const kept = screenshot && shot && typeof shot !== "string" ? { name: shot.name, alt: screenshot.alt } : screenshot === void 0 ? walkthrough.steps.find((old) => old.id === id)?.screenshot : void 0;
      return {
        id,
        ...input,
        ...kept && { screenshot: kept },
        diff: await diffOf(cwd, base, head, input.files.flatMap((one) => changed.get(one) ?? []))
      };
    })
  );
  const astray = steps3.flatMap(
    (step, at) => step.look.filter((one) => !lookShown(step, one)).map((one) => `step ${String(at + 1)} points to lines ${String(one.start)}-${String(one.end)} of ${one.file}, which are not in its diff`)
  );
  if (astray.length) throw new Error(`the steps were not recorded:
  ${astray.join("\n  ")}`);
  for (const shot of shots)
    if (shot && typeof shot !== "string") {
      fs7.writeFileSync(path8.join(dir, shot.name), shot.bytes, { mode: 384 });
      if (inInbox(shot.file)) fs7.rmSync(shot.file);
    }
  return withCopies(cwd, head, steps3);
}
async function carrySteps(cwd, { base, head, steps: steps3 }) {
  const changed = new Map((await changedFiles(cwd, base, head)).map((file2) => [file2.path, file2]));
  const carried = await Promise.all(
    steps3.map(async (step) => {
      const files3 = step.files.filter((one) => changed.has(one));
      if (!files3.length) return null;
      const moved = { ...step, files: files3, diff: await diffOf(cwd, base, head, files3.flatMap((one) => changed.get(one) ?? [])) };
      return { ...moved, look: moved.look.filter((one) => lookShown(moved, one)) };
    })
  );
  const kept = await withCopies(cwd, head, carried.filter((step) => step !== null));
  const placed2 = new Set(kept.flatMap((step) => step.files));
  return { steps: kept, unplaced: [...changed.keys()].filter((file2) => !placed2.has(file2)) };
}

// src/viewer.ts
init_define_GRAMMARS();
var THEMES = ["system", "light", "dark"];
var DEFAULT_VIEWER = { theme: "system", colourBlind: false };
function mergeViewer(base, change) {
  const given = typeof change === "object" && change !== null ? change : {};
  const theme = THEMES.find((one) => one === given["theme"]) ?? base.theme;
  const colourBlind = typeof given["colourBlind"] === "boolean" ? given["colourBlind"] : base.colourBlind;
  return { theme, colourBlind };
}

// src/words.ts
init_define_GRAMMARS();
var plural = (count, word) => `${String(count)} ${word}${count === 1 ? "" : "s"}`;
var MAX_TEXT = 4e3;
function tooLong(fields) {
  const long = Object.values(fields).find((value) => typeof value === "string" && value.length > MAX_TEXT);
  return long === void 0 ? null : `That text is ${String(long.length)} characters long; the most it can be is ${String(MAX_TEXT)}.`;
}

// src/server.ts
var SCRIPT = fileURLToPath(import.meta.url);
var MAX_BODY_BYTES = 256 * 1024;
var IDLE_MS = 30 * 60 * 1e3;
var PAGE = path9.join(import.meta.dirname, "page");
var SHARED_FILES = {
  "style.css": { file: "style.css", type: "text/css; charset=utf-8" },
  ...Object.fromEntries(["reading", "awake", "done", "ended", "asleep"].map((state) => [`favicon-${state}.svg`, { file: `favicon-${state}.svg`, type: "image/svg+xml" }])),
  "apple-touch-icon.png": { file: "app-icon-180.png", type: "image/png" }
};
var PAGE_FILES = {
  "": { file: "index.html", type: "text/html; charset=utf-8" },
  "app.js": { file: "app.js", type: "text/javascript; charset=utf-8" },
  ...SHARED_FILES
};
var LIST_FILES = {
  "": { file: "list.html", type: "text/html; charset=utf-8" },
  "list.js": { file: "list.js", type: "text/javascript; charset=utf-8" },
  ...SHARED_FILES
};
var JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
var SECURITY_HEADERS = {
  "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "cross-origin-resource-policy": "same-origin"
};
var viewerFile = () => path9.join(stateDir(), "viewer.json");
var readViewer = (file2 = viewerFile()) => mergeViewer(DEFAULT_VIEWER, readJson(file2, {}));
function saveViewer(change, file2 = viewerFile()) {
  const saved = mergeViewer(readViewer(file2), change);
  writeJson(file2, saved);
  return saved;
}
var recordFile = (dir) => path9.join(dir, "server.json");
var readRecord = (dir) => readJson(recordFile(dir), null);
function pageToken(dir) {
  const file2 = path9.join(dir, "token");
  try {
    const kept = fs8.readFileSync(file2, "utf8").trim();
    if (/^[0-9a-f]{48}$/.test(kept)) return kept;
  } catch {
  }
  const token = crypto5.randomBytes(24).toString("hex");
  fs8.writeFileSync(file2, `${token}
`, { mode: 384 });
  return token;
}
function serverRunning(dir) {
  const record2 = readRecord(dir);
  return !!record2 && alive(record2);
}
var sleep = (ms) => new Promise((resolve2) => {
  setTimeout(resolve2, ms);
});
function ensureServer(dir, list3 = false) {
  fs8.mkdirSync(dir, { recursive: true, mode: 448 });
  return locked(recordFile(dir), async () => {
    const running = readRecord(dir);
    if (running && alive(running)) {
      if (running.script === SCRIPT) return running.url;
      await stopServer(dir);
    }
    const log = fs8.openSync(path9.join(dir, "server.log"), "a", 384);
    const child = spawn2(process.execPath, [SCRIPT, "serve", dir, ...list3 ? ["--list"] : []], {
      // Not the folder start ran in, which may be a worktree removed while the page is open.
      cwd: commonDir(process.cwd()),
      detached: true,
      stdio: ["ignore", log, log]
    });
    child.unref();
    fs8.closeSync(log);
    for (const end = Date.now() + 1e4; Date.now() < end; await sleep(50)) {
      const record2 = readRecord(dir);
      if (record2 && record2.pid === child.pid) return record2.url;
    }
    throw new Error(`the page server did not start; see ${path9.join(dir, "server.log")}`);
  });
}
async function stopServer(dir) {
  const record2 = readRecord(dir);
  if (!record2 || !alive(record2)) {
    fs8.rmSync(recordFile(dir), { force: true });
    return false;
  }
  process.kill(record2.pid, "SIGTERM");
  for (const end = Date.now() + 8e3; Date.now() < end && alive(record2); ) await sleep(50);
  if (alive(record2)) process.kill(record2.pid, "SIGKILL");
  fs8.rmSync(recordFile(dir), { force: true });
  return true;
}
function serve(dir, list3 = false) {
  if (!inState(dir))
    throw new Error(`serve serves only a walkthrough folder under ${stateDir()}`);
  const token = pageToken(dir);
  const stop = () => ({ status: 200, body: { stopped: true }, after: shutDown });
  const viewer = (change) => ({ status: 200, body: saveViewer(change) });
  const routes = list3 ? { "/open": ({ id }) => open(dir, id), "/stop": stop, "/viewer": viewer } : {
    "/viewer": viewer,
    "/viewed": async (fields) => answered(dir, await markViewed(dir, fields)),
    "/comment": async (fields) => answered(dir, await comment(dir, fields)),
    "/ask": async (fields) => answered(dir, await ask(dir, fields)),
    "/resolve": async (fields) => answered(dir, await resolve(dir, fields)),
    "/unresolve": async (fields) => answered(dir, await unresolve(dir, fields)),
    "/submit": async (fields) => answered(dir, await submit(dir, fields)),
    "/code": async ({ language, file: file2, code: code2 }) => typeof code2 === "string" && (typeof language === "string" || typeof file2 === "string") ? { status: 200, body: await tokensFor(code2, typeof language === "string" ? { language } : { file: String(file2) }) ?? PLAIN } : { status: 400 },
    "/stop": stop
  };
  let seen = Date.now();
  const server = http.createServer((req, res) => {
    if (req.url?.startsWith(`/s/${token}/`)) seen = Date.now();
    try {
      gate(req, res, { dir, list: list3, token, port: String(server.address().port), routes });
    } catch (error) {
      failRequest(res, error);
    }
  });
  const shutDown = () => {
    if (readRecord(dir)?.pid === process.pid) fs8.rmSync(recordFile(dir), { force: true });
    process.exit(0);
  };
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);
  process.on("uncaughtException", logged);
  const idleMs = Number(process.env["WALKTHROUGH_IDLE_MS"]) || IDLE_MS;
  setInterval(() => {
    if (Date.now() - seen > idleMs) shutDown();
  }, Math.min(idleMs / 4, 6e4));
  server.listen(0, "127.0.0.1", () => {
    const { port } = server.address();
    const record2 = {
      pid: process.pid,
      started: psStart(process.pid),
      url: `http://127.0.0.1:${String(port)}/s/${token}/`,
      script: SCRIPT
    };
    writeJson(recordFile(dir), record2);
  });
}
var answered = (dir, done) => done ? { status: 200, body: walkthroughView(dir) } : { status: 400 };
async function open(repoDir2, id) {
  const listed = listView(repoDir2).find((one) => one.id === id);
  return listed ? { status: 200, body: { url: await ensureServer(path9.join(repoDir2, listed.id)) } } : { status: 400 };
}
var logged = (error) => {
  console.error(`walkthrough server: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
};
function failRequest(res, error) {
  logged(error);
  if (res.headersSent) res.end();
  else res.writeHead(500, JSON_HEADERS).end(JSON.stringify({ error: "walkthrough could not do that" }));
}
async function inChange(base, head, file2, type) {
  const changed = (await changedFiles(process.cwd(), base, head)).map((one) => one.path);
  if (changed.includes(file2)) return true;
  return type.startsWith("image/") && changed.some(
    (markdown) => previewType(markdown)?.startsWith("text/markdown") && imagesIn(markdown, fileAt(process.cwd(), head, markdown)?.toString("utf8") ?? "").includes(file2)
  );
}
async function serveFileAt(dir, file2, atBase, res) {
  const walkthrough = readWalkthrough(dir);
  const type = previewType(file2);
  const shown = walkthrough && type && (atBase ? (await changedFiles(process.cwd(), walkthrough.base, walkthrough.head)).some((one) => (one.from ?? one.path) === file2) : await inChange(walkthrough.base, walkthrough.head, file2, type));
  const content = shown ? fileAt(process.cwd(), atBase ? walkthrough.base : walkthrough.head, file2) : null;
  if (!type || !content) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, {
    "content-type": type,
    "cache-control": "no-store",
    "content-security-policy": "default-src 'none'; sandbox"
  }).end(content);
}
function serveFile(dir, list3, what, req, res) {
  const query = new URL(req.url ?? "", "http://127.0.0.1").searchParams;
  if (!list3 && what === "data/walkthrough.json") {
    const walkthrough = readWalkthrough(dir);
    if (walkthrough) warm(process.cwd(), walkthrough.base, walkthrough.head, walkthrough.steps.flatMap((step) => step.files));
    const tag = `"${walkthroughVersion(dir)}"`;
    if (req.headers["if-none-match"] === tag) res.writeHead(304, { etag: tag, "cache-control": "no-store" }).end();
    else res.writeHead(200, { ...JSON_HEADERS, etag: tag }).end(JSON.stringify(walkthroughView(dir)));
    return;
  }
  if (!list3 && what === "file") {
    serveFileAt(dir, query.get("path") ?? "", query.get("at") === "base", res).catch((error) => {
      failRequest(res, error);
    });
    return;
  }
  if (!list3 && what === "tokens") {
    tokensAt(process.cwd(), query.get("rev") ?? "", query.get("path") ?? "").then((lines) => res.writeHead(200, JSON_HEADERS).end(JSON.stringify(lines ?? PLAIN))).catch((error) => {
      failRequest(res, error);
    });
    return;
  }
  const screenshot = list3 ? null : /^screenshot\/([0-9a-f]{64}\.(png|jpg|gif|webp))$/.exec(what);
  if (screenshot) {
    const [, name2 = "", extension = ""] = screenshot;
    const file2 = path9.join(dir, name2);
    if (fs8.existsSync(file2))
      res.writeHead(200, { "content-type": SCREENSHOT_TYPES[extension], "cache-control": "private, max-age=31536000, immutable" }).end(fs8.readFileSync(file2));
    else res.writeHead(404).end();
    return;
  }
  const data = {
    "data/viewer.json": () => readViewer(),
    ...list3 && { "data/list.json": () => listPage(dir) }
  };
  const view = Object.hasOwn(data, what) ? data[what] : void 0;
  if (view) {
    res.writeHead(200, JSON_HEADERS).end(JSON.stringify(view()));
    return;
  }
  const files3 = list3 ? LIST_FILES : PAGE_FILES;
  const known = Object.hasOwn(files3, what) ? files3[what] : void 0;
  if (!known) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": known.type, "cache-control": "no-store" });
  fs8.createReadStream(path9.join(PAGE, known.file)).pipe(res);
}
function readBody(req, res, onBody) {
  let size = 0;
  const chunks = [];
  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES * 256) req.destroy();
    else if (size <= MAX_BODY_BYTES) chunks.push(chunk);
  });
  req.on("end", () => {
    if (size > MAX_BODY_BYTES) {
      res.writeHead(413).end();
      return;
    }
    let body = null;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
    }
    onBody(body);
  });
}
function gate(req, res, { dir, list: list3, token, port, routes }) {
  const prefix = `/s/${token}/`;
  const url = new URL(req.url ?? "", "http://127.0.0.1");
  for (const [name2, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name2, value);
  const refuse = (code2) => {
    const answer2 = () => res.writeHead(code2).end();
    req.resume();
    if (req.complete) answer2();
    else req.once("end", answer2);
  };
  const own2 = ["127.0.0.1", "localhost"].map((host2) => `${host2}:${port}`);
  const { host = "", origin } = req.headers;
  if (!own2.includes(host) || origin !== void 0 && !own2.includes(origin.replace(/^http:\/\//, ""))) {
    refuse(403);
    return;
  }
  if (req.method === "GET" && url.pathname.startsWith(prefix)) {
    serveFile(dir, list3, url.pathname.slice(prefix.length), req, res);
    return;
  }
  const given = Buffer.from(url.searchParams.get("token") ?? "");
  const expected = Buffer.from(token);
  const authorized = given.length === expected.length && crypto5.timingSafeEqual(given, expected);
  const route = Object.hasOwn(routes, url.pathname) ? routes[url.pathname] : void 0;
  if (req.method !== "POST" || !authorized || !route) {
    refuse(404);
    return;
  }
  if (!/^application\/json\b/i.test(req.headers["content-type"] ?? "")) {
    refuse(415);
    return;
  }
  readBody(req, res, (body) => {
    const fields = body && typeof body === "object" && !Array.isArray(body) ? body : {};
    const problem = tooLong(fields);
    if (problem) {
      res.writeHead(400, JSON_HEADERS).end(JSON.stringify({ error: problem }));
      return;
    }
    Promise.resolve().then(() => route(fields)).then(({ status: status2, body: said2, after }) => {
      if (after) res.once("finish", after);
      if (said2 === void 0) res.writeHead(status2).end();
      else res.writeHead(status2, JSON_HEADERS).end(JSON.stringify(said2));
    }).catch((error) => {
      failRequest(res, error);
    });
  });
}

// src/prune.ts
var gitStatus = (cwd, ...args) => spawnSync3("git", args, { cwd, stdio: "ignore" }).status;
function over(cwd, walkthrough) {
  const { target, head } = walkthrough;
  if (walkthrough.kind === "branch" && gitStatus(cwd, "rev-parse", "--verify", "--quiet", `refs/heads/${walkthrough.branch}`) === 1)
    return "its branch is gone";
  if (gitStatus(cwd, "merge-base", "--is-ancestor", head, target) === 0) return `its head is merged into ${targetName(target)}`;
  return null;
}
async function remove(dir, name2, why) {
  await stopServer(dir);
  fs9.rmSync(dir, { recursive: true, force: true });
  return `Removed the walkthrough of ${name2}: ${why}.`;
}
async function prune(cwd) {
  const repoDir2 = path10.join(stateDir(), currentRepo(cwd));
  const removed = [];
  if (!fs9.existsSync(repoDir2)) return removed;
  for (const entry of fs9.readdirSync(repoDir2, { withFileTypes: true, encoding: "utf8" })) {
    const dir = path10.join(repoDir2, entry.name);
    const walkthrough = entry.isDirectory() ? readWalkthrough(dir) : null;
    const why = walkthrough && over(cwd, walkthrough);
    if (walkthrough && why) removed.push(await remove(dir, nameOf(walkthrough), why));
  }
  return removed;
}
async function pruneOne(dir, name2) {
  if (!readWalkthrough(dir)) throw new Error(`there is no walkthrough of ${name2}`);
  return remove(dir, name2, "asked to");
}
var DAY_MS = 24 * 60 * 60 * 1e3;
async function pruneDaily(cwd) {
  const marker = path10.join(stateDir(), currentRepo(cwd), "last-prune.json");
  const due = await locked(marker, () => {
    const { at = "" } = readJson(marker, {});
    if (Date.now() - Date.parse(at) < DAY_MS) return false;
    writeJson(marker, { at: (/* @__PURE__ */ new Date()).toISOString() });
    return true;
  });
  return due ? prune(cwd) : [];
}

// src/export.ts
init_define_GRAMMARS();
var import_diff2html = __toESM(require_diff2html(), 1);
import crypto6 from "node:crypto";
import fs10 from "node:fs";
import path11 from "node:path";

// src/page/markdown.ts
init_define_GRAMMARS();
function renderer() {
  const markdown = new MarkdownItCallable({ html: false, linkify: true });
  markdown.core.ruler.push("align_by_class", (state) => {
    for (const token of state.tokens) {
      const align = /^text-align:(left|center|right)$/.exec(String(token.attrGet("style")))?.[1];
      if (!align) continue;
      token.attrs = (token.attrs ?? []).filter(([name2]) => name2 !== "style");
      token.attrJoin("class", `align-${align}`);
    }
  });
  markdown.renderer.rules["link_open"] = (tokens, at, options, _env, self) => {
    tokens[at]?.attrSet("target", "_blank");
    tokens[at]?.attrSet("rel", "noopener noreferrer");
    return self.renderToken(tokens, at, options);
  };
  return markdown;
}
var withImages = renderer();
var image2 = withImages.renderer.rules["image"];
withImages.renderer.rules["image"] = (tokens, at, options, env, self) => {
  const token = tokens[at];
  const file2 = env?.file ?? "";
  const repoPath = token && imagePath(file2, String(token.attrGet("src") ?? ""));
  if (repoPath) token.attrSet("src", `file?path=${encodeURIComponent(repoPath)}`);
  return image2 ? image2(tokens, at, options, env, self) : "";
};
withImages.core.ruler.push("mark_added", (state) => {
  const added = state.env?.added;
  if (!added?.size) return;
  for (const token of state.tokens) {
    if (token.level !== 0 || token.nesting === -1 || !token.map) continue;
    const [first, end] = token.map;
    for (let line = first + 1; line <= end; line++)
      if (added.has(line)) {
        token.attrJoin("class", "inserted");
        break;
      }
  }
});
var withoutImages = renderer().disable("image");
var fence2 = withoutImages.renderer.rules["fence"];
withoutImages.renderer.rules["fence"] = (tokens, at, options, env, self) => {
  const token = tokens[at];
  const code2 = env?.code;
  if (!token || !code2?.length || token.info.trim() !== "suggestion") return fence2 ? fence2(tokens, at, options, env, self) : "";
  const { escapeHtml: escapeHtml2 } = withoutImages.utils;
  const row = (kind, before, after, text2) => `<tr class="suggestion-${kind}"><td class="suggestion-number">${before}</td><td class="suggestion-number">${after}</td><td class="suggestion-line"><span class="suggestion-sign">${kind === "del" ? "-" : "+"}</span>${escapeHtml2(text2)}</td></tr>`;
  const first = code2[0]?.[0] ?? 1;
  const added = token.content ? token.content.replace(/\n$/, "").split("\n") : [];
  return `<div class="suggestion"><div class="suggestion-head">Suggested change</div><div class="suggestion-scroll"><table class="suggestion-code">${[
    ...code2.map(([number, text2]) => row("del", String(number), "", text2)),
    ...added.map((text2, offset) => row("add", "", String(first + offset), text2))
  ].join("")}</table></div></div>
`;
};
var renderMarkdown = (text2, file2, added) => file2 === void 0 ? withoutImages.render(text2) : withImages.render(text2, { file: file2, added });
var renderComment = (text2, code2) => withoutImages.render(text2, { code: code2 });

// src/export.ts
var hash = (text2) => `'sha256-${crypto6.createHash("sha256").update(text2).digest("base64")}'`;
var escape2 = (text2) => text2.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char);
var STATUS = { met: "Met", partly: "Partly met", "not-met": "Not met", "not-checked": "Not checked" };
var who = (said2) => said2.by === "colleague" ? said2.author ?? "" : said2.by === "ai" ? "AI" : "You";
var unescape = (text2) => text2.replace(/&(amp|lt|gt|quot);/g, (_, name2) => ({ amp: "&", lt: "<", gt: ">", quot: '"' })[name2] ?? "");
var painted = (html, runs) => (runs && colourHtml(html, runs)) ?? html;
async function colourDiff(html, file2, base, head) {
  const [before, after] = await Promise.all([
    file2.isNew ? null : tokensAt(process.cwd(), base, file2.oldName),
    file2.isDeleted ? null : tokensAt(process.cwd(), head, file2.newName)
  ]);
  return html.replace(/<tr>[\s\S]*?<\/tr>/g, (row) => {
    const removed = row.includes("d2h-code-linenumber d2h-del");
    const line = Number(new RegExp(`<div class="line-num${removed ? "1" : "2"}">(\\d+)</div>`).exec(row)?.[1]);
    const tokens = (removed ? before : after)?.[line - 1];
    return row.replace(/(<span class="d2h-code-line-ctn">)([\s\S]*?)(<\/span>)/, (_, open2, code2, close) => open2 + painted(code2, tokens) + close);
  });
}
async function stepDiff(diff, base, head) {
  const files3 = parseDiff(diff);
  const [start3 = "", ...chunks] = (0, import_diff2html.html)(files3, { outputFormat: "line-by-line", drawFileList: false, matching: "lines" }).split(/(?=<div id="d2h-\d+" class="d2h-file-wrapper")/);
  const coloured = await Promise.all(chunks.map((chunk, at) => {
    const file2 = files3[at];
    return file2 ? colourDiff(chunk, file2, base, head) : Promise.resolve(chunk);
  }));
  return start3 + coloured.join("");
}
async function colourBlocks(html) {
  const blocks = /<pre><code class="language-([^"\s]+)">([\s\S]*?)<\/code><\/pre>/g;
  const tokens = await Promise.all([...html.matchAll(blocks)].map(([, language = "", code2 = ""]) => tokensFor(unescape(code2), { language: unescape(language) })));
  let at = 0;
  return html.replace(blocks, (block2, language, code2) => {
    const lines = tokens[at++];
    return lines ? `<pre><code class="language-${language}">${painted(code2, joinLines(lines))}</code></pre>` : block2;
  });
}
async function colourSuggestions(html, file2, head) {
  const rows = /(<tr class="suggestion-(del|add)"><td class="suggestion-number">(\d*)<\/td><td class="suggestion-number">\d*<\/td><td class="suggestion-line"><span class="suggestion-sign">.<\/span>)([\s\S]*?)(<\/td><\/tr>)/g;
  const found = [...html.matchAll(rows)];
  if (!found.length) return html;
  const added = found.flatMap(([, , kind, , code2 = ""]) => kind === "add" ? [unescape(code2)] : []);
  const [atHead, addedLines] = await Promise.all([tokensAt(process.cwd(), head, file2), added.length ? tokensFor(added.join("\n"), { file: file2 }) : null]);
  let at = 0;
  return html.replace(
    rows,
    (_, open2, kind, number, code2, close) => open2 + painted(code2, kind === "del" ? atHead?.[Number(number) - 1] : addedLines?.[at++]) + close
  );
}
async function exportPage(dir) {
  const view = walkthroughView(dir);
  if (!view) throw new Error("there is no such walkthrough");
  const title = view.pr ? `#${view.pr.number} ${view.pr.title}` : nameOf(view);
  const diffs = await Promise.all(view.steps.map((step) => stepDiff(step.diff, view.base, view.head)));
  const comments3 = await Promise.all(
    view.steps.map(
      (step) => Promise.all(
        view.threads.filter((thread) => thread.step === step.id).flatMap(
          (thread) => thread.comments.map(
            async (said2) => `<li><code>${escape2(thread.file)}${thread.lines ? `:${String(thread.lines[1])}` : ""}</code> <strong>${escape2(who(said2))}</strong>${said2.by === "ai" && (said2.pending || said2.review) ? " <code>[AI]</code>" : ""}<div class="markdown">${await colourSuggestions(renderComment(said2.body, thread.code ?? []), thread.file, view.head)}</div></li>`
          )
        )
      )
    )
  );
  const steps3 = view.steps.map((step, at) => {
    const said2 = comments3[at] ?? [];
    const shot = step.screenshot;
    const type = shot && SCREENSHOT_TYPES[shot.name.split(".").pop()];
    const figure = shot && type ? `<figure class="screenshot open"><img class="screenshot-image" src="data:${type};base64,${fs10.readFileSync(path11.join(dir, shot.name)).toString("base64")}" alt="${escape2(shot.alt)}" />${shot.alt ? `<figcaption>${escape2(shot.alt)}</figcaption>` : ""}</figure>` : "";
    const diff = diffs[at] ?? "";
    return `<section class="export-step"><h2>${String(at + 1)}. ${escape2(step.title)}</h2>
<div class="markdown">${renderMarkdown(step.explanation)}</div>${figure}${diff}${said2.length ? `<ul class="export-comments">${said2.join("")}</ul>` : ""}</section>`;
  });
  const body = await colourBlocks(steps3.join("\n"));
  const criteria3 = (view.criteria ?? []).map((one) => `<li>${escape2(one.text)}: ${STATUS[one.status]}${one.missing || one.reason ? `. ${escape2(one.missing ?? one.reason ?? "")}` : ""}</li>`);
  const style = fs10.readFileSync(path11.join(PAGE, "style.css"), "utf8");
  const policy = `default-src 'none'; style-src ${hash(style)}; img-src data:; font-src data:; base-uri 'none'; form-action 'none'`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="content-security-policy" content="${policy}" />
    <title>${escape2(title)} \xB7 Walkthrough</title>
    <style>${style}</style>
  </head>
  <body class="export">
    <main class="export-main">
      <h1>${escape2(title)}</h1>
      ${body}
      ${criteria3.length ? `<section class="export-step"><h2>Acceptance criteria</h2><ul>${criteria3.join("")}</ul></section>` : ""}
    </main>
  </body>
</html>
`;
}

// src/guide.ts
init_define_GRAMMARS();
var steps = [
  {
    title: "Parse due dates in the API",
    explanation: "Both handlers accept an optional dueDate and store it as a date or null.\n\nThe rest of the detail, shown behind More.",
    files: ["src/api/tasks.ts", { path: "src/api/generated/client.ts", folded: "Generated from the schema" }],
    look: [{ file: "src/api/tasks.ts", start: 26, end: 29, label: "parseDueDate" }]
  }
];
var comments = [
  { file: "src/api/tasks.ts", lines: [29, 29], body: "A typo in the date becomes null and clears it. Return 400 with the field name." },
  { file: "src/api/tasks.ts", body: "Most of this file is the date parsing; a module of its own would keep the handlers short." }
];
var threads = [
  {
    id: "1042",
    file: "src/api/tasks.ts",
    lines: [22, 22],
    author: "dana-k",
    at: "2026-11-23T09:30:00Z",
    body: "Does a PATCH without dueDate wipe the date?",
    replies: [{ author: "ryo-t", at: "2026-11-24T10:00:00Z", body: "Yes. Fixing it in this PR." }]
  }
];
var criteria = [
  { text: "Invalid dates rejected with a clear error", status: "not-met", comment: "48f3f82c", missing: "An invalid date becomes null and clears the field." },
  { text: "Date picker works on phones", status: "not-checked", reason: "Needs the running app." },
  { text: "Optional due date on create and edit", status: "met", file: "src/api/tasks.ts", lines: [19, 22] }
];
var GUIDE = `walkthrough start [--target <branch> | --base <rev> --head <rev> --label <text>] [--pr <number> [--title <text>] [--yours]]
  Starts or resumes a walkthrough and serves its page without opening it; nothing is checked out.
  With no options it is of the current branch against origin/<target>, or the local <target> when the remote has none, and the remote's default branch unless given.
  With --base and --head it is of that range, named by its --label.
  --pr makes it a pull request: the page shows "#<number> <title>" and ends with Submit review; without it, the change is the person's own and ends with Send to agent.
  --yours says the person opened the pull request: its author can only comment, so the page offers no review type and the review goes out as a comment.
  Every command below finds the walkthrough from the same source options start was given, so pass them to each.
  When the head moved, each step keeps the files that still change and its Look at pointers still in its diff; start prints the files no step has yet; record the steps again with those.
  A new head makes the walkthrough not ready again, so the page shows the AI at work until ready.
  Comments on lines that changed stay in the review, detached from the diff.
  It prints the walkthrough's inbox, the folder for the files the session records from.
  Resuming a ready walkthrough at the same head, it prints "Already reviewed at this head: N comments pending.",
  or "in the submitted review" or "sent to the agent" in place of "pending", from what it saved.

Recording from files
  steps, comment, threads, criteria and policy save read the file --file names, or standard input without it; say takes its text on the command line or from --file.
  Write each file with your file tool into the inbox start printed, then pass its path; the command removes it once read.
  Lines are numbered as in the file at the head, and must be in the step's diff; leave "lines" out of a comment or thread on the whole file.
  Text is Markdown, shown without raw HTML or images.

walkthrough files
  Prints every changed file, one path per line.

walkthrough steps --file <file>
  Records the steps in reading order, replacing those recorded before, and prints each step's id and title.
  Every changed file must be in exactly one step; otherwise nothing is recorded and every problem is named.
  A file is a path, or {"path": path, "folded": reason} for a generated or copied file, which arrives folded with its one-line reason.
  "look" holds one or two pointers to what to read first, each {"file": path, "start": line, "end": line, "label": 1 to 4 words}.
  "screenshot" puts the author's screenshot of the change under the explanation: {"file": path, "alt": the author's alt text}.
  Download it into the inbox first; it must be a PNG, JPEG, GIF or WebP image of at most 5 MB. Recording copies it and removes the inbox file.
  Recorded again, a step that keeps its id keeps its screenshot unless given a new one, or "screenshot": null to remove it.
  A step keeps its id while it keeps most of its files, so the person's Viewed marks and comments follow it.
${JSON.stringify(steps, null, 2)}

walkthrough open
  Opens the page in the browser. Until the walkthrough is ready it shows the AI at work and the changed files, not the steps.

walkthrough ready
  Marks the review ready, once every changed file is in a step: the page shows the whole walkthrough at once,
  with every step, comment, thread and criterion recorded so far. Opens the page too if it was never opened.
  Comments recorded after this land on the page while the person reads.

walkthrough comment --file <file>
  Adds the AI's pending comments on lines, or on a whole file without "lines", and prints their ids. They show as [AI] and go out with the review unless the person deletes them;
  the person can edit them. Write the body without the [AI] prefix.
  A fix may follow the sentence as a \`\`\`suggestion block whose lines replace exactly the comment's lines.
${JSON.stringify(comments, null, 2)}

walkthrough threads --file <file>
  Records colleagues' existing threads on lines or on a whole file, replacing those recorded before. "id" is yours, such as the code host's thread id;
  replies and resolves the person adds come back with it. "resolved" may be given as true.
${JSON.stringify(threads, null, 2)}

walkthrough criteria --file <file>
  Records the acceptance criteria as checked, replacing those before; read-only on the page, gaps first. status: met, partly, not-met or not-checked.
  partly and not-met need comment, the id walkthrough comment printed for your comment that closes the gap, and missing: what is missing, in 12 words, never the fix.
  met needs the file and lines that meet it, in a step's diff; the page opens them as a Look at pointer does. not-checked needs reason: why, in 8 words.
${JSON.stringify(criteria, null, 2)}

walkthrough listen
  Waits for the person, then prints one JSON line per thing they sent and exits. Only these wake it:
    {"kind": "ask", "id": string, "text": string, "file": path, "lines": [first, last], "thread": [{"by": "you" | "ai" | handle, "body": string}, ...]}
      Ask AI, on picked lines, on a whole file ("subject": "file" in place of "lines") or in a thread; "thread" is what the thread said before.
      Answer with say --answer.
    {"kind": "submit", "id": string, "type": "comment" | "approve" | "request-changes", "summary": string}
      Submit review or Send to agent; "type" only on a pull request, as your own change has none.
      Read what goes out with walkthrough comments, act on it, then run walkthrough posted.
    {"kind": "stopped"}   the page was stopped; nothing more will come
  Comments, replies, edits, deletions, Resolve and Viewed never wake it.
  Exit code 3: another walkthrough listen took over.
  Until ready, the page says the session stopped once a listen ran and none has run for 15 seconds, so start it again at once.

walkthrough say --answer <ask id> (<text> | --file <file>)
  Answers an ask as a reply in its thread, in two sentences, the first answering directly. Answers stay on the page and never go out.

walkthrough comments [--all]
  Prints what goes out, one JSON line each: the review submitted and not yet posted, or else what is pending.
  With --all, every comment and reply you and the person made, pending or sent, and every thread resolved,
  then each comment of yours the person deleted, with "deleted": true; one of yours they reworded carries "wrote", what you wrote.
    {"kind": "comment", "id": string, "by": "you" | "ai", "file": path, "lines": [first, last], "body": string, "outdated": true}
      a new thread; "outdated" only when its lines changed since or its file left the change.
      On a whole file, "subject": "file" in place of "lines", here and in the lines below.
    {"kind": "reply", "id": string, "by": "you" | "ai", "thread": id, "body": string}   in a colleague's thread or after a comment above
    {"kind": "resolve", "thread": id}   the person resolved a colleague's thread
    {"kind": "resolve", "thread": id, "by": "ai", "file": path, "lines": [first, last], "body": string}
      you resolved the thread of your comment with walkthrough resolve; find it on the code host by its file, lines and body.
      On the person's own change these never go out, so only --all lists them.
  An AI comment's body starts with [AI].

walkthrough resolve <comment id>
  On a new head, resolves the thread of one of your comments that went out with an earlier review once the new code fixes it; reply nothing.
  The id is the comment's, from walkthrough comments --all. It refuses a comment that is not yours, was deleted, is still pending or is already resolved.
  The resolve goes out with the next review, as the person's do; the person can take it back on the page until then.

walkthrough posted [--address <url>]
  Records that the submitted review went out, and where; the page then links View review to the address.

walkthrough export [--out <file>]
  Writes the walkthrough to one read-only HTML file: steps, explanations, diffs, comments and criteria.

walkthrough policy [show | init | save --file <file>]
  The person's review policy; this compares and copies its bytes and never reads its rules.
  With no action it prints its state (none, template or yours) and path, then the inbox to write a new version to.

walkthrough stop | list | stop --list | prune [<branch> | <id>]
  stop ends the page; list opens the repo's walkthroughs; prune removes walkthroughs that are over, or the one named.
`;

// src/policy.ts
init_define_GRAMMARS();
import crypto7 from "node:crypto";
import fs11 from "node:fs";
import os3 from "node:os";
import path12 from "node:path";
import { parseArgs } from "node:util";
var TEMPLATE = path12.join(import.meta.dirname, "..", "skills", "walkthrough", "REVIEW.md");
var policyPath = () => path12.join(process.env["XDG_CONFIG_HOME"] || path12.join(os3.homedir(), ".config"), "walkthrough", "REVIEW.md");
var read = (file2) => fs11.readFileSync(file2);
var TEMPLATES = /* @__PURE__ */ new Set([
  "04a602b5efc4cedc0336c7639cc560bc68f235c755eb6bc60d7289d274c0bc0f",
  "15dd307ab303cbcc4a36c384360e1f1e3f889492a484151f7776697cb1c7abf0",
  "17882fa4836cd26b1cc3772e80b262d559d3f5dd15b6449798961d3222a607c2",
  "26442e1d66028540ef4b778ed9edec79a2bab15ba84c543fa584a4d7d611d6fc",
  "2c3d45728f9fda9bb67b6d5bd546ce51d300a0de0d4e4fb820b31cfc7229d87e",
  "340047c4632fcd0e7f0b6ed4257a858080b2a791c96d155fc1e0ba5f0d5caa65",
  "407a443dbc1b85beedb76b2c9d910b508486f37bbb04c9d77804d35ec4d516e0",
  "4163ce63abffe0900e52c72a09ce9145acc5a9902141b6b84aeb323dc787756e",
  "44b36f903158e8452655817542e95335695b8abac7d437d9aa4be5aacec50ffb",
  "45ae6552e2e54e8b7f2382e1479a5a7fd868b1767b6ddcf490b9388c87110907",
  "6cd73d656df167adb620983b8a3984e2b03cf002c72f7a6b72147db3dcc22ac9",
  "861b6dbfccfb2976660872d1ffa1357c0ac3d831ab8609dded6e2504f923a92c",
  "86b6daff264a624c939e9ef7e385ea4a698b0430698dbc84e9d3c1605e252a1f",
  "92c69616a59edfa307d9a8926543aa369d2134bd0aefd71a13ee10b828a96359",
  "9af98052435443bb10e4fca9dabe52f60de24564bf55ba7909423b37cd663303",
  "9f08ac1081cb9c42e8b0d6a2cf515f02b00fc338d0d90acb5284ee9648d7f813",
  "b1e132469f1ddd7e0510aeafb7838227ad910716f3e5749a089a44e7b73ca1fa",
  "c89e17025c15f4a8a307dfe9592ada903dbe8aa8d2853b04a4c591b8ad31c124",
  "cb297b6ef136a939ba2feeff2b2b8bfdb1f40198d734abbeb10b0aa229990e2e",
  "da354a418bf4ef499a80d0df61d80ffd38fa0b694c8e7d4e09129a7a38e52b07",
  "db5b3659a66f85035f2d88cd736295dee60a1e20e9a714c470a40af11b8eaef4",
  "e6d323edff72a83d70cc1cd901d1b1ec6d5a07530bd4d8f63194db09b8a23571",
  "f19c5bc5ed0114e350a43a510d0edbcdfa071fade96a6d0c1caace5cf192dccf",
  "f74fac0a569c470d0bbdc07d5fa375e6cb824e2090c50ce77163fe8201df686b",
  "fa351c4cb56f4fe0ad000357808efc82b9fcba626735b816258cc285d508487d"
]);
function stateOf(policy) {
  if (!fs11.existsSync(policy)) return "none";
  const bytes = read(policy);
  if (bytes.equals(read(TEMPLATE))) return "template";
  return TEMPLATES.has(crypto7.createHash("sha256").update(bytes).digest("hex")) ? "earlier" : "yours";
}
function status() {
  const policy = policyPath();
  const inbox = makeInbox(stateDir());
  const state = stateOf(policy);
  if (state === "none") console.log(`none: there is no review policy at ${policy}, so the template applies.`);
  else if (state === "template") console.log(`template: the review policy at ${policy} is the unchanged template.`);
  else if (state === "earlier")
    console.log(`template: the review policy at ${policy} is an earlier unchanged template, so the current template applies.`);
  else console.log(`yours: the review policy at ${policy} is the person's own.`);
  console.log(`Write a new version to files in ${inbox} and save it with walkthrough policy save --file <file>.`);
}
function save(text2, what) {
  const policy = policyPath();
  fs11.mkdirSync(path12.dirname(policy), { recursive: true });
  fs11.writeFileSync(policy, text2);
  console.log(`${what} ${policy}.`);
}
function policyCommand(args) {
  const { positionals, values } = parseArgs({ args, allowPositionals: true, options: { file: { type: "string" } } });
  const [action, ...rest2] = positionals;
  if (rest2.length > 0) throw new Error("usage: walkthrough policy [show | init | save --file <file>]");
  if (action === void 0) status();
  else if (action === "show") process.stdout.write(read(stateOf(policyPath()) === "yours" ? policyPath() : TEMPLATE));
  else if (action === "init") {
    if (fs11.existsSync(policyPath())) throw new Error(`there is a review policy at ${policyPath()} already`);
    save(read(TEMPLATE), "Copied the template to");
  } else if (action === "save") {
    const text2 = readInput(values.file);
    if (!text2.trim()) throw new Error("the review policy is empty; nothing was saved");
    save(text2, "Saved the review policy at");
  } else throw new Error("usage: walkthrough policy [show | init | save --file <file>]");
}

// src/record.ts
init_define_GRAMMARS();
var placed = (walkthrough, where, name2) => {
  try {
    return placeIn(walkthrough, where);
  } catch (error) {
    throw new Error(`${name2}: ${error.message}`);
  }
};
function parseComments(text2, walkthrough) {
  return parseList(text2, "the comments", (fields, number) => {
    const name2 = `comment ${String(number)}`;
    if (!filled(fields["body"])) throw new Error(`${name2} needs a body`);
    const body = withoutPrefix(fields["body"]);
    if (!body) throw new Error(`${name2} needs a body`);
    return { place: placed(walkthrough, fields, name2), body };
  });
}
var isTime = (value) => filled(value) && !Number.isNaN(Date.parse(value));
function said(fields, name2) {
  const { author, at, body } = fields;
  if (!filled(author)) throw new Error(`${name2} needs an author`);
  if (!isTime(at)) throw new Error(`${name2} needs a time, such as 2026-11-23T09:30:00Z`);
  if (!filled(body)) throw new Error(`${name2} needs a body`);
  return { author: author.trim(), at, body };
}
function parseThreads(text2, walkthrough) {
  const ids = /* @__PURE__ */ new Set();
  return parseList(text2, "the threads", (fields, number) => {
    const name2 = `thread ${String(number)}`;
    const { id, replies = [], resolved = false } = fields;
    if (!filled(id)) throw new Error(`${name2} needs an id`);
    if (ids.has(id)) throw new Error(`${name2}: two threads have the id ${id}`);
    ids.add(id);
    if (typeof resolved !== "boolean") throw new Error(`${name2}: resolved must be true or false`);
    if (!Array.isArray(replies)) throw new Error(`${name2}: replies must be a list`);
    return {
      id,
      ...placed(walkthrough, fields, name2),
      ...said(fields, name2),
      ...resolved && { resolved: true },
      replies: replies.map((reply, at) => said(fieldsOf(reply), `${name2}, reply ${String(at + 1)}`))
    };
  });
}
function parseCriteria(text2, walkthrough, aiComments2) {
  return parseList(text2, "the criteria", ({ text: criterion, status: status2, comment: comment2, missing, file: file2, lines, reason }, number) => {
    const name2 = `criterion ${String(number)}`;
    if (!filled(criterion)) throw new Error(`${name2} needs a text`);
    if (!CRITERION_STATUSES.includes(status2)) throw new Error(`${name2}: status must be one of ${CRITERION_STATUSES.join(", ")}`);
    const checked = { text: criterion.trim(), status: status2 };
    if (status2 === "partly" || status2 === "not-met") {
      if (!filled(comment2) || !aiComments2.has(comment2.trim()))
        throw new Error(`${name2} is ${status2}: comment must be the id of your comment that closes the gap, as walkthrough comment printed it`);
      if (!filled(missing)) throw new Error(`${name2} is ${status2}: it needs missing, what is missing`);
      return { ...checked, comment: comment2.trim(), missing: missing.trim() };
    }
    if (status2 === "met") {
      if (!filled(file2) || !isLines(lines)) throw new Error(`${name2} is met: it needs the file and lines that meet it`);
      const step = walkthrough.steps.find((one) => one.files.includes(file2));
      if (!step || !lookShown(step, { file: file2, start: lines[0], end: lines[1] }))
        throw new Error(`${name2}: lines ${String(lines[0])}-${String(lines[1])} of ${file2} are not in a step's diff`);
      return { ...checked, file: file2, lines };
    }
    if (!filled(reason)) throw new Error(`${name2} is not-checked: it needs a reason`);
    return { ...checked, reason: reason.trim() };
  });
}

// src/cli.ts
var short = (sha) => sha.slice(0, 7);
var SOURCE_OPTIONS = {
  target: { type: "string" },
  base: { type: "string" },
  head: { type: "string" },
  label: { type: "string" }
};
function located(args, {
  options = {},
  allowPositionals = false,
  branch
} = {}) {
  const parsed3 = parseArgs2({ args, allowPositionals, options: { ...SOURCE_OPTIONS, ...options } });
  const { target, base, head, label } = parsed3.values;
  const cwd = process.cwd();
  let source;
  if (base === void 0 && head === void 0 && label === void 0)
    source = { kind: "branch", branch: branch ?? currentBranch(cwd), ...target !== void 0 && { target } };
  else if (!base || !head) throw new Error("--base and --head go together, and --label needs them");
  else if (target !== void 0) throw new Error("--target is for the current branch; a range has its --base");
  else if (!label?.trim()) throw new Error("--base and --head need a --label that names the change");
  else source = { kind: "range", base, head, label };
  return { ...parsed3, cwd, source, dir: renamedDir(currentRepo(cwd), source) };
}
function renamedDir(repo, source) {
  const dir = walkthroughDir(repo, source);
  const earlier = earlierDir(repo, source);
  if (earlier === dir || !fs12.existsSync(earlier) || fs12.existsSync(dir)) return dir;
  if (serverRunning(earlier)) return earlier;
  fs12.renameSync(earlier, dir);
  return dir;
}
async function start2(args) {
  const { cwd, source, dir, values } = located(args, { options: { pr: { type: "string" }, title: { type: "string" }, yours: { type: "boolean" } } });
  const number = values.pr?.trim();
  if (number === "") throw new Error("--pr needs the number of the pull request");
  if (values.title !== void 0 && number === void 0) throw new Error("--title goes with --pr");
  if (values.yours && number === void 0) throw new Error("--yours goes with --pr");
  const pr = number === void 0 ? void 0 : { number, title: values.title?.trim() || nameOf(source), ...values.yours && { yours: true } };
  const change = await changeOf(cwd, source);
  for (const line of await pruneDaily(cwd)) console.log(line);
  const { walkthrough, opened } = await openWalkthrough(dir, source, change, pr, (moved) => carrySteps(cwd, moved));
  const inbox = makeInbox(dir);
  const { steps: steps3 } = walkthrough;
  console.log(
    `Walkthrough of ${nameOf(source)} against ${targetName(change.target)}: ${short(change.base)}..${short(change.head)}, ${plural(steps3.length, "step")}.`
  );
  if (opened === "resumed") {
    const line = reviewedLine(dir);
    if (line) console.log(line);
  }
  if (walkthrough.ready === false && walkthrough.reviewedAt) console.log(`Last reviewed at ${short(walkthrough.reviewedAt)}.`);
  if (opened === "moved" && steps3.length > 0) {
    console.log(`The head moved: ${plural(steps3.length, "step")} kept their files that still change.`);
    const left = walkthrough.unplaced ?? [];
    if (left.length > 0) console.log(`In no step yet: ${left.join(", ")}. Record the steps again with these in new steps.`);
  }
  if (change.uncommitted > 0)
    console.log(
      `Warning: ${plural(change.uncommitted, "uncommitted change")} ${change.uncommitted === 1 ? "is" : "are"} left out of this walkthrough.`
    );
  console.log(`Write what you record to files in ${inbox} and pass each with --file.`);
  if (walkthrough.ready === false) await forgetStoppedListener(dir);
  await ensureServer(dir);
  console.log("The page is not open yet; walkthrough open opens it.");
}
function reviewedLine(dir) {
  const view = walkthroughView(dir);
  if (!view?.ready) return void 0;
  const { submitted } = view;
  const pending = view.threads.flatMap((thread) => thread.comments).filter((one) => one.pending).length;
  const where = submitted ? view.pr ? "in the submitted review" : "sent to the agent" : "pending";
  return `Already reviewed at this head: ${plural(submitted ? submitted.comments : pending, "comment")} ${where}.`;
}
async function openCommand(args) {
  const { dir } = current2(args);
  await markOpened(dir);
  openPage(await ensureServer(dir), "The page", dir);
}
async function ready(args) {
  const { dir } = current2(args);
  const opened = await markReady(dir);
  console.log("The walkthrough is ready; the page shows it whole.");
  if (!opened) openPage(await ensureServer(dir), "The page", dir);
}
function openPage(url, what, dir) {
  const browser = spawnSync4(process.platform === "darwin" ? "open" : "xdg-open", [url], { stdio: "ignore" });
  console.log(
    browser.status === 0 ? `${what} is open in your browser.` : `Could not open a browser; the address of ${what.toLowerCase()} is in ${dir}/server.json.`
  );
}
var repoDir = () => path13.join(stateDir(), currentRepo(process.cwd()));
async function list2(args) {
  parseArgs2({ args, options: {} });
  openPage(await ensureServer(repoDir(), true), "The list of walkthroughs", repoDir());
}
function current2(args, config2 = {}) {
  const found = located(args, config2);
  const walkthrough = readWalkthrough(found.dir);
  if (!walkthrough) throw new Error(`there is no walkthrough of ${nameOf(found.source)}; run walkthrough start`);
  return { ...found, walkthrough };
}
async function files2(args) {
  const { base, head } = current2(args).walkthrough;
  for (const { path: path14 } of await changedFiles(process.cwd(), base, head)) console.log(path14);
}
var FILE_OPTION = { options: { file: { type: "string" } } };
async function steps2(args) {
  const { cwd, dir, values } = located(args, FILE_OPTION);
  const inputs = parseSteps(readInput(values.file));
  const { steps: recorded } = await recordSteps(dir, (walkthrough) => buildSteps(cwd, dir, walkthrough, inputs));
  console.log(`Recorded ${plural(recorded.length, "step")}: ${recorded.map((step) => `${step.id} (${step.title})`).join(", ")}.`);
}
async function commentCommand(args) {
  const { dir, walkthrough, values } = current2(args, FILE_OPTION);
  const recorded = await aiComments(dir, parseComments(readInput(values.file), walkthrough));
  console.log(`Recorded ${plural(recorded.length, "comment")}${recorded.length ? `: ${recorded.map((one) => one.id).join(", ")}` : ""}.`);
}
async function threads2(args) {
  const { dir, values } = located(args, FILE_OPTION);
  const text2 = readInput(values.file);
  const recorded = await updateWalkthrough(dir, (walkthrough) => walkthrough.threads = parseThreads(text2, walkthrough));
  console.log(`Recorded ${plural(recorded.length, "thread")}.`);
}
async function criteria2(args) {
  const { dir, values } = located(args, FILE_OPTION);
  const text2 = readInput(values.file);
  const ai = new Set(logOf(dir).flatMap((event) => event.kind === "comment" && event.by === "ai" ? [event.id] : []));
  const recorded = await updateWalkthrough(dir, (walkthrough) => walkthrough.criteria = parseCriteria(text2, walkthrough, ai));
  console.log(`Recorded ${String(recorded.length)} ${recorded.length === 1 ? "criterion" : "criteria"}.`);
}
function comments2(args) {
  const { dir, values } = current2(args, { options: { all: { type: "boolean" } } });
  for (const line of reviewComments(dir, values.all)) console.log(JSON.stringify(line));
}
async function resolveCommand(args) {
  const { dir, positionals } = current2(args, { allowPositionals: true });
  const [id] = positionals;
  if (positionals.length !== 1 || !id) throw new Error("usage: walkthrough resolve <comment id>");
  await aiResolve(dir, id);
  console.log(`Resolved the thread of comment ${id}.`);
}
async function posted(args) {
  const { dir, values } = current2(args, { options: { address: { type: "string" } } });
  const address = values.address?.trim();
  if (address !== void 0 && !/^https?:\/\//.test(address)) throw new Error("--address must be a web address");
  await markPosted(dir, address);
  console.log(address ? `Recorded that the review went to ${address}.` : "Recorded that the review went out.");
}
async function exportCommand(args) {
  const { values, dir, walkthrough } = current2(args, { options: { out: { type: "string" } } });
  const out = path13.resolve(values.out ?? path13.join(dir, "export.html"));
  fs12.writeFileSync(out, await exportPage(dir));
  console.log(`Exported the walkthrough of ${nameOf(walkthrough)} to ${out}.`);
}
async function listenCommand(args) {
  const { dir } = current2(args);
  const taken = await listen(dir, () => serverRunning(dir));
  if (taken === "replaced") {
    console.error("walkthrough: another walkthrough listen took over; this one gets nothing more.");
    process.exitCode = 3;
  } else if (taken === "stopped") console.log(JSON.stringify({ kind: "stopped" }));
  else
    for (const event of taken)
      console.log(
        JSON.stringify(
          event.kind === "ask" ? handedAsk(dir, event) : event.kind === "submit" ? { kind: "submit", id: event.id, type: event.type, summary: event.summary } : event
        )
      );
}
async function sayCommand(args) {
  const { values, positionals, dir } = current2(args, {
    options: { answer: { type: "string" }, file: { type: "string" } },
    allowPositionals: true
  });
  if (values.file !== void 0 && positionals.length > 0) throw new Error("say takes its text or a --file, not both");
  const text2 = (values.file === void 0 ? positionals.join(" ") : readInput(values.file)).trim();
  if (!text2 || values.answer === void 0) throw new Error("usage: walkthrough say --answer <ask id> (<text> | --file <file>)");
  await answer(dir, values.answer, text2);
  console.log("Answered on the page.");
}
var COMMANDS = {
  start: start2,
  files: files2,
  steps: steps2,
  open: openCommand,
  ready,
  comment: commentCommand,
  threads: threads2,
  criteria: criteria2,
  comments: comments2,
  resolve: resolveCommand,
  posted,
  list: list2,
  export: exportCommand,
  guide: () => {
    process.stdout.write(GUIDE);
  },
  listen: listenCommand,
  policy: policyCommand,
  say: sayCommand,
  stop: async (args) => {
    if (args.includes("--list")) {
      parseArgs2({ args, options: { list: { type: "boolean" } } });
      const stopped2 = await stopServer(repoDir());
      console.log(stopped2 ? "Stopped the list of walkthroughs." : "The list of walkthroughs was not running.");
      return;
    }
    const stopped = await stopServer(located(args).dir);
    console.log(stopped ? "Stopped the walkthrough page." : "The walkthrough page was not running.");
  },
  prune: async (args) => {
    if (args.length === 0) {
      const removed = await prune(process.cwd());
      console.log(removed.length > 0 ? removed.join("\n") : "No walkthrough to remove.");
      return;
    }
    const { positionals } = parseArgs2({ args, allowPositionals: true, options: SOURCE_OPTIONS });
    const { source, dir } = located(args, { allowPositionals: true, branch: positionals[0] });
    if (positionals.length > 0 && source.kind === "range") throw new Error("name a branch or a range, not both");
    const listed = readWalkthrough(dir) ? void 0 : listView(repoDir()).find((one) => one.id === positionals[0] || decodeURIComponent(one.id) === positionals[0]);
    console.log(await (listed ? pruneOne(path13.join(repoDir(), listed.id), listed.name) : pruneOne(dir, nameOf(source))));
  },
  // The detached page server that start runs.
  serve: ([dir = "", mode]) => {
    serve(dir, mode === "--list");
  }
};
var [name = "", ...rest] = process.argv.slice(2);
var command = COMMANDS[name];
try {
  if (!command)
    throw new Error(
      "usage: walkthrough <command> [--target <branch> | --base <rev> --head <rev> --label <text>]\n  commands: start [--pr <number> [--title <text>] [--yours]] | guide | files | steps --file <file> | open | ready\n    | comment --file <file> | threads --file <file> | criteria --file <file> | listen | say --answer <id> (<text> | --file <file>)\n    | comments | resolve <comment id> | posted [--address <url>] | stop | prune [<branch> | <id>] | export [--out <file>] | list | stop --list\n    | policy [show | init | save --file <file>]\n  every command but guide, list and policy finds the walkthrough from the options start was given: none for the current branch"
    );
  await command(rest);
} catch (error) {
  console.error(`walkthrough: ${error.message}`);
  process.exitCode = 1;
}
/*! Bundled license information:

markdown-it/dist/markdown-it.mjs:
  (*! markdown-it 15.0.3 https://github.com/markdown-it/markdown-it @license MIT *)
*/
