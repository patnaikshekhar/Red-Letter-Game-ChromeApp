chrome.app.runtime.onLaunched.addListener(function () {
  chrome.app.window.create('../html/main.html', {
    "bounds": {
      "width": 800,
      "height": 590
    },
    "resizable": true,
    "frame": "none"
  });
});
