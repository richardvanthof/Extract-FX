const debug = false

function showLoadingScreen(active: boolean) {
  if(active) {
      document.querySelectorAll('#progress, #progress-caption, #cancel-btn').forEach(e => e.classList.remove('hide'));
      document.querySelectorAll('.navbar, .start-view, #ingest-btn, #extract-btn, #help-btn').forEach(e => e.classList.add('hide'));
  } else {
      document.querySelectorAll('#progress, #progress-caption, #cancel-btn').forEach(e => e.classList.add('hide'));
      document.querySelectorAll('.navbar, .start-view, #ingest-btn, #extract-btn, #help-btn').forEach(e => e.classList.remove('hide'));
  }
};

function setLoadingCaption(message) {
  document.querySelector('#progress-caption').innerHTML = message;
}

function handleCallback(data: any) {
  showLoadingScreen(false);
  if(data != true) {console.log(data)}
}