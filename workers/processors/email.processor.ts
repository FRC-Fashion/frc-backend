import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from '../../src/core/email/email.service';
import { forgotPasswordTemplate } from '../../src/core/email/templates/forgot-password.template';

@Processor('email-queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('send-forgot-password')
  async handleForgotPasswordEmail(
    job: Job<{ email: string; username: string; resetLink: string }>,
  ) {
    this.logger.debug(`Sending forgot password email to ${job.data.email}...`);

    const htmlBody = forgotPasswordTemplate(
      job.data.username,
      job.data.resetLink,
    );

    const success = await this.emailService.sendEmail({
      to: job.data.email,
      subject: 'Password Reset Request - FRC',
      html: htmlBody,
    });

    if (success) {
      this.logger.debug(`Successfully sent email to ${job.data.email}`);
    } else {
      this.logger.error(`Failed to send email to ${job.data.email}`);
      throw new Error(`Email sending failed for ${job.data.email}`);
    }
  }
}
