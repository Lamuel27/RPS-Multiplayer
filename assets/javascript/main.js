// Firebase to log data
var config = {
    apiKey: "AIzaSyCl1mx1b_jeLmyUHNFc9-qwXznNdXXQbqw",
    authDomain: "lamuelapp.firebaseapp.com",
    databaseURL: "https://lamuelapp.firebaseio.com",
    projectId: "lamuelapp",
    storageBucket: "lamuelapp.appspot.com",
    messagingSenderId: "33983257150"
};

firebase.initializeApp(config);

var database = firebase.database().ref();

// plugging in the current time
$("#current-time").append(moment().format("hh:mm A"));
// adding a new train to the database
$("#addTrain").on("click", function () {
    event.preventDefault();

    var trainName = "";
    var destination = "";
    var firstTrain = "";
    var frequency = "";

    trainName = $("#train-name").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = moment($("#train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    frequency = $("#frequency-input").val().trim();

    database.push({
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });

});


database.on("child_added", function (childSnapshot) {

    let data = childSnapshot.val();
    let trainNames = data.name;
    let trainDest = data.destination;
    let trainFreq = data.frequency;
    let firstTrain = data.firstTrain;
    console.log(firstTrain);
    // Calculate the minutes remaining until arrival
    let tRemainder = moment().diff(moment.unix(firstTrain), "minutes") % trainFreq;
    let tMinutes = trainFreq - tRemainder;

    // To calculate the arrival time, add the tMinutes to the currrent time
    let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    // Add each train's data into the table 
    var newRow = $("<tr>")

    newRow.html("<td>" + trainNames + "</td><td>" + trainDest + "</td><td class='min'>" + trainFreq + "</td><td class='min'>"+ tMinutes + "</td><td class='min'>" + tArrival + "</td><td></td>");

    $("#train-table").append(newRow);

    $(function () {
        $("#addTrain").on("click", function (event) {
            event.preventDefault();
            console.log("boosh");
        });
    });
});