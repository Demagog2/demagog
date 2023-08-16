# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeVeracitiesTest < GraphQLTestCase
  setup do
    I18n.locale = "cs"
  end

  test "should return all veracities" do
    query_string = "
      query {
        veracities {
          id
          name
          key
        }
      }"

    result = execute(query_string)

    assert_equal [
                   { id: "1", name: "Pravda", key: "true" },
                   { id: "2", name: "Nepravda", key: "untrue" },
                   { id: "3", name: "Zavádějící", key: "misleading" },
                   { id: "4", name: "Neověřitelné", key: "unverifiable" },
                 ], result.data.veracities.map(&:to_h)
  end
end
