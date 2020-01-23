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

});

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

    //Se hace la peticion ajax para guardar el establecimiento
    $('#form_save').on('submit', (e) => {
        e.preventDefault();
        //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
        var formData = new Object();
        formData.id_user = $("#user").val();
        formData.name_establecimiento = $("#establecimiento_name").val();
        formData.direccion_establecimiento = $("#address").val();
        formData.telefono_establecimiento = $("#phone").val();
        formData.id_muni = $("#municipio").val();

        //Administrador de establecimiento requerido
        if(formData.id_user == 0){
            Swal.fire({
                title: lang.error,
                text: lang.establecimiento.user_required,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: lang.accept,                    
            });
            return false;
        }

        //Municipio requerido
        if(formData.id_muni == 0){
            Swal.fire({
                title: lang.error,
                text: lang.establecimiento.municipio_required,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: lang.accept,                    
            });
            return false;
        }
        //Petición ajax paa envío de la info del form
        $.ajax({
            type: 'POST',
            url: '/establecimientos/register',
            data: formData,
            cache: false,
            success: function(data){
                        if(data == 'name_establecimiento'){
                            Swal.fire({
                                title: lang.error,
                                text: lang.establecimiento.name_establecimiento,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                        }else if(data == 'direccion_establecimiento'){
                            Swal.fire({
                                title: lang.error,
                                text: lang.establecimiento.direccion_establecimiento,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                        }else if(data == true){
                            Swal.fire({
                                title: lang.exit,
                                text: lang.establecimiento.exit_register,
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            }).then((result)=>{
                                if(result.value){
                                    //Se recarga la pagina al dar clic en aceptar
                                    window.location.href = "/establecimientos"
                                }
                            });
                        }else if(data == false){
                            Swal.fire({
                                title: lang.error,
                                text: lang.general.error_save,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                            return false;
                        }
            },
            error: function(err) {
            var msg = 'Status: ' + err.status;
            console.log(msg);
            }
        });
        return false;
        
    });

    //Se hace la peticion ajax para ver el detalle del establecimiento
    $("#establecimientos_table").on("click", ".detail", function(){
        var id =  $(this).data('id');
        $.ajax({
            type: "GET",
            url: "/establecimientos/detail/"+id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                if(data.success != false){
                    //Se llenan los labels del modal con los valores que devuelve la peticion
                    $("#name_establecimiento").text(data.name_establecimiento);
                    $("#direccion_establecimiento").text(data.direccion_establecimiento);
                    $("#telefono_establecimiento").text(data.telefono_establecimiento);
                    $("#establecimiento_admin").text(data.names);
                    $("#establecimiento_muni").text(data.nombre_muni);
                    $("#establecimiento_depto").text(data.name_depto);
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

    //Se hace la peticion ajax para inactivar un establecimiento
    $("#establecimientos_table").on("click", ".inactive", function(){
        //Se muestra ventana alert donde se pregunta al usuario si desea confirmar la inactivación
        Swal.fire({
            title: lang.inactive,
            text: lang.inactive_sure,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: lang.accept,
            cancelButtonText: lang.cancel
        }).then((result)=>{
            //Si el usuario acepta, se hace la peticion para inactivarse
            if(result.value){
                var id =  $(this).data('id');
                $.ajax({
                    type: "GET",
                    url: "/establecimientos/inactive/"+id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        if(data == true){
                            Swal.fire({
                                title: lang.exit,
                                text: lang.exit_inactive,
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,
                                allowOutsideClick: false
                            }).then((result)=>{
                                if(result.value){
                                    //Se recarga la pagina al dar clic en aceptar
                                    document.location.reload();
                                }
                            });
                        }else if(data == false){
                            Swal.fire({
                                title: lang.error,
                                text: lang.general.error_save,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                            return false;
                        }
                    },
                    error: function(err){
                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                    console.log(msg);
                    }
                });
            }
        });
        return false;
    });

    //Se hace la peticion ajax para activar un establecimiento
    $("#establecimientos_table").on("click", ".active", function(){
        //Se muestra ventana alert donde se pregunta al usuario si desea confirmar la activacion
        Swal.fire({
            title: lang.active,
            text: lang.active_sure,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: lang.accept,
            cancelButtonText: lang.cancel
        }).then((result)=>{
            //Si el usuario acepta, se hace la peticion para inactivarse
            if(result.value){
                var id =  $(this).data('id');
                $.ajax({
                    type: "GET",
                    url: "/establecimientos/active/"+id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        if(data == true){
                            Swal.fire({
                                title: lang.exit,
                                text: lang.exit_active,
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,
                                allowOutsideClick: false
                            }).then((result)=>{
                                if(result.value){
                                    //Se recarga la pagina al dar clic en aceptar
                                    document.location.reload();
                                }
                            });
                        }else if(data == false){
                            Swal.fire({
                                title: lang.error,
                                text: lang.general.error_save,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                            return false;
                        }  
                    },
                    error: function(err){
                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                    console.log(msg);
                    }
                });
            }
        });
        return false;
    });

    //Se hace la peticion ajax para actualizar el establecimiento
    $('#form_update').on('submit', (e) => {
        e.preventDefault();
        //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
        var formData = new Object();
        formData.id_user = $("#user").val();
        formData.name_establecimiento = $("#establecimiento_name").val();
        formData.direccion_establecimiento = $("#address").val();
        formData.telefono_establecimiento = $("#phone").val();
        formData.id_muni = $("#municipio").val();
        formData.establecimiento_id = $("#establecimiento_id").val();
        formData.id_establecimiento_user = $("#id_establecimiento_user").val();

        //Administrador de establecimiento requerido
        if(formData.id_user == 0){
            Swal.fire({
                title: lang.error,
                text: lang.establecimiento.user_required,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: lang.accept,                    
            });
            return false;
        }

        //Municipio requerido
        if(formData.id_muni == 0){
            Swal.fire({
                title: lang.error,
                text: lang.establecimiento.municipio_required,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: lang.accept,                    
            });
            return false;
        }
        //Petición ajax paa envío de la info del form
        $.ajax({
            type: 'POST',
            url: '/establecimientos/update',
            data: formData,
            cache: false,
            success: function(data){
                        if(data == 'name_establecimiento'){
                            Swal.fire({
                                title: lang.error,
                                text: lang.establecimiento.name_establecimiento,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                        }else if(data == 'direccion_establecimiento'){
                            Swal.fire({
                                title: lang.error,
                                text: lang.establecimiento.direccion_establecimiento,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                        }else if(data == true){
                            Swal.fire({
                                title: lang.exit,
                                text: lang.establecimiento.exit_updated,
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            }).then((result)=>{
                                if(result.value){
                                    //Se recarga la pagina al dar clic en aceptar
                                    window.location.href = "/establecimientos"
                                }
                            });
                        }else if(data == false){
                            Swal.fire({
                                title: lang.error,
                                text: lang.general.error_save,
                                icon: 'error',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: lang.accept,                    
                            });
                            return false;
                        }
            },
            error: function(err) {
            var msg = 'Status: ' + err.status;
            console.log(msg);
            }
        });
        return false;
    });

    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 5.057294, lng: -75.486537},
        zoom: 16
      });
      google.maps.Marker({position: {lat: 5.057294, lng: -75.486537}, map: map});
    }