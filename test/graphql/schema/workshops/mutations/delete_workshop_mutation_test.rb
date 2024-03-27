# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteWorkshopMutationTest < GraphQLTestCase
  def mutation(workshop)
    "
      mutation {
        deleteWorkshop(input: { id: #{workshop.id} }) {
          ... on DeleteWorkshopSuccess {
            id
          }

          ... on DeleteWorkshopError {
            message
          }
        }
      }
    "
  end

  test "should require authentication" do
    workshop = create(:workshop)

    result = execute_with_errors(mutation(workshop))

    assert_auth_needed_error result
  end

  test "should delete workshop" do
    workshop = create(:workshop)

    result = nil

    assert_difference "Workshop.count", -1 do
      result = execute(mutation(workshop), context: authenticated_user_context)
    end

    assert_not_nil result.data.deleteWorkshop.id
    assert_equal workshop.id, result.data.deleteWorkshop.id.to_i
  end
end
