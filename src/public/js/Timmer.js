$(document).ready(function() {

    // $('#div-id').timer({
    //     countdown: true,
    //     duration: '30s',
    //     callback: function() {
    //         alert('Time up!');
    //     }
    // });

    var data = {};



    $.ajax({
        type: 'POST',
        data: data,
        contentType: 'application/json',
        url: '/crudnodejs/endpoint',
        success: function(data) {
            $.each(data, function(index, value) {

                var Ced = "#" + value.Cedula;

                var fechaCompra;
                var hoy;
                var time;
                if (value.duracion == 1) {
                    fechaCompra = moment(value.fecha_compra);
                    fechaCompra.add(1, "month");
                    hoy = moment();
                    time = fechaCompra.diff(hoy, "seconds");
                } else if (value.duracion == 2) {
                    fechaCompra = moment(value.fecha_compra);
                    fechaCompra.add(1, "year");
                    hoy = moment();
                    time = fechaCompra.diff(hoy, "seconds");

                }



                $(Ced).timer({
                    countdown: true,
                    duration: time,
                    callback: function() {

                        $(Ced).closest('tr').remove();
                        $.ajax({
                            type: 'POST',
                            data: { saludo: value.Cedula },
                            url: '/crudnodejs/deleteRelation',
                            success: function(data) {
                                console.log("Membresia Terminada");
                            }
                        });
                    }

                });
            });
        }
    });






});

$(document).on('click', '#mensaje', function(event) {
    window.location.replace("/");
});