window.onload = () => {
	$('pre code').each(function (i, block) {
		hljs.highlightBlock(block);
	});
}