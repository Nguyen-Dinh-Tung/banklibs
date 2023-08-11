import { Injectable } from '@nestjs/common';
import { EmailContentInterface } from '../interfaces/email.interface';
import * as nodemail from 'nodemailer';
@Injectable()
export class EmailOtpService {
  static email: string;
  static password: string;

  private readonly client = nodemail.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EmailOtpService.email,
      pass: EmailOtpService.password,
    },
  });

  async send(data: EmailContentInterface) {
    await this.client.sendMail({
      subject: data.title,
      from: data.title,
      to: data.address,
      text: data.content,
    });

    return {
      success: true,
    };
  }
}
