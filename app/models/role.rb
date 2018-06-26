# frozen_string_literal: true

ALL_PERMISSIONS = [
  "sources:view",
  "sources:edit",

  "speakers",
  "bodies",
  "users",

  "statements:add",
  "statements:edit", # Allows editing of everything in statement
  "statements:edit-as-evaluator", # Allows editing in being_evaluated status by evaluator
  "statements:edit-texts", # Allows editing only texts, for proofreaders
  "statements:sort",
  "statements:view-unapproved-evaluation",
  "statements:comments:add",
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
        "sources:view",
        "statements:view-unapproved-evaluation",
        "statements:comments:add",
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
        "statements:comments:add",
      ]
    else raise Exception.new("Permissions for role #{key} have not been implemented yet")
    end
  end
end
