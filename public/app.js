document.addEventListener('DOMContentLoaded', function(event) {

  function $ (id) {
    return document.getElementById(id);
  }

  function resetFields () {
    $('response').value = $('metadata').value = $('result').value = '';
  }

  function dumpMetaData (file) {
    var text = JSON.stringify({name: file.name, size: file.size, type: file.type}, null, 2);
    $('metadata').value = text;
  }

  function dumpResponse (resp) {
    resp = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2);
    $('response').value = resp;
  }

  function dumpImmediateResult (result) {
    $('result').value = result;
  }

  // ----

  $('btn-reset').addEventListener('click', resetFields);

  // FORM-DATA
  //-----------
  $('btn-1').addEventListener('click', function () {
    resetFields();
    fileDialog({accept: '.csv'})
      .then(function (files) {
        var file, data;
        file = files[0];
        data = new FormData();
        data.append('file', file);
        data.append('fileName', file.name); // adding extra fields, see usage in server js
        dumpMetaData(file);
        sendRequest('/upload-formdata', dumpResponse, null, 'json', data);
      })
  });

  // FILE READER
  //-------------
  $('btn-2').addEventListener('click', function () {
    resetFields();
    fileDialog({accept: '.csv'})
      .then(function (files) {
        var file, reader;
        file = files[0];
        dumpMetaData(file);
        reader = new FileReader();
        reader.onload = function (e) {
          dumpImmediateResult(reader.result);
          sendRequest('/upload-filereader', dumpResponse, 'json', 'json', {csv: reader.result});
        };
        reader.readAsText(file); // for base64 wrapping use reader.readAsDataURL(file);
      });
  });

});
