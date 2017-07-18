var simplemde = new SimpleMDE({element: $('#main-editor')[0]});

var converter = new showdown.Converter();
converter.setFlavor('github');

function unescapeHtml(safe) {
    return safe.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

function copyToClipboard(text) {
    console.log(text);
    element = $('<textarea>').appendTo('body').val(text).select();
    document.execCommand('copy');
    element.remove();
}

function filterSnippets() {
    //var showSnippets = 
}

$(document).ready(function() {
    $('.convert-markdown').each(function() {
        var text = $(this).html();
        $(this).html(unescapeHtml(converter.makeHtml(text)));
    });

    $('.content .raw').each(function() {
        var text = $(this).html();
        $(this).html(unescapeHtml(text));
    });

    $('.snippet-block').each(function() {
        var content = $(this).find('.content .raw').html();
        $(this).find('.copy-button').click(function() {
            copyToClipboard(unescapeHtml(content));
        });
        $(this).find('.insert-button').click(function() {
            pos = simplemde.codemirror.getCursor();
            simplemde.codemirror.setSelection(pos, pos);
            simplemde.codemirror.replaceSelection(content);
        });
    });
});
