# frozen_string_literal: true

namespace :apollo do
  desc "This task generate TypeScript types"
  task types: :environment do
    TARGET_DIR = Dir.pwd + "/app/javascript/admin"

    `apollo-codegen introspect-schema http://localhost:3000/graphql --output #{TARGET_DIR}/schema.json`
    `apollo-codegen generate #{TARGET_DIR}/**/*.ts --schema #{TARGET_DIR}/schema.json --target typescript --output #{TARGET_DIR}/operation-result-types.ts`
  end
end
