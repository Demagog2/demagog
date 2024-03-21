# frozen_string_literal: true

require "graphql/graphql_testcase"

module Schema::Workshops
  class WorkshopsFieldTest < GraphQLTestCase
    test "should return workshops" do
      create_list(:workshop, 5)

      query_string = "
        query {
          workshops {
            nodes {
              id
              name
              description
              price
              priceFormatted
            }
          }
        }
      "

      result = execute(query_string)

      assert_equal 5, result.data.workshops.nodes.size
      assert_equal 1500, result.data.workshops.nodes.first.price
      assert_equal "1.500 Kč", result.data.workshops.nodes.first.priceFormatted
    end

    test "should return workshop by id" do
      workshop = create(:workshop)

      query_string = "
        query {
          workshop(id: #{workshop.id}) {
            id
            name
            description
            price
            priceFormatted
          }
        }
      "

      result = execute(query_string)

      assert_equal 1500, result.data.workshop.price
      assert_equal "1.500 Kč", result.data.workshop.priceFormatted
    end
  end
end
