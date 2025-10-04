import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

/**
 * Módulo API para interactuar con Firebase.
 * Centraliza toda la lógica de lectura y escritura.
 */

const firebaseConfig = {
  apiKey: "AIzaSyC4Sqg7BT49vap0ufK_OshQksA8AkVtL1U",
  authDomain: "portfolio-7ade3.firebaseapp.com",
  projectId: "portfolio-7ade3",
  storageBucket: "portfolio-7ade3.firebasestorage.app",
  messagingSenderId: "987173804252",
  appId: "1:987173804252:web:0eee2df4cf2462e60dbc19",
  measurementId: "G-XW2LZ7K5YE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const DOC_PATH = 'portfolio-content/page-data';

window.firebaseAPI = {
    /**
     * Carga todo el contenido de la página desde Firestore y lo aplica al DOM.
     */
    loadContent: async function() {
        const contentSnap = await getDoc(doc(db, DOC_PATH));
        if (!contentSnap.exists()) {
            console.warn("El documento de contenido no existe en Firestore.");
            return;
        }
        
        const data = contentSnap.data();

        // Cargar textos
        if (data.texts) {
            Object.entries(data.texts).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) el.innerText = value;
            });
        }

        // Cargar imágenes
        if (data.images) {
            // Avatar
            const avatarUrl = data.images.profileAvatarImg;
            if (avatarUrl) {
                const avatarImg = document.getElementById('profileAvatarImg');
                const avatarSVG = document.getElementById('profileAvatarSVG');
                if (avatarImg && avatarSVG) {
                    avatarImg.onload = () => {
                        avatarImg.style.display = 'block';
                        avatarSVG.style.visibility = 'hidden';
                    };
                    avatarImg.src = avatarUrl;
                }
            }
            // Proyectos
            for (let i = 1; i <= 3; i++) {
                const thumbUrl = data.images[`project${i}Thumb`];
                if (thumbUrl) {
                    const thumb = document.getElementById(`project${i}Thumb`);
                    if (thumb) {
                        thumb.style.background = `url('${thumbUrl}') center/cover no-repeat`;
                    }
                }
            }
        }

        // Actualizar barras de skills
        document.querySelectorAll('.skill-row').forEach((row, index) => {
            const i = index + 1;
            const percentEl = document.getElementById(`skillPercent${i}`);
            const fillEl = row.querySelector('.skill-fill');
            if (percentEl && fillEl) {
                let val = percentEl.innerText || percentEl.textContent;
                let num = parseInt(val);
                if (!isNaN(num) && num >= 0 && num <= 100) {
                    fillEl.style.width = num + '%';
                }
            }
        });
    },

    /**
     * Guarda únicamente los datos de texto y enlaces en Firestore.
     * @param {object} data Objeto con `texts` y `links`.
     */
    saveContent: async function(data) {
        const dataToSave = {
            texts: data.texts || {},
            links: data.links || {},
            updatedAt: new Date()
        };
        await setDoc(doc(db, DOC_PATH), dataToSave, { merge: true });
    },

    /**
     * Sube un único archivo a Storage y actualiza el campo de imagen en Firestore.
     * @param {File} file El archivo a subir.
     * @param {string} storagePath La ruta en Storage (ej: 'avatars/profile').
     * @param {string} targetId El ID del campo en el mapa `images` de Firestore (ej: 'profileAvatarImg').
     */
    uploadAndSaveImage: async function(file, storagePath, targetId) {
        if (!file) throw new Error("No se proporcionó ningún archivo.");

        // Crear una referencia única para el archivo en Storage
        const fileRef = storageRef(storage, `${storagePath}/${Date.now()}_${file.name}`);
        
        // Subir el archivo
        await uploadBytes(fileRef, file);
        
        // Obtener la URL de descarga
        const url = await getDownloadURL(fileRef);

        // Actualizar el documento en Firestore con la nueva URL
        const docRef = doc(db, DOC_PATH);
        await updateDoc(docRef, {
            [`images.${targetId}`]: url,
            updatedAt: new Date()
        });

        console.log(`Imagen '${targetId}' subida y guardada con éxito.`);
        return url; // Devolvemos la URL por si la UI la necesita
    }
};

// Cargar contenido inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseAPI.loadContent();
});