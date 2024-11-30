import { Injectable } from '@nestjs/common';
import { transporter } from './mailer'
import { cotizacion, recoveryPassword, register } from './template/templates';
import { sendCotizacion, SendEmail } from './dto/send-email.dto';

@Injectable()
export class EmailService {

    async sendEmailRecovery(info:SendEmail){
        
        await transporter.sendMail({
            from: '"Olvide mi contraseña" <juan.rodriguez99@uptc.edu.co>',
            to: info.email, 
            subject: "Olvide mi contraseña",
            html: recoveryPassword(info.userName)
          });
    }

    async sendEmailRegister(info:SendEmail){
        await transporter.sendMail({
            from: '"Registro de usuario" <juan.rodriguez99@uptc.edu.co>', 
            to: info.email, 
            subject: "Registro de usuario",
            html: register(info.userName,info.password)
          });
    }

    async sendEmailCotizacion(info:sendCotizacion){
        await transporter.sendMail({
            from: '"Cotización" <juan.rodriguez99@uptc.edu.co>', 
            to: info.emailSupplier, 
            subject: "Cotización",
            html: cotizacion(info.products,info.supplier,info.name,info.typeUser,info.phone,info.email)
          });
    }
}
