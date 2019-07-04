var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ================================
// Busqueda por coleccion
// ================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    if (tabla === 'hospital') {


        buscarHospitales(busqueda, regex)
            .then(respuestas => {

                res.status(200).json({

                    ok: true,
                    hospitales: respuestas
                });

            });

    }



    if (tabla === 'medico') {


        buscarMedicos(busqueda, regex)
            .then(respuestas => {

                res.status(200).json({

                    ok: true,
                    medicos: respuestas
                });

            });
    }



    if (tabla === 'usuario') {

        buscarUsuarios(busqueda, regex)
            .then(respuestas => {

                res.status(200).json({

                    ok: true,
                    usuarios: respuestas
                });

            });

    }




});



// ================================
// Busqueda general
// ================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({

                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]

            });

        });



});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(hospitales)
                }
            });


    });


}


function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role ')
            .or([{ nombre: regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })


    });


}



function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos');
                } else {
                    resolve(medicos)
                }
            });


    });


}

module.exports = app;