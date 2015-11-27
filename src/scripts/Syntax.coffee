rules = symbols = null
do ->
    grammer = """
        Program -> ε
        Program -> FunctionDef Program
        Program -> RecordDef Program
        FunctionDef -> Type ID SLP ArgList SRP LLP Statements LRP
        RecordDef -> ID LLP Statements LRP
        ArgList -> ε
        ArgList -> VarDef ArgList_tail
        ArgList_tail -> ε
        ArgList_tail -> COMMA VarDef ArgList_tail
        Variable -> ID IndexList
        IndexList -> ε
        IndexList -> Index IndexList
        Index -> MLP Expression MRP
        VarDef -> Type ID
        Statements -> ε
        Statements -> Statement Statements
        Statement -> LLP Statements LRP
        Statement -> VarDef LF
        Statement -> Variable Statement_assignorcall
        Statement -> WHILE SLP Expression SRP Statement
        Statement -> IF SLP Expression SRP Statement Statement_else
        Statement -> RETURN Expression
        Statement_else -> ε
        Statement_else -> ELSE Statement
        Statement_assignorcall -> EQ Expression LF
        Statement_assignorcall -> SLP VarList SRP LF
        VarList -> ε
        VarList -> Variable VarList_tail
        VarList_tail -> ε
        VarList_tail -> COMMA Variable VarList_tail
        Expression -> Expression_atom Expression_tail
        Expression_tail -> ε
        Expression_tail -> OP Expression_atom Expression_tail
        Expression_atom -> SLP Expression SRP
        Expression_atom -> Variable Expression_atom_call
        Expression_atom -> Const
        Expression_atom_call -> ε
        Expression_atom_call -> SLP VarList SRP
        Const -> INTC
        Const -> FLOATC
        Const -> STRINGC
        Const -> CHARC
        Type -> INT Type_tail
        Type -> FLOAT Type_tail
        Type -> BOOL Type_tail
        Type -> STRING Type_tail
        Type -> CHAR Type_tail
        Type -> RECORD ID Type_tail
        Type_tail -> ε
        Type_tail -> MLP INTC MRP Type_tail
    """

    rules = for x, i in grammer.split('\n')
        left: x.split('->')[0].trim()
        right: x.split('-> ')[1].split(' ').map (x) -> x.trim()
        id: i

    symbols = new Set
    for i in rules
        symbols.add i.left
        symbols.add j for j in i.right
    symbols.delete 'ε'

calcSelect = ->
    calcFirst = do ->
        cache = {}
        do -> #initialization
            allSeq = _.groupBy rules, (x) -> x.left
            symbols.forEach (i) ->
                if isTerminal i
                    cache[i] = [i]
                else
                    cache[i] = if 'ε' in _.chain(allSeq[i]).pluck('right').flatten().value() then ['ε'] else []
            flag = true
            while flag
                flag = false
                for rule in rules
                    {left, right} = rule
                    counter = 0
                    for i in right
                        continue if i is 'ε'
                        for t in cache[i]
                            if t isnt 'ε' and t not in cache[left]
                                cache[left].push t
                                flag = true
                        break if 'ε' not in cache[i]
                        counter += 1
                    if counter is right.length and 'ε' not in cache[left]
                        cache[left].push 'ε'
                        flag = true
        (x) ->
            return cache[x] if cache[x]?
            return ['ε'] if not x.length or x is 'ε'
            l = x.split('-')
            result = []
            flag = true
            for i in l
                for j in calcFirst i
                    result.push j if j isnt 'ε'
                if 'ε' not in calcFirst i
                    flag = false
                    break
            result.push 'ε' if flag
            cache[x] = result

    calcFollow = do ->
        cache = {}
        do -> #initialization
            allSeq = _.groupBy rules, (x) -> x.left
            (cache[rule.left] = [] for rule in rules when not cache[rule.left])
            cache['Program'] = ['$']

            flag = true
            while flag
                flag = false
                for rule in rules
                    {left, right} = rule
                    for i in [right.length-1..0]
                        continue if right[i] is 'ε' or isTerminal right[i]
                        beta = right[i+1..].join('-')
                        for x in calcFirst beta
                            if x is 'ε'
                                for x in cache[left]
                                    if x not in cache[right[i]]
                                        cache[right[i]].push x
                                        flag = true
                            else
                                if x not in cache[right[i]] and x isnt 'ε'
                                    cache[right[i]].push x
                                    flag = true
                        break if i + 1 < right.length and 'ε' not in calcFirst right[i+1]
        (x) ->
            return cache[x] if cache[x]?
            throw new Error "TODO"

    window.calcFirst = calcFirst
    window.calcFollow = calcFollow

    for i in rules
        if 'ε' not in calcFirst i.right.join('-')
            i.select = calcFirst i.right.join('-')
        else
            i.select = calcFirst i.right.join('-')
            i.select = _(i.select).without 'ε'
            i.select.push x for x in calcFollow i.left

checkLL1 = -> throw new Error "TODO"

gen_table = ->
    table = {}
    for rule in rules
        table[rule.left] = {} if not table[rule.left]
        for i in rule.select
            table[rule.left][i] = rule
    table

analyze = (tokens) ->
    ip = tokens.shift()
    stack = [{type:'$',level:-1}, {type:'Program',level:0}]
    X = stack[stack.length-1]
    result = []
    table = do gen_table
    while X.type isnt '$'
        if X.type is ip.type
            result.push
                type: 'terminal'
                token: ip
                level: X.level
            ip = tokens.shift()
            stack.pop()
        else if X.type is 'ε'
            stack.pop()
        else if isTerminal X.type
            result.push
                type:'error'
                content: "unexpected #{X.type}"
                level: X.level
            stack.pop()
        else if table[X.type][ip.type]
            rule = table[X.type][ip.type]
            result.push
                type: 'nonterminal'
                rule: rule
                level: X.level
            stack.pop()
            queue = (i for i in rule.right)
            stack.push {type:queue.pop(), level:X.level+1} while queue.length
        else if ip.type is 'LF'
            ip = tokens.shift()
        else if isNullable X.type
            result.push
                type: 'nonterminal'
                rule: _.find rules, (x) -> x.left is X.type and 'ε' in x.right
                level: X.level
            stack.pop()
        else
            result.push
                type:'error'
                content: "unexpected #{ip.type}, needing #{X.type}"
                level: X.level
            stack.pop()
        X = stack[stack.length-1]
    result

isTerminal = (x) ->
    x is x.toUpperCase() and x isnt 'ε'

isNullable = do ->
    cache = {}
    (x) ->
        return cache[x] if cache[x]
        cache[x] = rules
            .filter (rule) -> rule.left is x
            .filter (rule) -> 'ε' in rule.right
            .length

window.Syntax = {
    rules,
    symbols,
    analyze,
    isNullable
}

do calcSelect
