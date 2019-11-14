$(document).ready(function(){
    //Se inicializar el datatable de usuarios
    var t = $('#users_table').DataTable({
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
    "order": [[ 1, 'asc' ]]
    });

    //Se agrega en el datatable la primera columna para numerar las filas
    t.on('order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        });
    }).draw();

    //Se hace la peticion ajax para ver el detalle del usuario
    $("#users_table").on("click", ".detail", function(){
        var id =  $(this).data('id');
        $.ajax({
            type: "GET",
            url: "/users/detail/"+id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                if(data.success != false){
                    //Se llenan los labels del modal con los valores que devuelve la peticion
                    $("#user_name").text(data.names);
                    $("#user_document").text(data.document);
                    $("#user_email").text(data.email);
                    $("#user_phone").text(data.phone);
                    $("#detalle").modal();
                }
            },
            error: function(err) {
            var msg = 'Status: ' + err.status + ': ' + err.responseText;
            console.log(msg);
          }
        });
        return false;
    });

    //Se hace la peticion ajax para eliminar un usuario
    $("#users_table").on("click", ".delete", function(){
        //Se muestra ventana alert donde se pregunta al usuario si desea confirmar la eliminación
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result)=>{
            //Si el usuario acepta, se hace la peticion para eliminarse
            if(result.value){
                var id =  $(this).data('id');
                $.ajax({
                    type: "GET",
                    url: "/users/delete/"+id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        if(data.success != false){
                            //Si se recibe respuesta del servidor de que se borro el usuario, 
                            //se muestra nuevo mensaje de confirmacion que le informa la eliminacion y posteriormente se recarga la pagina
                            Swal.fire({
                                title: 'eliminado',
                                text: "You won't be able to revert this!",
                                icon: 'info',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'aceptar',
                                allowOutsideClick: false
                            }).then((result)=>{
                                if(result.value){
                                    //Se recarga la pagina al dar clic en aceptar
                                    document.location.reload();
                                }
                            });
                        }   
                    },
                    error: function(err){
                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                    console.log(msg);
                    Swal.fire(
                        'Error!',
                        'Your file has been deleted.',
                        'error'
                        )
                    }
                });
            }
        });
        return false;
    });
});