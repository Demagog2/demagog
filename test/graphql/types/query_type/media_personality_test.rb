# frozen_string_literal: true

require "graphql/graphql_testcase"

class TypeMediumTest < GraphQLTestCase
  test "should return given media personality" do
    media_personality = create(:media_personality)

    query_string = "
      query {
        mediaPersonality(id: #{media_personality.id}) {
          id
          name
        }
      }"

    result = execute(query_string)

    assert_equal media_personality.name, result.data.mediaPersonality.name
  end

  test "should return error if it does not exist (or is deleted)" do
    media_personality = create(:media_personality)

    # soft delete media_personality
    media_personality.discard

    query_string = "
      query {
        mediaPersonality(id: #{media_personality.id}) {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_graphql_error("Could not find MediaPersonality with id=#{media_personality.id}", result)
  end
end
