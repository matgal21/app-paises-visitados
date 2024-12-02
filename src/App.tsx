import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { Plane, List, LogIn, LogOut, WifiOff } from 'lucide-react';
import WorldMap from './components/WorldMap';
import CountryList from './components/CountryList';
import Legend from './components/Legend';
import AuthForm from './components/AuthForm';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(new Set());
  const [showList, setShowList] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Set up real-time listener for user's data
          unsubscribeSnapshot = onSnapshot(
            doc(db, 'users', user.uid),
            (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                setVisitedCountries(new Set(data.visitedCountries || []));
              } else {
                // Initialize empty document if it doesn't exist
                setDoc(doc.ref, { visitedCountries: [] });
                setVisitedCountries(new Set());
              }
              setError(null);
            },
            (err) => {
              console.error('Snapshot error:', err);
              if (isOffline) {
                setError('No se pueden cargar los datos en modo sin conexión');
              } else {
                setError('Error al cargar los datos. Por favor, intenta nuevamente.');
              }
            }
          );
        } catch (err) {
          console.error('Firebase error:', err);
          setError('Error al conectar con la base de datos');
        }
      } else {
        setVisitedCountries(new Set());
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [isOffline]);

  const handleCountryClick = async (countryName: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (isOffline) {
      setError('No se pueden guardar cambios en modo sin conexión');
      return;
    }

    try {
      const newVisitedCountries = new Set(visitedCountries);
      if (newVisitedCountries.has(countryName)) {
        newVisitedCountries.delete(countryName);
      } else {
        newVisitedCountries.add(countryName);
      }

      await setDoc(doc(db, 'users', user.uid), {
        visitedCountries: Array.from(newVisitedCountries)
      }, { merge: true });

      setError(null);
    } catch (err) {
      console.error('Save error:', err);
      setError('Error al guardar los cambios. Por favor, intenta nuevamente.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (err) {
      setError('Error al cerrar sesión. Por favor, intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-sky-500">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Países Visitados Web</span>
            </div>
            <div className="flex items-center gap-4">
              {isOffline && (
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span className="text-sm">Sin conexión</span>
                </div>
              )}
              <button
                onClick={() => setShowList(!showList)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <List className="h-5 w-5 mr-1" />
                {showList ? 'Ocultar Lista' : 'Mostrar Lista'}
              </button>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <WorldMap 
              visitedCountries={visitedCountries}
              onCountryClick={handleCountryClick}
            />
            <Legend />
          </div>

          {showList && (
            <CountryList 
              visitedCountries={visitedCountries}
              onCountryClick={handleCountryClick}
            />
          )}
        </div>
      </main>

      <Tooltip id="country-tooltip" />
      {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default App;