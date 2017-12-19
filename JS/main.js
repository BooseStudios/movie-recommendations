//all movies gathered from The Movie DB

const app = {


    baseURL: 'https://api.themoviedb.org/3/',
    configData: null,
    
    baseImageURL: null,
    path: null,
    
    imgSize: null,
    
    movieID: null,
    movieID2: null,



    init: function () {
        let btnSearch = document.querySelector("#search-button");
        
        
        btnSearch.addEventListener("click", app.runSearch);

        document.getElementById('recommendbtn').addEventListener('click', app.getRecomm);

        document.addEventListener('keypress', function (ev) {
            let char = ev.char || ev.charCode || ev.which;
            if (char == 10 || char == 13) {
                btnSearch.dispatchEvent(new MouseEvent('click'));
            }
        });

        let returnBtn = document.querySelector("#back-button");
        returnBtn.addEventListener("click", app.backHome);
        
        document.addEventListener('keydown', function (ev) {
            let char2 = ev.char || ev.charCode || ev.which;
            console.log('keypress');
            if (char2 == 27) {
                
                returnBtn.dispatchEvent(new MouseEvent('click'));
            }
        });

        app.getConfig();
    },

    getConfig: function () {
        let configURL = "".concat(app.baseURL, 'configuration?api_key=', APIKEY);
        
        console.log("test getConfig: ", configURL);

        fetch(configURL)
            .then(result => result.json())
            .then((data) => {
                console.log(data);
                app.baseImageURL = data.images.secure_base_url;
                console.log(app.baseImageURL);
                app.imgSize = data.images.poster_sizes[2];
                console.log(app.imgSize);
            })
            .catch(err => alert(err))
    },


    backHome: function () {
        console.log("returnBtn is working");
        
        document.querySelector("#search-results").classList.remove("active");
        
        
        document.querySelector("#recommend-results").classList.remove("active");
        document.querySelector(".search").classList.add("home");

        document.getElementById("search-input").value = null;
    },

    getRecomm: function () {
        document.querySelector(".loading").classList.remove("not");
        let url3 = "".concat(app.baseURL, 'movie/', app.movieID2, '/recommendations?api_key=', APIKEY);
        console.log(url3);
        fetch(url3)
            .then(result =>
                result.json())
            .then((data) => {
                console.log(data);
                document.querySelector("#search-results").classList.add("active");
                document.querySelector("#recommend-results").classList.remove("active");
                app.displayResults(data);
            })
            .catch(err => alert(err))
    },

    getDetails: function (ev) {
        document.querySelector(".loading").classList.remove("not");
        console.log(ev.currentTarget);
        console.log(ev.currentTarget.getAttribute("data-movie"));
        //movieID2 = ev.currentTarget.parentNode.childNodes[3].innerHTML;
        app.movieID2 = ev.currentTarget.getAttribute("data-movie");
        let url2 = "".concat(app.baseURL, 'movie/', app.movieID2, '?api_key=', APIKEY);

        console.log(url2);
        fetch(url2)
            .then(result =>
                result.json()
            )
            .then((data) => {
                console.log(data);

                document.querySelector("#search-results").classList.remove("active");
                document.querySelector("#recommend-results").classList.add("active");

                document.querySelector("#details-title").innerHTML = data.tagline;
                document.querySelector("#overview").innerHTML = data.overview;
                document.querySelector("#voteAverage").innerHTML = "Vote Average: " + data.vote_average;
                document.querySelector("#voteCount").innerHTML = "Vote Count: " + data.vote_count;

                document.querySelector(".loading").classList.add("not");


            })
            .catch(err => alert(err))
    },




    runSearch: function () {
        let keyWord = document.getElementById("search-input").value;
        console.log("Keyword: ", keyWord);
        if (keyWord == "") {
            alert("Please add at least one keyword!");
        } else {
            document.querySelector(".loading").classList.remove("not");

            console.log("Trying to find: ", keyWord);

            document.querySelector(".search").classList.remove("home");

            document.querySelector("#search-results").classList.add("active");
            document.querySelector("#recommend-results").classList.remove("active");



            let url = ''.concat(app.baseURL, 'search/movie?api_key=', APIKEY, '&query=', keyWord);
            fetch(url)
                .then(result =>
                    result.json()
                )

                .then((data) => {
                    console.log(data);
                    app.displayResults(data);

                })
                .catch(err => alert(err))
        }
    },

    displayResults: function (data) {



        while (document.querySelector(".content").hasChildNodes()) {
            document.querySelector(".content").removeChild(document.querySelector(".content").firstChild);
        }


        document.querySelector('.num').innerHTML = "There are " + data.results.length + " results";


        let df = document.createDocumentFragment();

        const useOrigTemplate = function () {
            return 'content' in document.createElement('template');
        }

        if (useOrigTemplate()) {
            console.log('the template is working');

            let temp = document.getElementById('origTemplate');
            let content = temp.content;

            console.log(content);


            data.results.forEach(function (item, index) {

                let unit = content.cloneNode(true);


                let unitImage = unit.querySelector('img');
                let unitImageURL = ''.concat(app.baseImageURL, app.imgSize, item.poster_path);

                unitImage.setAttribute("src", unitImageURL);
                unitImage.setAttribute("data-movie", item.id);
                unitImage.addEventListener("click", app.getDetails);


                let h2 = unit.querySelector('h2');

                h2.innerHTML = item.title;
                h2.setAttribute("data-movie", item.id);
                h2.addEventListener("click", app.getDetails);


                let p1 = unit.querySelector('p');

                movieID = item.id;
                p1.innerHTML = item.overview;


                df.appendChild(unit);

            })
        } else {
            console.log('content is not working')
        }

        document.querySelector('.content').appendChild(df);

        document.querySelector(".loading").classList.add("not");
    }
}

document.addEventListener('DOMContentLoaded', app.init);
