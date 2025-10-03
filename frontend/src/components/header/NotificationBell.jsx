// import React, { useEffect, useState } from 'react';
// import { supabase } from '../../data/supabaseClient';


// const NotificationBell = ({ currentUser, onAcceptRequest }) => {
//   const [requests, setRequests] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     if (!currentUser) return;

//     fetchRequests();

//     const subscription = supabase
//       .from(`Aceptacion:usuario2_id=eq.${currentUser.id}`)
//       .on('INSERT', payload => {
//         fetchRequests();
//       })
//       .on('UPDATE', payload => {
//         fetchRequests();
//       })
//       .subscribe();

//     return () => {
//       supabase.removeSubscription(subscription);
//     };
//   }, [currentUser]);

//   const fetchRequests = async () => {
//     const { data, error } = await supabase
//       .from('Aceptacion')
//       .select('id, usuario1_id, usuario1:Usuario(id, nombre, img), Aceptar')
//       .eq('usuario2_id', currentUser.id)
//       .is('Aceptar', null);

//     if (error) {
//       console.error('Error fetching chat requests:', error);
//       return;
//     }
//     setRequests(data);
//   };

//   const handleAccept = async (requestId) => {
//     const { error } = await supabase
//       .from('Aceptacion')
//       .update({ Aceptar: true })
//       .eq('id', requestId);

//     if (error) {
//       console.error('Error accepting request:', error);
//       return;
//     }
//     fetchRequests();
//     if (onAcceptRequest) onAcceptRequest();
//   };

//   const handleReject = async (requestId) => {
//     const { error } = await supabase
//       .from('Aceptacion')
//       .update({ Aceptar: false })
//       .eq('id', requestId);

//     if (error) {
//       console.error('Error rejecting request:', error);
//       return;
//     }
//     fetchRequests();
//   };

//   return (
//     <div className="notification-bell-container">
//       <div className="bell-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
//         🔔
//         {requests.length > 0 && <span className="notification-count">{requests.length}</span>}
//       </div>
//       {dropdownOpen && (
//         <div className="notification-dropdown">
//           {requests.length === 0 ? (
//             <p>No new chat requests</p>
//           ) : (
//             requests.map((req) => (
//               <div key={req.id} className="notification-item">
//                 <img src={req.usuario1.img} alt={req.usuario1.nombre} className="notification-avatar" />
//                 <span>{req.usuario1.nombre} wants to chat</span>
//                 <button onClick={() => handleAccept(req.id)}>Accept</button>
//                 <button onClick={() => handleReject(req.id)}>Reject</button>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;
