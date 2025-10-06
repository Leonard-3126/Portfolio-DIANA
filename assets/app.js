


// Edición de textos para admin
function initAdminEditing() {
	/**
	 * Crea y gestiona un botón "Guardar" para un input de imagen específico.
	 * El botón aparece al seleccionar un archivo y desaparece al guardarlo.
	 */
	function setupIndividualImageSave(inputId, storagePath, targetId) {
		const input = document.getElementById(inputId);
		if (!input) return;

		const wrapper = input.parentElement.closest('.image-upload-wrapper, .card-edit-panel, #profileAvatarEditPanel');
		if (!wrapper) return;

		// Crear botón de guardado
		const saveBtn = document.createElement('button');
		saveBtn.textContent = 'Guardar';
		saveBtn.className = 'btn-save-image';
		saveBtn.style.display = 'none'; // Oculto por defecto
		saveBtn.style.marginLeft = '10px';
		saveBtn.style.padding = '2px 8px';
		saveBtn.style.fontSize = '12px';
		wrapper.appendChild(saveBtn);

		// Mostrar botón al seleccionar archivo
		input.addEventListener('change', () => {
			if (input.files.length > 0) {
				saveBtn.style.display = 'inline-block';
				saveBtn.textContent = 'Guardar';
			}
		});

		// Acción al hacer clic en "Guardar"
		saveBtn.addEventListener('click', async () => {
			const file = input.files[0];
			if (file && window.firebaseAPI && window.firebaseAPI.uploadAndSaveImage) {
				saveBtn.textContent = 'Subiendo...';
				try {
					await window.firebaseAPI.uploadAndSaveImage(file, storagePath, targetId);
					saveBtn.textContent = '¡Listo!';
					setTimeout(() => { saveBtn.style.display = 'none'; }, 1500);
				} catch (error) {
					console.error("Error al subir imagen individual:", error);
					saveBtn.textContent = 'Error';
				}
			}
		});
	}

	function showEditButtons(show) {
		document.querySelectorAll('.edit-admin').forEach(btn => {
			btn.style.display = show ? 'inline-block' : 'none';
		});
		// Si no es admin, ocultar todos los lápices
		if (!show) {
			document.querySelectorAll('.edit-admin').forEach(btn => {
				btn.style.display = 'none';
			});
		}
	}
	function enableEditing() {
	// Hacer que la imagen de cada proyecto sea clickeable si hay link
	[1,2,3].forEach(i => {
		const thumb = document.getElementById(`project${i}Thumb`);
		const linkInput = document.getElementById(`project${i}LinkInput`);
		function updateThumbLink() {
			let url = linkInput ? linkInput.value.trim() : '';
			// Eliminar enlace anterior si existe
			if (thumb && thumb.parentElement.tagName === 'A') {
				const parent = thumb.parentElement;
				parent.replaceWith(thumb);
			}
			if (thumb && url) {
				const a = document.createElement('a');
				a.href = url;
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				thumb.parentNode.insertBefore(a, thumb);
				a.appendChild(thumb);
			}
		}
		if (linkInput) {
			linkInput.addEventListener('input', updateThumbLink);
			// Inicializar al cargar
			updateThumbLink();
		}
	});
		const editableIds = [
			// Hero
			'heroTitleText','heroSubtitle','heroLead',
			// Cards principales
			'card1Title','card1Text','card2Title','card2Text','card3Title','card3Text',
			// Proyectos destacados
			'projectsTitle','projectsDesc',
			'project1Tag','project1Title','project1Desc',
			'project2Tag','project2Title','project2Desc',
			'project3Tag','project3Title','project3Desc',
			// SOBRE MÍ
			'aboutTitle','aboutDesc',
			// Mi Historia
			'aboutStory1','aboutStory2','aboutStory3',
			'statIcon1','statValue1','statLabel1',
			'statIcon2','statValue2','statLabel2',
			'statIcon3','statValue3','statLabel3',
			'statIcon4','statValue4','statLabel4',
			// Perfil lateral
			'profileTitle','profileDesc',
			// Habilidades
			'skillsIntro',
			'skillLabel1','editSkillLabel1Btn','skillPercent1','editSkillPercent1Btn',
			'skillLabel2','editSkillLabel2Btn','skillPercent2','editSkillPercent2Btn',
			'skillLabel3','editSkillLabel3Btn','skillPercent3','editSkillPercent3Btn',
			'skillLabel4','editSkillLabel4Btn','skillPercent4','editSkillPercent4Btn',
			'skillsToolsTitle','editSkillsToolsTitleBtn',
			'tool1','editTool1Btn','tool2','editTool2Btn','tool3','editTool3Btn','tool4','editTool4Btn','tool5','editTool5Btn','tool6','editTool6Btn','tool7','editTool7Btn','tool8','editTool8Btn','tool9','editTool9Btn','tool10','editTool10Btn',
			// Filosofía
			'philosophy1','editPhilosophy1Btn','philosophy2','editPhilosophy2Btn','philosophy3','editPhilosophy3Btn',
			'philosophyCardTitle1','editPhilosophyCardTitle1Btn','philosophyCardDesc1','editPhilosophyCardDesc1Btn',
			'philosophyCardTitle2','editPhilosophyCardTitle2Btn','philosophyCardDesc2','editPhilosophyCardDesc2Btn',
			// Tabs sección sobre mí
			'tabHistoriaText','tabHabilidadesText','tabFilosofiaText',
			// Plataformas (ENCUÉNTRAME EN)
			'platformBehanceTitle','editPlatformBehanceTitleBtn','platformBehanceSub','editPlatformBehanceSubBtn',
			'platformBehanceFollowers','editPlatformBehanceFollowersBtn','platformBehanceFollowersLabel','editPlatformBehanceFollowersLabelBtn',
			'platformBehanceProjects','editPlatformBehanceProjectsBtn','platformBehanceProjectsLabel','editPlatformBehanceProjectsLabelBtn',
			'platformBehanceAppreciations','editPlatformBehanceAppreciationsBtn','platformBehanceAppreciationsLabel','editPlatformBehanceAppreciationsLabelBtn',
			'platformInstagramTitle','editPlatformInstagramTitleBtn','platformInstagramSub','editPlatformInstagramSubBtn',
			'platformInstagramFollowers','editPlatformInstagramFollowersBtn','platformInstagramFollowersLabel','editPlatformInstagramFollowersLabelBtn',
			'platformInstagramPosts','editPlatformInstagramPostsBtn','platformInstagramPostsLabel','editPlatformInstagramPostsLabelBtn',
			'platformInstagramEngagement','editPlatformInstagramEngagementBtn','platformInstagramEngagementLabel','editPlatformInstagramEngagementLabelBtn',
			'platformLinkedinTitle','editPlatformLinkedinTitleBtn','platformLinkedinSub','editPlatformLinkedinSubBtn',
			'platformLinkedinConnections','editPlatformLinkedinConnectionsBtn','platformLinkedinConnectionsLabel','editPlatformLinkedinConnectionsLabelBtn',
			'platformLinkedinArticles','editPlatformLinkedinArticlesBtn','platformLinkedinArticlesLabel','editPlatformLinkedinArticlesLabelBtn',
			'platformLinkedinViews','editPlatformLinkedinViewsBtn','platformLinkedinViewsLabel','editPlatformLinkedinViewsLabelBtn'
		];
			editableIds.forEach(id => {
				const el = document.getElementById(id);
				if (!el) return;
				el.contentEditable = true;
				el.classList.add('editable-admin');
			});
			// Mostrar paneles de edición de imagen y link en cada tarjeta
			[1,2,3].forEach(i => {
				const panel = document.getElementById(`card${i}EditPanel`);
				if (panel) panel.style.display = 'block';
				// Vista previa de imagen
				const input = document.getElementById(`card${i}ImgInput`);
				const preview = document.getElementById(`card${i}ImgPreview`);
				if (input && preview) {
					input.onchange = function(e) {
						const file = e.target.files[0];
						if (file) {
							const reader = new FileReader();
							reader.onload = function(ev) {
								preview.src = ev.target.result;
								preview.style.display = 'block';
							};
							reader.readAsDataURL(file);
						} else {
							preview.src = '';
							preview.style.display = 'none';
						}
					};
				}
				// Link editable
				const linkInput = document.getElementById(`card${i}LinkInput`);
				if (linkInput) {
					linkInput.oninput = function(e) {
						linkInput.setAttribute('data-link', linkInput.value.trim());
					};
				}
			});

			// Actualizar barra de progreso al editar porcentaje de skill
			[1,2,3,4].forEach(i => {
				const percentEl = document.getElementById(`skillPercent${i}`);
				const fillEl = document.querySelector(`.skill-row:nth-child(${i}) .skill-fill`);
				if (percentEl && fillEl) {
					percentEl.addEventListener('input', function() {
						let val = percentEl.innerText || percentEl.textContent;
						let num = parseInt(val);
						if (!isNaN(num) && num >= 0 && num <= 100) {
							fillEl.style.width = num + '%';
						}
					});
				}
			});

			// Configurar guardado individual para imágenes de proyectos
			setupIndividualImageSave('project1ImgInput', 'projects/project1', 'project1Thumb');
			setupIndividualImageSave('project2ImgInput', 'projects/project2', 'project2Thumb');
			setupIndividualImageSave('project3ImgInput', 'projects/project3', 'project3Thumb');
			// Y para el avatar (el path en storage es la carpeta)
			setupIndividualImageSave('profileAvatarInput', 'avatars/profile', 'profileAvatarImg');
	}
	function disableEditing() {
		document.querySelectorAll('.editable-admin').forEach(el => {
			el.contentEditable = false;
			el.classList.remove('editable-admin');
		});
		// Extra: asegurar que los campos de filosofía no sean editables si no es admin
		['philosophy1','philosophy2','philosophy3','philosophyCardTitle1','philosophyCardDesc1','philosophyCardTitle2','philosophyCardDesc2'].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.contentEditable = false;
				el.classList.remove('editable-admin');
			}
		});
	}
	// Avatar de perfil: permitir carga de imagen solo para admin
	const avatarEditPanel = document.getElementById('profileAvatarEditPanel');
	const avatarInput = document.getElementById('profileAvatarInput');
	const avatarImg = document.getElementById('profileAvatarImg');
	const avatarSVG = document.getElementById('profileAvatarSVG');
	if (avatarEditPanel) avatarEditPanel.style.display = 'block';
	if (avatarInput && avatarImg && avatarSVG) {
		avatarInput.onchange = function(e) {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = function(ev) {
					avatarImg.src = ev.target.result;
					avatarImg.style.display = 'block';
					avatarSVG.style.visibility = 'hidden';
				};
				reader.readAsDataURL(file);
			}
		};
	}
	let panel = document.getElementById('adminEditPanel');
	if (!panel) {
		panel = document.createElement('div');
		panel.id = 'adminEditPanel';
		panel.innerHTML = `
			<button id="saveAdminChanges" class="btn edit-admin">Guardar cambios</button>
			<button id="logoutAdmin" class="btn edit-admin" style="background:#eee;color:#333;margin-left:12px;">Cerrar sesión</button>
			<span id="saveStatus" style="margin-left:16px;color:var(--accent1);font-weight:700"></span>
		`;
		panel.style.position = 'fixed';
		panel.style.top = '16px';
		panel.style.right = '32px';
		panel.style.zIndex = '2000';
		panel.style.background = '#fff';
		panel.style.borderRadius = '12px';
		panel.style.boxShadow = '0 4px 18px rgba(122,92,255,0.08)';
		panel.style.padding = '12px 18px';
		panel.style.display = 'none';
		document.body.appendChild(panel);
	}
	function showPanel(show) {
		panel.style.display = show ? 'block' : 'none';
	}
	// Mostrar edición si admin
	if (document.body.classList.contains('is-admin')) {
		showEditButtons(true);
		enableEditing();
		showPanel(true);
	} else {
		showEditButtons(false);
		disableEditing();
		showPanel(false);
	}
	// Guardar cambios en Firestore
	panel.querySelector('#saveAdminChanges').onclick = async function() {
		const status = panel.querySelector('#saveStatus');
		status.textContent = 'Guardando textos...';
		
		const data = {
			texts: {},
			links: {}
		};

        // Recolectar todos los textos editables
        document.querySelectorAll('[contenteditable="true"]').forEach(el => {
            if (el.id) data.texts[el.id] = el.innerText.trim();
        });

        // Recolectar todos los links
        document.querySelectorAll('input[type="url"]').forEach(input => {
            if (input.id) data.links[input.id] = input.value.trim();
        });

		if (window.firebaseAPI && window.firebaseAPI.saveContent) {
			try {
				await window.firebaseAPI.saveContent(data);
				status.textContent = '¡Guardado!';
				setTimeout(()=>{status.textContent='';},1500);
			} catch(e) {
				console.error("Error al guardar contenido:", e);
				status.textContent = 'Error al guardar';
			}
		} else {
			status.textContent = 'API de Firebase no encontrada';
		}
	};
	// Cerrar sesión
	panel.querySelector('#logoutAdmin').onclick = function() {
		document.body.classList.remove('is-admin');
		showEditButtons(false);
		disableEditing();
		showPanel(false);
	};
}

// Mostrar edición admin al cargar si corresponde
document.addEventListener('DOMContentLoaded', () => {
	if (document.body.classList.contains('is-admin')) {
		initAdminEditing();
	}
});

// Mostrar edición admin al loguear
document.body.addEventListener('classChange', function() {
	if (document.body.classList.contains('is-admin')) {
		initAdminEditing();
	}
});
document.addEventListener('DOMContentLoaded', () => {
	// Tabs
	function initTabs(){
		document.querySelectorAll('.tab-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
				document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
				btn.classList.add('active');
				const id = btn.dataset.tab;
				const tab = document.getElementById(id);
				if (tab) tab.classList.add('active');
			});
		});
	}
	initTabs();

	// Smooth scroll
	function initSmoothScroll(){
		document.querySelectorAll('a[href^="#"]').forEach(a => {
			a.addEventListener('click', function (e) {
				const href = this.getAttribute('href');
				if (!href || href === '#' || this.dataset.modal) { e.preventDefault(); return; }
				const target = document.querySelector(href);
				if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
			});
		});
	}
	initSmoothScroll();

	// Modal contacto
	function initContactModal() {
		const modal = document.getElementById('contactModal');
		if (!modal) return;
		const closeBtn = modal.querySelector('.modal-close');
		function open() {
			modal.setAttribute('aria-hidden', 'false');
			document.body.style.overflow = 'hidden';
			const first = modal.querySelector('input,textarea,button');
			if (first) first.focus();
		}
		function close() {
			modal.setAttribute('aria-hidden', 'true');
			document.body.style.overflow = '';
			const status = modal.querySelector('#formStatus');
			if (status) status.textContent = '';
		}
		document.addEventListener('click', (e) => {
			const btn = e.target.closest && e.target.closest('.btn.contact, #contactBtn');
			if (!btn) return;
			e.preventDefault();
			open();
		});
		if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); close(); });
		modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
		document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close(); });
	}
	initContactModal();



	// Admin (único admin local) con intento a backend y fallback
	function initAdmin() {
		const adminBtn = document.getElementById('brandF');
		const adminModal = document.getElementById('adminModal');
		if (!adminBtn || !adminModal) return;

		const adminClose = adminModal.querySelector('.modal-close');
		const adminCancel = document.getElementById('adminCancel');
		const adminForm = document.getElementById('adminForm');
		const adminStatus = document.getElementById('adminStatus');

		// credenciales locales (simulado)
		const ADMIN_USER = 'admin';
		const ADMIN_PASS = 'admin123';

		function open() {
			adminModal.setAttribute('aria-hidden', 'false');
			document.body.style.overflow = 'hidden';
			const first = adminModal.querySelector('input');
			if (first) first.focus();
			if (adminStatus) adminStatus.textContent = '';
		}
		function close() {
			adminModal.setAttribute('aria-hidden', 'true');
			document.body.style.overflow = '';
			if (adminStatus) adminStatus.textContent = '';
		}

		adminBtn.addEventListener('click', (e) => { e.preventDefault(); open(); });
		adminBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
		if (adminClose) adminClose.addEventListener('click', (e) => { e.preventDefault(); close(); });
		if (adminCancel) adminCancel.addEventListener('click', () => close());
		adminModal.addEventListener('click', (e) => { if (e.target === adminModal) close(); });
		document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && adminModal.getAttribute('aria-hidden') === 'false') close(); });

		if (!adminForm) return;

		adminForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const fm = new FormData(adminForm);
			const userKey = fm.has('user') ? 'user' : (fm.has('email') ? 'email' : null);
			const passKey = fm.has('pass') ? 'pass' : (fm.has('password') ? 'password' : null);
			const user = userKey ? fm.get(userKey).toString().trim() : null;
			const pass = passKey ? fm.get(passKey).toString() : null;

			if (user === null || pass === null) {
				if (adminStatus) adminStatus.textContent = 'Formulario mal configurado: falta name="user" o name="pass"';
				console.error('FormData no contiene user/pass.');
				return;
			}
			if (!user || !pass) {
				if (adminStatus) adminStatus.textContent = 'Introduce usuario y contraseña';
				return;
			}

			adminStatus && (adminStatus.textContent = 'Comprobando credenciales...');

			// Intentar POST al endpoint relativo; si responde 405 o hay fallo, reintentar en http://localhost:3000
			async function tryServerLogin(url) {
				// Siempre usar POST, nunca GET con body
				try {
					const resp = await fetch(url, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ user, pass })
					});
					let json = {};
					try { json = await resp.json(); } catch (e) { /* ignore */ }
					return { ok: resp.ok, status: resp.status, json };
				} catch (err) {
					return { ok: false, status: 0, error: err };
				}
			}

			// Detectar si estamos en un entorno hospedado (GitHub Pages u otro host público).
			// En Pages no hay backend para /admin/login, así que saltamos los intentos server-side
			const hostname = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '';
			const isHosted = hostname && hostname !== 'localhost' && hostname !== '127.0.0.1';

			let result = { ok: false, status: 0 };
			if (!isHosted) {
				// primer intento: ruta relativa (útil cuando backend y frontend están en mismo host/puerto)
				result = await tryServerLogin('/admin/login');

				// si el servidor está sirviendo archivos estáticos (ej. live-server) puede devolver 405 o fallar; intentar backend en localhost:3000
				if (!result.ok && (result.status === 405 || result.status === 0)) {
					console.warn('Primer intento /admin/login falló, reintentando en http://localhost:3000/admin/login', result);
					result = await tryServerLogin('http://localhost:3000/admin/login');
				}
			} else {
				console.info('Entorno hospedado detectado (', hostname, '), saltando intentos server-side y usando Firebase cliente.');
			}

			// procesar resultado del servidor
			if (result.ok && result.json && result.json.ok) {
				if (adminStatus) adminStatus.textContent = 'Acceso permitido (server)';
				document.body.classList.add('is-admin');
				setTimeout(() => { close(); initAdminEditing(); }, 700);
				return;
			} else {
				// si servidor indicó credenciales inválidas explícitas, mostrar mensaje y no seguir con el fallback cliente.
				// Pero no bloqueamos el fallback ante errores generales (por ejemplo, errores del Admin SDK o problemas de credenciales del runner).
				if (result.status === 401 && result.json && result.json.msg && /credencial|invalid|inválid/i.test(result.json.msg)) {
					if (adminStatus) adminStatus.textContent = result.json.msg;
					setTimeout(() => { if (adminStatus) adminStatus.textContent = ''; }, 2000);
					return;
				}
			}

			// Si no hay backend o falló, intentar Firebase client-side si está disponible
			if (window.firebaseAuth && typeof window.firebaseAuth.signIn === 'function') {
				try {
					adminStatus && (adminStatus.textContent = 'Autenticando con Firebase (cliente)...');
					await window.firebaseAuth.signIn(user, pass);
					if (adminStatus) adminStatus.textContent = 'Acceso permitido (firebase cliente)';
					document.body.classList.add('is-admin');
					setTimeout(() => { close(); initAdminEditing(); }, 700);
					return;
				} catch (fbErr) {
					console.warn('Firebase client-side auth falló:', fbErr && fbErr.code ? fbErr.code : fbErr);
					// si falla, seguimos con el fallback local abajo
				}
			}

			// Fallback local (solo para desarrollo)
			if (user === ADMIN_USER && pass === ADMIN_PASS) {
				if (adminStatus) adminStatus.textContent = 'Acceso permitido (local)';
				document.body.classList.add('is-admin');
				setTimeout(() => { close(); initAdminEditing(); }, 700);
				return;
			}

			// nada funcionó
			if (adminStatus) adminStatus.textContent = 'Credenciales incorrectas';
			setTimeout(() => { if (adminStatus) adminStatus.textContent = ''; }, 1800);
		});
	}
	initAdmin();

	// Imagen en tarjetas de proyectos: reemplazar fondo por imagen seleccionada
	[1,2,3].forEach(i => {
		const imgInput = document.getElementById(`project${i}ImgInput`);
		const thumb = document.getElementById(`project${i}Thumb`);
		if (imgInput && thumb) {
			imgInput.addEventListener('change', function(e) {
				const file = e.target.files[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = function(ev) {
						thumb.style.background = `url('${ev.target.result}') center/cover no-repeat`;
					};
					reader.readAsDataURL(file);
				} else {
					// Si se elimina la imagen, restaurar el degradado original
					const gradients = [
						'linear-gradient(135deg,#ff6ea1,#7a5cff)',
						'linear-gradient(135deg,#ffcb6b,#ff6b9f)',
						'linear-gradient(135deg,#5be7ff,#8a6bff)'
					];
					thumb.style.background = gradients[i-1];
				}
			});
		}
	});

	// Eliminada la llamada a loadProjects para mantener las tarjetas estáticas
	if (typeof initModal === 'function') initModal();
	if (typeof initForm === 'function') initForm();
});
