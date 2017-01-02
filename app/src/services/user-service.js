userService.$inject = ['tokenService', '$http', 'apiUrl'];
// tokenService -> handles the storage of the token
// $http -> calls for user verify, auth, etc.
// apiUrl -> baseUrl for http calls to the server

export default function userService(token, $http, apiUrl) {

  const current = token.get();
  if (current) {
    $http
            .get(`${apiUrl}/auth/verify`)
            .catch(() => token.remove());
  }
    
  function credential(endpoint) {
    return (credentials) => {
      return $http.post(`${apiUrl}/auth/${endpoint}`, credentials)
            .then(result => {
              token.set(result.data.token);
            })
            .catch(err => {
              throw err.data; 
            });
    };
  }

  return {
        // do we have a token?
    isAuthenticated() {
            // instead of returning the token,
      return !!token.get();
    },
        // remove the token
    logout() {
      token.remove();
    },
        // call API and set token
    signin: credential('signin'),
        // call API and set token
    signup: credential('signup')
  };
}