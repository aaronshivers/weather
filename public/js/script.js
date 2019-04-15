// service worker checker
if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('/sw.js')
    .then(() => console.log(`Service Worker Registered!`))
    .catch(err => console.log(err.message))
}
