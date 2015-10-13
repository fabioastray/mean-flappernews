app.controller('home', [
    '$scope', 'post', 'auth', 'postPromise',
    function ($scope, Post, auth, postPromise) {

        $scope.posts = postPromise.data;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addPost = function () {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            
            Post.create({
                title: $scope.title,
                link: $scope.link
            });
            
            $scope.posts = Post.posts;
            
            clearFields();
        };

        $scope.incrementUpvotes = function (post) {
            if(auth.isLoggedIn()){
                Post.upvote(post).success(function(response){
                    if(response.error){
                        $scope.error = { message: response.message };
                    }
                });
            }else{
                $scope.error = { message: 'Log in first to upvote' };
            }
        };
        
        $scope.incrementDownvotes = function (post) {
            if(auth.isLoggedIn()){
                Post.downvote(post);
            }else{
                $scope.error = { message: 'Log in first to downvote' };
            }
        };
        
        function clearFields(){
            $scope.title = '';
            $scope.link = '';
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