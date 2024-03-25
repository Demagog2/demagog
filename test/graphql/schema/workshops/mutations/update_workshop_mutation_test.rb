# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateWorkshopMutationTest < GraphQLTestCase
  def mutation(workshop, field_name: "name", new_value: "foo")
    value = new_value.instance_of?(String) ? "\"#{new_value}\"" : new_value

    "
      mutation {
        updateWorkshop(input: { id: #{workshop.id}, #{field_name}: #{value} }) {
          ... on UpdateWorkshopSuccess {
            workshop {
              id
              name
              description
              price
            }
          }

          ... on UpdateWorkshopError {
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

  test "should update workshop name" do
    workshop = create(:workshop)

    result = execute(mutation(workshop, field_name: "name", new_value: "New name"), context: authenticated_user_context)

    assert_not_nil result.data.updateWorkshop.workshop
    assert_equal "New name", result.data.updateWorkshop.workshop.name
  end

  test "should update workshop description" do
    workshop = create(:workshop)

    result = execute(mutation(workshop, field_name: "description", new_value: "New desc"), context: authenticated_user_context)

    assert_not_nil result.data.updateWorkshop.workshop
    assert_equal "New desc", result.data.updateWorkshop.workshop.description
  end

  test "should update workshop price" do
    workshop = create(:workshop)

    result = execute(mutation(workshop, field_name: "price", new_value: 42), context: authenticated_user_context)

    assert_not_nil result.data.updateWorkshop.workshop
    assert_equal 42, result.data.updateWorkshop.workshop.price
  end
end
