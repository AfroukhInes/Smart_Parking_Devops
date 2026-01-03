// 🔹 Node IP of your cluster (kubectl get nodes -o wide)
const NODE_IP = "http://172.21.0.2";

// 🔹 Services exposed via NodePort
export const AUTH_API = `${NODE_IP}:31564`;          // auth
export const RESERVATION_API = `${NODE_IP}:32006`;   // reservation
export const BILLING_API = `${NODE_IP}:31173`;       // billing
export const NOTIFICATION_API = `${NODE_IP}:32319`;  // notification

// 🔹 Main endpoints used by pages
export const ENDPOINTS = {
  register: `${AUTH_API}/register`,
  login: `${AUTH_API}/login`,
  reserve: `${RESERVATION_API}/reserve`,
  pay: `${BILLING_API}/pay`,
  notify: `${NOTIFICATION_API}/send`
};

// ✅ backward compatibility (fix Jenkins build)
export const AUTH = AUTH_API;
export const RESERVATION = RESERVATION_API;
export const BILLING = BILLING_API;
export const NOTIFICATION = NOTIFICATION_API;

// 🔥 extra alias some files use
export const NOTIF = NOTIFICATION_API;
