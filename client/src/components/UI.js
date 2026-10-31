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
