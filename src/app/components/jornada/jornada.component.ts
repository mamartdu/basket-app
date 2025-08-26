import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JornadaService } from '../../services/jornada.service';
import { FormsModule } from '@angular/forms';
import { PartidoResumen } from '../../models/partido.model';

@Component({
  selector: 'app-jornada',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.css']
})
export class JornadaComponent implements OnInit {

  partidos: PartidoResumen[] = [];
  fecha: string = new Date().toISOString().split('T')[0]; // fecha por defecto hoy
  categoria: string = '';

  categorias = [
    { id: '', nombre: 'Seleccione una categoría' },
    { id: '67ee6749e9903', nombre: 'F4 MASTER FEMENINA' },
    { id: '670913e27ccf7', nombre: 'MASTER FEMENINA-GRUPO ÚNICO' },
    { id: '681c7e8e7ceed', nombre: 'F4 SENIOR FEMENINA 1ª' },
    { id: '66d574630c375', nombre: 'SEN.FEM.1ª-GRUPO ÚNICO' },
    { id: '681b482763537', nombre: 'SENIOR FEMENINA 1ª - PLAY-IN' },
    { id: '68245498dd6ce', nombre: 'F4 SENIOR FEMENINA 2ª' },
    // ... añade el resto de categorías
  ];

  constructor(private jornadaService: JornadaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarPartidos();
  }

  cargarPartidos() {
    if (!this.categoria) {
      this.partidos = [];
      return;
    }
    this.jornadaService.getPartidos(this.fecha, this.categoria).subscribe({
      next: partidos => this.partidos = partidos,
      error: err => console.error('Error cargando partidos', err)
    });
  }

  verPartido(id: string) {
    this.router.navigate(['/partido', id]);
  }

  onFechaChange() {
    this.cargarPartidos();
  }

  onCategoriaChange() {
    this.cargarPartidos();
  }
}
