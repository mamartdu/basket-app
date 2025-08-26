import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PartidoService } from '../../services/partido.service';
import { Partido } from '../../models/partido.model';
@Component({
  selector: 'app-partido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css'],
})
export class PartidoComponent implements OnInit {
  partido: Partido | null = null;
  objectKeys = Object.keys;
  constructor(
    private route: ActivatedRoute,
    private partidoService: PartidoService
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.partidoService.getPartido(id).subscribe({
      next: (data) => {
        this.partido = data;
        console.log('Partido cargado:', this.partido); // <-- aquí logueas el objeto completo
      },
      error: (err) => console.error('Error cargando partido', err),
    });
  }

  getColorByEquipo(equipo: string): string {
    const eq = this.partido?.equipos.find((e) => e.nombre === equipo);
    return eq?.color || '#000';
  }
}
