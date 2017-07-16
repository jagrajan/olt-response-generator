var converter = new showdown.Converter();
$('.convert-markdown').each(function() {
    var text = $(this).html();
    $(this).html(converter.makeHtml(text));
});