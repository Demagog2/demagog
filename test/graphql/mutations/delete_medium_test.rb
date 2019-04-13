# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteMediumMutationTest < GraphQLTestCase
  def mutation(medium)
    "
      mutation {
        deleteMedium(id: #{medium.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    medium = create(:medium)

    result = execute_with_errors(mutation(medium))

    assert_auth_needed_error result
  end

  test "should delete given medium" do
    medium = create(:medium)

    result = execute(mutation(medium), context: authenticated_user_context)

    assert_equal medium.id.to_s, result.data.deleteMedium.id
  end
end
