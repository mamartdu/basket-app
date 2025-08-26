export interface Jugadora {
  nombre: string;
  pts: number;
  t2: number;
  t3: number;
  tl: string;
  fp: number;
}

export interface Equipo {
  nombre: string;
  color: string;
  jugadores: Jugadora[];
}

export interface Partido {
  estado: string;
  categoria: string;
  fecha: string;
  equipos: Equipo[];
  accionesPorPeriodo: { [periodo: string]: Accion[] };
}

export interface Accion {
  periodo: string;
  tiempo: string;
  equipo: string;
  descripcion: string;
  jugador: string;
  imagen: string;
  marcadorLocal: string;    
  marcadorVisitante: string;
}

export interface PartidoResumen {
  id: string;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  logoLocal?: string;
  logoVisitante?: string;
}