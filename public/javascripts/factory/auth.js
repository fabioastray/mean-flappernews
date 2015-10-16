app.factory('Auth', ['$http', '$window', '$state', 'tokenName', function($http, $window, $state, tokenName){
    
    function getToken(){
        return $window.localStorage[tokenName];
    }
    
    function isLoggedIn(){
        var token = getToken();
        
        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            
            return payload.exp > Date.now() / 1000;  
        }else{
            return false;
        }
    }
    
    function currentUser (){
        if(isLoggedIn()){
            var token = getToken(),
                payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload;
        }
    }
    
    var auth = {
        payload: currentUser()
    };
    
    auth.saveToken = function(token){
        $window.localStorage[tokenName] = token;  
    };
    
    auth.getToken = getToken;
    
    auth.isLoggedIn = isLoggedIn;
    
    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };
    
    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
            $window.location.reload();
        });
    };
    
    auth.logOut = function(){
        return $http.post('/logout', null, {
            headers: { Authorization: 'Bearer ' + getToken() }
        }).success(function(data){
            $window.localStorage.removeItem(tokenName);
            $state.go('home');
        });
    };
    
    return auth;
}]);