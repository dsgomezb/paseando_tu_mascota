$(document).ready(function(){
    //Se inicializar el datatable de usuarios
    var t = $('#establecimientos_table').DataTable({
        "language":{
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        },
        "scrollCollapse": true,
        "columnDefs": [{
        "searchable": false,
        "orderable": false,
        "targets": 0
    }],
    "bLengthChange": false,
    "bFilter": true,
    "bInfo": false,
    "scrollX": true,
    "order": [[ 1, 'asc' ]]
    });

    //Se agrega en el datatable la primera columna para numerar las filas
    t.on('order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        });
    }).draw();

    $("#depto").on("change", function(){
        var id_depto =  $(this).val();
        $.ajax({
            type: "GET",
            url: "/establecimientos/get_municipios/"+id_depto,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                if(data.success != false){
                    //Se llenan los option del selector de municipio dependiendo del departamento seleccionado
                    $("#municipio").empty();
                    $.each(data, function(id,value){
                        $("#municipio").append('<option value="'+value.id_muni+'">'+value.nombre_muni+'</option>');
                    });
                }
            },
            error: function(err){
            var msg = 'Status: ' + err.status + ': ' + err.responseText;
            }
        });
    });

});