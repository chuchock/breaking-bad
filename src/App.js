import React, { useState, useEffect  } from 'react';
import styled from '@emotion/styled';

import Frase from './components/Frase';

const Contenedor = styled.div`
  display: flex;
  align-items: center;
  padding-top: 5rem;
  flex-direction: column;
` ;

const Boton = styled.button`
  background: -webkit-linear-gradient(top left, #007d35 0%, #007d35 40%, #0f574e 100%);
  background-size: 300px;
  font-family:  Arial, Helvetica, sans-serif;
  color: #fff;
  margin-top: 3rem;
  padding: 1rem 3rem;
  font-size: 2rem;
  border: 2px solid black;
  transition: background-size .8s ease;
  
  :hover {
    cursor:pointer;
    background-size: 400px;
  }
`;

const Acciones = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const AccionSecundaria = styled.button`
  background: #0f574e;
  color: #fff;
  border: 1px solid #0a3c35;
  padding: 0.7rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  :hover {
    background: #0a3c35;
  }
`;

function App() {

	//  state de frases
	const [frase, guardarFrase] = useState({});
	const [imagenAutor, setImagenAutor] = useState('');
	const [personajes, setPersonajes] = useState([]);

	const consultarAPI = async () => {
		try {
			const api = await fetch('https://api.breakingbadquotes.xyz/v1/quotes');

			if (!api.ok) {
				throw new Error(`HTTP ${api.status}`);
			}

			const frase = await api.json();
			guardarFrase(frase[0]);
		} catch (error) {
			console.error('No se pudo obtener la frase', error);
			guardarFrase({
				quote: 'No se pudo obtener la frase. Intenta nuevamente en unos momentos.',
				author: 'Error'
			});
		}

	}

	const buildQuoteText = () => {
		if (!frase || !frase.quote) return '';
		return `"${frase.quote}" — ${frase.author || 'Desconocido'}`;
	};

	const normalizarNombre = nombre =>
		(nombre || '')
			.toLowerCase()
			.replace(/["']/g, '')
			.replace(/\s+/g, ' ')
			.trim();

	const buscarImagenEnLista = autor => {
		const normalizado = normalizarNombre(autor);
		if (!normalizado) return '';

		// Coincidencia exacta
		const exacto = personajes.find(p => normalizarNombre(p.name) === normalizado);
		if (exacto?.img) return exacto.img;

		// Coincidencia parcial (por ejemplo "Gus Fring" vs "Gustavo 'Gus' Fring")
		const parcial = personajes.find(p =>
			normalizarNombre(p.name).includes(normalizado) || normalizado.includes(normalizarNombre(p.name))
		);
		return parcial?.img || '';
	};

	const consultarImagenAutor = async autor => {
		if (!autor) {
			setImagenAutor('');
			return;
		}

		// Primero intenta con lo que ya tenemos en memoria
		const imagenLocal = buscarImagenEnLista(autor);
		if (imagenLocal) {
			setImagenAutor(imagenLocal);
			return;
		}

		try {
			const respuesta = await fetch(`https://breakingbadapi.com/api/characters?name=${encodeURIComponent(autor)}`);
			if (!respuesta.ok) {
				throw new Error(`HTTP ${respuesta.status}`);
			}
			const datos = await respuesta.json();
			const imagen = datos?.[0]?.img;
			setImagenAutor(imagen || '');
		} catch (error) {
			console.error('No se pudo obtener la imagen del autor', error);
			setImagenAutor('');
		}
	};

	const copiarFrase = async () => {
		const texto = buildQuoteText();
		if (!texto) return;

		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(texto);
			} else {
				const area = document.createElement('textarea');
				area.value = texto;
				document.body.appendChild(area);
				area.select();
				document.execCommand('copy');
				document.body.removeChild(area);
			}
			// Quick feedback
			console.log('Frase copiada al portapapeles');
		} catch (error) {
			console.error('No se pudo copiar la frase', error);
		}
	};

	const compartirFrase = async () => {
		const texto = buildQuoteText();
		if (!texto) return;

		try {
			if (navigator.share) {
				await navigator.share({ text: texto });
			} else {
				await copiarFrase();
			}
		} catch (error) {
			console.error('No se pudo compartir la frase', error);
		}
	};

	// Cargar una frase
	useEffect(() => {
		consultarAPI()
	}, []);

	// Cargar lista de personajes para hacer matching local de imágenes
	useEffect(() => {
		const cargarPersonajes = async () => {
			try {
				const respuesta = await fetch('https://breakingbadapi.com/api/characters');
				if (!respuesta.ok) {
					throw new Error(`HTTP ${respuesta.status}`);
				}
				const datos = await respuesta.json();
				setPersonajes(datos || []);
			} catch (error) {
				console.error('No se pudo cargar la lista de personajes', error);
			}
		};

		cargarPersonajes();
	}, []);

	// Cargar imagen del autor cuando cambia la frase
	useEffect(() => {
		consultarImagenAutor(frase.author);
	}, [frase.author]);

	return (
		<Contenedor>
			<Frase
				frase={frase}
				imagenAutor={imagenAutor}
			/>
			<Boton
				onClick={consultarAPI}
			>
				Obtener Frase
    </Boton>
			<Acciones>
				<AccionSecundaria onClick={copiarFrase}>
					Copiar
				</AccionSecundaria>
				<AccionSecundaria onClick={compartirFrase}>
					Compartir
				</AccionSecundaria>
			</Acciones>
		</Contenedor>
	);
}

export default App;
