const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// HTTP function: obtiene proyectos de Behance, guarda en Firestore y devuelve JSON
exports.fetchBehance = functions.runWith({ memory: '256MB', timeoutSeconds: 60 }).https.onRequest(async (req, res) => {
  try {
    const key = functions.config().behance?.key;
    const user = functions.config().behance?.user || 'dianajolivero1';
    if (!key) return res.status(400).json({ error: 'BEHANCE_KEY no configurada' });

    const url = `https://api.behance.net/v2/users/${encodeURIComponent(user)}/projects?api_key=${encodeURIComponent(key)}`;
    const resp = await fetch(url);
    if (!resp.ok) return res.status(502).json({ error: 'Error al consultar Behance', status: resp.status });
    const json = await resp.json();
    const projects = (json.projects || []).map(p => ({
      id: p.id,
      title: p.name,
      url: p.url,
      cover: p.covers?.original || Object.values(p.covers || {})[0] || '',
      description: Array.isArray(p.fields) ? p.fields.join(', ') : (p.description || ''),
      views: p.stats?.views || 0,
      likes: p.stats?.appreciations || 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }));

    // batch write to Firestore collection "projects"
    const batch = db.batch();
    projects.forEach(p => {
      const ref = db.collection('projects').doc(String(p.id));
      batch.set(ref, p, { merge: true });
    });
    if (projects.length) await batch.commit();

    return res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// función programada (cada 1 hora) que llama a la misma lógica de fetch y guarda en Firestore
const fetchAndSave = async () => {
  try {
    const key = functions.config().behance?.key;
    const user = functions.config().behance?.user || 'dianajolivero1';
    if (!key) throw new Error('BEHANCE_KEY no configurada');

    const url = `https://api.behance.net/v2/users/${encodeURIComponent(user)}/projects?api_key=${encodeURIComponent(key)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Error al consultar Behance, status: ${resp.status}`);
    const json = await resp.json();
    const projects = (json.projects || []).map(p => ({
      id: p.id,
      title: p.name,
      url: p.url,
      cover: p.covers?.original || Object.values(p.covers || {})[0] || '',
      description: Array.isArray(p.fields) ? p.fields.join(', ') : (p.description || ''),
      views: p.stats?.views || 0,
      likes: p.stats?.appreciations || 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }));

    // batch write to Firestore collection "projects"
    const batch = db.batch();
    projects.forEach(p => {
      const ref = db.collection('projects').doc(String(p.id));
      batch.set(ref, p, { merge: true });
    });
    if (projects.length) await batch.commit();
  } catch (err) {
    console.error('Error en la función programada:', err);
  }
};

exports.scheduledFetchBehance = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async (context) => {
    await fetchAndSave();
    return null;
  });
