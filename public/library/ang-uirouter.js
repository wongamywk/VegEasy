
angular.module('DemoApp', ['ui.router', 'ngAnimate'])

	.config(function($stateProvider, $urlRouterProvider)
	{
		$stateProvider
			.state('tab1', {
				name: 'tab1',
				url: "/tab1",
            	templateUrl: "/home"
            		})

			.state('tab2', {
				name: 'tab2',
				url: '/tab2',
            	templateUrl: "/menu"	})

			.state('tab3', {
				name: 'tab3',
				url: '/tab3',
				templateUrl: "/member"	})

			.state('tab4', {
				name: 'tab4',
				url: '/tab4',
				templateUrl:"/contact"
});
	})

	.controller('DemoController', function( $scope, $window, $state )
	{
		$scope.transition = 'slide-left';
		$scope.tabs = ['tab1', 'tab2', 'tab3', 'tab4'];
		$scope.currentIndex = -1;
		$scope.maxIndex = $scope.tabs.length;
		$scope.left = false;

		next();

		function next()
		{
			$scope.currentIndex = $scope.currentIndex+1 < $scope.maxIndex ? $scope.currentIndex+1 : 0;
			var name = $scope.tabs[$scope.currentIndex];
			$state.go( name );
		}
		function left()
		{
			var name = $scope.tabs[0];
			$state.go( name );
		}

		function right()
		{
			var name = $scope.tabs[1];
			$state.go( name );
		}

		function top()
		{
			var name = $scope.tabs[2];
			$state.go( name );
		}

		function bottom()
		{
			var name = $scope.tabs[3];
			$state.go( name );
		}


		$scope.left = function()
		{
			$scope.transition = 'slide-left';
			left();
		}

		$scope.right = function()
		{
			$scope.transition = 'slide-right';
			right();
		}

		$scope.top = function()
		{
			$scope.transition = 'slide-top';
			top();
		}

		$scope.bottom = function()
		{
			$scope.transition = 'slide-bottom';
			bottom();
		}
	})
;
