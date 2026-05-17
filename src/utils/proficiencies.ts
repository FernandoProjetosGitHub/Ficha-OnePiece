import type { CombatStyle, Profession, Skill, Species } from '../data/rules'

export type ProficiencyChoiceRule = {
  source: string
  max: number
  options: string[]
  note: string
}

export type ProficiencyPlan = {
  maxChoices: number
  availableSkills: string[]
  rules: ProficiencyChoiceRule[]
}

function splitSkillList(text: string, skillNames: string[]) {
  return skillNames.filter((skillName) => text.includes(skillName))
}

function parseChoiceText(source: string, text: string, skillNames: string[]): ProficiencyChoiceRule | null {
  const choiceMatch = text.match(/Escolha\s+(\d+)\s+(?:perícias?\s+)?(?:(quaisquer)|entre:?\s+(.+))/i)

  if (!choiceMatch) return null

  const max = Number(choiceMatch[1])
  const isAnyChoice = Boolean(choiceMatch[2])
  const options = isAnyChoice ? skillNames : splitSkillList(choiceMatch[3] ?? '', skillNames)

  return {
    source,
    max,
    options,
    note: isAnyChoice ? `Escolha ${max} perícias quaisquer.` : `Escolha ${max} entre as perícias listadas no PDF.`,
  }
}

function getSpeciesChoiceRule(species: Species, skillNames: string[]): ProficiencyChoiceRule | null {
  if (species.name === 'Humanos') {
    return {
      source: 'Espécie: Humanos',
      max: 3,
      options: skillNames.filter((skillName) => !['Haki', 'Sobrenatural', 'Sorte'].includes(skillName)),
      note: 'Adaptação: escolha 3 perícias, exceto Haki, Sobrenatural e Sorte.',
    }
  }

  if (species.name === 'Celestiais') {
    return {
      source: 'Espécie: Celestiais',
      max: 2,
      options: skillNames.filter((skillName) => !['Sobrenatural', 'Sorte'].includes(skillName)),
      note: 'Herança Cultural: escolha 2 perícias, exceto Sobrenatural e Sorte; uma delas pode virar Haki da Observação Inato com aprovação.',
    }
  }

  return null
}

export function buildProficiencyPlan(
  style: CombatStyle,
  profession: Profession,
  species: Species,
  skills: Skill[],
): ProficiencyPlan {
  const skillNames = skills.map((skill) => skill.name)
  const rules = [
    parseChoiceText(`Estilo: ${style.name}`, style.skillChoices, skillNames),
    parseChoiceText(`Profissão: ${profession.name}`, profession.proficiencies, skillNames),
    getSpeciesChoiceRule(species, skillNames),
  ].filter((rule): rule is ProficiencyChoiceRule => Boolean(rule))

  const availableSkills = Array.from(new Set(rules.flatMap((rule) => rule.options)))
  const maxChoices = rules.reduce((total, rule) => total + rule.max, 0)

  return {
    maxChoices,
    availableSkills,
    rules,
  }
}
