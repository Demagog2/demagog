# frozen_string_literal: true

class AnonymizeIpAddresses < ActiveRecord::Migration[6.1]
  def up
    execute 'UPDATE public_api_accesses SET ip = REGEXP_REPLACE(ip, \'\.\d+$\', \'.0\');'
  end

  def down
    # not implemented
  end
end
