readFile = (file, cb) ->
    reader = new FileReader
    reader.onload = (e) -> cb e.target.result
    reader.onerror = (e) -> console.error e

    reader.readAsText file

$ ->
    stop = (e) ->
        e.stopPropagation()
        e.preventDefault()

    $('#input')
        .on 'dragenter', stop
        .on 'dragover', stop
        .on 'drop', stop
        .on 'drop', (e) ->
            file = e.dataTransfer.files?[0]
            return if not file?
            readFile file, (x) ->
                $("#dropbox").remove()

                start x

                $("#input>pre").removeClass 'prettyprinted'
                $("#output>pre").removeClass 'prettyprinted'
                prettyPrint()

