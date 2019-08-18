# frozen_string_literal: true

require "graphql/graphql_testcase"

class PublishApprovedSourceStatementsMutationTest < GraphQLTestCase
  def mutation(source)
    "
      mutation {
        publishApprovedSourceStatements(id: #{source.id}) {
          source {
            name
            statements {
              published
            }
          }
        }
      }
    "
  end

  test "should require authentication" do
    source = create(:source)

    result = execute_with_errors(mutation(source))

    assert_auth_needed_error result
  end

  test "should published approved source statements" do
    source = create(:source)
    create_list(:unpublished_statement, 3, source: source)

    result = execute(mutation(source), context: authenticated_user_context)

    assert_equal "Source name", result.data.publishApprovedSourceStatements.source.name
    assert_equal true, result.data.publishApprovedSourceStatements.source.statements.all?(&:published)
  end
end
