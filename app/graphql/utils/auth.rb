# frozen_string_literal: true

module Utils::Auth
  def self.authenticate(ctx)
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]
  end

  def self.authorize(ctx, permissions)
    if (permissions & ctx[:current_user].role.permissions).size == 0
      raise Errors::NotAuthorizedError.new
    end
  end
end
