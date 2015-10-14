app.controller('profile', [
    '$scope', 'Auth', 'userPromise', 'alertify',
    function ($scope, Auth, userPromise, alertify) {

        $scope.user = userPromise;
        $scope.isLoggedIn = Auth.isLoggedIn;
        
        $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
            var fileSize = flowFile.size / 1024;
            if(fileSize > 1024){
                alertify.error('This image exceeds the 1024 Kbs allowed, please select other');
                event.preventDefault();//prevent file from uploading
            }
            console.log(flowFile);
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