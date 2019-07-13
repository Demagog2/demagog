# Changelog

Seznam změn v aplikaci za webem Demagog.cz. Struktura inspirována projektem [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## 13. července 2019
- Opraveno: Dlouhé odkazy či slova v odůvodnění se zalamují a nenatahují stránku do šířky ([#425](https://github.com/Demagog2/demagog/pull/425))
- Opraveno: Při zadávání příslušnosti řečníka ke straně jde vybrat datum před rokem 1999 ([#426](https://github.com/Demagog2/demagog/pull/426))

## 23. června 2019
- Změněno: Diskuze může mít víc expertů ([#404](https://github.com/Demagog2/demagog/pull/404))

## 19. května 2019
- Přidáno: Editoři mohou upravit řečníka u výroku ([#395](https://github.com/Demagog2/demagog/pull/395))

## 12. května 2019
- Přidáno: Sliby jdou vkládat jako segment do článku ([#386](https://github.com/Demagog2/demagog/pull/386))
- Přidáno: Vladní sliby na homepage ([#385](https://github.com/Demagog2/demagog/pull/385))

## 11. května 2019
- Přidáno: Komentáře u výroků už se zobrazují v odstavcích a se zalomeními ([#383](https://github.com/Demagog2/demagog/pull/383))

## 10. května 2019
- Změněno: Stážisti si mohou vrátit výrok ke zpracování ze stavu ke kontrole ([#379](https://github.com/Demagog2/demagog/pull/379))

## 8. května 2019
- Opraveno: Zobrazování datumů u článků a výroků je znovu české a bez 00:00 ([#373](https://github.com/Demagog2/demagog/pull/373))

## 7. května 2019
- Administrace podporuje sliby - jak metodiku pro sliby Sobotkovy vlády, tak tu pro druhou vládu Andreje Babiše ([#368](https://github.com/Demagog2/demagog/pull/368))
- Přihlášení do administrace mohou nahlížet výstup slibů vlády Andreje Babiše ([#369](https://github.com/Demagog2/demagog/pull/369))

## 29. dubna 2019
- Technická změna: Migrace na novou verzi GraphQL

## 20. dubna 2019
- Změněno: Veřejná část webu Demagog.cz už se dobře zobrazuje i v IE11 ([#358](https://github.com/Demagog2/demagog/pull/358))

## 18. března 2019
- Změněno: Deaktivovaný uživatel je okamžitě odhlášen ([#350](https://github.com/Demagog2/demagog/pull/350))
- Změněno: Omezen přístup k diskuzím pro veřejnost skrz GraphQL tak, abychom neleakovali interní data ([#349](https://github.com/Demagog2/demagog/pull/349))

## 17. března 2019
- Přidáno: Stránka "API pro vývojáře" s dokumentací GraphQL API ([#346](https://github.com/Demagog2/demagog/pull/346))

## 14. března 2019
- Změněno: NFNZ mezi podporovateli, předchozí US embassy a Visegrad fund skryti

## 13. března 2019
- Změněno: Partner Zákony pro lidi nahrazen Nadačním fondem nezávislé žurnalistiky

## 6. března 2019
- Změněno: Deprekováno Google+ API pro přihlašování do administrace ([#337](https://github.com/Demagog2/demagog/pull/337))
- Změněno: Přidána stránka s ochranou soukromí - https://demagog.cz/admin/policy

## 3. března 2019
- Změněno: Komentáře u výroku z nedávné doby (dnes a včera) jsou ukázány s "dnes" a "včera" pro lepší přehlednost (iterujem, bejby!) ([#334](https://github.com/Demagog2/demagog/pull/334))
- Změněno: Komentáře u výroku z nedávné doby (max 24h) jsou ukázány s relativním časem pro lepší přehlednost ([#333](https://github.com/Demagog2/demagog/pull/333))
- Opraveno: Výroky jsou znovu korektně řazeny s důležitými na začátku, ne na konci ([#332](https://github.com/Demagog2/demagog/pull/332))

## 2. března 2019
- Změněno: Filtrování výroků na detailu diskuze se reflektuje v url, takže se při reloadu neztratí ([#330](https://github.com/Demagog2/demagog/pull/330))
- Změněno: Vyhledávání v administraci už funguje i bez diakritiky (např. hledání "babis" najde našeho současného premiéra) ([#329](https://github.com/Demagog2/demagog/pull/329))
- Přidáno: Máme nově stránku, která se zobrazí při špatném dotazu na web, či při chybě ([#288](https://github.com/Demagog2/demagog/issues/288))

## 22. února 2019
- Opraveno: Lze uploadovat obrázek — ať už obsahový, k článku, nebo kdekoliv jinde ([#316](https://github.com/Demagog2/demagog/pull/316))

## 19. února 2019
- Migrace na nový databázový systém - postgresql

## 21. ledna 2019
- Opraveno: Odstranění uživatelé neblokují změnu ověřovatele výroku

## 12. ledna 2019
- Opraveno: Statistiky (ve zpracování/...) na seznamu diskuzí v administraci se již aktualizují při změnách výroků bez nutnosti reloadu ([#225](https://github.com/Demagog2/demagog/issues/225))
- Změněno: Statistiky řečníků podle hodnocení na detailu diskuze v administraci se počítají už pro výroky ke korektuře, ne pouze pro schválené ([#258](https://github.com/Demagog2/demagog/issues/258))

## 8. ledna 2019
- Opraveno: Článek se korektně zobrazí i když není vyplněný perex ([#293](https://github.com/Demagog2/demagog/issues/293))

## 6. ledna 2019
- Změněno: U diskuze odteď jde přidat libovolné množství moderátorů ([#165](https://github.com/Demagog2/demagog/issues/165))

## 3. ledna 2019
- Změněno: Expert dostává méně notifikací z expertovaných výroků — už nedostane při komentáři, ve kterém není zmíněn, a při změně stavu jen pokud je nový stav "ke kontrole" ([#291](https://github.com/Demagog2/demagog/pull/291))

## 29. prosince 2018
- Opraveno: Při přidání nového výroku do diskuze zveřejněné v článku už není třeba odstranit a znovu přidat výrokový segment, aby se výrok v článku objevil ([#187](https://github.com/Demagog2/demagog/issues/187)

## 23. prosince 2018
- Opraveno: Při vkládání textu zkopírovaného z Google Docs by se už neměl ztrácet text a mělo by se správně přenášet formátování tučně a kurzíva ([#235](https://github.com/Demagog2/demagog/issues/235))

## 19. listopadu 2018
- Přidáno: U komentářů se veřejně zobrazuje datum zveřejnění ([#277](https://github.com/Demagog2/demagog/issues/277))

## 14. listopadu 2018
- Přidáno: Sekce pro správu mediálních osobností
- Upraveno: Mediální osobnosti přejmenovány na moderátory

## 2. října 2018
- Opraveno: U článku veřejně zobrazujeme i řečníka bez výroků (tj. se samými nulami) ([#251](https://github.com/Demagog2/demagog/pull/251))

## 1. října 2018
- Změněno: Tlačítko smazat diskuzi schováno do podmenu, aby se nedalo omylem stisknout ([#233](https://github.com/Demagog2/demagog/issues/233))

## 29. září 2018
- Přidáno: V toolbaru editoru přibyla možnost vkládání speciálních znaků, hlavně českých uvozovek „ a ‟, které se jinak na klávesnici špatně píší ([#228](https://github.com/Demagog2/demagog/issues/228))
- Přidáno: Upozornění jde označit za přečtené i zpátky jako nepřečtené z jejich přehledu ([#234](https://github.com/Demagog2/demagog/issues/234))
- Změněno: Filtry výroků na veřejném detailu článku posunuty doleva pro přehlednost na desktopu a přidán odkaz na zrušení filtrů ([#244](https://github.com/Demagog2/demagog/pull/244))

## 28. září 2018
- Přidáno: Tlačítko "Zveřejnit všechny schválené výroky" k seznamu výroků diskuze ([#241](https://github.com/Demagog2/demagog/issues/241))
- Přidáno: Stav ke korektuře pro lepší integraci korektorů do redakčního procesu ([#239](https://github.com/Demagog2/demagog/issues/239))

## 23. září 2018
- Opraveno: Seznam výroků v diskuzi dokáže zobrazit víc než 100 výroků ([#237](https://github.com/Demagog2/demagog/pull/237))

## 21. září 2018
- Přidáno: V seznamu výroků na detailu diskuze se u výroků ve zpracování zobrazuje délka odůvodnění ve znacích pro rychlý přehled, jestli se s výrokem něco děje ([#236](https://github.com/Demagog2/demagog/pull/236))

## 13. září 2018
- Přidáno: Odkazy v komentářích u výroku jsou zobrazeny klikatelné a pro přehlednost zkrácené s trojtečkou uprostřed. Dlouhé odkazy se správně zalamují v políčku komentáře. ([#221](https://github.com/Demagog2/demagog/issues/221))
- Přidáno: Tip, že jde ostatní z týmu zmiňovat pomocí @ při přidávání komentáře u výroku ([#220](https://github.com/Demagog2/demagog/issues/220))

## 12. září 2018
- Přidáno: U obrázků přibylo tlačítko na zkopírování odkazu obrázku do schránky ([#164](https://github.com/Demagog2/demagog/issues/164))
- Přidáno: Tlačítko na označení všech nepřečtených upozornění jako přečtené nad seznam všech upozornění ([#215](https://github.com/Demagog2/demagog/issues/215))
- Změněno: Zkrácené odůvodnění už nejde napsat delší než 280 znaků a počet znaků se zobrazuje pod políčkem ([#168](https://github.com/Demagog2/demagog/issues/168))
- Přidáno: Na detailu diskuze v administraci jsou vidět počty pravd/nepravd/atd. jednotlivých řečníků ([#213](https://github.com/Demagog2/demagog/issues/213))

## 10. září 2018
- Přidáno: Na detailu diskuze jde vyfiltrovat ještě nepřiřazené výroky ([#212](https://github.com/Demagog2/demagog/pull/212))

## 9. září 2018
- Přidáno: Přes administraci (Tým — Seřadit na stránce „O nás“) lze měnit pořadí členů týmu na stránce O nás ([#210](https://github.com/Demagog2/demagog/pull/210))
- Změněno: Celé odůvodnění jde kliknutím zobrazit hned u zkráceného odůvodnění výroku bez nutnosti skočit na separátní stránku výroku ([#208](https://github.com/Demagog2/demagog/pull/208))

## 6. září 2018
- Opraveno: Zobrazování ilustračního obrázku článku při sdílení na Facebooku ([#205](https://github.com/Demagog2/demagog/pull/205))

## 30. srpna 2018
- Opraveno: Stránka [O nás](https://demagog.cz/stranka/o-nas) zase zobrazuje členy týmu Demagog, zda-li tam mají být jde ovládat přes sekci Tým v administraci ([#153](https://github.com/Demagog2/demagog/issues/153))

## 22. srpna 2018
- Přidáno: Pokud je výrok vytvořen z přepisu, z detailu výroku se jde prokliknout na přepis se zvýrazněným výrokem a vidět tak kontext, ve kterém byl vyřčen ([#181](https://github.com/Demagog2/demagog/issues/181))
- Opraveno: Zobrazování rozbalovacího menu v MS Edge ([#177](https://github.com/Demagog2/demagog/issues/177))
- Opraveno: Divný bílý blok na detailu politika v MS Edge ([#178](https://github.com/Demagog2/demagog/issues/178))
- Opraveno: Menu ikona zobrazující se jako box v Chrome na Androidu ([#179](https://github.com/Demagog2/demagog/issues/179))
- Opraveno: Odkazy ze Seznamu na výroky vybraného hodnocení ([#193](https://github.com/Demagog2/demagog/issues/193))
