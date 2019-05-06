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

Veracity.find_or_create_by!(key: Veracity::TRUE, name: "Pravda")
Veracity.find_or_create_by!(key: Veracity::UNTRUE, name: "Nepravda")
Veracity.find_or_create_by!(key: Veracity::MISLEADING, name: "Zavádějící")
Veracity.find_or_create_by!(key: Veracity::UNVERIFIABLE, name: "Neověřitelné")

PromiseRating.find_or_create_by!(key: PromiseRating::FULFILLED, name: "Splněno")
PromiseRating.find_or_create_by!(key: PromiseRating::IN_PROGRESS, name: "Průběžně plněno")
PromiseRating.find_or_create_by!(key: PromiseRating::PARTIALLY_FULFILLED, name: "Částečně splněno")
PromiseRating.find_or_create_by!(key: PromiseRating::BROKEN, name: "Porušeno")
PromiseRating.find_or_create_by!(key: PromiseRating::STALLED, name: "Nerealizováno")

AssessmentMethodology.create!(
  name: "Demagog.cz fact-checking metodika",
  url: "https://demagog.cz/stranka/jak-hodnotime-metodika",
  rating_model: AssessmentMethodology::RATING_MODEL_VERACITY,
  rating_keys: [Veracity::TRUE, Veracity::UNTRUE, Veracity::MISLEADING, Veracity::UNVERIFIABLE]
)
AssessmentMethodology.create!(
  name: "Demagog.cz metodika analýzy slibů Sobotkovy vlády",
  url: "https://demagog.cz/sliby/sobotkova-vlada/metodika",
  rating_model: AssessmentMethodology::RATING_MODEL_PROMISE_RATING,
  rating_keys: [PromiseRating::FULFILLED, PromiseRating::PARTIALLY_FULFILLED, PromiseRating::BROKEN]
)
AssessmentMethodology.create!(
  name: "Demagog.cz metodika analýzy slibů druhé vlády Andreje Babiše",
  rating_model: AssessmentMethodology::RATING_MODEL_PROMISE_RATING,
  rating_keys: [PromiseRating::FULFILLED, PromiseRating::IN_PROGRESS, PromiseRating::BROKEN, PromiseRating::STALLED]
)
