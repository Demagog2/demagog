# frozen_string_literal: true

class Admin::FileUploadController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :authenticate_user!

  def upload_article_illustration
    params.permit!

    attach_picture :illustration, Article.find(params[:id])

    head :ok
  end

  def delete_article_illustration
    begin
      article = Article.find(params[:id])

      article.illustration.purge
    rescue ActiveRecord::RecordNotFound
      head :not_found
    end
  end

  def upload_user_avatar
    params.permit!

    attach_picture :avatar, User.find(params[:id])

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

    attach_picture :avatar, Speaker.find(params[:id])

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

    attach_picture :logo, Body.find(params[:id])

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

  def upload_content_image
    params.permit!

    content_image = ContentImage.new(user: current_user)
    attach_picture :image, content_image

    head :ok
  end

  private
    def attach_picture(image_name, obj)
      obj.send(image_name).attach(
        io: params[:file].to_io,
        filename: params[:file].original_filename,
        content_type: params[:file].content_type
      )

      obj.save!
    end
end
