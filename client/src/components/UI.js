import { useEffect, useRef } from 'react';

const paths = {
  home: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  empleados: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 4v2"/></>,
  proyectos: <><path d="M3 7V5a2 2 0 0 1 2-2h5l3 4h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M8 14h8M8 17h5"/></>,
  asignaciones: <><rect x="2" y="3" width="7" height="7" rx="2"/><rect x="15" y="14" width="7" height="7" rx="2"/><path d="M9 6h6a3 3 0 0 1 3 3v5M15 11l3 3 3-3M6 10v8h9"/></>,
  salarios: <><rect x="2" y="5" width="20" height="15" rx="3"/><path d="M2 10h20M16 15h2M6 5V3h12"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  edit: <><path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14l-1 7Z"/></>,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></>,
  refresh: <><path d="M20 7V2l-4 4a8 8 0 0 0-12 7M4 17v5l4-4a8 8 0 0 0 12-7M20 7h-5M4 17h5"/></>,
  check: <><path d="m5 12 4 4L19 6"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
};
export function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.home}</svg>;
}

export const money = (value) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(Number(value) || 0);
export const dateLabel = (value) => value ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
export const matches = (term, ...values) => values.join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim());
export function Avatar({ name, small = false }) { return <span className={`avatar ${small ? 'small' : ''}`}>{initials(name)}</span>; }

export function Search({ value, onChange, placeholder = 'Buscar…' }) {
  return <label className="search"><Icon name="search"/><input aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}/></label>;
}
export function Empty({ title, children, icon = 'proyectos' }) {
  return <div className="empty"><span className="empty-icon"><Icon name={icon} size={28}/></span><h3>{title}</h3><p>{children}</p></div>;
}
export function Field({ label, children, ...props }) {
  return <label className="field"><span>{label}</span>{children || <input {...props}/>}</label>;
}
export function Actions({ onEdit, onDelete, label, disabled }) {
  return <div className="row-actions"><button type="button" className="icon-button" title={`Editar ${label}`} aria-label={`Editar ${label}`} onClick={onEdit} disabled={disabled}><Icon name="edit" size={17}/></button><button type="button" className="icon-button danger" title={`Eliminar ${label}`} aria-label={`Eliminar ${label}`} onClick={onDelete} disabled={disabled}><Icon name="trash" size={17}/></button></div>;
}
export function FormButtons({ editing, busy, onCancel, createLabel = 'Guardar registro' }) {
  return <div className="form-buttons"><button className="button primary" disabled={busy}><Icon name={editing ? 'check' : 'plus'} size={18}/>{busy ? 'Guardando…' : editing ? 'Guardar cambios' : createLabel}</button>{editing && <button type="button" className="button secondary" onClick={onCancel} disabled={busy}>Cancelar edición</button>}</div>;
}

export function Confirm({ pending, busy, onClose, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current, previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus?.(); };
  }, []);
  return <dialog ref={ref} className="confirm-dialog" onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} aria-labelledby="confirm-title"><div className="dialog-icon"><Icon name="trash" size={25}/></div><h2 id="confirm-title">{pending.title || '¿Eliminar este registro?'}</h2><p>{pending.description}</p><div className="dialog-actions"><button className="button secondary" onClick={onClose} disabled={busy} autoFocus>Cancelar</button><button className="button destructive" onClick={onConfirm} disabled={busy}>{busy ? 'Eliminando…' : 'Sí, eliminar'}</button></div></dialog>;
}
