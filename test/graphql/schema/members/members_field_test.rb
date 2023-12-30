# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSpeakersTest < GraphQLTestCase
  test "returns active team members sorted by rank" do
      active_user_one = create(:user, user_public: true, position_description: "position_description 1", bio: "bio 1", rank: 2)
      active_user_two = create(:user, :with_avatar, user_public: true, position_description: "position_description 2", bio: "bio 2", rank: 1)
      create(:user, active: false)

      query_string = "
          query {
            members {
              id
              fullName
              positionDescription
              bio
              avatar
            }
          }
        "

      result = execute(query_string)
      assert_equal 2, result["data"]["members"].size

      assert_equal active_user_two.id, result.data.members[0].id.to_i
      assert_equal active_user_two.full_name, result.data.members[0].fullName
      assert_equal active_user_two.position_description, result.data.members[0].positionDescription
      assert_equal active_user_two.bio, result.data.members[0].bio
      assert_match(/speaker\.png/, result.data.members[0].avatar)

      assert_equal active_user_one.id, result.data.members[1].id.to_i
      assert_equal active_user_one.full_name, result.data.members[1].fullName
      assert_equal active_user_one.position_description, result.data.members[1].positionDescription
      assert_equal active_user_one.bio, result.data.members[1].bio
    end
end
