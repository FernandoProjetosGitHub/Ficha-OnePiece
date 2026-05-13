import { useMemo, useState } from 'react'
import { Anchor, BookOpen, ChevronRight, Dice6, Download, HeartPulse, Shield, Sparkles, Swords, UserRound } from 'lucide-react'
import { DetailsCard } from './components/DetailsCard'
import { Field, SelectField, TextAreaField } from './components/Field'
import { attributes, basicAbilities, combatStyles, professions, skills, species, type AttributeKey } from './data/rules'
import { abilityModifier, attackBonus, carryingCapacity, formatModifier, powerPoints, proficiencyBonus, resistanceClass, skillTotal, suggestedHitPoints, techniqueDifficulty } from './utils/calculations'
import './App.css'

const defaultAttributes: Record<AttributeKey, number> = {
  forca: 15,
  destreza: 14,
  constituicao: 13,
  sabedoria: 12,
  vontade: 10,
  presenca: 8,
}

type Sheet = {
  name: string
  epithet: string
  concept: string
  origin: string
  dream: string
  path: string
  background: string
  level: number
  xp: number
  speciesName: string
  variant: string
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
  notes: string
}

const initialSheet: Sheet = {
  name: 'Marinheiro Errante',
  epithet: 'A Maré Sem Bandeira',
  concept: 'Aventureiro independente em busca de um mapa impossível',
  origin: 'Ilha costeira esquecida pela marinha',
  dream: 'Encontrar uma rota que ninguém conseguiu registrar',
  path: 'Liberdade pela descoberta',
  background: 'Aprendiz de navegador que deixou o porto antes de escolher um lado',
  level: 1,
  xp: 0,
  speciesName: 'Humanos',
  variant: 'Humanos Comuns',
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
  notes: '',
}

function App() {
  const [sheet, setSheet] = useState<Sheet>(initialSheet)

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

  const level = Math.min(20, Math.max(1, Number(sheet.level) || 1))
  const proficiency = proficiencyBonus(level)
  const maxPp = powerPoints(level)
  const suggestedHp = suggestedHitPoints(level, selectedStyle, selectedSpecies, sheet.attributes.constituicao)
  const cr = resistanceClass(sheet.attributes, selectedStyle, sheet.primary, sheet.defenseMode === 'warriorBody', level)
  const techniqueCd = techniqueDifficulty(level, sheet.attributes, sheet.primary)
  const attack = attackBonus(level, sheet.attributes, sheet.primary)
  const carry = carryingCapacity(sheet.attributes.forca)
  const passivePerception = 10 + skillTotal('vontade', sheet.attributes, sheet.proficientSkills.includes('Percepção'), level)

  function updateSheet<Key extends keyof Sheet>(key: Key, value: Sheet[Key]) {
    setSheet((current) => ({ ...current, [key]: value }))
  }

  function updateAttribute(key: AttributeKey, value: number) {
    setSheet((current) => ({
      ...current,
      attributes: { ...current.attributes, [key]: value },
    }))
  }

  function toggleSkill(skillName: string) {
    setSheet((current) => {
      const active = current.proficientSkills.includes(skillName)
      return {
        ...current,
        proficientSkills: active
          ? current.proficientSkills.filter((item) => item !== skillName)
          : [...current.proficientSkills, skillName],
      }
    })
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-copy">
          <span className="overline"><Anchor size={16} /> Registro de Aventureiro</span>
          <h1>Ficha online OP RPG</h1>
          <p>
            Um diário mecânico para personagens originais: fiel aos PDFs, rápido no celular
            e sem prender o jogador à ideia de tripulação fixa.
          </p>
        </div>
        <div className="hero-card">
          <span>{sheet.epithet}</span>
          <strong>{sheet.name || 'Personagem sem nome'}</strong>
          <small>{selectedSpecies.name} · {selectedStyle.name} · nível {level}</small>
        </div>
      </header>

      <section className="quick-stats" aria-label="Resumo da ficha">
        <Stat icon={<HeartPulse />} label="PV sugerido" value={suggestedHp} hint={`Atual ${sheet.currentHp}`} />
        <Stat icon={<Sparkles />} label="PP" value={`${sheet.currentPp}/${maxPp}`} hint="2 por nível" />
        <Stat icon={<Shield />} label="CR" value={cr} hint={sheet.defenseMode === 'warriorBody' ? 'Corpo de Guerreiro' : 'Base 10 + DES'} />
        <Stat icon={<Dice6 />} label="Prof." value={formatModifier(proficiency)} hint={`CD técnica ${techniqueCd}`} />
      </section>

      <section className="sheet-grid">
        <Panel title="Identidade" icon={<UserRound />}>
          <div className="form-grid">
            <Field label="Nome" value={sheet.name} onChange={(event) => updateSheet('name', event.target.value)} />
            <Field label="Epíteto" value={sheet.epithet} onChange={(event) => updateSheet('epithet', event.target.value)} />
            <Field label="Conceito original" value={sheet.concept} onChange={(event) => updateSheet('concept', event.target.value)} />
            <Field label="Origem" value={sheet.origin} onChange={(event) => updateSheet('origin', event.target.value)} />
            <Field label="Sonho" value={sheet.dream} onChange={(event) => updateSheet('dream', event.target.value)} />
            <Field label="Caminho" value={sheet.path} onChange={(event) => updateSheet('path', event.target.value)} />
            <TextAreaField label="Antecedente e história" value={sheet.background} onChange={(event) => updateSheet('background', event.target.value)} />
          </div>
        </Panel>

        <Panel title="Criação" icon={<BookOpen />}>
          <div className="form-grid">
            <SelectField label="Espécie" value={sheet.speciesName} options={species.map((item) => item.name)} onChange={(event) => updateSheet('speciesName', event.target.value)} />
            <Field label="Variante / ancestralidade" value={sheet.variant} onChange={(event) => updateSheet('variant', event.target.value)} />
            <SelectField label="Estilo de combate" value={sheet.styleName} options={combatStyles.map((item) => item.name)} onChange={(event) => {
              const style = combatStyles.find((item) => item.name === event.target.value) ?? combatStyles[0]
              setSheet((current) => ({ ...current, styleName: style.name, primary: style.primary[0] }))
            }} />
            <SelectField label="Atributo primário" value={sheet.primary} options={selectedStyle.primary.map((key) => ({ value: key, label: attributes[key] }))} onChange={(event) => updateSheet('primary', event.target.value as AttributeKey)} />
            <SelectField label="Profissão" value={sheet.professionName} options={professions.map((item) => item.name)} onChange={(event) => updateSheet('professionName', event.target.value)} />
            <Field label="Nível" type="number" min={1} max={20} value={level} onChange={(event) => updateSheet('level', Number(event.target.value))} />
            <Field label="Experiência" type="number" min={0} value={sheet.xp} onChange={(event) => updateSheet('xp', Number(event.target.value))} />
          </div>

          <DetailsCard title={`Detalhes da espécie: ${selectedSpecies.name}`} eyebrow="PDF · Capítulo 2" open>
            <InfoList items={[
              `PV base: ${selectedSpecies.hpBase}`,
              `Tamanho: ${selectedSpecies.size}`,
              `Deslocamento: ${selectedSpecies.movement}; nado: ${selectedSpecies.swim}`,
              `Preconceito: ${selectedSpecies.prejudice}`,
              ...selectedSpecies.benefits.map((item) => `Benefício: ${item}`),
              ...selectedSpecies.difficulties.map((item) => `Dificuldade: ${item}`),
              ...selectedSpecies.variants.map((item) => `Variante: ${item}`),
              ...selectedSpecies.notes,
            ]} />
          </DetailsCard>

          <DetailsCard title={`Detalhes do estilo: ${selectedStyle.name}`} eyebrow={selectedStyle.source}>
            <InfoList items={[
              `Categoria: ${selectedStyle.category}`,
              `Dado de Vida: d${selectedStyle.hitDie}`,
              `Salvaguardas: ${selectedStyle.saves.map((save) => attributes[save]).join(', ')}`,
              `Armas/proficiências: ${selectedStyle.weapons}`,
              `Perícias: ${selectedStyle.skillChoices}`,
              `Arma favorita: ${selectedStyle.favoriteWeapon}`,
              `HB inata: ${selectedStyle.innateBasics.join(' ou ')}`,
              `Equipamentos: ${selectedStyle.equipment}`,
              `CD das técnicas: ${selectedStyle.techniqueDc}`,
              ...selectedStyle.features.map((feature) => `Característica: ${feature}`),
            ]} />
          </DetailsCard>

          <DetailsCard title={`Detalhes da profissão: ${selectedProfession.name}`} eyebrow="PDF · Ofícios">
            <InfoList items={[
              `Perícia Especial do Ofício: ${selectedProfession.specialSkill}`,
              `Proficiências: ${selectedProfession.proficiencies}`,
              `Itens: ${selectedProfession.items}`,
              ...selectedProfession.details.map((detail) => `Característica: ${detail}`),
            ]} />
          </DetailsCard>
        </Panel>

        <Panel title="Atributos e Recursos" icon={<Swords />}>
          <div className="attribute-grid">
            {(Object.keys(attributes) as AttributeKey[]).map((key) => {
              const score = sheet.attributes[key]
              return (
                <label className="attribute-card" key={key}>
                  <span>{attributes[key]}</span>
                  <input type="number" min={1} max={30} value={score} onChange={(event) => updateAttribute(key, Number(event.target.value))} />
                  <strong>{formatModifier(abilityModifier(score))}</strong>
                </label>
              )
            })}
          </div>

          <div className="form-grid compact">
            <Field label="PV atual" type="number" value={sheet.currentHp} onChange={(event) => updateSheet('currentHp', Number(event.target.value))} />
            <Field label="PV temporário" type="number" value={sheet.temporaryHp} onChange={(event) => updateSheet('temporaryHp', Number(event.target.value))} />
            <Field label="PP atual" type="number" value={sheet.currentPp} onChange={(event) => updateSheet('currentPp', Number(event.target.value))} />
            <Field label="Exaustão" type="number" min={0} max={6} value={sheet.exhaustion} onChange={(event) => updateSheet('exhaustion', Number(event.target.value))} />
            <SelectField label="Defesa" value={sheet.defenseMode} options={[{ value: 'normal', label: 'Normal' }, { value: 'warriorBody', label: 'Corpo de Guerreiro' }]} onChange={(event) => updateSheet('defenseMode', event.target.value as Sheet['defenseMode'])} />
          </div>

          <div className="derived-grid">
            <MiniCalc label="Ataque favorito" value={formatModifier(attack)} />
            <MiniCalc label="CD técnica" value={techniqueCd} />
            <MiniCalc label="Percepção passiva" value={passivePerception} />
            <MiniCalc label="Carga" value={`${carry.load} kg`} />
            <MiniCalc label="Arrastar/levantar" value={`${carry.drag} kg`} />
            <MiniCalc label="Sobrecarga" value={`${carry.overload}/${carry.heavyOverload} kg`} />
          </div>

          <DetailsCard title="Detalhes das regras de cálculo" eyebrow="PV · PP · CR · Exaustão">
            <InfoList items={[
              'Modificador de atributo: subtraia 10, divida por 2 e arredonde para baixo.',
              'PV inicial: dado máximo do estilo + PV base da espécie + modificador de Constituição, mínimo de 1 no modificador aplicado.',
              'PV sugerido usa média fixa dos níveis seguintes para evitar quebrar a ficha durante criação.',
              'PP: 2 por nível de personagem; descanso longo recupera todos, salvo restrições por exaustão.',
              'CD de técnica: 8 + bônus de proficiência + modificador do atributo primário escolhido.',
              'Exaustão reduz testes d20 em 2 por nível e deslocamento em 1,5 m por nível; 6º nível causa desmaio.',
            ]} />
          </DetailsCard>
        </Panel>

        <Panel title="Perícias" icon={<Dice6 />}>
          <div className="skills-list">
            {skills.map((skill) => {
              const proficient = sheet.proficientSkills.includes(skill.name)
              return (
                <article className="skill-row" key={skill.name}>
                  <label>
                    <input type="checkbox" checked={proficient} onChange={() => toggleSkill(skill.name)} />
                    <span>{skill.name}</span>
                  </label>
                  <strong>{formatModifier(skillTotal(skill.attribute, sheet.attributes, proficient, level))}</strong>
                  <details>
                    <summary>Detalhes</summary>
                    <p>{attributes[skill.attribute]} · {skill.detail}</p>
                  </details>
                </article>
              )
            })}
          </div>
        </Panel>

        <Panel title="Habilidades e Técnicas" icon={<Sparkles />}>
          <DetailsCard title="Habilidades Básicas disponíveis" eyebrow="HB gerais e categorias">
            <div className="ability-list">
              {basicAbilities.map((ability) => (
                <details key={ability.name}>
                  <summary>{ability.name}</summary>
                  <p>{ability.detail}</p>
                </details>
              ))}
            </div>
          </DetailsCard>

          <DetailsCard title={`Técnicas do estilo: ${selectedStyle.name}`} eyebrow="Progressão por nível" open>
            <div className="technique-list">
              {selectedStyle.techniques.map((technique) => (
                <article key={`${technique.level}-${technique.combat}`}>
                  <span>{technique.level}º nível · {technique.grade} grau</span>
                  <strong>{technique.combat}</strong>
                  {technique.auxiliary && <small>Auxiliar: {technique.auxiliary}</small>}
                </article>
              ))}
            </div>
          </DetailsCard>

          <TextAreaField label="Habilidades escolhidas, características e usos" value={sheet.abilities} onChange={(event) => updateSheet('abilities', event.target.value)} placeholder="Ex.: Corpo de Guerreiro, Adaptação, Aspectos Humanos, usos por descanso..." />
          <TextAreaField label="Técnicas editadas / personalizadas" value={sheet.techniques} onChange={(event) => updateSheet('techniques', event.target.value)} placeholder="Registre custo em PP, duração, alcance, requisito, dano e Ataque Combinado." />
          <TextAreaField label="Haki" value={sheet.haki} onChange={(event) => updateSheet('haki', event.target.value)} placeholder="Aptidões, Pontos de Ambição, observação, armamento, rei..." />
          <TextAreaField label="Akuma no Mi / poder sobrenatural" value={sheet.akuma} onChange={(event) => updateSheet('akuma', event.target.value)} placeholder="Tipo, nome, traços, técnicas criadas, limitações e fraquezas." />
        </Panel>

        <Panel title="Inventário e Biblioteca" icon={<Download />}>
          <TextAreaField label="Inventário, Bellys e equipamentos" value={sheet.inventory} onChange={(event) => updateSheet('inventory', event.target.value)} />
          <TextAreaField label="Notas da mesa" value={sheet.notes} onChange={(event) => updateSheet('notes', event.target.value)} />

          <DetailsCard title="Referências dos PDFs usados" eyebrow="Arquivos locais">
            <InfoList items={[
              'OP RPG - Livro do Jogador 1.5.7.pdf: criação, espécies, estilos principais, profissões, atributos, perícias, técnicas, condições e aventura.',
              'Estilos de Combate Exclusivos - Revisada (1).pdf: Black Leg, Esgrimista, Herói, Solfista e Usuário Ínsito.',
              'A ficha evita copiar páginas inteiras e transforma as regras em campos editáveis, cálculos e detalhes expansíveis.',
            ]} />
          </DetailsCard>
        </Panel>
      </section>
    </main>
  )
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2>{icon}<span>{title}</span></h2>
      {children}
    </section>
  )
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: React.ReactNode; hint: string }) {
  return (
    <article className="stat">
      <span className="stat-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>{hint}</span>
      </div>
    </article>
  )
}

function MiniCalc({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <article className="mini-calc">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="info-list">
      {items.map((item) => (
        <li key={item}><ChevronRight size={15} />{item}</li>
      ))}
    </ul>
  )
}

export default App
