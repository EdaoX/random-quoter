$( function () {

	var location     = window.location.hostname == 'localhost' ? 'http://localhost:' + window.location.port : window.location.protocol + '//' + window.location.hostname;
	var $quote       = $( '.quote' );
	var $quoteBody   = $( '.body' );
	var $quoteAuthor = $( '.author' );
	var $link        = $( '.link' );
	var $quoteCopyButton = $( '.quoter-icon-button' );
	var timeout      = 60; // Seconds

	function handleNewQuote ( quote ) {
		$quote.fadeOut( 500, function () {
			$quoteBody.text( quote.body );
			$quoteAuthor.text( quote.author );
			$link.text( location + '/quotes/' + quote.uuid );
			$quoteCopyButton.removeClass('copied');

			$quote.fadeIn( 500 );
		} );
	}

	setInterval( function () {
		$.get( '/api/quotes/random', {}, handleNewQuote);
	}, timeout * 1000 );

} );
