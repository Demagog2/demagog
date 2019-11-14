class AddStatementTypeNewyears < ActiveRecord::Migration[6.0]
  def change
    # 2013
    execute "UPDATE statements SET statement_type = 'newyears' WHERE source_id = 225"
    # 2014
    execute "UPDATE statements SET statement_type = 'newyears' WHERE source_id = 303"
    # 2015
    execute "UPDATE statements SET statement_type = 'newyears' WHERE source_id = 346"
    # 2016
    execute "UPDATE statements SET statement_type = 'newyears' WHERE source_id = 402"
    # 2017
    execute "UPDATE statements SET statement_type = 'newyears' WHERE source_id = 492"
    # 2018
    execute "UPDATE statements SET statement_type = 'newyears' WHERE source_id = 570"
  end
end
