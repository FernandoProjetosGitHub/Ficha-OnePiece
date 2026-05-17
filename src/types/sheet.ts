import type { AttributeKey } from '../data/rules'

export type InventoryEntry = {
  itemName: string
  quantity: number
}

export type Sheet = {
  name: string
  epithet: string
  concept: string
  origin: string
  dream: string
  path: string
  background: string
  portraitUrl: string
  level: number
  xp: number
  speciesName: string
  variant: string
  variantNotes: string
  styleName: string
  primary: AttributeKey
  professionName: string
  attributes: Record<AttributeKey, number>
  currentHp: number
  temporaryHp: number
  currentPp: number
  exhaustion: number
  defenseMode: 'normal' | 'warriorBody'
  proficientSkills: string[]
  haki: string
  akuma: string
  abilities: string
  techniques: string
  inventory: string
  inventoryEntries: InventoryEntry[]
  itemCategory: string
  notes: string
}

export type Theme = 'light' | 'dark'

export type Confirmation = {
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
}
