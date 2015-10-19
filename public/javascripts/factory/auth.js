app.factory('Auth', ['$http', '$window', '$state', '$q', 'tokenName', 'fbAppId', function($http, $window, $state, $q, tokenName, fbAppId){
    
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
    
    auth.init = function (){
        $window.fbAsyncInit = function () {
            FB.init({
                appId: fbAppId,
                status: true,
                cookie: true,
                xfbml: true,
                version: 'v2.5'
            });
        };
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
    
    auth.logIn = function(method, user){
        switch(method){
            case 'localStorage':
                return $http.post('/login', user).success(function(data){
                    auth.saveToken(data.token);
                    $window.location.reload();
                });
            break;
            case 'facebook':
                var deferred = $q.defer();
                FB.login(function(response){
                    console.log(response);
                    if(!response || response.error){
                        deferred.reject('Error ocurred');
                    }else{
                        if(response.status === 'connected'){
                            return $http.post('/auth/facebook', response).success(function(data){
                                auth.saveToken(data.token);
                                $window.location.reload();
                            });
                        }
                        deferred.resolve(response);
                    }
                }, { scope: ['public_profile', 'email'] });
                return deferred.promise;
            break;
        }
    };
    
    auth.logOut = function(){
        return $http.post('/logout', null, {
            headers: { Authorization: 'Bearer ' + getToken() }
        }).success(function(data){
            $window.localStorage.removeItem(tokenName);
            $state.go('home');
        });
    };
    
    auth.init();
    return auth;
}]);