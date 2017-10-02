require "application_system_test_case"

class MapsTest < ApplicationSystemTestCase
  test "make sure title is present on new maps page" do
    visit new_map_url

    assert_selector "h1", text: "Where Would You Go?"
  end
end
