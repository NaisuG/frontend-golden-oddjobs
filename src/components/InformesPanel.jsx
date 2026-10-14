import { useCallback, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';

const ESTADOS = {
  PENDIENTE: 'bg-gold/15 text-gold',
  GENERADO: 'bg-teal/15 text-teal',
  ERROR: 'bg-rust/15 text-rust'
};

function fecha(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

export default function InformesPanel() {
  const auth = useAuth();
  const [informes, setInformes] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/informes');
      setInformes(res.data);
      setError('');
    } catch (e) {
      setError(`No se pudo consultar el BFF (${e.response?.status ?? 'sin respuesta'}).`);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const hayPendientes = informes.some((i) => i.estado === 'PENDIENTE');
  useEffect(() => {
    if (!hayPendientes) return undefined;
    const t = setInterval(cargar, 3000);
    return () => clearInterval(t);
  }, [hayPendientes, cargar]);

  const generar = async () => {
    setEnviando(true);
    setAviso('');
    setError('');
    try {
      const perfil = auth.user?.profile ?? {};
      const res = await apiClient.post('/api/informes', {
        email: perfil.email,
        nombre: perfil.name ?? perfil.email
      });
      setAviso(`${res.data?.mensaje ?? 'Solicitud recibida con éxito'}. El informe llegará a tu correo.`);
      await cargar();
    } catch (e) {
      const status = e.response?.status;
      setError(status === 403
        ? 'Solo el administrador puede generar informes.'
        : `No se pudo solicitar el informe (${status ?? 'sin respuesta'}).`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-semibold text-ink">Informes</h2>
        <button
          onClick={generar}
          disabled={enviando}
          className="bg-navy text-white font-semibold px-5 py-2.5 rounded hover:opacity-90 transition disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'Generar informe'}
        </button>
      </div>

      {aviso && <p className="text-teal text-sm mb-3">{aviso}</p>}
      {error && <p className="text-rust text-sm mb-3">{error}</p>}

      {informes.length === 0 ? (
        <p className="text-ink/60">Todavía no se han generado informes.</p>
      ) : (
        <ul className="space-y-3">
          {informes.map((i) => (
            <li key={i.id} className="border-l-4 border-navy bg-white rounded p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">
                  Informe #{i.id}{i.solicitanteNombre ? ` · ${i.solicitanteNombre}` : ''}
                </p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${ESTADOS[i.estado] ?? ''}`}>
                  {i.estado}
                </span>
              </div>
              {i.resumen && <p className="text-sm text-ink/70 mt-1">{i.resumen}</p>}
              <p className="text-xs text-ink/40 mt-1">Solicitado {fecha(i.creadoEn)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
