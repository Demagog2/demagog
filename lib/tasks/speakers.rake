# frozen_string_literal: true

namespace :speakers do
  desc "Find and save Wikidata IDs for speakers without them"
  task :find_and_save_wikidata_ids, [:start_with_speaker_id] => [:environment] do |task, args|
    prompt = TTY::Prompt.new

    speakers = Speaker.where(wikidata_id: nil).order(id: :asc)
    unless args.start_with_speaker_id.nil?
      speakers = speakers.where("id >= ?", args.start_with_speaker_id.to_i)
    end

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

      puts "#" + speaker.id.to_s + " " + speaker.first_name + " " + speaker.last_name
      wikidata_ids = WikidataClient.search_for_speaker(speaker)

      if wikidata_ids.size == 1
        wikidata_entity = WikidataClient.fetch_entity(wikidata_ids[0])

        wikidata_id = wikidata_entity["id"]
        wikidata_label = wikidata_entity["labels"]["cs"]["value"]
        wikidata_desc = wikidata_entity["descriptions"]["cs"]["value"]
        wikidata_wikipedia_url = wikidata_entity["sitelinks"]["cswiki"]["url"]

        puts "Found " + wikidata_id + " " + wikidata_label + " (" + wikidata_desc + ") "
        puts wikidata_wikipedia_url

        if prompt.yes?("Do you wish to save Wikidata ID?")
          speaker.wikidata_id = wikidata_id
          speaker.save!

          puts "Saved"
        else
          puts "Not saved"
        end
      else
        puts "Found " + wikidata_ids.size.to_s + " Wikidata IDs: " + wikidata_ids.join(", ")
        prompt.keypress("Press anything to continue ...")
      end
    end
  end
end
