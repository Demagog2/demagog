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
          statement_text: "#{comment.user.display_in_notification} tě zmínil/a v komentáři #{comment.display_in_notification("long")}",
          full_text: "#{comment.user.display_in_notification} tě zmínil/a v komentáři #{comment.display_in_notification} u výroku #{comment.statement.display_in_notification}",
          statement_id: comment.statement.id,
          recipient: recipient
        )
      end

      # Temporarily commented out, because we are finetuning the notifications for expert
      # if comment.statement.source.expert
      #   notifications << Notification.new(
      #     statement_text: "#{comment.user.display_in_notification} přidal/a komentář #{comment.display_in_notification("long")}",
      #     full_text: "#{comment.user.display_in_notification} přidal/a komentář #{comment.display_in_notification} u tebou expertovaného výroku #{comment.statement.display_in_notification}",
      #     statement_id: comment.statement.id,
      #     recipient: comment.statement.source.expert
      #   )
      # end

      if comment.statement.assessment.evaluator
        notifications << Notification.new(
          statement_text: "#{comment.user.display_in_notification} přidal/a komentář #{comment.display_in_notification("long")}",
          full_text: "#{comment.user.display_in_notification} přidal/a komentář #{comment.display_in_notification} u tebou ověřovaného výroku #{comment.statement.display_in_notification}",
          statement_id: comment.statement.id,
          recipient: comment.statement.assessment.evaluator
        )
      end

      Notification.create_notifications(notifications, current_user)

      comment
    end
  end

  def display_in_notification(type = "short")
    "„#{display_content.truncate(type == "short" ? 40 : 160, omission: '…')}“"
  end
end
