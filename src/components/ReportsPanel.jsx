import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';

// After requesting a report we check a few more times, then stop: no endless polling.
const FOLLOW_UP_DELAYS_MS = [5000, 15000, 30000];

const STATUS_STYLES = {
  PENDIENTE: 'bg-gold/15 text-gold',
  GENERADO: 'bg-teal/15 text-teal',
  ERROR: 'bg-rust/15 text-rust'
};

// The API keeps its Spanish field names; they are mapped to English once, here.
const fromApi = (report) => ({
  id: report.id,
  status: report.estado,
  summary: report.resumen,
  requesterName: report.solicitanteNombre,
  createdAt: report.creadoEn
});

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

export default function ReportsPanel() {
  const auth = useAuth();
  const [reports, setReports] = useState([]);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/informes');
      setReports(response.data.map(fromApi));
      setError('');
    } catch (e) {
      setError(`No se pudo consultar el BFF (${e.response?.status ?? 'sin respuesta'}).`);
    }
  }, []);

  const followUpTimers = useRef([]);

  const cancelFollowUps = () => {
    followUpTimers.current.forEach(clearTimeout);
    followUpTimers.current = [];
  };

  const scheduleFollowUps = () => {
    cancelFollowUps();
    followUpTimers.current = FOLLOW_UP_DELAYS_MS.map((delay) => setTimeout(load, delay));
  };

  useEffect(() => {
    load();
    return cancelFollowUps;
  }, [load]);

  const generate = async () => {
    setSending(true);
    setNotice('');
    setError('');
    try {
      const profile = auth.user?.profile ?? {};
      const response = await apiClient.post('/api/informes', {
        email: profile.email,
        nombre: profile.name ?? profile.email
      });
      setNotice(`${response.data?.mensaje ?? 'Solicitud recibida con éxito'}. El informe llegará a tu correo.`);
      await load();
      scheduleFollowUps();
    } catch (e) {
      const status = e.response?.status;
      setError(status === 403
        ? 'Solo el administrador puede generar informes.'
        : `No se pudo solicitar el informe (${status ?? 'sin respuesta'}).`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-semibold text-ink">Informes</h2>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="border border-navy text-navy font-semibold px-4 py-2.5 rounded hover:bg-navy/5 transition"
          >
            Actualizar
          </button>
          <button
            onClick={generate}
            disabled={sending}
            className="bg-navy text-white font-semibold px-5 py-2.5 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {sending ? 'Enviando...' : 'Generar informe'}
          </button>
        </div>
      </div>

      {notice && <p className="text-teal text-sm mb-3">{notice}</p>}
      {error && <p className="text-rust text-sm mb-3">{error}</p>}

      {reports.length === 0 ? (
        <p className="text-ink/60">Todavía no se han generado informes.</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li key={report.id} className="border-l-4 border-navy bg-white rounded p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">
                  Informe #{report.id}{report.requesterName ? ` · ${report.requesterName}` : ''}
                </p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${STATUS_STYLES[report.status] ?? ''}`}>
                  {report.status}
                </span>
              </div>
              {report.summary && <p className="text-sm text-ink/70 mt-1">{report.summary}</p>}
              <p className="text-xs text-ink/40 mt-1">Solicitado {formatDate(report.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
