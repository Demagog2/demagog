# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateWorkshopMutationTest < GraphQLTestCase
  def mutation(fields)
    graphql_fields = fields.map do |key, value|
      "#{key}: " + (value.instance_of?(String) ? "\"#{value}\"" : value.to_s)
    end.join(", ")

    "
      mutation {
        createWorkshop(input: { #{graphql_fields} }) {
          ... on CreateWorkshopSuccess {
            workshop {
              id
              name
              description
              price
            }
          }

          ... on CreateWorkshopError {
            message
          }
        }
      }
    "
  end

  test "should require authentication" do
    workshop = build(:workshop)

    result = execute_with_errors(mutation(name: workshop.name, description: workshop.description, price: workshop.price))

    assert_auth_needed_error result
  end

  test "should create workshop" do
    workshop = build(:workshop)

    result = execute(mutation(name: workshop.name, description: workshop.description, price: workshop.price), context: authenticated_user_context)

    assert_equal(workshop.name, result.data.createWorkshop.workshop.name)
    assert_equal(workshop.description, result.data.createWorkshop.workshop.description)
    assert_equal(workshop.price, result.data.createWorkshop.workshop.price)
  end
end
