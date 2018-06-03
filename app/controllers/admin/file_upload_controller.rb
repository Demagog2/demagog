# frozen_string_literal: true

class Admin::FileUploadController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :authenticate_user!

  def upload_user_avatar
    params.permit!

    attach_picture User.find(params[:id])

    head :ok
  end

  def delete_user_avatar
    begin
      user = User.find(params[:id])

      user.avatar.purge
    rescue ActiveRecord::RecordNotFound
      head :not_found
    end
  end

  def upload_profile_picture
    params.permit!

    attach_picture Speaker.find(params[:id])

    head :ok
  end

  def delete_profile_picture
    begin
      speaker = Speaker.find(params[:id])

      speaker.avatar.purge
    rescue ActiveRecord::RecordNotFound
      head :not_found
    end
  end

  def upload_body_logo
    params.permit!

    body = Body.find(params[:id])

    body.logo.attach(
      io: params[:file].to_io,
      filename: params[:file].original_filename,
      content_type: params[:file].content_type
    )

    body.save!

    head :ok
  end

  def delete_body_logo
    begin
      body = Body.find(params[:id])

      body.logo.purge
    rescue ActiveRecord::RecordNotFound
      head :not_found
    end
  end

  private
    def attach_picture(entity)
      entity.avatar.attach(
        io: params[:file].to_io,
        filename: params[:file].original_filename,
        content_type: params[:file].content_type
      )

      entity.save!
    end
end
