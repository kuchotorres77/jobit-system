export interface IDisponibilidad {
  dia?: string[]
  desde?: string
  hasta?: string
}

export interface ISubRubro {
  id?: number
  nombre?: string
  zonaCobertura?: string[]
  disponibilidad?: IDisponibilidad[]
}
