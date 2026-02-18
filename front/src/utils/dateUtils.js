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
