const e=document.querySelector("#source-file"),o=e=>{let o=[];for(let l of e)for(let e in l)o.includes(e)||o.push(e);return o};let l=null,t=null;const r=e=>{let r=new FileReader;r.onload=e=>{try{if(l=JSON.parse(e.target.result)){if(Array.isArray(l.clips)?t=o(l.clips):console.warn("No valid 'clips' array found in source data."),Array.isArray(l.exclusions)){let e=l.exclusions;setExclusionOptions(t),removeAllExclusions(),e.forEach(e=>{console.log(e),addExclusion(t,e)})}else console.warn("No valid 'exclusions' array found in source data.")}console.log(l,l.exclusions,t)}catch(e){console.error("Error parsing JSON file:",e)}},r.readAsText(e)},n=(e,o,l)=>{try{let t=new CSInterface;showLoadingScreen(!0),setLoadingCaption("Initiating...");let r=[];if(l.forEach((e,o)=>{null!=e.value&&r.push(e.value),setLoadingCaption(`Fetching effect exclusion ${o}/${l.length}}`)}),console.log(o),console.log(l),console.log(r),!o)throw"TargetTrack is undefined";if(!r)throw"Effect exclusions are undefined.";let n=JSON.stringify({exclusions:r,sourceData:e,targetTrack:o});console.log(n);let s=`$._PPP_.restoreEffectsToClips('${n}')`;setLoadingCaption("Restoring clip effects..."),t.evalScript(s,handleCallback)}catch(e){throw Error(e)}},e=document.querySelector("#source-file"),s=document.querySelector("#ingest-btn");e.addEventListener("change",e=>{console.log("file changed.");let o=e.target.files[0];o?r(o):console.warn("No file selected.")}),s.addEventListener("click",e=>{e.preventDefault();let o=document.querySelectorAll(".exclusion-dropdown"),t=document.querySelector("#target-track").value;l?n(l,t,o):alert("Please select a source file.")});
//# sourceMappingURL=ingest.a397209e.js.map