/* 
 * Loads and displays the current weather, a 5-day forecast and updates the background 
 * animation/theme for the type of weather being experienced. 
 * Requires jQuery, openweathermap.org's API and library.js
 */

function loadWeatherData() {
    /* Loads in data from openweathermap.org */
    
    /* Load current data */
    var url = 'https://api.openweathermap.org/data/2.5/weather?APPID=' + settings.key + 
              '&lat=' + settings.latitude + '&lon=' + settings.longitude + '&units=' + settings.units;
    $.get(url, function(data) {
        displayToday(data); 
    })
    
    /* Load 5-day forecast data */
    url = 'https://api.openweathermap.org/data/2.5/forecast/daily?APPID=' + settings.key + 
          '&lat=' + settings.latitude  + '&lon=' + settings.longitude + '&units=' + settings.units + '&cnt=6';
    $.get(url, function(data) {
        displayForecast(data);
    })
}

function displayToday(data) {
    /* Displays the current weather data on the page. */
    if (!data) {
        return;
    }
    
    /* Get weather data */
    var loc = data.name;
    var cond = parseWeatherConditions(data.weather);
    var temp = Math.round(data.main.temp);
    var minTemp = Math.round(data.main.temp_min);
    var maxTemp = Math.round(data.main.temp_max);
    
    /* Display data */
    $('.widget-weather .location').html(loc);
    $('.widget-weather .conditions').html(cond.name);
    $('.widget-weather .temperature').html(temp + '&deg;');
    $('.widget-weather .temp-range').html('Hi ' + maxTemp + '&deg; / Lo ' + minTemp + '&deg;');
	
	/* Update  weather theme */
	$('body').addClass(cond.theme);
    /* TODO: Check for day/night theme */
	$('body').addClass('day');
}

function displayForecast(data) {
    if (!data) {
        return;
    }
    var days = data.list;
    for (var i = 1; i < days.length; i++) {
        var day = days[i];
        /* Get day of forecast */
        var weekday = parseWeekday(day);
        
        /* Get temperature data */
        var minTemp = Math.round(day.temp.min);
        var maxTemp = Math.round(day.temp.max);
        
        /* Get weather conditions */
        var cond = parseWeatherConditions(day.weather);
        
        /* Display them */
        $('.day-'  + i + ' .temp-range').html(maxTemp + '&deg; / ' + minTemp + '&deg;');
        $('.day-' + i + ' .date').html(weekday);
        $('.day-' + i + ' .conditions').html(cond.name);
        $('.day-' + i + ' span.icon').addClass(cond.icon);
    }
}

$(function() {
    checkBrowserCaps();
    loadSettings();
    loadWeatherData();
});