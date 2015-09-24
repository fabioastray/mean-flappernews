app.controller('home', [
    '$scope', 'post', 'postPromise',
    function ($scope, Post, postPromise) {

        $scope.posts = postPromise.data;

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
            Post.upvote(post);
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