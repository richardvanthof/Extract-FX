const addExclusionBtn = document.querySelector('#add-exclusion-btn');
const exclusionsContainer = document.querySelector('.exclusions-container');
let exclCounter = 0;
let effectsList = "Color Balance (RGB),Color Replace,Gamma Correction,Extract,Color Pass,Lens Distortion,Solarize,Convolution Kernel,Levels,MPEG Source Settings,Turbulent Displace,Gradient Wipe,Ultra Key,Vector Motion,Linear Wipe,Twirl,Alpha Adjust,VR Plane to Sphere,Radial Wipe,Change to Color,RGB Curves,Echo,Ramp,Sony Raw Source Settings,Non Red Key,Lighting Effects,Eight-Point Garbage Matte,Color Balance (HLS),Vertical Flip,Broadcast Colors,Wave Warp,Venetian Blinds,Lumetri Color,Bevel Edges,Auto Levels,VR Blur,PRORES RAW Source Settings,Equalize,Shape,Checkerboard,Block Dissolve,Unsharp Mask,VR Glow,Median (Legacy),Set Matte,Set Matte,Auto Color,Spherize,Directional Blur,Difference Matte,Mirror,Noise,Noise,Roughen Edges,Bevel Alpha,Auto Contrast,Luma Corrector,Magnify,Compound Blur,VR Rotate Sphere,Pixel Motion Blur,Rolling Shutter Repair,Timewarp,Three-Way Color Corrector,Clip Name,Arithmetic,Paint Bucket,Fast Blur,Reduce Interlace Flicker,Sixteen-Point Garbage Matte,Replicate,Noise HLS Auto,Noise HLS Auto,Channel Mixer,Motion,MXF/ARRIRAW Development Settings,Alpha Glow,Cineon Converter,Posterize,Transform,Transform,Offset,Canon Cinema RAW Light Source Settings,Fast Color Corrector,ASC CDL,Text,Lightning,Gaussian Blur,Noise HLS,Noise HLS,Color Emboss,ProcAmp,Video Limiter,Black & White,Change Color,Calculations,Remove Matte,Emboss,Grid,Cineon Source Settings,Crop,VR Color Gradients,Circle,Mask2,RGB Color Corrector,RED Source Settings,Find Edges,Tint,Cell Pattern,VR De-Noise,Leave Color,Opacity,Posterize Time,Video Limiter (legacy),Lens Flare,SDR Conform,Eyedropper Fill,Luma Key,Sony RAW MXF Source Settings,Shadow/Highlight,Mask,Sharpen,Brightness & Contrast,Metadata & Timecode Burn-in,Corner Pin,Ellipse,Basic 3D,Drop Shadow,Horizontal Flip,Mosaic,4-Color Gradient,Timecode,Threshold,Threshold,Write-on,Four-Point Garbage Matte,VR Fractal Noise,Strobe Light,Radial Shadow,VR Sharpen,VR Digital Glitch,Color Key,Color Balance,Brush Strokes,CinemaDNG Source Settings,Warp Stabilizer,VR Chromatic Aberrations,Channel Blur,VR Projection,Color Space Transform,Solid Composite,Luma Curve,Dust & Scratches,Simple Text,Track Matte Key,Image Matte Key,Noise Alpha,Noise Alpha,Auto Reframe,Group,Compound Arithmetic,Edge Feather,Invert,ARRIRAW Development Settings,Blend,Texturize".split(',');

function togglePlaceholder() {
  if (exclusionsContainer.children.length <= 0) {
      exclusionsContainer.innerHTML = '<div class="exclusions-placeholder"><p>No exclusions were added.</p></div>';
  }
}

const updateCounter = (amount) => {
  exclCounter += amount;
  // console.log(exclCounter);
  const header = document.querySelector('#exclusion-header');
  if (exclCounter > 0) {
      header.innerHTML = `Exclude effects (${exclCounter})`
  } else {
      header.innerHTML = `Exclude effects`;
  }
}

const addExclusion = (list: string[], value?: string) => {
  let effectsList = list.filter(e => e !== value) // Select duplicate effect when it's already pres-selected
  updateCounter(1)
  const placeholder = document.querySelector('.exclusions-placeholder');
  if(placeholder) {
      placeholder.remove();
  }

  let node = document.createElement("div");
  let rmBtn = document.createElement('button');
  let selectElem = document.createElement('select');

  
  rmBtn.classList.add('remove-exclusion');
  rmBtn.innerHTML = 'x';

  node.classList.add('exclusion')

  let selectOption = document.createElement("option");
  selectOption.value = value || null;  // Set the value attribute
  selectOption.textContent = value || 'Select effect...';  // Set the visible text
  selectElem.appendChild(selectOption);  // Add the option to the select element
  selectElem.classList.add('exclusion-dropdown')

  effectsList.forEach((effectOption) => {
      let optionElement = document.createElement("option");
      optionElement.value = effectOption;  // Set the value attribute
      optionElement.textContent = effectOption;  // Set the visible text
      selectElem.appendChild(optionElement);  // Add the option to the select element
  })
  
  rmBtn.addEventListener('click', e => {
      e.preventDefault();
      e.srcElement.parentElement.remove();
      updateCounter(-1);
      togglePlaceholder()
  })

  node.appendChild(selectElem)
  node.appendChild(rmBtn)

  exclusionsContainer.appendChild(node);
};

  
const removeExclusionBtn = document.querySelectorAll('.remove-exclusion')
const removeAllExclusions = document.querySelector('#remove-all-exclusions-btn');

const setExclusionOptions = (options: string[]) => effectsList = options; //set effect exclusion options.

removeAllExclusions.addEventListener('click', e => {

  e.preventDefault();
  exclusionsContainer.innerHTML = '';
  updateCounter(-exclCounter);
  togglePlaceholder();

})

addExclusionBtn.addEventListener("click", e => {
  e.preventDefault()
  addExclusion(effectsList.sort(), undefined);
})

togglePlaceholder()





