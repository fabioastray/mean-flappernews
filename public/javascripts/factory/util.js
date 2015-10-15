app.factory('Util', [function(){
    
    var u = {};
    
    u.isImage = function(src){
        
        var image = new Image();
    
        image.onerror = function (){
            return false;
        };
        image.onload = function (){
            return true;
        };
        
        image.src = src;
    };
    
    return u;
}]);