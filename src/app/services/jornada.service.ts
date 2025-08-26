import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PartidoResumen } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class JornadaService {

  constructor(private http: HttpClient) { }

  getPartidos(week: string, grupo: string): Observable<PartidoResumen[]> {
    return this.http.get(
      `https://basket-proxy.vercel.app/api/jornada?week=${week}&grupo=${grupo}`,
      { responseType: 'text' }
    ).pipe(
      map(html => this.extractPartidos(html))
    );
  }

  private extractPartidos(html: string): PartidoResumen[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const containers = Array.from(doc.querySelectorAll('.container2'));
    const partidos: PartidoResumen[] = [];

    containers.forEach(container => {
      const idMatch = container.getAttribute('onclick')?.match(/verPartido\('([a-z0-9]+)'\)/);
      if (!idMatch) return;

      const id = idMatch[1];

      const teamRows = container.querySelectorAll('.scoreboard .team-score');
      if (teamRows.length < 2) return;

      const equipoLocal = teamRows[0].querySelector('td:nth-child(2)')?.textContent?.trim() || '';
      const equipoVisitante = teamRows[1].querySelector('td:nth-child(2)')?.textContent?.trim() || '';

      const logoLocal = teamRows[0].querySelector('img')?.getAttribute('src') || '';
      const logoVisitante = teamRows[1].querySelector('img')?.getAttribute('src') || '';

      const fecha = container.querySelector('.bottom-info td:last-child')?.textContent?.trim() || '';

      partidos.push({ id, equipoLocal, equipoVisitante, fecha, logoLocal, logoVisitante });
    });

    return partidos;
  }
}
