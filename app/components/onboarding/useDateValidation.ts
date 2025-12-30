import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Extend dayjs with custom parse format plugin
dayjs.extend(customParseFormat);

/**
 * Resultado da validação de data de nascimento
 */
export interface DateValidationResult {
  isValid: boolean;
  errors: {
    day?: string;
    month?: string;
    year?: string;
    general?: string;
  };
}

/**
 * Configurações padrão para validação de data de nascimento
 */
export interface DateValidationConfig {
  /** Idade mínima requerida (default: 18) */
  minAge?: number;
  /** Idade máxima permitida (default: 120) */
  maxAge?: number;
  /** Ano mínimo permitido (default: 1900) */
  minYear?: number;
}

/**
 * Número de dias em cada mês (ano não bissexto)
 */
const DAYS_IN_MONTH: Record<number, number> = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

/**
 * Verifica se um ano é bissexto
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Retorna o número máximo de dias para um mês específico, considerando ano bissexto
 */
function getMaxDaysInMonth(month: number, year: number): number {
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return DAYS_IN_MONTH[month] || 31;
}

/**
 * Valida a data de nascimento com três campos separados (dia, mês, ano)
 * Utiliza Day.js para validações de data
 *
 * @param day - Dia do nascimento (string)
 * @param month - Mês do nascimento (string)
 * @param year - Ano do nascimento (string)
 * @param config - Configurações opcionais de validação
 * @returns Resultado da validação com erros específicos para cada campo
 */
export function validateBirthDate(
  day: string,
  month: string,
  year: string,
  config: DateValidationConfig = {}
): DateValidationResult {
  const { minAge = 1, maxAge = 120, minYear = 1900 } = config;

  const errors: DateValidationResult["errors"] = {};
  const currentYear = dayjs().year();
  const today = dayjs();

  // ==========================================
  // VALIDAÇÃO DO DIA
  // ==========================================

  // Verificar se o dia está vazio
  if (!day || day.trim() === "") {
    errors.day = "O dia é obrigatório";
  } else {
    const dayNum = parseInt(day, 10);

    // Verificar se é um número válido
    if (isNaN(dayNum)) {
      errors.day = "O dia deve ser um número válido";
    } else if (dayNum < 1 || dayNum > 31) {
      errors.day = "O dia deve estar entre 1 e 31";
    }
  }

  // ==========================================
  // VALIDAÇÃO DO MÊS
  // ==========================================

  // Verificar se o mês está vazio
  if (!month || month.trim() === "") {
    errors.month = "O mês é obrigatório";
  } else {
    const monthNum = parseInt(month, 10);

    // Verificar se é um número válido
    if (isNaN(monthNum)) {
      errors.month = "O mês deve ser um número válido";
    } else if (monthNum < 1) {
      errors.month = "O mês não pode ser menor que 1";
    } else if (monthNum > 12) {
      errors.month = "O mês não pode ser maior que 12";
    }
  }

  // ==========================================
  // VALIDAÇÃO DO ANO
  // ==========================================

  // Verificar se o ano está vazio
  if (!year || year.trim() === "") {
    errors.year = "O ano é obrigatório";
  } else {
    const yearNum = parseInt(year, 10);

    // Verificar se é um número válido
    if (isNaN(yearNum)) {
      errors.year = "O ano deve ser um número válido";
    } else if (yearNum < minYear) {
      errors.year = `O ano não pode ser anterior a ${minYear}`;
    } else if (yearNum > currentYear) {
      errors.year = "O ano não pode ser futuro";
    }
  }

  // Se houver erros básicos, retornar antes das validações combinadas
  if (errors.day || errors.month || errors.year) {
    return { isValid: false, errors };
  }

  // ==========================================
  // VALIDAÇÕES COMBINADAS (dia + mês + ano)
  // ==========================================

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  // Validar dia específico para o mês
  const maxDays = getMaxDaysInMonth(monthNum, yearNum);

  if (dayNum > maxDays) {
    if (monthNum === 2) {
      if (isLeapYear(yearNum)) {
        errors.day = "Fevereiro só tem 29 dias em anos bissextos";
      } else {
        errors.day = "Fevereiro só tem 28 dias neste ano";
      }
    } else {
      const monthNames = [
        "",
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      errors.day = `${monthNames[monthNum]} só tem ${maxDays} dias`;
    }
    return { isValid: false, errors };
  }

  // Montar a data completa usando Day.js
  const dateStr = `${yearNum}-${String(monthNum).padStart(2, "0")}-${String(
    dayNum
  ).padStart(2, "0")}`;
  const birthDate = dayjs(dateStr, "YYYY-MM-DD", true);

  // Verificar se a data é válida no Day.js
  if (!birthDate.isValid()) {
    errors.general = "A data informada é inválida";
    return { isValid: false, errors };
  }

  // Verificar se a data é futura
  if (birthDate.isAfter(today)) {
    errors.general = "A data de nascimento não pode ser futura";
    return { isValid: false, errors };
  }

  // Calcular a idade
  const age = today.diff(birthDate, "year");

  // Verificar idade mínima
  if (age < minAge) {
    errors.year = `Você precisa ter pelo menos ${minAge} anos`;
    return { isValid: false, errors };
  }

  // Verificar idade máxima (idade impossível)
  if (age > maxAge) {
    errors.year = `A idade não pode ser superior a ${maxAge} anos`;
    return { isValid: false, errors };
  }

  // ==========================================
  // DATA VÁLIDA
  // ==========================================

  return { isValid: true, errors: {} };
}

/**
 * Hook customizado para validação de data de nascimento
 * Retorna o resultado da validação e uma função para validar
 */
export function useDateValidation(config: DateValidationConfig = {}) {
  const validate = (day: string, month: string, year: string) => {
    return validateBirthDate(day, month, year, config);
  };

  return { validate };
}
