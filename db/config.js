const mongoose = require("mongoose");

const db_conecction = async() => {

    try {
        await mongoose.connect(
            process.env.DB_CONN,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: true
            });

            console.log('BD online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la BD');
    }
};

module.exports = {
    db_conecction
};