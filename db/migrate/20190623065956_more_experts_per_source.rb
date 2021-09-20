# frozen_string_literal: true

class MoreExpertsPerSource < ActiveRecord::Migration[5.2]
  def change
    # Add new sources_experts table
    create_table :sources_experts, id: false do |t|
      t.belongs_to :source, index: true
      t.belongs_to :user, index: true
    end

    # Migrate from expert_id to sources_experts
    reversible do |dir|
      dir.up do
        select_all("SELECT * FROM sources").each do |source|
          if source["expert_id"]
            execute "INSERT INTO sources_experts (source_id, user_id) VALUES (#{source['id']}, #{source['expert_id']})"
          end
        end
      end
      dir.down do
        select_all("SELECT * FROM sources").each do |source|
          experts = select_all("SELECT * FROM sources_experts WHERE source_id = #{source['id']}")

          if experts.length > 0
            execute "UPDATE sources SET expert_id = #{experts.first['user_id']} WHERE id = #{source['id']}"
          end
        end
      end
    end

    # Remove expert_id
    remove_column :sources, :expert_id, :bigint
  end
end
