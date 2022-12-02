const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { jwtBuilder } = require('../helpers/jwt');



const CrearUsuario = async (req, res = response) => {

    const { email, password, name } = req.body;
    try {
        // Validaciones de BD
        let usuario = await Usuario.findOne({ email: email }).exec();
        //let usuario2 = await Usuario.findById('636439a25a840f5f42c2f000').exec();

        // Validar el email
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya hay un usuario registrado con ese mail.'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario(req.body);

        // Hashear pass
        const salt = bcrypt.genSaltSync(10);
        dbUser.password = bcrypt.hashSync(password, salt);


        // Generar JWT
        const token = await jwtBuilder(dbUser.id, name);

        // Crear usuario de DB
        await dbUser.save();


        // Generar response
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token,
            email
        });

    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Algo salio mal, contacte al departamento de soporte.'
        });
    }
};

const LoginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        // Validamos que exista el usuario
        let usuario = await Usuario.findOne({ email: email }).exec();

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no está registrado'
            });
        }

        // Validamos si corresponde el password
        const passValid = bcrypt.compareSync(password, usuario.password);

        if (!passValid) {
            return res.status(400).json({
                ok: false,
                msg: 'Clave inválida'
            });
        }

        // Si todo es valido se  genera el jwt
        const jtoken = await jwtBuilder(usuario.id, usuario.name);

        return res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: jtoken,
            email:usuario.email
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        });
    }

    /*   return res.json({
          ok: true,
          msg: 'Login de usuario /'
      }); */
};

const TokenValidator = async(req, res = response) => {

    const {uid} = req;

    // Cargamos los datos del usuario segun si uid
    let usuario = await Usuario.findById(uid).exec();
    const token = await jwtBuilder(uid,usuario.name);

    return res.status(200).json({
        ok: true,
        uid,
        token,
        name:usuario.name,
        email:usuario.email
    });

};



module.exports = {
    CrearUsuario,
    LoginUsuario,
    TokenValidator
};