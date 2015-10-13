app.factory('User', ['$http', 'Auth', function($http, Auth){
   
   var u = {};
   
    u.getCurrent = function(){
        return $http.get('/profile', {
          headers: { Authorization: 'Bearer ' + Auth.getToken() }
        }).then(function(res){
            return res.data; 
        });
    };
   
   return u;
}]);