import { useMemo, useState } from 'react'
import {
  Anchor,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Dice6,
  HeartPulse,
  Image as ImageIcon,
  Lock,
  Minus,
  Moon,
  PackageCheck,
  Plus,
  Shield,
  Sparkles,
  Sun,
  Swords,
  Trash2,
  Unlock,
  UserRound,
} from 'lucide-react'
import { DetailsCard } from './components/DetailsCard'
import { Field, TextAreaField } from './components/Field'
import { MultiOptionButtons, OptionButtons } from './components/OptionButtons'
import {
  attributes,
  basicAbilities,
  combatStyles,
  equipmentItems,
  professions,
  skills,
  species,
  type AttributeKey,
} from './data/rules'
import {
  abilityModifier,
  attackBonus,
  carryingCapacity,
  formatModifier,
  powerPoints,
  proficiencyBonus,
  resistanceClass,
  skillTotal,
  suggestedHitPoints,
  techniqueDifficulty,
} from './utils/calculations'
import './App.css'

const defaultAttributes: Record<AttributeKey, number> = {
  forca: 15,
  destreza: 14,
  constituicao: 13,
  sabedoria: 12,
  vontade: 10,
  presenca: 8,
}

type InventoryEntry = {
  itemName: string
  quantity: number
}

type Sheet = {
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

type Theme = 'light' | 'dark'

type Confirmation = {
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
}

const initialSheet: Sheet = {
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

function App() {
  const [sheet, setSheet] = useState<Sheet>(initialSheet)
  const [theme, setTheme] = useState<Theme>('light')
  const [coverState, setCoverState] = useState<'closed' | 'opening' | 'opened'>('closed')
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

  const level = Math.min(20, Math.max(1, Number(sheet.level) || 1))
  const proficiency = proficiencyBonus(level)
  const maxPp = powerPoints(level)
  const suggestedHp = suggestedHitPoints(level, selectedStyle, selectedSpecies, sheet.attributes.constituicao)
  const cr = resistanceClass(sheet.attributes, selectedStyle, sheet.primary, sheet.defenseMode === 'warriorBody', level)
  const techniqueCd = techniqueDifficulty(level, sheet.attributes, sheet.primary)
  const attack = attackBonus(level, sheet.attributes, sheet.primary)
  const carry = carryingCapacity(sheet.attributes.forca)
  const passivePerception = 10 + skillTotal('vontade', sheet.attributes, sheet.proficientSkills.includes('Percepção'), level)
  const itemCategories = Array.from(new Set(equipmentItems.map((item) => item.category)))
  const filteredItems = equipmentItems.filter((item) => item.category === sheet.itemCategory)
  const registeredSlots = sheet.inventoryEntries.reduce((total, entry) => {
    const item = equipmentItems.find((candidate) => candidate.name === entry.itemName)
    return total + (item?.load ?? 1) * entry.quantity
  }, 0)

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
    if (selectionsLocked) return
    setSheet((current) => {
      const active = current.proficientSkills.includes(skillName)
      return {
        ...current,
        proficientSkills: active
          ? current.proficientSkills.filter((item) => item !== skillName)
          : [...current.proficientSkills, skillName],
      }
    })
    setNotice('Perícias atualizadas.')
  }

  function requestLockToggle() {
    const willLock = !selectionsLocked
    setConfirmation({
      title: willLock ? 'Travar escolhas?' : 'Destravar escolhas?',
      body: willLock
        ? 'Espécie, estilo, profissão, perícias, defesa e itens selecionados ficarão protegidos contra mudanças acidentais.'
        : 'As escolhas estruturais voltarão a aceitar edição, remoção e desseleção.',
      confirmLabel: willLock ? 'Travar ficha' : 'Destravar ficha',
      onConfirm: () => {
        setSelectionsLocked(willLock)
        setNotice(willLock ? 'Escolhas travadas.' : 'Escolhas destravadas.')
      },
    })
  }

  function confirmAction() {
    confirmation?.onConfirm()
    setConfirmation(null)
  }

  function setSpecies(value: string) {
    const nextSpecies = species.find((item) => item.name === value) ?? species[0]
    setSheet((current) => ({
      ...current,
      speciesName: nextSpecies.name,
      variant: nextSpecies.variants[0] ?? '',
    }))
    setNotice(`Espécie definida: ${nextSpecies.name}.`)
  }

  function setStyle(value: string) {
    const style = combatStyles.find((item) => item.name === value) ?? combatStyles[0]
    setSheet((current) => ({ ...current, styleName: style.name, primary: style.primary[0] }))
    setNotice(`Estilo definido: ${style.name}.`)
  }

  function addItem(itemName: string) {
    if (selectionsLocked) return
    setSheet((current) => {
      const existing = current.inventoryEntries.find((entry) => entry.itemName === itemName)
      return {
        ...current,
        inventoryEntries: existing
          ? current.inventoryEntries.map((entry) =>
              entry.itemName === itemName ? { ...entry, quantity: entry.quantity + 1 } : entry,
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
            ? { ...entry, quantity: Math.max(0, entry.quantity + delta) }
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

  function openCover() {
    if (coverState !== 'closed') return
    setCoverState('opening')
    window.setTimeout(() => setCoverState('opened'), 820)
  }

  return (
    <main className="app" data-theme={theme}>
      {coverState !== 'opened' && (
        <section className={`cover-stage ${coverState}`} aria-label="Capa da ficha">
          <button className="book-cover" onClick={openCover} type="button">
            <span className="cover-binding" aria-hidden="true" />
            <span className="cover-seal">OP RPG</span>
            <span className="cover-map-lines" aria-hidden="true" />
            <span className="cover-title">Ficha do Jogador</span>
            <span className="cover-subtitle">Registro de aventura, técnicas e tesouros</span>
            <span className="cover-compass" aria-hidden="true">
              <Anchor size={44} />
            </span>
            <span className="cover-action">Clique para abrir</span>
          </button>
        </section>
      )}

      {coverState === 'opened' && (
        <div className="floating-actions" aria-label="Controles da ficha">
          <button className="round-action" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} type="button">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? 'Tema escuro' : 'Tema claro'}</span>
          </button>
          <button className="round-action lock-action" onClick={requestLockToggle} type="button">
            {selectionsLocked ? <Lock size={20} /> : <Unlock size={20} />}
            <span>{selectionsLocked ? 'Destravar' : 'Travar'}</span>
          </button>
        </div>
      )}

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
          <div className="portrait-frame">
            {sheet.portraitUrl ? (
              <img alt={`Imagem de ${sheet.name}`} src={sheet.portraitUrl} />
            ) : (
              <div className="portrait-empty">
                <ImageIcon size={32} />
                <span>Imagem, GIF ou WebP</span>
              </div>
            )}
          </div>
          <span>{sheet.epithet}</span>
          <strong>{sheet.name || 'Personagem sem nome'}</strong>
          <small>{selectedSpecies.name} · {selectedStyle.name} · nível {level}</small>
        </div>
      </header>

      <section className="notice-bar" aria-live="polite">
        <CheckCircle2 size={18} />
        <span>{notice}</span>
        {selectionsLocked && <strong>Seleções travadas</strong>}
      </section>

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
            <Field label="URL da imagem/GIF" value={sheet.portraitUrl} onChange={(event) => updateSheet('portraitUrl', event.target.value)} placeholder="https://...gif, .png, .webp ou .jpg" />
            <TextAreaField label="Antecedente e história" value={sheet.background} onChange={(event) => updateSheet('background', event.target.value)} />
          </div>
        </Panel>

        <Panel title="Criação" icon={<BookOpen />}>
          <OptionButtons
            disabled={selectionsLocked}
            label="Espécie"
            onChange={setSpecies}
            options={species.map((item) => ({ value: item.name, label: item.name, detail: `${item.hpBase} PV base` }))}
            value={sheet.speciesName}
          />

          <OptionButtons
            disabled={selectionsLocked}
            label="Variante, ancestralidade ou traço"
            onChange={(value) => {
              updateSheet('variant', value)
              setNotice(`Variação definida: ${value}.`)
            }}
            options={selectedSpecies.variants.map((variant) => {
              const [label, detail] = variant.split(': ')
              return { value: variant, label, detail }
            })}
            value={sheet.variant}
          />

          <div className="form-grid">
            <TextAreaField
              label="Complemento de variante / ancestralidade"
              value={sheet.variantNotes}
              onChange={(event) => updateSheet('variantNotes', event.target.value)}
              placeholder="Use para animal ancestral, falha humana, duas espécies de mestiço ou aprovação do Narrador."
            />
          </div>

          <OptionButtons
            disabled={selectionsLocked}
            label="Estilo de combate"
            onChange={setStyle}
            options={combatStyles.map((item) => ({ value: item.name, label: item.name, detail: `${item.category} · d${item.hitDie}` }))}
            value={sheet.styleName}
          />

          <OptionButtons
            disabled={selectionsLocked}
            label="Atributo primário"
            onChange={(value) => updateSheet('primary', value as AttributeKey)}
            options={selectedStyle.primary.map((key) => ({ value: key, label: attributes[key] }))}
            value={sheet.primary}
          />

          <OptionButtons
            disabled={selectionsLocked}
            label="Profissão"
            onChange={(value) => {
              updateSheet('professionName', value)
              setNotice(`Profissão definida: ${value}.`)
            }}
            options={professions.map((item) => ({ value: item.name, label: item.name, detail: item.specialSkill }))}
            value={sheet.professionName}
          />

          <div className="form-grid">
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
          </div>

          <OptionButtons
            disabled={selectionsLocked}
            label="Defesa"
            onChange={(value) => updateSheet('defenseMode', value as Sheet['defenseMode'])}
            options={[
              { value: 'normal', label: 'Normal', detail: '10 + DES' },
              { value: 'warriorBody', label: 'Corpo de Guerreiro', detail: 'HB defensiva' },
            ]}
            value={sheet.defenseMode}
          />

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
          <MultiOptionButtons
            disabled={selectionsLocked}
            label="Proficiências marcadas"
            onToggle={toggleSkill}
            options={skills.map((skill) => ({ value: skill.name, label: skill.name, detail: attributes[skill.attribute] }))}
            values={sheet.proficientSkills}
          />
          <div className="skills-list">
            {skills.map((skill) => {
              const proficient = sheet.proficientSkills.includes(skill.name)
              return (
                <article className="skill-row" key={skill.name}>
                  <span>{skill.name}</span>
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

        <Panel title="Inventário e Biblioteca" icon={<PackageCheck />}>
          <div className="inventory-summary">
            <MiniCalc label="Slots auxiliares" value={registeredSlots.toFixed(1)} />
            <MiniCalc label="Capacidade pessoal" value={`${carry.load} kg`} />
          </div>

          <OptionButtons
            disabled={selectionsLocked}
            label="Categoria de item"
            onChange={(value) => updateSheet('itemCategory', value)}
            options={itemCategories.map((category) => ({ value: category, label: category }))}
            value={sheet.itemCategory}
          />

          <div className="item-picker">
            {filteredItems.map((item) => (
              <article className="item-card" key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.rarity} · {item.cost}</span>
                  <p>{item.detail}</p>
                  <small>{item.capacity ? `Capacidade: ${item.capacity}` : `Slots auxiliares: ${item.load}`}</small>
                </div>
                <button disabled={selectionsLocked} onClick={() => addItem(item.name)} type="button">
                  <Plus size={18} />Adicionar
                </button>
              </article>
            ))}
          </div>

          <DetailsCard title="Itens selecionados" eyebrow="Pode remover quando destravado" open>
            <div className="inventory-list">
              {sheet.inventoryEntries.length === 0 && <p className="empty-copy">Nenhum item selecionado.</p>}
              {sheet.inventoryEntries.map((entry) => {
                const item = equipmentItems.find((candidate) => candidate.name === entry.itemName)
                return (
                  <article className="inventory-entry" key={entry.itemName}>
                    <div>
                      <strong>{entry.itemName}</strong>
                      <span>{item?.category} · qtd. {entry.quantity}</span>
                    </div>
                    <div className="quantity-actions">
                      <button disabled={selectionsLocked} onClick={() => changeItemQuantity(entry.itemName, -1)} type="button"><Minus size={16} /></button>
                      <button disabled={selectionsLocked} onClick={() => changeItemQuantity(entry.itemName, 1)} type="button"><Plus size={16} /></button>
                      <button disabled={selectionsLocked} onClick={() => removeItem(entry.itemName)} type="button"><Trash2 size={16} /></button>
                    </div>
                  </article>
                )
              })}
            </div>
          </DetailsCard>

          <TextAreaField label="Inventário livre, Bellys e equipamentos narrativos" value={sheet.inventory} onChange={(event) => updateSheet('inventory', event.target.value)} />
          <TextAreaField label="Notas da mesa" value={sheet.notes} onChange={(event) => updateSheet('notes', event.target.value)} />

          <DetailsCard title="Referências dos PDFs usados" eyebrow="Arquivos locais">
            <InfoList items={[
              'OP RPG - Livro do Jogador 1.5.7.pdf: criação, espécies, estilos principais, profissões, atributos, perícias, técnicas, condições, equipamentos e aventura.',
              'Estilos de Combate Exclusivos - Revisada (1).pdf: Black Leg, Esgrimista, Herói, Solfista e Usuário Ínsito.',
              'A ficha usa capacidade em kg quando o PDF informa recipientes, montarias ou veículos. Itens sem peso explícito usam slots auxiliares apenas para organização.',
            ]} />
          </DetailsCard>
        </Panel>
      </section>

      {confirmation && (
        <div className="confirm-backdrop" role="presentation">
          <section aria-modal="true" className="confirm-dialog" role="dialog">
            <h2>{confirmation.title}</h2>
            <p>{confirmation.body}</p>
            <div>
              <button className="ghost-button" onClick={() => setConfirmation(null)} type="button">Cancelar</button>
              <button className="primary-button" onClick={confirmAction} type="button">{confirmation.confirmLabel}</button>
            </div>
          </section>
        </div>
      )}
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
