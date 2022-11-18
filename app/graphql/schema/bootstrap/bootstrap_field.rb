module Schema::Bootstrap::BootstrapField
  extend ActiveSupport::Concern

  included do
    field :bootstrap, Types::BootstrapType, null: false

    def bootstrap
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      Bootstrap.new(ENV["DEMAGOG_IMAGE_SERVICE_URL"] || "")
    end
  end
end
