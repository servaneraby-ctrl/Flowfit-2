// FlowFit Service Worker — gestion des notifications push

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Réception d'une notification push
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'FlowFit 🌸', body: 'Rappel FlowFit !' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
      badge: '/icon.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'flowfit',
      renotify: true,
    })
  );
});

// Clic sur une notification → ouvre l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});

// Alarmes programmées via messages
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE') {
    const { title, body, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/icon.png',
        vibrate: [200, 100, 200],
        tag: 'flowfit-scheduled',
        renotify: true,
      });
    }, delay);
  }
});
