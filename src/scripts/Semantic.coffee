class Scope
    constructor: (@father) ->
        @symbolTable = new Map
        @typeDefs = @father?.typeDefs ? new Map # always use global's typeDefs
        @pos = 0
    find: (symbol) -> @symbolTable.get(symbol) ? @father?.find(symbol)
    has: (symbol, rec=true) ->
        if rec
            @find(symbol)?
        else
            @symbolTable.has(symbol)
    add: (symbol, type) ->
        @symbolTable.set symbol,
            pos: @pos
            name: symbol
            type: type
        @pos += getTypeLength type
    allSymbols: -> Array.from @symbolTable.values()
    getLength: -> @allSymbols().map(extract('type')).map(getTypeLength).reduce (x, y) -> x + y
    forEach: -> @symbolTable.forEach.apply @symbolTable, arguments
    typeDef: -> @typeDefs.set.apply @typeDefs, arguments
    getType: -> @typeDefs.get.apply @typeDefs, arguments

class Target
    constructor: -> @code = []
    get: (i) -> @code[i]
    gen: (a,b,c,d,e) -> @code.push [a,b,c,d,e]
    nextPos: -> @code.length
    format: (formatter) -> formatter line,a,b,c,d,e for [a,b,c,d,e], line in @code

class STNode
    constructor: -> throw new Error 'unimplemented!'
    analyze: -> throw new Error 'unimplemented!'
    codegen: -> throw new Error 'unimplemented!'

class STProgram extends STNode
class STFunctionDef extends STNode
class STRecordDef extends STNode
class STArgList extends STNode
class STArgList_tail extends STNode
class STVariable extends STNode
class STIndexList extends STNode
class STIndex extends STNode
class STVarDef extends STNode
class STStatements extends STNode
class STStatement extends STNode
class STStatement_else extends STNode
class STStatement_assignorcall extends STNode
class STVarList extends STNode
class STVarList_tail extends STNode
class STExpression extends STNode
class STExpression_tail extends STNode
class STExpression_atom extends STNode
class STExpression_atom_call extends STNode
class STConst extends STNode
class STType extends STNode
class STType_tail extends STNode

class STProgram_1 extends STProgram
    constructor: (@Declaration, @Program) ->
    analyze: (scope) ->
        @Declaration.analyze scope
        @Program.analyze scope
    codegen: (scope, target) ->
        @Declaration.codegen scope, target
        @Program.codegen scope, target

class STProgram_2 extends STProgram
    constructor: (@FunctionDef) ->
    analyze: (scope) ->
        @FunctionDef.analyze scope
    codegen: (scope, target) ->
        @FunctionDef.codegen scope, target

class STProgram_3 extends STProgram
    constructor: (@RecordDef) ->
    analyze: (scope) ->
        @RecordDef.analyze scope
    codegen: (scope, target) ->
        @RecordDef.codegen scope, target

class STFunctionDef_1 extends STFunctionDef
    constructor: (@Type, @ID, @SLP, @ArgList, @SRP, @LLP, @Statements, @LRP) ->
    analyze: (scope) ->
        argScope = new Scope scope
        ChildScope = new Scope scope
        @ArgList.analyze argScope
        args = argScope.allSymbols()
        @Statements.analyze childScope
        scope.typeDef @ID.value,
            name: @ID.value
            type: 'function'
            ret: @Type.value
            arg: args
            scope: childScope
    codegen: (scope, target) ->
        funcInfo = scope.getType @ID.value
        funcInfo.pos = do target.nextPos
        @Statements.codegen funcInfo.scope, target

class STRecordDef_1 extends STRecordDef
    constructor: (@ID, @LLP, @Statements, @LRP) ->
    analyze: (scope) ->
        childScope = new Scope scope
        @Statements.analyze childScope
        scope.typeDef @ID.value,
            name: @ID.value
            type: 'record'
            length: childScope.getLength()
            fields: childScope.allSymbols()
    codegen: ->

class STArgList_1 extends STArgList
    constructor: ->
    analyze: ->
    codegen: ->

class STArgList_2 extends STArgList
    constructor: (@VarDef, @ArgList_tail) ->
    analyze: (scope) ->
        @VarDef.analyze scope
        @ArgList_tail.analyze scope
    codegen: ->

class STArgList_tail_1 extends STArgList_tail
    constructor: ->
    analyze: ->
    codegen: ->

class STArgList_tail_2 extends STArgList_tail
    constructor: (@COMMA, @VarDef, @ArgList_tail) ->
    analyze: (scope) ->
        @VarDef.analyze scope
        @ArgList_tail.analyze scope
    codegen: ->

class STVariable_1 extends STVariable
    constructor: (@ID, @IndexList) ->
    analyze: (scope) ->
        dimList = scope.find(@ID.value).type.split('*')
        dimList.push getTypeLength dimList.shift()
        @IndexList.analyze scope, dimList
    codegen: (scope, target) ->
        symbol = scope.find @ID.value
        @IndexList.codegen scope, target
        if ref = @IndexList.value
            target.gen tempVal.get(), '=', "#{symbol.name}[#{ref}]:#{symbol.pos+ref}"
            @value = tempVal.next()
        else
            @value = "#{symbol.name}:#{symbol.pos}"


class STIndexList_1 extends STIndexList
    constructor: ->
    analyze: -> @distence = 1
    codegen: ->

class STIndexList_2 extends STIndexList
    constructor: (@Index, @IndexList) ->
    analyze: (scope, dimList) ->
        @Index.analyze scope
        @IndexList.analyze scope dimList
        @distence = dimList.pop() * @IndexList.distence
        throw new Error 'fucked134u12' if not dimList.length
    codegen: (scope, target) ->
        @IndexList.codegen scope, target
        @Index.codegen scope, target
        target.gen tempVal.get(), '=', @Index.value, '*', @distence
        if ref = @IndexList.value
            temp = tempVal.next()
            target.gen tempVal.get(), '=', temp, '+', ref
        @value = tempVal.next()

class STIndex_1 extends STIndex
    constructor: (@MLP, @Expression, @MRP) ->
    analyze: (scope) ->
        @Expression.analyze scope
    codegen: (scope, target) ->
        @Expression.codegen scope, target
        @value = @Expression.value

class STVarDef_1 extends STVarDef
    constructor: (@Type, @ID) ->
    analyze: (scope) ->
        @Type.analyze scope
        scope.add @ID.value, @Type.value
    codegen: ->

class STStatements_1 extends STStatements
    constructor: ->
    analyze: ->
    codegen: ->

class STStatements_2 extends STStatements
    constructor: (@Statement, @Statements) ->
    analyze: (scope) ->
        @Statement.analyze scope
        @Statements.analyze scope
    codegen: (scope, target) ->
        @Statement.codegen scope, target
        @Statements.codegen scope, target

class STStatement_1 extends STStatement
    constructor: (@LLP, @Statements, @LRP) ->
    analyze: (scope) -> @Statements.analyze scope
    codegen: (scope, target) -> @Statements.codegen scope, target

class STStatement_2 extends STStatement
    constructor: (@VarDef, @LF) ->
    analyze: (scope) -> @VarDef.analyze scope
    codegen: ->

class STStatement_3 extends STStatement
    constructor: (@Variable, @Statement_assignorcall) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @Statement_assignorcall.analyze scope
    codegen: (scope, target) ->
        @Variable.codegen scope, target
        @Statement_assignorcall.codegen scope, target, @Variable.value

class STStatement_4 extends STStatement
    constructor: (@WHILE, @SLP, @Expression, @SRP, @Statement) ->
    analyze: (scope) ->
        @Expression.analyze scope
        @Statement.analyze scope
    codegen: (scope, target) ->
        pos1 = target.nextPos()
        @Expression.codegen scope, target
        pos2 = target.nextPos()
        target.gen 'if', @Expression.value, 'goto', null
        @Statement.codegen scope, target
        target.gen 'goto', pos1
        pos3 = target.nextPos()
        target.get(pos2)[3] = pos3

class STStatement_5 extends STStatement
    constructor: (@IF, @SLP, @Expression, @SRP, @Statement, @Statement_else) ->
    analyze: (scope) ->
        @Expression.analyze scope
        @Statement.analyze scope
        @Statement_else.analyze scope
    codegen: (scope, target) ->
        @Expression.codegen scope, target
        pos1 = target.nextPos()
        target.gen 'if', @Expression.value, 'goto', null
        @Statement_else.codegen scope, target
        pos2 = target.nextPos()
        target.gen 'goto', null
        @Statement.codegen scope, target
        pos3 = target.nextPos()
        target.get(pos1)[3] = pos2 + 1
        target.get(pos2)[1] = pos3

class STStatement_6 extends STStatement
    constructor: (@RETURN, @Expression) ->
    analyze: (scope) -> @Expression.analyze scope

class STStatement_else_1 extends STStatement_else
    constructor: ->
    analyze: ->
    codegen: ->

class STStatement_else_2 extends STStatement_else
    constructor: (@ELSE, @Statement) ->
    analyze: (scope) -> @Statement.analyze scope
    codegen: (scope, target) -> @Statement.codegen scope, target

class STStatement_assignorcall_1 extends STStatement_assignorcall
    constructor: (@EQ, @Expression, @LF) ->
    analyze: (scope) -> @Expression.analyze scope
    codegen: (scope, target, name) ->
        @Expression.codegen scope, target
        left = scope.find name
        target.gen "#{left.name}:#{left.pos}", '=', @Expression.value

class STStatement_assignorcall_2 extends STStatement_assignorcall
    constructor: (@SLP, @VarList, @SRP, @LF) ->
    analyze: (scope) -> @VarList.analyze scope
    codegen: (scope, target, name) ->
        @VarList.codegen scope, target
        lambda = scope.getType scope.find(name).type
        if @VarList.value
            target.gen 'goto', "pc+#{@VarList.value.length+1}"
            target.gen 'param', param for param in @VarList.value
        target.gen 'call', lambda.name, @VarList.value.length ? 0

class STVarList_1 extends STVarList
    constructor: ->
    analyze: ->
    codegen: -> @value = []

class STVarList_2 extends STVarList
    constructor: (@Variable, @VarList_tail) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @VarList_tail.analyze scope
    codegen: (scope, target) ->
        @Variable.codegen scope, target
        @VarList_tail.codegen scope, target
        @value = [@Variable.value, @VarList_tail.value...]

class STVarList_tail_1 extends STVarList_tail
    constructor: ->
    analyze: ->
    codegen: -> @value = []

class STVarList_tail_2 extends STVarList_tail
    constructor: (@COMMA, @Variable, @VarList_tail) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @VarList_tail.analyze scope
    codegen: (scope, target) ->
        @Variable.codegen scope, target
        @VarList_tail.codegen scope, target
        @value = [@Variable.value, @VarList_tail.value...]

class STExpression_1 extends STExpression
    constructor: (@Expression_atom, @Expression_tail) ->
    analyze: (scope) ->
        @Expression_atom.analyze scope
        @Expression_tail.analyze scope
    codegen: (scope, target) ->
        @Expression_atom.codegen scope, target
        @Expression_tail.codegen scope, target, @Expression_atom.value
        @value = @Expression_tail.value

class STExpression_tail_1 extends STExpression_tail
    constructor: ->
    analyze: ->
    codegen: (scope, target, left) -> @value = left

class STExpression_tail_2 extends STExpression_tail
    constructor: (@OP, @Expression_atom, @Expression_tail) ->
    analyze: (scope) ->
        @Expression_atom.analyze scope
        @Expression_tail.analyze scope
    codegen: (scope, target, left) ->
        @Expression_atom.codegen scope, target
        target.gen tempVal.get(), '=', left, @OP.value, @Expression_atom.value
        @Expression_tail.codegen scope, target, tempVal.next()
        @value = @Expression_tail.value

class STExpression_atom_1 extends STExpression_atom
    constructor: (@SLP, @Expression, @SRP) ->
    analyze: (scope) -> @Expression.analyze scope
    codegen: (scope, target) ->
        @Expression.codegen scope, target
        @value = @Expression.value

class STExpression_atom_2 extends STExpression_atom
    constructor: (@Variable, @Expression_atom_call) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @Expression_atom_call.analyze scope
    codegen: (scope, target) ->
        @Variable.codegen scope, target
        @Expression_atom_call.codegen scope, target, @Variable.value
        @value = @Expression_atom_call.value

class STExpression_atom_3 extends STExpression_atom
    constructor: (@Const) ->
    analyze: (scope) -> @Const.analyze scope
    codegen: (scope, target) ->
        @Const.codegen scope, target
        @value = @Const.value

class STExpression_atom_call_1 extends STExpression_atom_call
    constructor: ->
    analyze: ->
    codegen: (scope, target, left) -> @value = left

class STExpression_atom_call_2 extends STExpression_atom_call
    constructor: (@SLP, @VarList, @SRP) ->
    analyze: (scope) -> @VarList.analyze scope
    codegen: (scope, target, name) ->
        @VarList.codegen scope, target
        lambda = scope.getType scope.find(name).type
        if @VarList.value
            target.gen 'goto', "pc+#{@VarList.value.length+1}"
            target.gen tempVal.get(), '=', 'param', param for param in @VarList.value
        target.gen 'call', lambda.name, @VarList.value.length ? 0
        @value = tempVal.next()

class STConst_1 extends STConst
    constructor: (@INTC) ->
    analyze: ->
        @type = 'INT'
        @value = @INTC.value
    codegen: -> @value = @INTC.value

class STConst_2 extends STConst
    constructor: (@FLOATC) ->
    analyze: ->
        @type = 'FLOAT'
        @value = @FLOATC.value
    codegen: -> @value = @FLOATC.value

class STConst_3 extends STConst
    constructor: (@STRINGC) ->
    analyze: ->
        @type = "STRING"
        @value = @STRINGC.value
    codegen: -> @value = @STRINGC.value

class STConst_4 extends STConst
    constructor: (@CHARC) ->
    analyze: ->
        @type = 'CHAR'
        @value = @CHARC.value
    codegen: -> @value = @CHARC.value

class STType_1 extends STType
    constructor: (@INT, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['INT', @Type_tail.value...].join '*'
    codegen: ->

class STType_2 extends STType
    constructor: (@FLOAT, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['FLOAT', @Type_tail.value...].join '*'
    codegen: ->

class STType_3 extends STType
    constructor: (@BOOL, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['BOOL', @Type_tail.value...].join '*'
    codegen: ->

class STType_4 extends STType
    constructor: (@STRING, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['STRING', @Type_tail.value...].join '*'
    codegen: ->

class STType_5 extends STType
    constructor: (@CHAR, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['CHAR', @Type_tail.value...].join '*'
    codegen: ->

class STType_6 extends STType
    constructor: (@RECORD, @ID, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = [@ID.value, @Type_tail.value...].join '*'
    codegen: ->

class STType_tail_1 extends STType_tail
    constructor: ->
    analyze: -> @value = []
    codegen: ->

class STType_tail_2 extends STType_tail
    constructor: (@MLP, @INTC, @MRP, @Type_tail)->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = [@INTC.value, @Type_tail.value...]
    codegen: ->

classMap = [ # rule id -> class
    STProgram_1
    STProgram_2
    STProgram_3
    STFunctionDef_1
    STRecordDef_1
    STArgList_1
    STArgList_2
    STArgList_tail_1
    STArgList_tail_2
    STVariable_1
    STIndexList_1
    STIndexList_2
    STIndex_1
    STVarDef_1
    STStatements_1
    STStatements_2
    STStatement_1
    STStatement_2
    STStatement_3
    STStatement_4
    STStatement_5
    STStatement_6
    STStatement_else_1
    STStatement_else_2
    STStatement_assignorcall_1
    STStatement_assignorcall_2
    STVarList_1
    STVarList_2
    STVarList_tail_1
    STVarList_tail_2
    STExpression_1
    STExpression_tail_1
    STExpression_tail_2
    STExpression_atom_1
    STExpression_atom_2
    STExpression_atom_3
    STExpression_atom_call_1
    STExpression_atom_call_2
    STConst_1
    STConst_2
    STConst_3
    STConst_4
    STType_1
    STType_2
    STType_3
    STType_4
    STType_5
    STType_6
    STType_tail_1
    STType_tail_2
]

buildTree = (nodes) ->
    nodes = nodes[...]
    buildOne = ->
        node = do nodes.shift
        return if not node
        switch node.type
            when 'terminal'
                node.token
            when 'nonterminal'
                nodeType = classMap[node.rule.id]
                new nodeType node.rule.right.filter(isNotIpsilon).map(buildOne)...
            when 'error'
                throw new SyntaxError 'abort compilng due to syntax errors'
    do buildOne

analyze = (root) ->
    global = new Scope
    root.analyze global
    global

codegen = (STNode, scope) ->
    target = new Target
    STNode.codegen scope, target
    target

window.Semantic = {
    buildTree,
    analyze,
    codegen
}

window.test = ->
    root = buildTree(nodes)
    global = analyze(root)
    codegen(root, global)

# helpers
extract = (field) ->
    (obj) -> obj[field]

isNotIpsilon = (x) ->
    x isnt 'ε'

getTypeLength = (type, scope) ->
    switch type
        when 'INT'
            4
        when 'FLOAT'
            4
        when 'BOOL'
            1
        when 'STRING'
            4
        when 'CHAR'
            1
        else
            if '*' in type # Array
                [f,t...] = type.split '*'
                length = t.reduce (x, y) -> x * y
                length * getTypeLength f
            else # Record or Function
                scope.getType(type).length ? 4

tempVal = do ->
    n = 0
    curr: -> "t#{n}"
    next: -> "t#{n++}"
