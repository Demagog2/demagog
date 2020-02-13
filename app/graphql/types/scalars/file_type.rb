# frozen_string_literal: true

# http://guides.rubyonrails.org/autoloading_and_reloading_constants.html
# create directories corresponding module structure, so you don't need to setup autoload_paths

# this custom scalar type will be used for a mutation input parameter
module Types
  module Scalars
    class FileType < GraphQL::Schema::Scalar
      description "action_dispatch_uploaded_file"

      def self.coerce_input(action_dispatch_uploaded_file, _ctx)
        action_dispatch_uploaded_file
      end
    end
  end
end
