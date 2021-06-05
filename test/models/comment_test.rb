# frozen_string_literal: true

require "test_helper"

class CommentTest < ActiveSupport::TestCase
  def test_create_basic_comment
    statement = create(:statement)
    user = create(:user)
    message = "Hello, world"

    comment = create_comment(message, statement, user)

    assert_equal message, comment.content
    assert_equal user, comment.user
    assert_equal statement, comment.statement

    notification = Notification.find_by(statement: statement, recipient: statement.assessment.evaluator)
    assert_not_nil notification
  end

  def test_create_comment_with_mention
    statement = create(:statement)
    user = create(:user)
    mentioned_user = create(:user)
    message = "Hello, @[#{mentioned_user.full_name}](#{mentioned_user.id})"

    comment = create_comment(message, statement, user)

    assert_equal message, comment.content
    assert_equal user, comment.user
    assert_equal statement, comment.statement

    notification = Notification.find_by(statement: statement, recipient: statement.assessment.evaluator)
    assert_not_nil notification

    notification = Notification.find_by(statement: statement, recipient: mentioned_user)
    assert_not_nil notification
  end

  def test_create_comment_with_experts_mention
    statement = create(:statement)
    user = create(:user)
    expert = create(:user)
    statement.source.experts << expert
    message = "Hello, @[Experti](experts)"

    comment = create_comment(message, statement, user)

    assert_equal message, comment.content
    assert_equal user, comment.user
    assert_equal statement, comment.statement

    notification = Notification.find_by(statement: statement, recipient: statement.assessment.evaluator)
    assert_not_nil notification

    notification = Notification.find_by(statement: statement, recipient: expert)
    assert_not_nil notification
  end

  def test_create_comment_with_social_media_managers_mention
    statement = create(:statement)
    user = create(:user)
    social_media_manager = create(:user, :social_media_manager)
    message = "Hello, @[Sitari](social_media_managers)"

    comment = create_comment(message, statement, user)

    assert_equal message, comment.content
    assert_equal user, comment.user
    assert_equal statement, comment.statement

    notification = Notification.find_by(statement: statement, recipient: statement.assessment.evaluator)
    assert_not_nil notification

    notification = Notification.find_by(statement: statement, recipient: social_media_manager)
    assert_not_nil notification
  end

  def test_create_comment_with_proofreaders_mention
    statement = create(:statement)
    user = create(:user)
    proofreader = create(:user, :proofreader)
    message = "Hello, @[Korektori](proofreaders)"

    comment = create_comment(message, statement, user)

    assert_equal message, comment.content
    assert_equal user, comment.user
    assert_equal statement, comment.statement

    notification = Notification.find_by(statement: statement, recipient: statement.assessment.evaluator)
    assert_not_nil notification

    notification = Notification.find_by(statement: statement, recipient: proofreader)
    assert_not_nil notification
  end

  private
    def create_comment(message, statement, user)
      comment = { statement: statement, content: message }
      Comment.create_comment(comment, user)
    end
end
