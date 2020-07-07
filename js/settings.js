/* 
 * Loads and displays users settings. Saves changes to them.
 * Requires jQuery, openweathermap.org's api, Google's places JS API and library.js
 */

function setTempToggle(units) {
    /* Set the temperature units toggle button based on settings */
    if (units == 'imperial') {
        $('#temp-f').attr('checked', 'checked');
        $('#temp-c').removeAttr('checked');
    } else if (units == 'metric') {
        $('#temp-c').attr('checked', 'checked');
        $('#temp-f').removeAttr('checked'); 
    } else {
        $('#temp-c').removeAttr('checked');
        $('#temp-f').removeAttr('checked');
    }
}

function displaySettings() {
    /* Display the user's current settings on the screen */
    $('#location-name').html(settings['location-name']);
    $('#location').html(settings['location']);
    setTempToggle(settings['units']);
}

function onPlaceChanged() {
    /* Get the GPS coords of the location the users selects 
       from the change location dropdown. */
    var place = autocomplete.getPlace();
    var pos = place.geometry.location;
    $('#new-location-lat').val((pos.lat()));
    $('#new-location-lon').val((pos.lng()));
}

function onUpdateClick() {
    /* User changed location so check if it's valid and save the settings */
    
    /* Get new location */
    var name = encodeURIComponent($('#new-location-name').val());
    var lat = $('#new-location-lat').val();
    var lon = $('#new-location-lon').val();
    
    if (!name) {
        $('#new-location').val('');
        $('#error').html('Please enter a valid city name.');
        return;
    }
    
    /* Check if it's valid */
    if (lat && lon) {
        url = 'https://api.openweathermap.org/data/2.5/weather?APPID=' + settings.key + '&lat=' + lat + '&lon=' + lon + '&units=' + settings.units;
    } else {
        url = 'https://api.openweathermap.org/data/2.5/weather?APPID=' + settings.key + '&q=' + location + '&units=' + settings.units;
    }    
    $.get(url, function(data) {
        /* Location is valid, save the settings */
        settings['location'] = name;
        settings['location-name'] = data.name;
        settings['latitude'] = data.coord.lat;
        settings['longitude'] = data.coord.lon;
        displaySettings();
        saveSettings();
        $('#new-location-name').val('');
        $('#error').html('');
    })
    .fail(function() {
        /* Location is not valid, display an error */
        $('#new-location').val('');
        $('#error').html('Please enter a valid city name.');
    });
}

function onGeoClick() {
    // Update location based on the device's position
    navigator.geolocation.getCurrentPosition(function(position) {
        var locationName = '';
        var url = 'https://api.openweathermap.org/data/2.5/weather?APPID=' + settings.key + 
                  '&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude +
                  '&units=' + settings.units;
        $.get(url, function(data) {
            settings['location'] = data.name;
            settings['location-name'] = data.name;
            settings['latitude'] = data.coord.lat;
            settings['longitude'] = data.coord.lon;
            displaySettings();
            saveSettings();
            $('#new-location-name').val('');
            $('#error').html('');
        })
        .fail(function() {
            /* Location is not valid, display an error */
            $('#new-location').val('');
            $('#error').html('Unable to use device location. Please enter a city below.');
        });
    });
}

function onImperialClick() {
    /* Set temp units to F */
    settings['units'] = 'imperial';
    displaySettings();
    saveSettings();
}

function onMetricClick() {
    /* Set temp units to C */
    settings['units'] = 'metric';
    displaySettings();
    saveSettings();
}

$(function() {
    checkBrowserCaps();
    
    /* Set up autocomplete */
    var options = { types: ['(regions)'] };
    autocomplete = new google.maps.places.Autocomplete($('#new-location-name').get(0), options);
    autocomplete.addListener('place_changed', onPlaceChanged);
    
    /* Hijack the form so browser doesn't reload when user presses enter to save changes. */
    $('form').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            onUpdateClick();
            return e.preventDefault();
        }
    });
    
    /* Get current settings */
    loadSettings();
    displaySettings();
    
    /* Hook into UI events */
    $('#update-button').click(onUpdateClick);
    $('#geolocation-button').click(onGeoClick);
    $('label.toggle-button.left').click(onImperialClick);
    $('label.toggle-button.right').click(onMetricClick);
});