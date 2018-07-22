# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :statement
  belongs_to :user

  validates :content, presence: true, length: { minimum: 1 }

  scope :ordered, -> {
    order(created_at: :asc)
  }

  def display_content
    content.gsub(/@\[([^\]]+)\]\([^\)]+\)/, '\1')
  end

  def self.create_comment(comment_input, current_user)
    comment_input = comment_input.deep_symbolize_keys

    comment_input[:user] = current_user

    Comment.transaction do
      comment = Comment.create!(comment_input)

      notifications = []

      comment.content.scan(/@\[[^\]]+\]\(([^\)]+)\)/).each do |mention|
        recipient = User.find(mention[0])

        notifications << Notification.new(
          content: "#{comment.user.first_name} #{comment.user.last_name} tě zmínil/a v komentáři „#{comment.display_content.truncate(40, omission: '…')}‟ u výroku #{comment.statement.speaker.first_name} #{comment.statement.speaker.last_name}: „#{comment.statement.content.truncate(25, omission: '…')}‟",
          action_link: "",
          action_text: "",
          recipient: recipient
        )
      end

      if comment.statement.source.expert
        notifications << Notification.new(
          content: "#{comment.user.first_name} #{comment.user.last_name} přidal/a komentář „#{comment.display_content.truncate(40, omission: '…')}‟ u tebou expertovaného výroku #{comment.statement.speaker.first_name} #{comment.statement.speaker.last_name}: „#{comment.statement.content.truncate(25, omission: '…')}‟",
          action_link: "",
          action_text: "",
          recipient: comment.statement.source.expert
        )
      end

      if comment.statement.assessment.evaluator
        notifications << Notification.new(
          content: "#{comment.user.first_name} #{comment.user.last_name} přidal/a komentář „#{comment.display_content.truncate(40, omission: '…')}‟ u tebou ověřovaného výroku #{comment.statement.speaker.first_name} #{comment.statement.speaker.last_name}: „#{comment.statement.content.truncate(25, omission: '…')}‟",
          action_link: "",
          action_text: "",
          recipient: comment.statement.assessment.evaluator
        )
      end

      Notification.create_notifications(notifications, current_user)

      comment
    end
  end
end
