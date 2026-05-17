import type { AttributeKey } from './rules'
import type { Sheet } from '../types/sheet'

const defaultAttributes: Record<AttributeKey, number> = {
  forca: 15,
  destreza: 14,
  constituicao: 13,
  sabedoria: 12,
  vontade: 10,
  presenca: 8,
}

export const initialSheet: Sheet = {
  name: 'Marinheiro Errante',
  epithet: 'A Maré Sem Bandeira',
  concept: 'Aventureiro independente em busca de um mapa impossível',
  origin: 'Ilha costeira esquecida pela marinha',
  dream: 'Encontrar uma rota que ninguém conseguiu registrar',
  path: 'Liberdade pela descoberta',
  background: 'Aprendiz de navegador que deixou o porto antes de escolher um lado',
  portraitUrl: '',
  level: 1,
  xp: 0,
  speciesName: 'Humanos',
  variant: 'Humanos Comuns',
  variantNotes: '',
  styleName: 'Lutador',
  primary: 'forca',
  professionName: 'Navegador',
  attributes: defaultAttributes,
  currentHp: 23,
  temporaryHp: 0,
  currentPp: 2,
  exhaustion: 0,
  defenseMode: 'normal',
  proficientSkills: ['Atletismo', 'Percepção', 'Sobrevivência'],
  haki: '',
  akuma: '',
  abilities: '',
  techniques: '',
  inventory: 'Mochila, cantil, roupas de viagem, anotações de rota e Bellys iniciais.',
  inventoryEntries: [
    { itemName: 'Mochila Pequena', quantity: 1 },
    { itemName: 'Cantil', quantity: 1 },
    { itemName: 'Corda', quantity: 1 },
  ],
  itemCategory: 'Equipamento',
  notes: '',
}
