const render = require('mustache').Render;

module.exports = function(model) {
    return Promise.resolve({
        subject: 'Cuenta en Cero Vueltas',
        text: `¿Has solicitado crear un usuario de Cero Vueltas?
Y si es así, nos alegra. Sólo tenés que ingresar a la siguiente página para
confirmar tu correo: ${model.verifyUrl}.

¡Muchas gracias!

------

A veces suceden cosas que están fuera de nuestro control.
Si no quieres recibir emails nuestros puedes bloquear tu dirección de correo
en la siguiente página: ${model.blacklistUrl}
`,
        attachment: [{
            data: `<p>¿Has solicitado crear un usuario de Cero Vueltas?
Y si es así, nos alegra. Sólo tenés que ingresar a la siguiente página para
confirmar tu correo: <a href="${model.verifyUrl}">${model.verifyUrl}</a>.</p>

<p>¡Muchas gracias!</p>

<br />

A veces suceden cosas que están fuera de nuestro control.
Si no quieres recibir emails nuestros puedes bloquear tu dirección de correo
en la siguiente página: <a href="${model.blacklistUrl}">${model.blacklistUrl}</a>
`,
            alternative: true
        }]
    });
};
