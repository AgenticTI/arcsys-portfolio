const CATEGORY_MAP: Record<string, string> = {
  "men's clothing":   'Masculino',
  "jewelery":         'Joias',
  "electronics":      'Eletrônicos',
  "women's clothing": 'Feminino',
}

export function translateCategory(raw: string): string {
  return CATEGORY_MAP[raw.toLowerCase()] ?? raw
}
