# frozen_string_literal: true

namespace :apollo do
  desc "This task generate TypeScript types"
  task types: :environment do
    TARGET_DIR = Dir.pwd + "/app/javascript/admin"

    APOLLO_CODEGEN_BIN = Dir.pwd + "/node_modules/.bin/apollo-codegen"
    `#{APOLLO_CODEGEN_BIN} introspect-schema http://localhost:3000/graphql --output #{TARGET_DIR}/schema.json`
    `#{APOLLO_CODEGEN_BIN} generate #{TARGET_DIR}/**/*.ts --schema #{TARGET_DIR}/schema.json --target typescript --output #{TARGET_DIR}/operation-result-types.ts --passthrough-custom-scalars --custom-scalars-prefix "GraphQLCustomScalar_"`
  end
end
