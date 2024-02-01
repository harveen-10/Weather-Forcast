import express from "express";
import axios from "axios";
import config from './config.js';

const app = express();
const port = 3000;
app.use(express.static("public"));

const getWeather=async (cityValue)=> {
    try{
        if(cityValue.length===0)
            return {error: 'Please enter a city name'};
    
        const key = config.API_KEY;
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
        
        const response=await axios.get(url);
        const data=response.data;

        return{
            name: data.name,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            temperature: data.main.temp,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
            error: null
        };
    }
    catch(error){
        return {error: 'City not found'};
    }
};


app.get("/", async(req, res) => {
    try {
        const city = req.query.city;
        let weatherData;
        if (city) {
            weatherData = await getWeather(city);
        }
        res.render("index.ejs", { weatherData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});