$(document).ready(function(){
    //Se inicializar el datatable de usuarios
    var t = $('#schedules_table').DataTable({
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

//Se hace la peticion ajax para almacenar un horario
$('#form_save_shedule').on('submit', (e) => {
    e.preventDefault();
    var data = new FormData(e.target);
    //Se construye un nuevo objeto JSON y se ingresan todos la informacion del formulario para enviarla al back
    $('#form_save_product').serialize();
    var id_establecimiento = $("#id_establecimiento").val();
    if(id_establecimiento == 0){
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
    //Petición ajax para envío de la info del form
    $.ajax({
        type: 'POST',
        url: '/schedules/save',
        data: data,
        cache: false,
        contentType: false,
        processData: false ,
        success: function(data){
            if(data == 'schedule_name'){
                Swal.fire({
                    title: lang.error,
                    text: lang.shedules.name_schedule,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: lang.accept,                    
                });
            }else if(data == true){
                Swal.fire({
                    title: lang.exit,
                    text: lang.shedules.exit_register,
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: lang.accept,                    
                }).then((result)=>{
                    if(result.value){
                        //Se recarga la pagina al dar clic en aceptar
                        window.location.href = "/schedules"
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

//Se hace la peticion ajax para ver el detalle del horario
$("#schedules_table").on("click", ".detail", function(){
    var id =  $(this).data('id');
    $.ajax({
        type: "GET",
        url: "/schedules/detail/"+id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            if(data.success != false){
                //Se llenan los labels del modal con los valores que devuelve la peticion
                $("#name_establecimiento").text(data.name_establecimiento);
                $("#id_schedule").text(data.id_schedule);
                $("#name_schedule").text(data.name_schedule);
                $("#description_schedule").text(data.description_schedule);
                $("#start_hour_monday").text(data.start_hour_monday);
                $("#end_hour_monday").text(data.end_hour_monday);
                $("#start_hour_tuesday").text(data.start_hour_tuesday);
                $("#end_hour_tuesday").text(data.end_hour_tuesday);
                $("#start_hour_wednesday").text(data.start_hour_wednesday);
                $("#end_hour_wednesday").text(data.end_hour_wednesday);
                $("#start_hour_thursday").text(data.start_hour_thursday);
                $("#end_hour_thursday").text(data.end_hour_thursday);
                $("#start_hour_friday").text(data.start_hour_friday);
                $("#end_hour_friday").text(data.end_hour_friday);
                $("#start_hour_saturday").text(data.start_hour_saturday);
                $("#end_hour_saturday").text(data.end_hour_saturday);
                $("#start_hour_sunday").text(data.start_hour_sunday);
                $("#end_hour_sunday").text(data.end_hour_sunday);
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