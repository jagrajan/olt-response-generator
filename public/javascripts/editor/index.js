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

function saveEditor () {
    if (typeof(Storage) !== 'undefined') {
        var text = simplemde.value();
        // Store
        localStorage.setItem("olt_editor_save", text);
    }
}

function createQuickSnippet(button) {
    
}

function renderResponse () {
    var w = window.open();
    var html = unescapeHtml(converter.makeHtml(simplemde.value()));
    $(w.document.body).html(html);

    var head = w.document.head;
    var link = w.document.createElement('link');

    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.css'

    head.appendChild(link)

    $(w.document.body).find('hr').replaceWith('<div class="ui divider"></div>');
    $(w.document.body).find('blockquote')
        .css({'border-left' : '5px solid #eeeeee',
                'margin' : '1em 2em',
                'padding' : '9px 18px'});
    $(w.document.body).find('*').css({'font-family': '"Trebuchet MS", Helvetica, sans-serif'});
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

    $('.render-button').click(renderResponse);
    $('.quick-snippet-button').click(function() {
        button = $(this);
        $(button).addClass('loading');
        var selectedText = simplemde.codemirror.getSelection();
        $.ajax({
            dataType: 'json',
            url: '/api/v1/snippets/quick_create',
            success: function(data) {
                if (data.success) {
                    $(button).removeClass('loading').addClass('green');
                } else {
                    $(button).removeClass('loading').addClass('red');
                }
                setTimeout(function() {
                    $(button).removeClass('green red');
                }, 2000);
            },
            type: 'POST',
            data: {'content': selectedText}
        });
    });



    if (typeof(Storage) !== 'undefined') {
        var text = localStorage.getItem("olt_editor_save");
        if (text !== undefined && text !== null && text !== '') {
            simplemde.value(text);
        }
        setInterval(saveEditor, 3000);
    }
});
