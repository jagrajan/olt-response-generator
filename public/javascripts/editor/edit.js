$(document).ready(function() {
    var simplemde = new SimpleMDE({ element: $("#main-editor")[0] });
    $('.ui.checkbox').checkbox();
    $('.delete-snippet-modal-show').click(function() {
        $('.ui.basic.modal').modal('show');
    });
});