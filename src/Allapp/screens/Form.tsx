import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { GoogleMap, useJsApiLoader, Autocomplete, Marker } from '@react-google-maps/api'

import { AuthContext } from '../context/AuthContext';

const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const center = {
  lat: -12.0464,
  lng: -77.0428,
}

export const Form: React.FC = () => {
  const [selectedBusinessType, setSelectedBusinessType] = useState<string[]>([]);
  const [selectedBusinessType2, setSelectedBusinessType2] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [web, setWeb] = useState<string>('');
  const [weekDay1, setWeekDay1] = useState("lunes");
  const [weekDay2, setWeekDay2] = useState("viernes");
  const [weekStartTime, setWeekStartTime] = useState("");
  const [weekEndTime, setWeekEndTime] = useState("");
  const [weekendStartTime, setWeekendStartTime] = useState("");
  const [weekendEndTime, setWeekendEndTime] = useState("");
  const [weekendDay1, setWeekendDay1] = useState("sabado");
  const [weekendDay2, setWeekendDay2] = useState("domingo");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [containerStyle, setContainerStyle] = useState<{ width: string; height: string }>({
    width: '100%',
    height: '400px',
  });



  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apikey,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  const { postFormData } = useContext(AuthContext);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setFile(file);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setCoordinates(center);
        }
      );
    } else {
      setCoordinates(center);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;

        setContainerStyle({
          width: `${width}px`,
          height: `${height}px`,
        });

        if (map && coordinates) {
          setTimeout(() => {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(coordinates);
          }, 200);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [coordinates, map]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  });

  const handleBusinessTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedBusinessType(prevState => {
      if (checked) {
        return [...prevState, value];
      } else {
        return prevState.filter(item => item !== value);
      }
    });
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat() ?? 0;
    const lng = event.latLng?.lng() ?? 0;
    console.log(lat, lng)
    setCoordinates({ lat, lng });
  };

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (coordinates) {
      mapInstance.setCenter(coordinates);
    }
  };

  const onUnmount = () => {
    setMap(null);
  };

  const handleBusinessType2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedBusinessType2(prevState => {
      if (checked) {
        return [...prevState, value];
      } else {
        return prevState.filter(item => item !== value);
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let isValid = true;
    let errorMessage = '';

    // Validaciones
    if (!name) {
      isValid = false;
      errorMessage = 'El nombre comercial es obligatorio.';
    } else if (!email) {
      isValid = false;
      errorMessage = 'El correo es obligatorio.';
    } else if (!phone) {
      isValid = false;
      errorMessage = 'El teléfono es obligatorio.';
    } else if (selectedBusinessType.length === 0) {
      isValid = false;
      errorMessage = 'Debes seleccionar el tipo de negocio.';
    } else if (selectedBusinessType2.length === 0) {
      isValid = false;
      errorMessage = 'Debes seleccionar el tipo de negocio.';
    } else if (!weekDay1 || !weekDay2) {
      isValid = false;
      errorMessage = 'Debes seleccionar los días laborables.';
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    const formData = {
      typeUser: selectedBusinessType.join(', '),
      name,
      latitude: coordinates?.lat ?? 0,
      longitude: coordinates?.lng ?? 0,
      image: file,
      weekOpening: weekDay1,
      weekClosing: weekDay2,
      dateAttentionWeek: `${weekStartTime} - ${weekEndTime}`,
      weekendOpening: weekendDay1,
      weekendClosing: weekendDay2,
      dateAttentionWeekend: `${weekendStartTime} - ${weekendEndTime}`,
      phone,
      email
    };

    console.log(formData);

    const response = await postFormData(formData);

    if (response) {
      alert('Formulario enviado con éxito');
    } else {
      alert('Error al enviar el formulario');
    }
  };

  return (
    <div className="form-container">
      <h1 style={{ textAlign: 'center' }}>Formulario de registro</h1>
      <form onSubmit={handleSubmit} >
        <label>
          Nombre Comercial:
          <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Correo:
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Teléfono:
          <input type="tel" name="phone" pattern="\d*" title="Solo se permiten números" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <label>
          Red Social o Web:
          <input type="text" name="web" value={web} onChange={(e) => setWeb(e.target.value)} />
        </label>

        <fieldset>
          <legend>¿A qué categoría pertenece tu negocio?</legend>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="typeUser" value="Digital" onChange={handleBusinessTypeChange} />
              <span className="custom-checkbox"></span>
              Digital
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="typeUser" value="Físico" onChange={handleBusinessTypeChange} />
              <span className="custom-checkbox"></span>
              Físico
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Tipo de Negocio (puedes marcar 1 o más) *</legend>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="businessType" value="Veterinaria Clásica (Perros/gatos)" onChange={handleBusinessType2Change} />
              <span className="custom-checkbox"></span>
              Veterinaria Clásica (Perros/gatos)
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="businessType" value="Veterinaria Exótica (conejos, erizos, aves, etc)" onChange={handleBusinessType2Change} />
              <span className="custom-checkbox"></span>
              Veterinaria Exótica (conejos, erizos, aves, etc)
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="businessType" value="Petshop" onChange={handleBusinessType2Change} />
              <span className="custom-checkbox"></span>
              Petshop
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="businessType" value="Hospedaje" onChange={handleBusinessType2Change} />
              <span className="custom-checkbox"></span>
              Hospedaje
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="businessType" value="Estética" onChange={handleBusinessType2Change} />
              <span className="custom-checkbox"></span>
              Estética
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="businessType" value="Criador especializado" onChange={handleBusinessType2Change} />
              <span className="custom-checkbox"></span>
              Criador especializado
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="businessType" value="Paseo Mascotas" onChange={handleBusinessType2Change} />
              <span className="custom-checkbox"></span>
              Paseo Mascotas
            </label>
          </div>
        </fieldset>

        <div style={{ display: 'flex', gap: 20 }}>
          <legend>Dias de la semana laborables</legend>
          <label>
            <select name="day1" value={weekDay1} onChange={(e) => setWeekDay1(e.target.value)}>
              <option value="lunes">Lunes</option>
              <option value="martes">Martes</option>
              <option value="miércoles">Miércoles</option>
              <option value="jueves">Jueves</option>
              <option value="viernes">Viernes</option>
            </select>
          </label>


          <label>
            <select name="day2" value={weekDay1} onChange={(e) => setWeekDay2(e.target.value)}>
              <option value="viernes">Viernes</option>
              <option value="jueves">Jueves</option>
              <option value="miércoles">Miércoles</option>
              <option value="martes">Martes</option>
              <option value="lunes">Lunes</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <label>
            Hora de inicio:
            <input type="time" name="start_time" value={weekStartTime} onChange={(e) => setWeekStartTime(e.target.value)} />
          </label>
          <label>
            Hora de fin:
            <input type="time" name="end_time" value={weekEndTime} onChange={(e) => setWeekEndTime(e.target.value)} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
          <legend>Dias del fin de semana laborables</legend>
          <label>
            <select name="weekday1" value={weekendDay1} onChange={(e) => setWeekendDay1(e.target.value)}>
              <option value="sabado">Sabado</option>
              <option value="domingo">Domingo</option>
            </select>
          </label>

          <label>
            <select name="weekday2" value={weekendDay2} onChange={(e) => setWeekendDay2(e.target.value)}>
              <option value="domingo">Domingo</option>
              <option value="sabado">Sabado</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <label>
            Hora de inicio:
            <input type="time" name="start_time" value={weekendStartTime} onChange={(e) => setWeekendStartTime(e.target.value)} />
          </label>
          <label>
            Hora de fin:
            <input type="time" name="end_time" value={weekendEndTime} onChange={(e) => setWeekendEndTime(e.target.value)} />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p>Carga una imagen.</p>
          </div>

          {image && (
            <div style={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <h3>Vista previa.</h3>
              <img src={image} alt="Imagen cargada" style={{ maxWidth: '100%', maxHeight: '100px' }} />
            </div>
          )}
        </div>

        {isLoaded ?
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coordinates || center}
            zoom={11}
            onLoad={handleMapLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
          >
            {coordinates && (
              <Marker position={coordinates} />
            )}
          </GoogleMap>
          : <></>
        }
        <div style={{ marginTop: 10 }}>
          <button type="submit" onClick={handleSubmit}>Enviar</button>
        </div>
      </form>

    </div >
  );
};
