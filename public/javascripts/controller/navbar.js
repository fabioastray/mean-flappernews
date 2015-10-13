app.controller('navbar', [
    '$scope', 'Auth', 'User',
    function ($scope, Auth, User) {
        
        init();
        
        function init(){
            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.currentUser = Auth.currentUser;
            $scope.logOut = Auth.logOut;
        }
        
    }]);