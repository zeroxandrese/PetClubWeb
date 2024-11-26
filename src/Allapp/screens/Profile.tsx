import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { format } from 'date-fns';
import '../css/Profile.css';

import AvataroutProfile2 from '../assets/avataroutProfile2.svg';

const Profile = () => {
  const location = useLocation();

  // Obtener la URL del parámetro de consulta
  const params = new URLSearchParams(location.search);
  const encodedUrl = params.get('url');

  // Decodificar la URL
  const url = decodeURIComponent(encodedUrl);

    // Fecha actual para ejemplo
    const currentDate = new Date();

    // Formatear la fecha
    const formattedDate = format(currentDate, 'MMMM dd, yyyy');

  // Verificar si la URL es de video
  const isVideo = url && (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm'));

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-user-info">
          <img src={AvataroutProfile2} alt="Avatar" className="avatar" />
          <div className="user-details">
            <h3 className="user-name">Usurio</h3>
            <p className="date">{formattedDate}</p>
          </div>
        </div>
        <div className="options-button">⋮</div>
      </div>
      <div className="media-container">
        {isVideo ? (
          <ReactPlayer url={url} controls className="media" />
        ) : (
          <img src={url} alt="Media" className="media" />
        )}
      </div>
      <div className="profile-card-footer">
        <button className="comment-button">Comment</button>
        <button className="like-button">Like</button>
        <p className="description">Descripción de ejemplo...</p>
      </div>
    </div>
  );
};

export { Profile };