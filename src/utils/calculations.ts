import type { AttributeKey, CombatStyle, Species } from '../data/rules'
import { xpTable } from '../data/rules'

export type AttributeMap = Record<AttributeKey, number>

export function abilityModifier(score: number) {
  return Math.floor((score - 10) / 2)
}

export function formatModifier(value: number) {
  return value >= 0 ? `+${value}` : String(value)
}

export function proficiencyBonus(level: number) {
  return xpTable.find((row) => row.level === level)?.proficiency ?? 2
}

export function powerPoints(level: number) {
  return level * 2
}

function averageHitDie(hitDie: CombatStyle['hitDie']) {
  return Math.floor(hitDie / 2) + 1
}

export function suggestedHitPoints(level: number, style: CombatStyle, species: Species, constitution: number) {
  const conMod = abilityModifier(constitution)
  const firstLevel = style.hitDie + species.hpBase + Math.max(1, conMod)
  const laterLevels = Math.max(0, level - 1) * Math.max(1, averageHitDie(style.hitDie) + conMod)
  return firstLevel + laterLevels
}

export function resistanceClass(attributes: AttributeMap, style: CombatStyle, primary: AttributeKey, useWarriorBody: boolean, level: number) {
  if (!useWarriorBody) {
    return 10 + abilityModifier(attributes.destreza)
  }

  const primaryMod = Math.max(1, abilityModifier(attributes[primary] ?? attributes[style.primary[0]]))
  const constitutionCap = level === 1 ? 1 : Math.floor(level / 2)
  const constitutionMod = Math.min(constitutionCap, abilityModifier(attributes.constituicao))
  return 10 + primaryMod + Math.max(0, constitutionMod)
}

export function skillTotal(attribute: AttributeKey, attributes: AttributeMap, proficient: boolean, level: number) {
  return abilityModifier(attributes[attribute]) + (proficient ? proficiencyBonus(level) : 0)
}

export function techniqueDifficulty(level: number, attributes: AttributeMap, primary: AttributeKey) {
  return 8 + proficiencyBonus(level) + abilityModifier(attributes[primary])
}

export function attackBonus(level: number, attributes: AttributeMap, primary: AttributeKey) {
  return proficiencyBonus(level) + abilityModifier(attributes[primary])
}

export function carryingCapacity(strength: number) {
  return {
    load: strength * 10,
    drag: strength * 20,
    overload: strength * 3,
    heavyOverload: strength * 6,
  }
}
