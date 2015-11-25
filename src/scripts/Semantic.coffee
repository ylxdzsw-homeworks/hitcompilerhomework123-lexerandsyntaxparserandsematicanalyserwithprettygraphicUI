class STNode
    constructor: -> throw new Error 'unimplemented!'
    analyse: -> throw new Error 'unimplemented!'
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

class STProgram_1 extends STProgram
    constructor: (@Declaration, @Program) ->
class STProgram_2 extends STProgram
    constructor: ->
class STDeclaration_1 extends STDeclaration
    constructor: (@FunctionDef) ->
class STDeclaration_2 extends STDeclaration
    constructor: (@RecordDef) ->
class STFunctionDef_1 extends STFunctionDef
    constructor: (@Type, @ID, @SLP, @ArgList, @SRP, @LLP, @Statements, @LRP) ->
class STRecordDef_1 extends STRecordDef
    constructor: (@ID, @LLP, @Statements, @LRP) ->
class STArgList_1 extends STArgList
    constructor: ->
class STArgList_2 extends STArgList
    constructor: (@VarDef, @ArgList_tail) ->
class STArgList_tail_1 extends STArgList_tail
    constructor: ->
class STArgList_tail_2 extends STArgList_tail
    constructor: (@COMMA, @VarDef, @ArgList_tail) ->
class STVariable_1 extends STVariable
    constructor: (@ID, @IndexList) ->
class STIndexList_1 extends STIndexList
    constructor: ->
class STIndexList_2 extends STIndexList
    constructor: (@Index, @IndexList) ->
class STIndex_1 extends STIndex
    constructor: (@MLP, @Expression, @MRP) ->
class STVarDef_1 extends STVarDef
    constructor: (@Type, @Variable) ->
class STStatements_1 extends STStatements
    constructor: ->
class STStatements_2 extends STStatements
    constructor: (@Statement, @Statements) ->
class STStatement_1 extends STStatement
    constructor: (@LLP, @Statements, @LRP) ->
class STStatement_2 extends STStatement
    constructor: (@VarDef, @LF) ->
class STStatement_3 extends STStatement
    constructor: (@Variable, @Statement_assignorcall) ->
class STStatement_4 extends STStatement
    constructor: (@WHILE, @SLP, @Expression, @SRP, @Statement) ->
class STStatement_5 extends STStatement
    constructor: (@IF, @SLP, @Expression, @SRP, @Statement, @Statement_else) ->
class STStatement_6 extends STStatement
    constructor: (@RETURN, @Expression) ->
class STStatement_else_1 extends STStatement_else
    constructor: ->
class STStatement_else_2 extends STStatement_else
    constructor: (@ELSE, @Statement) ->
class STStatement_assignorcall_1 extends STStatement_assignorcall
    constructor: (@EQ, @Expression, @LF) ->
class STStatement_assignorcall_2 extends STStatement_assignorcall
    constructor: (@SLP, @VarList, @SRP, @LF) ->
class STVarList_1 extends STVarList
    constructor: ->
class STVarList_2 extends STVarList
    constructor: (@Variable, @VarList_tail) ->
class STVarList_tail_1 extends STVarList_tail
    constructor: ->
class STVarList_tail_2 extends STVarList_tail
    constructor: (@COMMA, @Variable, @VarList_tail) ->
class STExpression_1 extends STExpression
    constructor: (@Expression_atom, @Expression_tail) ->
class STExpression_tail_1 extends STExpression_tail
    constructor: ->
class STExpression_tail_2 extends STExpression_tail
    constructor: (@OP, @Expression_atom, @Expression_tail) ->
class STExpression_atom_1 extends STExpression_atom
    constructor: (@SLP, @Expression, @SRP) ->
class STExpression_atom_2 extends STExpression_atom
    constructor: (@Variable, @Expression_atom_call) ->
class STExpression_atom_3 extends STExpression_atom
    constructor: (@Const) ->
class STExpression_atom_call_1 extends STExpression_atom_call
    constructor: ->
class STExpression_atom_call_2 extends STExpression_atom_call
    constructor: (@SLP, @VarList, @SRP) ->
class STConst_1 extends STConst
    constructor: (@INTC) ->
class STConst_2 extends STConst
    constructor: (@FLOATC) ->
class STConst_3 extends STConst
    constructor: (@STRINGC) ->
class STConst_4 extends STConst
    constructor: (@CHARC) ->
class STType_1 extends STType
    constructor: (@INT) ->
class STType_2 extends STType
    constructor: (@FLOAT) ->
class STType_3 extends STType
    constructor: (@BOOL) ->
class STType_4 extends STType
    constructor: (@STRING) ->
class STType_5 extends STType
    constructor: (@CHAR) ->
class STType_6 extends STType
    constructor: (@RECORD, @ID) ->

classMap = [ # rule id -> class
    STProgram_1
    STProgram_2
    STDeclaration_1
    STDeclaration_2
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
]

buildTree = (nodes) ->
    build = (i) ->
        node = nodes[i]
        switch node.type
            when 'terminal'
                node.token
            when 'nonterminal'
                nodeType = classMap[node.rule.id]
                new nodeType [i+1...i+node.rule.right.length+1].map(build)...
            when 'error'
                throw new SyntaxError 'abort compilng due to syntax errors'
    build 0

window.Semantic = {
    buildTree
}
