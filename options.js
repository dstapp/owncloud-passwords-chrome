app = angular.module('OwnCloudPasswords');

app.controller('OptionsController', function ($scope) {
  $scope.serverUrl = "";
  $scope.username = "";
  $scope.password = "";

  chrome.storage.sync.get({
    serverUrl: 'http://some.server.some.tld',
    username: 'someuser'
  }, function (items) {
    $scope.serverUrl = items.serverUrl;
    $scope.username = items.username;
    $scope.$digest();
  });

  $scope.save = function () {
    chrome.storage.sync.set({
      serverUrl: $scope.serverUrl,
      username: $scope.username,
      password: $scope.password
    }, function () {
      alert("Data saved!");
    });
  };
});
