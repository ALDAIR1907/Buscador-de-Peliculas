import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY || '3cdb7477'; 
const API_URL = 'https://www.omdbapi.com/';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);

  const buscarPeliculas = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    setCargando(true);
    setError('');
    setPeliculaSeleccionada(null);
    
    try {
      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&s=${busqueda}`);
      if (response.data.Response === 'True') {
        setPeliculas(response.data.Search);
      } else {
        setError('No se encontraron películas 😢');
        setPeliculas([]);
      }
    } catch (err) {
      setError('Error al buscar. Intenta de nuevo');
    } finally {
      setCargando(false);
    }
  };

  const verDetalles = async (imdbID) => {
    setCargando(true);
    try {
      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&i=${imdbID}`);
      if (response.data.Response === 'True') {
        setPeliculaSeleccionada(response.data);
      }
    } catch (err) {
      console.error('Error al cargar detalles');
    } finally {
      setCargando(false);
    }
  };

  const cerrarDetalles = () => {
    setPeliculaSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Efecto de ruido sutil */}
      <div className="fixed inset-0 opacity-5 pointer-events-none bg-noise"></div>
      
      {/* Header con efecto glass */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white text-xl">🎬</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                CineScope
              </h1>
            </div>
            <p className="text-purple-300 text-sm hidden md:block">
              Descubre tu próxima película favorita
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Formulario de búsqueda elegante */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={buscarPeliculas} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar película... (Ej: Inception, The Matrix, Interestelar)"
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder-purple-300/50 focus:outline-none text-lg"
              />
              <button
                type="submit"
                disabled={cargando}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Buscar →'
                )}
              </button>
            </div>
          </form>

          {/* Mensaje de error con animación */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-center animate-pulse">
              {error}
            </div>
          )}
        </div>

        {/* Grid de películas con animación de entrada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {peliculas.map((pelicula, index) => (
            <div
              key={pelicula.imdbID}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                {pelicula.Poster !== 'N/A' ? (
                  <img
                    src={pelicula.Poster}
                    alt={pelicula.Title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-500 text-6xl">🎬</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button
                    onClick={() => verDetalles(pelicula.imdbID)}
                    className="w-full py-2 bg-white/20 backdrop-blur-md rounded-lg text-white font-semibold hover:bg-white/30 transition"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg truncate">{pelicula.Title}</h3>
                <p className="text-purple-300 text-sm mt-1">{pelicula.Year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje inicial elegante */}
        {peliculas.length === 0 && !cargando && !error && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <span className="text-4xl">🎬</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Bienvenido a CineScope!</h2>
            <p className="text-purple-300 text-lg">Busca cualquier película y descubre su magia</p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <span className="px-4 py-2 bg-white/5 rounded-full text-purple-300 text-sm">⭐ Interestelar</span>
              <span className="px-4 py-2 bg-white/5 rounded-full text-purple-300 text-sm">🎭 El Padrino</span>
              <span className="px-4 py-2 bg-white/5 rounded-full text-purple-300 text-sm">🃏 Joker</span>
              <span className="px-4 py-2 bg-white/5 rounded-full text-purple-300 text-sm">⚡ Inception</span>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {peliculaSeleccionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={cerrarDetalles}>
            <div className="relative max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={cerrarDetalles}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
              >
                ✕
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  {peliculaSeleccionada.Poster !== 'N/A' ? (
                    <img
                      src={peliculaSeleccionada.Poster}
                      alt={peliculaSeleccionada.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center">
                      <span className="text-6xl text-gray-600">🎬</span>
                    </div>
                  )}
                </div>
                <div className="md:w-2/3 p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">{peliculaSeleccionada.Title}</h2>
                  <p className="text-purple-300 text-sm mb-4">
                    {peliculaSeleccionada.Year} • {peliculaSeleccionada.Runtime} • {peliculaSeleccionada.Genre}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-400 text-xl">⭐</span>
                    <span className="text-white text-lg font-semibold">{peliculaSeleccionada.imdbRating}</span>
                    <span className="text-gray-400 text-sm">/10 ({peliculaSeleccionada.imdbVotes} votos)</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">{peliculaSeleccionada.Plot}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-600/30 rounded-full text-purple-300 text-sm">Director: {peliculaSeleccionada.Director}</span>
                    <span className="px-3 py-1 bg-purple-600/30 rounded-full text-purple-300 text-sm">Actores: {peliculaSeleccionada.Actors}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-6 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>Datos proporcionados por OMDb API • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;