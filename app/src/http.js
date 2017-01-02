configHttp.$inject = ['$httpProvider'];

export default function configHttp($httpProvider) {
  $httpProvider.interceptors.push(interceptor);
}

interceptor.$inject = [ '$window', 'tokenService', '$state' ];

function interceptor($window, tokenService, $state) {

  return {
    request(config) {
      config.headers = config.headers || {};

      const token = tokenService.get();
            
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }	
                                
      return config;
    },
    responseError(response) {
            // does error status indicate token not valid?
      if (response.status === 403) {
        tokenService.remove();
        $state.go('welcome');
      }
      return Promise.reject(response);
    }
  };
}