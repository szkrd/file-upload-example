// see also: https://github.com/alnorris/file-dialog
// creates a dummy file input, triggers the onchange
// and in the end throws the input away
(function (global) {
  'use strict';

  var fileDialog = function () {
    var args = Array.prototype.slice.call(arguments);
    var input = document.createElement('input');

    // Set config
    if(typeof args[0] === 'object') {
      if(args[0].multiple === true) input.setAttribute('multiple','');
      if(args[0].accept !== undefined) input.setAttribute('accept',args[0].accept);
    }
    input.setAttribute('type', 'file');

    input.style.display = 'none';
    input.setAttribute('id', 'hidden-file');
    document.body.appendChild(input);

    // Return promise/callback
    return new Promise(function (resolve, reject) {
      input.addEventListener('change', function (e) {
          resolve(input.files);
          var lastArg = args[args.length - 1];
          if (typeof lastArg === "function") lastArg(input.files);
      });

      // Simluate click event
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      input.dispatchEvent(evt);

      document.body.removeChild(input);
    })
  };
  global.fileDialog = fileDialog;
})(this);
