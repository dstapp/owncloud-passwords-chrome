app = angular.module('OwnCloudPasswords');

app.controller('PopupPasswordsController', function ($scope, PasswordService) {
  $scope.loading = true;
  $scope.passwords = [];
  $scope.showPassword = {};

  chrome.tabs.getSelected(null, function (tab) {
    PasswordService.findMatchingPasswords(tab.url, function (passwords) {
      $scope.passwords = passwords;

      $scope.passwords.forEach(function (pass) {
        $scope.showPassword[pass.id] = false;
      });

      $scope.loading = false;
    });
  });

  $scope.toggleShowPassword = function (id) {
    $scope.showPassword[id] = !$scope.showPassword[id];
  };
});

app.controller('PopupCreateController', function ($scope, PasswordService) {
  $scope.username = "";
  $scope.password = "";
  $scope.showCreatePassword = false;

  $scope.generatePassword = function () {
    var password = PasswordService.password.generate(Math.floor(Math.random() * (24 - 16 + 1)) + 16);
    $scope.password = password;
  };

  $scope.createPassword = function () {
    if ($scope.username == "" || $scope.password == "") {
      alert('Username and/or password missing');
      return;
    }

    chrome.tabs.getSelected(null, function (tab) {
      var url = tab.url;

      PasswordService.createPassword(url, $scope.username, $scope.password, function (result) {
        if (result.status === 200) {
          alert('Password created');
        } else {
          alert('Could not save password');
        }
      });
    }.bind(this));
  };
});
