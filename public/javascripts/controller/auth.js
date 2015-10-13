app.controller('auth', [
    '$scope', '$state', 'auth', 'alertify',
    function ($scope, $state, auth, alertify) {

        init();

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                alertify.error(error.message);
            }).then(function () {
                $state.go('home');
            });
        };

        $scope.logIn = function () {
            auth.logIn($scope.user).error(function (error) {
                alertify.error(error.message);
            }).then(function () {
                $state.go('home');
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
                    controller: 'auth',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                            if (auth.isLoggedIn()) {
                                $state.go('home');
                            }
                        }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/public/html/register.html',
                    controller: 'auth',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                            if (auth.isLoggedIn()) {
                                $state.go('home');
                            }
                        }]
                });

        $urlRouterProvider.otherwise('home');
    }]);