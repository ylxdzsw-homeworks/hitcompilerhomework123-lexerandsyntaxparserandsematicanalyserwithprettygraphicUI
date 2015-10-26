Token           = (type, value) -> {type,value}
FAState         = (type, value) -> {type,value}
NFA             = (state, move) -> {state,move}
DFA             = (state, moveTable, moveHash) -> {state,moveTable,moveHash}

inputs          = {}
inputs.letter   = "abcdefghijklmnopqrstuvwxyz"
inputs.letter  += inputs.letter.toUpperCase()
inputs.number   = "0123456789"
inputs.symbol   = "+-*/&|_<>=!,()[]{}.'\""
inputs.other    = "\n\t "
inputs.all      = inputs.letter + inputs.number + inputs.symbol + inputs.other

NFAStates =
    start: FAState null
    s1: FAState "ID|KEY|BOOL", yes
    s2: FAState "EQ", no
    s3: FAState "LF", no
    s4: FAState "MLP", no
    s5: FAState "MRP", no
    s6: FAState "STRING", yes
    s7: FAState "CHAR", yes
    s8: FAState "INT", yes
    s9: FAState "FLOAT", yes
    s10: FAState "OP", yes
    s11: FAState "COMMENT", yes
    s12: FAState "SLP", no
    s13: FAState "SRP", no
    s14: FAState "COMMA", no
    s15: FAState "LLP", no
    s16: FAState "LRP", no
    n1: FAState null
    n2: FAState null
    n3: FAState null
    n4: FAState null
    n5: FAState null
    n6: FAState null
    n7: FAState null
    n8: FAState null
    n9: FAState null
    n10: FAState null
    n11: FAState null
    n12: FAState null
    n13: FAState null

NFAMoves = [
    {tail: "start" , head: "s1"  , input: '_'+inputs.letter},
    {tail: "s1"    , head: "s1"  , input: '_'+inputs.letter+inputs.number},
    {tail: "start" , head: "s2"  , input: "="},
    {tail: "start" , head: "s3"  , input: "\n"},
    {tail: "start" , head: "s4"  , input: "["},
    {tail: "start" , head: "s5"  , input: "]"},
    {tail: "start" , head: "n11" , input: "\""},
    {tail: "n11"   , head: "n11" , input: _(inputs.all).without("\"","\n")},
    {tail: "n11"   , head: "s6"  , input: "\""},
    {tail: "start" , head: "n12" , input: "'"},
    {tail: "n12"   , head: "n13" , input: _(inputs.all).without("'","\n")},
    {tail: "n13"   , head: "s7"  , input: "'"},
    {tail: "start" , head: "n1"  , input: inputs.number},
    {tail: "n1"    , head: "n1"  , input: inputs.number},
    {tail: "n1"    , head: "s8"  , input: "ε"},
    {tail: "n1"    , head: "n2"  , input: "eE"},
    {tail: "n2"    , head: "s8"  , input: inputs.number},
    {tail: "s8"    , head: "s8"  , input: inputs.number},
    {tail: "n1"    , head: "n3"  , input: "."},
    {tail: "n3"    , head: "n4"  , input: inputs.number},
    {tail: "n4"    , head: "n4"  , input: inputs.number},
    {tail: "n4"    , head: "s9"  , input: "ε"},
    {tail: "n4"    , head: "n5"  , input: "eE"},
    {tail: "n5"    , head: "n6"  , input: "-"},
    {tail: "n5"    , head: "s9"  , input: inputs.number},
    {tail: "n6"    , head: "s9"  , input: inputs.number},
    {tail: "s9"    , head: "s9"  , input: inputs.number},
    {tail: "start" , head: "n7"  , input: "!<>"},
    {tail: "n7"    , head: "s10" , input: "=ε"},
    {tail: "s2"    , head: "s10" , input: "="},
    {tail: "start" , head: "s10" , input: "+-*&|"},
    {tail: "start" , head: "n8"  , input: "/"},
    {tail: "n8"    , head: "s10" , input: "ε"},
    {tail: "n8"    , head: "n9"  , input: "*"},
    {tail: "n9"    , head: "n9"  , input: _(inputs.all).without("*")},
    {tail: "n9"    , head: "n10" , input: "*"},
    {tail: "n10"   , head: "n9"  , input: _(inputs.all).without("/")},
    {tail: "n10"   , head: "s11" , input: "/"},
    {tail: "start" , head: "s12" , input: "("},
    {tail: "start" , head: "s13" , input: ")"},
    {tail: "start" , head: "s14" , input: ","},
    {tail: "start" , head: "s15" , input: "{"},
    {tail: "start" , head: "s16" , input: "}"},
    # special hack //这个方法会导致token的value前面有空格，不行
    {tail: "start" , head: "start", input: " \t"},
    # error handling
]

NFAtoDFA = (NFA) ->
    calcEpsilonClosureT = (T) ->
        epsilonClosure = []
        calcEpsilonClosureS = (t) ->
            epsilonClosure.push t
            calcEpsilonClosureS u for u in (i.head for i in NFA.move when i.tail is t and 'ε' in i.input) when u not in epsilonClosure
            null
        calcEpsilonClosureS t for t in T.split('-')
        _(epsilonClosure.sort()).uniq(true).join('-')
    Dstates = [calcEpsilonClosureT('start')]
    Dmove = []
    DFAMoveHash = {}
    DFAStates = []
    unFind = [0]
    while unFind.length
        T = Dstates[unFind.pop()]
        for i in inputs.all
            U = calcEpsilonClosureT _((x.head for x in NFA.move when x.tail in T.split('-') and i in x.input).sort()).uniq(true).join('-')
            continue if not U.length
            if U not in Dstates
                unFind.push Dstates.length
                Dstates.push U
            Dmove.push
                tail: T
                head: U
                input: i
    # 建立DFAMoveHash方便后续使用
    for i in Dmove
        DFAMoveHash[i.tail] ?= {}
        DFAMoveHash[i.tail][i.input] = i.head
    # 合并input简化Dmove
    Dmove = for k,v of _(Dmove).groupBy((x) -> return "#{x.tail}+#{x.head}")
        tail: v[0].tail
        head: v[0].head
        input: (i.input for i in v).join('')
    # 构造DFAStates
    for i in Dstates
        x = (NFAStates[j] for j in i.split('-') when NFAStates[j].type?)
        switch x.length
            when 0
                DFAStates[i] = FAState null
            when 1
                DFAStates[i] = FAState x[0].type, x[0].value
            else
                throw new Error "可能有多种结果，请检查词法"
    DFA(DFAStates, Dmove, DFAMoveHash)

DFA = NFAtoDFA NFA NFAStates, NFAMoves

window.Lexer = (code) ->
    code = code.split('')
    panic = () ->
    getNextToken: () ->
        val = ""
        state = 'start'
        while i = code[0]
            nextState = DFA.moveHash[state]?[i]
            if nextState?
                return DFA.state[nextState].value if DFA.state[nextState].type is 'ERROR'
                val += code.shift()
                state = nextState
            else if type = DFA.state[state].type
                return Token type, if DFA.state[state].value then val else null
            else
                if i in inputs.all
                    code.shift() if state is 'start'
                    return "unexpected symbol '#{i}'"
                else
                    code.shift()
                    return "unrecognized symbol '#{i}'"
        if type = DFA.state[state].type
            Token type, if DFA.state[state].value then val else null
        else if state is 'start'
            null
        else
            "early EOF"
