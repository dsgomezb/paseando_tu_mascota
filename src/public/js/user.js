//Evento incial del sistema para mostrar el datatable de usuarios
$(document).ready(function(){
    var t = $('#users_table').DataTable({
        "columnDefs": [{
        "searchable": false,
        "orderable": false,
        "targets": 0
    }],
    "bLengthChange": false,
    "bFilter": true,
    "bInfo": false,
    "order": [[ 1, 'asc' ]]
    });

    t.on('order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        });
    }).draw();
});