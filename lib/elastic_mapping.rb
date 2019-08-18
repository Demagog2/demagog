# frozen_string_literal: true

module ElasticMapping
  def self.indexes_name_field(mapping, name)
    # For names, we want to match just the exact match, not the declensed versions
    mapping.indexes name, type: "text", analyzer: "czech_lowercase"
  end

  def self.indexes_text_field(mapping, name)
    # Indexing both with stemmer and lowercase, because just one is not enough.
    # * Lowercase is needed when searching for e.g. "eu", which is thrown away
    #   as too short by the stemmer.
    # * Stemmer is needed when searching for e.g. "cesko" and we want to match
    #   also the declensed variantions like "ceska", "ceskem", etc.
    mapping.indexes name, type: "text", analyzer: "czech_stemmer" do
      mapping.indexes :czech_lowercase, type: "text", analyzer: "czech_lowercase"
    end
  end
end
