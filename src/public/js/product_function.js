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
        var iva_product =  $("#iva").val();
        var product_iva = (unitary_value_product*iva_product)/100;
        $("#product_iva").val(product_iva);
    });

    $("#iva").keyup(function(){
        var unitary_value_product =  $("#unitary_value_product").val();
        var iva_product =  $("#iva").val();
        var product_iva = (unitary_value_product*iva_product)/100;
        product_iva = parseInt(unitary_value_product)+parseInt(product_iva);
        $("#product_iva").val(product_iva);
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

    //
});