// initialize SteemConnect v2
sc2.init({
  app: 'worldmap.app',
  callbackURL: 'http://localhost/steemconnect/',
  scope: ['vote', 'comment', 'custom_json'],
  //access: $.cookie("access_token")  // requires latest version // use `npm i sc2-sdk --save`
});

// Need to define an object that will be observed for changes by Vue.js
var steemconnect = {};
steemconnect.user = null;
steemconnect.metadata = null;

// Request user details if token is available
if ($.cookie("access_token") != null) {
  sc2.setAccessToken($.cookie("access_token"));
  sc2.me(function (err, result) {
    // console.log('/me', err, result); // DEBUG
    if (!err) {
      // Fill the steemconnect placeholder with results
      steemconnect.user = result.account;
      steemconnect.metadata = JSON.stringify(result.user_metadata, null, 2);
    }
  });
};

// Initialize the Vue Model
var vm = new Vue({
  el: '#vm',
  data: {
    loginUrl: sc2.getLoginURL(),
    steemconnect: steemconnect
  },
  methods: {
    logout: function() {
      sc2.revokeToken(function (err, result) {
        console.log('You successfully logged out', err, result);
        // Remove all cookies
        $.removeCookie("access_token", { path: '/' });
        $.removeCookie("username", { path: '/' });
        $.removeCookie("expires_in", { path: '/' });
        // Reset all steemconnect local data
        for (var key in this.steemconnect) {
          this.steemconnect[key] = null;
        }
      });
    },
    formatDate: function(date) {
      // Format date from UTC to locale Date
      return new Date(Date.parse(date)).toLocaleDateString();
    },
    follow: function(username) {
      SC2Utils.follow(steemconnect.user.name, username);
    },
    unfollow: function(username) {
      SC2Utils.unfollow(steemconnect.user.name, username);
    }
  }
});