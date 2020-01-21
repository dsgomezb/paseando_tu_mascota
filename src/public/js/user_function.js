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
                    $("#user_username").text(data.username);
                    $("#user_profile").text(data.name_profile);
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

    //Se hace la peticion ajax para inactivar un usuario
    $("#users_table").on("click", ".inactive", function(){
        //Se muestra ventana alert donde se pregunta al usuario si desea confirmar la eliminación
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
            //Si el usuario acepta, se hace la peticion para eliminarse
            if(result.value){
                var id =  $(this).data('id');
                $.ajax({
                    type: "GET",
                    url: "/users/inactive/"+id,
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


    //Se hace la peticion ajax para activar un usuario
    $("#users_table").on("click", ".active", function(){
        //Se muestra ventana alert donde se pregunta al usuario si desea confirmar la eliminación
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
            //Si el usuario acepta, se hace la peticion para eliminarse
            if(result.value){
                var id =  $(this).data('id');
                $.ajax({
                    type: "GET",
                    url: "/users/active/"+id,
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

    //Se hace la peticion ajax para guardar el usuario
    $('#form_save').on('submit', (e) => {
        e.preventDefault();
        //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
        var formData = new Object();
        formData.document = $("#document").val();
        formData.names = $("#names").val();
        formData.email = $("#email").val();
        formData.phone = $("#phone").val();
        formData.username = $("#username").val();
        formData.password = $("#password").val();
        formData.id_profile = $("#profile").val();
        if(formData.id_profile == 0){
            Swal.fire({
                title: lang.error,
                text: lang.user.profile_required,
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
            url: '/users/register',
            data: formData,
            cache: false,
            success: function(data){
                if(data == 'username'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.user.username_invalid,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == 'document'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.user.document_invalid,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == 'email'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.user.email_invalid,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == true){
                    Swal.fire({
                        title: lang.exit,
                        text: lang.user.exit_register,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    }).then((result)=>{
                        if(result.value){
                            //Se recarga la pagina al dar clic en aceptar
                            window.location.href = "/users"
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

    //Se hace la peticion ajax para actualizar el usuario
    $('#form_update').on('submit', (e) => {
        e.preventDefault();
        //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
        var formData = new Object();
        formData.document = $("#document").val();
        formData.names = $("#names").val();
        formData.email = $("#email").val();
        formData.phone = $("#phone").val();
        formData.username = $("#username").val();
        formData.password = $("#password").val();
        formData.user_id = $("#user_id").val();

        //Petición ajax paa envío de la info del form
        $.ajax({
            type: 'POST',
            url: '/users/update',
            data: formData,
            cache: false,
            success: function(data){
                if(data == 'username'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.user.username_invalid,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == 'document'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.user.document_invalid,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == 'email'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.user.email_invalid,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == true){
                    Swal.fire({
                        title: lang.exit,
                        text: lang.user.exit_updated,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    }).then((result)=>{
                        if(result.value){
                            //Se recarga la pagina al dar clic en aceptar
                            window.location.href = "/users"
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
