export const calculateMonthDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  if (end <= start) return 1;

  // Calculamos la diferencia en meses
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());

  // Si el día del mes es menor en la fecha final, no ha pasado el mes completo 
  // Pero para propósitos informativos, usaremos la diferencia de meses base con un mínimo de 1.
  return Math.max(1, months);
};

export const formatearRangoHorario = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return null;

  const inicioArg = horaInicio.slice(0, 5);
  const finArg = horaFin.slice(0, 5);

  const hInicio = parseInt(horaInicio.split(':')[0], 10);
  const hFin = parseInt(horaFin.split(':')[0], 10);

  const minInicio = horaInicio.split(':')[1];
  const minFin = horaFin.split(':')[1];

  const hInicioEur = String((hInicio + 4) % 24).padStart(2, '0');
  const hFinEur = String((hFin + 4) % 24).padStart(2, '0');

  const inicioEur = `${hInicioEur}:${minInicio}`;
  const finEur = `${hFinEur}:${minFin}`;

  return {
    horarioArg: `${inicioArg} a ${finArg} hs`,
    horarioEur: `${inicioEur} a ${finEur} hs`,
    textoPlano: `${inicioArg} a ${finArg} hs (AR) / ${inicioEur} a ${finEur} hs (ES/DE)`
  };
};

export const formatearFechaSinHora = (fechaString) => {
  if (!fechaString) return '';
  const date = new Date(fechaString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
