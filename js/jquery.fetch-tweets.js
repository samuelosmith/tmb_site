/**
 * jQuery.fetchTweets() plugin.
 *
 * @author Lupo Montero <lupo@e-noise.com>
 */

/*jslint browser: true */
/*global jQuery: false */

(function ($) {

var defSettings = {
  username: '',
  count: 2,
  showUserInfo: true,
  refreshInterval: 60*5, // in seconds (5 mins)
  callback: undefined,
  cache: true
};

var twitterify = (function () {
  var r = [
    [/(^|[\n ])([\w]+?:\/\/[\w]+[^ \"\n\r\t< ]*)/g, '$1<a href="$2">$2</a>'],
    [/(^|[\n ])((www|ftp)\.[^ \"\t\n\r< ]*)/g, '$1<a href="http://$2">$2</a>'],
    [/@(\w+)/g, '<a class="tweet-mention" href="http://twitter.com/$1">@$1</a>'],
    [/#(\w+)/g, '<a class="tweet-hash" href="http://search.twitter.com/search?q=$1">#$1</a>']
  ];
  var le = r.length;

  return function (text) {
    var i, current;

    for (i=0; i<le; i++) {
      current = r[i];
      text = text.replace(current[0], current[1]);
    }

    return text;
  };
})();

var secondsToHuman = function (seconds) {
  var time;

  if (seconds < 60) {
    return 'just now';
  } else if (seconds < 60*60) {
    time = Math.round(seconds/60);
    return (time>1) ? time + ' minutes ago' : ' 1 minute ago';
  } else if (seconds < 60*60*24) {
    time = Math.round(seconds/(60*60));
    return (time>1) ? time + ' hours ago' : ' 1 hour ago';
  } else if (seconds < 60*60*24*7) {
    time = Math.round(seconds/(60*60*24));
    return (time>1) ? time + ' days ago' : ' yesterday';
  } else if (seconds < 60*60*24*7*4) {
    time = Math.round(seconds/(60*60*24*7));
    return (time>1) ? time + ' weeks ago' : ' last week';
  } else {
    time = Math.round(seconds/(60*60*24*30));
    return (time>1) ? time + ' months ago' : ' last month';
  }
};

var createStatusUpdatesFetcher = function (obj, username, count,callback) {
  var url = 'http://search.twitter.com/search.json';
  var queryString = '?callback=?&rpp=' + count + '&q=from:' + username;
  var tweetsDiv = $('<div>').appendTo(obj);
  var isLoading = false;

  return function () {
    if (isLoading) {
      return;
    }

    isLoading = true;
    tweetsDiv.html('<div class="tweets-loading">Loading tweets...</div>');
    
    $.getJSON(url + queryString, function (data) {
      var tweets, le, current, i, now = new Date(), time, tweetHtml = '';

	  if (!data || !data.results) {
        tweetsDiv.html('<div class="error">Error fetching tweets!</div>');
        return false;
      }

      tweets = data.results; // cache tweets array in local var
      le = tweets.length; // cache length for faster iteration

      for (i=0; i<le; i++) {
        current = tweets[i];

        // Calculate how many seconds ago the tweet created and make human readable
        time = secondsToHuman((now - new Date(current.created_at))/1000);

        tweetHtml += '<div class="tweet-text">' + twitterify(current.text) +
          '<\/div><div class="tweet-created_at"><a href="http://www.twitter.com/' +
          username + '/status/' + current.id + '">' + time + '<\/a><\/div>';
      }

      isLoading = false;
      tweetsDiv.html(tweetHtml);
      if (callback) callback()
    });
  };
};

var fetchUserData = function (obj, username) {
  var url = 'http://api.twitter.com/1/users/show.json?callback=?&screen_name=';
  var userInfoDiv = $('<div class="tweets-userinfo">').appendTo(obj);

  userInfoDiv.html('<div class="tweets-loading">Loading profile data...</div>');

  $.getJSON(url + username, function (data) {
    var userInfoHtml = '';

    if (!data || typeof data !== 'object') {
      userInfoDiv.html('<div class="error">Error fetching user info!</div>');
      return false;
    }

    userInfoHtml += '<a href="http://twitter.com/' + username + '" title="' +
      data.description + '"><img src="' + data.profile_image_url + '" /></a>' +
      '<h4>' + data.name + '<span class="tweets-userinfo-username">(<a href="' +
      'http://twitter.com/' + username + '">@' + username + '</a>)</span></h4>' +
      '<p class="tweets-userinfo-loc">Location: ' + data.location + '</p>' +
      '<ul>' +
      '<li>Tweets: '+ data.statuses_count +'</li>' +
      '<li>Following: ' + data.friends_count + '</li>' +
      '<li>Followers: ' + data.followers_count + '</li>' +
      '<li>Listed: ' + data.listed_count + '</li>' +
      '</ul>';

    userInfoDiv.html(userInfoHtml);
  });
};

$.fn.fetchTweets = function (options) {
  var settings = $.extend(defSettings, options || {});
  var username = settings.username;
  var callback = settings.callback
  var count = settings.count;
  var refreshInterval = settings.refreshInterval;
  var obj = $(this);
  var fetchStatusUpdates;

  $.ajaxSetup({ cache: settings.cache });

  if (settings.showUserInfo === true) {
    fetchUserData(obj, username);
  }

  fetchStatusUpdates = createStatusUpdatesFetcher(obj, username, count,callback);

  if (typeof refreshInterval === 'number' && refreshInterval > 0) {
    setInterval(function () {
      fetchStatusUpdates();
    }, refreshInterval*1000);
  }

  fetchStatusUpdates();
};

})(jQuery);

