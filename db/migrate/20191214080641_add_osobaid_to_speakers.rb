# frozen_string_literal: true

class AddOsobaidToSpeakers < ActiveRecord::Migration[6.0]
  def change
    add_column :speakers, :osoba_id, :string

    speakers = Speaker.unscoped.order(last_name: :asc, first_name: :asc, id: :asc)
    speakers.each do |speaker|
      ignore_list = [
        "Koalice 2014-2017",
        "Koalice 2018-2021",
        "Diskutéři Novinky.cz",
        "ANO Politické hnutí",
        "Komunistická strana Čech a Moravy",
        "omyl n",
        "Uprchlická krize",
        "Haló noviny",
        "Tým Demagog.CZ",
        "EU Sekce Demagog.CZ",
        "Abeceda Migrace"
      ]
      next if ignore_list.include?(speaker.full_name)

      osoba_id = speaker.full_name.parameterize
      if speaker.full_name == "Václav Klaus mladší"
        osoba_id = "vaclav-klaus"
      end

      existing_count = Speaker.unscoped.where(osoba_id: osoba_id).count
      if existing_count > 0
        osoba_id += "-" + (existing_count + 1).to_s
      end

      speaker.osoba_id = osoba_id
      speaker.save!

      # p speaker.full_name + " [" + speaker.id.to_s + "] " + osoba_id
    end
  end
end
