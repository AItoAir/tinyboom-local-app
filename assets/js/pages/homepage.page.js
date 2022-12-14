parasails.registerPage('homepage', {
  data: {
    isWebcamStreaming: false,
    webcam1: null,
    webcamList: null,
    selectedWebcam: null,
    webcamInterval: null,
    threshold: 0.5,
    inferenceResult: [],
    isWebcamInferencing: false
  },

  beforeMount: function() {
    //…
  },
  mounted: async function(){
    await Cloud.listenInferenceResult();
    await this.startWebcamImageStream();
    const localThis = this;
    Cloud.on('inference', (data) => {
      console.log('inferenceData:', data);
      localThis.inferenceResult = data.data;
    });
  },

  methods: {
    snooze (ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      })
    },
    async startWebcamImageStream() {
      this.isWebcamStreaming = true;
      await this.snooze(100);
      const webcamElement1 = document.getElementById('webcam1');
      const canvasElement1 = document.getElementById('canvas1');
      this.webcam1 = new Webcam(webcamElement1, 'user', canvasElement1);
      const localThis = this;
      const localWebcam = this.webcam1;
      this.webcam1.start().then(result =>{
        console.log("webcam1 started");
        localThis.selectedWebcam = localWebcam.webcamList[0] ? localWebcam.webcamList[0].deviceId: null;
        localThis.webcamList = localWebcam.webcamList;
        console.log("this.webcam.webcamList", localWebcam.webcamList, localThis.selectedWebcam);
      }).catch(err => { console.log(err); });
    },
    async doInference (picture) {
      const cleanedImageData = picture.replace("data:image/jpeg;base64,", "");
      // console.log(`doInference`, cleanedImageData);
      await Cloud.sendImageData(cleanedImageData);
    },
    changeSelectedWebcam () {
      if (this.selectedWebcam) {
        console.log("this.selectedWebcamm", this.selectedWebcam);
        this.webcam1.selectedDeviceId = this.selectedWebcam;
        this.webcam1.start().then(result =>{
          console.log("webcam1 started");
        }).catch(err => {
          console.log(err);
        });
      }
    },
    startInference() {
      this.isWebcamInferencing = true;
      const localThis = this;
      const localWebcam = this.webcam1;
      this.webcamInterval = setInterval(async function() {
        const picture = localWebcam.snap('image/jpeg');
        await localThis.doInference(picture);
      }, 500);
    },
    stopInference() {
      clearInterval(this.webcamInterval);
      this.inferenceResult = [];
      this.isWebcamInferencing = false;
    }
  }

});
