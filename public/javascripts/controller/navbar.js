app.controller('navbar', [
    '$scope', 'auth',
    function ($scope, auth) {
        
        init();
        
        function init(){
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.logOut = auth.logOut('flapper-news-token');
        }
        
    }]);