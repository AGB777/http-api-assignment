const url = require('url');
const query = require('querystring');

// this script will send both json and xml responses
// i can create a json object and then convert it to xml here depending on accepted types

const writeResponse = (request, response, status, obj, acceptedTypes) => {
  // i want the preferred type to default to json
  let preferredType = 'application/json';
  // if a type is specified, use that instead
  if (acceptedTypes) {
    [preferredType] = acceptedTypes;
  }
  let res;

  switch (preferredType) {
    case 'text/xml':// if xml is preferred

      // xmlify my response
      res = '<response>';// start the response

      // loop through my response object and add each property to the xml
      Object.entries(obj).forEach(([key, value]) => {
        res += `<${key}>${value}</${key}>`; // add that property to the xml
      });

      res += '</response>';// end the response

      break;
    case 'application/json':// if json is preferred
    default:// if a type is not specified
      res = JSON.stringify(obj);
      break;
  }

  response.writeHead(status, { ContentType: preferredType });
  response.write(res);
  response.end();
};

const goodRequest = (request, response, acceptedTypes) => {
  const res = {
    message: 'You did it! You successfully connected to the api!',
    id: 'Success',
  };

  writeResponse(request, response, 200, res, acceptedTypes);
};

const questionableRequest = (request, response, acceptedTypes) => {
  const reqUrl = url.parse(request.url);
  const params = query.parse(reqUrl.query);

  let status = 400;
  const res = {
    message: 'i cant believe you would send me such a terrible request',
    id: 'BadRequest',
  };

  if (params.valid && params.valid === 'true') {
    status = 200;
    res.message = 'these parameters are acceptable';
    res.id = 'Success';
  }

  writeResponse(request, response, status, res, acceptedTypes);
};

const restrictedAccess = (request, response, acceptedTypes) => {
  const reqUrl = url.parse(request.url);
  const params = query.parse(reqUrl.query);

  let status = 401;
  const res = {
    message: 'you got a permit to be standing there buddy? didnt think so, ur goin to jail for a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong time',
    id: 'Unauthorized',
  };

  if (params.loggedin && params.loggedin === 'yes') {
    status = 200;
    res.message = 'you got a permit to be standing there buddy? oh, it seems you do, my mistake sir carry on.';
    res.id = 'Success';
  }

  writeResponse(request, response, status, res, acceptedTypes);
};

const cursed = (request, response, acceptedTypes) => {
  const status = 403;
  const res = {
    message: 'hey, you cant be in here!',
    id: 'Forbidden',
  };

  writeResponse(request, response, status, res, acceptedTypes);
};

const mybad = (request, response, acceptedTypes) => {
  const status = 500;
  const res = {
    message: 'sorry, were having some trouble fulfilling your order',
    id: 'InternalError',
  };

  writeResponse(request, response, status, res, acceptedTypes);
};

const future = (request, response, acceptedTypes) => {
  const status = 501;
  const res = {
    message: 'this part of the server came from the future. unfortunately, since its from the future it doesnt exist yet. but were working on it',
    id: 'NotImplemented',
  };

  writeResponse(request, response, status, res, acceptedTypes);
};

const notFound = (request, response, acceptedTypes) => {
  const status = 404;
  const res = {
    message: 'theres nothing here',
    id: 'NotFound',
  };

  writeResponse(request, response, status, res, acceptedTypes);
};

module.exports = {
  goodRequest,
  questionableRequest,
  restrictedAccess,
  cursed,
  mybad,
  future,
  notFound,
};
