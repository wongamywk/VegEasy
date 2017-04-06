'use strict';

angular.module('myApp', [])
.controller('MovieController', function($scope, $http) {
  $scope.$watch('search', function() {
    fetch();
  });

  $scope.search = "Sherlock Holmes";

  function fetch() {
    $http.get("http://food2fork.com/api/search?key=b1a8c8b6be3102f257733188baec47ab&q=" + $scope.search + "%20vegetarian")
      .then(function(response) {
        $scope.projects = response.data;
      });
  }

  $scope.select = function() {
    this.setSelectionRange(0, this.value.length);
  }
});
