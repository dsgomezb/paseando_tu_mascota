$(document).ready(function(){
    //Se inicializar el datatable de usuarios
    var t = $('#orders_table').DataTable({
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

//Se hace la peticion ajax para ver el detalle del pedido
$("#orders_table").on("click", ".detail", function(){
    var id =  $(this).data('id');
    $.ajax({
        type: "GET",
        url: "/orders/detail/"+id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            if(data.success != false){
                //Se llenan los labels del modal con los valores que devuelve la peticion
                $("#id_master_order").text(data.order_master[0].id_master_order);
                $("#name_establecimiento").text(data.order_master[0].name_establecimiento);
                $("#names").text(data.order_master[0].names);
                $("#user_address").text(data.order_master[0].user_address);
                $("#name_order_status").text(data.order_master[0].name_order_status);
                $("#total_value_order").text(data.order_master[0].total_value_order);
                $("#phone").text(data.order_master[0].phone);
                $("#email").text(data.order_master[0].email);
                $.each(data.order, function(index, value){
                    /* Vamos agregando a nuestra tabla de detalle de pedido las filas necesarias */
                    $("#detail_order_table").append("<tr><td>" + value.id_product + "</td><td>" + value.name_product + "</td><td>" + value.name_presentation_product + "</td><td>" + value.value_iva_product + "</td></tr>");
                });
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

//Se hace la peticion ajax para cambiar el estado del pedido
$("#orders_table").on("click", ".edit_status", function(){
    var id =  $(this).data('id');
    $.ajax({
        type: "GET",
        url: "/orders/status_params/"+id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            if(data.success != false){
                //Se llenan los labels del modal con los valores que devuelve la peticion
                $("#status_order").empty();
                $("#id_master_order_modal").val(data.id);
                $.each(data.order_status, function(id,value){
                    $("#status_order").append('<option value="'+value.id_order_status+'">'+value.name_order_status+'</option>');
                });
                $("#modal_change_status_order").modal();
            }
        },
        error: function(err) {
        var msg = 'Status: ' + err.status + ': ' + err.responseText;
        console.log(msg);
        }
    });
    return false;
});



//Se hace la peticion ajax para cambiar el estado del pedido
$('#form_save_order_status').on('submit', (e) => {
    e.preventDefault();
    //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
    var formData = new Object();
    formData.status_order = $("#status_order").val();
    formData.id_master_order_modal = $("#id_master_order_modal").val();

    //Petición ajax para envío de la info del form
    $.ajax({
        type: 'POST',
        url: '/orders/chenge_status_order',
        data: formData,
        cache: false,
        success: function(data){
            if(data == true){
                Swal.fire({
                    title: lang.exit,
                    text: lang.orders.exit_update_status,
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: lang.accept,                    
                }).then((result)=>{
                    if(result.value){
                        //Se recarga la pagina al dar clic en aceptar
                        window.location.href = "/orders"
                    }
                });
            }
        },
        error: function(err) {
        var msg = 'Status: ' + err.status;
        console.log(msg);
        }
    });
    return false;
});