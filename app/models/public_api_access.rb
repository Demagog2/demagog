# frozen_string_literal: true

class PublicApiAccess < ApplicationRecord
  def self.log(ip, user_agent, query, variables)
    # Anonymize the IPv4 address by nullifying the last octet. We need to do that,
    # because IP address is considered piece of personal data by GDPR and just
    # hashing it is not enough.
    if ip.match?(/^\d+\.\d+\.\d+\.\d+$/)
      ip = ip.gsub(/.\d+$/, ".0")
    end

    self.create(ip: ip, user_agent: user_agent, query: query, variables: variables)
  end
end
