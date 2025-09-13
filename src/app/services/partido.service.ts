import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Partido, Equipo, Jugadora, Accion } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  constructor(private http: HttpClient) {}

  getPartido(id: string): Observable<Partido> {
    return this.http.get(`https://basket-proxy.vercel.app/api/partido?id=${id}`, { responseType: 'text' })
      .pipe(map(html => this.parseHtml(html)));
  }

private parseHtml(html: string): Partido {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Datos generales
  const estado = doc.querySelector('.top-info td:first-child')?.textContent?.trim() || '';
  const categoria = doc.querySelector('.bottom-info td:first-child')?.textContent?.trim() || '';
  const fecha = doc.querySelector('.bottom-info td:last-child')?.textContent?.trim() || '';

  // Equipos y jugadoras
  const equipos: Equipo[] = [];
  const teamTables = Array.from(doc.querySelectorAll('.player-table'));

  teamTables.forEach(table => {
    const nombre = table.querySelector('h3')?.textContent?.trim() || '';
    const color = table.querySelector('h3')?.getAttribute('style')?.match(/#[0-9A-Fa-f]{6}/)?.[0] || '';

    const jugadores: Jugadora[] = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
      const tds = tr.querySelectorAll('td');
      return {
        nombre: tds[0]?.textContent?.trim() || '',
        pts: parseInt(tds[1]?.textContent || '0', 10),
        t2: parseInt(tds[2]?.textContent || '0', 10),
        t3: parseInt(tds[3]?.textContent || '0', 10),
        tl: tds[4]?.textContent?.trim() || '',
        fp: parseInt(tds[5]?.textContent || '0', 10)
      };
    });

    equipos.push({ nombre, color, jugadores });
  });

  // Acciones del partido
  const acciones: Accion[] = [];
  const elementos = doc.querySelectorAll('.right-panel .elementoAccion');
  elementos.forEach(el => {
    const periodo = el.querySelector('.ge-match-time-info')?.textContent?.trim() || '';
    const tiempo = el.querySelector('.ge-match-time-sec')?.textContent?.trim() || '';
    
    const descElements = el.querySelectorAll('.pp-item-mes-info-text__desc');
    const descripcion = descElements[0]?.textContent?.trim() || '';
    const jugador = descElements[1]?.textContent?.trim() || '';

  const geMatchTime = el.querySelector('.ge-match-time');
  let equipo = '';
  if (geMatchTime) {
    const commentNode = Array.from(geMatchTime.childNodes)
      .find(n => n.nodeType === Node.COMMENT_NODE) as Comment | undefined;

    if (commentNode) {
      if (commentNode.textContent?.includes('equipoA')) {
        equipo = equipos[0]?.nombre || ''; // equipo local
      } else if (commentNode.textContent?.includes('equipoB')) {
        equipo = equipos[1]?.nombre || ''; // equipo visitante
      }
    }
  }

    const imagen = el.querySelector('.pp-item-mes-info img')?.getAttribute('src') || '';

    const marcadorLocal = el.querySelector('.pp-item-mes-score__local')?.textContent?.trim() || '';
    const marcadorVisitante = el.querySelector('.pp-item-mes-score__visitor')?.textContent?.trim() || '';

    acciones.push({ periodo, tiempo, descripcion, jugador, equipo, imagen, marcadorLocal, marcadorVisitante });
  });

  // Agrupar acciones por periodo y ordenar cronológicamente dentro de cada periodo
  const accionesPorPeriodo: { [periodo: string]: Accion[] } = {};
  acciones.reverse(); // Primero invertimos para que empiece desde P1 hacia P4

  acciones.forEach(acc => {
    if (!accionesPorPeriodo[acc.periodo]) {
      accionesPorPeriodo[acc.periodo] = [];
    }
    accionesPorPeriodo[acc.periodo].push(acc);
  });

  /*Object.keys(accionesPorPeriodo).forEach(periodo => {
  accionesPorPeriodo[periodo].reverse();
  });*/

  return { estado, categoria, fecha, equipos, accionesPorPeriodo };
}
}
