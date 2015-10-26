Token           = (type, value) -> {type,value}
NFAState        = (type, hasValue) -> {type,hasValue}
DFAState        = (type, hasValue) -> {type,hasValue}
NFA             = (state, move) -> {state,move}
DFA             = (state, move) -> {state,move}

inputs          = {}
inputs.letter   = "abcdefghijklmnopqrstuvwxyz"
inputs.letter  += inputs.letter.toUpperCase()
inputs.number   = "0123456789"
inputs.symbol   = "+-*/&|_<>=!,()[]{}."
inputs.other    = "\n"
inputs.all      = inputs.letter + inputs.number + inputs.symbol + inputs.other

NFAStates =
	start: NFAState null
	s1: NFAState "ID|KEY|BOOL", yes
	s2: NFAState "EQ", no
	s3: NFAState "LF", no
	s4: NFAState "MLP", no
	s5: NFAState "MRP", no
	s6: NFAState "STRING", yes
	s7: NFAState "CHAR", yes
	s8: NFAState "INT", yes
	s9: NFAState "FLOAT", yes
	s10: NFAState "OP", yes
	s11: NFAState "COMMENT", yes
	s12: NFAState "SLP", no
	s13: NFAState "SRP", no
	s14: NFAState "COMMA", no
	s15: NFAState "LLP", no
	s16: NFAState "LRP", no
	n1: NFAState null
	n2: NFAState null
	n3: NFAState null
	n4: NFAState null
	n5: NFAState null
	n6: NFAState null
	n7: NFAState null
	n8: NFAState null
	n9: NFAState null
	n10: NFAState null
	n11: NFAState null
	n12: NFAState null
	n13: NFAState null

DFAStates = {}

NFAMoves = [
	{tail: "start" , head: "s1"  , input: '_'+inputs.letter},
	{tail: "s1"    , head: "s1"  , input: '_'+inputs.letter+inputs.number},
	{tail: "start" , head: "s2"  , input: "="},
	{tail: "start" , head: "s3"  , input: "\n"},
	{tail: "start" , head: "s4"  , input: "["},
	{tail: "start" , head: "s5"  , input: "]"},
	{tail: "start" , head: "n11" , input: "\""},
	{tail: "n11"   , head: "n11" , input: _(inputs.all).without("\"\n")},
	{tail: "n11"   , head: "s6"  , input: "\""},
	{tail: "start" , head: "n12" , input: "'"},
	{tail: "n12"   , head: "n13" , input: _(inputs.all).without("'\n")},
	{tail: "n13"   , head: "s7"  , input: "'"},
	{tail: "start" , head: "n1"  , input: _(inputs.number).without("0")},
	{tail: "n1"    , head: "n1"  , input: inputs.number},
	{tail: "n1"    , head: "s8"  , input: "ε"},
	{tail: "n1"    , head: "n2"  , input: "eE"},
	{tail: "n2"    , head: "s8"  , input: _(inputs.number).without("0")},
	{tail: "s8"    , head: "s8"  , input: inputs.number},
	{tail: "n1"    , head: "n3"  , input: "."},
	{tail: "n3"    , head: "n4"  , input: _(inputs.number).without("0")},
	{tail: "n4"    , head: "n4"  , input: inputs.number},
	{tail: "n4"    , head: "s9"  , input: "ε"},
	{tail: "n4"    , head: "n5"  , input: "eE"},
	{tail: "n5"    , head: "n6"  , input: "-"},
	{tail: "n5"    , head: "s9"  , input: _(inputs.number).without("0")},
	{tail: "n6"    , head: "s9"  , input: _(inputs.number).without("0")},
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
		 		DFAStates[i] = DFAState null
		 	when 1
		 		DFAStates[i] = DFAState x[0].type, x[0].hasValue
		 	else
		 		throw new Error "可能有多种结果，请检查词法" 
	DFA(Dstates, Dmove)

console.log NFAtoDFA NFA NFAStates, NFAMoves
console.log DFAStates