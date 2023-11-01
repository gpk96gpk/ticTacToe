import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'defaultURL' : 'http://localhost:5173';

export const socket = io(URL);

// add this when ready to add lobby page
// export const socket = io(URL, {
//     autoConnect: false
//   });