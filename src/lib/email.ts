export interface EmailProvider {
  sendNewsletterWelcome(email: string): Promise<void>;
}

class ConsoleEmailProvider implements EmailProvider {
  async sendNewsletterWelcome(email: string) {
    console.log(`[email:stub] would send newsletter welcome to ${email}`);
  }
}

// Swap this for a Resend-backed implementation once RESEND_API_KEY is set.
export const emailProvider: EmailProvider = new ConsoleEmailProvider();
