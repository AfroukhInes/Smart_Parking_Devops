// Base NODE IP (from: kubectl get nodes -o wide)
const NODE_IP = "http://172.21.0.2";

// NodePort mappings (from kubectl get svc -n smart-parking)
export const AUTH_API = `${NODE_IP}:31564`;          // auth-nodeport
export const RESERVATION_API = `${NODE_IP}:32006`;   // reservation-nodeport
export const BILLING_API = `${NODE_IP}:31173`;       // billing-nodeport
export const NOTIFICATION_API = `${NODE_IP}:32319`;  // notification-nodeport

// Example endpoints your React components will call:
export const ENDPOINTS = {
  register: `${AUTH_API}/register`,
  login: `${AUTH_API}/login`,
  reserve: `${RESERVATION_API}/reserve`,
  pay: `${BILLING_API}/pay`,
  notify: `${NOTIFICATION_API}/send`
};
