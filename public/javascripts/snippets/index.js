var converter = new showdown.Converter();
converter.setFlavor('github');

function unescapeHtml(safe) {
    return safe.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

$(document).ready(function() {
    $('.convert-markdown').each(function() {
        var text = $(this).html();
        $(this).html(unescapeHtml(converter.makeHtml(text)));
    });
});