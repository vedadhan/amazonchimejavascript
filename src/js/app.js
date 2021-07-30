// Get Html Elments
var tempRoasted = [];
var startButton = document.getElementById("start-button");
var stopButton = document.getElementById("stop-button");
var muteButton = document.getElementById("mute-button");
var videobuttonPreview = document.getElementById("videobuttonPreview");
var audioInputReview = document.getElementById("audio-input");
var videoButton = document.getElementById("video-button");
var muteButtonAttendee = document.getElementById("muteButtonAttendee");
var video = document.querySelector("#video-preview");

var testButton = document.getElementById("test");
var presentScreenButton = document.getElementById("present-screen");
var messageButton = document.getElementById("messageText");
var finalVideo = false;
var finalAudio = false;

var commonHost = "host_";

let mediaRecorder;
let recordedBlobs;

//const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('#record_btn');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('#record_download');

var classroomName = "iauro"
var host_tile = "";
var host_Id = "";
var titleLocal = "";
var urlParams = new URLSearchParams(window.location.search);
var baseURL = "https://external.iauro.com/chime";
var DATA_MESSAGE_LIFETIME_MS = 300000;
var DATA_MESSAGE_TOPIC = 'chat';

var attendeePresenceSet = new Set();

var aStartTime = "July 13th 2021, 01:11:00 am"; //mm dd, yyyy hh:mm:ss  
var aEndTime = "July 20th 2021, 08:12:00 pm"; //mm dd, yyyy hh:mm:ss  

const startTime = moment(aStartTime, 'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY, h:mm:ss a');
const thresholdStartTime =  moment(aStartTime, 'MMMM Do YYYY, h:mm:ss a').format('yyyy-MM-DD');
const thresholdEndTime =  moment(aEndTime, 'MMMM Do YYYY, h:mm:ss a').format('yyyy-MM-DD');
const endTime =  moment(aEndTime, 'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY, h:mm:ss a');

document.getElementById("video-button").value = "video-start"
document.getElementById("video-button").innerHTML = "video-start"

function generateString() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}


//genrate random string function

var now = moment(thresholdEndTime); //todays date
var end = moment(thresholdStartTime); // another date
var duration = moment.duration(now.diff(end));
var days = duration.asDays();
console.log("no. of days:",days);

function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}

var dateofmeet = new Date().getDate();
dateLink =  [];

for (let i=0;i<days;i++){

    var d1 = new Date().getTime()
    var link = makeid(7);
    //const d2 = new Date("Mon Nov 09 2020 10:52:32 GMT+0545").getTime()
    const d2= now
    var result = new Date(thresholdStartTime);
    result.setDate(result.getDate() + i);
    dateofmeet=result

    // link: classroomName,current date ,unique id , start date
    link = classroomName + "_" + dateofmeet.getTime() + "_" + link + "_" + d2
    let my_object = {}; 
    my_object.date = dateofmeet;
    my_object.amazonChime = link;
    dateLink.push(my_object);

// dateofmeet.setDate(startTime1.getDate() + 1);


console.log("******___LINK_______*************: ",link);
console.log("start date: ",aStartTime);
console.log("Today: ", dateofmeet);
console.log("end date: ",aEndTime);

}
console.log("links: ",dateLink);
dateLink.forEach((element, index, array) => {
    console.log(index+" * ",element.date ,".................." ,element.amazonChime);
}); 
alert("Check  Console!");


// const d1 = new Date().getTime()
// var x = makeid(7);
// const d2 = new Date("Mon Nov 09 2020 10:52:32 GMT+0545").getTime()

// x = classroomName + "_" + d1 + "_" + x + "_" + d2

console.log("AKSHAY:=");
//console.log(d1);
//console.log(x);
//console.log(d2);

var isMeetingHost = false;
var meetingId = urlParams.get("meetingId");
var clientId = generateString();

console.log("*** meetingId:");
console.log(meetingId);
console.log("*** clientId: ", clientId);

const ChimeSDK = window.ChimeSDK;

let requestPath = `join?clientId=${clientId}`;
if (!meetingId) {
	isMeetingHost = true;
	console.log("*** ismeetinghost:", isMeetingHost);
} else {
	requestPath += `&meetingId=${meetingId}`;
}

if (!isMeetingHost) {
	document.getElementById("meeting-title").style.display = "none";
	// document.getElementById("inputMeeting").value = meetingId;

	titleLocal = meetingId
	startButton.innerText = "Join!";
} else {
	startButton.innerText = "Start!";
	stopButton.style.display = "block";
	titleLocal = link;
	document.getElementById("inputName").value = commonHost + document.getElementById("inputName").value;
}

//review video code
document.getElementById('videobuttonPreview').value = "start";
videoReview();

videobuttonPreview.addEventListener("click", hideVideo);


function videoReview(){
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			video.srcObject = stream;
			video.play();
		});
	}
}

 
 function hideVideo(){
	if(document.getElementById('videobuttonPreview').value == "start"){
		document.getElementById('videobuttonPreview').value = "stop";
		document.getElementById('videobuttonPreview').src = "./assets/video-call-mute.png"
		var videoClose = document.getElementById('video-preview');
		videoClose.pause();
		videoClose.srcObject  = null;
		finalVideo = true;
	}else if(document.getElementById('videobuttonPreview').value == "stop"){
		document.getElementById('videobuttonPreview').value = "start";
		document.getElementById('videobuttonPreview').src = "./assets/video-call.png"
		videoReview();
		finalVideo = false;
	}
 }


 
 (async () => {
	let volumeCallback = null;
	let volumeInterval = null;
	const volumeVisualizer = document.getElementById('volume-visualizer');
	const startButton = document.getElementById('start');
	const stopButton = document.getElementById('stop');
	// Initialize
	try {
	  const audioStream = await navigator.mediaDevices.getUserMedia({
		audio: {
		  echoCancellation: true
		}
	  });
	  const audioContext = new AudioContext();
	  const audioSource = audioContext.createMediaStreamSource(audioStream);
	  const analyser = audioContext.createAnalyser();
	  analyser.fftSize = 512;
	  analyser.minDecibels = -127;
	  analyser.maxDecibels = 0;
	  analyser.smoothingTimeConstant = 0.4;
	  audioSource.connect(analyser);
	  const volumes = new Uint8Array(analyser.frequencyBinCount);
	  volumeCallback = () => {
		analyser.getByteFrequencyData(volumes);
		let volumeSum = 0;
		for(const volume of volumes)
		  volumeSum += volume;
		const averageVolume = volumeSum / volumes.length;
		// Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
		volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
	  };
	} catch(e) {
	  console.error('Failed to initialize volume visualizer, simulating instead...', e);
	  // Simulation
	  //TODO remove in production!
	  let lastVolume = 50;
	  volumeCallback = () => {
		const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
		lastVolume = volume;
		volumeVisualizer.style.setProperty('--volume', volume + '%');
	  };
	}

	startButton.addEventListener('click', () => {
	  // Updating every 100ms (should be same as CSS transition speed)


	  	
	if(document.getElementById('start').value == "stop"){
		console.log("VEDA");
		document.getElementById('start').value  = "start"
		document.getElementById('start').src = "./assets/microphone.png"

	  if(volumeCallback !== null && volumeInterval === null)
		volumeInterval = setInterval(volumeCallback, 100);
		console.log('in add event listener of start button');
		finalAudio = true;

	}else{
		console.log("AKSHAY1");
		document.getElementById('start').value  = "stop"
		document.getElementById('start').src = "./assets/microphone-mute.png"
		finalAudio = false;
		if(volumeInterval !== null) {
			clearInterval(volumeInterval);
			volumeInterval = null;
		  }
	}
	});



	
  })();


console.log("** urlParams: ", window.location.search, urlParams);

console.log("** request path: ", requestPath);

startButton.style.display = "block";

async function start() {
	console.log("***in start");

	var isEntry = true;

	const current_time = moment().format('MMMM Do YYYY, h:mm:ss a');


	if (current_time >= thresholdStartTime && current_time <= thresholdEndTime) {
		isEntry = true
		alert(" Please enter in room");
	} else if (current_time < thresholdStartTime) {
		alert(" Link will be active at " + aStartTime);
		// window.close();
	} else if (current_time > thresholdEndTime && current_time <= endTime) {
		alert(" Meeting Got started. Please ask Admin to enter.");
		// window.close();
	} else if (current_time > endTime) {
		alert("Meeting ended Now VEDA.");
		// window.close();
	}
	// ended time stamp boundation

	if (isEntry == true){
	if (validateForm()) {
		if (window.meetingSession) {
			return;
		}
		try {
			console.log("akshay:");
			document.getElementById("cls").innerHTML = document.getElementById("inputMeeting").value;

			var txtTitle = document.getElementById("inputMeeting").value;
			var txtName = commonHost + document.getElementById("inputName").value;
			// titleLocal = document.getElementById("inputMeeting").value;
			// titleLocal = x;

			var raw = "";
			var requestOptions = {
				method: "POST",
				body: raw,
				redirect: "follow",
			};

			fetch(
				baseURL +
				"/join?title=" +
				titleLocal +
				"&name=" +
				txtName +
				"&region=ap-south-1",
				requestOptions
			)
				.then((response) => response.text())
				.then((result) => updateData(result))
				.catch((error) => alert(("***After API error: ", error)));
		} catch (err) {
			// handle error
			console.log("ERR : ", err);
		}
	}
	}

}

function validateForm() {
	// var a = document.getElementById("inputMeeting").value;
	var a = titleLocal;
	var b = commonHost + document.getElementById("inputName").value;
	if ((a == null || a == "", b == null || b == "")) {
		alert("Please Fill All Required Field");
		return false;
	}
	return true;
}

async function updateData(result1) {
	//alert(finalAudio);
	const result = JSON.parse(result1);
	console.log("result1", result1);
	const logger = new ChimeSDK.ConsoleLogger(
		"ChimeMeetingLogs",
		ChimeSDK.LogLevel.INFO
	);

	const deviceController = new ChimeSDK.DefaultDeviceController(logger);

	const configuration = new ChimeSDK.MeetingSessionConfiguration(
		result.JoinInfo.Meeting,
		result.JoinInfo.Attendee
	);
	var hostCheck = result.JoinInfo.Attendee.Attendee.ExternalUserId;
	if (hostCheck.includes("host")) {
		host_Id = hostCheck;
	}

	window.meetingSession = new ChimeSDK.DefaultMeetingSession(
		configuration,
		logger,
		deviceController
	);

	try {
		const audioInputs = await meetingSession.audioVideo.listAudioInputDevices();
		await meetingSession.audioVideo.chooseAudioInputDevice(
			audioInputs[0].deviceId
		);
	} catch (err) {
		// handle error - unable to acquire audio device perhaps due to permissions blocking
	}

	try {
		const videoInputs = await meetingSession.audioVideo.listVideoInputDevices();
		await meetingSession.audioVideo.chooseVideoInputDevice(
			videoInputs[0].deviceId
		);
	} catch (err) {
		// handle error - unable to acquire audio device perhaps due to permissions blocking
	}

	const observer = {
		// videoTileDidUpdate is called whenever a new tile is created or tileState changes.
		videoTileDidUpdate: (tileState) => {
			console.log("VIDEO TILE DID UPDATE2");
			console.log(tileState.tile);
			// Ignore a tile without attendee ID and other attendee's tile.
			if (!tileState.boundAttendeeId) {
				return;
			}
			updateTiles(meetingSession);
		},
	};

	setupDataMessage();
	meetingSession.audioVideo.addObserver(observer);
	meetingSession.audioVideo.startLocalVideoTile();

	const audioOutputElement = document.getElementById("meeting-audio");
	meetingSession.audioVideo.bindAudioElement(audioOutputElement);
	meetingSession.audioVideo.start();


	//most active speaker
	const activeSpeakerCallback = attendeeIds => {
		if (attendeeIds.length) {
			console.log(`${attendeeIds} is the most active speaker`);
		}
	};

	meetingSession.audioVideo.subscribeToActiveSpeakerDetector(
		new ChimeSDK.DefaultActiveSpeakerPolicy(),
		activeSpeakerCallback
	);


	 attendeePresenceSet = new Set();
	const callback = (presentAttendeeId, present,ExternalUserId) => {
	//   console.log(`Attendee ID: ${presentAttendeeId} ${ExternalUserId} Present: ${present}  muted: ${muted}`);
	  if (present) {
		attendeePresenceSet.add({"presentAttendeeId": presentAttendeeId,"externalUserId": ExternalUserId,"muted":false});
	  } else {
	
		attendeePresenceSet.forEach(function(item) {

			if(presentAttendeeId == item.presentAttendeeId ){
			  attendeePresenceSet.delete(item);
			}
		})	
	  }

	  console.log(attendeePresenceSet)

	  document.getElementById('listvalue').innerHTML = '';
	   
	  attendeePresenceSet.forEach(function(item) {

		console.log(item)
		var attendeeName = ""
		var res = item.externalUserId.split("#");

		if (res.length > 1) {
			attendeeName = res[1];
			var res2 = attendeeName.split("_");
			if (res2.length > 1) {
				attendeeName = res2[1];
			}
		}
	  					if (isMeetingHost) {
									document.getElementById('listvalue').innerHTML += `<li>  
			  <img src="./assets/microphone.png" style="width: 20px; height:20px; background-color:white;" id="muteButtonAttendee" /> 
			  ${attendeeName} </li>`;
		
							} else {
								document.getElementById('listvalue').innerHTML += `<li>  
			  <img src="./assets/microphone.png" style="width: 20px; height:20px; background-color:white;" id="muteButtonAttendee" /> 
			  ${attendeeName} </li>`;
							}

						})
	};
	
	meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(callback);

	document.getElementById("before-meeting").style.display = "none";
	document.getElementById("in-meeting").style.display = "block";


	if(finalVideo == true ){
		videoOnOff();
	}

	if(finalAudio == true ){
		mutefunc();
	}
}


function roasterUpdateMute(attendeeId,status) {

	document.getElementById('listvalue').innerHTML = '';
	
	attendeePresenceSet.forEach(function(item) {
		if (attendeeId == item.presentAttendeeId && status ==  "MUTE") {
			item.muted = true;
		}else if(attendeeId == item.presentAttendeeId && status ==  "UNMUTE") { 
			item.muted = false;
		}
	});


	attendeePresenceSet.forEach(function(item) {

		console.log(item)
		var attendeeName = ""
		var res = item.externalUserId.split("#");

		if (res.length > 1) {
			attendeeName = res[1];
			var res2 = attendeeName.split("_");
			if (res2.length > 1) {
				attendeeName = res2[1];
			}
		}
			console.log("AKSHAY VEDA");
			console.log(attendeeId);
			console.log(status);



		
	  					if (isMeetingHost) {
				
							if (true == item.muted) {
								// if (attendeeId == item.presentAttendeeId && status ==  "MUTE") {
									document.getElementById('listvalue').innerHTML += `<li>  
				<img src="./assets/microphone-mute.png" style="width: 20px; height:20px; backgroundColor:white;" id="muteButtonAttendee" /> 
				${attendeeName} </li>`;
								} else {
								

				document.getElementById('listvalue').innerHTML += `<li>  
				<img src="./assets/microphone.png" style="width: 20px; height:20px; background-color:white;" id="muteButtonAttendee" /> 
				${attendeeName} </li>`;
								}
	
							} else {
								if (true == item.muted){
								// if (attendeeId == item.presentAttendeeId && status ==  "MUTE") {
									document.getElementById('listvalue').innerHTML += `<li>  
				<img src="./assets/microphone-mute.png" style="width: 20px; height:20px; backgroundColor:white;" id="muteButtonAttendee" /> 
				${attendeeName} </li>`;
								} else {
								

				document.getElementById('listvalue').innerHTML += `<li>  
				<img src="./assets/microphone.png" style="width: 20px; height:20px; background-color:white;" id="muteButtonAttendee" /> 
				${attendeeName} </li>`;
								}
							}

						})


}

function getEventTarget(e) {
	e = e || window.event;
	return e.target || e.srcElement;
}

let ul = document.getElementById('listvalue');
if (ul != null) {
	ul.onclick = function (event) {
		let target = getEventTarget(event);
		let li = target.closest('li'); // get reference by using closest
		let nodes = Array.from(li.closest('ul').children); // get array
		let index = nodes.indexOf(li);
	
		var myArr = Array.from(attendeePresenceSet)  
		actionOnButtonMute(myArr[index].presentAttendeeId);
	
	};
}

function actionOnButtonMute(aID) {
	if (isMeetingHost) {
		const textToSend = "Iauro100-Mute-Request_" + aID + "_" + "MUTE";
		if (!textToSend) {
			return;
		}
		window.meetingSession.audioVideo.realtimeSendDataMessage(
			DATA_MESSAGE_TOPIC,
			textToSend,
			DATA_MESSAGE_LIFETIME_MS
		);
		// roasterUpdate();
	}
}

function updateTiles(meetingSession) {
	const tiles = meetingSession.audioVideo.getAllVideoTiles();

	// for (var i = 0; i < tiles.length; i++) {
	// 	console.log("vedaFOR_LOOP");
	// 	var name = tiles[i].tileState.boundExternalUserId;
	// 	//console.log("value of name:"+ name)
	// }

	tiles.forEach((tile) => {
		// if()
		let tileId = tile.tileState.tileId;
		let hostTileCheck = tile.tileState.boundExternalUserId;
		if (hostTileCheck.includes("#host")) {

			var videoElement = document.getElementById("host-video" + tileId);
			if (!videoElement) {
				videoElement = document.createElement("video");
				videoElement.id = "host-video" + tileId;
				document.getElementById("host-video").append(videoElement);
				meetingSession.audioVideo.bindVideoElement(tileId, videoElement);
			}


			var i;
			var max = 0;
			var isContent = false
			for (i = 0; i < tiles.length; i++) {
				if (tiles[i].tileState.tileId > max) {
					max = tiles[i].tileState.tileId
					if (tiles[i].tileState.isContent == true) {
						isContent = true;
					}
				}
			}

			for (i = 1; i <= max; i++) {
				var j;
				var flag = false;
				for (j = 0; j < tiles.length; j++) {
					if (i == tiles[j].tileState.tileId) {
						let hostTileCheck = tiles[j].tileState.boundExternalUserId;
						if (hostTileCheck.includes("#host")) {
							flag = true;

							if (isContent == true) {
								if (tiles[j].tileState.isContent == true) {
									var aFrame = document.getElementById("host-video" + i)
									if (aFrame != null) {
										document.getElementById("host-video" + i).style.width = '100%';
									}
								} else {
									var aFrame = document.getElementById("host-video" + i)
									if (aFrame != null) {
										document.getElementById("host-video" + i).style.position = 'absolute';
										document.getElementById("host-video" + i).style.width = '20%';
										document.getElementById("host-video" + i).style.height = '20%';
									}
								}
							} else {
								if (document.getElementById("host-video" + i).style != null) {
									document.getElementById("host-video" + i).style.width = '100%';
								}
							}
						}
					}
				}

				if (flag == false) {
					var aFrame = document.getElementById("host-video" + i)
					if (aFrame != null) {
						document.getElementById("host-video" + i).remove();
					}
				}
			}


		} else {
			var videoElement = document.getElementById("attendee-video" + tileId);


			if (!videoElement) {

				console.log("CONDITION TRUE")

				videoElement = document.createElement("video");
				videoElement.id = "attendee-video" + tileId;
				document.getElementById("attendee-video").append(videoElement);
				meetingSession.audioVideo.bindVideoElement(tileId, videoElement);


			}

			var i;
			var max = 0;
			for (i = 0; i < tiles.length; i++) {
				if (tiles[i].tileState.tileId > max) {
					max = tiles[i].tileState.tileId
				}
			}

			console.log(document.getElementById("attendee-video"));
			for (i = 1; i <= max; i++) {
				var j;
				var flag = false;
				for (j = 0; j < tiles.length; j++) {
					if (i == tiles[j].tileState.tileId) {
						// flag = true;

						if (!hostTileCheck.includes("#host")) {
							flag = true;
						}
					}
				}
				if (flag == false) {

					var aFrame = document.getElementById("attendee-video" + i)
					if (aFrame != null) {
						document.getElementById("attendee-video" + i).remove();
					}

				}
			}

			// }
		}
	});

}

async function stop() {
	stopButton.style.backgroundColor = "red";
	console.log("ending...");
	var raw = "";

	var requestOptions = {
		method: "POST",
		body: raw,
		redirect: "follow",
	};
	if (isMeetingHost) {
		fetch(baseURL + "/end?title=" + titleLocal, requestOptions)
			.then((response) => response.text())
			.then((result) => updateDataForStop(result))
			.catch((error) => console.log("error", error));
	}
	else {

		const observer = {
			audioVideoDidStop: sessionStatus => {
				const sessionStatusCode = ChimeSDK.sessionStatus.statusCode();
				if (sessionStatusCode === ChimeSDK.MeetingSessionStatusCode.Left) {
					/*
					  - You called meetingSession.audioVideo.stop().
					  - When closing a browser window or page, Chime SDK attempts to leave the session.
					*/
					console.log('You left the session');
				} else {
					console.log('Stopped with a session status code: ', sessionStatusCode);
				}
			}
		};

		meetingSession.audioVideo.addObserver(observer);
		//meetingSession.audioVideo.removeLocalVideoTile();
		meetingSession.audioVideo.stop();
		document.getElementById("before-meeting").style.display = "block";
		document.getElementById("in-meeting").style.display = "none";


	}
}

async function updateDataForStop(result1) {
	console.log("Akshay", result1);
	const videoElement = document.getElementById("attendee-video");
	let localTileId = null;

	const observer = {
		videoTileDidUpdate: (tileState) => {
			// Ignore a tile without attendee ID and other attendee's tile.
			if (!tileState.boundAttendeeId || !tileState.localTile) {
				return;
			}

			// videoTileDidUpdate is also invoked when you call startLocalVideoTile or tileState changes.
			// The tileState.active can be false in poor Internet connection, when the user paused the video tile, or when the video tile first arrived.
			console.log(
				`If you called stopLocalVideoTile, ${tileState.active} is false.`
			);
			meetingSession.audioVideo.bindVideoElement(
				tileState.tileId,
				videoElement
			);
			localTileId = tileState.tileId;
		},
		videoTileWasRemoved: (tileId) => {
			if (localTileId === tileId) {
				console.log(
					`You called removeLocalVideoTile. videoElement can be bound to another tile.`
				);
				localTileId = null;
			}
		},
	};

	meetingSession.audioVideo.addObserver(observer);

	meetingSession.audioVideo.stopLocalVideoTile();

	// Optional: You can remove the local tile from the session.
	meetingSession.audioVideo.removeLocalVideoTile();
	meetingSession.audioVideo.stop();

	document.getElementById("before-meeting").style.display = "block";
	document.getElementById("in-meeting").style.display = "none";

}

async function videoOnOff() {
	self.actionVideo()
}

//mute unmute

async function mutefunc() {
	const muted = meetingSession.audioVideo.realtimeIsLocalAudioMuted();
	if (muted) {
		// Unmute
		const unmuted = meetingSession.audioVideo.realtimeUnmuteLocalAudio();
		if (unmuted) {
			muteButton.style.backgroundColor = "white";
			console.log("Other attendees can hear your audio");

			const presentAttendeeId = meetingSession.configuration.credentials.attendeeId;

			const textToSend = "Iauro100-Mute-ACK_" + presentAttendeeId + "_" + "UNMUTE";

			if (!textToSend) {
				return;
			}
			window.meetingSession.audioVideo.realtimeSendDataMessage(
				DATA_MESSAGE_TOPIC,
				textToSend,
				DATA_MESSAGE_LIFETIME_MS
			);

			roasterUpdateMute(presentAttendeeId,"UNMUTE")
		} else {
			// See the realtimeSetCanUnmuteLocalAudio use case below.
			muteButton.style.backgroundColor = "red";
			console.log("You cannot unmute yourself");
		}
	} else {
		// Mute
		muteButton.style.backgroundColor = "red";
		meetingSession.audioVideo.realtimeMuteLocalAudio();
		console.log("You are muted");

		const presentAttendeeId = meetingSession.configuration.credentials.attendeeId;
		const textToSend = "Iauro100-Mute-ACK_" + presentAttendeeId + "_" + "MUTE";

		if (!textToSend) {
			return;
		}
		window.meetingSession.audioVideo.realtimeSendDataMessage(
			DATA_MESSAGE_TOPIC,
			textToSend,
			DATA_MESSAGE_LIFETIME_MS
		);

		roasterUpdateMute(presentAttendeeId,"MUTE")
	}

	// roasterUpdateMute()
}

// mute all
async function muteUnmuteAttendee() {
	alert("hello: ", meetingSession.configuration.credentials.attendeeId);

}

//screen recorder


// recordButton.addEventListener('click', () => {
// 	if (recordButton.textContent === 'Record') {
// 	  startRecording();
// 	} else {
// 	  stopRecording();
// 	  recordButton.textContent = 'Record';
// 	  downloadButton.disabled = false;
// 	  playButton.disabled = false;
// 	}
//   });


// playButton.addEventListener('click', () => {
// 	const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
// 	recordedVideo.src = null;
// 	recordedVideo.srcObject = null;
// 	recordedVideo.src = window.URL.createObjectURL(superBuffer);
// 	recordedVideo.controls = true;
// 	recordedVideo.play();
//   });
  

//   downloadButton.addEventListener('click', () => {
// 	const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
// 	const url = window.URL.createObjectURL(blob);
// 	const a = document.createElement('a');
// 	a.style.display = 'none';
// 	a.href = url;
// 	a.download = 'test.mp4';
// 	document.body.appendChild(a);
// 	a.click();
// 	setTimeout(() => {
// 	  document.body.removeChild(a);
// 	  window.URL.revokeObjectURL(url);
// 	}, 100);
//   });

//   function handleDataAvailable(event) {
// 	console.log('handleDataAvailable', event);
// 	if (event.data && event.data.size > 0) {
// 	  recordedBlobs.push(event.data);
// 	}
//   }

//   function startRecording() {
// 	recordedBlobs = [];
// 	let options = {mimeType: document.getElementById("video-button").value == "video-start" ? 'video/webm;codecs=vp9,opus' : "audio/webm"};

	
// 	try {
// 	  mediaRecorder = new MediaRecorder(window.stream, options);
// 	} catch (e) {
// 	  console.error('Exception while creating MediaRecorder:', e);
// 	  errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
// 	  return;
// 	}
  
// 	console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
// 	recordButton.textContent = 'Stop Recording';
// 	//playButton.disabled = true;
// 	downloadButton.disabled = true;
// 	mediaRecorder.onstop = (event) => {
// 	  console.log('Recorder stopped: ', event);
// 	  console.log('Recorded Blobs: ', recordedBlobs);
// 	};
// 	mediaRecorder.ondataavailable = handleDataAvailable;
// 	mediaRecorder.start();
// 	console.log('MediaRecorder started', mediaRecorder);
//   }

//   function stopRecording() {
// 	mediaRecorder.stop();
//   }
  
//   function handleSuccess(stream) {
// 	recordButton.disabled = false;
// 	console.log('getUserMedia() got stream:', stream);
// 	window.stream = stream;
  
// 	const gumVideo = document.querySelector('video#gum');
// 	gumVideo.srcObject = stream;
//   }
  

// async function init(constraints) {
// 	try {
// 	  const stream = await navigator.mediaDevices.getUserMedia(constraints);
// 	  handleSuccess(stream);
// 	} catch (e) {
// 	  console.error('navigator.getUserMedia error:', e);
// 	  errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
// 	}
//   }


// document.querySelector('button#record_btn').addEventListener('click', async () => {
// 	//const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
// 	const constraints = {
// 	  audio: true,
// 	  video: true
// 	};
// 	console.log('Using media constraints:', constraints);
// 	await init(constraints);
//   });


//screen share
async function presentScreenfunc() {
	console.log(" ***In present screen function");

	const observer = {
		videoTileDidUpdate: (tileState) => {
			// Ignore a tile without attendee ID and videos.
			if (!tileState.boundAttendeeId || !tileState.isContent) {
				return;
			}
			const yourAttendeeId =
				meetingSession.configuration.credentials.attendeeId;

			// tileState.boundAttendeeId is formatted as "attendee-id#content".
			const boundAttendeeId = tileState.boundAttendeeId;
			// Get the attendee ID from "attendee-id#content".
			const baseAttendeeId = new ChimeSDK.DefaultModality(boundAttendeeId).base();
			console.log(baseAttendeeId);
			if (baseAttendeeId === yourAttendeeId) {
				console.log("You called startContentShareFromScreenCapture . ", baseAttendeeId);
			}
		},
		contentShareDidStart: () => {
			console.log("Screen share started");
		},
		contentShareDidStop: () => {
			// Chime SDK allows 2 simultaneous content shares per meeting.
			// This method will be invoked if two attendees are already sharing content
			// when you call startContentShareFromScreenCapture or startContentShare.
			// videoElement9.style.display = "none";
			// console.log("Screen share stopped");
			// updateTiles(meetingSession);

			const tiles = meetingSession.audioVideo.getAllVideoTiles();


			var i;
			var max = 0;
			var isContent = false
			for (i = 0; i < tiles.length; i++) {
				if (tiles[i].tileState.tileId > max) {
					let hostTileCheck = tiles[i].tileState.boundExternalUserId;
					if (hostTileCheck.includes("#host")) {
						actionVideo();
						actionVideo();
					}
				}
			}
		},
	};

	meetingSession.audioVideo.addContentShareObserver(observer);
	meetingSession.audioVideo.addObserver(observer);

	// A browser will prompt the user to choose the screen.
	const contentShareStream =
		await meetingSession.audioVideo.startContentShareFromScreenCapture();

	//var videoElement9 = document.getElementById("screen-share");
	// var host_video_tile= document.getElementById("host-video").
	// style.display="none";
	//	videoElement9.style.display = "block";
	//	DefaultVideoTile.connectVideoStreamToVideoElement(contentShareStream,videoElement9,true	);
}

async function handleSendMessage() {
	const textArea = document.getElementById('message-input')

	const textToSend = textArea.value.trim();
	if (!textToSend) {

		return;
	}

	console.log("akshay123456:SEND")
	console.log("Sending: ", textToSend)
	// console.log("***Sender: ",meetingSession.configuration.result.JoinInfo.Attendee.Attendee.ExternalUserId);

	textArea.value = '';
	// var mSec = data.timestampMs;
	var msgTime = new Date();
	appendMessage(textToSend, "You");

	window.meetingSession.audioVideo.realtimeSendDataMessage(
		DATA_MESSAGE_TOPIC,
		textToSend,
		DATA_MESSAGE_LIFETIME_MS
	);

}

async function setupDataMessage() {
	window.meetingSession.audioVideo.realtimeSubscribeToReceiveDataMessage(DATA_MESSAGE_TOPIC, data => {
		// const { id } = data.json();
		console.log("akshay123456");
		console.log("DATA: ", data);
		// console.log("DATA: ",senderExternalUserId);

		var msgString = new TextDecoder().decode(data.data);
		var senderNameRaw = data.senderExternalUserId;
		var mSec = data.timestampMs;
		var msgTime = new Date(mSec);
		var res = senderNameRaw.split("#");
		var senderName = res[1];
		console.log("***messaGe: ", msgString);
		console.log("***messaGe sender: ", senderName);
		console.log("***messaGe send time: ", msgTime);

		if (checkIsAttendee(msgString) == false) {
			appendMessage(msgString, senderName);
		} else {
			const muted = meetingSession.audioVideo.realtimeIsLocalAudioMuted();
			if (muted) {

			} else {
				// Mute
				if (!isMeetingHost) {

					var attendeeId = "";
					var res = msgString.split("_");
					var hostId = "";

					if (res.length > 1) {
						attendeeId = res[1];
					}

					if (res.length > 2) {
						hostId = res[1];
					}

					if (meetingSession.configuration.credentials.attendeeId == attendeeId) {

						muteButton.style.backgroundColor = "red";
						meetingSession.audioVideo.realtimeMuteLocalAudio();
						console.log("You are muted");

						const textToSend = "Iauro100-Mute-ACK_" + attendeeId + "_" + "MUTE";

						if (!textToSend) {
							return;
						}
						window.meetingSession.audioVideo.realtimeSendDataMessage(
							DATA_MESSAGE_TOPIC,
							textToSend,
							DATA_MESSAGE_LIFETIME_MS
						);

					}
				}
			}
		}
	});
	// console.log("DATA: ",senderExternalUserId);
	// console.log("DATA: ",data);



}

//function to mute and unmute attendee

function attendeeMute(ftr) {
	console.log("veda:-> " + ftr);
	const presentAttendeeId = meetingSession.configuration.credentials.attendeeId;
	console.log("Veda Mute");
	//console.log("Veda Mute -> "+presentAttendeeId);

	// To track mute changes
	meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
		presentAttendeeId,
		(attendeeId, volume, muted, signalStrength) => {
			// A null value for volume, muted and signalStrength field means that it has not changed.
			if (muted === null) {
				// muted state has not changed, ignore volume and signalStrength changes
				return;
			}
			// mute state changed
			console.log(`${attendeeId}'s mute state changed: `, {
				muted, // a boolean
			});
		}
	);

	// To track signal strength changes
	meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
		presentAttendeeId,
		(attendeeId, volume, muted, signalStrength) => {
			// A null value for volume, muted and signalStrength field means that it has not changed.
			if (signalStrength === null) {
				// signalStrength has not changed, ignore volume and muted changes
				return;
			}

			// signal strength changed
			console.log(`${attendeeId}'s signal strength changed: `, {
				signalStrength // 0 (no signal), 0.5 (weak), 1 (strong)
			});
		}
	);
}



function checkIsAttendee(msgString) {

	var res = msgString.split("_");

	var mutesecret = "";
	var attendeeId = "";
	var status = "";

	if (res.length > 0) {
		mutesecret = res[0];
	}

	if (res.length > 1) {
		attendeeId = res[1];
	}

	if (res.length > 2) {
		status = res[2];
	}


	const presentAttendeeId = meetingSession.configuration.credentials.attendeeId;

	console.log("AKSHAY 1122");
	console.log(mutesecret);
	console.log(attendeeId);
	console.log(presentAttendeeId);
	console.log(status);

	if (mutesecret == "Iauro100-Mute-ACK" ) {

	// if (mutesecret == "Iauro100-Mute-ACK" && presentAttendeeId == hostId) {
		console.log("AKSHAY 5555");
		roasterUpdateMute(attendeeId,status);
	}


	if (mutesecret == "Iauro100-Mute-Request" && presentAttendeeId == attendeeId) {
		roasterUpdateMute(presentAttendeeId,"MUTE")
		console.log("AKSHAY TRUE");
		return true;
	} else {

		console.log("AKSHAY FALSE");
		return false;
	}
	
}

//function to mute and unmute attendee

function attendeeMute(ftr) {
	console.log("veda:-> " + ftr);
	const presentAttendeeId = meetingSession.configuration.credentials.attendeeId;
	console.log("Veda Mute");
	//console.log("Veda Mute -> "+presentAttendeeId);

	// To track mute changes
	meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
		presentAttendeeId,
		(attendeeId, volume, muted, signalStrength) => {
			// A null value for volume, muted and signalStrength field means that it has not changed.
			if (muted === null) {
				// muted state has not changed, ignore volume and signalStrength changes
				return;
			}
			// mute state changed
			console.log(`${attendeeId}'s mute state changed: `, {
				muted, // a boolean
			});
		}
	);

	// To track signal strength changes
	meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
		presentAttendeeId,
		(attendeeId, volume, muted, signalStrength) => {
			// A null value for volume, muted and signalStrength field means that it has not changed.
			if (signalStrength === null) {
				// signalStrength has not changed, ignore volume and muted changes
				return;
			}

			// signal strength changed
			console.log(`${attendeeId}'s signal strength changed: `, {
				signalStrength // 0 (no signal), 0.5 (weak), 1 (strong)
			});
		}
	);
}


function test() {
	document.getElementById("before-meeting").style.display = "none";
	document.getElementById("in-meeting").style.display = "block";
}

// add events
window.addEventListener("load", () => {
	console.log("***in load");
	alert("Page Loaded!");
	startButton.addEventListener("click", start);
	// testButton.addEventListener("click", test);
	if (isMeetingHost) {
		presentScreenButton.style.display = "block";
		presentScreenButton.addEventListener("click", presentScreenfunc);

	}
	stopButton.addEventListener("click", stop);
	muteButton.addEventListener("click", mutefunc);
	videoButton.addEventListener("click", videoOnOff);
});

var btnSend = document.getElementById("btn-send");

btnSend.addEventListener("click", handleSendMessage);

const conversationId = '<REPLACE_WITH_CONVERSATION_ID>';

// Append message to chat message wall
function appendMessage(content, sender) {

	if (!content) return;
	var ulMsg = document.getElementById("chat-messages");
	var userName = document.getElementById('userName');
	userName = sender;

	// ulMsg.append('<li class="list-group-item">' + content + '</li>');
	var h5 = document.createElement('h5');
	var li = document.createElement('li');
	h5.appendChild(document.createTextNode(userName));
	li.appendChild(document.createTextNode(content));

	ulMsg.append(h5, li);
}



async function actionVideo() {
	var btnVideoName = document.getElementById("video-button").value;

	var videoElement = document.getElementById("attendee-video");

	// var txtName = document.getElementById("inputName").value;

	// if (txtName.includes("host")) {

	if (isMeetingHost) {
		videoElement = document.getElementById("host-video");

	} else {

		videoElement = document.getElementById("attendee-video");
	}



	if (btnVideoName != "video-start") {

		document.getElementById("video-button").value = "video-start"
		document.getElementById("video-button").innerHTML = "video-start"

		console.log("AKshayStart");
		// const videoElement = document.getElementById("video-list").value;

		// Make sure you have chosen your camera. In this use case, you will choose the first device.
		const videoInputDevices = await window.meetingSession.audioVideo.listVideoInputDevices();

		// The camera LED light will turn on indicating that it is now capturing.
		// See the "Device" section for details.
		await window.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);

		const observer = {
			// videoTileDidUpdate is called whenever a new tile is created or tileState changes.
			videoTileDidUpdate: tileState => {
				// Ignore a tile without attendee ID and other attendee's tile.
				if (!tileState.boundAttendeeId || !tileState.localTile) {
					return;
				}



				window.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
			}
		};
		//pucsd
		//window.meetingSession.audioVideo.addObserver(observer);

		window.meetingSession.audioVideo.startLocalVideoTile();
	} else {

		document.getElementById("video-button").value = "Video-Stop"
		document.getElementById("video-button").innerHTML = "Video-Stop"
		let localTileId = null;
		const observer = {
			videoTileDidUpdate: tileState => {
				// Ignore a tile without attendee ID and other attendee's tile.
				if (!tileState.boundAttendeeId || !tileState.localTile) {
					return;
				}

				console.log(tileState);

				// videoTileDidUpdate is also invoked when you call startLocalVideoTile or tileState changes.
				// The tileState.active can be false in poor Internet connection, when the user paused the video tile, or when the video tile first arrived.
				console.log(`If you called stopLocalVideoTile, ${tileState.active} is false.`);
				window.meetingSession.audioVideo.unbindVideoElement(tileState.tileId, videoElement);
				localTileId = tileState.tileId;
			},
		};

		//window.meetingSession.audioVideo.addObserver(observer);

		window.meetingSession.audioVideo.stopLocalVideoTile();

		// Optional: You can remove the local tile from the session.
		window.meetingSession.audioVideo.removeLocalVideoTile();


	}
}

