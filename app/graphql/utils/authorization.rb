# frozen_string_literal: true

module Utils
  module Authorization
    def self.protect(resolve)
      ->(obj, args, ctx) do
        if ctx[:current_user]
          resolve.call(obj, args, ctx)
        else
          nil
        end
      end
    end
  end
end
