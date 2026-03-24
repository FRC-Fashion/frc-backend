import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

@Injectable()
export class InfobipService {
  private readonly logger = new Logger(InfobipService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Send a WhatsApp OTP message via Infobip using the
   * `test_whatsapp_template_en` template (placeholder = the OTP code).
   */
  async sendOtp(phone: string, otp: string): Promise<boolean> {
    const rawHostname = this.configService.get<string>('INFOBIP_HOSTNAME');
    const rawApiKey = this.configService.get<string>('INFOBIP_API_KEY');
    const rawFromNumber = this.configService.get<string>('INFOBIP_FROM_NUMBER');
    const rawTemplateName = this.configService.get<string>('INFOBIP_TEMPLATE_NAME');

    const hostname = rawHostname?.trim();
    const apiKey = rawApiKey?.trim();
    const fromNumber = rawFromNumber?.trim();
    const templateName = (rawTemplateName || 'test_whatsapp_template_en').trim();

    if (!hostname || !apiKey || !fromNumber) {
      this.logger.error('Infobip configuration is missing or incomplete');
      return false;
    }

    const cleanPhone = phone.replace('+', '');
    const apiUrl = `https://${hostname}/whatsapp/1/message/template`;
    
    this.logger.log(`WhatsApp OTP: Sending to ${cleanPhone} via ${hostname} [Template: ${templateName}]`);

    const postData = JSON.stringify({
      messages: [
        {
          from: fromNumber,
          to: cleanPhone,
          content: {
            templateName,
            templateData: {
              body: {
                placeholders: [otp],
              },
            },
            language: 'en',
          },
        },
      ],
    });

    return new Promise((resolve) => {
      const options: https.RequestOptions = {
        method: 'POST',
        headers: {
          Authorization: `App ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        family: 4, // Force IPv4 to avoid DNS resolution issues on some Windows setups
      };

      const req = https.request(apiUrl, options, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          this.logger.debug(`Infobip response [${res.statusCode}]: ${body}`);

          try {
            const parsedBody = JSON.parse(body);
            const firstMessage = parsedBody.messages?.[0];
            const statusName = firstMessage?.status?.groupName;

            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              if (statusName === 'REJECTED' || statusName === 'FAILED') {
                const description = firstMessage?.status?.description || 'Unknown error';
                this.logger.error(`WhatsApp OTP Rejected by Infobip: ${description}`);
                resolve(false);
              } else {
                this.logger.log(`WhatsApp OTP Status [${res.statusCode}]: ${statusName || 'ACCEPTED'}`);
                resolve(true);
              }
            } else {
              this.logger.error(`Infobip error response [${res.statusCode}]: ${body}`);
              resolve(false);
            }
          } catch (e) {
            this.logger.error(`Failed to parse Infobip response: ${body}`);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        this.logger.error(`Infobip request error to ${apiUrl}: ${error.message}`);
        this.logger.debug(error.stack);
        resolve(false);
      });

      req.write(postData);
      req.end();
    });
  }
}
