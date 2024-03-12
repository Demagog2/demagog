# frozen_string_literal: true

module Schema::Speakers::Types
  class SpeakerImageSizeType < Types::BaseEnum
    value Speaker::AVATAR_SIZE_SMALL
    value Speaker::AVATAR_SIZE_DETAIL
  end
end
