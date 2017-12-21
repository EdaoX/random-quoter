if(PNotify){
	PNotify.prototype.options.delay = 2000;
}

function QuoterApplication () {

	this.elementToClipboard = function ( element, notify ) {

		var range = document.createRange();
		range.selectNode(element);
		var s = window.getSelection();

		var success;

		if(s.rangeCount > 0) s.removeAllRanges();
		s.addRange(range);

		try {
			if ( (success = document.execCommand( "copy" )) && notify && PNotify ) {
				new PNotify( {
					text : 'Link copiato negli appunti!',
					type  : 'success'
				} );
			}
		}
		catch ( e ) {
			// Copia non supportata
			success = false;
		}

		s.removeAllRanges();
		return success;
	};
}

var App = new QuoterApplication();
