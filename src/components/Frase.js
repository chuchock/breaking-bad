import React from 'react';
import styled from '@emotion/styled';

const ContenedorFrase = styled.div`
    padding: 3rem;
    border-radius: .5rem;
    background-color: #fff;
	max-width:800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;

    @media (min-width: 992px) {
        margin-top: 10rem;
	}
	
    h1 {
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        position: relative;
        padding-left: 4rem;
        &::before {
            content: open-quote;
            font-size: 10rem;
            color: black;
            position: absolute;
            left: -1rem;
            top: -2rem;
        }
	}
	
    p {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 1.4rem;
        font-weight:bold;
        text-align: right;
        color: #666;
        margin-top: 2rem;
    }
`;

const ImagenAutor = styled.img`
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #0f574e;
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
`;

const Frase = ({ frase, imagenAutor }) => {

	// if (Object.keys(frase).length === 0) return null;

	return (
		<ContenedorFrase>
            {imagenAutor
				? <ImagenAutor src={imagenAutor} alt={`Foto de ${frase.author}`} />
				: null}
			<h1>{frase.quote}</h1>
			<p>-{frase.author}</p>
		</ContenedorFrase>
	);
}

export default Frase;
