class CreateGovernmentRecords < ActiveRecord::Migration[6.0]
  def up
    Government.transaction do
      gov = Government.create(name: "Vláda Andreje Babiše")

      Minister.create(
        government: gov, name: "Předseda vlády", speaker: Speaker.find_by(id: 183), ordering: 1
      )
      Minister.create(
        government: gov,
        name: "1. místopředseda vlády a ministr vnitra",
        speaker: Speaker.find_by(id: 41),
        ordering: 2
      )
      Minister.create(
        government: gov,
        name: "místopředsedkyně vlády a ministryně financí",
        speaker: Speaker.find_by(id: 495),
        ordering: 3
      )
      Minister.create(
        government: gov,
        name: "místopředseda vlády a ministr průmyslu a obchodu",
        speaker: Speaker.find_by(id: 496),
        ordering: 4
      )
      Minister.create(
        government: gov,
        name: "ministr zahraničních věcí",
        speaker: Speaker.find_by(id: 476),
        ordering: 5
      )
      Minister.create(
        government: gov, name: "ministr obrany", speaker: Speaker.find_by(id: 497), ordering: 6
      )
      Minister.create(
        government: gov,
        name: "ministryně spravedlnosti",
        speaker: Speaker.find_by(id: 215),
        ordering: 7
      )
      Minister.create(
        government: gov,
        name: "ministr životního prostředí",
        speaker: Speaker.find_by(id: 444),
        ordering: 8
      )
      Minister.create(
        government: gov,
        name: "ministryně práce a sociálních věcí",
        speaker: Speaker.find_by(id: 498),
        ordering: 9
      )
      Minister.create(
        government: gov, name: "ministr dopravy", speaker: Speaker.find_by(id: 499), ordering: 10
      )
      Minister.create(
        government: gov,
        name: "ministr zemědělství",
        speaker: Speaker.find_by(id: 218),
        ordering: 11
      )
      Minister.create(
        government: gov,
        name: "ministr zdravotnictví",
        speaker: Speaker.find_by(id: 500),
        ordering: 12
      )
      Minister.create(
        government: gov,
        name: "ministr školství, mládeže a tělovýchovy",
        speaker: Speaker.find_by(id: 490),
        ordering: 13
      )
      Minister.create(
        government: gov,
        name: "ministryně pro místní rozvoj",
        speaker: Speaker.find_by(id: 479),
        ordering: 14
      )
      Minister.create(
        government: gov, name: "ministr kultury", speaker: Speaker.find_by(id: 1), ordering: 15
      )
    end
  end

  def down
    Minister.delete_all
    Government.delete_all
  end
end
