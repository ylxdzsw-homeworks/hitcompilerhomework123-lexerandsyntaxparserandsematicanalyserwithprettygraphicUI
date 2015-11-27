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
    forEach: -> @symbolTable.forEach.apply @symbolTable, arguments
    typeDef: -> @typeDefs.set.apply @typeDefs, arguments
    getType: -> @typeDefs.get.apply @typeDefs, arguments

class Target
    constructor: ->
        @code = []
    get: (i) ->
        @code[i]
    gen: (a,b,c,d) ->
        @code.push [a,b,c,d]
    nextPos: -> @code.length

class STNode
    constructor: -> throw new Error 'unimplemented!'
    analyze: -> throw new Error 'unimplemented!'
    codegen: -> throw new Error 'unimplemented!'

class STProgram extends STNode
class STDeclaration extends STNode
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

class STProgram_2 extends STProgram
    constructor: ->
    analyze: ->

class STDeclaration_1 extends STDeclaration
    constructor: (@FunctionDef) ->
    analyze: (scope) ->
        @FunctionDef.analyze scope

class STDeclaration_2 extends STDeclaration
    constructor: (@RecordDef) ->
    analyze: (scope) ->
        @RecordDef.analyze scope

class STFunctionDef_1 extends STFunctionDef
    constructor: (@Type, @ID, @SLP, @ArgList, @SRP, @LLP, @Statements, @LRP) ->
    analyze: (scope) ->
        childScope = new Scope scope
        @ArgList.analyze childScope
        args = childScope.allSymbols()
        @Statements.analyze childScope
        scope.typeDef @ID.value,
            name: @ID.value
            type: 'function'
            ret: @Type.value
            arg: args
            scope: childScope

class STRecordDef_1 extends STRecordDef
    constructor: (@ID, @LLP, @Statements, @LRP) ->
    analyze: (scope) ->
        childScope = new Scope scope
        @Statements.analyze childScope
        fields = childScope.allSymbols()
        scope.typeDef @ID.value,
            name: @ID.value
            type: 'record'
            length: fields.map(extract('type')).map(getTypeLength).reduce (x, y) -> x + y
            fields: fields

class STArgList_1 extends STArgList
    constructor: ->
    analyze: ->

class STArgList_2 extends STArgList
    constructor: (@VarDef, @ArgList_tail) ->
    analyze: (scope) ->
        @VarDef.analyze scope
        @ArgList_tail.analyze scope

class STArgList_tail_1 extends STArgList_tail
    constructor: ->
    analyze: ->

class STArgList_tail_2 extends STArgList_tail
    constructor: (@COMMA, @VarDef, @ArgList_tail) ->
    analyze: (scope) ->
        @VarDef.analyze scope
        @ArgList_tail.analyze scope

class STVariable_1 extends STVariable
    constructor: (@ID, @IndexList) ->
    analyze: (scope) ->
        @IndexList.analyze scope

class STIndexList_1 extends STIndexList
    constructor: ->
    analyze: ->

class STIndexList_2 extends STIndexList
    constructor: (@Index, @IndexList) ->
    analyze: (scope) ->
        @Index.analyze scope
        @IndexList.analyze scope

class STIndex_1 extends STIndex
    constructor: (@MLP, @Expression, @MRP) ->
    analyze: (scope) ->
        @Expression.analyze scope

class STVarDef_1 extends STVarDef
    constructor: (@Type, @ID) ->
    analyze: (scope) ->
        @Type.analyze scope
        scope.add @ID.value, @Type.value

class STStatements_1 extends STStatements
    constructor: ->
    analyze: ->

class STStatements_2 extends STStatements
    constructor: (@Statement, @Statements) ->
    analyze: (scope) ->
        @Statement.analyze scope
        @Statements.analyze scope

class STStatement_1 extends STStatement
    constructor: (@LLP, @Statements, @LRP) ->
    analyze: (scope) -> @Statements.analyze scope

class STStatement_2 extends STStatement
    constructor: (@VarDef, @LF) ->
    analyze: (scope) -> @VarDef.analyze scope

class STStatement_3 extends STStatement
    constructor: (@Variable, @Statement_assignorcall) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @Statement_assignorcall.analyze scope

class STStatement_4 extends STStatement
    constructor: (@WHILE, @SLP, @Expression, @SRP, @Statement) ->
    analyze: (scope) ->
        @Expression.analyze scope
        @Statement.analyze scope

class STStatement_5 extends STStatement
    constructor: (@IF, @SLP, @Expression, @SRP, @Statement, @Statement_else) ->
    analyze: (scope) ->
        @Expression.analyze scope
        @Statement.analyze scope
        @Statement_else.analyze scope

class STStatement_6 extends STStatement
    constructor: (@RETURN, @Expression) ->
    analyze: (scope) -> @Expression.analyze scope

class STStatement_else_1 extends STStatement_else
    constructor: ->
    analyze: ->

class STStatement_else_2 extends STStatement_else
    constructor: (@ELSE, @Statement) ->
    analyze: (scope) -> @Statement.analyze scope

class STStatement_assignorcall_1 extends STStatement_assignorcall
    constructor: (@EQ, @Expression, @LF) ->
    analyze: (scope) -> @Expression.analyze scope

class STStatement_assignorcall_2 extends STStatement_assignorcall
    constructor: (@SLP, @VarList, @SRP, @LF) ->
    analyze: (scope) -> @VarList.analyze scope

class STVarList_1 extends STVarList
    constructor: ->
    analyze: ->

class STVarList_2 extends STVarList
    constructor: (@Variable, @VarList_tail) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @VarList_tail.analyze scope

class STVarList_tail_1 extends STVarList_tail
    constructor: ->
    analyze: ->

class STVarList_tail_2 extends STVarList_tail
    constructor: (@COMMA, @Variable, @VarList_tail) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @VarList_tail.analyze scope

class STExpression_1 extends STExpression
    constructor: (@Expression_atom, @Expression_tail) ->
    analyze: (scope) ->
        @Expression_atom.analyze scope
        @Expression_tail.analyze scope

class STExpression_tail_1 extends STExpression_tail
    constructor: ->
    analyze: ->

class STExpression_tail_2 extends STExpression_tail
    constructor: (@OP, @Expression_atom, @Expression_tail) ->
    analyze: (scope) ->
        @Expression_atom.analyze scope
        @Expression_tail.analyze scope

class STExpression_atom_1 extends STExpression_atom
    constructor: (@SLP, @Expression, @SRP) ->
    analyze: (scope) -> @Expression.analyze scope

class STExpression_atom_2 extends STExpression_atom
    constructor: (@Variable, @Expression_atom_call) ->
    analyze: (scope) ->
        @Variable.analyze scope
        @Expression_atom_call.analyze scope

class STExpression_atom_3 extends STExpression_atom
    constructor: (@Const) ->
    analyze: (scope) -> @Const.analyze scope

class STExpression_atom_call_1 extends STExpression_atom_call
    constructor: ->
    analyze: ->

class STExpression_atom_call_2 extends STExpression_atom_call
    constructor: (@SLP, @VarList, @SRP) ->
    analyze: (scope) -> @VarList.analyze scope

class STConst_1 extends STConst
    constructor: (@INTC) ->
    analyze: ->
        @type = 'INT'
        @value = @INTC.value

class STConst_2 extends STConst
    constructor: (@FLOATC) ->
    analyze: ->
        @type = 'FLOAT'
        @value = @FLOATC.value

class STConst_3 extends STConst
    constructor: (@STRINGC) ->
    analyze: ->
        @type = "STRING"
        @value = @STRINGC.value

class STConst_4 extends STConst
    constructor: (@CHARC) ->
    analyze: ->
        @type = 'CHAR'
        @value = @CHARC.value

class STType_1 extends STType
    constructor: (@INT, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['INT', @Type_tail.value...].join '*'

class STType_2 extends STType
    constructor: (@FLOAT, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['FLOAT', @Type_tail.value...].join '*'

class STType_3 extends STType
    constructor: (@BOOL, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['BOOL', @Type_tail.value...].join '*'

class STType_4 extends STType
    constructor: (@STRING, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['STRING', @Type_tail.value...].join '*'

class STType_5 extends STType
    constructor: (@CHAR, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = ['CHAR', @Type_tail.value...].join '*'

class STType_6 extends STType
    constructor: (@RECORD, @ID, @Type_tail) ->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = [@ID.value, @Type_tail.value...].join '*'

class STType_tail_1 extends STType_tail
    constructor: ->
    analyze: -> @value = []

class STType_tail_2 extends STType_tail
    constructor: (@MLP, @INTC, @MRP, @Type_tail)->
    analyze: (scope) ->
        @Type_tail.analyze scope
        @value = [@INTC.value, @Type_tail.value...]

classMap = [ # rule id -> class
    STProgram_1 #1
    STProgram_2 #2
    STDeclaration_1 #3
    STDeclaration_2 #4
    STFunctionDef_1 #5
    STRecordDef_1 #6
    STArgList_1 #7
    STArgList_2 #8
    STArgList_tail_1 #9
    STArgList_tail_2 #10
    STVariable_1 #11
    STIndexList_1 #12
    STIndexList_2 #13
    STIndex_1 #14
    STVarDef_1 #15
    STStatements_1 #16
    STStatements_2 #17
    STStatement_1 #18
    STStatement_2 #19
    STStatement_3 #20
    STStatement_4 #21
    STStatement_5 #22
    STStatement_6 #23
    STStatement_else_1 #24
    STStatement_else_2 #25
    STStatement_assignorcall_1 #26
    STStatement_assignorcall_2 #27
    STVarList_1 #28
    STVarList_2 #29
    STVarList_tail_1 #30
    STVarList_tail_2 #31
    STExpression_1 #32
    STExpression_tail_1 #33
    STExpression_tail_2 #34
    STExpression_atom_1 #35
    STExpression_atom_2 #36
    STExpression_atom_3 #37
    STExpression_atom_call_1 #38
    STExpression_atom_call_2 #39
    STConst_1 #40
    STConst_2 #41
    STConst_3 #42
    STConst_4 #43
    STType_1 #44
    STType_2 #45
    STType_3 #46
    STType_4 #47
    STType_5 #48
    STType_6 #49
    STType_tail_1 #50
    STType_tail_2 #51
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
    console.log global

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

window.Semantic = {
    buildTree,
    analyze
}


# helpers
extract = (field) ->
    (obj) -> obj[field]

isNotIpsilon = (x) ->
    x isnt 'ε'
