
# UVG-ISS tracker

We have developed a web interface to be able to visualize where the ISS is in real-time. The interface was intended to be user-friendly, so it limited the options with which it would have access, resulting in the only options to follow the ISS or be able to move freely and to show the nearby ground locations. It was also decided to display important information at the bottom of the interface so that when opening it on small devices it would not be blocked by the controls. To keep the interface as clean as possible we have decided to show only the GMT, the coordinates, where the station is located and the names of the nearby ground stations.



Our solution is based on ThreeJS and it works as follows. After having loaded the necessary resources, an API will be consulted to know where the ISS is located, it will return the values ​​of latitude and longitude so that later we will convert them to XYZ coordinates to be able to move the ISS model to Where corresponds.



Our project solves the challenge of tracking the international space station in real time while adding information that may be useful to the user, such as knowing which NASA's locations are close to the ISS.





## Set up
Download Node.js. Run this followed commands:
```
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
## ScreenShots
![Alt text](/src/screenshot/screenshot.png?raw=true "ScreenShot")
