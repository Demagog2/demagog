# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Role.create!(key: "admin", name: "Administrátor")
Role.create!(key: "expert", name: "Expert")
Role.create!(key: "social_media_manager", name: "Síťař")
Role.create!(key: "proofreader", name: "Korektor")
Role.create!(key: "intern", name: "Stážista")
