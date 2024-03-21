# frozen_string_literal: true

class WorkshopOrder
  include ActiveModel::Model

  attr_accessor :name, :email, :phone, :workshop_type, :workshop_length, :workshop_form, :company, :city, :note

  validates :name, :email, :workshop_type, presence: true
end
