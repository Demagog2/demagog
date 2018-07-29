# frozen_string_literal: true

require "#{Rails.root}/lib/migrate/helpers/html_content_helper"

class HtmlContentHelperTest < ActiveSupport::TestCase
  test "o-nas page" do
    assert_out_to_cleaned_in "o-nas"
  end

  test "jak-hodnotime-metodika page" do
    assert_out_to_cleaned_in "jak-hodnotime-metodika"
  end

  test "proc-projekt-demagogcz page" do
    assert_out_to_cleaned_in "proc-projekt-demagogcz"
  end

  test "demagogcz-v-mediich page" do
    assert_out_to_cleaned_in "demagogcz-v-mediich"
  end

  test "kontakty page" do
    assert_out_to_cleaned_in "kontakty"
  end

  test "eticky-kodex-demagogcz page" do
    assert_out_to_cleaned_in "eticky-kodex-demagogcz"
  end

  test "czech-this-out page" do
    assert_out_to_cleaned_in "czech-this-out"
  end

  test "workshopy page" do
    assert_out_to_cleaned_in "workshopy"
  end

  test "jak-je-projekt-demagogcz-financovan page" do
    assert_out_to_cleaned_in "jak-je-projekt-demagogcz-financovan"
  end

  test "babisovy-sportovni-sny article" do
    assert_out_to_cleaned_in "babisovy-sportovni-sny"
  end

  test "statement #9096 explanation" do
    assert_out_to_cleaned_in "oduvodneni-vyroku-#9096"
  end

  test "statement #16925 explanation" do
    assert_out_to_cleaned_in "oduvodneni-vyroku-#16925"
  end

  test "statement #16926 explanation" do
    assert_out_to_cleaned_in "oduvodneni-vyroku-#16926"
  end

  test "statement #16936 explanation" do
    assert_out_to_cleaned_in "oduvodneni-vyroku-#16936"
  end

  test "statement #16919 explanation" do
    assert_out_to_cleaned_in "oduvodneni-vyroku-#16919"
  end

  private

    def assert_out_to_cleaned_in(filename)
      in_html = File.read(__dir__ + "/data/#{filename}.in.html").strip
      out_html = File.read(__dir__ + "/data/#{filename}.out.html").strip

      result = HtmlContentHelper.to_clean_html(in_html)

      # puts "=================="
      # puts result
      # puts "=================="

      assert_equal out_html, result
    end
end
