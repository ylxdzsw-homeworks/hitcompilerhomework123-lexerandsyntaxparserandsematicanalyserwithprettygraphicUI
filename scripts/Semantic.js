(function() {
  var STArgList, STArgList_1, STArgList_2, STArgList_tail, STArgList_tail_1, STArgList_tail_2, STConst, STConst_1, STConst_2, STConst_3, STConst_4, STExpression, STExpression_1, STExpression_atom, STExpression_atom_1, STExpression_atom_2, STExpression_atom_3, STExpression_atom_call, STExpression_atom_call_1, STExpression_atom_call_2, STExpression_tail, STExpression_tail_1, STExpression_tail_2, STFunctionDef, STFunctionDef_1, STIndex, STIndexList, STIndexList_1, STIndexList_2, STIndex_1, STNode, STProgram, STProgram_1, STProgram_2, STProgram_3, STRecordDef, STRecordDef_1, STStatement, STStatement_1, STStatement_2, STStatement_3, STStatement_4, STStatement_5, STStatement_6, STStatement_assignorcall, STStatement_assignorcall_1, STStatement_assignorcall_2, STStatement_else, STStatement_else_1, STStatement_else_2, STStatements, STStatements_1, STStatements_2, STType, STType_1, STType_2, STType_3, STType_4, STType_5, STType_6, STType_tail, STType_tail_1, STType_tail_2, STVarDef, STVarDef_1, STVarList, STVarList_1, STVarList_2, STVarList_tail, STVarList_tail_1, STVarList_tail_2, STVariable, STVariable_1, Scope, Target, analyze, buildTree, classMap, codegen, errorCollector, extract, getTypeLength, isNotIpsilon, loadBuiltIn, tempVal,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Scope = (function() {
    function Scope(father) {
      var ref1, ref2;
      this.father = father;
      this.symbolTable = new Map;
      this.typeDefs = (ref1 = (ref2 = this.father) != null ? ref2.typeDefs : void 0) != null ? ref1 : new Map;
      this.pos = 0;
    }

    Scope.prototype.find = function(symbol) {
      var ref1, ref2;
      return (ref1 = this.symbolTable.get(symbol)) != null ? ref1 : (ref2 = this.father) != null ? ref2.find(symbol) : void 0;
    };

    Scope.prototype.has = function(symbol, rec) {
      if (rec == null) {
        rec = true;
      }
      if (rec) {
        return this.find(symbol) != null;
      } else {
        return this.symbolTable.has(symbol);
      }
    };

    Scope.prototype.add = function(symbol, type, pos) {
      this.symbolTable.set(symbol, {
        pos: pos != null ? pos : this.pos,
        name: symbol,
        type: type
      });
      if (pos == null) {
        return this.pos += getTypeLength(type, this);
      }
    };

    Scope.prototype.allSymbols = function() {
      return Array.from(this.symbolTable.values());
    };

    Scope.prototype.getLength = function() {
      return this.allSymbols().map(extract('type')).map((function(_this) {
        return function(x) {
          return getTypeLength(x, _this);
        };
      })(this)).reduce(function(x, y) {
        return x + y;
      });
    };

    Scope.prototype.forEach = function() {
      return this.symbolTable.forEach.apply(this.symbolTable, arguments);
    };

    Scope.prototype.typeDef = function() {
      return this.typeDefs.set.apply(this.typeDefs, arguments);
    };

    Scope.prototype.getType = function() {
      return this.typeDefs.get.apply(this.typeDefs, arguments);
    };

    return Scope;

  })();

  Target = (function() {
    function Target() {
      this.code = [];
    }

    Target.prototype.get = function(i) {
      return this.code[i - 1];
    };

    Target.prototype.gen = function(a, b, c, d, e) {
      return this.code.push([a, b, c, d, e]);
    };

    Target.prototype.nextPos = function() {
      return this.code.length + 1;
    };

    Target.prototype.format = function(formatter) {
      var a, b, c, d, e, j, len, line, ref1, ref2, results;
      ref1 = this.code;
      results = [];
      for (line = j = 0, len = ref1.length; j < len; line = ++j) {
        ref2 = ref1[line], a = ref2[0], b = ref2[1], c = ref2[2], d = ref2[3], e = ref2[4];
        results.push(formatter(line, a, b, c, d, e));
      }
      return results;
    };

    return Target;

  })();

  STNode = (function() {
    function STNode() {
      throw new Error('unimplemented!');
    }

    STNode.prototype.analyze = function() {
      throw new Error('unimplemented!');
    };

    STNode.prototype.codegen = function() {
      throw new Error('unimplemented!');
    };

    return STNode;

  })();

  STProgram = (function(superClass) {
    extend(STProgram, superClass);

    function STProgram() {
      return STProgram.__super__.constructor.apply(this, arguments);
    }

    return STProgram;

  })(STNode);

  STFunctionDef = (function(superClass) {
    extend(STFunctionDef, superClass);

    function STFunctionDef() {
      return STFunctionDef.__super__.constructor.apply(this, arguments);
    }

    return STFunctionDef;

  })(STNode);

  STRecordDef = (function(superClass) {
    extend(STRecordDef, superClass);

    function STRecordDef() {
      return STRecordDef.__super__.constructor.apply(this, arguments);
    }

    return STRecordDef;

  })(STNode);

  STArgList = (function(superClass) {
    extend(STArgList, superClass);

    function STArgList() {
      return STArgList.__super__.constructor.apply(this, arguments);
    }

    return STArgList;

  })(STNode);

  STArgList_tail = (function(superClass) {
    extend(STArgList_tail, superClass);

    function STArgList_tail() {
      return STArgList_tail.__super__.constructor.apply(this, arguments);
    }

    return STArgList_tail;

  })(STNode);

  STVariable = (function(superClass) {
    extend(STVariable, superClass);

    function STVariable() {
      return STVariable.__super__.constructor.apply(this, arguments);
    }

    return STVariable;

  })(STNode);

  STIndexList = (function(superClass) {
    extend(STIndexList, superClass);

    function STIndexList() {
      return STIndexList.__super__.constructor.apply(this, arguments);
    }

    return STIndexList;

  })(STNode);

  STIndex = (function(superClass) {
    extend(STIndex, superClass);

    function STIndex() {
      return STIndex.__super__.constructor.apply(this, arguments);
    }

    return STIndex;

  })(STNode);

  STVarDef = (function(superClass) {
    extend(STVarDef, superClass);

    function STVarDef() {
      return STVarDef.__super__.constructor.apply(this, arguments);
    }

    return STVarDef;

  })(STNode);

  STStatements = (function(superClass) {
    extend(STStatements, superClass);

    function STStatements() {
      return STStatements.__super__.constructor.apply(this, arguments);
    }

    return STStatements;

  })(STNode);

  STStatement = (function(superClass) {
    extend(STStatement, superClass);

    function STStatement() {
      return STStatement.__super__.constructor.apply(this, arguments);
    }

    return STStatement;

  })(STNode);

  STStatement_else = (function(superClass) {
    extend(STStatement_else, superClass);

    function STStatement_else() {
      return STStatement_else.__super__.constructor.apply(this, arguments);
    }

    return STStatement_else;

  })(STNode);

  STStatement_assignorcall = (function(superClass) {
    extend(STStatement_assignorcall, superClass);

    function STStatement_assignorcall() {
      return STStatement_assignorcall.__super__.constructor.apply(this, arguments);
    }

    return STStatement_assignorcall;

  })(STNode);

  STVarList = (function(superClass) {
    extend(STVarList, superClass);

    function STVarList() {
      return STVarList.__super__.constructor.apply(this, arguments);
    }

    return STVarList;

  })(STNode);

  STVarList_tail = (function(superClass) {
    extend(STVarList_tail, superClass);

    function STVarList_tail() {
      return STVarList_tail.__super__.constructor.apply(this, arguments);
    }

    return STVarList_tail;

  })(STNode);

  STExpression = (function(superClass) {
    extend(STExpression, superClass);

    function STExpression() {
      return STExpression.__super__.constructor.apply(this, arguments);
    }

    return STExpression;

  })(STNode);

  STExpression_tail = (function(superClass) {
    extend(STExpression_tail, superClass);

    function STExpression_tail() {
      return STExpression_tail.__super__.constructor.apply(this, arguments);
    }

    return STExpression_tail;

  })(STNode);

  STExpression_atom = (function(superClass) {
    extend(STExpression_atom, superClass);

    function STExpression_atom() {
      return STExpression_atom.__super__.constructor.apply(this, arguments);
    }

    return STExpression_atom;

  })(STNode);

  STExpression_atom_call = (function(superClass) {
    extend(STExpression_atom_call, superClass);

    function STExpression_atom_call() {
      return STExpression_atom_call.__super__.constructor.apply(this, arguments);
    }

    return STExpression_atom_call;

  })(STNode);

  STConst = (function(superClass) {
    extend(STConst, superClass);

    function STConst() {
      return STConst.__super__.constructor.apply(this, arguments);
    }

    return STConst;

  })(STNode);

  STType = (function(superClass) {
    extend(STType, superClass);

    function STType() {
      return STType.__super__.constructor.apply(this, arguments);
    }

    return STType;

  })(STNode);

  STType_tail = (function(superClass) {
    extend(STType_tail, superClass);

    function STType_tail() {
      return STType_tail.__super__.constructor.apply(this, arguments);
    }

    return STType_tail;

  })(STNode);

  STProgram_1 = (function(superClass) {
    extend(STProgram_1, superClass);

    function STProgram_1() {}

    STProgram_1.prototype.analyze = function() {};

    STProgram_1.prototype.codegen = function() {};

    return STProgram_1;

  })(STProgram);

  STProgram_2 = (function(superClass) {
    extend(STProgram_2, superClass);

    function STProgram_2(FunctionDef, Program) {
      this.FunctionDef = FunctionDef;
      this.Program = Program;
    }

    STProgram_2.prototype.analyze = function(scope) {
      this.FunctionDef.analyze(scope);
      return this.Program.analyze(scope);
    };

    STProgram_2.prototype.codegen = function(scope, target) {
      this.FunctionDef.codegen(scope, target);
      return this.Program.codegen(scope, target);
    };

    return STProgram_2;

  })(STProgram);

  STProgram_3 = (function(superClass) {
    extend(STProgram_3, superClass);

    function STProgram_3(RecordDef, Program) {
      this.RecordDef = RecordDef;
      this.Program = Program;
    }

    STProgram_3.prototype.analyze = function(scope) {
      this.RecordDef.analyze(scope);
      return this.Program.analyze(scope);
    };

    STProgram_3.prototype.codegen = function(scope, target) {
      this.RecordDef.codegen(scope, target);
      return this.Program.codegen(scope, target);
    };

    return STProgram_3;

  })(STProgram);

  STFunctionDef_1 = (function(superClass) {
    extend(STFunctionDef_1, superClass);

    function STFunctionDef_1(Type, ID, SLP, ArgList, SRP, LLP, Statements, LRP) {
      this.Type = Type;
      this.ID = ID;
      this.SLP = SLP;
      this.ArgList = ArgList;
      this.SRP = SRP;
      this.LLP = LLP;
      this.Statements = Statements;
      this.LRP = LRP;
    }

    STFunctionDef_1.prototype.analyze = function(scope) {
      var argScope, args, childScope, i, j, len;
      argScope = new Scope(scope);
      childScope = new Scope(scope);
      this.ArgList.analyze(argScope);
      args = argScope.allSymbols();
      for (j = 0, len = args.length; j < len; j++) {
        i = args[j];
        childScope.add(i.name, i.type, 'arg');
      }
      this.Statements.analyze(childScope);
      this.Type.analyze(scope);
      scope.typeDef(this.ID.value, {
        name: this.ID.value,
        type: 'function',
        ret: this.Type.value,
        arg: args,
        scope: childScope
      });
      scope.add(this.ID.value, this.ID.value);
      return childScope.fun = this.ID.value;
    };

    STFunctionDef_1.prototype.codegen = function(scope, target) {
      var funcInfo;
      target.gen("function " + this.ID.value + ":");
      funcInfo = scope.getType(this.ID.value);
      funcInfo.pos = target.nextPos();
      return this.Statements.codegen(funcInfo.scope, target);
    };

    return STFunctionDef_1;

  })(STFunctionDef);

  STRecordDef_1 = (function(superClass) {
    extend(STRecordDef_1, superClass);

    function STRecordDef_1(ID, LLP, Statements, LRP) {
      this.ID = ID;
      this.LLP = LLP;
      this.Statements = Statements;
      this.LRP = LRP;
    }

    STRecordDef_1.prototype.analyze = function(scope) {
      var childScope;
      childScope = new Scope(scope);
      this.Statements.analyze(childScope);
      return scope.typeDef(this.ID.value, {
        name: this.ID.value,
        type: 'record',
        length: childScope.getLength(),
        fields: childScope.allSymbols()
      });
    };

    STRecordDef_1.prototype.codegen = function() {};

    return STRecordDef_1;

  })(STRecordDef);

  STArgList_1 = (function(superClass) {
    extend(STArgList_1, superClass);

    function STArgList_1() {}

    STArgList_1.prototype.analyze = function() {};

    STArgList_1.prototype.codegen = function() {};

    return STArgList_1;

  })(STArgList);

  STArgList_2 = (function(superClass) {
    extend(STArgList_2, superClass);

    function STArgList_2(VarDef, ArgList_tail) {
      this.VarDef = VarDef;
      this.ArgList_tail = ArgList_tail;
    }

    STArgList_2.prototype.analyze = function(scope) {
      this.VarDef.analyze(scope);
      return this.ArgList_tail.analyze(scope);
    };

    STArgList_2.prototype.codegen = function() {};

    return STArgList_2;

  })(STArgList);

  STArgList_tail_1 = (function(superClass) {
    extend(STArgList_tail_1, superClass);

    function STArgList_tail_1() {}

    STArgList_tail_1.prototype.analyze = function() {};

    STArgList_tail_1.prototype.codegen = function() {};

    return STArgList_tail_1;

  })(STArgList_tail);

  STArgList_tail_2 = (function(superClass) {
    extend(STArgList_tail_2, superClass);

    function STArgList_tail_2(COMMA, VarDef, ArgList_tail) {
      this.COMMA = COMMA;
      this.VarDef = VarDef;
      this.ArgList_tail = ArgList_tail;
    }

    STArgList_tail_2.prototype.analyze = function(scope) {
      this.VarDef.analyze(scope);
      return this.ArgList_tail.analyze(scope);
    };

    STArgList_tail_2.prototype.codegen = function() {};

    return STArgList_tail_2;

  })(STArgList_tail);

  STVariable_1 = (function(superClass) {
    extend(STVariable_1, superClass);

    function STVariable_1(ID, IndexList) {
      this.ID = ID;
      this.IndexList = IndexList;
    }

    STVariable_1.prototype.analyze = function(scope) {
      return this.IndexList.analyze(scope);
    };

    STVariable_1.prototype.codegen = function(scope, target) {
      var dimList, ref, symbol;
      symbol = scope.find(this.ID.value);
      if (!symbol) {
        this.value = '*error*';
        return errorCollector.add("error at " + this.ID.start + ": " + this.ID.value + "未定义");
      }
      dimList = symbol.type.split('*');
      dimList.push(getTypeLength(dimList.shift(), scope));
      this.IndexList.codegen(scope, target, dimList);
      this.type = symbol.type.split('*')[0];
      if (ref = this.IndexList.value) {
        return this.value = symbol.name + "[" + ref + "]:" + symbol.pos + "+" + ref;
      } else {
        return this.value = symbol.name + ":" + symbol.pos;
      }
    };

    return STVariable_1;

  })(STVariable);

  STIndexList_1 = (function(superClass) {
    extend(STIndexList_1, superClass);

    function STIndexList_1() {}

    STIndexList_1.prototype.analyze = function() {};

    STIndexList_1.prototype.codegen = function() {
      return this.distence = 1;
    };

    return STIndexList_1;

  })(STIndexList);

  STIndexList_2 = (function(superClass) {
    extend(STIndexList_2, superClass);

    function STIndexList_2(Index, IndexList) {
      this.Index = Index;
      this.IndexList = IndexList;
    }

    STIndexList_2.prototype.analyze = function(scope) {
      this.Index.analyze(scope);
      return this.IndexList.analyze(scope);
    };

    STIndexList_2.prototype.codegen = function(scope, target, dimList) {
      var ref, temp;
      this.IndexList.codegen(scope, target, dimList);
      this.distence = dimList.pop() * this.IndexList.distence;
      if (!dimList.length) {
        throw new Error('fucked134u12');
      }
      this.Index.codegen(scope, target);
      target.gen(tempVal.curr(), '=', this.Index.value, '*', this.distence);
      if (ref = this.IndexList.value) {
        temp = tempVal.next();
        target.gen(tempVal.curr(), '=', temp, '+', ref);
      }
      return this.value = tempVal.next();
    };

    return STIndexList_2;

  })(STIndexList);

  STIndex_1 = (function(superClass) {
    extend(STIndex_1, superClass);

    function STIndex_1(MLP, Expression, MRP) {
      this.MLP = MLP;
      this.Expression = Expression;
      this.MRP = MRP;
    }

    STIndex_1.prototype.analyze = function(scope) {
      return this.Expression.analyze(scope);
    };

    STIndex_1.prototype.codegen = function(scope, target) {
      this.Expression.codegen(scope, target);
      if (this.Expression.type !== 'INT') {
        target.gen('error: 索引不是INT');
      }
      return this.value = this.Expression.value;
    };

    return STIndex_1;

  })(STIndex);

  STVarDef_1 = (function(superClass) {
    extend(STVarDef_1, superClass);

    function STVarDef_1(Type, ID) {
      this.Type = Type;
      this.ID = ID;
    }

    STVarDef_1.prototype.analyze = function(scope) {
      this.Type.analyze(scope);
      if (scope.has(this.ID.value, false)) {
        return errorCollector.add("error at " + this.ID.start + ": 重复定义变量" + this.ID.value);
      } else {
        return scope.add(this.ID.value, this.Type.value);
      }
    };

    STVarDef_1.prototype.codegen = function() {};

    return STVarDef_1;

  })(STVarDef);

  STStatements_1 = (function(superClass) {
    extend(STStatements_1, superClass);

    function STStatements_1() {}

    STStatements_1.prototype.analyze = function() {};

    STStatements_1.prototype.codegen = function() {};

    return STStatements_1;

  })(STStatements);

  STStatements_2 = (function(superClass) {
    extend(STStatements_2, superClass);

    function STStatements_2(Statement, Statements) {
      this.Statement = Statement;
      this.Statements = Statements;
    }

    STStatements_2.prototype.analyze = function(scope) {
      this.Statement.analyze(scope);
      return this.Statements.analyze(scope);
    };

    STStatements_2.prototype.codegen = function(scope, target) {
      this.Statement.codegen(scope, target);
      return this.Statements.codegen(scope, target);
    };

    return STStatements_2;

  })(STStatements);

  STStatement_1 = (function(superClass) {
    extend(STStatement_1, superClass);

    function STStatement_1(LLP, Statements, LRP) {
      this.LLP = LLP;
      this.Statements = Statements;
      this.LRP = LRP;
    }

    STStatement_1.prototype.analyze = function(scope) {
      return this.Statements.analyze(scope);
    };

    STStatement_1.prototype.codegen = function(scope, target) {
      return this.Statements.codegen(scope, target);
    };

    return STStatement_1;

  })(STStatement);

  STStatement_2 = (function(superClass) {
    extend(STStatement_2, superClass);

    function STStatement_2(VarDef, LF) {
      this.VarDef = VarDef;
      this.LF = LF;
    }

    STStatement_2.prototype.analyze = function(scope) {
      return this.VarDef.analyze(scope);
    };

    STStatement_2.prototype.codegen = function() {};

    return STStatement_2;

  })(STStatement);

  STStatement_3 = (function(superClass) {
    extend(STStatement_3, superClass);

    function STStatement_3(Variable, Statement_assignorcall) {
      this.Variable = Variable;
      this.Statement_assignorcall = Statement_assignorcall;
    }

    STStatement_3.prototype.analyze = function(scope) {
      this.Variable.analyze(scope);
      return this.Statement_assignorcall.analyze(scope);
    };

    STStatement_3.prototype.codegen = function(scope, target) {
      this.Variable.codegen(scope, target);
      return this.Statement_assignorcall.codegen(scope, target, this.Variable);
    };

    return STStatement_3;

  })(STStatement);

  STStatement_4 = (function(superClass) {
    extend(STStatement_4, superClass);

    function STStatement_4(WHILE, SLP, Expression, SRP, Statement) {
      this.WHILE = WHILE;
      this.SLP = SLP;
      this.Expression = Expression;
      this.SRP = SRP;
      this.Statement = Statement;
    }

    STStatement_4.prototype.analyze = function(scope) {
      this.Expression.analyze(scope);
      return this.Statement.analyze(scope);
    };

    STStatement_4.prototype.codegen = function(scope, target) {
      var pos1, pos2, pos3;
      pos1 = target.nextPos();
      this.Expression.codegen(scope, target);
      pos2 = target.nextPos();
      if (this.Expression.type !== 'INT') {
        target.gen('error: 条件不是INT');
      }
      target.gen('if', this.Expression.value, 'goto', null);
      this.Statement.codegen(scope, target);
      target.gen('goto', pos1);
      pos3 = target.nextPos();
      return target.get(pos2)[3] = pos3;
    };

    return STStatement_4;

  })(STStatement);

  STStatement_5 = (function(superClass) {
    extend(STStatement_5, superClass);

    function STStatement_5(IF, SLP, Expression, SRP, Statement, Statement_else) {
      this.IF = IF;
      this.SLP = SLP;
      this.Expression = Expression;
      this.SRP = SRP;
      this.Statement = Statement;
      this.Statement_else = Statement_else;
    }

    STStatement_5.prototype.analyze = function(scope) {
      this.Expression.analyze(scope);
      this.Statement.analyze(scope);
      return this.Statement_else.analyze(scope);
    };

    STStatement_5.prototype.codegen = function(scope, target) {
      var pos1, pos2, pos3;
      this.Expression.codegen(scope, target);
      if (this.Expression.type !== 'INT') {
        target.gen('error: 条件不是INT');
      }
      pos1 = target.nextPos();
      target.gen('if', this.Expression.value, 'goto', null);
      this.Statement_else.codegen(scope, target);
      pos2 = target.nextPos();
      target.gen('goto', null);
      this.Statement.codegen(scope, target);
      pos3 = target.nextPos();
      target.get(pos1)[3] = pos2 + 1;
      return target.get(pos2)[1] = pos3;
    };

    return STStatement_5;

  })(STStatement);

  STStatement_6 = (function(superClass) {
    extend(STStatement_6, superClass);

    function STStatement_6(RETURN, Expression) {
      this.RETURN = RETURN;
      this.Expression = Expression;
    }

    STStatement_6.prototype.analyze = function(scope) {
      return this.Expression.analyze(scope);
    };

    STStatement_6.prototype.codegen = function(scope, target) {
      this.Expression.codegen(scope, target);
      if (this.Expression.type !== scope.getType(scope.fun).ret) {
        target.gen('error: 返回值类型不匹配');
      }
      return target.gen('return', this.Expression.value);
    };

    return STStatement_6;

  })(STStatement);

  STStatement_else_1 = (function(superClass) {
    extend(STStatement_else_1, superClass);

    function STStatement_else_1() {}

    STStatement_else_1.prototype.analyze = function() {};

    STStatement_else_1.prototype.codegen = function() {};

    return STStatement_else_1;

  })(STStatement_else);

  STStatement_else_2 = (function(superClass) {
    extend(STStatement_else_2, superClass);

    function STStatement_else_2(ELSE, Statement) {
      this.ELSE = ELSE;
      this.Statement = Statement;
    }

    STStatement_else_2.prototype.analyze = function(scope) {
      return this.Statement.analyze(scope);
    };

    STStatement_else_2.prototype.codegen = function(scope, target) {
      return this.Statement.codegen(scope, target);
    };

    return STStatement_else_2;

  })(STStatement_else);

  STStatement_assignorcall_1 = (function(superClass) {
    extend(STStatement_assignorcall_1, superClass);

    function STStatement_assignorcall_1(EQ, Expression, LF) {
      this.EQ = EQ;
      this.Expression = Expression;
      this.LF = LF;
    }

    STStatement_assignorcall_1.prototype.analyze = function(scope) {
      return this.Expression.analyze(scope);
    };

    STStatement_assignorcall_1.prototype.codegen = function(scope, target, left) {
      this.Expression.codegen(scope, target);
      if (left.type !== this.Expression.type) {
        target.gen("error: 赋值类型不匹配");
      }
      return target.gen(left.value, '=', this.Expression.value);
    };

    return STStatement_assignorcall_1;

  })(STStatement_assignorcall);

  STStatement_assignorcall_2 = (function(superClass) {
    extend(STStatement_assignorcall_2, superClass);

    function STStatement_assignorcall_2(SLP, VarList, SRP, LF) {
      this.SLP = SLP;
      this.VarList = VarList;
      this.SRP = SRP;
      this.LF = LF;
    }

    STStatement_assignorcall_2.prototype.analyze = function(scope) {
      return this.VarList.analyze(scope);
    };

    STStatement_assignorcall_2.prototype.codegen = function(scope, target, left) {
      var j, lambda, len, param, ref1, ref2;
      this.VarList.codegen(scope, target);
      lambda = scope.getType(left.type);
      if (!lambda) {
        return target.gen("error: " + left.value + "不是函数");
      }
      if (this.VarList.value) {
        target.gen('goto', "pc+" + (this.VarList.value.length + 1));
        ref1 = this.VarList.value;
        for (j = 0, len = ref1.length; j < len; j++) {
          param = ref1[j];
          target.gen('param', param);
        }
      }
      return target.gen('call', lambda.name, (ref2 = this.VarList.value.length) != null ? ref2 : 0);
    };

    return STStatement_assignorcall_2;

  })(STStatement_assignorcall);

  STVarList_1 = (function(superClass) {
    extend(STVarList_1, superClass);

    function STVarList_1() {}

    STVarList_1.prototype.analyze = function() {};

    STVarList_1.prototype.codegen = function() {
      return this.value = [];
    };

    return STVarList_1;

  })(STVarList);

  STVarList_2 = (function(superClass) {
    extend(STVarList_2, superClass);

    function STVarList_2(Variable, VarList_tail) {
      this.Variable = Variable;
      this.VarList_tail = VarList_tail;
    }

    STVarList_2.prototype.analyze = function(scope) {
      this.Variable.analyze(scope);
      return this.VarList_tail.analyze(scope);
    };

    STVarList_2.prototype.codegen = function(scope, target) {
      this.Variable.codegen(scope, target);
      this.VarList_tail.codegen(scope, target);
      return this.value = [this.Variable.value].concat(slice.call(this.VarList_tail.value));
    };

    return STVarList_2;

  })(STVarList);

  STVarList_tail_1 = (function(superClass) {
    extend(STVarList_tail_1, superClass);

    function STVarList_tail_1() {}

    STVarList_tail_1.prototype.analyze = function() {};

    STVarList_tail_1.prototype.codegen = function() {
      return this.value = [];
    };

    return STVarList_tail_1;

  })(STVarList_tail);

  STVarList_tail_2 = (function(superClass) {
    extend(STVarList_tail_2, superClass);

    function STVarList_tail_2(COMMA, Variable, VarList_tail) {
      this.COMMA = COMMA;
      this.Variable = Variable;
      this.VarList_tail = VarList_tail;
    }

    STVarList_tail_2.prototype.analyze = function(scope) {
      this.Variable.analyze(scope);
      return this.VarList_tail.analyze(scope);
    };

    STVarList_tail_2.prototype.codegen = function(scope, target) {
      this.Variable.codegen(scope, target);
      this.VarList_tail.codegen(scope, target);
      return this.value = [this.Variable.value].concat(slice.call(this.VarList_tail.value));
    };

    return STVarList_tail_2;

  })(STVarList_tail);

  STExpression_1 = (function(superClass) {
    extend(STExpression_1, superClass);

    function STExpression_1(Expression_atom, Expression_tail) {
      this.Expression_atom = Expression_atom;
      this.Expression_tail = Expression_tail;
    }

    STExpression_1.prototype.analyze = function(scope) {
      this.Expression_atom.analyze(scope);
      return this.Expression_tail.analyze(scope);
    };

    STExpression_1.prototype.codegen = function(scope, target) {
      this.Expression_atom.codegen(scope, target);
      this.Expression_tail.codegen(scope, target, this.Expression_atom);
      this.type = this.Expression_tail.type;
      return this.value = this.Expression_tail.value;
    };

    return STExpression_1;

  })(STExpression);

  STExpression_tail_1 = (function(superClass) {
    extend(STExpression_tail_1, superClass);

    function STExpression_tail_1() {}

    STExpression_tail_1.prototype.analyze = function() {};

    STExpression_tail_1.prototype.codegen = function(scope, target, left) {
      this.type = left.type;
      return this.value = left.value;
    };

    return STExpression_tail_1;

  })(STExpression_tail);

  STExpression_tail_2 = (function(superClass) {
    extend(STExpression_tail_2, superClass);

    function STExpression_tail_2(OP, Expression_atom, Expression_tail) {
      this.OP = OP;
      this.Expression_atom = Expression_atom;
      this.Expression_tail = Expression_tail;
    }

    STExpression_tail_2.prototype.analyze = function(scope) {
      this.Expression_atom.analyze(scope);
      return this.Expression_tail.analyze(scope);
    };

    STExpression_tail_2.prototype.codegen = function(scope, target, left) {
      this.Expression_atom.codegen(scope, target);
      target.gen(tempVal.curr(), '=', left.value, this.OP.value, this.Expression_atom.value);
      this.Expression_tail.codegen(scope, target, {
        type: left.type,
        value: tempVal.next()
      });
      this.type = this.Expression_tail.type;
      return this.value = this.Expression_tail.value;
    };

    return STExpression_tail_2;

  })(STExpression_tail);

  STExpression_atom_1 = (function(superClass) {
    extend(STExpression_atom_1, superClass);

    function STExpression_atom_1(SLP, Expression, SRP) {
      this.SLP = SLP;
      this.Expression = Expression;
      this.SRP = SRP;
    }

    STExpression_atom_1.prototype.analyze = function(scope) {
      return this.Expression.analyze(scope);
    };

    STExpression_atom_1.prototype.codegen = function(scope, target) {
      this.Expression.codegen(scope, target);
      this.type = this.Expression_tail.type;
      return this.value = this.Expression.value;
    };

    return STExpression_atom_1;

  })(STExpression_atom);

  STExpression_atom_2 = (function(superClass) {
    extend(STExpression_atom_2, superClass);

    function STExpression_atom_2(Variable, Expression_atom_call) {
      this.Variable = Variable;
      this.Expression_atom_call = Expression_atom_call;
    }

    STExpression_atom_2.prototype.analyze = function(scope) {
      this.Variable.analyze(scope);
      return this.Expression_atom_call.analyze(scope);
    };

    STExpression_atom_2.prototype.codegen = function(scope, target) {
      this.Variable.codegen(scope, target);
      this.Expression_atom_call.codegen(scope, target, this.Variable);
      this.type = this.Expression_atom_call.type;
      return this.value = this.Expression_atom_call.value;
    };

    return STExpression_atom_2;

  })(STExpression_atom);

  STExpression_atom_3 = (function(superClass) {
    extend(STExpression_atom_3, superClass);

    function STExpression_atom_3(Const) {
      this.Const = Const;
    }

    STExpression_atom_3.prototype.analyze = function(scope) {
      return this.Const.analyze(scope);
    };

    STExpression_atom_3.prototype.codegen = function(scope, target) {
      this.Const.codegen(scope, target);
      this.type = this.Const.type;
      return this.value = this.Const.value;
    };

    return STExpression_atom_3;

  })(STExpression_atom);

  STExpression_atom_call_1 = (function(superClass) {
    extend(STExpression_atom_call_1, superClass);

    function STExpression_atom_call_1() {}

    STExpression_atom_call_1.prototype.analyze = function() {};

    STExpression_atom_call_1.prototype.codegen = function(scope, target, left) {
      this.type = left.type;
      return this.value = left.value;
    };

    return STExpression_atom_call_1;

  })(STExpression_atom_call);

  STExpression_atom_call_2 = (function(superClass) {
    extend(STExpression_atom_call_2, superClass);

    function STExpression_atom_call_2(SLP, VarList, SRP) {
      this.SLP = SLP;
      this.VarList = VarList;
      this.SRP = SRP;
    }

    STExpression_atom_call_2.prototype.analyze = function(scope) {
      return this.VarList.analyze(scope);
    };

    STExpression_atom_call_2.prototype.codegen = function(scope, target, left) {
      var j, lambda, len, param, ref1, ref2;
      this.VarList.codegen(scope, target);
      lambda = scope.getType(left.type);
      if (this.VarList.value) {
        target.gen('goto', "pc+" + (this.VarList.value.length + 1));
        ref1 = this.VarList.value;
        for (j = 0, len = ref1.length; j < len; j++) {
          param = ref1[j];
          target.gen('param', param);
        }
      }
      target.gen(tempVal.curr(), '=', 'call', lambda.name, (ref2 = this.VarList.value.length) != null ? ref2 : 0);
      this.type = lambda.ret;
      return this.value = tempVal.next();
    };

    return STExpression_atom_call_2;

  })(STExpression_atom_call);

  STConst_1 = (function(superClass) {
    extend(STConst_1, superClass);

    function STConst_1(INTC) {
      this.INTC = INTC;
    }

    STConst_1.prototype.analyze = function() {
      this.type = 'INT';
      return this.value = this.INTC.value;
    };

    STConst_1.prototype.codegen = function() {
      return this.value = this.INTC.value;
    };

    return STConst_1;

  })(STConst);

  STConst_2 = (function(superClass) {
    extend(STConst_2, superClass);

    function STConst_2(FLOATC) {
      this.FLOATC = FLOATC;
    }

    STConst_2.prototype.analyze = function() {
      this.type = 'FLOAT';
      return this.value = this.FLOATC.value;
    };

    STConst_2.prototype.codegen = function() {
      return this.value = this.FLOATC.value;
    };

    return STConst_2;

  })(STConst);

  STConst_3 = (function(superClass) {
    extend(STConst_3, superClass);

    function STConst_3(STRINGC) {
      this.STRINGC = STRINGC;
    }

    STConst_3.prototype.analyze = function() {
      this.type = "STRING";
      return this.value = this.STRINGC.value;
    };

    STConst_3.prototype.codegen = function() {
      return this.value = this.STRINGC.value;
    };

    return STConst_3;

  })(STConst);

  STConst_4 = (function(superClass) {
    extend(STConst_4, superClass);

    function STConst_4(CHARC) {
      this.CHARC = CHARC;
    }

    STConst_4.prototype.analyze = function() {
      this.type = 'CHAR';
      return this.value = this.CHARC.value;
    };

    STConst_4.prototype.codegen = function() {
      return this.value = this.CHARC.value;
    };

    return STConst_4;

  })(STConst);

  STType_1 = (function(superClass) {
    extend(STType_1, superClass);

    function STType_1(INT, Type_tail) {
      this.INT = INT;
      this.Type_tail = Type_tail;
    }

    STType_1.prototype.analyze = function(scope) {
      this.Type_tail.analyze(scope);
      return this.value = ['INT'].concat(slice.call(this.Type_tail.value)).join('*');
    };

    STType_1.prototype.codegen = function() {};

    return STType_1;

  })(STType);

  STType_2 = (function(superClass) {
    extend(STType_2, superClass);

    function STType_2(FLOAT, Type_tail) {
      this.FLOAT = FLOAT;
      this.Type_tail = Type_tail;
    }

    STType_2.prototype.analyze = function(scope) {
      this.Type_tail.analyze(scope);
      return this.value = ['FLOAT'].concat(slice.call(this.Type_tail.value)).join('*');
    };

    STType_2.prototype.codegen = function() {};

    return STType_2;

  })(STType);

  STType_3 = (function(superClass) {
    extend(STType_3, superClass);

    function STType_3(BOOL, Type_tail) {
      this.BOOL = BOOL;
      this.Type_tail = Type_tail;
    }

    STType_3.prototype.analyze = function(scope) {
      this.Type_tail.analyze(scope);
      return this.value = ['BOOL'].concat(slice.call(this.Type_tail.value)).join('*');
    };

    STType_3.prototype.codegen = function() {};

    return STType_3;

  })(STType);

  STType_4 = (function(superClass) {
    extend(STType_4, superClass);

    function STType_4(STRING, Type_tail) {
      this.STRING = STRING;
      this.Type_tail = Type_tail;
    }

    STType_4.prototype.analyze = function(scope) {
      this.Type_tail.analyze(scope);
      return this.value = ['STRING'].concat(slice.call(this.Type_tail.value)).join('*');
    };

    STType_4.prototype.codegen = function() {};

    return STType_4;

  })(STType);

  STType_5 = (function(superClass) {
    extend(STType_5, superClass);

    function STType_5(CHAR, Type_tail) {
      this.CHAR = CHAR;
      this.Type_tail = Type_tail;
    }

    STType_5.prototype.analyze = function(scope) {
      this.Type_tail.analyze(scope);
      return this.value = ['CHAR'].concat(slice.call(this.Type_tail.value)).join('*');
    };

    STType_5.prototype.codegen = function() {};

    return STType_5;

  })(STType);

  STType_6 = (function(superClass) {
    extend(STType_6, superClass);

    function STType_6(RECORD, ID, Type_tail) {
      this.RECORD = RECORD;
      this.ID = ID;
      this.Type_tail = Type_tail;
    }

    STType_6.prototype.analyze = function(scope) {
      this.Type_tail.analyze(scope);
      return this.value = [this.ID.value].concat(slice.call(this.Type_tail.value)).join('*');
    };

    STType_6.prototype.codegen = function() {};

    return STType_6;

  })(STType);

  STType_tail_1 = (function(superClass) {
    extend(STType_tail_1, superClass);

    function STType_tail_1() {}

    STType_tail_1.prototype.analyze = function() {
      return this.value = [];
    };

    STType_tail_1.prototype.codegen = function() {};

    return STType_tail_1;

  })(STType_tail);

  STType_tail_2 = (function(superClass) {
    extend(STType_tail_2, superClass);

    function STType_tail_2(MLP, INTC, MRP, Type_tail) {
      this.MLP = MLP;
      this.INTC = INTC;
      this.MRP = MRP;
      this.Type_tail = Type_tail;
    }

    STType_tail_2.prototype.analyze = function(scope) {
      this.Type_tail.analyze(scope);
      return this.value = [this.INTC.value].concat(slice.call(this.Type_tail.value));
    };

    STType_tail_2.prototype.codegen = function() {};

    return STType_tail_2;

  })(STType_tail);

  classMap = [STProgram_1, STProgram_2, STProgram_3, STFunctionDef_1, STRecordDef_1, STArgList_1, STArgList_2, STArgList_tail_1, STArgList_tail_2, STVariable_1, STIndexList_1, STIndexList_2, STIndex_1, STVarDef_1, STStatements_1, STStatements_2, STStatement_1, STStatement_2, STStatement_3, STStatement_4, STStatement_5, STStatement_6, STStatement_else_1, STStatement_else_2, STStatement_assignorcall_1, STStatement_assignorcall_2, STVarList_1, STVarList_2, STVarList_tail_1, STVarList_tail_2, STExpression_1, STExpression_tail_1, STExpression_tail_2, STExpression_atom_1, STExpression_atom_2, STExpression_atom_3, STExpression_atom_call_1, STExpression_atom_call_2, STConst_1, STConst_2, STConst_3, STConst_4, STType_1, STType_2, STType_3, STType_4, STType_5, STType_6, STType_tail_1, STType_tail_2];

  buildTree = function(nodes) {
    var buildOne;
    nodes = nodes.slice(0);
    buildOne = function() {
      var node, nodeType;
      node = nodes.shift();
      if (!node) {
        return console.log('an error occur');
      }
      switch (node.type) {
        case 'terminal':
          return node.token;
        case 'nonterminal':
          nodeType = classMap[node.rule.id];
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(nodeType, node.rule.right.filter(isNotIpsilon).map(buildOne), function(){});
        case 'error':
          throw new SyntaxError('abort compilng due to syntax errors');
      }
    };
    return buildOne();
  };

  analyze = function(root) {
    var global;
    global = new Scope;
    root.analyze(global);
    return global;
  };

  loadBuiltIn = function(scope) {
    scope.typeDef('print(built-in)', {
      name: 'print(built-in)',
      type: 'function',
      ret: 'INT',
      arg: [
        {
          pos: '#',
          name: '#',
          type: '#'
        }
      ],
      scope: new Scope
    });
    return scope.add('print', 'print(built-in)');
  };

  codegen = function(STNode, scope) {
    var target;
    target = new Target;
    STNode.codegen(scope, target);
    return target;
  };

  window.Semantic = function(nodes) {
    var global, root, target;
    root = buildTree(nodes);
    global = analyze(root);
    loadBuiltIn(global);
    target = codegen(root, global);
    errorCollector.gen(target);
    return target;
  };

  extract = function(field) {
    return function(obj) {
      return obj[field];
    };
  };

  isNotIpsilon = function(x) {
    return x !== 'ε';
  };

  getTypeLength = function(type, scope) {
    var f, length, ref1, ref2, t;
    switch (type) {
      case 'INT':
        return 4;
      case 'FLOAT':
        return 4;
      case 'BOOL':
        return 1;
      case 'STRING':
        return 4;
      case 'CHAR':
        return 1;
      default:
        if (indexOf.call(type, '*') >= 0) {
          ref1 = type.split('*'), f = ref1[0], t = 2 <= ref1.length ? slice.call(ref1, 1) : [];
          length = t.reduce(function(x, y) {
            return x * y;
          });
          return length * getTypeLength(f, scope);
        } else {
          return (ref2 = scope.getType(type).length) != null ? ref2 : 4;
        }
    }
  };

  tempVal = (function() {
    var n;
    n = 0;
    return {
      curr: function() {
        return "t" + n;
      },
      next: function() {
        return "t" + (n++);
      }
    };
  })();

  errorCollector = (function() {
    var errors;
    errors = [];
    return {
      add: function(err) {
        return errors.push(err);
      },
      gen: function(target) {
        var i, j, len, results;
        results = [];
        for (j = 0, len = errors.length; j < len; j++) {
          i = errors[j];
          results.push(target.gen(i));
        }
        return results;
      }
    };
  })();

}).call(this);
