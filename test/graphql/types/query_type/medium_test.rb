# frozen_string_literal: true

require "graphql/graphql_testcase"

class TypeMediumTest < GraphQLTestCase
  test "medium should return given medium" do
    medium = create(:medium)

    query_string = "
      query {
        medium(id: #{medium.id}) {
          id
          name
        }
      }"

    result = execute(query_string)

    assert_equal medium.name, result.data.medium.name
  end

  test "medium should return error if it does not exist (or is deleted)" do
    medium = create(:medium)

    # soft delete medium
    medium.discard

    query_string = "
      query {
        medium(id: #{medium.id}) {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_graphql_error("Could not find Medium with id=#{medium.id}", result)
  end
end
