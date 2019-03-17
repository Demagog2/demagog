# frozen_string_literal: true

class PublicApiAccess < ApplicationRecord
  def self.log(ip, user_agent, query, variables)
    self.create(ip: ip, user_agent: user_agent, query: query, variables: variables)
  end
end
