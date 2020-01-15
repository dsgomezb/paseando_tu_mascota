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

