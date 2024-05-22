import nodemailer from "nodemailer";


// Configuración del transporte SMTP
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'albertosco77@gmail.com', // Tu correo de Gmail
        pass: 'cyqw mavx klkc hlla' // Contraseña de tu correo de Gmail
    }
});

export const sendEmail = async (to, pet) => {
    // Configuración del correo
let mailOptions = {
    from: 'ADOPET <albertosco77@gmail.com>',
    to,
    text: 'Quiero adoptar al cachorro: ' + pet,
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error al enviar el correo:', error);
    }
    console.log('Correo enviado:', info.response);
});
};