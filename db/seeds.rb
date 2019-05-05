# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Role.find_or_create_by!(key: "admin", name: "Administrátor")
Role.find_or_create_by!(key: "expert", name: "Expert")
Role.find_or_create_by!(key: "social_media_manager", name: "Síťař")
Role.find_or_create_by!(key: "proofreader", name: "Korektor")
Role.find_or_create_by!(key: "intern", name: "Stážista")

ArticleType.find_or_create_by!(name: "default")
ArticleType.find_or_create_by!(name: "static")

Veracity.find_or_create_by!(key: "true", name: "Pravda")
Veracity.find_or_create_by!(key: "untrue", name: "Nepravda")
Veracity.find_or_create_by!(key: "misleading", name: "Zavádějící")
Veracity.find_or_create_by!(key: "unverifiable", name: "Neověřitelné")

PromiseRating.find_or_create_by!(key: "fulfilled", name: "Splněný")
PromiseRating.find_or_create_by!(key: "partially_fulfilled", name: "Částečně splněný")
PromiseRating.find_or_create_by!(key: "broken", name: "Porušený")
PromiseRating.find_or_create_by!(key: "stalled", name: "Nerealizovaný")
