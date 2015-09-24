app.controller('home', [
    '$scope', 'post',
    function ($scope, post) {

        $scope.posts = post.posts;

        $scope.addPost = function () {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });
            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpvotes = function (post) {
            post.upvotes++;
        };
        
    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'html/home.html',
                    controller: 'home'
                });

        $urlRouterProvider.otherwise('home');
    }]);