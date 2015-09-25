/**
 * The `shortener` function returns an object containing functions
 * of the following form:
 *
 *   {
 *     shorten,
 *     expand,
 *     digits,
 *     path,
 *     nextid
 *   }
 *
 * See the documentation for each function below.
 *
 * @example
 * var shortly = shortener(alphabet, protocol, ids);
 * shortly.shorten('http://www.google.com') => 'http://short.ly/bef'
 * shortly.expand('http://short.ly/bef') => 'http://www.google.com'
 *
 * @param alphabet the alphabet that will be used in the shortened URL
 * @param protocol the protocol and domain used in the shortened URL
 * @param ids a starting ID that is used for shortening the URL
 * @returns an object of functions
 */
function shortener(alphabet, protocol, ids) {
  // A map used to map ids to their corresponding long URLs.
  var urlmap = {};

  /**
   * `nextid` returns the next id to be used in the shortening process.
   * It uses the `ids` parameter from the enclosing function as its
   * starting point.
   *
   * @returns {number}
   */
  function nextid() {
    return ids++;
  }

  /**
   * `getPath` returns the "path" part of a URL.
   *
   * @example
   * getPath('http://short.ly/bef') => 'bef'
   *
   * @param url a full URL
   * @returns {string}
   */
  function getPath(url) {
    var splitUrl = url.split('/');
    return splitUrl[3];
  }

  /**
   * `toDigits` converts a given `id` into an array of numbers.
   * This function is used as part of the `shorten` function below.
   * It implements the following pseudocode for generating the
   * array of numbers:
   *
   * do:
   *   remainder = id % length of alphabet
   *   add remainder to the list of digits
   *   id = floor of id / length of alphabet
   * while(id > 0)
   * return the reverse of the list of digits
   *
   * @example
   * toDigits(4097) => [1, 4, 5]
   *
   * @param id the id of the long URL
   * @returns {Array.<number>}
   */
  function toDigits(id) {
    var alphabetLength = alphabet.length;
    var idArray = [];
    do {
      var remainder = id % alphabetLength;
      idArray.push(remainder);
      id = Math.floor(id/alphabetLength);
    } while(id > 0);

    return idArray.reverse();
  }

  /**
   * `shorten` takes a long URL (`urll`) and translates it into a
   * short URL. The `shorten` function uses the `toDigits` function
   * to retrieve an array of digits generated from the next id. It
   * then translates each digit into the corresponding character in
   * the alphabet and then concatenates each character to form the
   * string which represents the shortened path. It adds the a mapping
   * in `urlmap` from the id to `urll` and returns the concatenation
   * of the `protocol` and the shortened path to create the short URL.
   *
   * @example
   * shorten('http://www.google.com') => 'http://short.ly/bef'
   *
   * @param urll a long (original) URL
   * @returns {string}
   */
  function shorten(urll) {
    var id = nextid();
    id = toDigits(id);
    var code = "";
    var index;
    // TODO: sloppy for loop, replace with foreach?
    for(index = 0; index < id.length; index++){
      code+=alphabet.charAt(id[index]);
    }
    urlmap[id] = urll;
    return protocol + code;
  }

  /**
   * `expand` converts a short URL into the original long URL.
   * This function retrieves the path (using `getPath`) from the short
   * URL and iterates over each character in the path getting its
   * index in the alphabet. It accumulates each index into an array.
   * It then iterates over that array converting it into the
   * original ID. Use the ID to lookup the corresponding long URL
   * in `urlmap`.
   *
   * @param urls the short URL
   * @returns {string}
   */
  function expand(urls) {
    var path  = getPath(urls);
    var id = [];
    var index;
    // TODO: sloppy for loop, replace with foreach?
    for (index = 0; index<path.length; index++){
      id.push(alphabet.indexOf(path[index]));
    }
    return urlmap[id];
  }

  // Return an object with properties for each of the functions
  // defined above. In a real implementation we would likely only
  // expose the `shorten` and the `expand` function, however, we
  // define tests below to make sure your implementation for all
  // functions is working properly.
  return {
    shorten : shorten,
    expand  : expand,
    digits  : toDigits,
    path    : getPath,
    nextid  : nextid
  };
}

//// Setup Code - DO NOT MODIFY //////////////////////////////////////

// The alphabet we will use for shortening URLs.
var alphabet =
      'abcdefghijklmnopqrstuvwxyz' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      '0123456789';

// The protocol and domain we will use for shortened URLs.
var protocol = 'http://short.ly/';

// The starting ID number we will use to identify shortened URLs.
var startID  = 4097;

//////////////////////////////////////////////////////////////////////

//// Below are tests to ensure that your implementation is working
///  correctly
//// DO NOT MODIFY

// Create the URL shortener object.
var shortly = shortener(alphabet, protocol, startID);

// Check nextId //
check(shortly.nextid(), 4097);
check(shortly.nextid(), 4098);
check(shortly.nextid(), 4099);
check(shortly.nextid(), 4100);

// Check getPath //
check(shortly.path('http://short.ly/bef'), 'bef');

// Check toDigits //
check(shortly.digits(4097).toString(), [1, 4, 5].toString());
check(shortly.digits(4098).toString(), [1, 4, 6].toString());

// Create the URL shortener object.
var shortly = shortener(alphabet, protocol, startID);

check(shortly.shorten('http://www.google.com'), 'http://short.ly/bef');
check(shortly.shorten('https://www.cics.umass.edu'), 'http://short.ly/beg');
check(shortly.shorten('https://www.youtube.com'), 'http://short.ly/beh');
check(shortly.shorten('https://www.netflix.com'), 'http://short.ly/bei');
check(shortly.shorten('http://www.nytimes.com'), 'http://short.ly/bej');
check(shortly.shorten('https://nodejs.org/en'), 'http://short.ly/bek');
check(shortly.shorten('http://umass-cs-326.github.io'), 'http://short.ly/bel');

check(shortly.expand('http://short.ly/bef'), 'http://www.google.com');
check(shortly.expand('http://short.ly/beg'), 'https://www.cics.umass.edu');
check(shortly.expand('http://short.ly/beh'), 'https://www.youtube.com');
check(shortly.expand('http://short.ly/bei'), 'https://www.netflix.com');
check(shortly.expand('http://short.ly/bej'), 'http://www.nytimes.com');
check(shortly.expand('http://short.ly/bek'), 'https://nodejs.org/en');
check(shortly.expand('http://short.ly/bel'), 'http://umass-cs-326.github.io');

//// Utility Test Function - DO NOT MODIFY ////

function check(yours, expected) {
  if (yours === expected) {
    console.log(yours + ' equals ' + expected + ' [PASSED]');
  }
  else {
    console.log(yours + ' does not equal ' + expected + ' [FAILED]');
  }
}
