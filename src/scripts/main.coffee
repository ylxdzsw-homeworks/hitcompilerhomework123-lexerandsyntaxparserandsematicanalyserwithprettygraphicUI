# 设置prettyprint
# PR['registerLangHandler'](PR['createSimpleLexer']([],[]),['empty'])

window.start = (code) ->
    lexer = Lexer code
    tokens = []
    while x = lexer.getNextToken()
        lexer.panic x.panic if x.panic?
        tokens.push x
    {input, output} = format code, tokens
    $("#input>pre").html input
    $("#output>pre").html output

format = (code, tokens) ->
    code = code.split('')
    input = ""
    output = ""
    errornum = 0
    tokennum = 0
    cursor = {line:1, column:0}
    getPos = () -> "#{cursor.line}:#{cursor.column}"
    readUntil = (pos) ->
        result = ""
        until pos == getPos()
            x = code.shift()
            if x is '\n'
                cursor.line += 1;
                cursor.column = 0;
            else if not x?
                throw new Error 'unknown error'
            else
                cursor.column += 1;
            result += x
        result
    for token, i in tokens
        if token.type is "ERROR"
            errornum += 1
            input += """#{readUntil(token.start)}<span class="map-#{i}" onmouseover="activate(#{i})" onmouseleave="deactivate(#{i})">#{readUntil(token.end)}</span>"""
            output += """<span class="map-#{i} errormsg" onmouseover="activate(#{i})" onmouseleave="deactivate(#{i})">#{token.start} #{token.value}</span>\n"""
        else
            tokennum += 1
            input += """#{readUntil(token.start)}<span class="map-#{i}" onmouseover="activate(#{i})" onmouseleave="deactivate(#{i})">#{readUntil(token.end)}</span>"""
            output += """<span class="map-#{i}" onmouseover="activate(#{i})" onmouseleave="deactivate(#{i})"">#{token.format()}</span>\n"""
    output = """<span class="compileinfo">词法分析结束，共#{tokennum}个词法单元，#{errornum}处错误\n</span>""" + output
    {input,output}

window.activate = (id) ->
    $(".map-#{id}").addClass 'active'

window.deactivate = (id) ->
    $(".map-#{id}").removeClass 'active'
