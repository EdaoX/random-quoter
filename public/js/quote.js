$(function () {

	$('#quote-to-clipboard').mousedown(function ( ev ) {
		if(ev.which == 1 && App.elementToClipboard($('.link')[0], true)) {
			$(this).addClass('copied');
		}

	});

});
