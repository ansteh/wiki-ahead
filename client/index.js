function sug(response){
  console.log(response);
};

(function(document, jQuery){
  var request = function(url){
    return new Promise(function(resolve, reject) {
      jQuery.getJSON(url)
      .then(function(response){ resolve(response); })
      .fail(function(err){ reject(err); });
    });
  };

  var OpenWikiSearch = function(callbackName){
    var openSearch = function(query){
      var url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search='+query+'&format=json&callback='+callbackName;
      jQuery('head').append('<script src="'+url+'" type="text/javascript"></script>');
    };

    return {
      search: openSearch
    };
  };

  //var OpenWiki = OpenWikiSearch('sug');

  var source = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    identify: function(obj) { console.log(obj); return obj.word; },
    remote: {
      //url: 'https://api.datamuse.com/sug?s=%QUERY',
      url: '/opensearch?query=%QUERY',
      wildcard: '%QUERY'
    }
  });

  jQuery(document).ready(function(){
    //OpenWiki.search('andre');

    jQuery('#suggestion .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 2
    }, {
      name: 'muse-suggesions',
      display: 'value',
      source: source,
      limit: 9,
      templates: {
        empty: [
          '<div class="empty-message">',
            'unable to find any Best Picture winners that match the current query',
          '</div>'
        ].join('\n'),
        suggestion: Handlebars.compile('<div>{{word}}</div>')
      }
    });

    jQuery('#suggestion .typeahead').bind('typeahead:select', function(ev, suggestion) {
      //console.log('Selection: ', suggestion);
      //render(suggestion.word);
    });
  });


}(document, jQuery));
