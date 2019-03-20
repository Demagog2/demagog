# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeVeracitiesTest < GraphQLTestCase
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
