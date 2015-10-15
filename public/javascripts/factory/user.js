app.factory('User', ['$http', '$window', 'Auth', function($http, $window, Auth){
   
   var u = {};
   
    u.getCurrent = function(){
        return $http.get('/profile', {
            headers: { Authorization: 'Bearer ' + Auth.getToken() }
        }).then(function(res){
            return res.data; 
        });
    };
    
    u.edit = function(user){
        return $http.post('/profile', user, {
            headers: { Authorization: 'Bearer ' + Auth.getToken() }
        }).success(function(data){
            Auth.saveToken(data.token);
            $window.location.reload();
        });
   };
   
   return u;
}]);