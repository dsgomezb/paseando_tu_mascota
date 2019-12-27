$(document).ready(function(){
    //Se inicializar el datatable de usuarios
    var t = $('#products_table').DataTable({
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


    $("#unitary_value_product").keyup(function(){
        var unitary_value_product =  $("#unitary_value_product").val();
        var iva_product =  $("#iva_product").val();
        var product_iva = (unitary_value_product*iva_product)/100;
        product_iva = parseFloat(unitary_value_product)+parseFloat(product_iva);
        $("#value_iva_product").val(product_iva);
    });

    $("#iva_product").keyup(function(){
        var unitary_value_product =  $("#unitary_value_product").val();
        var iva_product =  $("#iva_product").val();
        var product_iva = (unitary_value_product*iva_product)/100;
        product_iva = parseFloat(unitary_value_product)+parseFloat(product_iva);
        $("#value_iva_product").val(product_iva);
    });

    $("#button_new_category").on("click", function(){
        $("#modal_button_new_category").modal();
    });

    $("#button_new_presentation_product").on("click", function(){
        $("#modal_button_new_presentation_product").modal();
    });

    //Se hace la peticion ajax para guardar la categoria del producto
    $('#form_save_category_product').on('submit', (e) => {
        e.preventDefault();
        //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
        var formData = new Object();
        formData.name_category_product = $("#name_category").val();
        formData.status_category_product = $("#status_category").val();

        //Petición ajax paa envío de la info del form
        $.ajax({
            type: 'POST',
            url: '/products/register_category_product',
            data: formData,
            cache: false,
            success: function(data){
                if(data == 'name_category_product'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.category.name_category_product,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == true){
                    Swal.fire({
                        title: lang.exit,
                        text: lang.category.exit_register,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    }).then((result)=>{
                        if(result.value){
                            //Se recarga la pagina al dar clic en aceptar
                            window.location.href = "/products"
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

    //Se hace la peticion ajax para guardar la presentacion del producto
    $('#form_save_presentation_product').on('submit', (e) => {
        e.preventDefault();
        //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
        var formData = new Object();
        formData.name_presentation_product = $("#name_presentation_product").val();
        formData.status_presentation_product = $("#status_presentation_product").val();

        //Petición ajax para envío de la info del form
        $.ajax({
            type: 'POST',
            url: '/products/register_presentation_product',
            data: formData,
            cache: false,
            success: function(data){
                if(data == 'name_presentation_product'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.presentation_product.name_presentation_product,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == true){
                    Swal.fire({
                        title: lang.exit,
                        text: lang.presentation_product.exit_register,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    }).then((result)=>{
                        if(result.value){
                            //Se recarga la pagina al dar clic en aceptar
                            window.location.href = "/products"
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

    //Se hace la peticion ajax para guardar la el producto
    $('#form_save_product').on('submit', (e) => {
        e.preventDefault();
        var data = new FormData(e.target);
        //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
        $('#form_save_product').serialize();
        var formData = new Object();
        var id_establecimiento = $("#id_establecimiento").val();
        var id_category_product = $("#id_category_product").val();
        var id_presentation_product = $("#id_presentation_product").val();
        var image_product = $("#image_product").val();
        console.log($("#value_iva_product").val());
        if(image_product != ''){
            var fileExtension = image_product.substring(image_product.lastIndexOf('.') + 1);
            data.append('fileExtension',fileExtension);
    
            if(fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'jpeg'){
                Swal.fire({
                    title: lang.error,
                    text: lang.product.extension_error,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: lang.accept,                    
                });
                return false;
            }
        }
        
        if(formData.id_establecimiento == 0){
            Swal.fire({
                title: lang.error,
                text: lang.product.establecimiento_required,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: lang.accept,                    
            });
            return false;
        }

        if(formData.id_category_product == 0){
            Swal.fire({
                title: lang.error,
                text: lang.product.category_required,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: lang.accept,                    
            });
            return false;
        }

        if(formData.id_presentation_product == 0){
            Swal.fire({
                title: lang.error,
                text: lang.product.presentation_required,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: lang.accept,                    
            });
            return false;
        }
        
        //Petición ajax para envío de la info del form
        $.ajax({
            type: 'POST',
            url: '/products/register_product',
            data: data,
            cache: false,
            contentType: false,
            processData: false ,
            success: function(data){
                if(data == 'name_product'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.product.name_product,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == 'internal_code_product'){
                    Swal.fire({
                        title: lang.error,
                        text: lang.product.internal_code_product,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    });
                }else if(data == true){
                    Swal.fire({
                        title: lang.exit,
                        text: lang.product.exit_register,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: lang.accept,                    
                    }).then((result)=>{
                        if(result.value){
                            //Se recarga la pagina al dar clic en aceptar
                            window.location.href = "/products"
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
    
    //Se hace la peticion ajax para marcar como no disponible un establecimiento
    $("#products_table").on("click", ".no_disponible", function(){
        //Se muestra ventana alert donde se pregunta al usuario si desea confirmar la inactivación
        Swal.fire({
            title: lang.product.unavailable,
            text: lang.product.unavailable_sure,
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
                    url: "/products/unavailable/"+id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        if(data == true){
                            Swal.fire({
                                title: lang.exit,
                                text: lang.product.exit_unavailable,
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

    //Se hace la peticion ajax para marcar como disponible un establecimiento
    $("#products_table").on("click", ".disponible", function(){
        //Se muestra ventana alert donde se pregunta al usuario si desea confirmar la inactivación
        Swal.fire({
            title: lang.product.available,
            text: lang.product.available_sure,
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
                    url: "/products/available/"+id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        if(data == true){
                            Swal.fire({
                                title: lang.exit,
                                text: lang.product.exit_available,
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

});