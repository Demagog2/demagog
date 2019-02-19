# frozen_string_literal: true

require "test_helper"

class SourceTest < ActiveSupport::TestCase
  test "update_statements_source_order should set source_order to index of ordered ids" do
    source = create(:source)
    create_list(:statement, 10, source: source)

    assert_equal 10, source.statements.count
    assert source.statements.all? { |s| s.source_order.nil? }

    ordered_ids = source.statements.map { |s| s.id }
    source.update_statements_source_order(ordered_ids)

    source.statements.order(source_order: :asc).each_with_index do |s, i|
      assert_equal i, s.source_order
    end
  end

  test "update_statements_source_order should reset source_order when called with empty ordered ids list" do
    source = create(:source)
    create(:statement, source: source, source_order: 0)
    create(:statement, source: source, source_order: 1)

    assert_equal 2, source.statements.count
    assert source.statements.none? { |s| s.source_order.nil? }

    source.update_statements_source_order([])

    assert source.statements.all? { |s| s.source_order.nil? }
  end
end
