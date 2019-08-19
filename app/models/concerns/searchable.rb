# frozen_string_literal: true

require "active_support/concern"
require "elasticsearch/model"

module Searchable
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name "#{self.model_name.collection}_#{Rails.env}"

    settings index: {
      analysis: {
        analyzer: {
          # Czech analyzers based on
          # https://www.ludekvesely.cz/serial-elasticsearch-4-fulltextove-vyhledavani-v-cestine/
          # and https://www.ludekvesely.cz/serial-elasticsearch-5-pokrocile-fulltextove-vyhledavani/
          #
          # Note: We are not using icu_folding and hunspell-based stemming now, because those are
          # not in elasticsearch out of the box. So to have simpler installation at least for now,
          # we are using just the asciifolding and Czech stemmer, which seem to be good enough.
          #
          # Analyzer czech_lowercase just transforms to lowercase and removes accents.
          # It is useful for strings where their exact form is important like names
          # (of people, media, etc.).
          czech_lowercase: {
            type: "custom",
            tokenizer: "standard",
            filter: [
              "lowercase",
              "asciifolding"
            ]
          },
          # Analyzer czech_stemmer converts meaningful words into their lowercase and unaccented
          # stems so it can match words even when they are declensed. It is useful for
          # sentence-based texts as a second analyzer next to the czech_lowercase.
          czech_stemmer: {
            type: "custom",
            tokenizer: "standard",
            filter: [
              "czech_stop",
              "lowercase",
              "czech_stemmer", # Not using hunspell-based stemming now so we have simpler installation
              "czech_stop",
              "asciifolding", # Not using icu_folding now so we have simpler installation
              "unique_on_same_position"
            ],
          }
        },
        filter: {
          czech_stemmer: {
            type: "stemmer",
            name: "czech"
          },
          czech_stop: {
            type: "stop",
            stopwords: ["_czech_"]
          },
          czech_length: {
            type: "length",
            min: 2
          },
          unique_on_same_position: {
            type: "unique",
            only_on_same_positon: true
          }
        },
      }
    }
  end

  class_methods do
    def simple_query_string_defaults
      {
        default_operator: "AND",
        flags: "AND|NOT|OR|PHRASE|PRECEDENCE|WHITESPACE"
      }
    end
  end
end
