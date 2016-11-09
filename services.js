app = angular.module('OwnCloudPasswords', []);

app.factory('PasswordService', function ($http) {
  return {
    _base64: {
      _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      encode: function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=this._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},
      decode: function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=this._base64._utf8_decode(t);return t},
      _utf8_encode: function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},
      _utf8_decode: function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}
    },

    getPasswords: function (callback) {
      chrome.storage.sync.get({
        serverUrl: null,
        username: null,
        password: null
      }, function (items) {
        $http({
          method: 'GET',
          url: items.serverUrl,
          headers: {
            'Authorization' : 'Basic ' + this._base64.encode(items.username + ':' + items.password)
          }
        }).then(callback);
      }.bind(this));
    },

	password: {
	  _pattern : /[a-zA-Z0-9_\-\+\.]/,

	  _getRandomByte : function () {
	    // http://caniuse.com/#feat=getrandomvalues
	    if (window.crypto && window.crypto.getRandomValues) {
	      var result = new Uint8Array(1);
	      window.crypto.getRandomValues(result);
	      return result[0];
	    } else if (window.msCrypto && window.msCrypto.getRandomValues) {
	      var result = new Uint8Array(1);
	      window.msCrypto.getRandomValues(result);
	      return result[0];
	    } else {
	      return Math.floor(Math.random() * 256);
	    }
	  },

	  generate: function(length) {
	    return Array.apply(null, {'length': length})
	      .map(function () {
	        var result;
	        while(true) {
	          result = String.fromCharCode(this._getRandomByte());
	          if (this._pattern.test(result)) {
	            return result;
	          }
	        }
	      }, this).join('');
	  }
	},

    createPassword: function (url, username, password, callback) {
      var domain = this._getDomainFromUrl(url);

      var data = {
        website: domain,
        pass: password,
        loginname: username,
        address: url,
        notes: ''
      };

      chrome.storage.sync.get({
        serverUrl: null,
        username: null,
        password: null
      }, function (items) {
        $http({
          method: 'POST',
          url: items.serverUrl,
          headers: {
            'Authorization' : 'Basic ' + this._base64.encode(items.username + ':' + items.password)
          },
          data: data
        }).then(callback);
      }.bind(this));
    },

    _getDomainFromUrl: function (url) {
      var domain;

      if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
      } else {
        domain = url.split('/')[0];
      }

      domain = domain.split(':')[0];

      return domain.replace("www.", "");
    },

    findMatchingPasswords: function (url, callback) {
      var domain = this._getDomainFromUrl(url);
      var matchingPasswords = [];

      this.getPasswords(function (data) {
        var passwords = data.data;

        passwords.forEach(function (pass) {
          if (pass.properties && pass.properties !== "" && pass.properties !== false) {
            var propertiesString = "{" + pass.properties + "}";

            try {
              var properties = JSON.parse(propertiesString);

              if (pass.loginname == "") {
                pass.loginname = properties.loginname;
              }
            } catch (err) {
              //console.log(err);
            }
          }

          if (pass.website.includes(domain)) {
            matchingPasswords.push(pass);
          }
        });

        callback(matchingPasswords);
      });
    }
   };
});

