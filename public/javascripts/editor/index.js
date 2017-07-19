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
    element = $('<textarea>').appendTo('body').val(text).select();
    document.execCommand('copy');
    element.remove();
}

function filterSnippets() {
    var showSnippets = $('#showSnippets').checkbox('is checked');
    var showStockphrases = $('#showStockphrases').checkbox('is checked');
    var showTemplates = $('#showTemplates').checkbox('is checked');
    var showMineOnly = $('#showMineOnly').checkbox('is checked');
    var searchQuery = $('#searchSnippets').val();
    $('.snippet-block').show();
    if (showSnippets || showStockphrases || showTemplates) {
        $('.snippet-block').hide();
        $('.snippet-block').each(function() {
            if (showStockphrases && $(this).data('category') === 'stockphrase') {
                $(this).show();
            } else if (showSnippets && $(this).data('category') === 'snippet') {
                $(this).show();
            } else if (showTemplates && $(this).data('category') === 'template') {
                $(this).show();
            }
        })
    }
    if(showMineOnly) {
        $('.snippet-block[data-author != ' + currentUserId + ']').hide();
    }
    if(searchQuery) {
        searchQuery = searchQuery.toLowerCase();
        $('.snippet-block:visible').each(function() {
            if ($(this).find('.header').html().toLowerCase().indexOf(searchQuery) < 0) {
                $(this).hide();
            }
        });
    }

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

    $('.ui.checkbox').checkbox({
        onChange: function() {
            filterSnippets();
        }
    });

    $("#searchSnippets").on('change keyup paste', function() {
        filterSnippets();
    });

    $('.snippet-block').each(function() {
        var content = $(this).find('.content .raw').html();
        $(this).find('.copy-button').click(function() {
            copyToClipboard(unescapeHtml(content));
        });
        $(this).find('.insert-button').click(function() {
            pos = simplemde.codemirror.getCursor();
            simplemde.codemirror.setSelection(pos, pos);
            simplemde.codemirror.replaceSelection(unescapeHtml(content));
        });
    });
});
