

var vids = $("video"); 
$.each(vids, function(){
       this.controls = false; 
}); 


$("video").click(function() {
  
  videoPlaying = true;
  if (this.paused) {
    this.play();
    this.controls = true;
    
  } else {
  this.pause();
  this.controls = false;
  }

});



// остановить все видосы , кроме текущего 

$(document).ready(function(e) {
  $('audio,video').bind('play', function() {
  activated = this;
  $('audio,video').each(function() {
      if(this != activated) this.pause();
  });
});


//flash - prevent simultaneous video playback - pauses other playing videos upon play
$("video").click(function(){
  activated = this;
  $('video').each(function() {
      if(this != activated) ($(this).attr("id")).pause();
  
  });
});
});

const wrapObj = document.querySelector('.feedback__video__item');
wrapObj.onclick=function(e){
  for(let i = 0;i<wrapObj.children.length;i++){
    wrapObj.children[i].classList.remove('video-active');
  }

  e.target.classList.add('active');
  
}


