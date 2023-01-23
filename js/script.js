(function () {
    $(document).ready(function () {
        let startingLatitude = 29.515156939194544;
        let startingLongitude = -98.39371378157797;

        mapboxgl.accessToken = MAPBOX_API_KEY;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 10,
            center: [startingLongitude, startingLatitude]
        });

        const markerDurationInit = 400;
        const marker = new mapboxgl.Marker({"color": "red", draggable: true});
        marker.setLngLat([startingLongitude, startingLatitude]);

        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            APPID: OPENWEATHER_API_KEY,
            lat:    startingLatitude,
            lon:   startingLongitude,
            units: "imperial"
        }).done(function(data) {
            // console.log('The entire response:', data);
            // console.log('Diving in - here is current information: ', data.current);
            // console.log('A step further - information for tomorrow: ', data.daily[1]);
            console.log(data);
            console.log(`Location: ${data.city.name}, ${data.city.country}`);
        });

        // $('#map').append('div#coordinates')

        let e = $('<div id="coordinates" class="coordinates border border-2 border-white text-white rounded-3 bg-dark fs-6 mt-2 p-2"></div>');
        $('body').append(e);

        const coordinates = document.getElementById('coordinates');
        function onDragEnd() {
            let lngLat = marker.getLngLat();
            coordinates.style.display = 'block';
            coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: &nbsp&nbsp&nbsp&nbsp&nbsp${lngLat.lat}`;
            $('#coordinates').delay(2500).fadeOut(1000);
            map.flyTo({
                center: [lngLat.lng, lngLat.lat]
            });

            $.get("http://api.openweathermap.org/data/2.5/forecast", {
                APPID: OPENWEATHER_API_KEY,
                lat:    lngLat.lat,
                lon:   lngLat.lng,
                units: "imperial"
            }).done(function(data) {
                // console.log('The entire response:', data);
                // console.log('Diving in - here is current information: ', data.current);
                // console.log('A step further - information for tomorrow: ', data.daily[1]);
                console.log(data);
                console.log(`Location: ${data.city.name}, ${data.city.country}`);

                //formatted time
                //doesn't work with 5 day open werather plan
                // const unix_timestamp = data.current.dt;
                // const date = new Date(unix_timestamp * 1000);
                // const hours = date.getHours();
                // const minutes = "0" + date.getMinutes();
                // const seconds = "0" + date.getSeconds();
                // const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                //
                // console.log(formattedTime);

                // TODO:
                //use draggable marker to update forecast
                //drag end event listener for marker
                // or dblclick on map
                //dropdown for map themes, or light/dark mode
                //use reverse geocode for city and state
                // make a function for fetching 5 day forecast

            });
        }
        marker.on('dragend', onDragEnd);

        setTimeout(()=> {
            marker.addTo(map);
        },(markerDurationInit));

        map.addControl(new mapboxgl.NavigationControl());

        //TODO: sample popup

        // const popup = new mapboxgl.Popup()
        //     .setHTML(`
        //         <div class="card w-100">
        //               <img src="image/${restaurant.image}" class="card-img-top" alt="...">
        //             <div class="card-body">
        //                 <p class="fs-6">${restaurant.name}</p>
        //                 <p class="card-text">${restaurant.description}</p>
        //             </div>
        //         </div>
        //     `);
        //
        // marker.setPopup(popup);



    });


    // function pinThatAddress(address) {
    //     geocode(address, MAPBOX_API_KEY).then(function (address) {
    //         const marker = new mapboxgl.Marker();
    //         marker.setLngLat(address);
    //         marker.addTo(map);
    //     });
    // }

    // introduce .ajax()
    // go over request/response architecture
    // WHITEBOARD!
    // mention different types of requests
    // mention different types of data
    // show https://java.codeup.com as an example request and show the response as html

    // make a simple AJAX request to http://localhost
    // and show the echo server
    // $.ajax("http://localhost/?sort=desc&state=TX");
    //
    // // do a POST
    // $.ajax("http://localhost/", {
    //     type: "POST",
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //         name: "Bob Smith",
    //         age: 42
    //     })
    // });
    //
    // // do a PUT
    // $.ajax("http://localhost/v1/people/555", {
    //     type: "PUT",
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //         name: "Bob Smith",
    //         age: 52
    //     })
    // });
    //
    //     // do a DELETE
    //
    // $.ajax("http://localhost", {
    //         type: "DELETE",
    //         dataType: "json"
    // });

    // do some method chaining
    // use .done() to see the data from the GET request

    //     $.ajax("http://localhost").done(function(data) {
    //         // iterate over the data array
    //         // and print out each thing
    //         // console.log(data);
    //         // for (const row of data) {
    //         //     console.log(row);
    //         // }
    //         $("#my-div").text(data[0].currentPet.age);
    //
    // }).fail(function(jqXhr, status, error) {
    //         console.log("crap! "  + jqXhr.status)
    //     });


    // use .fail() and make a 404 happen
    // be sure to print the status
    // mutually exclusive with done()

    // show all the pretty http response codes

    // function getQuote() {
    //     $("#anime").text("");
    //     $("#character").text("");
    //     $("#quote").text("");
    //     $("#loading-pic").removeClass("d-none");
    //     $.ajax("https://animechan.vercel.app/api/random")
    //         .done(function(data) {
    //             console.log(data);
    //             $("#anime").text(data.anime);
    //             $("#character").text(data.character);
    //             $("#quote").text(data.quote);
    //
    //         }).fail(function(error) {
    //         console.log("RATS! an error");
    //     }).always(function() {
    //         $("#loading-pic").addClass("d-none");
    //     })
    // }
    //
    // $("#get-quote").click(getQuote);

    // $.ajax("https://pokeapi.co/api/v2/pokemon/charmander")
    //     .done(function(data) {
    //         // console.log(data);
    //         // $("#p1").text(data.name);
    //         // $("#p2").text(data.height);
    //         // $("#p3").text(data.weight);
    //     })
    //     .fail(function(statusCode) {
    //         console.log(statusCode.status);
    //     });
    // add .always() and explain

    // point out get and post shorthand

    // use a real api!


    // introduce JSON MAYBE DO THIS LAST BEFORE ANIME QUOTE DEMO
    // show JS object and talk about how it may not be usable outside of JS
    // show JSON equivalent



    // no cors problems THANK GOD!


    // HOWEVER: FOR 5 DAY FORECAST this api is not what we want
    // we must use the one call endpoint!
    // https://openweathermap.org/api/one-call-api#parameter
    // notice we must now use lat/lon instead of the city name + state

    // where is our data?!?

    // look in the .daily property
    // .daily is an array with 8 elements
    // index 0 is today
    // index 1 is tomorrow, etc.

    // what is dt ?  how to convert it to something more recognizable?
    // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript

    // what about the weather icon??? check out .daily[x].weather[0].icon
})();