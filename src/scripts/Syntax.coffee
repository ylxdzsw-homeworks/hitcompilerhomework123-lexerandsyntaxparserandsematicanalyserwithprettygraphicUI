rules = symbols = null
do ->
    grammer = """
        Program -> Declaration Program
        Program -> ε
        Declaration -> FunctionDef
        Declaration -> RecordDef
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
        VarDef -> Type Variable
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
        Type -> INT
        Type -> FLOAT
        Type -> BOOL
        Type -> STRING
        Type -> CHAR
        Type -> RECORD ID
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
    stack = ['$', 'Program']
    X = 'Program'
    table = do gen_table
    console.log table
    while X isnt '$'
        console.log X
        if X is ip.type
            ip = tokens.shift()
            stack.pop()
        else if X is 'ε'
            console.warn "fucking ε"
            stack.pop()
        else if isTerminal X
            console.error "unexpected #{X}"
        else if table[X][ip.type]
                console.log table[X][ip.type]
                stack.pop()
                queue = (i for i in table[X][ip.type].right)
                stack.push queue.pop() while queue.length
        else if ip.type is 'LF'
            ip = tokens.shift()
        else if isNullable X
            stack.pop()
        else
            console.error "unexpected #{ip.type}, nedding #{X}"
            break
        X = stack[stack.length-1]
        console.log ip.start

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
