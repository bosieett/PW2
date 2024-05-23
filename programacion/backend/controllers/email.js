import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Configuración del transporte SMTP
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'albertosco77@gmail.com', // Tu correo de Gmail
        pass: process.env.EMAIL_PW // Contraseña de tu correo de Gmail
    }
});

export const sendEmail = async (to, pet, nombreDueno, nombreAdoptar, emailAdoptar) => {
    // Configuración del correo
let mailOptions = {
    from: 'ADOPET <albertosco77@gmail.com>',
    subject: 'Alguien está buscando a '+pet,
    to: to,
    html: `<html lang="es" class="translated-ltr"><head><style>
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
    
    a {
      color: #5D6975;
      text-decoration: underline;
    }
    
    body {
      position: relative;
      width: 21cm;  
      height: 29.7cm; 
      margin:  auto; 
      margin-top: 20px;
      color: #001028;
      background: #FFFFFF; 
      font-family: Arial, sans-serif; 
      font-size: 12px; 
      font-family: Arial;
    }
    
    header {
      padding: 10px 0;
      margin-bottom: 30px;
    }
    
    #logo {
      text-align: center;
      margin-bottom: 10px;
    }
    
    #logo img {
      width: 90px;
    }
    
    h1 {
      border-top: 1px solid   #F4A202;;
      border-bottom: 1px solid  #F4A202;
      color: #5D6975;
      font-size: 2.4em;
      line-height: 1.4em;
      font-weight: normal;
      text-align: center;
      margin: 0 0 20px 0;
      background: url(dimension.png);
    }
    
    #project {
      float: left;
    }
    
    #project span {
      color: #5D6975;
      text-align: right;
      width: 52px;
      margin-right: 10px;
      display: inline-block;
      font-size: 0.8em;
    }
    
    #company {
      float: right;
      text-align: right;
    }
    
    #project div,
    #company div {
      white-space: nowrap;        
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 20px;
    }
    
    table tr:nth-child(2n-1) td {
      background: #F4A202;
      opacity: 89%;
    }
    
    table th,
    table td {
      text-align: center;
    }
    
    table th {
      padding: 5px 20px;
      color: #5D6975;
      border-bottom: 1px solid #C1CED9;
      white-space: nowrap;        
      font-weight: normal;
    }
    
    table .service,
    table .desc {
      text-align: left;
    }
    
    table td {
      padding: 20px;
      text-align: right;
    }
    
    table td.service,
    table td.desc {
      vertical-align: top;
    }
    
    table td.unit,
    table td.qty,
    table td.total {
      font-size: 1.2em;
    }
    
    table td.grand {
      border-top: 1px solid #5D6975;;
    }
    
    #notices .notice {
      color: #5D6975;
      font-size: 1.2em;
    }
    
    footer {
      color: #5D6975;
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #C1CED9;
      padding: 8px 0;
      text-align: center;
    }</style>
    
        <meta charset="utf-8">
        <title>Ejemplo 1</title>
        <link rel="stylesheet" href="style.css" media="all">
      <link type="text/css" rel="stylesheet" charset="UTF-8" href="https://www.gstatic.com/_/translate_http/_/ss/k=translate_http.tr.26tY-h6gH9w.L.W.O/am=AgM/d=0/rs=AN8SPfrixlL1amy8r1f0UQHcZ2HL9amUjg/m=el_main_css"></head>
      <body>
        <header class="clearfix">
          
          <h1><font style="vertical-align: inherit;"><font style="vertical-align: inherit; color: #F4A202;">ADOPET</font></font></h1>
          <div id="company" class="clearfix">
            <div><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Adopet</font></font></div>
            <div><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Encuentra a tu mejor amigo</font></font><br><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">¡Recuerda visitar nuestra página!</font></font></div>
           
          </div>
          
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <th class="service"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font></th>
                <th class="desc"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font></th>
                <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font></th>
                <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font></th>
                <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="service"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Saludos, ${nombreDueno}</font></font></td>
                <td class="desc"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">El usuario ${nombreAdoptar} (${emailAdoptar}) quiere adoptar a ${pet} manténgase en contacto para llegar a un acuerdo.</font></font></td>
                <td class="unit"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">¡Gracias por utilizar nuestra página!</font></font></td>
                <td class="qty"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font></td>
                <td class="total"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"></font></font></td>
              </tr>
              <tr>
               
                
                
               
               
            </tr></tbody>
          </table>
            
            
          
        </main>
        <footer><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          AdoPet no se hace responsable de la comunicación entre los interesados
       
      
    
    </font></font></footer></body></html>`,
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error al enviar el correo:', error);
    }
    console.log('Correo enviado:', info.response);
});
};