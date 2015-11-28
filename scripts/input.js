(function() {
  var readFile;

  readFile = function(file, cb) {
    var reader;
    reader = new FileReader;
    reader.onload = function(e) {
      return cb(e.target.result);
    };
    reader.onerror = function(e) {
      return console.error(e);
    };
    return reader.readAsText(file);
  };

  $(function() {
    var stop;
    stop = function(e) {
      e.stopPropagation();
      return e.preventDefault();
    };
    return $('#input').on('dragenter', stop).on('dragover', stop).on('drop', stop).on('drop', function(e) {
      var file, ref;
      file = (ref = e.dataTransfer.files) != null ? ref[0] : void 0;
      if (file == null) {
        return;
      }
      return readFile(file, function(x) {
        $("#dropbox").remove();
        start(x);
        $("#input>pre").removeClass('prettyprinted');
        $("#output>pre").removeClass('prettyprinted');
        return prettyPrint();
      });
    });
  });

}).call(this);
