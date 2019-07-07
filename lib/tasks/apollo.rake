# frozen_string_literal: true

namespace :apollo do
  desc "This task generate TypeScript types"
  task types: :environment do
    ADMIN_DIR = Dir.pwd + "/app/javascript/admin"
    APOLLO_BIN = Dir.pwd + "/node_modules/.bin/apollo"
    SCHEMA_FILE = "#{ADMIN_DIR}/schema.json"
    TYPES_OUTPUT_FILE = "#{ADMIN_DIR}/operation-result-types.ts"

    `#{APOLLO_BIN} schema:download #{SCHEMA_FILE} --endpoint=http://localhost:3000/graphql`
    `#{APOLLO_BIN} client:codegen #{TYPES_OUTPUT_FILE} --outputFlat --localSchemaFile=#{SCHEMA_FILE} --includes=#{ADMIN_DIR}/**/*.ts --target=typescript --passthroughCustomScalars --customScalarsPrefix=GraphQLCustomScalar_ `
  end
end
