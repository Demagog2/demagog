# frozen_string_literal: true

Types::AssessmentType = GraphQL::ObjectType.define do
  name "Assessment"

  field :id, !types.ID
  field :evaluation_status, !types.String
  field :statement, !Types::StatementType
  field :evaluator, Types::UserType
  field :short_explanation_characters_length, !types.Int
  field :explanation_characters_length, !types.Int

  field :veracity, Types::VeracityType do
    resolve -> (obj, args, ctx) do
      unless obj.is_user_authorized_to_view_evaluation(ctx[:current_user])
        return nil
      end

      obj.veracity
    end
  end

  field :short_explanation, types.String do
    resolve -> (obj, args, ctx) do
      unless obj.is_user_authorized_to_view_evaluation(ctx[:current_user])
        return nil
      end

      obj.short_explanation
    end
  end

  field :explanation_html, types.String do
    resolve -> (obj, args, ctx) do
      unless obj.is_user_authorized_to_view_evaluation(ctx[:current_user])
        return nil
      end

      obj.explanation_html
    end
  end

  field :explanation_slatejson, Types::Scalars::JsonType do
    resolve -> (obj, args, ctx) do
      unless obj.is_user_authorized_to_view_evaluation(ctx[:current_user])
        return nil
      end

      obj.explanation_slatejson
    end
  end

  field :explanation, types.String do
    description "Alias for explanation_html"
    resolve -> (obj, args, ctx) do
      obj.explanation_html
    end
  end
end
