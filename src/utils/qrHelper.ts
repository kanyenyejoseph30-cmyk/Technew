import QRCode from 'qrcode';

export async function generateQrCodeUrl(data: string): Promise<string> {
  try {
    const url = await QRCode.toDataURL(data, {
      width: 260,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return url;
  } catch (err) {
    console.error('Erreur génération QR Code:', err);
    return '';
  }
}

export function buildOrderQrPayload(orderId: string, trackingNumber: string, customerPhone: string, totalAmount: number): string {
  return JSON.stringify({
    app: 'BLANCHE_ELEGANCE',
    id: orderId,
    trackingNumber,
    phone: customerPhone,
    amount: totalAmount,
    generatedAt: new Date().toISOString()
  });
}

export function parseOrderQrPayload(payload: string): { orderId?: string; trackingNumber?: string } | null {
  try {
    const parsed = JSON.parse(payload);
    if (parsed && (parsed.id || parsed.trackingNumber)) {
      return {
        orderId: parsed.id,
        trackingNumber: parsed.trackingNumber
      };
    }
    return null;
  } catch {
    // Si c'est directement un numéro de tracking texte brut comme BE-2026-XXXX
    if (payload.trim().startsWith('BE-') || payload.trim().startsWith('ord-')) {
      return {
        trackingNumber: payload.trim()
      };
    }
    return null;
  }
}
