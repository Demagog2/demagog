# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteContentImageMutationTest < GraphQLTestCase
  def mutation(content_image)
    "
      mutation {
        deleteContentImage(id: #{content_image.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    content_image = create(:content_image)

    result = execute_with_errors(mutation(content_image))

    assert_auth_needed_error result
  end

  test "should delete a content_image" do
    content_image = create(:content_image)

    result = execute(mutation(content_image), context: authenticated_user_context)

    assert result.data.deleteContentImage, content_image.id

    assert_raise(Exception) do
      ContentImage.find(content_image.id)
    end
  end
end
