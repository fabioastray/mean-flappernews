app.controller('profile', [
    '$scope', 'Auth', 'userPromise', 'alertify',
    function ($scope, Auth, userPromise, alertify) {

        $scope.user = userPromise.data;
        $scope.isLoggedIn = Auth.isLoggedIn;
        
    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('profile', {
                    url: '/profile',
                    templateUrl: '/public/html/profile.html',
                    controller: 'profile',
                    resolve: {
                        userPromise: ['user', function(User){
                            return User.getCurrent();
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);