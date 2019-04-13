# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateMediumMutationTest < GraphQLTestCase
  def mutation(medium)
    "
      mutation {
        updateMedium(id: #{medium.id}, mediumInput: { name: \"Jane Doe\" }) {
          medium {
            name
          }
        }
      }
    "
  end

  test "should require authentication" do
    medium = create(:medium)

    result = execute_with_errors(mutation(medium))

    assert_auth_needed_error result
  end

  test "should update a medium" do
    medium = create(:medium)

    result = execute(mutation(medium), context: authenticated_user_context)

    assert_equal "Jane Doe", result.data.updateMedium.medium.name
  end
end
