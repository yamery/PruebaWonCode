$(document).ready(function() {
    var data2 = {};

    if ($("#Falta").length) {
        $.ajax({
            type: 'POST',
            data: data2,
            contentType: 'application/json',
            url: '/crudnodejs/idUser',
            success: function(data) {
                $.each(data, function(index, value) {

                    var Ced = "#Falta";

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
                                    console.log("Membresia terminada");
                                    window.location.replace("/");
                                }
                            });
                        }

                    });
                });
            }
        }); // Siempre será validado, incluso si #undiv no existe
    }


});