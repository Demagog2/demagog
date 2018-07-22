# frozen_string_literal: true

EXPERT_PERMISSIONS = [
  "articles:view",
  "articles:edit",

  "availability:view",

  "bodies:view",
  "bodies:edit",

  "images:view",
  "images:add",
  "images:delete",

  "media:view",
  "media:edit",

  "menu:view",

  "pages:view",
  "pages:edit",

  "sources:view",
  "sources:edit",

  "speakers:view",
  "speakers:edit",

  "statements:add",
  "statements:edit", # Allows editing of everything in statement
  "statements:edit-as-evaluator", # Allows editing in being_evaluated status by evaluator
  "statements:edit-texts", # Allows editing only texts, for proofreaders
  "statements:sort",
  "statements:view-unapproved-evaluation",
  "statements:view-evaluation-as-evaluator",
  "statements:comments:add",
  "statements:delete",

  "tags:view",

  "users:view",
  "users:edit",

  "visualizations:view",
]

ADMIN_PERMISSIONS = EXPERT_PERMISSIONS + [
  "admin:become-another-user"
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
    when ADMIN then ADMIN_PERMISSIONS
    when EXPERT then EXPERT_PERMISSIONS
    when SOCIAL_MEDIA_MANAGER then [
        "articles:view",
        "availability:view",
        "bodies:view",
        "images:view",
        "media:view",
        "menu:view",
        "pages:view",
        "sources:view",
        "speakers:view",
        "statements:view-unapproved-evaluation",
        "statements:comments:add",
        "tags:view",
        "users:view",
        "visualizations:view",
      ]
    when PROOFREADER then [
        "articles:view",
        "bodies:view",
        "images:view",
        "images:add",
        "media:view",
        "sources:view",
        "speakers:view",
        "statements:edit-texts",
        "statements:view-unapproved-evaluation",
        "statements:comments:add",
        "tags:view",
        "visualizations:view",
      ]
    when INTERN then [
        "bodies:view",
        "images:view",
        "images:add",
        "media:view",
        "sources:view",
        "speakers:view",
        "statements:edit-as-evaluator",
        "statements:view-evaluation-as-evaluator",
        "statements:comments:add",
        "tags:view",
        "visualizations:view",
      ]
    else raise Exception.new("Permissions for role #{key} have not been implemented yet")
    end
  end
end
