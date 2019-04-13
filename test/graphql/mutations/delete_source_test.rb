# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteSourceMutationTest < GraphQLTestCase
  def mutation(source)
    "
      mutation {
        deleteSource(id: #{source.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    source = create(:source)

    result = execute_with_errors(mutation(source))

    assert_auth_needed_error result
  end

  test "should delete given source" do
    source = create(:source)

    result = execute(mutation(source), context: authenticated_user_context)

    assert_equal source.id.to_s, result.data.deleteSource.id
  end
end
