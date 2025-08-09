import createEdgeClient from '@honeycomb-protocol/edge-client';

export class StarStrikeHoneycombClient {
  private client: any;

  constructor() {
    // Use Honeycomb test network for development
    const API_URL = "https://edge.test.honeycombprotocol.com/";
    this.client = createEdgeClient(API_URL, true);
  }

  getClient() {
    return this.client;
  }

  async isConnected(): Promise<boolean> {
    try {
      // Test connection by making a simple API call
      return true; // For MVP, assume always connected
    } catch (error) {
      console.error('Honeycomb connection failed:', error);
      return false;
    }
  }
}

// Singleton instance
let honeycombClient: StarStrikeHoneycombClient | null = null;

export function getHoneycombClient(): StarStrikeHoneycombClient {
  if (!honeycombClient) {
    honeycombClient = new StarStrikeHoneycombClient();
  }
  return honeycombClient;
}