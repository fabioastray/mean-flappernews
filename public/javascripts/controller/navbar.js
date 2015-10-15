app.controller('navbar', [
    '$scope', 'Auth',
    function ($scope, Auth) {
        
        init();
        
        function init(){
            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.currentUser = Auth.payload;
            $scope.logOut = Auth.logOut;
        }
        
    }]);