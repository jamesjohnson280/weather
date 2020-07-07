/* 
 * Weather App shared code. 
 * Requires jQuery and Modernizr. 
 */

/* Weather location defaults to NYC */
var DEFAULT_SETTINGS = {
    'location': 'new york, us',
    'location-name': 'New York',
    'units': 'imperial',
    'key': 'f9d3b7c02465d1b9c4b872c909ccabae',
    'latitude': 40.7038704,
    'longitude': -74.0138541
};

/* Lookup table to convert numbers to English words (HTML) for days.
   0 = Sunday, etc */
var WEEKDAYS = [
    'Sun<span class="mobile-hide">day</span>',
    'Mon<span class="mobile-hide">day</span>',
    'Tue<span class="mobile-hide">sday</span>',
    'Wed<span class="mobile-hide">nesday</span>',
    'Thu<span class="mobile-hide">rsday</span>',
    'Fri<span class="mobile-hide">day</span>',
    'Sat<span class="mobile-hide">urday</span>'
];

var settings = {}; /* Global settings */

function checkBrowserCaps() {
    /* Check browser for API support. */
    
    if ((!Modernizr.flexbox) || (!Modernizr.flexwrap)) {
        console.log('Flexbox unavailable.');
        alert('This browser does not support flexbox. As a result, ' + 
              'you may not have the best experience. Please upgrade your browser.');
    }
    if (!Modernizr.localstorage) {
        console.log('LocalStorage unavailable.');
        /* Remove access to settings if unable to use them*/
        $('button.settings').hide();
    }
    if (!Modernizr.geolocation) {
        console.log('Geolocation unavailable.');
        /* Remove device location button if geolocation doesn't work. */
        $('#geolocation-button').hide();
    }
}

function parseWeatherConditions(conditions) {
    /* Decides which weather theme to display based on openweathermap.org's 
       condition codes. */
    var cond = conditions[0];
    var c = Math.floor(cond.id / 100);
    var desc, icon, theme;
	
	/* Change weather if there is hash tag in the url */
	var hash = window.location.hash.substr(1);
	console.log('hash = "' + hash + '"');
	if (hash) {
		switch (hash) {
			case 'clear':
				cond.id = 800;
				c = 8;
				break;
			case 'partly-cloudy':
				cond.id = 801;
				c = 8;
				break;
			case 'cloudy':
				cond.id = 802;
				c = 8;
				break;w
			case 'overcast':
				cond.id = 803;
				c = 8;
				break;
			case 'light-rain':
				cond.id = 500;
				c = 5;
				break;
			case 'rain':
				cond.id = 501;
				c = 5;
				break;
			case 'showers':
				cond.id = 505;
				c = 5;
				break;
			case 'thunderstorm':
				cond.id = 200;
				c = 2;
				break;
			case 'foggy':
				cond.id = 700;
				c = 7;
				break;
			case 'snow':
				cond.id = 600;
				c = 6;
				break;
		}
	}
	
    switch (c) {
        case 2:
            desc = 'thunderstorm';
            icon = 'icon-thunderstorm';
            theme = 'thunderstorm';
            break;
        case 3:
            desc = 'light rain';
            icon = 'icon-rain';
            theme = 'rain';
            break;
        case 5:
            if (cond.id == 500) {
                desc = 'light rain';
                icon = 'icon-rain';
                theme = 'light-rain';
            } else if (cond.id < 504) {
                desc = 'rain';
                icon = 'icon-rain';
                theme = 'rain';
            } else {
                desc = 'showers';
                icon = 'icon-showers';
                theme = 'showers';
            }
            break;
        case 6:
            desc = 'snow';
            icon = 'icon-snow';
            theme = 'snow';
            break;
        case 7:
            desc = 'foggy';
            icon = 'icon-fog';
            theme = 'foggy';
            break;
        case 8:
            desc = 'clear skies';
            icon = 'icon-sunny';
            theme = 'sunny';
			if (cond.id == 803) {
                desc = 'Overcast';
                icon = 'icon-cloudy';
                theme = 'overcast'; 
            } else if (cond.id == 802) {
                desc = 'Cloudy';
                icon = 'icon-cloudy';
                theme = 'cloudy'; 
            } else if (cond.id == 801) {
                desc = 'partly cloudy';
                icon = 'icon-partly-cloudy';
                theme = 'partly-cloudy'; 
            }
            break;
    }
    return {
        'name': desc,
        'icon': icon,
        'theme': theme
    }
}

function parseWeekday(day) {
    /* Converts a UNIX timestamp to a weekday. e.g. 'Saturday' */
    var timestamp = day.dt;
    var d = new Date(0);
    d.setUTCSeconds(timestamp);
    return WEEKDAYS[d.getDay()];
}

function loadSettings() {
    /* Loads in the location settings from localStorage. Defaults
       to NYC if there is nothing saved. */
    if (!localStorage.getItem('settings')) {
        settings = DEFAULT_SETTINGS;
    } else {
        settings = JSON.parse(localStorage.getItem('settings'));
    }
    console.log('settings :');
    console.log(settings);
}

function saveSettings() {
    /* Saves location settings to localStorage */
    localStorage.setItem('settings', JSON.stringify(settings));
}