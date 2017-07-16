$(document).ready(function() {
    $('.open-delete-modal-button').click(function() {
        var id = $(this).data('id');
        var title = $(this).data('title');
        $('.delete-button').attr('href', '/snippets/delete/' + id);
        $('.snippet-delete-name').html(title);
        $('.ui.basic.modal').modal('show');
    });
});