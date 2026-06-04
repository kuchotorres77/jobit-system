export const SEXO = {
    type: String,
    required: true,
    enum: ['femenino', 'masculino']
};

export const HORARIO = {
    type: String,
    enum: ['full-time', 'part-time', '24 horas', 'guardia nocturna']
};

export const DISPONIBILIDAD = {
    type: String,
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo', 'feriados']
};

export const CONTACTO = {
    type: String,
    enum: ['fijo', 'celular']
}