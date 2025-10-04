const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); /* <-- permitir JSON en body */

const PORT = process.env.PORT || 3000;
const BEHANCE_KEY = process.env.BEHANCE_KEY;
const BEHANCE_USER = process.env.BEHANCE_USER || 'dianajolivero1';
const CACHE_TTL = (process.env.CACHE_TTL_SECONDS ? Number(process.env.CACHE_TTL_SECONDS) : 3600) * 1000;

let adminSdk;
let firestore;
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
	try {
		// inicializar firebase-admin con el service account (ruta en .env)
		const admin = require('firebase-admin');
		adminSdk = admin;
		const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
		admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
		firestore = admin.firestore();
		console.info('Firebase Admin inicializado — Firestore disponible.');
	} catch (err) {
		console.warn('No se pudo inicializar Firebase Admin:', err.message || err);
	}
} else {
	console.info('FIREBASE_SERVICE_ACCOUNT_PATH no definido — admin login no disponible.');
}

// cache simple en memoria
let cache = { ts: 0, data: null };

app.use(express.static(path.join(__dirname))); // sirve index.html y assets/

/* Datos de ejemplo para mostrar cuando no se quiere usar la API externa.
   Puedes ajustar títulos, URLs y covers (uso placeholder público). */
const sampleProjects = [
	{
		id: 'sample-1',
		title: 'Interface Futurista',
		url: 'https://example.com/project-1',
		cover: 'https://via.placeholder.com/1200x720.png?text=Project+1',
		description: 'UI/UX Design',
		views: 12500,
		likes: 847
	},
	{
		id: 'sample-2',
		title: 'Identidad Visual',
		url: 'https://example.com/project-2',
		cover: 'https://via.placeholder.com/1200x720.png?text=Project+2',
		description: 'Branding',
		views: 8900,
		likes: 634
	},
	{
		id: 'sample-3',
		title: 'Packaging Experimental',
		url: 'https://example.com/project-3',
		cover: 'https://via.placeholder.com/1200x720.png?text=Project+3',
		description: 'Product Design',
		views: 15200,
		likes: 923
	}
];

app.get('/api/projects', async (req, res) => {
	try {
		// devolver cache si válido
		if (Date.now() - cache.ts < CACHE_TTL && cache.data) {
			return res.json(cache.data);
		}

		// Si no hay clave, devolver proyectos de ejemplo inmediatamente
		if (!BEHANCE_KEY) {
			cache = { ts: Date.now(), data: sampleProjects };
			return res.json(sampleProjects);
		}

		// Intentar obtener de Behance; si falla, usar fallback
		const url = `https://api.behance.net/v2/users/${encodeURIComponent(BEHANCE_USER)}/projects?api_key=${encodeURIComponent(BEHANCE_KEY)}`;
		let json;
		try {
			const resp = await fetch(url);
			if (!resp.ok) throw new Error('Error al obtener datos de Behance: ' + resp.status);
			json = await resp.json();
		} catch (err) {
			console.warn('Advertencia: fallo al obtener de Behance, usando proyectos de ejemplo. Detalle:', err.message || err);
			cache = { ts: Date.now(), data: sampleProjects };
			return res.json(sampleProjects);
		}

		const projects = (json.projects || []).map(p => {
			const cover = (p.covers && (p.covers['2024'] || p.covers['original'] || Object.values(p.covers)[0])) || '';
			return {
				id: p.id,
				title: p.name,
				url: p.url,
				cover,
				description: Array.isArray(p.fields) ? p.fields.join(', ') : (p.description || ''),
				views: p.stats && p.stats.views ? p.stats.views : 0,
				likes: p.stats && p.stats.appreciations ? p.stats.appreciations : 0
			};
		});

		cache = { ts: Date.now(), data: projects };
		res.json(projects);
	} catch (err) {
		console.error(err);
		// si algo inesperado falla, devolver fallback en vez de error crudo
		cache = { ts: Date.now(), data: sampleProjects };
		res.json(sampleProjects);
	}
});

/* NUEVO: endpoint para login admin que consulta Firestore */
app.post('/admin/login', async (req, res) => {
	try {
		if (!firestore) return res.status(503).json({ ok: false, msg: 'Auth service no disponible' });

		const { user, pass } = req.body || {};
		if (!user || !pass) return res.status(400).json({ ok: false, msg: 'Faltan credenciales' });

		const doc = await firestore.collection('admins').doc(user).get();
		if (!doc.exists) return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });

		const data = doc.data() || {};
		// Actualmente comparación directa; en producción compara hashes (bcrypt)
		if (data.password === pass) {
			// opcional: generar y devolver token aquí
			return res.json({ ok: true });
		} else {
			return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
		}
	} catch (err) {
		console.error('Error /admin/login:', err);
		return res.status(500).json({ ok: false, msg: 'Error interno' });
	}
});

/* NUEVO: endpoint de diagnóstico para comprobar conexión con Firestore */
app.get('/firebase/status', (req, res) => {
	try {
		let projectId = null;
		try {
			if (adminSdk && typeof adminSdk.app === 'function') {
				projectId = adminSdk.app().options && adminSdk.app().options.projectId ? adminSdk.app().options.projectId : null;
			}
		} catch (e) {
			projectId = null;
		}
		return res.json({
			ok: true,
			firestoreInitialized: !!firestore,
			projectId,
			envPathProvided: !!process.env.FIREBASE_SERVICE_ACCOUNT_PATH
		});
	} catch (err) {
		return res.status(500).json({ ok: false, error: String(err) });
	}
});

app.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
