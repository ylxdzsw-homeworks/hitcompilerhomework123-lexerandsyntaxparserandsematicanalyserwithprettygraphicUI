# 设置prettyprint
PR['registerLangHandler'](PR['createSimpleLexer']([],[]),['empty'])

window.start = (code) ->
    a = Lexer code
    tokens = []
    while x = a.getNextToken()
        tokens.push x
    $("#input>pre").text code
    $("#output>pre").text tokens.join()
