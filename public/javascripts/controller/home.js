app.controller('home', [
    '$scope', 'post', 'auth', 'postPromise', 'alertify',
    function ($scope, Post, auth, postPromise, alertify) {

        $scope.posts = postPromise.data;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addPost = function () {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            
            Post.create({
                title: $scope.title,
                link: parseLink($scope.link)
            }).success(function(){
                alertify.success('Done, creating a post');
            });
            
            $scope.posts = Post.posts;
            
            clearFields();
        };

        $scope.incrementUpvotes = function (post) {
            if(auth.isLoggedIn()){
                Post.upvote(post).error(function(error){
                    alertify.error(error.message);
                });
            }else{
                alertify.error('Log in first to upvote');
            }
        };
        
        $scope.incrementDownvotes = function (post) {
            if(auth.isLoggedIn()){
                Post.downvote(post).error(function(error){
                    alertify.error(error.message);
                });
            }else{
                alertify.error('Log in first to downvote');
            }
        };
        
        function parseLink(link){
            if(link.indexOf('http://www') !== -1 || 
               link.indexOf('https://www') !== -1){
                return link;
            }else{
                return 'http://www.' + link;
            }
        }
        
        function clearFields(){
            $scope.title = '';
            $scope.link = '';
            $scope.addPostClick = false;
        }
        
    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/public/html/home.html',
                    controller: 'home',
                    resolve: {
                        postPromise: ['post', function(Post){
                            return Post.getAll();
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);