# 设置prettyprint
PR['registerLangHandler'](PR['createSimpleLexer']([],[]),['empty'])

window.start = (code) ->
    a = Lexer code
    tokens = []
    while x = a.getNextToken()
        tokens.push x
    $("#input>pre").text code
    errornum = 0
    tokennum = 0
    outputs = for x in tokens
        if x.type?
            tokennum += 1
            x.format()
        else
            errornum += 1
            """<span class="errormsg">#{x}</span>"""
    outputs.unshift """<span class="compileinfo">词法分析结束，共#{tokennum}个词法单元，#{errornum}处错误</span>"""
    $("#output>pre").html outputs.join('\n')
