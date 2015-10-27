(function() {
  var DFA, FAState, NFA, NFAMoves, NFAStates, NFAtoDFA, Token, inputs, keywords,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  FAState = function(type, value, panic) {
    return {
      type: type,
      value: value,
      panic: panic
    };
  };

  NFA = function(state, move) {
    return {
      state: state,
      move: move
    };
  };

  DFA = function(state, moveTable, moveHash) {
    return {
      state: state,
      moveTable: moveTable,
      moveHash: moveHash
    };
  };

  Token = (function() {
    function Token(type1, value1, start, end, panic1) {
      var ref, ref1;
      this.type = type1;
      this.value = value1;
      this.start = start;
      this.end = end;
      this.panic = panic1;
      if (this.type === 'ID|KEY|BOOL') {
        if (ref = this.value, indexOf.call(keywords, ref) >= 0) {
          this.type = this.value.toUpperCase();
          this.value = '_';
        } else if ((ref1 = this.value) === 'true' || ref1 === 'false') {
          this.type = 'BOOL';
        } else {
          this.type = 'ID';
        }
      }
    }

    Token.prototype.format = function() {
      var ref;
      return this.start + " &lt;" + this.type + ", " + ((ref = this.value) != null ? ref : '_') + "&gt;";
    };

    return Token;

  })();

  inputs = {};

  inputs.letter = "abcdefghijklmnopqrstuvwxyz";

  inputs.letter += inputs.letter.toUpperCase();

  inputs.number = "0123456789";

  inputs.symbol = "+-*/&|%_<>=!,()[]{}.'\"";

  inputs.space = "\n\t \r";

  inputs.wildcard = "#";

  inputs.all = inputs.letter + inputs.number + inputs.symbol + inputs.space;

  keywords = ['int', 'float', 'bool', 'string', 'char', 'record', 'if', 'else', 'do', 'while'];

  NFAStates = {
    start: FAState(null),
    s1: FAState("ID|KEY|BOOL", true),
    s2: FAState("EQ", false),
    s3: FAState("LF", false),
    s4: FAState("MLP", false),
    s5: FAState("MRP", false),
    s6: FAState("STRINGC", true),
    s7: FAState("CHARC", true),
    s8: FAState("INTC", true),
    s9: FAState("FLOATC", true),
    s10: FAState("OP", true),
    s11: FAState("COMMENT", true),
    s12: FAState("SLP", false),
    s13: FAState("SRP", false),
    s14: FAState("COMMA", false),
    s15: FAState("LLP", false),
    s16: FAState("LRP", false),
    n1: FAState(null),
    n2: FAState(null),
    n3: FAState(null),
    n4: FAState(null),
    n5: FAState(null),
    n6: FAState(null),
    n7: FAState(null),
    n8: FAState(null),
    n9: FAState(null),
    n10: FAState(null),
    n11: FAState(null),
    n12: FAState(null),
    n13: FAState(null),
    e1: FAState('ERROR', "字符串字面量不能换行"),
    e2: FAState('ERROR', "字符字面量不能超过一个字符", {
      type: 'until',
      condition: "'\n"
    }),
    e3: FAState('ERROR', "字符字面量不能换行"),
    e4: FAState('ERROR', "数字字面量未写完整"),
    e5: FAState('ERROR', "标识符不能以数字开头", {
      type: 'while',
      condition: '_' + inputs.letter + inputs.number
    }),
    e6: FAState('ERROR', "数字字面量错误-重复的'.'", {
      type: 'while',
      condition: "." + inputs.number
    })
  };

  NFAMoves = [
    {
      tail: "start",
      head: "s1",
      input: '_' + inputs.letter
    }, {
      tail: "s1",
      head: "s1",
      input: '_' + inputs.letter + inputs.number
    }, {
      tail: "start",
      head: "s2",
      input: "="
    }, {
      tail: "start",
      head: "s3",
      input: "\n"
    }, {
      tail: "start",
      head: "s4",
      input: "["
    }, {
      tail: "start",
      head: "s5",
      input: "]"
    }, {
      tail: "start",
      head: "n11",
      input: "\""
    }, {
      tail: "n11",
      head: "n11",
      input: "#"
    }, {
      tail: "n11",
      head: "s6",
      input: "\""
    }, {
      tail: "start",
      head: "n12",
      input: "'"
    }, {
      tail: "n12",
      head: "n13",
      input: "#"
    }, {
      tail: "n13",
      head: "s7",
      input: "'"
    }, {
      tail: "start",
      head: "n1",
      input: inputs.number
    }, {
      tail: "n1",
      head: "n1",
      input: inputs.number
    }, {
      tail: "n1",
      head: "s8",
      input: "ε"
    }, {
      tail: "n1",
      head: "n2",
      input: "eE"
    }, {
      tail: "n2",
      head: "s8",
      input: inputs.number
    }, {
      tail: "s8",
      head: "s8",
      input: inputs.number
    }, {
      tail: "n1",
      head: "n3",
      input: "."
    }, {
      tail: "n3",
      head: "n4",
      input: inputs.number
    }, {
      tail: "n4",
      head: "n4",
      input: inputs.number
    }, {
      tail: "n4",
      head: "s9",
      input: "ε"
    }, {
      tail: "n4",
      head: "n5",
      input: "eE"
    }, {
      tail: "n5",
      head: "n6",
      input: "-"
    }, {
      tail: "n5",
      head: "s9",
      input: inputs.number
    }, {
      tail: "n6",
      head: "s9",
      input: inputs.number
    }, {
      tail: "s9",
      head: "s9",
      input: inputs.number
    }, {
      tail: "start",
      head: "n7",
      input: "!<>"
    }, {
      tail: "n7",
      head: "s10",
      input: "=ε"
    }, {
      tail: "s2",
      head: "s10",
      input: "="
    }, {
      tail: "start",
      head: "s10",
      input: "+-*&|%"
    }, {
      tail: "start",
      head: "n8",
      input: "/"
    }, {
      tail: "n8",
      head: "s10",
      input: "ε"
    }, {
      tail: "n8",
      head: "n9",
      input: "*"
    }, {
      tail: "n9",
      head: "n9",
      input: "#"
    }, {
      tail: "n9",
      head: "n10",
      input: "*"
    }, {
      tail: "n10",
      head: "n9",
      input: "#"
    }, {
      tail: "n10",
      head: "s11",
      input: "/"
    }, {
      tail: "start",
      head: "s12",
      input: "("
    }, {
      tail: "start",
      head: "s13",
      input: ")"
    }, {
      tail: "start",
      head: "s14",
      input: ","
    }, {
      tail: "start",
      head: "s15",
      input: "{"
    }, {
      tail: "start",
      head: "s16",
      input: "}"
    }, {
      tail: "n11",
      head: "e1",
      input: "\n"
    }, {
      tail: "n13",
      head: "e2",
      input: "#"
    }, {
      tail: "n12",
      head: "e3",
      input: "\n"
    }, {
      tail: "n2",
      head: "e4",
      input: "#"
    }, {
      tail: "n3",
      head: "e4",
      input: "#"
    }, {
      tail: "n5",
      head: "e4",
      input: "#"
    }, {
      tail: "n6",
      head: "e4",
      input: "#"
    }, {
      tail: "n1",
      head: "e5",
      input: '_' + inputs.letter
    }, {
      tail: "s8",
      head: "e5",
      input: '_' + inputs.letter
    }, {
      tail: "n4",
      head: "e5",
      input: '_' + inputs.letter
    }, {
      tail: "s9",
      head: "e5",
      input: '_' + inputs.letter
    }, {
      tail: "n3",
      head: "e6",
      input: "."
    }, {
      tail: "n4",
      head: "e6",
      input: "."
    }
  ];

  NFAtoDFA = function(NFA) {
    var DFAMoveHash, DFAStates, Dmove, Dstates, T, U, calcEpsilonClosureT, i, j, k, l, len, len1, len2, m, n, name, ref, unFind, v, x;
    calcEpsilonClosureT = function(T) {
      var calcEpsilonClosureS, epsilonClosure, l, len, ref, t;
      epsilonClosure = [];
      calcEpsilonClosureS = function(t) {
        var i, l, len, ref, u;
        epsilonClosure.push(t);
        ref = (function() {
          var len, m, ref, results;
          ref = NFA.move;
          results = [];
          for (m = 0, len = ref.length; m < len; m++) {
            i = ref[m];
            if (i.tail === t && indexOf.call(i.input, 'ε') >= 0) {
              results.push(i.head);
            }
          }
          return results;
        })();
        for (l = 0, len = ref.length; l < len; l++) {
          u = ref[l];
          if (indexOf.call(epsilonClosure, u) < 0) {
            calcEpsilonClosureS(u);
          }
        }
        return null;
      };
      ref = T.split('-');
      for (l = 0, len = ref.length; l < len; l++) {
        t = ref[l];
        calcEpsilonClosureS(t);
      }
      return _(epsilonClosure.sort()).uniq(true).join('-');
    };
    Dstates = [calcEpsilonClosureT('start')];
    Dmove = [];
    DFAMoveHash = {};
    DFAStates = [];
    unFind = [0];
    while (unFind.length) {
      T = Dstates[unFind.pop()];
      ref = inputs.all + '#';
      for (l = 0, len = ref.length; l < len; l++) {
        i = ref[l];
        U = calcEpsilonClosureT(_(((function() {
          var len1, m, ref1, ref2, results;
          ref1 = NFA.move;
          results = [];
          for (m = 0, len1 = ref1.length; m < len1; m++) {
            x = ref1[m];
            if ((ref2 = x.tail, indexOf.call(T.split('-'), ref2) >= 0) && indexOf.call(x.input, i) >= 0) {
              results.push(x.head);
            }
          }
          return results;
        })()).sort()).uniq(true).join('-'));
        if (!U.length) {
          continue;
        }
        if (indexOf.call(Dstates, U) < 0) {
          unFind.push(Dstates.length);
          Dstates.push(U);
        }
        Dmove.push({
          tail: T,
          head: U,
          input: i
        });
      }
    }
    for (m = 0, len1 = Dmove.length; m < len1; m++) {
      i = Dmove[m];
      if (DFAMoveHash[name = i.tail] == null) {
        DFAMoveHash[name] = {};
      }
      DFAMoveHash[i.tail][i.input] = i.head;
    }
    Dmove = (function() {
      var ref1, results;
      ref1 = _(Dmove).groupBy(function(x) {
        return x.tail + "+" + x.head;
      });
      results = [];
      for (k in ref1) {
        v = ref1[k];
        results.push({
          tail: v[0].tail,
          head: v[0].head,
          input: ((function() {
            var len2, n, results1;
            results1 = [];
            for (n = 0, len2 = v.length; n < len2; n++) {
              i = v[n];
              results1.push(i.input);
            }
            return results1;
          })()).join('')
        });
      }
      return results;
    })();
    for (n = 0, len2 = Dstates.length; n < len2; n++) {
      i = Dstates[n];
      x = (function() {
        var len3, o, ref1, results;
        ref1 = i.split('-');
        results = [];
        for (o = 0, len3 = ref1.length; o < len3; o++) {
          j = ref1[o];
          if (NFAStates[j].type != null) {
            results.push(NFAStates[j]);
          }
        }
        return results;
      })();
      switch (x.length) {
        case 0:
          DFAStates[i] = FAState(null);
          break;
        case 1:
          DFAStates[i] = FAState(x[0].type, x[0].value, x[0].panic);
          break;
        default:
          throw new Error("可能有多种结果，请检查词法");
      }
    }
    return DFA(DFAStates, Dmove, DFAMoveHash);
  };

  DFA = NFAtoDFA(NFA(NFAStates, NFAMoves));

  window.Lexer = function(code) {
    var cursor, getPos, traceOne;
    code = code.split('');
    cursor = {
      line: 1,
      column: 0
    };
    traceOne = function() {
      if (code.shift() === '\n') {
        cursor.line += 1;
        cursor.column = 0;
      } else {
        cursor.column += 1;
      }
      return null;
    };
    getPos = function() {
      return cursor.line + ":" + cursor.column;
    };
    return {
      panic: function(arg) {
        var condition, ref, ref1, results, results1, type;
        type = arg.type, condition = arg.condition;
        switch (type) {
          case 'number':
            results = [];
            while (condition--) {
              results.push(traceOne());
            }
            return results;
            break;
          case 'while':
            results1 = [];
            while (ref = code[0], indexOf.call(condition, ref) >= 0) {
              results1.push(traceOne());
            }
            return results1;
            break;
          case 'until':
            while (!((ref1 = code[0], indexOf.call(condition, ref1) >= 0) || code.length === 0)) {
              traceOne();
            }
            return traceOne();
        }
      },
      getNextToken: function() {
        var i, nextState, position, ref, ref1, ref2, state, type, val;
        val = "";
        state = 'start';
        position = getPos();
        while (i = code[0]) {
          nextState = (ref = (ref1 = DFA.moveHash[state]) != null ? ref1[i] : void 0) != null ? ref : (ref2 = DFA.moveHash[state]) != null ? ref2[inputs.wildcard] : void 0;
          if (nextState != null) {
            if (DFA.state[nextState].type === 'ERROR') {
              return new Token('ERROR', DFA.state[nextState].value, position, getPos(), DFA.state[nextState].panic);
            }
            val += i;
            traceOne();
            state = nextState;
          } else if (type = DFA.state[state].type) {
            return new Token(type, (DFA.state[state].value ? val : null), position, getPos());
          } else {
            if (state === 'start') {
              traceOne();
              if (indexOf.call(inputs.space, i) >= 0) {
                position = getPos();
                continue;
              }
            }
            return new Token('ERROR', "unexpected symbol '" + i + "'", position, getPos());
          }
        }
        if (type = DFA.state[state].type) {
          return new Token(type, (DFA.state[state].value ? val : null), position, getPos());
        } else if (state === 'start') {
          return null;
        } else {
          return new Token('ERROR', "Early EOF", position, getPos());
        }
      }
    };
  };

}).call(this);
