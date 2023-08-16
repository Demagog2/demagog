# frozen_string_literal: true

class FillVeracityNewForExistingAssessments < ActiveRecord::Migration[7.0]
  def up
    assessments = Assessment.joins(:veracity).where(veracities: { key: Assessment::VERACITY_TRUE })
    assessments.update_all(veracity_new: Assessment::VERACITY_TRUE)

    assessments = Assessment.joins(:veracity).where(veracities: { key: Assessment::VERACITY_UNTRUE })
    assessments.update_all(veracity_new: Assessment::VERACITY_UNTRUE)

    assessments = Assessment.joins(:veracity).where(veracities: { key: Assessment::VERACITY_MISLEADING })
    assessments.update_all(veracity_new: Assessment::VERACITY_MISLEADING)

    assessments = Assessment.joins(:veracity).where(veracities: { key: Assessment::VERACITY_UNVERIFIABLE })
    assessments.update_all(veracity_new: Assessment::VERACITY_UNVERIFIABLE)
  end
end
