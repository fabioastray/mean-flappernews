app.controller('Auth', [
    '$scope', '$state', 'Auth', 'Util', 'alertify',
    function ($scope, $state, Auth, Util, alertify) {

        init();

        $scope.register = function () {
            Auth.register($scope.user).error(function (error) {
                Util.setFocus('login.username');
                alertify.error(error.message);
            }).then(function () {
                $state.go('home');
            });
        };

        $scope.logIn = function () {
            Auth.logIn($scope.user).error(function (error) {
                Util.setFocus('login.username');
                alertify.error(error.message);
            });
        };

        function init() {
            $scope.user = {};
        }

    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: '/public/html/login.html',
                    controller: 'Auth',
                    onEnter: ['$state', 'Auth', function ($state, Auth) {
                            if (Auth.isLoggedIn()) {
                                $state.go('home');
                            }
                        }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/public/html/register.html',
                    controller: 'Auth',
                    onEnter: ['$state', 'Auth', function ($state, Auth) {
                            if (Auth.isLoggedIn()) {
                                $state.go('home');
                            }
                        }]
                });

        $urlRouterProvider.otherwise('home');
    }]);