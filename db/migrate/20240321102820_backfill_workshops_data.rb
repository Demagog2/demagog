# frozen_string_literal: true

class BackfillWorkshopsData < ActiveRecord::Migration[7.0]
  def up
    Workshop.create!([
      { name: "Kritické myšlení a mediální gramotnost", description: "Vhled do toho, jak kriticky zhodnotit informace, kterým jsme vystaveni, se zaměřením na mediální obsah. Ukážeme, jaká úskalí nás čekají při vyhodnocení informací, od psychologických a společenských omezení, nových formátů na internetu, až po cílené manipulace a nepravdy ve veřejném prostoru. Workshop je zaměřen na praktické tipy a jeho výsledkem by měla být lepší orientace v tom, na co je dobré dát si pozor při přijímání informací a jak si tyto informace ověřit.", price: 3600 },
      { name: "Fact-checking", description: "Workshop zaměřený detailněji na práci a kritické zpracování informací a čelení fake news, v jehož průběhu si účastníci ověřování vyzkoušejí v praxi. Podíváme se na to jak postupovat, jak se nenechat zmást, a co vůbec ověřit jde.", price: 3800 },
      { name: "Obecný přehled", description: "Vstup do otázek mediální gramotnosti a názorové “sebeobrany” v informačním světě. Účastníci se naučí rozeznávat fakta od názorů, jak vyhodnocovat informace, na co se zaměřit při vstřebávání současného světa nebo jak odolat argumentačním faulům. Doporučujeme, pokud hledáte pouze jednorázovou akci pro vaši instituci/událost.", price: 4200 },
      { name: "Podvody na internetu", description: "Všichni víme, co je spam, ale co je to vishing? V dnešní době na nás podvodníci útočí ze všech stran, včetně té digitální. Zjistěte, jak rozeznat pravý telefonát z banky od toho falešného nebo jak nenaletět deep fake videu o rychlém zbohatnutí. Doporučujeme hlavně pro rizikové skupiny, které se neorientují ještě v problematice.", price: 2500 },
    ])
  end

  def down
    Workshop.delete_all
  end
end
