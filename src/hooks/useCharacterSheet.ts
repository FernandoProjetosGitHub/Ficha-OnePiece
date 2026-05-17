import { useMemo, useState } from 'react'
import { equipmentItems, combatStyles, professions, skills, species, type AttributeKey } from '../data/rules'
import { initialSheet } from '../data/initialSheet'
import {
  attackBonus,
  carryingCapacity,
  powerPoints,
  proficiencyBonus,
  resistanceClass,
  skillTotal,
  suggestedHitPoints,
  techniqueDifficulty,
} from '../utils/calculations'
import type { Confirmation, Sheet, Theme } from '../types/sheet'
import { buildProficiencyPlan, type ProficiencyPlan } from '../utils/proficiencies'

export function useCharacterSheet() {
  const [sheet, setSheet] = useState<Sheet>(initialSheet)
  const [theme, setTheme] = useState<Theme>('light')
  const [coverOpened, setCoverOpened] = useState(false)
  const [selectionsLocked, setSelectionsLocked] = useState(false)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [notice, setNotice] = useState('Ficha pronta para edição.')

  const selectedSpecies = useMemo(
    () => species.find((item) => item.name === sheet.speciesName) ?? species[0],
    [sheet.speciesName],
  )
  const selectedStyle = useMemo(
    () => combatStyles.find((item) => item.name === sheet.styleName) ?? combatStyles[0],
    [sheet.styleName],
  )
  const selectedProfession = useMemo(
    () => professions.find((item) => item.name === sheet.professionName) ?? professions[0],
    [sheet.professionName],
  )
  const proficiencyPlan = useMemo(
    () => buildProficiencyPlan(selectedStyle, selectedProfession, selectedSpecies, skills),
    [selectedStyle, selectedProfession, selectedSpecies],
  )

  const level = Math.min(20, Math.max(1, Number(sheet.level) || 1))
  const proficiency = proficiencyBonus(level)
  const maxPp = powerPoints(level)
  const suggestedHp = suggestedHitPoints(level, selectedStyle, selectedSpecies, sheet.attributes.constituicao)
  const cr = resistanceClass(sheet.attributes, selectedStyle, sheet.primary, sheet.defenseMode === 'warriorBody', level)
  const techniqueCd = techniqueDifficulty(level, sheet.attributes, sheet.primary)
  const attack = attackBonus(level, sheet.attributes, sheet.primary)
  const carry = carryingCapacity(sheet.attributes.forca)
  const passivePerception = 10 + skillTotal('vontade', sheet.attributes, sheet.proficientSkills.includes('Percepção'), level)
  const itemCategories = useMemo(() => Array.from(new Set(equipmentItems.map((item) => item.category))), [])
  const filteredItems = useMemo(
    () => equipmentItems.filter((item) => item.category === sheet.itemCategory),
    [sheet.itemCategory],
  )
  const registeredSlots = useMemo(
    () => sheet.inventoryEntries.reduce((total, entry) => {
      const item = equipmentItems.find((candidate) => candidate.name === entry.itemName)
      return total + (item?.load ?? 1) * entry.quantity
    }, 0),
    [sheet.inventoryEntries],
  )

  function updateSheet<Key extends keyof Sheet>(key: Key, value: Sheet[Key]) {
    setSheet((current) => ({ ...current, [key]: value }))
  }

  function updateAttribute(key: AttributeKey, value: number) {
    setSheet((current) => ({
      ...current,
      attributes: { ...current.attributes, [key]: value },
    }))
  }

  function sanitizeProficientSkills(nextSkills: string[], plan: ProficiencyPlan) {
    const allowed = new Set(plan.availableSkills)
    const unique = Array.from(new Set(nextSkills))
    return unique.filter((skillName) => allowed.has(skillName)).slice(0, plan.maxChoices)
  }

  function updateSkills(nextSkills: string[]) {
    if (selectionsLocked) return
    const limitedSkills = sanitizeProficientSkills(nextSkills, proficiencyPlan)
    setSheet((current) => ({ ...current, proficientSkills: limitedSkills }))
    setNotice(
      limitedSkills.length < nextSkills.length
        ? `Limite aplicado: ${proficiencyPlan.maxChoices} proficiências permitidas pelas escolhas atuais.`
        : limitedSkills.length
          ? 'Perícias atualizadas.'
          : 'Todas as perícias foram desmarcadas.',
    )
  }

  function requestLockToggle() {
    const willLock = !selectionsLocked
    setConfirmation({
      title: willLock ?'Travar escolhas?' : 'Destravar escolhas?',
      body: willLock
        ?'Espécie, estilo, profissão, perícias, defesa e itens selecionados ficarão protegidos contra mudanças acidentais.'
        : 'As escolhas estruturais voltarão a aceitar edição, remoção e desseleção.',
      confirmLabel: willLock ?'Travar ficha' : 'Destravar ficha',
      onConfirm: () => {
        setSelectionsLocked(willLock)
        setNotice(willLock ?'Escolhas travadas.' : 'Escolhas destravadas.')
      },
    })
  }

  function confirmAction() {
    confirmation?.onConfirm()
    setConfirmation(null)
  }

  function setSpecies(value: string) {
    const nextSpecies = species.find((item) => item.name === value) ?? species[0]
    const nextPlan = buildProficiencyPlan(selectedStyle, selectedProfession, nextSpecies, skills)
    setSheet((current) => ({
      ...current,
      speciesName: nextSpecies.name,
      variant: nextSpecies.variants[0] ?? '',
      proficientSkills: sanitizeProficientSkills(current.proficientSkills, nextPlan),
    }))
    setNotice(`Espécie definida: ${nextSpecies.name}.`)
  }

  function setStyle(value: string) {
    const style = combatStyles.find((item) => item.name === value) ?? combatStyles[0]
    const nextPlan = buildProficiencyPlan(style, selectedProfession, selectedSpecies, skills)
    setSheet((current) => ({
      ...current,
      styleName: style.name,
      primary: style.primary[0],
      proficientSkills: sanitizeProficientSkills(current.proficientSkills, nextPlan),
    }))
    setNotice(`Estilo definido: ${style.name}.`)
  }

  function setVariant(value: string) {
    updateSheet('variant', value)
    setNotice(`Variação definida: ${value}.`)
  }

  function setProfession(value: string) {
    const profession = professions.find((item) => item.name === value) ?? professions[0]
    const nextPlan = buildProficiencyPlan(selectedStyle, profession, selectedSpecies, skills)
    setSheet((current) => ({
      ...current,
      professionName: profession.name,
      proficientSkills: sanitizeProficientSkills(current.proficientSkills, nextPlan),
    }))
    setNotice(`Profissão definida: ${profession.name}.`)
  }

  function addItem(itemName: string) {
    if (selectionsLocked) return
    setSheet((current) => {
      const existing = current.inventoryEntries.find((entry) => entry.itemName === itemName)
      return {
        ...current,
        inventoryEntries: existing
          ?current.inventoryEntries.map((entry) =>
              entry.itemName === itemName ?{ ...entry, quantity: entry.quantity + 1 } : entry,
            )
          : [...current.inventoryEntries, { itemName, quantity: 1 }],
      }
    })
    setNotice(`${itemName} adicionado ao inventário.`)
  }

  function changeItemQuantity(itemName: string, delta: number) {
    if (selectionsLocked) return
    setSheet((current) => ({
      ...current,
      inventoryEntries: current.inventoryEntries
        .map((entry) =>
          entry.itemName === itemName
            ?{ ...entry, quantity: Math.max(0, entry.quantity + delta) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    }))
  }

  function removeItem(itemName: string) {
    if (selectionsLocked) return
    setSheet((current) => ({
      ...current,
      inventoryEntries: current.inventoryEntries.filter((entry) => entry.itemName !== itemName),
    }))
    setNotice(`${itemName} removido.`)
  }

  return {
    sheet,
    theme,
    coverOpened,
    selectionsLocked,
    confirmation,
    notice,
    selectedSpecies,
    selectedStyle,
    selectedProfession,
    level,
    proficiency,
    maxPp,
    suggestedHp,
    cr,
    techniqueCd,
    attack,
    carry,
    passivePerception,
    itemCategories,
    filteredItems,
    registeredSlots,
    proficiencyPlan,
    updateSheet,
    updateAttribute,
    updateSkills,
    requestLockToggle,
    confirmAction,
    cancelConfirmation: () => setConfirmation(null),
    openCover: () => setCoverOpened(true),
    toggleTheme: () => setTheme((current) => (current === 'light' ?'dark' : 'light')),
    setSpecies,
    setStyle,
    setVariant,
    setProfession,
    addItem,
    changeItemQuantity,
    removeItem,
  }
}
