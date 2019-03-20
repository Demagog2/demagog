# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeVeracitiesTest < GraphQLTestCase
  setup do
    ensure_veracities
  end

  test "should return all veracities" do
    query_string = "
      query {
        veracities {
          id
        }
      }"

    result = execute(query_string)

    assert_equal 4, result.data.veracities.size
  end
end
