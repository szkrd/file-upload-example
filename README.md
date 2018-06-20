File upload example
===================

* Client: IE10, IE11, edge, firefox, chrome
* Server: express, requires node 9+
* Uploads an example csv to express and returns the parsed json response
* Example 1: dynamic input type file and __FormData__
* Example 2: html5 __FileReader__

## Usage

1. `npm i`
2. `npm run dev`
3. open http://localhost:3000/

## Polyfills

The only polyfill needed is a Promise polyfill (bluebird, vendorized
from [here](https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.5.0/bluebird.min.js)).

Opening file dialogs in IE is tricky, while it can be done manually (by inserting
a fake file input and destroying it after use), there's a 
[nice wrapper](https://github.com/alnorris/file-dialog) for that.

The ajax wrapper I use is a modified thousand year
[old wrapper](http://www.quirksmode.org/js/xmlhttp.html) from PPK's
quirksmode. The _setRequestHeader_ part is pretty important, please
[check it out](./public/utils/ajax.js). I'm not setting the content type,
because this way the browser will change it to `multipart/form-data`
and _add boundary automatically_ (more [here](https://github.com/axios/axios/issues/318)).

If you want to use the FormData upload with jQuery, here is an
[old example](https://github.com/szkrd/file-upload-example/blob/master/index.html).
