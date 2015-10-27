(function() {
  var format;

  window.start = function(code) {
    var input, lexer, output, ref, tokens, x;
    lexer = Lexer(code);
    tokens = [];
    while (x = lexer.getNextToken()) {
      if (x.panic != null) {
        lexer.panic(x.panic);
      }
      tokens.push(x);
    }
    ref = format(code, tokens), input = ref.input, output = ref.output;
    $("#input>pre").html(input);
    return $("#output>pre").html(output);
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
    }
    output = ("<span class=\"compileinfo\">词法分析结束，共" + tokennum + "个词法单元，" + errornum + "处错误\n</span>") + output;
    return {
      input: input,
      output: output
    };
  };

  window.activate = function(id) {
    return $(".map-" + id).addClass('active');
  };

  window.deactivate = function(id) {
    return $(".map-" + id).removeClass('active');
  };

}).call(this);
