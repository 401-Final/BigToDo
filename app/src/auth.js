auth.$inject = [ '$rootScope', 'userService', 'ngDialog', '$state' ];

export default function auth($rootScope, userService, ngDialog, $state) {
    
    // angular-ui-router puts this event ($stateChangeStart) on $rootScope
  $rootScope.$on('$stateChangeStart', (event, toState, toParams /*, fromState, fromParams*/ ) => {
    
        // console.log('$scs', toState, toParams, fromState, fromParams);

    if (!(toState.data && toState.data.public) && !userService.isAuthenticated()) {
            // stop ui-router from making the state change        
      event.preventDefault();

            // throw up a dialog and ask user to signin/signup
      const dialog = ngDialog.open({ 
                // ngDialog missed the boat on template vs templateUrl
        template: '<user-auth success="success"></user-auth>',
                // plain: true === template; plain: false (default) === templateUrl 
        plain: true,
        controller: ['$scope', function($scope){
          $scope.success = function(){
            dialog.close();
            return $state.go(toState.name, toParams);
          };
        }]
      });
            
    }

  });
}