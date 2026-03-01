import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  attachments?: any[];
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    const { to, cc, bcc, subject, html, attachments = [] } = options;
    const fromUser = this.configService.get<string>(
      'SMTP_FROM',
      '"FRC" <noreply@frc.com>',
    );

    try {
      const info = await this.transporter.sendMail({
        from: fromUser,
        to,
        cc,
        bcc,
        subject,
        html,
        attachments,
      });

      return info.rejected.length === 0;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      return false;
    }
  }
}
