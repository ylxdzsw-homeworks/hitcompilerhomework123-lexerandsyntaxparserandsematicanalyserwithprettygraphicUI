(function() {
  var analyze, calcSelect, checkLL1, gen_table, isNullable, isTerminal, rules, symbols,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  rules = symbols = null;

  (function() {
    var grammer, i, j, k, len, len1, m, ref, x;
    grammer = "Program -> ε\nProgram -> FunctionDef Program\nProgram -> RecordDef Program\nFunctionDef -> Type ID SLP ArgList SRP LLP Statements LRP\nRecordDef -> ID LLP Statements LRP\nArgList -> ε\nArgList -> VarDef ArgList_tail\nArgList_tail -> ε\nArgList_tail -> COMMA VarDef ArgList_tail\nVariable -> ID IndexList\nIndexList -> ε\nIndexList -> Index IndexList\nIndex -> MLP Expression MRP\nVarDef -> Type ID\nStatements -> ε\nStatements -> Statement Statements\nStatement -> LLP Statements LRP\nStatement -> VarDef LF\nStatement -> Variable Statement_assignorcall\nStatement -> WHILE SLP Expression SRP Statement\nStatement -> IF SLP Expression SRP Statement Statement_else\nStatement -> RETURN Expression\nStatement_else -> ε\nStatement_else -> ELSE Statement\nStatement_assignorcall -> EQ Expression LF\nStatement_assignorcall -> SLP VarList SRP LF\nVarList -> ε\nVarList -> Variable VarList_tail\nVarList_tail -> ε\nVarList_tail -> COMMA Variable VarList_tail\nExpression -> Expression_atom Expression_tail\nExpression_tail -> ε\nExpression_tail -> OP Expression_atom Expression_tail\nExpression_atom -> SLP Expression SRP\nExpression_atom -> Variable Expression_atom_call\nExpression_atom -> Const\nExpression_atom_call -> ε\nExpression_atom_call -> SLP VarList SRP\nConst -> INTC\nConst -> FLOATC\nConst -> STRINGC\nConst -> CHARC\nType -> INT Type_tail\nType -> FLOAT Type_tail\nType -> BOOL Type_tail\nType -> STRING Type_tail\nType -> CHAR Type_tail\nType -> RECORD ID Type_tail\nType_tail -> ε\nType_tail -> MLP INTC MRP Type_tail";
    rules = (function() {
      var k, len, ref, results;
      ref = grammer.split('\n');
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        x = ref[i];
        results.push({
          left: x.split('->')[0].trim(),
          right: x.split('-> ')[1].split(' ').map(function(x) {
            return x.trim();
          }),
          id: i
        });
      }
      return results;
    })();
    symbols = new Set;
    for (k = 0, len = rules.length; k < len; k++) {
      i = rules[k];
      symbols.add(i.left);
      ref = i.right;
      for (m = 0, len1 = ref.length; m < len1; m++) {
        j = ref[m];
        symbols.add(j);
      }
    }
    return symbols["delete"]('ε');
  })();

  calcSelect = function() {
    var calcFirst, calcFollow, i, k, len, results, x;
    calcFirst = (function() {
      var cache;
      cache = {};
      (function() {
        var allSeq, counter, flag, i, left, results, right, rule, t;
        allSeq = _.groupBy(rules, function(x) {
          return x.left;
        });
        symbols.forEach(function(i) {
          if (isTerminal(i)) {
            return cache[i] = [i];
          } else {
            return cache[i] = indexOf.call(_.chain(allSeq[i]).pluck('right').flatten().value(), 'ε') >= 0 ? ['ε'] : [];
          }
        });
        flag = true;
        results = [];
        while (flag) {
          flag = false;
          results.push((function() {
            var k, len, len1, len2, m, n, ref, results1;
            results1 = [];
            for (k = 0, len = rules.length; k < len; k++) {
              rule = rules[k];
              left = rule.left, right = rule.right;
              counter = 0;
              for (m = 0, len1 = right.length; m < len1; m++) {
                i = right[m];
                if (i === 'ε') {
                  continue;
                }
                ref = cache[i];
                for (n = 0, len2 = ref.length; n < len2; n++) {
                  t = ref[n];
                  if (t !== 'ε' && indexOf.call(cache[left], t) < 0) {
                    cache[left].push(t);
                    flag = true;
                  }
                }
                if (indexOf.call(cache[i], 'ε') < 0) {
                  break;
                }
                counter += 1;
              }
              if (counter === right.length && indexOf.call(cache[left], 'ε') < 0) {
                cache[left].push('ε');
                results1.push(flag = true);
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })());
        }
        return results;
      })();
      return function(x) {
        var flag, i, j, k, l, len, len1, m, ref, result;
        if (cache[x] != null) {
          return cache[x];
        }
        if (!x.length || x === 'ε') {
          return ['ε'];
        }
        l = x.split('-');
        result = [];
        flag = true;
        for (k = 0, len = l.length; k < len; k++) {
          i = l[k];
          ref = calcFirst(i);
          for (m = 0, len1 = ref.length; m < len1; m++) {
            j = ref[m];
            if (j !== 'ε') {
              result.push(j);
            }
          }
          if (indexOf.call(calcFirst(i), 'ε') < 0) {
            flag = false;
            break;
          }
        }
        if (flag) {
          result.push('ε');
        }
        return cache[x] = result;
      };
    })();
    calcFollow = (function() {
      var cache;
      cache = {};
      (function() {
        var allSeq, beta, flag, i, k, left, len, results, right, rule, x;
        allSeq = _.groupBy(rules, function(x) {
          return x.left;
        });
        for (k = 0, len = rules.length; k < len; k++) {
          rule = rules[k];
          if (!cache[rule.left]) {
            cache[rule.left] = [];
          }
        }
        cache['Program'] = ['$'];
        flag = true;
        results = [];
        while (flag) {
          flag = false;
          results.push((function() {
            var len1, m, results1;
            results1 = [];
            for (m = 0, len1 = rules.length; m < len1; m++) {
              rule = rules[m];
              left = rule.left, right = rule.right;
              results1.push((function() {
                var len2, len3, n, o, p, ref, ref1, ref2, results2;
                results2 = [];
                for (i = n = ref = right.length - 1; ref <= 0 ? n <= 0 : n >= 0; i = ref <= 0 ? ++n : --n) {
                  if (right[i] === 'ε' || isTerminal(right[i])) {
                    continue;
                  }
                  beta = right.slice(i + 1).join('-');
                  ref1 = calcFirst(beta);
                  for (o = 0, len2 = ref1.length; o < len2; o++) {
                    x = ref1[o];
                    if (x === 'ε') {
                      ref2 = cache[left];
                      for (p = 0, len3 = ref2.length; p < len3; p++) {
                        x = ref2[p];
                        if (indexOf.call(cache[right[i]], x) < 0) {
                          cache[right[i]].push(x);
                          flag = true;
                        }
                      }
                    } else {
                      if (indexOf.call(cache[right[i]], x) < 0 && x !== 'ε') {
                        cache[right[i]].push(x);
                        flag = true;
                      }
                    }
                  }
                  if (i + 1 < right.length && indexOf.call(calcFirst(right[i + 1]), 'ε') < 0) {
                    break;
                  } else {
                    results2.push(void 0);
                  }
                }
                return results2;
              })());
            }
            return results1;
          })());
        }
        return results;
      })();
      return function(x) {
        if (cache[x] != null) {
          return cache[x];
        }
        throw new Error("TODO");
      };
    })();
    window.calcFirst = calcFirst;
    window.calcFollow = calcFollow;
    results = [];
    for (k = 0, len = rules.length; k < len; k++) {
      i = rules[k];
      if (indexOf.call(calcFirst(i.right.join('-')), 'ε') < 0) {
        results.push(i.select = calcFirst(i.right.join('-')));
      } else {
        i.select = calcFirst(i.right.join('-'));
        i.select = _(i.select).without('ε');
        results.push((function() {
          var len1, m, ref, results1;
          ref = calcFollow(i.left);
          results1 = [];
          for (m = 0, len1 = ref.length; m < len1; m++) {
            x = ref[m];
            results1.push(i.select.push(x));
          }
          return results1;
        })());
      }
    }
    return results;
  };

  checkLL1 = function() {
    throw new Error("TODO");
  };

  gen_table = function() {
    var i, k, len, len1, m, ref, rule, table;
    table = {};
    for (k = 0, len = rules.length; k < len; k++) {
      rule = rules[k];
      if (!table[rule.left]) {
        table[rule.left] = {};
      }
      ref = rule.select;
      for (m = 0, len1 = ref.length; m < len1; m++) {
        i = ref[m];
        table[rule.left][i] = rule;
      }
    }
    return table;
  };

  analyze = function(tokens) {
    var X, i, ip, queue, result, rule, stack, table;
    ip = tokens.shift();
    stack = [
      {
        type: '$',
        level: -1
      }, {
        type: 'Program',
        level: 0
      }
    ];
    X = stack[stack.length - 1];
    result = [];
    table = gen_table();
    while (X.type !== '$') {
      if (X.type === ip.type) {
        result.push({
          type: 'terminal',
          token: ip,
          level: X.level
        });
        ip = tokens.shift();
        stack.pop();
      } else if (X.type === 'ε') {
        stack.pop();
      } else if (isTerminal(X.type)) {
        result.push({
          type: 'error',
          content: "unexpected " + X.type,
          level: X.level
        });
        stack.pop();
      } else if (table[X.type][ip.type]) {
        rule = table[X.type][ip.type];
        result.push({
          type: 'nonterminal',
          rule: rule,
          level: X.level
        });
        stack.pop();
        queue = (function() {
          var k, len, ref, results;
          ref = rule.right;
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            i = ref[k];
            results.push(i);
          }
          return results;
        })();
        while (queue.length) {
          stack.push({
            type: queue.pop(),
            level: X.level + 1
          });
        }
      } else if (ip.type === 'LF') {
        ip = tokens.shift();
      } else if (isNullable(X.type)) {
        result.push({
          type: 'nonterminal',
          rule: _.find(rules, function(x) {
            return x.left === X.type && indexOf.call(x.right, 'ε') >= 0;
          }),
          level: X.level
        });
        stack.pop();
      } else {
        result.push({
          type: 'error',
          content: "unexpected " + ip.type + ", needing " + X.type,
          level: X.level
        });
        stack.pop();
      }
      X = stack[stack.length - 1];
    }
    return result;
  };

  isTerminal = function(x) {
    return x === x.toUpperCase() && x !== 'ε';
  };

  isNullable = (function() {
    var cache;
    cache = {};
    return function(x) {
      if (cache[x]) {
        return cache[x];
      }
      return cache[x] = rules.filter(function(rule) {
        return rule.left === x;
      }).filter(function(rule) {
        return indexOf.call(rule.right, 'ε') >= 0;
      }).length;
    };
  })();

  window.Syntax = {
    rules: rules,
    symbols: symbols,
    analyze: analyze,
    isNullable: isNullable
  };

  calcSelect();

}).call(this);
