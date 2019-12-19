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

});