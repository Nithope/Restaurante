const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cpf_cnpj = require("cpf_cnpj").CNPJ;
const checkAuth = require("../middleware/check-auth");

const Restaurante = require('../models/restaurante');

router.post('/register', checkAuth, (req, res, next) => {
    Restaurante.find({ cnpj: req.body.cnpj })
        .exec()
        .then(restaurante => {
            if (restaurante.length >= 1) {
                return res.status(409).json({
                    message: 'CNPJ already registed'
                });
            } 
            else {
                if (cpf_cnpj.isValid(req.body.cnpj)) {
                    const restaurante = new Restaurante({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        phone: req.body.phone,
                        cnpj: req.body.cnpj,
                        specialty: req.body.specialty
                    });
                    restaurante
                        .save()
                        .then(result => {
                            console.log(result);
                            return res.status(201).json({
                                message: 'Restaurante Created'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
                else {
                    return res.status(400).json({
                        message: 'CNPJ invalid'
                    });
                }
            }
        });
});

router.put('/', checkAuth, (req, res, next) => {
    Restaurante.find({ cnpj: req.body.cnpj })
        .exec()
        .then(restaurante => {
            if (restaurante.length >= 1) {
                return res.status(409).json({
                    message: 'CNPJ already registed'
                });
            } 
            else {
                if (cpf_cnpj.isValid(req.body.cnpj)) {
                    const id = req.body.id;
                    Restaurante.update({ _id: id }, {
                        $set: {
                            name: req.body.name,
                            phone: req.body.phone,
                            cnpj: req.body.cnpj,
                            specialty: req.body.specialty
                        }
                    })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Restaurante updated'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                } 
                else {
                    return res.status(400).json({
                        message: 'CNPJ invalid'
                    });
                }
            }
        });
});

router.delete('/:restauranteId', checkAuth, (req, res, next) =>{
    const id = req.params.restauranteId;
    Restaurante.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Restaurante deleted'
        });
      })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
});

router.get('/', checkAuth, (req, res, next) =>{

    var page = parseInt(req.query.page) || 0;
    var limit = parseInt(req.query.limit) || 20; 
    var orderField = req.query.orderField || "name";
    var orderBy = req.query.orderBy || "desc";
    
      Restaurante.find()
      .limit(limit)
      .skip(limit*page)
      .sort([[orderField,orderBy]])
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json({
              restaurantes: doc
          });
        } else {
          res.status(404).json({
               message: "No valid entry"
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });

});

module.exports = router;