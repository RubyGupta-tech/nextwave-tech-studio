import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const { data: domains, error: domainError } = await resend.domains.list();
    
    if (domainError) {
      return res.status(500).json({ 
        status: 'Error fetching domains', 
        error: domainError 
      });
    }

    const apiKeyStatus = process.env.RESEND_API_KEY ? 'Set (Hidden)' : 'Not Set';
    
    return res.status(200).json({
      message: 'Resend Debug Info',
      apiKey: apiKeyStatus,
      environment: process.env.NODE_ENV,
      verifiedDomains: domains.map(d => ({
        id: d.id,
        name: d.name,
        status: d.status,
        createdAt: d.created_at
      }))
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'Critical API Error', 
      error: error.message 
    });
  }
}
