const { Router } = require('express');
const { check } = require('express-validator');
const { CrearUsuario, LoginUsuario, TokenValidator } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crear usuario
router.post(
    '/new',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','La contraseña es obligatoria').isLength({min:6}),
        check('name','el nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    CrearUsuario);

// Login de usuario
router.post(
    '/', 
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','La contraseña es obligatoria').isLength({min:6}),
        validarCampos
    ],
    LoginUsuario
);

// Validar y revalidar token
router.get('/renew', validarJWT ,TokenValidator);


module.exports = router;