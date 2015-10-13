app.controller('profile', [
    '$scope', 'Auth', 'userPromise', 'alertify',
    function ($scope, Auth, userPromise, alertify) {

        $scope.user = userPromise;
        $scope.isLoggedIn = Auth.isLoggedIn;
        
        $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
            //event.preventDefault();//prevent file from uploading
            console.log('prevented');
        });
        
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
                        userPromise: ['User', function(User){
                            return User.getCurrent();
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);