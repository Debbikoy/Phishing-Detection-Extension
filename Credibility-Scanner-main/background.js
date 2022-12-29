var myNotificationID = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request) {
    if (request.msg == "Features") {
      let data = request.data
      url = 'http://127.0.0.1:5000/predict' 
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          
          chrome.notifications.create('test', {
            type: 'basic',
            iconUrl: 'icons/scan-32.png',
            title: 'Hey there',
            message: 'This website is likely  ' + res.status ,
            priority: 2,
            buttons: [{
              title: "Learn More About This. ",
              iconUrl: "icons/scan-32.png"
          }]

        }, function(id) {
          myNotificationID = id;
      });
        console.log("done!")

          sendResponse({
            sender: "background.js",
            data: {data: data },
          }); // This response is sent to the message's sender
      })
 

    }
  }
});


/* Respond to the user's clicking one of the buttons */
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === myNotificationID) {
        if (btnIdx === 0) {
          var newURL = "https://www.google.com/search?q=learn+more+about+legitimate+and+phishing+sites&sxsrf=ALiCzsYl0BwosyywtKIisc2es82CfMhX5g%3A1661896976216&ei=EIkOY7_uDM2P8gLawbr4Cg&ved=0ahUKEwi_tq7XyO_5AhXNh1wKHdqgDq8Q4dUDCA4&uact=5&oq=learn+more+about+legitimate+and+phishing+sites&gs_lcp=Cgdnd3Mtd2l6EAM6BwgjELACECc6BAghEApKBAhBGABKBAhGGABQAFj4KGDmLmgAcAF4AIABjAGIAekNkgEENi4xMZgBAKABAcABAQ&sclient=gws-wiz";
          chrome.tabs.create({ url: newURL });
      } else if (btnIdx === 1) {
            saySorry();
        }
    }
});