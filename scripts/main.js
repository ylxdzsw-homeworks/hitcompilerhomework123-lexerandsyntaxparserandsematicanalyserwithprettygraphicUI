(function() {
  var format, formatTree, formatTriple,
    slice = [].slice;

  PR['registerLangHandler'](PR['createSimpleLexer']([], []), ['empty']);

  window.start = function(code) {
    var input, lexer, nodes, output, ref, tokens, x;
    lexer = Lexer(code);
    tokens = [];
    while (x = lexer.getNextToken()) {
      if (x.panic != null) {
        lexer.panic(x.panic);
      }
      tokens.push(x);
      if (x.type === '$') {
        break;
      }
    }
    ref = format(code, tokens), input = ref.input, output = ref.output;
    $("#input>pre").html(input);
    $("#lex>pre").html(output);
    nodes = window.Syntax.analyze(tokens);
    $("#syntax>pre").html(formatTree(nodes));
    return $("#semantic>pre").html(formatTriple(window.Semantic(nodes)));
  };

  format = function(code, tokens) {
    var cursor, errornum, getPos, i, input, j, len, output, readUntil, token, tokennum;
    code = code.split('');
    input = "";
    output = "";
    errornum = 0;
    tokennum = 0;
    cursor = {
      line: 1,
      column: 0
    };
    getPos = function() {
      return cursor.line + ":" + cursor.column;
    };
    readUntil = function(pos) {
      var result, x;
      result = "";
      while (pos !== getPos()) {
        x = code.shift();
        if (x === '\n') {
          cursor.line += 1;
          cursor.column = 0;
        } else if (x == null) {
          throw new Error('unknown error');
        } else {
          cursor.column += 1;
        }
        result += x;
      }
      return result;
    };
    for (i = j = 0, len = tokens.length; j < len; i = ++j) {
      token = tokens[i];
      if (token.type === "ERROR") {
        errornum += 1;
        input += (readUntil(token.start)) + "<span class=\"map-" + i + "\" onmouseover=\"activate(" + i + ")\" onmouseleave=\"deactivate(" + i + ")\">" + (readUntil(token.end)) + "</span>";
        output += "<span class=\"map-" + i + " errormsg\" onmouseover=\"activate(" + i + ")\" onmouseleave=\"deactivate(" + i + ")\">" + token.start + " " + token.value + "</span>\n";
      } else {
        tokennum += 1;
        input += (readUntil(token.start)) + "<span class=\"map-" + i + "\" onmouseover=\"activate(" + i + ")\" onmouseleave=\"deactivate(" + i + ")\">" + (readUntil(token.end)) + "</span>";
        output += "<span class=\"map-" + i + "\" onmouseover=\"activate(" + i + ")\" onmouseleave=\"deactivate(" + i + ")\"\">" + (token.format()) + "</span>\n";
      }
      token.id = i;
    }
    output = ("<span class=\"compileinfo\">词法分析结束，共" + tokennum + "个词法单元，" + errornum + "处错误\n</span>") + output;
    return {
      input: input,
      output: output
    };
  };

  formatTree = function(nodes) {
    var i, j, len, node, output;
    output = "";
    for (j = 0, len = nodes.length; j < len; j++) {
      node = nodes[j];
      output += ((function() {
        var k, ref, results;
        results = [];
        for (i = k = 0, ref = node.level; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
          results.push('  ');
        }
        return results;
      })()).join('');
      switch (node.type) {
        case 'terminal':
          output += "<span class=\"map-" + node.token.id + "\" onmouseover=\"activate(" + node.token.id + ")\" onmouseleave=\"deactivate(" + node.token.id + ")\">" + node.token.type + (node.token.value ? ':' + node.token.value : '') + "</span>\n";
          break;
        case 'nonterminal':
          output += node.rule.left + " -> " + (node.rule.right.join(' ')) + "\n";
          break;
        case 'error':
          output += "<span class=\"error\">" + node.content + "</span>\n";
      }
    }
    return output;
  };

  formatTriple = function(tri) {
    var result;
    result = tri.format(function() {
      var line, x;
      line = arguments[0], x = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (/^function/.test(x[0])) {
        return x.join('');
      }
      if (/^error/.test(x[0])) {
        return "<span class=\"error\">" + (x.join('')) + "</span>";
      }
      x = x.map(function(i) {
        switch (i) {
          case 'goto':
            return "<span class=\"goto\">goto</span>";
          case 'param':
            return "<span class=\"param\">param</span>";
          case 'call':
            return "<span class=\"call\">call</span>";
          case 'return':
            return "<span class=\"return\">return</span>";
          default:
            if (!_.isNaN(Number(i))) {
              return "<span class=\"number\">" + i + "</span>";
            } else {
              x = i != null ? typeof i.split === "function" ? i.split(':') : void 0 : void 0;
              if (x && x.length >= 2) {
                return x[0] + "<span class=\"address\">:" + x[1] + "</span>";
              } else {
                return i;
              }
            }
        }
      });
      x.unshift('  ');
      return x.join(' ');
    });
    return result.join('\n');
  };

  window.activate = function(id) {
    return $(".map-" + id).addClass('active');
  };

  window.deactivate = function(id) {
    return $(".map-" + id).removeClass('active');
  };

}).call(this);
