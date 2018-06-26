# frozen_string_literal: true

ALL_PERMISSIONS = [
  "articles:view",
  "articles:edit",

  "availability:view",

  "bodies:view",
  "bodies:edit",

  "images:view",

  "media:view",
  "media:edit",

  "menu:view",

  "pages:view",

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

  "tags:view",

  "users:view",
  "users:edit",

  "visualizations:view",
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
    when ADMIN then ALL_PERMISSIONS
    when EXPERT then ALL_PERMISSIONS
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
        "sources:view",
        "statements:edit-texts",
        "statements:view-unapproved-evaluation",
        "statements:comments:add",
      ]
    when INTERN then [
        "sources:view",
        "statements:edit-as-evaluator",
        "statements:view-evaluation-as-evaluator",
        "statements:comments:add",
      ]
    else raise Exception.new("Permissions for role #{key} have not been implemented yet")
    end
  end
end
