/**
 * JavaScript functions for testing OpenID Connect with NGINX Plus
 * 
 * Copyright (C) 2021 Nginx, Inc.
 */

// Constants for common error message.
var isSignedIn        = false;
var TITLE_SIGNIN      = 'Sign in';
var TITLE_SIGNOUT     = 'Sign out';
var MSG_SIGNINIG_IN   = 'Signinig in';
var MSG_SIGNED_IN     = 'Signed in';
var MSG_SIGNED_OUT    = 'Signed out';
var MSG_EMPTY_JSON    = '{"message": "N/A"}';
var DEFAULT_CLIENT_ID = 'my-client-id';
var btnSignin         = document.getElementById('signin');
var btnIdToken        = document.getElementById('id-token');
var btnAcToken        = document.getElementById('ac-token');
var btnCookie         = document.getElementById('cookie');
var btnProxiedAPI     = document.getElementById('proxied-api');
var btnUserInfo       = document.getElementById('user-info');
var jsonViewer        = new JSONViewer();
var viewerJSON        = document.querySelector("#json").appendChild(jsonViewer.getContainer());
var accessToken       = '';
var userName          = '';


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                             *
 *                        0. Initialize Main Page                              *
 *                                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var initButtons = function () {
  if (isSignedIn) {
    initButtonsAfterSignIn()
  } else {
    initButtonsBeforeSignIn()
  }
}


var initButtonsBeforeSignIn = function () {
  btnIdToken.disabled    = true
  btnAcToken.disabled    = true
  btnCookie.disabled     = true
  btnProxiedAPI.disabled = true
  btnUserInfo.disabled   = true
  isSignedIn             = false;
  showLoginBtnTitle(TITLE_SIGNIN);
}

var initButtonsAfterSignIn = function () {
  btnIdToken.disabled    = false
  btnAcToken.disabled    = false
  btnCookie.disabled     = false
  btnProxiedAPI.disabled = false
  btnUserInfo.disabled   = false
  isSignedIn             = true;
  showLoginBtnTitle(TITLE_SIGNOUT);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                             *
 *                1. Event Handler for testing NGINX Plus OIDC                 *
 *                                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Event Handler: for when clicking a either 'Sign in' or `Sign out` button.
var eventHandlerSignIn = function (evt) {
  if (!isSignedIn) {
    doSignIn(evt)
  } else {
    doSignOut(evt)
  }
};

// Event Handler: for when clicking a button 'Get ID Token'.
var eventHandlerIdToken = function (evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/id_token', 
    'getting ID token from K/V store...',
    'ID token: received',
    headers
  )
};

// Event Handler: for when clicking a 'Get Access Token' button.
var eventHandlerAccessToken = function (evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/access_token',
    'getting access token from K/V store...',
    'access token: received',
    headers
  );
};

// Event Handler: for when clicking a 'Get Cookie' button.
var eventHandlerCookie = function (evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/cookie', 
    'getting cookie...',
    'cookie: acquired',
    headers
  )
};

// Event Handler: for when clicking a 'Backend API w/ Cookie + Bearer' button.
// - /v1/api/2: cookie is used. The bearer access token is also passed to the 
//              backend API via `proxy_set_header Authorization` directive.
var eventHandlerProxiedAPI = function (evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/v1/api/example', 
    'calling a sample proxied API...',
    'called a sample proxied API',
    headers
  )
};

// Event Handler: for when clicking a 'Get User Info' button.
var eventHandlerUserInfo = function (evt) {
  showUserInfo(evt)
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                             *
 *         2. Common Functions for testing OIDC Workflows via Sample UI        *
 *                                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Request NGINX endpoint which is a location block.
var doNginxEndpointRequest = function(evt, uri) {
  if (evt && evt.type === 'keypress' && evt.keyCode !== 13) {
    return;
  }
  location.href = window.location.origin + uri;
};

var eraseCookie = function(name) {
  document.cookie = name+'=; Path=/; SameSite=lax;';  
}

var setCookie = function(name, value) {
  document.cookie = name+'='+value+'; Path=/; SameSite=lax;';
}

// Sign in by clicking 'Sign In' button of the UI.
var doSignIn = function(evt) {
  eraseCookie('session_id')
  eraseCookie('auth_redir')
  eraseCookie('auth_nonce')
  
  var x_client_id = getClientId();
  setCookie('client_id', x_client_id)
  doNginxEndpointRequest(evt, '/login');
};

// Sign in by clicking 'Sign In' button of the UI.
var doSignOut = function(evt) {
  doNginxEndpointRequest(evt, '/logout');
};

// Request an API with application/json type response.
var doAPIRequest = function(evt, uri, msgBefore, msgAfter, headers) {
  if (evt && evt.type === 'keypress' && evt.keyCode !== 13) {
    return false;
  }
  showMessage(msgBefore)
  const url = window.location.origin + uri;
  fetch(url, {
      method : 'GET',
      mode   : 'cors',
      headers: headers
  })
  .then((response) => {
    showResponseStatus(response.status, response.statusText, url)
    showMessageDetail(MSG_EMPTY_JSON)
    if (response.ok || response.status == 400) {
      return response.json();
    }
    throw new Error(response.error)
  })
  .then((data) => {
    showMessage(msgAfter)
    showMessageDetail(JSON.stringify(data))
    if (uri == '/userinfo') {
      initButtonsAfterSignIn()
    }
    if (data.username) {
      userName = data.username;
      showMessage(userName)
    } else if (data.name) {
      userName = data.name;
      showMessage(userName)
    } else if (data.email) {
      userName = data.email;
      showMessage(userName)
    } else if (data.token && uri == '/access_token') {
      accessToken = data.token;
    }
  })
  .catch(function(error) {
    if (uri == '/userinfo') {
      initButtonsBeforeSignIn()
      showMessage('Need to sign-in to retrieve user info!');
      showMessageDetail(MSG_EMPTY_JSON)
    } else {
      showMessage(error);
      showMessageDetail(MSG_EMPTY_JSON)
    }
  });
  return true;
}

// Show user information in the UI via the endpoint of /userinfo
var showUserInfo = function(evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/userinfo', 
    'getting user info from IdP...',
    'user info: received from IdP',
    headers
  );
}

// Display summarized message for each testing.
var showMessage = function (msg) {
  document.getElementById('message').value = msg;
};

// Display response status & message for each testing.
var showResponseStatus = function (status, msg, uri) {
  document.querySelector('pre').textContent = uri + ', ' + status + ', ' + msg;
};

// Clear message window
var clearMessage = function() {
  document.querySelector('pre').textContent = '';
  showMessageDetail(MSG_EMPTY_JSON);
};

// Display detail message for each testing.
var showMessageDetail = function (msg) {
  var setJSON = function() {
    try {
      jsonObj = JSON.parse(msg);
    }
    catch (err) {
      alert(err);
    }
  };
  setJSON();
  jsonViewer.showJSON(jsonObj);
  var res = jsonObj;
  return res
}

// Display a button title for toggling between 'Sign in' and 'Sign out'.
var showLoginBtnTitle = function (msg) {
  btnSignin.innerText = msg
};

// Display 'Sign In' button when signed-out or occurs error during signing-in.
var showSignInBtn = function () {
  isSignedIn = false;
  showLoginBtnTitle(TITLE_SIGNIN);
  showMessage(MSG_SIGNED_OUT);
};

// Display 'Sign Out' button when signed-in.
var showSignOutBtn = function () {
  isSignedIn = true;
  showLoginBtnTitle(TITLE_SIGNOUT);
  showMessage(MSG_SIGNED_IN);
};

var getClientId = function () {
  return document.getElementById('client-id').value;
};

var showClientId = function(data) {
  document.getElementById('client-id').value = data;
}

var showClientIdFromCookie = function() {
  var clientId = getCookieValue('client_id')
  if (clientId == '') {
    clientId = DEFAULT_CLIENT_ID;
  }
  showClientId(clientId);
}

// Return cookie value using key
var getCookieValue = function(key) {
  var cookies = document.cookie;
  var parts = cookies.split(key + "=");
  var cookieValue = '';
  if (parts.length == 2) {
      cookieValue = parts.pop().split(";").shift();
  }
  return cookieValue;
}


// Add event lister of each button for testing NGINX Plus OIDC integration.
btnSignin    .addEventListener('click', eventHandlerSignIn);
btnIdToken   .addEventListener('click', eventHandlerIdToken);
btnAcToken   .addEventListener('click', eventHandlerAccessToken);
btnCookie    .addEventListener('click', eventHandlerCookie);
btnProxiedAPI.addEventListener('click', eventHandlerProxiedAPI);
btnUserInfo  .addEventListener('click', eventHandlerUserInfo);

showUserInfo(null)
showClientIdFromCookie()
