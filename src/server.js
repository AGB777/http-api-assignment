// import required modules
const http = require('http');
const url = require('url');

// response handling scripts
const htmlHandler = require('./htmlResponses.js');
const dataHandler = require('./dataResponses.js');

// find my port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const knownUrls = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyle,
  '/success': dataHandler.goodRequest,
  '/badRequest': dataHandler.questionableRequest,
  '/unauthorized': dataHandler.restrictedAccess,
  '/forbidden': dataHandler.cursed,
  '/internal': dataHandler.mybad,
  '/notImplemented': dataHandler.future,
  unknown: dataHandler.notFound,
};

const onRequest = (request, response) => {
  const reqUrl = url.parse(request.url);
  console.log(reqUrl.pathname);

  const acceptable = request.headers.accept.split(',');

  if (knownUrls[reqUrl.pathname]) {
    knownUrls[reqUrl.pathname](request, response, acceptable);
  } else {
    knownUrls.unknown(request, response);
  }
};

// start my server
http.createServer(onRequest).listen(port, () => {
  console.log(`server listening to 127.0.0.1:${port}`);
});
