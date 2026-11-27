import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};

// <define:GRAMMARS>
var define_GRAMMARS_default = { version: "1.32.22", extensions: { ".bsl": "bsl", ".os": "bsl", ".abap": "abap", ".apl": "apl", ".dyalog": "apl", ".as": "actionscript-3", ".adb": "ada", ".ada": "ada", ".ads": "ada", ".outjob": "ini", ".pcbdoc": "ini", ".prjpcb": "ini", ".schdoc": "ini", ".apacheconf": "apache", ".vhost": "apache", ".cls": "apex", ".apex": "apex", ".trigger": "apex", ".applescript": "applescript", ".scpt": "applescript", ".asciidoc": "asciidoc", ".adoc": "asciidoc", ".asc": "asciidoc", ".asm": "asm", ".a51": "asm", ".i": "asm", ".inc": "asm", ".nas": "asm", ".nasm": "asm", ".s": "asm", ".astro": "astro", ".ahk": "ahk", ".ah1": "ahk", ".ah2": "ahk", ".ahkl": "ahk", ".awk": "awk", ".auk": "awk", ".gawk": "awk", ".mawk": "awk", ".nawk": "awk", ".b": "c", ".bal": "ballerina", ".bat": "bat", ".cmd": "bat", ".bf": "csharp", ".be": "berry", ".bib": "bibtex", ".bibtex": "bibtex", ".bicep": "bicep", ".bicepparam": "bicep", ".blade": "blade", ".blade.php": "blade", ".bst": "yaml", ".c": "c", ".cats": "c", ".h": "c", ".h.in": "c", ".idc": "c", ".cs": "csharp", ".cake": "csharp", ".cs.pp": "csharp", ".csx": "csharp", ".linq": "csharp", ".cpp": "cpp", ".c++": "cpp", ".cc": "cpp", ".cp": "pascal", ".cppm": "cpp", ".cxx": "cpp", ".h++": "cpp", ".hh": "cpp", ".hpp": "cpp", ".hxx": "cpp", ".inl": "cpp", ".ino": "cpp", ".ipp": "cpp", ".ixx": "cpp", ".re": "cpp", ".tcc": "cpp", ".tpp": "cpp", ".txx": "cpp", ".chs": "haskell", ".c3": "c3", ".cmake": "cmake", ".cmake.in": "cmake", ".cob": "cobol", ".cbl": "cobol", ".ccp": "cobol", ".cobol": "cobol", ".cpy": "cobol", ".dae": "xml", ".cql": "cypher", ".cson": "coffee", ".css": "css", ".csv": "csv", ".cue": "cue", ".cdc": "cadence", ".cairo": "cairo", ".chpl": "chapel", ".ck": "java", ".clar": "clarity", ".clj": "clojure", ".bb": "clojure", ".boot": "clojure", ".cl2": "clojure", ".cljc": "clojure", ".cljs": "clojure", ".cljs.hl": "clojure", ".cljscm": "clojure", ".cljx": "clojure", ".hic": "clojure", ".soy": "soy", ".ql": "codeql", ".qll": "codeql", ".coffee": "coffee", "._coffee": "coffee", ".cjsx": "coffee", ".coffee.erb": "coffee", ".iced": "coffee", ".lisp": "common-lisp", ".asd": "common-lisp", ".cl": "c", ".l": "common-lisp", ".lsp": "common-lisp", ".ny": "common-lisp", ".podsl": "common-lisp", ".sexp": "common-lisp", ".cps": "pascal", ".cr": "crystal", ".cy": "javascript", ".cyp": "cypher", ".cypher": "cypher", ".d": "d", ".di": "d", ".dm": "dream-maker", ".dart": "dart", ".dhall": "haskell", ".diff": "diff", ".patch": "diff", ".dockerfile": "docker", ".containerfile": "docker", ".env": "dotenv", ".eq": "csharp", ".sch": "xml", ".brd": "xml", ".eb": "python", ".epj": "json", ".edge": "edge", ".ex": "elixir", ".exs": "elixir", ".elm": "elm", ".el": "emacs-lisp", ".emacs": "emacs-lisp", ".emacs.desktop": "emacs-lisp", ".em": "coffee", ".emberscript": "coffee", ".erl": "erlang", ".app": "erlang", ".app.src": "erlang", ".es": "erlang", ".escript": "erlang", ".hrl": "erlang", ".xrl": "erlang", ".yrl": "erlang", ".fs": "fsharp", ".fsi": "fsharp", ".fsx": "fsharp", ".fnl": "fennel", ".ftl": "fluent", ".ftlh": "fluent", ".fr": "haskell", ".gd": "gdscript", ".gdshader": "gdshader", ".gdshaderinc": "gdshader", ".glsl": "glsl", ".fp": "glsl", ".frag": "glsl", ".frg": "glsl", ".fsh": "glsl", ".fshader": "glsl", ".geo": "glsl", ".geom": "glsl", ".glslf": "glsl", ".glslv": "glsl", ".gs": "genie", ".gshader": "glsl", ".rchit": "glsl", ".rmiss": "glsl", ".shader": "shaderlab", ".tesc": "glsl", ".tese": "glsl", ".vert": "glsl", ".vrx": "glsl", ".vs": "glsl", ".vsh": "glsl", ".vshader": "glsl", ".gn": "gn", ".gni": "gn", ".ebuild": "shellscript", ".eclass": "shellscript", ".po": "po", ".pot": "po", ".feature": "gherkin", ".story": "gherkin", ".gleam": "gleam", ".gjs": "glimmer-js", ".gts": "glimmer-ts", ".glf": "tcl", ".gp": "gnuplot", ".gnu": "gnuplot", ".gnuplot": "gnuplot", ".p": "gnuplot", ".plot": "gnuplot", ".plt": "gnuplot", ".go": "go", ".gdnlib": "gdresource", ".gdns": "gdresource", ".tres": "gdresource", ".tscn": "gdresource", ".gradle.kts": "kotlin", ".graphql": "graphql", ".gql": "graphql", ".graphqls": "graphql", ".groovy": "groovy", ".grt": "groovy", ".gtpl": "groovy", ".gvy": "groovy", ".hcl": "hcl", ".nomad": "hcl", ".tf": "hcl", ".tfvars": "hcl", ".tofu": "hcl", ".workflow": "hcl", ".hlsl": "hlsl", ".cginc": "hlsl", ".fx": "hlsl", ".fxh": "hlsl", ".hlsli": "hlsl", ".html": "html", ".hta": "html", ".htm": "html", ".html.hl": "html", ".xht": "html", ".xhtml": "html", ".erb": "erb", ".erb.deface": "erb", ".rhtml": "erb", ".cshtml": "razor", ".razor": "razor", ".http": "http", ".hxml": "hxml", ".hack": "hack", ".hhi": "hack", ".php": "php", ".haml": "haml", ".haml.deface": "haml", ".handlebars": "handlebars", ".hbs": "handlebars", ".hs": "haskell", ".hs-boot": "haskell", ".hsc": "haskell", ".hx": "haxe", ".hxsl": "haxe", ".hurl": "hurl", ".hy": "hy", ".ini": "ini", ".cfg": "ini", ".cnf": "ini", ".container": "ini", ".dof": "ini", ".frm": "ini", ".lektorproject": "ini", ".mount": "ini", ".network": "ini", ".prefs": "ini", ".pro": "ini", ".properties": "ini", ".service": "ini", ".socket": "ini", ".target": "ini", ".timer": "ini", ".url": "ini", ".imba": "imba", ".json": "json", ".4dform": "json", ".4dproject": "json", ".avsc": "json", ".geojson": "json", ".gltf": "json", ".har": "json", ".ice": "json", ".json-tmlanguage": "json", ".json.example": "json", ".jsonl": "json", ".mcmeta": "json", ".sarif": "json", ".slnlaunch": "json", ".tact": "json", ".tfstate": "json", ".tfstate.backup": "json", ".topojson": "json", ".webapp": "json", ".webmanifest": "json", ".yy": "json", ".yyp": "json", ".jsonc": "jsonc", ".code-snippets": "jsonc", ".code-workspace": "jsonc", ".hujson": "jsonc", ".sublime-build": "jsonc", ".sublime-color-scheme": "jsonc", ".sublime-commands": "jsonc", ".sublime-completions": "jsonc", ".sublime-keymap": "jsonc", ".sublime-macro": "jsonc", ".sublime-menu": "jsonc", ".sublime-mousemap": "jsonc", ".sublime-project": "jsonc", ".sublime-settings": "jsonc", ".sublime-theme": "jsonc", ".sublime-workspace": "jsonc", ".sublime_metrics": "jsonc", ".sublime_session": "jsonc", ".tsconfig.json": "jsonc", ".json5": "json5", ".jsonld": "javascript", ".java": "java", ".jav": "java", ".jsh": "java", ".js": "javascript", "._js": "javascript", ".bones": "javascript", ".cjs": "javascript", ".es6": "javascript", ".jake": "javascript", ".javascript": "javascript", ".jsb": "javascript", ".jscad": "javascript", ".jsfl": "javascript", ".jslib": "javascript", ".jsm": "javascript", ".jspre": "javascript", ".jss": "javascript", ".jsx": "javascript", ".mjs": "javascript", ".njs": "javascript", ".pac": "javascript", ".sjs": "javascript", ".ssjs": "javascript", ".xsjs": "javascript", ".xsjslib": "javascript", ".js.erb": "javascript", ".jinja": "jinja", ".j2": "jinja", ".jinja2": "jinja", ".jison": "jison", ".jsonnet": "jsonnet", ".libsonnet": "jsonnet", ".jl": "julia", ".ipynb": "json", ".just": "just", ".kdl": "kdl", ".ksy": "yaml", ".kit": "html", ".kt": "kotlin", ".ktm": "kotlin", ".kts": "kotlin", ".csl": "kusto", ".kql": "kusto", ".ll": "llvm", ".lvproj": "xml", ".lvclass": "xml", ".lvlib": "xml", ".lean": "lean", ".hlean": "lean", ".less": "less", ".liquid": "liquid", ".lkml": "yaml", ".lookml": "yaml", ".lua": "lua", ".fcgi": "lua", ".nse": "lua", ".p8": "lua", ".pd_lua": "lua", ".rbxs": "lua", ".rockspec": "lua", ".wlua": "lua", ".luau": "luau", ".matlab": "matlab", ".m": "objective-c", ".mdx": "mdx", ".mtml": "html", ".mak": "make", ".make": "make", ".makefile": "make", ".mk": "make", ".mkfile": "make", ".md": "markdown", ".livemd": "markdown", ".markdown": "markdown", ".mdown": "markdown", ".mdwn": "markdown", ".mkd": "markdown", ".mkdn": "markdown", ".mkdown": "markdown", ".ronn": "markdown", ".scd": "markdown", ".workbook": "markdown", ".marko": "marko", ".maxpat": "json", ".maxhelp": "json", ".maxproj": "json", ".mxt": "json", ".pat": "json", ".mmd": "mermaid", ".mermaid": "mermaid", ".druby": "ruby", ".duby": "ruby", ".mirah": "ruby", ".mojo": "mojo", ".mbt": "moonbit", ".move": "move", ".nsi": "nsis", ".nsh": "nsis", ".nf": "nextflow", ".nginx": "nginx", ".nginxconf": "nginx", ".nim": "nim", ".nim.cfg": "nim", ".nimble": "nim", ".nimrod": "nim", ".nims": "nim", ".nix": "nix", ".nu": "nushell", ".yaml": "yaml", ".yml": "yaml", ".ml": "ocaml", ".eliom": "ocaml", ".eliomi": "ocaml", ".ml4": "ocaml", ".mli": "ocaml", ".mll": "ocaml", ".mly": "ocaml", ".mm": "objective-cpp", ".odin": "odin", ".opencl": "c", ".scad": "openscad", ".org": "org", ".aw": "php", ".ctp": "php", ".php3": "php", ".php4": "php", ".php5": "php", ".phps": "php", ".phpt": "php", ".pls": "plsql", ".bdy": "plsql", ".ddl": "plsql", ".fnc": "plsql", ".pck": "plsql", ".pkb": "plsql", ".pks": "plsql", ".plb": "plsql", ".plsql": "plsql", ".prc": "plsql", ".spc": "plsql", ".sql": "sql", ".tpb": "plsql", ".tps": "plsql", ".trg": "plsql", ".vw": "plsql", ".pgsql": "sql", ".pas": "pascal", ".dfm": "pascal", ".dpr": "pascal", ".lpr": "pascal", ".pascal": "pascal", ".pp": "puppet", ".pl": "perl", ".al": "perl", ".cgi": "perl", ".perl": "perl", ".ph": "perl", ".plx": "perl", ".pm": "perl", ".psgi": "perl", ".t": "perl", ".pkl": "pkl", ".polar": "polar", ".pcss": "postcss", ".postcss": "postcss", ".pq": "powerquery", ".ps1": "powershell", ".psd1": "powershell", ".psm1": "powershell", ".prisma": "prisma", ".pc": "c", ".prolog": "prolog", ".yap": "prolog", ".proto": "proto", ".jade": "pug", ".pug": "pug", ".purs": "purescript", ".py": "python", ".gyp": "python", ".gypi": "python", ".lmi": "python", ".py3": "python", ".pyde": "python", ".pyi": "python", ".pyp": "python", ".pyt": "python", ".pyw": "python", ".rpy": "python", ".spec": "python", ".tac": "python", ".wsgi": "python", ".xpy": "python", ".qml": "qml", ".qbs": "qml", ".qs": "javascript", ".sip": "tcl", ".r": "r", ".rd": "r", ".rhistory": "r", ".rsx": "r", ".raml": "yaml", ".rbs": "rbs", ".ron": "ron", ".msg": "rosmsg", ".action": "rosmsg", ".srv": "rosmsg", ".x": "c", ".rkt": "racket", ".rktd": "racket", ".rktl": "racket", ".scrbl": "racket", ".6pl": "raku", ".6pm": "raku", ".nqp": "raku", ".p6": "raku", ".p6l": "raku", ".p6m": "raku", ".pl6": "raku", ".pm6": "raku", ".raku": "raku", ".rakumod": "raku", ".regexp": "regexp", ".regex": "regexp", ".v": "coq", ".coq": "coq", ".rg": "clojure", ".rb": "ruby", ".builder": "ruby", ".eye": "ruby", ".gemspec": "ruby", ".god": "ruby", ".jbuilder": "ruby", ".mspec": "ruby", ".pluginspec": "ruby", ".podspec": "ruby", ".prawn": "ruby", ".rabl": "ruby", ".rake": "ruby", ".rbi": "ruby", ".rbuild": "ruby", ".rbw": "ruby", ".rbx": "ruby", ".ru": "ruby", ".ruby": "ruby", ".thor": "ruby", ".watchr": "ruby", ".rs": "rust", ".rs.in": "rust", ".sas": "sas", ".scss": "scss", ".sparql": "sparql", ".rq": "sparql", ".mysql": "sql", ".tab": "sql", ".udf": "sql", ".viw": "sql", ".db2": "sql", ".sage": "python", ".sagews": "python", ".sass": "sass", ".scala": "scala", ".kojo": "scala", ".sbt": "scala", ".sc": "scala", ".scm": "scheme", ".sld": "scheme", ".sls": "scheme", ".sps": "scheme", ".ss": "scheme", ".sh": "shellscript", ".bash": "shellscript", ".bats": "shellscript", ".command": "shellscript", ".ksh": "shellscript", ".pacscript": "shellscript", ".sbatch": "shellscript", ".sh.in": "shellscript", ".slurm": "shellscript", ".tmux": "shellscript", ".tool": "shellscript", ".zsh": "shellscript", ".zsh-theme": "shellscript", ".sh-session": "shellsession", ".st": "smalltalk", ".smithy": "smithy", ".smk": "python", ".snakefile": "python", ".sol": "solidity", ".bzl": "python", ".star": "python", ".do": "stata", ".ado": "stata", ".doh": "stata", ".ihlp": "stata", ".mata": "stata", ".matah": "stata", ".sthlp": "stata", ".styl": "stylus", ".surql": "surrealql", ".svelte": "svelte", ".swift": "swift", ".sv": "system-verilog", ".svh": "system-verilog", ".vh": "system-verilog", ".toml": "toml", ".toml.example": "toml", ".tsv": "tsv", ".vcf": "tsv", ".tsx": "tsx", ".talon": "talonscript", ".tcl": "tcl", ".adp": "tcl", ".sdc": "tcl", ".tcl.in": "tcl", ".tm": "tcl", ".xdc": "tcl", ".tcsh": "shellscript", ".csh": "shellscript", ".tex": "tex", ".aux": "tex", ".bbx": "tex", ".cbx": "tex", ".dtx": "tex", ".ins": "tex", ".lbx": "tex", ".ltx": "tex", ".mkii": "tex", ".mkiv": "tex", ".mkvi": "tex", ".sty": "tex", ".toc": "tex", ".tftpl": "terraform", ".ttl": "turtle", ".twig": "twig", ".ts": "typescript", ".cts": "typescript", ".mts": "typescript", ".tsp": "typespec", ".typ": "typst", ".upc": "c", ".anim": "yaml", ".asset": "yaml", ".mask": "yaml", ".mat": "yaml", ".meta": "yaml", ".prefab": "yaml", ".unity": "yaml", ".uno": "csharp", ".uc": "java", ".vhdl": "vhdl", ".vhd": "vhdl", ".vhf": "vhdl", ".vhi": "vhdl", ".vho": "vhdl", ".vhs": "vhdl", ".vht": "vhdl", ".vhw": "vhdl", ".vala": "vala", ".vapi": "vala", ".veo": "verilog", ".vim": "viml", ".vba": "viml", ".vimrc": "viml", ".vmb": "viml", ".vb": "vb", ".vbhtml": "vb", ".volt": "d", ".vue": "vue", ".vy": "vyper", ".wgsl": "wgsl", ".owl": "xml", ".wast": "wasm", ".wat": "wasm", ".wit": "wit", ".mediawiki": "wikitext", ".wiki": "wikitext", ".wikitext": "wikitext", ".reg": "reg", ".mathematica": "wolfram", ".cdf": "wolfram", ".ma": "wolfram", ".mt": "wolfram", ".nb": "wolfram", ".nbp": "wolfram", ".wl": "wolfram", ".wls": "wolfram", ".wlt": "wolfram", ".xbm": "c", ".xpm": "c", ".xml": "xml", ".adml": "xml", ".admx": "xml", ".ant": "xml", ".axaml": "xml", ".axml": "xml", ".builds": "xml", ".ccproj": "xml", ".ccxml": "xml", ".clixml": "xml", ".cproject": "xml", ".cscfg": "xml", ".csdef": "xml", ".csproj": "xml", ".ct": "xml", ".depproj": "xml", ".dita": "xml", ".ditamap": "xml", ".ditaval": "xml", ".dll.config": "xml", ".dotsettings": "xml", ".filters": "xml", ".fsproj": "xml", ".fxml": "xml", ".glade": "xml", ".gml": "xml", ".gmx": "xml", ".gpx": "xml", ".grxml": "xml", ".gst": "xml", ".hzp": "xml", ".icls": "xml", ".iml": "xml", ".ivy": "xml", ".jelly": "xml", ".jsproj": "xml", ".kml": "xml", ".launch": "xml", ".mdpolicy": "xml", ".meta4": "xml", ".mjml": "xml", ".mod": "xml", ".mxml": "xml", ".natvis": "xml", ".ncl": "xml", ".ndproj": "xml", ".nproj": "xml", ".nuspec": "xml", ".odd": "xml", ".osm": "xml", ".pkgproj": "xml", ".proj": "xml", ".props": "xml", ".ps1xml": "xml", ".psc1": "xml", ".pt": "xml", ".pubxml": "xml", ".qhelp": "xml", ".rbxmx": "xml", ".rdf": "xml", ".res": "xml", ".resx": "xml", ".rss": "xml", ".scxml": "xml", ".sfproj": "xml", ".shproj": "xml", ".slnx": "xml", ".srdf": "xml", ".storyboard": "xml", ".sublime-snippet": "xml", ".sw": "xml", ".targets": "xml", ".tml": "xml", ".ui": "xml", ".urdf": "xml", ".ux": "xml", ".vbproj": "xml", ".vcxproj": "xml", ".vsixmanifest": "xml", ".vssettings": "xml", ".vstemplate": "xml", ".vxml": "xml", ".wixproj": "xml", ".wsdl": "xml", ".wsf": "xml", ".wxi": "xml", ".wxl": "xml", ".wxs": "xml", ".x3d": "xml", ".xacro": "xml", ".xaml": "xml", ".xib": "xml", ".xlf": "xml", ".xliff": "xml", ".xmi": "xml", ".xml.dist": "xml", ".xmp": "xml", ".xproj": "xml", ".xsd": "xml", ".xspec": "xml", ".xul": "xml", ".zcml": "xml", ".xsp-config": "xml", ".xsp.metadata": "xml", ".xpl": "xml", ".xproc": "xml", ".xs": "c", ".xslt": "xsl", ".xsl": "xsl", ".xsh": "python", ".mir": "yaml", ".reek": "yaml", ".rviz": "yaml", ".sublime-syntax": "yaml", ".syntax": "yaml", ".yaml-tmlanguage": "yaml", ".yaml.sed": "yaml", ".yml.mysql": "yaml", ".zs": "zenscript", ".zig": "zig", ".zig.zon": "zig", ".desktop": "desktop", ".desktop.in": "desktop", ".edn": "clojure", ".fish": "fish", ".rst": "rst", ".rest": "rst", ".rest.txt": "rst", ".rst.txt": "rst", ".templ": "templ", ".wisp": "clojure" }, filenames: { APKBUILD: "shellscript", ".htaccess": "apache", "apache2.conf": "apache", "httpd.conf": "apache", "bird.conf": "bird2", "gradlew.bat": "bat", "mvnw.cmd": "bat", "CMakeLists.txt": "cmake", CODEOWNERS: "codeowners", "riemann.config": "clojure", Cakefile: "coffee", Containerfile: "docker", Dockerfile: "docker", ".env": "dotenv", ".env.ci": "dotenv", ".env.dev": "dotenv", ".env.development": "dotenv", ".env.development.local": "dotenv", ".env.example": "dotenv", ".env.local": "dotenv", ".env.prod": "dotenv", ".env.production": "dotenv", ".env.sample": "dotenv", ".env.staging": "dotenv", ".env.template": "dotenv", ".env.test": "dotenv", ".env.testing": "dotenv", "mix.lock": "elixir", ".abbrev_defs": "emacs-lisp", ".emacs": "emacs-lisp", ".emacs.desktop": "emacs-lisp", ".gnus": "emacs-lisp", ".spacemacs": "emacs-lisp", ".viper": "emacs-lisp", Cask: "emacs-lisp", Eask: "emacs-lisp", "Project.ede": "emacs-lisp", _emacs: "emacs-lisp", abbrev_defs: "emacs-lisp", Emakefile: "erlang", "rebar.config": "erlang", "rebar.config.lock": "erlang", "rebar.lock": "erlang", ".gn": "gn", ".gitmessage": "git-commit", COMMIT_EDITMSG: "git-commit", "project.godot": "gdresource", Jenkinsfile: "groovy", ".buckconfig": "ini", ".coveragerc": "ini", ".flake8": "ini", ".gitreview": "ini", ".pylintrc": "ini", HOSTS: "ini", "buildozer.spec": "ini", hosts: "ini", pylintrc: "ini", vlcrc: "ini", "MANIFEST.MF": "yaml", ".all-contributorsrc": "json", ".arcconfig": "json", ".auto-changelog": "json", ".c8rc": "json", ".htmlhintrc": "json", ".imgbotconfig": "json", ".nycrc": "json", ".releaserc": "json", ".secrets.baseline": "json", ".tern-config": "json", ".tern-project": "json", ".watchmanconfig": "json", "MODULE.bazel.lock": "json", "Package.resolved": "json", "Pipfile.lock": "json", "bun.lock": "json", "composer.lock": "json", "deno.lock": "json", "flake.lock": "json", "mcmod.info": "json", ".babelrc": "jsonc", ".devcontainer.json": "jsonc", ".eslintrc": "jsonc", ".eslintrc.json": "jsonc", ".jscsrc": "jsonc", ".jshintrc": "jsonc", ".jslintrc": "jsonc", ".oxlintrc.json": "jsonc", ".swcrc": "jsonc", "api-extractor.json": "jsonc", "devcontainer.json": "jsonc", "jsconfig.json": "jsonc", "language-configuration.json": "jsonc", "tsconfig.json": "jsonc", "tslint.json": "jsonc", Jakefile: "javascript", Notebook: "json", ".JUSTFILE": "just", ".Justfile": "just", ".justfile": "just", JUSTFILE: "just", Justfile: "just", justfile: "just", ".luacheckrc": "lua", BSDmakefile: "make", GNUmakefile: "make", Kbuild: "make", Makefile: "make", "Makefile.am": "make", "Makefile.boot": "make", "Makefile.frag": "make", "Makefile.in": "make", "Makefile.inc": "make", "Makefile.pc": "make", "Makefile.wat": "make", makefile: "make", "makefile.sco": "make", mkfile: "make", "contents.lr": "markdown", "nextflow.config": "nextflow", "nginx.conf": "nginx", "nim.cfg": "nim", Nukefile: "nushell", ".php": "php", ".php_cs": "php", ".php_cs.dist": "php", Phakefile: "php", ".latexmkrc": "perl", "Makefile.PL": "perl", Rexfile: "perl", ack: "perl", cpanfile: "perl", latexmkrc: "perl", Modulefile: "puppet", ".gclient": "python", DEPS: "python", SConscript: "python", SConstruct: "python", wscript: "python", "installscript.qs": "javascript", "toolchain_installscript.qs": "javascript", ".Rapp.history": "r", ".Rhistory": "r", ".Rprofile": "r", "expr-dist": "r", ".irbrc": "ruby", ".pryrc": "ruby", ".simplecov": "ruby", Appraisals: "ruby", Berksfile: "ruby", Brewfile: "ruby", Buildfile: "ruby", Capfile: "ruby", Dangerfile: "ruby", Deliverfile: "ruby", Fastfile: "ruby", Gemfile: "ruby", Guardfile: "ruby", Jarfile: "ruby", Mavenfile: "ruby", Podfile: "ruby", Puppetfile: "ruby", Rakefile: "ruby", Snapfile: "ruby", Steepfile: "ruby", Thorfile: "ruby", Vagrantfile: "ruby", buildfile: "ruby", "ssh-config": "ssh-config", ssh_config: "ssh-config", sshconfig: "ssh-config", "sshconfig.snip": "ssh-config", "sshd-config": "ssh-config", sshd_config: "ssh-config", ".bash_aliases": "shellscript", ".bash_functions": "shellscript", ".bash_history": "shellscript", ".bash_logout": "shellscript", ".bash_profile": "shellscript", ".bashrc": "shellscript", ".cshrc": "shellscript", ".envrc": "shellscript", ".flaskenv": "shellscript", ".kshrc": "shellscript", ".login": "shellscript", ".profile": "shellscript", ".tmux.conf": "shellscript", ".xinitrc": "shellscript", ".xsession": "shellscript", ".zlogin": "shellscript", ".zlogout": "shellscript", ".zprofile": "shellscript", ".zshenv": "shellscript", ".zshrc": "shellscript", "9fs": "shellscript", PKGBUILD: "shellscript", bash_aliases: "shellscript", bash_logout: "shellscript", bash_profile: "shellscript", bashrc: "shellscript", cshrc: "shellscript", gradlew: "shellscript", kshrc: "shellscript", login: "shellscript", man: "shellscript", mvnw: "shellscript", profile: "shellscript", "tmux.conf": "shellscript", xinitrc: "shellscript", xsession: "shellscript", zlogin: "shellscript", zlogout: "shellscript", zprofile: "shellscript", zshenv: "shellscript", zshrc: "shellscript", Snakefile: "python", BUCK: "python", BUILD: "python", "BUILD.bazel": "python", "MODULE.bazel": "python", Tiltfile: "python", WORKSPACE: "python", "WORKSPACE.bazel": "python", "WORKSPACE.bzlmod": "python", "Cargo.lock": "toml", "Cargo.toml.orig": "toml", "Gopkg.lock": "toml", Pipfile: "toml", "mise.local.lock": "toml", "mise.lock": "toml", "pdm.lock": "toml", "poetry.lock": "toml", "uv.lock": "toml", owh: "tcl", starfield: "tcl", ".exrc": "viml", ".gvimrc": "viml", ".nvimrc": "viml", ".vimrc": "viml", _vimrc: "viml", gvimrc: "viml", nvimrc: "viml", vimrc: "viml", ".classpath": "xml", ".cproject": "xml", ".project": "xml", "App.config": "xml", "NuGet.config": "xml", "Settings.StyleCop": "xml", "Web.Debug.config": "xml", "Web.Release.config": "xml", "Web.config": "xml", "packages.config": "xml", ".clang-format": "yaml", ".clang-tidy": "yaml", ".clangd": "yaml", ".gemrc": "yaml", "CITATION.cff": "yaml", "glide.lock": "yaml", "pixi.lock": "yaml", "yarn.lock": "yaml" }, names: { abap: "abap", "actionscript-3": "actionscript-3", actionscript: "actionscript-3", as3: "actionscript-3", ada: "ada", ahk: "ahk", autohotkey: "ahk", ahk1: "ahk", ahk2: "ahk2", autohotkey2: "ahk2", "angular-html": "angular-html", "angular html": "angular-html", "angular-ts": "angular-ts", "angular typescript": "angular-ts", apache: "apache", "apache conf": "apache", apex: "apex", apl: "apl", applescript: "applescript", ara: "ara", asciidoc: "asciidoc", adoc: "asciidoc", asm: "asm", assembly: "asm", astro: "astro", awk: "awk", ballerina: "ballerina", bat: "bat", "batch file": "bat", batch: "bat", cmd: "bat", beancount: "beancount", berry: "berry", be: "berry", bibtex: "bibtex", bicep: "bicep", bird2: "bird2", "bird2 configuration": "bird2", bird: "bird2", blade: "blade", bsl: "bsl", "1c (enterprise)": "bsl", "1c": "bsl", c: "c", c3: "c3", cadence: "cadence", cdc: "cadence", cairo: "cairo", chapel: "chapel", chpl: "chapel", clarity: "clarity", clojure: "clojure", clj: "clojure", cmake: "cmake", cobol: "cobol", codeowners: "codeowners", codeql: "codeql", ql: "codeql", coffee: "coffee", coffeescript: "coffee", "common-lisp": "common-lisp", "common lisp": "common-lisp", lisp: "common-lisp", coq: "coq", rocq: "coq", cpp: "cpp", "c++": "cpp", crystal: "crystal", csharp: "csharp", "c#": "csharp", cs: "csharp", css: "css", csv: "csv", cue: "cue", cypher: "cypher", cql: "cypher", d: "d", dart: "dart", dax: "dax", desktop: "desktop", diff: "diff", docker: "docker", dockerfile: "docker", dotenv: "dotenv", "dream-maker": "dream-maker", "dream maker": "dream-maker", edge: "edge", elixir: "elixir", elm: "elm", "emacs-lisp": "emacs-lisp", "emacs lisp": "emacs-lisp", elisp: "emacs-lisp", erb: "erb", erlang: "erlang", erl: "erlang", fennel: "fennel", fish: "fish", fluent: "fluent", ftl: "fluent", "fortran-fixed-form": "fortran-fixed-form", "fortran (fixed form)": "fortran-fixed-form", f: "fortran-fixed-form", for: "fortran-fixed-form", f77: "fortran-fixed-form", "fortran-free-form": "fortran-free-form", "fortran (free form)": "fortran-free-form", f90: "fortran-free-form", f95: "fortran-free-form", f03: "fortran-free-form", f08: "fortran-free-form", f18: "fortran-free-form", fsharp: "fsharp", "f#": "fsharp", fs: "fsharp", gdresource: "gdresource", tscn: "gdresource", tres: "gdresource", gdscript: "gdscript", gd: "gdscript", gdshader: "gdshader", genie: "genie", gherkin: "gherkin", "git-commit": "git-commit", "git commit message": "git-commit", "git-rebase": "git-rebase", "git rebase message": "git-rebase", gleam: "gleam", "glimmer-js": "glimmer-js", "glimmer js": "glimmer-js", gjs: "glimmer-js", "glimmer-ts": "glimmer-ts", "glimmer ts": "glimmer-ts", gts: "glimmer-ts", glsl: "glsl", gn: "gn", gnuplot: "gnuplot", go: "go", graphql: "graphql", gql: "graphql", groovy: "groovy", hack: "hack", haml: "haml", "ruby haml": "haml", handlebars: "handlebars", hbs: "handlebars", haskell: "haskell", hs: "haskell", haxe: "haxe", hcl: "hcl", "hashicorp hcl": "hcl", hjson: "hjson", hlsl: "hlsl", html: "html", "html-derivative": "html-derivative", "html (derivative)": "html-derivative", http: "http", hurl: "hurl", hxml: "hxml", hy: "hy", imba: "imba", ini: "ini", properties: "ini", java: "java", javascript: "javascript", js: "javascript", cjs: "javascript", mjs: "javascript", jinja: "jinja", jison: "jison", json: "json", json5: "json5", jsonc: "jsonc", "json with comments": "jsonc", jsonl: "jsonl", "json lines": "jsonl", jsonnet: "jsonnet", jssm: "jssm", fsl: "jssm", jsx: "jsx", julia: "julia", jl: "julia", just: "just", justfile: "just", kdl: "kdl", kotlin: "kotlin", kt: "kotlin", kts: "kotlin", kusto: "kusto", kql: "kusto", latex: "latex", lean: "lean", "lean 4": "lean", lean4: "lean", less: "less", liquid: "liquid", llvm: "llvm", "llvm ir": "llvm", log: "log", "log file": "log", logo: "logo", lua: "lua", luau: "luau", make: "make", makefile: "make", markdown: "markdown", md: "markdown", marko: "marko", matlab: "matlab", mdc: "mdc", mdx: "mdx", mermaid: "mermaid", mmd: "mermaid", mipsasm: "mipsasm", "mips assembly": "mipsasm", mips: "mipsasm", mojo: "mojo", moonbit: "moonbit", mbt: "moonbit", mbti: "moonbit", move: "move", narrat: "narrat", "narrat language": "narrat", nar: "narrat", nextflow: "nextflow", nf: "nextflow", "nextflow-groovy": "nextflow-groovy", "nextflow groovy": "nextflow-groovy", nginx: "nginx", nim: "nim", nix: "nix", nsis: "nsis", nushell: "nushell", nu: "nushell", "objective-c": "objective-c", objc: "objective-c", "objective-cpp": "objective-cpp", "objective-c++": "objective-cpp", ocaml: "ocaml", odin: "odin", openscad: "openscad", scad: "openscad", org: "org", "org markup": "org", pascal: "pascal", perl: "perl", php: "php", pkl: "pkl", plsql: "plsql", "pl/sql": "plsql", po: "po", "gettext po": "po", pot: "po", potx: "po", polar: "polar", postcss: "postcss", powerquery: "powerquery", powershell: "powershell", ps: "powershell", ps1: "powershell", pwsh: "powershell", prisma: "prisma", prolog: "prolog", proto: "proto", "protocol buffer 3": "proto", protobuf: "proto", pug: "pug", jade: "pug", puppet: "puppet", purescript: "purescript", python: "python", py: "python", qml: "qml", qmldir: "qmldir", "qml directory": "qmldir", qss: "qss", "qt style sheets": "qss", r: "r", racket: "racket", raku: "raku", perl6: "raku", razor: "razor", "asp.net razor": "razor", rbs: "rbs", "ruby-signature": "rbs", reg: "reg", "windows registry script": "reg", regexp: "regexp", regex: "regexp", rel: "rel", riscv: "riscv", "risc-v": "riscv", ron: "ron", rosmsg: "rosmsg", "ros interface": "rosmsg", rst: "rst", restructuredtext: "rst", ruby: "ruby", rb: "ruby", rust: "rust", rs: "rust", sas: "sas", sass: "sass", scala: "scala", scheme: "scheme", scss: "scss", sdbl: "sdbl", "1c (query)": "sdbl", "1c-query": "sdbl", shaderlab: "shaderlab", shader: "shaderlab", shellscript: "shellscript", shell: "shellscript", bash: "shellscript", sh: "shellscript", zsh: "shellscript", shellsession: "shellsession", "shell session": "shellsession", console: "shellsession", smalltalk: "smalltalk", "gnu smalltalk": "smalltalk", smithy: "smithy", solidity: "solidity", soy: "soy", "closure templates": "soy", "closure-templates": "soy", sparql: "sparql", splunk: "splunk", "splunk query language": "splunk", spl: "splunk", sql: "sql", "ssh-config": "ssh-config", "ssh config": "ssh-config", stata: "stata", stylus: "stylus", styl: "stylus", surrealql: "surrealql", surql: "surrealql", svelte: "svelte", swift: "swift", "system-verilog": "system-verilog", systemverilog: "system-verilog", systemd: "systemd", "systemd units": "systemd", talonscript: "talonscript", talon: "talonscript", tasl: "tasl", tcl: "tcl", templ: "templ", terraform: "terraform", tf: "terraform", tfvars: "terraform", tex: "tex", toml: "toml", "ts-tags": "ts-tags", "typescript with tags": "ts-tags", lit: "ts-tags", tsv: "tsv", tsx: "tsx", turtle: "turtle", twig: "twig", typescript: "typescript", ts: "typescript", cts: "typescript", mts: "typescript", typespec: "typespec", tsp: "typespec", typst: "typst", typ: "typst", v: "v", vala: "vala", vb: "vb", "visual basic": "vb", verilog: "verilog", vhdl: "vhdl", viml: "viml", "vim script": "viml", vim: "viml", vimscript: "viml", vue: "vue", "vue-html": "vue-html", "vue html": "vue-html", "vue-vine": "vue-vine", "vue vine": "vue-vine", vyper: "vyper", vy: "vyper", wasm: "wasm", webassembly: "wasm", wenyan: "wenyan", \u6587\u8A00: "wenyan", wgsl: "wgsl", wikitext: "wikitext", mediawiki: "wikitext", wiki: "wikitext", wit: "wit", "webassembly interface types": "wit", wolfram: "wolfram", wl: "wolfram", xml: "xml", xsl: "xsl", yaml: "yaml", yml: "yaml", zenscript: "zenscript", zig: "zig", "1c enterprise": "bsl", "actionscript 3": "actionscript-3", actionscript3: "actionscript-3", ada95: "ada", ada2005: "ada", "alpine abuild": "shellscript", abuild: "shellscript", apkbuild: "shellscript", "altium designer": "ini", altium: "ini", apacheconf: "apache", aconf: "apache", apples: "applescript", osascript: "applescript", nasm: "asm", b: "c", bird3: "bird2", batchfile: "bat", dosbatch: "bat", winbatch: "bat", beef: "csharp", buildstream: "yaml", cake: "csharp", cakescript: "csharp", "c2hs haskell": "haskell", c2hs: "haskell", collada: "xml", cson: "coffee", "cairo zero": "cairo", chuck: "java", "coffee-script": "coffee", "component pascal": "pascal", cycript: "javascript", dlang: "d", dm: "dream-maker", byond: "dream-maker", dtrace: "c", "dtrace-script": "c", dhall: "haskell", udiff: "diff", containerfile: "docker", eq: "csharp", eagle: "xml", easybuild: "python", "ecere projects": "json", cask: "emacs-lisp", eask: "emacs-lisp", emacs: "emacs-lisp", emberscript: "coffee", freemarker: "fluent", frege: "haskell", "gentoo ebuild": "shellscript", "gentoo eclass": "shellscript", "gettext catalog": "po", cucumber: "gherkin", "git commit": "git-commit", commit: "git-commit", glyph: "tcl", golang: "go", "godot resource": "gdresource", "gradle kotlin dsl": "kotlin", "hashicorp configuration language": "hcl", opentofu: "hcl", xhtml: "html", "html+erb": "erb", rhtml: "erb", "html+ruby": "erb", "html+razor": "razor", htmlbars: "handlebars", hylang: "hy", conf: "ini", dosini: "ini", "jar manifest": "yaml", geojson: "json", sarif: "json", topojson: "json", jsonld: "javascript", node: "javascript", "javascript+erb": "javascript", django: "jinja", "html+django": "jinja", "html+jinja": "jinja", htmldjango: "jinja", "jupyter notebook": "json", "ipython notebook": "json", "kaitai struct": "yaml", ksy: "yaml", kit: "html", labview: "xml", "less-css": "less", lookml: "yaml", octave: "matlab", mtml: "html", bsdmake: "make", mf: "make", pandoc: "markdown", markojs: "marko", max: "json", "max/msp": "json", maxmsp: "json", "mermaid example": "mermaid", mirah: "ruby", "nginx configuration file": "nginx", nixos: "nix", nush: "nushell", "nu-script": "nushell", "nushell-script": "nushell", "oasv2-json": "json", "oasv2-yaml": "yaml", "oasv3-json": "json", "oasv3-yaml": "yaml", "obj-c": "objective-c", objectivec: "objective-c", "obj-c++": "objective-cpp", "objc++": "objective-cpp", "objectivec++": "objective-cpp", odinlang: "odin", "odin-lang": "odin", opencl: "c", "openrc runscript": "shellscript", openrc: "shellscript", inc: "php", plpgsql: "sql", delphi: "pascal", objectpascal: "pascal", cperl: "perl", "power query": "powerquery", posh: "powershell", "pro*c": "c", "protocol buffer": "proto", "protocol buffers": "proto", py3: "python", python3: "python", rusthon: "python", "qt script": "javascript", "quartus simulation ip": "tcl", rscript: "r", splus: "r", raml: "yaml", rpc: "c", rpcgen: "c", oncrpc: "c", xdr: "c", "perl-6": "raku", "regular expression": "regexp", "rocq prover": "coq", rouge: "clojure", jruby: "ruby", macruby: "ruby", rake: "ruby", rbx: "ruby", sqlpl: "sql", sshconfig: "ssh-config", sshdconfig: "ssh-config", ssh_config: "ssh-config", sshd_config: "ssh-config", sage: "python", "shell-script": "shellscript", envrc: "shellscript", "bash session": "shellsession", squeak: "smalltalk", snakemake: "python", snakefile: "python", starlark: "python", bazel: "python", bzl: "python", "tab-seperated values": "tsv", typescriptreact: "tsx", sdc: "tcl", xdc: "tcl", tcsh: "shellscript", "terraform template": "terraform", "unified parallel c": "c", "unity3d asset": "yaml", uno: "csharp", unrealscript: "java", vlang: "v", nvim: "viml", "visual basic .net": "vb", vbnet: "vb", "vb .net": "vb", "vb.net": "vb", volt: "d", "web ontology language": "xml", wast: "wasm", "webassembly interface type": "wit", "windows registry entries": "reg", "wolfram language": "wolfram", mathematica: "wolfram", mma: "wolfram", "wolfram lang": "wolfram", "x bitmap": "c", xbm: "c", "x pixmap": "c", xpm: "c", rss: "xml", xsd: "xml", wsdl: "xml", xpages: "xml", xproc: "xml", xs: "c", xslt: "xsl", xonsh: "python", edn: "clojure", wisp: "clojure" }, grammars: { abap: { sha256: "d665cc8a82dcf96eaf4b0543459786f0d9192a5e712b757e526dc60369bce96e" }, "actionscript-3": { sha256: "617a08d5cfe2fe49e9595ead20ef782736818e88f33d43741cb90838a47c6e9f" }, ada: { sha256: "79ab75d131fd46981a2e13af4b159ff8a827f2140195dc05038cdc5883aa4fe0" }, ahk: { sha256: "2ad57e24f70aa2c03030b94dd1be23281aa0098a77406b903651965ce367ca4d" }, ahk2: { sha256: "2f469451115474bde9d93b09c48081940ffcda82f5986321bee03a7bba1adb29" }, "angular-html": { sha256: "c65057850a021d5c725c424cb936a9ef5cbfa8cdf28a05261090e0800ef777eb", embedded: ["html", "angular-expression", "angular-let-declaration", "angular-template", "angular-template-blocks"] }, "angular-ts": { sha256: "226afba87e11e01ecfd479c6c44858b8de7c87af30f902cab2524d31fc4e4331", embedded: ["angular-expression", "angular-inline-style", "angular-inline-template", "angular-let-declaration", "angular-template", "angular-template-blocks"] }, apache: { sha256: "37d28440d01d2d70a961f8f25f58a7e6e591556e5afbfdd5f3b5345657d9b82c" }, apex: { sha256: "1d270d92de461aae47f30186e8693144fd37a4cc0405c71a3c4141b661f02006" }, apl: { sha256: "2571df1b33bf5d2f735eb7a0697eb40adcd1f9d7559b2c1382b9974a088a59c4", embedded: ["html", "xml", "css", "javascript", "json"] }, applescript: { sha256: "5649f528fcc7c4866159bc0aa5a13ab07473fccfc21be7be619cbd8731a212bc" }, ara: { sha256: "c61143712af64cb8119b95c7dd2773a58500168f22f93e065c06e09e7af7b576" }, asciidoc: { sha256: "890bbf5f9fa6a6347c53c1119edd3dd20a8c400f6e98968ff6c30ecdfebde4a9", embedded: ["html", "yaml", "csv", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "markdown", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "haskell", "kotlin"], lazy: ["html", "yaml", "csv", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "markdown", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "haskell", "kotlin"] }, asm: { sha256: "fb2985f84149f8d230ec89d4b09c305b92660b372e6e8295f2a92553f7ad7426" }, astro: { sha256: "570296dd8ce84a7fe5e64dbb95e180a0c1554a9065aeb2868fbedf2eafbb6c97", embedded: ["json", "javascript", "typescript", "stylus", "sass", "css", "scss", "less", "postcss", "tsx"], lazy: ["sass", "scss", "stylus", "less"] }, awk: { sha256: "10d61873d5e08a77781a058910d6e17ce5626cd8026012714dfbaafcc2f9f5e6" }, ballerina: { sha256: "08d1179dc57551a0084d4a48a627d1e2d04a5d5673d2f815dd3215d88d021c6a" }, bat: { sha256: "187895f26d25236be6501e8c8d94192ceace95a4f6ae1f47e47fed19103ae904" }, beancount: { sha256: "2d84b71a502299747a1d0a2abf210aa6fc8dfa4386cba7531d7fcbb588a7116e" }, berry: { sha256: "71ce1be49a48ff357f03545f410a76e4b8f51a9b0156169eabd8cfb9867c06ae" }, bibtex: { sha256: "2031f0fe56abab3490a9768ffa6ee94a7c8d05dc1fba8b130effea9d7587136c" }, bicep: { sha256: "42a31507fec15f20372067f7f05bf77bf5d414b96ac36a3a016df024ff8446ad" }, bird2: { sha256: "dd066764165bc60aeba82f10488ce6291899bb444446b941c541c37023c08606" }, blade: { sha256: "1913ab44249fb5ba7ff5d93828165c7c817cdb8413ab84b1cc36b8ebabf21c4a", embedded: ["html-derivative", "html", "xml", "sql", "javascript", "json", "css"] }, bsl: { sha256: "e87ca277cc8daa5f1b7e23863e0848dd193e098791a866a33ecc16be91ec6d20", embedded: ["sdbl"] }, c: { sha256: "6a783a491f44106a4c4710b87422bdcd8540ebe6ec2510dfcdcf7df7edd403f9" }, c3: { sha256: "abeba47760cb650ec622bb2f81b13a878a4a2c11440183d045558093d5245bab" }, cadence: { sha256: "d2d5fef00e56f61005590ed953f90f4da53502411a94183939e9f043a8afbf75" }, cairo: { sha256: "63bcccfa07952be82564b438969de40417314cefeed51e73a3f4e40bb21144b6", embedded: ["python"] }, chapel: { sha256: "03b6937c978a6320b5823d1eb11b37a2885831d0e917899ba5524aec3b7b2b99", embedded: ["c"] }, clarity: { sha256: "fbf9bc255029db55bbb7444dd67a55f0a684bfaa99feb99744ed003ad2250174" }, clojure: { sha256: "de03d10ea8a39ba74fda529e0c25c977cfce6a59f3eef8c1224f536a27c984d4" }, cmake: { sha256: "c02ac569fe3d30b1e36ee5ff9f8548b9f10ce6d8ae7338ef867a1133c1c130b3" }, cobol: { sha256: "e4165fee038b07de87049bef3bf3f02f41d4dbe3d99e9f12aaea0c49e685bf3b", embedded: ["html", "java"] }, codeowners: { sha256: "f4a20cbf42bafc1e34f84da7461979bb229bf14506b2539e42cfce5cf12325a0" }, codeql: { sha256: "a970b5ed5568449349aba1a17e0af933e9789eb3e941b886a3944cc6c65a558b" }, coffee: { sha256: "b22b4e8fbbe6a2683f65265aa071c4815646e5b955ee1dd1662d76efb1761104", embedded: ["javascript"] }, "common-lisp": { sha256: "2e0efc1439447982e8f534de23c9c4f2a393c070e602e503f74ba07ccb21b95a" }, coq: { sha256: "00c967655ff6dafee4a474150b749d0b9099e984090b474038557e9955780390" }, cpp: { sha256: "6a8899737f618f3ae6da693c782b32d5d1bb7c772ce9994a29b0d332cf8d0c83", embedded: ["cpp-macro", "regexp", "glsl"] }, crystal: { sha256: "e3fc3a4417144fbbdfa5e7fe3bcfd3f3d0b898a20e3fbb941485803a2cc7c9e7", embedded: ["html", "sql", "css", "c", "javascript", "shellscript"] }, csharp: { sha256: "31ffc2468705f77f9dc601c83e496e61b752d15ed7c3f6f6ac43758ca15c8518" }, css: { sha256: "02060a327b550d015f0b9b0c1aff69e87951f9a6b18a1c75e4405d50ee83c95d" }, csv: { sha256: "7b270d9c4ce6c1db8442f682146ddb337f4c245b999b5a81c6287fe0aa2b1eb7" }, cue: { sha256: "206716eb41ec7d426dff3c1ac8ac3f85f4fe183ebefc4ad64200eec200c1cd82" }, cypher: { sha256: "cd00bf1f7383fcd72f7679d268c61c32556cdb32354a80202bf3e0d96606d5bc" }, d: { sha256: "3f9ad1e7119398651dc6ed30f5fcce770b53d566512685548e1a63cc363965df" }, dart: { sha256: "6e4eec104a6881fcb6ae63a318b6b20d560ff44c2a069e541dedd81297c79eee" }, dax: { sha256: "c55a889051da21cca214c006a75a7ab31a273fd445602189313609979e342c2b" }, desktop: { sha256: "e7fe0a770ad2e726d5d736fa7cc315105f4486084de3b1664afbba62355f83e7" }, diff: { sha256: "a711eda13cbf7abe386bf729dc088e127613641f2d0d1a28b62a9fece2877756" }, docker: { sha256: "4b407996ccef6df7feae745ed51e82a6a683339022d3a22cf5e5b2ea0a6db75e" }, dotenv: { sha256: "71426f619467549b623ca2ca3bd826a6596d599faaf0f65b808f6d0fc1a815a7" }, "dream-maker": { sha256: "3e807e766a98ff523b380d3bcc771d5f3c57f3717a5371fcc8651d607e5c4783" }, edge: { sha256: "b2d4c31946713943b3abdde58ea63c8fa419b1b51cc25306684e9b760c714a01", embedded: ["typescript", "html", "html-derivative"] }, elixir: { sha256: "feb3a4de9674321042744c3c0934f97639379a885e42bfee5a9a191fd68db01d", embedded: ["html"] }, elm: { sha256: "e1f1f560d87dc5148d47f4f71589c88dd1bd2e27c1e265cd35edf919b4bb8ece", embedded: ["glsl"] }, "emacs-lisp": { sha256: "bec5f69637fd69dfbe65811d71aaf0fd0016841fdbaa7b04ec154c59d373bc92" }, erb: { sha256: "12d8c9209174f117d09e8bce5b2237c1cc4049dc1336b0eb68706531c8df4cf2", embedded: ["html", "ruby"] }, erlang: { sha256: "42de67bb8d971786462e99f0c8d59bc9166163dd60655bd9220e1b11dc02f92e", embedded: ["markdown"] }, fennel: { sha256: "e1bbbd66d2f08396aec83c5f5d83445f825bef2678d65abe877700fdb4d49ade" }, fish: { sha256: "17a34e3a0003c35fe0cca0fc5be36928addfaeabbd04adefcd8083529a61c854" }, fluent: { sha256: "73c7a2e94da069af7f6092cfd9a29775e319e9ef4fdb0bd5eccc2b18bb703366" }, "fortran-fixed-form": { sha256: "3476527231cded8daa9f95ef228ea2b370ccb6a3cb54d2816c7cb66eff7b670c", embedded: ["fortran-free-form"] }, "fortran-free-form": { sha256: "8f5cdc19cbb98f244521158c0e9e24cbf4d6660ed60c5bd316f1058b17adc54c" }, fsharp: { sha256: "8e4c5c084814e2264771730fb40e2e9919d3c6512031c43cfe7a4f6b0239d955", embedded: ["markdown"] }, gdresource: { sha256: "1e858e080db64e878ef3d6ea36b61229be9759da33839177714a11abe604a2a3", embedded: ["gdshader", "gdscript"] }, gdscript: { sha256: "69eab8c23ab46c66068eb3644de73d3527a60465b4c2947ee03c7eef6495c955" }, gdshader: { sha256: "197dc28eee040ba1974bb31173cbd9cc35eefa14e1509129834f4f9ebcec6426" }, genie: { sha256: "959113f8405fd5fb8eea778aaf90e571838220edb276ac1f5d9e6774b959f307" }, gherkin: { sha256: "61e128931e5243c24f86afc24191f380ebd231e47854a37d0ae15d82596c6483" }, "git-commit": { sha256: "21be35dcd1572e2d08c3d788840475744765c9b9d148e82057a0b68af109cba9", embedded: ["diff"] }, "git-rebase": { sha256: "d3abee61347a7bafa3623fddb1bbca3707b565e9e32cd7b886ba3ab06de6f504", embedded: ["shellscript"] }, gleam: { sha256: "64ab9915c3e21f9787b4b789ea68c59d2c3cf81fd40df7f1eb87ff7fafca79c5" }, "glimmer-js": { sha256: "4c1bcb5c99c4b9b173087c960a82fe715d6ffc7072424497669d7d2e8440c842", embedded: ["javascript", "typescript", "css", "html"] }, "glimmer-ts": { sha256: "1dda048a83b57ffe159d7147927371bdb9797b81aaf2e4cbcb7398899680bbfe", embedded: ["typescript", "css", "javascript", "html"] }, glsl: { sha256: "c4dd4bd5b1ff3a8c0fd729261a06e0d7cd2141177cf34f53684297d524e72bef", embedded: ["c"] }, gn: { sha256: "d6276992d21a3493b7ab64f4e1da75d107beb782ffd3138d08351d86a02bf8c9" }, gnuplot: { sha256: "8a396e2c4d8aa121156d0069aabbdfc70451ac888583472eb5cf3476aa27d26f" }, go: { sha256: "ce39c438983c2eb8680c6612fb949598fdf780f79c91711d1380a5cd988a7dd7" }, graphql: { sha256: "f24255a06c7e9e80256fe65e3d8b68505e4a4f20f068007a739219ec386e73c8", embedded: ["javascript", "typescript", "jsx", "tsx"] }, groovy: { sha256: "1d3f39d1e474ae3bbd92480f9f985fe660d4af5e72b2ef7aee9e3937970bf8be" }, hack: { sha256: "435fb268a4223fc8b6facaa6243be1103bf21b6e9296472f7f3e36ecd2fb818f", embedded: ["html", "sql"] }, haml: { sha256: "2ae1dd6bf77a716f4d96a90097c59a3a1548d64d92045a8cc8c19c2a55af5de9", embedded: ["ruby", "javascript", "sass", "coffee", "markdown", "css"], lazy: ["ruby", "sass", "coffee", "markdown"] }, handlebars: { sha256: "63410dba62699aa84008274fec2f733461b97b23d948e23cd1831b62c68c76fa", embedded: ["html", "css", "javascript", "yaml"] }, haskell: { sha256: "030927a96a7d4ca5548e6d6631efb048617b6098fde26049d87dd7d17221af00" }, haxe: { sha256: "a26d9810c50a1b4775a4562c1b897294d12e7e04aefbe89d948c0659d22ddd41" }, hcl: { sha256: "8ad2847f1765adbe564202c7bf0226ffa7a11c3e14c3cf9ff79812c69d250a1b" }, hjson: { sha256: "eee2f1aa3472ed3d3fc82443ace80be33a921dcdd8fb7210e6822c060790d4e8" }, hlsl: { sha256: "451c884bbe6acdd0b94c7564fed3d161746619d47bb71a6de0ca2032ababb428" }, html: { sha256: "7538c38e0d1703bae90fb097a0fbc8501bc112ae06f149934ea6464f2c5ddae4", embedded: ["javascript", "css"] }, "html-derivative": { sha256: "9e90d5770e508d0c8a43004f782014fe0bfa97867e27c06fef46bcc82f0dfe4c", embedded: ["html"] }, http: { sha256: "577c6a4259737bb723f693300e2dc80b868aa34c00ba824a695a9473cf5ac6e1", embedded: ["shellscript", "json", "xml", "graphql"] }, hurl: { sha256: "2eee942fd805099f11c9572d44eff05a5649a97ae3f9f3338d943eaa31f945f1", embedded: ["graphql", "xml", "csv"] }, hxml: { sha256: "5b6cee11134d967bb91c0803dbba0804618e422eb64b4804b7aeac8efb8c5dec", embedded: ["haxe"] }, hy: { sha256: "d5a356367e00a46688b348d186cca39893e15bcde35dfb807e541e1c78d63ff1" }, imba: { sha256: "f244f61f9358ae6fab62c15134dc209a8ba1c7cee72bf294576998cb3d7a1446" }, ini: { sha256: "5b4a4ef9673429f7f13fec73eae543e3e00e1245762aacd89bb1849322338b61" }, java: { sha256: "c2d622b901b19119f2b3469583ef50fe6998788c179c0d3bbd7a0eab019378cb" }, javascript: { sha256: "a30cb0504491961b3d1bc99971daa5c2aedc7387f4782b567e1f0ac47aa83cba" }, jinja: { sha256: "f17c9a7064fcf6f1fb7b900b4180650f69505cb53e82123203541c1af26b40a0", embedded: ["jinja-html"] }, jison: { sha256: "984b4ec444bdbf651160f6d787ba626c44ae7e7a586e7ded188765704b4b553a", embedded: ["javascript"] }, json: { sha256: "f726cfcd953e00567c714a93c15a6227ef7bdb92c939cb07217e036ef5716dc0" }, json5: { sha256: "f034701d1180b6e9b05ed45f135a9798790f42a4ca757a5eedf46bf621413fca" }, jsonc: { sha256: "87374ba1bee9a9af779038accbcbe4ecc7c30ae891b2fefcbc411aa88db24cfc" }, jsonl: { sha256: "d9d9f117f348eec4d85e1ea2133b1e07316c566a8cafc151a42da87d1fb28ccc" }, jsonnet: { sha256: "b8d23e7e2736ca5139ff9f61461ddedb7950654b3e1f84d46be38cdad073c8ab" }, jssm: { sha256: "f643722c2aacda4fe77e95469c410565861ba77206534e135adab59dbe24c7c4" }, jsx: { sha256: "e1a2dadc98b5750946aca0a754a974216fb0d7d5d0c9bdb9d9ad19450a56322b" }, julia: { sha256: "95d3eeb8f35d9ea5fe10edb3a6bdb9fb5e6b9363e71965614141993aeabc7893", embedded: ["cpp", "python", "javascript", "r", "sql"] }, just: { sha256: "9c6ed82a9fef493c9cc7857f44c2b72128153dac9ec5f80f6a47c51056d42d44", embedded: ["shellscript", "javascript", "typescript", "perl", "python", "ruby"] }, kdl: { sha256: "f19e3edcd2e8f387a7cd3ee1414e3a0656eed4c675afd1e2bb15c8e84887aec9" }, kotlin: { sha256: "df113ce9452b3938bdee7a18e88f688eb7eb2023607e62dbad46e756c68f7729" }, kusto: { sha256: "266102e01feea9e67812dee2539f1dc5535e5fa391973f59beb65131c8faf873" }, latex: { sha256: "aab4fa80c27b22be4dfbe68ed55411c13534929b5fa96ba4a8af1d18d749ad53", embedded: ["tex", "shellscript", "css", "gnuplot", "haskell", "html", "java", "julia", "javascript", "lua", "python", "ruby", "rust", "typescript", "xml", "yaml", "scala"], lazy: ["shellscript", "css", "gnuplot", "haskell", "html", "java", "julia", "javascript", "lua", "python", "ruby", "rust", "typescript", "xml", "yaml", "scala"] }, lean: { sha256: "fa48db0d69244fe7556e5201525cf04bb8ee5146d8626deac1989ddff768fb59" }, less: { sha256: "2dcc623cd0f6457b77ce12765db469707d9da44c2033aa63bfb645bc670f44e9" }, liquid: { sha256: "c94cd418d9f839d5dc922c5cc1a9cffb35d4c82c5be56bf64bc823d29fded9de", embedded: ["html", "css", "json", "javascript"] }, llvm: { sha256: "74bd5b6a9f59612cec2943ce36bbf102fb9914a55b95db5733b1a48531a9dd48" }, log: { sha256: "41f32399f600df1710db2e417b5160a3c015c71f97ce851bce3068dd6b157860" }, logo: { sha256: "b8e96bdf1cafe536ed9b79c7de10ddb10e1b102fb58e5716729d742f7384f19a" }, lua: { sha256: "cba0798e8a1155fa81b72d029332e097a6b7b1f2e45eff036adba602d2efea93", embedded: ["c"] }, luau: { sha256: "8fcbabf53a194b6f687cf36b5a462717fa6200949603998842d70fbeddaf9ea7" }, make: { sha256: "b39266e91f2b7619395e7c164674bb52ecf7c9ce815beb1065297766e1e2af03" }, markdown: { sha256: "02f472fd0df82f212be5dfde4d9ee90982885247a884323d8a6c80ecf87114b3", embedded: ["css", "html", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "jsonl", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "html-derivative"], lazy: ["css", "html", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "jsonl", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "regexp", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "log", "erlang", "elixir", "latex", "bibtex", "abap", "rst", "html-derivative"] }, marko: { sha256: "bbbd87a18b6a4a8b328049bcba9509be13afc09cac40a7887544bb70c526e5e4", embedded: ["css", "less", "scss", "typescript"] }, matlab: { sha256: "ab688e8332e7a7bf7cffbf8f98a9d0d32cab1fe51bc1b589297e45de6a6c2f8f" }, mdc: { sha256: "f5188840eede1fdeb22e1bbcb772e560998d8668bb701b69426608eb9de53e52", embedded: ["markdown", "yaml", "html-derivative"] }, mdx: { sha256: "1b9569f7369728ba9d088a1720121b4f8129441306e8968fdd747a1c3d73d7d6", embedded: ["tsx", "toml", "yaml", "c", "clojure", "coffee", "cpp", "csharp", "css", "diff", "docker", "elixir", "elm", "erlang", "go", "graphql", "haskell", "html", "ini", "java", "javascript", "json", "julia", "kotlin", "less", "lua", "make", "markdown", "objective-c", "perl", "python", "r", "ruby", "rust", "scala", "scss", "shellscript", "shellsession", "sql", "xml", "swift", "typescript"], lazy: ["tsx", "toml", "yaml", "c", "clojure", "coffee", "cpp", "csharp", "css", "diff", "docker", "elixir", "elm", "erlang", "go", "graphql", "haskell", "html", "ini", "java", "javascript", "json", "julia", "kotlin", "less", "lua", "make", "markdown", "objective-c", "perl", "python", "r", "ruby", "rust", "scala", "scss", "shellscript", "shellsession", "sql", "xml", "swift", "typescript"] }, mermaid: { sha256: "00f2399649293bcd4d9557a82d5e414628d4c675f366fbd73a419b53922e76e7" }, mipsasm: { sha256: "1e677d62ff64d2c00cb0adac472217d7a3dcd403b8cd244876f234b66a651df1" }, mojo: { sha256: "742bbf1145b3bc47391927128c427a27f3f694d62cb4c4b10fecb8bc3984f148" }, moonbit: { sha256: "0f9cf0bfe8609d49144685dd00b4be9d97aa1e4ee91a80ecf2e039ac389fa8a3" }, move: { sha256: "d37f59207665d42415f071b11116c58e815ca06310409aa917e6007168cda985" }, narrat: { sha256: "7aea8b615eba280e7919a2e63c9ce3bd6fa5f45901d9ba5b60dc8570c8d9b6f0" }, nextflow: { sha256: "cac2155ebedb2522f277e1f45d2800b995d72cc2fa39d0b330868c3ce65cb4aa", embedded: ["nextflow-groovy"] }, "nextflow-groovy": { sha256: "02333af8e2fc69b7dff83bd432036048c5829bc28c89db75ed9572b40f2bcbbc" }, nginx: { sha256: "c63bba1384fe4dec1c650015f6f102f2355c48dc75b3e653929d218229db7317", embedded: ["lua"] }, nim: { sha256: "d1302634a0b1396a7642330d9c4115eda66f4e277f2b067531b981cf325d72a3", embedded: ["c", "html", "xml", "javascript", "css", "glsl", "markdown"] }, nix: { sha256: "33555de7449551044cf017d1f3c12ee9df1c7f6a7eb2d9b7357eade16f2363af", embedded: ["markdown-nix"] }, nsis: { sha256: "4636d51d848f215e1811b3432c9e747554a9cdcf2273c066774e04e8f8039c37" }, nushell: { sha256: "186d3aa0dd8914008bcd4d2284a92613d35e63cfc67cd868ecd41d5fc21c1674" }, "objective-c": { sha256: "b4d74efae95f6320e43e77a7d2f944b6ad08a647ea9818aa846fea89601ece31" }, "objective-cpp": { sha256: "6afdca5beb7414f0861cf8b02d688356b60705b4fb3bba793b70b1519f097eb9" }, ocaml: { sha256: "663942ddd7e33be24edf4dd2029642e171a54bb42aeb3074b542fa2b67410a7b" }, odin: { sha256: "547d78475dbe5677c9caf6e6d32701dd9bdf4541eb61a0107d7d87329b8e4c01" }, openscad: { sha256: "9f997b66068ccd2df78a692dbd0d6b1ade1080dfa97dbca235a828626fa5ac04" }, org: { sha256: "776225e588c8e91e28afcb1eb68b50b35a26f73c2828b7478044e19f5654e1c1", embedded: ["javascript", "typescript", "tsx", "java", "python", "regexp", "css", "lua", "ini", "make", "perl", "r", "ruby", "php", "sql", "vb", "clojure", "coffee", "c", "cpp", "objective-c", "diff", "docker", "go", "groovy", "less", "scss", "raku", "rust", "scala", "shellscript", "csharp", "dart", "nim", "elixir", "erlang", "ocaml", "zig", "yaml", "json", "xml", "xsl", "markdown", "html", "git-commit", "git-rebase", "latex"] }, pascal: { sha256: "a7fb5cdb176b58d998c4af0eb61976c2d487201e2691fc2b3cedbb6e2ed1b7a1" }, perl: { sha256: "f13691f0d72752898f390d2dfbf014a43abe493995140986562e91ed99693688", embedded: ["html", "xml", "css", "javascript", "sql"] }, php: { sha256: "f2981c0553e5c0b95f11cc5d2435d6022fcf3bf0a2179c4e52407e8b61d7089f", embedded: ["html", "xml", "sql", "javascript", "json", "css"] }, pkl: { sha256: "7bd32ba65e24636ac96bbc382eff195c61ef2774db9f30843b4e8dc9f891b479" }, plsql: { sha256: "f1bda1268a547a0b588cc944f6685b94f585cdcf204e96509981d6d671acc09d" }, po: { sha256: "2e1303ec69fb38db11b1e18517b5ebb1c98361ce2a86c640620fab0db2266db1" }, polar: { sha256: "86403d6999b32c8ce513a64a578032b9d15dc54847109f8e92667d48ea187845" }, postcss: { sha256: "14e9809ba04f4ca03e8f05675f3e56dadfdfb5a4c12263d6935685baae064659" }, powerquery: { sha256: "e73f4b6e59ec522738180f7ac55e458963ecbad0cabe659679bb772d8a57fc9a" }, powershell: { sha256: "4e01664d850d278e259858fd436eb969aae620f70c4d925ffe3c8d0a188c1479" }, prisma: { sha256: "cb83788493581bebd52594eb6f7a7b66edfc869dbc099c1c42e4e655ba42cbd1" }, prolog: { sha256: "490a5743f8a293cd0bb18db7a79701837869f84595520abc04c01f69fbcd9ffc" }, proto: { sha256: "61d8dbdaf915b9628ce53f13e0d467c95db1b263edc827dfd2499745d7f0f9fc" }, pug: { sha256: "98b0c9fe3464e55029a964658a6a701022957df0391006248ae857bc82b96174", embedded: ["javascript", "css", "sass", "scss", "stylus", "coffee", "html"], lazy: ["sass", "scss", "stylus", "coffee"] }, puppet: { sha256: "6e7a8494e4b619a4efc2018ac86121e816c1e2631fed7eafc0a8beb6aa84fb67" }, purescript: { sha256: "b18d2ab9e7a31d3c1d453fd6f585786f65f6044743f5b0cad7f6867ee2f41340" }, python: { sha256: "8b6b4cb21cce413b2f764ef6b71dfae059a77433530f9dd77ea9b5a53af1ee35" }, qml: { sha256: "51471372dd6d2fbe5f08d26b7100b7b5ae8890560b6b9f21c48deb0cc6316972", embedded: ["javascript"] }, qmldir: { sha256: "dc22b0d9a691e863ffe3ba9ccb32ab7343eb62bb0db537005353d0569974659c" }, qss: { sha256: "d1e706c75c490163dee96ff70e12cebb656dc4a52cc8ef77c15cc9a12440e09b" }, r: { sha256: "87050d7d24035c6d7bc5c7b409e134f85d1dcaf2a5f08ef532fe1e25491c47de" }, racket: { sha256: "f1c7ab4fe54e0b57f22afe4978c1b2dbea5bba4f9c06b2256a35a15a87bd9d56" }, raku: { sha256: "30014c56087f97be1c4732dd86ac845d521de27b54264bc205d01d86ee6bfd50" }, razor: { sha256: "e094c40aa157fb020ee9204de9661370cd0851a4c56b30bd19344707ae29f279", embedded: ["html", "csharp"] }, rbs: { sha256: "198654ecccaa8c7bb2b27e86f24d55eb14e8c5d24a72f2f56caa8437f3cbb579" }, reg: { sha256: "88bdcd8fea9759d67beae18d7f6255a8c66dd2aebaf48f3a18cf2af110bc75f3" }, regexp: { sha256: "87b56f94dc703cea1cd330d4cd088e4944d8df4358b235f2ae867cfb14143f2d" }, rel: { sha256: "8ac2d6f1f12c13ec1c6f9e3a641d569fbc51c7ee88579c5d322ceec81a88b002" }, riscv: { sha256: "edd55d53350f5f34c37278d75c23c1dcb36dbea5d5c039d4923513c5df88b2f2" }, ron: { sha256: "0862776e3d701003f381f7877e096a4ccc16fe190e492ac78f80b53b6ee2e72c" }, rosmsg: { sha256: "2997167030755ea64c7e88d79241864d1b87d19b1a7886df3b2d20eee2107d62" }, rst: { sha256: "0de16f7839b2057fda5d59bf9c973185e5d596381d779e60131a350fc6d7620b", embedded: ["html-derivative", "cpp", "python", "javascript", "shellscript", "yaml", "cmake", "ruby"] }, ruby: { sha256: "ff3e48c0958a75e6bbc794978083320f761c9bc3cfe20a6435f479c7be4c78b0", embedded: ["html", "haml", "xml", "sql", "graphql", "css", "cpp", "c", "javascript", "shellscript", "lua", "yaml"] }, rust: { sha256: "e6ecf805e26ea7db8f32dfca38afcf19192cc45c942f7cedfff33889183c548d" }, sas: { sha256: "730592dc6a79b52f65731e083e3228ea5f694a0465155648b5970b43957059e9", embedded: ["sql"] }, sass: { sha256: "17504b4f319ae6ac8b1e137754bcde9ed6c0be6de46082999aa57467d3bd7fc8" }, scala: { sha256: "ac7c4f2cc8b0f79e975048eefb40751ed6435727cac6dd4df07ce949436b1df5" }, scheme: { sha256: "14620ef4a000f89a39f9e6c53301abbb231b686d8b4fc089f2a91ed6d494e4d4" }, scss: { sha256: "35977f043318d4877b31e40064d90028bfeb085e240e72ae0defa167346112bf", embedded: ["css"] }, sdbl: { sha256: "02add596f17115e7bbf80764f2981e135e3b7a6737e985ae34a6128b3dd08ada" }, shaderlab: { sha256: "a1173a39c7ac3b5376606c1457f287a6d42c5c39cf7942fbcc9a97b3ed5fe9a3", embedded: ["hlsl"] }, shellscript: { sha256: "f9a7ca3def50407b4500311cc47275295f6a2d3f9f683f1f0accc3056f0e4cc8" }, shellsession: { sha256: "0a19fe818f6021a6ffdd6768d35c33cc9469deeab9adcc6754039f71e1f39ef4", embedded: ["shellscript"] }, smalltalk: { sha256: "f557c22367520ded3fd0c296e124f3a2f56466a2e12dff9bf38273b97c1d87cf" }, smithy: { sha256: "cb8a779be9c53ab1f14a86ba8a5f1c068a9014351ac0d78c3ff11a138d5b2ae1" }, solidity: { sha256: "3b8236fbb32ac373e43629032d477e773e76f3d5d262090e824c3d9b42d0deab" }, soy: { sha256: "56901c68e495d7d2c96d6da6ca5e9aed7c50c12352102373d17d657590284ae3", embedded: ["html"] }, sparql: { sha256: "27cd16ef126d0fe2567d8b86128f54d4c33a155225742fb2c6a490b8f254aa19", embedded: ["turtle"] }, splunk: { sha256: "3f7a7a37dc07e259eb0c15b8d201b2f0d8fc4d32a6d911a6d0d20f7e93b541fa" }, sql: { sha256: "a79bd625f928c0c2297ee4d96248b30c357e7c33aba8d6cb8d41d6ae801c8758" }, "ssh-config": { sha256: "067252a98779c19bef2fe1a507994ee4c28965659b4276afea269f6bd43e7523" }, stata: { sha256: "cee50b9b4cad9f9f1a4685384ae7869a2b445e76c5ffa7381a6844827ee6a3cc", embedded: ["sql"] }, stylus: { sha256: "39d238fe3c42cd48f150dc0f21bc92beee534585f7026e5b1ef4c445ba797045" }, surrealql: { sha256: "889e98d5adcb1cbe88ef1a8fa12210c1af5923208eaf849916a1037b31ecc196", embedded: ["javascript"] }, svelte: { sha256: "cf6fdcd8f16b676bee9d727e661718a6e3b7ac4722c13987d94db551a7d183d5", embedded: ["javascript", "typescript", "coffee", "stylus", "sass", "css", "scss", "less", "postcss", "pug", "markdown"], lazy: ["coffee", "stylus", "sass", "scss", "less", "pug", "markdown"] }, swift: { sha256: "1bb401139dda5ef99bc39dc1719ffeefcb3ba4c2ad6a72457e2b3ff8248e86f9" }, "system-verilog": { sha256: "26b3ef7f1bbe16faff89f8059e590667078628fdccb641ca3c02b35082bd265e" }, systemd: { sha256: "6bc98263dec1c7365221ab9488b2dc547f06f2997b195db91c2c1e922913b123" }, talonscript: { sha256: "281d25bf296a66728878265b732d01d0d7fd06e1aecdb2c69a52b945d5994c03" }, tasl: { sha256: "e8d2ce8082be37c7021bf5a173e5ae277143ddb64050bb8ad703a282c13fa205" }, tcl: { sha256: "3abed0f91139705027c0fbfbf0e977ed3550a191b68a53e93ec0199f34fc08e5" }, templ: { sha256: "8e4d5ba677ec70c2376d672a1523e45ac716b77591b6b23894f7cb22d85cc2a9", embedded: ["go", "javascript", "css"] }, terraform: { sha256: "3c4984f932c6c9d672505b737e75fb6612b1849ca32cffd62efaf731babb6c6e" }, tex: { sha256: "5a6795ecb5dcc0bccc65ed86b9beebbd1410c80fc92e325041ba974fe6f19b77", embedded: ["r"] }, toml: { sha256: "d54ac615bfbf5d7f05c11723cf145470f74ea8cc59bb7b2a20e598d0abf92d08" }, "ts-tags": { sha256: "4868de0363ce6bedfd18b7f1e70578c3a6c7eef87a05091ebcd0c125e1470a92", embedded: ["typescript", "es-tag-css", "es-tag-glsl", "es-tag-html", "es-tag-sql", "es-tag-xml"] }, tsv: { sha256: "16ecf93386f646cdb792c5cde49ce05ed397ca9e5eb55bfa262943dc43f62fc5" }, tsx: { sha256: "367120b5adb2fe51f4c4b3edcab86e569e5a1e2a6c3652e318ba52281033fddd" }, turtle: { sha256: "554934a49f95ae4be3e607de5c645c0929dda389a4683a3e62634caacb52fa0d" }, twig: { sha256: "ef429919b88bb9da5fcc40188c40d51611a4fb21571b69e53593d48f0077e5da", embedded: ["javascript", "css", "scss", "php", "python", "ruby"] }, typescript: { sha256: "e86e45f551919f50ac5e5cf89990c3520877305b35708294de5ae83c9b6ca559" }, typespec: { sha256: "23ace3084f239c237574e53e53b31e8267859422d5360aa65860010d3176c886" }, typst: { sha256: "5cc026431ee28ba576cd67fbdea31b5bf9de6bc4de6c08dd34f642e3b03a55f7", embedded: ["bat", "bibtex", "c", "clojure", "coffee", "cpp", "css", "csharp", "dart", "diff", "docker", "elixir", "erlang", "fsharp", "git-commit", "git-rebase", "go", "groovy", "handlebars", "html", "ini", "java", "javascript", "jsonc", "json", "julia", "latex", "less", "log", "lua", "make", "markdown", "objective-c", "perl", "raku", "php", "powershell", "pug", "r", "regexp", "ruby", "scss", "sql", "swift", "xml", "xsl", "yaml", "python", "rust", "scala", "shellscript", "typescript", "tsx", "twig", "verilog", "system-verilog", "vb"] }, v: { sha256: "27e96ecd7a289dcfc9f474c110c8bc91d24ab156bd8ed15630bc6d236003cad0" }, vala: { sha256: "b4e9fbb5d6527685fd7eed19c4267a5af6105ed425b731bb55c08702fc01728d" }, vb: { sha256: "f69b366bee20af30507108d1e4ebf1844114084ea8af19fa704dc011081ba0d5" }, verilog: { sha256: "b82b36604f451426f04efe26f6d83ca27e2f2b6eae8fb3c2ac9beef316bfdfff" }, vhdl: { sha256: "36eb1d1977150f0c4b8d2eaf5c5cc80a3c1089c5f66d2518f79850fb74e302bf" }, viml: { sha256: "56bd0d022416dd0458949fd36ea0e35fb63c049cb8f597c7b77f2f41e660b43d" }, vue: { sha256: "86b4d7e883cb346849cce467711eb100695d8ab029481f3e1e82e30626c8a185", embedded: ["markdown", "pug", "stylus", "sass", "css", "scss", "less", "javascript", "typescript", "jsx", "tsx", "coffee", "json", "jsonc", "json5", "yaml", "toml", "graphql", "html", "html-derivative", "markdown-vue", "vue-directives", "vue-interpolations", "vue-sfc-style-variable-injection"], lazy: ["markdown", "pug", "stylus", "sass", "scss", "less", "jsx", "tsx", "coffee", "jsonc", "json5", "yaml", "toml", "graphql"] }, "vue-html": { sha256: "c01bbff38118975292729762527dfd3f68cc67ddf4886a3b51675acc24bfd958", embedded: ["javascript"] }, "vue-vine": { sha256: "6a5274d61e01a5928e4b496613b4be72cf835eac3c5c64bbbaff15219598cae7", embedded: ["css", "scss", "less", "stylus", "postcss", "javascript"] }, vyper: { sha256: "4c34391c19b7cd5ee8da086e13435b1c0577c0dc7fc8fb45b4ee2a8d3b78fb70" }, wasm: { sha256: "6609162d75e0569dd829b754675695ecb5c02fd27fb290a42f4e8aed6c5197b4" }, wenyan: { sha256: "8bc2aaa23401eb0720eb0eb1d2be0a7b52a1ee78e396a66d394f3d684d2f8623" }, wgsl: { sha256: "7b5f275146ead9da3d0ff8c9bd0a72cc898060c55aa872357fb21cbabbf76aa7" }, wikitext: { sha256: "86dba29565e8a2697a9d7befc6587b1c8b10c742096fa1a9b9f1d9725d2dcaf7", embedded: ["html", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "go", "groovy", "pug", "javascript", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "rust", "scala", "shellscript", "typescript", "csharp", "fsharp", "dart", "handlebars", "markdown", "erlang", "elixir", "latex", "bibtex", "json"], lazy: ["html", "css", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "go", "groovy", "pug", "javascript", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "julia", "rust", "scala", "shellscript", "typescript", "csharp", "fsharp", "dart", "handlebars", "markdown", "erlang", "elixir", "latex", "bibtex", "json"] }, wit: { sha256: "c23035ea7b269b51f9bce46732cc7016185b3e825302e2b2c3d4145e85bd7b4c" }, wolfram: { sha256: "8601f9148462061df5cb1c22714314ca4244ae78a93fef44ae8a0d984f3db27a" }, xml: { sha256: "4432e3aa5974256559326a692830cc5b375a21aac895de739e8b0a73a396edf6", embedded: ["java"] }, xsl: { sha256: "bda17f37f2f316482c6d85a9edd4c36819c101904f0de2bdcad0db44b949fdd4", embedded: ["xml"] }, yaml: { sha256: "960c376ae415e3258da44b8afe603828c919a2d6efbf8072b26b744246116542" }, zenscript: { sha256: "9794c14bd839a6dfe19274c89bd5d8c3e4d3d99359e0cae55e7175fb4e4095d7" }, zig: { sha256: "109b561fe38adb2bf9961089e42212ed27e160ab4178dfb5ec4c377cbe2a402f" }, "angular-expression": { sha256: "0fc8f4c158dccc522d0ad27153e5e63aa4d26f733c25bd54bebb87309f9d9da8" }, "angular-inline-style": { sha256: "733ce2509055659080e36ad58d83eb057242ea8ed7ede118696cc270e7d7e866", embedded: ["scss"] }, "angular-inline-template": { sha256: "23eeb4a08a3f67a9d40d09a327a8a43621ab054c6fb45eea8eb0ee05b7edd517", embedded: ["angular-html", "angular-template"] }, "angular-let-declaration": { sha256: "d68fe60f06ddfbeaeef3168c66999cc5d986668bd489d5783ff2e95d24489005", embedded: ["angular-expression"] }, "angular-template": { sha256: "67dbbdbb936ff0e9f5fb8cadefc0c33984369872576f45ee13685ec2316a84b5", embedded: ["angular-expression"] }, "angular-template-blocks": { sha256: "0dbb6a2872a8ea633687db4bb8e5a75064a78fb3628ae809a296920abd4b0615", embedded: ["angular-expression", "angular-template"] }, "cpp-macro": { sha256: "02e157a7c1a96d98a3c8d3b3f3f33719886410de3a6fdbd6e05826ce2987a7e5", embedded: ["regexp", "glsl"] }, "es-tag-css": { sha256: "e7ab773b39220851de32dd949cd2d875f9acc49914401b729a0bea0fff9027b4", embedded: ["typescript", "css", "javascript"] }, "es-tag-glsl": { sha256: "f7475721a2c19e907b97146ef9153ecba8fc948432e0ec203539ca9b6a0288ed", embedded: ["typescript", "glsl", "javascript"] }, "es-tag-html": { sha256: "e5e5d8b20bc4ac5a022f3cd541d6ca4de49867e9b845fb8e0db7fc84f5009107", embedded: ["typescript", "html", "javascript"] }, "es-tag-sql": { sha256: "dbf6329640c027e24a918c76a45463185230b0d7b690352a437d0bd6a15a22a0", embedded: ["typescript", "sql"] }, "es-tag-xml": { sha256: "ee89cadce96b92902cf8bd25ca50c26d0b1db92636c76365504433c6b2a96db9", embedded: ["xml"] }, "jinja-html": { sha256: "6e2c5dff69a40d21cecc2dda253bd453fb96e9d1259294fa1a0052978e429632", embedded: ["html"] }, "markdown-nix": { sha256: "3112dca736910793b9fbe583de8d0159873d3b96fa78f766b43db2fbc2d62199" }, "markdown-vue": { sha256: "90267df7bb8adc7cc8a9e9dc379f3b7e53f4f5547c80c534c64cb613a05355c2" }, "vue-directives": { sha256: "9bb72cafd98da0395423779319c2bb696063c30dd4cbd2219d30db1be3d86593" }, "vue-interpolations": { sha256: "2397d16983e9cc60afcb239833b5ed35c9e48369d435642eff0fc3e64235465e" }, "vue-sfc-style-variable-injection": { sha256: "4cf171a65bc6c036ed0d26c7c36c3984a33a57ee9aa6d492905aac21dbc2fa0b", embedded: ["javascript"] } } };

// src/highlight-worker.ts
import crypto from "node:crypto";
import fs from "node:fs";
import path2 from "node:path";
import { parentPort } from "node:worker_threads";

// node_modules/@shikijs/types/dist/index.mjs
var ShikiError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ShikiError";
  }
};

// node_modules/@shikijs/vscode-textmate/dist/index.js
function clone(something) {
  return doClone(something);
}
function doClone(something) {
  if (Array.isArray(something)) {
    return cloneArray(something);
  }
  if (something instanceof RegExp) {
    return something;
  }
  if (typeof something === "object") {
    return cloneObj(something);
  }
  return something;
}
function cloneArray(arr) {
  let r4 = [];
  for (let i2 = 0, len = arr.length; i2 < len; i2++) {
    r4[i2] = doClone(arr[i2]);
  }
  return r4;
}
function cloneObj(obj) {
  let r4 = {};
  for (let key2 in obj) {
    r4[key2] = doClone(obj[key2]);
  }
  return r4;
}
function mergeObjects(target, ...sources) {
  sources.forEach((source2) => {
    for (let key2 in source2) {
      target[key2] = source2[key2];
    }
  });
  return target;
}
function basename(path3) {
  const idx = ~path3.lastIndexOf("/") || ~path3.lastIndexOf("\\");
  if (idx === 0) {
    return path3;
  } else if (~idx === path3.length - 1) {
    return basename(path3.substring(0, path3.length - 1));
  } else {
    return path3.substr(~idx + 1);
  }
}
var CAPTURING_REGEX_SOURCE = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;
var RegexSource = class {
  static hasCaptures(regexSource) {
    if (regexSource === null) {
      return false;
    }
    CAPTURING_REGEX_SOURCE.lastIndex = 0;
    return CAPTURING_REGEX_SOURCE.test(regexSource);
  }
  static replaceCaptures(regexSource, captureSource, captureIndices) {
    return regexSource.replace(CAPTURING_REGEX_SOURCE, (match, index, commandIndex, command) => {
      let capture = captureIndices[parseInt(index || commandIndex, 10)];
      if (capture) {
        let result = captureSource.substring(capture.start, capture.end);
        while (result[0] === ".") {
          result = result.substring(1);
        }
        switch (command) {
          case "downcase":
            return result.toLowerCase();
          case "upcase":
            return result.toUpperCase();
          default:
            return result;
        }
      } else {
        return match;
      }
    });
  }
};
function strcmp(a2, b3) {
  if (a2 < b3) {
    return -1;
  }
  if (a2 > b3) {
    return 1;
  }
  return 0;
}
function strArrCmp(a2, b3) {
  if (a2 === null && b3 === null) {
    return 0;
  }
  if (!a2) {
    return -1;
  }
  if (!b3) {
    return 1;
  }
  let len1 = a2.length;
  let len2 = b3.length;
  if (len1 === len2) {
    for (let i2 = 0; i2 < len1; i2++) {
      let res = strcmp(a2[i2], b3[i2]);
      if (res !== 0) {
        return res;
      }
    }
    return 0;
  }
  return len1 - len2;
}
function isValidHexColor(hex) {
  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    return true;
  }
  if (/^#[0-9a-f]{8}$/i.test(hex)) {
    return true;
  }
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return true;
  }
  if (/^#[0-9a-f]{4}$/i.test(hex)) {
    return true;
  }
  return false;
}
function escapeRegExpCharacters(value) {
  return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
}
var CachedFn = class {
  constructor(fn) {
    this.fn = fn;
  }
  fn;
  cache = /* @__PURE__ */ new Map();
  get(key2) {
    if (this.cache.has(key2)) {
      return this.cache.get(key2);
    }
    const value = this.fn(key2);
    this.cache.set(key2, value);
    return value;
  }
};
var Theme = class {
  constructor(_colorMap, _defaults, _root) {
    this._colorMap = _colorMap;
    this._defaults = _defaults;
    this._root = _root;
  }
  _colorMap;
  _defaults;
  _root;
  static createFromRawTheme(source2, colorMap) {
    return this.createFromParsedTheme(parseTheme(source2), colorMap);
  }
  static createFromParsedTheme(source2, colorMap) {
    return resolveParsedThemeRules(source2, colorMap);
  }
  _cachedMatchRoot = new CachedFn(
    (scopeName) => this._root.match(scopeName)
  );
  getColorMap() {
    return this._colorMap.getColorMap();
  }
  getDefaults() {
    return this._defaults;
  }
  match(scopePath) {
    if (scopePath === null) {
      return this._defaults;
    }
    const scopeName = scopePath.scopeName;
    const matchingTrieElements = this._cachedMatchRoot.get(scopeName);
    const effectiveRule = matchingTrieElements.find(
      (v2) => _scopePathMatchesParentScopes(scopePath.parent, v2.parentScopes)
    );
    if (!effectiveRule) {
      return null;
    }
    return new StyleAttributes(
      effectiveRule.fontStyle,
      effectiveRule.foreground,
      effectiveRule.background
    );
  }
};
var ScopeStack = class _ScopeStack {
  constructor(parent, scopeName) {
    this.parent = parent;
    this.scopeName = scopeName;
  }
  parent;
  scopeName;
  static push(path3, scopeNames) {
    for (const name of scopeNames) {
      path3 = new _ScopeStack(path3, name);
    }
    return path3;
  }
  static from(...segments) {
    let result = null;
    for (let i2 = 0; i2 < segments.length; i2++) {
      result = new _ScopeStack(result, segments[i2]);
    }
    return result;
  }
  push(scopeName) {
    return new _ScopeStack(this, scopeName);
  }
  getSegments() {
    let item = this;
    const result = [];
    while (item) {
      result.push(item.scopeName);
      item = item.parent;
    }
    result.reverse();
    return result;
  }
  toString() {
    return this.getSegments().join(" ");
  }
  extends(other) {
    if (this === other) {
      return true;
    }
    if (this.parent === null) {
      return false;
    }
    return this.parent.extends(other);
  }
  getExtensionIfDefined(base) {
    const result = [];
    let item = this;
    while (item && item !== base) {
      result.push(item.scopeName);
      item = item.parent;
    }
    return item === base ? result.reverse() : void 0;
  }
};
function _scopePathMatchesParentScopes(scopePath, parentScopes) {
  if (parentScopes.length === 0) {
    return true;
  }
  for (let index = 0; index < parentScopes.length; index++) {
    let scopePattern = parentScopes[index];
    let scopeMustMatch = false;
    if (scopePattern === ">") {
      if (index === parentScopes.length - 1) {
        return false;
      }
      scopePattern = parentScopes[++index];
      scopeMustMatch = true;
    }
    while (scopePath) {
      if (_matchesScope(scopePath.scopeName, scopePattern)) {
        break;
      }
      if (scopeMustMatch) {
        return false;
      }
      scopePath = scopePath.parent;
    }
    if (!scopePath) {
      return false;
    }
    scopePath = scopePath.parent;
  }
  return true;
}
function _matchesScope(scopeName, scopePattern) {
  return scopePattern === scopeName || scopeName.startsWith(scopePattern) && scopeName[scopePattern.length] === ".";
}
var StyleAttributes = class {
  constructor(fontStyle, foregroundId, backgroundId) {
    this.fontStyle = fontStyle;
    this.foregroundId = foregroundId;
    this.backgroundId = backgroundId;
  }
  fontStyle;
  foregroundId;
  backgroundId;
};
function parseTheme(source2) {
  if (!source2) {
    return [];
  }
  if (!source2.settings || !Array.isArray(source2.settings)) {
    return [];
  }
  let settings = source2.settings;
  let result = [], resultLen = 0;
  for (let i2 = 0, len = settings.length; i2 < len; i2++) {
    let entry = settings[i2];
    if (!entry.settings) {
      continue;
    }
    let scopes;
    if (typeof entry.scope === "string") {
      let _scope = entry.scope;
      _scope = _scope.replace(/^[,]+/, "");
      _scope = _scope.replace(/[,]+$/, "");
      scopes = _scope.split(",");
    } else if (Array.isArray(entry.scope)) {
      scopes = entry.scope;
    } else {
      scopes = [""];
    }
    let fontStyle = -1;
    if (typeof entry.settings.fontStyle === "string") {
      fontStyle = 0;
      let segments = entry.settings.fontStyle.split(" ");
      for (let j2 = 0, lenJ = segments.length; j2 < lenJ; j2++) {
        let segment = segments[j2];
        switch (segment) {
          case "italic":
            fontStyle = fontStyle | 1;
            break;
          case "bold":
            fontStyle = fontStyle | 2;
            break;
          case "underline":
            fontStyle = fontStyle | 4;
            break;
          case "strikethrough":
            fontStyle = fontStyle | 8;
            break;
        }
      }
    }
    let foreground = null;
    if (typeof entry.settings.foreground === "string" && isValidHexColor(entry.settings.foreground)) {
      foreground = entry.settings.foreground;
    }
    let background = null;
    if (typeof entry.settings.background === "string" && isValidHexColor(entry.settings.background)) {
      background = entry.settings.background;
    }
    for (let j2 = 0, lenJ = scopes.length; j2 < lenJ; j2++) {
      let _scope = scopes[j2].trim();
      let segments = _scope.split(" ");
      let scope = segments[segments.length - 1];
      let parentScopes = null;
      if (segments.length > 1) {
        parentScopes = segments.slice(0, segments.length - 1);
        parentScopes.reverse();
      }
      result[resultLen++] = new ParsedThemeRule(
        scope,
        parentScopes,
        i2,
        fontStyle,
        foreground,
        background
      );
    }
  }
  return result;
}
var ParsedThemeRule = class {
  constructor(scope, parentScopes, index, fontStyle, foreground, background) {
    this.scope = scope;
    this.parentScopes = parentScopes;
    this.index = index;
    this.fontStyle = fontStyle;
    this.foreground = foreground;
    this.background = background;
  }
  scope;
  parentScopes;
  index;
  fontStyle;
  foreground;
  background;
};
var FontStyle = /* @__PURE__ */ ((FontStyle2) => {
  FontStyle2[FontStyle2["NotSet"] = -1] = "NotSet";
  FontStyle2[FontStyle2["None"] = 0] = "None";
  FontStyle2[FontStyle2["Italic"] = 1] = "Italic";
  FontStyle2[FontStyle2["Bold"] = 2] = "Bold";
  FontStyle2[FontStyle2["Underline"] = 4] = "Underline";
  FontStyle2[FontStyle2["Strikethrough"] = 8] = "Strikethrough";
  return FontStyle2;
})(FontStyle || {});
function resolveParsedThemeRules(parsedThemeRules, _colorMap) {
  parsedThemeRules.sort((a2, b3) => {
    let r4 = strcmp(a2.scope, b3.scope);
    if (r4 !== 0) {
      return r4;
    }
    r4 = strArrCmp(a2.parentScopes, b3.parentScopes);
    if (r4 !== 0) {
      return r4;
    }
    return a2.index - b3.index;
  });
  let defaultFontStyle = 0;
  let defaultForeground = "#000000";
  let defaultBackground = "#ffffff";
  while (parsedThemeRules.length >= 1 && parsedThemeRules[0].scope === "") {
    let incomingDefaults = parsedThemeRules.shift();
    if (incomingDefaults.fontStyle !== -1) {
      defaultFontStyle = incomingDefaults.fontStyle;
    }
    if (incomingDefaults.foreground !== null) {
      defaultForeground = incomingDefaults.foreground;
    }
    if (incomingDefaults.background !== null) {
      defaultBackground = incomingDefaults.background;
    }
  }
  let colorMap = new ColorMap(_colorMap);
  let defaults = new StyleAttributes(defaultFontStyle, colorMap.getId(defaultForeground), colorMap.getId(defaultBackground));
  let root2 = new ThemeTrieElement(new ThemeTrieElementRule(0, null, -1, 0, 0), []);
  for (let i2 = 0, len = parsedThemeRules.length; i2 < len; i2++) {
    let rule = parsedThemeRules[i2];
    root2.insert(0, rule.scope, rule.parentScopes, rule.fontStyle, colorMap.getId(rule.foreground), colorMap.getId(rule.background));
  }
  return new Theme(colorMap, defaults, root2);
}
var ColorMap = class {
  _isFrozen;
  _lastColorId;
  _id2color;
  _color2id;
  constructor(_colorMap) {
    this._lastColorId = 0;
    this._id2color = [];
    this._color2id = /* @__PURE__ */ Object.create(null);
    if (Array.isArray(_colorMap)) {
      this._isFrozen = true;
      for (let i2 = 0, len = _colorMap.length; i2 < len; i2++) {
        this._color2id[_colorMap[i2]] = i2;
        this._id2color[i2] = _colorMap[i2];
      }
    } else {
      this._isFrozen = false;
    }
  }
  getId(color) {
    if (color === null) {
      return 0;
    }
    color = color.toUpperCase();
    let value = this._color2id[color];
    if (value) {
      return value;
    }
    if (this._isFrozen) {
      throw new Error(`Missing color in color map - ${color}`);
    }
    value = ++this._lastColorId;
    this._color2id[color] = value;
    this._id2color[value] = color;
    return value;
  }
  getColorMap() {
    return this._id2color.slice(0);
  }
};
var emptyParentScopes = Object.freeze([]);
var ThemeTrieElementRule = class _ThemeTrieElementRule {
  scopeDepth;
  parentScopes;
  fontStyle;
  foreground;
  background;
  constructor(scopeDepth, parentScopes, fontStyle, foreground, background) {
    this.scopeDepth = scopeDepth;
    this.parentScopes = parentScopes || emptyParentScopes;
    this.fontStyle = fontStyle;
    this.foreground = foreground;
    this.background = background;
  }
  clone() {
    return new _ThemeTrieElementRule(this.scopeDepth, this.parentScopes, this.fontStyle, this.foreground, this.background);
  }
  static cloneArr(arr) {
    let r4 = [];
    for (let i2 = 0, len = arr.length; i2 < len; i2++) {
      r4[i2] = arr[i2].clone();
    }
    return r4;
  }
  acceptOverwrite(scopeDepth, fontStyle, foreground, background) {
    if (this.scopeDepth > scopeDepth) {
      console.log("how did this happen?");
    } else {
      this.scopeDepth = scopeDepth;
    }
    if (fontStyle !== -1) {
      this.fontStyle = fontStyle;
    }
    if (foreground !== 0) {
      this.foreground = foreground;
    }
    if (background !== 0) {
      this.background = background;
    }
  }
};
var ThemeTrieElement = class _ThemeTrieElement {
  constructor(_mainRule, rulesWithParentScopes = [], _children = {}) {
    this._mainRule = _mainRule;
    this._children = _children;
    this._rulesWithParentScopes = rulesWithParentScopes;
  }
  _mainRule;
  _children;
  _rulesWithParentScopes;
  static _cmpBySpecificity(a2, b3) {
    if (a2.scopeDepth !== b3.scopeDepth) {
      return b3.scopeDepth - a2.scopeDepth;
    }
    let aParentIndex = 0;
    let bParentIndex = 0;
    while (true) {
      if (a2.parentScopes[aParentIndex] === ">") {
        aParentIndex++;
      }
      if (b3.parentScopes[bParentIndex] === ">") {
        bParentIndex++;
      }
      if (aParentIndex >= a2.parentScopes.length || bParentIndex >= b3.parentScopes.length) {
        break;
      }
      const parentScopeLengthDiff = b3.parentScopes[bParentIndex].length - a2.parentScopes[aParentIndex].length;
      if (parentScopeLengthDiff !== 0) {
        return parentScopeLengthDiff;
      }
      aParentIndex++;
      bParentIndex++;
    }
    return b3.parentScopes.length - a2.parentScopes.length;
  }
  match(scope) {
    if (scope !== "") {
      let dotIndex = scope.indexOf(".");
      let head2;
      let tail;
      if (dotIndex === -1) {
        head2 = scope;
        tail = "";
      } else {
        head2 = scope.substring(0, dotIndex);
        tail = scope.substring(dotIndex + 1);
      }
      if (this._children.hasOwnProperty(head2)) {
        return this._children[head2].match(tail);
      }
    }
    const rules = this._rulesWithParentScopes.concat(this._mainRule);
    rules.sort(_ThemeTrieElement._cmpBySpecificity);
    return rules;
  }
  insert(scopeDepth, scope, parentScopes, fontStyle, foreground, background) {
    if (scope === "") {
      this._doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background);
      return;
    }
    let dotIndex = scope.indexOf(".");
    let head2;
    let tail;
    if (dotIndex === -1) {
      head2 = scope;
      tail = "";
    } else {
      head2 = scope.substring(0, dotIndex);
      tail = scope.substring(dotIndex + 1);
    }
    let child;
    if (this._children.hasOwnProperty(head2)) {
      child = this._children[head2];
    } else {
      child = new _ThemeTrieElement(this._mainRule.clone(), ThemeTrieElementRule.cloneArr(this._rulesWithParentScopes));
      this._children[head2] = child;
    }
    child.insert(scopeDepth + 1, tail, parentScopes, fontStyle, foreground, background);
  }
  _doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background) {
    if (parentScopes === null) {
      this._mainRule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
      return;
    }
    for (let i2 = 0, len = this._rulesWithParentScopes.length; i2 < len; i2++) {
      let rule = this._rulesWithParentScopes[i2];
      if (strArrCmp(rule.parentScopes, parentScopes) === 0) {
        rule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
        return;
      }
    }
    if (fontStyle === -1) {
      fontStyle = this._mainRule.fontStyle;
    }
    if (foreground === 0) {
      foreground = this._mainRule.foreground;
    }
    if (background === 0) {
      background = this._mainRule.background;
    }
    this._rulesWithParentScopes.push(new ThemeTrieElementRule(scopeDepth, parentScopes, fontStyle, foreground, background));
  }
};
var EncodedTokenMetadata = class _EncodedTokenMetadata {
  static toBinaryStr(encodedTokenAttributes) {
    return encodedTokenAttributes.toString(2).padStart(32, "0");
  }
  static print(encodedTokenAttributes) {
    const languageId = _EncodedTokenMetadata.getLanguageId(encodedTokenAttributes);
    const tokenType = _EncodedTokenMetadata.getTokenType(encodedTokenAttributes);
    const fontStyle = _EncodedTokenMetadata.getFontStyle(encodedTokenAttributes);
    const foreground = _EncodedTokenMetadata.getForeground(encodedTokenAttributes);
    const background = _EncodedTokenMetadata.getBackground(encodedTokenAttributes);
    console.log({
      languageId,
      tokenType,
      fontStyle,
      foreground,
      background
    });
  }
  static getLanguageId(encodedTokenAttributes) {
    return (encodedTokenAttributes & 255) >>> 0;
  }
  static getTokenType(encodedTokenAttributes) {
    return (encodedTokenAttributes & 768) >>> 8;
  }
  static containsBalancedBrackets(encodedTokenAttributes) {
    return (encodedTokenAttributes & 1024) !== 0;
  }
  static getFontStyle(encodedTokenAttributes) {
    return (encodedTokenAttributes & 30720) >>> 11;
  }
  static getForeground(encodedTokenAttributes) {
    return (encodedTokenAttributes & 16744448) >>> 15;
  }
  static getBackground(encodedTokenAttributes) {
    return (encodedTokenAttributes & 4278190080) >>> 24;
  }
  /**
   * Updates the fields in `metadata`.
   * A value of `0`, `NotSet` or `null` indicates that the corresponding field should be left as is.
   */
  static set(encodedTokenAttributes, languageId, tokenType, containsBalancedBrackets, fontStyle, foreground, background) {
    let _languageId = _EncodedTokenMetadata.getLanguageId(encodedTokenAttributes);
    let _tokenType = _EncodedTokenMetadata.getTokenType(encodedTokenAttributes);
    let _containsBalancedBracketsBit = _EncodedTokenMetadata.containsBalancedBrackets(encodedTokenAttributes) ? 1 : 0;
    let _fontStyle = _EncodedTokenMetadata.getFontStyle(encodedTokenAttributes);
    let _foreground = _EncodedTokenMetadata.getForeground(encodedTokenAttributes);
    let _background = _EncodedTokenMetadata.getBackground(encodedTokenAttributes);
    if (languageId !== 0) {
      _languageId = languageId;
    }
    if (tokenType !== 8) {
      _tokenType = fromOptionalTokenType(tokenType);
    }
    if (containsBalancedBrackets !== null) {
      _containsBalancedBracketsBit = containsBalancedBrackets ? 1 : 0;
    }
    if (fontStyle !== -1) {
      _fontStyle = fontStyle;
    }
    if (foreground !== 0) {
      _foreground = foreground;
    }
    if (background !== 0) {
      _background = background;
    }
    return (_languageId << 0 | _tokenType << 8 | _containsBalancedBracketsBit << 10 | _fontStyle << 11 | _foreground << 15 | _background << 24) >>> 0;
  }
};
function toOptionalTokenType(standardType) {
  return standardType;
}
function fromOptionalTokenType(standardType) {
  return standardType;
}
function createMatchers(selector, matchesName) {
  const results = [];
  const tokenizer = newTokenizer(selector);
  let token2 = tokenizer.next();
  while (token2 !== null) {
    let priority = 0;
    if (token2.length === 2 && token2.charAt(1) === ":") {
      switch (token2.charAt(0)) {
        case "R":
          priority = 1;
          break;
        case "L":
          priority = -1;
          break;
        default:
          console.log(`Unknown priority ${token2} in scope selector`);
      }
      token2 = tokenizer.next();
    }
    let matcher = parseConjunction();
    results.push({ matcher, priority });
    if (token2 !== ",") {
      break;
    }
    token2 = tokenizer.next();
  }
  return results;
  function parseOperand() {
    if (token2 === "-") {
      token2 = tokenizer.next();
      const expressionToNegate = parseOperand();
      return (matcherInput) => !!expressionToNegate && !expressionToNegate(matcherInput);
    }
    if (token2 === "(") {
      token2 = tokenizer.next();
      const expressionInParents = parseInnerExpression();
      if (token2 === ")") {
        token2 = tokenizer.next();
      }
      return expressionInParents;
    }
    if (isIdentifier(token2)) {
      const identifiers = [];
      do {
        identifiers.push(token2);
        token2 = tokenizer.next();
      } while (isIdentifier(token2));
      return (matcherInput) => matchesName(identifiers, matcherInput);
    }
    return null;
  }
  function parseConjunction() {
    const matchers = [];
    let matcher = parseOperand();
    while (matcher) {
      matchers.push(matcher);
      matcher = parseOperand();
    }
    return (matcherInput) => matchers.every((matcher2) => matcher2(matcherInput));
  }
  function parseInnerExpression() {
    const matchers = [];
    let matcher = parseConjunction();
    while (matcher) {
      matchers.push(matcher);
      if (token2 === "|" || token2 === ",") {
        do {
          token2 = tokenizer.next();
        } while (token2 === "|" || token2 === ",");
      } else {
        break;
      }
      matcher = parseConjunction();
    }
    return (matcherInput) => matchers.some((matcher2) => matcher2(matcherInput));
  }
}
function isIdentifier(token2) {
  return !!token2 && !!token2.match(/[\w\.:]+/);
}
function newTokenizer(input) {
  let regex = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g;
  let match = regex.exec(input);
  return {
    next: () => {
      if (!match) {
        return null;
      }
      const res = match[0];
      match = regex.exec(input);
      return res;
    }
  };
}
function disposeOnigString(str) {
  if (typeof str.dispose === "function") {
    str.dispose();
  }
}
var TopLevelRuleReference = class {
  constructor(scopeName) {
    this.scopeName = scopeName;
  }
  scopeName;
  toKey() {
    return this.scopeName;
  }
};
var TopLevelRepositoryRuleReference = class {
  constructor(scopeName, ruleName) {
    this.scopeName = scopeName;
    this.ruleName = ruleName;
  }
  scopeName;
  ruleName;
  toKey() {
    return `${this.scopeName}#${this.ruleName}`;
  }
};
var ExternalReferenceCollector = class {
  _references = [];
  _seenReferenceKeys = /* @__PURE__ */ new Set();
  get references() {
    return this._references;
  }
  visitedRule = /* @__PURE__ */ new Set();
  add(reference) {
    const key2 = reference.toKey();
    if (this._seenReferenceKeys.has(key2)) {
      return;
    }
    this._seenReferenceKeys.add(key2);
    this._references.push(reference);
  }
};
var ScopeDependencyProcessor = class {
  constructor(repo, initialScopeName) {
    this.repo = repo;
    this.initialScopeName = initialScopeName;
    this.seenFullScopeRequests.add(this.initialScopeName);
    this.Q = [new TopLevelRuleReference(this.initialScopeName)];
  }
  repo;
  initialScopeName;
  seenFullScopeRequests = /* @__PURE__ */ new Set();
  seenPartialScopeRequests = /* @__PURE__ */ new Set();
  Q;
  processQueue() {
    const q2 = this.Q;
    this.Q = [];
    const deps = new ExternalReferenceCollector();
    for (const dep of q2) {
      collectReferencesOfReference(dep, this.initialScopeName, this.repo, deps);
    }
    for (const dep of deps.references) {
      if (dep instanceof TopLevelRuleReference) {
        if (this.seenFullScopeRequests.has(dep.scopeName)) {
          continue;
        }
        this.seenFullScopeRequests.add(dep.scopeName);
        this.Q.push(dep);
      } else {
        if (this.seenFullScopeRequests.has(dep.scopeName)) {
          continue;
        }
        if (this.seenPartialScopeRequests.has(dep.toKey())) {
          continue;
        }
        this.seenPartialScopeRequests.add(dep.toKey());
        this.Q.push(dep);
      }
    }
  }
};
function collectReferencesOfReference(reference, baseGrammarScopeName, repo, result) {
  const selfGrammar = repo.lookup(reference.scopeName);
  if (!selfGrammar) {
    if (reference.scopeName === baseGrammarScopeName) {
      throw new Error(`No grammar provided for <${baseGrammarScopeName}>`);
    }
    return;
  }
  const baseGrammar = repo.lookup(baseGrammarScopeName);
  if (reference instanceof TopLevelRuleReference) {
    collectExternalReferencesInTopLevelRule({ baseGrammar, selfGrammar }, result);
  } else {
    collectExternalReferencesInTopLevelRepositoryRule(
      reference.ruleName,
      { baseGrammar, selfGrammar, repository: selfGrammar.repository },
      result
    );
  }
  const injections = repo.injections(reference.scopeName);
  if (injections) {
    for (const injection of injections) {
      result.add(new TopLevelRuleReference(injection));
    }
  }
}
function collectExternalReferencesInTopLevelRepositoryRule(ruleName, context, result) {
  if (context.repository && context.repository[ruleName]) {
    const rule = context.repository[ruleName];
    collectExternalReferencesInRules([rule], context, result);
  }
}
function collectExternalReferencesInTopLevelRule(context, result) {
  if (context.selfGrammar.patterns && Array.isArray(context.selfGrammar.patterns)) {
    collectExternalReferencesInRules(
      context.selfGrammar.patterns,
      { ...context, repository: context.selfGrammar.repository },
      result
    );
  }
  if (context.selfGrammar.injections) {
    collectExternalReferencesInRules(
      Object.values(context.selfGrammar.injections),
      { ...context, repository: context.selfGrammar.repository },
      result
    );
  }
}
function collectExternalReferencesInRules(rules, context, result) {
  for (const rule of rules) {
    if (result.visitedRule.has(rule)) {
      continue;
    }
    result.visitedRule.add(rule);
    const patternRepository = rule.repository ? mergeObjects({}, context.repository, rule.repository) : context.repository;
    if (Array.isArray(rule.patterns)) {
      collectExternalReferencesInRules(rule.patterns, { ...context, repository: patternRepository }, result);
    }
    const include = rule.include;
    if (!include) {
      continue;
    }
    const reference = parseInclude(include);
    switch (reference.kind) {
      case 0:
        collectExternalReferencesInTopLevelRule({ ...context, selfGrammar: context.baseGrammar }, result);
        break;
      case 1:
        collectExternalReferencesInTopLevelRule(context, result);
        break;
      case 2:
        collectExternalReferencesInTopLevelRepositoryRule(reference.ruleName, { ...context, repository: patternRepository }, result);
        break;
      case 3:
      case 4:
        const selfGrammar = reference.scopeName === context.selfGrammar.scopeName ? context.selfGrammar : reference.scopeName === context.baseGrammar.scopeName ? context.baseGrammar : void 0;
        if (selfGrammar) {
          const newContext = { baseGrammar: context.baseGrammar, selfGrammar, repository: patternRepository };
          if (reference.kind === 4) {
            collectExternalReferencesInTopLevelRepositoryRule(reference.ruleName, newContext, result);
          } else {
            collectExternalReferencesInTopLevelRule(newContext, result);
          }
        } else {
          if (reference.kind === 4) {
            result.add(new TopLevelRepositoryRuleReference(reference.scopeName, reference.ruleName));
          } else {
            result.add(new TopLevelRuleReference(reference.scopeName));
          }
        }
        break;
    }
  }
}
var BaseReference = class {
  kind = 0;
};
var SelfReference = class {
  kind = 1;
};
var RelativeReference = class {
  constructor(ruleName) {
    this.ruleName = ruleName;
  }
  ruleName;
  kind = 2;
};
var TopLevelReference = class {
  constructor(scopeName) {
    this.scopeName = scopeName;
  }
  scopeName;
  kind = 3;
};
var TopLevelRepositoryReference = class {
  constructor(scopeName, ruleName) {
    this.scopeName = scopeName;
    this.ruleName = ruleName;
  }
  scopeName;
  ruleName;
  kind = 4;
};
function parseInclude(include) {
  if (include === "$base") {
    return new BaseReference();
  } else if (include === "$self") {
    return new SelfReference();
  }
  const indexOfSharp = include.indexOf("#");
  if (indexOfSharp === -1) {
    return new TopLevelReference(include);
  } else if (indexOfSharp === 0) {
    return new RelativeReference(include.substring(1));
  } else {
    const scopeName = include.substring(0, indexOfSharp);
    const ruleName = include.substring(indexOfSharp + 1);
    return new TopLevelRepositoryReference(scopeName, ruleName);
  }
}
var HAS_BACK_REFERENCES = /\\(\d+)/;
var BACK_REFERENCING_END = /\\(\d+)/g;
var endRuleId = -1;
var whileRuleId = -2;
function ruleIdFromNumber(id) {
  return id;
}
function ruleIdToNumber(id) {
  return id;
}
var Rule = class {
  $location;
  id;
  _nameIsCapturing;
  _name;
  _contentNameIsCapturing;
  _contentName;
  constructor($location, id, name, contentName) {
    this.$location = $location;
    this.id = id;
    this._name = name || null;
    this._nameIsCapturing = RegexSource.hasCaptures(this._name);
    this._contentName = contentName || null;
    this._contentNameIsCapturing = RegexSource.hasCaptures(this._contentName);
  }
  get debugName() {
    const location = this.$location ? `${basename(this.$location.filename)}:${this.$location.line}` : "unknown";
    return `${this.constructor.name}#${this.id} @ ${location}`;
  }
  getName(lineText, captureIndices) {
    if (!this._nameIsCapturing || this._name === null || lineText === null || captureIndices === null) {
      return this._name;
    }
    return RegexSource.replaceCaptures(this._name, lineText, captureIndices);
  }
  getContentName(lineText, captureIndices) {
    if (!this._contentNameIsCapturing || this._contentName === null) {
      return this._contentName;
    }
    return RegexSource.replaceCaptures(this._contentName, lineText, captureIndices);
  }
};
var CaptureRule = class extends Rule {
  retokenizeCapturedWithRuleId;
  constructor($location, id, name, contentName, retokenizeCapturedWithRuleId) {
    super($location, id, name, contentName);
    this.retokenizeCapturedWithRuleId = retokenizeCapturedWithRuleId;
  }
  dispose() {
  }
  collectPatterns(grammar, out) {
    throw new Error("Not supported!");
  }
  compile(grammar, endRegexSource) {
    throw new Error("Not supported!");
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    throw new Error("Not supported!");
  }
};
var MatchRule = class extends Rule {
  _match;
  captures;
  _cachedCompiledPatterns;
  constructor($location, id, name, match, captures) {
    super($location, id, name, null);
    this._match = new RegExpSource(match, this.id);
    this.captures = captures;
    this._cachedCompiledPatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
  }
  get debugMatchRegExp() {
    return `${this._match.source}`;
  }
  collectPatterns(grammar, out) {
    out.push(this._match);
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      this.collectPatterns(grammar, this._cachedCompiledPatterns);
    }
    return this._cachedCompiledPatterns;
  }
};
var IncludeOnlyRule = class extends Rule {
  hasMissingPatterns;
  patterns;
  _cachedCompiledPatterns;
  constructor($location, id, name, contentName, patterns) {
    super($location, id, name, contentName);
    this.patterns = patterns.patterns;
    this.hasMissingPatterns = patterns.hasMissingPatterns;
    this._cachedCompiledPatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
  }
  collectPatterns(grammar, out) {
    for (const pattern of this.patterns) {
      const rule = grammar.getRule(pattern);
      rule.collectPatterns(grammar, out);
    }
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      this.collectPatterns(grammar, this._cachedCompiledPatterns);
    }
    return this._cachedCompiledPatterns;
  }
};
var BeginEndRule = class extends Rule {
  _begin;
  beginCaptures;
  _end;
  endHasBackReferences;
  endCaptures;
  applyEndPatternLast;
  hasMissingPatterns;
  patterns;
  _cachedCompiledPatterns;
  constructor($location, id, name, contentName, begin, beginCaptures, end, endCaptures, applyEndPatternLast, patterns) {
    super($location, id, name, contentName);
    this._begin = new RegExpSource(begin, this.id);
    this.beginCaptures = beginCaptures;
    this._end = new RegExpSource(end ? end : "\uFFFF", -1);
    this.endHasBackReferences = this._end.hasBackReferences;
    this.endCaptures = endCaptures;
    this.applyEndPatternLast = applyEndPatternLast || false;
    this.patterns = patterns.patterns;
    this.hasMissingPatterns = patterns.hasMissingPatterns;
    this._cachedCompiledPatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugEndRegExp() {
    return `${this._end.source}`;
  }
  getEndWithResolvedBackReferences(lineText, captureIndices) {
    return this._end.resolveBackReferences(lineText, captureIndices);
  }
  collectPatterns(grammar, out) {
    out.push(this._begin);
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar, endRegexSource).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar, endRegexSource).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar, endRegexSource) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      for (const pattern of this.patterns) {
        const rule = grammar.getRule(pattern);
        rule.collectPatterns(grammar, this._cachedCompiledPatterns);
      }
      if (this.applyEndPatternLast) {
        this._cachedCompiledPatterns.push(this._end.hasBackReferences ? this._end.clone() : this._end);
      } else {
        this._cachedCompiledPatterns.unshift(this._end.hasBackReferences ? this._end.clone() : this._end);
      }
    }
    if (this._end.hasBackReferences) {
      if (this.applyEndPatternLast) {
        this._cachedCompiledPatterns.setSource(this._cachedCompiledPatterns.length() - 1, endRegexSource);
      } else {
        this._cachedCompiledPatterns.setSource(0, endRegexSource);
      }
    }
    return this._cachedCompiledPatterns;
  }
};
var BeginWhileRule = class extends Rule {
  _begin;
  beginCaptures;
  whileCaptures;
  _while;
  whileHasBackReferences;
  hasMissingPatterns;
  patterns;
  _cachedCompiledPatterns;
  _cachedCompiledWhilePatterns;
  constructor($location, id, name, contentName, begin, beginCaptures, _while, whileCaptures, patterns) {
    super($location, id, name, contentName);
    this._begin = new RegExpSource(begin, this.id);
    this.beginCaptures = beginCaptures;
    this.whileCaptures = whileCaptures;
    this._while = new RegExpSource(_while, whileRuleId);
    this.whileHasBackReferences = this._while.hasBackReferences;
    this.patterns = patterns.patterns;
    this.hasMissingPatterns = patterns.hasMissingPatterns;
    this._cachedCompiledPatterns = null;
    this._cachedCompiledWhilePatterns = null;
  }
  dispose() {
    if (this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns.dispose();
      this._cachedCompiledPatterns = null;
    }
    if (this._cachedCompiledWhilePatterns) {
      this._cachedCompiledWhilePatterns.dispose();
      this._cachedCompiledWhilePatterns = null;
    }
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugWhileRegExp() {
    return `${this._while.source}`;
  }
  getWhileWithResolvedBackReferences(lineText, captureIndices) {
    return this._while.resolveBackReferences(lineText, captureIndices);
  }
  collectPatterns(grammar, out) {
    out.push(this._begin);
  }
  compile(grammar, endRegexSource) {
    return this._getCachedCompiledPatterns(grammar).compile(grammar);
  }
  compileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledPatterns(grammar).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledPatterns(grammar) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new RegExpSourceList();
      for (const pattern of this.patterns) {
        const rule = grammar.getRule(pattern);
        rule.collectPatterns(grammar, this._cachedCompiledPatterns);
      }
    }
    return this._cachedCompiledPatterns;
  }
  compileWhile(grammar, endRegexSource) {
    return this._getCachedCompiledWhilePatterns(grammar, endRegexSource).compile(grammar);
  }
  compileWhileAG(grammar, endRegexSource, allowA, allowG) {
    return this._getCachedCompiledWhilePatterns(grammar, endRegexSource).compileAG(grammar, allowA, allowG);
  }
  _getCachedCompiledWhilePatterns(grammar, endRegexSource) {
    if (!this._cachedCompiledWhilePatterns) {
      this._cachedCompiledWhilePatterns = new RegExpSourceList();
      this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences ? this._while.clone() : this._while);
    }
    if (this._while.hasBackReferences) {
      this._cachedCompiledWhilePatterns.setSource(0, endRegexSource ? endRegexSource : "\uFFFF");
    }
    return this._cachedCompiledWhilePatterns;
  }
};
var RuleFactory = class _RuleFactory {
  static createCaptureRule(helper, $location, name, contentName, retokenizeCapturedWithRuleId) {
    return helper.registerRule((id) => {
      return new CaptureRule($location, id, name, contentName, retokenizeCapturedWithRuleId);
    });
  }
  static getCompiledRuleId(desc, helper, repository) {
    if (!desc.id) {
      helper.registerRule((id) => {
        desc.id = id;
        if (desc.match) {
          return new MatchRule(
            desc.$vscodeTextmateLocation,
            desc.id,
            desc.name,
            desc.match,
            _RuleFactory._compileCaptures(desc.captures, helper, repository)
          );
        }
        if (typeof desc.begin === "undefined") {
          if (desc.repository) {
            repository = mergeObjects({}, repository, desc.repository);
          }
          let patterns = desc.patterns;
          if (typeof patterns === "undefined" && desc.include) {
            patterns = [{ include: desc.include }];
          }
          return new IncludeOnlyRule(
            desc.$vscodeTextmateLocation,
            desc.id,
            desc.name,
            desc.contentName,
            _RuleFactory._compilePatterns(patterns, helper, repository)
          );
        }
        if (desc.while) {
          return new BeginWhileRule(
            desc.$vscodeTextmateLocation,
            desc.id,
            desc.name,
            desc.contentName,
            desc.begin,
            _RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository),
            desc.while,
            _RuleFactory._compileCaptures(desc.whileCaptures || desc.captures, helper, repository),
            _RuleFactory._compilePatterns(desc.patterns, helper, repository)
          );
        }
        return new BeginEndRule(
          desc.$vscodeTextmateLocation,
          desc.id,
          desc.name,
          desc.contentName,
          desc.begin,
          _RuleFactory._compileCaptures(desc.beginCaptures || desc.captures, helper, repository),
          desc.end,
          _RuleFactory._compileCaptures(desc.endCaptures || desc.captures, helper, repository),
          desc.applyEndPatternLast,
          _RuleFactory._compilePatterns(desc.patterns, helper, repository)
        );
      });
    }
    return desc.id;
  }
  static _compileCaptures(captures, helper, repository) {
    let r4 = [];
    if (captures) {
      let maximumCaptureId = 0;
      for (const captureId in captures) {
        if (captureId === "$vscodeTextmateLocation") {
          continue;
        }
        const numericCaptureId = parseInt(captureId, 10);
        if (numericCaptureId > maximumCaptureId) {
          maximumCaptureId = numericCaptureId;
        }
      }
      for (let i2 = 0; i2 <= maximumCaptureId; i2++) {
        r4[i2] = null;
      }
      for (const captureId in captures) {
        if (captureId === "$vscodeTextmateLocation") {
          continue;
        }
        const numericCaptureId = parseInt(captureId, 10);
        let retokenizeCapturedWithRuleId = 0;
        if (captures[captureId].patterns) {
          retokenizeCapturedWithRuleId = _RuleFactory.getCompiledRuleId(captures[captureId], helper, repository);
        }
        r4[numericCaptureId] = _RuleFactory.createCaptureRule(helper, captures[captureId].$vscodeTextmateLocation, captures[captureId].name, captures[captureId].contentName, retokenizeCapturedWithRuleId);
      }
    }
    return r4;
  }
  static _compilePatterns(patterns, helper, repository) {
    let r4 = [];
    if (patterns) {
      for (let i2 = 0, len = patterns.length; i2 < len; i2++) {
        const pattern = patterns[i2];
        let ruleId = -1;
        if (pattern.include) {
          const reference = parseInclude(pattern.include);
          switch (reference.kind) {
            case 0:
            case 1:
              ruleId = _RuleFactory.getCompiledRuleId(repository[pattern.include], helper, repository);
              break;
            case 2:
              let localIncludedRule = repository[reference.ruleName];
              if (localIncludedRule) {
                ruleId = _RuleFactory.getCompiledRuleId(localIncludedRule, helper, repository);
              } else {
              }
              break;
            case 3:
            case 4:
              const externalGrammarName = reference.scopeName;
              const externalGrammarInclude = reference.kind === 4 ? reference.ruleName : null;
              const externalGrammar = helper.getExternalGrammar(externalGrammarName, repository);
              if (externalGrammar) {
                if (externalGrammarInclude) {
                  let externalIncludedRule = externalGrammar.repository[externalGrammarInclude];
                  if (externalIncludedRule) {
                    ruleId = _RuleFactory.getCompiledRuleId(externalIncludedRule, helper, externalGrammar.repository);
                  } else {
                  }
                } else {
                  ruleId = _RuleFactory.getCompiledRuleId(externalGrammar.repository.$self, helper, externalGrammar.repository);
                }
              } else {
              }
              break;
          }
        } else {
          ruleId = _RuleFactory.getCompiledRuleId(pattern, helper, repository);
        }
        if (ruleId !== -1) {
          const rule = helper.getRule(ruleId);
          let skipRule = false;
          if (rule instanceof IncludeOnlyRule || rule instanceof BeginEndRule || rule instanceof BeginWhileRule) {
            if (rule.hasMissingPatterns && rule.patterns.length === 0) {
              skipRule = true;
            }
          }
          if (skipRule) {
            continue;
          }
          r4.push(ruleId);
        }
      }
    }
    return {
      patterns: r4,
      hasMissingPatterns: (patterns ? patterns.length : 0) !== r4.length
    };
  }
};
var RegExpSource = class _RegExpSource {
  source;
  ruleId;
  hasAnchor;
  hasBackReferences;
  _anchorCache;
  constructor(regExpSource, ruleId) {
    if (regExpSource && typeof regExpSource === "string") {
      const len = regExpSource.length;
      let lastPushedPos = 0;
      let output = [];
      let hasAnchor = false;
      for (let pos = 0; pos < len; pos++) {
        const ch = regExpSource.charAt(pos);
        if (ch === "\\") {
          if (pos + 1 < len) {
            const nextCh = regExpSource.charAt(pos + 1);
            if (nextCh === "z") {
              output.push(regExpSource.substring(lastPushedPos, pos));
              output.push("$(?!\\n)(?<!\\n)");
              lastPushedPos = pos + 2;
            } else if (nextCh === "A" || nextCh === "G") {
              hasAnchor = true;
            }
            pos++;
          }
        }
      }
      this.hasAnchor = hasAnchor;
      if (lastPushedPos === 0) {
        this.source = regExpSource;
      } else {
        output.push(regExpSource.substring(lastPushedPos, len));
        this.source = output.join("");
      }
    } else {
      this.hasAnchor = false;
      this.source = regExpSource;
    }
    if (this.hasAnchor) {
      this._anchorCache = this._buildAnchorCache();
    } else {
      this._anchorCache = null;
    }
    this.ruleId = ruleId;
    if (typeof this.source === "string") {
      this.hasBackReferences = HAS_BACK_REFERENCES.test(this.source);
    } else {
      this.hasBackReferences = false;
    }
  }
  clone() {
    return new _RegExpSource(this.source, this.ruleId);
  }
  setSource(newSource) {
    if (this.source === newSource) {
      return;
    }
    this.source = newSource;
    if (this.hasAnchor) {
      this._anchorCache = this._buildAnchorCache();
    }
  }
  resolveBackReferences(lineText, captureIndices) {
    if (typeof this.source !== "string") {
      throw new Error("This method should only be called if the source is a string");
    }
    let capturedValues = captureIndices.map((capture) => {
      return lineText.substring(capture.start, capture.end);
    });
    BACK_REFERENCING_END.lastIndex = 0;
    return this.source.replace(BACK_REFERENCING_END, (match, g1) => {
      return escapeRegExpCharacters(capturedValues[parseInt(g1, 10)] || "");
    });
  }
  _buildAnchorCache() {
    if (typeof this.source !== "string") {
      throw new Error("This method should only be called if the source is a string");
    }
    let A0_G0_result = [];
    let A0_G1_result = [];
    let A1_G0_result = [];
    let A1_G1_result = [];
    let pos, len, ch, nextCh;
    for (pos = 0, len = this.source.length; pos < len; pos++) {
      ch = this.source.charAt(pos);
      A0_G0_result[pos] = ch;
      A0_G1_result[pos] = ch;
      A1_G0_result[pos] = ch;
      A1_G1_result[pos] = ch;
      if (ch === "\\") {
        if (pos + 1 < len) {
          nextCh = this.source.charAt(pos + 1);
          if (nextCh === "A") {
            A0_G0_result[pos + 1] = "\uFFFF";
            A0_G1_result[pos + 1] = "\uFFFF";
            A1_G0_result[pos + 1] = "A";
            A1_G1_result[pos + 1] = "A";
          } else if (nextCh === "G") {
            A0_G0_result[pos + 1] = "\uFFFF";
            A0_G1_result[pos + 1] = "G";
            A1_G0_result[pos + 1] = "\uFFFF";
            A1_G1_result[pos + 1] = "G";
          } else {
            A0_G0_result[pos + 1] = nextCh;
            A0_G1_result[pos + 1] = nextCh;
            A1_G0_result[pos + 1] = nextCh;
            A1_G1_result[pos + 1] = nextCh;
          }
          pos++;
        }
      }
    }
    return {
      A0_G0: A0_G0_result.join(""),
      A0_G1: A0_G1_result.join(""),
      A1_G0: A1_G0_result.join(""),
      A1_G1: A1_G1_result.join("")
    };
  }
  resolveAnchors(allowA, allowG) {
    if (!this.hasAnchor || !this._anchorCache || typeof this.source !== "string") {
      return this.source;
    }
    if (allowA) {
      if (allowG) {
        return this._anchorCache.A1_G1;
      } else {
        return this._anchorCache.A1_G0;
      }
    } else {
      if (allowG) {
        return this._anchorCache.A0_G1;
      } else {
        return this._anchorCache.A0_G0;
      }
    }
  }
};
var RegExpSourceList = class {
  _items;
  _hasAnchors;
  _cached;
  _anchorCache;
  constructor() {
    this._items = [];
    this._hasAnchors = false;
    this._cached = null;
    this._anchorCache = {
      A0_G0: null,
      A0_G1: null,
      A1_G0: null,
      A1_G1: null
    };
  }
  dispose() {
    this._disposeCaches();
  }
  _disposeCaches() {
    if (this._cached) {
      this._cached.dispose();
      this._cached = null;
    }
    if (this._anchorCache.A0_G0) {
      this._anchorCache.A0_G0.dispose();
      this._anchorCache.A0_G0 = null;
    }
    if (this._anchorCache.A0_G1) {
      this._anchorCache.A0_G1.dispose();
      this._anchorCache.A0_G1 = null;
    }
    if (this._anchorCache.A1_G0) {
      this._anchorCache.A1_G0.dispose();
      this._anchorCache.A1_G0 = null;
    }
    if (this._anchorCache.A1_G1) {
      this._anchorCache.A1_G1.dispose();
      this._anchorCache.A1_G1 = null;
    }
  }
  push(item) {
    this._items.push(item);
    this._hasAnchors = this._hasAnchors || item.hasAnchor;
  }
  unshift(item) {
    this._items.unshift(item);
    this._hasAnchors = this._hasAnchors || item.hasAnchor;
  }
  length() {
    return this._items.length;
  }
  setSource(index, newSource) {
    if (this._items[index].source !== newSource) {
      this._disposeCaches();
      this._items[index].setSource(newSource);
    }
  }
  compile(onigLib) {
    if (!this._cached) {
      let regExps = this._items.map((e) => e.source);
      this._cached = new CompiledRule(onigLib, regExps, this._items.map((e) => e.ruleId));
    }
    return this._cached;
  }
  compileAG(onigLib, allowA, allowG) {
    if (!this._hasAnchors) {
      return this.compile(onigLib);
    } else {
      if (allowA) {
        if (allowG) {
          if (!this._anchorCache.A1_G1) {
            this._anchorCache.A1_G1 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A1_G1;
        } else {
          if (!this._anchorCache.A1_G0) {
            this._anchorCache.A1_G0 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A1_G0;
        }
      } else {
        if (allowG) {
          if (!this._anchorCache.A0_G1) {
            this._anchorCache.A0_G1 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A0_G1;
        } else {
          if (!this._anchorCache.A0_G0) {
            this._anchorCache.A0_G0 = this._resolveAnchors(onigLib, allowA, allowG);
          }
          return this._anchorCache.A0_G0;
        }
      }
    }
  }
  _resolveAnchors(onigLib, allowA, allowG) {
    let regExps = this._items.map((e) => e.resolveAnchors(allowA, allowG));
    return new CompiledRule(onigLib, regExps, this._items.map((e) => e.ruleId));
  }
};
var CompiledRule = class {
  constructor(onigLib, regExps, rules) {
    this.regExps = regExps;
    this.rules = rules;
    this.scanner = onigLib.createOnigScanner(regExps);
  }
  regExps;
  rules;
  scanner;
  dispose() {
    if (typeof this.scanner.dispose === "function") {
      this.scanner.dispose();
    }
  }
  toString() {
    const r4 = [];
    for (let i2 = 0, len = this.rules.length; i2 < len; i2++) {
      r4.push("   - " + this.rules[i2] + ": " + this.regExps[i2]);
    }
    return r4.join("\n");
  }
  findNextMatchSync(string, startPosition, options) {
    const result = this.scanner.findNextMatchSync(string, startPosition, options);
    if (!result) {
      return null;
    }
    return {
      ruleId: this.rules[result.index],
      captureIndices: result.captureIndices
    };
  }
};
var BasicScopeAttributes = class {
  constructor(languageId, tokenType) {
    this.languageId = languageId;
    this.tokenType = tokenType;
  }
  languageId;
  tokenType;
};
var BasicScopeAttributesProvider = class _BasicScopeAttributesProvider {
  _defaultAttributes;
  _embeddedLanguagesMatcher;
  constructor(initialLanguageId, embeddedLanguages) {
    this._defaultAttributes = new BasicScopeAttributes(
      initialLanguageId,
      8
      /* NotSet */
    );
    this._embeddedLanguagesMatcher = new ScopeMatcher(Object.entries(embeddedLanguages || {}));
  }
  getDefaultAttributes() {
    return this._defaultAttributes;
  }
  getBasicScopeAttributes(scopeName) {
    if (scopeName === null) {
      return _BasicScopeAttributesProvider._NULL_SCOPE_METADATA;
    }
    return this._getBasicScopeAttributes.get(scopeName);
  }
  static _NULL_SCOPE_METADATA = new BasicScopeAttributes(0, 0);
  _getBasicScopeAttributes = new CachedFn((scopeName) => {
    const languageId = this._scopeToLanguage(scopeName);
    const standardTokenType = this._toStandardTokenType(scopeName);
    return new BasicScopeAttributes(languageId, standardTokenType);
  });
  /**
   * Given a produced TM scope, return the language that token describes or null if unknown.
   * e.g. source.html => html, source.css.embedded.html => css, punctuation.definition.tag.html => null
   */
  _scopeToLanguage(scope) {
    return this._embeddedLanguagesMatcher.match(scope) || 0;
  }
  _toStandardTokenType(scopeName) {
    const m3 = scopeName.match(_BasicScopeAttributesProvider.STANDARD_TOKEN_TYPE_REGEXP);
    if (!m3) {
      return 8;
    }
    switch (m3[1]) {
      case "comment":
        return 1;
      case "string":
        return 2;
      case "regex":
        return 3;
      case "meta.embedded":
        return 0;
    }
    throw new Error("Unexpected match for standard token type!");
  }
  static STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/;
};
var ScopeMatcher = class {
  values;
  scopesRegExp;
  constructor(values) {
    if (values.length === 0) {
      this.values = null;
      this.scopesRegExp = null;
    } else {
      this.values = new Map(values);
      const escapedScopes = values.map(
        ([scopeName, value]) => escapeRegExpCharacters(scopeName)
      );
      escapedScopes.sort();
      escapedScopes.reverse();
      this.scopesRegExp = new RegExp(
        `^((${escapedScopes.join(")|(")}))($|\\.)`,
        ""
      );
    }
  }
  match(scope) {
    if (!this.scopesRegExp) {
      return void 0;
    }
    const m3 = scope.match(this.scopesRegExp);
    if (!m3) {
      return void 0;
    }
    return this.values.get(m3[1]);
  }
};
var DebugFlags = {
  InDebugMode: typeof process !== "undefined" && !!process.env["VSCODE_TEXTMATE_DEBUG"]
};
var UseOnigurumaFindOptions = false;
var TokenizeStringResult = class {
  constructor(stack, stoppedEarly) {
    this.stack = stack;
    this.stoppedEarly = stoppedEarly;
  }
  stack;
  stoppedEarly;
};
function _tokenizeString(grammar, lineText, isFirstLine, linePos, stack, lineTokens, checkWhileConditions, timeLimit) {
  const lineLength = lineText.content.length;
  let STOP = false;
  let anchorPosition = -1;
  if (checkWhileConditions) {
    const whileCheckResult = _checkWhileConditions(
      grammar,
      lineText,
      isFirstLine,
      linePos,
      stack,
      lineTokens
    );
    stack = whileCheckResult.stack;
    linePos = whileCheckResult.linePos;
    isFirstLine = whileCheckResult.isFirstLine;
    anchorPosition = whileCheckResult.anchorPosition;
  }
  const startTime = Date.now();
  while (!STOP) {
    if (timeLimit !== 0) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > timeLimit) {
        return new TokenizeStringResult(stack, true);
      }
    }
    scanNext();
  }
  return new TokenizeStringResult(stack, false);
  function scanNext() {
    if (false) {
      console.log("");
      console.log(
        `@@scanNext ${linePos}: |${lineText.content.substr(linePos).replace(/\n$/, "\\n")}|`
      );
    }
    const r4 = matchRuleOrInjections(
      grammar,
      lineText,
      isFirstLine,
      linePos,
      stack,
      anchorPosition
    );
    if (!r4) {
      lineTokens.produce(stack, lineLength);
      STOP = true;
      return;
    }
    const captureIndices = r4.captureIndices;
    const matchedRuleId = r4.matchedRuleId;
    const hasAdvanced = captureIndices && captureIndices.length > 0 ? captureIndices[0].end > linePos : false;
    if (matchedRuleId === endRuleId) {
      const poppedRule = stack.getRule(grammar);
      if (false) {
        console.log(
          "  popping " + poppedRule.debugName + " - " + poppedRule.debugEndRegExp
        );
      }
      lineTokens.produce(stack, captureIndices[0].start);
      stack = stack.withContentNameScopesList(stack.nameScopesList);
      handleCaptures(
        grammar,
        lineText,
        isFirstLine,
        stack,
        lineTokens,
        poppedRule.endCaptures,
        captureIndices
      );
      lineTokens.produce(stack, captureIndices[0].end);
      const popped = stack;
      stack = stack.parent;
      anchorPosition = popped.getAnchorPos();
      if (!hasAdvanced && popped.getEnterPos() === linePos) {
        if (false) {
          console.error(
            "[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"
          );
        }
        stack = popped;
        lineTokens.produce(stack, lineLength);
        STOP = true;
        return;
      }
    } else {
      const _rule = grammar.getRule(matchedRuleId);
      lineTokens.produce(stack, captureIndices[0].start);
      const beforePush = stack;
      const scopeName = _rule.getName(lineText.content, captureIndices);
      const nameScopesList = stack.contentNameScopesList.pushAttributed(
        scopeName,
        grammar
      );
      stack = stack.push(
        matchedRuleId,
        linePos,
        anchorPosition,
        captureIndices[0].end === lineLength,
        null,
        nameScopesList,
        nameScopesList
      );
      if (_rule instanceof BeginEndRule) {
        const pushedRule = _rule;
        if (false) {
          console.log(
            "  pushing " + pushedRule.debugName + " - " + pushedRule.debugBeginRegExp
          );
        }
        handleCaptures(
          grammar,
          lineText,
          isFirstLine,
          stack,
          lineTokens,
          pushedRule.beginCaptures,
          captureIndices
        );
        lineTokens.produce(stack, captureIndices[0].end);
        anchorPosition = captureIndices[0].end;
        const contentName = pushedRule.getContentName(
          lineText.content,
          captureIndices
        );
        const contentNameScopesList = nameScopesList.pushAttributed(
          contentName,
          grammar
        );
        stack = stack.withContentNameScopesList(contentNameScopesList);
        if (pushedRule.endHasBackReferences) {
          stack = stack.withEndRule(
            pushedRule.getEndWithResolvedBackReferences(
              lineText.content,
              captureIndices
            )
          );
        }
        if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
          if (false) {
            console.error(
              "[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
            );
          }
          stack = stack.pop();
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      } else if (_rule instanceof BeginWhileRule) {
        const pushedRule = _rule;
        if (false) {
          console.log("  pushing " + pushedRule.debugName);
        }
        handleCaptures(
          grammar,
          lineText,
          isFirstLine,
          stack,
          lineTokens,
          pushedRule.beginCaptures,
          captureIndices
        );
        lineTokens.produce(stack, captureIndices[0].end);
        anchorPosition = captureIndices[0].end;
        const contentName = pushedRule.getContentName(
          lineText.content,
          captureIndices
        );
        const contentNameScopesList = nameScopesList.pushAttributed(
          contentName,
          grammar
        );
        stack = stack.withContentNameScopesList(contentNameScopesList);
        if (pushedRule.whileHasBackReferences) {
          stack = stack.withEndRule(
            pushedRule.getWhileWithResolvedBackReferences(
              lineText.content,
              captureIndices
            )
          );
        }
        if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
          if (false) {
            console.error(
              "[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
            );
          }
          stack = stack.pop();
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      } else {
        const matchingRule = _rule;
        if (false) {
          console.log(
            "  matched " + matchingRule.debugName + " - " + matchingRule.debugMatchRegExp
          );
        }
        handleCaptures(
          grammar,
          lineText,
          isFirstLine,
          stack,
          lineTokens,
          matchingRule.captures,
          captureIndices
        );
        lineTokens.produce(stack, captureIndices[0].end);
        stack = stack.pop();
        if (!hasAdvanced) {
          if (false) {
            console.error(
              "[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"
            );
          }
          stack = stack.safePop();
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      }
    }
    if (captureIndices[0].end > linePos) {
      linePos = captureIndices[0].end;
      isFirstLine = false;
    }
  }
}
function _checkWhileConditions(grammar, lineText, isFirstLine, linePos, stack, lineTokens) {
  let anchorPosition = stack.beginRuleCapturedEOL ? 0 : -1;
  const whileRules = [];
  for (let node = stack; node; node = node.pop()) {
    const nodeRule = node.getRule(grammar);
    if (nodeRule instanceof BeginWhileRule) {
      whileRules.push({
        rule: nodeRule,
        stack: node
      });
    }
  }
  for (let whileRule = whileRules.pop(); whileRule; whileRule = whileRules.pop()) {
    const { ruleScanner, findOptions } = prepareRuleWhileSearch(whileRule.rule, grammar, whileRule.stack.endRule, isFirstLine, linePos === anchorPosition);
    const r4 = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
    if (false) {
      console.log("  scanning for while rule");
      console.log(ruleScanner.toString());
    }
    if (r4) {
      const matchedRuleId = r4.ruleId;
      if (matchedRuleId !== whileRuleId) {
        stack = whileRule.stack.pop();
        break;
      }
      if (r4.captureIndices && r4.captureIndices.length) {
        lineTokens.produce(whileRule.stack, r4.captureIndices[0].start);
        handleCaptures(grammar, lineText, isFirstLine, whileRule.stack, lineTokens, whileRule.rule.whileCaptures, r4.captureIndices);
        lineTokens.produce(whileRule.stack, r4.captureIndices[0].end);
        anchorPosition = r4.captureIndices[0].end;
        if (r4.captureIndices[0].end > linePos) {
          linePos = r4.captureIndices[0].end;
          isFirstLine = false;
        }
      }
    } else {
      if (false) {
        console.log("  popping " + whileRule.rule.debugName + " - " + whileRule.rule.debugWhileRegExp);
      }
      stack = whileRule.stack.pop();
      break;
    }
  }
  return { stack, linePos, anchorPosition, isFirstLine };
}
function matchRuleOrInjections(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
  const matchResult = matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
  const injections = grammar.getInjections();
  if (injections.length === 0) {
    return matchResult;
  }
  const injectionResult = matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
  if (!injectionResult) {
    return matchResult;
  }
  if (!matchResult) {
    return injectionResult;
  }
  const matchResultScore = matchResult.captureIndices[0].start;
  const injectionResultScore = injectionResult.captureIndices[0].start;
  if (injectionResultScore < matchResultScore || injectionResult.priorityMatch && injectionResultScore === matchResultScore) {
    return injectionResult;
  }
  return matchResult;
}
function matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
  const rule = stack.getRule(grammar);
  const { ruleScanner, findOptions } = prepareRuleSearch(rule, grammar, stack.endRule, isFirstLine, linePos === anchorPosition);
  const r4 = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
  if (r4) {
    return {
      captureIndices: r4.captureIndices,
      matchedRuleId: r4.ruleId
    };
  }
  return null;
}
function matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
  let bestMatchRating = Number.MAX_VALUE;
  let bestMatchCaptureIndices = null;
  let bestMatchRuleId;
  let bestMatchResultPriority = 0;
  const scopes = stack.contentNameScopesList.getScopeNames();
  for (let i2 = 0, len = injections.length; i2 < len; i2++) {
    const injection = injections[i2];
    if (!injection.matcher(scopes)) {
      continue;
    }
    const rule = grammar.getRule(injection.ruleId);
    const { ruleScanner, findOptions } = prepareRuleSearch(rule, grammar, null, isFirstLine, linePos === anchorPosition);
    const matchResult = ruleScanner.findNextMatchSync(lineText, linePos, findOptions);
    if (!matchResult) {
      continue;
    }
    if (false) {
      console.log(`  matched injection: ${injection.debugSelector}`);
      console.log(ruleScanner.toString());
    }
    const matchRating = matchResult.captureIndices[0].start;
    if (matchRating >= bestMatchRating) {
      continue;
    }
    bestMatchRating = matchRating;
    bestMatchCaptureIndices = matchResult.captureIndices;
    bestMatchRuleId = matchResult.ruleId;
    bestMatchResultPriority = injection.priority;
    if (bestMatchRating === linePos) {
      break;
    }
  }
  if (bestMatchCaptureIndices) {
    return {
      priorityMatch: bestMatchResultPriority === -1,
      captureIndices: bestMatchCaptureIndices,
      matchedRuleId: bestMatchRuleId
    };
  }
  return null;
}
function prepareRuleSearch(rule, grammar, endRegexSource, allowA, allowG) {
  if (UseOnigurumaFindOptions) {
    const ruleScanner2 = rule.compile(grammar, endRegexSource);
    const findOptions = getFindOptions(allowA, allowG);
    return { ruleScanner: ruleScanner2, findOptions };
  }
  const ruleScanner = rule.compileAG(grammar, endRegexSource, allowA, allowG);
  return {
    ruleScanner,
    findOptions: 0
    /* None */
  };
}
function prepareRuleWhileSearch(rule, grammar, endRegexSource, allowA, allowG) {
  if (UseOnigurumaFindOptions) {
    const ruleScanner2 = rule.compileWhile(grammar, endRegexSource);
    const findOptions = getFindOptions(allowA, allowG);
    return { ruleScanner: ruleScanner2, findOptions };
  }
  const ruleScanner = rule.compileWhileAG(grammar, endRegexSource, allowA, allowG);
  return {
    ruleScanner,
    findOptions: 0
    /* None */
  };
}
function getFindOptions(allowA, allowG) {
  let options = 0;
  if (!allowA) {
    options |= 1;
  }
  if (!allowG) {
    options |= 4;
  }
  return options;
}
function handleCaptures(grammar, lineText, isFirstLine, stack, lineTokens, captures, captureIndices) {
  if (captures.length === 0) {
    return;
  }
  const lineTextContent = lineText.content;
  const len = Math.min(captures.length, captureIndices.length);
  const localStack = [];
  const maxEnd = captureIndices[0].end;
  for (let i2 = 0; i2 < len; i2++) {
    const captureRule = captures[i2];
    if (captureRule === null) {
      continue;
    }
    const captureIndex = captureIndices[i2];
    if (captureIndex.length === 0) {
      continue;
    }
    if (captureIndex.start > maxEnd) {
      break;
    }
    while (localStack.length > 0 && localStack[localStack.length - 1].endPos <= captureIndex.start) {
      lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
      localStack.pop();
    }
    if (localStack.length > 0) {
      lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, captureIndex.start);
    } else {
      lineTokens.produce(stack, captureIndex.start);
    }
    if (captureRule.retokenizeCapturedWithRuleId) {
      const scopeName = captureRule.getName(lineTextContent, captureIndices);
      const nameScopesList = stack.contentNameScopesList.pushAttributed(scopeName, grammar);
      const contentName = captureRule.getContentName(lineTextContent, captureIndices);
      const contentNameScopesList = nameScopesList.pushAttributed(contentName, grammar);
      const stackClone = stack.push(captureRule.retokenizeCapturedWithRuleId, captureIndex.start, -1, false, null, nameScopesList, contentNameScopesList);
      const onigSubStr = grammar.createOnigString(lineTextContent.substring(0, captureIndex.end));
      _tokenizeString(
        grammar,
        onigSubStr,
        isFirstLine && captureIndex.start === 0,
        captureIndex.start,
        stackClone,
        lineTokens,
        false,
        /* no time limit */
        0
      );
      disposeOnigString(onigSubStr);
      continue;
    }
    const captureRuleScopeName = captureRule.getName(lineTextContent, captureIndices);
    if (captureRuleScopeName !== null) {
      const base = localStack.length > 0 ? localStack[localStack.length - 1].scopes : stack.contentNameScopesList;
      const captureRuleScopesList = base.pushAttributed(captureRuleScopeName, grammar);
      localStack.push(new LocalStackElement(captureRuleScopesList, captureIndex.end));
    }
  }
  while (localStack.length > 0) {
    lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
    localStack.pop();
  }
}
var LocalStackElement = class {
  scopes;
  endPos;
  constructor(scopes, endPos) {
    this.scopes = scopes;
    this.endPos = endPos;
  }
};
function createGrammar(scopeName, grammar, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors, grammarRepository, onigLib) {
  return new Grammar(
    scopeName,
    grammar,
    initialLanguage,
    embeddedLanguages,
    tokenTypes,
    balancedBracketSelectors,
    grammarRepository,
    onigLib
  );
}
function collectInjections(result, selector, rule, ruleFactoryHelper, grammar) {
  const matchers = createMatchers(selector, nameMatcher);
  const ruleId = RuleFactory.getCompiledRuleId(rule, ruleFactoryHelper, grammar.repository);
  for (const matcher of matchers) {
    result.push({
      debugSelector: selector,
      matcher: matcher.matcher,
      ruleId,
      grammar,
      priority: matcher.priority
    });
  }
}
function nameMatcher(identifers, scopes) {
  if (scopes.length < identifers.length) {
    return false;
  }
  let lastIndex = 0;
  return identifers.every((identifier) => {
    for (let i2 = lastIndex; i2 < scopes.length; i2++) {
      if (scopesAreMatching(scopes[i2], identifier)) {
        lastIndex = i2 + 1;
        return true;
      }
    }
    return false;
  });
}
function scopesAreMatching(thisScopeName, scopeName) {
  if (!thisScopeName) {
    return false;
  }
  if (thisScopeName === scopeName) {
    return true;
  }
  const len = scopeName.length;
  return thisScopeName.length > len && thisScopeName.substr(0, len) === scopeName && thisScopeName[len] === ".";
}
var Grammar = class {
  constructor(_rootScopeName, grammar, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors, grammarRepository, _onigLib) {
    this._rootScopeName = _rootScopeName;
    this.balancedBracketSelectors = balancedBracketSelectors;
    this._onigLib = _onigLib;
    this._basicScopeAttributesProvider = new BasicScopeAttributesProvider(
      initialLanguage,
      embeddedLanguages
    );
    this._rootId = -1;
    this._lastRuleId = 0;
    this._ruleId2desc = [null];
    this._includedGrammars = {};
    this._grammarRepository = grammarRepository;
    this._grammar = initGrammar(grammar, null);
    this._injections = null;
    this._tokenTypeMatchers = [];
    if (tokenTypes) {
      for (const selector of Object.keys(tokenTypes)) {
        const matchers = createMatchers(selector, nameMatcher);
        for (const matcher of matchers) {
          this._tokenTypeMatchers.push({
            matcher: matcher.matcher,
            type: tokenTypes[selector]
          });
        }
      }
    }
  }
  _rootScopeName;
  balancedBracketSelectors;
  _onigLib;
  _rootId;
  _lastRuleId;
  _ruleId2desc;
  _includedGrammars;
  _grammarRepository;
  _grammar;
  _injections;
  _basicScopeAttributesProvider;
  _tokenTypeMatchers;
  get themeProvider() {
    return this._grammarRepository;
  }
  dispose() {
    for (const rule of this._ruleId2desc) {
      if (rule) {
        rule.dispose();
      }
    }
  }
  createOnigScanner(sources) {
    return this._onigLib.createOnigScanner(sources);
  }
  createOnigString(sources) {
    return this._onigLib.createOnigString(sources);
  }
  getMetadataForScope(scope) {
    return this._basicScopeAttributesProvider.getBasicScopeAttributes(scope);
  }
  _collectInjections() {
    const grammarRepository = {
      lookup: (scopeName2) => {
        if (scopeName2 === this._rootScopeName) {
          return this._grammar;
        }
        return this.getExternalGrammar(scopeName2);
      },
      injections: (scopeName2) => {
        return this._grammarRepository.injections(scopeName2);
      }
    };
    const result = [];
    const scopeName = this._rootScopeName;
    const grammar = grammarRepository.lookup(scopeName);
    if (grammar) {
      const rawInjections = grammar.injections;
      if (rawInjections) {
        for (let expression in rawInjections) {
          collectInjections(
            result,
            expression,
            rawInjections[expression],
            this,
            grammar
          );
        }
      }
      const injectionScopeNames = this._grammarRepository.injections(scopeName);
      if (injectionScopeNames) {
        injectionScopeNames.forEach((injectionScopeName) => {
          const injectionGrammar = this.getExternalGrammar(injectionScopeName);
          if (injectionGrammar) {
            const selector = injectionGrammar.injectionSelector;
            if (selector) {
              collectInjections(
                result,
                selector,
                injectionGrammar,
                this,
                injectionGrammar
              );
            }
          }
        });
      }
    }
    result.sort((i1, i2) => i1.priority - i2.priority);
    return result;
  }
  getInjections() {
    if (this._injections === null) {
      this._injections = this._collectInjections();
    }
    return this._injections;
  }
  registerRule(factory) {
    const id = ++this._lastRuleId;
    const result = factory(ruleIdFromNumber(id));
    this._ruleId2desc[id] = result;
    return result;
  }
  getRule(ruleId) {
    return this._ruleId2desc[ruleIdToNumber(ruleId)];
  }
  getExternalGrammar(scopeName, repository) {
    if (this._includedGrammars[scopeName]) {
      return this._includedGrammars[scopeName];
    } else if (this._grammarRepository) {
      const rawIncludedGrammar = this._grammarRepository.lookup(scopeName);
      if (rawIncludedGrammar) {
        this._includedGrammars[scopeName] = initGrammar(
          rawIncludedGrammar,
          repository && repository.$base
        );
        return this._includedGrammars[scopeName];
      }
    }
    return void 0;
  }
  tokenizeLine(lineText, prevState, timeLimit = 0) {
    const r4 = this._tokenize(lineText, prevState, false, timeLimit);
    return {
      tokens: r4.lineTokens.getResult(r4.ruleStack, r4.lineLength),
      ruleStack: r4.ruleStack,
      stoppedEarly: r4.stoppedEarly
    };
  }
  tokenizeLine2(lineText, prevState, timeLimit = 0) {
    const r4 = this._tokenize(lineText, prevState, true, timeLimit);
    return {
      tokens: r4.lineTokens.getBinaryResult(r4.ruleStack, r4.lineLength),
      ruleStack: r4.ruleStack,
      stoppedEarly: r4.stoppedEarly
    };
  }
  _tokenize(lineText, prevState, emitBinaryTokens, timeLimit) {
    if (this._rootId === -1) {
      this._rootId = RuleFactory.getCompiledRuleId(
        this._grammar.repository.$self,
        this,
        this._grammar.repository
      );
      this.getInjections();
    }
    let isFirstLine;
    if (!prevState || prevState === StateStackImpl.NULL) {
      isFirstLine = true;
      const rawDefaultMetadata = this._basicScopeAttributesProvider.getDefaultAttributes();
      const defaultStyle = this.themeProvider.getDefaults();
      const defaultMetadata = EncodedTokenMetadata.set(
        0,
        rawDefaultMetadata.languageId,
        rawDefaultMetadata.tokenType,
        null,
        defaultStyle.fontStyle,
        defaultStyle.foregroundId,
        defaultStyle.backgroundId
      );
      const rootScopeName = this.getRule(this._rootId).getName(
        null,
        null
      );
      let scopeList;
      if (rootScopeName) {
        scopeList = AttributedScopeStack.createRootAndLookUpScopeName(
          rootScopeName,
          defaultMetadata,
          this
        );
      } else {
        scopeList = AttributedScopeStack.createRoot(
          "unknown",
          defaultMetadata
        );
      }
      prevState = new StateStackImpl(
        null,
        this._rootId,
        -1,
        -1,
        false,
        null,
        scopeList,
        scopeList
      );
    } else {
      isFirstLine = false;
      prevState.reset();
    }
    lineText = lineText + "\n";
    const onigLineText = this.createOnigString(lineText);
    const lineLength = onigLineText.content.length;
    const lineTokens = new LineTokens(
      emitBinaryTokens,
      lineText,
      this._tokenTypeMatchers,
      this.balancedBracketSelectors
    );
    const r4 = _tokenizeString(
      this,
      onigLineText,
      isFirstLine,
      0,
      prevState,
      lineTokens,
      true,
      timeLimit
    );
    disposeOnigString(onigLineText);
    return {
      lineLength,
      lineTokens,
      ruleStack: r4.stack,
      stoppedEarly: r4.stoppedEarly
    };
  }
};
function initGrammar(grammar, base) {
  grammar = clone(grammar);
  grammar.repository = grammar.repository || {};
  grammar.repository.$self = {
    $vscodeTextmateLocation: grammar.$vscodeTextmateLocation,
    patterns: grammar.patterns,
    name: grammar.scopeName
  };
  grammar.repository.$base = base || grammar.repository.$self;
  return grammar;
}
var AttributedScopeStack = class _AttributedScopeStack {
  /**
   * Invariant:
   * ```
   * if (parent && !scopePath.extends(parent.scopePath)) {
   * 	throw new Error();
   * }
   * ```
   */
  constructor(parent, scopePath, tokenAttributes) {
    this.parent = parent;
    this.scopePath = scopePath;
    this.tokenAttributes = tokenAttributes;
  }
  parent;
  scopePath;
  tokenAttributes;
  static fromExtension(namesScopeList, contentNameScopesList) {
    let current = namesScopeList;
    let scopeNames = namesScopeList?.scopePath ?? null;
    for (const frame of contentNameScopesList) {
      scopeNames = ScopeStack.push(scopeNames, frame.scopeNames);
      current = new _AttributedScopeStack(current, scopeNames, frame.encodedTokenAttributes);
    }
    return current;
  }
  static createRoot(scopeName, tokenAttributes) {
    return new _AttributedScopeStack(null, new ScopeStack(null, scopeName), tokenAttributes);
  }
  static createRootAndLookUpScopeName(scopeName, tokenAttributes, grammar) {
    const rawRootMetadata = grammar.getMetadataForScope(scopeName);
    const scopePath = new ScopeStack(null, scopeName);
    const rootStyle = grammar.themeProvider.themeMatch(scopePath);
    const resolvedTokenAttributes = _AttributedScopeStack.mergeAttributes(
      tokenAttributes,
      rawRootMetadata,
      rootStyle
    );
    return new _AttributedScopeStack(null, scopePath, resolvedTokenAttributes);
  }
  get scopeName() {
    return this.scopePath.scopeName;
  }
  toString() {
    return this.getScopeNames().join(" ");
  }
  equals(other) {
    return _AttributedScopeStack.equals(this, other);
  }
  static equals(a2, b3) {
    do {
      if (a2 === b3) {
        return true;
      }
      if (!a2 && !b3) {
        return true;
      }
      if (!a2 || !b3) {
        return false;
      }
      if (a2.scopeName !== b3.scopeName || a2.tokenAttributes !== b3.tokenAttributes) {
        return false;
      }
      a2 = a2.parent;
      b3 = b3.parent;
    } while (true);
  }
  static mergeAttributes(existingTokenAttributes, basicScopeAttributes, styleAttributes) {
    let fontStyle = -1;
    let foreground = 0;
    let background = 0;
    if (styleAttributes !== null) {
      fontStyle = styleAttributes.fontStyle;
      foreground = styleAttributes.foregroundId;
      background = styleAttributes.backgroundId;
    }
    return EncodedTokenMetadata.set(
      existingTokenAttributes,
      basicScopeAttributes.languageId,
      basicScopeAttributes.tokenType,
      null,
      fontStyle,
      foreground,
      background
    );
  }
  pushAttributed(scopePath, grammar) {
    if (scopePath === null) {
      return this;
    }
    if (scopePath.indexOf(" ") === -1) {
      return _AttributedScopeStack._pushAttributed(this, scopePath, grammar);
    }
    const scopes = scopePath.split(/ /g);
    let result = this;
    for (const scope of scopes) {
      result = _AttributedScopeStack._pushAttributed(result, scope, grammar);
    }
    return result;
  }
  static _pushAttributed(target, scopeName, grammar) {
    const rawMetadata = grammar.getMetadataForScope(scopeName);
    const newPath = target.scopePath.push(scopeName);
    const scopeThemeMatchResult = grammar.themeProvider.themeMatch(newPath);
    const metadata = _AttributedScopeStack.mergeAttributes(
      target.tokenAttributes,
      rawMetadata,
      scopeThemeMatchResult
    );
    return new _AttributedScopeStack(target, newPath, metadata);
  }
  getScopeNames() {
    return this.scopePath.getSegments();
  }
  getExtensionIfDefined(base) {
    const result = [];
    let self = this;
    while (self && self !== base) {
      result.push({
        encodedTokenAttributes: self.tokenAttributes,
        scopeNames: self.scopePath.getExtensionIfDefined(self.parent?.scopePath ?? null)
      });
      self = self.parent;
    }
    return self === base ? result.reverse() : void 0;
  }
};
var StateStackImpl = class _StateStackImpl {
  /**
   * Invariant:
   * ```
   * if (contentNameScopesList !== nameScopesList && contentNameScopesList?.parent !== nameScopesList) {
   * 	throw new Error();
   * }
   * if (this.parent && !nameScopesList.extends(this.parent.contentNameScopesList)) {
   * 	throw new Error();
   * }
   * ```
   */
  constructor(parent, ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
    this.parent = parent;
    this.ruleId = ruleId;
    this.beginRuleCapturedEOL = beginRuleCapturedEOL;
    this.endRule = endRule;
    this.nameScopesList = nameScopesList;
    this.contentNameScopesList = contentNameScopesList;
    this.depth = this.parent ? this.parent.depth + 1 : 1;
    this._enterPos = enterPos;
    this._anchorPos = anchorPos;
  }
  parent;
  ruleId;
  beginRuleCapturedEOL;
  endRule;
  nameScopesList;
  contentNameScopesList;
  _stackElementBrand = void 0;
  // TODO remove me
  static NULL = new _StateStackImpl(
    null,
    0,
    0,
    0,
    false,
    null,
    null,
    null
  );
  /**
   * The position on the current line where this state was pushed.
   * This is relevant only while tokenizing a line, to detect endless loops.
   * Its value is meaningless across lines.
   */
  _enterPos;
  /**
   * The captured anchor position when this stack element was pushed.
   * This is relevant only while tokenizing a line, to restore the anchor position when popping.
   * Its value is meaningless across lines.
   */
  _anchorPos;
  /**
   * The depth of the stack.
   */
  depth;
  equals(other) {
    if (other === null) {
      return false;
    }
    return _StateStackImpl._equals(this, other);
  }
  static _equals(a2, b3) {
    if (a2 === b3) {
      return true;
    }
    if (!this._structuralEquals(a2, b3)) {
      return false;
    }
    return AttributedScopeStack.equals(a2.contentNameScopesList, b3.contentNameScopesList);
  }
  /**
   * A structural equals check. Does not take into account `scopes`.
   */
  static _structuralEquals(a2, b3) {
    do {
      if (a2 === b3) {
        return true;
      }
      if (!a2 && !b3) {
        return true;
      }
      if (!a2 || !b3) {
        return false;
      }
      if (a2.depth !== b3.depth || a2.ruleId !== b3.ruleId || a2.endRule !== b3.endRule) {
        return false;
      }
      a2 = a2.parent;
      b3 = b3.parent;
    } while (true);
  }
  clone() {
    return this;
  }
  static _reset(el) {
    while (el) {
      el._enterPos = -1;
      el._anchorPos = -1;
      el = el.parent;
    }
  }
  reset() {
    _StateStackImpl._reset(this);
  }
  pop() {
    return this.parent;
  }
  safePop() {
    if (this.parent) {
      return this.parent;
    }
    return this;
  }
  push(ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
    return new _StateStackImpl(
      this,
      ruleId,
      enterPos,
      anchorPos,
      beginRuleCapturedEOL,
      endRule,
      nameScopesList,
      contentNameScopesList
    );
  }
  getEnterPos() {
    return this._enterPos;
  }
  getAnchorPos() {
    return this._anchorPos;
  }
  getRule(grammar) {
    return grammar.getRule(this.ruleId);
  }
  toString() {
    const r4 = [];
    this._writeString(r4, 0);
    return "[" + r4.join(",") + "]";
  }
  _writeString(res, outIndex) {
    if (this.parent) {
      outIndex = this.parent._writeString(res, outIndex);
    }
    res[outIndex++] = `(${this.ruleId}, ${this.nameScopesList?.toString()}, ${this.contentNameScopesList?.toString()})`;
    return outIndex;
  }
  withContentNameScopesList(contentNameScopeStack) {
    if (this.contentNameScopesList === contentNameScopeStack) {
      return this;
    }
    return this.parent.push(
      this.ruleId,
      this._enterPos,
      this._anchorPos,
      this.beginRuleCapturedEOL,
      this.endRule,
      this.nameScopesList,
      contentNameScopeStack
    );
  }
  withEndRule(endRule) {
    if (this.endRule === endRule) {
      return this;
    }
    return new _StateStackImpl(
      this.parent,
      this.ruleId,
      this._enterPos,
      this._anchorPos,
      this.beginRuleCapturedEOL,
      endRule,
      this.nameScopesList,
      this.contentNameScopesList
    );
  }
  // Used to warn of endless loops
  hasSameRuleAs(other) {
    let el = this;
    while (el && el._enterPos === other._enterPos) {
      if (el.ruleId === other.ruleId) {
        return true;
      }
      el = el.parent;
    }
    return false;
  }
  toStateStackFrame() {
    return {
      ruleId: ruleIdToNumber(this.ruleId),
      beginRuleCapturedEOL: this.beginRuleCapturedEOL,
      endRule: this.endRule,
      nameScopesList: this.nameScopesList?.getExtensionIfDefined(this.parent?.nameScopesList ?? null) ?? [],
      contentNameScopesList: this.contentNameScopesList?.getExtensionIfDefined(this.nameScopesList) ?? []
    };
  }
  static pushFrame(self, frame) {
    const namesScopeList = AttributedScopeStack.fromExtension(self?.nameScopesList ?? null, frame.nameScopesList);
    return new _StateStackImpl(
      self,
      ruleIdFromNumber(frame.ruleId),
      frame.enterPos ?? -1,
      frame.anchorPos ?? -1,
      frame.beginRuleCapturedEOL,
      frame.endRule,
      namesScopeList,
      AttributedScopeStack.fromExtension(namesScopeList, frame.contentNameScopesList)
    );
  }
};
var BalancedBracketSelectors = class {
  balancedBracketScopes;
  unbalancedBracketScopes;
  allowAny = false;
  constructor(balancedBracketScopes, unbalancedBracketScopes) {
    this.balancedBracketScopes = balancedBracketScopes.flatMap(
      (selector) => {
        if (selector === "*") {
          this.allowAny = true;
          return [];
        }
        return createMatchers(selector, nameMatcher).map((m3) => m3.matcher);
      }
    );
    this.unbalancedBracketScopes = unbalancedBracketScopes.flatMap(
      (selector) => createMatchers(selector, nameMatcher).map((m3) => m3.matcher)
    );
  }
  get matchesAlways() {
    return this.allowAny && this.unbalancedBracketScopes.length === 0;
  }
  get matchesNever() {
    return this.balancedBracketScopes.length === 0 && !this.allowAny;
  }
  match(scopes) {
    for (const excluder of this.unbalancedBracketScopes) {
      if (excluder(scopes)) {
        return false;
      }
    }
    for (const includer of this.balancedBracketScopes) {
      if (includer(scopes)) {
        return true;
      }
    }
    return this.allowAny;
  }
};
var LineTokens = class {
  constructor(emitBinaryTokens, lineText, tokenTypeOverrides, balancedBracketSelectors) {
    this.balancedBracketSelectors = balancedBracketSelectors;
    this._emitBinaryTokens = emitBinaryTokens;
    this._tokenTypeOverrides = tokenTypeOverrides;
    if (false) {
      this._lineText = lineText;
    } else {
      this._lineText = null;
    }
    this._tokens = [];
    this._binaryTokens = [];
    this._lastTokenEndIndex = 0;
  }
  balancedBracketSelectors;
  _emitBinaryTokens;
  /**
   * defined only if `false`.
   */
  _lineText;
  /**
   * used only if `_emitBinaryTokens` is false.
   */
  _tokens;
  /**
   * used only if `_emitBinaryTokens` is true.
   */
  _binaryTokens;
  _lastTokenEndIndex;
  _tokenTypeOverrides;
  produce(stack, endIndex) {
    this.produceFromScopes(stack.contentNameScopesList, endIndex);
  }
  produceFromScopes(scopesList, endIndex) {
    if (this._lastTokenEndIndex >= endIndex) {
      return;
    }
    if (this._emitBinaryTokens) {
      let metadata = scopesList?.tokenAttributes ?? 0;
      let containsBalancedBrackets = false;
      if (this.balancedBracketSelectors?.matchesAlways) {
        containsBalancedBrackets = true;
      }
      if (this._tokenTypeOverrides.length > 0 || this.balancedBracketSelectors && !this.balancedBracketSelectors.matchesAlways && !this.balancedBracketSelectors.matchesNever) {
        const scopes2 = scopesList?.getScopeNames() ?? [];
        for (const tokenType of this._tokenTypeOverrides) {
          if (tokenType.matcher(scopes2)) {
            metadata = EncodedTokenMetadata.set(
              metadata,
              0,
              toOptionalTokenType(tokenType.type),
              null,
              -1,
              0,
              0
            );
          }
        }
        if (this.balancedBracketSelectors) {
          containsBalancedBrackets = this.balancedBracketSelectors.match(scopes2);
        }
      }
      if (containsBalancedBrackets) {
        metadata = EncodedTokenMetadata.set(
          metadata,
          0,
          8,
          containsBalancedBrackets,
          -1,
          0,
          0
        );
      }
      if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 1] === metadata) {
        this._lastTokenEndIndex = endIndex;
        return;
      }
      this._binaryTokens.push(this._lastTokenEndIndex);
      this._binaryTokens.push(metadata);
      this._lastTokenEndIndex = endIndex;
      return;
    }
    const scopes = scopesList?.getScopeNames() ?? [];
    this._tokens.push({
      startIndex: this._lastTokenEndIndex,
      endIndex,
      // value: lineText.substring(lastTokenEndIndex, endIndex),
      scopes
    });
    this._lastTokenEndIndex = endIndex;
  }
  getResult(stack, lineLength) {
    if (this._tokens.length > 0 && this._tokens[this._tokens.length - 1].startIndex === lineLength - 1) {
      this._tokens.pop();
    }
    if (this._tokens.length === 0) {
      this._lastTokenEndIndex = -1;
      this.produce(stack, lineLength);
      this._tokens[this._tokens.length - 1].startIndex = 0;
    }
    return this._tokens;
  }
  getBinaryResult(stack, lineLength) {
    if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 2] === lineLength - 1) {
      this._binaryTokens.pop();
      this._binaryTokens.pop();
    }
    if (this._binaryTokens.length === 0) {
      this._lastTokenEndIndex = -1;
      this.produce(stack, lineLength);
      this._binaryTokens[this._binaryTokens.length - 2] = 0;
    }
    const result = new Uint32Array(this._binaryTokens.length);
    for (let i2 = 0, len = this._binaryTokens.length; i2 < len; i2++) {
      result[i2] = this._binaryTokens[i2];
    }
    return result;
  }
};
var SyncRegistry = class {
  constructor(theme, _onigLib) {
    this._onigLib = _onigLib;
    this._theme = theme;
  }
  _onigLib;
  _grammars = /* @__PURE__ */ new Map();
  _rawGrammars = /* @__PURE__ */ new Map();
  _injectionGrammars = /* @__PURE__ */ new Map();
  _theme;
  dispose() {
    for (const grammar of this._grammars.values()) {
      grammar.dispose();
    }
  }
  setTheme(theme) {
    this._theme = theme;
  }
  getColorMap() {
    return this._theme.getColorMap();
  }
  /**
   * Add `grammar` to registry and return a list of referenced scope names
   */
  addGrammar(grammar, injectionScopeNames) {
    this._rawGrammars.set(grammar.scopeName, grammar);
    if (injectionScopeNames) {
      this._injectionGrammars.set(grammar.scopeName, injectionScopeNames);
    }
  }
  /**
   * Lookup a raw grammar.
   */
  lookup(scopeName) {
    return this._rawGrammars.get(scopeName);
  }
  /**
   * Returns the injections for the given grammar
   */
  injections(targetScope) {
    return this._injectionGrammars.get(targetScope);
  }
  /**
   * Get the default theme settings
   */
  getDefaults() {
    return this._theme.getDefaults();
  }
  /**
   * Match a scope in the theme.
   */
  themeMatch(scopePath) {
    return this._theme.match(scopePath);
  }
  /**
   * Lookup a grammar.
   */
  grammarForScopeName(scopeName, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors) {
    if (!this._grammars.has(scopeName)) {
      let rawGrammar = this._rawGrammars.get(scopeName);
      if (!rawGrammar) {
        return null;
      }
      this._grammars.set(scopeName, createGrammar(
        scopeName,
        rawGrammar,
        initialLanguage,
        embeddedLanguages,
        tokenTypes,
        balancedBracketSelectors,
        this,
        this._onigLib
      ));
    }
    return this._grammars.get(scopeName);
  }
};
var Registry = class {
  _options;
  _syncRegistry;
  _ensureGrammarCache;
  constructor(options) {
    this._options = options;
    this._syncRegistry = new SyncRegistry(
      Theme.createFromRawTheme(options.theme, options.colorMap),
      options.onigLib
    );
    this._ensureGrammarCache = /* @__PURE__ */ new Map();
  }
  dispose() {
    this._syncRegistry.dispose();
  }
  /**
   * Change the theme. Once called, no previous `ruleStack` should be used anymore.
   */
  setTheme(theme, colorMap) {
    this._syncRegistry.setTheme(Theme.createFromRawTheme(theme, colorMap));
  }
  /**
   * Returns a lookup array for color ids.
   */
  getColorMap() {
    return this._syncRegistry.getColorMap();
  }
  /**
   * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
   * Please do not use language id 0.
   */
  loadGrammarWithEmbeddedLanguages(initialScopeName, initialLanguage, embeddedLanguages) {
    return this.loadGrammarWithConfiguration(initialScopeName, initialLanguage, { embeddedLanguages });
  }
  /**
   * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
   * Please do not use language id 0.
   */
  loadGrammarWithConfiguration(initialScopeName, initialLanguage, configuration) {
    return this._loadGrammar(
      initialScopeName,
      initialLanguage,
      configuration.embeddedLanguages,
      configuration.tokenTypes,
      new BalancedBracketSelectors(
        configuration.balancedBracketSelectors || [],
        configuration.unbalancedBracketSelectors || []
      )
    );
  }
  /**
   * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
   */
  loadGrammar(initialScopeName) {
    return this._loadGrammar(initialScopeName, 0, null, null, null);
  }
  _loadGrammar(initialScopeName, initialLanguage, embeddedLanguages, tokenTypes, balancedBracketSelectors) {
    const dependencyProcessor = new ScopeDependencyProcessor(this._syncRegistry, initialScopeName);
    while (dependencyProcessor.Q.length > 0) {
      dependencyProcessor.Q.map((request) => this._loadSingleGrammar(request.scopeName));
      dependencyProcessor.processQueue();
    }
    return this._grammarForScopeName(
      initialScopeName,
      initialLanguage,
      embeddedLanguages,
      tokenTypes,
      balancedBracketSelectors
    );
  }
  _loadSingleGrammar(scopeName) {
    if (!this._ensureGrammarCache.has(scopeName)) {
      this._doLoadSingleGrammar(scopeName);
      this._ensureGrammarCache.set(scopeName, true);
    }
  }
  _doLoadSingleGrammar(scopeName) {
    const grammar = this._options.loadGrammar(scopeName);
    if (grammar) {
      const injections = typeof this._options.getInjections === "function" ? this._options.getInjections(scopeName) : void 0;
      this._syncRegistry.addGrammar(grammar, injections);
    }
  }
  /**
   * Adds a rawGrammar.
   */
  addGrammar(rawGrammar, injections = [], initialLanguage = 0, embeddedLanguages = null) {
    this._syncRegistry.addGrammar(rawGrammar, injections);
    return this._grammarForScopeName(rawGrammar.scopeName, initialLanguage, embeddedLanguages);
  }
  /**
   * Get the grammar for `scopeName`. The grammar must first be created via `loadGrammar` or `addGrammar`.
   */
  _grammarForScopeName(scopeName, initialLanguage = 0, embeddedLanguages = null, tokenTypes = null, balancedBracketSelectors = null) {
    return this._syncRegistry.grammarForScopeName(
      scopeName,
      initialLanguage,
      embeddedLanguages,
      tokenTypes,
      balancedBracketSelectors
    );
  }
};
var INITIAL = StateStackImpl.NULL;

// node_modules/@shikijs/primitive/dist/index.mjs
function resolveColorReplacements(theme, options) {
  const replacements = typeof theme === "string" ? {} : { ...theme.colorReplacements };
  const themeName = typeof theme === "string" ? theme : theme.name;
  for (const [key2, value] of Object.entries(options?.colorReplacements || {})) if (typeof value === "string") replacements[key2] = value;
  else if (key2 === themeName) Object.assign(replacements, value);
  return replacements;
}
function applyColorReplacements(color, replacements) {
  if (!color) return color;
  return replacements?.[color?.toLowerCase()] || color;
}
function toArray(x3) {
  return Array.isArray(x3) ? x3 : [x3];
}
async function normalizeGetter(p2) {
  return Promise.resolve(typeof p2 === "function" ? p2() : p2).then((r4) => r4.default || r4);
}
function isPlainLang(lang) {
  return !lang || [
    "plaintext",
    "txt",
    "text",
    "plain"
  ].includes(lang);
}
function isSpecialLang(lang) {
  return lang === "ansi" || isPlainLang(lang);
}
function isNoneTheme(theme) {
  return theme === "none";
}
function isSpecialTheme(theme) {
  return isNoneTheme(theme);
}
var RE_NEWLINE = /(\r?\n)/g;
function splitLines(code, preserveEnding = false) {
  if (code.length === 0) return [["", 0]];
  const parts = code.split(RE_NEWLINE);
  let index = 0;
  const lines = [];
  for (let i2 = 0; i2 < parts.length; i2 += 2) {
    const line = preserveEnding ? parts[i2] + (parts[i2 + 1] || "") : parts[i2];
    lines.push([line, index]);
    index += parts[i2].length;
    index += parts[i2 + 1]?.length || 0;
  }
  return lines;
}
var VSCODE_FALLBACK_EDITOR_FG = {
  light: "#333333",
  dark: "#bbbbbb"
};
var VSCODE_FALLBACK_EDITOR_BG = {
  light: "#fffffe",
  dark: "#1e1e1e"
};
var RESOLVED_KEY = "__shiki_resolved";
function normalizeTheme(rawTheme) {
  if (rawTheme?.[RESOLVED_KEY]) return rawTheme;
  const theme = { ...rawTheme };
  if (theme.tokenColors && !theme.settings) {
    theme.settings = theme.tokenColors;
    delete theme.tokenColors;
  }
  theme.type ||= "dark";
  theme.colorReplacements = { ...theme.colorReplacements };
  theme.settings ||= [];
  let { bg, fg } = theme;
  if (!bg || !fg) {
    const globalSetting = theme.settings ? theme.settings.find((s2) => !s2.name && !s2.scope) : void 0;
    if (globalSetting?.settings?.foreground) fg = globalSetting.settings.foreground;
    if (globalSetting?.settings?.background) bg = globalSetting.settings.background;
    if (!fg && theme?.colors?.["editor.foreground"]) fg = theme.colors["editor.foreground"];
    if (!bg && theme?.colors?.["editor.background"]) bg = theme.colors["editor.background"];
    if (!fg) fg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark;
    if (!bg) bg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark;
    theme.fg = fg;
    theme.bg = bg;
  }
  if (!(theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope)) theme.settings.unshift({ settings: {
    foreground: theme.fg,
    background: theme.bg
  } });
  let replacementCount = 0;
  const replacementMap = /* @__PURE__ */ new Map();
  function getReplacementColor(value) {
    if (replacementMap.has(value)) return replacementMap.get(value);
    replacementCount += 1;
    const hex = `#${replacementCount.toString(16).padStart(8, "0").toLowerCase()}`;
    if (theme.colorReplacements?.[`#${hex}`]) return getReplacementColor(value);
    replacementMap.set(value, hex);
    return hex;
  }
  theme.settings = theme.settings.map((setting) => {
    const replaceFg = setting.settings?.foreground && !setting.settings.foreground.startsWith("#");
    const replaceBg = setting.settings?.background && !setting.settings.background.startsWith("#");
    if (!replaceFg && !replaceBg) return setting;
    const clone2 = {
      ...setting,
      settings: { ...setting.settings }
    };
    if (replaceFg) {
      const replacement = getReplacementColor(setting.settings.foreground);
      theme.colorReplacements[replacement] = setting.settings.foreground;
      clone2.settings.foreground = replacement;
    }
    if (replaceBg) {
      const replacement = getReplacementColor(setting.settings.background);
      theme.colorReplacements[replacement] = setting.settings.background;
      clone2.settings.background = replacement;
    }
    return clone2;
  });
  for (const key2 of Object.keys(theme.colors || {})) if (key2 === "editor.foreground" || key2 === "editor.background" || key2.startsWith("terminal.ansi")) {
    if (!theme.colors[key2]?.startsWith("#")) {
      const replacement = getReplacementColor(theme.colors[key2]);
      theme.colorReplacements[replacement] = theme.colors[key2];
      theme.colors[key2] = replacement;
    }
  }
  Object.defineProperty(theme, RESOLVED_KEY, {
    enumerable: false,
    writable: false,
    value: true
  });
  return theme;
}
async function resolveLangs(langs) {
  return [...new Set((await Promise.all(langs.filter((l3) => !isSpecialLang(l3)).map(async (lang) => await normalizeGetter(lang).then((r4) => Array.isArray(r4) ? r4 : [r4])))).flat())];
}
async function resolveThemes(themes) {
  return (await Promise.all(themes.map(async (theme) => isSpecialTheme(theme) ? null : normalizeTheme(await normalizeGetter(theme))))).filter((i2) => !!i2);
}
function resolveLangAlias(name, alias) {
  if (!alias) return name;
  if (alias[name]) {
    const resolved = /* @__PURE__ */ new Set([name]);
    while (alias[name]) {
      name = alias[name];
      if (resolved.has(name)) throw new ShikiError(`Circular alias \`${[...resolved].join(" -> ")} -> ${name}\``);
      resolved.add(name);
    }
  }
  return name;
}
var Registry2 = class extends Registry {
  _resolver;
  _themes;
  _langs;
  _alias;
  _resolvedThemes = /* @__PURE__ */ new Map();
  _resolvedGrammars = /* @__PURE__ */ new Map();
  _langMap = /* @__PURE__ */ new Map();
  _langGraph = /* @__PURE__ */ new Map();
  _textmateThemeCache = /* @__PURE__ */ new WeakMap();
  _loadedThemesCache = null;
  _loadedLanguagesCache = null;
  constructor(_resolver, _themes, _langs, _alias = {}) {
    super(_resolver);
    this._resolver = _resolver;
    this._themes = _themes;
    this._langs = _langs;
    this._alias = _alias;
    this._themes.map((t) => this.loadTheme(t));
    this.loadLanguages(this._langs);
  }
  getTheme(theme) {
    if (typeof theme === "string") return this._resolvedThemes.get(theme);
    else return this.loadTheme(theme);
  }
  loadTheme(theme) {
    const _theme = normalizeTheme(theme);
    if (_theme.name) {
      this._resolvedThemes.set(_theme.name, _theme);
      this._loadedThemesCache = null;
    }
    return _theme;
  }
  getLoadedThemes() {
    if (!this._loadedThemesCache) this._loadedThemesCache = [...this._resolvedThemes.keys()];
    return this._loadedThemesCache;
  }
  setTheme(theme) {
    let textmateTheme = this._textmateThemeCache.get(theme);
    if (!textmateTheme) {
      textmateTheme = Theme.createFromRawTheme(theme);
      this._textmateThemeCache.set(theme, textmateTheme);
    }
    this._syncRegistry.setTheme(textmateTheme);
  }
  getGrammar(name) {
    name = resolveLangAlias(name, this._alias);
    return this._resolvedGrammars.get(name);
  }
  loadLanguage(lang) {
    if (this.getGrammar(lang.name)) return;
    const embeddedLazilyBy = new Set([...this._langMap.values()].filter((i2) => i2.embeddedLangsLazy?.includes(lang.name)));
    this._resolver.addLanguage(lang);
    const grammarConfig = {
      balancedBracketSelectors: lang.balancedBracketSelectors || ["*"],
      unbalancedBracketSelectors: lang.unbalancedBracketSelectors || []
    };
    this._syncRegistry._rawGrammars.set(lang.scopeName, lang);
    const g = this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig);
    g.name = lang.name;
    this._resolvedGrammars.set(lang.name, g);
    if (lang.aliases) lang.aliases.forEach((alias) => {
      this._alias[alias] = lang.name;
    });
    this._loadedLanguagesCache = null;
    for (const e of embeddedLazilyBy) this.reloadLanguage(e);
    if (lang.injectTo) {
      const targets = [...this._langMap.values()].filter((i2) => i2 !== lang && this._resolvedGrammars.has(i2.name) && lang.injectTo.some((scope) => i2.scopeName === scope || i2.scopeName.startsWith(`${scope}.`)) && !this.hasCurrentInjections(i2.scopeName));
      for (const target of targets) this.reloadLanguage(target);
    }
  }
  hasCurrentInjections(scopeName) {
    const loaded = this._syncRegistry?._injectionGrammars?.get(scopeName) || [];
    const current = this._resolver.getInjections(scopeName) || [];
    return loaded.length === current.length && loaded.every((s2, i2) => s2 === current[i2]);
  }
  reloadLanguage(lang) {
    this._syncRegistry?._grammars?.get(lang.scopeName)?.dispose();
    this._resolvedGrammars.delete(lang.name);
    this._loadedLanguagesCache = null;
    this._syncRegistry?._grammars?.delete(lang.scopeName);
    this._syncRegistry?._injectionGrammars?.set(lang.scopeName, this._resolver.getInjections(lang.scopeName) || []);
    this.loadLanguage(this._langMap.get(lang.name) || lang);
  }
  dispose() {
    super.dispose();
    this._resolvedThemes.clear();
    this._resolvedGrammars.clear();
    this._langMap.clear();
    this._langGraph.clear();
    this._loadedThemesCache = null;
  }
  loadLanguages(langs) {
    for (const lang of langs) this.resolveEmbeddedLanguages(lang);
    const langsGraphArray = [...this._langGraph.entries()];
    const missingLangs = langsGraphArray.filter(([_3, lang]) => !lang);
    if (missingLangs.length) {
      const dependents = langsGraphArray.filter(([_3, lang]) => {
        if (!lang) return false;
        return (lang.embeddedLanguages || lang.embeddedLangs)?.some((l3) => missingLangs.map(([name]) => name).includes(l3));
      }).filter((lang) => !missingLangs.includes(lang));
      throw new ShikiError(`Missing languages ${missingLangs.map(([name]) => `\`${name}\``).join(", ")}, required by ${dependents.map(([name]) => `\`${name}\``).join(", ")}`);
    }
    for (const [_3, lang] of langsGraphArray) this._resolver.addLanguage(lang);
    for (const [_3, lang] of langsGraphArray) this.loadLanguage(lang);
  }
  getLoadedLanguages() {
    if (!this._loadedLanguagesCache) this._loadedLanguagesCache = [.../* @__PURE__ */ new Set([...this._resolvedGrammars.keys(), ...Object.keys(this._alias)])];
    return this._loadedLanguagesCache;
  }
  resolveEmbeddedLanguages(lang) {
    this._langMap.set(lang.name, lang);
    this._langGraph.set(lang.name, lang);
    const embedded = lang.embeddedLanguages ?? lang.embeddedLangs;
    if (embedded) for (const embeddedLang of embedded) this._langGraph.set(embeddedLang, this._langMap.get(embeddedLang));
  }
};
var Resolver = class {
  _langs = /* @__PURE__ */ new Map();
  _scopeToLang = /* @__PURE__ */ new Map();
  _injections = /* @__PURE__ */ new Map();
  _onigLib;
  constructor(engine, langs) {
    this._onigLib = {
      createOnigScanner: (patterns) => engine.createScanner(patterns),
      createOnigString: (s2) => engine.createString(s2)
    };
    langs.forEach((i2) => this.addLanguage(i2));
  }
  get onigLib() {
    return this._onigLib;
  }
  getLangRegistration(langIdOrAlias) {
    return this._langs.get(langIdOrAlias);
  }
  loadGrammar(scopeName) {
    return this._scopeToLang.get(scopeName);
  }
  addLanguage(l3) {
    this._langs.set(l3.name, l3);
    if (l3.aliases) l3.aliases.forEach((a2) => {
      this._langs.set(a2, l3);
    });
    this._scopeToLang.set(l3.scopeName, l3);
    if (l3.injectTo) l3.injectTo.forEach((i2) => {
      if (!this._injections.get(i2)) this._injections.set(i2, []);
      if (!this._injections.get(i2).includes(l3.scopeName)) this._injections.get(i2).push(l3.scopeName);
    });
  }
  getInjections(scopeName) {
    const scopeParts = scopeName.split(".");
    let injections = [];
    for (let i2 = 1; i2 <= scopeParts.length; i2++) {
      const subScopeName = scopeParts.slice(0, i2).join(".");
      injections = [...injections, ...this._injections.get(subScopeName) || []];
    }
    return injections;
  }
};
var instancesCount = 0;
function createShikiPrimitive(options) {
  instancesCount += 1;
  if (options.warnings !== false && instancesCount >= 10 && instancesCount % 10 === 0) console.warn(`[Shiki] ${instancesCount} instances have been created. Shiki is supposed to be used as a singleton, consider refactoring your code to cache your highlighter instance; Or call \`highlighter.dispose()\` to release unused instances.`);
  let isDisposed = false;
  if (!options.engine) throw new ShikiError("`engine` option is required for synchronous mode");
  const langs = (options.langs || []).flat(1);
  const themes = (options.themes || []).flat(1).map(normalizeTheme);
  const _registry = new Registry2(new Resolver(options.engine, langs), themes, langs, options.langAlias);
  let _lastTheme;
  function resolveLangAlias$1(name) {
    return resolveLangAlias(name, options.langAlias);
  }
  function getLanguage(name) {
    ensureNotDisposed();
    const _lang = _registry.getGrammar(typeof name === "string" ? name : name.name);
    if (!_lang) throw new ShikiError(`Language \`${name}\` not found, you may need to load it first`);
    return _lang;
  }
  function getTheme(name) {
    if (name === "none") return {
      bg: "",
      fg: "",
      name: "none",
      settings: [],
      type: "dark"
    };
    ensureNotDisposed();
    const _theme = _registry.getTheme(name);
    if (!_theme) throw new ShikiError(`Theme \`${name}\` not found, you may need to load it first`);
    return _theme;
  }
  function setTheme(name) {
    ensureNotDisposed();
    const theme = getTheme(name);
    if (_lastTheme !== name) {
      _registry.setTheme(theme);
      _lastTheme = name;
    }
    return {
      theme,
      colorMap: _registry.getColorMap()
    };
  }
  function getLoadedThemes() {
    ensureNotDisposed();
    return _registry.getLoadedThemes();
  }
  function getLoadedLanguages() {
    ensureNotDisposed();
    return _registry.getLoadedLanguages();
  }
  function loadLanguageSync(...langs2) {
    ensureNotDisposed();
    _registry.loadLanguages(langs2.flat(1));
  }
  async function loadLanguage(...langs2) {
    return loadLanguageSync(await resolveLangs(langs2));
  }
  function loadThemeSync(...themes2) {
    ensureNotDisposed();
    for (const theme of themes2.flat(1)) _registry.loadTheme(theme);
  }
  async function loadTheme(...themes2) {
    ensureNotDisposed();
    return loadThemeSync(await resolveThemes(themes2));
  }
  function ensureNotDisposed() {
    if (isDisposed) throw new ShikiError("Shiki instance has been disposed");
  }
  function dispose() {
    if (isDisposed) return;
    isDisposed = true;
    _registry.dispose();
    instancesCount -= 1;
  }
  return {
    setTheme,
    getTheme,
    getLanguage,
    getLoadedThemes,
    getLoadedLanguages,
    resolveLangAlias: resolveLangAlias$1,
    loadLanguage,
    loadLanguageSync,
    loadTheme,
    loadThemeSync,
    dispose,
    [Symbol.dispose]: dispose
  };
}
var _grammarStateMap = /* @__PURE__ */ new WeakMap();
function setLastGrammarStateToMap(keys, state) {
  _grammarStateMap.set(keys, state);
}
function getLastGrammarStateFromMap(keys) {
  return _grammarStateMap.get(keys);
}
var GrammarState = class GrammarState2 {
  /**
  * Theme to Stack mapping
  */
  _stacks = {};
  lang;
  get themes() {
    return Object.keys(this._stacks);
  }
  get theme() {
    return this.themes[0];
  }
  get _stack() {
    return this._stacks[this.theme];
  }
  /**
  * Static method to create a initial grammar state.
  */
  static initial(lang, themes) {
    return new GrammarState2(Object.fromEntries(toArray(themes).map((theme) => [theme, INITIAL])), lang);
  }
  constructor(...args) {
    if (args.length === 2) {
      const [stacksMap, lang] = args;
      this.lang = lang;
      this._stacks = stacksMap;
    } else {
      const [stack, lang, theme] = args;
      this.lang = lang;
      this._stacks = { [theme]: stack };
    }
  }
  /**
  * Get the internal stack object.
  * @internal
  */
  getInternalStack(theme = this.theme) {
    return this._stacks[theme];
  }
  getScopes(theme = this.theme) {
    return getScopes(this._stacks[theme]);
  }
  toJSON() {
    return {
      lang: this.lang,
      theme: this.theme,
      themes: this.themes,
      scopes: this.getScopes()
    };
  }
};
function getScopes(stack) {
  const scopes = [];
  const visited = /* @__PURE__ */ new Set();
  function pushScope(stack2) {
    if (visited.has(stack2)) return;
    visited.add(stack2);
    const name = stack2?.nameScopesList?.scopeName;
    if (name) scopes.push(name);
    if (stack2.parent) pushScope(stack2.parent);
  }
  pushScope(stack);
  return scopes;
}
function getGrammarStack(state, theme) {
  if (!(state instanceof GrammarState)) throw new ShikiError("Invalid grammar state");
  return state.getInternalStack(theme);
}
var RE_COMMA = /,/;
var RE_SPACE = / /;
function codeToTokensBase(primitive, code, options = {}) {
  const { theme: themeName = primitive.getLoadedThemes()[0] } = options;
  if (isPlainLang(primitive.resolveLangAlias(options.lang || "text")) || isNoneTheme(themeName)) return splitLines(code).map((line) => [{
    content: line[0],
    offset: line[1]
  }]);
  const { theme, colorMap } = primitive.setTheme(themeName);
  const _grammar = primitive.getLanguage(options.lang || "text");
  if (options.grammarState) {
    if (options.grammarState.lang !== _grammar.name) throw new ShikiError(`Grammar state language "${options.grammarState.lang}" does not match highlight language "${_grammar.name}"`);
    if (!options.grammarState.themes.includes(theme.name)) throw new ShikiError(`Grammar state themes "${options.grammarState.themes}" do not contain highlight theme "${theme.name}"`);
  }
  return tokenizeWithTheme(code, _grammar, theme, colorMap, options);
}
function getLastGrammarState(...args) {
  if (args.length === 2) return getLastGrammarStateFromMap(args[1]);
  const [primitive, code, options = {}] = args;
  const { lang = "text", theme: themeName = primitive.getLoadedThemes()[0] } = options;
  if (isPlainLang(lang) || isNoneTheme(themeName)) throw new ShikiError("Plain language does not have grammar state");
  if (lang === "ansi") throw new ShikiError("ANSI language does not have grammar state");
  const { theme, colorMap } = primitive.setTheme(themeName);
  const _grammar = primitive.getLanguage(lang);
  return new GrammarState(_tokenizeWithTheme(code, _grammar, theme, colorMap, options).stateStack, _grammar.name, theme.name);
}
function tokenizeWithTheme(code, grammar, theme, colorMap, options) {
  const result = _tokenizeWithTheme(code, grammar, theme, colorMap, options);
  const grammarState = new GrammarState(result.stateStack, grammar.name, theme.name);
  setLastGrammarStateToMap(result.tokens, grammarState);
  return result.tokens;
}
function _tokenizeWithTheme(code, grammar, theme, colorMap, options) {
  const colorReplacements = resolveColorReplacements(theme, options);
  const { tokenizeMaxLineLength = 0, tokenizeTimeLimit = 500, includeExplanation = false } = options;
  const lines = splitLines(code);
  let stateStack = options.grammarState ? getGrammarStack(options.grammarState, theme.name) ?? INITIAL : options.grammarContextCode != null ? _tokenizeWithTheme(options.grammarContextCode, grammar, theme, colorMap, {
    ...options,
    grammarState: void 0,
    grammarContextCode: void 0
  }).stateStack : INITIAL;
  let actual = [];
  const final = [];
  for (let i2 = 0, len = lines.length; i2 < len; i2++) {
    const [line, lineOffset] = lines[i2];
    if (line === "") {
      actual = [];
      final.push([]);
      continue;
    }
    if (tokenizeMaxLineLength > 0 && line.length >= tokenizeMaxLineLength) {
      actual = [];
      final.push([{
        content: line,
        offset: lineOffset,
        color: "",
        fontStyle: 0
      }]);
      continue;
    }
    let resultWithScopes;
    let tokensWithScopes;
    let tokensWithScopesIndex;
    if (includeExplanation && includeExplanation !== "tokenType") {
      resultWithScopes = grammar.tokenizeLine(line, stateStack, tokenizeTimeLimit);
      tokensWithScopes = resultWithScopes.tokens;
      tokensWithScopesIndex = 0;
    }
    const result = grammar.tokenizeLine2(line, stateStack, tokenizeTimeLimit);
    const tokensLength = result.tokens.length / 2;
    for (let j2 = 0; j2 < tokensLength; j2++) {
      const startIndex = result.tokens[2 * j2];
      const nextStartIndex = j2 + 1 < tokensLength ? result.tokens[2 * j2 + 2] : line.length;
      if (startIndex === nextStartIndex) continue;
      const metadata = result.tokens[2 * j2 + 1];
      const color = applyColorReplacements(colorMap[EncodedTokenMetadata.getForeground(metadata)], colorReplacements);
      const fontStyle = EncodedTokenMetadata.getFontStyle(metadata);
      const token2 = {
        content: line.substring(startIndex, nextStartIndex),
        offset: lineOffset + startIndex,
        color,
        fontStyle
      };
      if (includeExplanation === "tokenType") token2.type = EncodedTokenMetadata.getTokenType(metadata);
      else if (includeExplanation) {
        const themeSettingsSelectors = [];
        if (includeExplanation !== "scopeName") for (const setting of theme.settings) {
          let selectors;
          switch (typeof setting.scope) {
            case "string":
              selectors = setting.scope.split(RE_COMMA).map((scope) => scope.trim());
              break;
            case "object":
              selectors = setting.scope;
              break;
            default:
              continue;
          }
          themeSettingsSelectors.push({
            settings: setting,
            selectors: selectors.map((selector) => selector.split(RE_SPACE))
          });
        }
        token2.explanation = [];
        let offset = 0;
        while (startIndex + offset < nextStartIndex) {
          const tokenWithScopes = tokensWithScopes[tokensWithScopesIndex];
          const tokenWithScopesText = line.substring(tokenWithScopes.startIndex, tokenWithScopes.endIndex);
          offset += tokenWithScopesText.length;
          token2.explanation.push({
            content: tokenWithScopesText,
            scopes: includeExplanation === "scopeName" ? explainThemeScopesNameOnly(tokenWithScopes.scopes) : explainThemeScopesFull(themeSettingsSelectors, tokenWithScopes.scopes)
          });
          tokensWithScopesIndex += 1;
        }
      }
      actual.push(token2);
    }
    final.push(actual);
    actual = [];
    stateStack = result.ruleStack;
  }
  return {
    tokens: final,
    stateStack
  };
}
function explainThemeScopesNameOnly(scopes) {
  return scopes.map((scope) => ({ scopeName: scope }));
}
function explainThemeScopesFull(themeSelectors, scopes) {
  const result = [];
  for (let i2 = 0, len = scopes.length; i2 < len; i2++) {
    const scope = scopes[i2];
    result[i2] = {
      scopeName: scope,
      themeMatches: explainThemeScope(themeSelectors, scope, scopes.slice(0, i2))
    };
  }
  return result;
}
function matchesOne(selector, scope) {
  return selector === scope || scope.substring(0, selector.length) === selector && scope[selector.length] === ".";
}
function matches(selectors, scope, parentScopes) {
  if (!matchesOne(selectors.at(-1), scope)) return false;
  let selectorParentIndex = selectors.length - 2;
  let parentIndex = parentScopes.length - 1;
  while (selectorParentIndex >= 0 && parentIndex >= 0) {
    if (matchesOne(selectors[selectorParentIndex], parentScopes[parentIndex])) selectorParentIndex -= 1;
    parentIndex -= 1;
  }
  if (selectorParentIndex === -1) return true;
  return false;
}
function explainThemeScope(themeSettingsSelectors, scope, parentScopes) {
  const result = [];
  for (const { selectors, settings } of themeSettingsSelectors) for (const selectorPieces of selectors) if (matches(selectorPieces, scope, parentScopes)) {
    result.push(settings);
    break;
  }
  return result;
}
function codeToTokensWithThemes(primitive, code, options, codeToTokensBaseFn = codeToTokensBase) {
  const themes = Object.entries(options.themes).filter((i2) => i2[1]).map((i2) => ({
    color: i2[0],
    theme: i2[1]
  }));
  const themedTokens = themes.map((t) => {
    const tokens2 = codeToTokensBaseFn(primitive, code, {
      ...options,
      theme: t.theme
    });
    return {
      tokens: tokens2,
      state: getLastGrammarStateFromMap(tokens2),
      theme: typeof t.theme === "string" ? t.theme : t.theme.name
    };
  });
  const tokens = alignThemesTokenization(...themedTokens.map((i2) => i2.tokens));
  const mergedTokens = tokens[0].map((line, lineIdx) => line.map((_token, tokenIdx) => {
    const mergedToken = {
      content: _token.content,
      variants: {},
      offset: _token.offset
    };
    if ("includeExplanation" in options && options.includeExplanation) mergedToken.explanation = _token.explanation;
    tokens.forEach((t, themeIdx) => {
      const { content: _3, explanation: __, offset: ___, ...styles } = t[lineIdx][tokenIdx];
      mergedToken.variants[themes[themeIdx].color] = styles;
    });
    return mergedToken;
  }));
  const mergedGrammarState = themedTokens[0].state ? new GrammarState(Object.fromEntries(themedTokens.map((s2) => [s2.theme, s2.state?.getInternalStack(s2.theme)])), themedTokens[0].state.lang) : void 0;
  if (mergedGrammarState) setLastGrammarStateToMap(mergedTokens, mergedGrammarState);
  return mergedTokens;
}
function alignThemesTokenization(...themes) {
  const outThemes = themes.map(() => []);
  const count = themes.length;
  for (let i2 = 0; i2 < themes[0].length; i2++) {
    const lines = themes.map((t) => t[i2]);
    const outLines = outThemes.map(() => []);
    outThemes.forEach((t, i3) => t.push(outLines[i3]));
    const indexes = lines.map(() => 0);
    const current = lines.map((l3) => l3[0]);
    while (current.every((t) => t)) {
      const minLength = Math.min(...current.map((t) => t.content.length));
      for (let n = 0; n < count; n++) {
        const token2 = current[n];
        if (token2.content.length === minLength) {
          outLines[n].push(token2);
          indexes[n] += 1;
          current[n] = lines[n][indexes[n]];
        } else {
          outLines[n].push({
            ...token2,
            content: token2.content.slice(0, minLength)
          });
          current[n] = {
            ...token2,
            content: token2.content.slice(minLength),
            offset: token2.offset + minLength
          };
        }
      }
    }
  }
  return outThemes;
}

// node_modules/html-void-elements/index.js
var htmlVoidElements = [
  "area",
  "base",
  "basefont",
  "bgsound",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "image",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

// node_modules/property-information/lib/util/schema.js
var Schema = class {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(property, normal, space) {
    this.normal = normal;
    this.property = property;
    if (space) {
      this.space = space;
    }
  }
};
Schema.prototype.normal = {};
Schema.prototype.property = {};
Schema.prototype.space = void 0;

// node_modules/property-information/lib/util/merge.js
function merge(definitions, space) {
  const property = {};
  const normal = {};
  for (const definition of definitions) {
    Object.assign(property, definition.property);
    Object.assign(normal, definition.normal);
  }
  return new Schema(property, normal, space);
}

// node_modules/property-information/lib/normalize.js
function normalize(value) {
  return value.toLowerCase();
}

// node_modules/property-information/lib/util/info.js
var Info = class {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(property, attribute) {
    this.attribute = attribute;
    this.property = property;
  }
};
Info.prototype.attribute = "";
Info.prototype.booleanish = false;
Info.prototype.boolean = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.commaSeparated = false;
Info.prototype.defined = false;
Info.prototype.mustUseProperty = false;
Info.prototype.number = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.property = "";
Info.prototype.spaceSeparated = false;
Info.prototype.space = void 0;

// node_modules/property-information/lib/util/types.js
var types_exports = {};
__export(types_exports, {
  boolean: () => boolean,
  booleanish: () => booleanish,
  commaOrSpaceSeparated: () => commaOrSpaceSeparated,
  commaSeparated: () => commaSeparated,
  number: () => number,
  overloadedBoolean: () => overloadedBoolean,
  spaceSeparated: () => spaceSeparated
});
var powers = 0;
var boolean = increment();
var booleanish = increment();
var overloadedBoolean = increment();
var number = increment();
var spaceSeparated = increment();
var commaSeparated = increment();
var commaOrSpaceSeparated = increment();
function increment() {
  return 2 ** ++powers;
}

// node_modules/property-information/lib/util/defined-info.js
var checks = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(types_exports)
);
var DefinedInfo = class extends Info {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(property, attribute, mask, space) {
    let index = -1;
    super(property, attribute);
    mark(this, "space", space);
    if (typeof mask === "number") {
      while (++index < checks.length) {
        const check = checks[index];
        mark(this, checks[index], (mask & types_exports[check]) === types_exports[check]);
      }
    }
  }
};
DefinedInfo.prototype.defined = true;
function mark(values, key2, value) {
  if (value) {
    values[key2] = value;
  }
}

// node_modules/property-information/lib/util/create.js
function create(definition) {
  const properties = {};
  const normals = {};
  for (const [property, value] of Object.entries(definition.properties)) {
    const info = new DefinedInfo(
      property,
      definition.transform(definition.attributes || {}, property),
      value,
      definition.space
    );
    if (definition.mustUseProperty && definition.mustUseProperty.includes(property)) {
      info.mustUseProperty = true;
    }
    properties[property] = info;
    normals[normalize(property)] = property;
    normals[normalize(info.attribute)] = property;
  }
  return new Schema(properties, normals, definition.space);
}

// node_modules/property-information/lib/aria.js
var aria = create({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  },
  transform(_3, property) {
    return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
  }
});

// node_modules/property-information/lib/util/case-sensitive-transform.js
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute;
}

// node_modules/property-information/lib/util/case-insensitive-transform.js
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase());
}

// node_modules/property-information/lib/html.js
var html = create({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alpha: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    blocking: spaceSeparated,
    capture: null,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    closedBy: null,
    colorSpace: null,
    cols: number,
    colSpan: number,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: overloadedBoolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shadowRootClonable: boolean,
    shadowRootCustomElementRegistry: boolean,
    shadowRootDelegatesFocus: boolean,
    shadowRootMode: null,
    shadowRootSerializable: boolean,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: number,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: boolean,
    // Lists. Use CSS to reduce space between items instead
    declare: boolean,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: number,
    // `<img>` and `<object>`
    leftMargin: number,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: number,
    // `<body>`
    marginWidth: number,
    // `<body>`
    noResize: boolean,
    // `<frame>`
    noHref: boolean,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: number,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: booleanish,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: number,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: boolean,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    exportParts: commaSeparated,
    part: spaceSeparated,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: caseInsensitiveTransform
});

// node_modules/property-information/lib/svg.js
var svg = create({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: caseSensitiveTransform
});

// node_modules/property-information/lib/xlink.js
var xlink = create({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(_3, property) {
    return "xlink:" + property.slice(5).toLowerCase();
  }
});

// node_modules/property-information/lib/xmlns.js
var xmlns = create({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: caseInsensitiveTransform
});

// node_modules/property-information/lib/xml.js
var xml = create({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(_3, property) {
    return "xml:" + property.slice(3).toLowerCase();
  }
});

// node_modules/property-information/lib/find.js
var cap = /[A-Z]/g;
var dash = /-[a-z]/g;
var valid = /^data[-\w.:]+$/i;
function find(schema, value) {
  const normal = normalize(value);
  let property = value;
  let Type = Info;
  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]];
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase);
      property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      const rest = value.slice(4);
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab);
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes;
        }
        value = "data" + dashes;
      }
    }
    Type = DefinedInfo;
  }
  return new Type(property, value);
}
function kebab($0) {
  return "-" + $0.toLowerCase();
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase();
}

// node_modules/property-information/index.js
var html2 = merge([aria, html, xlink, xmlns, xml], "html");
var svg2 = merge([aria, svg, xlink, xmlns, xml], "svg");

// node_modules/zwitch/index.js
var own = {}.hasOwnProperty;
function zwitch(key2, options) {
  const settings = options || {};
  function one2(value, ...parameters) {
    let fn = one2.invalid;
    const handlers = one2.handlers;
    if (value && own.call(value, key2)) {
      const id = String(value[key2]);
      fn = own.call(handlers, id) ? handlers[id] : one2.unknown;
    }
    if (fn) {
      return fn.call(this, value, ...parameters);
    }
  }
  one2.handlers = settings.handlers || {};
  one2.invalid = settings.invalid;
  one2.unknown = settings.unknown;
  return one2;
}

// node_modules/stringify-entities/lib/core.js
var defaultSubsetRegex = /["&'<>`]/g;
var surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var controlCharactersRegex = (
  // eslint-disable-next-line no-control-regex, regexp/hexadecimal-escape, regexp/no-control-character, regexp/no-obscure-range -- matching control characters is the point.
  /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
);
var regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
var subsetToRegexCache = /* @__PURE__ */ new WeakMap();
function core(value, options) {
  value = value.replace(
    options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
    basic
  );
  if (options.subset || options.escapeOnly) {
    return value;
  }
  return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
  function surrogate(pair, index, all2) {
    return options.format(
      (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
      all2.charCodeAt(index + 2),
      options
    );
  }
  function basic(character, index, all2) {
    return options.format(
      character.charCodeAt(0),
      all2.charCodeAt(index + 1),
      options
    );
  }
}
function charactersToExpressionCached(subset) {
  let cached = subsetToRegexCache.get(subset);
  if (!cached) {
    cached = charactersToExpression(subset);
    subsetToRegexCache.set(subset, cached);
  }
  return cached;
}
function charactersToExpression(subset) {
  const groups = [];
  let index = -1;
  while (++index < subset.length) {
    groups.push(subset[index].replace(regexEscapeRegex, "\\$&"));
  }
  return new RegExp("(?:" + groups.join("|") + ")", "g");
}

// node_modules/stringify-entities/lib/util/to-hexadecimal.js
var hexadecimalRegex = /[\dA-Fa-f]/;
function toHexadecimal(code, next, omit) {
  const value = "&#x" + code.toString(16).toUpperCase();
  return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
}

// node_modules/stringify-entities/lib/util/to-decimal.js
var decimalRegex = /\d/;
function toDecimal(code, next, omit) {
  const value = "&#" + String(code);
  return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
}

// node_modules/character-entities-legacy/index.js
var characterEntitiesLegacy = [
  "AElig",
  "AMP",
  "Aacute",
  "Acirc",
  "Agrave",
  "Aring",
  "Atilde",
  "Auml",
  "COPY",
  "Ccedil",
  "ETH",
  "Eacute",
  "Ecirc",
  "Egrave",
  "Euml",
  "GT",
  "Iacute",
  "Icirc",
  "Igrave",
  "Iuml",
  "LT",
  "Ntilde",
  "Oacute",
  "Ocirc",
  "Ograve",
  "Oslash",
  "Otilde",
  "Ouml",
  "QUOT",
  "REG",
  "THORN",
  "Uacute",
  "Ucirc",
  "Ugrave",
  "Uuml",
  "Yacute",
  "aacute",
  "acirc",
  "acute",
  "aelig",
  "agrave",
  "amp",
  "aring",
  "atilde",
  "auml",
  "brvbar",
  "ccedil",
  "cedil",
  "cent",
  "copy",
  "curren",
  "deg",
  "divide",
  "eacute",
  "ecirc",
  "egrave",
  "eth",
  "euml",
  "frac12",
  "frac14",
  "frac34",
  "gt",
  "iacute",
  "icirc",
  "iexcl",
  "igrave",
  "iquest",
  "iuml",
  "laquo",
  "lt",
  "macr",
  "micro",
  "middot",
  "nbsp",
  "not",
  "ntilde",
  "oacute",
  "ocirc",
  "ograve",
  "ordf",
  "ordm",
  "oslash",
  "otilde",
  "ouml",
  "para",
  "plusmn",
  "pound",
  "quot",
  "raquo",
  "reg",
  "sect",
  "shy",
  "sup1",
  "sup2",
  "sup3",
  "szlig",
  "thorn",
  "times",
  "uacute",
  "ucirc",
  "ugrave",
  "uml",
  "uuml",
  "yacute",
  "yen",
  "yuml"
];

// node_modules/character-entities-html4/index.js
var characterEntitiesHtml4 = {
  nbsp: "\xA0",
  iexcl: "\xA1",
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  Agrave: "\xC0",
  Aacute: "\xC1",
  Acirc: "\xC2",
  Atilde: "\xC3",
  Auml: "\xC4",
  Aring: "\xC5",
  AElig: "\xC6",
  Ccedil: "\xC7",
  Egrave: "\xC8",
  Eacute: "\xC9",
  Ecirc: "\xCA",
  Euml: "\xCB",
  Igrave: "\xCC",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Iuml: "\xCF",
  ETH: "\xD0",
  Ntilde: "\xD1",
  Ograve: "\xD2",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Otilde: "\xD5",
  Ouml: "\xD6",
  times: "\xD7",
  Oslash: "\xD8",
  Ugrave: "\xD9",
  Uacute: "\xDA",
  Ucirc: "\xDB",
  Uuml: "\xDC",
  Yacute: "\xDD",
  THORN: "\xDE",
  szlig: "\xDF",
  agrave: "\xE0",
  aacute: "\xE1",
  acirc: "\xE2",
  atilde: "\xE3",
  auml: "\xE4",
  aring: "\xE5",
  aelig: "\xE6",
  ccedil: "\xE7",
  egrave: "\xE8",
  eacute: "\xE9",
  ecirc: "\xEA",
  euml: "\xEB",
  igrave: "\xEC",
  iacute: "\xED",
  icirc: "\xEE",
  iuml: "\xEF",
  eth: "\xF0",
  ntilde: "\xF1",
  ograve: "\xF2",
  oacute: "\xF3",
  ocirc: "\xF4",
  otilde: "\xF5",
  ouml: "\xF6",
  divide: "\xF7",
  oslash: "\xF8",
  ugrave: "\xF9",
  uacute: "\xFA",
  ucirc: "\xFB",
  uuml: "\xFC",
  yacute: "\xFD",
  thorn: "\xFE",
  yuml: "\xFF",
  fnof: "\u0192",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Epsilon: "\u0395",
  Zeta: "\u0396",
  Eta: "\u0397",
  Theta: "\u0398",
  Iota: "\u0399",
  Kappa: "\u039A",
  Lambda: "\u039B",
  Mu: "\u039C",
  Nu: "\u039D",
  Xi: "\u039E",
  Omicron: "\u039F",
  Pi: "\u03A0",
  Rho: "\u03A1",
  Sigma: "\u03A3",
  Tau: "\u03A4",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Chi: "\u03A7",
  Psi: "\u03A8",
  Omega: "\u03A9",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  iota: "\u03B9",
  kappa: "\u03BA",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  omicron: "\u03BF",
  pi: "\u03C0",
  rho: "\u03C1",
  sigmaf: "\u03C2",
  sigma: "\u03C3",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  thetasym: "\u03D1",
  upsih: "\u03D2",
  piv: "\u03D6",
  bull: "\u2022",
  hellip: "\u2026",
  prime: "\u2032",
  Prime: "\u2033",
  oline: "\u203E",
  frasl: "\u2044",
  weierp: "\u2118",
  image: "\u2111",
  real: "\u211C",
  trade: "\u2122",
  alefsym: "\u2135",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  crarr: "\u21B5",
  lArr: "\u21D0",
  uArr: "\u21D1",
  rArr: "\u21D2",
  dArr: "\u21D3",
  hArr: "\u21D4",
  forall: "\u2200",
  part: "\u2202",
  exist: "\u2203",
  empty: "\u2205",
  nabla: "\u2207",
  isin: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  prod: "\u220F",
  sum: "\u2211",
  minus: "\u2212",
  lowast: "\u2217",
  radic: "\u221A",
  prop: "\u221D",
  infin: "\u221E",
  ang: "\u2220",
  and: "\u2227",
  or: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  there4: "\u2234",
  sim: "\u223C",
  cong: "\u2245",
  asymp: "\u2248",
  ne: "\u2260",
  equiv: "\u2261",
  le: "\u2264",
  ge: "\u2265",
  sub: "\u2282",
  sup: "\u2283",
  nsub: "\u2284",
  sube: "\u2286",
  supe: "\u2287",
  oplus: "\u2295",
  otimes: "\u2297",
  perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308",
  rceil: "\u2309",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lang: "\u2329",
  rang: "\u232A",
  loz: "\u25CA",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666",
  quot: '"',
  amp: "&",
  lt: "<",
  gt: ">",
  OElig: "\u0152",
  oelig: "\u0153",
  Scaron: "\u0160",
  scaron: "\u0161",
  Yuml: "\u0178",
  circ: "\u02C6",
  tilde: "\u02DC",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  zwnj: "\u200C",
  zwj: "\u200D",
  lrm: "\u200E",
  rlm: "\u200F",
  ndash: "\u2013",
  mdash: "\u2014",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  dagger: "\u2020",
  Dagger: "\u2021",
  permil: "\u2030",
  lsaquo: "\u2039",
  rsaquo: "\u203A",
  euro: "\u20AC"
};

// node_modules/stringify-entities/lib/constant/dangerous.js
var dangerous = [
  "cent",
  "copy",
  "divide",
  "gt",
  "lt",
  "not",
  "para",
  "times"
];

// node_modules/stringify-entities/lib/util/to-named.js
var own2 = {}.hasOwnProperty;
var characters = {};
var key;
for (key in characterEntitiesHtml4) {
  if (own2.call(characterEntitiesHtml4, key)) {
    characters[characterEntitiesHtml4[key]] = key;
  }
}
var notAlphanumericRegex = /[^\dA-Za-z]/;
function toNamed(code, next, omit, attribute) {
  const character = String.fromCharCode(code);
  if (own2.call(characters, character)) {
    const name = characters[character];
    const value = "&" + name;
    if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) {
      return value;
    }
    return value + ";";
  }
  return "";
}

// node_modules/stringify-entities/lib/util/format-smart.js
function formatSmart(code, next, options) {
  const omit = options.omitOptionalSemicolons && next !== 59;
  let numeric = toHexadecimal(code, next, omit);
  let named;
  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(code, next, omit, options.attribute);
  }
  if ((options.useShortestReferences || !named) && options.useShortestReferences) {
    const decimal = toDecimal(code, next, omit);
    if (decimal.length < numeric.length) {
      numeric = decimal;
    }
  }
  return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
}

// node_modules/stringify-entities/lib/index.js
function stringifyEntities(value, options) {
  return core(value, Object.assign({ format: formatSmart }, options));
}

// node_modules/hast-util-to-html/lib/handle/comment.js
var htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
var bogusCommentEntitySubset = [">"];
var commentEntitySubset = ["<", ">"];
function comment(node, _1, _22, state) {
  return state.settings.bogusComments ? "<?" + stringifyEntities(
    node.value,
    Object.assign({}, state.settings.characterReferences, {
      subset: bogusCommentEntitySubset
    })
  ) + ">" : "<!--" + node.value.replace(htmlCommentRegex, encode) + "-->";
  function encode($0) {
    return stringifyEntities(
      $0,
      Object.assign({}, state.settings.characterReferences, {
        subset: commentEntitySubset
      })
    );
  }
}

// node_modules/hast-util-to-html/lib/handle/doctype.js
function doctype(_1, _22, _3, state) {
  return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
}

// node_modules/ccount/index.js
function ccount(value, character) {
  const source2 = String(value);
  if (typeof character !== "string") {
    throw new TypeError("Expected character");
  }
  let count = 0;
  let index = source2.indexOf(character);
  while (index !== -1) {
    count++;
    index = source2.indexOf(character, index + character.length);
  }
  return count;
}

// node_modules/comma-separated-tokens/index.js
function stringify(values, options) {
  const settings = options || {};
  const input = values[values.length - 1] === "" ? [...values, ""] : values;
  return input.join(
    (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
  ).trim();
}

// node_modules/space-separated-tokens/index.js
function stringify2(values) {
  return values.join(" ").trim();
}

// node_modules/hast-util-whitespace/lib/index.js
var re = /[ \t\n\f\r]/g;
function whitespace(thing) {
  return typeof thing === "object" ? thing.type === "text" ? empty(thing.value) : false : empty(thing);
}
function empty(value) {
  return value.replace(re, "") === "";
}

// node_modules/hast-util-to-html/lib/omission/util/siblings.js
var siblingAfter = siblings(1);
var siblingBefore = siblings(-1);
var emptyChildren = [];
function siblings(increment2) {
  return sibling;
  function sibling(parent, index, includeWhitespace) {
    const siblings2 = parent ? parent.children : emptyChildren;
    let offset = (index || 0) + increment2;
    let next = siblings2[offset];
    if (!includeWhitespace) {
      while (next && whitespace(next)) {
        offset += increment2;
        next = siblings2[offset];
      }
    }
    return next;
  }
}

// node_modules/hast-util-to-html/lib/omission/omission.js
var own3 = {}.hasOwnProperty;
function omission(handlers) {
  return omit;
  function omit(node, index, parent) {
    return own3.call(handlers, node.tagName) && handlers[node.tagName](node, index, parent);
  }
}

// node_modules/hast-util-to-html/lib/omission/closing.js
var closing = omission({
  body,
  caption: headOrColgroupOrCaption,
  colgroup: headOrColgroupOrCaption,
  dd,
  dt,
  head: headOrColgroupOrCaption,
  html: html3,
  li,
  optgroup,
  option,
  p,
  rp: rubyElement,
  rt: rubyElement,
  tbody,
  td: cells,
  tfoot,
  th: cells,
  thead,
  tr
});
function headOrColgroupOrCaption(_3, index, parent) {
  const next = siblingAfter(parent, index, true);
  return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
}
function html3(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type !== "comment";
}
function body(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type !== "comment";
}
function p(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || // Confusing parent.
  !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video" || // Custom element.
  parent.tagName.includes("-")));
}
function li(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && next.tagName === "li";
}
function dt(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return Boolean(
    next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd")
  );
}
function dd(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
}
function rubyElement(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
}
function optgroup(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && next.tagName === "optgroup";
}
function option(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
}
function thead(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return Boolean(
    next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot")
  );
}
function tbody(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
}
function tfoot(_3, index, parent) {
  return !siblingAfter(parent, index);
}
function tr(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && next.tagName === "tr";
}
function cells(_3, index, parent) {
  const next = siblingAfter(parent, index);
  return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
}

// node_modules/hast-util-to-html/lib/omission/opening.js
var opening = omission({
  body: body2,
  colgroup,
  head,
  html: html4,
  tbody: tbody2
});
function html4(node) {
  const head2 = siblingAfter(node, -1);
  return !head2 || head2.type !== "comment";
}
function head(node) {
  const seen = /* @__PURE__ */ new Set();
  for (const child2 of node.children) {
    if (child2.type === "element" && (child2.tagName === "base" || child2.tagName === "title")) {
      if (seen.has(child2.tagName)) return false;
      seen.add(child2.tagName);
    }
  }
  const child = node.children[0];
  return !child || child.type === "element";
}
function body2(node) {
  const head2 = siblingAfter(node, -1, true);
  return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
}
function colgroup(node, index, parent) {
  const previous = siblingBefore(parent, index);
  if (parent && previous && previous.type === "element" && previous.tagName === "colgroup" && closing(previous, parent.children.indexOf(previous), parent)) {
    return false;
  }
  const head2 = siblingAfter(node, -1, true);
  return Boolean(head2 && head2.type === "element" && head2.tagName === "col");
}
function tbody2(node, index, parent) {
  const previous = siblingBefore(parent, index);
  if (parent && previous && previous.type === "element" && (previous.tagName === "thead" || previous.tagName === "tbody") && closing(previous, parent.children.indexOf(previous), parent)) {
    return false;
  }
  const head2 = siblingAfter(node, -1);
  return Boolean(head2 && head2.type === "element" && head2.tagName === "tr");
}

// node_modules/hast-util-to-html/lib/handle/element.js
var constants = {
  // See: <https://html.spec.whatwg.org/#attribute-name-state>.
  name: [
    ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
    [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
  unquoted: [
    ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
    ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
  single: [
    ["&'".split(""), "\"&'`".split("")],
    ["\0&'".split(""), "\0\"&'`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
  double: [
    ['"&'.split(""), "\"&'`".split("")],
    ['\0"&'.split(""), "\0\"&'`".split("")]
  ]
};
var htmlIntegrationPoints = /* @__PURE__ */ new Set(["desc", "foreignObject", "title"]);
function element(node, index, parent, state) {
  const { schema } = state;
  const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
  let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node.tagName.toLowerCase());
  const parts = [];
  if (schema.space === "html" && node.tagName === "svg") {
    state.schema = svg2;
  }
  const attributes = serializeAttributes(state, node.properties);
  if (state.schema.space === "svg" && htmlIntegrationPoints.has(node.tagName)) {
    state.schema = html2;
  }
  const content = state.all(
    schema.space === "html" && node.tagName === "template" ? node.content : node
  );
  state.schema = schema;
  if (content) selfClosing = false;
  if (attributes || !omit || !opening(node, index, parent)) {
    parts.push("<", node.tagName, attributes ? " " + attributes : "");
    if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
      const last = attributes.charAt(attributes.length - 1);
      if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
        parts.push(" ");
      }
      parts.push("/");
    }
    parts.push(">");
  }
  parts.push(content);
  if (!selfClosing && (!omit || !closing(node, index, parent))) {
    parts.push("</" + node.tagName + ">");
  }
  return parts.join("");
}
function serializeAttributes(state, properties) {
  const values = [];
  let index = -1;
  let key2;
  if (properties) {
    for (key2 in properties) {
      if (properties[key2] !== null && properties[key2] !== void 0) {
        const value = serializeAttribute(state, key2, properties[key2]);
        if (value) values.push(value);
      }
    }
  }
  while (++index < values.length) {
    const last = state.settings.tightAttributes ? values[index].charAt(values[index].length - 1) : void 0;
    if (index !== values.length - 1 && last !== '"' && last !== "'") {
      values[index] += " ";
    }
  }
  return values.join("");
}
function serializeAttribute(state, key2, value) {
  const info = find(state.schema, key2);
  const x3 = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
  const y3 = state.settings.allowDangerousCharacters ? 0 : 1;
  if (info.overloadedBoolean && (value === info.attribute || value === "")) {
    value = true;
  } else if ((info.boolean || info.overloadedBoolean) && (typeof value !== "string" || value === info.attribute || value === "")) {
    value = Boolean(value);
  }
  if (value === null || value === void 0 || value === false || typeof value === "number" && Number.isNaN(value)) {
    return "";
  }
  const name = stringifyEntities(
    info.attribute,
    Object.assign({}, state.settings.characterReferences, {
      // Always encode without parse errors in non-HTML.
      subset: constants.name[x3][y3]
    })
  );
  if (value === true) return name;
  value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify2)(value, {
    padLeft: !state.settings.tightCommaSeparatedLists
  }) : String(value);
  if (state.settings.collapseEmptyAttributes && !value) return name;
  let result;
  if (state.settings.preferUnquoted) {
    result = stringifyEntities(
      value,
      Object.assign({}, state.settings.characterReferences, {
        attribute: true,
        subset: constants.unquoted[x3][y3]
      })
    );
  }
  if (result !== value) {
    let { quote } = state;
    if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
      quote = state.alternative;
    }
    result = quote + stringifyEntities(
      value,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: (quote === "'" ? constants.single : constants.double)[x3][y3],
        attribute: true
      })
    ) + quote;
  }
  return name + (result ? "=" + result : result);
}

// node_modules/hast-util-to-html/lib/handle/text.js
var textEntitySubset = ["<", "&"];
var raw = /* @__PURE__ */ new Set([
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "script",
  "style",
  "xmp"
]);
function text(node, _3, parent, state) {
  return parent && parent.type === "element" && state.schema.space === "html" && raw.has(parent.tagName) ? node.value : stringifyEntities(
    node.value,
    Object.assign({}, state.settings.characterReferences, {
      subset: textEntitySubset
    })
  );
}

// node_modules/hast-util-to-html/lib/handle/raw.js
function raw2(node, index, parent, state) {
  return state.settings.allowDangerousHtml ? node.value : text(node, index, parent, state);
}

// node_modules/hast-util-to-html/lib/handle/root.js
function root(node, _1, _22, state) {
  return state.all(node);
}

// node_modules/hast-util-to-html/lib/handle/index.js
var handle = zwitch("type", {
  invalid,
  unknown,
  handlers: { comment, doctype, element, raw: raw2, root, text }
});
function invalid(node) {
  throw new Error("Expected node, not `" + node + "`");
}
function unknown(node_) {
  const node = (
    /** @type {Nodes} */
    node_
  );
  throw new Error("Cannot compile unknown node `" + node.type + "`");
}

// node_modules/hast-util-to-html/lib/index.js
var emptyOptions = {};
var emptyCharacterReferences = {};
var emptyChildren2 = [];
function toHtml(tree, options) {
  const options_ = options || emptyOptions;
  const quote = options_.quote || '"';
  if (quote !== '"' && quote !== "'") {
    throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
  }
  const alternative = quote === '"' ? "'" : '"';
  const state = {
    one,
    all,
    settings: {
      omitOptionalTags: options_.omitOptionalTags || false,
      allowParseErrors: options_.allowParseErrors || false,
      allowDangerousCharacters: options_.allowDangerousCharacters || false,
      quoteSmart: options_.quoteSmart || false,
      preferUnquoted: options_.preferUnquoted || false,
      tightAttributes: options_.tightAttributes || false,
      upperDoctype: options_.upperDoctype || false,
      tightDoctype: options_.tightDoctype || false,
      bogusComments: options_.bogusComments || false,
      tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
      tightSelfClosing: options_.tightSelfClosing || false,
      collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
      allowDangerousHtml: options_.allowDangerousHtml || false,
      voids: options_.voids || htmlVoidElements,
      characterReferences: options_.characterReferences || emptyCharacterReferences,
      closeSelfClosing: options_.closeSelfClosing || false,
      closeEmptyElements: options_.closeEmptyElements || false
    },
    schema: options_.space === "svg" ? svg2 : html2,
    quote,
    alternative
  };
  return state.one(
    Array.isArray(tree) ? { type: "root", children: tree } : tree,
    void 0,
    void 0
  );
}
function one(node, index, parent) {
  return handle(node, index, parent, this);
}
function all(parent) {
  const results = [];
  const children = parent && parent.children || emptyChildren2;
  let index = -1;
  while (++index < children.length) {
    results[index] = this.one(children[index], index, parent);
  }
  return results.join("");
}

// node_modules/@shikijs/core/dist/index.mjs
var RE_WHITESPACE = /\s+/g;
function addClassToHast(node, className) {
  if (!className) return node;
  node.properties ||= {};
  node.properties.class ||= [];
  if (typeof node.properties.class === "string") node.properties.class = node.properties.class.split(RE_WHITESPACE);
  if (!Array.isArray(node.properties.class)) node.properties.class = [];
  const targets = Array.isArray(className) ? className : className.split(RE_WHITESPACE);
  for (const c of targets) if (c && !node.properties.class.includes(c)) node.properties.class.push(c);
  return node;
}
function createPositionConverter(code) {
  const split = splitLines(code, true);
  const lines = split.map(([line]) => line);
  const offsets = split.map(([, offset]) => offset);
  function indexToPos(index) {
    if (index === code.length) return {
      line: lines.length - 1,
      character: lines.at(-1).length
    };
    let low = 0;
    let high = lines.length - 1;
    while (low < high) {
      const mid = low + high + 1 >>> 1;
      if (offsets[mid] <= index) low = mid;
      else high = mid - 1;
    }
    return {
      line: low,
      character: index - offsets[low]
    };
  }
  function posToIndex(line, character) {
    return offsets[line] + character;
  }
  return {
    lines,
    indexToPos,
    posToIndex
  };
}
var COLOR_KEYS = ["color", "background-color"];
function splitToken(token2, offsets) {
  let lastOffset = 0;
  const tokens = [];
  for (const offset of offsets) {
    if (offset > lastOffset) tokens.push({
      ...token2,
      content: token2.content.slice(lastOffset, offset),
      offset: token2.offset + lastOffset
    });
    lastOffset = offset;
  }
  if (lastOffset < token2.content.length) tokens.push({
    ...token2,
    content: token2.content.slice(lastOffset),
    offset: token2.offset + lastOffset
  });
  return tokens;
}
function findFirstBreakpointAfter(breakpoints, offset) {
  let start = 0;
  let end = breakpoints.length;
  while (start < end) {
    const middle = start + (end - start >> 1);
    if (breakpoints[middle] <= offset) start = middle + 1;
    else end = middle;
  }
  return start;
}
function splitTokens(tokens, breakpoints) {
  const sorted = [...breakpoints instanceof Set ? breakpoints : new Set(breakpoints)].sort((a2, b3) => a2 - b3);
  if (!sorted.length) return tokens;
  return tokens.map((line) => {
    return line.flatMap((token2) => {
      const tokenEnd = token2.offset + token2.content.length;
      const start = findFirstBreakpointAfter(sorted, token2.offset);
      let end = start;
      while (end < sorted.length && sorted[end] < tokenEnd) end++;
      if (start === end) return token2;
      const breakpointsInToken = sorted.slice(start, end);
      for (let index = 0; index < breakpointsInToken.length; index++) breakpointsInToken[index] -= token2.offset;
      return splitToken(token2, breakpointsInToken);
    });
  });
}
function flatTokenVariants(merged, variantsOrder, cssVariablePrefix, defaultColor, colorsRendering = "css-vars") {
  const token2 = {
    content: merged.content,
    explanation: merged.explanation,
    offset: merged.offset
  };
  const styles = variantsOrder.map((t) => getTokenStyleObject(merged.variants[t]));
  const styleKeys = new Set(styles.flatMap((t) => Object.keys(t)));
  const mergedStyles = {};
  const varKey = (idx, key2) => {
    const keyName = key2 === "color" ? "" : key2 === "background-color" ? "-bg" : `-${key2}`;
    return cssVariablePrefix + variantsOrder[idx] + (key2 === "color" ? "" : keyName);
  };
  styles.forEach((cur, idx) => {
    for (const key2 of styleKeys) {
      const value = cur[key2] || "inherit";
      if (idx === 0 && defaultColor && COLOR_KEYS.includes(key2)) {
        if (defaultColor === "light-dark()" && styles.length > 1) {
          const lightIndex = variantsOrder.findIndex((t) => t === "light");
          const darkIndex = variantsOrder.findIndex((t) => t === "dark");
          if (lightIndex === -1 || darkIndex === -1) throw new ShikiError('When using `defaultColor: "light-dark()"`, you must provide both `light` and `dark` themes');
          const lightValue = styles[lightIndex][key2] || "inherit";
          const darkValue = styles[darkIndex][key2] || "inherit";
          mergedStyles[key2] = `light-dark(${lightValue}, ${darkValue})`;
          if (colorsRendering === "css-vars") mergedStyles[varKey(idx, key2)] = value;
        } else mergedStyles[key2] = value;
      } else if (colorsRendering === "css-vars") mergedStyles[varKey(idx, key2)] = value;
    }
  });
  token2.htmlStyle = mergedStyles;
  return token2;
}
function getTokenStyleObject(token2) {
  const styles = {};
  if (token2.color) styles.color = token2.color;
  if (token2.bgColor) styles["background-color"] = token2.bgColor;
  if (token2.fontStyle) {
    if (token2.fontStyle & FontStyle.Italic) styles["font-style"] = "italic";
    if (token2.fontStyle & FontStyle.Bold) styles["font-weight"] = "bold";
    const decorations2 = [];
    if (token2.fontStyle & FontStyle.Underline) decorations2.push("underline");
    if (token2.fontStyle & FontStyle.Strikethrough) decorations2.push("line-through");
    if (decorations2.length) styles["text-decoration"] = decorations2.join(" ");
  }
  return styles;
}
function stringifyTokenStyle(token2) {
  if (typeof token2 === "string") return token2;
  return Object.entries(token2).map(([key2, value]) => `${key2}:${value}`).join(";");
}
function transformerDecorations() {
  const map = /* @__PURE__ */ new WeakMap();
  function getContext(shiki) {
    if (!map.has(shiki.meta)) {
      let normalizePosition = function(p2) {
        if (typeof p2 === "number") {
          if (p2 < 0 || p2 > shiki.source.length) throw new ShikiError(`Invalid decoration offset: ${p2}. Code length: ${shiki.source.length}`);
          return {
            ...converter.indexToPos(p2),
            offset: p2
          };
        } else {
          const line = converter.lines[p2.line];
          if (line === void 0) throw new ShikiError(`Invalid decoration position ${JSON.stringify(p2)}. Lines length: ${converter.lines.length}`);
          let character = p2.character;
          if (character < 0) character = line.length + character;
          if (character < 0 || character > line.length) throw new ShikiError(`Invalid decoration position ${JSON.stringify(p2)}. Line ${p2.line} length: ${line.length}`);
          return {
            ...p2,
            character,
            offset: converter.posToIndex(p2.line, character)
          };
        }
      };
      const converter = createPositionConverter(shiki.source);
      const decorations2 = (shiki.options.decorations || []).map((d2) => ({
        ...d2,
        start: normalizePosition(d2.start),
        end: normalizePosition(d2.end)
      }));
      verifyIntersections(decorations2);
      map.set(shiki.meta, {
        decorations: decorations2,
        converter,
        source: shiki.source
      });
    }
    return map.get(shiki.meta);
  }
  return {
    name: "shiki:decorations",
    tokens(tokens) {
      if (!this.options.decorations?.length) return;
      return splitTokens(tokens, getContext(this).decorations.flatMap((d2) => [d2.start.offset, d2.end.offset]));
    },
    code(codeEl) {
      if (!this.options.decorations?.length) return;
      const ctx = getContext(this);
      const lines = [...codeEl.children].filter((i2) => i2.type === "element" && i2.tagName === "span");
      if (lines.length !== ctx.converter.lines.length) throw new ShikiError(`Number of lines in code element (${lines.length}) does not match the number of lines in the source (${ctx.converter.lines.length}). Failed to apply decorations.`);
      function applyLineSection(line, start, end, decoration) {
        const lineEl = lines[line];
        let text2 = "";
        let startIndex = -1;
        let endIndex = -1;
        if (start === 0) startIndex = 0;
        if (end === 0) endIndex = 0;
        if (end === Number.POSITIVE_INFINITY) endIndex = lineEl.children.length;
        if (startIndex === -1 || endIndex === -1) for (let i2 = 0; i2 < lineEl.children.length; i2++) {
          text2 += stringify3(lineEl.children[i2]);
          if (startIndex === -1 && text2.length === start) startIndex = i2 + 1;
          if (endIndex === -1 && text2.length === end) endIndex = i2 + 1;
        }
        if (startIndex === -1) throw new ShikiError(`Failed to find start index for decoration ${JSON.stringify(decoration.start)}`);
        if (endIndex === -1) throw new ShikiError(`Failed to find end index for decoration ${JSON.stringify(decoration.end)}`);
        const children = lineEl.children.slice(startIndex, endIndex);
        if (!decoration.alwaysWrap && children.length === lineEl.children.length) applyDecoration(lineEl, decoration, "line");
        else if (!decoration.alwaysWrap && children.length === 1 && children[0].type === "element") applyDecoration(children[0], decoration, "token");
        else {
          const wrapper = {
            type: "element",
            tagName: "span",
            properties: {},
            children
          };
          applyDecoration(wrapper, decoration, "wrapper");
          lineEl.children.splice(startIndex, children.length, wrapper);
        }
      }
      function applyLine(line, decoration) {
        lines[line] = applyDecoration(lines[line], decoration, "line");
      }
      function applyDecoration(el, decoration, type) {
        const properties = decoration.properties || {};
        const transform2 = decoration.transform || ((i2) => i2);
        el.tagName = decoration.tagName || "span";
        el.properties = {
          ...el.properties,
          ...properties,
          class: el.properties.class
        };
        if (decoration.properties?.class) addClassToHast(el, decoration.properties.class);
        el = transform2(el, type) || el;
        return el;
      }
      const lineApplies = [];
      const sorted = ctx.decorations.sort((a2, b3) => b3.start.offset - a2.start.offset || a2.end.offset - b3.end.offset);
      for (const decoration of sorted) {
        const { start, end } = decoration;
        if (start.line === end.line) applyLineSection(start.line, start.character, end.character, decoration);
        else if (start.line < end.line) {
          applyLineSection(start.line, start.character, Number.POSITIVE_INFINITY, decoration);
          for (let i2 = start.line + 1; i2 < end.line; i2++) lineApplies.push(() => applyLine(i2, decoration));
          applyLineSection(end.line, 0, end.character, decoration);
        }
      }
      for (let i2 = lineApplies.length - 1; i2 >= 0; i2--) lineApplies[i2]();
    }
  };
}
function verifyIntersections(items) {
  if (areDecorationsNested(items)) return;
  for (let i2 = 0; i2 < items.length; i2++) {
    const foo = items[i2];
    if (foo.start.offset > foo.end.offset) throw new ShikiError(`Invalid decoration range: ${JSON.stringify(foo.start)} - ${JSON.stringify(foo.end)}`);
    for (let j2 = i2 + 1; j2 < items.length; j2++) {
      const bar = items[j2];
      const isFooHasBarStart = foo.start.offset <= bar.start.offset && bar.start.offset < foo.end.offset;
      const isFooHasBarEnd = foo.start.offset < bar.end.offset && bar.end.offset <= foo.end.offset;
      const isBarHasFooStart = bar.start.offset <= foo.start.offset && foo.start.offset < bar.end.offset;
      const isBarHasFooEnd = bar.start.offset < foo.end.offset && foo.end.offset <= bar.end.offset;
      if (isFooHasBarStart || isFooHasBarEnd || isBarHasFooStart || isBarHasFooEnd) {
        if (isFooHasBarStart && isFooHasBarEnd) continue;
        if (isBarHasFooStart && isBarHasFooEnd) continue;
        if (isBarHasFooStart && foo.start.offset === foo.end.offset) continue;
        if (isFooHasBarEnd && bar.start.offset === bar.end.offset) continue;
        throw new ShikiError(`Decorations ${JSON.stringify(foo.start)} and ${JSON.stringify(bar.start)} intersect.`);
      }
    }
  }
}
function areDecorationsNested(items) {
  const ranges = [];
  const firstStart = /* @__PURE__ */ new Map();
  const lastEnd = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < items.length; i2++) {
    const { start, end } = items[i2];
    if (start.offset > end.offset) return false;
    if (start.offset === end.offset) continue;
    ranges.push(items[i2]);
    if (!firstStart.has(start.offset)) firstStart.set(start.offset, i2);
    lastEnd.set(end.offset, i2);
  }
  for (let i2 = 0; i2 < items.length; i2++) {
    const { start, end } = items[i2];
    if (start.offset === end.offset && ((firstStart.get(start.offset) ?? i2) < i2 || (lastEnd.get(start.offset) ?? i2) > i2)) return false;
  }
  ranges.sort((a2, b3) => a2.start.offset - b3.start.offset || b3.end.offset - a2.end.offset);
  const ends = [];
  for (const { start, end } of ranges) {
    while (ends.length && ends.at(-1) <= start.offset) ends.pop();
    if (ends.length && end.offset > ends.at(-1)) return false;
    ends.push(end.offset);
  }
  return true;
}
function stringify3(el) {
  if (el.type === "text") return el.value;
  if (el.type === "element") return el.children.map(stringify3).join("");
  return "";
}
var builtInTransformers = [/* @__PURE__ */ transformerDecorations()];
function getTransformers(options) {
  const transformers = sortTransformersByEnforcement(options.transformers || []);
  return [
    ...transformers.pre,
    ...transformers.normal,
    ...transformers.post,
    ...builtInTransformers
  ];
}
function sortTransformersByEnforcement(transformers) {
  const pre = [];
  const post = [];
  const normal = [];
  for (const transformer of transformers) switch (transformer.enforce) {
    case "pre":
      pre.push(transformer);
      break;
    case "post":
      post.push(transformer);
      break;
    default:
      normal.push(transformer);
  }
  return {
    pre,
    post,
    normal
  };
}
var namedColors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "brightBlack",
  "brightRed",
  "brightGreen",
  "brightYellow",
  "brightBlue",
  "brightMagenta",
  "brightCyan",
  "brightWhite"
];
var decorations = {
  1: "bold",
  2: "dim",
  3: "italic",
  4: "underline",
  7: "reverse",
  8: "hidden",
  9: "strikethrough"
};
function findSequence(value, position) {
  const nextEscape = value.indexOf("\x1B", position);
  if (nextEscape !== -1) {
    if (value[nextEscape + 1] === "[") {
      const nextClose = value.indexOf("m", nextEscape);
      if (nextClose !== -1) return {
        sequence: value.substring(nextEscape + 2, nextClose).split(";"),
        startPosition: nextEscape,
        position: nextClose + 1
      };
    }
  }
  return { position: value.length };
}
function parseColor(sequence) {
  const colorMode = sequence.shift();
  if (colorMode === "2") {
    const rgb = sequence.splice(0, 3).map((x3) => Number.parseInt(x3));
    if (rgb.length !== 3 || rgb.some((x3) => Number.isNaN(x3))) return;
    return {
      type: "rgb",
      rgb
    };
  } else if (colorMode === "5") {
    const index = sequence.shift();
    if (index) return {
      type: "table",
      index: Number(index)
    };
  }
}
function parseSequence(sequence) {
  const commands = [];
  while (sequence.length > 0) {
    const code = sequence.shift();
    if (!code) continue;
    const codeInt = Number.parseInt(code);
    if (Number.isNaN(codeInt)) continue;
    if (codeInt === 0) commands.push({ type: "resetAll" });
    else if (codeInt <= 9) {
      if (decorations[codeInt]) commands.push({
        type: "setDecoration",
        value: decorations[codeInt]
      });
    } else if (codeInt <= 29) {
      const decoration = decorations[codeInt - 20];
      if (decoration) {
        commands.push({
          type: "resetDecoration",
          value: decoration
        });
        if (decoration === "dim") commands.push({
          type: "resetDecoration",
          value: "bold"
        });
      }
    } else if (codeInt <= 37) commands.push({
      type: "setForegroundColor",
      value: {
        type: "named",
        name: namedColors[codeInt - 30]
      }
    });
    else if (codeInt === 38) {
      const color = parseColor(sequence);
      if (color) commands.push({
        type: "setForegroundColor",
        value: color
      });
    } else if (codeInt === 39) commands.push({ type: "resetForegroundColor" });
    else if (codeInt <= 47) commands.push({
      type: "setBackgroundColor",
      value: {
        type: "named",
        name: namedColors[codeInt - 40]
      }
    });
    else if (codeInt === 48) {
      const color = parseColor(sequence);
      if (color) commands.push({
        type: "setBackgroundColor",
        value: color
      });
    } else if (codeInt === 49) commands.push({ type: "resetBackgroundColor" });
    else if (codeInt === 53) commands.push({
      type: "setDecoration",
      value: "overline"
    });
    else if (codeInt === 55) commands.push({
      type: "resetDecoration",
      value: "overline"
    });
    else if (codeInt >= 90 && codeInt <= 97) commands.push({
      type: "setForegroundColor",
      value: {
        type: "named",
        name: namedColors[codeInt - 90 + 8]
      }
    });
    else if (codeInt >= 100 && codeInt <= 107) commands.push({
      type: "setBackgroundColor",
      value: {
        type: "named",
        name: namedColors[codeInt - 100 + 8]
      }
    });
  }
  return commands;
}
function createAnsiSequenceParser() {
  let foreground = null;
  let background = null;
  let decorations2 = /* @__PURE__ */ new Set();
  return { parse(value) {
    const tokens = [];
    let position = 0;
    do {
      const findResult = findSequence(value, position);
      const text2 = findResult.sequence ? value.substring(position, findResult.startPosition) : value.substring(position);
      if (text2.length > 0) tokens.push({
        value: text2,
        foreground,
        background,
        decorations: new Set(decorations2)
      });
      if (findResult.sequence) {
        const commands = parseSequence(findResult.sequence);
        for (const styleToken of commands) if (styleToken.type === "resetAll") {
          foreground = null;
          background = null;
          decorations2.clear();
        } else if (styleToken.type === "resetForegroundColor") foreground = null;
        else if (styleToken.type === "resetBackgroundColor") background = null;
        else if (styleToken.type === "resetDecoration") decorations2.delete(styleToken.value);
        for (const styleToken of commands) if (styleToken.type === "setForegroundColor") foreground = styleToken.value;
        else if (styleToken.type === "setBackgroundColor") background = styleToken.value;
        else if (styleToken.type === "setDecoration") decorations2.add(styleToken.value);
      }
      position = findResult.position;
    } while (position < value.length);
    return tokens;
  } };
}
var defaultNamedColorsMap = {
  black: "#000000",
  red: "#bb0000",
  green: "#00bb00",
  yellow: "#bbbb00",
  blue: "#0000bb",
  magenta: "#ff00ff",
  cyan: "#00bbbb",
  white: "#eeeeee",
  brightBlack: "#555555",
  brightRed: "#ff5555",
  brightGreen: "#00ff00",
  brightYellow: "#ffff55",
  brightBlue: "#5555ff",
  brightMagenta: "#ff55ff",
  brightCyan: "#55ffff",
  brightWhite: "#ffffff"
};
function createColorPalette(namedColorsMap = defaultNamedColorsMap) {
  function namedColor(name) {
    return namedColorsMap[name];
  }
  function rgbColor(rgb) {
    return `#${rgb.map((x3) => Math.max(0, Math.min(x3, 255)).toString(16).padStart(2, "0")).join("")}`;
  }
  let colorTable;
  function getColorTable() {
    if (colorTable) return colorTable;
    colorTable = [];
    for (let i2 = 0; i2 < namedColors.length; i2++) colorTable.push(namedColor(namedColors[i2]));
    let levels = [
      0,
      95,
      135,
      175,
      215,
      255
    ];
    for (let r4 = 0; r4 < 6; r4++) for (let g = 0; g < 6; g++) for (let b3 = 0; b3 < 6; b3++) colorTable.push(rgbColor([
      levels[r4],
      levels[g],
      levels[b3]
    ]));
    let level = 8;
    for (let i2 = 0; i2 < 24; i2++, level += 10) colorTable.push(rgbColor([
      level,
      level,
      level
    ]));
    return colorTable;
  }
  function tableColor(index) {
    return getColorTable()[index];
  }
  function value(color) {
    switch (color.type) {
      case "named":
        return namedColor(color.name);
      case "rgb":
        return rgbColor(color.rgb);
      case "table":
        return tableColor(color.index);
    }
  }
  return { value };
}
var RE_HEX_COLOR = /#([0-9a-f]{3,8})/i;
var RE_CSS_VAR_ANSI = /var\((--[\w-]+-ansi-[\w-]+)\)/;
var defaultAnsiColors = {
  black: "#000000",
  red: "#cd3131",
  green: "#0DBC79",
  yellow: "#E5E510",
  blue: "#2472C8",
  magenta: "#BC3FBC",
  cyan: "#11A8CD",
  white: "#E5E5E5",
  brightBlack: "#666666",
  brightRed: "#F14C4C",
  brightGreen: "#23D18B",
  brightYellow: "#F5F543",
  brightBlue: "#3B8EEA",
  brightMagenta: "#D670D6",
  brightCyan: "#29B8DB",
  brightWhite: "#FFFFFF"
};
function tokenizeAnsiWithTheme(theme, fileContents, options) {
  const colorReplacements = resolveColorReplacements(theme, options);
  const lines = splitLines(fileContents);
  const colorPalette = createColorPalette(Object.fromEntries(namedColors.map((name) => {
    const key2 = `terminal.ansi${name[0].toUpperCase()}${name.substring(1)}`;
    return [name, theme.colors?.[key2] || defaultAnsiColors[name]];
  })));
  const parser = createAnsiSequenceParser();
  return lines.map((line) => parser.parse(line[0]).map((token2) => {
    let color;
    let bgColor;
    if (token2.decorations.has("reverse")) {
      color = token2.background ? colorPalette.value(token2.background) : theme.bg;
      bgColor = token2.foreground ? colorPalette.value(token2.foreground) : theme.fg;
    } else {
      color = token2.foreground ? colorPalette.value(token2.foreground) : theme.fg;
      bgColor = token2.background ? colorPalette.value(token2.background) : void 0;
    }
    color = applyColorReplacements(color, colorReplacements);
    bgColor = applyColorReplacements(bgColor, colorReplacements);
    if (token2.decorations.has("dim")) color = dimColor(color);
    let fontStyle = FontStyle.None;
    if (token2.decorations.has("bold")) fontStyle |= FontStyle.Bold;
    if (token2.decorations.has("italic")) fontStyle |= FontStyle.Italic;
    if (token2.decorations.has("underline")) fontStyle |= FontStyle.Underline;
    if (token2.decorations.has("strikethrough")) fontStyle |= FontStyle.Strikethrough;
    return {
      content: token2.value,
      offset: line[1],
      color,
      bgColor,
      fontStyle
    };
  }));
}
function dimColor(color) {
  const hexMatch = color.match(RE_HEX_COLOR);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 8) {
      const alpha = Math.round(Number.parseInt(hex.slice(6, 8), 16) / 2).toString(16).padStart(2, "0");
      return `#${hex.slice(0, 6)}${alpha}`;
    } else if (hex.length === 6) return `#${hex}80`;
    else if (hex.length === 4) {
      const r4 = hex[0];
      const g = hex[1];
      const b3 = hex[2];
      const a2 = hex[3];
      return `#${r4}${r4}${g}${g}${b3}${b3}${Math.round(Number.parseInt(`${a2}${a2}`, 16) / 2).toString(16).padStart(2, "0")}`;
    } else if (hex.length === 3) {
      const r4 = hex[0];
      const g = hex[1];
      const b3 = hex[2];
      return `#${r4}${r4}${g}${g}${b3}${b3}80`;
    }
  }
  const cssVarMatch = color.match(RE_CSS_VAR_ANSI);
  if (cssVarMatch) return `var(${cssVarMatch[1]}-dim)`;
  return color;
}
function codeToTokensBase2(primitive, code, options = {}) {
  const lang = primitive.resolveLangAlias(options.lang || "text");
  const { theme: themeName = primitive.getLoadedThemes()[0] } = options;
  if (!isPlainLang(lang) && !isNoneTheme(themeName) && lang === "ansi") {
    const { theme } = primitive.setTheme(themeName);
    return tokenizeAnsiWithTheme(theme, code, options);
  }
  return codeToTokensBase(primitive, code, options);
}
function codeToTokens(primitive, code, options) {
  let bg;
  let fg;
  let tokens;
  let themeName;
  let rootStyle;
  let grammarState;
  if ("themes" in options) {
    const { defaultColor = "light", cssVariablePrefix = "--shiki-", colorsRendering = "css-vars" } = options;
    const themes = Object.entries(options.themes).filter((i2) => i2[1]).map((i2) => ({
      color: i2[0],
      theme: i2[1]
    })).sort((a2, b3) => a2.color === defaultColor ? -1 : b3.color === defaultColor ? 1 : 0);
    if (themes.length === 0) throw new ShikiError("`themes` option must not be empty");
    const themeTokens = codeToTokensWithThemes(primitive, code, options, codeToTokensBase2);
    grammarState = getLastGrammarStateFromMap(themeTokens);
    if (defaultColor && "light-dark()" !== defaultColor && !themes.some((t) => t.color === defaultColor)) throw new ShikiError(`\`themes\` option must contain the defaultColor key \`${defaultColor}\``);
    const themeRegs = themes.map((t) => primitive.getTheme(t.theme));
    const themesOrder = themes.map((t) => t.color);
    tokens = themeTokens.map((line) => line.map((token2) => flatTokenVariants(token2, themesOrder, cssVariablePrefix, defaultColor, colorsRendering)));
    if (grammarState) setLastGrammarStateToMap(tokens, grammarState);
    const themeColorReplacements = themes.map((t) => resolveColorReplacements(t.theme, options));
    fg = mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, "fg", colorsRendering);
    bg = mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, "bg", colorsRendering);
    themeName = `shiki-themes ${themeRegs.map((t) => t.name).join(" ")}`;
    rootStyle = defaultColor ? void 0 : [fg, bg].join(";");
  } else if ("theme" in options) {
    const colorReplacements = resolveColorReplacements(options.theme, options);
    tokens = codeToTokensBase2(primitive, code, options);
    const _theme = primitive.getTheme(options.theme);
    bg = applyColorReplacements(_theme.bg, colorReplacements);
    fg = applyColorReplacements(_theme.fg, colorReplacements);
    themeName = _theme.name;
    grammarState = getLastGrammarStateFromMap(tokens);
  } else throw new ShikiError("Invalid options, either `theme` or `themes` must be provided");
  return {
    tokens,
    fg,
    bg,
    themeName,
    rootStyle,
    grammarState
  };
}
function mapThemeColors(themes, themeRegs, themeColorReplacements, cssVariablePrefix, defaultColor, property, colorsRendering) {
  return themes.map((t, idx) => {
    const value = applyColorReplacements(themeRegs[idx][property], themeColorReplacements[idx]) || "inherit";
    const cssVar = `${cssVariablePrefix + t.color}${property === "bg" ? "-bg" : ""}:${value}`;
    if (idx === 0 && defaultColor) {
      if (defaultColor === "light-dark()" && themes.length > 1) {
        const lightIndex = themes.findIndex((t2) => t2.color === "light");
        const darkIndex = themes.findIndex((t2) => t2.color === "dark");
        if (lightIndex === -1 || darkIndex === -1) throw new ShikiError('When using `defaultColor: "light-dark()"`, you must provide both `light` and `dark` themes');
        return `light-dark(${applyColorReplacements(themeRegs[lightIndex][property], themeColorReplacements[lightIndex]) || "inherit"}, ${applyColorReplacements(themeRegs[darkIndex][property], themeColorReplacements[darkIndex]) || "inherit"});${cssVar}`;
      }
      return value;
    }
    if (colorsRendering === "css-vars") return cssVar;
    return null;
  }).filter((i2) => !!i2).join(";");
}
var RE_WHITESPACE_ONLY = /^\s+$/;
var RE_LEADING_TRAILING_WHITESPACE = /^(\s*)(.*?)(\s*)$/;
function codeToHast(primitive, code, options, transformerContext = {
  meta: {},
  options,
  codeToHast: (_code, _options) => codeToHast(primitive, _code, _options),
  codeToTokens: (_code, _options) => codeToTokens(primitive, _code, _options)
}) {
  let input = code;
  for (const transformer of getTransformers(options)) input = transformer.preprocess?.call(transformerContext, input, options) || input;
  let { tokens, fg, bg, themeName, rootStyle, grammarState } = codeToTokens(primitive, input, options);
  const { mergeWhitespaces = true, mergeSameStyleTokens = false } = options;
  if (mergeWhitespaces === true) tokens = mergeWhitespaceTokens(tokens);
  else if (mergeWhitespaces === "never") tokens = splitWhitespaceTokens(tokens);
  if (mergeSameStyleTokens) tokens = mergeAdjacentStyledTokens(tokens);
  const contextSource = {
    ...transformerContext,
    get source() {
      return input;
    }
  };
  for (const transformer of getTransformers(options)) tokens = transformer.tokens?.call(contextSource, tokens) || tokens;
  return tokensToHast(tokens, {
    ...options,
    fg,
    bg,
    themeName,
    rootStyle: options.rootStyle === false ? false : options.rootStyle ?? rootStyle
  }, contextSource, grammarState);
}
function tokensToHast(tokens, options, transformerContext, grammarState = getLastGrammarStateFromMap(tokens)) {
  const transformers = getTransformers(options);
  const lines = [];
  const root2 = {
    type: "root",
    children: []
  };
  const { structure = "classic", tabindex = "0" } = options;
  const properties = { class: `shiki ${options.themeName || ""}` };
  if (options.rootStyle !== false) {
    if (options.rootStyle != null) properties.style = options.rootStyle;
    else properties.style = `background-color:${options.bg};color:${options.fg}`;
  }
  if (tabindex !== false && tabindex != null) properties.tabindex = tabindex.toString();
  for (const [key2, value] of Object.entries(options.meta || {})) if (!key2.startsWith("_")) properties[key2] = value;
  let preNode = {
    type: "element",
    tagName: "pre",
    properties,
    children: [],
    data: options.data
  };
  let codeNode = {
    type: "element",
    tagName: "code",
    properties: {},
    children: lines
  };
  const lineNodes = [];
  const context = {
    ...transformerContext,
    structure,
    addClassToHast,
    get source() {
      return transformerContext.source;
    },
    get tokens() {
      return tokens;
    },
    get options() {
      return options;
    },
    get root() {
      return root2;
    },
    get pre() {
      return preNode;
    },
    get code() {
      return codeNode;
    },
    get lines() {
      return lineNodes;
    }
  };
  tokens.forEach((line, idx) => {
    if (idx) {
      if (structure === "inline") root2.children.push({
        type: "element",
        tagName: "br",
        properties: {},
        children: []
      });
      else if (structure === "classic") lines.push({
        type: "text",
        value: "\n"
      });
    }
    let lineNode = {
      type: "element",
      tagName: "span",
      properties: { class: "line" },
      children: []
    };
    let col = 0;
    for (const token2 of line) {
      let tokenNode = {
        type: "element",
        tagName: "span",
        properties: { ...token2.htmlAttrs },
        children: [{
          type: "text",
          value: token2.content
        }]
      };
      const style = stringifyTokenStyle(token2.htmlStyle || getTokenStyleObject(token2));
      if (style) tokenNode.properties.style = style;
      for (const transformer of transformers) tokenNode = transformer?.span?.call(context, tokenNode, idx + 1, col, lineNode, token2) || tokenNode;
      if (structure === "inline") root2.children.push(tokenNode);
      else if (structure === "classic") lineNode.children.push(tokenNode);
      col += token2.content.length;
    }
    if (structure === "classic") {
      for (const transformer of transformers) lineNode = transformer?.line?.call(context, lineNode, idx + 1) || lineNode;
      lineNodes.push(lineNode);
      lines.push(lineNode);
    } else if (structure === "inline") lineNodes.push(lineNode);
  });
  if (structure === "classic") {
    for (const transformer of transformers) codeNode = transformer?.code?.call(context, codeNode) || codeNode;
    preNode.children.push(codeNode);
    for (const transformer of transformers) preNode = transformer?.pre?.call(context, preNode) || preNode;
    root2.children.push(preNode);
  } else if (structure === "inline") {
    const syntheticLines = [];
    let currentLine = {
      type: "element",
      tagName: "span",
      properties: { class: "line" },
      children: []
    };
    for (const child of root2.children) if (child.type === "element" && child.tagName === "br") {
      syntheticLines.push(currentLine);
      currentLine = {
        type: "element",
        tagName: "span",
        properties: { class: "line" },
        children: []
      };
    } else if (child.type === "element" || child.type === "text") currentLine.children.push(child);
    syntheticLines.push(currentLine);
    let transformedCode = {
      type: "element",
      tagName: "code",
      properties: {},
      children: syntheticLines
    };
    for (const transformer of transformers) transformedCode = transformer?.code?.call(context, transformedCode) || transformedCode;
    root2.children = [];
    for (let i2 = 0; i2 < transformedCode.children.length; i2++) {
      if (i2 > 0) root2.children.push({
        type: "element",
        tagName: "br",
        properties: {},
        children: []
      });
      const line = transformedCode.children[i2];
      if (line.type === "element") root2.children.push(...line.children);
    }
  }
  let result = root2;
  for (const transformer of transformers) result = transformer?.root?.call(context, result) || result;
  if (grammarState) setLastGrammarStateToMap(result, grammarState);
  return result;
}
function mergeWhitespaceTokens(tokens) {
  return tokens.map((line) => {
    const newLine = [];
    let carryOnContent = "";
    let firstOffset;
    line.forEach((token2, idx) => {
      const couldMerge = !(token2.fontStyle && (token2.fontStyle & FontStyle.Underline || token2.fontStyle & FontStyle.Strikethrough));
      if (couldMerge && RE_WHITESPACE_ONLY.test(token2.content) && line[idx + 1]) {
        if (firstOffset === void 0) firstOffset = token2.offset;
        carryOnContent += token2.content;
      } else if (carryOnContent) {
        if (couldMerge) newLine.push({
          ...token2,
          offset: firstOffset,
          content: carryOnContent + token2.content
        });
        else newLine.push({
          content: carryOnContent,
          offset: firstOffset
        }, token2);
        firstOffset = void 0;
        carryOnContent = "";
      } else newLine.push(token2);
    });
    return newLine;
  });
}
function splitWhitespaceTokens(tokens) {
  return tokens.map((line) => {
    return line.flatMap((token2) => {
      if (RE_WHITESPACE_ONLY.test(token2.content)) return token2;
      const match = token2.content.match(RE_LEADING_TRAILING_WHITESPACE);
      if (!match) return token2;
      const [, leading, content, trailing] = match;
      if (!leading && !trailing) return token2;
      const expanded = [{
        ...token2,
        offset: token2.offset + leading.length,
        content
      }];
      if (leading) expanded.unshift({
        content: leading,
        offset: token2.offset
      });
      if (trailing) expanded.push({
        content: trailing,
        offset: token2.offset + leading.length + content.length
      });
      return expanded;
    });
  });
}
function mergeAdjacentStyledTokens(tokens) {
  return tokens.map((line) => {
    const newLine = [];
    for (const token2 of line) {
      if (newLine.length === 0) {
        newLine.push({ ...token2 });
        continue;
      }
      const prevToken = newLine.at(-1);
      const prevStyle = stringifyTokenStyle(prevToken.htmlStyle || getTokenStyleObject(prevToken));
      const currentStyle = stringifyTokenStyle(token2.htmlStyle || getTokenStyleObject(token2));
      const isPrevDecorated = prevToken.fontStyle && (prevToken.fontStyle & FontStyle.Underline || prevToken.fontStyle & FontStyle.Strikethrough);
      const isDecorated = token2.fontStyle && (token2.fontStyle & FontStyle.Underline || token2.fontStyle & FontStyle.Strikethrough);
      if (!isPrevDecorated && !isDecorated && prevStyle === currentStyle) prevToken.content += token2.content;
      else newLine.push({ ...token2 });
    }
    return newLine;
  });
}
var hastToHtml = toHtml;
function codeToHtml(primitive, code, options) {
  const context = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(primitive, _code, _options),
    codeToTokens: (_code, _options) => codeToTokens(primitive, _code, _options)
  };
  let result = hastToHtml(codeToHast(primitive, code, options, context));
  for (const transformer of getTransformers(options)) result = transformer.postprocess?.call(context, result, options) || result;
  return result;
}
function createHighlighterCoreSync(options) {
  const internal = createShikiPrimitive(options);
  return {
    getLastGrammarState: (...args) => getLastGrammarState(internal, ...args),
    codeToTokensBase: (code, options2) => codeToTokensBase2(internal, code, options2),
    codeToTokensWithThemes: (code, options2) => codeToTokensWithThemes(internal, code, options2),
    codeToTokens: (code, options2) => codeToTokens(internal, code, options2),
    codeToHast: (code, options2) => codeToHast(internal, code, options2),
    codeToHtml: (code, options2) => codeToHtml(internal, code, options2),
    getBundledLanguages: () => ({}),
    getBundledThemes: () => ({}),
    ...internal,
    getInternalContext: () => internal
  };
}

// node_modules/@shikijs/engine-javascript/dist/string-CFc1qfdw.mjs
var MAX = 4294967295;
function isSearchCacheable(regexp) {
  return !regexp.sticky && !regexp.rawOptions?.strategy;
}
function toResult(index, indices) {
  return {
    index,
    captureIndices: indices.map((indice) => {
      if (indice == null) return {
        start: MAX,
        end: MAX,
        length: 0
      };
      return {
        start: indice[0],
        end: indice[1],
        length: indice[1] - indice[0]
      };
    })
  };
}
var JavaScriptScanner = class {
  patterns;
  options;
  regexps;
  /**
  * Last search of each regexp on the current string, reused the way `vscode-oniguruma` does.
  * `null` for regexps whose searches can't be reused.
  */
  lastSearches;
  constructor(patterns, options = {}) {
    this.patterns = patterns;
    this.options = options;
    const { forgiving = false, cache, regexConstructor } = options;
    if (!regexConstructor) throw new Error("Option `regexConstructor` is not provided");
    this.regexps = patterns.map((p2) => {
      if (typeof p2 !== "string") return p2;
      const cached = cache?.get(p2);
      if (cached) {
        if (cached instanceof RegExp) return cached;
        if (forgiving) return null;
        throw cached;
      }
      try {
        const regex = regexConstructor(p2);
        cache?.set(p2, regex);
        return regex;
      } catch (e) {
        cache?.set(p2, e);
        if (forgiving) return null;
        throw e;
      }
    });
    this.lastSearches = this.regexps.map((regexp) => regexp && isSearchCacheable(regexp) ? {
      strId: 0,
      searchedFrom: 0,
      matchIndex: -1,
      indices: null
    } : null);
  }
  findNextMatchSync(string, startPosition, _options) {
    const str = typeof string === "string" ? string : string.content;
    const strId = typeof string === "string" ? 0 : string.id || 0;
    let bestIndex = -1;
    let bestMatchIndex = 0;
    let bestIndices = null;
    for (let i2 = 0; i2 < this.regexps.length; i2++) {
      const regexp = this.regexps[i2];
      if (!regexp) continue;
      try {
        const last = strId ? this.lastSearches[i2] : null;
        let matchIndex;
        let indices;
        if (last && last.strId === strId && last.searchedFrom <= startPosition && (last.matchIndex === -1 || last.matchIndex >= startPosition)) {
          matchIndex = last.matchIndex;
          indices = last.indices;
        } else {
          regexp.lastIndex = startPosition;
          const match = regexp.exec(str);
          matchIndex = match ? match.index : -1;
          indices = match ? match.indices : null;
          if (last) {
            last.strId = strId;
            last.searchedFrom = startPosition;
            last.matchIndex = matchIndex;
            last.indices = indices;
          }
        }
        if (matchIndex === -1) continue;
        if (matchIndex === startPosition) return toResult(i2, indices);
        if (bestIndex === -1 || matchIndex < bestMatchIndex) {
          bestIndex = i2;
          bestMatchIndex = matchIndex;
          bestIndices = indices;
        }
      } catch (e) {
        if (this.options.forgiving) continue;
        throw e;
      }
    }
    return bestIndex === -1 ? null : toResult(bestIndex, bestIndices);
  }
};
var lastStringId = 0;
function createJavaScriptEngineString(content) {
  return {
    content,
    id: ++lastStringId
  };
}

// node_modules/oniguruma-parser/dist/utils.js
function r(e) {
  if ([...e].length !== 1) throw new Error(`Expected "${e}" to be a single code point`);
  return e.codePointAt(0);
}
function l(e, t, n) {
  return e.has(t) || e.set(t, n), e.get(t);
}
var i = /* @__PURE__ */ new Set(["alnum", "alpha", "ascii", "blank", "cntrl", "digit", "graph", "lower", "print", "punct", "space", "upper", "word", "xdigit"]);
var o = String.raw;
function u(e, t) {
  if (e == null) throw new Error(t ?? "Value expected");
  return e;
}

// node_modules/oniguruma-parser/dist/tokenizer/tokenize.js
var m = o`\[\^?`;
var b = `c.? | C(?:-.?)?|${o`[pP]\{(?:\^?[-\x20_]*[A-Za-z][-\x20\w]*\})?`}|${o`x[89A-Fa-f]\p{AHex}(?:\\x[89A-Fa-f]\p{AHex})*`}|${o`u(?:\p{AHex}{4})? | x\{[^\}]*\}? | x\p{AHex}{0,2}`}|${o`o\{[^\}]*\}?`}|${o`\d{1,3}`}`;
var y = /[?*+][?+]?|\{(?:\d+(?:,\d*)?|,\d+)\}\??/;
var C = new RegExp(o`
  \\ (?:
    ${b}
    | [gk]<[^>]*>?
    | [gk]'[^']*'?
    | .
  )
  | \( (?:
    \? (?:
      [:=!>({]
      | <[=!]
      | <[^>]*>
      | '[^']*'
      | ~\|?
      | #(?:[^)\\]|\\.?)*
      | [^:)]*[:)]
    )?
    | \*[^\)]*\)?
  )?
  | (?:${y.source})+
  | ${m}
  | .
`.replace(/\s+/g, ""), "gsu");
var T = new RegExp(o`
  \\ (?:
    ${b}
    | .
  )
  | \[:(?:\^?\p{Alpha}+|\^):\]
  | ${m}
  | &&
  | .
`.replace(/\s+/g, ""), "gsu");
function M(e, n = {}) {
  const t = { flags: "", ...n, rules: { captureGroup: false, singleline: false, ...n.rules } };
  if (typeof e != "string") throw new Error("String expected as pattern");
  const o3 = Y(t.flags), s2 = [o3.extended], a2 = { captureGroup: t.rules.captureGroup, getCurrentModX() {
    return s2.at(-1);
  }, numOpenGroups: 0, popModX() {
    s2.pop();
  }, pushModX(u2) {
    s2.push(u2);
  }, replaceCurrentModX(u2) {
    s2[s2.length - 1] = u2;
  }, singleline: t.rules.singleline };
  let r4 = [], i2;
  for (C.lastIndex = 0; i2 = C.exec(e); ) {
    const u2 = F(a2, e, i2[0], C.lastIndex);
    u2.tokens ? r4.push(...u2.tokens) : u2.token && r4.push(u2.token), u2.lastIndex !== void 0 && (C.lastIndex = u2.lastIndex);
  }
  const l3 = [];
  let c = 0;
  r4.filter((u2) => u2.type === "GroupOpen").forEach((u2) => {
    u2.kind === "capturing" ? u2.number = ++c : u2.raw === "(" && l3.push(u2);
  }), c || l3.forEach((u2, S2) => {
    u2.kind = "capturing", u2.number = S2 + 1;
  });
  const g = c || l3.length;
  return { tokens: r4.map((u2) => u2.type === "EscapedNumber" ? ee(u2, g) : u2).flat(), flags: o3 };
}
function F(e, n, t, o3) {
  const [s2, a2] = t;
  if (t === "[" || t === "[^") {
    const r4 = K(n, t, o3);
    return { tokens: r4.tokens, lastIndex: r4.lastIndex };
  }
  if (s2 === "\\") {
    if ("AbBGyYzZ".includes(a2)) return { token: w(t, t) };
    if (/^\\g[<']/.test(t)) {
      if (!/^\\g(?:<[^>]+>|'[^']+')$/.test(t)) throw new Error(`Invalid group name "${t}"`);
      return { token: R(t) };
    }
    if (/^\\k[<']/.test(t)) {
      if (!/^\\k(?:<[^>]+>|'[^']+')$/.test(t)) throw new Error(`Invalid group name "${t}"`);
      return { token: A(t) };
    }
    if (a2 === "K") return { token: I("keep", t) };
    if (a2 === "N" || a2 === "R") return { token: k("newline", t, { negate: a2 === "N" }) };
    if (a2 === "O") return { token: k("any", t) };
    if (a2 === "X") return { token: k("text_segment", t) };
    const r4 = x(t, { inCharClass: false });
    return Array.isArray(r4) ? { tokens: r4 } : { token: r4 };
  }
  if (s2 === "(") {
    if (a2 === "*") return { token: j(t) };
    if (t === "(?{") throw new Error(`Unsupported callout "${t}"`);
    if (t.startsWith("(?#")) {
      if (n[o3] !== ")") throw new Error('Unclosed comment group "(?#"');
      return { lastIndex: o3 + 1 };
    }
    if (/^\(\?[-imx]+[:)]$/.test(t)) return { token: L(t, e) };
    if (e.pushModX(e.getCurrentModX()), e.numOpenGroups++, t === "(" && !e.captureGroup || t === "(?:") return { token: f("group", t) };
    if (t === "(?>") return { token: f("atomic", t) };
    if (t === "(?=" || t === "(?!" || t === "(?<=" || t === "(?<!") return { token: f(t[2] === "<" ? "lookbehind" : "lookahead", t, { negate: t.endsWith("!") }) };
    if (t === "(" && e.captureGroup || t.startsWith("(?<") && t.endsWith(">") || t.startsWith("(?'") && t.endsWith("'")) return { token: f("capturing", t, { ...t !== "(" && { name: t.slice(3, -1) } }) };
    if (t.startsWith("(?~")) {
      if (t === "(?~|") throw new Error(`Unsupported absence function kind "${t}"`);
      return { token: f("absence_repeater", t) };
    }
    throw t === "(?(" ? new Error(`Unsupported conditional "${t}"`) : new Error(`Invalid or unsupported group option "${t}"`);
  }
  if (t === ")") {
    if (e.popModX(), e.numOpenGroups--, e.numOpenGroups < 0) throw new Error('Unmatched ")"');
    return { token: Q(t) };
  }
  if (e.getCurrentModX()) {
    if (t === "#") {
      const r4 = n.indexOf(`
`, o3);
      return { lastIndex: r4 === -1 ? n.length : r4 };
    }
    if (/^\s$/.test(t)) {
      const r4 = /\s+/y;
      return r4.lastIndex = o3, { lastIndex: r4.exec(n) ? r4.lastIndex : o3 };
    }
  }
  if (t === ".") return { token: k("dot", t) };
  if (t === "^" || t === "$") {
    const r4 = e.singleline ? { "^": o`\A`, $: o`\Z` }[t] : t;
    return { token: w(r4, t) };
  }
  return t === "|" ? { token: P(t) } : y.test(t) ? { tokens: te(t) } : { token: d(r(t), t) };
}
function K(e, n, t) {
  const o3 = [E(n[1] === "^", n)];
  let s2 = 1, a2;
  for (T.lastIndex = t; a2 = T.exec(e); ) {
    const r4 = a2[0];
    if (r4[0] === "[" && r4[1] !== ":") s2++, o3.push(E(r4[1] === "^", r4));
    else if (r4 === "]") {
      if (o3.at(-1).type === "CharacterClassOpen") o3.push(d(93, r4));
      else if (s2--, o3.push(z(r4)), !s2) break;
    } else {
      const i2 = X(r4);
      Array.isArray(i2) ? o3.push(...i2) : o3.push(i2);
    }
  }
  return { tokens: o3, lastIndex: T.lastIndex || e.length };
}
function X(e) {
  if (e[0] === "\\") return x(e, { inCharClass: true });
  if (e[0] === "[") {
    const n = /\[:(?<negate>\^?)(?<name>[a-z]+):\]/.exec(e);
    if (!n || !i.has(n.groups.name)) throw new Error(`Invalid POSIX class "${e}"`);
    return k("posix", e, { value: n.groups.name, negate: !!n.groups.negate });
  }
  return e === "-" ? U(e) : e === "&&" ? H(e) : d(r(e), e);
}
function x(e, { inCharClass: n }) {
  const t = e[1];
  if (t === "c" || t === "C") return Z(e);
  if ("dDhHsSwW".includes(t)) return q(e);
  if (e.startsWith(o`\o{`)) throw new Error(`Incomplete, invalid, or unsupported octal code point "${e}"`);
  if (/^\\[pP]\{/.test(e)) {
    if (e.length === 3) throw new Error(`Incomplete or invalid Unicode property "${e}"`);
    return V(e);
  }
  if (new RegExp("^\\\\x[89A-Fa-f]\\p{AHex}", "u").test(e)) try {
    const o3 = e.split(/\\x/).slice(1).map((i2) => parseInt(i2, 16)), s2 = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }).decode(new Uint8Array(o3)), a2 = new TextEncoder();
    return [...s2].map((i2) => {
      const l3 = [...a2.encode(i2)].map((c) => `\\x${c.toString(16)}`).join("");
      return d(r(i2), l3);
    });
  } catch {
    throw new Error(`Multibyte code "${e}" incomplete or invalid in Oniguruma`);
  }
  if (t === "u" || t === "x") return d(J(e), e);
  if ($.has(t)) return d($.get(t), e);
  if (/\d/.test(t)) return W(n, e);
  if (e === "\\") throw new Error(o`Incomplete escape "\"`);
  if (t === "M") throw new Error(`Unsupported meta "${e}"`);
  if ([...e].length === 2) return d(e.codePointAt(1), e);
  throw new Error(`Unexpected escape "${e}"`);
}
function P(e) {
  return { type: "Alternator", raw: e };
}
function w(e, n) {
  return { type: "Assertion", kind: e, raw: n };
}
function A(e) {
  return { type: "Backreference", raw: e };
}
function d(e, n) {
  return { type: "Character", value: e, raw: n };
}
function z(e) {
  return { type: "CharacterClassClose", raw: e };
}
function U(e) {
  return { type: "CharacterClassHyphen", raw: e };
}
function H(e) {
  return { type: "CharacterClassIntersector", raw: e };
}
function E(e, n) {
  return { type: "CharacterClassOpen", negate: e, raw: n };
}
function k(e, n, t = {}) {
  return { type: "CharacterSet", kind: e, ...t, raw: n };
}
function I(e, n, t = {}) {
  return e === "keep" ? { type: "Directive", kind: e, raw: n } : { type: "Directive", kind: e, flags: u(t.flags), raw: n };
}
function W(e, n) {
  return { type: "EscapedNumber", inCharClass: e, raw: n };
}
function Q(e) {
  return { type: "GroupClose", raw: e };
}
function f(e, n, t = {}) {
  return { type: "GroupOpen", kind: e, ...t, raw: n };
}
function D(e, n, t, o3) {
  return { type: "NamedCallout", kind: e, tag: n, arguments: t, raw: o3 };
}
function _(e, n, t, o3) {
  return { type: "Quantifier", kind: e, min: n, max: t, raw: o3 };
}
function R(e) {
  return { type: "Subroutine", raw: e };
}
var B = /* @__PURE__ */ new Set(["COUNT", "CMP", "ERROR", "FAIL", "MAX", "MISMATCH", "SKIP", "TOTAL_COUNT"]);
var $ = /* @__PURE__ */ new Map([["a", 7], ["b", 8], ["e", 27], ["f", 12], ["n", 10], ["r", 13], ["t", 9], ["v", 11]]);
function Z(e) {
  const n = e[1] === "c" ? e[2] : e[3];
  if (!n || !/[A-Za-z]/.test(n)) throw new Error(`Unsupported control character "${e}"`);
  return d(r(n.toUpperCase()) - 64, e);
}
function L(e, n) {
  let { on: t, off: o3 } = /^\(\?(?<on>[imx]*)(?:-(?<off>[-imx]*))?/.exec(e).groups;
  o3 ??= "";
  const s2 = (n.getCurrentModX() || t.includes("x")) && !o3.includes("x"), a2 = v(t), r4 = v(o3), i2 = {};
  if (a2 && (i2.enable = a2), r4 && (i2.disable = r4), e.endsWith(")")) return n.replaceCurrentModX(s2), I("flags", e, { flags: i2 });
  if (e.endsWith(":")) return n.pushModX(s2), n.numOpenGroups++, f("group", e, { ...(a2 || r4) && { flags: i2 } });
  throw new Error(`Unexpected flag modifier "${e}"`);
}
function j(e) {
  const n = /\(\*(?<name>[A-Za-z_]\w*)?(?:\[(?<tag>(?:[A-Za-z_]\w*)?)\])?(?:\{(?<args>[^}]*)\})?\)/.exec(e);
  if (!n) throw new Error(`Incomplete or invalid named callout "${e}"`);
  const { name: t, tag: o3, args: s2 } = n.groups;
  if (!t) throw new Error(`Invalid named callout "${e}"`);
  if (o3 === "") throw new Error(`Named callout tag with empty value not allowed "${e}"`);
  const a2 = s2 ? s2.split(",").filter((g) => g !== "").map((g) => /^[+-]?\d+$/.test(g) ? +g : g) : [], [r4, i2, l3] = a2, c = B.has(t) ? t.toLowerCase() : "custom";
  switch (c) {
    case "fail":
    case "mismatch":
    case "skip":
      if (a2.length > 0) throw new Error(`Named callout arguments not allowed "${a2}"`);
      break;
    case "error":
      if (a2.length > 1) throw new Error(`Named callout allows only one argument "${a2}"`);
      if (typeof r4 == "string") throw new Error(`Named callout argument must be a number "${r4}"`);
      break;
    case "max":
      if (!a2.length || a2.length > 2) throw new Error(`Named callout must have one or two arguments "${a2}"`);
      if (typeof r4 == "string" && !/^[A-Za-z_]\w*$/.test(r4)) throw new Error(`Named callout argument one must be a tag or number "${r4}"`);
      if (a2.length === 2 && (typeof i2 == "number" || !/^[<>X]$/.test(i2))) throw new Error(`Named callout optional argument two must be '<', '>', or 'X' "${i2}"`);
      break;
    case "count":
    case "total_count":
      if (a2.length > 1) throw new Error(`Named callout allows only one argument "${a2}"`);
      if (a2.length === 1 && (typeof r4 == "number" || !/^[<>X]$/.test(r4))) throw new Error(`Named callout optional argument must be '<', '>', or 'X' "${r4}"`);
      break;
    case "cmp":
      if (a2.length !== 3) throw new Error(`Named callout must have three arguments "${a2}"`);
      if (typeof r4 == "string" && !/^[A-Za-z_]\w*$/.test(r4)) throw new Error(`Named callout argument one must be a tag or number "${r4}"`);
      if (typeof i2 == "number" || !/^(?:[<>!=]=|[<>])$/.test(i2)) throw new Error(`Named callout argument two must be '==', '!=', '>', '<', '>=', or '<=' "${i2}"`);
      if (typeof l3 == "string" && !/^[A-Za-z_]\w*$/.test(l3)) throw new Error(`Named callout argument three must be a tag or number "${l3}"`);
      break;
    case "custom":
      throw new Error(`Undefined callout name "${t}"`);
    default:
      throw new Error(`Unexpected named callout kind "${c}"`);
  }
  return D(c, o3 ?? null, s2?.split(",") ?? null, e);
}
function O(e) {
  let n = null, t, o3;
  if (e[0] === "{") {
    const { minStr: s2, maxStr: a2 } = /^\{(?<minStr>\d*)(?:,(?<maxStr>\d*))?/.exec(e).groups, r4 = 1e5;
    if (+s2 > r4 || a2 && +a2 > r4) throw new Error("Quantifier value unsupported in Oniguruma");
    if (t = +s2, o3 = a2 === void 0 ? +s2 : a2 === "" ? 1 / 0 : +a2, t > o3 && (n = "possessive", [t, o3] = [o3, t]), e.endsWith("?")) {
      if (n === "possessive") throw new Error('Unsupported possessive interval quantifier chain with "?"');
      n = "lazy";
    } else n || (n = "greedy");
  } else t = e[0] === "+" ? 1 : 0, o3 = e[0] === "?" ? 1 : 1 / 0, n = e[1] === "+" ? "possessive" : e[1] === "?" ? "lazy" : "greedy";
  return _(n, t, o3, e);
}
function q(e) {
  const n = e[1].toLowerCase();
  return k({ d: "digit", h: "hex", s: "space", w: "word" }[n], e, { negate: e[1] !== n });
}
function V(e) {
  const { p: n, neg: t, value: o3 } = /^\\(?<p>[pP])\{(?<neg>\^?)(?<value>[^}]+)/.exec(e).groups;
  return k("property", e, { value: o3, negate: n === "P" && !t || n === "p" && !!t });
}
function v(e) {
  const n = {};
  return e.includes("i") && (n.ignoreCase = true), e.includes("m") && (n.dotAll = true), e.includes("x") && (n.extended = true), Object.keys(n).length ? n : null;
}
function Y(e) {
  const n = { ignoreCase: false, dotAll: false, extended: false, digitIsAscii: false, posixIsAscii: false, spaceIsAscii: false, wordIsAscii: false, textSegmentMode: null };
  for (let t = 0; t < e.length; t++) {
    const o3 = e[t];
    if (!"imxDPSWy".includes(o3)) throw new Error(`Invalid flag "${o3}"`);
    if (o3 === "y") {
      if (!/^y{[gw]}/.test(e.slice(t))) throw new Error('Invalid or unspecified flag "y" mode');
      n.textSegmentMode = e[t + 2] === "g" ? "grapheme" : "word", t += 3;
      continue;
    }
    n[{ i: "ignoreCase", m: "dotAll", x: "extended", D: "digitIsAscii", P: "posixIsAscii", S: "spaceIsAscii", W: "wordIsAscii" }[o3]] = true;
  }
  return n;
}
function J(e) {
  if (new RegExp("^(?:\\\\u(?!\\p{AHex}{4})|\\\\x(?!\\p{AHex}{1,2}|\\{\\p{AHex}{1,8}\\}))", "u").test(e)) throw new Error(`Incomplete or invalid escape "${e}"`);
  const n = e[2] === "{" ? new RegExp("^\\\\x\\{\\s*(?<hex>\\p{AHex}+)", "u").exec(e).groups.hex : e.slice(2);
  return parseInt(n, 16);
}
function ee(e, n) {
  const { raw: t, inCharClass: o3 } = e, s2 = t.slice(1);
  if (!o3 && (s2 !== "0" && s2.length === 1 || s2[0] !== "0" && +s2 <= n)) return [A(t)];
  const a2 = [], r4 = s2.match(/^[0-7]+|\d/g);
  for (let i2 = 0; i2 < r4.length; i2++) {
    const l3 = r4[i2];
    let c;
    if (i2 === 0 && l3 !== "8" && l3 !== "9") {
      if (c = parseInt(l3, 8), c > 127) throw new Error(o`Octal encoded byte above 177 unsupported "${t}"`);
    } else c = r(l3);
    a2.push(d(c, (i2 === 0 ? "\\" : "") + l3));
  }
  return a2;
}
function te(e) {
  const n = [], t = new RegExp(y, "gy");
  let o3;
  for (; o3 = t.exec(e); ) {
    const s2 = o3[0];
    if (s2[0] === "{") {
      const a2 = /^\{(?<min>\d+),(?<max>\d+)\}\??$/.exec(s2);
      if (a2) {
        const { min: r4, max: i2 } = a2.groups;
        if (+r4 > +i2 && s2.endsWith("?")) {
          t.lastIndex--, n.push(O(s2.slice(0, -1)));
          continue;
        }
      }
    }
    n.push(O(s2));
  }
  return n;
}

// node_modules/oniguruma-parser/dist/parser/node-utils.js
function o2(e, t) {
  if (!Array.isArray(e.body)) throw new Error("Expected node with body array");
  if (e.body.length !== 1) return false;
  const r4 = e.body[0];
  return !t || Object.keys(t).every((n) => t[n] === r4[n]);
}
function s(e) {
  return y2.has(e.type);
}
var y2 = /* @__PURE__ */ new Set(["AbsenceFunction", "Backreference", "CapturingGroup", "Character", "CharacterClass", "CharacterSet", "Group", "Quantifier", "Subroutine"]);

// node_modules/oniguruma-parser/dist/parser/parse.js
function J2(e, r4 = {}) {
  const n = { flags: "", normalizeUnknownPropertyNames: false, skipBackrefValidation: false, skipLookbehindValidation: false, skipPropertyNameValidation: false, unicodePropertyMap: null, ...r4, rules: { captureGroup: false, singleline: false, ...r4.rules } }, o3 = M(e, { flags: n.flags, rules: { captureGroup: n.rules.captureGroup, singleline: n.rules.singleline } }), i2 = (p2, N) => {
    const u2 = o3.tokens[t.nextIndex];
    switch (t.parent = p2, t.nextIndex++, u2.type) {
      case "Alternator":
        return b2();
      case "Assertion":
        return W2(u2);
      case "Backreference":
        return X2(u2, t);
      case "Character":
        return m2(u2.value, { useLastValid: !!N.isCheckingRangeEnd });
      case "CharacterClassHyphen":
        return ee2(u2, t, N);
      case "CharacterClassOpen":
        return re2(u2, t, N);
      case "CharacterSet":
        return ne(u2, t);
      case "Directive":
        return I2(u2.kind, { flags: u2.flags });
      case "GroupOpen":
        return te2(u2, t, N);
      case "NamedCallout":
        return U2(u2.kind, u2.tag, u2.arguments);
      case "Quantifier":
        return oe(u2, t);
      case "Subroutine":
        return ae(u2, t);
      default:
        throw new Error(`Unexpected token type "${u2.type}"`);
    }
  }, t = { capturingGroups: [], hasNumberedRef: false, namedGroupsByName: /* @__PURE__ */ new Map(), nextIndex: 0, normalizeUnknownPropertyNames: n.normalizeUnknownPropertyNames, parent: null, skipBackrefValidation: n.skipBackrefValidation, skipLookbehindValidation: n.skipLookbehindValidation, skipPropertyNameValidation: n.skipPropertyNameValidation, subroutines: [], tokens: o3.tokens, unicodePropertyMap: n.unicodePropertyMap, walk: i2 }, d2 = B2(T2(o3.flags));
  let s2 = d2.body[0];
  for (; t.nextIndex < o3.tokens.length; ) {
    const p2 = i2(s2, {});
    p2.type === "Alternative" ? (d2.body.push(p2), s2 = p2) : s2.body.push(p2);
  }
  const { capturingGroups: a2, hasNumberedRef: l3, namedGroupsByName: c, subroutines: f2 } = t;
  if (l3 && c.size && !n.rules.captureGroup) throw new Error("Numbered backref/subroutine not allowed when using named capture");
  for (const { ref: p2 } of f2) if (typeof p2 == "number") {
    if (p2 > a2.length) throw new Error("Subroutine uses a group number that's not defined");
    p2 && (a2[p2 - 1].isSubroutined = true);
  } else if (c.has(p2)) {
    if (c.get(p2).length > 1) throw new Error(o`Subroutine uses a duplicate group name "\g<${p2}>"`);
    c.get(p2)[0].isSubroutined = true;
  } else throw new Error(o`Subroutine uses a group name that's not defined "\g<${p2}>"`);
  return d2;
}
function W2({ kind: e }) {
  return F2(u({ "^": "line_start", $: "line_end", "\\A": "string_start", "\\b": "word_boundary", "\\B": "word_boundary", "\\G": "search_start", "\\y": "text_segment_boundary", "\\Y": "text_segment_boundary", "\\z": "string_end", "\\Z": "string_end_newline" }[e], `Unexpected assertion kind "${e}"`), { negate: e === o`\B` || e === o`\Y` });
}
function X2({ raw: e }, r4) {
  const n = /^\\k[<']/.test(e), o3 = n ? e.slice(3, -1) : e.slice(1), i2 = (t, d2 = false) => {
    const s2 = r4.capturingGroups.length;
    let a2 = false;
    if (t > s2) if (r4.skipBackrefValidation) a2 = true;
    else throw new Error(`Not enough capturing groups defined to the left "${e}"`);
    return r4.hasNumberedRef = true, k2(d2 ? s2 + 1 - t : t, { orphan: a2 });
  };
  if (n) {
    const t = /^(?<sign>-?)0*(?<num>[1-9]\d*)$/.exec(o3);
    if (t) return i2(+t.groups.num, !!t.groups.sign);
    if (/[-+]/.test(o3)) throw new Error(`Invalid backref name "${e}"`);
    if (!r4.namedGroupsByName.has(o3)) throw new Error(`Group name not defined to the left "${e}"`);
    return k2(o3);
  }
  return i2(+o3);
}
function ee2(e, r4, n) {
  const { tokens: o3, walk: i2 } = r4, t = r4.parent, d2 = t.body.at(-1), s2 = o3[r4.nextIndex];
  if (!n.isCheckingRangeEnd && d2 && d2.type !== "CharacterClass" && d2.type !== "CharacterClassRange" && s2 && s2.type !== "CharacterClassOpen" && s2.type !== "CharacterClassClose" && s2.type !== "CharacterClassIntersector") {
    const a2 = i2(t, { ...n, isCheckingRangeEnd: true });
    if (d2.type === "Character" && a2.type === "Character") return t.body.pop(), L2(d2, a2);
    throw new Error("Invalid character class range");
  }
  return m2(r("-"));
}
function re2({ negate: e }, r4, n) {
  const { tokens: o3, walk: i2 } = r4, t = [C2()], d2 = o3[r4.nextIndex];
  let s2 = z2(d2);
  for (; s2.type !== "CharacterClassClose"; ) {
    if (s2.type === "CharacterClassIntersector") t.push(C2()), r4.nextIndex++;
    else {
      const l3 = t.at(-1);
      l3.body.push(i2(l3, n));
    }
    s2 = z2(o3[r4.nextIndex], d2);
  }
  const a2 = C2({ negate: e });
  return t.length === 1 ? a2.body = t[0].body : (a2.kind = "intersection", a2.body = t.map((l3) => l3.body.length === 1 ? l3.body[0] : l3)), r4.nextIndex++, a2;
}
function ne({ kind: e, negate: r4, value: n }, o3) {
  const { normalizeUnknownPropertyNames: i2, skipPropertyNameValidation: t, unicodePropertyMap: d2 } = o3;
  if (e === "property") {
    const s2 = w2(n);
    if (i.has(s2) && !d2?.has(s2)) e = "posix", n = s2;
    else return Q2(n, { negate: r4, normalizeUnknownPropertyNames: i2, skipPropertyNameValidation: t, unicodePropertyMap: d2 });
  }
  return e === "posix" ? R2(n, { negate: r4 }) : E2(e, { negate: r4 });
}
function te2(e, r4, n) {
  const { tokens: o3, capturingGroups: i2, namedGroupsByName: t, skipLookbehindValidation: d2, walk: s2 } = r4, a2 = ie(e), l3 = a2.type === "AbsenceFunction", c = $2(a2), f2 = c && a2.negate;
  if (a2.type === "CapturingGroup" && (i2.push(a2), a2.name && l(t, a2.name, []).push(a2)), l3 && n.isInAbsenceFunction) throw new Error("Nested absence function not supported by Oniguruma");
  let p2 = D2(o3[r4.nextIndex]);
  for (; p2.type !== "GroupClose"; ) {
    if (p2.type === "Alternator") a2.body.push(b2()), r4.nextIndex++;
    else {
      const N = a2.body.at(-1), u2 = s2(N, { ...n, isInAbsenceFunction: n.isInAbsenceFunction || l3, isInLookbehind: n.isInLookbehind || c, isInNegLookbehind: n.isInNegLookbehind || f2 });
      if (N.body.push(u2), (c || n.isInLookbehind) && !d2) {
        const v2 = "Lookbehind includes a pattern not allowed by Oniguruma";
        if (f2 || n.isInNegLookbehind) {
          if (M2(u2) || u2.type === "CapturingGroup") throw new Error(v2);
        } else if (M2(u2) || $2(u2) && u2.negate) throw new Error(v2);
      }
    }
    p2 = D2(o3[r4.nextIndex]);
  }
  return r4.nextIndex++, a2;
}
function oe({ kind: e, min: r4, max: n }, o3) {
  const i2 = o3.parent, t = i2.body.at(-1);
  if (!t || !s(t)) throw new Error("Quantifier requires a repeatable token");
  const d2 = _2(e, r4, n, t);
  return i2.body.pop(), d2;
}
function ae({ raw: e }, r4) {
  const { capturingGroups: n, subroutines: o3 } = r4;
  let i2 = e.slice(3, -1);
  const t = /^(?<sign>[-+]?)0*(?<num>[1-9]\d*)$/.exec(i2);
  if (t) {
    const s2 = +t.groups.num, a2 = n.length;
    if (r4.hasNumberedRef = true, i2 = { "": s2, "+": a2 + s2, "-": a2 + 1 - s2 }[t.groups.sign], i2 < 1) throw new Error("Invalid subroutine number");
  } else i2 === "0" && (i2 = 0);
  const d2 = O2(i2);
  return o3.push(d2), d2;
}
function G(e, r4) {
  if (e !== "repeater") throw new Error(`Unexpected absence function kind "${e}"`);
  return { type: "AbsenceFunction", kind: e, body: h(r4?.body) };
}
function b2(e) {
  return { type: "Alternative", body: V2(e?.body) };
}
function F2(e, r4) {
  const n = { type: "Assertion", kind: e };
  return (e === "word_boundary" || e === "text_segment_boundary") && (n.negate = !!r4?.negate), n;
}
function k2(e, r4) {
  const n = !!r4?.orphan;
  return { type: "Backreference", ref: e, ...n && { orphan: n } };
}
function P2(e, r4) {
  const n = { name: void 0, isSubroutined: false, ...r4 };
  if (n.name !== void 0 && !se(n.name)) throw new Error(`Group name "${n.name}" invalid in Oniguruma`);
  return { type: "CapturingGroup", number: e, ...n.name && { name: n.name }, ...n.isSubroutined && { isSubroutined: n.isSubroutined }, body: h(r4?.body) };
}
function m2(e, r4) {
  const n = { useLastValid: false, ...r4 };
  if (e > 1114111) {
    const o3 = e.toString(16);
    if (n.useLastValid) e = 1114111;
    else throw e > 1310719 ? new Error(`Invalid code point out of range "\\x{${o3}}"`) : new Error(`Invalid code point out of range in JS "\\x{${o3}}"`);
  }
  return { type: "Character", value: e };
}
function C2(e) {
  const r4 = { kind: "union", negate: false, ...e };
  return { type: "CharacterClass", kind: r4.kind, negate: r4.negate, body: V2(e?.body) };
}
function L2(e, r4) {
  if (r4.value < e.value) throw new Error("Character class range out of order");
  return { type: "CharacterClassRange", min: e, max: r4 };
}
function E2(e, r4) {
  const n = !!r4?.negate, o3 = { type: "CharacterSet", kind: e };
  return (e === "digit" || e === "hex" || e === "newline" || e === "space" || e === "word") && (o3.negate = n), (e === "text_segment" || e === "newline" && !n) && (o3.variableLength = true), o3;
}
function I2(e, r4 = {}) {
  if (e === "keep") return { type: "Directive", kind: e };
  if (e === "flags") return { type: "Directive", kind: e, flags: u(r4.flags) };
  throw new Error(`Unexpected directive kind "${e}"`);
}
function T2(e) {
  return { type: "Flags", ...e };
}
function A2(e) {
  const r4 = e?.atomic, n = e?.flags;
  if (r4 && n) throw new Error("Atomic group cannot have flags");
  return { type: "Group", ...r4 && { atomic: r4 }, ...n && { flags: n }, body: h(e?.body) };
}
function K2(e) {
  const r4 = { behind: false, negate: false, ...e };
  return { type: "LookaroundAssertion", kind: r4.behind ? "lookbehind" : "lookahead", negate: r4.negate, body: h(e?.body) };
}
function U2(e, r4, n) {
  return { type: "NamedCallout", kind: e, tag: r4, arguments: n };
}
function R2(e, r4) {
  const n = !!r4?.negate;
  if (!i.has(e)) throw new Error(`Invalid POSIX class "${e}"`);
  return { type: "CharacterSet", kind: "posix", value: e, negate: n };
}
function _2(e, r4, n, o3) {
  if (r4 > n) throw new Error("Invalid reversed quantifier range");
  return { type: "Quantifier", kind: e, min: r4, max: n, body: o3 };
}
function B2(e, r4) {
  return { type: "Regex", body: h(r4?.body), flags: e };
}
function O2(e) {
  return { type: "Subroutine", ref: e };
}
function Q2(e, r4) {
  const n = { negate: false, normalizeUnknownPropertyNames: false, skipPropertyNameValidation: false, unicodePropertyMap: null, ...r4 };
  let o3 = n.unicodePropertyMap?.get(w2(e));
  if (!o3) {
    if (n.normalizeUnknownPropertyNames) o3 = de(e);
    else if (n.unicodePropertyMap && !n.skipPropertyNameValidation) throw new Error(o`Invalid Unicode property "\p{${e}}"`);
  }
  return { type: "CharacterSet", kind: "property", value: o3 ?? e, negate: n.negate };
}
function ie({ flags: e, kind: r4, name: n, negate: o3, number: i2 }) {
  switch (r4) {
    case "absence_repeater":
      return G("repeater");
    case "atomic":
      return A2({ atomic: true });
    case "capturing":
      return P2(i2, { name: n });
    case "group":
      return A2({ flags: e });
    case "lookahead":
    case "lookbehind":
      return K2({ behind: r4 === "lookbehind", negate: o3 });
    default:
      throw new Error(`Unexpected group kind "${r4}"`);
  }
}
function h(e) {
  if (e === void 0) e = [b2()];
  else if (!Array.isArray(e) || !e.length || !e.every((r4) => r4.type === "Alternative")) throw new Error("Invalid body; expected array of one or more Alternative nodes");
  return e;
}
function V2(e) {
  if (e === void 0) e = [];
  else if (!Array.isArray(e) || !e.every((r4) => !!r4.type)) throw new Error("Invalid body; expected array of nodes");
  return e;
}
function M2(e) {
  return e.type === "LookaroundAssertion" && e.kind === "lookahead";
}
function $2(e) {
  return e.type === "LookaroundAssertion" && e.kind === "lookbehind";
}
function se(e) {
  return /^[\p{Alpha}\p{Pc}][^)]*$/u.test(e);
}
function de(e) {
  return e.trim().replace(/[- _]+/g, "_").replace(/[A-Z][a-z]+(?=[A-Z])/g, "$&_").replace(/[A-Za-z]+/g, (r4) => r4[0].toUpperCase() + r4.slice(1).toLowerCase());
}
function w2(e) {
  return e.replace(/[- _]+/g, "").toLowerCase();
}
function z2(e, r4) {
  const n = r4;
  return u(e, `Unclosed character class${n?.type === "Character" && n.value === 93 && n.raw === "]" ? ' (started with "]")' : ""}`);
}
function D2(e) {
  return u(e, "Unclosed group");
}

// node_modules/oniguruma-parser/dist/traverser/traverse.js
function S(a2, v2, N = null) {
  function b3(e, s2) {
    for (let t = 0; t < e.length; t++) {
      const r4 = n(e[t], s2, t, e);
      t = Math.max(-1, t + r4);
    }
  }
  function n(e, s2 = null, t = null, r4 = null) {
    let i2 = 0, c = false;
    const d2 = { node: e, parent: s2, key: t, container: r4, root: a2, remove() {
      x2(r4).splice(Math.max(0, l2(t) + i2), 1), i2--, c = true;
    }, removeAllNextSiblings() {
      return x2(r4).splice(l2(t) + 1);
    }, removeAllPrevSiblings() {
      const o3 = l2(t) + i2;
      return i2 -= o3, x2(r4).splice(0, Math.max(0, o3));
    }, replaceWith(o3, m3 = {}) {
      const y3 = !!m3.traverse;
      r4 ? r4[Math.max(0, l2(t) + i2)] = o3 : u(s2, "Can't replace root node")[t] = o3, y3 && n(o3, s2, t, r4), c = true;
    }, replaceWithMultiple(o3, m3 = {}) {
      const y3 = !!m3.traverse;
      if (x2(r4).splice(Math.max(0, l2(t) + i2), 1, ...o3), i2 += o3.length - 1, y3) {
        let g = 0;
        for (let p2 = 0; p2 < o3.length; p2++) g += n(o3[p2], s2, l2(t) + p2 + g, r4);
      }
      c = true;
    }, skip() {
      c = true;
    } }, { type: f2 } = e, u2 = v2["*"], h2 = v2[f2], R3 = typeof u2 == "function" ? u2 : u2?.enter, P3 = typeof h2 == "function" ? h2 : h2?.enter;
    if (R3?.(d2, N), P3?.(d2, N), !c) switch (f2) {
      case "AbsenceFunction":
      case "Alternative":
      case "CapturingGroup":
      case "CharacterClass":
      case "Group":
      case "LookaroundAssertion":
        b3(e.body, e);
        break;
      case "Assertion":
      case "Backreference":
      case "Character":
      case "CharacterSet":
      case "Directive":
      case "Flags":
      case "NamedCallout":
      case "Subroutine":
        break;
      case "CharacterClassRange":
        n(e.min, e, "min"), n(e.max, e, "max");
        break;
      case "Quantifier":
        n(e.body, e, "body");
        break;
      case "Regex":
        b3(e.body, e), n(e.flags, e, "flags");
        break;
      default:
        throw new Error(`Unexpected node type "${f2}"`);
    }
    return h2?.exit?.(d2, N), u2?.exit?.(d2, N), i2;
  }
  return n(a2), a2;
}
function x2(a2) {
  if (!Array.isArray(a2)) throw new Error("Container expected");
  return a2;
}
function l2(a2) {
  if (typeof a2 != "number") throw new Error("Numeric key expected");
  return a2;
}

// node_modules/regex/src/utils-internals.js
var noncapturingDelim = String.raw`\(\?(?:[:=!>A-Za-z\-]|<[=!]|\(DEFINE\))`;
function incrementIfAtLeast(arr, threshold) {
  for (let i2 = 0; i2 < arr.length; i2++) {
    if (arr[i2] >= threshold) {
      arr[i2]++;
    }
  }
}
function spliceStr(str, pos, oldValue, newValue) {
  return str.slice(0, pos) + newValue + str.slice(pos + oldValue.length);
}

// node_modules/regex-utilities/src/index.js
var Context = Object.freeze({
  DEFAULT: "DEFAULT",
  CHAR_CLASS: "CHAR_CLASS"
});
function replaceUnescaped(expression, needle, replacement, context) {
  const re3 = new RegExp(String.raw`${needle}|(?<$skip>\[\^?|\\?.)`, "gsu");
  const negated = [false];
  let numCharClassesOpen = 0;
  let result = "";
  for (const match of expression.matchAll(re3)) {
    const { 0: m3, groups: { $skip } } = match;
    if (!$skip && (!context || context === Context.DEFAULT === !numCharClassesOpen)) {
      if (replacement instanceof Function) {
        result += replacement(match, {
          context: numCharClassesOpen ? Context.CHAR_CLASS : Context.DEFAULT,
          negated: negated[negated.length - 1]
        });
      } else {
        result += replacement;
      }
      continue;
    }
    if (m3[0] === "[") {
      numCharClassesOpen++;
      negated.push(m3[1] === "^");
    } else if (m3 === "]" && numCharClassesOpen) {
      numCharClassesOpen--;
      negated.pop();
    }
    result += m3;
  }
  return result;
}
function forEachUnescaped(expression, needle, callback, context) {
  replaceUnescaped(expression, needle, callback, context);
}
function execUnescaped(expression, needle, pos = 0, context) {
  if (!new RegExp(needle, "su").test(expression)) {
    return null;
  }
  const re3 = new RegExp(`${needle}|(?<$skip>\\\\?.)`, "gsu");
  re3.lastIndex = pos;
  let numCharClassesOpen = 0;
  let match;
  while (match = re3.exec(expression)) {
    const { 0: m3, groups: { $skip } } = match;
    if (!$skip && (!context || context === Context.DEFAULT === !numCharClassesOpen)) {
      return match;
    }
    if (m3 === "[") {
      numCharClassesOpen++;
    } else if (m3 === "]" && numCharClassesOpen) {
      numCharClassesOpen--;
    }
    if (re3.lastIndex == match.index) {
      re3.lastIndex++;
    }
  }
  return null;
}
function hasUnescaped(expression, needle, context) {
  return !!execUnescaped(expression, needle, 0, context);
}
function getGroupContents(expression, contentsStartPos) {
  const token2 = /\\?./gsu;
  token2.lastIndex = contentsStartPos;
  let contentsEndPos = expression.length;
  let numCharClassesOpen = 0;
  let numGroupsOpen = 1;
  let match;
  while (match = token2.exec(expression)) {
    const [m3] = match;
    if (m3 === "[") {
      numCharClassesOpen++;
    } else if (!numCharClassesOpen) {
      if (m3 === "(") {
        numGroupsOpen++;
      } else if (m3 === ")") {
        numGroupsOpen--;
        if (!numGroupsOpen) {
          contentsEndPos = match.index;
          break;
        }
      }
    } else if (m3 === "]") {
      numCharClassesOpen--;
    }
  }
  return expression.slice(contentsStartPos, contentsEndPos);
}

// node_modules/regex/src/atomic.js
var atomicPluginToken = new RegExp(String.raw`(?<noncapturingStart>${noncapturingDelim})|(?<capturingStart>\((?:\?<[^>]+>)?)|\\?.`, "gsu");
function atomic(expression, data) {
  const hiddenCaptures = data?.hiddenCaptures ?? [];
  let captureTransfers = data?.captureTransfers ?? /* @__PURE__ */ new Map();
  if (!/\(\?>/.test(expression)) {
    return {
      pattern: expression,
      captureTransfers,
      hiddenCaptures
    };
  }
  const aGDelim = "(?>";
  const emulatedAGDelim = "(?:(?=(";
  const captureNumMap = [0];
  const addedHiddenCaptures = [];
  let numCapturesBeforeAG = 0;
  let numAGs = 0;
  let aGPos = NaN;
  let hasProcessedAG;
  do {
    hasProcessedAG = false;
    let numCharClassesOpen = 0;
    let numGroupsOpenInAG = 0;
    let inAG = false;
    let match;
    atomicPluginToken.lastIndex = Number.isNaN(aGPos) ? 0 : aGPos + emulatedAGDelim.length;
    while (match = atomicPluginToken.exec(expression)) {
      const { 0: m3, index, groups: { capturingStart, noncapturingStart } } = match;
      if (m3 === "[") {
        numCharClassesOpen++;
      } else if (!numCharClassesOpen) {
        if (m3 === aGDelim && !inAG) {
          aGPos = index;
          inAG = true;
        } else if (inAG && noncapturingStart) {
          numGroupsOpenInAG++;
        } else if (capturingStart) {
          if (inAG) {
            numGroupsOpenInAG++;
          } else {
            numCapturesBeforeAG++;
            captureNumMap.push(numCapturesBeforeAG + numAGs);
          }
        } else if (m3 === ")" && inAG) {
          if (!numGroupsOpenInAG) {
            numAGs++;
            const addedCaptureNum = numCapturesBeforeAG + numAGs;
            expression = `${expression.slice(0, aGPos)}${emulatedAGDelim}${expression.slice(aGPos + aGDelim.length, index)}))<$$${addedCaptureNum}>)${expression.slice(index + 1)}`;
            hasProcessedAG = true;
            addedHiddenCaptures.push(addedCaptureNum);
            incrementIfAtLeast(hiddenCaptures, addedCaptureNum);
            if (captureTransfers.size) {
              const newCaptureTransfers = /* @__PURE__ */ new Map();
              captureTransfers.forEach((from, to) => {
                newCaptureTransfers.set(
                  to >= addedCaptureNum ? to + 1 : to,
                  from.map((f2) => f2 >= addedCaptureNum ? f2 + 1 : f2)
                );
              });
              captureTransfers = newCaptureTransfers;
            }
            break;
          }
          numGroupsOpenInAG--;
        }
      } else if (m3 === "]") {
        numCharClassesOpen--;
      }
    }
  } while (hasProcessedAG);
  hiddenCaptures.push(...addedHiddenCaptures);
  expression = replaceUnescaped(
    expression,
    String.raw`\\(?<backrefNum>[1-9]\d*)|<\$\$(?<wrappedBackrefNum>\d+)>`,
    ({ 0: m3, groups: { backrefNum, wrappedBackrefNum } }) => {
      if (backrefNum) {
        const bNum = +backrefNum;
        if (bNum > captureNumMap.length - 1) {
          throw new Error(`Backref "${m3}" greater than number of captures`);
        }
        return `\\${captureNumMap[bNum]}`;
      }
      return `\\${wrappedBackrefNum}`;
    },
    Context.DEFAULT
  );
  return {
    pattern: expression,
    captureTransfers,
    hiddenCaptures
  };
}
var baseQuantifier = String.raw`(?:[?*+]|\{\d+(?:,\d*)?\})`;
var possessivePluginToken = new RegExp(String.raw`
\\(?: \d+
  | c[A-Za-z]
  | [gk]<[^>]+>
  | [pPu]\{[^\}]+\}
  | u[A-Fa-f\d]{4}
  | x[A-Fa-f\d]{2}
  )
| \((?: \? (?: [:=!>]
  | <(?:[=!]|[^>]+>)
  | [A-Za-z\-]+:
  | \(DEFINE\)
  ))?
| (?<qBase>${baseQuantifier})(?<qMod>[?+]?)(?<invalidQ>[?*+\{]?)
| \\?.
`.replace(/\s+/g, ""), "gsu");
function possessive(expression) {
  if (!new RegExp(`${baseQuantifier}\\+`).test(expression)) {
    return {
      pattern: expression
    };
  }
  const openGroupIndices = [];
  let lastGroupIndex = null;
  let lastCharClassIndex = null;
  let lastToken = "";
  let numCharClassesOpen = 0;
  let match;
  possessivePluginToken.lastIndex = 0;
  while (match = possessivePluginToken.exec(expression)) {
    const { 0: m3, index, groups: { qBase, qMod, invalidQ } } = match;
    if (m3 === "[") {
      if (!numCharClassesOpen) {
        lastCharClassIndex = index;
      }
      numCharClassesOpen++;
    } else if (m3 === "]") {
      if (numCharClassesOpen) {
        numCharClassesOpen--;
      } else {
        lastCharClassIndex = null;
      }
    } else if (!numCharClassesOpen) {
      if (qMod === "+" && lastToken && !lastToken.startsWith("(")) {
        if (invalidQ) {
          throw new Error(`Invalid quantifier "${m3}"`);
        }
        let charsAdded = -1;
        if (/^\{\d+\}$/.test(qBase)) {
          expression = spliceStr(expression, index + qBase.length, qMod, "");
        } else {
          if (lastToken === ")" || lastToken === "]") {
            const nodeIndex = lastToken === ")" ? lastGroupIndex : lastCharClassIndex;
            if (nodeIndex === null) {
              throw new Error(`Invalid unmatched "${lastToken}"`);
            }
            expression = `${expression.slice(0, nodeIndex)}(?>${expression.slice(nodeIndex, index)}${qBase})${expression.slice(index + m3.length)}`;
          } else {
            expression = `${expression.slice(0, index - lastToken.length)}(?>${lastToken}${qBase})${expression.slice(index + m3.length)}`;
          }
          charsAdded += 4;
        }
        possessivePluginToken.lastIndex += charsAdded;
      } else if (m3[0] === "(") {
        openGroupIndices.push(index);
      } else if (m3 === ")") {
        lastGroupIndex = openGroupIndices.length ? openGroupIndices.pop() : null;
      }
    }
    lastToken = m3;
  }
  return {
    pattern: expression
  };
}

// node_modules/regex-recursion/src/index.js
var r2 = String.raw;
var gRToken = r2`\\g<(?<gRNameOrNum>[^>&]+)&R=(?<gRDepth>[^>]+)>`;
var recursiveToken = r2`\(\?R=(?<rDepth>[^\)]+)\)|${gRToken}`;
var namedCaptureDelim = r2`\(\?<(?![=!])(?<captureName>[^>]+)>`;
var captureDelim = r2`${namedCaptureDelim}|(?<unnamed>\()(?!\?)`;
var token = new RegExp(r2`${namedCaptureDelim}|${recursiveToken}|\(\?|\\?.`, "gsu");
var overlappingRecursionMsg = "Cannot use multiple overlapping recursions";
function recursion(pattern, data) {
  const { hiddenCaptures, mode } = {
    hiddenCaptures: [],
    mode: "plugin",
    ...data
  };
  let captureTransfers = data?.captureTransfers ?? /* @__PURE__ */ new Map();
  if (!new RegExp(recursiveToken, "su").test(pattern)) {
    return {
      pattern,
      captureTransfers,
      hiddenCaptures
    };
  }
  if (mode === "plugin" && hasUnescaped(pattern, r2`\(\?\(DEFINE\)`, Context.DEFAULT)) {
    throw new Error("DEFINE groups cannot be used with recursion");
  }
  const addedHiddenCaptures = [];
  const hasNumberedBackref = hasUnescaped(pattern, r2`\\[1-9]`, Context.DEFAULT);
  const groupContentsStartPos = /* @__PURE__ */ new Map();
  const openGroups = [];
  let hasRecursed = false;
  let numCharClassesOpen = 0;
  let numCapturesPassed = 0;
  let match;
  token.lastIndex = 0;
  while (match = token.exec(pattern)) {
    const { 0: m3, groups: { captureName, rDepth, gRNameOrNum, gRDepth } } = match;
    if (m3 === "[") {
      numCharClassesOpen++;
    } else if (!numCharClassesOpen) {
      if (rDepth) {
        assertMaxInBounds(rDepth);
        if (hasRecursed) {
          throw new Error(overlappingRecursionMsg);
        }
        if (hasNumberedBackref) {
          throw new Error(
            // When used in `external` mode by transpilers other than Regex+, backrefs might have
            // gone through conversion from named to numbered, so avoid a misleading error
            `${mode === "external" ? "Backrefs" : "Numbered backrefs"} cannot be used with global recursion`
          );
        }
        const left = pattern.slice(0, match.index);
        const right = pattern.slice(token.lastIndex);
        if (hasUnescaped(right, recursiveToken, Context.DEFAULT)) {
          throw new Error(overlappingRecursionMsg);
        }
        const reps = +rDepth - 1;
        pattern = makeRecursive(
          left,
          right,
          reps,
          false,
          hiddenCaptures,
          addedHiddenCaptures,
          numCapturesPassed
        );
        captureTransfers = mapCaptureTransfers(
          captureTransfers,
          left,
          reps,
          addedHiddenCaptures.length,
          0,
          numCapturesPassed
        );
        break;
      } else if (gRNameOrNum) {
        assertMaxInBounds(gRDepth);
        let isWithinReffedGroup = false;
        for (const g of openGroups) {
          if (g.name === gRNameOrNum || g.num === +gRNameOrNum) {
            isWithinReffedGroup = true;
            if (g.hasRecursedWithin) {
              throw new Error(overlappingRecursionMsg);
            }
            break;
          }
        }
        if (!isWithinReffedGroup) {
          throw new Error(r2`Recursive \g cannot be used outside the referenced group "${mode === "external" ? gRNameOrNum : r2`\g<${gRNameOrNum}&R=${gRDepth}>`}"`);
        }
        const startPos = groupContentsStartPos.get(gRNameOrNum);
        const groupContents = getGroupContents(pattern, startPos);
        if (hasNumberedBackref && hasUnescaped(groupContents, r2`${namedCaptureDelim}|\((?!\?)`, Context.DEFAULT)) {
          throw new Error(
            // When used in `external` mode by transpilers other than Regex+, backrefs might have
            // gone through conversion from named to numbered, so avoid a misleading error
            `${mode === "external" ? "Backrefs" : "Numbered backrefs"} cannot be used with recursion of capturing groups`
          );
        }
        const groupContentsLeft = pattern.slice(startPos, match.index);
        const groupContentsRight = groupContents.slice(groupContentsLeft.length + m3.length);
        const numAddedHiddenCapturesPreExpansion = addedHiddenCaptures.length;
        const reps = +gRDepth - 1;
        const expansion = makeRecursive(
          groupContentsLeft,
          groupContentsRight,
          reps,
          true,
          hiddenCaptures,
          addedHiddenCaptures,
          numCapturesPassed
        );
        captureTransfers = mapCaptureTransfers(
          captureTransfers,
          groupContentsLeft,
          reps,
          addedHiddenCaptures.length - numAddedHiddenCapturesPreExpansion,
          numAddedHiddenCapturesPreExpansion,
          numCapturesPassed
        );
        const pre = pattern.slice(0, startPos);
        const post = pattern.slice(startPos + groupContents.length);
        pattern = `${pre}${expansion}${post}`;
        token.lastIndex += expansion.length - m3.length - groupContentsLeft.length - groupContentsRight.length;
        openGroups.forEach((g) => g.hasRecursedWithin = true);
        hasRecursed = true;
      } else if (captureName) {
        numCapturesPassed++;
        groupContentsStartPos.set(String(numCapturesPassed), token.lastIndex);
        groupContentsStartPos.set(captureName, token.lastIndex);
        openGroups.push({
          num: numCapturesPassed,
          name: captureName
        });
      } else if (m3[0] === "(") {
        const isUnnamedCapture = m3 === "(";
        if (isUnnamedCapture) {
          numCapturesPassed++;
          groupContentsStartPos.set(String(numCapturesPassed), token.lastIndex);
        }
        openGroups.push(isUnnamedCapture ? { num: numCapturesPassed } : {});
      } else if (m3 === ")") {
        openGroups.pop();
      }
    } else if (m3 === "]") {
      numCharClassesOpen--;
    }
  }
  hiddenCaptures.push(...addedHiddenCaptures);
  return {
    pattern,
    captureTransfers,
    hiddenCaptures
  };
}
function assertMaxInBounds(max) {
  const errMsg = `Max depth must be integer between 2 and 100; used ${max}`;
  if (!/^[1-9]\d*$/.test(max)) {
    throw new Error(errMsg);
  }
  max = +max;
  if (max < 2 || max > 100) {
    throw new Error(errMsg);
  }
}
function makeRecursive(left, right, reps, isSubpattern, hiddenCaptures, addedHiddenCaptures, numCapturesPassed) {
  const namesInRecursed = /* @__PURE__ */ new Set();
  if (isSubpattern) {
    forEachUnescaped(left + right, namedCaptureDelim, ({ groups: { captureName } }) => {
      namesInRecursed.add(captureName);
    }, Context.DEFAULT);
  }
  const rest = [
    reps,
    isSubpattern ? namesInRecursed : null,
    hiddenCaptures,
    addedHiddenCaptures,
    numCapturesPassed
  ];
  return `${left}${repeatWithDepth(`(?:${left}`, "forward", ...rest)}(?:)${repeatWithDepth(`${right})`, "backward", ...rest)}${right}`;
}
function repeatWithDepth(pattern, direction, reps, namesInRecursed, hiddenCaptures, addedHiddenCaptures, numCapturesPassed) {
  const startNum = 2;
  const getDepthNum = (i2) => direction === "forward" ? i2 + startNum : reps - i2 + startNum - 1;
  let result = "";
  for (let i2 = 0; i2 < reps; i2++) {
    const depthNum = getDepthNum(i2);
    result += replaceUnescaped(
      pattern,
      r2`${captureDelim}|\\k<(?<backref>[^>]+)>`,
      ({ 0: m3, groups: { captureName, unnamed, backref } }) => {
        if (backref && namesInRecursed && !namesInRecursed.has(backref)) {
          return m3;
        }
        const suffix = `_$${depthNum}`;
        if (unnamed || captureName) {
          const addedCaptureNum = numCapturesPassed + addedHiddenCaptures.length + 1;
          addedHiddenCaptures.push(addedCaptureNum);
          incrementIfAtLeast2(hiddenCaptures, addedCaptureNum);
          return unnamed ? m3 : `(?<${captureName}${suffix}>`;
        }
        return r2`\k<${backref}${suffix}>`;
      },
      Context.DEFAULT
    );
  }
  return result;
}
function incrementIfAtLeast2(arr, threshold) {
  for (let i2 = 0; i2 < arr.length; i2++) {
    if (arr[i2] >= threshold) {
      arr[i2]++;
    }
  }
}
function mapCaptureTransfers(captureTransfers, left, reps, numCapturesAddedInExpansion, numAddedHiddenCapturesPreExpansion, numCapturesPassed) {
  if (captureTransfers.size && numCapturesAddedInExpansion) {
    let numCapturesInLeft = 0;
    forEachUnescaped(left, captureDelim, () => numCapturesInLeft++, Context.DEFAULT);
    const recursionDelimCaptureNum = numCapturesPassed - numCapturesInLeft + numAddedHiddenCapturesPreExpansion;
    const newCaptureTransfers = /* @__PURE__ */ new Map();
    captureTransfers.forEach((from, to) => {
      const numCapturesInRight = (numCapturesAddedInExpansion - numCapturesInLeft * reps) / reps;
      const numCapturesAddedInLeft = numCapturesInLeft * reps;
      const newTo = to > recursionDelimCaptureNum + numCapturesInLeft ? to + numCapturesAddedInExpansion : to;
      const newFrom = [];
      for (const f2 of from) {
        if (f2 <= recursionDelimCaptureNum) {
          newFrom.push(f2);
        } else if (f2 > recursionDelimCaptureNum + numCapturesInLeft + numCapturesInRight) {
          newFrom.push(f2 + numCapturesAddedInExpansion);
        } else if (f2 <= recursionDelimCaptureNum + numCapturesInLeft) {
          for (let i2 = 0; i2 <= reps; i2++) {
            newFrom.push(f2 + numCapturesInLeft * i2);
          }
        } else {
          for (let i2 = 0; i2 <= reps; i2++) {
            newFrom.push(f2 + numCapturesAddedInLeft + numCapturesInRight * i2);
          }
        }
      }
      newCaptureTransfers.set(newTo, newFrom);
    });
    return newCaptureTransfers;
  }
  return captureTransfers;
}

// node_modules/oniguruma-to-es/dist/esm/index.js
var cp = String.fromCodePoint;
var r3 = String.raw;
var envFlags = {};
var globalRegExp = globalThis.RegExp;
envFlags.flagGroups = (() => {
  try {
    new globalRegExp("(?i:)");
  } catch {
    return false;
  }
  return true;
})();
envFlags.unicodeSets = (() => {
  try {
    new globalRegExp("[[]]", "v");
  } catch {
    return false;
  }
  return true;
})();
envFlags.bugFlagVLiteralHyphenIsRange = envFlags.unicodeSets ? (() => {
  try {
    new globalRegExp(r3`[\d\-a]`, "v");
  } catch {
    return true;
  }
  return false;
})() : false;
envFlags.bugNestedClassIgnoresNegation = envFlags.unicodeSets && new globalRegExp("[[^a]]", "v").test("a");
function getNewCurrentFlags(current, { enable, disable }) {
  return {
    dotAll: !disable?.dotAll && !!(enable?.dotAll || current.dotAll),
    ignoreCase: !disable?.ignoreCase && !!(enable?.ignoreCase || current.ignoreCase)
  };
}
function getOrInsert(map, key2, defaultValue) {
  if (!map.has(key2)) {
    map.set(key2, defaultValue);
  }
  return map.get(key2);
}
function isMinTarget(target, min) {
  return EsVersion[target] >= EsVersion[min];
}
function throwIfNullish(value, msg) {
  if (value == null) {
    throw new Error(msg ?? "Value expected");
  }
  return value;
}
var EsVersion = {
  ES2025: 2025,
  ES2024: 2024,
  ES2018: 2018
};
var Target = (
  /** @type {const} */
  {
    auto: "auto",
    ES2025: "ES2025",
    ES2024: "ES2024",
    ES2018: "ES2018"
  }
);
function getOptions(options = {}) {
  if ({}.toString.call(options) !== "[object Object]") {
    throw new Error("Unexpected options");
  }
  if (options.target !== void 0 && !Target[options.target]) {
    throw new Error(`Unexpected target "${options.target}"`);
  }
  const opts = {
    // Sets the level of emulation rigor/strictness.
    accuracy: "default",
    // Disables advanced emulation that relies on returning a `RegExp` subclass, resulting in
    // certain patterns not being emulatable.
    avoidSubclass: false,
    // Oniguruma flags; a string with `i`, `m`, `x`, `D`, `S`, `W`, `y{g}` in any order (all
    // optional). Oniguruma's `m` is equivalent to JavaScript's `s` (`dotAll`).
    flags: "",
    // Include JavaScript flag `g` (`global`) in the result.
    global: false,
    // Include JavaScript flag `d` (`hasIndices`) in the result.
    hasIndices: false,
    // Delay regex construction until first use if the transpiled pattern is at least this length.
    lazyCompileLength: Infinity,
    // JavaScript version used for generated regexes. Using `auto` detects the best value based on
    // your environment. Later targets allow faster processing, simpler generated source, and
    // support for additional features.
    target: "auto",
    // Disables minifications that simplify the pattern without changing the meaning.
    verbose: false,
    ...options,
    // Advanced options that override standard behavior, error checking, and flags when enabled.
    rules: {
      // Useful with TextMate grammars that merge backreferences across patterns.
      allowOrphanBackrefs: false,
      // Use ASCII `\b` and `\B`, which increases search performance of generated regexes.
      asciiWordBoundaries: false,
      // Allow unnamed captures and numbered calls (backreferences and subroutines) when using
      // named capture. This is Oniguruma option `ONIG_OPTION_CAPTURE_GROUP`; on by default in
      // `vscode-oniguruma`.
      captureGroup: false,
      // Change the recursion depth limit from Oniguruma's `20` to an integer `2`–`20`.
      recursionLimit: 20,
      // `^` as `\A`; `$` as`\Z`. Improves search performance of generated regexes without changing
      // the meaning if searching line by line. This is Oniguruma option `ONIG_OPTION_SINGLELINE`.
      singleline: false,
      ...options.rules
    }
  };
  if (opts.target === "auto") {
    opts.target = envFlags.flagGroups ? "ES2025" : envFlags.unicodeSets ? "ES2024" : "ES2018";
  }
  return opts;
}
var asciiSpaceChar = "[	-\r ]";
var CharsWithoutIgnoreCaseExpansion = /* @__PURE__ */ new Set([
  cp(304),
  // İ
  cp(305)
  // ı
]);
var defaultWordChar = r3`[\p{L}\p{M}\p{N}\p{Pc}]`;
function getIgnoreCaseMatchChars(char) {
  if (CharsWithoutIgnoreCaseExpansion.has(char)) {
    return [char];
  }
  const set = /* @__PURE__ */ new Set();
  const lower = char.toLowerCase();
  const upper = lower.toUpperCase();
  const title = LowerToTitleCaseMap.get(lower);
  const altLower = LowerToAlternativeLowerCaseMap.get(lower);
  const altUpper = LowerToAlternativeUpperCaseMap.get(lower);
  if ([...upper].length === 1) {
    set.add(upper);
  }
  altUpper && set.add(altUpper);
  title && set.add(title);
  set.add(lower);
  altLower && set.add(altLower);
  return [...set];
}
var JsUnicodePropertyMap = /* @__PURE__ */ new Map(
  `C Other
Cc Control cntrl
Cf Format
Cn Unassigned
Co Private_Use
Cs Surrogate
L Letter
LC Cased_Letter
Ll Lowercase_Letter
Lm Modifier_Letter
Lo Other_Letter
Lt Titlecase_Letter
Lu Uppercase_Letter
M Mark Combining_Mark
Mc Spacing_Mark
Me Enclosing_Mark
Mn Nonspacing_Mark
N Number
Nd Decimal_Number digit
Nl Letter_Number
No Other_Number
P Punctuation punct
Pc Connector_Punctuation
Pd Dash_Punctuation
Pe Close_Punctuation
Pf Final_Punctuation
Pi Initial_Punctuation
Po Other_Punctuation
Ps Open_Punctuation
S Symbol
Sc Currency_Symbol
Sk Modifier_Symbol
Sm Math_Symbol
So Other_Symbol
Z Separator
Zl Line_Separator
Zp Paragraph_Separator
Zs Space_Separator
ASCII
ASCII_Hex_Digit AHex
Alphabetic Alpha
Any
Assigned
Bidi_Control Bidi_C
Bidi_Mirrored Bidi_M
Case_Ignorable CI
Cased
Changes_When_Casefolded CWCF
Changes_When_Casemapped CWCM
Changes_When_Lowercased CWL
Changes_When_NFKC_Casefolded CWKCF
Changes_When_Titlecased CWT
Changes_When_Uppercased CWU
Dash
Default_Ignorable_Code_Point DI
Deprecated Dep
Diacritic Dia
Emoji
Emoji_Component EComp
Emoji_Modifier EMod
Emoji_Modifier_Base EBase
Emoji_Presentation EPres
Extended_Pictographic ExtPict
Extender Ext
Grapheme_Base Gr_Base
Grapheme_Extend Gr_Ext
Hex_Digit Hex
IDS_Binary_Operator IDSB
IDS_Trinary_Operator IDST
ID_Continue IDC
ID_Start IDS
Ideographic Ideo
Join_Control Join_C
Logical_Order_Exception LOE
Lowercase Lower
Math
Noncharacter_Code_Point NChar
Pattern_Syntax Pat_Syn
Pattern_White_Space Pat_WS
Quotation_Mark QMark
Radical
Regional_Indicator RI
Sentence_Terminal STerm
Soft_Dotted SD
Terminal_Punctuation Term
Unified_Ideograph UIdeo
Uppercase Upper
Variation_Selector VS
White_Space space
XID_Continue XIDC
XID_Start XIDS`.split(/\s/).map((p2) => [w2(p2), p2])
);
var LowerToAlternativeLowerCaseMap = /* @__PURE__ */ new Map([
  ["s", cp(383)],
  // s, ſ
  [cp(383), "s"]
  // ſ, s
]);
var LowerToAlternativeUpperCaseMap = /* @__PURE__ */ new Map([
  [cp(223), cp(7838)],
  // ß, ẞ
  [cp(107), cp(8490)],
  // k, K (Kelvin)
  [cp(229), cp(8491)],
  // å, Å (Angstrom)
  [cp(969), cp(8486)]
  // ω, Ω (Ohm)
]);
var LowerToTitleCaseMap = new Map([
  titleEntry(453),
  titleEntry(456),
  titleEntry(459),
  titleEntry(498),
  ...titleRange(8072, 8079),
  ...titleRange(8088, 8095),
  ...titleRange(8104, 8111),
  titleEntry(8124),
  titleEntry(8140),
  titleEntry(8188)
]);
var PosixClassMap = /* @__PURE__ */ new Map([
  ["alnum", r3`[\p{Alpha}\p{Nd}]`],
  ["alpha", r3`\p{Alpha}`],
  ["ascii", r3`\p{ASCII}`],
  ["blank", r3`[\p{Zs}\t]`],
  ["cntrl", r3`\p{Cc}`],
  ["digit", r3`\p{Nd}`],
  ["graph", r3`[\P{space}&&\P{Cc}&&\P{Cn}&&\P{Cs}]`],
  ["lower", r3`\p{Lower}`],
  ["print", r3`[[\P{space}&&\P{Cc}&&\P{Cn}&&\P{Cs}]\p{Zs}]`],
  ["punct", r3`[\p{P}\p{S}]`],
  // Updated value from Onig 6.9.9; changed from Unicode `\p{punct}`
  ["space", r3`\p{space}`],
  ["upper", r3`\p{Upper}`],
  ["word", r3`[\p{Alpha}\p{M}\p{Nd}\p{Pc}]`],
  ["xdigit", r3`\p{AHex}`]
]);
function range(start, end) {
  const range2 = [];
  for (let i2 = start; i2 <= end; i2++) {
    range2.push(i2);
  }
  return range2;
}
function titleEntry(codePoint) {
  const char = cp(codePoint);
  return [char.toLowerCase(), char];
}
function titleRange(start, end) {
  return range(start, end).map((codePoint) => titleEntry(codePoint));
}
var UnicodePropertiesWithSpecificCase = /* @__PURE__ */ new Set([
  "Lower",
  "Lowercase",
  "Upper",
  "Uppercase",
  "Ll",
  "Lowercase_Letter",
  "Lt",
  "Titlecase_Letter",
  "Lu",
  "Uppercase_Letter"
  // The `Changes_When_*` properties (and their aliases) could be included, but they're very rare.
  // Some other properties include a handful of chars with specific cases only, but these chars are
  // generally extreme edge cases and using such properties case insensitively generally produces
  // undesired behavior anyway
]);
function transform(ast, options) {
  const opts = {
    // A couple edge cases exist where options `accuracy` and `bestEffortTarget` are used:
    // - `CharacterSet` kind `text_segment` (`\X`): An exact representation would require heavy
    //   Unicode data; a best-effort approximation requires knowing the target.
    // - `CharacterSet` kind `posix` with values `graph` and `print`: Their complex Unicode
    //   representations would be hard to change to ASCII versions after the fact in the generator
    //   based on `target`/`accuracy`, so produce the appropriate structure here.
    accuracy: "default",
    asciiWordBoundaries: false,
    avoidSubclass: false,
    bestEffortTarget: "ES2025",
    ...options
  };
  addParentProperties(ast);
  const firstPassState = {
    accuracy: opts.accuracy,
    asciiWordBoundaries: opts.asciiWordBoundaries,
    avoidSubclass: opts.avoidSubclass,
    flagDirectivesByAlt: /* @__PURE__ */ new Map(),
    jsGroupNameMap: /* @__PURE__ */ new Map(),
    minTargetEs2024: isMinTarget(opts.bestEffortTarget, "ES2024"),
    passedLookbehind: false,
    strategy: null,
    // Subroutines can appear before the groups they ref, so collect reffed nodes for a second pass 
    subroutineRefMap: /* @__PURE__ */ new Map(),
    supportedGNodes: /* @__PURE__ */ new Set(),
    digitIsAscii: ast.flags.digitIsAscii,
    spaceIsAscii: ast.flags.spaceIsAscii,
    wordIsAscii: ast.flags.wordIsAscii
  };
  S(ast, FirstPassVisitor, firstPassState);
  const globalFlags = {
    dotAll: ast.flags.dotAll,
    ignoreCase: ast.flags.ignoreCase
  };
  const secondPassState = {
    currentFlags: globalFlags,
    prevFlags: null,
    globalFlags,
    groupOriginByCopy: /* @__PURE__ */ new Map(),
    groupsByName: /* @__PURE__ */ new Map(),
    multiplexCapturesToLeftByRef: /* @__PURE__ */ new Map(),
    openRefs: /* @__PURE__ */ new Map(),
    reffedNodesByReferencer: /* @__PURE__ */ new Map(),
    subroutineRefMap: firstPassState.subroutineRefMap
  };
  S(ast, SecondPassVisitor, secondPassState);
  const thirdPassState = {
    groupsByName: secondPassState.groupsByName,
    highestOrphanBackref: 0,
    numCapturesToLeft: 0,
    reffedNodesByReferencer: secondPassState.reffedNodesByReferencer
  };
  S(ast, ThirdPassVisitor, thirdPassState);
  ast._originMap = secondPassState.groupOriginByCopy;
  ast._strategy = firstPassState.strategy;
  return ast;
}
var FirstPassVisitor = {
  AbsenceFunction({ node, parent, replaceWith }) {
    const { body: body3, kind } = node;
    if (kind === "repeater") {
      const innerGroup = A2();
      innerGroup.body[0].body.push(
        // Insert own alts as `body`
        K2({ negate: true, body: body3 }),
        Q2("Any")
      );
      const outerGroup = A2();
      outerGroup.body[0].body.push(
        _2("greedy", 0, Infinity, innerGroup)
      );
      replaceWith(setParentDeep(outerGroup, parent), { traverse: true });
    } else {
      throw new Error(`Unsupported absence function "(?~|"`);
    }
  },
  Alternative: {
    enter({ node, parent, key: key2 }, { flagDirectivesByAlt }) {
      const flagDirectives = node.body.filter((el) => el.kind === "flags");
      for (let i2 = key2 + 1; i2 < parent.body.length; i2++) {
        const forwardSiblingAlt = parent.body[i2];
        getOrInsert(flagDirectivesByAlt, forwardSiblingAlt, []).push(...flagDirectives);
      }
    },
    exit({ node }, { flagDirectivesByAlt }) {
      if (flagDirectivesByAlt.get(node)?.length) {
        const flags = getCombinedFlagModsFromFlagNodes(flagDirectivesByAlt.get(node));
        if (flags) {
          const flagGroup = A2({ flags });
          flagGroup.body[0].body = node.body;
          node.body = [setParentDeep(flagGroup, node)];
        }
      }
    }
  },
  Assertion({ node, parent, key: key2, container, root: root2, remove, replaceWith }, state) {
    const { kind, negate } = node;
    const { asciiWordBoundaries, avoidSubclass, supportedGNodes, wordIsAscii } = state;
    if (kind === "text_segment_boundary") {
      throw new Error(`Unsupported text segment boundary "\\${negate ? "Y" : "y"}"`);
    } else if (kind === "line_end") {
      replaceWith(setParentDeep(K2({ body: [
        b2({ body: [F2("string_end")] }),
        b2({ body: [m2(10)] })
        // `\n`
      ] }), parent));
    } else if (kind === "line_start") {
      replaceWith(setParentDeep(parseFragment(r3`(?<=\A|\n(?!\z))`, { skipLookbehindValidation: true }), parent));
    } else if (kind === "search_start") {
      if (supportedGNodes.has(node)) {
        root2.flags.sticky = true;
        remove();
      } else {
        const prev = container[key2 - 1];
        if (prev && isAlwaysNonZeroLength(prev)) {
          replaceWith(setParentDeep(K2({ negate: true }), parent));
        } else if (avoidSubclass) {
          throw new Error(r3`Uses "\G" in a way that requires a subclass`);
        } else {
          replaceWith(setParent(F2("string_start"), parent));
          state.strategy = "clip_search";
        }
      }
    } else if (kind === "string_end" || kind === "string_start") {
    } else if (kind === "string_end_newline") {
      replaceWith(setParentDeep(parseFragment(r3`(?=\n?\z)`), parent));
    } else if (kind === "word_boundary") {
      if (!wordIsAscii && !asciiWordBoundaries) {
        const b3 = `(?:(?<=${defaultWordChar})(?!${defaultWordChar})|(?<!${defaultWordChar})(?=${defaultWordChar}))`;
        const B3 = `(?:(?<=${defaultWordChar})(?=${defaultWordChar})|(?<!${defaultWordChar})(?!${defaultWordChar}))`;
        replaceWith(setParentDeep(parseFragment(negate ? B3 : b3), parent));
      }
    } else {
      throw new Error(`Unexpected assertion kind "${kind}"`);
    }
  },
  Backreference({ node }, { jsGroupNameMap }) {
    let { ref } = node;
    if (typeof ref === "string" && !isValidJsGroupName(ref)) {
      ref = getAndStoreJsGroupName(ref, jsGroupNameMap);
      node.ref = ref;
    }
  },
  CapturingGroup({ node }, { jsGroupNameMap, subroutineRefMap }) {
    let { name } = node;
    if (name && !isValidJsGroupName(name)) {
      name = getAndStoreJsGroupName(name, jsGroupNameMap);
      node.name = name;
    }
    subroutineRefMap.set(node.number, node);
    if (name) {
      subroutineRefMap.set(name, node);
    }
  },
  CharacterClassRange({ node, parent, replaceWith }) {
    if (parent.kind === "intersection") {
      const cc = C2({ body: [node] });
      replaceWith(setParentDeep(cc, parent), { traverse: true });
    }
  },
  CharacterSet({ node, parent, replaceWith }, { accuracy, minTargetEs2024, digitIsAscii, spaceIsAscii, wordIsAscii }) {
    const { kind, negate, value } = node;
    if (digitIsAscii && (kind === "digit" || value === "digit")) {
      replaceWith(setParent(E2("digit", { negate }), parent));
      return;
    }
    if (spaceIsAscii && (kind === "space" || value === "space")) {
      replaceWith(setParentDeep(setNegate(parseFragment(asciiSpaceChar), negate), parent));
      return;
    }
    if (wordIsAscii && (kind === "word" || value === "word")) {
      replaceWith(setParent(E2("word", { negate }), parent));
      return;
    }
    if (kind === "any") {
      replaceWith(setParent(Q2("Any"), parent));
    } else if (kind === "digit") {
      replaceWith(setParent(Q2("Nd", { negate }), parent));
    } else if (kind === "dot") {
    } else if (kind === "text_segment") {
      if (accuracy === "strict") {
        throw new Error(r3`Use of "\X" requires non-strict accuracy`);
      }
      const eBase = "\\p{Emoji}(?:\\p{EMod}|\\uFE0F\\u20E3?|[\\x{E0020}-\\x{E007E}]+\\x{E007F})?";
      const emoji = r3`\p{RI}{2}|${eBase}(?:\u200D${eBase})*`;
      replaceWith(setParentDeep(parseFragment(
        // Close approximation of an extended grapheme cluster; see <unicode.org/reports/tr29/>
        r3`(?>\r\n|${minTargetEs2024 ? r3`\p{RGI_Emoji}` : emoji}|\P{M}\p{M}*)`,
        // Allow JS property `RGI_Emoji` through
        { skipPropertyNameValidation: true }
      ), parent));
    } else if (kind === "hex") {
      replaceWith(setParent(Q2("AHex", { negate }), parent));
    } else if (kind === "newline") {
      replaceWith(setParentDeep(parseFragment(negate ? "[^\n]" : "(?>\r\n?|[\n\v\f\x85\u2028\u2029])"), parent));
    } else if (kind === "posix") {
      if (!minTargetEs2024 && (value === "graph" || value === "print")) {
        if (accuracy === "strict") {
          throw new Error(`POSIX class "${value}" requires min target ES2024 or non-strict accuracy`);
        }
        let ascii = {
          graph: "!-~",
          print: " -~"
        }[value];
        if (negate) {
          ascii = `\0-${cp(ascii.codePointAt(0) - 1)}${cp(ascii.codePointAt(2) + 1)}-\u{10FFFF}`;
        }
        replaceWith(setParentDeep(parseFragment(`[${ascii}]`), parent));
      } else {
        replaceWith(setParentDeep(setNegate(parseFragment(PosixClassMap.get(value)), negate), parent));
      }
    } else if (kind === "property") {
      if (!JsUnicodePropertyMap.has(w2(value))) {
        node.key = "sc";
      }
    } else if (kind === "space") {
      replaceWith(setParent(Q2("space", { negate }), parent));
    } else if (kind === "word") {
      replaceWith(setParentDeep(setNegate(parseFragment(defaultWordChar), negate), parent));
    } else {
      throw new Error(`Unexpected character set kind "${kind}"`);
    }
  },
  Directive({ node, parent, root: root2, remove, replaceWith, removeAllPrevSiblings, removeAllNextSiblings }) {
    const { kind, flags } = node;
    if (kind === "flags") {
      if (!flags.enable && !flags.disable) {
        remove();
      } else {
        const flagGroup = A2({ flags });
        flagGroup.body[0].body = removeAllNextSiblings();
        replaceWith(setParentDeep(flagGroup, parent), { traverse: true });
      }
    } else if (kind === "keep") {
      const firstAlt = root2.body[0];
      const hasWrapperGroup = root2.body.length === 1 && // Not emulatable if within a `CapturingGroup`
      o2(firstAlt, { type: "Group" }) && firstAlt.body[0].body.length === 1;
      const topLevel = hasWrapperGroup ? firstAlt.body[0] : root2;
      if (parent.parent !== topLevel || topLevel.body.length > 1) {
        throw new Error(r3`Uses "\K" in a way that's unsupported`);
      }
      const lookbehind = K2({ behind: true });
      lookbehind.body[0].body = removeAllPrevSiblings();
      replaceWith(setParentDeep(lookbehind, parent));
    } else {
      throw new Error(`Unexpected directive kind "${kind}"`);
    }
  },
  Flags({ node, parent }) {
    if (node.posixIsAscii) {
      throw new Error('Unsupported flag "P"');
    }
    if (node.textSegmentMode === "word") {
      throw new Error('Unsupported flag "y{w}"');
    }
    [
      "digitIsAscii",
      // Flag D
      "extended",
      // Flag x
      "posixIsAscii",
      // Flag P
      "spaceIsAscii",
      // Flag S
      "wordIsAscii",
      // Flag W
      "textSegmentMode"
      // Flag y{g} or y{w}
    ].forEach((f2) => delete node[f2]);
    Object.assign(node, {
      // JS flag g; no Onig equiv
      global: false,
      // JS flag d; no Onig equiv
      hasIndices: false,
      // JS flag m; no Onig equiv but its behavior is always on in Onig. Onig's only line break
      // char is line feed, unlike JS, so this flag isn't used since it would produce inaccurate
      // results (also allows `^` and `$` to be used in the generator for string start and end)
      multiline: false,
      // JS flag y; no Onig equiv, but used for `\G` emulation
      sticky: node.sticky ?? false
      // Note: Regex+ doesn't allow explicitly adding flags it handles implicitly, so leave out
      // properties `unicode` (JS flag u) and `unicodeSets` (JS flag v). Keep the existing values
      // for `ignoreCase` (flag i) and `dotAll` (JS flag s, but Onig flag m)
    });
    parent.options = {
      disable: {
        // Onig uses different rules for flag x than Regex+, so disable the implicit flag
        x: true,
        // Onig has no flag to control "named capture only" mode but contextually applies its
        // behavior when named capturing is used, so disable Regex+'s implicit flag for it
        n: true
      },
      force: {
        // Always add flag v because we're generating an AST that relies on it (it enables JS
        // support for Onig features nested classes, intersection, Unicode properties, etc.).
        // However, the generator might disable flag v based on its `target` option
        v: true
      }
    };
  },
  Group({ node }) {
    if (!node.flags) {
      return;
    }
    const { enable, disable } = node.flags;
    enable?.extended && delete enable.extended;
    disable?.extended && delete disable.extended;
    enable?.dotAll && disable?.dotAll && delete enable.dotAll;
    enable?.ignoreCase && disable?.ignoreCase && delete enable.ignoreCase;
    enable && !Object.keys(enable).length && delete node.flags.enable;
    disable && !Object.keys(disable).length && delete node.flags.disable;
    !node.flags.enable && !node.flags.disable && delete node.flags;
  },
  LookaroundAssertion({ node }, state) {
    const { kind } = node;
    if (kind === "lookbehind") {
      state.passedLookbehind = true;
    }
  },
  NamedCallout({ node, parent, replaceWith }) {
    const { kind } = node;
    if (kind === "fail") {
      replaceWith(setParentDeep(K2({ negate: true }), parent));
    } else {
      throw new Error(`Unsupported named callout "(*${kind.toUpperCase()}"`);
    }
  },
  Quantifier({ node }) {
    if (node.body.type === "Quantifier") {
      const group = A2();
      group.body[0].body.push(node.body);
      node.body = setParentDeep(group, node);
    }
  },
  Regex: {
    enter({ node }, { supportedGNodes }) {
      const leadingGs = [];
      let hasAltWithLeadG = false;
      let hasAltWithoutLeadG = false;
      for (const alt of node.body) {
        if (alt.body.length === 1 && alt.body[0].kind === "search_start") {
          alt.body.pop();
        } else {
          const leadingG = getLeadingG(alt.body);
          if (leadingG) {
            hasAltWithLeadG = true;
            Array.isArray(leadingG) ? leadingGs.push(...leadingG) : leadingGs.push(leadingG);
          } else {
            hasAltWithoutLeadG = true;
          }
        }
      }
      if (hasAltWithLeadG && !hasAltWithoutLeadG) {
        leadingGs.forEach((g) => supportedGNodes.add(g));
      }
    },
    exit(_3, { accuracy, passedLookbehind, strategy }) {
      if (accuracy === "strict" && passedLookbehind && strategy) {
        throw new Error(r3`Uses "\G" in a way that requires non-strict accuracy`);
      }
    }
  },
  Subroutine({ node }, { jsGroupNameMap }) {
    let { ref } = node;
    if (typeof ref === "string" && !isValidJsGroupName(ref)) {
      ref = getAndStoreJsGroupName(ref, jsGroupNameMap);
      node.ref = ref;
    }
  }
};
var SecondPassVisitor = {
  Backreference({ node }, { multiplexCapturesToLeftByRef, reffedNodesByReferencer }) {
    const { orphan, ref } = node;
    if (!orphan) {
      reffedNodesByReferencer.set(node, [...multiplexCapturesToLeftByRef.get(ref).map(({ node: node2 }) => node2)]);
    }
  },
  CapturingGroup: {
    enter({
      node,
      parent,
      replaceWith,
      skip
    }, {
      groupOriginByCopy,
      groupsByName,
      multiplexCapturesToLeftByRef,
      openRefs,
      reffedNodesByReferencer
    }) {
      const origin = groupOriginByCopy.get(node);
      if (origin && openRefs.has(node.number)) {
        const recursion2 = setParent(createRecursion(node.number), parent);
        reffedNodesByReferencer.set(recursion2, openRefs.get(node.number));
        replaceWith(recursion2);
        return;
      }
      openRefs.set(node.number, node);
      multiplexCapturesToLeftByRef.set(node.number, []);
      if (node.name) {
        getOrInsert(multiplexCapturesToLeftByRef, node.name, []);
      }
      const multiplexNodes = multiplexCapturesToLeftByRef.get(node.name ?? node.number);
      for (let i2 = 0; i2 < multiplexNodes.length; i2++) {
        const multiplex = multiplexNodes[i2];
        if (
          // This group is from subroutine expansion, and there's a multiplex value from either the
          // origin node or a prior subroutine expansion group with the same origin
          origin === multiplex.node || origin && origin === multiplex.origin || // This group is not from subroutine expansion, and it comes after a subroutine expansion
          // group that refers to this group
          node === multiplex.origin
        ) {
          multiplexNodes.splice(i2, 1);
          break;
        }
      }
      multiplexCapturesToLeftByRef.get(node.number).push({ node, origin });
      if (node.name) {
        multiplexCapturesToLeftByRef.get(node.name).push({ node, origin });
      }
      if (node.name) {
        const groupsWithSameName = getOrInsert(groupsByName, node.name, /* @__PURE__ */ new Map());
        let hasDuplicateNameToRemove = false;
        if (origin) {
          hasDuplicateNameToRemove = true;
        } else {
          for (const groupInfo of groupsWithSameName.values()) {
            if (!groupInfo.hasDuplicateNameToRemove) {
              hasDuplicateNameToRemove = true;
              break;
            }
          }
        }
        groupsByName.get(node.name).set(node, { node, hasDuplicateNameToRemove });
      }
    },
    exit({ node }, { openRefs }) {
      if (openRefs.get(node.number) === node) {
        openRefs.delete(node.number);
      }
    }
  },
  Group: {
    enter({ node }, state) {
      state.prevFlags = state.currentFlags;
      if (node.flags) {
        state.currentFlags = getNewCurrentFlags(state.currentFlags, node.flags);
      }
    },
    exit(_3, state) {
      state.currentFlags = state.prevFlags;
    }
  },
  Subroutine({ node, parent, replaceWith }, state) {
    const { isRecursive, ref } = node;
    if (isRecursive) {
      let reffed = parent;
      while (reffed = reffed.parent) {
        if (reffed.type === "CapturingGroup" && (reffed.name === ref || reffed.number === ref)) {
          break;
        }
      }
      state.reffedNodesByReferencer.set(node, reffed);
      return;
    }
    const reffedGroupNode = state.subroutineRefMap.get(ref);
    const isGlobalRecursion = ref === 0;
    const expandedSubroutine = isGlobalRecursion ? createRecursion(0) : (
      // The reffed group might itself contain subroutines, which are expanded during sub-traversal
      cloneCapturingGroup(reffedGroupNode, state.groupOriginByCopy, null)
    );
    let replacement = expandedSubroutine;
    if (!isGlobalRecursion) {
      const reffedGroupFlagMods = getCombinedFlagModsFromFlagNodes(getAllParents(
        reffedGroupNode,
        (p2) => p2.type === "Group" && !!p2.flags
      ));
      const reffedGroupFlags = reffedGroupFlagMods ? getNewCurrentFlags(state.globalFlags, reffedGroupFlagMods) : state.globalFlags;
      if (!areFlagsEqual(reffedGroupFlags, state.currentFlags)) {
        replacement = A2({
          flags: getFlagModsFromFlags(reffedGroupFlags)
        });
        replacement.body[0].body.push(expandedSubroutine);
      }
    }
    replaceWith(setParentDeep(replacement, parent), { traverse: !isGlobalRecursion });
  }
};
var ThirdPassVisitor = {
  Backreference({ node, parent, replaceWith }, state) {
    if (node.orphan) {
      state.highestOrphanBackref = Math.max(state.highestOrphanBackref, node.ref);
      return;
    }
    const reffedNodes = state.reffedNodesByReferencer.get(node);
    const participants = reffedNodes.filter((reffed) => canParticipateWithNode(reffed, node));
    if (!participants.length) {
      replaceWith(setParentDeep(K2({ negate: true }), parent));
    } else if (participants.length > 1) {
      const group = A2({
        atomic: true,
        body: participants.reverse().map((reffed) => b2({
          body: [k2(reffed.number)]
        }))
      });
      replaceWith(setParentDeep(group, parent));
    } else {
      node.ref = participants[0].number;
    }
  },
  CapturingGroup({ node }, state) {
    node.number = ++state.numCapturesToLeft;
    if (node.name) {
      if (state.groupsByName.get(node.name).get(node).hasDuplicateNameToRemove) {
        delete node.name;
      }
    }
  },
  Regex: {
    exit({ node }, state) {
      const numCapsNeeded = Math.max(state.highestOrphanBackref - state.numCapturesToLeft, 0);
      for (let i2 = 0; i2 < numCapsNeeded; i2++) {
        const emptyCapture = P2();
        node.body.at(-1).body.push(emptyCapture);
      }
    }
  },
  Subroutine({ node }, state) {
    if (!node.isRecursive || node.ref === 0) {
      return;
    }
    node.ref = state.reffedNodesByReferencer.get(node).number;
  }
};
function addParentProperties(root2) {
  S(root2, {
    "*"({ node, parent }) {
      node.parent = parent;
    }
  });
}
function areFlagsEqual(a2, b3) {
  return a2.dotAll === b3.dotAll && a2.ignoreCase === b3.ignoreCase;
}
function canParticipateWithNode(capture, node) {
  let rightmostPoint = node;
  do {
    if (rightmostPoint.type === "Regex") {
      return false;
    }
    if (rightmostPoint.type === "Alternative") {
      continue;
    }
    if (rightmostPoint === capture) {
      return false;
    }
    const kidsOfParent = getKids(rightmostPoint.parent);
    for (const kid of kidsOfParent) {
      if (kid === rightmostPoint) {
        break;
      }
      if (kid === capture || isAncestorOf(kid, capture)) {
        return true;
      }
    }
  } while (rightmostPoint = rightmostPoint.parent);
  throw new Error("Unexpected path");
}
function cloneCapturingGroup(obj, originMap, up, up2) {
  const store = Array.isArray(obj) ? [] : {};
  for (const [key2, value] of Object.entries(obj)) {
    if (key2 === "parent") {
      store.parent = Array.isArray(up) ? up2 : up;
    } else if (value && typeof value === "object") {
      store[key2] = cloneCapturingGroup(value, originMap, store, up);
    } else {
      if (key2 === "type" && value === "CapturingGroup") {
        originMap.set(store, originMap.get(obj) ?? obj);
      }
      store[key2] = value;
    }
  }
  return store;
}
function createRecursion(ref) {
  const node = O2(ref);
  node.isRecursive = true;
  return node;
}
function getAllParents(node, filterFn) {
  const results = [];
  while (node = node.parent) {
    if (!filterFn || filterFn(node)) {
      results.push(node);
    }
  }
  return results;
}
function getAndStoreJsGroupName(name, map) {
  if (map.has(name)) {
    return map.get(name);
  }
  const jsName = `$${map.size}_${name.replace(/^[^$_\p{IDS}]|[^$\u200C\u200D\p{IDC}]/ug, "_")}`;
  map.set(name, jsName);
  return jsName;
}
function getCombinedFlagModsFromFlagNodes(flagNodes) {
  const flagProps = ["dotAll", "ignoreCase"];
  const combinedFlags = { enable: {}, disable: {} };
  flagNodes.forEach(({ flags }) => {
    flagProps.forEach((prop) => {
      if (flags.enable?.[prop]) {
        delete combinedFlags.disable[prop];
        combinedFlags.enable[prop] = true;
      }
      if (flags.disable?.[prop]) {
        combinedFlags.disable[prop] = true;
      }
    });
  });
  if (!Object.keys(combinedFlags.enable).length) {
    delete combinedFlags.enable;
  }
  if (!Object.keys(combinedFlags.disable).length) {
    delete combinedFlags.disable;
  }
  if (combinedFlags.enable || combinedFlags.disable) {
    return combinedFlags;
  }
  return null;
}
function getFlagModsFromFlags({ dotAll, ignoreCase }) {
  const mods = {};
  if (dotAll || ignoreCase) {
    mods.enable = {};
    dotAll && (mods.enable.dotAll = true);
    ignoreCase && (mods.enable.ignoreCase = true);
  }
  if (!dotAll || !ignoreCase) {
    mods.disable = {};
    !dotAll && (mods.disable.dotAll = true);
    !ignoreCase && (mods.disable.ignoreCase = true);
  }
  return mods;
}
function getKids(node) {
  if (!node) {
    throw new Error("Node expected");
  }
  const { body: body3 } = node;
  return Array.isArray(body3) ? body3 : body3 ? [body3] : null;
}
function getLeadingG(els) {
  const firstToConsider = els.find((el) => el.kind === "search_start" || isLoneGLookaround(el, { negate: false }) || !isAlwaysZeroLength(el));
  if (!firstToConsider) {
    return null;
  }
  if (firstToConsider.kind === "search_start") {
    return firstToConsider;
  }
  if (firstToConsider.type === "LookaroundAssertion") {
    return firstToConsider.body[0].body[0];
  }
  if (firstToConsider.type === "CapturingGroup" || firstToConsider.type === "Group") {
    const gNodesForGroup = [];
    for (const alt of firstToConsider.body) {
      const leadingG = getLeadingG(alt.body);
      if (!leadingG) {
        return null;
      }
      Array.isArray(leadingG) ? gNodesForGroup.push(...leadingG) : gNodesForGroup.push(leadingG);
    }
    return gNodesForGroup;
  }
  return null;
}
function isAncestorOf(node, descendant) {
  const kids = getKids(node) ?? [];
  for (const kid of kids) {
    if (kid === descendant || isAncestorOf(kid, descendant)) {
      return true;
    }
  }
  return false;
}
function isAlwaysZeroLength({ type }) {
  return type === "Assertion" || type === "Directive" || type === "LookaroundAssertion";
}
function isAlwaysNonZeroLength(node) {
  const types = [
    "Character",
    "CharacterClass",
    "CharacterSet"
  ];
  return types.includes(node.type) || node.type === "Quantifier" && node.min && types.includes(node.body.type);
}
function isLoneGLookaround(node, options) {
  const opts = {
    negate: null,
    ...options
  };
  return node.type === "LookaroundAssertion" && (opts.negate === null || node.negate === opts.negate) && node.body.length === 1 && o2(node.body[0], {
    type: "Assertion",
    kind: "search_start"
  });
}
function isValidJsGroupName(name) {
  return /^[$_\p{IDS}][$\u200C\u200D\p{IDC}]*$/u.test(name);
}
function parseFragment(pattern, options) {
  const ast = J2(pattern, {
    ...options,
    // Providing a custom set of Unicode property names avoids converting some JS Unicode
    // properties (ex: `\p{Alpha}`) to Onig POSIX classes
    unicodePropertyMap: JsUnicodePropertyMap
  });
  const alts = ast.body;
  if (alts.length > 1 || alts[0].body.length > 1) {
    return A2({ body: alts });
  }
  return alts[0].body[0];
}
function setNegate(node, negate) {
  node.negate = negate;
  return node;
}
function setParent(node, parent) {
  node.parent = parent;
  return node;
}
function setParentDeep(node, parent) {
  addParentProperties(node);
  node.parent = parent;
  return node;
}
function generate(ast, options) {
  const opts = getOptions(options);
  const minTargetEs2024 = isMinTarget(opts.target, "ES2024");
  const minTargetEs2025 = isMinTarget(opts.target, "ES2025");
  const recursionLimit = opts.rules.recursionLimit;
  if (!Number.isInteger(recursionLimit) || recursionLimit < 2 || recursionLimit > 20) {
    throw new Error("Invalid recursionLimit; use 2-20");
  }
  let hasCaseInsensitiveNode = null;
  let hasCaseSensitiveNode = null;
  if (!minTargetEs2025) {
    const iStack = [ast.flags.ignoreCase];
    S(ast, FlagModifierVisitor, {
      getCurrentModI: () => iStack.at(-1),
      popModI() {
        iStack.pop();
      },
      pushModI(isIOn) {
        iStack.push(isIOn);
      },
      setHasCasedChar() {
        if (iStack.at(-1)) {
          hasCaseInsensitiveNode = true;
        } else {
          hasCaseSensitiveNode = true;
        }
      }
    });
  }
  const appliedGlobalFlags = {
    dotAll: ast.flags.dotAll,
    // - Turn global flag i on if a case insensitive node was used and no case sensitive nodes were
    //   used (to avoid unnecessary node expansion).
    // - Turn global flag i off if a case sensitive node was used (since case sensitivity can't be
    //   forced without the use of ES2025 flag groups)
    ignoreCase: !!((ast.flags.ignoreCase || hasCaseInsensitiveNode) && !hasCaseSensitiveNode)
  };
  let lastNode = ast;
  const state = {
    accuracy: opts.accuracy,
    appliedGlobalFlags,
    captureMap: /* @__PURE__ */ new Map(),
    currentFlags: {
      dotAll: ast.flags.dotAll,
      ignoreCase: ast.flags.ignoreCase
    },
    inCharClass: false,
    lastNode,
    originMap: ast._originMap,
    recursionLimit,
    useAppliedIgnoreCase: !!(!minTargetEs2025 && hasCaseInsensitiveNode && hasCaseSensitiveNode),
    useFlagMods: minTargetEs2025,
    useFlagV: minTargetEs2024,
    verbose: opts.verbose
  };
  function gen(node) {
    state.lastNode = lastNode;
    lastNode = node;
    const fn = throwIfNullish(generator[node.type], `Unexpected node type "${node.type}"`);
    return fn(node, state, gen);
  }
  const result = {
    pattern: ast.body.map(gen).join("|"),
    // Could reset `lastNode` at this point via `lastNode = ast`, but it isn't needed by flags
    flags: gen(ast.flags),
    options: { ...ast.options }
  };
  if (!minTargetEs2024) {
    delete result.options.force.v;
    result.options.disable.v = true;
    result.options.unicodeSetsPlugin = null;
  }
  result._captureTransfers = /* @__PURE__ */ new Map();
  result._hiddenCaptures = [];
  state.captureMap.forEach((value, key2) => {
    if (value.hidden) {
      result._hiddenCaptures.push(key2);
    }
    if (value.transferTo) {
      getOrInsert(result._captureTransfers, value.transferTo, []).push(key2);
    }
  });
  return result;
}
var FlagModifierVisitor = {
  "*": {
    enter({ node }, state) {
      if (isAnyGroup(node)) {
        const currentModI = state.getCurrentModI();
        state.pushModI(
          node.flags ? getNewCurrentFlags({ ignoreCase: currentModI }, node.flags).ignoreCase : currentModI
        );
      }
    },
    exit({ node }, state) {
      if (isAnyGroup(node)) {
        state.popModI();
      }
    }
  },
  Backreference(_3, state) {
    state.setHasCasedChar();
  },
  Character({ node }, state) {
    if (charHasCase(cp(node.value))) {
      state.setHasCasedChar();
    }
  },
  CharacterClassRange({ node, skip }, state) {
    skip();
    if (getCasesOutsideCharClassRange(node, { firstOnly: true }).length) {
      state.setHasCasedChar();
    }
  },
  CharacterSet({ node }, state) {
    if (node.kind === "property" && UnicodePropertiesWithSpecificCase.has(node.value)) {
      state.setHasCasedChar();
    }
  }
};
var generator = {
  /**
  @param {AlternativeNode} node
  */
  Alternative({ body: body3 }, _3, gen) {
    return body3.map(gen).join("");
  },
  /**
  @param {AssertionNode} node
  */
  Assertion({ kind, negate }) {
    if (kind === "string_end") {
      return "$";
    }
    if (kind === "string_start") {
      return "^";
    }
    if (kind === "word_boundary") {
      return negate ? r3`\B` : r3`\b`;
    }
    throw new Error(`Unexpected assertion kind "${kind}"`);
  },
  /**
  @param {BackreferenceNode} node
  */
  Backreference({ ref }, state) {
    if (typeof ref !== "number") {
      throw new Error("Unexpected named backref in transformed AST");
    }
    if (!state.useFlagMods && state.accuracy === "strict" && state.currentFlags.ignoreCase && !state.captureMap.get(ref).ignoreCase) {
      throw new Error("Use of case-insensitive backref to case-sensitive group requires target ES2025 or non-strict accuracy");
    }
    return "\\" + ref;
  },
  /**
  @param {CapturingGroupNode} node
  */
  CapturingGroup(node, state, gen) {
    const { body: body3, name, number: number2 } = node;
    const data = { ignoreCase: state.currentFlags.ignoreCase };
    const origin = state.originMap.get(node);
    if (origin) {
      data.hidden = true;
      if (number2 > origin.number) {
        data.transferTo = origin.number;
      }
    }
    state.captureMap.set(number2, data);
    return `(${name ? `?<${name}>` : ""}${body3.map(gen).join("|")})`;
  },
  /**
  @param {CharacterNode} node
  */
  Character({ value }, state) {
    const char = cp(value);
    const escaped = getCharEscape(value, {
      escDigit: state.lastNode.type === "Backreference",
      inCharClass: state.inCharClass,
      useFlagV: state.useFlagV
    });
    if (escaped !== char) {
      return escaped;
    }
    if (state.useAppliedIgnoreCase && state.currentFlags.ignoreCase && charHasCase(char)) {
      const cases = getIgnoreCaseMatchChars(char);
      return state.inCharClass ? cases.join("") : cases.length > 1 ? `[${cases.join("")}]` : cases[0];
    }
    return char;
  },
  /**
  @param {CharacterClassNode} node
  */
  CharacterClass(node, state, gen) {
    const { kind, negate, parent } = node;
    let { body: body3 } = node;
    if (kind === "intersection" && !state.useFlagV) {
      throw new Error("Use of character class intersection requires min target ES2024");
    }
    if (envFlags.bugFlagVLiteralHyphenIsRange && state.useFlagV && body3.some(isLiteralHyphen)) {
      body3 = [m2(45), ...body3.filter((kid) => !isLiteralHyphen(kid))];
    }
    const genClass = () => `[${negate ? "^" : ""}${body3.map(gen).join(kind === "intersection" ? "&&" : "")}]`;
    if (!state.inCharClass) {
      if (
        // Already established `kind !== 'intersection'` if `!state.useFlagV`; don't check again
        (!state.useFlagV || envFlags.bugNestedClassIgnoresNegation) && !negate
      ) {
        const negatedChildClasses = body3.filter(
          (kid) => kid.type === "CharacterClass" && kid.kind === "union" && kid.negate
        );
        if (negatedChildClasses.length) {
          const group = A2();
          const groupFirstAlt = group.body[0];
          group.parent = parent;
          groupFirstAlt.parent = group;
          body3 = body3.filter((kid) => !negatedChildClasses.includes(kid));
          node.body = body3;
          if (body3.length) {
            node.parent = groupFirstAlt;
            groupFirstAlt.body.push(node);
          } else {
            group.body.pop();
          }
          negatedChildClasses.forEach((cc) => {
            const newAlt = b2({ body: [cc] });
            cc.parent = newAlt;
            newAlt.parent = group;
            group.body.push(newAlt);
          });
          return gen(group);
        }
      }
      state.inCharClass = true;
      const result = genClass();
      state.inCharClass = false;
      return result;
    }
    const firstEl = body3[0];
    if (
      // Already established that the parent is a char class via `inCharClass`; don't check again
      kind === "union" && !negate && firstEl && // Allows many nested classes to work with `target` ES2018 which doesn't support nesting
      ((!state.useFlagV || !state.verbose) && parent.kind === "union" && !(envFlags.bugFlagVLiteralHyphenIsRange && state.useFlagV) || !state.verbose && parent.kind === "intersection" && // JS doesn't allow intersection with union or ranges
      body3.length === 1 && firstEl.type !== "CharacterClassRange")
    ) {
      return body3.map(gen).join("");
    }
    if (!state.useFlagV && parent.type === "CharacterClass") {
      throw new Error("Uses nested character class in a way that requires min target ES2024");
    }
    return genClass();
  },
  /**
  @param {CharacterClassRangeNode} node
  */
  CharacterClassRange(node, state) {
    const min = node.min.value;
    const max = node.max.value;
    const escOpts = {
      escDigit: false,
      inCharClass: true,
      useFlagV: state.useFlagV
    };
    const minStr = getCharEscape(min, escOpts);
    const maxStr = getCharEscape(max, escOpts);
    const extraChars = /* @__PURE__ */ new Set();
    if (state.useAppliedIgnoreCase && state.currentFlags.ignoreCase) {
      const charsOutsideRange = getCasesOutsideCharClassRange(node);
      const ranges = getCodePointRangesFromChars(charsOutsideRange);
      ranges.forEach((value) => {
        extraChars.add(
          Array.isArray(value) ? `${getCharEscape(value[0], escOpts)}-${getCharEscape(value[1], escOpts)}` : getCharEscape(value, escOpts)
        );
      });
    }
    return `${minStr}-${maxStr}${[...extraChars].join("")}`;
  },
  /**
  @param {CharacterSetNode} node
  */
  CharacterSet({ kind, negate, value, key: key2 }, state) {
    if (kind === "dot") {
      return state.currentFlags.dotAll ? state.appliedGlobalFlags.dotAll || state.useFlagMods ? "." : "[^]" : (
        // Onig's only line break char is line feed, unlike JS
        r3`[^\n]`
      );
    }
    if (kind === "digit") {
      return negate ? r3`\D` : r3`\d`;
    }
    if (kind === "property") {
      if (state.useAppliedIgnoreCase && state.currentFlags.ignoreCase && UnicodePropertiesWithSpecificCase.has(value)) {
        throw new Error(`Unicode property "${value}" can't be case-insensitive when other chars have specific case`);
      }
      return `${negate ? r3`\P` : r3`\p`}{${key2 ? `${key2}=` : ""}${value}}`;
    }
    if (kind === "word") {
      return negate ? r3`\W` : r3`\w`;
    }
    throw new Error(`Unexpected character set kind "${kind}"`);
  },
  /**
  @param {FlagsNode} node
  */
  Flags(node, state) {
    return (
      // The transformer should never turn on the properties for flags d, g, m since Onig doesn't
      // have equivs. Flag m is never used since Onig uses different line break chars than JS
      // (node.hasIndices ? 'd' : '') +
      // (node.global ? 'g' : '') +
      // (node.multiline ? 'm' : '') +
      (state.appliedGlobalFlags.ignoreCase ? "i" : "") + (node.dotAll ? "s" : "") + (node.sticky ? "y" : "")
    );
  },
  /**
  @param {GroupNode} node
  */
  Group({ atomic: atomic2, body: body3, flags, parent }, state, gen) {
    const currentFlags = state.currentFlags;
    if (flags) {
      state.currentFlags = getNewCurrentFlags(currentFlags, flags);
    }
    const contents = body3.map(gen).join("|");
    const result = !state.verbose && body3.length === 1 && // Single alt
    parent.type !== "Quantifier" && !atomic2 && (!state.useFlagMods || !flags) ? contents : `(?${getGroupPrefix(atomic2, flags, state.useFlagMods)}${contents})`;
    state.currentFlags = currentFlags;
    return result;
  },
  /**
  @param {LookaroundAssertionNode} node
  */
  LookaroundAssertion({ body: body3, kind, negate }, _3, gen) {
    const prefix = `${kind === "lookahead" ? "" : "<"}${negate ? "!" : "="}`;
    return `(?${prefix}${body3.map(gen).join("|")})`;
  },
  /**
  @param {QuantifierNode} node
  */
  Quantifier(node, _3, gen) {
    return gen(node.body) + getQuantifierStr(node);
  },
  /**
  @param {SubroutineNode & {isRecursive: true}} node
  */
  Subroutine({ isRecursive, ref }, state) {
    if (!isRecursive) {
      throw new Error("Unexpected non-recursive subroutine in transformed AST");
    }
    const limit = state.recursionLimit;
    return ref === 0 ? `(?R=${limit})` : r3`\g<${ref}&R=${limit}>`;
  }
};
var BaseEscapeChars = /* @__PURE__ */ new Set([
  "$",
  "(",
  ")",
  "*",
  "+",
  ".",
  "?",
  "[",
  "\\",
  "]",
  "^",
  "{",
  "|",
  "}"
]);
var CharClassEscapeChars = /* @__PURE__ */ new Set([
  "-",
  "\\",
  "]",
  "^",
  // Literal `[` doesn't require escaping with flag u, but this can help work around regex source
  // linters and regex syntax processors that expect unescaped `[` to create a nested class
  "["
]);
var CharClassEscapeCharsFlagV = /* @__PURE__ */ new Set([
  "(",
  ")",
  "-",
  "/",
  "[",
  "\\",
  "]",
  "^",
  "{",
  "|",
  "}",
  // Double punctuators; also includes already-listed `-` and `^`
  "!",
  "#",
  "$",
  "%",
  "&",
  "*",
  "+",
  ",",
  ".",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "@",
  "`",
  "~"
]);
var CharCodeEscapeMap = /* @__PURE__ */ new Map([
  [9, r3`\t`],
  // horizontal tab
  [10, r3`\n`],
  // line feed
  [11, r3`\v`],
  // vertical tab
  [12, r3`\f`],
  // form feed
  [13, r3`\r`],
  // carriage return
  [8232, r3`\u2028`],
  // line separator
  [8233, r3`\u2029`],
  // paragraph separator
  [65279, r3`\uFEFF`]
  // ZWNBSP/BOM
]);
var casedRe = new RegExp("^\\p{Cased}$", "u");
function charHasCase(char) {
  return casedRe.test(char);
}
function getCasesOutsideCharClassRange(node, options) {
  const firstOnly = !!options?.firstOnly;
  const min = node.min.value;
  const max = node.max.value;
  const found = [];
  if (min < 65 && (max === 65535 || max >= 131071) || min === 65536 && max >= 131071) {
    return found;
  }
  for (let i2 = min; i2 <= max; i2++) {
    const char = cp(i2);
    if (!charHasCase(char)) {
      continue;
    }
    const charsOutsideRange = getIgnoreCaseMatchChars(char).filter((caseOfChar) => {
      const num = caseOfChar.codePointAt(0);
      return num < min || num > max;
    });
    if (charsOutsideRange.length) {
      found.push(...charsOutsideRange);
      if (firstOnly) {
        break;
      }
    }
  }
  return found;
}
function getCharEscape(codePoint, { escDigit, inCharClass, useFlagV }) {
  if (CharCodeEscapeMap.has(codePoint)) {
    return CharCodeEscapeMap.get(codePoint);
  }
  if (
    // Control chars, etc.; condition modeled on the Chrome developer console's display for strings
    codePoint < 32 || codePoint > 126 && codePoint < 160 || // Unicode planes 4-16; unassigned, special purpose, and private use area
    codePoint > 262143 || // Avoid corrupting a preceding backref by immediately following it with a literal digit
    escDigit && isDigitCharCode(codePoint)
  ) {
    return codePoint > 255 ? `\\u{${codePoint.toString(16).toUpperCase()}}` : `\\x${codePoint.toString(16).toUpperCase().padStart(2, "0")}`;
  }
  const escapeChars = inCharClass ? useFlagV ? CharClassEscapeCharsFlagV : CharClassEscapeChars : BaseEscapeChars;
  const char = cp(codePoint);
  return (escapeChars.has(char) ? "\\" : "") + char;
}
function getCodePointRangesFromChars(chars) {
  const codePoints = chars.map((char) => char.codePointAt(0)).sort((a2, b3) => a2 - b3);
  const values = [];
  let start = null;
  for (let i2 = 0; i2 < codePoints.length; i2++) {
    if (codePoints[i2 + 1] === codePoints[i2] + 1) {
      start ??= codePoints[i2];
    } else if (start === null) {
      values.push(codePoints[i2]);
    } else {
      values.push([start, codePoints[i2]]);
      start = null;
    }
  }
  return values;
}
function getGroupPrefix(atomic2, flagMods, useFlagMods) {
  if (atomic2) {
    return ">";
  }
  let mods = "";
  if (flagMods && useFlagMods) {
    const { enable, disable } = flagMods;
    mods = (enable?.ignoreCase ? "i" : "") + (enable?.dotAll ? "s" : "") + (disable ? "-" : "") + (disable?.ignoreCase ? "i" : "") + (disable?.dotAll ? "s" : "");
  }
  return `${mods}:`;
}
function getQuantifierStr({ kind, max, min }) {
  let base;
  if (!min && max === 1) {
    base = "?";
  } else if (!min && max === Infinity) {
    base = "*";
  } else if (min === 1 && max === Infinity) {
    base = "+";
  } else if (min === max) {
    base = `{${min}}`;
  } else {
    base = `{${min},${max === Infinity ? "" : max}}`;
  }
  return base + {
    greedy: "",
    lazy: "?",
    possessive: "+"
  }[kind];
}
function isAnyGroup({ type }) {
  return type === "CapturingGroup" || type === "Group" || type === "LookaroundAssertion";
}
function isDigitCharCode(value) {
  return value > 47 && value < 58;
}
function isLiteralHyphen({ type, value }) {
  return type === "Character" && value === 45;
}
var EmulatedRegExp = class _EmulatedRegExp extends RegExp {
  /**
  @type {Map<number, {
    hidden?: true;
    transferTo?: number;
  }>}
  */
  #captureMap = /* @__PURE__ */ new Map();
  /**
  @type {RegExp | EmulatedRegExp | null}
  */
  #compiled = null;
  /**
  @type {string}
  */
  #pattern;
  /**
  @type {Map<number, string>?}
  */
  #nameMap = null;
  /**
  @type {string?}
  */
  #strategy = null;
  /**
  Can be used to serialize the instance.
  @type {EmulatedRegExpOptions}
  */
  rawOptions = {};
  // Override the getter with one that works with lazy-compiled regexes
  get source() {
    return this.#pattern || "(?:)";
  }
  /**
  @overload
  @param {string} pattern
  @param {string} [flags]
  @param {EmulatedRegExpOptions} [options]
  */
  /**
  @overload
  @param {EmulatedRegExp} pattern
  @param {string} [flags]
  */
  constructor(pattern, flags, options) {
    const lazyCompile = !!options?.lazyCompile;
    if (pattern instanceof RegExp) {
      if (options) {
        throw new Error("Cannot provide options when copying a regexp");
      }
      const re3 = pattern;
      super(re3, flags);
      this.#pattern = re3.source;
      if (re3 instanceof _EmulatedRegExp) {
        this.#captureMap = re3.#captureMap;
        this.#nameMap = re3.#nameMap;
        this.#strategy = re3.#strategy;
        this.rawOptions = re3.rawOptions;
      }
    } else {
      const opts = {
        hiddenCaptures: [],
        strategy: null,
        transfers: [],
        ...options
      };
      super(lazyCompile ? "" : pattern, flags);
      this.#pattern = pattern;
      this.#captureMap = createCaptureMap(opts.hiddenCaptures, opts.transfers);
      this.#strategy = opts.strategy;
      this.rawOptions = options ?? {};
    }
    if (!lazyCompile) {
      this.#compiled = this;
    }
  }
  /**
  Called internally by all String/RegExp methods that use regexes.
  @override
  @param {string} str
  @returns {RegExpExecArray?}
  */
  exec(str) {
    if (!this.#compiled) {
      const { lazyCompile, ...rest } = this.rawOptions;
      this.#compiled = new _EmulatedRegExp(this.#pattern, this.flags, rest);
    }
    const useLastIndex = this.global || this.sticky;
    const pos = this.lastIndex;
    if (this.#strategy === "clip_search" && useLastIndex && pos) {
      this.lastIndex = 0;
      const match = this.#execCore(str.slice(pos));
      if (match) {
        adjustMatchDetailsForOffset(match, pos, str, this.hasIndices);
        this.lastIndex += pos;
      }
      return match;
    }
    return this.#execCore(str);
  }
  /**
  Adds support for hidden and transfer captures.
  @param {string} str
  @returns
  */
  #execCore(str) {
    this.#compiled.lastIndex = this.lastIndex;
    const match = super.exec.call(this.#compiled, str);
    this.lastIndex = this.#compiled.lastIndex;
    if (!match || !this.#captureMap.size) {
      return match;
    }
    const matchCopy = [...match];
    match.length = 1;
    let indicesCopy;
    if (this.hasIndices) {
      indicesCopy = [...match.indices];
      match.indices.length = 1;
    }
    const mappedNums = [0];
    for (let i2 = 1; i2 < matchCopy.length; i2++) {
      const { hidden, transferTo } = this.#captureMap.get(i2) ?? {};
      if (hidden) {
        mappedNums.push(null);
      } else {
        mappedNums.push(match.length);
        match.push(matchCopy[i2]);
        if (this.hasIndices) {
          match.indices.push(indicesCopy[i2]);
        }
      }
      if (transferTo && matchCopy[i2] !== void 0) {
        const to = mappedNums[transferTo];
        if (!to) {
          throw new Error(`Invalid capture transfer to "${to}"`);
        }
        match[to] = matchCopy[i2];
        if (this.hasIndices) {
          match.indices[to] = indicesCopy[i2];
        }
        if (match.groups) {
          if (!this.#nameMap) {
            this.#nameMap = createNameMap(this.source);
          }
          const name = this.#nameMap.get(transferTo);
          if (name) {
            match.groups[name] = matchCopy[i2];
            if (this.hasIndices) {
              match.indices.groups[name] = indicesCopy[i2];
            }
          }
        }
      }
    }
    return match;
  }
};
function adjustMatchDetailsForOffset(match, offset, input, hasIndices) {
  match.index += offset;
  match.input = input;
  if (hasIndices) {
    const indices = match.indices;
    for (let i2 = 0; i2 < indices.length; i2++) {
      const arr = indices[i2];
      if (arr) {
        indices[i2] = [arr[0] + offset, arr[1] + offset];
      }
    }
    const groupIndices = indices.groups;
    if (groupIndices) {
      Object.keys(groupIndices).forEach((key2) => {
        const arr = groupIndices[key2];
        if (arr) {
          groupIndices[key2] = [arr[0] + offset, arr[1] + offset];
        }
      });
    }
  }
}
function createCaptureMap(hiddenCaptures, transfers) {
  const captureMap = /* @__PURE__ */ new Map();
  for (const num of hiddenCaptures) {
    captureMap.set(num, {
      hidden: true
    });
  }
  for (const [to, from] of transfers) {
    for (const num of from) {
      getOrInsert(captureMap, num, {}).transferTo = to;
    }
  }
  return captureMap;
}
function createNameMap(pattern) {
  const re3 = /(?<capture>\((?:\?<(?![=!])(?<name>[^>]+)>|(?!\?)))|\\?./gsu;
  const map = /* @__PURE__ */ new Map();
  let numCharClassesOpen = 0;
  let numCaptures = 0;
  let match;
  while (match = re3.exec(pattern)) {
    const { 0: m3, groups: { capture, name } } = match;
    if (m3 === "[") {
      numCharClassesOpen++;
    } else if (!numCharClassesOpen) {
      if (capture) {
        numCaptures++;
        if (name) {
          map.set(numCaptures, name);
        }
      }
    } else if (m3 === "]") {
      numCharClassesOpen--;
    }
  }
  return map;
}
function toRegExp(pattern, options) {
  const d2 = toRegExpDetails(pattern, options);
  if (d2.options) {
    return new EmulatedRegExp(d2.pattern, d2.flags, d2.options);
  }
  return new RegExp(d2.pattern, d2.flags);
}
function toRegExpDetails(pattern, options) {
  const opts = getOptions(options);
  const onigurumaAst = J2(pattern, {
    flags: opts.flags,
    normalizeUnknownPropertyNames: true,
    rules: {
      captureGroup: opts.rules.captureGroup,
      singleline: opts.rules.singleline
    },
    skipBackrefValidation: opts.rules.allowOrphanBackrefs,
    unicodePropertyMap: JsUnicodePropertyMap
  });
  const regexPlusAst = transform(onigurumaAst, {
    accuracy: opts.accuracy,
    asciiWordBoundaries: opts.rules.asciiWordBoundaries,
    avoidSubclass: opts.avoidSubclass,
    bestEffortTarget: opts.target
  });
  const generated = generate(regexPlusAst, opts);
  const recursionResult = recursion(generated.pattern, {
    captureTransfers: generated._captureTransfers,
    hiddenCaptures: generated._hiddenCaptures,
    mode: "external"
  });
  const possessiveResult = possessive(recursionResult.pattern);
  const atomicResult = atomic(possessiveResult.pattern, {
    captureTransfers: recursionResult.captureTransfers,
    hiddenCaptures: recursionResult.hiddenCaptures
  });
  const details = {
    pattern: atomicResult.pattern,
    flags: `${opts.hasIndices ? "d" : ""}${opts.global ? "g" : ""}${generated.flags}${generated.options.disable.v ? "u" : "v"}`
  };
  if (opts.avoidSubclass) {
    if (opts.lazyCompileLength !== Infinity) {
      throw new Error("Lazy compilation requires subclass");
    }
  } else {
    const hiddenCaptures = atomicResult.hiddenCaptures.sort((a2, b3) => a2 - b3);
    const transfers = Array.from(atomicResult.captureTransfers);
    const strategy = regexPlusAst._strategy;
    const lazyCompile = details.pattern.length >= opts.lazyCompileLength;
    if (hiddenCaptures.length || transfers.length || strategy || lazyCompile) {
      details.options = {
        ...hiddenCaptures.length && { hiddenCaptures },
        ...transfers.length && { transfers },
        ...strategy && { strategy },
        ...lazyCompile && { lazyCompile }
      };
    }
  }
  return details;
}

// node_modules/@shikijs/engine-javascript/dist/engine-compile.mjs
function defaultJavaScriptRegexConstructor(pattern, options) {
  return toRegExp(pattern, {
    global: true,
    hasIndices: true,
    lazyCompileLength: 3e3,
    rules: {
      allowOrphanBackrefs: true,
      asciiWordBoundaries: true,
      captureGroup: true,
      recursionLimit: 5,
      singleline: true
    },
    ...options
  });
}
function createJavaScriptRegexEngine(options = {}) {
  const _options = {
    target: "auto",
    cache: /* @__PURE__ */ new Map(),
    ...options
  };
  _options.regexConstructor ||= (pattern) => defaultJavaScriptRegexConstructor(pattern, { target: _options.target });
  return {
    createScanner(patterns) {
      return new JavaScriptScanner(patterns, _options);
    },
    createString: createJavaScriptEngineString
  };
}

// node_modules/@shikijs/themes/dist/github-dark.mjs
var github_dark_default = Object.freeze(JSON.parse('{"colors":{"activityBar.activeBorder":"#f9826c","activityBar.background":"#24292e","activityBar.border":"#1b1f23","activityBar.foreground":"#e1e4e8","activityBar.inactiveForeground":"#6a737d","activityBarBadge.background":"#0366d6","activityBarBadge.foreground":"#fff","badge.background":"#044289","badge.foreground":"#c8e1ff","breadcrumb.activeSelectionForeground":"#d1d5da","breadcrumb.focusForeground":"#e1e4e8","breadcrumb.foreground":"#959da5","breadcrumbPicker.background":"#2b3036","button.background":"#176f2c","button.foreground":"#dcffe4","button.hoverBackground":"#22863a","button.secondaryBackground":"#444d56","button.secondaryForeground":"#fff","button.secondaryHoverBackground":"#586069","checkbox.background":"#444d56","checkbox.border":"#1b1f23","debugToolBar.background":"#2b3036","descriptionForeground":"#959da5","diffEditor.insertedTextBackground":"#28a74530","diffEditor.removedTextBackground":"#d73a4930","dropdown.background":"#2f363d","dropdown.border":"#1b1f23","dropdown.foreground":"#e1e4e8","dropdown.listBackground":"#24292e","editor.background":"#24292e","editor.findMatchBackground":"#ffd33d44","editor.findMatchHighlightBackground":"#ffd33d22","editor.focusedStackFrameHighlightBackground":"#2b6a3033","editor.foldBackground":"#58606915","editor.foreground":"#e1e4e8","editor.inactiveSelectionBackground":"#3392FF22","editor.lineHighlightBackground":"#2b3036","editor.linkedEditingBackground":"#3392FF22","editor.selectionBackground":"#3392FF44","editor.selectionHighlightBackground":"#17E5E633","editor.selectionHighlightBorder":"#17E5E600","editor.stackFrameHighlightBackground":"#C6902625","editor.wordHighlightBackground":"#17E5E600","editor.wordHighlightBorder":"#17E5E699","editor.wordHighlightStrongBackground":"#17E5E600","editor.wordHighlightStrongBorder":"#17E5E666","editorBracketHighlight.foreground1":"#79b8ff","editorBracketHighlight.foreground2":"#ffab70","editorBracketHighlight.foreground3":"#b392f0","editorBracketHighlight.foreground4":"#79b8ff","editorBracketHighlight.foreground5":"#ffab70","editorBracketHighlight.foreground6":"#b392f0","editorBracketMatch.background":"#17E5E650","editorBracketMatch.border":"#17E5E600","editorCursor.foreground":"#c8e1ff","editorError.foreground":"#f97583","editorGroup.border":"#1b1f23","editorGroupHeader.tabsBackground":"#1f2428","editorGroupHeader.tabsBorder":"#1b1f23","editorGutter.addedBackground":"#28a745","editorGutter.deletedBackground":"#ea4a5a","editorGutter.modifiedBackground":"#2188ff","editorIndentGuide.activeBackground":"#444d56","editorIndentGuide.background":"#2f363d","editorLineNumber.activeForeground":"#e1e4e8","editorLineNumber.foreground":"#444d56","editorOverviewRuler.border":"#1b1f23","editorWarning.foreground":"#ffea7f","editorWhitespace.foreground":"#444d56","editorWidget.background":"#1f2428","errorForeground":"#f97583","focusBorder":"#005cc5","foreground":"#d1d5da","gitDecoration.addedResourceForeground":"#34d058","gitDecoration.conflictingResourceForeground":"#ffab70","gitDecoration.deletedResourceForeground":"#ea4a5a","gitDecoration.ignoredResourceForeground":"#6a737d","gitDecoration.modifiedResourceForeground":"#79b8ff","gitDecoration.submoduleResourceForeground":"#6a737d","gitDecoration.untrackedResourceForeground":"#34d058","input.background":"#2f363d","input.border":"#1b1f23","input.foreground":"#e1e4e8","input.placeholderForeground":"#959da5","list.activeSelectionBackground":"#39414a","list.activeSelectionForeground":"#e1e4e8","list.focusBackground":"#044289","list.hoverBackground":"#282e34","list.hoverForeground":"#e1e4e8","list.inactiveFocusBackground":"#1d2d3e","list.inactiveSelectionBackground":"#282e34","list.inactiveSelectionForeground":"#e1e4e8","notificationCenterHeader.background":"#24292e","notificationCenterHeader.foreground":"#959da5","notifications.background":"#2f363d","notifications.border":"#1b1f23","notifications.foreground":"#e1e4e8","notificationsErrorIcon.foreground":"#ea4a5a","notificationsInfoIcon.foreground":"#79b8ff","notificationsWarningIcon.foreground":"#ffab70","panel.background":"#1f2428","panel.border":"#1b1f23","panelInput.border":"#2f363d","panelTitle.activeBorder":"#f9826c","panelTitle.activeForeground":"#e1e4e8","panelTitle.inactiveForeground":"#959da5","peekViewEditor.background":"#1f242888","peekViewEditor.matchHighlightBackground":"#ffd33d33","peekViewResult.background":"#1f2428","peekViewResult.matchHighlightBackground":"#ffd33d33","pickerGroup.border":"#444d56","pickerGroup.foreground":"#e1e4e8","progressBar.background":"#0366d6","quickInput.background":"#24292e","quickInput.foreground":"#e1e4e8","scrollbar.shadow":"#0008","scrollbarSlider.activeBackground":"#6a737d88","scrollbarSlider.background":"#6a737d33","scrollbarSlider.hoverBackground":"#6a737d44","settings.headerForeground":"#e1e4e8","settings.modifiedItemIndicator":"#0366d6","sideBar.background":"#1f2428","sideBar.border":"#1b1f23","sideBar.foreground":"#d1d5da","sideBarSectionHeader.background":"#1f2428","sideBarSectionHeader.border":"#1b1f23","sideBarSectionHeader.foreground":"#e1e4e8","sideBarTitle.foreground":"#e1e4e8","statusBar.background":"#24292e","statusBar.border":"#1b1f23","statusBar.debuggingBackground":"#931c06","statusBar.debuggingForeground":"#fff","statusBar.foreground":"#d1d5da","statusBar.noFolderBackground":"#24292e","statusBarItem.prominentBackground":"#282e34","statusBarItem.remoteBackground":"#24292e","statusBarItem.remoteForeground":"#d1d5da","tab.activeBackground":"#24292e","tab.activeBorder":"#24292e","tab.activeBorderTop":"#f9826c","tab.activeForeground":"#e1e4e8","tab.border":"#1b1f23","tab.hoverBackground":"#24292e","tab.inactiveBackground":"#1f2428","tab.inactiveForeground":"#959da5","tab.unfocusedActiveBorder":"#24292e","tab.unfocusedActiveBorderTop":"#1b1f23","tab.unfocusedHoverBackground":"#24292e","terminal.ansiBlack":"#586069","terminal.ansiBlue":"#2188ff","terminal.ansiBrightBlack":"#959da5","terminal.ansiBrightBlue":"#79b8ff","terminal.ansiBrightCyan":"#56d4dd","terminal.ansiBrightGreen":"#85e89d","terminal.ansiBrightMagenta":"#b392f0","terminal.ansiBrightRed":"#f97583","terminal.ansiBrightWhite":"#fafbfc","terminal.ansiBrightYellow":"#ffea7f","terminal.ansiCyan":"#39c5cf","terminal.ansiGreen":"#34d058","terminal.ansiMagenta":"#b392f0","terminal.ansiRed":"#ea4a5a","terminal.ansiWhite":"#d1d5da","terminal.ansiYellow":"#ffea7f","terminal.foreground":"#d1d5da","terminal.tab.activeBorder":"#f9826c","terminalCursor.background":"#586069","terminalCursor.foreground":"#79b8ff","textBlockQuote.background":"#24292e","textBlockQuote.border":"#444d56","textCodeBlock.background":"#2f363d","textLink.activeForeground":"#c8e1ff","textLink.foreground":"#79b8ff","textPreformat.foreground":"#d1d5da","textSeparator.foreground":"#586069","titleBar.activeBackground":"#24292e","titleBar.activeForeground":"#e1e4e8","titleBar.border":"#1b1f23","titleBar.inactiveBackground":"#1f2428","titleBar.inactiveForeground":"#959da5","tree.indentGuidesStroke":"#2f363d","welcomePage.buttonBackground":"#2f363d","welcomePage.buttonHoverBackground":"#444d56"},"displayName":"GitHub Dark","name":"github-dark","semanticHighlighting":true,"tokenColors":[{"scope":["comment","punctuation.definition.comment","string.comment"],"settings":{"foreground":"#6a737d"}},{"scope":["constant","entity.name.constant","variable.other.constant","variable.other.enummember","variable.language"],"settings":{"foreground":"#79b8ff"}},{"scope":["entity","entity.name"],"settings":{"foreground":"#b392f0"}},{"scope":"variable.parameter.function","settings":{"foreground":"#e1e4e8"}},{"scope":"entity.name.tag","settings":{"foreground":"#85e89d"}},{"scope":"keyword","settings":{"foreground":"#f97583"}},{"scope":["storage","storage.type"],"settings":{"foreground":"#f97583"}},{"scope":["storage.modifier.package","storage.modifier.import","storage.type.java"],"settings":{"foreground":"#e1e4e8"}},{"scope":["string","punctuation.definition.string","string punctuation.section.embedded source"],"settings":{"foreground":"#9ecbff"}},{"scope":"support","settings":{"foreground":"#79b8ff"}},{"scope":"meta.property-name","settings":{"foreground":"#79b8ff"}},{"scope":"variable","settings":{"foreground":"#ffab70"}},{"scope":"variable.other","settings":{"foreground":"#e1e4e8"}},{"scope":"invalid.broken","settings":{"fontStyle":"italic","foreground":"#fdaeb7"}},{"scope":"invalid.deprecated","settings":{"fontStyle":"italic","foreground":"#fdaeb7"}},{"scope":"invalid.illegal","settings":{"fontStyle":"italic","foreground":"#fdaeb7"}},{"scope":"invalid.unimplemented","settings":{"fontStyle":"italic","foreground":"#fdaeb7"}},{"scope":"carriage-return","settings":{"background":"#f97583","content":"^M","fontStyle":"italic underline","foreground":"#24292e"}},{"scope":"message.error","settings":{"foreground":"#fdaeb7"}},{"scope":"string variable","settings":{"foreground":"#79b8ff"}},{"scope":["source.regexp","string.regexp"],"settings":{"foreground":"#dbedff"}},{"scope":["string.regexp.character-class","string.regexp constant.character.escape","string.regexp source.ruby.embedded","string.regexp string.regexp.arbitrary-repitition"],"settings":{"foreground":"#dbedff"}},{"scope":"string.regexp constant.character.escape","settings":{"fontStyle":"bold","foreground":"#85e89d"}},{"scope":"support.constant","settings":{"foreground":"#79b8ff"}},{"scope":"support.variable","settings":{"foreground":"#79b8ff"}},{"scope":"meta.module-reference","settings":{"foreground":"#79b8ff"}},{"scope":"punctuation.definition.list.begin.markdown","settings":{"foreground":"#ffab70"}},{"scope":["markup.heading","markup.heading entity.name"],"settings":{"fontStyle":"bold","foreground":"#79b8ff"}},{"scope":"markup.quote","settings":{"foreground":"#85e89d"}},{"scope":"markup.italic","settings":{"fontStyle":"italic","foreground":"#e1e4e8"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#e1e4e8"}},{"scope":["markup.underline"],"settings":{"fontStyle":"underline"}},{"scope":["markup.strikethrough"],"settings":{"fontStyle":"strikethrough"}},{"scope":"markup.inline.raw","settings":{"foreground":"#79b8ff"}},{"scope":["markup.deleted","meta.diff.header.from-file","punctuation.definition.deleted"],"settings":{"background":"#86181d","foreground":"#fdaeb7"}},{"scope":["markup.inserted","meta.diff.header.to-file","punctuation.definition.inserted"],"settings":{"background":"#144620","foreground":"#85e89d"}},{"scope":["markup.changed","punctuation.definition.changed"],"settings":{"background":"#c24e00","foreground":"#ffab70"}},{"scope":["markup.ignored","markup.untracked"],"settings":{"background":"#79b8ff","foreground":"#2f363d"}},{"scope":"meta.diff.range","settings":{"fontStyle":"bold","foreground":"#b392f0"}},{"scope":"meta.diff.header","settings":{"foreground":"#79b8ff"}},{"scope":"meta.separator","settings":{"fontStyle":"bold","foreground":"#79b8ff"}},{"scope":"meta.output","settings":{"foreground":"#79b8ff"}},{"scope":["brackethighlighter.tag","brackethighlighter.curly","brackethighlighter.round","brackethighlighter.square","brackethighlighter.angle","brackethighlighter.quote"],"settings":{"foreground":"#d1d5da"}},{"scope":"brackethighlighter.unmatched","settings":{"foreground":"#fdaeb7"}},{"scope":["constant.other.reference.link","string.other.link"],"settings":{"fontStyle":"underline","foreground":"#dbedff"}}],"type":"dark"}'));

// node_modules/@shikijs/themes/dist/github-light.mjs
var github_light_default = Object.freeze(JSON.parse('{"colors":{"activityBar.activeBorder":"#f9826c","activityBar.background":"#fff","activityBar.border":"#e1e4e8","activityBar.foreground":"#2f363d","activityBar.inactiveForeground":"#959da5","activityBarBadge.background":"#2188ff","activityBarBadge.foreground":"#fff","badge.background":"#dbedff","badge.foreground":"#005cc5","breadcrumb.activeSelectionForeground":"#586069","breadcrumb.focusForeground":"#2f363d","breadcrumb.foreground":"#6a737d","breadcrumbPicker.background":"#fafbfc","button.background":"#159739","button.foreground":"#fff","button.hoverBackground":"#138934","button.secondaryBackground":"#e1e4e8","button.secondaryForeground":"#1b1f23","button.secondaryHoverBackground":"#d1d5da","checkbox.background":"#fafbfc","checkbox.border":"#d1d5da","debugToolBar.background":"#fff","descriptionForeground":"#6a737d","diffEditor.insertedTextBackground":"#34d05822","diffEditor.removedTextBackground":"#d73a4922","dropdown.background":"#fafbfc","dropdown.border":"#e1e4e8","dropdown.foreground":"#2f363d","dropdown.listBackground":"#fff","editor.background":"#fff","editor.findMatchBackground":"#ffdf5d","editor.findMatchHighlightBackground":"#ffdf5d66","editor.focusedStackFrameHighlightBackground":"#28a74525","editor.foldBackground":"#d1d5da11","editor.foreground":"#24292e","editor.inactiveSelectionBackground":"#0366d611","editor.lineHighlightBackground":"#f6f8fa","editor.linkedEditingBackground":"#0366d611","editor.selectionBackground":"#0366d625","editor.selectionHighlightBackground":"#34d05840","editor.selectionHighlightBorder":"#34d05800","editor.stackFrameHighlightBackground":"#ffd33d33","editor.wordHighlightBackground":"#34d05800","editor.wordHighlightBorder":"#24943e99","editor.wordHighlightStrongBackground":"#34d05800","editor.wordHighlightStrongBorder":"#24943e50","editorBracketHighlight.foreground1":"#005cc5","editorBracketHighlight.foreground2":"#e36209","editorBracketHighlight.foreground3":"#5a32a3","editorBracketHighlight.foreground4":"#005cc5","editorBracketHighlight.foreground5":"#e36209","editorBracketHighlight.foreground6":"#5a32a3","editorBracketMatch.background":"#34d05840","editorBracketMatch.border":"#34d05800","editorCursor.foreground":"#044289","editorError.foreground":"#cb2431","editorGroup.border":"#e1e4e8","editorGroupHeader.tabsBackground":"#f6f8fa","editorGroupHeader.tabsBorder":"#e1e4e8","editorGutter.addedBackground":"#28a745","editorGutter.deletedBackground":"#d73a49","editorGutter.modifiedBackground":"#2188ff","editorIndentGuide.activeBackground":"#d7dbe0","editorIndentGuide.background":"#eff2f6","editorLineNumber.activeForeground":"#24292e","editorLineNumber.foreground":"#1b1f234d","editorOverviewRuler.border":"#fff","editorWarning.foreground":"#f9c513","editorWhitespace.foreground":"#d1d5da","editorWidget.background":"#f6f8fa","errorForeground":"#cb2431","focusBorder":"#2188ff","foreground":"#444d56","gitDecoration.addedResourceForeground":"#28a745","gitDecoration.conflictingResourceForeground":"#e36209","gitDecoration.deletedResourceForeground":"#d73a49","gitDecoration.ignoredResourceForeground":"#959da5","gitDecoration.modifiedResourceForeground":"#005cc5","gitDecoration.submoduleResourceForeground":"#959da5","gitDecoration.untrackedResourceForeground":"#28a745","input.background":"#fafbfc","input.border":"#e1e4e8","input.foreground":"#2f363d","input.placeholderForeground":"#959da5","list.activeSelectionBackground":"#e2e5e9","list.activeSelectionForeground":"#2f363d","list.focusBackground":"#cce5ff","list.hoverBackground":"#ebf0f4","list.hoverForeground":"#2f363d","list.inactiveFocusBackground":"#dbedff","list.inactiveSelectionBackground":"#e8eaed","list.inactiveSelectionForeground":"#2f363d","notificationCenterHeader.background":"#e1e4e8","notificationCenterHeader.foreground":"#6a737d","notifications.background":"#fafbfc","notifications.border":"#e1e4e8","notifications.foreground":"#2f363d","notificationsErrorIcon.foreground":"#d73a49","notificationsInfoIcon.foreground":"#005cc5","notificationsWarningIcon.foreground":"#e36209","panel.background":"#f6f8fa","panel.border":"#e1e4e8","panelInput.border":"#e1e4e8","panelTitle.activeBorder":"#f9826c","panelTitle.activeForeground":"#2f363d","panelTitle.inactiveForeground":"#6a737d","pickerGroup.border":"#e1e4e8","pickerGroup.foreground":"#2f363d","progressBar.background":"#2188ff","quickInput.background":"#fafbfc","quickInput.foreground":"#2f363d","scrollbar.shadow":"#6a737d33","scrollbarSlider.activeBackground":"#959da588","scrollbarSlider.background":"#959da533","scrollbarSlider.hoverBackground":"#959da544","settings.headerForeground":"#2f363d","settings.modifiedItemIndicator":"#2188ff","sideBar.background":"#f6f8fa","sideBar.border":"#e1e4e8","sideBar.foreground":"#586069","sideBarSectionHeader.background":"#f6f8fa","sideBarSectionHeader.border":"#e1e4e8","sideBarSectionHeader.foreground":"#2f363d","sideBarTitle.foreground":"#2f363d","statusBar.background":"#fff","statusBar.border":"#e1e4e8","statusBar.debuggingBackground":"#f9826c","statusBar.debuggingForeground":"#fff","statusBar.foreground":"#586069","statusBar.noFolderBackground":"#fff","statusBarItem.prominentBackground":"#e8eaed","statusBarItem.remoteBackground":"#fff","statusBarItem.remoteForeground":"#586069","tab.activeBackground":"#fff","tab.activeBorder":"#fff","tab.activeBorderTop":"#f9826c","tab.activeForeground":"#2f363d","tab.border":"#e1e4e8","tab.hoverBackground":"#fff","tab.inactiveBackground":"#f6f8fa","tab.inactiveForeground":"#6a737d","tab.unfocusedActiveBorder":"#fff","tab.unfocusedActiveBorderTop":"#e1e4e8","tab.unfocusedHoverBackground":"#fff","terminal.ansiBlack":"#24292e","terminal.ansiBlue":"#0366d6","terminal.ansiBrightBlack":"#959da5","terminal.ansiBrightBlue":"#005cc5","terminal.ansiBrightCyan":"#3192aa","terminal.ansiBrightGreen":"#22863a","terminal.ansiBrightMagenta":"#5a32a3","terminal.ansiBrightRed":"#cb2431","terminal.ansiBrightWhite":"#d1d5da","terminal.ansiBrightYellow":"#b08800","terminal.ansiCyan":"#1b7c83","terminal.ansiGreen":"#28a745","terminal.ansiMagenta":"#5a32a3","terminal.ansiRed":"#d73a49","terminal.ansiWhite":"#6a737d","terminal.ansiYellow":"#dbab09","terminal.foreground":"#586069","terminal.tab.activeBorder":"#f9826c","terminalCursor.background":"#d1d5da","terminalCursor.foreground":"#005cc5","textBlockQuote.background":"#fafbfc","textBlockQuote.border":"#e1e4e8","textCodeBlock.background":"#f6f8fa","textLink.activeForeground":"#005cc5","textLink.foreground":"#0366d6","textPreformat.foreground":"#586069","textSeparator.foreground":"#d1d5da","titleBar.activeBackground":"#fff","titleBar.activeForeground":"#2f363d","titleBar.border":"#e1e4e8","titleBar.inactiveBackground":"#f6f8fa","titleBar.inactiveForeground":"#6a737d","tree.indentGuidesStroke":"#e1e4e8","welcomePage.buttonBackground":"#f6f8fa","welcomePage.buttonHoverBackground":"#e1e4e8"},"displayName":"GitHub Light","name":"github-light","semanticHighlighting":true,"tokenColors":[{"scope":["comment","punctuation.definition.comment","string.comment"],"settings":{"foreground":"#6a737d"}},{"scope":["constant","entity.name.constant","variable.other.constant","variable.other.enummember","variable.language"],"settings":{"foreground":"#005cc5"}},{"scope":["entity","entity.name"],"settings":{"foreground":"#6f42c1"}},{"scope":"variable.parameter.function","settings":{"foreground":"#24292e"}},{"scope":"entity.name.tag","settings":{"foreground":"#22863a"}},{"scope":"keyword","settings":{"foreground":"#d73a49"}},{"scope":["storage","storage.type"],"settings":{"foreground":"#d73a49"}},{"scope":["storage.modifier.package","storage.modifier.import","storage.type.java"],"settings":{"foreground":"#24292e"}},{"scope":["string","punctuation.definition.string","string punctuation.section.embedded source"],"settings":{"foreground":"#032f62"}},{"scope":"support","settings":{"foreground":"#005cc5"}},{"scope":"meta.property-name","settings":{"foreground":"#005cc5"}},{"scope":"variable","settings":{"foreground":"#e36209"}},{"scope":"variable.other","settings":{"foreground":"#24292e"}},{"scope":"invalid.broken","settings":{"fontStyle":"italic","foreground":"#b31d28"}},{"scope":"invalid.deprecated","settings":{"fontStyle":"italic","foreground":"#b31d28"}},{"scope":"invalid.illegal","settings":{"fontStyle":"italic","foreground":"#b31d28"}},{"scope":"invalid.unimplemented","settings":{"fontStyle":"italic","foreground":"#b31d28"}},{"scope":"carriage-return","settings":{"background":"#d73a49","content":"^M","fontStyle":"italic underline","foreground":"#fafbfc"}},{"scope":"message.error","settings":{"foreground":"#b31d28"}},{"scope":"string variable","settings":{"foreground":"#005cc5"}},{"scope":["source.regexp","string.regexp"],"settings":{"foreground":"#032f62"}},{"scope":["string.regexp.character-class","string.regexp constant.character.escape","string.regexp source.ruby.embedded","string.regexp string.regexp.arbitrary-repitition"],"settings":{"foreground":"#032f62"}},{"scope":"string.regexp constant.character.escape","settings":{"fontStyle":"bold","foreground":"#22863a"}},{"scope":"support.constant","settings":{"foreground":"#005cc5"}},{"scope":"support.variable","settings":{"foreground":"#005cc5"}},{"scope":"meta.module-reference","settings":{"foreground":"#005cc5"}},{"scope":"punctuation.definition.list.begin.markdown","settings":{"foreground":"#e36209"}},{"scope":["markup.heading","markup.heading entity.name"],"settings":{"fontStyle":"bold","foreground":"#005cc5"}},{"scope":"markup.quote","settings":{"foreground":"#22863a"}},{"scope":"markup.italic","settings":{"fontStyle":"italic","foreground":"#24292e"}},{"scope":"markup.bold","settings":{"fontStyle":"bold","foreground":"#24292e"}},{"scope":["markup.underline"],"settings":{"fontStyle":"underline"}},{"scope":["markup.strikethrough"],"settings":{"fontStyle":"strikethrough"}},{"scope":"markup.inline.raw","settings":{"foreground":"#005cc5"}},{"scope":["markup.deleted","meta.diff.header.from-file","punctuation.definition.deleted"],"settings":{"background":"#ffeef0","foreground":"#b31d28"}},{"scope":["markup.inserted","meta.diff.header.to-file","punctuation.definition.inserted"],"settings":{"background":"#f0fff4","foreground":"#22863a"}},{"scope":["markup.changed","punctuation.definition.changed"],"settings":{"background":"#ffebda","foreground":"#e36209"}},{"scope":["markup.ignored","markup.untracked"],"settings":{"background":"#005cc5","foreground":"#f6f8fa"}},{"scope":"meta.diff.range","settings":{"fontStyle":"bold","foreground":"#6f42c1"}},{"scope":"meta.diff.header","settings":{"foreground":"#005cc5"}},{"scope":"meta.separator","settings":{"fontStyle":"bold","foreground":"#005cc5"}},{"scope":"meta.output","settings":{"foreground":"#005cc5"}},{"scope":["brackethighlighter.tag","brackethighlighter.curly","brackethighlighter.round","brackethighlighter.square","brackethighlighter.angle","brackethighlighter.quote"],"settings":{"foreground":"#586069"}},{"scope":"brackethighlighter.unmatched","settings":{"foreground":"#b31d28"}},{"scope":["constant.other.reference.link","string.other.link"],"settings":{"fontStyle":"underline","foreground":"#032f62"}}],"type":"light"}'));

// src/grammars.ts
var grammars = define_GRAMMARS_default;
var own4 = (table, key2) => Object.hasOwn(table, key2) ? table[key2] : void 0;
var grammarNamed = (language) => own4(define_GRAMMARS_default.names, language.trim().toLowerCase()) ?? null;

// src/paths.ts
import os from "node:os";
import path from "node:path";
var outsideOwn = (dir) => {
  if (!process.env["WALKTHROUGH_TEST_SANDBOX"]) return dir;
  const own5 = path.join(os.userInfo().homedir, ".local", "state", "walkthrough");
  const full = path.resolve(dir);
  if (full === own5 || full.startsWith(own5 + path.sep)) throw new Error(`a test reached ${full}; tests keep to their sandbox`);
  return dir;
};
var stateDir = () => outsideOwn(
  process.env["WALKTHROUGH_STATE"] || path.join(process.env["XDG_STATE_HOME"] || path.join(os.homedir(), ".local", "state"), "walkthrough")
);

// src/highlight-worker.ts
var MAX_LINE = 1e3;
var THEMES = { light: "github-light", dark: "github-dark" };
var KINDS = /* @__PURE__ */ new Map([
  ["#6a737d|#6a737d", "c"],
  ["#d73a49|#f97583", "k"],
  ["#005cc5|#79b8ff", "n"],
  ["#6f42c1|#b392f0", "e"],
  ["#22863a|#85e89d", "t"],
  ["#032f62|#9ecbff", "s"],
  ["#032f62|#dbedff", "r"],
  ["#e36209|#ffab70", "v"],
  ["#b31d28|#fdaeb7", "x"]
]);
var source = (name) => `https://cdn.jsdelivr.net/npm/tm-grammars@${grammars.version}/grammars/${name}.json`;
async function download(name) {
  const folder = process.env["WALKTHROUGH_GRAMMARS"];
  if (folder) return fs.promises.readFile(path2.join(folder, `${name}.json`)).catch(() => null);
  if (process.env["WALKTHROUGH_TEST_SANDBOX"]) return null;
  try {
    const answer = await fetch(source(name), { signal: AbortSignal.timeout(3e4) });
    return answer.ok ? Buffer.from(await answer.arrayBuffer()) : null;
  } catch {
    return null;
  }
}
var matches2 = (name, bytes) => crypto.createHash("sha256").update(bytes).digest("hex") === grammars.grammars[name]?.sha256;
var fetched = /* @__PURE__ */ new Map();
function grammarFile(name) {
  let found = fetched.get(name);
  if (!found) {
    found = (async () => {
      const cached = path2.join(stateDir(), "grammars", grammars.version, `${name}.json`);
      const kept = fs.existsSync(cached) ? fs.readFileSync(cached) : null;
      if (kept && !matches2(name, kept)) fs.rmSync(cached, { force: true });
      const bytes = kept ?? await download(name);
      if (!bytes || !matches2(name, bytes)) return null;
      if (!kept) {
        fs.mkdirSync(path2.dirname(cached), { recursive: true, mode: 448 });
        const part = `${cached}.${String(process.pid)}`;
        fs.writeFileSync(part, bytes);
        fs.renameSync(part, cached);
      }
      const lazy = grammars.grammars[name]?.lazy;
      return { ...JSON.parse(bytes.toString("utf8")), ...lazy && { embeddedLangsLazy: lazy } };
    })().catch(() => null);
    fetched.set(name, found);
  }
  return found;
}
function needed(name, named, found = /* @__PURE__ */ new Set()) {
  if (found.has(name) || !Object.hasOwn(grammars.grammars, name)) return found;
  found.add(name);
  const { embedded = [], lazy = [] } = grammars.grammars[name] ?? {};
  for (const one2 of embedded) if (!lazy.includes(one2) || named(one2)) needed(one2, named, found);
  return found;
}
var highlighter = null;
async function load(names) {
  const files = await Promise.all([...names].map(grammarFile));
  if (!files[0]) return false;
  highlighter ??= createHighlighterCoreSync({
    themes: [github_light_default, github_dark_default],
    langs: [],
    // Skips a pattern JavaScript cannot run instead of failing the whole grammar.
    engine: createJavaScriptRegexEngine({ forgiving: true })
  });
  const loaded = new Set(highlighter.getLoadedLanguages());
  const fresh = files.filter((one2) => one2 !== null && !loaded.has(one2.name));
  if (fresh.length) highlighter.loadLanguageSync(...fresh);
  return true;
}
var kindOf = ({ htmlStyle }) => KINDS.get(`${String(htmlStyle?.["color"]).toLowerCase()}|${String(htmlStyle?.["--shiki-dark"]).toLowerCase()}`) ?? "";
async function tokenise(text2, grammar) {
  let words;
  const named = (one2) => (words ??= new Set(text2.toLowerCase().match(/[\w#+-]+/g)?.map(grammarNamed))).has(one2);
  if (!await load(needed(grammar, named)) || !highlighter) return null;
  try {
    const { tokens } = highlighter.codeToTokens(text2, { lang: grammar, themes: THEMES, tokenizeMaxLineLength: MAX_LINE });
    return tokens.map(
      (line) => line.reduce((runs, token2) => {
        const kind = kindOf(token2);
        const last = runs.at(-1);
        if (last?.[1] === kind) last[0] += token2.content.length;
        else runs.push([token2.content.length, kind]);
        return runs;
      }, [])
    );
  } catch {
    return null;
  }
}
parentPort?.on("message", ({ id, text: text2, grammar }) => {
  void tokenise(text2, grammar).then((runs) => {
    parentPort?.postMessage({ id, runs });
  });
});
