import { NotificationItem, Order, OrderStatus } from '../types';

// Web Audio synthesizer for pleasant notification chime
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch {
    // Audio might be blocked by browser autoplay policy
  }
}

export function requestBrowserNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function triggerSystemPushNotification(title: string, body: string) {
  playNotificationChime();
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Blanche Élégance: ${title}`, {
        body,
        icon: '/favicon.ico'
      });
    } catch (e) {
      console.log('Push notification display fallback', e);
    }
  }
}

export function createOrderNotification(order: Order, newStatus: OrderStatus): NotificationItem {
  let title = 'Mise à jour de votre commande';
  let message = `Votre commande #${order.trackingNumber} a été mise à jour.`;

  switch (newStatus) {
    case 'en_attente':
      title = 'Commande Reçue';
      message = `Votre commande #${order.trackingNumber} de $${order.totalAmount} est bien enregistrée. Paiement eMoney en cours.`;
      break;
    case 'validee':
      title = 'Paiement Validé & Colis en Préparation';
      message = `Paiement reçu avec succès pour #${order.trackingNumber}. Votre tenue Blanche Élégance est en cours d'emballage précieux.`;
      break;
    case 'prise_en_charge':
      title = 'Colis Pris en Charge par le Livreur';
      message = `Le livreur ${order.driverName || 'Express'} a scanné et récupéré votre colis #${order.trackingNumber}.`;
      break;
    case 'en_transit':
      title = 'Colis en Cours d’Acheminement';
      message = `Votre colis #${order.trackingNumber} est actuellement en route vers votre adresse. Suivez-le en direct!`;
      break;
    case 'pret_retrait':
      title = 'Arrivée Imminente / Prêt pour Retrait';
      message = `Votre colis #${order.trackingNumber} est prêt! Munissez-vous de votre QR Code pour la remise sécurisée.`;
      break;
    case 'livree':
      title = 'Livraison Confirmée avec Succès';
      message = `Félicitations! Le QR Code de #${order.trackingNumber} a été validé. Merci d'avoir choisi Blanche Élégance.`;
      break;
    case 'annulee':
      title = 'Commande Annulée';
      message = `La commande #${order.trackingNumber} a été annulée.`;
      break;
  }

  triggerSystemPushNotification(title, message);

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    orderId: order.id,
    title,
    message,
    type: 'push',
    recipientPhone: order.customerPhone,
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    read: false
  };
}
