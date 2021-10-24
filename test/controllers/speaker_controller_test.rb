# frozen_string_literal: true

require "test_helper"

class SpeakerControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    elasticsearch_index [Speaker]

    get speakers_url()
    assert_response :success

    elasticsearch_cleanup [Speaker]
  end

  test "should get show" do
    speaker = create(:speaker_with_party)

    elasticsearch_index [Statement]

    get speaker_url(speaker)
    assert_response :success

    assert_select ".s-body"

    elasticsearch_cleanup [Statement]
  end

  test "should handle showing speaker without party" do
    speaker = create(:speaker)

    elasticsearch_index [Statement]

    get speaker_url(speaker)
    assert_response :success

    assert_select ".s-body", 0

    elasticsearch_cleanup [Statement]
  end

  test "should redirect from id-only url to slug one" do
    create(:speaker, id: 123, first_name: "Jan", last_name: "Novák")

    get "/politici/123"
    assert_redirected_to "/politici/jan-novak-123"
  end

  test "should redirect from wrong slug to correct one" do
    create(:speaker, id: 123, first_name: "Jan", last_name: "Novák")

    get "/politici/honza-novak-123"
    assert_redirected_to "/politici/jan-novak-123"
  end

  test "should redirect ?veracity=1..4 to correct filter param" do
    create(:speaker, id: 123, first_name: "Jan", last_name: "Novák")

    get "/politici/jan-novak-123?veracity=1"
    assert_redirected_to "/politici/jan-novak-123?hodnoceni=pravda"

    get "/politici/jan-novak-123?veracity=2"
    assert_redirected_to "/politici/jan-novak-123?hodnoceni=nepravda"

    get "/politici/jan-novak-123?veracity=3"
    assert_redirected_to "/politici/jan-novak-123?hodnoceni=zavadejici"

    get "/politici/jan-novak-123?veracity=4"
    assert_redirected_to "/politici/jan-novak-123?hodnoceni=neoveritelne"
  end
end
