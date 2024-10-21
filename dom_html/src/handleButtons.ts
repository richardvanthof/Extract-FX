const openHelp = () => {
  var csInterface = new CSInterface();
  var OSVersion   = csInterface.getOSInformation();
  
  var path = "file:///Library/Application Support/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/manual.html";
  
  if (OSVersion.indexOf("Windows") >=0){
          var path = "file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/space.therichard.ExtractFX/payloads/manual.html"
  }
  csInterface.openURLInDefaultBrowser(path);	
}

const switchSelection = (event: Event, parentElem: HTMLElement) => {
  const allOptions = Array.from(parentElem.children) as HTMLElement[];  // Convert HTMLCollection to Array
  
  // Remove 'active' class from all options
  allOptions.forEach(option => option.classList.remove('active'));
  
  // Add 'active' class to the clicked element
  const target = event.currentTarget as HTMLElement;
  target.classList.add('active');
};

(()=>{
  // Open help page in default browser
  const helpBtn:HTMLElement = document.querySelector('#help-btn');
  
  helpBtn.addEventListener("click", e => {
    e.preventDefault();
    openHelp();
  })  

  // Handle extraction destination selector
  const switchInput = document.querySelector('.switch-input') as HTMLElement; // Assuming this is a container for options
    
  if (switchInput) {
      const switchOptions = Array.from(switchInput.children) as HTMLElement[];  // Convert HTMLCollection to Array
  
      // Add event listeners to each switch option
      switchOptions.forEach(option => {
          option.addEventListener('click', e => switchSelection(e, switchInput));
      });
  }

})()