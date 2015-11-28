# 设置prettyprint
# PR['registerLangHandler'](PR['createSimpleLexer']([],[]),['empty'])

window.start = (code) ->
    lexer = Lexer code
    tokens = []
    while x = lexer.getNextToken()
        lexer.panic x.panic if x.panic?
        tokens.push x
        break if x.type is '$'
    {input, output} = format code, tokens
    $("#input>pre").html input
    $("#output>pre").html output
    nodes = window.Syntax.analyze tokens
    $("#syntax>pre").html formatTree nodes
    window.Semantic(nodes)

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
        token.id = i
    output = """<span class="compileinfo">词法分析结束，共#{tokennum}个词法单元，#{errornum}处错误\n</span>""" + output
    {input,output}

formatTree = (nodes) ->
    output = ""
    for node in nodes
        output += ('  ' for i in [0...node.level]).join('')
        switch node.type
            when 'terminal'
                output += """<span class="map-#{node.token.id}" onmouseover="activate(#{node.token.id})" onmouseleave="deactivate(#{node.token.id})">#{node.token.type}#{if node.token.value then ':' + node.token.value else ''}</span>\n"""
            when 'nonterminal'
                output += """#{node.rule.left} -> #{node.rule.right.join(' ')}\n"""
            when 'error'
                output += """<span class="error">#{node.content}</span>\n"""
    output

window.activate = (id) ->
    $(".map-#{id}").addClass 'active'

window.deactivate = (id) ->
    $(".map-#{id}").removeClass 'active'

