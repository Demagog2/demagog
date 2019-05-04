class Promises < ActiveRecord::Migration[5.2]
  def up
    # Add new promise ratings table
    create_table :promise_ratings do |t|
      t.string :name, null: false
      t.string :key, null: false
      t.timestamps
    end
    add_column :assessments, :promise_rating_id, :bigint
    add_index :assessments, :promise_rating_id

    promise_rating_fulfilled = PromiseRating.create!(name: 'Splněný', key: 'fulfilled')
    promise_rating_partially_fulfilled = PromiseRating.create!(name: 'Částečně splněný', key: 'partially_fulfilled')
    promise_rating_broken = PromiseRating.create!(name: 'Porušený', key: 'broken')
    promise_rating_stalled = PromiseRating.create!(name: 'Nerealizovaný', key: 'stalled')

    # Update tags schema
    remove_column :tags, :is_policy_area, :boolean
    remove_column :tags, :description, :text
    add_column :tags, :for_statement_type, :string, null: false
    change_column :tags, :name, :string, null: false

    # Statements-tags many-to-many relationship
    create_table :statements_tags, id: false do |t|
      t.belongs_to :statement
      t.belongs_to :tag
    end

    # Add promise tags
    tag_economy = Tag.create!(name: "Hospodářství", for_statement_type: "promise")
    tag_environment = Tag.create!(name: "Životní prostředí", for_statement_type: "promise")
    tag_welfare = Tag.create!(name: "Sociální stát", for_statement_type: "promise")
    tag_education = Tag.create!(name: "Vzdělanost", for_statement_type: "promise")
    tag_rule_of_law = Tag.create!(name: "Právní stát", for_statement_type: "promise")
    tag_safety = Tag.create!(name: "Bezpečnost", for_statement_type: "promise")

    # Statement.statement_type for differentiating between factual and promise statements
    add_column :statements, :statement_type, :string

    # Statement.title right now for allowing to give title to promises
    add_column :statements, :title, :string

    # All existing statements are factual ...
    execute "UPDATE statements SET statement_type = 'factual'"

    # ... except the promise statements of Sobotka ...
    Statement.unscoped.where(source_id: [439, 440, 441, 442, 443, 444]).each do |statement|
      statement.statement_type = "promise"

      if statement.assessment.veracity
        statement.assessment.promise_rating = {
          'true' => promise_rating_fulfilled,
          'untrue' => promise_rating_broken,
          'misleading' => promise_rating_partially_fulfilled,
          'unverifiable' => promise_rating_stalled
        }[statement.assessment.veracity.key]

        statement.assessment.veracity = nil

        statement.assessment.save!
      end

      statement.title = sobotkova_vlada_get_promise_title(statement)
      statement.content = sobotkova_vlada_get_promise_content(statement)

      unless statement.discarded?
        statement.tags = [tag_economy] if statement.source_id == 439
        statement.tags = [tag_safety] if statement.source_id == 440
        statement.tags = [tag_environment] if statement.source_id == 441
        statement.tags = [tag_welfare] if statement.source_id == 442
        statement.tags = [tag_education] if statement.source_id == 443
        statement.tags = [tag_rule_of_law] if statement.source_id == 444

        statement.published = true
      end

      statement.save!
    end

    # ... and promise statements of Babis
    Statement.unscoped.where(source_id: [562]).each do |statement|
      statement.statement_type = "promise"

      if statement.assessment.veracity
        statement.assessment.promise_rating = {
          'true' => promise_rating_fulfilled,
          'untrue' => promise_rating_broken,
          'misleading' => promise_rating_partially_fulfilled,
          'unverifiable' => promise_rating_stalled
        }[statement.assessment.veracity.key]

        statement.assessment.veracity = nil

        statement.assessment.save!
      end

      statement.title = andrejova_vlada_get_promise_title(statement)

      unless statement.discarded?
        statement.tags = [tag_economy] if ["Daňová zátěž", "Superhrubá mzda", "Privatizace", "Daně nadnárodních korporací", "Investiční plán země", "Rekodifikace stavebního práva", "Nové dálnice", "Dálniční známky", "Vlaková doprava"].include?(statement.title)
        statement.tags = [tag_safety] if ["Rozpočet na obranu", "Nábor vojáků", "Účast na vojenských misích", "Zákon o Vojenském zpravodajství", "Zastoupení v EU"].include?(statement.title)
        statement.tags = [tag_environment] if ["Zdroje elektřiny", "Poplatky za těžbu", "Podpora zemědělců", "Regulátor obchodu s vodou", "Nakládání s vodou", "Strategie nakládání s vodou", "Ochrana turistů", "Ochrana zemědělské půdy", "Kotlíkové dotace", "Nový zákon o odpadech"].include?(statement.title)
        statement.tags = [tag_welfare] if ["Zvýšení důchodu", "Zvýšení rodičovského příspěvku", "První tři dny nemocenské", "Sociální dávky", "Prevence", "Zákon o sociálním bydlení", "Bytová výstavba"].include?(statement.title)
        statement.tags = [tag_education] if ["Peníze do školství", "Obory na středních školách", "Nárok na školku od 2 let", "Právo na internet", "Financování sportu", "Financování sportu II."].include?(statement.title)
        statement.tags = [tag_rule_of_law] if ["Tvorba zákonů", "Výběr soudců", "Celostátní referendum", "Whistleblowing", "Ochrana dlužníků", "Otevřená data", "Odpolitizování státní správy", "Elektronický recept", "Analýza IT dopadů", "Digitální Česko", "Online platby u státních institucí", "Ochrana veřejnoprávních médií", "Menší veřejné zakázky"].include?(statement.title)
      end

      statement.save!
    end

    # We will always need a statement type from now on
    change_column :statements, :statement_type, :string, null: false
  end

  def down
    remove_index :assessments, :promise_rating_id
    remove_column :assessments, :promise_rating_id
    drop_table :promise_ratings

    remove_column :statements, :statement_type, :string, null: false
    remove_column :statements, :title, :string

    drop_table :statements_tags

    execute "DELETE FROM tags"

    change_column :tags, :name, :string
    add_column :tags, :is_policy_area, :boolean
    add_column :tags, :description, :text
    remove_column :tags, :for_statement_type, :string, null: false
  end

  private

    def sobotkova_vlada_get_promise_title(statement)
      explicit_transform = {
        15046 => "Online sázení podle EU",
        15048 => "Peníze pro SFDI",
        15052 => "Dokončení úseků TEN-T",
        15062 => "Paušály pro OSVČ",
        15064 => "Snížení DPH na vybrané komodity",
        15071 => "EET",
        15075 => "Zkrácení daňových výhod pro některé OSVČ",
        15091 => "Nová tvorba rozpočtu MO",
        15092 => "Vzdušný prostor ČR",
        15116 => "Rozšíření pravomocí NKÚ",
        15204 => "Prostředky na živ. prostředí z EU",
        15154 => "Zrušení II. pilíře"
      }
      return explicit_transform[statement.id] if explicit_transform.key?(statement.id)

      split_content = statement.content.split("\n")
      split_content.length >= 2 ? split_content[0].capitalize : ""
    end

    def sobotkova_vlada_get_promise_content(statement)
      split_content = statement.content.split("\n")
      split_content.length >= 2 ? statement.content.split("\n").drop(1).join("\n").strip : statement.content
    end

    def andrejova_vlada_get_promise_title(statement)
      {
        17516 => "Daňová zátěž",
        17517 => "Superhrubá mzda",
        17518 => "Privatizace",
        17519 => "Daně nadnárodních korporací",
        17520 => "Zvýšení důchodu",
        17521 => "Zvýšení rodičovského příspěvku",
        17522 => "První tři dny nemocenské",
        17523 => "Sociální dávky",
        17524 => "Analýza IT dopadů",
        17525 => "Digitální Česko",
        17526 => "Online platby u státních institucí",
        17527 => "Peníze do školství",
        17528 => "Obory na středních školách",
        17529 => "Nárok na školku od 2 let",
        17530 => "Nové dálnice",
        17531 => "Dálniční známky",
        17532 => "Vlaková doprava",
        17533 => "Rozpočet na obranu",
        17534 => "Nábor vojáků",
        17535 => "Účast na vojenských misích",
        17536 => "Tvorba zákonů",
        17537 => "Výběr soudců",
        17538 => "Celostátní referendum",
        17539 => "Whistleblowing",
        17540 => "Ochrana dlužníků",
        17541 => "Otevřená data",
        17542 => "Elektronický recept",
        17543 => "Prevence",
        17544 => "Zdroje elektřiny",
        17545 => "Poplatky za těžbu",
        17546 => "Právo na internet",
        17547 => "Zákon o sociálním bydlení",
        17548 => "Menší veřejné zakázky",
        17549 => "Ochrana veřejnoprávních médií",
        17550 => "Bytová výstavba",
        17551 => "Ochrana turistů",
        17552 => "Podpora zemědělců",
        17553 => "Strategie nakládání s vodou",
        17554 => "Ochrana zemědělské půdy",
        17555 => "Regulátor obchodu s vodou",
        17556 => "Nakládání s vodou",
        17557 => "Kotlíkové dotace",
        17558 => "Nový zákon o odpadech",
        17559 => "Financování sportu",
        17560 => "Financování sportu II.",
        17561 => "Investiční plán země",
        17562 => "Rekodifikace stavebního práva",
        17563 => "Zastoupení v EU",
        17565 => "Odpolitizování státní správy",
        17852 => "Zákon o Vojenském zpravodajství"
      }.fetch(statement.id, "")
    end
end
