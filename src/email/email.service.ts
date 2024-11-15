import { Injectable } from '@nestjs/common';
import { transporter } from './mailer'
import { recoveryPassword, register } from './template/templates';
import { SendEmail } from './dto/send-email.dto';

@Injectable()
export class EmailService {

    async sendEmailRecovery(info:SendEmail){
        
        await transporter.sendMail({
            from: '"Olvide mi contraseña" <juan.rodriguez99@uptc.edu.co>', // sender address
            to: info.email, // list of receivers
            subject: "Olvide mi contraseña", // Subject line
            html: recoveryPassword(info.userName)// html body
          });
    }

    async sendEmailRegister(info:SendEmail){
        await transporter.sendMail({
            from: '"Registro de usuario" <juan.rodriguez99@uptc.edu.co>', // sender address
            to: info.email, // list of receivers
            subject: "Registro de usuario", // Subject line
            html: register(info.userName,info.password)// html body
          });
    }
}
