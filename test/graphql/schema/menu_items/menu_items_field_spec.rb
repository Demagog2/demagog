# frozen_string_literal: true

require "graphql/graphql_testcase"

class MenuItemsFieldTest < GraphQLTestCase
  test "returns menu items" do
    menu_item_page_one = create(:menu_item, :page, order: 1)
    menu_item_page_two = create(:menu_item, :page, order: 3)
    menu_item_divider = create(:menu_item, :divider, order: 2)

    query_string = "
          query {
            menuItems {
              __typename
              ... on MenuItemPage {
                id
                title
                page {
                  id
                  title
                }
              }
              ... on MenuItemDivider {
                id
              }
            }
          }
        "

    result = execute(query_string)
    assert_equal 3, result["data"]["menuItems"].size

    assert_equal menu_item_page_one.title, result["data"]["menuItems"][0]["title"]
    assert_equal menu_item_page_one.page.title, result["data"]["menuItems"][0]["page"]["title"]
    assert_equal menu_item_divider.id, result["data"]["menuItems"][1]["id"].to_i
    assert_equal menu_item_page_two.title, result["data"]["menuItems"][2]["title"]
    assert_equal menu_item_page_two.page.title, result["data"]["menuItems"][2]["page"]["title"]
  end
end
