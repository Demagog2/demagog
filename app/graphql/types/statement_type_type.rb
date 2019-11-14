# frozen_string_literal: true

module Types
  class StatementTypeType < BaseEnum
    value Statement::TYPE_FACTUAL
    value Statement::TYPE_PROMISE
    value Statement::TYPE_NEWYEARS
  end
end
