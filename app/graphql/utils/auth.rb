# frozen_string_literal: true

module Utils::Auth
  def self.authenticate(ctx)
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]
  end

  def self.authorize(ctx, permissions)
    unless self.is_authorized(ctx, permissions)
      raise Errors::NotAuthorizedError.new
    end
  end

  def self.is_authorized(ctx, permissions)
    permissions.all? { |permission| ctx[:current_user].authorized?(permission) }
  end
end
