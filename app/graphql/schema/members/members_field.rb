# frozen_string_literal: true

module Schema::Members::MembersField
  extend ActiveSupport::Concern

  included do
    field :members, [Schema::Members::Types::MemberType], null: false

    def members
      User.public_members.ordered
    end
  end
end
