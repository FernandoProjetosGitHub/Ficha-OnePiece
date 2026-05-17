import {
  Anchor,
  BookOpen,
  CheckCircle2,
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
import { ChoiceSelect, MultiChoiceSelect } from './components/ChoiceSelect'
import { DetailsCard } from './components/DetailsCard'
import { Field, TextAreaField } from './components/Field'
import { ExpandableInfoList, InfoList, MiniCalc, Panel, ResourceMeter, Stat } from './components/SheetPrimitives'
import {
  attributes,
  basicAbilities,
  combatStyles,
  equipmentItems,
  queryRules,
  relatedRules,
  professions,
  skills,
  species,
  type AttributeKey,
} from './data/rules'
import { useCharacterSheet } from './hooks/useCharacterSheet'
import type { Sheet } from './types/sheet'
import {
  abilityModifier,
  formatModifier,
  skillTotal,
} from './utils/calculations'
import './App.css'

function App() {
  const {
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
    cancelConfirmation,
    openCover,
    toggleTheme,
    setSpecies,
    setStyle,
    setVariant,
    setProfession,
    addItem,
    changeItemQuantity,
    removeItem,
  } = useCharacterSheet()
  const availableSkillOptions = skills.filter((skill) => proficiencyPlan.availableSkills.includes(skill.name))
  const hpPercent = (sheet.currentHp / Math.max(1, suggestedHp + sheet.temporaryHp)) * 100
  const ppPercent = (sheet.currentPp / Math.max(1, maxPp)) * 100
  const exhaustionPercent = (sheet.exhaustion / 6) * 100

  return (
    <main className="app" data-theme={theme}>
      {!coverOpened && (
        <section className="cover-stage" aria-label="Capa da ficha">
          <button className="cover-link" onClick={openCover} type="button">
            <span className="cover-seal">OP RPG</span>
            <span className="cover-map-lines" aria-hidden="true" />
            <span className="cover-title">Ficha do Jogador</span>
            <span className="cover-subtitle">Registro de aventura, técnicas e tesouros</span>
            <span className="cover-compass" aria-hidden="true">
              <Anchor size={44} />
            </span>
            <span className="cover-action">Abrir aplicativo</span>
          </button>
        </section>
      )}

      {coverOpened && (
        <div className="floating-actions" aria-label="Controles da ficha">
          <button className="round-action" onClick={toggleTheme} type="button">
            {theme === 'light' ?<Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ?'Tema escuro' : 'Tema claro'}</span>
          </button>
          <button className="round-action lock-action" onClick={requestLockToggle} type="button">
            {selectionsLocked ?<Lock size={20} /> : <Unlock size={20} />}
            <span>{selectionsLocked ?'Destravar' : 'Travar'}</span>
          </button>
        </div>
      )}

      <header className="hero">
        <div className="hero-copy">
          <span className="overline"><Anchor size={16} /> Registro de Aventureiro</span>
          <h1>{sheet.name || 'Ficha online OP RPG'}</h1>
          <p>{sheet.concept || 'Personagem original pronto para navegar por aventuras, perigos e escolhas difíceis.'}</p>
          <div className="hero-tags" aria-label="Resumo do personagem">
            <span>Nível {level}</span>
            <span>{selectedSpecies.name}</span>
            <span>{selectedStyle.name}</span>
            <span>{selectedProfession.name}</span>
          </div>
        </div>
        <div className="hero-card">
          <div className="portrait-frame">
            {sheet.portraitUrl ?(
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
        <Stat icon={<Shield />} label="CR" value={cr} hint={sheet.defenseMode === 'warriorBody' ?'Corpo de Guerreiro' : 'Base 10 + DES'} />
        <Stat icon={<Dice6 />} label="Prof." value={formatModifier(proficiency)} hint={`CD técnica ${techniqueCd}`} />
      </section>

      <section className="resource-board" aria-label="Estado atual do personagem">
        <ResourceMeter label="Vitalidade" value={`${sheet.currentHp}/${suggestedHp}`} hint={`${sheet.temporaryHp} PV temporário`} percent={hpPercent} />
        <ResourceMeter label="Poder" value={`${sheet.currentPp}/${maxPp}`} hint="Pontos de Poder disponíveis" percent={ppPercent} tone="gold" />
        <ResourceMeter label="Exaustão" value={`${sheet.exhaustion}/6`} hint="6º nível causa desmaio" percent={exhaustionPercent} tone="red" />
      </section>

      <nav className="sheet-nav" aria-label="Navegação da ficha">
        <a href="#identidade">Identidade</a>
        <a href="#criacao">Criação</a>
        <a href="#atributos">Atributos</a>
        <a href="#pericias">Perícias</a>
        <a href="#tecnicas">Técnicas</a>
        <a href="#inventario">Inventário</a>
      </nav>

      <section className="sheet-grid">
        <Panel id="identidade" title="Identidade" icon={<UserRound />}>
          <div className="section-block">
            <h3>Apresentação</h3>
            <div className="form-grid">
            <Field label="Nome" value={sheet.name} onChange={(event) => updateSheet('name', event.target.value)} />
            <Field label="Epíteto" value={sheet.epithet} onChange={(event) => updateSheet('epithet', event.target.value)} />
            <Field label="Conceito original" value={sheet.concept} onChange={(event) => updateSheet('concept', event.target.value)} />
            <Field label="Origem" value={sheet.origin} onChange={(event) => updateSheet('origin', event.target.value)} />
            </div>
          </div>
          <div className="section-block">
            <h3>Motivações</h3>
            <div className="form-grid">
            <Field label="Sonho" value={sheet.dream} onChange={(event) => updateSheet('dream', event.target.value)} />
            <Field label="Caminho" value={sheet.path} onChange={(event) => updateSheet('path', event.target.value)} />
            <TextAreaField label="Antecedente e história" value={sheet.background} onChange={(event) => updateSheet('background', event.target.value)} />
            </div>
          </div>
          <div className="section-block">
            <h3>Retrato</h3>
            <div className="form-grid">
            <Field label="URL da imagem/GIF" value={sheet.portraitUrl} onChange={(event) => updateSheet('portraitUrl', event.target.value)} placeholder="https://...gif, .png, .webp ou .jpg" />
            </div>
          </div>
        </Panel>

        <Panel id="criacao" title="Criação" icon={<BookOpen />}>
          <div className="section-block">
            <h3>Origem mecânica</h3>
            <ChoiceSelect
              disabled={selectionsLocked}
              label="Espécie"
              onChange={setSpecies}
              options={species.map((item) => ({ value: item.name, label: item.name, detail: `${item.hpBase} PV base` }))}
              value={sheet.speciesName}
            />
            <ChoiceSelect
              disabled={selectionsLocked}
              label="Variante, ancestralidade ou traço"
              onChange={setVariant}
              options={selectedSpecies.variants.map((variant) => {
                const [label, detail] = variant.split(': ')
                return { value: variant, label, detail }
              })}
              value={sheet.variant}
            />
            <TextAreaField
              label="Complemento de variante / ancestralidade"
              value={sheet.variantNotes}
              onChange={(event) => updateSheet('variantNotes', event.target.value)}
              placeholder="Use para animal ancestral, falha humana, duas espécies de mestiço ou aprovação do Narrador."
            />
            <DetailsCard title="Detalhes da variante selecionada" eyebrow="Escolha atual">
              <InfoList items={[
                sheet.variant || 'Nenhuma variante selecionada.',
                sheet.variantNotes ?`Complemento anotado: ${sheet.variantNotes}` : 'Use o complemento para registrar aprovação do Narrador, origem dupla ou traço cultural.',
              ]} />
            </DetailsCard>
          </div>

          <div className="section-block">
            <h3>Estilo, atributo e ofício</h3>
            <ChoiceSelect
              disabled={selectionsLocked}
              label="Estilo de combate"
              onChange={setStyle}
              options={combatStyles.map((item) => ({ value: item.name, label: item.name, detail: `${item.category} · d${item.hitDie}` }))}
              value={sheet.styleName}
            />
            <ChoiceSelect
              disabled={selectionsLocked}
              label="Atributo primário"
              onChange={(value) => updateSheet('primary', value as AttributeKey)}
              options={selectedStyle.primary.map((key) => ({ value: key, label: attributes[key] }))}
              value={sheet.primary}
            />
            <ChoiceSelect
              disabled={selectionsLocked}
              label="Profissão"
              onChange={setProfession}
              options={professions.map((item) => ({ value: item.name, label: item.name, detail: item.specialSkill }))}
              value={sheet.professionName}
            />
          </div>

          <div className="section-block">
            <h3>Progressão</h3>
            <div className="form-grid">
              <Field label="Nível" type="number" min={1} max={20} value={level} onChange={(event) => updateSheet('level', Number(event.target.value))} />
              <Field label="Experiência" type="number" min={0} value={sheet.xp} onChange={(event) => updateSheet('xp', Number(event.target.value))} />
            </div>
          </div>

          <div className="section-block">
            <h3>Regras relacionadas</h3>
            <DetailsCard title="Resumo das regras de criação" eyebrow="PDF · Consulta rápida">
              <ExpandableInfoList items={relatedRules} />
            </DetailsCard>
            <DetailsCard title={`Detalhes da espécie: ${selectedSpecies.name}`} eyebrow="PDF · Capítulo 2">
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
              ]} />
              <ExpandableInfoList items={selectedProfession.details} />
            </DetailsCard>
          </div>
        </Panel>

        <Panel id="atributos" title="Atributos e Recursos" icon={<Swords />}>
          <div className="section-block">
            <h3>Atributos base</h3>
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
          </div>

          <div className="section-block">
            <h3>Recursos em jogo</h3>
          <div className="form-grid compact">
            <Field label="PV atual" type="number" value={sheet.currentHp} onChange={(event) => updateSheet('currentHp', Number(event.target.value))} />
            <Field label="PV temporário" type="number" value={sheet.temporaryHp} onChange={(event) => updateSheet('temporaryHp', Number(event.target.value))} />
            <Field label="PP atual" type="number" value={sheet.currentPp} onChange={(event) => updateSheet('currentPp', Number(event.target.value))} />
            <Field label="Exaustão" type="number" min={0} max={6} value={sheet.exhaustion} onChange={(event) => updateSheet('exhaustion', Number(event.target.value))} />
          </div>

          <ChoiceSelect
            disabled={selectionsLocked}
            label="Defesa"
            onChange={(value) => updateSheet('defenseMode', value as Sheet['defenseMode'])}
            options={[
              { value: 'normal', label: 'Normal', detail: '10 + DES' },
              { value: 'warriorBody', label: 'Corpo de Guerreiro', detail: 'HB defensiva' },
            ]}
            value={sheet.defenseMode}
          />
          </div>

          <div className="section-block">
            <h3>Cálculos derivados</h3>
          <div className="derived-grid">
            <MiniCalc label="Ataque favorito" value={formatModifier(attack)} />
            <MiniCalc label="CD técnica" value={techniqueCd} />
            <MiniCalc label="Percepção passiva" value={passivePerception} />
            <MiniCalc label="Carga" value={`${carry.load} kg`} />
            <MiniCalc label="Arrastar/levantar" value={`${carry.drag} kg`} />
            <MiniCalc label="Sobrecarga" value={`${carry.overload}/${carry.heavyOverload} kg`} />
          </div>
          </div>

          <div className="section-block">
            <h3>Regras de consulta</h3>
            <DetailsCard title="Detalhes das regras de cálculo" eyebrow="PV · PP · CR · Exaustão">
              <ExpandableInfoList items={queryRules} />
            </DetailsCard>
          </div>
        </Panel>

        <Panel id="pericias" title="Perícias" icon={<Dice6 />}>
          <div className="section-block">
            <h3>Escolhas de proficiência</h3>
          <MultiChoiceSelect
            disabled={selectionsLocked}
            label="Proficiências marcadas"
            onChange={updateSkills}
            options={availableSkillOptions.map((skill) => ({ value: skill.name, label: skill.name, detail: attributes[skill.attribute] }))}
            values={sheet.proficientSkills}
            helper={`Limite atual: ${sheet.proficientSkills.length}/${proficiencyPlan.maxChoices}. As cotas de espécie, estilo e profissão são conferidas separadamente.`}
          />
            <DetailsCard title="Fontes das proficiências" eyebrow="Limitador automático">
              <ExpandableInfoList
                items={proficiencyPlan.rules.map((rule) => ({
                  name: rule.source,
                  detail: rule.note,
                  bullets: rule.options,
                }))}
              />
            </DetailsCard>
          </div>
          <div className="section-block">
            <h3>Resultados de perícias</h3>
            <DetailsCard title="Lista de perícias calculadas" eyebrow="Clique para consultar">
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
            </DetailsCard>
          </div>
        </Panel>

        <Panel id="tecnicas" title="Habilidades e Técnicas" icon={<Sparkles />}>
          <div className="section-block">
            <h3>Habilidades básicas</h3>
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
          </div>

          <div className="section-block">
            <h3>Técnicas por nível</h3>
          <DetailsCard title={`Técnicas do estilo: ${selectedStyle.name}`} eyebrow="Progressão por nível">
            <div className="technique-list">
              {selectedStyle.techniques.map((technique) => (
                <details className="choice-detail-card" key={`${technique.level}-${technique.combat}`}>
                  <summary>
                    <span>{technique.level}º nível · {technique.grade} grau</span>
                    <strong>{technique.combat}</strong>
                  </summary>
                  <p>
                    Técnica do estilo {selectedStyle.name}. Use a CD atual {techniqueCd} quando a técnica exigir
                    Salvaguarda e registre custo, alcance e dano no campo editável abaixo.
                  </p>
                  {technique.auxiliary && <small>Auxiliar: {technique.auxiliary}</small>}
                </details>
              ))}
            </div>
          </DetailsCard>
          </div>

          <div className="section-block">
            <h3>Anotações editáveis</h3>
          <TextAreaField label="Habilidades escolhidas, características e usos" value={sheet.abilities} onChange={(event) => updateSheet('abilities', event.target.value)} placeholder="Ex.: Corpo de Guerreiro, Adaptação, Aspectos Humanos, usos por descanso..." />
          <TextAreaField label="Técnicas editadas / personalizadas" value={sheet.techniques} onChange={(event) => updateSheet('techniques', event.target.value)} placeholder="Registre custo em PP, duração, alcance, requisito, dano e Ataque Combinado." />
          <TextAreaField label="Haki" value={sheet.haki} onChange={(event) => updateSheet('haki', event.target.value)} placeholder="Aptidões, Pontos de Ambição, observação, armamento, rei..." />
          <TextAreaField label="Akuma no Mi / poder sobrenatural" value={sheet.akuma} onChange={(event) => updateSheet('akuma', event.target.value)} placeholder="Tipo, nome, traços, técnicas criadas, limitações e fraquezas." />
          </div>
        </Panel>

        <Panel id="inventario" title="Inventário e Biblioteca" icon={<PackageCheck />}>
          <div className="section-block">
            <h3>Resumo de carga</h3>
          <div className="inventory-summary">
            <MiniCalc label="Slots auxiliares" value={registeredSlots.toFixed(1)} />
            <MiniCalc label="Capacidade pessoal" value={`${carry.load} kg`} />
          </div>
          </div>

          <div className="section-block">
            <h3>Catálogo de itens</h3>
            <DetailsCard title="Abrir catálogo de itens" eyebrow={`${filteredItems.length} itens em ${sheet.itemCategory}`}>
              <ChoiceSelect
                disabled={selectionsLocked}
                label="Categoria de item"
                onChange={(value) => updateSheet('itemCategory', value)}
                options={itemCategories.map((category) => ({ value: category, label: category }))}
                value={sheet.itemCategory}
              />

              <div className="item-picker">
                {filteredItems.map((item) => (
                  <article className="item-card" key={item.name}>
                    <details className="choice-detail-card">
                      <summary>
                        <span>{item.rarity} · {item.cost}</span>
                        <strong>{item.name}</strong>
                      </summary>
                      <InfoList items={[
                        item.detail,
                        item.properties ? `Propriedades: ${item.properties}` : '',
                        item.damage ? `Dano: ${item.damage}` : '',
                        item.capacity ? `Capacidade: ${item.capacity}` : `Slots/peso registrado: ${item.load}`,
                        ...(item.rules ?? []),
                      ].filter(Boolean)} />
                    </details>
                    <button disabled={selectionsLocked} onClick={() => addItem(item.name)} type="button">
                      <Plus size={18} />Adicionar
                    </button>
                  </article>
                ))}
              </div>
            </DetailsCard>
          </div>

          <div className="section-block">
            <h3>Itens na ficha</h3>
          <DetailsCard title="Itens selecionados" eyebrow="Pode remover quando destravado">
            <div className="inventory-list">
              {sheet.inventoryEntries.length === 0 && <p className="empty-copy">Nenhum item selecionado.</p>}
              {sheet.inventoryEntries.map((entry) => {
                const item = equipmentItems.find((candidate) => candidate.name === entry.itemName)
                return (
                  <article className="inventory-entry" key={entry.itemName}>
                    <details className="inventory-detail">
                      <summary>
                        <strong>{entry.itemName}</strong>
                        <span>{item?.category} · qtd. {entry.quantity}</span>
                      </summary>
                      {item && (
                        <InfoList items={[
                          item.detail,
                          item.properties ? `Propriedades: ${item.properties}` : '',
                          item.damage ? `Dano: ${item.damage}` : '',
                          item.capacity ? `Capacidade: ${item.capacity}` : `Slots/peso registrado: ${item.load}`,
                          ...(item.rules ?? []),
                        ].filter(Boolean)} />
                      )}
                    </details>
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
          </div>

          <div className="section-block">
            <h3>Anotações livres</h3>
          <TextAreaField label="Inventário livre, Bellys e equipamentos narrativos" value={sheet.inventory} onChange={(event) => updateSheet('inventory', event.target.value)} />
          <TextAreaField label="Notas da mesa" value={sheet.notes} onChange={(event) => updateSheet('notes', event.target.value)} />
          </div>

          <div className="section-block">
            <h3>Fontes</h3>
          <DetailsCard title="Referências dos PDFs usados" eyebrow="Arquivos locais">
            <InfoList items={[
              'OP RPG - Livro do Jogador 1.5.7.pdf: criação, espécies, estilos principais, profissões, atributos, perícias, técnicas, condições, equipamentos e aventura.',
              'Estilos de Combate Exclusivos - Revisada (1).pdf: Black Leg, Esgrimista, Herói, Solfista e Usuário Ínsito.',
              'A ficha usa capacidade em kg quando o PDF informa recipientes, montarias ou veículos. Itens sem peso explícito usam slots auxiliares apenas para organização.',
            ]} />
          </DetailsCard>
          </div>
        </Panel>
      </section>

      {confirmation && (
        <div className="confirm-backdrop" role="presentation">
          <section aria-modal="true" className="confirm-dialog" role="dialog">
            <h2>{confirmation.title}</h2>
            <p>{confirmation.body}</p>
            <div>
              <button className="ghost-button" onClick={cancelConfirmation} type="button">Cancelar</button>
              <button className="primary-button" onClick={confirmAction} type="button">{confirmation.confirmLabel}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
