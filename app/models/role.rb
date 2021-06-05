# frozen_string_literal: true

EXPERT_PERMISSIONS = %w[
  articles:view
  articles:edit
  availability:view
  bodies:view
  bodies:edit
  images:view
  images:add
  images:delete
  media:view
  media:edit
  media-personalities:view
  media-personalities:edit
  menu:view
  pages:view
  pages:edit
  sources:view
  sources:edit
  speakers:view
  speakers:edit
  statements:add
  statements:edit
  statements:edit-as-evaluator
  statements:edit-as-proofreader
  statements:sort
  statements:view-unapproved-evaluation
  statements:view-evaluation-as-evaluator
  statements:comments:add
  statements:delete
  stats:view
  tags:view
  users:view
  users:edit
  visualizations:view
  web_contents:view
  web_contents:edit
]

ADMIN_PERMISSIONS = EXPERT_PERMISSIONS + %w[admin:become-another-user]

INTERN_PERMISSIONS = %w[
  availability:view
  bodies:view
  images:view
  images:add
  media:view
  media-personalities:view
  sources:view
  speakers:view
  statements:edit-as-evaluator
  statements:view-evaluation-as-evaluator
  statements:comments:add
  tags:view
  visualizations:view
]

class Role < ApplicationRecord
  ADMIN = "admin"
  EXPERT = "expert"
  SOCIAL_MEDIA_MANAGER = "social_media_manager"
  PROOFREADER = "proofreader"
  INTERN = "intern"

  has_and_belongs_to_many :users, join_table: :users_roles

  def permissions
    # Hardcoded now, can be turned into dynamic permissions assigning if needed
    case key
    when ADMIN
      ADMIN_PERMISSIONS
    when EXPERT
      EXPERT_PERMISSIONS
    when SOCIAL_MEDIA_MANAGER
      INTERN_PERMISSIONS +
        %w[
          articles:view
          articles:edit
          menu:view
          pages:view
          statements:view-unapproved-evaluation
          users:view
          web_contents:view
        ]
    when PROOFREADER
      INTERN_PERMISSIONS +
        %w[
          articles:view
          statements:edit
          statements:view-unapproved-evaluation
        ]
    when INTERN
      INTERN_PERMISSIONS
    else
      raise Exception.new("Permissions for role #{key} have not been implemented yet")
    end
  end
end
