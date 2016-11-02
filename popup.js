app = angular.module('OwnCloudPasswords');

app.factory('WebsiteService', function () {
  return {
    fillPassword: function (pass) {
      chrome.tabs.executeScript({
        code: 'for (let input of document.querySelectorAll("input[type=password]")) { input.value = "' + pass.replace('\"', '\\"') + '"; }'
      });
    },

    fillUsername: function (user) {
      chrome.tabs.executeScript({
        code: 'for (let input of document.querySelectorAll("input[type=text]")) { input.value = "' + user.replace('\"', '\\"') + '"; }'
      });

      chrome.tabs.executeScript({
        code: 'for (let input of document.querySelectorAll("input[type=email]")) { input.value = "' + user.replace('\"', '\\"') + '"; }'
      });

      chrome.tabs.executeScript({
        code: 'for (let input of document.querySelectorAll("input[name=user_name]")) { input.value = "' + user.replace('\"', '\\"') + '"; }'
      });

      chrome.tabs.executeScript({
        code: 'for (let input of document.querySelectorAll("input[name=username]")) { input.value = "' + user.replace('\"', '\\"') + '"; }'
      });

      chrome.tabs.executeScript({
        code: 'for (let input of document.querySelectorAll("input[name=login]")) { input.value = "' + user.replace('\"', '\\"') + '"; }'
     });

      chrome.tabs.executeScript({
       code: 'for (let input of document.querySelectorAll("input[name=email]")) { input.value = "' + user.replace('\"', '\\"') + '"; }'
      });

      chrome.tabs.executeScript({
       code: 'for (let input of document.querySelectorAll("input[name=user]")) { input.value = "' + user.replace('\"', '\\"') + '"; }'
      });
    }
  };
});

app.controller('PopupPasswordsController', function ($scope, PasswordService, WebsiteService) {
  $scope.loading = true;
  $scope.passwords = [];

  chrome.tabs.getSelected(null, function (tab) {
    PasswordService.findMatchingPasswords(tab.url, function (passwords) {
      $scope.passwords = passwords;
      $scope.loading = false;
    });
  });

  $scope.fillPassword = function (user, pass) {
    WebsiteService.fillPassword(pass);
    WebsiteService.fillUsername(user);
    window.close();
  };
});

app.controller('PopupCreateController', function ($scope, PasswordService, WebsiteService) {
  $scope.username = "";
  $scope.password = "";
  $scope.showCreatePassword = false;

  $scope.generatePassword = function () {
    var password = PasswordService.password.generate(Math.floor(Math.random() * (24 - 16 + 1)) + 16);
    $scope.password = password;
    WebsiteService.fillPassword(password);
  };

  $scope.updateUsername = function () {
    WebsiteService.fillUsername($scope.username);
  };

  $scope.updatePassword = function () {
    WebsiteService.fillPassword($scope.password);
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
