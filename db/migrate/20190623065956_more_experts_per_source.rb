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
        Source.unscoped.all.each do |source|
          source.experts = (source.expert ? [source.expert] : [])
        end
      end
      dir.down do
        # Not implemented
      end
    end

    # Remove expert_id
    remove_column :sources, :expert_id, :bigint
  end
end
