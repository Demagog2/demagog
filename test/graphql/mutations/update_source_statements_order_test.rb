# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateSourceStatementsOrderMutationTest < GraphQLTestCase
  def mutation(source, ordered_statements = [])
    "
      mutation {
        updateSourceStatementsOrder(id: #{source.id}, input: { orderedStatementIds: [#{ordered_statements.map(&:id).join(', ')}] }) {
          source {
            name
            statements {
              id
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

  test "should update a source statements order" do
    source = create(:source)
    statements = create_list(:statement, 3, source:)

    ordered_statements = statements.reverse

    result = execute(mutation(source, ordered_statements), context: authenticated_user_context)

    assert_equal "Source name", result.data.updateSourceStatementsOrder.source.name
    assert_equal ordered_statements.map(&:id).map(&:to_s), result.data.updateSourceStatementsOrder.source.statements.map(&:id)
  end
end
