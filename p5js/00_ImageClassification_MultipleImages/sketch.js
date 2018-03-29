/* ===
ML5 Example
00_ImageNet_Simple
Simple Image Classification using p5.js
=== */

// Initialize the ImageNet method with the MobileNet model.
const classifier = new ml5.ImageClassifier('MobileNet');

let img;
current_index = 0;
all_images = []
display = true;
display_time = 1000;
predictions = []

function append_images(){
    //for (var item in data.images){
    for (var i in data.images){
        console.log(i);
        img_path = i;
        all_images.push(get_image_path(img_path));
    }
    //}
}

function preload(){
    data = loadJSON('/assets/data.json', append_images);
}

function get_image_path(img_path){
    full_path = 'images/dataset/';
    full_path = full_path + img_path;
    console.log(full_path);
    return full_path
}

function draw_next_image(){
    img.attribute('src', all_images[current_index], imageReady);
}

function setup() {
    noCanvas();
    img = createImg(all_images[0], imageReady);
}


// When the image has been loaded,
// get a prediction for that image
function imageReady() {
  classifier.predict(img.elt, 10, gotResult);
}

function savePredictions(){
    predictions_JSON = {"predictions": predictions}
    saveJSON(predictions_JSON, 'predictions.json');
}

function removeImage(){
    current_index++;
    if (current_index <= all_images.length-1){
        draw_next_image();
    }else{
        savePredictions();
    }
}

// When we get the results
function gotResult(results) {
    information = {
        "name": all_images[current_index],
        "result": results[0].label,
        "probability": nf(results[0].probability, 0, 2)
    }
    predictions.push(information);

  if (display){
    // The results are in an array ordered by probability.
    select('#result').html(results[0].label);
    select('#probability').html(nf(results[0].probability, 0, 2));
    // Currently set to 1000 ms. This can be changed to show the image for a longer or shorter time.
    setTimeout(removeImage, display_time);
  }else{
    removeImage();
  }
}
